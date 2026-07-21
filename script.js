document.addEventListener("DOMContentLoaded", () => {
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

  // filtro galleria per destinazione
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightboxEl = document.querySelector(".lightbox");
  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const target = btn.dataset.filter;
        galleryItems.forEach(item => {
          const show = target === "all" || item.dataset.trip === target;
          item.style.display = show ? "" : "none";
        });
        if (lightboxEl) {
          lightboxEl.classList.remove("open");
          document.body.style.overflow = "";
        }
      });
    });
  }

  // lightbox: apre le foto della galleria a schermo intero
  const galleryGrid = document.querySelector(".gallery-grid");
  if (galleryGrid) {
    document.querySelectorAll(".gallery-item").forEach(item => {
      if (item.querySelector("img")) item.classList.add("has-img");
    });

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Chiudi">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Foto precedente">&#8249;</button>
      <img src="" alt="">
      <button class="lightbox-nav lightbox-next" aria-label="Foto successiva">&#8250;</button>
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector("img");
    const lbCaption = lightbox.querySelector(".lightbox-caption");
    let currentItems = [];
    let currentIndex = 0;

    const getVisibleItems = () =>
      Array.from(document.querySelectorAll(".gallery-item.has-img"))
        .filter(item => item.style.display !== "none");

    const showCurrent = () => {
      const item = currentItems[currentIndex];
      if (!item) return;
      const img = item.querySelector("img");
      const tag = item.querySelector(".tag");
      lbImg.src = img.src;
      lbImg.alt = img.alt || "";
      lbCaption.textContent = tag ? tag.textContent : "";
    };

    const openLightbox = (item) => {
      currentItems = getVisibleItems();
      currentIndex = currentItems.indexOf(item);
      showCurrent();
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
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
      const item = e.target.closest(".gallery-item.has-img");
      if (item) openLightbox(item);
    });

    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox-next").addEventListener("click", showNext);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", showPrev);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    });
  }
});
