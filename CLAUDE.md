# Il Motonauta — sito web

Sito personale di un content creator motociclistico (Angelo, "Il Motonauta").
Sito statico (HTML/CSS/JS puro, nessun framework) ospitato su **Vercel**,
con alcune funzioni serverless per le parti dinamiche.

## Stack tecnico

- **Frontend**: HTML/CSS/JS puro, nessun framework, nessun build step
- **Hosting**: Vercel (deploy automatico ad ogni push su GitHub, branch `main`)
- **Foto/video galleria**: Cloudinary (cloud name: `whqpxxz1`), upload preset non firmato `Motonauta_Gallery`
- **Database**: Redis via `REDIS_URL` (fornito da un'integrazione Vercel/Upstash), libreria `redis` (npm), connessione gestita in `lib/redis.js`
- **Mappa viaggi**: Leaflet.js + tile CartoDB dark, geocoding automatico via Nominatim (OpenStreetMap)
- **Analytics**: Google Analytics (ID `G-546ZL2T52G`), caricato **solo dopo consenso cookie** (vedi `cookie-consent.js`)
- **Widget social**: Mirror App (iframe) per feed TikTok/Instagram in home

## Struttura del sito

- `index.html` — home (hero con foto + parallasse leggero, sezione Itinerari, sezione Miniviaggi e sezione Viaggi da ricordare con caroselli e calcolatore benzina condiviso, widget social, box "suggerisci un'idea", sezioni varie). I dati dei tre caroselli (`ITINERARI`, `MINIVIAGGI`, `VIAGGI_RICORDARE`) **non sono più inline**: vivono in `data/viaggi-data.js` (vedi sotto)
- `data/viaggi-data.js` — dati condivisi di Itinerari/Miniviaggi/Viaggi da ricordare, in un unico file caricato sia da `index.html` (via `<script src="data/viaggi-data.js">`, popola `window.VIAGGI_DATA`) sia da `api/viaggio.js` (via `require`), così i caroselli e le pagine singole restano sempre allineati. Espone anche `getSlug(it)` (slug stabile ricavato dal titolo) e `findBySlug(slug)`. **Per aggiungere un nuovo itinerario/miniviaggio/viaggio da ricordare, modifica solo questo file** — non serve più toccare `index.html`
- ogni voce di `data/viaggi-data.js` ha anche una pagina dedicata su URL pulito `/viaggi/<slug>` (rewrite in `vercel.json` verso `api/viaggio.js`), con titolo/meta description/Open Graph corretti per la SEO — link "Pagina completa di questo viaggio" nel dettaglio di ogni card in home
- `nostromo.html` — **Nostromo**, gli assistenti di viaggio: Assistente di viaggio (meteo lungo il percorso, tappe intermedie, calcolo pedaggio/carburante), Assistente di valigia (lista bagagli in base a destinazione/giorni/meteo previsto) e Assistente di rotta (percorso multi-tappa con link diretti a Maps/Waze). Ogni pagina `/viaggi/<slug>` ha un box "Fatti aiutare dal Nostromo" con 3 pulsanti che aprono `nostromo.html?tool=viaggio|valigia|rotta&...` — Nostromo legge quei parametri al caricamento e precompila i campi dell'assistente giusto (vedi il blocco `initFromViaggioLink` in fondo allo script)
- `manuale.html` — **Manuale di bordo**, l'elenco delle guide/articoli (equipaggiamento, manutenzione, consigli pratici). I dati (`GUIDE`) vivono in `data/manuale-data.js`, stesso schema di `data/viaggi-data.js`. Ogni guida ha anche una pagina dedicata su URL pulito `/manuale/<slug>` (rewrite in `vercel.json` verso `api/manuale.js`). **Per aggiungere una nuova guida, modifica solo `data/manuale-data.js`**
- `sponsor.html` — partner/sponsor con loghi cliccabili
- `moto.html` — pagina dedicata alla moto (BMW S1000XR), statistiche, galleria dedicata
- `galleria.html` — galleria foto/video **caricata dinamicamente da Cloudinary** (nessuna foto scritta a mano nell'HTML) + mappa interattiva dei viaggi
- `contatti.html` — social e recapiti
- `privacy.html` — informativa privacy/cookie
- `admin.html` — **area riservata** (protetta da password), per caricare foto/video, gestire idee ricevute, aggiornare i km della moto
- `style.css` — foglio di stile condiviso da tutte le pagine
- `script.js` — JS condiviso (menu mobile, lightbox galleria, transizione tra pagine, parallasse)
- `cookie-consent.js` — banner cookie + caricamento condizionato di Analytics
- `api/*.js` — funzioni serverless Vercel (vedi sotto)
- `lib/redis.js` — connessione condivisa a Redis
- `vercel.json` — configurazione Vercel: i rewrite di `/viaggi/:slug` verso `api/viaggio.js` e di `/manuale/:slug` verso `api/manuale.js`

## Funzioni serverless (`api/`)

Il piano Vercel Hobby permette **massimo 12 funzioni serverless**. Per restare
ben sotto il limite, ogni file multiplexa più azioni tramite il parametro
`?action=` (stesso schema per tutti), invece di avere un file per azione.
Attualmente sono **7 file**:

| File | Azioni (`?action=`) | Cosa fa |
|---|---|---|
| `gallery.js` | `list` (default), `list-admin`, `pins`, `delete-photo`, `delete-album`, `sign-upload`, `create-pin` | Tutto ciò che riguarda foto/video/album su Cloudinary e i pin sulla mappa: elenco pubblico per la galleria, elenco per l'area riservata, eliminazione foto/album (**e il pin mappa corrispondente** quando si elimina un album), firma per l'upload firmato, geocodifica di un nuovo album e salvataggio del pin. Gli album elencati in `HIDDEN_FROM_PUBLIC_GALLERY` (es. "manuale di bordo", usato come deposito foto per gli articoli) restano visibili nell'area riservata ma **non** compaiono nella Galleria pubblica |
| `ideas.js` | (GET = elenco, POST = invio, DELETE = cancellazione) | Riceve un'idea video dal box in home (blocca l'IP mittente per 24h, anti-spam), elenca le idee ricevute e le elimina (area riservata) |
| `km.js` | (GET = lettura, POST = scrittura) | Restituisce i km attuali della moto (pubblico) e li aggiorna (area riservata) |
| `auth.js` | `login`, `logout`, `check` | Login area riservata (password a confronto a tempo costante, token di sessione su Redis), logout, verifica sessione |
| `route-planner.js` | `search`, `reverse`, `route`, `fuel-near` | Proxy server-side per Nominatim (ricerca/geocodifica), OSRM/Valhalla (calcolo percorso) e Overpass (ricerca distributori), usato da Nostromo |
| `viaggio.js` | `?slug=<slug>` | Genera la pagina HTML dedicata di un singolo itinerario/miniviaggio/viaggio da ricordare (letto da `data/viaggi-data.js`), con meta tag SEO/Open Graph corretti; raggiungibile su URL pulito `/viaggi/<slug>` grazie al rewrite in `vercel.json` |
| `manuale.js` | `?slug=<slug>` | Genera la pagina HTML dedicata di una guida del Manuale di bordo (letta da `data/manuale-data.js`); raggiungibile su URL pulito `/manuale/<slug>` grazie al rewrite in `vercel.json` |

**Importante — autenticazione area riservata**: `admin.html` **non contiene più la password**. Il login è gestito da `api/auth.js?action=login`, che verifica la password admin a confronto a tempo costante e, se corretta, crea un token casuale salvato su Redis (`admin_session:<token>`, scadenza 7 giorni) e lo manda al browser come cookie httpOnly/Secure/SameSite=Strict. Tutte le funzioni "scrittura" (cancellazioni, `create-pin`, `sign-upload`, salvataggio km, elenco/cancellazione idee) verificano quella sessione tramite `lib/auth.js` (`isAuthenticated(req)`), non più una password passata nel corpo della richiesta. `api/auth.js?action=logout` invalida la sessione sia lato cookie che su Redis. Se aggiungi una nuova funzione che scrive dati, proteggila allo stesso modo con `isAuthenticated(req)`, non reintrodurre il controllo diretto della password.

**Se aggiungi una nuova funzione**: prima controlla se può diventare un'azione (`?action=...`) di un file già esistente invece di crearne uno nuovo — resta più margine sotto il tetto delle 12 funzioni.

## Variabili d'ambiente su Vercel

`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `ADMIN_PASSWORD`, `REDIS_URL`. Tutte già configurate — non serve ricrearle, solo eventualmente aggiungerne di nuove se si aggiungono funzionalità.

## Design system

Palette in `:root` di `style.css` — tema scuro "adventure/on-the-road":
`--asphalt` (#1B1A17, sfondo), `--asphalt-2` (card/sezioni alternate), `--rust` (#C1502E, accento CTA),
`--gold` (#D9A441, accento principale/link), `--sand` (titoli), `--cream`/`--cream-dim` (testo), `--steel`, `--forest-green`, `--concrete`.
Font: Oswald (titoli), Work Sans (corpo), JetBrains Mono (etichette/coordinate/numeri, stile "cruscotto").
Stile grafico ricorrente: eyebrow `.marker` con trattino dorato, card con bordo sottile `rgba(245,240,230,0.14)`, griglie `.grid-flat-3`/`.grid-cards-3`/`.feature-grid` responsive già pronte da riusare.

## Cose da sapere / non rompere

- La galleria è **completamente dinamica**: aggiungere foto = caricarle dall'area riservata, NON modificare `galleria.html` a mano
- I pin mappa si creano/eliminano **in automatico** insieme agli album — non serve editare coordinate a mano (a meno che la geocodifica fallisca)
- `admin.html` non ha e non deve avere il tag Google Analytics (resta privato/non tracciato)
- Le immagini Cloudinary vanno sempre con `f_auto,q_auto` nell'URL per l'ottimizzazione automatica
- Il sito è in italiano; mantenere questo tono/lingua in ogni nuovo contenuto
- Rispettare sempre `prefers-reduced-motion` per animazioni nuove (pattern già usato in `script.js`)
