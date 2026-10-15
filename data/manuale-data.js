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
      copertina: "/img/manuale/estate/copertina.jpg",
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
      copertina: "/img/manuale/solitaria/copertina.jpg",
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
      copertina: "/img/manuale/mototendata/copertina.jpg",
      autore: "Il Motonauta",
      data: "2026-08-17",
      blocchi: [
        { tipo: "sottotitolo", testo: "Dal GSX-R alla S1000XR: sempre in tenda" },
        { tipo: "paragrafo", testo: "Sono ormai anni che io e i miei amici, ogni volta che possiamo, andiamo in escursione in moto sul Gran Sasso o sulle Dolomiti, fermandoci a dormire lì per la notte. L'ho fatto con tre moto diverse, e ormai sono pronto a partire a prescindere dallo spazio disponibile. Come quando andai in tenda con la mia GSX-R 1000 del 2008, dove lo spazio non si poteva nemmeno definire ridotto: era praticamente inesistente." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786959647/Manuale%20di%20bordo/wnc4ier53kcy5b8kjuk5.jpg", caption: "La prima tendata con il GSX-R 1000: faticosa, dolorosa e con poco spazio disponibile." },
        { tipo: "paragrafo", testo: "Con la XSR900 le cose sono migliorate parecchio, anche se non superavo i 50 litri totali tra le borse laterali. Con la S1000XR ho smesso proprio di pormi il problema, visto che lo spazio a disposizione è praticamente infinito. Ma qui vediamo subito come dormire in tenda anche quando lo spazio è davvero risicato, magari legando pure uno zainetto sulla sella posteriore." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786970638/Manuale%20di%20bordo/hpo0mz0lgx4rtmdalffm.jpg", caption: "Qui di ritorno da Campo Imperatore con la mia XSR 900 2024 bella carica di cose: valigie laterali piene, tenda legata sopra, uno zainetto con ciò che non entrava nelle valigie e la borsa da serbatoio con le cose che possono servire in una sosta. Già qui mi ero abituato a caricare la moto anche con cose meno essenziali che però miglioravano l'esperienza." },
        { tipo: "sottotitolo", testo: "Ecco cosa mi porto per una mototendata in solitaria" },
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
    },
    {
      titolo: "Cosa ne penso del mio Tris Givi Trekker Outback EVO",
      categoria: "Equipaggiamento",
      excerpt: "Dopo 15.000 km con il Tris Givi Trekker Outback EVO sulla mia S1000XR: capienza, robustezza, il sistema Camside e l'unico vero difetto che ho trovato.",
      copertina: "/img/manuale/givi/copertina.jpg",
      autore: "Il Motonauta",
      data: "2026-08-18",
      blocchi: [
        { tipo: "paragrafo", testo: "Dopo l'acquisto della mia bellissima S1000XR ho deciso di prendere il fantastico Givi Trekker Outback EVO da 56 litri. Avevo bisogno di un bauletto di grandi dimensioni per viaggiare più comodo con i bagagli. Dopo il bauletto avevo due strade davanti: le valigie laterali originali BMW, spendendo un migliaio di euro. Oppure, più o meno con la stessa cifra, le valigie della stessa famiglia Givi con il sistema Camside. Stavano decisamente meglio abbinate al bauletto e, oltre a essere in alluminio, portavano 7 litri in più rispetto alle originali per la XR." },
        { tipo: "sottotitolo", testo: "La scelta delle valigie Camside" },
        { tipo: "paragrafo", testo: "La scelta è ricaduta ovviamente su queste ultime. Ho sfruttato anche il nuovo blocchetto chiavi SLB101, uscito sul mercato pochi giorni prima che lo ordinassi. Con tutti questi acquisti mi sono ritrovato con il tris completo e la possibilità di aprire bauletto e valigie con la stessa chiave originale. Rispetto al modello BMW, alla fine, non c'erano più contro nella mia scelta: solo pro." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1787067680/IMG_4218_y4eh7i.jpg", caption: "Qui mentre registravo i blocchetti chiavi per renderli compatibili con la mia chiave della moto." },
        { tipo: "sottotitolo", testo: "Come mi trovo in viaggio" },
        { tipo: "paragrafo", testo: "Nei viaggi sono perfette. È difficile riempirle anche in quelli molto lunghi, e lascio sempre il bauletto vuoto per riporre casco, giacca e guanti durante le soste. La capienza è importante e si sente. Nell'ultimo viaggio avevo con me anche tutti gli attrezzi miei e dei miei amici, più una piccola borsa frigo con l'acqua fredda per tutti. Nonostante questo restava spazio in entrambe le valigie, al punto da poterci mettere la spesa per la cena prima di arrivare all'Airbnb." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1787067256/Manuale%20di%20bordo/eujcbi9xpjf3geet2n2o.jpg", caption: "Austria, giugno 2026." },
        { tipo: "sottotitolo", testo: "Il sistema Camside" },
        { tipo: "paragrafo", testo: "Il sistema Camside è progettato davvero bene. Il telaio è molto compatto e fa sì che le valigie restino il più aderenti possibile alla moto. Grazie a questo, quando si aprono non sbattono contro il bauletto ma scendono verso l'esterno, e si possono caricare comodamente." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1787067254/Manuale%20di%20bordo/f3wrlg6wsiy0nntklvlo.jpg" },
        { tipo: "sottotitolo", testo: "La comodità di portarle via" },
        { tipo: "paragrafo", testo: "Una volta arrivato all'alloggio dove passare la notte, smonto entrambe le valigie e me le porto dentro, invece di usare borse o contenitori interni. Sono molto leggere e hanno i manici su entrambi i lati, che garantiscono un'ottima presa anche a pieno carico. Portandomele appresso posso risistemare tutto con calma la mattina. Poi devo solo riagganciarle una volta tornato alla moto." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1786538782/IMG_3715_lxjomr.jpg", caption: "Monaco di Baviera: le valigie aperte appena arrivati all'Airbnb." },
        { tipo: "sottotitolo", testo: "Robustezza" },
        { tipo: "paragrafo", testo: "Le valigie sono solide esattamente come sembrano a vederle. Ho avuto la sfortuna di appoggiare la moto a terra sul lato destro. Mettendo il cavalletto centrale mi è scivolato il piede, perché non mi ero accorto che l'appoggio fosse pieno di grasso della catena. Nonostante la botta a terra con tutto il peso della moto, la valigia destra (vuota) non si è né piegata né graffiata. D'altronde sono pensate per il fuoristrada: una certa robustezza me l'aspettavo, e per fortuna l'ho trovata." },
        { tipo: "sottotitolo", testo: "Gli accessori Givi" },
        { tipo: "paragrafo", testo: "Una cosa che mi piace molto di questo marchio è la disponibilità di optional. Per praticamente ogni modello esistono decine di accessori che migliorano l'esperienza. Per il mio bauletto ho preso la rete da fondo, che uso tutti i giorni per tenere ferme le cose piccole durante il viaggio. Ho preso anche un paio di cinghie per attaccare sopra i passanti del tris gli oggetti più ingombranti, come una tenda da campeggio. E una sacca compatta che si aggancia sul coperchio del bauletto e, in caso di necessità, si trasforma in uno zainetto da 15 litri molto robusto. Ci sono svariati altri optional che mi tentano parecchio, e non credo resisterò a lungo dal comprarli." },
        { tipo: "paragrafo", testo: "A proposito di passanti: questa ultima versione del tris ne è piena. Se si vuole attaccare qualcosa sopra il bauletto, ci sono almeno 10 punti di aggancio per le cinghie." },
        { tipo: "sottotitolo", testo: "L'unico vero difetto" },
        { tipo: "paragrafo", testo: "Dopo due viaggi molto lunghi e un utilizzo costante nei weekend, posso confermarvi che valgono assolutamente la spesa. L'unico difetto che ho trovato, e non è da poco, è che durante le piogge forti non ci si può affidare all'impermeabilità totale del bauletto. Ancora non ho capito da dove entri l'acqua, ma quando riprendo la moto dopo un temporale trovo sempre il tappetino del bauletto impregnato. Avevo intenzione di far valere la garanzia, ma ho scoperto sui forum che in parecchi hanno lo stesso problema. Mi auguro che Givi lo risolva, magari con un piccolo richiamo per chi lo ha già acquistato. Al contrario del bauletto, le valigie non hanno mai ceduto, nemmeno nelle condizioni meteo peggiori." },
        { tipo: "paragrafo", testo: "Vi ricordo che questa è una recensione sincera dopo 15.000 km di utilizzo del tris. Non sono affiliato in alcun modo a Givi, e tutto quello di cui vi ho parlato l'ho comprato di tasca mia." }
      ]
    },
    {
      titolo: "Gli attrezzi necessari da portare in viaggio",
      categoria: "Equipaggiamento",
      excerpt: "Dal kit per le gomme al bicomponente per le crepe: cinque attrezzi che porto sempre in viaggio, pensati per cavarsela da soli quando si resta a piedi lontano da tutto.",
      copertina: "/img/manuale/attrezzi/copertina.jpg",
      autore: "Il Motonauta",
      data: "2026-08-19",
      blocchi: [
        { tipo: "paragrafo", testo: "Potete avere la moto più affidabile del mondo, ma quando di mezzo ci sono migliaia di chilometri bisogna fare i conti con le probabilità. Soprattutto nei viaggi verso posti meno popolati, o comunque lontani dalle grandi città, il rischio di restare a piedi in mezzo al nulla senza nessun aiuto diventa concreto." },
        { tipo: "paragrafo", testo: "Portare gli attrezzi giusti in viaggio è fondamentale. In certi casi puoi risolvere definitivamente il problema che ti capita davanti, in altri riesci almeno a tamponare fino all'officina più vicina, che è comunque meglio di dover pagare un carroattrezzi. Oggi vediamo insieme cosa ritengo necessario in viaggio, per potercisi affidare in caso di emergenza." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1787217570/Manuale%20di%20bordo/r9a3kt3bkfzfvtblxdzu.jpg" },
        { tipo: "sottotitolo", testo: "Ecco cosa ritengo necessario in un viaggio:" },
        {
          tipo: "consiglio", numero: 1, titolo: "Kit per riparare le gomme",
          testo: "Io mi affido sempre a un kit preso in un negozio che neanche ricordo, ma tanto sono quasi tutti uguali: contengono i vermicelli da applicare al buco, il mastice per farli restare in posizione e uniformarsi allo pneumatico, la punta per allargare il buco iniziale nel punto giusto (così il vermicello entra e aderisce bene) e la punta per infilarlo. Cercate di prenderne uno di marca conosciuta: non mi affiderei troppo ai siti cinesi che offrono l'ultra risparmio. Normalmente in questi kit ci sono anche le bombolette di CO2, ma non potete affidarvi solo a quelle: servono più che altro per arrivare al benzinaio successivo e gonfiare la gomma per bene. Io preferisco portare un compressore portatile, come quello di cui vi parlo adesso.",
          immagine: { src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1787217577/Manuale%20di%20bordo/h44gayxswu2jwlcsgmho.png", caption: "Questo è un kit generico, sono tutti uguali e offrono sempre le stesse cose, quindi non vi fate troppi problemi a sceglierlo." }
        },
        {
          tipo: "consiglio", numero: 2, titolo: "Compressore portatile",
          testo: "Personalmente uso un compressore un po' ingombrante, ma oltre a gonfiare le gomme fa anche da starter in caso di problemi alla batteria. Ormai si trovano compressori portatili tascabili di tutte le marche: vi consiglio di guardare una soluzione come quella che vi mostro qui sotto. Ce ne sono decisamente di più economiche, se volete spendere meno: vi indico questa solo perché è la più compatta che si trova oggi sul mercato, ed è di una marca affidabile.",
          link: { label: "Un esempio di compressore molto compatto", url: "https://muc-off-eu.myshopify.com/it/products/airmach-electric-mini-inflator" },
          immagine: { src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1787217575/Manuale%20di%20bordo/rp168ouhavpq0ht0aavx.png", caption: "Questo è esattamente il modello che uso io, ma prendetelo solo se avete molto spazio in valigia perché ne ruba parecchio." }
        },
        {
          tipo: "consiglio", numero: 3, titolo: "Gli attrezzi per la TUA moto",
          testo: "Prima di un viaggio vi consiglio di studiare bene la vostra moto, e di creare un kit personale con il necessario per smontarla. La mia XR, ad esempio, con due misure di chiavi a stella e due di chiave a bussola si può smontare quasi completamente: portando anche le bussole per le ruote potrei tranquillamente farla a pezzi in mezzo alla strada. Cercate di capire quali sono gli attrezzi giusti per la vostra moto, e non fatevi mai mancare una pinza, un cacciavite a taglio e uno a croce: tornano utili in ogni caso.",
          immagine: { src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1787217578/Manuale%20di%20bordo/trovnx1otl85yhw7uns2.png", caption: "Se trovate un kit già pronto, compatto, e con tutto il necessario per smontare la vostra moto, prendetelo pure! Magari fate un ragionamento veloce togliendo le cose non strettamente necessarie per renderlo ancora più compatto." }
        },
        {
          tipo: "consiglio", numero: 4, titolo: "Bicomponente o acciaio liquido",
          testo: "È stato fondamentale in un nostro viaggio in Calabria qualche anno fa. Per via di un piccolo incidente con una Renault 208 (guidata da una persona che al massimo potrebbe guidare il carrello della spesa), avevo crepato il carter destro della mia vecchia Zetina 750. L'ho smontato e spalmato per bene con il bicomponente, e mi ha permesso di continuare il viaggio senza perdite: l'ho venduta così mesi dopo, senza mai più sostituirlo. Il bicomponente può essere di grande aiuto in molti casi, e resta comunque compatto: è composto da due piccoli dosatori che entrano in tasca.",
          immagine: { src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1787217568/Manuale%20di%20bordo/gtcwzywcl40vltll2cnc.jpg", caption: "Noi che ripariamo il carter dalla parte interna dopo aver messo nastro americano fuori per far sì che rimanesse lì la miscela. Nel giro di 20 minuti di lavoro la moto era di nuovo perfettamente utilizzabile, e abbiamo proseguito il viaggio senza altri problemi." }
        },
        {
          tipo: "consiglio", numero: 5, titolo: "Nastro e fascette",
          testo: "Anche questo è assolutamente necessario, e non credo serva spiegare troppo. Soprattutto quando si parla di parti elettriche o plastiche, sono sempre la soluzione giusta."
        },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1787217572/Manuale%20di%20bordo/b1ysbvoetanf0tkaayu6.png" },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1787217573/Manuale%20di%20bordo/no5ijdxxpylcnuqt1bza.png" },
        {
          tipo: "consiglio", numero: 6, titolo: "Cavo della frizione",
          testo: "Ormai in qualsiasi negozio di abbigliamento moto e accessori si trovano cavi per la frizione di emergenza: kit che contengono, oltre al cavo, anche i nippli di varie misure per poterlo installare su qualsiasi modello. Insomma, il necessario per sostituire il cavo e ripartire. Vi ricordo sempre di acquistare, una volta tornati a casa, il kit cavo frizione originale per il vostro modello e di reinstallare quello: cambiando solo il cavo, è inevitabile che vi si rompa di nuovo nel giro di pochi mesi. Ve lo dico per esperienza.",
          immagine: { src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1787217571/Manuale%20di%20bordo/adxcmfvezjy0cfhneabr.png", caption: "Kit generico trovato online, non importa la marca, vi basta che sia universale." }
        },
        { tipo: "paragrafo", testo: "Questo è ciò che ritengo fondamentale per i miei viaggi, e finora è sempre stato d'aiuto: a noi, o a persone che lungo la strada abbiamo trovato in difficoltà. Se vi viene in mente qualcos'altro di utile da portare in viaggio, non esitate a contattarmi sui social: sarò felicissimo di aggiungere il vostro consiglio a questa guida, nominandovi di conseguenza." }
      ]
    },
    {
      titolo: "Il giorno in cui un interfono ha salvato la vita di un uomo",
      categoria: "Equipaggiamento",
      excerpt: "La funzione Crash Detection del Cardo Packtalk Pro ha avvisato in automatico la moglie di un motociclista in Arizona dopo un incidente: senza quell'allarme, forse nessuno lo avrebbe trovato in tempo.",
      copertina: "/img/manuale/interfono/copertina.jpg",
      autore: "Il Motonauta",
      data: "2026-09-07",
      blocchi: [
        { tipo: "paragrafo", testo: "Ogni tanto capita una notizia che mi ferma un secondo. Non tanto per la disgrazia in sé, quella purtroppo capita, quanto per come sarebbe potuta andare molto peggio senza un pizzico di tecnologia addosso. È il caso di Dustin Hayes, motociclista dell'Arizona, e del suo Cardo Packtalk Pro." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1788790578/Manuale%20di%20bordo/ozkrvih4pcne6bl2buwg.webp", caption: "le condizioni della moto dopo l'impatto, foto scattata da Brooke" },
        { tipo: "paragrafo", testo: "La sera del 2 gennaio, verso le nove, Dustin stava percorrendo la New River Road, tra la Carefree Highway e la I-17. Si pensa abbia sterzato per evitare un animale sulla carreggiata. È stato sbalzato lontano dalla moto, in un punto dove difficilmente qualcuno lo avrebbe notato passando." },
        { tipo: "paragrafo", testo: "Il suo intercom però ha fatto qualcosa che lui, in quel momento, non poteva fare da solo: ha avvisato chi doveva sapere che qualcosa non andava. La funzione Crash Detection del Packtalk Pro ha rilevato l'impatto e ha mandato in automatico un messaggio d'emergenza a sua moglie, Brooke." },
        { tipo: "paragrafo", testo: "Brooke ha raccontato a Fox 10 Phoenix di aver ricevuto un messaggio sul telefono con scritto \"urgente\". Lo ha aperto e diceva che Dustin poteva essere stato coinvolto in un incidente. Ha pensato: vado a controllare di persona. Ha guidato circa mezz'ora per raggiungere il punto segnalato, e lì ha trovato suo marito a bordo strada. È convinta che, senza quell'avviso, nessuno lo avrebbe trovato in tempo." },
        { tipo: "paragrafo", testo: "Cardo, dal canto suo, ha voluto fare la sua parte: dal 26 febbraio al 26 marzo ha devoluto il 5% di ogni Packtalk Pro venduto per sostenere le spese di recupero di Dustin." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1788790163/Manuale%20di%20bordo/rlza6d54gskxawj0eddn.webp" },
        { tipo: "paragrafo", testo: "Non so voi, ma quando giro da solo, soprattutto su strade poco battute o di sera, questo genere di notizie mi fa riflettere. Non è tecnologia per sentirsi più sicuri sulla carta. È tecnologia che può davvero fare la differenza quando le cose vanno storte e non sei in grado di chiedere aiuto da solo." },
        { tipo: "link", label: "Guarda il video in cui ne parlo", url: "https://www.tiktok.com/@ilmotonauta/video/7599404799049747734" }
      ]
    },
    {
      titolo: "Come scegliere il casco giusto per i lunghi viaggi",
      categoria: "Equipaggiamento",
      excerpt: "Il casco più bello del negozio non è quasi mai quello giusto per un viaggio lungo. Comfort, ventilazione, peso e omologazione: cosa guardare davvero prima di comprarlo.",
      copertina: "/img/manuale/casco/copertina.jpg",
      autore: "Il Motonauta",
      data: "2026-09-08",
      blocchi: [
        { tipo: "paragrafo", testo: "Partiamo da una cosa che ho imparato a mie spese: il casco più bello del negozio non è quasi mai quello giusto per un viaggio lungo. L'ho scoperto dopo 800 km in un giorno con un casco sportivo che mi stava d'incanto al negozio e mi ha massacrato le cervicali sull'autostrada (oltre alle orecchie, visto lo scarico aftermarket). Da lì ho iniziato a guardare i caschi con occhi diversi, e oggi provo a spiegarti cosa cercare davvero, senza girarci troppo intorno." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1788859017/Manuale%20di%20bordo/n5ku1p899lsjwjx2wcfq.jpg", caption: "il casco incriminato, ovviamente AGV Pista GP RR, assolutamente non pensato per i viaggi ma essendomi innamorato della sua estetica ci sono cascato in pieno" },
        { tipo: "sottotitolo", testo: "Comfort prima di tutto (sì, anche prima dell'estetica)" },
        { tipo: "paragrafo", testo: "Lo so, il casco è anche una questione di stile, ci sono passato pure io. Ma quando devi tenerlo in testa per 8-10 ore di fila, il primo criterio deve essere quanto ti sta comodo, non quanto sta bene nella foto. Provalo per almeno 10 minuti in negozio, non 30 secondi davanti allo specchio: i punti di pressione che non senti subito vengono fuori dopo un paio d'ore, e a quel punto sei già in autostrada e non puoi farci niente." },
        { tipo: "sottotitolo", testo: "Ventilazione: non è un dettaglio" },
        { tipo: "paragrafo", testo: "Su un casco da città puoi anche sopravvivere con una ventilazione mediocre. In viaggio, specialmente d'estate, è quello che ti fa arrivare a destinazione ancora lucido invece che cotto come un arrosto. Cerca prese d'aria regolabili, non solo decorative: alcuni modelli le hanno più per estetica che per reale efficacia, e lo scopri solo provandoli o leggendo recensioni di chi li ha usati davvero in viaggio, non solo in un weekend fuori porta." },
        { tipo: "sottotitolo", testo: "Peso: i grammi si sentono, eccome" },
        { tipo: "paragrafo", testo: "Un casco pesante 200 grammi in più di un altro può sembrare una sciocchezza da specifica tecnica. Non lo è. Dopo ore di vibrazioni e vento laterale, quel peso extra si traduce in un collo indolenzito e in una stanchezza che ti accompagna anche il giorno dopo. Se puoi, confronta il peso tra i modelli che stai valutando: a parità di omologazione, spesso conviene quello più leggero." },
        { tipo: "sottotitolo", testo: "Modulare o integrale? Dipende dal viaggio" },
        { tipo: "paragrafo", testo: "Non esiste la risposta giusta in assoluto, esiste quella giusta per come viaggi tu:" },
        {
          tipo: "consiglio", numero: 1, titolo: "Integrale",
          testo: "La protezione migliore, punto. Se fai lunghe percorrenze anche in autostrada o in condizioni meteo variabili, resta la scelta più sicura."
        },
        {
          tipo: "consiglio", numero: 2, titolo: "Modulare",
          testo: "Il compromesso perfetto su carta: puoi aprirlo ai caselli, mentre parli con qualcuno, o quando ti fermi per una foto, senza doverlo sfilare del tutto. Il prezzo da pagare è un peso leggermente superiore, una sicurezza inferiore (a meno che non si guardano quelli di fascia altissima) e una struttura comunque un filo meno rigida di un integrale puro."
        },
        {
          tipo: "consiglio", numero: 3, titolo: "Jet",
          testo: "Ovviamente neanche lo cito: non li definisco caschi bensì copricapo ai limiti della normativa sulla sicurezza. Posso capire in uno scooter, ma in moto, per quanto mi riguarda, non è assolutamente un'opzione."
        },
        { tipo: "sottotitolo", testo: "Omologazione: non è burocrazia, è sicurezza vera" },
        { tipo: "paragrafo", testo: "Controlla sempre che il casco abbia l'omologazione ECE 22.06 (la più recente e più severa, sostituisce gradualmente la 22.05): non è un timbro decorativo, indica che il casco ha superato test di sicurezza aggiornati. Se stai comprando usato o su qualche sito poco chiaro, verifica sempre questo dato prima del prezzo." },
        { tipo: "sottotitolo", testo: "Un consiglio spicciolo ma che vale oro" },
        { tipo: "paragrafo", testo: "Se puoi, prova il casco con il tipo di giacca/collo che usi di solito in viaggio, non a torso nudo in negozio. Cambia tutto: un casco che sembra perfetto da solo può dare fastidio nella zona del collo una volta che ci infili sotto anche il colletto della giacca tecnica." },
        { tipo: "sottotitolo", testo: "Occhio alle predisposizioni per l'interfono" },
        { tipo: "paragrafo", testo: "Un'altra cosa importante da controllare quando scegli un casco sono le dimensioni delle predisposizioni per l'interfono. Alcuni caschi hanno gli spazi per le casse molto piccoli, perché pensati per l'interfono realizzato dalla stessa azienda che produce il casco, e magari non sono compatibili con il dispositivo che usi tu. Sembra una sciocchezza, ma se lo scopri dopo averlo comprato può diventare un problema vero." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1788859015/Manuale%20di%20bordo/bltr1t2r6fxuykkcr6fp.jpg", caption: "HJC RPHA 11, quello a destra: decisamente meno aerodinamico e leggero del Pista, ma comodo, silenzioso e perfetto per viaggi molto lunghi, tra poco farò l'upgrade al 12 perché dopo 80.000 km insieme sta dando segni di cedimento" },
        { tipo: "paragrafo", testo: "Il casco perfetto non esiste. Esiste quello che ti fa arrivare a destinazione ancora dell'umore giusto per goderti il posto in cui sei arrivato." },
        { tipo: "paragrafo", testo: "Hai un casco che useresti per un giro del mondo e uno che eviteresti anche per andare al bar? Raccontamelo: magari ne esce un altro articolo!" }
      ]
    },
    {
      titolo: "Valigie rigide vs borse morbide: quale scegliere?",
      categoria: "Equipaggiamento",
      excerpt: "La scelta tra valigie rigide e borse morbide non è solo una questione di gusto: cambia davvero come vivi il viaggio. Pro, contro e la mia esperienza con entrambe.",
      copertina: "/img/manuale/rigide-morbide/copertina.jpg",
      copertinaCaption: "le mie morbide sul gsxr quando sono partito",
      autore: "Il Motonauta",
      data: "2026-09-09",
      blocchi: [
        { tipo: "paragrafo", testo: "Oggi parliamo delle due tipologie di borse per eccellenza e delle mie esperienze con esse. Il primo viaggio lungo l'ho fatto con delle borse morbide molto economiche, legate alla meglio sul mio GSXR 1000 con dei ragni elastici. Sono arrivato a destinazione con entrambe le borse chiuse con il nastro americano perché non era la moto giusta e non erano le borse più adatte. Da lì ho iniziato a capire che la scelta tra rigide e morbide non è solo una questione di gusto: cambia davvero come vivi il viaggio." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1788949305/Manuale%20di%20bordo/dngqgyigwvetxbocrxzb.jpg", caption: "ecco come sono tornato a casa, con entrambe piene di nastro americano, e la destra svuotata perché lo scarico aveva bucato la borsa e squagliato quasi tutti i miei vestiti" },
        { tipo: "video", src: "https://res.cloudinary.com/whqpxxz1/video/upload/f_auto,q_auto/v1788949321/Manuale%20di%20bordo/ia729wjeb5mcsqalwngi.mov", caption: "ecco le esatte condizioni" },
        { tipo: "sottotitolo", testo: "Valigie rigide" },
        { tipo: "paragrafo", testo: "Le classiche \"valigette\" in plastica o alluminio agganciate al telaio, tipo le Givi Outback Evo che monto io." },
        { tipo: "paragrafo", testo: "I pro:" },
        { tipo: "consiglio", numero: 1, titolo: "Protezione vera", testo: "Se cadi, o se qualcuno urta la moto in un parcheggio affollato, il contenuto è protetto molto meglio che con un tessuto." },
        { tipo: "consiglio", numero: 2, titolo: "Sicurezza dai furti", testo: "Si chiudono a chiave, e non è banale aprirle al volo come una cerniera." },
        { tipo: "consiglio", numero: 3, titolo: "Impermeabilità reale", testo: "Quelle di buona qualità non fanno passare acqua nemmeno sotto un temporale vero, non solo sotto la pioggerella." },
        { tipo: "consiglio", numero: 4, titolo: "Forma fissa", testo: "Sai sempre esattamente quanto spazio hai e come organizzarlo, comodo se sei tipo da \"tutto al suo posto\"." },
        { tipo: "paragrafo", testo: "I contro:" },
        { tipo: "consiglio", numero: 1, titolo: "Peso", testo: "Parliamo di diversi kg in più rispetto alle borse morbide, che si sentono soprattutto nella guida in curva." },
        { tipo: "consiglio", numero: 2, titolo: "Ingombro fisso", testo: "Allargano la moto, e in città o su strade strette te ne accorgi eccome quando fai manovre." },
        { tipo: "consiglio", numero: 3, titolo: "Costo", testo: "Un buon set di valigie rigide con i telai di aggancio è un investimento serio, altro che le borse da 60 euro la coppia." },
        { tipo: "consiglio", numero: 4, titolo: "Meno versatili fuori moto", testo: "Se un giorno non ti servono, restano lì, ingombranti anche da conservare." },
        { tipo: "immagine", src: "https://res.cloudinary.com/whqpxxz1/image/upload/f_auto,q_auto/v1788949302/Manuale%20di%20bordo/n5osnbkk0qbgdsytadpo.jpg", caption: "ecco le mie trekker in Corsica, è bello poterla parcheggiare e visitare la città con calma con la consapevolezza che hai tutto sotto chiave dentro una scatola di alluminio" },
        { tipo: "sottotitolo", testo: "Borse morbide" },
        { tipo: "paragrafo", testo: "Sacche in tessuto tecnico che si agganciano con cinghie, spesso senza bisogno di telai fissi." },
        { tipo: "paragrafo", testo: "I pro:" },
        { tipo: "consiglio", numero: 1, titolo: "Leggerezza", testo: "Molto più leggere, la moto resta più agile soprattutto se fai anche sterrato o strade tortuose." },
        { tipo: "consiglio", numero: 2, titolo: "Costo accessibile", testo: "Si trovano soluzioni valide a una frazione del prezzo delle rigide." },
        { tipo: "consiglio", numero: 3, titolo: "Flessibilità", testo: "Si adattano meglio a moto diverse, utile se cambi mezzo o le presti." },
        { tipo: "consiglio", numero: 4, titolo: "Meno ingombro fisso", testo: "La moto resta più stretta, più semplice da infilare tra le auto in coda." },
        { tipo: "paragrafo", testo: "I contro:" },
        { tipo: "consiglio", numero: 1, titolo: "Protezione limitata", testo: "In caso di caduta il contenuto è molto più esposto." },
        { tipo: "consiglio", numero: 2, titolo: "Sicurezza minore", testo: "Con un taglierino, in due secondi qualcuno può aprirtele: non è uno scenario così raro, specie nelle soste in città." },
        { tipo: "consiglio", numero: 3, titolo: "Tenuta dell'acqua da verificare sempre", testo: "Anche le \"impermeabili\" spesso reggono bene la pioggia leggera ma vanno in crisi con un acquazzone lungo, a meno di modelli davvero di fascia alta." },
        { tipo: "consiglio", numero: 4, titolo: "Si deformano", testo: "Nel tempo, o se le carichi troppo, perdono forma e tenuta sulle cinghie." },
        { tipo: "sottotitolo", testo: "Quindi quale scegliere?" },
        { tipo: "paragrafo", testo: "Dipende dal tuo tipo di viaggio, non c'è una risposta giusta per tutti:" },
        { tipo: "consiglio", numero: 1, titolo: "Rigide", testo: "Se fai soprattutto asfalto, viaggi lunghi, e vuoi zero pensieri su pioggia e furti. Io per questo motivo sono passato alle Givi Outback Evo e non tornerei indietro." },
        { tipo: "consiglio", numero: 2, titolo: "Morbide", testo: "Se fai anche sterrato, viaggi leggeri, o hai un budget limitato in partenza: restano la scelta più pratica e agile." },
        { tipo: "consiglio", numero: 3, titolo: "Una combinazione", testo: "Molti finiscono per usare rigide per il grosso del bagaglio, dove serve sicurezza e tenuta, e morbide o un borsone da sella per l'essenziale che vuoi sempre a portata di mano." },
        { tipo: "paragrafo", testo: "In sintesi: le rigide vincono su protezione e sicurezza ma pesano (letteralmente) sul portafoglio e sulla maneggevolezza; le morbide vincono su leggerezza e prezzo ma ti chiedono più attenzione su pioggia forte e soste incustodite. Io sono finito con le rigide dopo l'esperienza del primo viaggio, ma se stai iniziando ora, non è detto che sia la scelta giusta anche per te." },
        { tipo: "paragrafo", testo: "Tu che borse usi? Se hai una combinazione che funziona bene, fammelo sapere! Potrebbe essere oggetto di un nuovo articolo." }
      ]
    },
    {
      titolo: "Non facciamoci fregare: pulire la catena della moto alla perfezione con pochi euro",
      categoria: "Manutenzione",
      excerpt: "Perché spendere così tanto in sgrassatori, quando la soluzione è più economica di quanto sembri? Scopriamo insieme il metodo più efficiente ed economico per pulire la trasmissione alla perfezione!",
      copertina: "/img/manuale/catena/copertina-video.jpg",
      autore: "Il Motonauta",
      data: "2026-09-25",
      blocchi: [
        { tipo: "paragrafo", testo: "Ammetto che a un certo punto mi sono stufato di spendere soldi in sgrassatori spray per la catena. Le bombolette più famose, come quelle di Motul e Ipone, costano tra i 10 e i 22 euro e con 400 ml, se ti va bene, pulisci la catena da cima a fondo tre volte." },
        { tipo: "paragrafo", testo: "La mia alternativa costa meno di un caffè a pulizia: del semplice petrolio bianco, un pennello e una spazzola per catena." },
        { tipo: "sottotitolo", testo: "Quanto si risparmia davvero" },
        { tipo: "paragrafo", testo: "Una latta da 1 litro di petrolio bianco l'ho pagata meno di 5 euro, e per pulire la catena alla perfezione ne bastano a malapena 50 ml. Con un litro fai una ventina di pulizie complete; con una bomboletta da 400 ml, che costa il doppio o di più, ne fai tre." },
        { tipo: "sottotitolo", testo: "Come la pulisco" },
        { tipo: "paragrafo", testo: "Prima tutto il procedimento in venti secondi, poi passo per passo." },
        { tipo: "video", animazione: true, src: "/img/manuale/catena/pulizia-catena.mp4", srcWebm: "/img/manuale/catena/pulizia-catena.webm", poster: "/img/manuale/catena/video-poster.jpg", alt: "Animazione della pulizia della catena in sei passaggi" },
        {
          tipo: "consiglio", numero: 1, titolo: "Petrolio bianco con il pennello",
          testo: "Intingi il pennello nel petrolio bianco e passalo bene in ogni punto della catena, maglia per maglia, facendo girare la ruota posteriore con la moto sul cavalletto centrale o su un alzamoto.",
          immagine: { src: "/img/manuale/catena/passo-1.svg" }
        },
        {
          tipo: "consiglio", numero: 2, titolo: "Spazzola per catena",
          testo: "Passa la spazzola fatta apposta per la catena, quella a tre lati che la abbraccia, avanti e indietro su tutta la lunghezza: le setole entrano tra le maglie e staccano il grasso vecchio e lo sporco che il petrolio ha sciolto.",
          immagine: { src: "/img/manuale/catena/passo-2.svg" }
        },
        {
          tipo: "consiglio", numero: 3, titolo: "Aria compressa",
          testo: "Soffia la catena con l'aria compressa: spurga via il petrolio e lo sporco rimasti tra le maglie e i rulli.",
          immagine: { src: "/img/manuale/catena/passo-3.svg" }
        },
        {
          tipo: "consiglio", numero: 4, titolo: "Panno per asciugare",
          testo: "Passa un panno su tutta la catena per raccogliere e asciugare quello che l'aria compressa ha spurgato via.",
          immagine: { src: "/img/manuale/catena/passo-4.svg" }
        },
        {
          tipo: "consiglio", numero: 5, titolo: "Aspetta un'oretta",
          testo: "Il petrolio bianco ci mette un po' a evaporare del tutto: lascia la catena ad asciugare per circa un'ora prima di ingrassarla, altrimenti il grasso non fa presa.",
          immagine: { src: "/img/manuale/catena/passo-5.svg" }
        },
        {
          tipo: "consiglio", numero: 6, titolo: "Grasso spray",
          testo: "Una catena pulita va lubrificata. Io uso il grasso spray di Ipone, quello con cui mi sono trovato meglio in assoluto, passato su tutta la catena con la ruota che gira.",
          immagine: { src: "/img/manuale/catena/passo-6.svg" }
        },
        { tipo: "sottotitolo", testo: "L'unico neo: ci vuole tempo" },
        { tipo: "paragrafo", testo: "Rispetto allo spray, questo metodo ha un solo difetto: tra spazzola, aria compressa, panno e asciugatura serve un'ora buona. Per questo io pulisco la catena col petrolio bianco ogni settimana, con calma, durante le normali manutenzioni alla moto. In viaggio invece mi porto gli spray, che fanno lo stesso lavoro in pochi minuti quando non hai un garage a disposizione." },
        { tipo: "sottotitolo", testo: "\u00abMa il petrolio rovina gli O-ring!\u00bb" },
        { tipo: "paragrafo", testo: "È l'obiezione che arriva sempre, e non è vera. Sulla latta c'è scritto che è ideale per sgrassare unto e grasso dalle superfici verniciate e che non intacca gomma e plastiche, e la conferma arriva anche dalla chimica: Motocrawl spiega a livello molecolare perché il petrolio bianco scioglie così bene lo sporco e invece la gomma degli O-ring non la tocca. Il suo video lo trovi qui sotto." },
        { tipo: "link", label: "Il reel di Motocrawl che lo spiega a livello molecolare", url: "https://www.instagram.com/reel/DeR-F-_iEwi/" },
        { tipo: "paragrafo", testo: "E la prova pratica ce l'ho sotto gli occhi: la mia catena l'ho pulita così già tre volte, brilla ed è ancora come nuova." },
        { tipo: "sottotitolo", testo: "Due accortezze" },
        { tipo: "immagine", src: "/img/manuale/catena/accortezze.svg", alt: "Niente fiamme, niente petrolio su gomma e freno, cartone sotto e finestra aperta" },
        {
          tipo: "consiglio", numero: 1, titolo: "Lontano da gomma e freni",
          testo: "Non farlo colare su pneumatico, disco e pastiglie posteriori: metti un cartone sotto e tieni il panno a portata di mano."
        },
        {
          tipo: "consiglio", numero: 2, titolo: "All'aperto e lontano da fiamme",
          testo: "È infiammabile: lavora in un posto ventilato e lascia asciugare i panni all'aria prima di buttarli."
        },
        { tipo: "paragrafo", testo: "Tu come pulisci la catena? Se hai un trucco che funziona, scrivimelo: potrebbe diventare il prossimo articolo." },
        { tipo: "link", label: "Guarda il video dove lo spiego", url: "https://www.instagram.com/reel/Ddriftvx0Ln/" }
      ]
    },
    {
      titolo: "Le tue valigie sono a norma? La regola dei 50 cm che nessuno ti dice",
      categoria: "Equipaggiamento",
      excerpt: "Il Codice della Strada vieta bagagli che sporgano più di 50 cm per lato dal centro della moto, e tante valigie, per colpa del telaio, finiscono oltre. Come controllare le tue prima di comprarle, e l'alternativa che costa un ottavo se viaggi da solo.",
      copertina: "/img/manuale/valigie/copertina.jpg",
      autore: "Il Motonauta",
      data: "2026-10-12",
      blocchi: [
        { tipo: "paragrafo", testo: "Finalmente siamo pronti per partire in moto. Ma abbiamo davvero la certezza di avere la moto a norma? Le valigie laterali sono la cosa più comoda del mondo, chiariamoci, ma il fatto che tu le possa comprare non significa che le possa anche montare." },
        { tipo: "paragrafo", testo: "Ad esempio: sai di quanto può sporgere il bagaglio della tua moto?" },
        { tipo: "sottotitolo", testo: "Cosa dice il Codice della Strada" },
        { tipo: "paragrafo", testo: "La regola sta nell'articolo 170, comma 5: sulle moto è vietato trasportare oggetti che non siano solidamente assicurati, «che sporgano lateralmente rispetto all'asse del veicolo o longitudinalmente rispetto alla sagoma di esso oltre i cinquanta centimetri». Tradotto: dal centro della moto, il bagaglio non può andare oltre i 50 cm per lato. Chi sgarra rischia una multa, prevista dal comma 6 dello stesso articolo." },
        { tipo: "immagine", src: "/img/manuale/valigie/limiti.svg", alt: "Moto vista da dietro con i limiti dei 50 cm per lato: a sinistra valigie a 47 cm dal centro, a destra valigie spinte oltre il limite dal telaio", caption: "A sinistra le mie: 47 cm dal centro, dentro il limite. A destra il caso di tante valigie in commercio: il telaio le spinge oltre i 50 cm." },
        { tipo: "sottotitolo", testo: "Le mie: 47 cm per lato" },
        { tipo: "paragrafo", testo: "Io l'ho misurato con il metro: con le mie Givi Trekker Outback EVO da 37 litri l'una, sulla S1000XR arrivo a 47 cm dal centro, quindi sono dentro. Merito anche del telaio Camside, molto compatto, che tiene le valigie il più aderenti possibile alla moto: ne ho parlato nella recensione del tris." },
        { tipo: "link", label: "La mia recensione del tris Givi Trekker Outback EVO", url: "/manuale/cosa-ne-penso-del-mio-tris-givi-trekker-outback-evo" },
        { tipo: "sottotitolo", testo: "Il problema: telai che sporgono troppo" },
        { tipo: "paragrafo", testo: "Il guaio è che è pieno di valigie che, per colpa del telaio che sporge troppo, finiscono di gran lunga oltre i 50 centimetri massimi. Un esempio sono le SW-Motech Urban per la Honda Hornet CB750. E spesso questa cosa non viene detta dai venditori, e soprattutto viene nascosta dalle case che le producono." },
        { tipo: "sottotitolo", testo: "Prima di comprarle, controlla" },
        {
          tipo: "consiglio", numero: 1, titolo: "Chiedi la larghezza con tutto montato",
          testo: "Non basta la misura della valigia: conta quanto diventa larga la moto con valigie e telaio montati. Chiedila al venditore prima di ordinare, e se la risposta è vaga fate molta attenzione."
        },
        {
          tipo: "consiglio", numero: 2, titolo: "Misura dal centro, per lato",
          testo: "Il limite è di 50 cm per lato dall'asse della moto, non da un bordo all'altro: misura dal centro della moto fino al punto più esterno, che sia la valigia o il telaio."
        },
        {
          tipo: "consiglio", numero: 3, titolo: "L'eccezione è sul libretto",
          testo: "Le uniche eccezioni riguardano le moto omologate dalla casa madre con una larghezza massima con i bagagli superiore, riportata nei documenti: è il caso, ad esempio, del GS 1250."
        },
        { tipo: "sottotitolo", testo: "Se viaggi da solo, prendi un borsone" },
        { tipo: "paragrafo", testo: "Se volete evitare di spendere 600, 700, 800 euro per due valigie da 30 litri, piuttosto prendete un bel borsone da attaccare dietro: con un settimo, un ottavo della spesa avete gli stessi litri, ma sulla sella. Ovviamente parlo di viaggi in solitaria. Il mio è un borsone generico da 60 litri: l'importante è che sia impermeabile." },
        { tipo: "immagine", src: "/img/manuale/valigie/peso.svg", alt: "A sinistra due valigie laterali da 30 litri con il peso ai lati, a destra un borsone da 60 litri sulla sella con il peso al centro", caption: "Stessi litri, ma il borsone tiene il peso al centro invece che ai lati." },
        { tipo: "paragrafo", testo: "E la cosa migliore è che c'è meno rischio che vi sbilanci, o comunque non dovete fare un controllo dei carichi esagerato, perché il peso è al centro invece che il più esterno possibile alla moto." },
        { tipo: "link", label: "Perché in solitaria le valigie sono sopravvalutate", url: "/manuale/le-valigie-nei-viaggi-in-solitaria-sono-sopravvalutate" },
        { tipo: "paragrafo", testo: "E voi avete mai controllato la larghezza della vostra moto dopo aver montato le valigie? Scrivetemelo: se la misura vi ha sorpreso, potrebbe finire nel prossimo articolo." },
        { tipo: "link", label: "Guarda il video dove lo spiego", url: "https://www.instagram.com/reel/Db8twTytuho/" }
      ]
    },
    {
      titolo: "Tagliando della S1000XR fai da te: olio e filtri passo per passo",
      categoria: "Manutenzione",
      excerpt: "Olio giusto, quantità, coppie di serraggio, controllo del livello e filtro dell'aria: come fare da soli il tagliando alla BMW S1000XR di seconda generazione (2020-2021), passo per passo con le foto del mio tagliando.",
      copertina: "/img/manuale/tagliando/copertina.jpg",
      autore: "Il Motonauta",
      data: "2026-10-12",
      blocchi: [
        { tipo: "paragrafo", testo: "Il cambio di olio e filtro è il lavoro di manutenzione più semplice da fare in garage sulla S1000XR, e fatto con calma porta via meno di un'ora, più il tempo per far scolare bene l'olio. Il filtro dell'aria chiede un po' più di smontaggio, ma niente di impossibile. Questa guida vale per la seconda generazione, quella dal 2020 in poi, quindi anche per la 2021." },
        { tipo: "paragrafo", testo: "BMW prevede olio, filtro dell'olio e filtro dell'aria ogni 10.000 km o una volta l'anno, quello che arriva prima. Il primo controllo, quello di rodaggio tra 500 e 1.200 km, conviene farlo in concessionaria, perché oltre all'olio leggono anche la centralina." },
        { tipo: "sottotitolo", testo: "Cosa serve" },
        { tipo: "paragrafo", testo: "Olio: circa 4 litri di SAE 5W-40 con specifica API SJ / JASO MA2, senza additivi al molibdeno (il manuale li vieta). BMW consiglia il suo ADVANTEC Ultimate 5W-40. Filtro dell'olio: il codice BMW attuale è 11425B70298, che ha sostituito i vecchi 11427721779 e 11428409567. Una rondella nuova per il tappo di scarico. Filtro dell'aria: codice BMW 13729444643. Attrezzi: chiave Torx T50 per il tappo, Torx T25 per pannello e carena, chiave a tazza per il filtro, chiave dinamometrica, bacinella, imbuto, un foglio di alluminio, qualche straccio, un tronchesino e delle fascette nuove." },
        { tipo: "sottotitolo", testo: "Passo per passo" },
        {
          tipo: "consiglio", numero: 1, titolo: "Togli il pannello basso destro",
          testo: "È il pannello in basso sul lato destro, quello dei collettori di scarico: tre viti Torx T25 e due incastri a pressione. Toglilo a motore freddo, così non rischi di toccare i collettori roventi.",
          immagine: { src: "/img/manuale/tagliando/foto-1.jpg", caption: "Il pannello basso destro che si stacca." }
        },
        {
          tipo: "consiglio", numero: 2, titolo: "Scalda il motore e scarica l'olio",
          testo: "Con la moto sul cavalletto centrale, accendi e lascia girare al minimo per due o tre minuti: l'olio caldo scende meglio e porta via più sporco (usa i guanti, olio e collettori scottano). Poi metti la bacinella sotto la coppa e togli il tappo di riempimento: entrando aria, l'olio scende più veloce. Svita il tappo di scarico (Torx T50) sotto la coppa, tenendo la mano lontana dal getto, e lascia scolare con calma: io intanto faccio il filtro dell'aria (passi 8-12), così non si perde tempo.",
          immagine: { src: "/img/manuale/tagliando/foto-3.jpg", caption: "Il tappo di scarico si svita con il cricchetto, la bacinella è già sotto." }
        },
        {
          tipo: "consiglio", numero: 3, titolo: "Svita il filtro",
          testo: "Il filtro sta sul lato destro, attaccato ai collettori. Coprili con un foglio di alluminio, perché l'olio che cola li sporca e poi fuma. Svitalo con la chiave a tazza e fallo uscire inclinato, con calma: se non passa, allenta la piccola staffa accanto (vite Torx T30) per avere un po' più di spazio.",
          immagine: { src: "/img/manuale/tagliando/foto-4.jpg", caption: "Il filtro sta proprio tra i collettori: serve una chiave a tazza bassa." }
        },
        {
          tipo: "consiglio", numero: 4, titolo: "Monta il filtro nuovo",
          testo: "Pulisci bene la superficie dove appoggia e ungi la guarnizione di gomma del filtro nuovo con un velo d'olio (va bene anche un po' di quello vecchio). Avvitalo a mano finché la guarnizione tocca e poi chiudilo con la dinamometrica a 11 Nm, come indica il manuale d'officina. Non stringerlo di più: si rovinano la guarnizione e il filetto.",
          immagine: { src: "/img/manuale/tagliando/foto-5.jpg", caption: "Dinamometrica e, secondo il manuale d'officina, 11 Nm." }
        },
        {
          tipo: "consiglio", numero: 5, titolo: "Rimonta il tappo di scarico",
          testo: "Pulisci il tappo, che ha un magnete: se ci trovi solo una polvere finissima è normale, se ci sono pezzetti di metallo fallo vedere. Guarnizione vecchia via e sempre una nuova, poi serralo a 28 Nm con la dinamometrica: la coppa è d'alluminio, il filetto non perdona.",
          immagine: { src: "/img/manuale/tagliando/foto-6.jpg", caption: "Guarnizione vecchia via, quella nuova, e il bullone di scarico a 28 Nm." }
        },
        {
          tipo: "consiglio", numero: 6, titolo: "Olio nuovo",
          testo: "Versalo con l'imbuto dal tappo di riempimento. Il manuale BMW indica circa 4 litri con il cambio del filtro: io verso quattro bottiglie da un litro, una alla volta. Poi chiudi il tappo e passa subito al controllo del livello.",
          immagine: { src: "/img/manuale/tagliando/foto-7.jpg", caption: "Uno, due, tre e quattro: un litro alla volta con l'imbuto." }
        },
        {
          tipo: "consiglio", numero: 7, titolo: "Controlla il livello e rimonta il pannello",
          testo: "Accendi e lascia girare al minimo in folle per un minuto, così si riempie anche il filtro, poi spegni e aspetta cinque minuti. Con la moto dritta, non appoggiata sul cavalletto laterale, guarda l'oblò: il livello deve stare tra MIN e MAX. Tra le due tacche c'è al massimo 1,3 litri: se sei sotto il MIN aggiungi un goccio alla volta. Se invece sei sopra il MAX non scolarlo da solo: il manuale avverte che anche troppo olio danneggia il motore e consiglia di farlo correggere in officina. Infine controlla che non goccioli niente da tappo e filtro, pulisci i collettori dall'olio (le prime volte fumeranno un po', è normale) e rimonta il pannello: prima i due incastri, poi le tre viti T25. Dopo il primo giro ricontrolla il livello a motore caldo."
        },
        { tipo: "sottotitolo", testo: "Il filtro dell'aria" },
        { tipo: "paragrafo", testo: "La scatola del filtro sta sotto la carena superiore del serbatoio, davanti alla sella. Per arrivarci bisogna liberare il serbatoio dell'olio delle sospensioni ESA, che le sta sopra. Il momento giusto per farlo è mentre l'olio motore scola nella bacinella." },
        {
          tipo: "consiglio", numero: 8, titolo: "Smonta la carena superiore del serbatoio",
          testo: "Togli le viti della carena superiore del serbatoio e sollevala con calma: sotto ci sono i cavi dell'ESA e il suo serbatoio dell'olio.",
          immagine: { src: "/img/manuale/tagliando/foto-10.jpg", caption: "La carena superiore del serbatoio appena tolta: sotto c'è il serbatoio." }
        },
        {
          tipo: "consiglio", numero: 9, titolo: "Taglia le fascette dei cavi dell'ESA",
          testo: "I cavi del sistema ESA sono fissati all'alloggio del serbatoio con delle fascette: tagliale con il tronchesino, attento a non toccare i cavi. Al rimontaggio ne metterai di nuove.",
          immagine: { src: "/img/manuale/tagliando/foto-11.jpg", caption: "Le fascette che tengono i cavi dell'ESA, da tagliare." }
        },
        {
          tipo: "consiglio", numero: 10, titolo: "Sposta il serbatoio dell'olio dell'ESA",
          testo: "Smonta il serbatoio dell'olio delle sospensioni ESA dal suo supporto e spostalo di lato, fuori dalla sua sede, senza staccare il tubo: deve solo lasciare spazio al coperchio del filtro.",
          immagine: { src: "/img/manuale/tagliando/foto-12.jpg", caption: "Da sopra la moto smonto il serbatoio dell'olio dell'ESA e lo sposto dalla sua sede." }
        },
        {
          tipo: "consiglio", numero: 11, titolo: "Alza il coperchio e cambia il filtro",
          testo: "Togli il coperchio della scatola del filtro alzandolo verso l'alto, tira su il filtro vecchio e metti quello nuovo nella stessa posizione, ben appoggiato nella sua sede.",
          immagine: { src: "/img/manuale/tagliando/foto-13.jpg", caption: "Le mani nella scatola del filtro: tiro su quello vecchio." }
        },
        {
          tipo: "consiglio", numero: 12, titolo: "Richiudi tutto",
          testo: "Rimetti il coperchio, riporta il serbatoio dell'ESA nella sua sede e fissalo, blocca i cavi con fascette nuove come erano prima e rimonta la carena superiore del serbatoio.",
          immagine: { src: "/img/manuale/tagliando/foto-14.jpg", caption: "Si richiude tutto: coperchio, serbatoio dell'ESA, fascette nuove e carena." }
        },
        { tipo: "sottotitolo", testo: "L'avviso del service e l'olio vecchio" },
        { tipo: "paragrafo", testo: "Il tagliando fatto in casa non spegne l'avviso del service sul cruscotto: per azzerarlo serve il concessionario oppure un tester di diagnosi come il GS-911. L'olio vecchio e il filtro non vanno nel cassonetto: portali all'isola ecologica o da un'officina, che li smaltisce." },
        { tipo: "sottotitolo", testo: "In breve" },
        { tipo: "paragrafo", testo: "Olio SAE 5W-40 API SJ / JASO MA2, circa 4 litri con il filtro (quattro bottiglie da un litro). Filtro BMW 11425B70298, a mano più 11 Nm. Tappo di scarico Torx T50 con rondella nuova, 28 Nm. Livello a motore caldo, moto dritta, tra MIN e MAX. Filtro dell'aria BMW 13729444643. Tutto ogni 10.000 km o una volta l'anno." },
        { tipo: "paragrafo", testo: "Tu il tagliando lo fai da solo o lo lasci alla concessionaria? Se hai un trucco per non sporcare i collettori, scrivimelo." },
        { tipo: "link", label: "Guarda il video del mio tagliando", url: "https://www.instagram.com/reel/Dd6uiaXoSXY/" }
      ]
    },
    {
      titolo: "Hai un aereo in garage e non lo sai: le tecnologie della moto nate in aviazione",
      categoria: "Tecnica",
      excerpt: "Ride-by-wire, piattaforma inerziale a 6 assi e fibra di carbonio: tre tecnologie che le moto di oggi hanno preso in prestito dagli aerei, spiegate in parole semplici (e senza bisogno della scuola di volo).",
      copertina: "/img/manuale/aereo/copertina.jpg",
      autore: "Il Motonauta",
      data: "2026-10-13",
      blocchi: [
        { tipo: "paragrafo", testo: "Sei cosciente di avere un vero e proprio aereo in garage? Sembra una battuta, ma gran parte delle tecnologie che hanno queste belle bestioline, la mia S1000XR compresa, in realtà vengono dal campo aeronautico. Ecco le tre più importanti, e cosa fanno davvero sulla tua moto." },
        {
          tipo: "consiglio", numero: 1, titolo: "Il ride-by-wire, figlio del fly-by-wire",
          testo: "Negli aerei il fly-by-wire si usa dagli anni Settanta: lo Space Shuttle lo aveva già nei voli di prova del 1977. L'idea è che i comandi del pilota, cloche e pedaliera, non siano più collegati meccanicamente a cavi e tiranti, ma mandino solo impulsi elettrici a un computer, che poi muove le parti dell'aereo. Così si risparmiano parecchi chili di peso. Oggi lo troviamo su gran parte delle moto, applicato al gas: la manopola non tira più un cavo collegato al motore, ma manda un segnale alla centralina, che apre le farfalle con un motorino elettrico. È grazie a questo che la moto può avere le modalità di guida e il cruise control.",
          immagine: { src: "/img/manuale/aereo/ride-by-wire.jpg", caption: "Sulla XR la manopola del gas non ha più il cavo: parla direttamente con la centralina." }
        },
        {
          tipo: "consiglio", numero: 2, titolo: "La piattaforma inerziale a 6 assi (IMU)",
          testo: "IMU sta per inertial measurement unit, in italiano unità di misura inerziale. È una centralina che deriva dai sistemi di navigazione degli aerei: dentro ha accelerometri e giroscopi che misurano in ogni istante come si sta muovendo il mezzo. Sei assi vuol dire che misura le accelerazioni in tre direzioni (avanti e indietro, di lato, su e giù) e le rotazioni attorno a tre assi: quanto la moto è piegata, quanto si sta impennando o affondando in frenata, e quanto sta girando su se stessa. Su questi dati lavorano tutte le sicurezze della moto, come il cornering ABS (l'ABS che funziona anche in piega), il traction control e l'anti-impennata. Praticamente tutto ciò che questa moto ha di intelligente.",
          immagine: { src: "/img/manuale/aereo/imu-2.jpg", caption: "Cornering ABS, traction control e anti-impennata: dietro c'è sempre la piattaforma inerziale." }
        },
        {
          tipo: "consiglio", numero: 3, titolo: "La fibra di carbonio",
          testo: "E poi non parliamo della fibra di carbonio: è solo grazie al campo aeronautico se oggi si usa un materiale così leggero e così resistente. Ovviamente qui vi sto prendendo in giro, perché sulla mia moto non c'è neanche un singolo grammo di fibra di carbonio. Però, al contrario della mia moto, nei velivoli si trova davvero: il Boeing 787, per esempio, è costruito in parte proprio con materiali in fibra di carbonio.",
          immagine: { src: "/img/manuale/aereo/carbonio.jpg", caption: "Carbonio? Sulla mia carena neanche un grammo." }
        },
        { tipo: "paragrafo", testo: "E tu lo sapevi di avere un aereo in garage? Se ti viene in mente un'altra tecnologia della moto nata in aviazione, scrivimela: la aggiungo qui." },
        { tipo: "link", label: "Guarda il video originale", url: "https://www.instagram.com/reel/DcT3SSuNIfr/" }
      ]
    },
    {
      titolo: "Rimessaggio invernale della moto fatto bene: 8 cose da fare prima di fermarla",
      categoria: "Manutenzione",
      excerpt: "Il mio consiglio è non fermarla mai. Ma se proprio devi metterla a riposo per l'inverno, fallo bene: gomme, cavalletto, serbatoio, olio, carene, batteria, catena e telo, gli 8 passi per ritrovarla pronta a primavera.",
      copertina: "/img/manuale/rimessaggio/copertina.jpg",
      autore: "Il Motonauta",
      data: "2026-10-15",
      blocchi: [
        { tipo: "paragrafo", testo: "Il mio consiglio è sempre lo stesso: non fermare la moto. Ma se proprio devi metterla a riposo per l'inverno, fallo bene, così a primavera la ritrovi pronta a ripartire invece che piena di sorprese. Ecco cosa faccio, un passo alla volta." },
        {
          tipo: "consiglio", numero: 1, titolo: "Gonfia le gomme di mezzo bar in più",
          testo: "Prima di tutto porta gli pneumatici a mezzo bar in più rispetto alla pressione che usi di solito. Ferma per mesi, la moto pesa sempre sugli stessi punti delle gomme: partire un po' più gonfi le aiuta a non deformarsi. In primavera, prima di ripartire, rimetti la pressione giusta.",
          immagine: { src: "/img/manuale/rimessaggio/gomme.jpg", caption: "Prima cosa: mezzo bar in più nelle gomme." }
        },
        {
          tipo: "consiglio", numero: 2, titolo: "Sul cavalletto centrale, o su due alzamoto",
          testo: "Metti la moto sul cavalletto centrale. Se non ce l'hai, usa due cavalletti alzamoto, uno davanti e uno dietro. Insomma, l'importante è che le gomme non restino appoggiate sempre nello stesso punto per tutto l'inverno.",
          immagine: { src: "/img/manuale/rimessaggio/cavalletto.jpg", caption: "Niente centrale? Due cavalletti alzamoto come questo." }
        },
        {
          tipo: "consiglio", numero: 3, titolo: "Serbatoio pieno fino all'orlo",
          testo: "Riempi il serbatoio fino all'orlo: meno aria resta dentro, meno ossigeno c'è, e meno rischio c'è che si formi ruggine.",
          immagine: { src: "/img/manuale/rimessaggio/serbatoio.jpg", caption: "Pieno fino all'orlo: meno ossigeno, meno ruggine." }
        },
        {
          tipo: "consiglio", numero: 4, titolo: "Olio e filtri adesso, non a primavera",
          testo: "Fai un bel cambio di olio e filtri prima di fermarla. Così nell'olio motore non restano i sedimenti che, fermi per mesi, possono danneggiare le parti interne, e la prossima stagione la moto è già pronta per partire.",
          immagine: { src: "/img/manuale/rimessaggio/olio.jpg", caption: "Olio e filtri nuovi prima del letargo." }
        },
        {
          tipo: "consiglio", numero: 5, titolo: "Pulisci bene tutte le carene",
          testo: "Pulisci per bene tutte le carene. Ricordati che gli insetti spiaccicati sono molto acidi: lasciati lì per mesi possono rovinare le plastiche, soprattutto se hai le grafiche. Insomma, fateci attenzione.",
          immagine: { src: "/img/manuale/rimessaggio/carene.jpg", caption: "Via gli insetti: sono acidi e rovinano plastiche e grafiche." }
        },
        {
          tipo: "consiglio", numero: 6, titolo: "Batteria attaccata a un mantenitore di carica",
          testo: "Attacca la batteria a un buon mantenitore di carica, così non si scarica durante l'inverno. Nel mio caso è semplicissimo, perché uso quello originale BMW.",
          immagine: { src: "/img/manuale/rimessaggio/batteria.jpg", caption: "Il mantenitore di carica: il mio è quello originale BMW." }
        },
        {
          tipo: "consiglio", numero: 7, titolo: "Catena pulita e ingrassata",
          testo: "Dai una bella pulita alla catena e ingrassala, così resta protetta dal grasso per tutto il tempo in cui la moto sta ferma."
        },
        {
          tipo: "consiglio", numero: 8, titolo: "Sotto un telo traspirante",
          testo: "Alla fine di tutto mettila sotto un telo traspirante. Questo però non ve lo posso mostrare, perché la mia moto non la fermo. Mai."
        },
        { tipo: "sottotitolo", testo: "Per approfondire" },
        { tipo: "link", label: "Il tagliando olio e filtri fatto da me, passo per passo", url: "/manuale/tagliando-della-s1000xr-fai-da-te-olio-e-filtri-passo-per-passo" },
        { tipo: "link", label: "Come pulisco la catena con pochi euro", url: "/manuale/non-facciamoci-fregare-pulire-la-catena-della-moto-alla-perfezione-con-pochi-euro" },
        { tipo: "paragrafo", testo: "E tu la moto d'inverno la fermi o sei come me? Se hai un trucco per il rimessaggio che qui manca, scrivimelo." },
        { tipo: "link", label: "Guarda il video originale", url: "https://www.instagram.com/reel/Ded4uFHv-b7/" }
      ]
    },
    {
      titolo: "Campeggio in moto senza rinunce: tutto quello che carico sulla XR per una notte in tenda",
      categoria: "Equipaggiamento",
      excerpt: "Con le altre moto portavo il minimo indispensabile, con la XR mi porto tutte le comodità che posso: dal materassino alla moka, valigia per valigia, e il trucco per non far pendere la moto da un lato.",
      copertina: "/img/manuale/campeggio/copertina.jpg",
      autore: "Il Motonauta",
      data: "2026-10-15",
      blocchi: [
        { tipo: "paragrafo", testo: "Qualche articolo fa vi ho spiegato come dormire in tenda anche quando lo spazio praticamente non c'è, con i 5 accessori per una mototendata compatta. Oggi facciamo l'esatto contrario. Con il GSX-R e con la XSR portavo il minimo indispensabile e il bagaglio totale era microscopico, ma adesso che ho una mucca come la S1000XR mi porto tutte le comodità che posso. Ecco tutto quello che carico per un weekend in tenda con gli amici, borsa per borsa." },
        { tipo: "sottotitolo", testo: "La prima valigia: per dormire e per le emergenze" },
        {
          tipo: "consiglio", numero: 1, titolo: "Il materassino: ingombrante, ma comodo",
          testo: "Il primo a entrare è il materassino. Lo ammetto: è ingombrante, ma è molto comodo. Nell'altro articolo vi consigliavo quello tascabile, che chiuso sta in una tasca ma non vi fa certo dormire come a casa. Qui il ragionamento è l'opposto: lo spazio c'è, e dopo una giornata intera in sella dormire bene vale tutti i litri che occupa.",
          immagine: { src: "/img/manuale/campeggio/materassino.jpg", caption: "Il materassino comodo: occupa mezza valigia, ma ne vale la pena." }
        },
        {
          tipo: "consiglio", numero: 2, titolo: "Il mio kit da campeggio (e un cuscino vero)",
          testo: "Accanto al materassino ci va tutto il kit che uso per andare in campeggio, che ho messo insieme io pezzo per pezzo: ci farò un video a parte, perché merita. E poi il cuscino, comprato proprio il giorno del video. Sì, un cuscino vero: ve l'ho detto, qui non si rinuncia a niente."
        },
        {
          tipo: "consiglio", numero: 3, titolo: "Pala, kit gomme e compressore: le emergenze",
          testo: "Poi c'è la parte che spero sempre di non dover usare: una pala per le situazioni di emergenza, il kit per riparare le gomme e un compressore portatile. E quando dico portatile, intendo molto portatile. Una gomma a terra lontano da tutto trasforma la notte in tenda in un'avventura nel senso sbagliato: con kit e compressore in valigia ripartite da soli, senza aspettare nessuno.",
          immagine: { src: "/img/manuale/campeggio/pala.jpg", caption: "La pala per le emergenze: spero sempre di non usarla." }
        },
        { tipo: "immagine", src: "/img/manuale/campeggio/compressore.jpg", caption: "Il compressore portatile, anzi molto portatile, accanto al kit per riparare le gomme." },
        { tipo: "sottotitolo", testo: "La seconda valigia: la cucina (e la colazione)" },
        {
          tipo: "consiglio", numero: 4, titolo: "La sedia da campeggio",
          testo: "Nell'altra valigia si parte dalla sedia da campeggio. Dopo ore in sella, la sera sedersi su una sedia vera invece che su un sasso è tutta un'altra vita.",
          immagine: { src: "/img/manuale/campeggio/sedia.jpg", caption: "La sedia da campeggio: la prima cosa della seconda valigia." }
        },
        {
          tipo: "consiglio", numero: 5, titolo: "Bollitore, pentole e padelle",
          testo: "Poi il bollitore e il kit di pentole e padelle per cucinare. Ci metto anche del cibo disidratato, ma è solo per le emergenze: la sera di solito ci mangiamo la carne alla brace, e contro la brace il disidratato non ha speranze.",
          immagine: { src: "/img/manuale/campeggio/pentole.jpg", caption: "Pentole e padelle: in tenda si cucina sul serio." }
        },
        {
          tipo: "consiglio", numero: 6, titolo: "La pochette per la notte",
          testo: "Una pochette con tutto il minimo indispensabile per dormire e qualche cosa varia. La comodità è che a fine serata prendete solo quella e la portate in tenda, senza dover svuotare mezza valigia al buio."
        },
        {
          tipo: "consiglio", numero: 7, titolo: "Moka, borsa frigo e una signora crostata",
          testo: "Non poteva mancare la moka con tutto il necessario per fare il caffè, perché la mattina in tenda senza caffè non si riparte. Poi la borsa frigo piena d'acqua e, ciliegina sulla torta, una signora crostata fatta in casa. Sì, anche quella.",
          immagine: { src: "/img/manuale/campeggio/borsa-frigo.jpg", caption: "Borsa frigo piena d'acqua, e sotto c'è anche la crostata." }
        },
        {
          tipo: "consiglio", numero: 8, titolo: "Gli attrezzi per smontare la moto",
          testo: "Per ultimo, il necessario per smontare la moto in caso di emergenza. Non serve quasi mai, ma il giorno che serve, lontano da casa, siete contenti di averlo portato.",
          immagine: { src: "/img/manuale/campeggio/attrezzi.jpg", caption: "Gli attrezzi, per ogni evenienza. E si chiude." }
        },
        { tipo: "sottotitolo", testo: "Il trucco: le due valigie devono pesare uguale" },
        { tipo: "paragrafo", testo: "Guardandole sembra tutto messo a caso, ma in realtà è una pura questione di pesi: le mie due valigie hanno praticamente lo stesso identico peso. Una moto carica che pende da un lato la sentite in ogni curva e in ogni frenata, e con tutti questi chili nelle borse la differenza si fa sentire eccome. Quindi il consiglio è semplice: prima di chiuderle sollevatele tutte e due, e se una pesa più dell'altra spostate qualcosa finché non si bilanciano." },
        { tipo: "sottotitolo", testo: "Bauletto, sella e borsa da serbatoio" },
        {
          tipo: "consiglio", numero: 9, titolo: "Nel bauletto: visiera trasparente, antipioggia e spazio per la giacca",
          testo: "Nel bauletto ci va la visiera trasparente, che se si fa buio prima di arrivare al campo vi salva la serata, e l'antipioggia, che non si sa mai. I vestiti stanno in una sacca molto compatta, tanto per un weekend serve poco. Il resto lo lascio libero apposta: quando mi fermo ci metto dentro la giacca.",
          immagine: { src: "/img/manuale/campeggio/antipioggia.jpg", caption: "L'antipioggia nel bauletto: che non si sa mai." }
        },
        {
          tipo: "consiglio", numero: 10, titolo: "La tenda sul sedile posteriore",
          testo: "Non dimentichiamo la tenda, legata sul sedile posteriore. Ovviamente insieme alla tenda c'è anche il sottotenda, che tengo piegato direttamente dentro: è il trucco che ci ha insegnato Stefano e che vi ho raccontato nell'articolo sulla mototendata compatta.",
          immagine: { src: "/img/manuale/campeggio/tenda.jpg", caption: "La tenda sulla sella posteriore, con il sottotenda già dentro." }
        },
        {
          tipo: "consiglio", numero: 11, titolo: "La borsa da serbatoio: la parte tecnologica",
          testo: "E infine la borsa da serbatoio, con tutta la parte tecnologica: powerbank, telecamere e tutte queste cose qua. È quella che avete sempre sotto mano, quindi ci va quello che vi serve durante il viaggio e alle soste.",
          immagine: { src: "/img/manuale/campeggio/borsa-serbatoio.jpg", caption: "La borsa da serbatoio: powerbank, telecamere e compagnia." }
        },
        { tipo: "paragrafo", testo: "Lo so, sembra tanto per un weekend. Ma con le altre moto ho dormito in tenda con il minimo indispensabile per anni, e adesso che lo spazio c'è me lo godo tutto." },
        { tipo: "sottotitolo", testo: "Per approfondire" },
        { tipo: "link", label: "I 5 accessori per una mototendata compatta (quando lo spazio non c'è)", url: "/manuale/i-5-accessori-definitivi-per-una-mototendata-compatta" },
        { tipo: "link", label: "Gli attrezzi da portare in viaggio, kit gomme e compressore compresi", url: "/manuale/gli-attrezzi-necessari-da-portare-in-viaggio" },
        { tipo: "link", label: "Con le valigie piene, la tua moto è a norma?", url: "/manuale/le-tue-valigie-sono-a-norma-la-regola-dei-50-cm-che-nessuno-ti-dice" },
        { tipo: "paragrafo", testo: "E voi cosa portate nei campeggi in moto? Se c'è qualcosa di cui non potete fare a meno e qui manca, scrivetemelo." },
        { tipo: "link", label: "Guarda il video originale", url: "https://www.instagram.com/reel/DeGtpT_P3qU/" }
      ]
    },
    {
      titolo: "Honda WN7, la mia prova su strada: divertente in curva, ma non l'ho capita",
      categoria: "Prove su strada",
      excerpt: "Ho provato la moto elettrica di Honda: accelerazione istantanea, telaio rigido che in curva diverte e un freno motore che ricarica la batteria. Ma tra sella, buche e città, non riesco proprio a capire per chi sia fatta.",
      copertina: "/img/manuale/wn7/copertina.jpg",
      autore: "Il Motonauta",
      data: "2026-10-15",
      blocchi: [
        { tipo: "paragrafo", testo: "Finalmente ce l'abbiamo fatta: ho provato la Honda WN7, la moto elettrica di Honda. Ci sono salito con la testa di uno abituato al quattro cilindri della mia S1000XR (e prima ancora del GSX-R), quindi prendete questa prova per quello che è: le impressioni sincere di un motociclista a benzina dopo un giro su strada, tra rettilinei, curve e centri abitati. Ecco com'è andata, punto per punto." },
        { tipo: "sottotitolo", testo: "Le mie impressioni, punto per punto" },
        {
          tipo: "consiglio", numero: 1, titolo: "La sella: la più scomoda dai tempi del GSX-R",
          testo: "Partiamo dal punto dolente, letteralmente. È la seduta più scomoda su cui sia salito dai tempi del GSX-R: la sella è molto dura e molto fina, e dopo dieci minuti avevo già problemi all'osso sacro. Su una sportiva lo metti in conto, ma su una moto che dovrebbe portarti in giro tutti i giorni pesa parecchio.",
          immagine: { src: "/img/manuale/wn7/in-sella.jpg", caption: "In sella alla WN7, pronti a partire. L'osso sacro ancora non sapeva cosa lo aspettava." }
        },
        {
          tipo: "consiglio", numero: 2, titolo: "Il freno motore che ricarica la batteria",
          testo: "Qui c'è la cosa più curiosa per chi viene dal motore a benzina. Il freno motore si regola: se lo porto dal minimo al livello tre, quando chiudo il gas la moto rallenta tantissimo, e quella frenata in realtà serve a ricaricare la batteria. Al massimo è paurosa: lasci l'acceleratore ed è praticamente un'inchiodata. Sarà che sono abituato al quattro cilindri, ma dopo qualche chilometro ho trovato il mio equilibrio: tenerlo a livello uno è l'ideale, perché la moto rallenta in modo più naturale, più simile a quello a cui sono abituato."
        },
        {
          tipo: "consiglio", numero: 3, titolo: "Accelerazione istantanea (fino a 100 all'ora)",
          testo: "L'accelerazione ovviamente è elettrica, quindi istantanea: giri la manopola e la spinta c'è subito, senza aspettare che salgano i giri. La potenza veramente non le manca, almeno fino ai 100 km/h. Dai 99 km/h in su però ho sentito come una differenza, come se cambiasse qualcosa: non so se c'è un limite elettronico o qualcosa del genere, ma la sensazione è stata quella.",
          immagine: { src: "/img/manuale/wn7/accelerazione.jpg", caption: "Giri la manopola e la spinta arriva subito: niente da aspettare." }
        },
        {
          tipo: "consiglio", numero: 4, titolo: "Sospensioni rigide: nelle buche paghi il conto",
          testo: "Le sospensioni sono veramente, veramente rigide: le buche le senti tutte. Il rovescio della medaglia è che l'assetto ti permette di svicolare con un'agilità incredibile, e nei movimenti veloci sei molto più libero. Però poi arrivi nelle buche, e lì paghi il conto.",
          immagine: { src: "/img/manuale/wn7/buche.jpg", caption: "Su un asfalto così, con queste sospensioni, le buche le conti una per una." }
        },
        {
          tipo: "consiglio", numero: 5, titolo: "In curva il telaio diverte parecchio",
          testo: "Ed esattamente come immaginavo, a discapito della comodità in città e nelle buche, questo telaio così rigido, bello tosto, in curva ti fa divertire parecchio. È il motivo per cui scendi con il sorriso, nonostante l'osso sacro.",
          immagine: { src: "/img/manuale/wn7/curva.jpg", caption: "Dove il telaio rigido ripaga: in curva." }
        },
        {
          tipo: "consiglio", numero: 6, titolo: "Niente marce (e l'abitudine è dura a morire)",
          testo: "Una cosa che non pensavo mi desse così fastidio: non avendo marce, prima di ogni curva l'abitudine è quella di cercare la marcia per dare una scalata, e non c'è niente da scalare. È solo questione di abitudine, ma per chi guida da anni con il cambio è fastidiosissimo."
        },
        {
          tipo: "consiglio", numero: 7, titolo: "Frenata promossa, e a terra ci si arriva bene",
          testo: "La frenata funziona benissimo: ho provato anche una bella inchiodata, e pure in questo si comporta egregiamente. E per chi come me non è un gigante: sono alto un metro e settanta e a terra ci tocco molto, molto bene. Su questo aspetto, nessun problema."
        },
        { tipo: "sottotitolo", testo: "Il mio verdetto: una via di mezzo che non capisco" },
        { tipo: "paragrafo", testo: "Nel complesso questa moto veramente non la capisco. Dovrebbe nascere come moto da città, da usare tutti i giorni: la sera la metti in carica e la mattina riparti, bella comoda. Però poi ti ritrovi un telaio molto rigido che, ripeto, in curva è veramente divertente, mentre in città è praticamente inutilizzabile, perché la sella è scomodissima e le buche le senti tutte." },
        { tipo: "immagine", src: "/img/manuale/wn7/citta.jpg", caption: "In città dovrebbe essere a casa sua. Con questa sella e queste sospensioni, mica tanto." },
        { tipo: "paragrafo", testo: "Il problema è che non riesco a trovarle un segmento. È praticamente una via di mezzo tra una moto e uno scooter, ma dei due prende i lati negativi: dalla moto la rigidità e una sella da sportiva, che in città non ti servono; dallo scooter l'idea del mezzo da tutti i giorni, che però con quella sella e quelle sospensioni non regge. Divertente? Sì, tanto, soprattutto in accelerazione e in curva. Ma se dovessi consigliarla a qualcuno, ancora non saprei dire a chi." },
        { tipo: "paragrafo", testo: "Voi avete avuto modo di provarla? Se l'avete capita meglio di me, scrivetemi: sono curioso di sapere a chi la consigliereste." },
        { tipo: "link", label: "Guarda il video della prova", url: "https://www.instagram.com/reel/DdmSEQXBXsG/" }
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

  // minuti di lettura (~200 parole al minuto, tutto il testo della guida:
  // paragrafi, sottotitoli, consigli e didascalie). Al posto della data,
  // che su una guida farebbe sembrare "vecchio" un consiglio ancora valido
  function tempoLettura(guida) {
    const pezzi = [guida.titolo, guida.copertinaCaption];
    (guida.blocchi || []).forEach(b => {
      pezzi.push(b.testo, b.titolo, b.caption, b.label);
      if (b.immagine) pezzi.push(b.immagine.caption);
    });
    const parole = pezzi.filter(Boolean).join(" ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(parole / 200));
  }

  return { GUIDE, slugify, getSlug, findBySlug, tempoLettura };
});
