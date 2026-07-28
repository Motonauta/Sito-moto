const { getRedisClient } = require('../lib/redis');
const { COOKIE_NAME, parseCookies } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const token = parseCookies(req)[COOKIE_NAME];
    if (token) {
      const redis = await getRedisClient();
      await redis.del(`admin_session:${token}`);
    }
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
};
