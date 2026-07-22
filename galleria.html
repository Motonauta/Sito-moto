const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  try {
    const folderResult = await cloudinary.api.root_folders();
    const albums = folderResult.folders.map(f => f.name);

    const data = {};
    for (const album of albums) {
      const resResult = await cloudinary.api.resources({
        type: 'upload',
        prefix: `${album}/`,
        max_results: 200,
        context: true,
      });
      data[album] = resResult.resources.map(r => ({
        url: r.secure_url,
        caption: (r.context && r.context.custom && r.context.custom.caption) || album,
      }));
    }

    res.status(200).json({ albums: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
