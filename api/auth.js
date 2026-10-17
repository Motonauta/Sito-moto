const crypto = require('crypto');
const { getRedisClient } = require('./_lib/redis');
const { COOKIE_NAME, SESSION_SECONDS, isAuthenticated, parseCookies } = require('./_lib/auth');

const MAX_ATTEMPTS = 3;
const BLOCK_SECONDS = 60 * 60 * 24; // 24 ore
// per entrare servono email E password; l'email si può cambiare da Vercel
// con la variabile ADMIN_EMAIL, senza toccare il codice
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'partner@ilmotonauta.com').trim().toLowerCase();

// confronto a tempo costante: dalla durata della risposta non si capisce
// quanti caratteri erano giusti
function sameSecret(input, real) {
  const a = crypto.createHash('sha256').update(String(input || '')).digest();
  const b = crypto.createHash('sha256').update(String(real || '')).digest();
  return crypto.timingSafeEqual(a, b) && String(real || '').length > 0;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const forwardedIp = forwarded ? forwarded.split(',').pop().trim() : null;
  return req.headers['x-real-ip'] || forwardedIp || (req.socket && req.socket.remoteAddress) || 'unknown';
}

async function handleLogin(req, res) {
  try {
    const ip = getClientIp(req);
    const redis = await getRedisClient();

    const blockKey = `login_block:${ip}`;
    if (await redis.get(blockKey)) {
      return res.status(429).json({ error: 'Troppi tentativi sbagliati. Riprova tra 24 ore.' });
    }

    const { email, password } = req.body || {};
    // si controllano sempre tutte e due, e la risposta è la stessa se è
    // sbagliata l'una o l'altra: così non si scopre quale delle due è giusta
    const emailOk = sameSecret(String(email || '').trim().toLowerCase(), ADMIN_EMAIL);
    const passwordOk = sameSecret(password, process.env.ADMIN_PASSWORD);
    if (!(emailOk && passwordOk)) {
      const failKey = `login_fail:${ip}`;
      const attempts = await redis.incr(failKey);
      if (attempts === 1) {
        await redis.expire(failKey, BLOCK_SECONDS);
      }
      if (attempts >= MAX_ATTEMPTS) {
        await redis.set(blockKey, '1', { EX: BLOCK_SECONDS });
        await redis.del(failKey);
        return res.status(429).json({ error: 'Troppi tentativi sbagliati. Riprova tra 24 ore.' });
      }
      return res.status(401).json({ error: 'Email o password errata.' });
    }

    // email e password corrette: azzera i tentativi falliti registrati per questo IP
    await redis.del(`login_fail:${ip}`);

    const token = crypto.randomBytes(32).toString('hex');
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
}

async function handleLogout(req, res) {
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
}

async function handleCheck(req, res) {
  try {
    const authenticated = await isAuthenticated(req);
    res.status(200).json({ authenticated });
  } catch (err) {
    console.error(err);
    res.status(200).json({ authenticated: false });
  }
}

module.exports = async (req, res) => {
  const action = (req.query && req.query.action) || '';

  if (action === 'check') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Metodo non consentito' });
    return handleCheck(req, res);
  }
  if (action === 'logout') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
    return handleLogout(req, res);
  }
  if (action === 'login') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });
    return handleLogin(req, res);
  }
  return res.status(400).json({ error: 'Azione non riconosciuta' });
};
