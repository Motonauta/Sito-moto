# Portabombola gas (stampa 3D, senza viti)

Bicchiere per bombola Ø123 × h123 mm con barra girevole che la blocca dall'alto.
Misure e tolleranze in cima a `genera.py` (`python3 genera.py` rigenera gli STL; serve `pip install trimesh manifold3d`).

- `portabombola_base.stl` — bicchiere + due montanti (cerniera e gancio). Stampare in piedi.
- `portabombola_barra.stl` — barra di blocco, già girata per la stampa (perno in su, niente supporti). Ha il perno a scatto stampato insieme.
- Montaggio: premi il perno della barra nel foro del montante con la cerniera, finché scatta (la testa si aggancia nella camera interna). Poi nessuna ferramenta.
- Uso: ruota la barra sopra la bombola e spingila sotto la tettoia del montante opposto (scatta sul dentino); per togliere, falla ruotare via.
- Materiale consigliato: PETG, 4 perimetri, infill 25%. Il perno è l'unico punto delicato: stampa la barra con strati 0,16 mm.
