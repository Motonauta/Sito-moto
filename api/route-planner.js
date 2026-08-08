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

  const params = new URLSearchParams();
  const wantSteps = steps === '1';
  params.set('overview', wantSteps ? 'full' : 'false');
  if (wantSteps) {
    params.set('geometries', 'geojson');
    params.set('steps', 'true');
  }
  if (exclude) params.set('exclude', exclude);

  const url = `https://router.project-osrm.org/route/v1/driving/${encodeURIComponent(startLon)},${encodeURIComponent(startLat)};${encodeURIComponent(endLon)},${encodeURIComponent(endLat)}?${params.toString()}`;
  const r = await fetch(url);
  const data = await r.json();
  res.status(200).json(data);
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
