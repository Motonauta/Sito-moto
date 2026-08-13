const { getRedisClient } = require('../lib/redis');
const { isAuthenticated } = require('../lib/auth');

async function handleSubmit(req, res) {
  try {
    const { text } = req.body;
    const tipo = req.body.tipo === 'manuale' ? 'manuale' : 'video';

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Scrivi qualcosa prima di inviare.' });
    }
    if (text.length > 600) {
      return res.status(400).json({ error: 'Testo troppo lungo (massimo 600 caratteri).' });
    }

    const redis = await getRedisClient();

    // individua l'IP di chi sta scrivendo: x-real-ip e l'ultimo valore di
    // x-forwarded-for sono impostati dal proxy di Vercel, non dal client, quindi
    // non possono essere falsificati mandando un header finto (a differenza del
    // primo valore di x-forwarded-for, che invece il client può inventare)
    const forwarded = req.headers['x-forwarded-for'];
    const forwardedIp = forwarded ? forwarded.split(',').pop().trim() : null;
    const ip = req.headers['x-real-ip'] || forwardedIp || (req.socket && req.socket.remoteAddress) || 'unknown';

    // controlla se questo IP ha già mandato un'idea nelle ultime 24 ore
    const blockKey = `idea_block:${ip}`;
    const alreadyBlocked = await redis.get(blockKey);
    if (alreadyBlocked) {
      return res.status(429).json({ error: 'Hai già inviato un\'idea nelle ultime 24 ore. Riprova più tardi.' });
    }

    // salva l'idea
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const idea = {
      text: text.trim().slice(0, 600),
      tipo,
      date: new Date().toISOString(),
      ip,
    };
    await redis.hSet('ideas', id, JSON.stringify(idea));

    // blocca l'IP per 24 ore (86400 secondi)
    await redis.set(blockKey, '1', { EX: 86400 });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

async function handleList(req, res) {
  try {
    if (!(await isAuthenticated(req))) {
      return res.status(401).json({ error: 'Password errata' });
    }

    const redis = await getRedisClient();
    const raw = await redis.hGetAll('ideas');
    const ideas = raw
      ? Object.entries(raw).map(([id, value]) => {
          const parsed = typeof value === 'string' ? JSON.parse(value) : value;
          return { id, ...parsed };
        })
      : [];

    ideas.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ ideas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

async function handleDelete(req, res) {
  try {
    const id = (req.query && req.query.id) || (req.body && req.body.id);
    if (!(await isAuthenticated(req))) {
      return res.status(401).json({ error: 'Password errata' });
    }
    if (!id) {
      return res.status(400).json({ error: 'Manca id' });
    }

    const redis = await getRedisClient();
    await redis.hDel('ideas', id);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

module.exports = async (req, res) => {
  if (req.method === 'POST') return handleSubmit(req, res);
  if (req.method === 'GET') return handleList(req, res);
  if (req.method === 'DELETE') return handleDelete(req, res);
  return res.status(405).json({ error: 'Metodo non consentito' });
};
