const { getRedisClient } = require('../lib/redis');

module.exports = async (req, res) => {
  try {
    const redis = await getRedisClient();
    const km = await redis.get('moto:km_attuali');
    res.status(200).json({ km: km || '23.000' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
