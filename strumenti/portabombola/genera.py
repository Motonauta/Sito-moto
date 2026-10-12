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
foro = cyl(2.25, 60, x=PX, z0=Z_BARRA-50, sec=48)
dado = trimesh.creation.cylinder(radius=7.6/2*1.0, height=3.5, sections=6, transform=T([PX,0,Z_BARRA-8]))
canale = box(RI-1, PX, -3.7, 3.7, Z_BARRA-9.75, Z_BARRA-6.25)
body = S(body, cavita, foro, dado, canale)
# i montanti hanno tagliato la cavita: ripristina il fondo
body.export('portabombola_base.stl')

# --- barra ---
L = 2*PX
barra = U(box(-PX, PX, -LARG_BARRA/2, LARG_BARRA/2, 0, SPESS_BARRA),
          cyl(LARG_BARRA/2, SPESS_BARRA, x=PX), cyl(LARG_BARRA/2, SPESS_BARRA, x=-PX))
barra = U(barra, box(-PX+10, -PX+22, -LARG_BARRA/2, LARG_BARRA/2, SPESS_BARRA, SPESS_BARRA+4))  # presa
barra = S(barra, cyl(2.3, 20, x=PX, z0=-5, sec=48))
barra.export('portabombola_barra.stl')
for m,n in ((body,'base'),(barra,'barra')):
    print(n, m.is_watertight, np.round(m.bounds,1).tolist())
