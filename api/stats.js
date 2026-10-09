// Contatore "nostro" per le statistiche in area riservata: niente Google
// Analytics qui, solo due numeri semplici salvati su Redis — quante volte
// è stata vista ogni pagina, e quante volte è stato usato ogni assistente
// di Nostromo. Nessuno storico/andamento nel tempo, solo totali da quando
// questa funzione è stata messa online.
const { getRedisClient } = require('../lib/redis');
const { isAuthenticated } = require('../lib/auth');

const PAGINE_VALIDE = [
  'index', 'nostromo', 'manuale', 'ilmotonauta', 'sponsor', 'galleria',
  'contatti', 'privacy', 'viaggio-dettaglio', 'manuale-dettaglio',
];
const TOOL_VALIDI = ['viaggio', 'valigia', 'rotta'];

async function handleTrack(req, res) {
  try {
    const { page, tool } = req.body || {};
    const redis = await getRedisClient();
    if (page && PAGINE_VALIDE.includes(page)) {
      await redis.hIncrBy('stats:pageviews', page, 1);
    }
    if (tool && TOOL_VALIDI.includes(tool)) {
      await redis.hIncrBy('stats:nostromo', tool, 1);
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    // il tracciamento non deve mai bloccare la navigazione dell'utente
    res.status(200).json({ success: false });
  }
}

async function handleSummary(req, res) {
  try {
    if (!(await isAuthenticated(req))) {
      return res.status(401).json({ error: 'Sessione scaduta, rifai il login.' });
    }
    const redis = await getRedisClient();
    const [pageviews, nostromo] = await Promise.all([
      redis.hGetAll('stats:pageviews'),
      redis.hGetAll('stats:nostromo'),
    ]);
    res.status(200).json({ pageviews, nostromo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

module.exports = async (req, res) => {
  const action = req.query && req.query.action;
  if (req.method === 'POST' && action === 'track') return handleTrack(req, res);
  if (req.method === 'GET' && action === 'summary') return handleSummary(req, res);
  return res.status(405).json({ error: 'Metodo non consentito' });
};
