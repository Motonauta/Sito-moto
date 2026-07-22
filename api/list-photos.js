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

    const [imageResult, videoResult] = await Promise.all([
      cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
        prefix: `${album}/`,
        max_results: 200,
      }),
      cloudinary.api.resources({
        type: 'upload',
        resource_type: 'video',
        prefix: `${album}/`,
        max_results: 200,
      }),
    ]);

    const resources = [
      ...imageResult.resources.map(r => ({ ...r, resource_type: 'image' })),
      ...videoResult.resources.map(r => ({ ...r, resource_type: 'video' })),
    ];

    res.status(200).json({ resources });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
