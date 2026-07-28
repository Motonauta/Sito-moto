const cloudinary = require('cloudinary').v2;
const { isAuthenticated } = require('../lib/auth');
const { getRedisClient } = require('../lib/redis');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }
  try {
    const { album } = req.body;

    if (!(await isAuthenticated(req))) {
      return res.status(401).json({ error: 'Password errata' });
    }
    if (!album) {
      return res.status(400).json({ error: 'Manca il parametro album' });
    }

    await cloudinary.api.delete_resources_by_prefix(`${album}/`, { resource_type: 'image' });
    await cloudinary.api.delete_resources_by_prefix(`${album}/`, { resource_type: 'video' });
    try {
      await cloudinary.api.delete_folder(album);
    } catch (e) {
      // la cartella potrebbe non esistere più come oggetto separato, non è un errore bloccante
    }

    // rimuove anche il pin dalla mappa, se presente
    try {
      const redis = await getRedisClient();
      await redis.hDel('map_pins', album);
    } catch (e) {
      // se non riesce a rimuovere il pin non blocchiamo comunque l'eliminazione dell'album
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
};
