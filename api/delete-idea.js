const { getRedisClient } = require('../lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const { password, id } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Password errata' });
    }
    if (!id) {
      return res.status(400).json({ error: 'Manca id' });
    }

    const redis = await getRedisClient();
    await redis.hDel('ideas', id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
