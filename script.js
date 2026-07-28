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
      document.querySelectorAll(".gallery-item").forEach(item => {
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
});
