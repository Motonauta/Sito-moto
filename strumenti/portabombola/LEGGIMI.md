# Portabombola gas (stampa 3D)

Bicchiere per bombola Ø123 × h123 mm con barra girevole che la blocca dall'alto.
Misure e tolleranze in cima a `genera.py` (`python3 genera.py` rigenera gli STL; serve `pip install trimesh manifold3d`).

- `portabombola_base.stl` — bicchiere + due montanti (cerniera e gancio). Stampare in piedi.
- `portabombola_barra.stl` — barra di blocco. Stampare piatta.
- Ferramenta: 1 vite M4×20, 1 dado M4 (si infila dal lato interno, nel canale), 1 rondella. Serrare senza stringere: la barra deve girare.
- Uso: ruota la barra sopra la bombola e spingila sotto la tettoia del montante opposto (scatta sul dentino); per togliere, falla ruotare via.
- Materiale consigliato: PETG, pareti 4 perimetri, infill 25%.
