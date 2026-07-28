const crypto = require('crypto');
const { getRedisClient } = require('../lib/redis');
const { COOKIE_NAME, SESSION_SECONDS } = require('../lib/auth');

function passwordMatches(input, real) {
  const a = Buffer.from(String(input || ''));
  const b = Buffer.from(String(real || ''));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const { password } = req.body;
    if (!passwordMatches(password, process.env.ADMIN_PASSWORD)) {
      return res.status(401).json({ error: 'Password errata' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const redis = await getRedisClient();
    await redis.set(`admin_session:${token}`, '1', { EX: SESSION_SECONDS });

    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}`
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
};
