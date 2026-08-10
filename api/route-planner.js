const NOMINATIM_UA = 'IlMotonautaSito/1.0 (sito personale motociclistico)';

async function searchPlace(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Manca il parametro q' });

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=0&limit=5&countrycodes=it&accept-language=it`;
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
  const { startLat, startLon, endLat, endLon, steps, exclude } = req.query;
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
    return res.status(400).json({ error: 'Azione non valida' });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Servizio esterno non raggiungibile, riprova più tardi.' });
  }
};
