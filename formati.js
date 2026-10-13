// Numeri all'italiana, uguali in tutto il sito: 72,15 €, 8 h 12 min, 1.250 km.
// File a parte, caricato in cima alle pagine che fanno calcoli (home,
// Nostromo): i loro script possono usarli prima che arrivi script.js, che
// sta in fondo alla pagina.
window.mnFmt = {
  euro(n){
    return Number(n).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  },
  // ore in decimale (es. 8.2) → "8 h 12 min"; sotto l'ora solo i minuti
  ore(h){
    const tot = Math.max(0, Math.round(Number(h) * 60));
    const ore = Math.floor(tot / 60), min = tot % 60;
    if (!ore) return `${min} min`;
    return min ? `${ore} h ${min} min` : `${ore} h`;
  },
  km(n){
    return Math.round(Number(n)).toLocaleString("it-IT") + " km";
  },
};
