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
      copertina: "https://res.cloudinary.com/whqpxxz1/image/upload/w_1600,h_900,c_fill,g_center,y_-280,f_auto,q_auto/v1786538784/IMG_4148_fmvzsw.jpg",
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
    },
    {
      titolo: "Le valigie nei viaggi in solitaria sono sopravvalutate",
      categoria: "Equipaggiamento",
      excerpt: "Dopo anni di valigie laterali di ogni tipo, dalle morbide alle rigide in alluminio, un confronto onesto con il borsone da sella: capacità, peso, prezzo e comodità, soprattutto per chi viaggia da solo.",
      copertina: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786625577/Manuale%20di%20bordo/qk8gqiz8gaxrhdn8tj6h.jpg",
      autore: "Il Motonauta",
      data: "2026-08-13",
      blocchi: [
        { tipo: "paragrafo", testo: "Appena si compra una moto nuova, noi motociclisti più accaniti iniziamo subito a cercare ogni accessorio possibile, e una delle prime ricerche riguarda quasi sempre le valigie laterali." },
        { tipo: "paragrafo", testo: "Io ne ho avute di ogni tipo, dalle morbide (che non si chiudevano nemmeno con un lucchetto) alle attuali rigide in alluminio. Quest'ultime sono comodissime: si sganciano e agganciano in un attimo, si chiudono a chiave e sono robuste davvero. Quello che però in pochi considerano è quanto, per chi viaggia da solo, un semplice borsone impermeabile da sella possa essere superiore su quasi tutti i fronti." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786625579/Manuale%20di%20bordo/swayh62cmwqh43nxo0ue.jpg", caption: "Foto in Austria della moto carica: senza contare il mio peso superavamo abbondantemente i 300 kg tra moto e bagagli pieni." },
        { tipo: "sottotitolo", testo: "Il prezzo, prima di tutto" },
        { tipo: "paragrafo", testo: "Le case produttrici hanno fatto lievitare il prezzo delle valigie laterali a cifre ridicole per quello che offrono. Valo della Capracrew, sulla sua Hornet, ha montato le valigie migliori che SW-Motech fa per quel modello: ognuna porta a malapena 16 litri, e se guardi il prezzo del kit completo ti assicuro che resti a bocca aperta. In un viaggio in solitaria, spendere una cifra simile è facilmente evitabile: con meno di 100 euro si compra un borsone da sella che spesso ha una capacità di carico tripla rispetto al totale delle valigie." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786626333/Manuale%20di%20bordo/rxcul5onsxmvwkq2ihfu.png", caption: "Questo è il modello esatto: 500 euro per una capienza totale di 33 litri è davvero un furto." },
        { tipo: "sottotitolo", testo: "Più comodo da caricare, scaricare e proteggere" },
        { tipo: "paragrafo", testo: "Al contrario delle valigie, una volta arrivati a destinazione è molto più comodo: basta aprire la cinghia che lo tiene ancorato alla moto e metterselo in spalla come uno zaino qualsiasi. Un altro vantaggio è che questo tipo di borsone spesso garantisce una protezione dalla pioggia IP67, mentre gran parte delle valigie in commercio (soprattutto quelle con chiusura lampo) ha bisogno di una sacca interna impermeabile in più, perché da sole non ce la fanno." },
        { tipo: "paragrafo", testo: "Anche sulla distribuzione dei pesi il borsone da sella resta superiore: sta sopra il baricentro e non serve nessun bilanciamento tra i due lati, mentre le valigie, se non caricate bene, sbilanciano parecchio la moto soprattutto in curva. E per quanto riguarda i furti, la protezione è alla pari (se non superiore) rispetto alle valigie morbide: il borsone si può assicurare con un lucchetto a filo, di quelli che si usano per il casco quando non c'è il bauletto, più un secondo lucchetto sulla zip." },
        { tipo: "paragrafo", testo: "Sulla mia XSR900 avevo delle Hepco & Becker Xtravel che non avevano nemmeno la possibilità di chiudersi con un lucchetto. Col senno di poi avrei fatto meglio a comprare una piastra da bauletto (la sella posteriore era comunque ridotta) e ancorarci un borsone tra la sella e la piastra." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786625574/Manuale%20di%20bordo/vsoeqtiokmujy9vh8gp6.jpg", caption: "La mia Yamaha XSR 900 2024 con le valigie Xtravel della Hepco e Becker con attacchi C-Bow." },
        { tipo: "sottotitolo", testo: "Ingombro e agilità" },
        { tipo: "paragrafo", testo: "E poi c'è la questione dell'ingombro: le valigie laterali allargano parecchio la moto e riducono agilità e possibilità di sgusciare nel traffico. Il borsone, se montato bene, non esce di un millimetro dalla sagoma della moto, e in termini di guida è come portare un passeggero, ma molto più leggero." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786625575/Manuale%20di%20bordo/tk0dodyivp2ylsdwl1ul.jpg", caption: "Le dimensioni della moto con le valigie di alluminio: nonostante siano molto compatte come modello, restano comunque un ingombro non da poco." },
        { tipo: "paragrafo", testo: "Non sto dicendo che le valigie laterali siano uno spreco di soldi: sono il primo ad amarle, e le compro per ogni moto che ho. Dico solo che se per comprarle devi fare grossi sacrifici (ormai sotto i 500 euro non si trova niente di decente in questa categoria), forse conviene prima tirare le somme e capire quanto davvero ti servano, soprattutto se sei un lupo solitario e la sella posteriore ha già preso polvere." }
      ]
    },
    {
      titolo: "I 5 accessori definitivi per una mototendata compatta",
      categoria: "Equipaggiamento",
      excerpt: "Dalla GSX-R 1000 alla S1000XR: cinque accessori per dormire in tenda dopo un'escursione in moto, qualunque sia lo spazio che avete a disposizione in sella.",
      copertina: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786960146/Manuale%20di%20bordo/tmaxijwofymhqdnmig0w.png",
      autore: "Il Motonauta",
      data: "2026-08-17",
      blocchi: [
        { tipo: "paragrafo", testo: "Sono ormai anni che io e i miei amici, ogni volta che possiamo, andiamo in escursione in moto sul Gran Sasso o sulle Dolomiti, fermandoci a dormire lì per la notte. L'ho fatto con tre moto diverse, e ormai sono pronto a partire a prescindere dallo spazio disponibile. Come quando andai in tenda con la mia GSX-R 1000 del 2008, dove lo spazio non si poteva nemmeno definire ridotto: era praticamente inesistente." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786959647/Manuale%20di%20bordo/wnc4ier53kcy5b8kjuk5.jpg", caption: "La prima tendata con il GSX-R 1000: faticosa, dolorosa e con poco spazio disponibile." },
        { tipo: "paragrafo", testo: "Con la XSR900 le cose sono migliorate parecchio, anche se non superavo i 50 litri totali tra le borse laterali. Con la S1000XR ho smesso proprio di pormi il problema, visto che lo spazio a disposizione è praticamente infinito. Ma qui vediamo subito come dormire in tenda anche quando lo spazio è davvero risicato, magari legando pure uno zainetto sulla sella posteriore. Ecco cosa mi porto per una mototendata in solitaria." },
        {
          tipo: "consiglio", numero: 1, titolo: "Tenda Fresh&Black 3 posti",
          testo: "Partiamo dalla tenda, l'unica cosa che purtroppo bisogna legare alla moto e che resta un po' ingombrante. Vi spiego subito perché la consiglio comunque: il telo Fresh&Black sopra la tenda mantiene la temperatura ottimale anche nelle giornate più calde, e vi tiene al buio completo anche a mezzogiorno. Con i miei amici difficilmente ci svegliamo dopo le 8, ma è comunque un sollievo non doversi svegliare alle 7 con il primo raggio di sole in faccia. Costa sui 70 euro, ma fuori stagione si trova facilmente sotto i 50: io l'ho pagata 49,90. Esistono tende più compatte, ma di solito costano cifre esagerate, anche oltre i 300 euro, e sacrificano l'esperienza pur di guadagnare qualche centimetro. In più, al contrario di molte tende compatte non autoportanti (quelle che usano perlopiù i trekker), questa è semplicissima da montare: una volta presa la mano ci mettete 5 minuti a montarla e 6 a richiuderla. Il materiale poi è di ottima qualità: nonostante l'abbiamo montata centinaia di volte su sassi e radici, non ha ancora un solo buco nella base.",
          link: { label: "La tenda Fresh&Black che uso io (Decathlon)", url: "https://www.decathlon.it/tutti-gli-sport/campeggio/tende-3-posti?pdt-highlight=313085" }
        },
        {
          tipo: "consiglio", numero: 2, titolo: "Il pavimento stagno sottotenda",
          testo: "Altrettanto fondamentale quanto sottovalutato: quando comprate una tenda, spesso i commessi non ve lo menzionano nemmeno. Il pavimento stagno vi isola meglio dal terreno, protegge la base della tenda da tagli e forature, e soprattutto non occupa spazio: si chiude comodamente dentro la sacca originale della tenda. Stefano, il nostro grande amico di avventure, ci ha insegnato a piegarlo insieme alla tenda come fosse un unico pezzo. Se ci riuscite alla prima tendata, dalle volte successive vi basterà tirare fuori la tenda e aprirla per trovarvelo già sotto, come fosse di serie.",
          link: { label: "Il pavimento stagno che uso io (Decathlon)", url: "https://www.decathlon.it/tutti-gli-sport/campeggio/teli-di-ricambio?pdt-highlight=3744" }
        },
        {
          tipo: "consiglio", numero: 3, titolo: "Sacco a pelo ultracompatto (ma economico)",
          testo: "Scegliere un sacco a pelo non è mai facile, soprattutto quando entrate in negozio e vi trovate davanti un muro con un centinaio di modelli diversi. Vi parlo per esperienza: questo sacco a sarcofago è comodo quanto compatto. Chiuso è grande come una bomboletta del gas, perfetto per il bivacco estivo, visto che tiene la temperatura giusta anche in montagna, dove la minima notturna scende tranquillamente sotto i 15 gradi pure ad agosto. La cosa migliore di questo modello è il prezzo: di solito i sacchi a sarcofago così compatti costano sopra i 90 euro, mentre questo si trova spesso scontato anche sotto i 40.",
          link: { label: "Il sacco a pelo che uso io (Decathlon)", url: "https://www.decathlon.it/p/sacco-a-pelo-trekking-mt500-15degc-blu/346470/c246m8799895" }
        },
        {
          tipo: "consiglio", numero: 4, titolo: "Il materassino tascabile",
          testo: "Questo materassino mi è stato utilissimo nelle prime tendate, quando dovevo far entrare tutto in uno zaino Eastpak. Al contrario di altri modelli, chiuso è davvero microscopico: entra comodamente in tasca. Non aspettatevi chissà quale comodità, perché qui non la trovate; quelli davvero comodi sono decisamente troppo ingombranti. L'ultimo modello più spazioso che ho provato mi ha fatto dormire come un bambino, ma occupava mezza borsa laterale, quasi 20 litri buttati. Quindi: se non avete problemi ad addormentarvi e vi basta l'efficienza da chiuso, questo modello non ha eguali.",
          link: { label: "Il materassino che uso io (Decathlon)", url: "https://www.decathlon.it/p/materassino-gonfiabile-trekking-mt500-air-l-180-x-52cm/189392/c344c344m8799965" }
        },
        {
          tipo: "consiglio", numero: 5, titolo: "Il fornello a gas microscopico",
          testo: "Di solito per cucinare io e i miei amici usiamo direttamente il fuoco che accendiamo dopo il tramonto, ma ultimamente mi trovo bene a usare il fornello per un antipasto veloce mentre si prepara la brace. In realtà ci si può cucinare un'intera cena: bastano lui (il più compatto che ho trovato), una bomboletta di metano da 230g e un kit come questo, che vi dà pentola e padella, oltre a piatti, posate e bicchieri per due persone.",
          links: [
            { label: "Il fornello che uso io (Decathlon)", url: "https://www.decathlon.it/p/fornellino-a-gas-trekking-mt500-compact/310238/m8559534" },
            { label: "Il kit gavetta che uso io (Decathlon)", url: "https://www.decathlon.it/p/gavetta-campeggio-500-2-persone-15-elementi/174678/c311m8901656" }
          ]
        },
        { tipo: "paragrafo", testo: "Tutto quello che avete letto qui sopra entra tranquillamente in una borsa da 30 litri, che con un paio di cinghie potete legare insieme alla tenda sulla sella posteriore. Che abbiate una naked normale o una carenata prontopista non cambia nulla." },
        { tipo: "paragrafo", testo: "Vi tengo a precisare che non ricavo nulla nel consigliarvi questi modelli: non ho nessuna affiliazione con Decathlon, vi parlo solo di quello che ho comprato di tasca mia. Avendo provato diversi modelli di ogni categoria, mi sento di consigliarvi i migliori per compattezza. Magari nel prossimo articolo vi parlo dei migliori per comodità vera e propria. Se avete qualcosa di più efficiente da consigliarmi, o qualcosa da aggiungere a questo articolo, scrivetemi pure su Instagram (lo trovate nella sezione Canale aperto): sarò felice di ascoltare il consiglio e di aggiungerlo qui, dandovi credito." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786959723/Manuale%20di%20bordo/rlxq0fulgj1m4ows03qt.jpg", caption: "La mia ultima tendata, la scorsa settimana: ormai porto di tutto e di più nelle valigie, lasciando sempre il bauletto vuoto per poter riporre casco e giacca durante le soste." }
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
