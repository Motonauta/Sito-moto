const { getRedisClient } = require('./redis');

const COOKIE_NAME = 'motonauta_admin';
const SESSION_SECONDS = 60 * 60 * 24 * 7; // 7 giorni

function parseCookies(req) {
  const header = req.headers.cookie;
  const cookies = {};
  if (!header) return cookies;
  header.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    cookies[key] = decodeURIComponent(value);
  });
  return cookies;
}

async function isAuthenticated(req) {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token) return false;
  const redis = await getRedisClient();
  const exists = await redis.get(`admin_session:${token}`);
  return !!exists;
}

module.exports = { isAuthenticated, parseCookies, COOKIE_NAME, SESSION_SECONDS };
