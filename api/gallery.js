const cloudinary = require('cloudinary').v2;
const { isAuthenticated } = require('../lib/auth');
const { getRedisClient } = require('../lib/redis');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// album che esistono su Cloudinary solo come "magazzino" di foto per altre
// sezioni del sito (es. le immagini degli articoli del Manuale di bordo) e
// non devono comparire come categoria filtrabile nella Galleria pubblica;
// restano comunque visibili nell'area riservata per poterle gestire
const HIDDEN_FROM_PUBLIC_GALLERY = ['manuale di bordo'];

// scopre la struttura degli album su Cloudinary: le cartelle di primo
// livello che hanno sotto-cartelle sono trattate come "Paesi" (con le
// sotto-cartelle come "Città"), quelle senza sotto-cartelle come album
// "standalone" (la vecchia organizzazione piatta, prima di questa funzione)
async function discoverStructure() {
  const rootResult = await cloudinary.api.root_folders();
  const rootNames = rootResult.folders.map(f => f.name);

  const countries = {};
  const standalone = [];

  await Promise.all(rootNames.map(async (name) => {
    let subNames = [];
    try {
      const subResult = await cloudinary.api.sub_folders(name);
      subNames = (subResult.folders || []).map(f => f.name);
    } catch (e) {
      subNames = [];
    }
    if (subNames.length > 0) {
      countries[name] = subNames;
    } else {
      standalone.push(name);
    }
  }));

  return { countries, standalone };
}

async function fetchFolderPhotos(prefix, fallbackCaption) {
  const [imageResult, videoResult] = await Promise.all([
    cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: `${prefix}/`,
      max_results: 200,
      context: true,
    }),
    cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      prefix: `${prefix}/`,
      max_results: 200,
      context: true,
    }),
  ]);

  const images = imageResult.resources.map(r => ({
    url: r.secure_url,
    caption: (r.context && r.context.custom && r.context.custom.caption) || fallbackCaption,
    type: 'image',
  }));
  const videos = videoResult.resources.map(r => ({
    url: r.secure_url,
    caption: (r.context && r.context.custom && r.context.custom.caption) || fallbackCaption,
    type: 'video',
  }));

  return [...images, ...videos];
}

async function handleList(req, res) {
  try {
    const isAdmin = await isAuthenticated(req);
    const { countries, standalone } = await discoverStructure();

    const countriesData = {};
    for (const [paese, cittaList] of Object.entries(countries)) {
      if (!isAdmin && HIDDEN_FROM_PUBLIC_GALLERY.includes(paese.toLowerCase())) continue;
      const cittaData = {};
      for (const citta of cittaList) {
        const photos = await fetchFolderPhotos(`${paese}/${citta}`, citta);
        if (photos.length) cittaData[citta] = photos;
      }
      if (Object.keys(cittaData).length) countriesData[paese] = cittaData;
    }

    const standaloneData = {};
    for (const album of standalone) {
      if (!isAdmin && HIDDEN_FROM_PUBLIC_GALLERY.includes(album.toLowerCase())) continue;
      const photos = await fetchFolderPhotos(album, album);
      if (photos.length) standaloneData[album] = photos;
    }

    res.status(200).json({ countries: countriesData, standalone: standaloneData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

async function handleListAdmin(req, res) {
  try {
    if (!(await isAuthenticated(req))) {
      return res.status(401).json({ error: 'Password errata' });
    }
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
    const isAdmin = await isAuthenticated(req);
    const redis = await getRedisClient();
    const raw = await redis.hGetAll('map_pins');
    const pins = raw
      ? Object.values(raw)
          .map((value) => (typeof value === 'string' ? JSON.parse(value) : value))
          .filter((pin) => isAdmin || !HIDDEN_FROM_PUBLIC_GALLERY.includes((pin.nome || '').toLowerCase()))
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

    // se "album" è un intero Paese (ha sotto-cartelle Città), il pin di ogni
    // città al suo interno va rimosso anche lui, non solo un eventuale pin
    // con lo stesso nome del Paese (che di norma non esiste: i pin sono
    // sempre salvati per città, mai per l'intero paese)
    const pinKeysToRemove = [album];
    if (!album.includes('/')) {
      try {
        const subResult = await cloudinary.api.sub_folders(album);
        (subResult.folders || []).forEach(f => pinKeysToRemove.push(`${album}/${f.name}`));
      } catch (e) {
        // nessuna sotto-cartella: è un album "standalone", niente da aggiungere
      }
    }

    await cloudinary.api.delete_resources_by_prefix(`${album}/`, { resource_type: 'image' });
    await cloudinary.api.delete_resources_by_prefix(`${album}/`, { resource_type: 'video' });
    try {
      await cloudinary.api.delete_folder(album);
    } catch (e) {
      // la cartella potrebbe non esistere più come oggetto separato, non è un errore bloccante
    }

    // rimuove anche il/i pin dalla mappa, se presenti
    try {
      const redis = await getRedisClient();
      await Promise.all(pinKeysToRemove.map(key => redis.hDel('map_pins', key)));
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

// geocodifica un pin tramite Nominatim (OpenStreetMap, gratuito) e lo salva
// su Redis. Supporta due formati:
// - { paese, citta }: pin di città dentro un Paese (organizzazione nuova).
//   La query di geocodifica è "Città, Paese" (più precisa), il pin ha
//   filtro = paese (cliccandolo sulla mappa si filtra l'intero paese) e
//   viene salvato sotto la chiave "Paese/Città".
// - { albumName, filtro }: formato precedente, per gli album "standalone"
//   ancora senza Paese.
async function handleCreatePin(req, res) {
  try {
    if (!(await isAuthenticated(req))) {
      return res.status(401).json({ error: 'Password errata' });
    }

    const { paese, citta, albumName, filtro: legacyFiltro } = req.body;
    let query, pin, key;

    if (paese && citta) {
      query = `${citta}, ${paese}`;
      pin = { nome: citta, paese, citta, filtro: paese };
      key = `${paese}/${citta}`;
    } else if (albumName) {
      const filtro = legacyFiltro || albumName;
      query = albumName;
      pin = { nome: albumName, filtro };
      key = filtro;
    } else {
      return res.status(400).json({ error: 'Mancano paese/citta oppure albumName' });
    }

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'IlMotonautaSito/1.0 (sito personale motociclistico)' } }
    );
    const results = await geoRes.json();

    if (!results || !results.length) {
      return res.status(404).json({ error: `Non ho trovato "${query}" sulla mappa. Aggiungilo a mano se vuoi il pin.` });
    }

    pin.lat = parseFloat(results[0].lat);
    pin.lng = parseFloat(results[0].lon);

    const redis = await getRedisClient();
    await redis.hSet('map_pins', key, JSON.stringify(pin));

    res.status(200).json({ success: true, lat: pin.lat, lng: pin.lng });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

// sposta tutte le foto/video di un album "standalone" dentro Paese/Città,
// rinominando ogni singola risorsa (Cloudinary non ha un vero "rename
// cartella": si spostano i file uno per uno cambiandone il public_id)
async function mapWithConcurrency(items, limit, fn) {
  const results = [];
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function handleMoveAlbum(req, res) {
  try {
    if (!(await isAuthenticated(req))) {
      return res.status(401).json({ error: 'Password errata' });
    }

    const { fromAlbum, paese, citta } = req.body;
    if (!fromAlbum || !paese || !citta) {
      return res.status(400).json({ error: 'Mancano fromAlbum, paese o citta' });
    }
    const toAlbum = `${paese}/${citta}`;
    if (fromAlbum === toAlbum) {
      return res.status(400).json({ error: 'La destinazione è uguale alla cartella di partenza.' });
    }

    const [imageResult, videoResult] = await Promise.all([
      cloudinary.api.resources({ type: 'upload', resource_type: 'image', prefix: `${fromAlbum}/`, max_results: 500 }),
      cloudinary.api.resources({ type: 'upload', resource_type: 'video', prefix: `${fromAlbum}/`, max_results: 500 }),
    ]);
    const resources = [
      ...imageResult.resources.map(r => ({ public_id: r.public_id, resource_type: 'image' })),
      ...videoResult.resources.map(r => ({ public_id: r.public_id, resource_type: 'video' })),
    ];

    if (!resources.length) {
      return res.status(404).json({ error: `Nessuna foto trovata in "${fromAlbum}".` });
    }

    await mapWithConcurrency(resources, 4, (r) => {
      const newPublicId = r.public_id.replace(`${fromAlbum}/`, `${toAlbum}/`);
      return cloudinary.uploader.rename(r.public_id, newPublicId, { resource_type: r.resource_type });
    });

    try {
      await cloudinary.api.delete_folder(fromAlbum);
    } catch (e) {
      // la cartella potrebbe restare per qualche istante per coerenza eventuale su Cloudinary, non blocca lo spostamento
    }

    const redis = await getRedisClient();
    await redis.hDel('map_pins', fromAlbum).catch(() => {});

    let pinCreated = false;
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${citta}, ${paese}`)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'IlMotonautaSito/1.0 (sito personale motociclistico)' } }
      );
      const geoResults = await geoRes.json();
      if (geoResults && geoResults.length) {
        const lat = parseFloat(geoResults[0].lat);
        const lng = parseFloat(geoResults[0].lon);
        await redis.hSet('map_pins', toAlbum, JSON.stringify({ nome: citta, paese, citta, filtro: paese, lat, lng }));
        pinCreated = true;
      }
    } catch (e) {
      // se la geocodifica fallisce lo spostamento delle foto è comunque riuscito
    }

    res.status(200).json({ success: true, moved: resources.length, pinCreated });
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
  if (action === 'move-album') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
    return handleMoveAlbum(req, res);
  }
  return res.status(400).json({ error: 'Azione non riconosciuta' });
};
