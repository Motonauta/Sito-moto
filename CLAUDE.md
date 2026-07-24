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

- `index.html` — home (hero con foto + parallasse leggero, widget social, box "suggerisci un'idea", sezioni varie)
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

## Funzioni serverless (`api/`)

| File | Cosa fa |
|---|---|
| `gallery.js` | Elenca album e foto/video da Cloudinary per la galleria pubblica |
| `list-photos.js` | Elenca foto di un album per l'area riservata (gestione/cancellazione) |
| `delete-photo.js` | Elimina una singola foto/video da Cloudinary |
| `delete-album.js` | Elimina un intero album da Cloudinary **e il pin mappa corrispondente** |
| `sitemap.js` | Genera la sitemap XML dinamica (pagine + foto) |
| `submit-idea.js` | Riceve un'idea video dal box in home, blocca l'IP mittente per 24h (anti-spam) |
| `list-ideas.js` | Elenca le idee ricevute (area riservata, richiede password) |
| `delete-idea.js` | Elimina un'idea (area riservata) |
| `get-km.js` | Restituisce i km attuali della moto (pubblico) |
| `set-km.js` | Aggiorna i km attuali (area riservata) |
| `create-pin.js` | Geocodifica il nome di un nuovo album e salva il pin sulla mappa (chiamato da admin.html dopo un nuovo album) |
| `map-pins.js` | Restituisce tutti i pin salvati per la mappa |

**Importante**: tutte le funzioni "scrittura" (`delete-*`, `set-km`, `create-pin`, `list-ideas`) controllano `password === process.env.ADMIN_PASSWORD`. La password reale è **`Olandese.10004cyl`** — deve essere identica sia nella variabile d'ambiente Vercel `ADMIN_PASSWORD`, sia nella costante `ADMIN_PASSWORD` scritta in chiaro in cima allo script di `admin.html` (usata per il controllo lato client all'accesso). **Se modifichi `admin.html`, non resettare questa password al placeholder — deve restare quella reale.**

## Variabili d'ambiente su Vercel

`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `ADMIN_PASSWORD`, `REDIS_URL`. Tutte già configurate — non serve ricrearle, solo eventualmente aggiungerne di nuove se si aggiungono funzionalità.

## Design system

Palette in `:root` di `style.css` — tema scuro "adventure/on-the-road":
`--asphalt` (#1B1A17, sfondo), `--asphalt-2` (card/sezioni alternate), `--rust` (#C1502E, accento CTA),
`--gold` (#D9A441, accento principale/link), `--sand` (titoli), `--cream`/`--cream-dim` (testo), `--steel`, `--forest-green`, `--concrete`.
Font: Oswald (titoli), Work Sans (corpo), Space Mono (etichette/coordinate/numeri, stile "cruscotto").
Stile grafico ricorrente: eyebrow `.marker` con trattino dorato, card con bordo sottile `rgba(245,240,230,0.14)`, griglie `.grid-flat-3`/`.grid-cards-3`/`.feature-grid` responsive già pronte da riusare.

## Cose da sapere / non rompere

- La galleria è **completamente dinamica**: aggiungere foto = caricarle dall'area riservata, NON modificare `galleria.html` a mano
- I pin mappa si creano/eliminano **in automatico** insieme agli album — non serve editare coordinate a mano (a meno che la geocodifica fallisca)
- `admin.html` non ha e non deve avere il tag Google Analytics (resta privato/non tracciato)
- Le immagini Cloudinary vanno sempre con `f_auto,q_auto` nell'URL per l'ottimizzazione automatica
- Il sito è in italiano; mantenere questo tono/lingua in ogni nuovo contenuto
- Rispettare sempre `prefers-reduced-motion` per animazioni nuove (pattern già usato in `script.js`)
