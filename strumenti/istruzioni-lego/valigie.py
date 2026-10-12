# Tavole "a mattoncini" per la guida sulle valigie a norma (art. 170 CdS):
# moto vista da dietro, larghezze in scala vera (U px per cm), altezze
# schematiche. Uso: python3 valigie.py OUT
import os, sys
from lego import *
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
U = 4                 # px per centimetro, in orizzontale
V = 3.7               # px per centimetro, in verticale
GROUND = 690

def txt(x, y, s, size=30, color=K, anchor='middle'):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" fill="{color}" {FONT}>{s}</text>'

def case(x0, x1, y0, y1):
    """valigia rigida nera con coperchio grigio e serratura"""
    w = x1 - x0
    return (f'<rect x="{x0}" y="{y0}" width="{w}" height="{y1-y0}" rx="10" fill="#2b3238" stroke="{K}" stroke-width="3.5"/>'
            f'<rect x="{x0}" y="{y0}" width="{w}" height="26" rx="8" fill="{LBG}" stroke="{K}" stroke-width="3.5"/>'
            f'<rect x="{x0 + w/2 - 9:.1f}" y="{y0 + 44}" width="18" height="22" rx="3" fill="{LBG}" stroke="{K}" stroke-width="3"/>'
            f'<rect x="{x0}" y="{y0}" width="{w}" height="{y1-y0}" rx="10" fill="url(#cyl)" opacity=".5"/>')

def moto(cx, valigie=None, bauletto=False, borsone=False):
    """BMW S1000XR vista da dietro, sulle forme della moto vera: cupolino,
    manubrio con paramani e specchietti, fianchi rossi, codino rosso con il
    fanale, indicatori, portatarga, gomma stretta e alta, scarico a destra.
    valigie = (dentro, fuori) in cm dal centro"""
    X = lambda cm: cx + cm*U
    Y = lambda h: GROUND - h*V
    def sym(fn):          # disegna una forma su entrambi i lati
        return fn(-1) + fn(1)
    def poly(pts, fill, sw=3.5):
        d = ' '.join(f'{X(a):.1f},{Y(b):.1f}' for a, b in pts)
        return f'<polygon points="{d}" fill="{fill}" stroke="{K}" stroke-width="{sw}" stroke-linejoin="round"/>'
    def rrect(x0, x1, h0, h1, fill, r=6, sw=3.5):
        return (f'<rect x="{X(min(x0, x1)):.1f}" y="{Y(max(h0, h1)):.1f}" width="{abs(x1-x0)*U:.1f}" '
                f'height="{abs(h1-h0)*V:.1f}" rx="{r}" fill="{fill}" stroke="{K}" stroke-width="{sw}"/>')
    g = []
    # davanti (il più lontano): cupolino, manubrio, paramani, specchietti
    g.append(poly([(-17, 112), (17, 112), (13, 142), (-13, 142)], TLB))
    g.append(f'<path d="M{X(-13)+8:.1f} {Y(138):.1f} L{X(-6):.1f} {Y(116):.1f}" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>')
    g.append(f'<path d="M{X(-34):.1f} {Y(118):.1f} L{X(34):.1f} {Y(118):.1f}" stroke="{K}" stroke-width="9" stroke-linecap="round"/>')
    g.append(sym(lambda k: f'<path d="M{X(k*29):.1f} {Y(121):.1f} L{X(k*40):.1f} {Y(133):.1f}" stroke="{K}" stroke-width="6" stroke-linecap="round"/>'))
    g.append(sym(lambda k: f'<ellipse cx="{X(k*42):.1f}" cy="{Y(134):.1f}" rx="{7*U}" ry="{4*V}" fill="{K}"/>'))
    g.append(sym(lambda k: poly([(k*30, 112), (k*39, 113), (k*40, 124), (k*31, 125)], K, 3)))
    # fianchi rossi della carena e serbatoio grigio
    g.append(poly([(-11, 116), (11, 116), (13, 100), (-13, 100)], LBG))
    g.append(sym(lambda k: poly([(k*10, 114), (k*23, 110), (k*26, 97), (k*17, 86), (k*10, 90)], RED)))
    # pedane, forcellone, scarico a destra
    g.append(sym(lambda k: rrect(k*15, k*25, 37, 41, LBG, 3, 3)))
    g.append(rrect(-15, 15, 44, 60, DBG, 8))
    g.append(rrect(10, 27, 26, 58, '#2b3238', 10))
    g.append(f'<ellipse cx="{X(18.5):.1f}" cy="{Y(36):.1f}" rx="{6*U}" ry="{5*V}" fill="{LBG}" stroke="{K}" stroke-width="3.5"/>')
    g.append(f'<ellipse cx="{X(18.5):.1f}" cy="{Y(36):.1f}" rx="{3.2*U}" ry="{2.6*V}" fill="{K}"/>')
    # gomma posteriore, stretta e alta
    g.append(f'<rect x="{X(-9.5):.1f}" y="{Y(64):.1f}" width="{19*U}" height="{64*V}" rx="{9*U}" fill="url(#tyre)" stroke="{K}" stroke-width="4"/>')
    g.append(''.join(f'<path d="M{X(dx):.1f} {Y(56):.1f} L{X(dx):.1f} {Y(8):.1f}" stroke="#2b3238" stroke-width="5" stroke-linecap="round"/>' for dx in (-5, 0, 5)))
    # codino rosso con sella del passeggero, fanale a V e indicatori
    g.append(rrect(-16, 16, 95, 103, K, 8))
    g.append(poly([(-10, 78), (10, 78), (14, 96), (-14, 96)], RED))
    g.append(f'<path d="M{X(-7):.1f} {Y(91):.1f} L{X(0):.1f} {Y(84):.1f} L{X(7):.1f} {Y(91):.1f}" fill="none" stroke="{K}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>')
    g.append(f'<path d="M{X(-7):.1f} {Y(91):.1f} L{X(0):.1f} {Y(84):.1f} L{X(7):.1f} {Y(91):.1f}" fill="none" stroke="#ff5a4a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>')
    # portatarga con targa bianca (senza numeri) e indicatori sui lati
    g.append(rrect(-4, 4, 66, 78, K, 2, 2))
    g.append(sym(lambda k: f'<path d="M{X(k*4):.1f} {Y(73):.1f} L{X(k*13):.1f} {Y(73):.1f}" stroke="{K}" stroke-width="5" stroke-linecap="round"/>'))
    g.append(sym(lambda k: rrect(k*12, k*17, 71, 75, ORA, 3, 3)))
    g.append(rrect(-9, 9, 56, 68, '#fff', 3, 3))
    if valigie:
        dentro, fuori = valigie
        for k in (-1, 1):   # telaietti
            for h in (58, 84):
                d = f'M{X(k*12):.1f} {Y(h):.1f} L{X(k*dentro):.1f} {Y(h):.1f}'
                g.append(f'<path d="{d}" stroke="{K}" stroke-width="12" stroke-linecap="round"/><path d="{d}" stroke="{DBG}" stroke-width="6" stroke-linecap="round"/>')
        g.append(case(X(-fuori), X(-dentro), Y(96), Y(46)))
        g.append(case(X(dentro), X(fuori), Y(96), Y(46)))
    if bauletto:
        g.append(rrect(-22, 22, 101, 134, '#2b3238', 14))
        g.append(rrect(-22, 22, 126, 134, LBG, 12))
        g.append(rrect(-3.5, 3.5, 112, 118, LBG, 3, 3))
    if borsone:
        # borsone impermeabile a rotolo legato di traverso sulla sella
        g.append(f'<rect x="{X(-25):.1f}" y="{Y(132):.1f}" width="{50*U}" height="{30*V:.1f}" rx="44" fill="{YEL}" stroke="{K}" stroke-width="4"/>')
        g.append(sym(lambda k: f'<path d="M{X(k*25):.1f} {Y(117):.1f} L{X(k*30):.1f} {Y(117):.1f}" stroke="{K}" stroke-width="10" stroke-linecap="round"/>'))
        g.append(sym(lambda k: f'<path d="M{X(k*29.5):.1f} {Y(122):.1f} L{X(k*29.5):.1f} {Y(112):.1f}" stroke="{K}" stroke-width="6" stroke-linecap="round"/>'))
        g.append(sym(lambda k: f'<rect x="{X(k*12)-9:.1f}" y="{Y(133):.1f}" width="18" height="{32*V:.1f}" rx="3" fill="{ORA}" stroke="{K}" stroke-width="3"/>'))
        g.append(f'<rect x="{X(-25):.1f}" y="{Y(132):.1f}" width="{50*U}" height="{30*V:.1f}" rx="44" fill="url(#cyl)" opacity=".45"/>')
    return ''.join(g)

def asse(cx, y0=130, y1=GROUND+10):
    return f'<path d="M{cx} {y0} L{cx} {y1}" stroke="{BLU}" stroke-width="4" stroke-dasharray="14 10"/>'

def limite(x, y0=130, y1=GROUND+10):
    return f'<path d="M{x} {y0} L{x} {y1}" stroke="{RED}" stroke-width="5" stroke-dasharray="16 10"/>'

def quota(x0, x1, y, label, color, text_color=K):
    """freccia di quota a due punte con l'etichetta sopra"""
    a = arrow(x0 + (x1-x0)/2, y, x1, y, color, 10) + arrow(x0 + (x1-x0)/2, y, x0, y, color, 10)
    return a + txt((x0+x1)/2, y - 18, label, 30, text_color)

def suolo(x0, x1):
    return f'<path d="M{x0} {GROUND+2} L{x1} {GROUND+2}" stroke="{K}" stroke-width="5" stroke-linecap="round"/>'

W, H = 1200, 790
P = {}

# 1 — i limiti: 50 cm per lato dal centro. Le mie a 47 (ok), quelle col
#     telaio che sporge oltre (no)
L, R = 300, 900
body = f'<path d="M600 40 L600 {H-40}" stroke="#c9d6e2" stroke-width="3"/>'
for cx in (L, R):
    body += suolo(cx-270, cx+270) + limite(cx-50*U) + limite(cx+50*U) + asse(cx)
    body += quota(cx, cx+50*U, 100, '50 cm', YEL)
body += moto(L, valigie=(22, 47), bauletto=True)
body += quota(L, L+47*U, GROUND+62, '47 cm', GREEN)
body += badge(L+47*U+2, GROUND-96*V-34, True)
body += moto(R, valigie=(34, 58), bauletto=True)
body += f'<rect x="{R+50*U}" y="{GROUND-96*V:.1f}" width="{8*U}" height="{50*V:.1f}" fill="{RED}" opacity=".28"/>'
body += quota(R, R+58*U, GROUND+62, '&gt; 50 cm', RED)
body += badge(R+58*U-6, GROUND-96*V-34, False)
P['limiti'] = page(W, H, body)

# 2 — valigie laterali (peso ai lati, la moto dondola) contro borsone sulla
#     sella (peso al centro)
body = f'<path d="M600 40 L600 {H-40}" stroke="#c9d6e2" stroke-width="3"/>'
body += suolo(L-270, L+270) + suolo(R-270, R+270)
body += moto(L, valigie=(22, 47))
for sgn in (-1, 1):
    x = L + sgn*34.5*U
    body += arrow(x, GROUND-90*V, x, GROUND-54*V, YEL, 14)
# la moto dondola: due frecce ad arco che scendono verso l'esterno (una e
# la sua copia specchiata)
dondola = rot_arrow(L, GROUND, 590, 276, 288)
body += dondola + f'<g transform="translate({2*L} 0) scale(-1 1)">{dondola}</g>'
body += txt(L, GROUND+62, '2 × 30 L', 36)
body += moto(R, borsone=True)
body += arrow(R, GROUND-129*V, R, GROUND-105*V, YEL, 14)
body += badge(R+175, GROUND-80*V, True)
body += txt(R, GROUND+62, '60 L', 36)
P['peso'] = page(W, H, body)

for n, v in P.items():
    open(os.path.join(OUT, n + '.svg'), 'w').write(v)
print('ok', list(P))
