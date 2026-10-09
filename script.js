document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // parallasse leggero sulla foto hero, durante lo scroll
  const heroParallax = document.querySelector(".hero-parallax");
  if (heroParallax && !prefersReducedMotion) {
    const frame = heroParallax.closest(".hero-parallax-frame") || heroParallax;
    let ticking = false;

    const updateParallax = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        heroParallax.style.transform = `translateY(${rect.top * 0.12}px)`;
      }
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  // logo in header: leggera inclinazione 3D verso il cursore
  if (!prefersReducedMotion) {
    const logoLink = document.querySelector(".logo");
    if (logoLink) {
      const maxTilt = 8;
      logoLink.addEventListener("mousemove", (e) => {
        const rect = logoLink.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        logoLink.style.setProperty("--tilt-x", `${px * maxTilt}deg`);
        logoLink.style.setProperty("--tilt-y", `${py * -maxTilt}deg`);
      });
      logoLink.addEventListener("mouseleave", () => {
        logoLink.style.setProperty("--tilt-x", "0deg");
        logoLink.style.setProperty("--tilt-y", "0deg");
      });
    }
  }

  // intro "accendi il motore" in home: appare solo una volta a sessione
  const ignitionOverlay = document.getElementById("ignition-overlay");
  if (ignitionOverlay) {
    const alreadySeen = sessionStorage.getItem("motonauta_ignition_seen");
    if (alreadySeen || prefersReducedMotion) {
      ignitionOverlay.remove();
    } else {
      const btn = ignitionOverlay.querySelector(".ignition-btn");
      const skipBtn = ignitionOverlay.querySelector(".ignition-skip");
      let started = false;

      function makeNoiseBuffer(ctx, duration) {
        const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        return buffer;
      }

      function playEngineStart() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        const master = ctx.createGain();
        master.gain.value = 0.5;
        master.connect(ctx.destination);

        // fase 1: motorino d'avviamento (cranking), a scatti
        const crankDuration = 0.55;
        const crankOsc = ctx.createOscillator();
        crankOsc.type = "square";
        crankOsc.frequency.setValueAtTime(9, now);
        crankOsc.frequency.linearRampToValueAtTime(13, now + crankDuration);

        const crankGain = ctx.createGain();
        crankGain.gain.setValueAtTime(0.0001, now);
        for (let t = 0; t < crankDuration; t += 1 / 11) {
          crankGain.gain.setValueAtTime(0.35, now + t);
          crankGain.gain.linearRampToValueAtTime(0.05, now + Math.min(t + 0.05, crankDuration));
        }

        const crankFilter = ctx.createBiquadFilter();
        crankFilter.type = "bandpass";
        crankFilter.frequency.value = 220;
        crankFilter.Q.value = 4;

        crankOsc.connect(crankFilter).connect(crankGain).connect(master);
        crankOsc.start(now);
        crankOsc.stop(now + crankDuration);

        const crankNoise = ctx.createBufferSource();
        crankNoise.buffer = makeNoiseBuffer(ctx, crankDuration);
        const crankNoiseFilter = ctx.createBiquadFilter();
        crankNoiseFilter.type = "bandpass";
        crankNoiseFilter.frequency.value = 900;
        crankNoiseFilter.Q.value = 1.2;
        const crankNoiseGain = ctx.createGain();
        crankNoiseGain.gain.value = 0.12;
        crankNoise.connect(crankNoiseFilter).connect(crankNoiseGain).connect(master);
        crankNoise.start(now);
        crankNoise.stop(now + crankDuration);

        // fase 2: il motore attacca, sale di giri un attimo e si assesta al minimo
        const catchStart = now + crankDuration;
        const idleDuration = 2.6;

        [0, 2].forEach((detune) => {
          const osc = ctx.createOscillator();
          osc.type = "sawtooth";
          osc.detune.value = detune;
          osc.frequency.setValueAtTime(70, catchStart);
          osc.frequency.linearRampToValueAtTime(140, catchStart + 0.25);
          osc.frequency.linearRampToValueAtTime(48, catchStart + 1.0);

          const engineFilter = ctx.createBiquadFilter();
          engineFilter.type = "lowpass";
          engineFilter.frequency.value = 900;

          const engineGain = ctx.createGain();
          engineGain.gain.setValueAtTime(0.0001, catchStart);
          engineGain.gain.linearRampToValueAtTime(0.4, catchStart + 0.1);
          engineGain.gain.linearRampToValueAtTime(0.24, catchStart + 1.0);
          engineGain.gain.linearRampToValueAtTime(0.0001, catchStart + idleDuration);

          osc.connect(engineFilter).connect(engineGain).connect(master);
          osc.start(catchStart);
          osc.stop(catchStart + idleDuration);
        });

        const idleNoise = ctx.createBufferSource();
        idleNoise.buffer = makeNoiseBuffer(ctx, idleDuration);
        const idleFilter = ctx.createBiquadFilter();
        idleFilter.type = "lowpass";
        idleFilter.frequency.value = 300;
        const idleGain = ctx.createGain();
        idleGain.gain.setValueAtTime(0.0001, catchStart);
        idleGain.gain.linearRampToValueAtTime(0.15, catchStart + 0.15);
        idleGain.gain.linearRampToValueAtTime(0.0001, catchStart + idleDuration);
        idleNoise.connect(idleFilter).connect(idleGain).connect(master);
        idleNoise.start(catchStart);
        idleNoise.stop(catchStart + idleDuration);

        setTimeout(() => ctx.close(), (crankDuration + idleDuration + 0.3) * 1000);
      }

      function reveal() {
        ignitionOverlay.classList.add("ignition-reveal");
        sessionStorage.setItem("motonauta_ignition_seen", "1");
        setTimeout(() => ignitionOverlay.remove(), 1200);
      }

      function startIgnition() {
        if (started) return;
        started = true;
        ignitionOverlay.classList.add("ignition-started");
        try { playEngineStart(); } catch (err) { /* audio non disponibile: si procede comunque */ }
        setTimeout(reveal, 550);
      }

      btn.addEventListener("click", startIgnition);
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          startIgnition();
        }
      });
      skipBtn.addEventListener("click", () => {
        sessionStorage.setItem("motonauta_ignition_seen", "1");
        ignitionOverlay.remove();
      });
    }
  }

  // transizione tra pagine: la moneta col logo attraversa lo schermo una sola
  // volta (da sinistra a destra, girando su se stessa per tutto il tragitto)
  // quando lasci la pagina, con una scritta onomatopeica casuale ferma al
  // centro; sulla pagina di arrivo c'è solo una dissolvenza, senza ripetere
  // l'animazione
  const TRANSITION_KEY = "motonauta-transition";
  const TRANSITION_SOUNDS = [
    "Brum bruuuum",
    "Brap braaap",
    "Rattattattattaaaaa",
    "Vrooom vrooom",
    "Broppopoppoppoopp",
    "Gorogorogorogorogoro",
    "Bum pow pow pow pow",
    "Ninoooo ninoooo",
  ];

  if (sessionStorage.getItem(TRANSITION_KEY)) {
    sessionStorage.removeItem(TRANSITION_KEY);
    if (!prefersReducedMotion) {
      const overlay = document.createElement("div");
      overlay.className = "page-transition pt-arriving";
      document.body.appendChild(overlay);
      overlay.addEventListener("animationend", () => overlay.remove(), { once: true });
      setTimeout(() => overlay.remove(), 500);
    }
  }

  if (!prefersReducedMotion) {
    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        /^https?:\/\//i.test(href) ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank"
      ) return;

      link.addEventListener("click", (e) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();

        const sound = TRANSITION_SOUNDS[Math.floor(Math.random() * TRANSITION_SOUNDS.length)];
        const overlay = document.createElement("div");
        overlay.className = "page-transition pt-leaving";
        overlay.innerHTML = `
          <img class="pt-coin" alt="" src="https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto,w_152,h_152,c_fill/v1784625192/IMG_1429_ufj4tu.jpg">
          <span class="pt-sound">${sound}</span>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => {
          sessionStorage.setItem(TRANSITION_KEY, "1");
          window.location.href = href;
        }, 950);
      });
    });
  }

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    const openMenu = () => {
      links.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    const closeMenu = () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      links.querySelectorAll(".nav-dropdown-menu.open").forEach(m => m.classList.remove("open"));
      links.querySelectorAll('.nav-dropdown-toggle[aria-expanded="true"]').forEach(t => t.setAttribute("aria-expanded", "false"));
    };

    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (links.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // chiude il menu quando si clicca un link
    links.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", closeMenu)
    );

    // chiude il menu quando si clicca fuori
    document.addEventListener("click", (e) => {
      if (links.classList.contains("open") && !links.contains(e.target) && e.target !== toggle) {
        closeMenu();
      }
    });

    // chiude il menu con il tasto Esc
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // chiude il menu se lo schermo torna largo (es. rotazione tablet)
    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) closeMenu();
    });
  }

  // Sottomenu a tendina della nav ("Strumenti di viaggio", "Chi sono"):
  // su desktop si aprono anche al passaggio del mouse (solo CSS), questo
  // gestisce il click/tocco (necessario su touch, dove l'hover non esiste)
  // e la chiusura automatica degli altri sottomenu aperti.
  const navDropdowns = document.querySelectorAll(".nav-dropdown");
  if (navDropdowns.length) {
    const closeDropdown = (dropdown) => {
      dropdown.querySelector(".nav-dropdown-menu")?.classList.remove("open");
      dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
    };
    const closeAllDropdowns = (except) => {
      navDropdowns.forEach(d => { if (d !== except) closeDropdown(d); });
    };

    navDropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector(".nav-dropdown-toggle");
      const menu = dropdown.querySelector(".nav-dropdown-menu");
      if (!toggle || !menu) return;

      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains("open");
        closeAllDropdowns(dropdown);
        menu.classList.toggle("open", !isOpen);
        toggle.setAttribute("aria-expanded", String(!isOpen));
      });
    });

    document.addEventListener("click", (e) => {
      if (![...navDropdowns].some(d => d.contains(e.target))) closeAllDropdowns();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllDropdowns();
    });
  }

  // filtro galleria per destinazione (delegato: funziona anche con pulsanti aggiunti dopo)
  const filtersContainer = document.querySelector(".filters");
  const galleryGrid = document.querySelector(".gallery-grid");
  let lightbox = null;

  function closeLightboxIfOpen(){
    if(lightbox){
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      const mc = lightbox.querySelector(".lightbox-media");
      if(mc) mc.innerHTML = "";
    }
  }

  if (filtersContainer) {
    filtersContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filtersContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.filter;
      document.querySelectorAll(".gallery-item, .gallery-city-heading").forEach(item => {
        const show = target === "all" || item.dataset.trip === target;
        item.style.display = show ? "" : "none";
      });
      closeLightboxIfOpen();
    });
  }

  // lightbox: apre le foto della galleria a schermo intero (delegato sul contenitore)
  if (galleryGrid) {
    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Chiudi">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Foto precedente">&#8249;</button>
      <div class="lightbox-media"></div>
      <button class="lightbox-nav lightbox-next" aria-label="Foto successiva">&#8250;</button>
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(lightbox);

    const mediaContainer = lightbox.querySelector(".lightbox-media");
    const lbCaption = lightbox.querySelector(".lightbox-caption");
    let currentItems = [];
    let currentIndex = 0;

    const getVisibleItemsWithImg = () =>
      Array.from(document.querySelectorAll(".gallery-item"))
        .filter(item => item.querySelector("img, video") && item.style.display !== "none");

    const showCurrent = () => {
      const item = currentItems[currentIndex];
      if (!item) return;
      const mediaEl = item.querySelector("img, video");
      const tag = item.querySelector(".tag");
      if (mediaEl.tagName === "VIDEO") {
        mediaContainer.innerHTML = `<video src="${mediaEl.currentSrc || mediaEl.src}" controls autoplay playsinline></video>`;
      } else {
        mediaContainer.innerHTML = `<img src="${mediaEl.src}" alt="${mediaEl.alt || ''}">`;
      }
      lbCaption.textContent = tag ? tag.textContent : "";
    };

    const openLightbox = (item) => {
      currentItems = getVisibleItemsWithImg();
      currentIndex = currentItems.indexOf(item);
      showCurrent();
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    const showNext = () => {
      currentIndex = (currentIndex + 1) % currentItems.length;
      showCurrent();
    };
    const showPrev = () => {
      currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
      showCurrent();
    };

    galleryGrid.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery-item");
      if (item && item.querySelector("img, video")) openLightbox(item);
    });

    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightboxIfOpen);
    lightbox.querySelector(".lightbox-next").addEventListener("click", showNext);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", showPrev);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightboxIfOpen();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightboxIfOpen();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    });
  }

  // pulsante "torna su": compare dopo un po' di scroll, su tutte le pagine
  const backToTop = document.createElement("button");
  backToTop.id = "back-to-top";
  backToTop.type = "button";
  backToTop.setAttribute("aria-label", "Torna in cima alla pagina");
  backToTop.innerHTML = "&#8593;";
  document.body.appendChild(backToTop);

  let backToTopTicking = false;
  const updateBackToTop = () => {
    backToTop.classList.toggle("visible", window.scrollY > 600);
    backToTopTicking = false;
  };
  window.addEventListener("scroll", () => {
    if (!backToTopTicking) {
      window.requestAnimationFrame(updateBackToTop);
      backToTopTicking = true;
    }
  }, { passive: true });
  updateBackToTop();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  // pulsante "copia link" riusabile: basta dare a un <button> la classe
  // .copy-link-btn (e opzionalmente data-copy="URL"; senza, copia l'URL
  // della pagina corrente) per avere copia negli appunti + conferma animata
  // ovunque nel sito, senza bisogno di altro JS per pagina
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".copy-link-btn");
    if (!btn) return;

    const text = btn.dataset.copy || window.location.href;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }

    if (!btn.dataset.originalLabel) {
      btn.dataset.originalLabel = btn.innerHTML;
    }
    btn.innerHTML = "✓ Copiato";
    btn.classList.add("copied");
    clearTimeout(btn._copyResetTimer);
    btn._copyResetTimer = setTimeout(() => {
      btn.innerHTML = btn.dataset.originalLabel;
      btn.classList.remove("copied");
    }, 2000);
  });

  // ricerca globale (itinerari, viaggi da ricordare e guide del Manuale di
  // bordo): pulsante iniettato nell'header di ogni pagina, dati caricati al
  // primo utilizzo da data/viaggi-data.js e data/manuale-data.js se non già
  // presenti nella pagina corrente
  (function initSiteSearch(){
    const headerWrap = document.querySelector(".site-header .wrap");
    if (!headerWrap) return;

    const trigger = document.createElement("button");
    trigger.id = "site-search-trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-label", "Cerca nel sito");
    trigger.innerHTML = "🔍";
    const navToggle = headerWrap.querySelector(".nav-toggle");
    if (navToggle) {
      headerWrap.insertBefore(trigger, navToggle);
    } else {
      headerWrap.appendChild(trigger);
    }

    const overlay = document.createElement("div");
    overlay.id = "site-search-overlay";
    overlay.innerHTML = `
      <div class="site-search-box">
        <div class="site-search-input-row">
          <span>🔍</span>
          <input type="text" id="site-search-input" placeholder="Cerca un itinerario, un viaggio o una guida..." autocomplete="off">
          <button type="button" class="site-search-close" aria-label="Chiudi ricerca">&times;</button>
        </div>
        <p class="site-search-hint">Scrivi almeno 2 lettere per cercare tra itinerari, viaggi e guide del Manuale di bordo.</p>
        <div class="site-search-results" id="site-search-results"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector("#site-search-input");
    const resultsEl = overlay.querySelector("#site-search-results");
    const closeBtn = overlay.querySelector(".site-search-close");

    function loadScript(src){
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    let dataPromise = null;
    function loadSearchData(){
      if (!dataPromise) {
        dataPromise = Promise.all([
          window.VIAGGI_DATA ? Promise.resolve() : loadScript("/data/viaggi-data.js"),
          window.MANUALE_DATA ? Promise.resolve() : loadScript("/data/manuale-data.js"),
        ]);
      }
      return dataPromise;
    }

    function escapeSearchHtml(str){
      return String(str)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    // Toglie accenti (città → citta) per confrontare parole indipendentemente
    // da come sono scritte: prima la ricerca falliva su "citta" se il testo
    // aveva "città", o su "borgo" scritto in ordine diverso da come appare
    // nel testo, perché cercava solo la frase intera come un'unica sottostringa.
    function normalizeSearch(str){
      return String(str).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }

    let searchIndex = null;
    function buildSearchIndex(){
      const items = [];
      if (window.VIAGGI_DATA) {
        const { ITINERARI, MINIVIAGGI, VIAGGI_RICORDARE, getSlug } = window.VIAGGI_DATA;
        const groups = [
          ["Itinerario", ITINERARI],
          ["Miniviaggio", MINIVIAGGI],
          ["Viaggio da ricordare", VIAGGI_RICORDARE],
        ];
        groups.forEach(([cat, list]) => {
          list.forEach(it => {
            items.push({
              cat, title: it.titolo, desc: it.desc,
              href: `/viaggi/${getSlug(it)}`,
              haystack: normalizeSearch(`${it.titolo} ${it.zona} ${it.desc}`),
            });
          });
        });
      }
      if (window.MANUALE_DATA) {
        const { GUIDE, getSlug } = window.MANUALE_DATA;
        GUIDE.forEach(g => {
          items.push({
            cat: "Manuale di bordo", title: g.titolo, desc: g.excerpt,
            href: `/manuale/${getSlug(g)}`,
            haystack: normalizeSearch(`${g.titolo} ${g.categoria} ${g.excerpt}`),
          });
        });
      }
      return items;
    }

    function runSearch(query){
      const q = normalizeSearch(query.trim());
      if (q.length < 2) {
        resultsEl.innerHTML = "";
        return;
      }
      if (!searchIndex) searchIndex = buildSearchIndex();
      // ogni parola della ricerca deve comparire da qualche parte nel testo
      // (non più un'unica frase esatta): "moto enduro" trova anche un
      // itinerario che parla di "enduro in moto" o le cita in paragrafi diversi
      const words = q.split(/\s+/).filter(Boolean);
      const matches = searchIndex
        .filter(item => words.every(w => item.haystack.includes(w)))
        .sort((a, b) => {
          const aExact = a.haystack.includes(q) ? 0 : 1;
          const bExact = b.haystack.includes(q) ? 0 : 1;
          return aExact - bExact;
        })
        .slice(0, 20);
      if (!matches.length) {
        resultsEl.innerHTML = `<p class="site-search-hint" style="padding:16px 0;">Nessun risultato per "${escapeSearchHtml(query.trim())}".</p>`;
        return;
      }
      resultsEl.innerHTML = matches.map(m => `
        <a class="site-search-result" href="${m.href}">
          <p class="site-search-result-cat">${escapeSearchHtml(m.cat)}</p>
          <p class="site-search-result-title">${escapeSearchHtml(m.title)}</p>
          <p class="site-search-result-desc">${escapeSearchHtml(m.desc)}</p>
        </a>
      `).join("");
    }

    let searchDebounceTimer = null;
    input.addEventListener("input", () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => runSearch(input.value), 150);
    });

    function openSearch(){
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      loadSearchData().then(() => {
        if (input.value.trim().length >= 2) runSearch(input.value);
      }).catch(() => {
        resultsEl.innerHTML = `<p class="site-search-hint" style="padding:16px 0;">Ricerca non disponibile al momento. Riprova più tardi.</p>`;
      });
      setTimeout(() => input.focus(), 50);
    }
    function closeSearch(){
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }

    trigger.addEventListener("click", openSearch);
    closeBtn.addEventListener("click", closeSearch);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeSearch();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("open")) closeSearch();
    });
  })();
});
