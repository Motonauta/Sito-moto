// Copertine delle guide del Manuale di bordo, tutte nello stesso stile:
// titolo a sinistra (ultima parte in rosso), sottotitolo, tre etichette e
// la foto a destra che sfuma nel fondo. Uso:
//   node render.js copertine.json [solo-questa-chiave]
// Ogni voce del json: { "out": "img/manuale/.../copertina.jpg" (dalla
// radice del sito), "foto": percorso o URL della foto, "pos": posizione
// della foto (CSS background-position, es. "center 40%"), "categoria",
// "titolo": ["riga", "riga", "*riga rossa*"], "sotto", "etichette": [3] }
// Scrive direttamente il JPG 1600x900 nel percorso "out".
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = __dirname, ROOT = path.resolve(DIR, '../..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const riga = r => r.startsWith('*') && r.endsWith('*') ? `<span class="r">${esc(r.slice(1, -1))}</span>` : esc(r);
const tag = t => esc(t).replace(/\*(.+?)\*/g, '<b>$1</b>');

function html(c) {
  const foto = /^https?:/.test(c.foto) ? c.foto : 'file://' + path.resolve(ROOT, c.foto);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face{ font-family:Oswald; font-weight:700; src:url(file://${DIR}/font/oswald700.ttf); }
@font-face{ font-family:JBM; font-weight:700; src:url(file://${DIR}/font/jbm700.ttf); }
@font-face{ font-family:WorkSans; font-weight:500; src:url(file://${DIR}/font/ws500.ttf); }
html,body{ margin:0; }
.c{ position:relative; width:1600px; height:900px; overflow:hidden; color:#F5F0E6;
  background:url(file://${ROOT}/img/topo.svg) left -300px top -200px / 1500px auto no-repeat,
    radial-gradient(ellipse 900px 700px at 0% 0%, rgba(193,39,45,0.30), transparent 70%), #15171B; }
.photo{ position:absolute; right:0; top:0; width:1000px; height:830px;
  background:url("${foto}") ${c.pos || 'center'} / cover no-repeat; filter:${c.filtro || 'brightness(.97) contrast(1.06) saturate(1.05)'};
  -webkit-mask-image:linear-gradient(90deg, transparent 0%, transparent 22%, rgba(0,0,0,.4) 40%, #000 62%), linear-gradient(0deg, transparent 0, #000 80px);
  -webkit-mask-composite:source-in; mask-composite:intersect; }
.txt{ position:absolute; left:84px; top:84px; width:900px; }
.eyebrow{ font-family:JBM; font-weight:700; font-size:22px; letter-spacing:.18em; color:#E0484E; text-transform:uppercase; display:flex; align-items:center; gap:14px; }
.led{ width:13px; height:13px; border-radius:50%; background:#C1272D; box-shadow:0 0 14px 2px rgba(193,39,45,.85); }
h1{ margin:30px 0 0; font-family:Oswald; font-weight:700; font-size:138px; line-height:.9; text-transform:uppercase; letter-spacing:.005em; white-space:nowrap; display:inline-block; }
h1 .r{ color:#C1272D; }
.bar{ margin-top:34px; width:120px; height:7px; border-radius:4px; background:#C1272D; }
p{ margin:30px 0 0; font-family:WorkSans; font-weight:500; font-size:41px; line-height:1.22; color:rgba(245,240,230,.9); max-width:800px; }
.tags{ position:absolute; left:84px; bottom:92px; display:flex; gap:14px; }
.tag{ font-family:JBM; font-weight:700; font-size:21px; letter-spacing:.12em; text-transform:uppercase; padding:11px 18px; border:2px solid rgba(245,240,230,.22); border-radius:8px; color:#EDE3D0; background:rgba(11,11,10,.55); white-space:nowrap; }
.tag b{ color:#E0484E; }
.road{ position:absolute; left:0; right:0; bottom:50px; height:3px; background:repeating-linear-gradient(90deg, rgba(245,240,230,.3) 0 44px, transparent 44px 88px); }
</style></head><body><div class="c">
  <div class="photo"></div>
  <div class="txt">
    <div class="eyebrow"><span class="led"></span>Manuale di bordo · ${esc(c.categoria)}</div>
    <h1>${c.titolo.map(riga).join('<br>')}</h1>
    <div class="bar"></div>
    <p>${esc(c.sotto)}</p>
  </div>
  <div class="tags">${c.etichette.map(t => `<span class="tag">${tag(t)}</span>`).join('')}</div>
  <div class="road"></div>
</div></body></html>`;
}

// accanto al JPG grande scrive "<nome>-800.webp" (800x450): è quella che usano
// gli elenchi (Manuale, home, "altri articoli"), dieci volte più leggera
async function piccola(p, jpg) {
  const dataUrl = 'data:image/jpeg;base64,' + fs.readFileSync(jpg).toString('base64');
  const webp = await p.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    const c = document.createElement('canvas'); c.width = 800; c.height = 450;
    const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, 800, 450);
    return c.toDataURL('image/webp', 0.82);
  }, dataUrl);
  const out = jpg.replace(/\.jpg$/, '-800.webp');
  fs.writeFileSync(out, Buffer.from(webp.split(',')[1], 'base64'));
  console.log('   + ' + path.relative(ROOT, out));
}

(async () => {
  const lista = JSON.parse(fs.readFileSync(path.resolve(process.argv[2] || path.join(DIR, 'copertine.json')), 'utf8'));
  const solo = process.argv[3];
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  for (const [chiave, c] of Object.entries(lista)) {
    if (solo && chiave !== solo) continue;
    const tmp = path.join(require('os').tmpdir(), `copertina-${chiave}.html`);
    fs.writeFileSync(tmp, html(c));
    await p.goto('file://' + tmp, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    // il titolo si rimpicciolisce finché la riga più lunga non sta nei 840 px
    // a sinistra della foto; il sottotitolo resta di due righe al massimo
    const size = await p.evaluate(() => {
      const h = document.querySelector('h1'); let s = 138;
      while (h.getBoundingClientRect().width > 840 && s > 90) { s -= 2; h.style.fontSize = s + 'px'; }
      return s;
    });
    const out = path.resolve(ROOT, c.out);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await p.screenshot({ path: out, type: 'jpeg', quality: 84 });
    console.log(chiave, 'titolo', size + 'px', '->', path.relative(ROOT, out));
    await piccola(p, out);
  }
  await b.close();
})();
