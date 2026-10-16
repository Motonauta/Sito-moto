// Riquadri "TikTok" e "Instagram" (home e pagina Il Motonauta): il sito legge
// profilo e ultimi 9 contenuti dalle sue API (lib/tiktok.js, lib/instagram.js
// tramite /api/gallery), le anteprime arrivano da Cloudinary, quindi niente
// cookie dei social per chi visita. Finché i dati non arrivano, o se un social
// non risponde, resta la scheda col link scritta nell'HTML.
(function socialFeeds(){
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const icona = n => `<svg class="icon" aria-hidden="true"><use href="/icons.svg#i-${n}"/></svg>`;
  const intero = n => Number(n).toLocaleString("it-IT");
  // 1.900.000 → "1,9 Mln", 56.900 → "56.900" (il "Mio" automatico del browser in italiano si legge male)
  const breve = n => Number(n) >= 1e6
    ? `${(Number(n) / 1e6).toLocaleString("it-IT", { maximumFractionDigits: 1 })} Mln`
    : intero(n);

  async function carica(box){
    try{
      const res = await fetch(`/api/gallery?action=${box.dataset.feed}`);
      const data = await res.json();
      if(!data.collegato || !data.post || !data.post.length) return; // resta la scheda
      const p = data.profilo || {};
      const nome = p.username || box.dataset.utente;
      const numeri = [
        p.followers != null ? `${intero(p.followers)} follower` : "",
        p.likes != null ? `${breve(p.likes)} Mi piace` : "",
        p.post != null ? `${intero(p.post)} post` : "",
      ].filter(Boolean).join(" · ");
      const griglia = data.post.map(x => `
        <a class="ig-post" href="${esc(x.link)}" target="_blank" rel="noopener" title="${esc(x.didascalia)}">
          <img src="${esc(x.img)}" srcset="${esc(x.img)} 480w, ${esc(x.img2x)} 800w" sizes="(max-width: 780px) 33vw, 190px" alt="${esc(x.didascalia || "Contenuto social")}" loading="lazy" decoding="async">
          ${x.tipo === "video" ? `<span class="ig-post-tipo">${icona("play")}</span>` : x.tipo === "album" ? `<span class="ig-post-tipo">${icona("layers")}</span>` : ""}
        </a>`).join("");
      box.classList.add("is-loaded");
      box.innerHTML = `
        <a class="ig-head" href="${esc(box.dataset.profilo)}" target="_blank" rel="noopener">
          ${p.foto ? `<img class="ig-avatar" src="${esc(p.foto)}" alt="" width="56" height="56">` : `<span class="ig-avatar ig-avatar--icona">${icona(box.dataset.icona)}</span>`}
          <span class="ig-head-text"><span class="social-rete">${icona(box.dataset.icona)} ${esc(box.dataset.rete)}</span><strong>@${esc(nome)}</strong>${numeri ? `<span>${esc(numeri)}</span>` : ""}</span>
          <span class="btn solid ig-follow">Segui</span>
        </a>
        <div class="ig-grid">${griglia}</div>`;
    } catch(err){ /* resta la scheda con il link */ }
  }

  // solo quando la sezione si avvicina allo schermo
  const boxes = document.querySelectorAll(".social-box[data-feed]");
  if(!("IntersectionObserver" in window)) return boxes.forEach(carica);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ io.unobserve(e.target); carica(e.target); } });
  }, { rootMargin: "600px 0px" });
  boxes.forEach(b => io.observe(b));
})();
