const { ITINERARI, MINIVIAGGI, VIAGGI_RICORDARE, getSlug: getViaggioSlug } = require('../data/viaggi-data');
const { GUIDE, getSlug: getGuidaSlug } = require('../data/manuale-data');

const BASE = 'https://ilmotonauta.com';

// pagine statiche del sito, con priorità/frequenza indicative per i motori di ricerca
const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/ilmotonauta.html', changefreq: 'monthly', priority: '0.6' },
  { path: '/nostromo.html', changefreq: 'monthly', priority: '0.8' },
  { path: '/manuale.html', changefreq: 'weekly', priority: '0.8' },
  { path: '/sponsor.html', changefreq: 'monthly', priority: '0.4' },
  { path: '/galleria.html', changefreq: 'weekly', priority: '0.6' },
  { path: '/contatti.html', changefreq: 'yearly', priority: '0.3' },
];

function xmlEscape(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function urlEntry(loc, changefreq, priority, lastmod) {
  return `
  <url>
    <loc>${xmlEscape(loc)}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

module.exports = async (req, res) => {
  const entries = STATIC_PAGES.map(p => urlEntry(`${BASE}${p.path}`, p.changefreq, p.priority));

  [...ITINERARI, ...MINIVIAGGI, ...VIAGGI_RICORDARE].forEach(it => {
    entries.push(urlEntry(`${BASE}/viaggi/${getViaggioSlug(it)}`, 'monthly', '0.7'));
  });

  GUIDE.forEach(guida => {
    entries.push(urlEntry(`${BASE}/manuale/${getGuidaSlug(guida)}`, 'monthly', '0.6', guida.data));
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(xml);
};
