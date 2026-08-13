// Dati condivisi delle guide del Manuale di bordo: stesso schema di
// data/viaggi-data.js, un solo file caricato sia dal browser (manuale.html,
// per l'elenco) sia dalle funzioni serverless (api/manuale.js, per generare
// la pagina dedicata di ogni guida).
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.MANUALE_DATA = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {

  const GUIDE = [
    {
      titolo: "Come viaggiare l'estate in moto",
      categoria: "Consigli di viaggio",
      excerpt: "Il caldo estivo degli ultimi anni rende sempre più difficile viaggiare in moto senza rinunciare a giacca, guanti e protezioni. Sette consigli pratici imparati sul campo, viaggio dopo viaggio con la Capracrew.",
      copertina: "https://res.cloudinary.com/whqpxxz1/image/upload/w_1600,h_900,c_fill,g_south,f_auto,q_auto/v1786538784/IMG_4148_fmvzsw.jpg",
      autore: "Il Motonauta",
      data: "2026-08-12",
      blocchi: [
        { tipo: "paragrafo", testo: "Con il caldo sempre più esagerato di questi ultimi anni, viaggiare in moto d'estate sta diventando un vero banco di prova. Se ci vogliamo bene dobbiamo comunque indossare delle vere e proprie armature (dress for the slide, not for the ride), quindi il problema non è mai \"quanto vestirsi\", ma come sopravvivere al caldo restando protetti." },
        { tipo: "paragrafo", testo: "In questi anni di viaggi insieme alla Capracrew, il nostro trio di viaggiatori, ho imparato qualche trucco sul campo. Ve li racconto uno per uno." },
        {
          tipo: "consiglio", numero: 1, titolo: "Viaggia di notte nei giorni più intensi",
          testo: "Nelle giornate in cui bisogna macinare più chilometri noi preferiamo far cadere gran parte del viaggio nelle ore notturne. Se dobbiamo fare 600 km partiamo direttamente dopo cena, se sono 900 partiamo verso le 18 così arriviamo a destinazione già in mattinata, con il grosso della strada fatto al fresco.",
          immagine: { src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786538780/IMG_3444_r2iy6v.jpg", caption: "Ad esempio questa foto l'abbiamo scattata alle 3 di mattina a Bolzano, andando verso l'Austria." }
        },
        {
          tipo: "consiglio", numero: 2, titolo: "Una borsa frigo morbida in valigia",
          testo: "Da quando guido questa muccona rossa (la mia S1000XR) non ho più problemi di spazio in valigia, e quando viaggio da solo trovo sempre posto per una borsa frigo morbida. È economica, efficiente e compatta (non mi paga nessuno, il link è qui sotto solo perché la uso davvero). Con 3 ghiaccetti dentro il contenuto resta freddo per decine di ore, e ci entrano comodamente 6 bottiglie da mezzo litro d'acqua: in 3 significa un litro a testa di acqua fresca. Ogni tot soste sostituiamo 3 bottiglie con altrettante appena prese da un supermercato o un negozio lungo la strada, che restano fresche nella borsa fino alla sosta successiva.",
          immagine: { src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786538782/IMG_3715_lxjomr.jpg", caption: "Nel cerchio rosso potete vedere la mia borsa frigo dentro le valigie, a Monaco di Baviera." },
          link: { label: "La borsa frigo che uso io (Decathlon)", url: "https://www.decathlon.it/tutti-gli-sport/campeggio/borse-frigo-morbide?pdt-highlight=342309" }
        },
        {
          tipo: "consiglio", numero: 3, titolo: "Crema solare sempre a portata di mano",
          testo: "Non è una novità per nessuno, soprattutto per chi viaggia verso il mare. Io però la tengo sempre pronta nella borsa da serbatoio, a portata di mano per le parti che restano scoperte anche con tutte le protezioni addosso: il collo, i polsi, soprattutto quando capita di indossare una giacca un po' più corta o dei guanti molto estivi. Uso sempre una protezione 50+."
        },
        {
          tipo: "consiglio", numero: 4, titolo: "Il trucco della maglietta bagnata",
          testo: "Quando il clima è davvero esagerato, tipo qualche settimana fa a Stoccarda con la Crew, dove in autobahn la moto segnava 41 gradi, quello che ci ha salvati è stato bagnare la maglietta sotto la giacca a ogni sosta. Sembra una banalità, ma con una giacca traspirante estiva e la maglietta ben bagnata sotto l'aria che passa diventa magicamente fresca. L'unico difetto è che con quelle temperature il trucco dura al massimo mezz'ora prima di asciugarsi del tutto, ma ogni sosta mi rimetteva letteralmente al mondo. Per i viaggi porto sempre canotte o magliette economiche sotto la giacca, così se si allargano un po' per il peso dell'acqua non me ne importa nulla."
        },
        {
          tipo: "consiglio", numero: 5, titolo: "Gambe lontane dal motore",
          testo: "Può sembrare una sciocchezza, ma chi ha una moto da viaggio (soprattutto di cilindrata alta) sa bene che con le temperature esagerate, oltre al vento caldo, al sole che picchia e all'aria calda che sale dall'asfalto, c'è anche la tortura di un motore rovente che soffia altro caldo addosso. Io cerco sempre di tenere i piedi appoggiati sui telai paramotore, così le gambe restano aperte e l'aria passa anche in mezzo. Questo vale su autostrada o extraurbane lunghe con pochi incroci: il consiglio è restare comunque sempre pronti a rimettere i piedi al loro posto, con cambio e freno posteriore a portata, ma nei tratti lunghi, con buona visuale e pochi pericoli, è un ottimo modo per non autotorturarsi con il calore della propria muccona."
        },
        {
          tipo: "consiglio", numero: 6, titolo: "Un mini ventilatore nella borsa da serbatoio",
          testo: "Sembra banale ma nella borsa da serbatoio ho sempre anche un mini ventilatore portatile, di quelli che si vedono in mano ai turisti in città. È stata una scoperta utilissima soprattutto ai semafori temporanei dei cantieri, quelli che si trovano spesso sui passi di montagna: quando tocca stare fermi sotto al sole anche più di un minuto e mezzo, a moto spenta lo incastro sulla visiera e mi tiene il viso fresco anche dentro al casco integrale.",
          immagine: { src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786538784/IMG_4148_fmvzsw.jpg" }
        },
        {
          tipo: "consiglio", numero: 7, titolo: "Scarpe da moto ESTIVE per davvero",
          testo: "Non fate il mio errore: ho ormai una collezione di 4 paia di scarpe da moto, e togliendo le invernali, delle due estive nessuna delle due è davvero fresca. I piedi hanno un ruolo chiave nella termoregolazione, e le scarpe da moto per me restano assolutamente necessarie (oltre a proteggere il piede riducono parecchio il rischio di rompersi ossa e cartilagini della caviglia), ma trovarne di davvero fresche è un'impresa. Un mio amico usa delle scarpe che sono praticamente una rete unica leggerissima, con la protezione solo dove serve, e il caldo lo soffre molto meno di me. Il consiglio è scegliere scarpe che già a vederle sembrano fresche e traspiranti, senza fidarsi solo di quello che dice il commesso.",
          immagine: { src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786538774/952E2A78-5253-43F4-8995-C7CF1B0F285B_dzuiz2.jpg", caption: "Questo è il giorno in cui ho comprato le mie ultime scarpe estive. Tornassi indietro probabilmente sceglierei altro: sono molto comode e indistruttibili ma sopra i 30 gradi diventano dei forni veri e propri." }
        },
        { tipo: "paragrafo", testo: "I consigli per ora finiscono qui, ma se al prossimo viaggio scopro qualche altro trucco utile aggiorno l'articolo. Se anche tu hai qualche consiglio pratico da condividere scrivimi in privato su Instagram: lo aggiungo qui, con il tuo tag accanto." }
      ]
    }
  ];

  function slugify(text) {
    return String(text)
      .replace(/[øØ]/g, "o").replace(/[æÆ]/g, "ae").replace(/[œŒ]/g, "oe")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getSlug(guida) {
    return slugify(guida.titolo);
  }

  function findBySlug(slug) {
    return GUIDE.find(g => getSlug(g) === slug) || null;
  }

  return { GUIDE, slugify, getSlug, findBySlug };
});
