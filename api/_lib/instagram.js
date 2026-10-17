// Riquadro "Instagram" della home: gli ultimi post di Angelo, letti con le API
// ufficiali di Instagram (Instagram API with Instagram Login, permesso
// instagram_business_basic: SOLO lettura di profilo e post, niente
// pubblicazione né messaggi).
//
// Come funziona:
// - Angelo crea una volta il "codice" (token) dal pannello sviluppatori di
//   Meta e lo incolla nell'area riservata (sezione Instagram): finisce su
//   Redis e non esce mai dal server.
// - Quando qualcuno apre la home, se il feed salvato ha più di un'ora si
//   rilegge da Instagram. Le foto dei post vengono copiate su Cloudinary
//   (fuori da ogni cartella, con il tag "instagram-feed": così non compaiono
//   tra gli album della Galleria) e il sito le mostra da lì, ridimensionate.
//   I visitatori non si collegano mai a Instagram: niente cookie loro.
// - Il token dura 60 giorni: ogni 7 giorni si rinnova da solo (Instagram
//   chiede che abbia almeno 24 ore). Se smette di funzionare il riquadro
//   ripiega su "Seguimi su Instagram" e nell'area riservata compare l'errore.
const cloudinary = require('cloudinary').v2;
const { getRedisClient } = require('./redis');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const KEY_ACCOUNT = 'site:instagram';      // { token, tokenSavedAt, username, lastError, lastErrorAt }
const KEY_FEED = 'site:instagram-feed';    // { at, profile, posts }
const GRAPH = 'https://graph.instagram.com';
const FEED_MAX_AGE_MS = 60 * 60 * 1000;            // rilegge al massimo una volta l'ora
const REFRESH_TOKEN_AFTER_MS = 7 * 24 * 3600 * 1000; // rinnovo del token ogni 7 giorni
const TOKEN_LIFETIME_MS = 60 * 24 * 3600 * 1000;
const POSTS_SHOWN = 9;
const TAG = 'instagram-feed';

async function readJson(redis, key) {
  try {
    const raw = await redis.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

async function graph(path, token, params = {}) {
  const url = new URL(GRAPH + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set('access_token', token);
  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.error) {
    const e = new Error((data.error && data.error.message) || `Instagram ha risposto ${r.status}`);
    e.code = data.error && data.error.code;
    throw e;
  }
  return data;
}

// copia su Cloudinary l'immagine di un post (una volta sola per post)
async function copiaSuCloudinary(publicId, sourceUrl, overwrite) {
  await cloudinary.uploader.upload(sourceUrl, {
    public_id: publicId,
    overwrite: !!overwrite,
    invalidate: !!overwrite,
    resource_type: 'image',
    tags: [TAG],
  });
}

function immagineDelPost(m) {
  if (m.media_type === 'VIDEO') return m.thumbnail_url || null;
  // album: media_url è il primo elemento; se è un video non c'è un'immagine
  if (m.media_url && !/\.mp4(\?|$)/i.test(m.media_url)) return m.media_url;
  return m.thumbnail_url || null;
}

async function aggiornaFeed(redis, account) {
  // 1) rinnovo del token, se è il momento
  if (Date.now() - (account.tokenSavedAt || 0) > REFRESH_TOKEN_AFTER_MS) {
    try {
      const nuovo = await graph('/refresh_access_token', account.token, { grant_type: 'ig_refresh_token' });
      if (nuovo.access_token) {
        account.token = nuovo.access_token;
        account.tokenSavedAt = Date.now();
        await redis.set(KEY_ACCOUNT, JSON.stringify(account));
      }
    } catch (err) {
      // se il rinnovo fallisce si prova comunque a leggere i post: il token
      // può essere ancora valido (riprova al prossimo giro)
    }
  }

  // 2) profilo (se i campi "ricchi" non sono concessi, almeno id e nome) e
  //    ultimi post, chiesti all'id dell'account come da documentazione Meta
  const profilo = await graph('/me', account.token, { fields: 'user_id,username,profile_picture_url,followers_count,media_count' })
    .catch(() => graph('/me', account.token, { fields: 'user_id,username' }).catch(() => null));
  const media = await graph(`/${(profilo && profilo.user_id) || 'me'}/media`, account.token,
    { fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp', limit: '14' });

  const precedente = (await readJson(redis, KEY_FEED)) || { posts: [] };
  const giaCopiati = new Set((precedente.posts || []).map(p => p.id));

  const posts = [];
  for (const m of media.data || []) {
    if (posts.length >= POSTS_SHOWN) break;
    const src = immagineDelPost(m);
    if (!src) continue;
    const publicId = `ig_${m.id}`;
    try {
      if (!giaCopiati.has(m.id)) await copiaSuCloudinary(publicId, src, false);
    } catch (err) {
      // "already exists" va bene; qualunque altro errore: si salta il post
      if (!/exist/i.test(String(err && err.message))) continue;
    }
    posts.push({
      id: m.id,
      tipo: m.media_type === 'VIDEO' ? 'video' : (m.media_type === 'CAROUSEL_ALBUM' ? 'album' : 'foto'),
      permalink: m.permalink,
      didascalia: String(m.caption || '').replace(/\s+/g, ' ').trim().slice(0, 140),
      data: m.timestamp,
      img: publicId,
    });
  }

  // foto profilo: ricopiata al massimo una volta al giorno
  const prima = precedente.profile || {};
  let fotoProfilo = prima.foto || null;
  let fotoAt = prima.fotoAt || 0;
  if (profilo && profilo.profile_picture_url && Date.now() - fotoAt > 24 * 3600 * 1000) {
    try {
      await copiaSuCloudinary('ig_profilo', profilo.profile_picture_url, true);
      fotoProfilo = 'ig_profilo';
      fotoAt = Date.now();
    } catch (err) { /* resta quella di prima */ }
  }

  const feed = {
    at: Date.now(),
    profile: profilo ? {
      username: profilo.username,
      followers: profilo.followers_count != null ? profilo.followers_count : null,
      post: profilo.media_count != null ? profilo.media_count : null,
      foto: fotoProfilo,
      fotoAt,
    } : (precedente.profile || null),
    posts,
  };
  await redis.set(KEY_FEED, JSON.stringify(feed));

  // pulizia: via da Cloudinary le copie dei post usciti dal riquadro
  try {
    const tenere = new Set([...posts.map(p => p.img), 'ig_profilo']);
    const elenco = await cloudinary.api.resources_by_tag(TAG, { max_results: 100 });
    const via = (elenco.resources || []).map(r => r.public_id).filter(id => !tenere.has(id));
    if (via.length) await cloudinary.api.delete_resources(via);
  } catch (err) { /* si riprova al prossimo giro */ }

  if (account.lastError) {
    delete account.lastError; delete account.lastErrorAt;
    await redis.set(KEY_ACCOUNT, JSON.stringify(account));
  }
  return feed;
}

// quello che vede il sito pubblico: mai il token, solo profilo e post
function pubblico(feed, collegato) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const img = (id, w) => `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_${w},h_${w},c_fill/${id}`;
  return {
    collegato,
    profilo: feed && feed.profile ? {
      username: feed.profile.username,
      followers: feed.profile.followers,
      post: feed.profile.post,
      foto: feed.profile.foto ? img(feed.profile.foto, 160) : null,
    } : null,
    post: feed ? (feed.posts || []).map(p => ({
      tipo: p.tipo, link: p.permalink, didascalia: p.didascalia, data: p.data,
      img: img(p.img, 480), img2x: img(p.img, 800),
    })) : [],
  };
}

async function getFeed() {
  const redis = await getRedisClient();
  const account = await readJson(redis, KEY_ACCOUNT);
  const feed = await readJson(redis, KEY_FEED);
  if (!account || !account.token) return pubblico(null, false);
  if (feed && Date.now() - (feed.at || 0) < FEED_MAX_AGE_MS) return pubblico(feed, true);
  try {
    return pubblico(await aggiornaFeed(redis, account), true);
  } catch (err) {
    account.lastError = err.message;
    account.lastErrorAt = Date.now();
    await redis.set(KEY_ACCOUNT, JSON.stringify(account));
    // si continua a mostrare l'ultimo feed buono, se c'è
    return pubblico(feed, !!feed);
  }
}

// area riservata: salva un token nuovo dopo averlo provato
async function salvaToken(token) {
  token = String(token || '').trim();
  const redis = await getRedisClient();
  if (!token) {
    await redis.del(KEY_ACCOUNT);
    await redis.del(KEY_FEED);
    try { await cloudinary.api.delete_resources_by_tag(TAG); } catch (err) { /* niente */ }
    return { collegato: false };
  }
  const me = await graph('/me', token, { fields: 'user_id,username' });
  const account = { token, tokenSavedAt: Date.now(), username: me.username };
  await redis.set(KEY_ACCOUNT, JSON.stringify(account));
  await redis.del(KEY_FEED); // il prossimo giro rilegge subito i post
  const feed = await aggiornaFeed(redis, account);
  return { collegato: true, username: me.username, post: feed.posts.length };
}

async function stato() {
  const redis = await getRedisClient();
  const account = await readJson(redis, KEY_ACCOUNT);
  const feed = await readJson(redis, KEY_FEED);
  if (!account || !account.token) return { collegato: false };
  return {
    collegato: true,
    username: account.username || null,
    tokenSalvatoIl: account.tokenSavedAt || null,
    scadeIl: account.tokenSavedAt ? account.tokenSavedAt + TOKEN_LIFETIME_MS : null,
    ultimoAggiornamento: feed ? feed.at : null,
    post: feed ? (feed.posts || []).length : 0,
    errore: account.lastError || null,
    erroreIl: account.lastErrorAt || null,
  };
}

module.exports = { getFeed, salvaToken, stato };
