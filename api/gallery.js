const cloudinary = require('cloudinary').v2;
const { isAuthenticated } = require('../lib/auth');
const { getRedisClient } = require('../lib/redis');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function handleList(req, res) {
  try {
    const folderResult = await cloudinary.api.root_folders();
    const albums = folderResult.folders.map(f => f.name);

    const data = {};
    for (const album of albums) {
      const [imageResult, videoResult] = await Promise.all([
        cloudinary.api.resources({
          type: 'upload',
          resource_type: 'image',
          prefix: `${album}/`,
          max_results: 200,
          context: true,
        }),
        cloudinary.api.resources({
          type: 'upload',
          resource_type: 'video',
          prefix: `${album}/`,
          max_results: 200,
          context: true,
        }),
      ]);

      const images = imageResult.resources.map(r => ({
        url: r.secure_url,
        caption: (r.context && r.context.custom && r.context.custom.caption) || album,
        type: 'image',
      }));
      const videos = videoResult.resources.map(r => ({
        url: r.secure_url,
        caption: (r.context && r.context.custom && r.context.custom.caption) || album,
        type: 'video',
      }));

      data[album] = [...images, ...videos];
    }

    res.status(200).json({ albums: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

async function handleListAdmin(req, res) {
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
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

async function handlePins(req, res) {
  try {
    const redis = await getRedisClient();
    const raw = await redis.hGetAll('map_pins');
    const pins = raw
      ? Object.values(raw).map((value) => (typeof value === 'string' ? JSON.parse(value) : value))
      : [];

    res.status(200).json({ pins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

async function handleDeletePhoto(req, res) {
  try {
    const { publicId, resourceType } = req.body;

    if (!(await isAuthenticated(req))) {
      return res.status(401).json({ error: 'Password errata' });
    }
    if (!publicId) {
      return res.status(400).json({ error: 'Manca publicId' });
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || 'image',
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

async function handleDeleteAlbum(req, res) {
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
}

async function handleSignUpload(req, res) {
  try {
    const { folder, tags, context } = req.body;
    if (!(await isAuthenticated(req))) {
      return res.status(401).json({ error: 'Password errata' });
    }
    if (!folder) {
      return res.status(400).json({ error: 'Manca il parametro folder' });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { folder, tags: tags || '', context: context || '', timestamp };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

    res.status(200).json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

async function handleCreatePin(req, res) {
  try {
    const { albumName, filtro } = req.body;
    if (!(await isAuthenticated(req))) {
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
}

// Un solo file multiplexato via ?action= (stesso schema di auth.js e km.js) per
// restare sotto il limite di 12 funzioni serverless del piano Vercel Hobby:
// prima erano 7 file separati (gallery, list-photos, delete-photo, delete-album,
// sign-upload, create-pin, map-pins), ora è uno solo.
module.exports = async (req, res) => {
  const action = (req.query && req.query.action) || 'list';

  if (action === 'list') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Metodo non consentito' });
    return handleList(req, res);
  }
  if (action === 'list-admin') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Metodo non consentito' });
    return handleListAdmin(req, res);
  }
  if (action === 'pins') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Metodo non consentito' });
    return handlePins(req, res);
  }
  if (action === 'delete-photo') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
    return handleDeletePhoto(req, res);
  }
  if (action === 'delete-album') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
    return handleDeleteAlbum(req, res);
  }
  if (action === 'sign-upload') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
    return handleSignUpload(req, res);
  }
  if (action === 'create-pin') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
    return handleCreatePin(req, res);
  }
  return res.status(400).json({ error: 'Azione non riconosciuta' });
};
