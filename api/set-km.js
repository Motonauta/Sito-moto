const { getRedisClient } = require('../lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const { password, km } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Password errata' });
    }
    if (!km || !km.trim()) {
      return res.status(400).json({ error: 'Scrivi un valore per i km.' });
    }

    const redis = await getRedisClient();
    await redis.set('moto:km_attuali', km.trim());

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
