const { getRedisClient } = require('../lib/redis');

const NOMINATIM_UA = 'IlMotonautaSito/1.0 (sito personale motociclistico)';
const FUEL_PRICE_CACHE_KEY = 'mimit_fuel_prices_v1';
const FUEL_PRICE_CACHE_TTL = 3600; // 1 ora: i prezzi ufficiali cambiano poche volte al giorno

function haversineKmServer(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// I CSV pubblici del Ministero delle Imprese hanno spesso una prima riga di
// intestazione "tecnica" (es. data di estrazione) prima della vera riga di
// colonne: qui si cerca la riga con "idimpianto" per essere resistenti a
// piccole variazioni di formato.
function parseMimitCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  let headerIdx = lines.findIndex(l => l.toLowerCase().includes('idimpianto'));
  if (headerIdx === -1) headerIdx = 0;
  const header = lines[headerIdx].split(';').map(h => h.trim().toLowerCase());
  const rows = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cols = lines[i].split(';');
    if (cols.length < 2) continue;
    const row = {};
    header.forEach((h, idx) => { row[h] = (cols[idx] || '').trim(); });
    rows.push(row);
  }
  return rows;
}

// Scarica e unisce anagrafica impianti + prezzi (dati aperti MIMIT), tenuti
// in cache su Redis per non riscaricare/riparsare due elenchi nazionali ad
// ogni singola ricerca di un distributore lungo il percorso.
async function loadFuelPriceIndex() {
  const redis = await getRedisClient();
  const cached = await redis.get(FUEL_PRICE_CACHE_KEY);
  if (cached) return JSON.parse(cached);

  const [anagraficaRes, prezziRes] = await Promise.all([
    fetch('https://www.mimit.gov.it/images/exportCSV/anagrafica_impianti_attivi.csv'),
    fetch('https://www.mimit.gov.it/images/exportCSV/prezzo_alle_8.csv')
  ]);
  const [anagraficaText, prezziText] = await Promise.all([anagraficaRes.text(), prezziRes.text()]);

  const stations = {};
  for (const row of parseMimitCSV(anagraficaText)) {
    const id = row['idimpianto'];
    if (!id) continue;
    const lat = parseFloat((row['lat'] || row['latitudine'] || '').replace(',', '.'));
    const lon = parseFloat((row['lng'] || row['long'] || row['longitudine'] || '').replace(',', '.'));
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    stations[id] = { lat, lon, brand: row['bandiera'] || row['gestore'] || null };
  }

  const prices = {};
  for (const row of parseMimitCSV(prezziText)) {
    const id = row['idimpianto'];
    if (!id) continue;
    const desc = (row['desccarburante'] || '').toLowerCase();
    if (!desc.includes('benzina')) continue; // per la moto interessa la benzina, non il gasolio
    const prezzo = parseFloat((row['prezzo'] || '').replace(',', '.'));
    if (!Number.isFinite(prezzo)) continue;
    // se per lo stesso impianto ci sono più righe benzina (self/servito), tiene la più economica
    if (!prices[id] || prezzo < prices[id].prezzo) {
      prices[id] = { prezzo, data: row['dtcomu'] || row['data'] || null };
    }
  }

  const index = [];
  for (const id in stations) {
    const st = stations[id];
    const p = prices[id];
    if (p) index.push({ lat: st.lat, lon: st.lon, prezzo: p.prezzo, aggiornato: p.data });
  }

  await redis.set(FUEL_PRICE_CACHE_KEY, JSON.stringify(index), { EX: FUEL_PRICE_CACHE_TTL });
  return index;
}

async function searchPlace(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Manca il parametro q' });

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=0&limit=5&accept-language=it`;
  const r = await fetch(url, { headers: { 'User-Agent': NOMINATIM_UA } });
  const data = await r.json();
  res.status(200).json(data);
}

async function reversePlace(req, res) {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Mancano lat/lon' });

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=json&zoom=12&accept-language=it`;
  const r = await fetch(url, { headers: { 'User-Agent': NOMINATIM_UA } });
  const data = await r.json();
  res.status(200).json(data);
}

async function computeRoute(req, res) {
  const { startLat, startLon, endLat, endLon, steps, exclude, coords } = req.query;

  // Percorso con più tappe (Assistente di rotta): coords è una lista di
  // "lat,lon" separati da ";" nell'ordine in cui vanno visitati. OSRM supporta
  // nativamente più waypoint nello stesso URL e restituisce già i dati
  // (distanza/durata) divisi per ogni singola tratta in route.legs[].
  if (coords) {
    return await computeMultiStopRoute(req, res, { coords, steps });
  }

  if (!startLat || !startLon || !endLat || !endLon) {
    return res.status(400).json({ error: 'Mancano le coordinate' });
  }

  // Il router OSRM pubblico che usiamo per il percorso normale non supporta
  // l'esclusione delle autostrade (risponde sempre "Exclude flag combination
  // is not supported", qualunque sia la tratta): per "senza autostrade"
  // usiamo quindi un router pubblico diverso, Valhalla, che la supporta
  // nativamente. La risposta viene tradotta nello stesso formato di OSRM così
  // il resto del codice non deve sapere quale dei due ha risposto.
  if (exclude === 'motorway') {
    return await computeRouteAvoidHighways(req, res, { startLat, startLon, endLat, endLon, steps });
  }

  const params = new URLSearchParams();
  const wantSteps = steps === '1';
  params.set('overview', wantSteps ? 'full' : 'false');
  if (wantSteps) {
    params.set('geometries', 'geojson');
    params.set('steps', 'true');
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${encodeURIComponent(startLon)},${encodeURIComponent(startLat)};${encodeURIComponent(endLon)},${encodeURIComponent(endLat)}?${params.toString()}`;
  const r = await fetch(url);
  const data = await r.json();
  res.status(200).json(data);
}

async function computeMultiStopRoute(req, res, { coords, steps }) {
  const points = coords.split(';').map(p => {
    const [lat, lon] = p.split(',').map(Number);
    return { lat, lon };
  }).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lon));

  if (points.length < 2) {
    // stesso formato { code, message } degli altri errori gestiti da questo
    // endpoint, così il client mostra il motivo vero invece di un messaggio
    // generico (utile qui perché "punti insufficienti" può indicare un bug
    // nel parsing delle coordinate ricevute, non solo un input mancante)
    return res.status(200).json({
      code: 'InvalidPoints',
      message: `Servono almeno 2 punti validi (ricevuti: ${points.length} su ${coords.split(';').length} coordinate passate).`
    });
  }

  const params = new URLSearchParams();
  const wantSteps = steps === '1';
  params.set('overview', wantSteps ? 'full' : 'false');
  if (wantSteps) {
    params.set('geometries', 'geojson');
    params.set('steps', 'true');
  }

  const coordStr = points.map(p => `${p.lon},${p.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?${params.toString()}`;
  const r = await fetch(url);
  const data = await r.json();
  res.status(200).json(data);
}

// Cerca il distributore di benzina/Autogrill reale più vicino a un punto
// (dati OpenStreetMap, tag amenity=fuel) entro un certo raggio, per far
// corrispondere le tappe "ogni tot km" a una sosta vera invece che a un
// punto a caso sulla strada — e ci abbina, quando possibile, il prezzo
// benzina ufficiale più recente (dati aperti MIMIT), cercando l'impianto
// più vicino nell'anagrafica ufficiale entro poche centinaia di metri dal
// distributore trovato su OpenStreetMap (le due banche dati non condividono
// un id comune, si incrociano per posizione).
async function findFuelNear(req, res) {
  const { lat, lon, radius } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Mancano lat/lon' });
  const r = Math.min(Math.max(Number(radius) || 5000, 500), 17000);
  const latN = Number(lat), lonN = Number(lon);

  const query = `[out:json][timeout:20];(node["amenity"="fuel"](around:${r},${lat},${lon});way["amenity"="fuel"](around:${r},${lat},${lon}););out center 10;`;
  const resp = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, {
    headers: { 'User-Agent': NOMINATIM_UA }
  });
  const data = await resp.json();
  const elements = data.elements || [];

  let best = null, bestDist = Infinity;
  for (const el of elements) {
    const elLat = el.lat != null ? el.lat : (el.center && el.center.lat);
    const elLon = el.lon != null ? el.lon : (el.center && el.center.lon);
    if (elLat == null || elLon == null) continue;
    const dist = haversineKmServer(latN, lonN, elLat, elLon);
    if (dist < bestDist) {
      bestDist = dist;
      const tags = el.tags || {};
      best = { lat: elLat, lon: elLon, name: tags.brand || tags.name || 'Distributore' };
    }
  }

  if (!best) return res.status(200).json({ found: false });

  try {
    const priceIndex = await loadFuelPriceIndex();
    let priceMatch = null, priceMatchDist = Infinity;
    for (const entry of priceIndex) {
      const d = haversineKmServer(best.lat, best.lon, entry.lat, entry.lon);
      if (d < priceMatchDist) { priceMatchDist = d; priceMatch = entry; }
    }
    // entro 300 m si considera lo stesso impianto fisico
    if (priceMatch && priceMatchDist <= 0.3) {
      best.prezzo = priceMatch.prezzo;
      best.prezzoAggiornato = priceMatch.aggiornato;
    }
  } catch (err) {
    console.error('Prezzo carburante non disponibile:', err);
    // il distributore resta comunque valido anche senza prezzo abbinato
  }

  res.status(200).json({ found: true, station: best });
}

async function computeRouteAvoidHighways(req, res, { startLat, startLon, endLat, endLon, steps }) {
  const wantSteps = steps === '1';
  const body = {
    locations: [
      { lat: Number(startLat), lon: Number(startLon) },
      { lat: Number(endLat), lon: Number(endLon) }
    ],
    costing: 'auto',
    costing_options: { auto: { use_highways: 0.0, use_tolls: 0.0 } },
    units: 'kilometers'
  };

  const r = await fetch('https://valhalla1.openstreetmap.de/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': NOMINATIM_UA },
    body: JSON.stringify(body)
  });
  const data = await r.json();

  const leg = data.trip && data.trip.legs && data.trip.legs[0];
  if (!leg || data.trip.status !== 0) {
    return res.status(200).json({
      code: 'NoRoute',
      message: data.error || 'Nessun percorso trovato evitando le autostrade.'
    });
  }

  res.status(200).json({
    code: 'Ok',
    routes: [{
      distance: data.trip.summary.length * 1000, // km -> metri, come OSRM
      duration: data.trip.summary.time,
      geometry: { type: 'LineString', coordinates: wantSteps ? decodePolyline6(leg.shape) : [] },
      legs: [{ steps: [] }]
    }]
  });
}

// Decodifica una polyline Valhalla (precisione 6) in coordinate [lon, lat],
// stesso formato GeoJSON usato dalla geometria di OSRM
function decodePolyline6(str) {
  let index = 0, lat = 0, lon = 0;
  const factor = 1e6;
  const coordinates = [];
  while (index < str.length) {
    let shift = 0, result = 0, byte;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);

    shift = 0; result = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lon += (result & 1) ? ~(result >> 1) : (result >> 1);

    coordinates.push([lon / factor, lat / factor]);
  }
  return coordinates;
}

// Proxy pubblico e in sola lettura verso Nominatim (ricerca/geocodifica luoghi)
// e OSRM (calcolo percorso stradale). Serve a bypassare i limiti CORS dei
// due servizi quando vengono chiamati direttamente dal browser (Nominatim è
// già usato lato server per gli stessi motivi in create-pin.js), e a
// impostare uno User-Agent identificativo come richiesto dalla policy d'uso
// di Nominatim. Nessun dato sensibile: non serve autenticazione.
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const { action } = req.query;
    if (action === 'search') return await searchPlace(req, res);
    if (action === 'reverse') return await reversePlace(req, res);
    if (action === 'route') return await computeRoute(req, res);
    if (action === 'fuel-near') return await findFuelNear(req, res);
    return res.status(400).json({ error: 'Azione non valida' });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Servizio esterno non raggiungibile, riprova più tardi.' });
  }
};
