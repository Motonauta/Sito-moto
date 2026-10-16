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
    blu: "#1E5FAE", crema: "#F5F0E6", verde: "#00FF00"
  };
  const FIRMA = "IL MOTONAUTA";
  const STILI = [
    { id: "copertina", nome: "Copertina", nota: "come le copertine delle guide" },
    { id: "nastro", nome: "Nastro", nota: "righe su strisce, inclinate" },
    { id: "contorno", nome: "Contorno", nota: "grande, con ombra piena" },
    { id: "cruscotto", nome: "Cruscotto", nota: "pannello nero con la luce rossa" }
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
      // a capo da soli, cercando righe di lunghezza simile
      const tot = parole.reduce((n, p) => n + p.t.length + 1, -1);
      const n = Math.max(1, Math.ceil(tot / maxChar));
      const limite = Math.max(Math.ceil(tot / n) + 2, ...parole.map(p => p.t.length));
      let riga = [], lung = 0;
      parole.forEach(p => {
        const add = (riga.length ? 1 : 0) + p.t.length;
        if(riga.length && lung + add > limite){ out.push(riga); riga = []; lung = 0; }
        riga.push(p); lung += (riga.length > 1 ? 1 : 0) + p.t.length;
      });
      if(riga.length) out.push(riga);
    }
    if(!conAsterischi && ultimaRossa){
      if(out.length > 1) out[out.length - 1].forEach(p => { p.rossa = true; });
      else if(out[0].length > 1) out[0][out[0].length - 1].rossa = true;
    }
    return out.map(r => r.map(p => ({ t: p.t.toUpperCase(), rossa: p.rossa })));
  }
  const largRighe = (rr, dim) => { const sp = larghezza(T, " ", dim); return rr.map(r => r.reduce((w, p, i) => w + larghezza(T, p.t, dim) + (i ? sp : 0), 0)); };
  // dimensione del carattere perché la riga più lunga stia in "larghezza"
  const adatta = (rr, larg, massimo) => Math.min(massimo, 100 * larg / Math.max(...largRighe(rr, 100), 1));
  // ogni parola con la sua posizione: { p, x, y, w }
  function posa(rr, dim, x0, y0, passo, centro){
    const sp = larghezza(T, " ", dim), larg = largRighe(rr, dim), out = [];
    rr.forEach((r, i) => {
      let x = centro == null ? x0 : centro - larg[i] / 2;
      r.forEach(p => { const w = larghezza(T, p.t, dim); out.push({ p, x, y: y0 + i * passo, w, riga: i }); x += w + sp; });
    });
    return out;
  }
  const d = (parole, dim, dx = 0, dy = 0) => parole.map(o => tracciato(T, o.p.t, o.x + dx, o.y + dy, dim)).join("");
  function firma(x, y, dim, colore){
    const sp = dim * 0.22;
    return `<circle cx="${n2(x + dim * 0.35)}" cy="${n2(y - dim * 0.36)}" r="${n2(dim * 0.3)}" fill="${C.rosso}"/>` +
      `<path d="${tracciato(M, FIRMA, x + dim * 1.05, y, dim, sp)}" fill="${colore}"/>`;
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
    stato.innerHTML = `<div class="ok">Fatto: quattro stili, scegli quello che ti piace e scaricalo.</div>`;
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

  // ---------- avvio --------------------------------------------------------
  function init(){
    if(!document.getElementById("panel-social")) return;
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
    }
    const posTitolo = () => { document.getElementById("sg-posizione-wrap").hidden = document.getElementById("sg-formato").value === "titolo"; };
    document.getElementById("sg-formato").addEventListener("change", posTitolo); posTitolo();
    document.getElementById("sg-titoli-btn").addEventListener("click", generaTitoli);
    document.getElementById("sg-green-btn").addEventListener("click", generaGreen);
    document.getElementById("sg-green-tutte").addEventListener("click", scaricaTutte);
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  // per le prove: await mnSocialGen.svg("copertina", "testo *rosso*", "titolo", "asfalto")
  window.mnSocialGen = {
    svg: async (stile, testo, formato = "titolo", sfondo = "trasparente", posizione = "centro", opz) => {
      await caratteri();
      return inquadra(DISEGNA[stile](righe(testo, 14, true), opz), formato, sfondo, posizione).svg;
    }
  };
})();
