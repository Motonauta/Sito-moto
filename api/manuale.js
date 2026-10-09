const { findBySlug, getSlug, GUIDE } = require('../data/manuale-data');

const LOGO_URL = 'https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1789141526/Manuale%20di%20bordo/crvox1bhiytw9ejguh0q.png';

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

const HEAD_COMMON = `<link rel="icon" href="https://res.cloudinary.com/whqpxxz1/image/upload/w_64,h_64,c_fill,r_max,f_auto,q_auto/v1789141526/Manuale%20di%20bordo/crvox1bhiytw9ejguh0q.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://res.cloudinary.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Work+Sans:wght@400;500&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
<script src="/cookie-consent.js" defer></script>`;

const HEADER_HTML = `<header class="site-header">
  <div class="wrap">
    <a href="/index.html" class="logo logo-wrap">
      <span class="logo-ring"><img src="https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1789141526/Manuale%20di%20bordo/crvox1bhiytw9ejguh0q.png" alt="Logo Il Motonauta" style="height:40px; width:auto; display:block; border-radius:50%;"></span>
      <span class="logo-text">IL <span class="accent-moto">MOTO</span><span class="accent-nauta">NAUTA</span></span>
    </a>
    <nav class="nav-links">
      <a href="/index.html">Rotte</a>
      <div class="nav-dropdown">
        <button type="button" class="nav-dropdown-toggle" aria-expanded="false">Strumenti di viaggio<span class="chevron"></span></button>
        <div class="nav-dropdown-menu">
          <a href="/nostromo.html">Nostromo</a>
          <a href="/manuale.html">Manuale di bordo</a>
        </div>
      </div>
      <div class="nav-dropdown">
        <button type="button" class="nav-dropdown-toggle" aria-expanded="false">Chi sono<span class="chevron"></span></button>
        <div class="nav-dropdown-menu">
          <a href="/ilmotonauta.html">Il Motonauta</a>
          <a href="/sponsor.html">Alleati</a>
        </div>
      </div>
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
  /* stesso sistema di base delle altre pagine già fatte: grafite
     freddo, doppio filo rosso/blu sotto l'header */
  :root{
    --racing-blue:#1E5FAE;
    --asphalt:#15171B;
    --asphalt-2:#1D2126;
  }
  .site-header{
    background:rgba(21,23,27,0.92);
    border-bottom:none;
  }
  .site-header::after{
    content:""; position:absolute; left:0; right:0; bottom:-1px; height:2px;
    background:linear-gradient(90deg, var(--rust), var(--racing-blue));
    pointer-events:none;
  }
  .manuale-meta{
    margin-top:14px; font-family:var(--font-mono); font-size:0.8rem; color:var(--cream-dim);
  }
  .manuale-photo{
    position:relative; aspect-ratio:16/9; overflow:hidden; margin-top:36px;
    border:1px solid rgba(30,95,174,0.45); max-width:900px;
  }
  .manuale-photo img{ width:100%; height:100%; object-fit:cover; display:block; }
  .manuale-content{ margin-top:32px; max-width:720px; }
  .manuale-content > p{ margin-top:20px; font-size:1.02rem; line-height:1.65; }
  .manuale-content h2{
    margin-top:40px; font-size:1.25rem; color:var(--sand);
    padding-bottom:8px; border-bottom:1px solid rgba(245,240,230,0.16);
  }
  .manuale-tip{
    position:relative;
    margin-top:28px; padding:24px 26px;
    border:1px solid rgba(245,240,230,0.1); border-radius:24px;
  }
  .manuale-tip::before{
    content:""; position:absolute; inset:7px;
    background:var(--asphalt-2); border-radius:18px;
    border-top:3px solid var(--rust);
    box-shadow:inset 0 1px 0 rgba(245,240,230,0.06);
    z-index:0;
  }
  .manuale-tip:nth-of-type(even)::before{ border-top-color:var(--racing-blue); }
  .manuale-tip > *{ position:relative; z-index:1; }
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
  .manuale-cta-link{
    display:inline-block; margin-top:32px; font-family:var(--font-mono); font-size:0.78rem;
    text-transform:uppercase; letter-spacing:0.04em; color:var(--gold); border:1px solid var(--gold);
    padding:10px 18px; text-decoration:none;
  }
  .manuale-cta-link:hover{ background:var(--gold); color:var(--asphalt); }
  .manuale-tip-img{
    margin-top:14px; overflow:hidden; border:1px solid rgba(245,240,230,0.14);
  }
  .manuale-tip-img img, .manuale-tip-img video{ width:100%; height:auto; display:block; }
  .manuale-tip-img-caption{
    margin-top:10px; padding:10px 14px;
    background:var(--asphalt-2); border:1px solid rgba(245,240,230,0.14);
    border-left:3px solid var(--gold);
    font-family:var(--font-mono); font-size:0.78rem; color:var(--cream-dim);
  }
  .manuale-tip-img-caption::before{ content:"* "; color:var(--gold); }
  .manuale-breadcrumb{
    margin-top:18px; font-family:var(--font-mono); font-size:0.76rem; color:var(--cream-dim);
    text-transform:uppercase; letter-spacing:0.04em;
  }
  .manuale-breadcrumb a{ color:var(--cream-dim); }
  .manuale-breadcrumb a:hover{ color:var(--gold); }
  .manuale-correlati{
    margin-top:64px; padding-top:44px; border-top:1px solid rgba(245,240,230,0.14);
  }
  .manuale-correlati h2{ font-size:1.4rem; color:var(--sand); border:none; padding-bottom:0; margin-top:0; }
  .manuale-correlati-grid{
    display:grid; grid-template-columns:repeat(3, 1fr); gap:24px; margin-top:28px;
  }
  .manuale-correlati-card{
    display:block; background:var(--asphalt-2); border:1px solid rgba(245,240,230,0.14);
    overflow:hidden; transition:border-color .25s ease, transform .25s ease;
  }
  .manuale-correlati-card:hover{ border-color:var(--rust); transform:translateY(-4px); }
  .manuale-correlati-photo{
    aspect-ratio:16/9; background:linear-gradient(155deg, rgba(30,95,174,0.18) 0%, rgba(193,39,45,0.18) 100%);
    overflow:hidden; display:flex; align-items:center; justify-content:center;
  }
  .manuale-correlati-photo img{ width:100%; height:100%; object-fit:cover; display:block; }
  .manuale-correlati-photo .placeholder-icon{ font-size:2rem; opacity:0.5; }
  .manuale-correlati-body{ padding:18px 20px; }
  .manuale-correlati-body .marker{ margin-bottom:0; }
  .manuale-correlati-body h3{ font-size:1rem; color:var(--sand); margin-top:8px; }
  @media (max-width:900px){ .manuale-correlati-grid{ grid-template-columns:repeat(2, 1fr); } }
  @media (max-width:600px){ .manuale-correlati-grid{ grid-template-columns:1fr; } }
  .manuale-breadcrumb span{ margin:0 6px; color:var(--gold); }
  .print-pdf-btn{
    font-family:var(--font-mono); font-size:0.78rem; text-transform:uppercase; letter-spacing:0.05em;
    padding:12px 20px; border:1px solid rgba(245,240,230,0.3); color:var(--cream); background:transparent;
    cursor:pointer; transition:background .2s ease, color .2s ease;
  }
  .print-pdf-btn:hover{ background:rgba(245,240,230,0.12); }
  .print-watermark, .print-logo-corner{ display:none; }
  @media print {
    .site-header, .site-footer, .print-pdf-btn, .copy-link-btn, .manuale-correlati{ display:none !important; }

    /* Sfondo bianco "di serie" invece che forzare quello scuro del sito: gli
       sfondi impostati via CSS sono la prima cosa che molti browser/telefoni
       tolgono in stampa, col rischio di lasciare testo chiaro illeggibile su
       bianco. Il colore del testo invece stampa sempre, quindi restiamo su
       sfondo bianco "di serie" con testo scuro: robusto ovunque. */
    body{ background:#fff !important; color:#1b1a17 !important; }
    .manuale-breadcrumb, .marker, .manuale-meta{ color:#555 !important; }
    h1, h2, .manuale-tip-title{ color:#1b1a17 !important; }
    a{ color:#1b1a17 !important; text-decoration:underline; }
    body > section{ position:relative; z-index:1; }

    /* scritta enorme e molto leggera sotto al testo, come una vera carta
       intestata: è testo vero (non uno sfondo CSS), quindi stampa sempre */
    .print-watermark{
      display:block; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-22deg);
      font-family:"Oswald", Arial, sans-serif; font-weight:700;
      font-size:6rem; letter-spacing:0.06em; text-transform:uppercase;
      white-space:nowrap; color:#000; opacity:0.06;
      z-index:0; pointer-events:none;
    }

    /* il logo piccolo in alto a destra è un'immagine vera, così stampa
       sempre anche quando il browser non stampa gli "sfondi/grafica" */
    .print-logo-corner{
      display:block; position:fixed; top:24px; right:24px; width:64px; height:64px; object-fit:cover;
      border-radius:50%;
      z-index:2;
    }
  }
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
  if (b.tipo === 'link') {
    return `<p style="margin-top:8px;"><a class="manuale-cta-link" href="${escapeHtml(b.url)}" target="_blank" rel="noopener">${escapeHtml(b.label)} →</a></p>`;
  }
  if (b.tipo === 'immagine') {
    return `
    <div class="manuale-tip-img">
      <img src="${escapeHtml(wikiThumb(b.src, 1000))}" alt="${escapeHtml(b.caption || b.alt || '')}" loading="lazy">
    </div>
    ${b.caption ? `<p class="manuale-tip-img-caption">${escapeHtml(b.caption)}</p>` : ''}`;
  }
  if (b.tipo === 'video') {
    return `
    <div class="manuale-tip-img">
      <video src="${escapeHtml(b.src)}" controls playsinline preload="metadata"></video>
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

function articoliConsigliati(guidaCorrente) {
  const altri = GUIDE.filter(g => g !== guidaCorrente);
  for (let i = altri.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [altri[i], altri[j]] = [altri[j], altri[i]];
  }
  return altri.slice(0, 3);
}

function renderArticoloConsigliato(g) {
  const slug = getSlug(g);
  return `
      <a class="manuale-correlati-card" href="/manuale/${slug}">
        <div class="manuale-correlati-photo">
          ${g.copertina
            ? `<img src="${escapeHtml(wikiThumb(g.copertina, 500))}" alt="${escapeHtml(g.titolo)}" loading="lazy">`
            : `<span class="placeholder-icon">📖</span>`}
        </div>
        <div class="manuale-correlati-body">
          <p class="marker">${escapeHtml(g.categoria)}</p>
          <h3>${escapeHtml(g.titolo)}</h3>
        </div>
      </a>`;
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
    publisher: {
      '@type': 'Organization',
      name: 'Il Motonauta',
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
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
<div class="print-watermark">Il Motonauta</div>
<img class="print-logo-corner" src="${LOGO_URL}" alt="">
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
    <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:16px;">
      <button type="button" class="print-pdf-btn" onclick="window.print()">📄 Stampa / Salva come PDF</button>
      <button type="button" class="copy-link-btn" data-copy="${siteUrl}">🔗 Copia link</button>
    </div>

    ${guida.copertina ? `
    <div class="manuale-photo">
      <img src="${escapeHtml(wikiThumb(guida.copertina, 1400))}" alt="${escapeHtml(guida.titolo)}">
    </div>
    ${guida.copertinaCaption ? `<p class="manuale-tip-img-caption">${escapeHtml(guida.copertinaCaption)}</p>` : ''}
    ` : ''}

    <div class="manuale-content">
      ${contenutoHTML}
    </div>

    ${(() => {
      const correlati = articoliConsigliati(guida);
      if (!correlati.length) return '';
      return `
    <div class="manuale-correlati">
      <p class="marker">Continua a leggere</p>
      <h2>Altri articoli consigliati</h2>
      <div class="manuale-correlati-grid">
        ${correlati.map(renderArticoloConsigliato).join('')}
      </div>
    </div>`;
    })()}

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
