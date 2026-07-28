const { getRedisClient } = require('../lib/redis');
const { isAuthenticated } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

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
};
