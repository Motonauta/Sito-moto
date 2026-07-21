const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  try {
    const { album } = req.query;
    if (!album) {
      return res.status(400).json({ error: 'Manca il parametro album' });
    }

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${album}/`,
      max_results: 200,
    });

    res.status(200).json({ resources: result.resources });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
