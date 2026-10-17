window.mnFmt = {
  euro(n){
    return Number(n).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  },
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
