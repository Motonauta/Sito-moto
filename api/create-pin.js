const { getRedisClient } = require('../lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const { password, albumName, filtro } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Password errata' });
    }
    if (!albumName || !filtro) {
      return res.status(400).json({ error: 'Mancano albumName o filtro' });
    }

    // cerca le coordinate del luogo tramite Nominatim (OpenStreetMap, gratuito)
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(albumName)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'IlMotonautaSito/1.0 (sito personale motociclistico)' } }
    );
    const results = await geoRes.json();

    if (!results || !results.length) {
      return res.status(404).json({ error: `Non ho trovato "${albumName}" sulla mappa. Aggiungilo a mano se vuoi il pin.` });
    }

    const lat = parseFloat(results[0].lat);
    const lng = parseFloat(results[0].lon);

    const redis = await getRedisClient();
    await redis.hSet('map_pins', filtro, JSON.stringify({ nome: albumName, filtro, lat, lng }));

    res.status(200).json({ success: true, lat, lng });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
};
