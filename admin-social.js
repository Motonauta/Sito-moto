// Area riservata, scheda "Social": generatore di titoli e green screen per i
// video, nei colori e con i caratteri del sito. Tutto si disegna qui nel
// browser e si scarica come immagine vettoriale (SVG), un file per volta:
// le scritte sono trasformate in tracciati (opentype.js legge i caratteri del
// sito da /font/), quindi l'SVG viene uguale in qualsiasi programma, anche
// dove Oswald e JetBrains Mono non sono installati. Per i programmi che non
// aprono gli SVG c'è anche il PNG.
//
// Testo: le parole tra *asterischi* vengono in rosso; andando a capo si
// decidono le righe, altrimenti le divide il generatore. Senza asterischi
// l'ultima riga è rossa, come nelle copertine delle guide.
(function(){
  const C = {
    nero: "#0b0b0a", asfalto: "#1B1A17", rosso: "#C1272D", rossoChiaro: "#E8545A",
    blu: "#1E5FAE", crema: "#F5F0E6", verde: "#00FF00", oro: "#D9A441"
  };
  const FIRMA = "IL MOTONAUTA";
  const STILI = [
    { id: "copertina", nome: "Copertina", nota: "come le copertine delle guide" },
    { id: "nastro", nome: "Nastro", nota: "righe su strisce, inclinate" },
    { id: "contorno", nome: "Contorno", nota: "grande, con ombra piena" },
    { id: "cruscotto", nome: "Cruscotto", nota: "pannello nero con la luce rossa" },
    { id: "targa", nome: "Targa", nota: "la targa della moto, banda blu" },
    { id: "cartello", nome: "Cartello", nota: "cartello stradale di direzione" },
    { id: "neon", nome: "Neon", nota: "insegna luminosa rossa e blu" },
    { id: "toppa", nome: "Toppa", nota: "ricamata, come il logo" },
    { id: "diario", nome: "Diario", nota: "nastro di carta scritto a macchina" },
    { id: "evidenziatore", nome: "Evidenziatore", nota: "passata rossa sulle parole chiave" }
  ];
  const FORMATI = {
    titolo: null,
    reel: { w: 1080, h: 1920, larg: 0.86, alt: 0.36 },
    youtube: { w: 1920, h: 1080, larg: 0.62, alt: 0.52 },
    quadrato: { w: 1080, h: 1080, larg: 0.84, alt: 0.5 }
  };

  // ---------- caratteri: Oswald per i titoli, JetBrains Mono per la firma --
  let T = null, M = null;
  async function caratteri(){
    if(T && M) return;
    if(!window.opentype) throw new Error("opentype");
    const [a, b] = await Promise.all(["/font/oswald700.ttf", "/font/jbm700.ttf"]
      .map(u => fetch(u).then(r => { if(!r.ok) throw new Error(u); return r.arrayBuffer(); })));
    T = window.opentype.parse(a); M = window.opentype.parse(b);
  }
  const n2 = v => +v.toFixed(2);
  const larghezza = (f, t, dim, sp = 0) => f.getAdvanceWidth(t, dim, { kerning: true }) + sp * Math.max(0, [...t].length - 1);
  const maiuscole = (f, dim) => ((f.tables.os2 && f.tables.os2.sCapHeight) || f.charToGlyph("H").getBoundingBox().y2) / f.unitsPerEm * dim;
  function tracciato(f, t, x, y, dim, sp = 0){
    if(!sp) return f.getPath(t, x, y, dim, { kerning: true }).toPathData(2);
    let d = "";
    for(const ch of t){ d += f.getPath(ch, x, y, dim).toPathData(2); x += f.getAdvanceWidth(ch, dim) + sp; }
    return d;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- testo: righe e parole in rosso ------------------------------
  const PAROLINE = new Set(("IL LO LA I GLI LE L UN UNO UNA DI DA IN CON SU PER TRA FRA A E ED O MA CHE " +
    "DEL DELLO DELLA DEI DEGLI DELLE AL ALLO ALLA AI AGLI ALLE DAL DALLA DAI NEL NELLA NEI SUL SULLA SUI " +
    "COME PIÙ NON SE").split(" "));
  function righe(testo, maxChar, ultimaRossa){
    const raw = String(testo || "").replace(/\r/g, "").trim();
    const conAsterischi = /\*[^*]+\*/.test(raw);
    const aCapo = raw.includes("\n");
    const parole = [];
    let rossa = false, buf = "", nuovaRiga = false;
    const chiudi = () => { if(buf){ parole.push({ t: buf, rossa, aCapo: nuovaRiga }); buf = ""; nuovaRiga = false; } };
    for(const ch of raw){
      if(ch === "*"){ chiudi(); rossa = !rossa; continue; }
      if(ch === "\n"){ chiudi(); nuovaRiga = true; continue; }
      if(/\s/.test(ch)){ chiudi(); continue; }
      buf += ch;
    }
    chiudi();
    if(!parole.length) return [];
    const out = [];
    if(aCapo){
      parole.forEach((p, i) => { if(i === 0 || p.aCapo) out.push([]); out[out.length - 1].push(p); });
    } else {
      // a capo da soli: tra tutti i modi di spezzare sceglie quello con le
      // righe più vicine alla lunghezza giusta, meglio se va a capo dopo una
      // virgola o dove cambia colore, e mai lasciando in fondo alla riga
      // un "la", "di", "su"... (né una parolina da sola sull'ultima riga)
      const n = parole.length, obiettivo = maxChar * 0.85;
      const massimo = Math.max(Math.ceil(maxChar * 1.35), ...parole.map(p => p.t.length));
      const lung = (i, j) => parole.slice(i, j).reduce((s, p) => s + p.t.length, 0) + (j - i - 1);
      const costo = new Array(n + 1).fill(Infinity), da = new Array(n + 1).fill(0);
      costo[0] = 0;
      for(let j = 1; j <= n; j++) for(let i = j - 1; i >= 0; i--){
        const L = lung(i, j);
        if(L > massimo && j - i > 1) break;
        const scarto = j === n && L < obiettivo ? (obiettivo - L) * 0.7 : L - obiettivo;
        let c = costo[i] + scarto * scarto * 0.5 + 8;
        if(j < n){
          const ultima = parole[j - 1];
          if(/[,;:.!?]$/.test(ultima.t)) c -= 12;
          if(ultima.rossa !== parole[j].rossa) c -= 20;
          else if(ultima.rossa) c += 12; // meglio non spezzare il gruppo in rosso
          if(PAROLINE.has(ultima.t.toUpperCase())) c += 30;
        } else if(j - i === 1 && L <= 4 && n > 1) c += 15;
        if(c < costo[j]){ costo[j] = c; da[j] = i; }
      }
      const tagli = [];
      for(let j = n; j > 0; j = da[j]) tagli.unshift([da[j], j]);
      tagli.forEach(([i, j]) => out.push(parole.slice(i, j)));
    }
    if(!conAsterischi && ultimaRossa){
      if(out.length > 1) out[out.length - 1].forEach(p => { p.rossa = true; });
      else if(out[0].length > 1) out[0][out[0].length - 1].rossa = true;
    }
    return out.map(r => r.map(p => ({ t: p.t.toUpperCase(), rossa: p.rossa })));
  }
  // f = carattere: Oswald (T) se non si dice altro, JetBrains Mono (M) per il Diario
  const largRighe = (rr, dim, f = T) => { const sp = larghezza(f, " ", dim); return rr.map(r => r.reduce((w, p, i) => w + larghezza(f, p.t, dim) + (i ? sp : 0), 0)); };
  // dimensione del carattere perché la riga più lunga stia in "larghezza"
  const adatta = (rr, larg, massimo, f = T) => Math.min(massimo, 100 * larg / Math.max(...largRighe(rr, 100, f), 1));
  // ogni parola con la sua posizione: { p, x, y, w }
  function posa(rr, dim, x0, y0, passo, centro, f = T){
    const sp = larghezza(f, " ", dim), larg = largRighe(rr, dim, f), out = [];
    rr.forEach((r, i) => {
      let x = centro == null ? x0 : centro - larg[i] / 2;
      r.forEach(p => { const w = larghezza(f, p.t, dim); out.push({ p, x, y: y0 + i * passo, w, riga: i }); x += w + sp; });
    });
    return out;
  }
  const d = (parole, dim, dx = 0, dy = 0, f = T) => parole.map(o => tracciato(f, o.p.t, o.x + dx, o.y + dy, dim)).join("");
  const chiare = parole => parole.filter(o => !o.p.rossa), rosse = parole => parole.filter(o => o.p.rossa);
  function firma(x, y, dim, colore){
    const sp = dim * 0.22;
    return `<circle cx="${n2(x + dim * 0.35)}" cy="${n2(y - dim * 0.36)}" r="${n2(dim * 0.3)}" fill="${C.rosso}"/>` +
      `<path d="${tracciato(M, FIRMA, x + dim * 1.05, y, dim, sp)}" fill="${colore}"/>`;
  }
  const largFirma = dim => dim * 1.05 + larghezza(M, FIRMA, dim, dim * 0.22);
  // le parole rosse una accanto all'altra di ogni riga, come un pezzo unico: fn(x1, x2, y, riga)
  function gruppiRossi(rr, parole, fn){
    let out = "";
    rr.forEach((r, i) => {
      const sue = parole.filter(o => o.riga === i);
      let inizio = null;
      sue.forEach((o, k) => {
        if(o.p.rossa && inizio === null) inizio = o.x;
        if(o.p.rossa && !(sue[k + 1] && sue[k + 1].p.rossa)){ out += fn(inizio, o.x + o.w, o.y, i); inizio = null; }
      });
    });
    return out;
  }
  function stella(x, y, R){
    let p = "";
    for(let k = 0; k < 10; k++){
      const r = k % 2 ? R * 0.42 : R, a = -Math.PI / 2 + k * Math.PI / 5;
      p += `${k ? "L" : "M"}${n2(x + r * Math.cos(a))} ${n2(y + r * Math.sin(a))}`;
    }
    return p + "Z";
  }
  // ingombro di un disegno di iw×ih ruotato di "ang" gradi, più il margine P
  function ruotato(iw, ih, ang, P, dentro){
    const a = ang * Math.PI / 180;
    const w = iw * Math.cos(a) + ih * Math.abs(Math.sin(a)) + P * 2, h = iw * Math.abs(Math.sin(a)) + ih * Math.cos(a) + P * 2;
    return { w, h, corpo: `<g transform="translate(${n2(w / 2)} ${n2(h / 2)}) rotate(${ang}) translate(${n2(-iw / 2)} ${n2(-ih / 2)})">${dentro}</g>` };
  }

  // ---------- i quattro stili ---------------------------------------------
  // ognuno restituisce { w, h, defs, corpo } ritagliato attorno al titolo
  const DISEGNA = {
    copertina(rr, opz = {}){
      const F = adatta(rr, 960, 230), P = F * 0.22, dimFirma = opz.firma === false ? 0 : F * 0.19;
      const cap = maiuscole(T, F), passo = cap * 1.24, larg = largRighe(rr, F);
      const sopra = dimFirma ? dimFirma * 1.2 + F * 0.28 : F * 0.08;
      const w = Math.max(...larg) + P * 2, h = P + sopra + cap + passo * (rr.length - 1) + F * 0.32 + F * 0.11 + P;
      const parole = posa(rr, F, P, P + sopra + cap, passo);
      const yb = P + sopra + cap + passo * (rr.length - 1) + F * 0.32;
      let corpo = dimFirma ? firma(P, P + dimFirma, dimFirma, C.rossoChiaro) : "";
      corpo += `<path d="${d(parole, F)}" fill="none" stroke="${C.nero}" stroke-width="${n2(F * 0.11)}" stroke-linejoin="round"/>`;
      corpo += `<path d="${d(parole.filter(o => !o.p.rossa), F)}" fill="${C.crema}"/><path d="${d(parole.filter(o => o.p.rossa), F)}" fill="${C.rosso}"/>`;
      // la riga rossa e blu sotto, come sotto i titoli del sito
      corpo += `<rect x="${n2(P - F * 0.04)}" y="${n2(yb - F * 0.04)}" width="${n2(F * 1.28)}" height="${n2(F * 0.19)}" fill="${C.nero}"/>` +
        `<rect x="${n2(P)}" y="${n2(yb)}" width="${n2(F * 0.78)}" height="${n2(F * 0.11)}" fill="${C.rosso}"/>` +
        `<rect x="${n2(P + F * 0.78)}" y="${n2(yb)}" width="${n2(F * 0.42)}" height="${n2(F * 0.11)}" fill="${C.blu}"/>`;
      return { w, h, defs: "", corpo };
    },

    nastro(rr, opz = {}){
      const F = adatta(rr, 860, 200), cap = maiuscole(T, F), px = F * 0.24, py = F * 0.2, gap = F * 0.12;
      const larg = largRighe(rr, F), hRiga = cap + py * 2, sp = larghezza(T, " ", F);
      const dimFirma = F * 0.17, hFirma = opz.firma === false ? 0 : dimFirma * 2, sopra = hFirma ? hFirma + gap : F * 0.06;
      const iw = Math.max(...larg) + px * 2, ih = sopra + rr.length * hRiga + (rr.length - 1) * gap + F * 0.06;
      let dentro = "";
      if(hFirma){
        const wf = larghezza(M, FIRMA, dimFirma, dimFirma * 0.22) + dimFirma * 1.6;
        dentro += `<rect width="${n2(wf)}" height="${n2(hFirma)}" fill="${C.rosso}"/><path d="${tracciato(M, FIRMA, dimFirma * 0.8, hFirma * 0.68, dimFirma, dimFirma * 0.22)}" fill="${C.crema}"/>`;
      }
      const parole = posa(rr, F, px, 0, 0);
      rr.forEach((r, i) => {
        const y = sopra + i * (hRiga + gap);
        dentro += `<rect y="${n2(y)}" width="${n2(larg[i] + px * 2)}" height="${n2(hRiga)}" fill="${C.nero}"/><rect y="${n2(y)}" width="${n2(larg[i] + px * 2)}" height="${n2(F * 0.02)}" fill="#F5F0E6" fill-opacity="0.14"/>`;
        // le parole rosse una accanto all'altra vanno su un'unica striscia
        const sue = parole.filter(o => o.riga === i);
        let inizio = null;
        sue.forEach((o, k) => {
          if(o.p.rossa && inizio === null) inizio = o.x;
          if(o.p.rossa && !(sue[k + 1] && sue[k + 1].p.rossa)){
            dentro += `<rect x="${n2(inizio - px * 0.55)}" y="${n2(y - F * 0.05)}" width="${n2(o.x + o.w - inizio + px * 1.1)}" height="${n2(hRiga + F * 0.1)}" fill="${C.rosso}"/>`;
            inizio = null;
          }
        });
        dentro += `<path d="${sue.map(o => tracciato(T, o.p.t, o.x, y + py + cap, F)).join("")}" fill="${C.crema}"/>`;
      });
      // inclinato di poco, come un adesivo
      const ang = -2.2, a = ang * Math.PI / 180, P = F * 0.16;
      const w = iw * Math.cos(a) + ih * Math.abs(Math.sin(a)) + P * 2, h = iw * Math.abs(Math.sin(a)) + ih * Math.cos(a) + P * 2;
      return { w, h, defs: "", corpo: `<g transform="translate(${n2(w / 2)} ${n2(h / 2)}) rotate(${ang}) translate(${n2(-iw / 2)} ${n2(-ih / 2)})">${dentro}</g>` };
    },

    contorno(rr){
      const F = adatta(rr, 940, 240), cap = maiuscole(T, F), passo = cap * 1.2, larg = largRighe(rr, F);
      const ombra = F * 0.08, P = F * 0.2;
      const w = Math.max(...larg) + P * 2 + ombra, h = P * 2 + cap + passo * (rr.length - 1) + ombra;
      const parole = posa(rr, F, 0, P + cap, passo, (w - ombra) / 2);
      const tutte = d(parole, F), rosse = d(parole.filter(o => o.p.rossa), F);
      // ombra piena, poi contorno spesso, poi il colore
      let corpo = `<path d="${d(parole, F, ombra, ombra)}" fill="${C.nero}" stroke="${C.nero}" stroke-width="${n2(F * 0.16)}" stroke-linejoin="round"/>`;
      corpo += `<path d="${tutte}" fill="none" stroke="${C.nero}" stroke-width="${n2(F * 0.16)}" stroke-linejoin="round"/>`;
      corpo += `<path d="${d(parole.filter(o => !o.p.rossa), F)}" fill="${C.crema}"/><path d="${rosse}" fill="${C.rosso}"/>`;
      // un filo chiaro sulle parole rosse, così si staccano anche sul nero
      if(rosse) corpo += `<path d="${rosse}" fill="none" stroke="#F5F0E6" stroke-opacity="0.55" stroke-width="${n2(F * 0.018)}" stroke-linejoin="round"/>`;
      return { w, h, defs: "", corpo };
    },

    cruscotto(rr){
      const F = adatta(rr, 840, 190), cap = maiuscole(T, F), passo = cap * 1.26, larg = largRighe(rr, F);
      const pad = F * 0.42, dimFirma = F * 0.17, raggio = F * 0.22;
      const w = Math.max(...larg) + pad * 2;
      const yTit = pad + dimFirma * 1.3 + F * 0.36 + cap;
      const ym = yTit + passo * (rr.length - 1) + F * 0.42;
      const h = ym + F * 0.05 + pad * 0.8;
      const parole = posa(rr, F, pad, yTit, passo);
      const defs = `<clipPath id="cpPannello"><rect x="1" y="1" width="${n2(w - 2)}" height="${n2(h - 2)}" rx="${n2(raggio)}"/></clipPath>` +
        `<linearGradient id="cpStriscia" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${C.rosso}"/><stop offset="0.85" stop-color="${C.rosso}" stop-opacity="0"/></linearGradient>` +
        `<radialGradient id="cpAlone" cx="0" cy="0" r="${n2(w * 0.7)}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.rosso}" stop-opacity="0.2"/><stop offset="1" stop-color="${C.rosso}" stop-opacity="0"/></radialGradient>` +
        `<filter id="cpLuce" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="${n2(F * 0.11)}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
      let corpo = `<rect x="1" y="1" width="${n2(w - 2)}" height="${n2(h - 2)}" rx="${n2(raggio)}" fill="${C.nero}"/>`;
      corpo += `<g clip-path="url(#cpPannello)"><rect width="${n2(w)}" height="${n2(h)}" fill="url(#cpAlone)"/><rect width="${n2(w)}" height="${n2(F * 0.05)}" fill="url(#cpStriscia)"/></g>`;
      corpo += `<rect x="1" y="1" width="${n2(w - 2)}" height="${n2(h - 2)}" rx="${n2(raggio)}" fill="none" stroke="#F5F0E6" stroke-opacity="0.18" stroke-width="${n2(Math.max(2, F * 0.018))}"/>`;
      // spia rossa e nome, come le etichette del cruscotto
      corpo += `<circle cx="${n2(pad + dimFirma * 0.3)}" cy="${n2(pad + dimFirma * 0.62)}" r="${n2(dimFirma * 0.3)}" fill="${C.rosso}" filter="url(#cpLuce)"/>`;
      corpo += `<path d="${tracciato(M, FIRMA, pad + dimFirma, pad + dimFirma, dimFirma, dimFirma * 0.2)}" fill="#F5F0E6" fill-opacity="0.68"/>`;
      corpo += `<path d="${d(parole.filter(o => !o.p.rossa), F)}" fill="${C.crema}"/>`;
      const rosse = d(parole.filter(o => o.p.rossa), F);
      if(rosse) corpo += `<path d="${rosse}" fill="#e3343a" filter="url(#cpLuce)"/>`;
      // la mezzeria tratteggiata in fondo
      corpo += `<line x1="${n2(pad)}" y1="${n2(ym)}" x2="${n2(w - pad)}" y2="${n2(ym)}" stroke="#F5F0E6" stroke-opacity="0.35" stroke-width="${n2(F * 0.035)}" stroke-dasharray="${n2(F * 0.22)} ${n2(F * 0.18)}"/>`;
      return { w, h, defs, corpo };
    },

    targa(rr, opz = {}){
      // la targa della moto (due righe, come quelle italiane): banda blu con le
      // stelle e la "I", lettere scure in rilievo, viti, cornice nera con la firma
      const F = adatta(rr, 760, 210), cap = maiuscole(T, F), passo = cap * 1.32, larg = largRighe(rr, F);
      const bordo = F * 0.07, banda = F * 0.68, pad = F * 0.36, raggio = F * 0.2, ri = raggio - bordo * 0.6;
      const hTesto = cap + passo * (rr.length - 1);
      const pw = banda + pad * 2 + Math.max(...larg), ph = Math.max(hTesto + pad * 2, banda * 1.3);
      const cornice = opz.firma === false ? 0 : F * 0.3;
      const w = pw + bordo * 2, h = ph + bordo * 2 + cornice;
      const defs = `<clipPath id="tgPiastra"><rect x="${n2(bordo)}" y="${n2(bordo)}" width="${n2(pw)}" height="${n2(ph)}" rx="${n2(ri)}"/></clipPath>`;
      let corpo = `<rect width="${n2(w)}" height="${n2(h)}" rx="${n2(raggio)}" fill="${C.nero}"/>`;
      corpo += `<rect x="${n2(bordo)}" y="${n2(bordo)}" width="${n2(pw)}" height="${n2(ph)}" rx="${n2(ri)}" fill="${C.crema}"/>`;
      corpo += `<rect x="${n2(bordo)}" y="${n2(bordo)}" width="${n2(banda)}" height="${n2(ph)}" fill="${C.blu}" clip-path="url(#tgPiastra)"/>`;
      // dodici stelle in cerchio e la "I" sotto, al centro della banda
      const rs = banda * 0.3, R = banda * 0.075, dimI = banda * 0.62, capI = maiuscole(T, dimI), stacco = banda * 0.12;
      const cx = bordo + banda / 2, alto = bordo + (ph - (rs * 2 + R * 2 + stacco + capI)) / 2, cy = alto + R + rs;
      let stelle = "";
      for(let k = 0; k < 12; k++){ const a = k * Math.PI / 6; stelle += stella(cx + rs * Math.cos(a), cy + rs * Math.sin(a), R); }
      corpo += `<path d="${stelle}" fill="${C.oro}"/>`;
      corpo += `<path d="${tracciato(T, "I", cx - larghezza(T, "I", dimI) / 2, cy + rs + R + stacco + capI, dimI)}" fill="${C.crema}"/>`;
      const parole = posa(rr, F, bordo + banda + pad, bordo + (ph - hTesto) / 2 + cap, passo);
      corpo += `<path d="${d(parole, F, F * 0.018, F * 0.026)}" fill="${C.nero}" fill-opacity="0.22"/>`;
      corpo += `<path d="${d(chiare(parole), F)}" fill="${C.nero}"/><path d="${d(rosse(parole), F)}" fill="${C.rosso}"/>`;
      // le due viti in alto
      const vite = x => {
        const r = F * 0.055, y = bordo + Math.min(pad, (ph - hTesto) / 2) * 0.5;
        return `<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(r)}" fill="#B9B3A8" stroke="${C.nero}" stroke-opacity="0.45" stroke-width="${n2(F * 0.012)}"/>` +
          `<path d="M${n2(x - r * 0.6)} ${n2(y)}H${n2(x + r * 0.6)}" stroke="${C.nero}" stroke-opacity="0.55" stroke-width="${n2(F * 0.016)}"/>`;
      };
      corpo += vite(bordo + banda + pad * 0.5) + vite(bordo + pw - pad * 0.5);
      if(cornice){
        const df = F * 0.14, sp = df * 0.3, wf = larghezza(M, FIRMA, df, sp);
        corpo += `<path d="${tracciato(M, FIRMA, (w - wf) / 2, bordo + ph + (bordo + cornice) / 2 + maiuscole(M, df) / 2, df, sp)}" fill="#F5F0E6" fill-opacity="0.8"/>`;
      }
      return { w, h, defs, corpo };
    },

    cartello(rr, opz = {}){
      // il cartello di direzione blu con la punta, il filo bianco dentro al bordo,
      // le parole rosse su una targhetta e la firma sul pannello bianco sotto
      const F = adatta(rr, 780, 200), cap = maiuscole(T, F), passo = cap * 1.42, larg = largRighe(rr, F);
      const bordo = F * 0.08, filo = F * 0.05, spazio = F * 0.05;
      // tre passate sullo stesso contorno: bordo blu, filo chiaro, blu dentro
      const s3 = spazio * 2, s2 = s3 + filo * 2, s1 = s2 + bordo * 2, o = s1 / 2;
      const padx = F * 0.36, pady = F * 0.34, hTesto = cap + passo * (rr.length - 1);
      const ph = hTesto + pady * 2, bw = padx * 2 + Math.max(...larg), punta = Math.min(ph * 0.42, F * 0.8);
      const df = F * 0.15, hPan = opz.firma === false ? 0 : F * 0.36, stacco = F * 0.14;
      const w = bw + punta + o * 2, hCart = ph + o * 2, h = hCart + (hPan ? stacco + hPan + F * 0.03 : 0);
      const forma = `M${n2(o)} ${n2(o)}H${n2(o + bw)}L${n2(o + bw + punta)} ${n2(o + ph / 2)}L${n2(o + bw)} ${n2(o + ph)}H${n2(o)}Z`;
      const passata = (riempi, colore, spessore) => `<path d="${forma}" fill="${riempi}" stroke="${colore}" stroke-width="${n2(spessore)}" stroke-linejoin="round"/>`;
      let corpo = passata(C.blu, C.blu, s1) + passata("none", C.crema, s2) + passata(C.blu, C.blu, s3);
      const parole = posa(rr, F, o + padx, o + pady + cap, passo), m = F * 0.1;
      corpo += gruppiRossi(rr, parole, (x1, x2, y) =>
        `<rect x="${n2(x1 - m)}" y="${n2(y - cap - m)}" width="${n2(x2 - x1 + m * 2)}" height="${n2(cap + m * 2)}" rx="${n2(F * 0.07)}" fill="${C.rosso}" stroke="${C.crema}" stroke-width="${n2(F * 0.03)}"/>`);
      corpo += `<path d="${d(parole, F)}" fill="${C.crema}"/>`;
      if(hPan){
        const y = hCart + stacco, pw = largFirma(df) + df * 1.8;
        corpo += `<rect x="${n2(o)}" y="${n2(y)}" width="${n2(pw)}" height="${n2(hPan)}" rx="${n2(F * 0.06)}" fill="${C.crema}" stroke="${C.nero}" stroke-width="${n2(F * 0.03)}"/>`;
        corpo += firma(o + df * 0.9, y + hPan / 2 + maiuscole(M, df) / 2, df, C.nero);
      }
      return { w, h, defs: "", corpo };
    },

    neon(rr, opz = {}){
      // insegna al neon: le lettere sono tubi luminosi (bianco-blu e rosso) con
      // l'alone, su un'ombra scura sfumata che le fa leggere su qualsiasi video
      const F = adatta(rr, 900, 220), cap = maiuscole(T, F), passo = cap * 1.3, larg = largRighe(rr, F);
      const P = F * 0.5, df = F * 0.16, sopra = opz.firma === false ? 0 : df * 2.4;
      const w = Math.max(...larg) + P * 2, h = P * 2 + sopra + cap + passo * (rr.length - 1);
      const parole = posa(rr, F, 0, P + sopra + cap, passo, w / 2);
      const defs = `<filter id="neBuio" x="-25%" y="-50%" width="150%" height="200%"><feGaussianBlur stdDeviation="${n2(F * 0.1)}"/></filter>` +
        `<filter id="neAlone" x="-25%" y="-50%" width="150%" height="200%"><feGaussianBlur stdDeviation="${n2(F * 0.045)}"/></filter>`;
      const tubo = (dd, alone, colore, anima) => !dd ? "" :
        `<path d="${dd}" fill="none" stroke="${alone}" stroke-width="${n2(F * 0.1)}" stroke-linejoin="round" filter="url(#neAlone)"/>` +
        `<path d="${dd}" fill="none" stroke="${colore}" stroke-width="${n2(F * 0.042)}" stroke-linejoin="round"/>` +
        `<path d="${dd}" fill="none" stroke="${anima}" stroke-width="${n2(F * 0.014)}" stroke-linejoin="round"/>`;
      let corpo = `<path d="${d(parole, F)}" fill="${C.nero}" fill-opacity="0.55" stroke="${C.nero}" stroke-opacity="0.6" stroke-width="${n2(F * 0.16)}" stroke-linejoin="round" filter="url(#neBuio)"/>`;
      corpo += tubo(d(chiare(parole), F), "#2F7BE0", "#CFE4FF", "#FFFFFF") + tubo(d(rosse(parole), F), "#E0252C", "#FF4D55", "#FFE1E1");
      if(sopra){
        // la firma: una piccola insegna rossa piena, con due trattini ai lati
        const sp = df * 0.3, wf = larghezza(M, FIRMA, df, sp), x = (w - wf) / 2, y = P + df, ym = y - maiuscole(M, df) / 2;
        const p = tracciato(M, FIRMA, x, y, df, sp) + `M${n2(x - df * 2.2)} ${n2(ym)}H${n2(x - df * 0.8)}M${n2(x + wf + df * 0.8)} ${n2(ym)}H${n2(x + wf + df * 2.2)}`;
        corpo += `<path d="${p}" fill="#E0252C" stroke="#E0252C" stroke-width="${n2(df * 0.2)}" filter="url(#neAlone)"/>`;
        corpo += `<path d="${p}" fill="#FF8A8F" stroke="#FF8A8F" stroke-width="${n2(df * 0.08)}" stroke-linecap="round"/>`;
      }
      return { w, h, defs, corpo };
    },

    toppa(rr, opz = {}){
      // la toppa ricamata come il logo: bordo rosso a punto festone, cucitura
      // tratteggiata, lettere in rilievo col verso dei fili, un filo storta
      const F = adatta(rr, 780, 200), cap = maiuscole(T, F), passo = cap * 1.26, larg = largRighe(rr, F);
      const bordo = F * 0.17, padx = F * 0.5, pady = F * 0.4, df = F * 0.15, hFirma = opz.firma === false ? 0 : df * 2.3;
      const hTesto = cap + passo * (rr.length - 1);
      const iw = Math.max(...larg) + (bordo + padx) * 2, ih = hTesto + hFirma + (bordo + pady) * 2, r = Math.min(F * 0.42, ih / 2);
      const parole = posa(rr, F, 0, bordo + pady + hFirma + cap, passo, iw / 2);
      const defs = `<pattern id="tpFili" width="${n2(F * 0.045)}" height="${n2(F * 0.045)}" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><rect width="${n2(F * 0.016)}" height="${n2(F * 0.045)}" fill="${C.nero}" fill-opacity="0.16"/></pattern>` +
        `<pattern id="tpTrama" width="${n2(F * 0.06)}" height="${n2(F * 0.06)}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="${n2(F * 0.03)}" height="${n2(F * 0.06)}" fill="${C.crema}" fill-opacity="0.035"/></pattern>`;
      const rett = (dentro, resto) => `<rect x="${n2(dentro)}" y="${n2(dentro)}" width="${n2(iw - dentro * 2)}" height="${n2(ih - dentro * 2)}" rx="${n2(Math.max(0, r - dentro))}" ${resto}/>`;
      let corpo = rett(0, `fill="${C.nero}" fill-opacity="0.45" transform="translate(${n2(F * 0.03)} ${n2(F * 0.06)})"`);
      corpo += rett(0, `fill="${C.rosso}"`);
      corpo += rett(bordo / 2, `fill="none" stroke="#8E1A1F" stroke-width="${n2(bordo * 0.8)}" stroke-dasharray="${n2(F * 0.016)} ${n2(F * 0.026)}"`);
      corpo += rett(bordo, `fill="#24221E"`) + rett(bordo, `fill="url(#tpTrama)"`);
      corpo += rett(bordo + F * 0.11, `fill="none" stroke="${C.crema}" stroke-opacity="0.75" stroke-width="${n2(F * 0.024)}" stroke-dasharray="${n2(F * 0.075)} ${n2(F * 0.05)}" stroke-linecap="round"`);
      corpo += `<path d="${d(parole, F, 0, F * 0.03)}" fill="${C.nero}" fill-opacity="0.55"/>`;
      corpo += `<path d="${d(chiare(parole), F)}" fill="${C.crema}"/><path d="${d(rosse(parole), F)}" fill="${C.rossoChiaro}"/>`;
      corpo += `<path d="${d(parole, F)}" fill="url(#tpFili)"/>`;
      if(hFirma){
        const sp = df * 0.3, wf = larghezza(M, FIRMA, df, sp), x = (iw - wf) / 2, y = bordo + pady + df, ym = y - maiuscole(M, df) / 2;
        corpo += `<path d="${tracciato(M, FIRMA, x, y, df, sp)}" fill="${C.crema}" fill-opacity="0.72"/>`;
        corpo += `<path d="${stella(x - df * 0.9, ym, df * 0.42)}${stella(x + wf + df * 0.9, ym, df * 0.42)}" fill="${C.rossoChiaro}"/>`;
      }
      const g = ruotato(iw, ih, -3, F * 0.14, corpo);
      return { w: g.w, h: g.h, defs, corpo: g.corpo };
    },

    diario(rr, opz = {}){
      // strisce di nastro di carta strappate, scritte a macchina (JetBrains
      // Mono), ognuna un po' storta; in cima la striscia rossa "DIARIO DI BORDO"
      const F = adatta(rr, 820, 150, M), cap = maiuscole(M, F), larg = largRighe(rr, F, M);
      const px = F * 0.42, py = F * 0.34, dente = F * 0.09, hRiga = cap + py * 2, gap = F * 0.06, P = F * 0.16;
      const angoli = [-1.6, 1.2, -0.8, 1.5, -1.2, 0.7], scarti = [0, 0.35, 0.12, 0.42, 0.05, 0.28];
      const defs = `<linearGradient id="diCarta" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#F5F0E6"/><stop offset="1" stop-color="#E6DCC6"/></linearGradient>`;
      const strappo = [0.9, 0.3, 0.75, 0.15, 0.6, 1, 0.4];
      function carta(w, h, colore){
        const n = Math.max(4, Math.round(h / (dente * 1.4)));
        let p = `M${n2(dente * 0.5)} 0H${n2(w - dente * 0.4)}`;
        for(let k = 1; k < n; k++) p += `L${n2(w - dente * strappo[k % strappo.length])} ${n2(h * k / n)}`;
        p += `L${n2(w - dente * 0.6)} ${n2(h)}H${n2(dente * 0.3)}`;
        for(let k = n - 1; k > 0; k--) p += `L${n2(dente * strappo[(k + 3) % strappo.length])} ${n2(h * k / n)}`;
        return `<path d="${p}Z" fill="${C.nero}" fill-opacity="0.35" transform="translate(${n2(F * 0.02)} ${n2(F * 0.035)})"/><path d="${p}Z" fill="${colore}"/>`;
      }
      const voci = [];
      if(opz.firma !== false){
        const dt = F * 0.36, sp = dt * 0.2, t = "DIARIO DI BORDO", ht = maiuscole(M, dt) + dt * 0.9, wt = larghezza(M, t, dt, sp) + dt * 1.8;
        voci.push({ w: wt, h: ht, x: F * 0.1, ang: 2.2, fondo: C.rosso,
          testo: `<path d="${tracciato(M, t, dt * 0.9, ht / 2 + maiuscole(M, dt) / 2, dt, sp)}" fill="${C.crema}"/>` });
      }
      rr.forEach((r, i) => {
        const pp = posa([r], F, px, py + cap, 0, null, M);
        voci.push({ w: larg[i] + px * 2, h: hRiga, x: F * scarti[i % scarti.length], ang: angoli[i % angoli.length], fondo: "url(#diCarta)",
          testo: `<path d="${d(chiare(pp), F, 0, 0, M)}" fill="${C.nero}"/><path d="${d(rosse(pp), F, 0, 0, M)}" fill="${C.rosso}"/>` });
      });
      // una sotto l'altra, poi l'ingombro vero contando le rotazioni
      let y = 0, x1 = Infinity, x2 = -Infinity, y1 = Infinity, y2 = -Infinity;
      voci.forEach(v => {
        v.y = y; y += v.h + gap;
        const a = v.ang * Math.PI / 180, cx = v.x + v.w / 2, cy = v.y + v.h / 2;
        const ex = (v.w * Math.abs(Math.cos(a)) + v.h * Math.abs(Math.sin(a))) / 2, ey = (v.w * Math.abs(Math.sin(a)) + v.h * Math.abs(Math.cos(a))) / 2;
        x1 = Math.min(x1, cx - ex); x2 = Math.max(x2, cx + ex); y1 = Math.min(y1, cy - ey); y2 = Math.max(y2, cy + ey);
      });
      let corpo = "";
      voci.forEach(v => {
        corpo += `<g transform="translate(${n2(v.x + v.w / 2 + P - x1)} ${n2(v.y + v.h / 2 + P - y1)}) rotate(${v.ang}) translate(${n2(-v.w / 2)} ${n2(-v.h / 2)})">${carta(v.w, v.h, v.fondo)}${v.testo}</g>`;
      });
      return { w: x2 - x1 + P * 2, h: y2 - y1 + P * 2, defs, corpo };
    },

    evidenziatore(rr, opz = {}){
      // lettere chiare col contorno nero e una passata di evidenziatore rosso
      // dietro le parole chiave: il contorno sparisce dove passa il pennarello
      const F = adatta(rr, 920, 230), cap = maiuscole(T, F), passo = cap * 1.24, larg = largRighe(rr, F);
      const P = F * 0.3, df = F * 0.17, sotto = opz.firma === false ? 0 : df * 2.4;
      const w = Math.max(...larg) + P * 2, h = P * 2 + cap + passo * (rr.length - 1) + F * 0.1 + sotto;
      const parole = posa(rr, F, P, P + cap, passo), tutte = d(parole, F);
      let corpo = `<path d="${tutte}" fill="none" stroke="${C.nero}" stroke-width="${n2(F * 0.1)}" stroke-linejoin="round"/>`;
      corpo += gruppiRossi(rr, parole, (a, b, y, i) => {
        // punta a scalpello: le due estremità tagliate in obliquo, bordi un po' mossi
        // (sulle parole corte, come il numero dei green screen, il taglio è meno obliquo)
        const x1 = a - F * 0.14, x2 = b + F * 0.14, ya = y - cap * 0.8, yb = y + F * 0.1, inc = Math.min(F * 0.16, (x2 - x1) * 0.1), ond = F * 0.03, s = i % 2 ? 1 : -1, m = (x1 + x2) / 2;
        const passata = `M${n2(x1 + inc)} ${n2(ya + ond * s)}Q${n2(m)} ${n2(ya - ond * s * 1.5)} ${n2(x2)} ${n2(ya)}L${n2(x2 - inc)} ${n2(yb)}Q${n2(m)} ${n2(yb + ond * s)} ${n2(x1)} ${n2(yb - ond * s)}Z`;
        const riga = k => `M${n2(x1 + inc * 1.2)} ${n2(ya + (yb - ya) * k)}L${n2(x2 - inc * 0.8)} ${n2(ya + (yb - ya) * (k - 0.04))}`;
        return `<path d="${passata}" fill="${C.rosso}" fill-opacity="0.95"/><path d="${riga(0.28)}${riga(0.74)}" stroke="${C.rossoChiaro}" stroke-opacity="0.45" stroke-width="${n2(F * 0.02)}" stroke-linecap="round"/>`;
      });
      corpo += `<path d="${tutte}" fill="${C.crema}"/>`;
      if(sotto){
        const y = h - P - df * 0.5;
        corpo += `<g stroke="${C.nero}" stroke-width="${n2(df * 0.28)}" stroke-linejoin="round">${firma(P, y, df, C.nero)}</g>${firma(P, y, df, C.crema)}`;
      }
      return { w, h, defs: "", corpo };
    }
  };

  // ---------- il file SVG: solo il titolo o l'inquadratura intera ---------
  function inquadra(t, formato, sfondo, posizione){
    const f = FORMATI[formato];
    const fondo = (W, H) => sfondo === "trasparente" ? "" : `<rect width="${W}" height="${H}" fill="${sfondo === "verde" ? C.verde : C.asfalto}"/>`;
    let W, H, corpo;
    if(!f){
      W = Math.ceil(t.w); H = Math.ceil(t.h);
      corpo = fondo(W, H) + t.corpo;
    } else {
      W = f.w; H = f.h;
      const s = Math.min(f.w * f.larg / t.w, f.h * f.alt / t.h), w = t.w * s, h = t.h * s, x = (f.w - w) / 2;
      // in basso nei reel resta sopra alla zona di didascalia e pulsanti
      const basso = formato === "reel" ? 0.74 : 0.9;
      const y = posizione === "alto" ? f.h * 0.1 : posizione === "basso" ? f.h * basso - h : (f.h - h) / 2;
      corpo = fondo(W, H) + `<g transform="translate(${n2(x)} ${n2(y)}) scale(${+s.toFixed(4)})">${t.corpo}</g>`;
    }
    return { W, H, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${t.defs ? `<defs>${t.defs}</defs>` : ""}${corpo}</svg>` };
  }

  // ---------- scarico: SVG, o PNG per chi non apre gli SVG ----------------
  function scarica(blob, nome){
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = nome;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  const blobSvg = img => new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${img.svg}`], { type: "image/svg+xml" });
  function blobPng(img){
    return new Promise((ok, ko) => {
      const im = new Image();
      im.onload = () => {
        const c = document.createElement("canvas"); c.width = img.W; c.height = img.H;
        c.getContext("2d").drawImage(im, 0, 0, img.W, img.H);
        c.toBlob(b => b ? ok(b) : ko(new Error("png")), "image/png");
      };
      im.onerror = ko;
      im.src = URL.createObjectURL(blobSvg(img));
    });
  }
  const nomeFile = s => String(s).replace(/\*/g, "").normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "titolo";

  function scheda(img, titolo, sotto, nome){
    const fig = document.createElement("figure");
    fig.className = "sg-card";
    fig.innerHTML = `<div class="sg-preview"></div><figcaption><strong></strong><span></span></figcaption>` +
      `<div class="sg-azioni"><button type="button" class="admin-btn" data-svg>Scarica SVG</button><button type="button" class="admin-btn outline" data-png>PNG</button></div>`;
    const anteprima = new Image(); anteprima.alt = titolo;
    anteprima.src = URL.createObjectURL(blobSvg(img));
    fig.querySelector(".sg-preview").appendChild(anteprima);
    fig.querySelector("strong").textContent = titolo;
    fig.querySelector("span").textContent = sotto;
    fig.querySelector("[data-svg]").addEventListener("click", () => scarica(blobSvg(img), `${nome}.svg`));
    fig.querySelector("[data-png]").addEventListener("click", async () => scarica(await blobPng(img), `${nome}.png`));
    return fig;
  }
  function salva(chiave, valore){ try{ localStorage.setItem(chiave, JSON.stringify(valore)); } catch(err){} }
  function leggi(chiave){ try{ return JSON.parse(localStorage.getItem(chiave) || "null"); } catch(err){ return null; } }
  async function pronti(stato){
    try{ await caratteri(); return true; }
    catch(err){ stato.innerHTML = `<div class="err">Non riesco a caricare i caratteri del sito: controlla la connessione e riprova.</div>`; return false; }
  }

  // ---------- generatore di titoli ----------------------------------------
  async function generaTitoli(){
    const testo = document.getElementById("sg-titolo").value;
    const formato = document.getElementById("sg-formato").value;
    const sfondo = document.getElementById("sg-sfondo").value;
    const posizione = document.getElementById("sg-posizione").value;
    const out = document.getElementById("sg-titoli-out"), stato = document.getElementById("sg-titoli-stato");
    salva("mn-sg-titolo", { testo, formato, sfondo, posizione });
    out.innerHTML = "";
    if(!righe(testo, 14, true).length){ stato.innerHTML = `<div class="err">Scrivi prima il titolo nel riquadro.</div>`; return; }
    stato.innerHTML = `<div>Disegno i titoli...</div>`;
    if(!await pronti(stato)) return;
    STILI.forEach(st => {
      const img = inquadra(DISEGNA[st.id](righe(testo, 14, true)), formato, sfondo, posizione);
      out.appendChild(scheda(img, st.nome, st.nota, `titolo-${st.id}-${nomeFile(testo)}`));
    });
    stato.innerHTML = `<div class="ok">Fatto: ${STILI.length} stili, scegli quello che ti piace e scaricalo.</div>`;
  }

  // ---------- green screen a punti ----------------------------------------
  let ultimeGreen = [];
  async function generaGreen(){
    const campi = [...document.querySelectorAll(".sg-punto")];
    const stile = document.getElementById("sg-g-stile").value;
    const formato = document.getElementById("sg-g-formato").value;
    const posizione = document.getElementById("sg-g-posizione").value;
    const out = document.getElementById("sg-green-out"), stato = document.getElementById("sg-green-stato");
    salva("mn-sg-green", { punti: campi.map(i => i.value), stile, formato, posizione });
    const pieni = campi.map(i => i.value.trim()).filter(Boolean);
    out.innerHTML = ""; ultimeGreen = [];
    document.getElementById("sg-green-tutte").hidden = true;
    if(!pieni.length){ stato.innerHTML = `<div class="err">Scrivi almeno un argomento in una casella.</div>`; return; }
    stato.innerHTML = `<div>Disegno ${pieni.length === 1 ? "il green screen" : `${pieni.length} green screen`}...</div>`;
    if(!await pronti(stato)) return;
    pieni.forEach((arg, i) => {
      // il numero è rosso, il resto chiaro (via gli asterischi dell'argomento)
      const testo = `*${i + 1})* ${arg.replace(/\*/g, "")}`;
      const img = inquadra(DISEGNA[stile](righe(testo, 16, false), { firma: false }), formato, "verde", posizione);
      const nome = `green-${String(i + 1).padStart(2, "0")}-${nomeFile(arg)}`;
      ultimeGreen.push({ img, nome });
      out.appendChild(scheda(img, `${i + 1}) ${arg}`, `${nome}.svg`, nome));
    });
    document.getElementById("sg-green-tutte").hidden = false;
    stato.innerHTML = `<div class="ok">Fatto: ${pieni.length === 1 ? "un green screen" : `${pieni.length} green screen`}, numerati nell'ordine delle caselle compilate.</div>`;
  }
  // un file SVG per ogni punto, uno dopo l'altro (niente ZIP)
  async function scaricaTutte(){
    const stato = document.getElementById("sg-green-stato");
    for(const g of ultimeGreen){
      scarica(blobSvg(g.img), `${g.nome}.svg`);
      await new Promise(r => setTimeout(r, 350));
    }
    stato.innerHTML = `<div class="ok">Scaricati ${ultimeGreen.length} file SVG. Se il browser chiede il permesso di scaricare più file, rispondi di sì.</div>`;
  }

  // ---------- generatore di copertine --------------------------------------
  // La foto si apre dal disco con un indirizzo "blob:" che vale solo in questa
  // pagina e si disegna su una tela (canvas): non va a nessun server e non si
  // salva da nessuna parte (niente localStorage, a differenza dei titoli).
  // Ogni stile mette sopra alla foto il titolo dello stile omonimo.
  const COP_FORMATI = {
    youtube: { w: 1280, h: 720 },
    // nella griglia del profilo Instagram e TikTok si vede solo il 3:4 centrale
    reel: { w: 1080, h: 1920, sicura: 0.125 },
    post: { w: 1080, h: 1350 },
    quadrato: { w: 1080, h: 1080 }
  };
  const FUOCHI = { centro: [0.5, 0.5], sinistra: [0, 0.5], destra: [1, 0.5], alto: [0.5, 0], basso: [0.5, 1] };
  // la zona dove stanno le scritte: margini e, nei reel, la parte che si vede nella griglia
  function zona(f){
    const M = Math.min(f.w, f.h), m = M * 0.065, alto = f.sicura ? f.h * f.sicura : 0;
    return { x: m, y: alto + m, w: f.w - m * 2, h: f.h - (alto + m) * 2, y2: f.h - alto - m, M, oriz: f.w > f.h * 1.2 };
  }
  const piena = f => ({ x: 0, y: 0, w: f.w, h: f.h });
  const sfuma = (id, x2, y2, colore, da, a) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${colore}" stop-opacity="${da}"/><stop offset="1" stop-color="${colore}" stop-opacity="${a}"/></linearGradient>`;
  const vignetta = (id, forza) => `<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.75"><stop offset="0.4" stop-color="${C.nero}" stop-opacity="0"/><stop offset="1" stop-color="${C.nero}" stop-opacity="${forza}"/></radialGradient>`;
  const velo = (f, y, h, colore) => `<rect y="${n2(y)}" width="${f.w}" height="${n2(h)}" fill="${colore}"/>`;

  // ogni stile: dove va la foto, cosa ci va sopra (velo) e il riquadro del titolo
  // (box, allineato con ax/ay: 0 = sinistra/alto, 0.5 = centro, 1 = destra/basso)
  const COPERTINE = {
    copertina(f, Z){
      // come le copertine delle guide: foto che sfuma nell'asfalto, titolo accanto
      if(Z.oriz){
        const fx = f.w * 0.36;
        return { foto: { x: fx, y: 0, w: f.w - fx, h: f.h }, defs: sfuma("cvA", 1, 0, C.asfalto, 1, 0),
          velo: `<rect x="${n2(fx - 1)}" width="${n2(f.w * 0.34)}" height="${f.h}" fill="url(#cvA)"/>`,
          box: { x: Z.x, y: Z.y, w: f.w * 0.5, h: Z.h }, ax: 0, ay: 0.5 };
      }
      const fh = f.h * (f.sicura ? 0.6 : 0.58);
      return { foto: { x: 0, y: 0, w: f.w, h: fh }, defs: sfuma("cvA", 0, 1, C.asfalto, 0, 1),
        velo: velo(f, fh * 0.6, fh * 0.4 + 1, "url(#cvA)"),
        box: { x: Z.x, y: fh * 0.9, w: Z.w, h: Z.y2 - fh * 0.9 }, ax: 0, ay: 0.5 };
    },
    nastro(f, Z){
      return { foto: piena(f), defs: sfuma("cvA", 0, 1, C.nero, 0, 0.7), velo: velo(f, f.h * 0.4, f.h * 0.6, "url(#cvA)"),
        box: Z.oriz ? { x: Z.x, y: f.h * 0.38, w: f.w * 0.6, h: Z.y2 - f.h * 0.38 } : { x: Z.x, y: Z.y + Z.h * 0.45, w: Z.w, h: Z.h * 0.55 }, ax: 0, ay: 1 };
    },
    contorno(f, Z){
      return { foto: piena(f), defs: vignetta("cvV", 0.75),
        velo: `<rect width="${f.w}" height="${f.h}" fill="${C.nero}" fill-opacity="0.15"/><rect width="${f.w}" height="${f.h}" fill="url(#cvV)"/>`,
        box: Z.oriz ? { x: f.w * 0.1, y: f.h * 0.18, w: f.w * 0.8, h: f.h * 0.64 } : { x: Z.x, y: Z.y + Z.h * 0.22, w: Z.w, h: Z.h * 0.56 }, ax: 0.5, ay: 0.5 };
    },
    cruscotto(f, Z){
      return { foto: piena(f), defs: sfuma("cvA", 0, 1, C.nero, 0, 0.55),
        velo: velo(f, f.h * 0.5, f.h * 0.5, "url(#cvA)") + velo(f, f.h - Z.M * 0.014, Z.M * 0.014, C.rosso),
        box: Z.oriz ? { x: Z.x, y: f.h * 0.42, w: f.w * 0.56, h: Z.y2 - f.h * 0.42 } : { x: Z.x, y: Z.y + Z.h * 0.5, w: Z.w, h: Z.h * 0.5 },
        ax: Z.oriz ? 0 : 0.5, ay: 1, car: 13 };
    },
    targa(f, Z){
      return { foto: piena(f), defs: sfuma("cvA", 0, 1, C.nero, 0, 0.5), velo: velo(f, f.h * 0.55, f.h * 0.45, "url(#cvA)"),
        box: Z.oriz ? { x: Z.x, y: f.h * 0.5, w: f.w * 0.5, h: Z.y2 - f.h * 0.5 } : { x: Z.x + Z.w * 0.05, y: Z.y + Z.h * 0.56, w: Z.w * 0.9, h: Z.h * 0.44 },
        ax: Z.oriz ? 0 : 0.5, ay: 1 };
    },
    cartello(f, Z){
      return { foto: piena(f), defs: sfuma("cvA", 0, 1, C.nero, 0.5, 0), velo: velo(f, 0, Z.y + Z.h * 0.5, "url(#cvA)"),
        box: Z.oriz ? { x: Z.x, y: Z.y, w: f.w * 0.58, h: f.h * 0.5 } : { x: Z.x, y: Z.y, w: Z.w * 0.94, h: Z.h * 0.42 }, ax: 0, ay: 0 };
    },
    neon(f, Z){
      // foto scurita e tinta di blu e rosso, come di sera sotto un'insegna
      const tinta = `<linearGradient id="cvT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.blu}" stop-opacity="0.32"/><stop offset="1" stop-color="${C.rosso}" stop-opacity="0.26"/></linearGradient>`;
      return { foto: piena(f), defs: tinta + vignetta("cvV", 0.8),
        velo: `<rect width="${f.w}" height="${f.h}" fill="${C.nero}" fill-opacity="0.5"/><rect width="${f.w}" height="${f.h}" fill="url(#cvT)"/><rect width="${f.w}" height="${f.h}" fill="url(#cvV)"/>`,
        box: Z.oriz ? { x: f.w * 0.08, y: f.h * 0.14, w: f.w * 0.84, h: f.h * 0.72 } : { x: Z.x, y: Z.y + Z.h * 0.2, w: Z.w, h: Z.h * 0.6 }, ax: 0.5, ay: 0.5 };
    },
    toppa(f, Z){
      return { foto: piena(f), defs: vignetta("cvV", 0.55), velo: `<rect width="${f.w}" height="${f.h}" fill="url(#cvV)"/>`,
        box: Z.oriz ? { x: Z.x, y: f.h * 0.16, w: f.w * 0.5, h: f.h * 0.68 } : { x: Z.x, y: Z.y + Z.h * 0.48, w: Z.w, h: Z.h * 0.52 },
        ax: Z.oriz ? 0 : 0.5, ay: Z.oriz ? 0.5 : 1 };
    },
    diario(f, Z){
      // la foto come una polaroid storta, attaccata con lo scotch, sulla stessa
      // foto sfocata e scurita; la firma scritta sul bordo bianco
      let pw, ph, cx, cy, ang, box;
      if(Z.oriz){
        pw = f.w * 0.48; ph = pw * 0.75; ang = 3;
        cx = f.w * 0.7; cy = f.h * 0.5;
        box = { x: Z.x, y: Z.y, w: f.w * 0.42, h: Z.h };
      } else {
        ph = Z.h * 0.58 / (1 + 0.17 * 1.2); pw = ph * 1.2;
        if(pw > Z.w * 0.9){ pw = Z.w * 0.9; ph = pw / 1.2; }
        ang = -2.5; cx = f.w / 2;
        const fh = ph + pw * 0.17;
        cy = Z.y + fh / 2 + Z.M * 0.02;
        box = { x: Z.x, y: Z.y + fh + Z.M * 0.06, w: Z.w, h: Z.y2 - (Z.y + fh + Z.M * 0.06) };
      }
      const pad = pw * 0.04, basso = pw * 0.13, fw = pw + pad * 2, fh = ph + pad + basso;
      const k = { x: cx - fw / 2, y: cy - fh / 2, w: fw, h: fh };
      const scotch = (x, y, a) => `<rect x="${n2(x - fw * 0.11)}" y="${n2(y - fw * 0.028)}" width="${n2(fw * 0.22)}" height="${n2(fw * 0.056)}" fill="#E6DCC6" fill-opacity="0.82" transform="rotate(${a} ${n2(x)} ${n2(y)})"/>`;
      const df = basso * 0.26, sp = df * 0.3, wf = larghezza(M, FIRMA, df, sp);
      const sopra = scotch(k.x + fw * 0.06, k.y + fw * 0.02, -32) + scotch(k.x + fw * 0.94, k.y + fw * 0.02, 32) +
        `<path d="${tracciato(M, FIRMA, cx - wf / 2, k.y + fh - basso / 2 + maiuscole(M, df) / 2, df, sp)}" fill="${C.nero}" fill-opacity="0.7"/>`;
      return { sfocato: true, foto: { x: cx - pw / 2, y: k.y + pad, w: pw, h: ph, cx, cy, ang, cornice: k },
        velo: `<g transform="rotate(${ang} ${n2(cx)} ${n2(cy)})">${sopra}</g>`, box, ax: Z.oriz ? 0 : 0.5, ay: 0.5 };
    },
    evidenziatore(f, Z){
      if(Z.oriz) return { foto: piena(f), defs: sfuma("cvA", 1, 0, C.nero, 0.75, 0),
        velo: `<rect width="${n2(f.w * 0.68)}" height="${f.h}" fill="url(#cvA)"/>`, box: { x: Z.x, y: Z.y, w: f.w * 0.55, h: Z.h }, ax: 0, ay: 0.5 };
      return { foto: piena(f), defs: sfuma("cvA", 0, 1, C.nero, 0, 0.75), velo: velo(f, f.h * 0.38, f.h * 0.62, "url(#cvA)"),
        box: { x: Z.x, y: Z.y + Z.h * 0.42, w: Z.w, h: Z.h * 0.58 }, ax: 0, ay: 1 };
    }
  };

  const caricaImg = src => new Promise((ok, ko) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ko(new Error("img")); im.src = src; });
  // la foto ritagliata per riempire il riquadro r, tenendo la parte scelta
  function disegnaFoto(ctx, img, r, fuoco){
    const iw = img.naturalWidth, ih = img.naturalHeight, s = Math.max(r.w / iw, r.h / ih), sw = r.w / s, sh = r.h / s;
    ctx.drawImage(img, (iw - sw) * fuoco[0], (ih - sh) * fuoco[1], sw, sh, r.x, r.y, r.w, r.h);
  }
  async function rendiCopertina(stile, img, testo, formato, fuoco){
    const f = COP_FORMATI[formato], Z = zona(f), L = COPERTINE[stile](f, Z), fc = FUOCHI[fuoco] || FUOCHI.centro;
    const tela = document.createElement("canvas"); tela.width = f.w; tela.height = f.h;
    const ctx = tela.getContext("2d"); ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = C.asfalto; ctx.fillRect(0, 0, f.w, f.h);
    if(L.sfocato){
      // sfocatura alla buona ma uguale su tutti i browser: foto minuscola ingrandita
      const pic = document.createElement("canvas"); pic.width = 40; pic.height = Math.max(1, Math.round(40 * f.h / f.w));
      disegnaFoto(pic.getContext("2d"), img, { x: 0, y: 0, w: pic.width, h: pic.height }, fc);
      ctx.drawImage(pic, 0, 0, f.w, f.h);
      ctx.fillStyle = "rgba(11,11,10,0.6)"; ctx.fillRect(0, 0, f.w, f.h);
    }
    const p = L.foto;
    if(p.cornice){
      ctx.save();
      ctx.translate(p.cx, p.cy); ctx.rotate(p.ang * Math.PI / 180); ctx.translate(-p.cx, -p.cy);
      ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = Z.M * 0.04; ctx.shadowOffsetY = Z.M * 0.012;
      ctx.fillStyle = C.crema; ctx.fillRect(p.cornice.x, p.cornice.y, p.cornice.w, p.cornice.h);
      ctx.shadowColor = "transparent";
      disegnaFoto(ctx, img, p, fc);
      ctx.restore();
    } else disegnaFoto(ctx, img, p, fc);
    // sopra la foto: veli, decorazioni e titolo, disegnati in vettoriale
    const t = DISEGNA[stile](righe(testo, L.car || 12, true));
    const s = Math.min(L.box.w / t.w, L.box.h / t.h);
    const x = L.box.x + (L.box.w - t.w * s) * L.ax, y = L.box.y + (L.box.h - t.h * s) * L.ay;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${f.w}" height="${f.h}" viewBox="0 0 ${f.w} ${f.h}"><defs>${L.defs || ""}${t.defs}</defs>${L.velo || ""}` +
      `<g transform="translate(${n2(x)} ${n2(y)}) scale(${+s.toFixed(4)})">${t.corpo}</g></svg>`;
    const u = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    try{ ctx.drawImage(await caricaImg(u), 0, 0, f.w, f.h); } finally { URL.revokeObjectURL(u); }
    return tela;
  }
  const aBlob = (tela, tipo, q) => new Promise((ok, ko) => tela.toBlob(b => b ? ok(b) : ko(new Error("blob")), tipo, q));
  async function inJpg(tela, formato){
    let b = await aBlob(tela, "image/jpeg", 0.9);
    // YouTube accetta miniature fino a 2 MB
    if(formato === "youtube" && b.size > 2e6) b = await aBlob(tela, "image/jpeg", 0.8);
    return b;
  }
  const svuotaTela = tela => { tela.width = 0; tela.height = 0; };

  // tutto quello che c'è in memoria: la foto e le anteprime (indirizzi blob:)
  const cop = { img: null, url: null, anteprime: [], giro: 0 };
  const el = id => document.getElementById(id);
  function liberaCopertine(){
    cop.anteprime.forEach(u => URL.revokeObjectURL(u)); cop.anteprime = [];
    if(el("cg-out")) el("cg-out").innerHTML = "";
  }
  function lasciaFoto(){
    if(cop.url) URL.revokeObjectURL(cop.url);
    cop.img = null; cop.url = null;
    const info = el("cg-foto-info");
    if(info){ info.hidden = true; info.querySelector("img").removeAttribute("src"); info.querySelector("span").textContent = ""; }
  }
  function cancellaCopertine(avvisa){
    cop.giro++; // ferma una generazione ancora in corso
    liberaCopertine(); lasciaFoto();
    if(!el("cg-foto")) return;
    el("cg-foto").value = ""; el("cg-titolo").value = "";
    el("cg-stato").innerHTML = avvisa ? `<div class="ok">Cancellato: la foto, il testo e le copertine non sono più nella pagina.</div>` : "";
  }
  async function sceltaFoto(){
    const file = el("cg-foto").files[0], stato = el("cg-stato"), info = el("cg-foto-info");
    cop.giro++; liberaCopertine(); lasciaFoto(); stato.innerHTML = "";
    if(!file) return;
    const url = URL.createObjectURL(file);
    try{
      const img = await caricaImg(url);
      cop.img = img; cop.url = url;
      info.querySelector("img").src = url;
      info.querySelector("span").textContent = `${file.name} · ${img.naturalWidth}×${img.naturalHeight}`;
      info.hidden = false;
      if(Math.max(img.naturalWidth, img.naturalHeight) < 1000)
        stato.innerHTML = `<div class="err">La foto è piccola (${img.naturalWidth}×${img.naturalHeight}): la copertina potrebbe venire sgranata.</div>`;
    } catch(err){
      URL.revokeObjectURL(url);
      el("cg-foto").value = "";
      stato.innerHTML = `<div class="err">Non riesco ad aprire questa foto: prova con un JPG o un PNG (le foto HEIC dell'iPhone sul computer a volte non si aprono).</div>`;
    }
  }
  function schedaCopertina(blob, st, testo, formato, fuoco){
    const f = COP_FORMATI[formato], nome = `copertina-${st.id}-${nomeFile(testo)}`;
    const fig = document.createElement("figure");
    fig.className = "sg-card";
    fig.innerHTML = `<div class="sg-preview"></div><figcaption><strong></strong><span></span></figcaption>` +
      `<div class="sg-azioni"><button type="button" class="admin-btn" data-jpg>Scarica JPG</button><button type="button" class="admin-btn outline" data-png>PNG</button></div>`;
    const u = URL.createObjectURL(blob); cop.anteprime.push(u);
    const im = new Image(); im.alt = `Copertina in stile ${st.nome}`; im.src = u;
    fig.querySelector(".sg-preview").appendChild(im);
    fig.querySelector("strong").textContent = st.nome;
    fig.querySelector("span").textContent = `${f.w}×${f.h} · ${Math.max(1, Math.round(blob.size / 1024))} KB`;
    fig.querySelector("[data-jpg]").addEventListener("click", () => scarica(blob, `${nome}.jpg`));
    fig.querySelector("[data-png]").addEventListener("click", async e => {
      if(!cop.img) return;
      const b = e.currentTarget; b.disabled = true;
      try{ const tela = await rendiCopertina(st.id, cop.img, testo, formato, fuoco); const png = await aBlob(tela, "image/png"); svuotaTela(tela); scarica(png, `${nome}.png`); }
      catch(err){ el("cg-stato").innerHTML = `<div class="err">Non sono riuscito a preparare il PNG: riprova o scarica il JPG.</div>`; }
      finally{ b.disabled = false; }
    });
    return fig;
  }
  async function generaCopertine(){
    const testo = el("cg-titolo").value, formato = el("cg-formato").value, fuoco = el("cg-fuoco").value;
    const stato = el("cg-stato"), out = el("cg-out"), btn = el("cg-btn");
    if(!cop.img){ stato.innerHTML = `<div class="err">Scegli prima una foto.</div>`; return; }
    if(!righe(testo, 12, true).length){ stato.innerHTML = `<div class="err">Scrivi cosa vuoi sulla copertina.</div>`; return; }
    liberaCopertine();
    const giro = ++cop.giro;
    btn.disabled = true;
    try{
      if(!await pronti(stato)) return;
      for(let i = 0; i < STILI.length; i++){
        stato.innerHTML = `<div>Preparo la copertina ${i + 1} di ${STILI.length}...</div>`;
        const tela = await rendiCopertina(STILI[i].id, cop.img, testo, formato, fuoco);
        const blob = await inJpg(tela, formato); svuotaTela(tela);
        if(giro !== cop.giro) return; // nel frattempo è stato cancellato tutto o cambiata foto
        out.appendChild(schedaCopertina(blob, STILI[i], testo, formato, fuoco));
      }
      stato.innerHTML = `<div class="ok">Fatto: ${STILI.length} copertine. Scarica quella che ti piace; quando hai finito premi "Cancella tutto" (o chiudi la pagina) e la foto sparisce dalla memoria.</div>`;
    } catch(err){
      if(giro === cop.giro) stato.innerHTML = `<div class="err">Qualcosa è andato storto nel disegnare le copertine: riprova.</div>`;
    } finally { btn.disabled = false; }
  }

  // ---------- avvio --------------------------------------------------------
  function init(){
    if(!document.getElementById("panel-social")) return;
    const sceltaStile = document.getElementById("sg-g-stile");
    STILI.forEach(st => sceltaStile.add(new Option(`${st.nome} — ${st.nota}`, st.id)));
    const lista = document.getElementById("sg-punti");
    for(let i = 1; i <= 10; i++){
      const r = document.createElement("label");
      r.className = "sg-punto-riga";
      r.innerHTML = `<span>${i})</span><input type="text" class="admin-input sg-punto" maxlength="70" placeholder="Argomento ${i}">`;
      lista.appendChild(r);
    }
    const t = leggi("mn-sg-titolo");
    if(t){
      document.getElementById("sg-titolo").value = t.testo || "";
      ["formato", "sfondo", "posizione"].forEach(k => { if(t[k]) document.getElementById(`sg-${k}`).value = t[k]; });
    }
    const g = leggi("mn-sg-green");
    if(g){
      [...lista.querySelectorAll(".sg-punto")].forEach((el, i) => { el.value = (g.punti || [])[i] || ""; });
      ["stile", "formato", "posizione"].forEach(k => { if(g[k]) document.getElementById(`sg-g-${k}`).value = g[k]; });
      if(!sceltaStile.value) sceltaStile.selectedIndex = 0;
    }
    const posTitolo = () => { document.getElementById("sg-posizione-wrap").hidden = document.getElementById("sg-formato").value === "titolo"; };
    document.getElementById("sg-formato").addEventListener("change", posTitolo); posTitolo();
    document.getElementById("sg-titoli-btn").addEventListener("click", generaTitoli);
    document.getElementById("sg-green-btn").addEventListener("click", generaGreen);
    document.getElementById("sg-green-tutte").addEventListener("click", scaricaTutte);
    if(el("cg-foto")){
      el("cg-foto").addEventListener("change", sceltaFoto);
      el("cg-btn").addEventListener("click", generaCopertine);
      el("cg-cancella").addEventListener("click", () => cancellaCopertine(true));
      // chiudendo o lasciando la pagina non resta niente in memoria
      window.addEventListener("pagehide", () => cancellaCopertine(false));
    }
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  // per le prove: await mnSocialGen.svg("copertina", "testo *rosso*", "titolo", "asfalto")
  window.mnSocialGen = {
    righe: (testo, maxChar = 14) => righe(testo, maxChar, true).map(r => r.map(p => p.rossa ? `*${p.t}*` : p.t).join(" ")),
    svg: async (stile, testo, formato = "titolo", sfondo = "trasparente", posizione = "centro", opz) => {
      await caratteri();
      return inquadra(DISEGNA[stile](righe(testo, 14, true), opz), formato, sfondo, posizione).svg;
    }
  };
})();
