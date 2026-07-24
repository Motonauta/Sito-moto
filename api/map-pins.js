const { getRedisClient } = require('../lib/redis');

module.exports = async (req, res) => {
  try {
    const redis = await getRedisClient();
    const raw = await redis.hGetAll('map_pins');
    const pins = raw
      ? Object.values(raw).map((value) => (typeof value === 'string' ? JSON.parse(value) : value))
      : [];

    res.status(200).json({ pins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
