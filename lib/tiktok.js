// Riquadro "TikTok" della home, uguale a quello di Instagram (lib/instagram.js):
// profilo e ultimi 9 video di @ilmotonauta, con le copertine copiate su
// Cloudinary e mostrate dal sito, così i visitatori non si collegano a TikTok.
//
// Da dove arrivano i dati: dalla pagina pubblica del riquadro ufficiale del
// profilo (https://www.tiktok.com/embed/@ilmotonauta, quella del "creator
// embed" di TikTok), che contiene profilo e ultimi video in un blocco JSON
// (__FRONTITY_CONNECT_STATE__). Niente codici né app da creare. Non è un'API
// ufficiale: se un giorno TikTok cambia quella pagina, resta l'ultimo feed
// salvato o, senza, la scheda "Seguimi su TikTok".
const cloudinary = require('cloudinary').v2;
const { getRedisClient } = require('./redis');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UTENTE = 'ilmotonauta';
const KEY_FEED = 'site:tiktok-feed';  // { at, profile, posts, errore, erroreAt }
const FEED_MAX_AGE_MS = 60 * 60 * 1000; // rilegge al massimo una volta l'ora
const POSTS_SHOWN = 9;
const TAG = 'tiktok-feed';

async function readJson(redis, key) {
  try {
    const raw = await redis.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

// data di pubblicazione: i primi 32 bit dell'id di un video TikTok sono i
// secondi dal 1970 (serve per ordinare: in cima la pagina mette i fissati)
function dataDaId(id) {
  try { return Number(BigInt(id) >> 32n) * 1000; } catch (err) { return 0; }
}

async function leggiTikTok() {
  const r = await fetch(`https://www.tiktok.com/embed/@${UTENTE}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36',
      'Accept-Language': 'it-IT,it;q=0.9',
    },
  });
  if (!r.ok) throw new Error(`TikTok ha risposto ${r.status}`);
  const html = await r.text();
  const m = html.match(/<script[^>]*id="__FRONTITY_CONNECT_STATE__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('Pagina di TikTok cambiata: dati non trovati');
  const stato = JSON.parse(m[1]);
  const dati = stato && stato.source && stato.source.data && stato.source.data[`/embed/@${UTENTE}`];
  if (!dati || !Array.isArray(dati.videoList)) throw new Error('Pagina di TikTok cambiata: elenco video non trovato');
  return { utente: dati.userInfo || {}, video: dati.videoList };
}

async function copiaSuCloudinary(publicId, sourceUrl, overwrite) {
  await cloudinary.uploader.upload(sourceUrl, {
    public_id: publicId,
    overwrite: !!overwrite,
    invalidate: !!overwrite,
    resource_type: 'image',
    tags: [TAG],
  });
}

async function aggiornaFeed(redis) {
  const { utente, video } = await leggiTikTok();
  const precedente = (await readJson(redis, KEY_FEED)) || { posts: [] };
  const giaCopiati = new Set((precedente.posts || []).map(p => p.id));

  // gli ultimi pubblicati, come "Ultimi contenuti social" (i fissati in cima
  // al profilo finiscono al loro posto in ordine di data)
  const ordinati = video
    .filter(v => v && v.id && !v.privateItem && (v.coverUrl || v.originCoverUrl))
    .sort((a, b) => dataDaId(b.id) - dataDaId(a.id));

  const posts = [];
  for (const v of ordinati) {
    if (posts.length >= POSTS_SHOWN) break;
    const publicId = `tt_${v.id}`;
    try {
      if (!giaCopiati.has(v.id)) await copiaSuCloudinary(publicId, v.coverUrl || v.originCoverUrl, false);
    } catch (err) {
      if (!/exist/i.test(String(err && err.message))) continue;
    }
    posts.push({
      id: v.id,
      permalink: `https://www.tiktok.com/@${UTENTE}/video/${v.id}`,
      didascalia: String(v.desc || '').replace(/\s+/g, ' ').trim().slice(0, 140),
      visualizzazioni: v.playCount != null ? v.playCount : null,
      data: new Date(dataDaId(v.id)).toISOString(),
      img: publicId,
    });
  }
  if (!posts.length) throw new Error('Nessun video leggibile da TikTok');

  // foto profilo: ricopiata al massimo una volta al giorno
  const prima = precedente.profile || {};
  let foto = prima.foto || null;
  let fotoAt = prima.fotoAt || 0;
  const avatar = utente.avatarLarger || utente.avatarMedium || utente.avatarThumbUrl;
  if (avatar && Date.now() - fotoAt > 24 * 3600 * 1000) {
    try {
      await copiaSuCloudinary('tt_profilo', avatar, true);
      foto = 'tt_profilo';
      fotoAt = Date.now();
    } catch (err) { /* resta quella di prima */ }
  }

  const feed = {
    at: Date.now(),
    profile: {
      username: utente.uniqueId || UTENTE,
      followers: utente.followerCount != null ? utente.followerCount : null,
      likes: utente.heartCount != null ? utente.heartCount : null,
      foto,
      fotoAt,
    },
    posts,
  };
  await redis.set(KEY_FEED, JSON.stringify(feed));

  // pulizia: via da Cloudinary le copertine dei video usciti dal riquadro
  try {
    const tenere = new Set([...posts.map(p => p.img), 'tt_profilo']);
    const elenco = await cloudinary.api.resources_by_tag(TAG, { max_results: 100 });
    const via = (elenco.resources || []).map(r => r.public_id).filter(id => !tenere.has(id));
    if (via.length) await cloudinary.api.delete_resources(via);
  } catch (err) { /* si riprova al prossimo giro */ }

  return feed;
}

// stessa forma del feed di Instagram, così la home li disegna uguali
function pubblico(feed) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const img = (id, w) => `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_${w},h_${w},c_fill,g_auto/${id}`;
  if (!feed) return { collegato: false, profilo: null, post: [] };
  return {
    collegato: true,
    profilo: {
      username: feed.profile.username,
      followers: feed.profile.followers,
      likes: feed.profile.likes,
      foto: feed.profile.foto ? img(feed.profile.foto, 160) : null,
    },
    post: (feed.posts || []).map(p => ({
      tipo: 'video', link: p.permalink, didascalia: p.didascalia, data: p.data,
      visualizzazioni: p.visualizzazioni,
      img: img(p.img, 480), img2x: img(p.img, 800),
    })),
  };
}

async function getFeed() {
  const redis = await getRedisClient();
  const feed = await readJson(redis, KEY_FEED);
  if (feed && Date.now() - (feed.at || 0) < FEED_MAX_AGE_MS) return pubblico(feed);
  try {
    return pubblico(await aggiornaFeed(redis));
  } catch (err) {
    // si continua a mostrare l'ultimo feed buono (se c'è), e si riprova tra
    // un'ora invece che a ogni visita
    if (feed) {
      feed.at = Date.now();
      feed.errore = err.message;
      feed.erroreAt = Date.now();
      await redis.set(KEY_FEED, JSON.stringify(feed));
    }
    return pubblico(feed);
  }
}

module.exports = { getFeed };
