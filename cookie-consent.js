(function () {
  const CONSENT_KEY = "motonauta_cookie_consent";
  const GA_ID = "G-546ZL2T52G";

  function loadAnalytics() {
    if (window.dataLayer) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA_ID);
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  }

  function showBanner() {
    if (document.querySelector(".cookie-banner")) return;

    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Consenso cookie");
    banner.innerHTML = `
      <div class="cookie-banner-text">
        <p class="marker">Cookie</p>
        <p>Uso Google Analytics solo per capire quante persone visitano il sito.
        Si attiva soltanto se accetti. Leggi la <a href="privacy.html">privacy &amp; cookie policy</a>.</p>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" class="btn" id="cookie-reject">Rifiuta</button>
        <button type="button" class="btn solid" id="cookie-accept">Accetta</button>
      </div>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add("visible"));

    function dismiss() {
      banner.classList.remove("visible");
      setTimeout(() => banner.remove(), 450);
    }

    banner.querySelector("#cookie-accept").addEventListener("click", () => {
      localStorage.setItem(CONSENT_KEY, "accepted");
      loadAnalytics();
      dismiss();
    });
    banner.querySelector("#cookie-reject").addEventListener("click", () => {
      localStorage.setItem(CONSENT_KEY, "rejected");
      dismiss();
    });
  }

  const consent = localStorage.getItem(CONSENT_KEY);
  if (consent === "accepted") {
    loadAnalytics();
  } else if (consent !== "rejected") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showBanner);
    } else {
      showBanner();
    }
  }
})();
