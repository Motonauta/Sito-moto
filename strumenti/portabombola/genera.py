"""Portabombola gas con barra di blocco girevole (stampa 3D). Misure in mm.
Uso: python3 genera.py  -> crea portabombola_base.stl e portabombola_barra.stl"""
import numpy as np, trimesh
from trimesh.transformations import translation_matrix as T

# --- misure bombola (modifica qui) ---
D, H = 123.0, 123.0      # diametro e altezza bombola
GIOCO = 1.0              # gioco per lato sul diametro
PARETE, FONDO = 3.0, 3.0
SPESS_BARRA, LARG_BARRA = 4.0, 14.0
ALTEZZA_PARETE = 105.0   # altezza muretto del bicchiere (poi salgono solo i due montanti)

RI = D / 2 + GIOCO               # raggio interno
RE = RI + PARETE
Z_BARRA = FONDO + H              # il sotto della barra tocca la cima della bombola
PX = RI + 5.0                    # asse del perno / appoggio del gancio
def box(x0,x1,y0,y1,z0,z1):
    return trimesh.creation.box(extents=[x1-x0,y1-y0,z1-z0], transform=T([(x0+x1)/2,(y0+y1)/2,(z0+z1)/2]))
def cyl(r,h,x=0,y=0,z0=0,sec=96):
    return trimesh.creation.cylinder(radius=r,height=h,sections=sec,transform=T([x,y,z0+h/2]))
U = lambda *m: trimesh.boolean.union(list(m), engine='manifold')
S = lambda a,*m: trimesh.boolean.difference([a]+list(m), engine='manifold')

# --- base ---
cup = cyl(RE, FONDO+ALTEZZA_PARETE)
# montante cerniera (+X) e montante gancio (-X), alti fino al sotto della barra
mont_p = box(RI-4, PX+9, -9, 9, 0, Z_BARRA)
mont_g = box(-PX-9, -(RI-4), -9, 9, 0, Z_BARRA)
# tettoia del gancio: la barra ci scivola sotto da +Y; parete di fondo a -Y la ferma
tetto = box(-PX-9, -PX+9, -9, 9, Z_BARRA+SPESS_BARRA+0.6, Z_BARRA+SPESS_BARRA+0.6+3.5)
fondo_g = box(-PX-9, -PX+9, -12, -9, Z_BARRA, Z_BARRA+SPESS_BARRA+0.6+3.5)
body = U(cup, mont_p, mont_g, tetto, fondo_g)
# dentino di arresto sul piano del gancio
dent = trimesh.creation.icosphere(subdivisions=2, radius=0.9); dent.apply_translation([-PX, 2.0, Z_BARRA+0.2])
body = U(body, dent)
# cavita + foro perno M4 + tasca dado M4 (si infila da dentro, tenuta dalla bombola)
cavita = cyl(RI, 400, z0=FONDO)
foro = cyl(2.25, 8.0, x=PX, z0=Z_BARRA-8.0, sec=48)          # collo del perno
camera = cyl(3.2, 4.4, x=PX, z0=Z_BARRA-12.4, sec=48)         # dove si aggancia la testa del perno
body = S(body, cavita, foro, camera)
# i montanti hanno tagliato la cavita: ripristina il fondo
body.export('portabombola_base.stl')

# --- barra ---
L = 2*PX
barra = U(box(-PX, PX, -LARG_BARRA/2, LARG_BARRA/2, 0, SPESS_BARRA),
          cyl(LARG_BARRA/2, SPESS_BARRA, x=PX), cyl(LARG_BARRA/2, SPESS_BARRA, x=-PX))
# perno a scatto: gambo + testa con spalla, tagliato da una fessura per farlo flettere
gambo = cyl(1.95, 8.0, x=PX, z0=-8.0, sec=48)
testa = trimesh.creation.revolve(np.array([[0,0],[1.7,0],[2.7,1.6],[2.7,2.2],[1.95,2.2],[0,2.2]]), sections=48)
testa.apply_transform(T([PX,0,-11.6]))
barra = U(barra, gambo, testa)
barra = S(barra, box(PX-4, PX+4, -0.6, 0.6, -12, -3))
barra.apply_transform(trimesh.transformations.rotation_matrix(np.pi, [1,0,0]))  # orientamento di stampa: perno in su
barra.apply_translation([0,0,-barra.bounds[0][2]])
barra.export('portabombola_barra.stl')
for m,n in ((body,'base'),(barra,'barra')):
    print(n, m.is_watertight, np.round(m.bounds,1).tolist())
