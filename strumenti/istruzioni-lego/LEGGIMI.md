# Istruzioni "a mattoncini" (tavole e cartone animato)

Strumenti usati per le illustrazioni della guida "Non facciamoci fregare:
pulire la catena della moto alla perfezione con pochi euro"
(`img/manuale/catena/`). Non fanno parte del sito: servono
solo a rigenerare tavole e video, o a farne di nuovi per altre guide.

- `lego.py` — primitive condivise: tavolozza dei colori LEGO, ruota con
  corona e catena (`scene`, con sporco/lucentezza/rotazione), attrezzi
  (latta, pennello, spazzola per catena, pistola dell'aria, panno, orologio,
  bomboletta), riquadro dei pezzi `callout`, numero del passaggio, frecce
- `plates.py OUT` — scrive le tavole SVG (`passo-1..6`, `accortezze`,
  `copertina`)
- `video.py OUT` — scrive i fotogrammi SVG del cartone (30 fps)
- `render.js` — trasforma i fotogrammi in PNG con Chromium (Playwright);
  poi si monta il video con ffmpeg:

```
python3 video.py frames
node render.js            # legge frames/, scrive png/
ffmpeg -framerate 30 -i png/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 27 -preset slow -tune animation -movflags +faststart pulizia-catena.mp4
ffmpeg -framerate 30 -i png/f%04d.png -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 pulizia-catena.webm
```

Sempre entrambi i formati: alcuni browser (es. Chromium senza codec
proprietari) non leggono l'MP4 H.264, Safari preferisce l'MP4.
La copertina va anche in JPG 1600×900 (serve come anteprima nei social).
La guida della catena oggi usa invece come copertina `copertina-video.jpg`:
fotogramma del video di Angelo con il titolo scritto sopra.
