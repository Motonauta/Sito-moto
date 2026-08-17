const { findBySlug, getSlug, GUIDE } = require('../data/manuale-data');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// stesso helper usato per i viaggi: Special:FilePath di Wikimedia Commons
// supporta un parametro "width" per una miniatura già ridimensionata
function wikiThumb(url, width) {
  if (!url) return url;
  if (!url.includes('wikimedia.org')) return url;
  return url + (url.includes('?') ? '&' : '?') + 'width=' + width;
}

const HEAD_COMMON = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Work+Sans:wght@400;500&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
<script src="/cookie-consent.js" defer></script>`;

const HEADER_HTML = `<header class="site-header">
  <div class="wrap">
    <a href="/index.html" class="logo logo-wrap">
      <img src="https://res.cloudinary.com/whqpxxz1/image/upload/v1784625152/IMG_1429_dyz5re.jpg" alt="Logo Il Motonauta" style="height:40px; width:auto; display:block; border-radius:50%;">
      IL <span>MOTONAUTA</span>
    </a>
    <nav class="nav-links">
      <a href="/index.html">Rotte</a>
      <a href="/nostromo.html">Nostromo</a>
      <a href="/manuale.html">Manuale di bordo</a>
      <a href="/ilmotonauta.html">Il Motonauta</a>
      <a href="/sponsor.html">Alleati</a>
      <a href="/galleria.html">Diario di bordo</a>
      <a href="/contatti.html">Canale aperto</a>
    </nav>
    <button class="nav-toggle" aria-label="Apri menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;

const FOOTER_HTML = `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-social">
      <a href="/contatti.html">Instagram</a>
      <a href="/contatti.html">TikTok</a>
      <a href="/contatti.html">YouTube</a>
      <a href="/privacy.html">Privacy &amp; Cookie</a>
    </div>
    <p class="footer-note">© 2026 Il Motonauta — tutti i diritti riservati</p>
  </div>
</footer>
<script src="/script.js"></script>`;

const STYLE = `<style>
  .manuale-meta{
    margin-top:14px; font-family:var(--font-mono); font-size:0.8rem; color:var(--cream-dim);
  }
  .manuale-photo{
    position:relative; aspect-ratio:16/9; overflow:hidden; margin-top:36px;
    border:1px solid rgba(217,164,65,0.45); max-width:900px;
  }
  .manuale-photo img{ width:100%; height:100%; object-fit:cover; display:block; }
  .manuale-content{ margin-top:32px; max-width:720px; }
  .manuale-content > p{ margin-top:20px; font-size:1.02rem; line-height:1.65; }
  .manuale-content h2{
    margin-top:40px; font-size:1.25rem; color:var(--sand);
    padding-bottom:8px; border-bottom:1px solid rgba(245,240,230,0.16);
  }
  .manuale-tip{
    margin-top:28px; padding:24px 26px; background:var(--asphalt-2);
    border:1px solid rgba(245,240,230,0.14);
  }
  .manuale-tip-head{ display:flex; align-items:center; gap:12px; }
  .manuale-tip-num{
    flex-shrink:0; width:34px; height:34px; border-radius:50%;
    border:1px solid var(--gold); color:var(--gold); font-family:var(--font-mono);
    font-size:0.9rem; display:flex; align-items:center; justify-content:center;
  }
  .manuale-tip-title{ font-size:1.1rem; color:var(--sand); }
  .manuale-tip p{ margin-top:12px; font-size:0.98rem; line-height:1.6; }
  .manuale-tip .manuale-tip-link{
    display:inline-block; margin-top:12px; margin-right:10px; font-family:var(--font-mono); font-size:0.78rem;
    text-transform:uppercase; letter-spacing:0.04em; color:var(--gold); border:1px solid var(--gold);
    padding:8px 14px; text-decoration:none;
  }
  .manuale-tip .manuale-tip-link:hover{ background:var(--gold); color:var(--asphalt); }
  .manuale-tip-img{
    margin-top:14px; overflow:hidden; border:1px solid rgba(245,240,230,0.14);
  }
  .manuale-tip-img img{ width:100%; height:auto; display:block; }
  .manuale-tip-img-caption{
    margin-top:10px; padding:10px 14px; border:1px dashed rgba(245,240,230,0.25);
    font-family:var(--font-mono); font-size:0.78rem; color:var(--cream-dim);
  }
  .manuale-tip-img-caption::before{ content:"* "; color:var(--gold); }
  .manuale-breadcrumb{
    margin-top:18px; font-family:var(--font-mono); font-size:0.76rem; color:var(--cream-dim);
    text-transform:uppercase; letter-spacing:0.04em;
  }
  .manuale-breadcrumb a{ color:var(--cream-dim); }
  .manuale-breadcrumb a:hover{ color:var(--gold); }
  .manuale-breadcrumb span{ margin:0 6px; color:var(--gold); }
</style>`;

function render404() {
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Guida non trovata — Il Motonauta</title>
${HEAD_COMMON}
</head>
<body>
${HEADER_HTML}
<section style="padding-top:80px; padding-bottom:80px;">
  <div class="wrap" style="text-align:center;">
    <p class="marker" style="justify-content:center;">404</p>
    <h1 style="color:var(--sand);">Questa guida non esiste (più)</h1>
    <p style="margin-top:16px;"><a href="/manuale.html" class="btn solid" style="display:inline-block; margin-top:14px;">Torna al Manuale di bordo</a></p>
  </div>
</section>
${FOOTER_HTML}
</body>
</html>`;
}

function renderBlocco(b) {
  if (b.tipo === 'paragrafo') {
    return `<p>${escapeHtml(b.testo)}</p>`;
  }
  if (b.tipo === 'sottotitolo') {
    return `<h2>${escapeHtml(b.testo)}</h2>`;
  }
  if (b.tipo === 'immagine') {
    return `
    <div class="manuale-tip-img">
      <img src="${escapeHtml(wikiThumb(b.src, 1000))}" alt="${escapeHtml(b.caption || b.alt || '')}" loading="lazy">
    </div>
    ${b.caption ? `<p class="manuale-tip-img-caption">${escapeHtml(b.caption)}</p>` : ''}`;
  }
  if (b.tipo === 'consiglio') {
    return `
    <div class="manuale-tip">
      <div class="manuale-tip-head">
        <span class="manuale-tip-num">${escapeHtml(b.numero)}</span>
        <span class="manuale-tip-title">${escapeHtml(b.titolo)}</span>
      </div>
      <p>${escapeHtml(b.testo)}</p>
      ${b.immagine ? `
      <div class="manuale-tip-img">
        <img src="${escapeHtml(wikiThumb(b.immagine.src, 1000))}" alt="${escapeHtml(b.immagine.caption || b.titolo)}" loading="lazy">
      </div>
      ${b.immagine.caption ? `<p class="manuale-tip-img-caption">${escapeHtml(b.immagine.caption)}</p>` : ''}` : ''}
      ${b.link ? `<a class="manuale-tip-link" href="${escapeHtml(b.link.url)}" target="_blank" rel="noopener sponsored">${escapeHtml(b.link.label)} →</a>` : ''}
      ${b.links ? b.links.map(l => `<a class="manuale-tip-link" href="${escapeHtml(l.url)}" target="_blank" rel="noopener sponsored">${escapeHtml(l.label)} →</a>`).join('') : ''}
    </div>`;
  }
  return '';
}

module.exports = async (req, res) => {
  const slug = (req.query && req.query.slug) || '';
  const guida = findBySlug(slug);

  if (!guida) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(404).send(render404());
  }

  const siteUrl = `https://ilmotonauta.com/manuale/${slug}`;
  const pageTitle = `${guida.titolo} | Il Motonauta`;
  const description = guida.excerpt.length > 160 ? `${guida.excerpt.slice(0, 157)}...` : guida.excerpt;
  const dataLeggibile = new Date(guida.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

  const contenutoHTML = guida.blocchi.map(renderBlocco).join('\n');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guida.titolo,
    description: description,
    datePublished: guida.data,
    dateModified: guida.data,
    author: { '@type': 'Person', name: guida.autore },
    publisher: { '@type': 'Organization', name: 'Il Motonauta' },
    mainEntityOfPage: siteUrl,
    ...(guida.copertina ? { image: [wikiThumb(guida.copertina, 1200)] } : {}),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Il Motonauta', item: 'https://ilmotonauta.com/index.html' },
      { '@type': 'ListItem', position: 2, name: 'Manuale di bordo', item: 'https://ilmotonauta.com/manuale.html' },
      { '@type': 'ListItem', position: 3, name: guida.titolo, item: siteUrl },
    ],
  };

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(pageTitle)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${siteUrl}">
<meta property="og:type" content="article">
<meta property="og:title" content="${escapeHtml(guida.titolo)}">
<meta property="og:description" content="${escapeHtml(description)}">
${guida.copertina ? `<meta property="og:image" content="${escapeHtml(wikiThumb(guida.copertina, 1200))}">` : ''}
<meta property="og:url" content="${siteUrl}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
${HEAD_COMMON}
${STYLE}
</head>
<body>
${HEADER_HTML}

<section style="padding-top:56px; padding-bottom:0;">
  <div class="wrap">
    <p class="manuale-breadcrumb">
      <a href="/index.html">Il Motonauta</a><span>/</span><a href="/manuale.html">Manuale di bordo</a><span>/</span>${escapeHtml(guida.titolo)}
    </p>
    <p class="marker" style="margin-top:18px;">${escapeHtml(guida.categoria)}</p>
    <h1 style="font-size:clamp(2.2rem, 5vw, 3.6rem); color:var(--sand); max-width:26ch;">
      ${escapeHtml(guida.titolo)}
    </h1>
    <p class="manuale-meta">${escapeHtml(guida.autore)} — ${escapeHtml(dataLeggibile)}</p>
    <button type="button" class="copy-link-btn" data-copy="${siteUrl}" style="margin-top:16px;">🔗 Copia link</button>

    ${guida.copertina ? `
    <div class="manuale-photo">
      <img src="${escapeHtml(wikiThumb(guida.copertina, 1400))}" alt="${escapeHtml(guida.titolo)}">
    </div>
    ` : ''}

    <div class="manuale-content">
      ${contenutoHTML}
    </div>

    <p style="margin-top:44px;"><a href="/manuale.html" style="color:var(--gold);">← Torna al Manuale di bordo</a></p>
  </div>
</section>

${FOOTER_HTML}
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.status(200).send(html);
};
