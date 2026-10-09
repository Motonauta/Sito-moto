// Dati live di Itinerari/Miniviaggi/Viaggi da ricordare, letti e scritti su
// Redis: questo è ciò che rende possibile gestirli dall'area riservata
// invece di dover modificare data/viaggi-data.js a mano. Quel file resta
// come "seed" iniziale: la prima volta che questa funzione gira (Redis
// ancora vuoto) copia il suo contenuto su Redis, da lì in poi è Redis la
// fonte di verità e data/viaggi-data.js non viene più letto.
const { getRedisClient } = require('./redis');
const seed = require('../data/viaggi-data');

const REDIS_KEY = 'site:viaggi-data';
const CATEGORIE = ['ITINERARI', 'MINIVIAGGI', 'VIAGGI_RICORDARE'];

async function getViaggiData() {
  const redis = await getRedisClient();
  const raw = await redis.get(REDIS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.ITINERARI)) return parsed;
    } catch (err) {
      console.error('Dati viaggi su Redis non leggibili, uso quelli di partenza', err);
    }
  }
  const initial = {
    ITINERARI: seed.ITINERARI,
    MINIVIAGGI: seed.MINIVIAGGI,
    VIAGGI_RICORDARE: seed.VIAGGI_RICORDARE,
  };
  await redis.set(REDIS_KEY, JSON.stringify(initial));
  return initial;
}

async function saveViaggiData(data) {
  const redis = await getRedisClient();
  await redis.set(REDIS_KEY, JSON.stringify(data));
}

function findBySlug(data, slug) {
  const tipoPerCategoria = { ITINERARI: 'itinerario', MINIVIAGGI: 'miniviaggio', VIAGGI_RICORDARE: 'ricordare' };
  for (const categoria of CATEGORIE) {
    const lista = data[categoria] || [];
    for (let index = 0; index < lista.length; index++) {
      if (seed.getSlug(lista[index]) === slug) {
        return { tipo: tipoPerCategoria[categoria], categoria, index, it: lista[index] };
      }
    }
  }
  return null;
}

module.exports = {
  getViaggiData,
  saveViaggiData,
  findBySlug,
  getSlug: seed.getSlug,
  CATEGORIE,
};
