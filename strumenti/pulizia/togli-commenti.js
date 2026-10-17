// Toglie i commenti dai file che il sito manda al browser (HTML, CSS, JS,
// SVG), senza toccare il resto: le spiegazioni stanno nelle note del progetto.
//
//   node strumenti/pulizia/togli-commenti.js             pulisce i file
//   node strumenti/pulizia/togli-commenti.js --controlla  elenca i commenti rimasti, senza cambiare niente
//
// Serve acorn: npm install --no-save acorn (dalla cartella del sito).
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

const RADICE = path.resolve(__dirname, '../..');
const SOLO_CONTROLLO = process.argv.includes('--controlla');

function file(){
  const out = [];
  const giu = dir => fs.readdirSync(path.join(RADICE, dir), { withFileTypes: true }).forEach(e => {
    const rel = path.join(dir, e.name);
    if(e.isDirectory()) giu(rel);
    else if(/\.svg$/.test(e.name)) out.push(rel);
  });
  fs.readdirSync(RADICE).forEach(n => { if(/\.(html|css|js|svg)$/.test(n)) out.push(n); });
  fs.readdirSync(path.join(RADICE, 'data')).forEach(n => { if(/\.js$/.test(n)) out.push(path.join('data', n)); });
  giu('img');
  return out;
}

function commentiJs(src){
  const r = [];
  const opz = { ecmaVersion: 'latest', allowHashBang: true, allowReturnOutsideFunction: true, onComment: (b, t, a, z) => r.push([a, z]) };
  try{ acorn.parse(src, { ...opz, sourceType: 'script' }); }
  catch(err){ r.length = 0; acorn.parse(src, { ...opz, sourceType: 'module' }); }
  return r;
}

function commentiCss(src){
  const r = [];
  let i = 0, q = null;
  while(i < src.length){
    const c = src[i];
    if(q){ if(c === '\\'){ i += 2; continue; } if(c === q) q = null; i++; continue; }
    if(c === '"' || c === "'"){ q = c; i++; continue; }
    if(c === '/' && src[i + 1] === '*'){
      const e = src.indexOf('*/', i + 2), fine = e < 0 ? src.length : e + 2;
      r.push([i, fine]); i = fine; continue;
    }
    i++;
  }
  return r;
}

function commentiHtml(src){
  const r = [], blocchi = [];
  const re = /<(script|style)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let m;
  while((m = re.exec(src))){
    const inizio = m.index + m[0].indexOf('>') + 1, dentro = m[3];
    blocchi.push([m.index, m.index + m[0].length]);
    if(m[1].toLowerCase() === 'style') commentiCss(dentro).forEach(([a, z]) => r.push([inizio + a, inizio + z]));
    else if(!/\bsrc=/.test(m[2]) && (!/\btype=/.test(m[2]) || /type=["']?(module|text\/javascript)/.test(m[2])))
      commentiJs(dentro).forEach(([a, z]) => r.push([inizio + a, inizio + z]));
  }
  const reC = /<!--[\s\S]*?-->/g;
  while((m = reC.exec(src))){
    if(!blocchi.some(([a, z]) => m.index >= a && m.index < z)) r.push([m.index, m.index + m[0].length]);
  }
  return r;
}

// riga intera se il commento è da solo, altrimenti solo il commento
function togli(src, intervalli){
  intervalli.sort((x, y) => x[0] - y[0]);
  let out = '', pos = 0;
  for(const [a, b] of intervalli){
    if(a < pos) continue;
    let ls = a; while(ls > 0 && (src[ls - 1] === ' ' || src[ls - 1] === '\t')) ls--;
    let le = b; while(le < src.length && (src[le] === ' ' || src[le] === '\t' || src[le] === '\r')) le++;
    const inizioRiga = ls === 0 || src[ls - 1] === '\n', fineRiga = le >= src.length || src[le] === '\n';
    if(inizioRiga && fineRiga){ out += src.slice(pos, ls); pos = le < src.length ? le + 1 : le; }
    else if(fineRiga){ out += src.slice(pos, ls); pos = le; }
    else { out += src.slice(pos, a) + (src.slice(a, b).includes('\n') ? '\n' : ' '); pos = b; }
  }
  return out + src.slice(pos);
}

let totale = 0;
for(const rel of file()){
  const p = path.join(RADICE, rel), src = fs.readFileSync(p, 'utf8');
  const ext = path.extname(rel);
  const r = ext === '.js' ? commentiJs(src) : ext === '.css' ? commentiCss(src) : commentiHtml(src);
  if(!r.length) continue;
  totale += r.length;
  if(SOLO_CONTROLLO){ console.log(`${rel}: ${r.length} commenti`); continue; }
  const pulito = togli(src, r);
  if(ext === '.js') commentiJs(pulito);
  fs.writeFileSync(p, pulito);
  console.log(`${rel}: tolti ${r.length} commenti`);
}
console.log(SOLO_CONTROLLO ? `Commenti trovati: ${totale}` : `Fatto: ${totale} commenti tolti`);
if(SOLO_CONTROLLO && totale) process.exitCode = 1;
