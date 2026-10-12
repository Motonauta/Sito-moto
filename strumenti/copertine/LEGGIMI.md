# Copertine delle guide (Manuale di bordo)

Tutte le copertine delle guide hanno lo stesso stile, voluto da Angelo:
fondo asfalto con le curve di livello, a sinistra "Manuale di bordo ·
categoria", il titolo grande in Oswald con l'ultima riga in rosso, un
sottotitolo, tre etichette in stile cruscotto e, a destra, la foto che sfuma
nel fondo. 1600×900 JPG, usata anche come anteprima nei social.

- `copertine.json` — una voce per guida: `out` (dove salvarla, dalla radice
  del sito), `foto` (URL Cloudinary in alta risoluzione o file del sito),
  `pos` (inquadratura, come `background-position`: es. `"center 40%"`),
  `categoria`, `titolo` (righe; quella tra asterischi è rossa), `sotto`,
  `etichette` (le parole tra asterischi diventano rosse)
- `render.js` — le disegna con Chromium (Playwright). Il titolo si
  rimpicciolisce da solo se una riga è troppo lunga
- `font/` — Oswald, JetBrains Mono, Work Sans (licenza OFL)

```
node strumenti/copertine/render.js strumenti/copertine/copertine.json          # tutte
node strumenti/copertine/render.js strumenti/copertine/copertine.json casco    # solo una
```

Poi in `data/manuale-data.js` la guida punta a `copertina: "/img/manuale/…/copertina.jpg"`.

Per la foto: Angelo vuole un momento del lavoro (la catena, la mano, la
valigia misurata), non la sua faccia. Dai reel Instagram si estrae il
fotogramma con ffmpeg (vedi CLAUDE.md), ritagliando sopra i sottotitoli
impressi. Le copertine della catena e delle valigie sono state fatte così,
a mano, prima di questo generatore.
