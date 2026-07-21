const cloudinary = require('cloudinary').v2;

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
    const { password, album } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Password errata' });
    }
    if (!album) {
      return res.status(400).json({ error: 'Manca il parametro album' });
    }

    await cloudinary.api.delete_resources_by_prefix(`${album}/`);
    try {
      await cloudinary.api.delete_folder(album);
    } catch (e) {
      // la cartella potrebbe non esistere più come oggetto separato, non è un errore bloccante
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
