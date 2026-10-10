const { ULTIMO_AGGIORNAMENTO_DATI } = require('../data/viaggi-data');
const { getViaggiData, saveViaggiData, findBySlug, CATEGORIE } = require('../lib/viaggi-store');
const { isAuthenticated } = require('../lib/auth');

const LOGO_URL = 'https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1789141526/Manuale%20di%20bordo/crvox1bhiytw9ejguh0q.png';

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

// stesso helper usato in index.html: Special:FilePath di Wikimedia Commons
// supporta un parametro "width" che fa reindirizzare a una miniatura già
// ridimensionata invece del file originale (spesso diversi MB)
function wikiThumb(url, width) {
  if (!url) return url;
  return url + (url.includes('?') ? '&' : '?') + 'width=' + width;
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
<div class="vt-livery" aria-hidden="true"></div>
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

// Azioni per l'area riservata (gestione itinerari/miniviaggi/viaggi da
// ricordare): list è pubblica (stessi dati già visibili sul sito, servono
// anche a index.html per i caroselli e alla ricerca), save/delete scrivono
// e richiedono una sessione admin valida.
async function handleList(req, res) {
  try {
    const data = await getViaggiData();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

function validateItem(categoria, item) {
  if (!item || typeof item !== 'object') return 'Voce mancante.';
  if (!item.titolo || !item.titolo.trim()) return 'Il titolo è obbligatorio.';
  if (!item.zona || !item.zona.trim()) return 'La zona è obbligatoria.';
  if (!item.km || !item.km.trim()) return 'Il campo km è obbligatorio.';
  if (!item.meteoPlace || !item.meteoPlace.trim()) return 'Il comune per il meteo è obbligatorio.';
  if (!item.desc || !item.desc.trim()) return 'La descrizione è obbligatoria.';
  if (!Array.isArray(item.tappe) || !item.tappe.length) return 'Serve almeno una tappa.';
  for (const t of item.tappe) {
    if (!t || !t.nome || !t.nome.trim() || !t.query || !t.query.trim()) {
      return 'Ogni tappa deve avere almeno nome e query (per Maps/Waze).';
    }
  }
  if (item.kmNum != null && item.kmNum !== '' && isNaN(Number(item.kmNum))) {
    return 'Il campo km (numero) deve essere un numero.';
  }
  return null;
}

async function handleSave(req, res) {
  try {
    if (!(await isAuthenticated(req))) {
      return res.status(401).json({ error: 'Sessione scaduta, rifai il login.' });
    }
    const { categoria, index, item } = req.body || {};
    if (!CATEGORIE.includes(categoria)) {
      return res.status(400).json({ error: 'Categoria non valida.' });
    }
    const errore = validateItem(categoria, item);
    if (errore) return res.status(400).json({ error: errore });

    const cleanItem = {
      titolo: item.titolo.trim(),
      zona: item.zona.trim(),
      km: item.km.trim(),
      meteoPlace: item.meteoPlace.trim(),
      foto: (item.foto || '').trim(),
      desc: item.desc.trim(),
      tappe: item.tappe.map(t => ({
        nome: t.nome.trim(), query: t.query.trim(),
        label: (t.label || '').trim(), fun: (t.fun || '').trim(),
      })),
    };
    if (item.kmNum != null && item.kmNum !== '') cleanItem.kmNum = Number(item.kmNum);

    const data = await getViaggiData();
    const lista = data[categoria];
    if (index === null || index === undefined || index === '') {
      lista.push(cleanItem);
    } else {
      const i = Number(index);
      if (!(i >= 0 && i < lista.length)) {
        return res.status(400).json({ error: 'Voce da modificare non trovata.' });
      }
      lista[i] = cleanItem;
    }
    await saveViaggiData(data);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

async function handleDelete(req, res) {
  try {
    if (!(await isAuthenticated(req))) {
      return res.status(401).json({ error: 'Sessione scaduta, rifai il login.' });
    }
    const { categoria, index } = req.body || {};
    if (!CATEGORIE.includes(categoria)) {
      return res.status(400).json({ error: 'Categoria non valida.' });
    }
    const data = await getViaggiData();
    const lista = data[categoria];
    const i = Number(index);
    if (!(i >= 0 && i < lista.length)) {
      return res.status(400).json({ error: 'Voce da eliminare non trovata.' });
    }
    lista.splice(i, 1);
    await saveViaggiData(data);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno, riprova più tardi.' });
  }
}

module.exports = async (req, res) => {
  const action = req.query && req.query.action;
  if (action === 'list') return handleList(req, res);
  if (action === 'save') return handleSave(req, res);
  if (action === 'delete') return handleDelete(req, res);

  const slug = (req.query && req.query.slug) || '';
  const data = await getViaggiData();
  const entry = findBySlug(data, slug);

  if (!entry) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(404).send(render404());
  }

  const { tipo, it } = entry;
  const section = SECTION_INFO[tipo] || SECTION_INFO.itinerario;
  const siteUrl = `https://ilmotonauta.com/viaggi/${slug}`;
  const pageTitle = `${it.titolo} — ${section.titleSuffix} | Il Motonauta`;
  const descFlat = it.desc.replace(/\n\n+/g, ' ').trim();
  const description = descFlat.length > 160 ? `${descFlat.slice(0, 157)}...` : descFlat;
  const descParagraphs = it.desc.split(/\n\n+/).map(p => `<p style="margin-top:22px; font-size:1.05rem; max-width:70ch;">${escapeHtml(p.trim())}</p>`).join('');
  const nostromoLinks = buildNostromoLinks(tipo, it);

  const tappeHTML = it.tappe.map(t => `
      <li>
        <a class="stop-link" href="${mapsSearchUrl(t.query)}" target="_blank" rel="noopener">${escapeHtml(t.nome)} — ${escapeHtml(t.label)}</a>
        <p class="fun">${escapeHtml(t.fun)}</p>
      </li>`).join('');

  const mapsUrl = routeMapsUrl(it.tappe);
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(it.tappe[0].query)}&navigate=yes`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Il Motonauta', item: 'https://ilmotonauta.com/index.html' },
      { '@type': 'ListItem', position: 2, name: section.eyebrow, item: `https://ilmotonauta.com${section.anchor}` },
      { '@type': 'ListItem', position: 3, name: it.titolo, item: siteUrl },
    ],
  };

  // niente data di pubblicazione per singolo viaggio nei dati: si usa la data
  // dell'ultimo aggiornamento dell'intero file come riferimento, coerente con
  // ULTIMO_AGGIORNAMENTO_DATI mostrata altrove nel sito
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: it.titolo,
    description: description,
    datePublished: ULTIMO_AGGIORNAMENTO_DATI,
    dateModified: ULTIMO_AGGIORNAMENTO_DATI,
    author: { '@type': 'Person', name: 'Il Motonauta' },
    publisher: {
      '@type': 'Organization',
      name: 'Il Motonauta',
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    mainEntityOfPage: siteUrl,
    ...(it.foto ? { image: [wikiThumb(it.foto, 1200)] } : {}),
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
<meta property="og:title" content="${escapeHtml(it.titolo)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${escapeHtml(wikiThumb(it.foto, 1200))}">
<meta property="og:url" content="${siteUrl}">
<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
${HEAD_COMMON}
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<style>
  /* stesso sistema di base delle altre pagine già fatte: grafite
     freddo, doppio filo rosso/blu sotto l'header, bottone pieno con
     freccia cerchiata in hover. Niente sweep diagonale: qui l'hero e
     il resto della pagina condividono la stessa unica sezione, un
     effetto pensato per un hero corto stonerebbe su tutta l'altezza */
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
  .btn.solid{
    position:relative;
    padding:14px 54px 14px 24px;
    transition:background .2s var(--ease-out), color .2s var(--ease-out), transform .2s var(--ease-out);
  }
  .btn.solid::after{
    content:"→";
    position:absolute; right:10px; top:50%;
    transform:translateY(-50%);
    width:26px; height:26px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    background:rgba(8,10,18,0.18);
    font-size:0.9rem;
    transition:transform .2s var(--ease-out), background .2s ease;
  }
  @media (hover: hover) and (pointer: fine){
  .btn.solid:hover{ transform:translateY(-2px); }
}
  @media (hover: hover) and (pointer: fine){
  .btn.solid:hover::after{ transform:translate(3px,-50%); background:rgba(8,10,18,0.28); }
}

  .viaggio-photo{
    position:relative; aspect-ratio:16/9; overflow:hidden; margin-top:36px;
    border:1px solid rgba(30,95,174,0.45); max-width:900px;
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
  .viaggio-stops a.stop-link::before{
    content:""; width:1.05em; height:1.05em; flex-shrink:0; background:var(--rust);
    -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z'/%3E%3Ccircle cx='12' cy='9.5' r='2.5'/%3E%3C/svg%3E") center/contain no-repeat; mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z'/%3E%3Ccircle cx='12' cy='9.5' r='2.5'/%3E%3C/svg%3E") center/contain no-repeat;
  }
  .viaggio-stops .fun{ margin-top:6px; font-size:0.92rem; color:var(--cream-dim); font-style:italic; }
  .nostromo-cta{
    position:relative;
    margin-top:44px; max-width:720px;
    border:1px solid rgba(245,240,230,0.1); border-radius:24px; padding:28px 30px;
  }
  .nostromo-cta::before{
    content:""; position:absolute; inset:7px;
    background:var(--asphalt-2); border-radius:18px;
    border-top:3px solid var(--racing-blue);
    box-shadow:inset 0 1px 0 rgba(245,240,230,0.06);
    z-index:0;
  }
  .nostromo-cta > *{ position:relative; z-index:1; }
  .nostromo-cta-buttons{ display:flex; gap:12px; flex-wrap:wrap; margin-top:18px; }
  .viaggio-breadcrumb{
    margin-top:18px; font-family:var(--font-mono); font-size:0.76rem; color:var(--cream-dim);
    text-transform:uppercase; letter-spacing:0.04em;
  }
  .viaggio-breadcrumb a{ color:var(--cream-dim); }
  .viaggio-breadcrumb a:hover{ color:var(--gold); }
  .viaggio-breadcrumb span{ margin:0 6px; color:var(--gold); }
  .print-pdf-btn{
    font-family:var(--font-mono); font-size:0.78rem; text-transform:uppercase; letter-spacing:0.05em;
    padding:12px 20px; border:1px solid rgba(245,240,230,0.3); color:var(--cream); background:transparent;
    cursor:pointer; transition:background .2s ease, color .2s ease, transform .16s var(--ease-out);
  }
  .print-pdf-btn:hover{ background:rgba(245,240,230,0.12); }
  .viaggio-route-preview{ margin-top:44px; max-width:900px; }
  .viaggio-route-preview p.label{
    font-family:var(--font-mono); font-size:0.78rem; text-transform:uppercase;
    letter-spacing:0.05em; color:var(--cream-dim); margin-bottom:16px;
  }
  #route-preview-map{
    height:340px; width:100%; border:1px solid rgba(245,240,230,0.16); background:var(--asphalt-2);
    display:flex; align-items:center; justify-content:center;
  }
  .route-preview-skeleton{ width:100%; height:100%; }
  .viaggio-route-note{ margin-top:12px; font-size:0.82rem; color:var(--cream-dim); }
  .leaflet-popup-content-wrapper{
    background:var(--asphalt-2); color:var(--cream); border-radius:0; border:1px solid rgba(245,240,230,0.2);
  }
  .leaflet-popup-tip{ background:var(--asphalt-2); }
  .route-line-glow{ filter:blur(6px); }
  .route-line-main{
    stroke-dasharray:12 10;
    animation:route-dash-flow 1.1s linear infinite;
  }
  @keyframes route-dash-flow{
    to{ stroke-dashoffset:-22; }
  }
  .print-watermark, .print-logo-corner{ display:none; }
  @media print {
    .site-header, .site-footer, .viaggio-actions, .nostromo-cta, .print-pdf-btn, .copy-link-btn, #back-to-top, .viaggio-route-preview{ display:none !important; }

    /* Sfondo bianco "di serie" invece che forzare quello scuro del sito: gli
       sfondi impostati via CSS sono la prima cosa che molti browser/telefoni
       tolgono in stampa, col rischio di lasciare testo chiaro illeggibile su
       bianco. Il colore del testo invece stampa sempre, quindi restiamo su
       sfondo bianco "di serie" con testo scuro: robusto ovunque. */
    body{ background:#fff !important; color:#1b1a17 !important; }
    .viaggio-breadcrumb, .marker, .viaggio-stops p.label{ color:#555 !important; }
    h1, h2{ color:#1b1a17 !important; }
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
</style>
</head>
<body>
<div class="vt-livery" aria-hidden="true"></div>
<div class="print-watermark">Il Motonauta</div>
<img class="print-logo-corner" src="${LOGO_URL}" alt="">
${HEADER_HTML}

<section style="padding-top:56px; padding-bottom:0;">
  <div class="wrap">
    <p class="viaggio-breadcrumb">
      <a href="/index.html">Il Motonauta</a><span>/</span><a href="${section.anchor}">${escapeHtml(section.eyebrow)}</a><span>/</span>${escapeHtml(it.titolo)}
    </p>
    <p class="marker" style="margin-top:18px;">${escapeHtml(section.eyebrow)} — ${escapeHtml(it.zona)}</p>
    <h1 style="font-size:clamp(2.2rem, 5vw, 3.6rem); color:var(--sand); max-width:26ch;">
      ${escapeHtml(it.titolo)}
    </h1>
    <p style="margin-top:14px; font-family:var(--font-mono); font-size:0.85rem; color:var(--cream-dim);">${escapeHtml(it.km)} — dati aggiornati al ${escapeHtml(new Date(ULTIMO_AGGIORNAMENTO_DATI).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }))}</p>
    ${descParagraphs}

    <div class="viaggio-photo">
      <img src="${escapeHtml(wikiThumb(it.foto, 1200))}" alt="${escapeHtml(it.titolo)}">
    </div>

    <div class="viaggio-actions">
      <a href="${mapsUrl}" target="_blank" rel="noopener">Apri l'itinerario completo su Maps</a>
      <a class="waze" href="${wazeUrl}" target="_blank" rel="noopener">Prima tappa su Waze</a>
    </div>

    <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:16px;">
      <button type="button" class="print-pdf-btn" onclick="window.print()"><svg class="icon" aria-hidden="true"><use href="/icons.svg#i-file"/></svg> Stampa / Salva come PDF</button>
      <button type="button" class="copy-link-btn" data-copy="${siteUrl}"><svg class="icon" aria-hidden="true"><use href="/icons.svg#i-link"/></svg> Copia link</button>
    </div>

    <div class="viaggio-stops">
      <p class="label">Tappe consigliate</p>
      <ul>${tappeHTML}
      </ul>
    </div>

    <div class="viaggio-route-preview">
      <p class="label">Anteprima del percorso</p>
      <div id="route-preview-map"><div class="route-preview-skeleton skeleton" aria-label="Calcolo il percorso…"></div></div>
      <p class="viaggio-route-note" id="route-preview-caption">
        Percorso generato in automatico sulle tappe qui sopra: è indicativo, verifica sempre il tragitto reale su Maps o Waze prima di partire.
      </p>
    </div>

    <div class="nostromo-cta">
      <p class="marker">Organizza il viaggio</p>
      <h2 style="font-size:1.3rem; color:var(--sand);">Fatti aiutare dal Nostromo</h2>
      <p style="margin-top:10px; font-size:0.92rem; color:var(--cream-dim);">
        Apri direttamente l'assistente che ti serve: parte già con partenza, arrivo e tappe di questo viaggio precompilati.
      </p>
      <div class="nostromo-cta-buttons">
        <a href="${nostromoLinks.viaggio}" class="btn"><svg class="icon" aria-hidden="true"><use href="/icons.svg#i-cloud-sun"/></svg> Meteo lungo il percorso</a>
        <a href="${nostromoLinks.valigia}" class="btn"><svg class="icon" aria-hidden="true"><use href="/icons.svg#i-suitcase"/></svg> Prepara la valigia</a>
        <a href="${nostromoLinks.rotta}" class="btn solid"><svg class="icon" aria-hidden="true"><use href="/icons.svg#i-map"/></svg> Genera il percorso e le tappe</a>
      </div>
    </div>

    <p style="margin-top:44px;"><a href="${section.anchor}" style="color:var(--gold);">← Torna a tutti i viaggi</a></p>
  </div>
</section>

${FOOTER_HTML}
<script>
  const ROUTE_TAPPE = ${JSON.stringify(it.tappe.map(t => ({ nome: t.nome, query: t.query }))).replace(/</g, '\\u003c')};
  const ROUTE_IS_LOOP = ${tipo === 'itinerario' ? 'true' : 'false'};

  async function routePreviewGeocodeOne(query){
    try{
      const res = await fetch('/api/route-planner?action=search&q=' + encodeURIComponent(query));
      if(!res.ok) return null;
      const data = await res.json();
      const hit = Array.isArray(data) ? data[0] : null;
      return hit ? { lat: parseFloat(hit.lat), lon: parseFloat(hit.lon) } : null;
    } catch(err){
      return null;
    }
  }

  // Il campo "query" delle tappe è pensato per la ricerca libera di Google
  // Maps, che capisce anche descrizioni come "Via dei Laghi SP217 RM": il
  // geocoder che usiamo qui (Nominatim/OpenStreetMap) è molto più rigido e
  // spesso non trova nulla per query così descrittive. Se fallisce, si
  // ritenta con "nome" (il paese/luogo), quasi sempre geocodificabile.
  async function routePreviewGeocode(t){
    const byQuery = await routePreviewGeocodeOne(t.query);
    if(byQuery) return byQuery;
    return await routePreviewGeocodeOne(t.nome);
  }

  function getPartenza(){
    const params = new URLSearchParams(location.search);
    const val = (params.get('partenza') || '').trim();
    return val || 'Roma';
  }

  // Inserisce nel percorso la partenza scelta da chi visita il sito (di
  // default Roma, la stessa del calcolatore benzina in home): se la prima
  // o l'ultima tappa del viaggio è già "Roma" (i viaggi da ricordare partono
  // e tornano sempre lì) la sostituisce con la partenza scelta, altrimenti
  // la aggiunge come primo punto e, sui giri ad anello che per definizione
  // partono e tornano a Roma, anche come ultimo, per chiudere il giro.
  function buildTappeConPartenza(){
    const partenza = getPartenza();
    const tappe = ROUTE_TAPPE.slice();
    const partenzaTappa = { nome: partenza, query: partenza };

    const firstIsRoma = tappe.length > 0 && tappe[0].nome.toLowerCase() === 'roma';
    const lastIsRoma = tappe.length > 0 && tappe[tappe.length - 1].nome.toLowerCase() === 'roma';

    if(firstIsRoma) tappe[0] = partenzaTappa;
    else tappe.unshift(partenzaTappa);

    if(lastIsRoma) tappe[tappe.length - 1] = partenzaTappa;
    else if(ROUTE_IS_LOOP) tappe.push(partenzaTappa);

    return tappe;
  }

  function routePreviewHaversineKm(a, b){
    const R = 6371;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLon = (b.lon - a.lon) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180, lat2 = b.lat * Math.PI / 180;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // Il router pubblico usato per calcolare il percorso reale (lo stesso di
  // Nostromo) a volte "impazzisce" su tappe geocodificate correttamente e
  // restituisce un percorso che fa un giro assurdo (es. passa da un altro
  // paese senza motivo): capita raramente ma produce un'anteprima fuorviante.
  // Controllo di sicurezza: se una tratta tra due tappe consecutive è molto
  // più lunga della distanza in linea d'aria (più del previsto anche per
  // strade di montagna/costiere), non ci si fida del percorso calcolato e si
  // torna alla linea diretta tra le tappe.
  function routePreviewLegsLookSane(legs, coords){
    if(!Array.isArray(legs) || legs.length !== coords.length - 1) return false;
    for(let i = 0; i < legs.length; i++){
      const legKm = (legs[i].distance || 0) / 1000;
      const straightKm = routePreviewHaversineKm(coords[i], coords[i + 1]);
      const extraKm = legKm - straightKm;
      if(extraKm > 250 && legKm > straightKm * 2.5) return false;
    }
    return true;
  }

  // Anteprima del percorso come quella che si vede su Maps prima di avviare
  // la navigazione: geocodifica ogni tappa, calcola il percorso stradale
  // reale (stesso motore usato da Nostromo) e disegna la linea su una mappa
  // Leaflet. Le tappe che non vengono geocodificate (anche col fallback)
  // sono semplicemente saltate, invece di far fallire tutto il widget: si
  // nasconde solo se restano meno di due punti validi, o se il calcolo del
  // percorso non riesce comunque.
  async function loadRoutePreview(){
    const mapEl = document.getElementById('route-preview-map');
    if(!mapEl) return;
    if(typeof L === 'undefined'){
      const wrap = mapEl.closest('.viaggio-route-preview');
      if(wrap) wrap.style.display = 'none';
      return;
    }
    try{
      const coords = [];
      const tappeOk = [];
      for(const t of buildTappeConPartenza()){
        const c = await routePreviewGeocode(t);
        if(c){ coords.push(c); tappeOk.push(t); }
      }
      if(coords.length < 2) throw new Error('tappe geocodificate insufficienti per disegnare un percorso');

      const coordsParam = coords.map(c => c.lat + ',' + c.lon).join(';');
      // Linea diretta tra le tappe come base: se il calcolo del percorso
      // stradale reale funziona la sostituiamo, altrimenti resta questa.
      // Sui viaggi più lunghi (molte tappe, migliaia di km, più paesi) il
      // router pubblico usato da Nostromo può essere lento o non rispondere
      // affatto: meglio mostrare comunque una linea indicativa che far
      // sparire tutta l'anteprima.
      let latlngs = coords.map(function(c){ return [c.lat, c.lon]; });
      try{
        const controller = new AbortController();
        const timeoutId = setTimeout(function(){ controller.abort(); }, 7000);
        const res = await fetch('/api/route-planner?action=route&coords=' + encodeURIComponent(coordsParam) + '&steps=1', { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await res.json();
        const route = data.routes && data.routes[0];
        const legsOk = route && routePreviewLegsLookSane(route.legs, coords);
        if(legsOk && route.geometry && route.geometry.coordinates && route.geometry.coordinates.length > 1){
          latlngs = route.geometry.coordinates.map(function(c){ return [c[1], c[0]]; });
        }
      } catch(routeErr){
        // resta la linea diretta calcolata sopra
      }

      mapEl.innerHTML = '';
      const map = L.map('route-preview-map', { scrollWheelZoom: false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_2926_1_9433c9421427b00a6eeb97bc', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Linea con "glow" (una copia più larga e sfocata sotto) e tratteggio
      // animato sopra, per dare l'idea di un percorso "in movimento" come
      // nell'anteprima di navigazione di un vero navigatore.
      L.polyline(latlngs, { color: '#1E5FAE', weight: 10, opacity: 0.35, className: 'route-line-glow' }).addTo(map);
      const line = L.polyline(latlngs, { color: '#1E5FAE', weight: 4, opacity: 0.95, className: 'route-line-main' }).addTo(map);

      // Marker differenziati: partenza in verde, arrivo in rosso, tappe
      // intermedie in blu (stesso colore della linea).
      coords.forEach(function(c, i){
        const isStart = i === 0;
        const isEnd = i === coords.length - 1;
        const fillColor = isStart ? '#4F7038' : (isEnd ? '#C1272D' : '#1E5FAE');
        const label = tappeOk[i].nome + (isStart ? ' (partenza)' : isEnd ? ' (arrivo)' : '');
        L.circleMarker([c.lat, c.lon], {
          radius: (isStart || isEnd) ? 8 : 6, fillColor: fillColor, color: '#1B1A17', weight: 2, fillOpacity: 1
        }).addTo(map).bindPopup(label);
      });

      map.fitBounds(line.getBounds(), { padding: [24, 24] });
    } catch(err){
      const wrap = mapEl.closest('.viaggio-route-preview');
      if(wrap) wrap.style.display = 'none';
    }
  }

  loadRoutePreview();
</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.status(200).send(html);
};
