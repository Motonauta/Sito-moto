const { getRedisClient } = require('../lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const { text } = req.body;

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
};
