const { getRedisClient } = require('../lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
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
    res.status(500).json({ error: err.message });
  }
};
