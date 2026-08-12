const { findBySlug } = require('../data/viaggi-data');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function mapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// stesso schema di routeUrls/routeUrlsMV in index.html: la tappa finale è la
// destinazione, tutte le altre sono waypoint intermedi
function routeMapsUrl(tappe) {
  const origin = tappe[0].query;
  const destination = tappe[tappe.length - 1].query;
  const waypoints = tappe.slice(1, -1).map(t => encodeURIComponent(t.query)).join('|');
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${waypoints}&travelmode=driving`;
}

const SECTION_INFO = {
  itinerario: { eyebrow: 'Uscite domenicali', anchor: '/index.html', titleSuffix: 'Itinerario in moto' },
  miniviaggio: { eyebrow: 'Passi alpini e mete lontane', anchor: '/index.html#miniviaggi', titleSuffix: 'Viaggio in moto' },
  ricordare: { eyebrow: 'Quando una settimana non basta', anchor: '/index.html#viaggi-ricordare', titleSuffix: 'Viaggio in moto' },
};

// giorni consigliati ricavati dal campo km ("7 giorni consigliati", "2-3
// giorni consigliati", "circa 90 km"...) per precompilare l'Assistente di
// valigia; se il testo non lo dice esplicitamente, si assume 1 giorno per
// gli itinerari (uscite in giornata) e 2 per gli altri
function parseGiorni(kmStr, tipo) {
  const match = String(kmStr).match(/(\d+)(?:-(\d+))?\s*giorni/);
  if (match) {
    return match[2] ? Math.round((Number(match[1]) + Number(match[2])) / 2) : Number(match[1]);
  }
  return tipo === 'itinerario' ? 1 : 2;
}

function qs(params) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
}

// costruisce i 3 link verso Nostromo, già precompilati con partenza/arrivo/
// tappe di questo viaggio: itinerario e giro ad anello, quindi partenza e
// arrivo impliciti sono sempre Roma; miniviaggio e viaggio da ricordare
// hanno già partenza/arrivo reali nella prima e ultima tappa
function buildNostromoLinks(tipo, it) {
  const names = it.tappe.map(t => t.nome);
  const isLoop = tipo === 'itinerario';

  const rottaStart = isLoop ? 'Roma' : names[0];
  const rottaEnd = isLoop ? 'Roma' : names[names.length - 1];
  const rottaStops = isLoop ? names : names.slice(1, -1);

  const viaggioStart = isLoop ? 'Roma' : names[0];
  // per default punta alla tappa finale reale (utile soprattutto per i
  // miniviaggi, dove spesso è diversa dalla partenza); nei giri ad anello
  // e nei viaggi da ricordare partenza e arrivo coincidono (Roma), quindi
  // in quel caso si usa meteoPlace come destinazione rappresentativa
  const viaggioEnd = (rottaEnd && rottaEnd.toLowerCase() !== viaggioStart.toLowerCase())
    ? rottaEnd
    : (it.meteoPlace || rottaEnd);
  const giorni = parseGiorni(it.km, tipo);

  return {
    viaggio: `/nostromo.html?${qs({ tool: 'viaggio', start: viaggioStart, end: viaggioEnd })}`,
    valigia: `/nostromo.html?${qs({ tool: 'valigia', dest: it.meteoPlace || viaggioEnd, giorni })}`,
    rotta: `/nostromo.html?${qs({ tool: 'rotta', start: rottaStart, end: rottaEnd, stops: rottaStops.join('|') })}`,
  };
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
      <a href="/about.html">Il Motonauta</a>
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

function render404() {
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Viaggio non trovato — Il Motonauta</title>
${HEAD_COMMON}
</head>
<body>
${HEADER_HTML}
<section style="padding-top:80px; padding-bottom:80px;">
  <div class="wrap" style="text-align:center;">
    <p class="marker" style="justify-content:center;">404</p>
    <h1 style="color:var(--sand);">Questo viaggio non esiste (più)</h1>
    <p style="margin-top:16px;"><a href="/index.html" class="btn solid" style="display:inline-block; margin-top:14px;">Torna a tutti i viaggi</a></p>
  </div>
</section>
${FOOTER_HTML}
</body>
</html>`;
}

module.exports = async (req, res) => {
  const slug = (req.query && req.query.slug) || '';
  const entry = findBySlug(slug);

  if (!entry) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(404).send(render404());
  }

  const { tipo, it } = entry;
  const section = SECTION_INFO[tipo] || SECTION_INFO.itinerario;
  const siteUrl = `https://ilmotonauta.com/viaggi/${slug}`;
  const pageTitle = `${it.titolo} — ${section.titleSuffix} | Il Motonauta`;
  const description = it.desc.length > 160 ? `${it.desc.slice(0, 157)}...` : it.desc;
  const nostromoLinks = buildNostromoLinks(tipo, it);

  const tappeHTML = it.tappe.map(t => `
      <li>
        <a class="stop-link" href="${mapsSearchUrl(t.query)}" target="_blank" rel="noopener">${escapeHtml(t.nome)} — ${escapeHtml(t.label)}</a>
        <p class="fun">${escapeHtml(t.fun)}</p>
      </li>`).join('');

  const mapsUrl = routeMapsUrl(it.tappe);
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(it.tappe[0].query)}&navigate=yes`;

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(pageTitle)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${siteUrl}">
<meta property="og:type" content="article">
<meta property="og:title" content="${escapeHtml(it.titolo)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${escapeHtml(it.foto)}">
<meta property="og:url" content="${siteUrl}">
${HEAD_COMMON}
<style>
  .viaggio-photo{
    position:relative; aspect-ratio:16/9; overflow:hidden; margin-top:36px;
    border:1px solid rgba(217,164,65,0.45); max-width:900px;
  }
  .viaggio-photo img{ width:100%; height:100%; object-fit:cover; display:block; }
  .viaggio-actions{ display:flex; gap:12px; flex-wrap:wrap; margin-top:28px; }
  .viaggio-actions a{
    font-family:var(--font-mono); font-size:0.78rem; text-transform:uppercase; letter-spacing:0.05em;
    padding:12px 20px; border:1px solid var(--rust); color:var(--cream); background:transparent;
    transition:background .2s ease, color .2s ease;
  }
  .viaggio-actions a:hover{ background:var(--rust); }
  .viaggio-actions a.waze{ border-color:rgba(245,240,230,0.3); }
  .viaggio-actions a.waze:hover{ background:rgba(245,240,230,0.12); }
  .viaggio-stops{ margin-top:44px; max-width:720px; }
  .viaggio-stops p.label{
    font-family:var(--font-mono); font-size:0.78rem; text-transform:uppercase;
    letter-spacing:0.05em; color:var(--cream-dim); margin-bottom:16px;
  }
  .viaggio-stops ul{ display:flex; flex-direction:column; gap:18px; list-style:none; padding:0; margin:0; }
  .viaggio-stops li{ border-bottom:1px dashed rgba(245,240,230,0.16); padding-bottom:16px; }
  .viaggio-stops li:last-child{ border-bottom:none; padding-bottom:0; }
  .viaggio-stops a.stop-link{
    display:flex; align-items:center; gap:8px; font-size:1rem; color:var(--cream); transition:color .2s ease;
  }
  .viaggio-stops a.stop-link:hover{ color:var(--gold); }
  .viaggio-stops a.stop-link::before{ content:"📍"; font-size:0.9em; flex-shrink:0; }
  .viaggio-stops .fun{ margin-top:6px; font-size:0.92rem; color:var(--cream-dim); font-style:italic; }
  .nostromo-cta{
    margin-top:44px; max-width:720px; background:var(--asphalt-2);
    border:1px solid rgba(245,240,230,0.14); padding:28px 30px;
  }
  .nostromo-cta-buttons{ display:flex; gap:12px; flex-wrap:wrap; margin-top:18px; }
</style>
</head>
<body>
${HEADER_HTML}

<section style="padding-top:56px; padding-bottom:0;">
  <div class="wrap">
    <p class="marker">${escapeHtml(section.eyebrow)} — ${escapeHtml(it.zona)}</p>
    <h1 style="font-size:clamp(2.2rem, 5vw, 3.6rem); color:var(--sand); max-width:26ch;">
      ${escapeHtml(it.titolo)}
    </h1>
    <p style="margin-top:14px; font-family:var(--font-mono); font-size:0.85rem; color:var(--cream-dim);">${escapeHtml(it.km)}</p>
    <p style="margin-top:22px; font-size:1.05rem; max-width:70ch;">${escapeHtml(it.desc)}</p>

    <div class="viaggio-photo">
      <img src="${escapeHtml(it.foto)}" alt="${escapeHtml(it.titolo)}">
    </div>

    <div class="viaggio-actions">
      <a href="${mapsUrl}" target="_blank" rel="noopener">Apri l'itinerario completo su Maps</a>
      <a class="waze" href="${wazeUrl}" target="_blank" rel="noopener">Prima tappa su Waze</a>
    </div>

    <div class="viaggio-stops">
      <p class="label">Tappe consigliate</p>
      <ul>${tappeHTML}
      </ul>
    </div>

    <div class="nostromo-cta">
      <p class="marker">Organizza il viaggio</p>
      <h2 style="font-size:1.3rem; color:var(--sand);">Fatti aiutare dal Nostromo</h2>
      <p style="margin-top:10px; font-size:0.92rem; color:var(--cream-dim);">
        Apri direttamente l'assistente che ti serve: parte già con partenza, arrivo e tappe di questo viaggio precompilati.
      </p>
      <div class="nostromo-cta-buttons">
        <a href="${nostromoLinks.viaggio}" class="btn">🌦️ Meteo lungo il percorso</a>
        <a href="${nostromoLinks.valigia}" class="btn">🧳 Prepara la valigia</a>
        <a href="${nostromoLinks.rotta}" class="btn solid">🗺️ Genera il percorso e le tappe</a>
      </div>
    </div>

    <p style="margin-top:44px;"><a href="${section.anchor}" style="color:var(--gold);">← Torna a tutti i viaggi</a></p>
  </div>
</section>

${FOOTER_HTML}
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.status(200).send(html);
};
