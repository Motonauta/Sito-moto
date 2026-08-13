// Dati condivisi di Itinerari, Miniviaggi e Viaggi da ricordare: un solo file
// caricato sia dal browser (index.html, per i caroselli) sia dalle funzioni
// serverless (api/viaggio.js, per generare la pagina dedicata di ogni
// viaggio) — così i due posti restano sempre allineati senza duplicare nulla.
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.VIAGGI_DATA = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  // data in cui i dati di itinerari/miniviaggi/viaggi da ricordare sono stati
  // verificati/aggiornati l'ultima volta (mostrata nelle pagine dedicate) —
  // aggiornala a mano quando modifichi voci in questo file
  const ULTIMO_AGGIORNAMENTO_DATI = "2026-08-13";

  const ITINERARI = [
    {
      zona: "Castelli Romani", km: "circa 90 km", kmNum: 90, titolo: "Il classico dei due laghi",
      desc: "Il giro più breve e più gettonato per chi parte da Roma: due laghi vulcanici, borghi affacciati sul cratere e la porchetta ad Ariccia a fine giro. Perfetto anche per chi ha solo mezza giornata.",
      meteoPlace: "Ariccia",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Lago_di_Albano,_a_Castel_Gandolfo_31.JPG",
      tappe: [
        { nome: "Ariccia", query: "Ariccia RM", label: "il ponte monumentale e la porchetta", fun: "Fermati per la porchetta, resta per il secondo giro — succede sempre." },
        { nome: "Castel Gandolfo", query: "Castel Gandolfo RM", label: "vista sul Lago Albano", fun: "Vista sul lago che i Papi hanno scelto per le vacanze: un motivo ci sarà." },
        { nome: "Nemi", query: "Nemi RM", label: "Terrazza degli Innamorati sul lago", fun: "La Terrazza degli Innamorati non giudica se ci arrivi da solo in sella." },
        { nome: "Rocca di Papa", query: "Via dei Laghi SP217 RM", label: "Via dei Laghi (SP217) — il tratto più bello del giro", fun: "Curve che ti fanno dimenticare che dovevi rientrare per pranzo." },
        { nome: "Frascati", query: "Frascati RM", label: "ville rinascimentali e vino bianco", fun: "Un bianco frizzante prima di rimettere il casco — o dopo, giurin giurello." }
      ]
    },
    {
      zona: "Monti Simbruini", km: "circa 200 km", kmNum: 200, titolo: "Curve pure verso la montagna",
      desc: "Il giro per chi cerca solo curve: da Subiaco si sale tra i boschi fino a Filettino, il comune più alto del Lazio. Asfalto tecnico, poco traffico, aria di montagna.",
      meteoPlace: "Subiaco",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Monastero_di_Santa_Scolastica_(Subiaco).jpg",
      tappe: [
        { nome: "Subiaco", query: "Subiaco RM", label: "monastero di Santa Scolastica", fun: "Il monastero è del VI secolo, le curve per arrivarci sembrano nuove di zecca." },
        { nome: "Jenne", query: "Jenne RM", label: "borgo panoramico sull'Aniene", fun: "Un balcone sull'Aniene che nessuno ti ha mai consigliato — ora sì." },
        { nome: "Trevi nel Lazio", query: "Trevi nel Lazio FR", label: "cascata di Trevi", fun: "La cascata bagna anche l'ego di chi diceva di conoscere già tutte le strade del Lazio." },
        { nome: "Filettino", query: "Filettino FR", label: "il comune più alto del Lazio", fun: "Qui l'aria è pulita, l'asfalto pure — porta una felpa comunque." }
      ]
    },
    {
      zona: "Litorale Pontino", km: "circa 260 km", kmNum: 260, titolo: "Mare, dune e borghi da guardare dall'alto",
      desc: "La costa che da Sabaudia scende verso sud: pineta del Circeo, promontorio con vista sul golfo, e i vicoli bianchi di Sperlonga. Il tratto più lungo dei sei, ma quasi tutto pianeggiante e veloce.",
      meteoPlace: "Sabaudia",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Mt_Circeo_from_Sabaudia_Beach.jpg",
      tappe: [
        { nome: "Sabaudia", query: "Sabaudia LT", label: "Selva di Circe", fun: "Pineta, dune e un rettilineo che mette alla prova la pazienza dell'acceleratore." },
        { nome: "San Felice Circeo", query: "San Felice Circeo LT", label: "vista sulla costa dal promontorio", fun: "Da quassù il golfo sembra finto — non lo è, è solo troppo bello." },
        { nome: "Terracina", query: "Tempio di Giove Anxur Terracina", label: "Tempio di Giove Anxur", fun: "Un tempio romano con vista mare: la moto la parcheggi, il fiato resta mozzo." },
        { nome: "Sperlonga", query: "Sperlonga LT", label: "centro storico e Grotta di Tiberio", fun: "Vicoli troppo stretti per la moto — a piedi però ne vale ogni passo." }
      ]
    },
    {
      zona: "Laghi della Tuscia", km: "circa 140 km", kmNum: 140, titolo: "Due laghi vulcanici e un anfiteatro etrusco",
      desc: "Un anello tranquillo verso nord: il Lago di Bracciano, i borghi colorati sulle sue sponde, e il Lago di Vico circondato dal verde. Buono anche per chi va in moto da poco.",
      meteoPlace: "Bracciano",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Castello_Orsini-Odescalchi.jpg",
      tappe: [
        { nome: "Bracciano", query: "Bracciano RM castello", label: "il castello Orsini-Odescalchi", fun: "Il castello sembra uscito da una favola, il lago sotto sembra un premio." },
        { nome: "Trevignano Romano", query: "Trevignano Romano RM", label: "lungolago", fun: "Lungolago perfetto per un caffè con la moto ancora calda." },
        { nome: "Sutri", query: "Sutri VT anfiteatro", label: "anfiteatro romano scavato nel tufo", fun: "I Romani sapevano scegliere i posti panoramici pure loro." },
        { nome: "Ronciglione", query: "Ronciglione VT", label: "Lago di Vico", fun: "Un cratere vulcanico tranquillo — tranquilli, non è più in funzione." }
      ]
    },
    {
      zona: "Sabina e Monti Lucretili", km: "circa 150 km", kmNum: 150, titolo: "Curve scorrevoli e un'abbazia millenaria",
      desc: "Meno battuto dei Castelli Romani ma altrettanto bello: colline di ulivi, la SR314 Licinese tra i tornanti del Parco dei Lucretili, e una sosta all'Abbazia di Farfa che vale il giro da sola.",
      meteoPlace: "Fara in Sabina",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Abbazia_di_Farfa_09.jpg",
      tappe: [
        { nome: "Fara in Sabina", query: "Fara in Sabina RI", label: "borgo tra i Monti Sabini", fun: "Un borgo che guarda il Tevere da lontano, un po' con l'aria di chi sta più in alto." },
        { nome: "Abbazia di Farfa", query: "Abbazia di Farfa", label: "architettura benedettina", fun: "Mille anni di storia, e tu ci arrivi con il casco integrale ancora in mano — nessun giudizio." },
        { nome: "Poggio Moiano", query: "Poggio Moiano RI", label: "tra gli uliveti della Sabina", fun: "Ulivi a perdita d'occhio: qui l'olio si fa, non si compra al supermercato." },
        { nome: "Orvinio", query: "Orvinio RI", label: "uno dei borghi più belli d'Italia", fun: "Probabilmente il meno affollato di motociclisti di tutto l'elenco — approfittane." }
      ]
    },
    {
      zona: "Monti della Tolfa", km: "circa 160 km", kmNum: 160, titolo: "Curve ad alto godimento sopra la costa",
      desc: "Il giro più curvoso e meno conosciuto: da Civitavecchia si sale tra pascoli e panorami sul Tirreno fino a Tolfa e Allumiere, due borghi nati dall'estrazione dell'allume nel Medioevo.",
      meteoPlace: "Civitavecchia",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Tolfa_10-080325.jpg",
      tappe: [
        { nome: "Civitavecchia", query: "Civitavecchia RM porto", label: "punto di partenza sul mare", fun: "Si parte dal mare, si punta dritti verso le curve — il porto può aspettare." },
        { nome: "Tolfa", query: "Tolfa RM", label: "piazza panoramica del borgo", fun: "Una piazza panoramica pensata apposta per farti scendere a fare foto." },
        { nome: "Allumiere", query: "Allumiere RM", label: "borgo delle miniere di allume", fun: "Un nome che sa di chimica, un borgo che sa di storia mineraria vera." }
      ]
    },
    {
      zona: "Ciociaria", km: "circa 190 km", kmNum: 190, titolo: "Il Balcone della Ciociaria e l'Acropoli di Alatri",
      desc: "Verso sud-est, tra colline e antiche mura poligonali: Alatri con la sua Acropoli millenaria, il lago di Canterno e il borgo-fortezza di Fumone, arroccato su uno sperone roccioso visibile da tutta la valle.",
      meteoPlace: "Alatri",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Acropoli_di_Alatri.jpg",
      tappe: [
        { nome: "Alatri", query: "Acropoli Alatri FR", label: "Acropoli e mura poligonali", fun: "Mura costruite prima dei Romani: fanno sembrare recente pure la tua moto." },
        { nome: "Lago di Canterno", query: "Lago di Canterno FR", label: "specchio d'acqua tra i monti Ernici", fun: "Un lago che pochi conoscono fuori dalla provincia — motivo in più per andarci." },
        { nome: "Fumone", query: "Fumone FR", label: "borgo-fortezza panoramico", fun: "Da quassù, dicono, si vedono cinque regioni. Conta tu quante ne trovi." },
        { nome: "Balcone della Ciociaria", query: "Monte Fioresta Ciociaria FR", label: "punto panoramico sulla valle", fun: "Un nome che è già una promessa, e per una volta la mantiene." }
      ]
    },
    {
      zona: "Valle di Comino", km: "circa 260 km", kmNum: 260, titolo: "Curve tra Alvito, Atina e Picinisco",
      desc: "Ai piedi delle Mainarde, al confine con l'Abruzzo: un anello tra borghi meno turistici, con curve continue e panorami sulla valle circondata dai monti. Atina è nota per l'olio, Picinisco per i formaggi di malga.",
      meteoPlace: "Alvito",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Alvito_Palazzo_Ducale,_DSC02531.JPG",
      tappe: [
        { nome: "Alvito", query: "Alvito FR", label: "borgo medievale sotto il castello", fun: "Il castello guarda la valle da secoli, tu ci arrivi in una mattinata." },
        { nome: "Atina", query: "Atina FR", label: "capitale dell'olio della Valle di Comino", fun: "Porta a casa una bottiglia d'olio, se resta spazio libero dai bagagli." },
        { nome: "Picinisco", query: "Picinisco FR", label: "borgo di montagna e formaggi di malga", fun: "L'aria di montagna qui si sente anche nel formaggio, giuro." },
        { nome: "San Donato Val di Comino", query: "San Donato Val di Comino FR", label: "vista sulla valle e le Mainarde", fun: "Le Mainarde da qui sembrano una scenografia — sono verissime." }
      ]
    },
    {
      zona: "Tuscia Etrusca", km: "circa 270 km", kmNum: 270, titolo: "Da Orte a Civita di Bagnoregio",
      desc: "Un giro più lungo verso il confine con l'Umbria: il borgo medievale di Orte, Montefiascone panoramica sul Lago di Bolsena, e la spettacolare Civita di Bagnoregio, la 'città che muore' raggiungibile solo a piedi da un ponte sospeso.",
      meteoPlace: "Bagnoregio",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Civita_(Bagnoregio)_-_Panorama.jpg",
      tappe: [
        { nome: "Orte", query: "Orte VT centro storico", label: "borgo medievale su rupe di tufo", fun: "Un borgo su una rupe di tufo che dall'autostrada nessuno si aspetta." },
        { nome: "Montefiascone", query: "Montefiascone VT", label: "vista panoramica sul Lago di Bolsena", fun: "Vista sul lago e un vino, l'Est! Est!! Est!!!, che ha una storia da raccontare al bar." },
        { nome: "Bolsena", query: "Bolsena VT lago", label: "lungolago e centro storico", fun: "Il lago vulcanico più grande d'Europa, e tu ci giri intorno in moto come se niente fosse." },
        { nome: "Civita di Bagnoregio", query: "Civita di Bagnoregio VT", label: "la 'città che muore' sul ponte sospeso", fun: "Si chiama così perché l'erosione se la sta mangiando piano — vacci prima che la moda la scopra del tutto." }
      ]
    },
    {
      zona: "Monti Prenestini", km: "circa 120 km", kmNum: 120, titolo: "Palestrina, Genazzano e Olevano Romano",
      desc: "Un giro breve verso est, buono anche per una mezza giornata: il Santuario della Fortuna Primigenia di Palestrina, i vicoli di Genazzano e i vigneti di Olevano Romano, tra i più noti del Lazio.",
      meteoPlace: "Palestrina",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Palestrina_-_Santuario_della_Fortuna_Primigenia_-_vista_della_rampa_di_sinistra.jpg",
      tappe: [
        { nome: "Palestrina", query: "Palestrina RM santuario", label: "Santuario della Fortuna Primigenia", fun: "Un santuario romano così grande che ci hanno costruito sopra mezza città." },
        { nome: "Genazzano", query: "Genazzano RM", label: "borgo medievale e Castello Colonna", fun: "Vicoli stretti, castello imponente — la moto la lasci fuori dalle mura, giurin giurello." },
        { nome: "Olevano Romano", query: "Olevano Romano RM", label: "vigneti e cantine tra le colline", fun: "Un Cesanese buono quanto le curve che ti ci hanno portato." }
      ]
    },
    {
      zona: "Terminillo e la Salaria", km: "circa 200 km", kmNum: 200, titolo: "Curve di montagna sopra Rieti",
      desc: "La Salaria che segue il corso del Velino fino a Rieti, poi la salita verso il Terminillo, 'la montagna di Roma': tornanti continui, aria di montagna e panorami sulla conca reatina.",
      meteoPlace: "Rieti",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Panoramica_monte_Terminillo.jpg",
      tappe: [
        { nome: "Rieti", query: "Rieti centro storico", label: "conca reatina e centro storico", fun: "Il centro esatto d'Italia, dicono — buon motivo per fermarsi a fare benzina." },
        { nome: "Terminillo", query: "Terminillo RI", label: "la 'montagna di Roma', tornanti fino a 1600 m", fun: "D'estate curve fresche, d'inverno neve — controlla il calendario prima di partire." },
        { nome: "Leonessa", query: "Leonessa RI", label: "borgo ai piedi dei Monti Reatini", fun: "Un nome altisonante per un borgo tranquillo — la fama del leone se l'è tenuta per sé." }
      ]
    },
    {
      zona: "Valle dell'Aniene", km: "circa 100 km", kmNum: 100, titolo: "Tivoli, Villa Adriana e i borghi dell'Aniene",
      desc: "Il giro più corto e più semplice, perfetto per chi ha solo una mattinata: Tivoli con le sue ville UNESCO, poi risalendo la valle dell'Aniene tra Vicovaro, Arsoli e Roviano.",
      meteoPlace: "Tivoli",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Villa_d%27Este_01.jpg",
      tappe: [
        { nome: "Tivoli", query: "Villa d'Este Tivoli RM", label: "Villa d'Este e le sue fontane", fun: "Fontane che zampillano da 500 anni: la manutenzione, quella sì, fa impressione." },
        { nome: "Vicovaro", query: "Vicovaro RM", label: "borgo sull'Aniene", fun: "Un borgo che pochi romani hanno visto, a un'ora scarsa da casa." },
        { nome: "Arsoli", query: "Arsoli RM castello", label: "castello Massimo panoramico", fun: "Un castello ancora abitato — occhio a chi saluti dal cancello." },
        { nome: "Roviano", query: "Roviano RM", label: "borgo panoramico sulla valle", fun: "L'ultima tappa prima di tornare, giusto il tempo per un caffè con vista." }
      ]
    },
    {
      zona: "Golfo di Gaeta", km: "circa 290 km", kmNum: 290, titolo: "Formia, Gaeta e la Via Flacca",
      desc: "Il giro più lungo, da fare con calma: la costa verso sud fino a Gaeta, il promontorio con vista sul golfo, e il ritorno lungo la panoramica Via Flacca scavata nella roccia sopra il mare.",
      meteoPlace: "Gaeta",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Panorama-gaeta.jpg",
      tappe: [
        { nome: "Formia", query: "Formia LT lungomare", label: "lungomare e porto", fun: "Il lungomare per il primo caffè, il resto del golfo per il resto della giornata." },
        { nome: "Gaeta", query: "Gaeta LT Montagna Spaccata", label: "Montagna Spaccata e centro storico", fun: "Una montagna 'spaccata' letteralmente in due — la leggenda dice dal terremoto della crocifissione." },
        { nome: "Via Flacca", query: "Via Flacca SS213 LT", label: "panoramica scavata nella roccia sul mare", fun: "Gallerie, curve e mare che appare e scompare — tienti il casco integrale, gli spruzzi ci sono davvero." },
        { nome: "Sperlonga", query: "Sperlonga LT", label: "centro storico bianco sul mare", fun: "Se non l'hai già vista nel giro del Litorale Pontino, qui è la scusa buona." }
      ]
    },
    {
      zona: "Etruria Meridionale", km: "circa 210 km", kmNum: 210, titolo: "Le necropoli etrusche di Cerveteri e Tarquinia",
      desc: "Un giro storico-costiero verso nord: la necropoli della Banditaccia a Cerveteri, patrimonio UNESCO, e le tombe dipinte di Tarquinia, tra le testimonianze etrusche meglio conservate al mondo.",
      meteoPlace: "Tarquinia",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Cerveteri,_necropoli_della_banditaccia,_via_sepolcrale_principale,_01.jpg",
      tappe: [
        { nome: "Cerveteri", query: "Necropoli della Banditaccia Cerveteri", label: "necropoli della Banditaccia (UNESCO)", fun: "Una città dei morti più organizzata di certi centri abitati moderni." },
        { nome: "Tarquinia", query: "Tarquinia VT necropoli", label: "tombe etrusche dipinte", fun: "Affreschi di 2500 anni fa più vivaci di certi filtri Instagram di oggi." },
        { nome: "Tarquinia Lido", query: "Tarquinia Lido VT", label: "litorale per una pausa sul mare", fun: "Dopo tanta storia, un po' di mare per rimettere in pari gli occhi." }
      ]
    },
    {
      zona: "Monti della Laga", km: "circa 300 km", kmNum: 300, titolo: "Verso Amatrice, al confine tra tre regioni",
      desc: "Il giro più impegnativo dei venti, da affrontare con partenza presto: la Salaria fino ad Amatrice, ai piedi dei Monti della Laga, al confine tra Lazio, Abruzzo e Marche. Zona colpita dal sisma 2016, oggi in ricostruzione — un giro anche per non dimenticare.",
      meteoPlace: "Amatrice",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Amatrice.JPG",
      tappe: [
        { nome: "Antrodoco", query: "Antrodoco RI", label: "porta della Salaria verso l'Abruzzo", fun: "Da qui la Salaria comincia a salire sul serio — scalda bene i freni." },
        { nome: "Amatrice", query: "Amatrice RI", label: "borgo simbolo della ricostruzione post-sisma", fun: "La patria dell'amatriciana merita la sosta, anche solo per rispetto." },
        { nome: "Accumoli", query: "Accumoli RI", label: "borgo ai piedi della Laga", fun: "Piccolo, silenzioso, e con vista sui monti che vale la salita." }
      ]
    },
    {
      zona: "Valle del Liri", km: "circa 190 km", kmNum: 190, titolo: "Frosinone, la cascata di Isola del Liri e l'Abbazia di Casamari",
      desc: "Un giro tra industria antica e natura: la cascata che taglia in due il centro di Isola del Liri, e l'Abbazia cistercense di Casamari, silenziosa e ben conservata, poco fuori Veroli.",
      meteoPlace: "Isola del Liri",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Isola_del_Liri_-_Cascata_Grande_-_2007.JPG",
      tappe: [
        { nome: "Frosinone", query: "Frosinone centro", label: "centro storico su un colle", fun: "Poco raccontata, ma la vista dal centro storico ripaga il pieno di benzina." },
        { nome: "Isola del Liri", query: "Cascata grande Isola del Liri", label: "cascata nel cuore del centro cittadino", fun: "Una cascata in mezzo alla città — capita raramente di fermarsi al semaforo con questa vista." },
        { nome: "Veroli", query: "Veroli FR", label: "borgo panoramico sulla valle del Liri", fun: "Un balcone naturale sulla valle, con meno folla dei Castelli Romani." },
        { nome: "Abbazia di Casamari", query: "Abbazia di Casamari", label: "abbazia cistercense", fun: "Silenzio quasi sospetto per chi arriva ancora con il motore caldo." }
      ]
    },
    {
      zona: "Laghi Reatini", km: "circa 210 km", kmNum: 210, titolo: "Lago del Turano e Lago del Salto",
      desc: "Due laghi artificiali incastonati tra le montagne della Sabina reatina, con strade strette e panoramiche che li costeggiano quasi per intero: meno conosciuti del Trasimeno, non meno belli.",
      meteoPlace: "Rieti",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Lago_del_Turano_2020.jpg",
      tappe: [
        { nome: "Rieti", query: "Rieti RI", label: "punto di partenza nella conca reatina", fun: "Si riparte da qui, stavolta verso ovest invece che verso il Terminillo." },
        { nome: "Lago del Turano", query: "Lago del Turano RI", label: "strada panoramica lungolago", fun: "Curve strette sull'acqua, con i borghi che si specchiano nel lago — vai piano, la tentazione di guardare è tanta." },
        { nome: "Colle di Tora", query: "Colle di Tora RI", label: "borgo affacciato sul Turano", fun: "Un paesino minuscolo con una vista che sembra rubata a un altro lago più famoso." },
        { nome: "Lago del Salto", query: "Lago del Salto RI", label: "secondo lago artificiale della Sabina", fun: "Il fratello meno fotografato del Turano — merita comunque una sosta." }
      ]
    },
    {
      zona: "Monti Ausoni", km: "circa 230 km", kmNum: 230, titolo: "Campodimele, Lenola e Fondi",
      desc: "Colline e monti tra Ciociaria e costa: Campodimele, il 'paese della lunga vita' cinto da mura medievali intatte, Lenola tra gli ulivi, e Fondi con il suo centro storico dal impianto urbanistico romano.",
      meteoPlace: "Campodimele",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Campodimele_2012_by-RaBoe_30.jpg",
      tappe: [
        { nome: "Fondi", query: "Fondi LT centro storico", label: "centro storico a impianto romano", fun: "Le strade sono ancora quelle tracciate dai Romani — occhio ai vicoli stretti in curva." },
        { nome: "Campodimele", query: "Campodimele LT", label: "borgo murato, il 'paese della lunga vita'", fun: "Chiamato così per la longevità dei suoi abitanti — la dieta mediterranea, dicono, qui funziona davvero." },
        { nome: "Lenola", query: "Lenola LT", label: "borgo tra gli uliveti dei Monti Ausoni", fun: "Uliveti a perdita d'occhio e tornanti puliti — un premio per chi si spinge fin qui." }
      ]
    },
    {
      zona: "Valle del Sacco", km: "circa 150 km", kmNum: 150, titolo: "Anagni e Ferentino, la 'Città dei Papi'",
      desc: "Un giro storico tra le città della Ciociaria settentrionale: Anagni con la sua Cattedrale e il celebre 'Schiaffo', e Ferentino con le imponenti mura poligonali meglio conservate del Lazio.",
      meteoPlace: "Anagni",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Cattedrale_di_Santa_Maria_(Anagni)_con_campanile.JPG",
      tappe: [
        { nome: "Anagni", query: "Anagni FR cattedrale", label: "Cattedrale e la sala dello Schiaffo", fun: "Qui è successo lo 'schiaffo di Anagni' che la maestra ti raccontava alle medie — ora ci sei davvero." },
        { nome: "Ferentino", query: "Ferentino FR mura poligonali", label: "mura poligonali e acropoli", fun: "Mura costruite senza malta, in piedi da millenni — la tua moto sembra un neonato al confronto." }
      ]
    },
    {
      zona: "Monti Cimini", km: "circa 220 km", kmNum: 220, titolo: "Viterbo, Caprarola e il Lago di Vico",
      desc: "Un giro nella Tuscia viterbese diverso da quello dei laghi: il centro medievale di Viterbo, l'imponente Palazzo Farnese a Caprarola, e i boschi di castagni intorno al Lago di Vico.",
      meteoPlace: "Viterbo",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Palazzo_Farnese_(Caprarola).jpg",
      tappe: [
        { nome: "Viterbo", query: "Viterbo centro storico San Pellegrino", label: "quartiere medievale di San Pellegrino", fun: "Il quartiere medievale meglio conservato del centro Italia — sembra un set cinematografico, invece è vero." },
        { nome: "Caprarola", query: "Palazzo Farnese Caprarola", label: "Palazzo Farnese a pianta pentagonale", fun: "Un palazzo a forma di pentagono costruito per stupire — missione riuscita, ancora oggi." },
        { nome: "Soriano nel Cimino", query: "Soriano nel Cimino VT", label: "borgo ai piedi dei Monti Cimini", fun: "Castagni ovunque: se ci passi in autunno, porta un sacchetto." }
      ]
    },
    {
      zona: "Monti Ernici", km: "circa 210 km", kmNum: 210, titolo: "Le Grotte di Collepardo e la Certosa di Trisulti",
      desc: "Un giro tra natura e spiritualità sui Monti Ernici: le Grotte di Collepardo scavate nel calcare, la millenaria Certosa di Trisulti con la sua antica farmacia monastica, e il borgo murato di Vico nel Lazio.",
      meteoPlace: "Collepardo",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Collepardo,_Certosa_di_Trisulti_003.JPG",
      tappe: [
        { nome: "Collepardo", query: "Grotte di Collepardo FR", label: "Grotta dei Bambocci, stalattiti e stalagmiti", fun: "Formazioni calcaree che la natura ha impiegato millenni a scolpire — tu ci arrivi in un paio d'ore." },
        { nome: "Certosa di Trisulti", query: "Certosa di Trisulti Collepardo", label: "monastero certosino con farmacia storica", fun: "Un'antica farmacia monastica dove i monaci preparavano liquori ed elisir — il souvenir più originale della lista." },
        { nome: "Vico nel Lazio", query: "Vico nel Lazio FR", label: "borgo medievale ancora cinto dalle mura", fun: "Le mura sono ancora quelle originali — qui il tempo si è preso una pausa lunga otto secoli." }
      ]
    },
    {
      zona: "Vallepietra", km: "circa 220 km", kmNum: 220, titolo: "Il Santuario della Trinità, incastonato nella roccia",
      desc: "Un giro nel cuore selvaggio dei Simbruini: l'altopiano di Arcinazzo con i resti di una villa romana, e il Santuario della Santissima Trinità di Vallepietra, letteralmente scavato in una parete rocciosa a 1337 metri.",
      meteoPlace: "Vallepietra",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Museo_Santissima_Trinit%C3%A0_chiesa_San_Giovanni_Evangelista_Vallepietra.jpg",
      tappe: [
        { nome: "Arcinazzo Romano", query: "Arcinazzo Romano RM", label: "altopiano e resti della villa di Traiano", fun: "Anche gli imperatori romani venivano quassù per staccare la spina — buona compagnia." },
        { nome: "Vallepietra", query: "Vallepietra RM", label: "Santuario della Santissima Trinità nella roccia", fun: "Un santuario incollato alla montagna — da lontano sembra un miraggio, da vicino è ancora più impressionante." },
        { nome: "Camerata Nuova", query: "Camerata Nuova RM", label: "borgo di montagna tra i boschi dei Simbruini", fun: "Uno dei paesi più isolati del Lazio — e si sente, nel senso più bello del termine." }
      ]
    },
    {
      zona: "Arpino", km: "circa 210 km", kmNum: 210, titolo: "Arpino, la patria di Marco Tullio Cicerone",
      desc: "Un giro in Ciociaria sulle tracce di uno dei più grandi oratori della storia romana: il borgo di Arpino, la sua Torre di Cicerone, e la vicina Sora affacciata sul fiume Liri.",
      meteoPlace: "Arpino",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Arpino_wall.JPG",
      tappe: [
        { nome: "Arpino", query: "Arpino FR Torre di Cicerone", label: "centro storico e Torre di Cicerone", fun: "Nato qui l'oratore più citato nei licei classici — la Torre resiste ancora meglio delle sue versioni tradotte." },
        { nome: "Sora", query: "Sora FR", label: "città sul fiume Liri", fun: "Il Liri attraversa la città come se avesse fretta — tu invece prenditela con calma." },
        { nome: "Santopadre", query: "Santopadre FR", label: "piccolo borgo panoramico vicino Sora", fun: "Poche righe su Wikipedia, ma una vista che vale la deviazione." }
      ]
    },
    {
      zona: "Fiuggi", km: "circa 170 km", kmNum: 170, titolo: "Fiuggi, la città termale dell'acqua che 'scioglie i calcoli'",
      desc: "Un giro breve tra le colline della Ciociaria settentrionale: le storiche terme di Fiuggi, i borghi tranquilli di Guarcino e Trivigliano, e Piglio, patria del Cesanese DOCG.",
      meteoPlace: "Fiuggi",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Panorama_innevato_di_Fiuggi_Fonte.jpg",
      tappe: [
        { nome: "Fiuggi", query: "Fonte Bonifacio VIII Fiuggi", label: "Fonte Bonifacio VIII e il parco delle terme", fun: "L'acqua che 'scioglie i calcoli', dicono da secoli — funziona anche sulle tensioni da ufficio, promesso." },
        { nome: "Guarcino", query: "Guarcino FR", label: "borgo tranquillo sotto il Monte Rotonaria", fun: "Un paesino che nessuna guida turistica menziona mai — ottimo motivo per andarci." },
        { nome: "Piglio", query: "Piglio FR", label: "patria del Cesanese del Piglio DOCG", fun: "Il vino rosso più famoso della Ciociaria — la moto resta a bordo strada, l'assaggio arriva a fine giro." }
      ]
    },
    {
      zona: "Cassino", km: "circa 260 km", kmNum: 260, titolo: "L'Abbazia di Montecassino, tra fede e Seconda Guerra Mondiale",
      desc: "Un giro carico di storia: l'Abbazia di Montecassino, fondata da San Benedetto nel 529 e ricostruita dopo i bombardamenti del 1944, con il cimitero militare polacco che racconta una delle battaglie più dure della guerra in Italia.",
      meteoPlace: "Cassino",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Abbazia_Montecassino.jpg",
      tappe: [
        { nome: "Cassino", query: "Abbazia di Montecassino", label: "abbazia benedettina ricostruita dopo il 1944", fun: "Rasa al suolo dai bombardamenti e ricostruita 'dov'era, com'era' — la storia qui si legge nei muri." },
        { nome: "Cimitero militare polacco", query: "Cimitero militare polacco Montecassino", label: "memoriale della battaglia di Montecassino", fun: "Un silenzio che vale più di qualsiasi libro di storia — fermati, anche solo cinque minuti." },
        { nome: "Sant'Elia Fiumerapido", query: "Sant'Elia Fiumerapido FR", label: "borgo ai piedi del monte", fun: "L'ultima tappa prima di tornare, con vista sull'abbazia che hai appena lasciato alle spalle." }
      ]
    },
    {
      zona: "Norma, Ninfa e Sermoneta", km: "circa 160 km", kmNum: 160, titolo: "Il Giardino di Ninfa e i borghi della piana pontina",
      desc: "Un giro nella provincia di Latina tra alcuni dei posti più belli del Lazio: Norma appesa sopra la valle, il Giardino di Ninfa (tra i giardini più belli del mondo, aperto solo in alcuni weekend — controlla il calendario prima di partire), e il borgo medievale di Sermoneta.",
      meteoPlace: "Sermoneta",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Giardino_di_Ninfa,_rovine_della_citt%C3%A0..JPG",
      tappe: [
        { nome: "Norma", query: "Norma LT", label: "borgo panoramico sopra la valle di Ninfa", fun: "Da quassù il giardino di Ninfa sembra un plastico in miniatura — è tutto vero, promesso." },
        { nome: "Giardino di Ninfa", query: "Giardino di Ninfa Cisterna di Latina", label: "uno dei giardini più belli del mondo", fun: "Aperto solo in alcuni weekend stagionali: controlla il calendario prima di partire, o rischi di vederlo solo dal cancello." },
        { nome: "Sermoneta", query: "Sermoneta LT Castello Caetani", label: "borgo medievale e Castello Caetani", fun: "Un borgo così ben conservato che sembra costruito ieri per un set cinematografico — invece è lì da secoli." }
      ]
    },
    {
      zona: "Cori e i Monti Lepini", km: "circa 140 km", kmNum: 140, titolo: "Cori, tra storia romana e curve dei Lepini",
      desc: "Il giro più breve tra le new entry: Cori, antichissima città sui Monti Lepini con un tempio romano ancora in piedi, raggiunta con un percorso di curve scorrevoli tra uliveti e boschi.",
      meteoPlace: "Cori",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Cori-Tempio_Ercole.JPG",
      tappe: [
        { nome: "Cori", query: "Tempio di Ercole Cori LT", label: "Tempio di Ercole e centro storico", fun: "Un tempio romano ancora in piedi da più di duemila anni — la manutenzione stradale dovrebbe prendere appunti." },
        { nome: "Giulianello", query: "Giulianello LT", label: "borgo panoramico sui Lepini", fun: "Una frazione minuscola con una vista che non ti aspetteresti da un nome così poco pubblicizzato." }
      ]
    },
    {
      zona: "Priverno e l'Abbazia di Fossanova", km: "circa 190 km", kmNum: 190, titolo: "Priverno e la millenaria Abbazia di Fossanova",
      desc: "Un giro tranquillo verso sud: il centro storico di Priverno e la vicina Abbazia di Fossanova, capolavoro dell'architettura cistercense e primo esempio di gotico in Italia, dove morì San Tommaso d'Aquino.",
      meteoPlace: "Priverno",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Abbazia_di_Fossanova_(2008).jpg",
      tappe: [
        { nome: "Priverno", query: "Priverno LT centro storico", label: "centro storico medievale", fun: "Una cittadina tranquilla che raramente finisce negli itinerari turistici — il motivo in più per includerla qui." },
        { nome: "Abbazia di Fossanova", query: "Abbazia di Fossanova", label: "primo esempio di gotico in Italia", fun: "Qui morì San Tommaso d'Aquino — un posto che ha fatto la storia della filosofia, oltre che dell'architettura." }
      ]
    },
    {
      zona: "Nettuno e Anzio", km: "circa 130 km", kmNum: 130, titolo: "Nettuno e Anzio, tra storia e mare",
      desc: "Il giro più corto e rilassato: il lungomare di Anzio e Nettuno, il Forte Sangallo cinquecentesco, e le spiagge dello sbarco alleato del 1944 — perfetto anche per una mezza giornata con vista mare.",
      meteoPlace: "Nettuno",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Forte_Sangallo.JPG",
      tappe: [
        { nome: "Anzio", query: "Anzio RM porto", label: "porto e lungomare", fun: "Da qui partì Nerone in fuga da Roma — tu almeno torni indietro con calma, senza congiure alle spalle." },
        { nome: "Nettuno", query: "Forte Sangallo Nettuno", label: "Forte Sangallo e centro storico", fun: "Un forte del Cinquecento con vista sul mare — la difesa costiera non è mai stata così panoramica." }
      ]
    },
    {
      zona: "Civita Castellana e la Valle del Tevere", km: "circa 130 km", kmNum: 130, titolo: "Civita Castellana, tra forre e archeologia",
      desc: "Un giro breve nella Tuscia orientale, diverso da quello dei laghi: il Forte Sangallo di Civita Castellana affacciato su una forra scavata dal fiume, e le rovine dell'antica città etrusca di Falerii Novi poco distante.",
      meteoPlace: "Civita Castellana",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Forte_Sangallo_Civita_Castellana.jpg",
      tappe: [
        { nome: "Civita Castellana", query: "Forte Sangallo Civita Castellana", label: "Forte Sangallo sospeso su una forra", fun: "Un forte costruito sul bordo di un burrone scavato dall'acqua — l'ingegneria rinascimentale sapeva il fatto suo." },
        { nome: "Falerii Novi", query: "Falerii Novi rovine", label: "città etrusco-romana abbandonata, cinta da mura intatte", fun: "Una città romana abbandonata quasi mille anni fa, con le mura ancora quasi tutte in piedi — e quasi nessun turista in giro." }
      ]
    },
    {
      zona: "Monti Sibillini", km: "circa 340 km", kmNum: 340, titolo: "Castelluccio di Norcia in giornata",
      desc: "Lo stesso altopiano raccontato tra i Miniviaggi, ma in versione mordi e fuggi: si può fare anche in un giorno solo, se si parte presto. Norcia e il Piano Grande, con la 'Fioritura' delle lenticchie a fine giugno tra gli spettacoli naturali più fotografati d'Italia.",
      meteoPlace: "Norcia",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Fioritura_Castelluccio_di_Norcia.jpg",
      tappe: [
        { nome: "Norcia", query: "Norcia PG", label: "patria della norcineria, in ricostruzione dopo il sisma 2016", fun: "Merita la sosta anche solo per rispetto, come Amatrice — e un salume vero da qui te lo porti a casa comunque." },
        { nome: "Castelluccio di Norcia", query: "Castelluccio di Norcia", label: "Piano Grande, la 'Fioritura' a fine giugno", fun: "Se becchi il periodo giusto, i campi sembrano dipinti — controlla online prima di partire, la fioritura dura poco." },
        { nome: "Forca di Presta", query: "Forca di Presta", label: "valico verso le Marche", fun: "Il punto più alto della gita, e un buon posto per il panino prima di ridiscendere." }
      ]
    },
    {
      zona: "Gran Sasso", km: "circa 300 km", kmNum: 300, titolo: "Campo Imperatore in giornata",
      desc: "L'altopiano soprannominato 'Piccolo Tibet d'Italia' raggiungibile e visitabile comodamente in una domenica, senza dover per forza fermarsi a dormire: L'Aquila, l'altopiano a 2000 metri e la Rocca di Calascio, tra le fortezze più fotografate d'Abruzzo.",
      meteoPlace: "Campo Imperatore",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Campo_Imperatore,_Gran_Sasso.jpg",
      tappe: [
        { nome: "L'Aquila", query: "L'Aquila centro", label: "punto di partenza abruzzese", fun: "Una città che si sta ricostruendo pezzo per pezzo — merita la sosta anche solo per rispetto." },
        { nome: "Campo Imperatore", query: "Campo Imperatore AQ", label: "l'altopiano a 2000 m, il 'Piccolo Tibet'", fun: "Qui hanno girato scene western — e appena arrivi capisci esattamente perché." },
        { nome: "Rocca Calascio", query: "Rocca Calascio AQ", label: "fortezza panoramica tra le più alte d'Italia", fun: "La rocca più fotografata d'Abruzzo, sullo sfondo di praticamente ogni film ambientato quassù." }
      ]
    },
    {
      zona: "Lago di Bolsena", km: "circa 260 km", kmNum: 260, titolo: "Il giro del lago di Bolsena",
      desc: "Il lago vulcanico più grande d'Europa, con un anello quasi interamente panoramico: Montefiascone affacciata dall'alto, Bolsena col suo centro storico e il castello, e Marta, il borgo di pescatori sulla sponda opposta.",
      meteoPlace: "Bolsena",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Lago_di_Bolsena.jpg",
      tappe: [
        { nome: "Montefiascone", query: "Montefiascone VT", label: "vista panoramica sul lago dall'alto", fun: "Da qui il lago si vede tutto in un colpo solo — e un bicchiere di Est! Est!! Est!!! è quasi un obbligo locale." },
        { nome: "Bolsena", query: "Bolsena VT lago", label: "centro storico, castello e lungolago", fun: "Il lago vulcanico più grande d'Europa, e lo giri in moto come se fosse un laghetto di quartiere." },
        { nome: "Marta", query: "Marta VT lago di Bolsena", label: "borgo di pescatori sulla sponda opposta", fun: "L'unico paese del lago che vive ancora davvero di pesca — il pesce in tavola qui non è un vezzo turistico." }
      ]
    }
  ];

  const MINIVIAGGI = [
    {
      zona: "Alta Valtellina", km: "2-3 giorni consigliati", titolo: "Passo dello Stelvio e Passo di Gavia",
      desc: "Il valico più alto d'Italia (2758 m): 48 tornanti sul versante altoatesino, 36 su quello lombardo. Da Bormio si può abbinare anche il vicino Passo di Gavia, più stretto e selvaggio, tra i preferiti di chi cerca strada vera più che traffico turistico. Aperto indicativamente da giugno a ottobre.",
      meteoPlace: "Bormio",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Stelvio_tornanti.JPG",
      tappe: [
        { nome: "Bormio", query: "Bormio SO", label: "base ideale per esplorare l'Alta Valtellina", fun: "Terme calde alla sera per le braccia indolenzite da tutti quei tornanti." },
        { nome: "Passo dello Stelvio", query: "Passo dello Stelvio", label: "2758 m, 48 tornanti numerati sul versante altoatesino", fun: "Ogni tornante ha il suo numero su un cartello — arrivare al primo è già una vittoria personale." },
        { nome: "Passo di Gavia", query: "Passo di Gavia", label: "strada stretta senza guardrail in alcuni tratti", fun: "Meno turisti dello Stelvio, più adrenalina: qui la strada non perdona le distrazioni." },
        { nome: "Prato allo Stelvio", query: "Prato allo Stelvio BZ", label: "borgo altoatesino ai piedi del passo", fun: "Il paesaggio cambia lingua e stile: benvenuti in Alto Adige." }
      ]
    },
    {
      zona: "Alta Val Camonica", km: "1-2 giorni consigliati", titolo: "Passo del Tonale",
      desc: "Un classico meno estremo dello Stelvio ma altrettanto scenico: da Ponte di Legno si sale tra prati d'alta quota fino al valico a 1883 m, con vista sull'Adamello, per poi scendere verso Vermiglio in Val di Sole.",
      meteoPlace: "Ponte di Legno",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Passo_del_Tonale.jpg",
      tappe: [
        { nome: "Ponte di Legno", query: "Ponte di Legno BS", label: "porta d'accesso all'Alta Val Camonica", fun: "L'ultimo caffè vero prima che la strada cominci a fare sul serio." },
        { nome: "Passo del Tonale", query: "Passo del Tonale", label: "1883 m, vista sul massiccio dell'Adamello", fun: "Meno tornanti dello Stelvio, stesso identico languorino di fermarti ogni due minuti per una foto." },
        { nome: "Vermiglio", query: "Vermiglio TN", label: "Val di Sole, versante trentino", fun: "Si scende in Trentino e il paesaggio si addolcisce, un po' come i tuoi polsi dopo la salita." },
        { nome: "Madonna di Campiglio", query: "Madonna di Campiglio TN", label: "una delle mete più note del Trentino", fun: "Vetrine da salotto buono e parcheggi moto pieni — un buon posto per farsi vedere." }
      ]
    },
    {
      zona: "Dolomiti", km: "3-4 giorni consigliati", titolo: "La Grande Strada delle Dolomiti",
      desc: "Il tour dei passi dolomitici per eccellenza: Pordoi, Sella, Gardena e Falzarego collegano il Gruppo del Sella alla Marmolada tra tornanti panoramici e rifugi di quota. Da fare con calma, dormendo lungo il percorso.",
      meteoPlace: "Canazei",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Passo_pordoi.jpg",
      tappe: [
        { nome: "Canazei", query: "Canazei TN", label: "base ideale in Val di Fassa", fun: "Il punto di partenza di quasi ogni giro dolomitico che si rispetti." },
        { nome: "Passo Pordoi", query: "Passo Pordoi", label: "2239 m, tra Gruppo del Sella e Marmolada", fun: "Vista sulla Marmolada che vale ogni singolo tornante per arrivarci." },
        { nome: "Passo Sella", query: "Passo Sella", label: "tra le pareti verticali del Gruppo del Sella", fun: "Pareti di roccia che sembrano chiudersi sopra la testa — sensazione unica, promesso." },
        { nome: "Passo Gardena", query: "Passo Gardena", label: "curve tra le più fotografate delle Dolomiti", fun: "Se non hai già mille foto di questo passo sui social, sei l'eccezione." },
        { nome: "Passo Falzarego", query: "Passo Falzarego", label: "teatro di battaglie della Grande Guerra", fun: "Sotto l'asfalto ci sono ancora le gallerie scavate durante la Prima Guerra Mondiale." }
      ]
    },
    {
      zona: "Valtellina", km: "1-2 giorni consigliati", titolo: "Passo del Mortirolo",
      desc: "Non il più alto, ma tra i più duri: pendenze fino al 18%, reso leggendario dal ciclismo (la salita di Marco Pantani). In moto è un saliscendi tecnico tra boschi, con molto meno traffico dei passi vicini.",
      meteoPlace: "Mazzo di Valtellina",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Passo_del_Mortirolo.JPG",
      tappe: [
        { nome: "Mazzo di Valtellina", query: "Mazzo di Valtellina SO", label: "punto di partenza della salita", fun: "Da qui parte una salita che i ciclisti nominano con rispetto quasi religioso." },
        { nome: "Passo del Mortirolo", query: "Passo del Mortirolo", label: "pendenze fino al 18%, tra boschi stretti", fun: "Meno cartoline dello Stelvio, molto più braccio — qui si guida, non si passeggia." },
        { nome: "Monno", query: "Monno BS", label: "borgo sul versante camuno", fun: "Un paesino tranquillo per riprendere fiato dopo tanta pendenza." },
        { nome: "Edolo", query: "Edolo BS", label: "centro della Val Camonica per la sosta", fun: "Buon punto per un pranzo vero prima di rimettersi in sella." }
      ]
    },
    {
      zona: "Valle d'Aosta", km: "2-3 giorni consigliati", titolo: "Piccolo e Grande San Bernardo",
      desc: "Due valichi storici ai confini con Francia e Svizzera, entrambi carichi di storia (da qui passò anche Napoleone). Da Aosta si può salire a entrambi in giorni diversi, con soste a Courmayeur sotto il Monte Bianco.",
      meteoPlace: "Aosta",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Piccolo_S_Bernardo.jpg",
      tappe: [
        { nome: "Aosta", query: "Aosta centro", label: "base romana ai piedi delle Alpi", fun: "Una città romana incastonata tra le montagne più alte d'Europa — location d'eccezione." },
        { nome: "Colle del Piccolo San Bernardo", query: "Colle del Piccolo San Bernardo", label: "confine con la Francia, 2188 m", fun: "Di qua l'Italia, di là la Francia: cambi Paese senza nemmeno spegnere il motore." },
        { nome: "Courmayeur", query: "Courmayeur AO", label: "ai piedi del Monte Bianco", fun: "Il Monte Bianco visto da qui fa sembrare piccola anche la moto più grossa." },
        { nome: "Colle del Gran San Bernardo", query: "Colle del Gran San Bernardo", label: "confine con la Svizzera, storico ospizio", fun: "Qui sono nati i cani San Bernardo — occhio a non tornare a casa con l'idea di adottarne uno." }
      ]
    },
    {
      zona: "Alta Valchiavenna", km: "1-2 giorni consigliati", titolo: "Passo dello Spluga",
      desc: "Un valico storico verso la Svizzera, meno affollato dei 'big three' lombardi: da Chiavenna si sale tra tornanti stretti fino al passo a 2113 m, con vista sul lago artificiale del Truzzo. Aperto tutto l'anno lato italiano, spesso chiuso in inverno oltre confine.",
      meteoPlace: "Campodolcino",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Passo_dello_spluga_in_inverno.JPG",
      tappe: [
        { nome: "Chiavenna", query: "Chiavenna SO", label: "porta della Valchiavenna", fun: "Ultima città vera prima che la valle si stringa sul serio." },
        { nome: "Campodolcino", query: "Campodolcino SO", label: "base per la salita al passo", fun: "Da qui in poi la strada inizia a fare sul serio, tornante dopo tornante." },
        { nome: "Passo dello Spluga", query: "Passo dello Spluga", label: "2113 m, confine con la Svizzera", fun: "Meno foto su Instagram dello Stelvio, stessa identica soddisfazione ad arrivarci." },
        { nome: "Madesimo", query: "Madesimo SO", label: "stazione sciistica con cascate nei dintorni", fun: "D'estate le cascate del Dies, d'inverno la neve — qui non ci si annoia mai." }
      ]
    },
    {
      zona: "Val Varaita", km: "1-2 giorni consigliati", titolo: "Colle dell'Agnello",
      desc: "Uno dei valichi asfaltati più alti d'Europa (2744 m), al confine con la Francia. Da Sampeyre si sale lungo una valle stretta tra pascoli d'alta quota, con tornanti che si arrampicano quasi a strapiombo negli ultimi chilometri.",
      meteoPlace: "Pontechianale",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Colleagnello001.jpg",
      tappe: [
        { nome: "Sampeyre", query: "Sampeyre CN", label: "ingresso nella Val Varaita", fun: "Da qui la valle si stringe e le curve iniziano a farsi serie." },
        { nome: "Pontechianale", query: "Pontechianale CN", label: "ultimo paese prima della salita finale", fun: "L'ultimo caffè vero prima dei tornanti che ti portano quasi a 2750 metri." },
        { nome: "Colle dell'Agnello", query: "Colle dell'Agnello", label: "2744 m, uno dei valichi più alti d'Europa", fun: "L'aria qui è così sottile che pure il bracket del casco sembra più leggero." }
      ]
    },
    {
      zona: "Costiera Amalfitana", km: "2-3 giorni consigliati", titolo: "La SS163 tra Positano e Ravello",
      desc: "La costiera più fotografata d'Italia, curva dopo curva a picco sul mare: Positano, Amalfi e Ravello sospese tra scogliere e limoneti. Non è un giro veloce — la SS163 è stretta e trafficata d'estate — ma va vissuta con calma, meglio in bassa stagione.",
      meteoPlace: "Amalfi",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Positano-Amalfi_Coast-Italy.jpg",
      tappe: [
        { nome: "Sorrento", query: "Sorrento NA", label: "punto di partenza sulla penisola sorrentina", fun: "L'ultimo pieno tranquillo prima che la strada inizi a stringersi sul serio." },
        { nome: "Positano", query: "Positano SA", label: "case a picco sul mare", fun: "Un paese verticale che sembra sfidare la gravità — parcheggiare la moto è un'impresa a parte." },
        { nome: "Amalfi", query: "Amalfi SA", label: "Duomo e centro storico", fun: "La Repubblica Marinara più antica d'Italia, e tu ci arrivi in sella invece che via mare — va bene comunque." },
        { nome: "Ravello", query: "Ravello SA", label: "terrazze panoramiche sopra la costiera", fun: "La vista da quassù rende ogni tornante stretto della salita improvvisamente perdonabile." }
      ]
    },
    {
      zona: "Sardegna", km: "4-5 giorni consigliati", titolo: "Supramonte e la SS125 Orientale Sarda",
      desc: "Una delle poche mete di questa lista che richiede un traghetto, e ne vale ogni ora di viaggio: la SS125 'Orientale Sarda' è leggendaria tra i motociclisti, tra le gole del Supramonte e la costa del golfo di Orosei. Da programmare con calma, traghetto incluso.",
      meteoPlace: "Dorgali",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Supramonte_visto_da_Orgosolo.jpg",
      tappe: [
        { nome: "Olbia", query: "Olbia porto", label: "arrivo traghetto e punto di partenza", fun: "Si scende dal traghetto e si sente già che qui l'asfalto promette bene." },
        { nome: "Dorgali", query: "Dorgali NU", label: "base per il Supramonte", fun: "Un paese tranquillo circondato da montagne che sembrano finte — non lo sono." },
        { nome: "Gola di Gorropu", query: "Gola di Su Gorropu", label: "uno dei canyon più profondi d'Europa", fun: "La moto la lasci al parcheggio, il resto si fa a piedi — ma vale la sosta." },
        { nome: "Cala Gonone", query: "Cala Gonone NU", label: "costa del golfo di Orosei", fun: "Dopo tanta montagna, il mare più bello della Sardegna come premio finale." }
      ]
    },
    {
      zona: "Val Passiria", km: "1-2 giorni consigliati", titolo: "Passo del Rombo (Timmelsjoch)",
      desc: "Un valico spettacolare verso l'Austria, strada a pedaggio aperta solo da metà maggio a fine ottobre: da San Leonardo in Passiria si sale tra tornanti panoramici fino a 2509 m, con vista sui ghiacciai dell'Ötztal.",
      meteoPlace: "Moso in Passiria",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Passo_del_Rombo_06.JPG",
      tappe: [
        { nome: "San Leonardo in Passiria", query: "San Leonardo in Passiria BZ", label: "ingresso nella Val Passiria", fun: "Paese natale di Andreas Hofer, eroe popolare tirolese — un pezzo di storia prima delle curve." },
        { nome: "Moso in Passiria", query: "Moso in Passiria BZ", label: "ultimo paese prima della salita", fun: "L'ultima sosta tranquilla prima che la strada inizi a arrampicarsi sul serio." },
        { nome: "Passo del Rombo", query: "Passo del Rombo", label: "2509 m, strada a pedaggio verso l'Austria", fun: "Si paga il pedaggio, ma per quei tornanti vale ogni centesimo." }
      ]
    },
    {
      zona: "Sicilia", km: "4-5 giorni consigliati", titolo: "Etna e Madonie",
      desc: "Un'altra meta che richiede il traghetto (breve, da Villa San Giovanni), ma ripaga con paesaggi che cambiano ad ogni tappa: le colate laviche dell'Etna e i boschi delle Madonie, tra i parchi naturali meno battuti dai turisti del sud Italia.",
      meteoPlace: "Nicolosi",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Mount_Etna_-_4.jpg",
      tappe: [
        { nome: "Catania", query: "Catania porto", label: "arrivo e punto di partenza", fun: "Il traghetto per la Sicilia dura poco più di un'ora — meno del previsto, promesso." },
        { nome: "Nicolosi", query: "Nicolosi CT", label: "base per il versante sud dell'Etna", fun: "'La porta dell'Etna', dicono qui — e in effetti la salita inizia proprio da questo paese." },
        { nome: "Rifugio Sapienza", query: "Rifugio Sapienza Etna", label: "quota 1900 m sull'Etna", fun: "Lava nera, neve d'inverno, panorama sul mare — l'Etna cambia scenografia ogni cento metri di salita." },
        { nome: "Piano Battaglia", query: "Piano Battaglia PA", label: "cuore del Parco delle Madonie", fun: "Dopo il vulcano, i boschi delle Madonie sembrano un altro pianeta — stessa isola, promesso." }
      ]
    },
    {
      zona: "Gran Sasso", km: "2-3 giorni consigliati", titolo: "Campo Imperatore, il 'Piccolo Tibet' d'Italia",
      desc: "La meta più vicina a Roma di questa lista, eppure sembra un altro continente: l'altopiano di Campo Imperatore, a 2000 m sotto il Gran Sasso, con panorami che gli hanno guadagnato il soprannome di 'Piccolo Tibet'. Perfetto anche per un weekend lungo.",
      meteoPlace: "Campo Imperatore",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Campo_Imperatore,_Gran_Sasso.jpg",
      tappe: [
        { nome: "L'Aquila", query: "L'Aquila centro", label: "punto di partenza abruzzese", fun: "Una città che si sta ricostruendo pezzo per pezzo — merita la sosta anche solo per rispetto." },
        { nome: "Campo Imperatore", query: "Campo Imperatore AQ", label: "l'altopiano a 2000 m, il 'Piccolo Tibet'", fun: "Qui hanno girato scene western — e appena arrivi capisci esattamente perché." },
        { nome: "Rocca Calascio", query: "Rocca Calascio AQ", label: "fortezza panoramica tra le più alte d'Italia", fun: "La rocca più fotografata d'Abruzzo, sullo sfondo di praticamente ogni film ambientato quassù." }
      ]
    },
    {
      zona: "Dolomiti Ampezzane", km: "1-2 giorni consigliati", titolo: "Passo Giau, il balcone delle Dolomiti",
      desc: "Uno dei passi più fotografati e più amati d'Italia, spesso tappa del Giro d'Italia: da Cortina d'Ampezzo si sale tra tornanti panoramici fino a 2236 m, con vista sul Gruppo del Nuvolau e sulla Croda da Lago.",
      meteoPlace: "Cortina d'Ampezzo",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Passo_di_Giau.jpg",
      tappe: [
        { nome: "Cortina d'Ampezzo", query: "Cortina d'Ampezzo BL", label: "la 'Regina delle Dolomiti'", fun: "Location olimpica due volte (1956 e 2026) — arrivarci in moto è comunque la medaglia migliore." },
        { nome: "Passo Giau", query: "Passo Giau", label: "2236 m, tornanti panoramici sul Nuvolau", fun: "Uno dei passi più fotografati d'Italia — preparati a condividerlo con parecchi altri obiettivi." },
        { nome: "Selva di Cadore", query: "Selva di Cadore BL", label: "versante opposto del passo", fun: "La discesa che ti fa capire perché i ciclisti del Giro arrivano quassù distrutti — e felici." }
      ]
    },
    {
      zona: "Valnerina", km: "1-2 giorni consigliati", titolo: "La Cascata delle Marmore e la Valnerina",
      desc: "Una meta più vicina e accessibile delle altre, ma non meno spettacolare: la Cascata delle Marmore, tra le cascate artificiali più alte d'Europa (165 m, creata dai Romani), e la Valnerina che si snoda tra gole e borghi tra i meno turistici dell'Umbria.",
      meteoPlace: "Terni",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Cascata_delle_Marmore_2.JPG",
      tappe: [
        { nome: "Terni", query: "Terni centro", label: "punto di partenza umbro", fun: "Città industriale con una sorpresa naturale a due passi — non giudicarla dalla prima impressione." },
        { nome: "Cascata delle Marmore", query: "Cascata delle Marmore", label: "165 m, tra le cascate artificiali più alte d'Europa", fun: "Costruita dai Romani più di duemila anni fa — un'opera idraulica che fa impallidire certi cantieri moderni." },
        { nome: "Ferentillo", query: "Ferentillo TR", label: "borgo nella gola della Valnerina", fun: "Un paese diviso in due dal fiume, con vista su una delle valli più strette e verdi dell'Umbria." }
      ]
    },
    {
      zona: "Val d'Orcia", km: "2-3 giorni consigliati", titolo: "Val d'Orcia, tra strade bianche e colline UNESCO",
      desc: "Il paesaggio toscano più fotografato al mondo, patrimonio UNESCO: cipressi solitari, colline dorate e le celebri 'strade bianche' sterrate che attraversano la Val d'Orcia tra Pienza, San Quirico e Montalcino.",
      meteoPlace: "Pienza",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Pienza_italy.jpg",
      tappe: [
        { nome: "Pienza", query: "Pienza SI", label: "la città ideale rinascimentale, UNESCO", fun: "Ripensata a tavolino nel Quattrocento come 'città ideale' — oggi è ideale soprattutto per una sosta con vista." },
        { nome: "San Quirico d'Orcia", query: "San Quirico d'Orcia SI", label: "borgo e Orti Leonini", fun: "Il cuore geografico della Val d'Orcia — e si vede, nel senso migliore possibile." },
        { nome: "Montalcino", query: "Montalcino SI", label: "patria del Brunello", fun: "Un bicchiere di Brunello a fine giornata è quasi un obbligo morale, da queste parti." }
      ]
    },
    {
      zona: "Valle d'Itria", km: "3-4 giorni consigliati", titolo: "Valle d'Itria, il regno dei trulli",
      desc: "Un cambio di scenario totale rispetto al resto della lista: la Puglia dei trulli, tra Alberobello (patrimonio UNESCO), le stradine bianche di Locorotondo e i muretti a secco di Cisternino, tra gli 'i borghi più belli d'Italia'.",
      meteoPlace: "Alberobello",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Alberobello_Trulli.jpg",
      tappe: [
        { nome: "Alberobello", query: "Alberobello trulli", label: "i trulli, patrimonio UNESCO", fun: "Un intero quartiere di casette a cono bianche — sembra un set giocattolo, invece ci vive gente vera." },
        { nome: "Locorotondo", query: "Locorotondo BA", label: "borgo bianco a pianta circolare", fun: "Il nome non mente: il centro storico è letteralmente un cerchio perfetto." },
        { nome: "Cisternino", query: "Cisternino BR", label: "uno dei borghi più belli d'Italia", fun: "Vicoli bianchi, fiori ovunque, e le celebri 'fornelle' pronte per la bombetta a fine giro." }
      ]
    },
    {
      zona: "Monti Sibillini", km: "2-3 giorni consigliati", titolo: "Castelluccio di Norcia e il Piano Grande",
      desc: "Un altopiano carsico immenso a 1450 m, che a fine giugno si colora con la celebre 'Fioritura' delle lenticchie — uno degli spettacoli naturali più fotografati d'Italia. Norcia, gravemente colpita dal sisma del 2016, è oggi in piena ricostruzione.",
      meteoPlace: "Norcia",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Piano_Grande_-_Castelluccio.jpg",
      tappe: [
        { nome: "Norcia", query: "Norcia PG", label: "patria della norcineria, in ricostruzione dopo il sisma 2016", fun: "La città che ha dato il nome ai norcini di tutta Italia — merita la sosta anche solo per rispetto, come Amatrice." },
        { nome: "Castelluccio di Norcia", query: "Castelluccio di Norcia", label: "Piano Grande, la 'Fioritura' a fine giugno", fun: "A fine giugno i campi si colorano come una tavolozza — controlla il periodo prima di partire, la fioritura dura poco." },
        { nome: "Forca di Presta", query: "Forca di Presta", label: "valico verso le Marche", fun: "Il punto più alto del giro, e anche il confine informale tra Umbria e Marche." }
      ]
    },
    {
      zona: "Livigno", km: "1-2 giorni consigliati", titolo: "Livigno e il Passo di Foscagno",
      desc: "La 'piccola Svizzera' italiana: Livigno, zona extra-doganale a 1800 m, raggiunta attraverso il Passo di Foscagno, meno famoso dello Stelvio ma altrettanto panoramico, con vista sulle Alpi Retiche.",
      meteoPlace: "Livigno",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Livigno_-_Comune_di_Livigno_-_2023-09-06_00-39-00_001.JPG",
      tappe: [
        { nome: "Passo dell'Eira", query: "Passo dell'Eira", label: "primo valico prima di Foscagno", fun: "Il preludio del Foscagno — se ti sembra già bello qui, aspetta il prossimo passo." },
        { nome: "Passo di Foscagno", query: "Passo di Foscagno", label: "2291 m, valico verso Livigno", fun: "Meno cartoline dello Stelvio, stessa vista da togliere il fiato — e molto meno traffico." },
        { nome: "Livigno", query: "Livigno SO", label: "zona extra-doganale a 1800 m", fun: "Prezzi da zona franca e panorami da cartolina — un motivo in più per fermarsi almeno una notte." }
      ]
    }
  ];

  const VIAGGI_RICORDARE = [
    {
      zona: "Baviera, Ring e Olanda", km: "7 giorni consigliati", kmNum: 3996, titolo: "Castelli bavaresi, Porsche, il Nürburgring e Amsterdam",
      desc: "Un giro raccontato da chi l'ha fatto davvero: castelli tra Austria e Baviera, un museo per gli amanti delle auto, il circuito più leggendario del mondo e due giorni tra i canali di Amsterdam. Quasi 4000 km reali (3996, per la precisione) in una settimana, con un solo giorno di sosta vera.",
      meteoPlace: "Monaco di Baviera",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Castle_Neuschwanstein.jpg",
      tappe: [
        { nome: "Roma", query: "Roma", label: "punto di partenza", fun: "Zaino, borse laterali e una settimana intera davanti — la parte più bella inizia proprio qui, in garage." },
        { nome: "Ehrenberg e Fort Claudia", query: "Ehrenberg Reutte Austria", label: "rovine medievali e fortezza asburgica al confine austro-tedesco", fun: "Un intero complesso di rovine e fortini sopra Reutte — ci si passa un pomeriggio intero e non basta." },
        { nome: "Castello di Neuschwanstein", query: "Schloss Neuschwanstein", label: "il castello fiabesco di Ludwig II di Baviera", fun: "Il castello che ha ispirato quello di Disney — arrivarci in moto invece che in pullman turistico è tutta un'altra storia." },
        { nome: "Stoccarda", query: "Porsche Museum Stuttgart", label: "Museo Porsche, tappa gradita anche a chi ama solo le auto", fun: "Un piano intero di prototipi e leggende da corsa — ci si dimentica per un po' di essere arrivati in moto." },
        { nome: "Nürburgring", query: "Nürburgring", label: "il circuito più temuto e amato al mondo", fun: "Solo a leggere 'Nordschleife' sul cartello vengono i brividi, anche restando nel parcheggio." },
        { nome: "Amsterdam", query: "Amsterdam centro", label: "canali, biciclette e due notti di pausa dal casco", fun: "L'unica città dove la moto rischia di essere il mezzo più lento in circolazione — le bici comandano." },
        { nome: "Norimberga", query: "Norimberga centro storico", label: "centro storico medievale ricostruito dopo la guerra", fun: "Cammini tra mura e torri che sembrano lì da sempre — invece sono rinate pezzo per pezzo dopo il 1945." },
        { nome: "Monaco di Baviera", query: "BMW Museum München", label: "Museo BMW, moto comprese in ordine cronologico", fun: "Tutta la storia BMW moto per moto, dalla prima all'ultima — un pellegrinaggio quasi obbligato con la targa giusta in tasca." },
        { nome: "Roma", query: "Roma", label: "ritorno diretto, senza tappe intermedie", fun: "L'ultimo giorno si guida e basta: quello in cui i chilometri si sentono tutti, ma anche quello che sa già di racconti da fare agli amici." }
      ]
    },
    {
      zona: "Costa Azzurra e Provenza", km: "7 giorni consigliati", kmNum: 2650, titolo: "Costa Azzurra, Provenza e i profumi della Francia del sud",
      desc: "Il mito della Riviera francese visto dalla sella: curve panoramiche fino a Nizza, il glamour di Saint-Tropez, il porto vecchio di Marsiglia e i campi di lavanda della Provenza. Un giro che alterna mare, borghi e buona tavola senza mai avere fretta.",
      meteoPlace: "Nizza",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Nice_(FR-06000)_Promenade_des_anglais.jpg",
      tappe: [
        { nome: "Roma", query: "Roma", label: "punto di partenza", fun: "Si parte verso ovest, con il profumo di salsedine ligure già in testa." },
        { nome: "Genova", query: "Genova centro storico", label: "sosta panoramica lungo la costa ligure", fun: "L'ultima vera curva italiana prima del confine — da qui in poi si parla francese." },
        { nome: "Nizza", query: "Nice Promenade des Anglais", label: "la Promenade e il blu della Costa Azzurra", fun: "La Promenade des Anglais va percorsa piano, non per il traffico ma perché nessuno ha davvero fretta qui." },
        { nome: "Cannes e Saint-Tropez", query: "Saint-Tropez", label: "yacht, vetrine e il mito della Dolce Vita francese", fun: "Parcheggiare la moto tra gli yacht da dieci milioni è probabilmente il momento più fotografato del viaggio." },
        { nome: "Marsiglia", query: "Marsiglia Vieux Port", label: "il porto vecchio e la Provenza affacciata sul mare", fun: "Il Vieux Port profuma di pesce alla griglia dalla mattina — la bouillabaisse qui è quasi un rito." },
        { nome: "Avignone", query: "Avignone Palazzo dei Papi", label: "il Palazzo dei Papi e i campi di lavanda nei dintorni (giugno-luglio)", fun: "Se ci passi tra giugno e luglio, i campi color viola intorno valgono da soli la deviazione." },
        { nome: "Torino", query: "Torino centro", label: "ultima notte prima di rientrare, tra Mole e caffè storici", fun: "Un aperitivo sabaudo come premio finale prima delle ultime ore di autostrada verso casa." },
        { nome: "Roma", query: "Roma", label: "ritorno", fun: "Si rientra con la pelle più scura e la lista delle spese decisamente più leggera." }
      ]
    },
    {
      zona: "Svizzera, i grandi passi", km: "7 giorni consigliati", kmNum: 2050, titolo: "Svizzera: il Grand Tour dei passi alpini",
      desc: "Una settimana dedicata solo a curve, tornanti e panorami da cartolina: San Gottardo, Furka e Grimsel in sequenza, poi i laghi di Interlaken e la capitale Berna. Il viaggio giusto per chi in moto cerca soprattutto la strada, non la meta.",
      meteoPlace: "Andermatt",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Belvedere_Furka.jpg",
      tappe: [
        { nome: "Roma", query: "Roma", label: "punto di partenza", fun: "Uno dei viaggi con meno chilometri di trasferimento e più curve pure della lista — si va dritti al sodo." },
        { nome: "Lugano", query: "Lugano centro", label: "primo assaggio di Svizzera, lago e palme", fun: "Palme sul lago a due passi dalle Alpi — la Svizzera sa sorprendere fin dal primo giorno." },
        { nome: "Passo del San Gottardo", query: "Passo del San Gottardo", label: "il valico simbolo della Svizzera, ancora acciottolato in cima", fun: "L'acciottolato in vetta va preso con rispetto — bello da vedere, meno comodo da guidare." },
        { nome: "Passo della Furka", query: "Passo della Furka", label: "tornanti scenografici e il ghiacciaio del Rodano", fun: "Il passo delle scene di inseguimento di 007 — i tornanti si riconoscono al primo sguardo." },
        { nome: "Passo del Grimsel", query: "Passo del Grimsel", label: "laghi artificiali turchesi incastonati tra le rocce", fun: "L'acqua turchese dei bacini sembra ritoccata al computer — non lo è, è solo la Svizzera che esagera." },
        { nome: "Interlaken", query: "Interlaken", label: "tra i laghi di Thun e Brienz, ai piedi dell'Eiger", fun: "Il nome dice tutto: 'tra i laghi' — e infatti da qualunque lato ti giri, ce n'è uno." },
        { nome: "Berna", query: "Berna centro storico", label: "la capitale con gli orsi e il centro storico UNESCO", fun: "Gli orsi veri della fossa cittadina sono l'ultima cosa che ti aspetti di trovare in una capitale europea." },
        { nome: "Roma", query: "Roma", label: "ritorno", fun: "Il rientro più breve del gruppo — un motivo in più per allungare la sosta a ogni passo lungo la strada." }
      ]
    },
    {
      zona: "Istria e Dalmazia", km: "7 giorni consigliati", kmNum: 2800, titolo: "Croazia: Istria, Plitvice e le mura di Dubrovnik",
      desc: "La costa croata da nord a sud: la 'piccola Venezia' di Rovigno, le cascate turchesi di Plitvice, il tramonto di Zara e il palazzo romano di Spalato, fino alle mura patrimonio UNESCO di Dubrovnik. Un viaggio che alterna borghi di mare e natura spettacolare.",
      meteoPlace: "Dubrovnik",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Old_City_of_Dubrovnik-108773.jpg",
      tappe: [
        { nome: "Roma", query: "Roma", label: "punto di partenza", fun: "Si punta a nordest, verso un mare che cambia colore appena si passa il confine." },
        { nome: "Rovigno", query: "Rovigno Croazia", label: "la 'piccola Venezia' d'Istria", fun: "Vicoli stretti e campanile veneziano — per un attimo sembra di non aver mai lasciato l'Italia." },
        { nome: "Laghi di Plitvice", query: "Parco nazionale di Plitvice", label: "cascate e laghi turchesi, patrimonio UNESCO", fun: "La moto resta al parcheggio e si cammina per ore — ma con questi colori nessuno si lamenta." },
        { nome: "Zara", query: "Zara centro storico", label: "il tramonto più bello del mondo, secondo Alfred Hitchcock", fun: "Fu proprio Hitchcock a definirlo così — e sull'organo marino, ad ascoltarlo cantare, gli si crede subito." },
        { nome: "Spalato", query: "Spalato Palazzo di Diocleziano", label: "un palazzo imperiale romano diventato città vera e vissuta", fun: "Bar, negozi e case dentro le mura di un palazzo romano di 1700 anni fa — l'imperatore Diocleziano non se lo sarebbe immaginato." },
        { nome: "Dubrovnik", query: "Dubrovnik mura", label: "le mura della 'Perla dell'Adriatico'", fun: "Un giro completo sulle mura regala una vista che spiega da sola perché la chiamano così." },
        { nome: "Roma", query: "Roma", label: "ritorno", fun: "Si torna con la pelle salata e la certezza che l'Adriatico, dall'altra sponda, sa essere ancora più bello." }
      ]
    },
    {
      zona: "Austria e Slovenia", km: "7 giorni consigliati", kmNum: 2750, titolo: "Austria e Slovenia: Salisburgo, Vienna e il lago di Bled",
      desc: "Da Mozart agli Asburgo, poi la quiete del lago di Bled: un giro che unisce grandi capitali imperiali e la Slovenia più verde e tranquilla. Salisburgo, Vienna, Graz, Bled e Lubiana in una sola settimana, senza mai correre.",
      meteoPlace: "Vienna",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Bled,_Slovenia.jpg",
      tappe: [
        { nome: "Roma", query: "Roma", label: "punto di partenza", fun: "Direzione nordest, con l'idea di passare da tre capitali (imperiali, quasi) in una settimana sola." },
        { nome: "Salisburgo", query: "Salisburgo centro storico", label: "la città di Mozart, tra fortezza e centro barocco", fun: "Da qualunque angolo del centro storico si senta una melodia, è quasi sempre colpa di Mozart." },
        { nome: "Vienna", query: "Vienna centro", label: "palazzi imperiali, caffè storici e Ring da percorrere in moto", fun: "Percorrere il Ring in moto tra i palazzi imperiali è come sfogliare un libro di storia a 50 all'ora." },
        { nome: "Graz", query: "Graz centro storico", label: "seconda città austriaca, meno turistica e piena di sorprese", fun: "Meno cartoline di Vienna, molto più vissuta — la Austria che pochi turisti italiani si fermano a vedere." },
        { nome: "Lago di Bled", query: "Lago di Bled", label: "l'isolotto con la chiesetta in mezzo al lago", fun: "La campana della chiesetta sull'isola si suona per fortuna — la leggenda dice che chi ci riesce vede un desiderio avverarsi." },
        { nome: "Lubiana", query: "Lubiana centro", label: "capitale slovena a misura di due ruote", fun: "Una delle poche capitali europee dove si respira ancora aria di paese — nel senso più bello del termine." },
        { nome: "Roma", query: "Roma", label: "ritorno", fun: "Ultimo tratto d'autostrada, con la sveglia degli Asburgo ancora negli occhi." }
      ]
    },
    {
      zona: "Boemia e Baviera", km: "7 giorni consigliati", kmNum: 2850, titolo: "Praga e la Strada Romantica tedesca",
      desc: "Il centro Europa più fiabesco: Rothenburg e la Strada Romantica, Norimberga, la Praga di Ponte Carlo e Città Vecchia, le terme liberty di Karlovy Vary e la medievale Ratisbona. Un giro fatto apposta per chi ama i centri storici che sembrano scenografie.",
      meteoPlace: "Praga",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Charles_Bridge_Prague.jpg",
      tappe: [
        { nome: "Roma", query: "Roma", label: "punto di partenza", fun: "Rotta verso la Baviera, con la Boemia come vera destinazione della settimana." },
        { nome: "Rothenburg ob der Tauber", query: "Rothenburg ob der Tauber", label: "il borgo medievale simbolo della Strada Romantica", fun: "Un centro storico così integro che sembra costruito apposta per un film in costume — invece è tutto vero." },
        { nome: "Norimberga", query: "Norimberga centro storico", label: "castello imperiale e centro storico ricostruito", fun: "Dal castello imperiale la vista sui tetti rossi vale la salita a piedi con gli stivali da moto." },
        { nome: "Praga", query: "Praga Ponte Carlo", label: "il Ponte Carlo, il Castello e la Città Vecchia", fun: "Attraversare il Ponte Carlo all'alba, prima dei pullman turistici, è tutto un altro Ponte Carlo." },
        { nome: "Karlovy Vary", query: "Karlovy Vary", label: "terme storiche e palazzine liberty color pastello", fun: "Le facciate color pastello sembrano una torta a più piani — le terme invece sono maledettamente serie da secoli." },
        { nome: "Ratisbona", query: "Ratisbona centro storico", label: "una delle città medievali meglio conservate di Germania", fun: "Il ponte di pietra su cui cammini ha quasi 900 anni e regge ancora meglio di certe strade italiane." },
        { nome: "Roma", query: "Roma", label: "ritorno", fun: "Il casco si toglie a casa con la sensazione di aver attraversato tre epoche diverse in una settimana." }
      ]
    },
    {
      zona: "Ungheria e Balcani", km: "7 giorni consigliati", kmNum: 2650, titolo: "Budapest, il lago Balaton e Zagabria",
      desc: "Il Danubio, le terme di Budapest, le spiagge d'acqua dolce del Balaton e i caffè all'aperto di Zagabria: un giro più rilassato, pensato per chi vuole scoprire l'Europa centro-orientale senza inseguire troppi chilometri al giorno.",
      meteoPlace: "Budapest",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Hungarian_Parliament_Building,_Budapest.jpg",
      tappe: [
        { nome: "Roma", query: "Roma", label: "punto di partenza", fun: "Direzione Pannonia, con calma: qui il ritmo è più rilassato del solito." },
        { nome: "Lubiana", query: "Lubiana centro", label: "tappa di passaggio tra Alpi e pianura pannonica", fun: "Una sosta che è già di per sé una piccola vacanza, non solo un punto di passaggio." },
        { nome: "Budapest", query: "Budapest Parlamento", label: "il Parlamento sul Danubio e le terme storiche", fun: "Un bagno nelle terme di Széchenyi dopo ore di sella è il miglior antidolorifico che esista." },
        { nome: "Lago Balaton", query: "Lago Balaton", label: "il 'mare degli ungheresi', spiagge d'acqua dolce", fun: "Gli ungheresi lo chiamano affettuosamente 'mare' — e in effetti, da riva a riva, ci vuole un bel po' per vederci chiaro." },
        { nome: "Zagabria", query: "Zagabria centro storico", label: "città alta, mercato coperto e caffè all'aperto", fun: "La città alta si gira comodamente a piedi — la moto, per una volta, resta volentieri parcheggiata." },
        { nome: "Roma", query: "Roma", label: "ritorno", fun: "Un rientro senza fretta, proprio come è stato il viaggio." }
      ]
    },
    {
      zona: "Normandia e Bretagna", km: "7 giorni consigliati", kmNum: 3800, titolo: "Normandia e Bretagna: scogliere, sbarchi e Mont Saint-Michel",
      desc: "Uno dei viaggi più lunghi e ambiziosi della lista, verso l'estremo nordovest della Francia: le spiagge dello sbarco in Normandia, l'abbazia sull'isola di Mont Saint-Michel e le coste fortificate della Bretagna. Giornate impegnative in autostrada, ricompensate da paesaggi che in Italia non si trovano.",
      meteoPlace: "Saint-Malo",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Mont_Saint-Michel_France.jpg",
      tappe: [
        { nome: "Roma", query: "Roma", label: "punto di partenza", fun: "Il viaggio con più autostrada di tutti — le prime due giornate sono da veri macinatori di chilometri." },
        { nome: "Digione", query: "Digione centro", label: "tappa di passaggio in Borgogna", fun: "Un pieno di senape vera prima di rimettersi il casco — qui è quasi un souvenir obbligato." },
        { nome: "Parigi", query: "Tour Eiffel Parigi", label: "una sosta veloce, anche solo per la Tour Eiffel", fun: "Anche solo un caffè all'ombra della Tour Eiffel vale la deviazione dal percorso più diretto." },
        { nome: "Spiagge dello sbarco", query: "Omaha Beach Normandia", label: "le spiagge del D-Day, un pezzo di storia da vivere in silenzio", fun: "Non c'è aneddoto scherzoso che tenga: qui ci si ferma, si legge qualche nome sulle croci, e si riparte più leggeri e più consapevoli." },
        { nome: "Mont Saint-Michel", query: "Mont Saint-Michel", label: "l'abbazia sull'isola che cambia aspetto con la marea", fun: "Con l'alta marea diventa davvero un'isola — capita il momento giusto e sembra di guardare un miraggio." },
        { nome: "Saint-Malo", query: "Saint-Malo", label: "città corsara fortificata sull'Atlantico", fun: "Le mura furono costruite per tenere fuori i nemici — oggi tengono fuori solo il vento atlantico, e nemmeno sempre." },
        { nome: "Roma", query: "Roma", label: "ritorno", fun: "Il rientro più lungo del gruppo: due giorni buoni di autostrada, ma con l'Atlantico ancora negli occhi." }
      ]
    },
    {
      zona: "Catalogna e Pirenei", km: "7 giorni consigliati", kmNum: 3400, titolo: "Barcellona, Andorra e i passi dei Pirenei",
      desc: "La Catalogna vista in moto: la Sagrada Família e il lungomare di Barcellona, lo shopping in quota di Andorra e i valichi di alta montagna dei Pirenei, prima di rientrare lungo la costa francese. Città, montagna e mare nello stesso viaggio.",
      meteoPlace: "Barcellona",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/La_Sagrada_Familia_Barcelona.jpg",
      tappe: [
        { nome: "Roma", query: "Roma", label: "punto di partenza", fun: "Si punta dritti verso la Catalogna, con la Costa Azzurra come antipasto lungo la strada." },
        { nome: "Genova", query: "Genova centro", label: "sosta lungo la costa prima del confine francese", fun: "Ultimo caffè italiano prima di due giorni tra Francia e Spagna." },
        { nome: "Montpellier", query: "Montpellier centro", label: "tappa di passaggio nel sud della Francia", fun: "Una città universitaria vivace, perfetta per una sosta serale tra studenti e terrazzini." },
        { nome: "Barcellona", query: "Sagrada Familia Barcellona", label: "la Sagrada Família e il lungomare della Barceloneta", fun: "La Sagrada Família è in costruzione da oltre 140 anni — probabilmente finirà dopo la tua prossima moto." },
        { nome: "Andorra la Vella", query: "Andorra la Vella", label: "shopping duty-free tra le montagne, di passaggio", fun: "Un intero micro-stato che vive di duty-free tra due catene montuose — un po' surreale, molto divertente." },
        { nome: "Port d'Envalira", query: "Port d'Envalira", label: "il valico stradale più alto dei Pirenei", fun: "Il tetto stradale dei Pirenei, oltre 2400 metri — l'aria si fa sottile e la vista pure." },
        { nome: "Roma", query: "Roma", label: "ritorno", fun: "Si rientra dalla stessa costa dell'andata, ma con lo sguardo di chi ha appena valicato i Pirenei." }
      ]
    },
    {
      zona: "Polonia meridionale", km: "7 giorni consigliati", kmNum: 3300, titolo: "Cracovia, i Tatra e la memoria di Auschwitz",
      desc: "Un viaggio che unisce la bellezza medievale di Cracovia, le montagne dei Tatra e una tappa che va oltre il turismo: il memoriale di Auschwitz-Birkenau, da visitare con rispetto e senza fretta. Un giro pensato per chi cerca anche significato, non solo panorami.",
      meteoPlace: "Cracovia",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Sukiennice_and_Main_Market_Square_Krakow_Poland.JPG",
      tappe: [
        { nome: "Roma", query: "Roma", label: "punto di partenza", fun: "Direzione nordest attraverso l'Austria, con la Polonia come meta poco battuta ma che ripaga alla grande." },
        { nome: "Vienna", query: "Vienna centro", label: "tappa di passaggio verso la Polonia", fun: "Una sosta di una notte, giusto il tempo di uno strudel prima di ripartire." },
        { nome: "Cracovia", query: "Cracovia Rynek Główny", label: "la piazza del mercato medievale più grande d'Europa", fun: "La tromba che suona ogni ora dalla torre di Santa Maria si interrompe sempre a metà nota — un omaggio a una leggenda locale che vale la pena farsi raccontare." },
        { nome: "Auschwitz-Birkenau", query: "Auschwitz-Birkenau Memorial", label: "il memoriale del campo di concentramento nazista", fun: "Qui non ci sono aneddoti da raccontare: solo una visita silenziosa, i binari e i nomi, e la consapevolezza di portarsi via qualcosa di importante." },
        { nome: "Zakopane", query: "Zakopane Polonia", label: "la 'capitale invernale' polacca ai piedi dei Tatra", fun: "Architettura in legno tipica delle montagne polacche e l'aria dei Tatra: il modo giusto per schiarirsi i pensieri dopo la tappa precedente." },
        { nome: "Roma", query: "Roma", label: "ritorno", fun: "Un rientro lungo, con più di un pensiero a cui pensare lungo l'autostrada." }
      ]
    },
    {
      zona: "Grecia centrale", km: "7 giorni consigliati", kmNum: 2050, titolo: "Grecia in moto: il traghetto, Meteora e Atene",
      desc: "Un viaggio diverso dagli altri: si arriva in Grecia in nave, moto compresa, per risparmiare due giorni di autostrada balcanica. Poi Meteora, Delfi e Atene, prima di reimbarcarsi per il rientro. Cultura antica e monasteri sospesi nel cielo.",
      meteoPlace: "Meteora",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Meteora_-_Kalambaka_-_Greece.jpg",
      tappe: [
        { nome: "Roma", query: "Roma", label: "punto di partenza", fun: "Si parte verso Ancona: qui il viaggio vero comincia in porto, non in autostrada." },
        { nome: "Ancona", query: "Porto di Ancona", label: "imbarco sul traghetto notturno per la Grecia, moto compresa", fun: "Si lega la moto in stiva, ci si sistema in cabina, e la traversata sostituisce due giorni di autostrada balcanica." },
        { nome: "Igoumenitsa", query: "Igoumenitsa porto", label: "sbarco in Grecia con il sole già alto", fun: "Si scende dalla rampa del traghetto e in pochi minuti si è già sull'asfalto greco — cambio di scenario istantaneo." },
        { nome: "Meteora", query: "Meteora Kalambaka", label: "monasteri bizantini in bilico su pilastri di roccia", fun: "I monaci salivano un tempo con reti e carrucole — oggi per fortuna ci sono le scale, ma l'effetto vertigine resta intatto." },
        { nome: "Delfi", query: "Delfi sito archeologico", label: "l'oracolo più famoso dell'antichità, tra gli ulivi", fun: "Anche senza credere agli oracoli, stare al centro del 'ombelico del mondo' antico un brivido lo regala comunque." },
        { nome: "Atene", query: "Acropoli Atene", label: "l'Acropoli e il centro storico ai piedi del Partenone", fun: "Vedere il Partenone illuminato di sera dai vicoli di Plaka è uno dei motivi per cui vale la pena il traghetto." },
        { nome: "Ancona", query: "Porto di Ancona", label: "rientro in traghetto: moto e gambe finalmente a riposo", fun: "Un'intera nottata di traversata per riposare le braccia prima delle ultime ore di strada verso casa." },
        { nome: "Roma", query: "Roma", label: "ritorno", fun: "Si torna con la moto salata di salsedine due volte e un alfabeto nuovo mezzo imparato." }
      ]
    },
    {
      zona: "Germania del nord e Danimarca", km: "7 giorni consigliati", kmNum: 4100, titolo: "Amburgo, il ponte di Øresund e Copenaghen",
      desc: "Il viaggio più a nord — e il più lungo in chilometri — di tutta la lista: il porto anseatico di Amburgo, il leggendario ponte-tunnel di Øresund e le casette colorate di Nyhavn a Copenaghen. Giornate lunghe in autostrada tedesca, ricompensate da un'atmosfera scandinava che in Italia non si trova.",
      meteoPlace: "Copenaghen",
      foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Nyhavn-panorama.jpg",
      tappe: [
        { nome: "Roma", query: "Roma", label: "punto di partenza", fun: "Il viaggio con più latitudine da guadagnare di tutti — si punta dritti verso il Mare del Nord." },
        { nome: "Norimberga", query: "Norimberga centro storico", label: "tappa di passaggio verso il nord Europa", fun: "Una sosta già vista da altri itinerari della lista — segno che è un crocevia quasi obbligato verso il nord." },
        { nome: "Amburgo", query: "Amburgo porto", label: "il porto e i magazzini della Speicherstadt, patrimonio UNESCO", fun: "Il quartiere dei magazzini in mattoni rossi sembra scolpito apposta per le foto — ed è tutto vero, non scenografia." },
        { nome: "Ponte di Øresund", query: "Øresund Bridge", label: "il ponte-tunnel che collega Danimarca e Svezia sul mare", fun: "A metà attraversamento diventa tunnel sott'acqua: un capolavoro di ingegneria che sembra uscito da un film di fantascienza." },
        { nome: "Copenaghen", query: "Nyhavn Copenaghen", label: "le case colorate di Nyhavn e le biciclette ovunque", fun: "A Copenaghen le biciclette hanno letteralmente la precedenza su tutto — la moto, per una volta, si adegua rispettosa." },
        { nome: "Monaco di Baviera", query: "Monaco di Baviera centro", label: "sosta di ritorno prima dell'ultimo tratto verso l'Italia", fun: "Una birra bavarese come premio di metà rientro, prima delle ultime ore che riportano dritti a casa." },
        { nome: "Roma", query: "Roma", label: "ritorno", fun: "Il viaggio che porta più a nord di tutti si chiude, come sempre, tra il traffico romano — un rientro alla realtà in tutti i sensi." }
      ]
    }
  ];

  // Slug stabile e leggibile per l'URL di ogni viaggio (es. /viaggi/il-classico-dei-due-laghi),
  // ricavato dal titolo: non serve un campo a parte da tenere aggiornato a mano.
  function slugify(text) {
    return String(text)
      // lettere non scomponibili con NFD (\u00d8, \u00c6, ecc.) vanno sostituite a mano,
      // altrimenti finiscono silenziosamente eliminate dallo slug
      .replace(/[\u00f8\u00d8]/g, "o").replace(/[\u00e6\u00c6]/g, "ae").replace(/[\u0153\u0152]/g, "oe")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getSlug(item) {
    return slugify(item.titolo);
  }

  // tipo ("itinerario" | "miniviaggio" | "ricordare") + slug -> voce, per
  // trovare rapidamente un viaggio dato lo slug nell'URL
  function findBySlug(slug) {
    const all = [
      ...ITINERARI.map(it => ({ tipo: "itinerario", it })),
      ...MINIVIAGGI.map(it => ({ tipo: "miniviaggio", it })),
      ...VIAGGI_RICORDARE.map(it => ({ tipo: "ricordare", it })),
    ];
    return all.find(entry => getSlug(entry.it) === slug) || null;
  }

  return { ITINERARI, MINIVIAGGI, VIAGGI_RICORDARE, ULTIMO_AGGIORNAMENTO_DATI, slugify, getSlug, findBySlug };
});
