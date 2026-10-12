# Tavole e cartone "a mattoncini" del tagliando olio e filtro della
# S1000XR (2020-2021): motore visto dal lato destro (davanti = a destra),
# con coppa, tappo di scarico, filtro vicino ai collettori, coperchio
# frizione con tappo di riempimento e oblò del livello, pannello basso.
#   python3 tagliando.py tavole OUT     -> kit.svg, passo-1..9.svg
#   python3 tagliando.py video OUT      -> fotogrammi SVG 1280x720, 30 fps
import math, os, sys
from lego import *

OLD = '#3b2410'          # olio vecchio, scuro
NEW = '#e0a526'          # olio nuovo, dorato
FOIL = '#d7dde2'
STEEL = '#b9bec3'

def txt(x, y, s, size=34, color=K, anchor='middle'):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" fill="{color}" {FONT}>{s}</text>'

# ---------------------------------------------------------------- attrezzi
def bottle(label='5W-40'):
    return (f'<path d="M-28 -40 L-28 52 Q-28 60 -20 60 L20 60 Q28 60 28 52 L28 -40 Q28 -52 14 -56 L10 -70 L-10 -70 L-14 -56 Q-28 -52 -28 -40 Z" fill="#fff" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>'
            f'<rect x="-12" y="-82" width="24" height="14" rx="3" fill="{BLU}" stroke="{K}" stroke-width="3"/>'
            f'<rect x="-28" y="-14" width="56" height="40" fill="{BLU}" stroke="{K}" stroke-width="3"/>'
            f'<text x="0" y="12" text-anchor="middle" font-size="15" fill="#fff" {FONT}>{label}</text>'
            f'<path d="M-28 -40 L-28 52 Q-28 60 -20 60 L20 60 Q28 60 28 52 L28 -40" fill="url(#cyl)" opacity=".5"/>')
def filtro(col=BLU):
    return (f'<rect x="-34" y="-46" width="68" height="88" rx="10" fill="{col}" stroke="{K}" stroke-width="3.5"/>'
            + ''.join(f'<path d="M{x} -38 L{x} 34" stroke="#00337a" stroke-width="3" stroke-linecap="round"/>' for x in (-22, -11, 0, 11, 22))
            + f'<rect x="-30" y="40" width="60" height="10" rx="3" fill="{K}"/>'
            f'<rect x="-34" y="-46" width="68" height="88" rx="10" fill="url(#cyl)" opacity=".6"/>')
def rondella():
    return f'<circle r="22" fill="{ORA}" stroke="{K}" stroke-width="3.5"/><circle r="10" fill="{BG}" stroke="{K}" stroke-width="3"/>'
def chiave_l(tip=''):
    """chiave a L (torx): T50 per il tappo, T25 per il pannello"""
    return (f'<path d="M-10 -70 L10 -70 L10 30 L60 30 L60 50 L-10 50 Z" fill="{LBG}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>'
            f'<rect x="-10" y="-70" width="20" height="120" fill="url(#cyl)" opacity=".5"/>'
            + (txt(30, 24, tip, 18) if tip else ''))
def tazza():
    """chiave a tazza per il filtro, con il cricchetto"""
    return (f'<rect x="-40" y="-14" width="80" height="44" rx="6" fill="{DBG}" stroke="{K}" stroke-width="3.5"/>'
            + ''.join(f'<path d="M{x} -10 L{x} 26" stroke="{K}" stroke-width="3"/>' for x in (-28, -14, 0, 14, 28))
            + f'<rect x="-9" y="-70" width="18" height="58" rx="6" fill="{RED}" stroke="{K}" stroke-width="3.5"/>'
            f'<rect x="-18" y="-84" width="36" height="20" rx="6" fill="{LBG}" stroke="{K}" stroke-width="3"/>')
def dinamometrica(nm=''):
    return (f'<rect x="-120" y="-10" width="200" height="20" rx="8" fill="{LBG}" stroke="{K}" stroke-width="3.5"/>'
            f'<rect x="20" y="-15" width="80" height="30" rx="10" fill="{YEL}" stroke="{K}" stroke-width="3.5"/>'
            f'<circle cx="-120" cy="0" r="20" fill="{DBG}" stroke="{K}" stroke-width="3.5"/>'
            f'<rect x="-60" y="-8" width="40" height="16" rx="3" fill="#fff" stroke="{K}" stroke-width="2.5"/>'
            + (f'<g transform="translate(0 -48)"><rect x="-56" y="-26" width="112" height="44" rx="10" fill="#fff" stroke="{K}" stroke-width="3.5"/>{txt(0, 8, nm, 28)}</g>' if nm else ''))
def imbuto():
    return (f'<path d="M-46 -40 L46 -40 L12 10 L8 50 L-8 50 L-12 10 Z" fill="{ORA}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>'
            f'<path d="M-46 -40 L46 -40" stroke="{K}" stroke-width="8" stroke-linecap="round"/>')
def bacinella():
    return f'<path d="M-90 -20 L90 -20 L74 22 L-74 22 Z" fill="{K}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/><path d="M-80 -14 L80 -14" stroke="#4d5258" stroke-width="4"/>'
def alluminio():
    return (f'<path d="M-60 -18 L-30 -24 L0 -16 L30 -26 L62 -16 L56 20 L24 14 L-6 24 L-36 16 L-62 22 Z" fill="{FOIL}" stroke="{K}" stroke-width="3" stroke-linejoin="round"/>'
            f'<path d="M-40 -10 L-20 6 M10 -12 L26 6 M40 -8 L44 10" stroke="#fff" stroke-width="3" stroke-linecap="round"/>')

KIT_T = [(lambda: bottle(), 1.0, '4x'), (filtro, 1.0, '1x'), (rondella, 1.2, '1x'), (lambda: chiave_l('T50'), .8, '1x'),
         (tazza, .9, '1x'), (lambda: dinamometrica(), .55, '1x'), (imbuto, .9, '1x'), (bacinella, .75, '1x'), (alluminio, 1.0, '1x')]

# ---------------------------------------------------------------- motore
def motore(ox=0, oy=0, s=1.0, pannello=0.0, tappo=1.0, scarico=1.0, flusso=0.0, flusso_col=OLD,
           filtro_st=1.0, filtro_col=BLU, foil=False, livello=.55, vasca=False, gocce_filtro=0.0, t=0.0):
    """pannello: 0 montato -> 1 tolto; tappo / scarico: 1 avvitato -> 0 tolto;
    filtro_st: 1 avvitato -> 0 fuori; livello: 0..1 nell'oblò"""
    g = []
    # telaio e forcellone (dietro)
    g.append(f'<path d="M150 150 L330 210 L360 330" fill="none" stroke="{K}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>')
    g.append(f'<path d="M150 150 L330 210 L360 330" fill="none" stroke="{DBG}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>')
    # cilindri inclinati in avanti e testa
    g.append(f'<path d="M420 300 L520 140 L700 170 L690 300 Z" fill="{LBG}" stroke="{K}" stroke-width="4" stroke-linejoin="round"/>')
    for i in range(4):
        y = 180 + i*28
        g.append(f'<path d="M{505-i*14} {y} L{690} {y+12}" stroke="{DBG}" stroke-width="5" stroke-linecap="round"/>')
    g.append(f'<path d="M515 140 L540 96 L726 126 L702 172 Z" fill="{K}" stroke="{K}" stroke-width="4" stroke-linejoin="round"/>')
    g.append(f'<path d="M548 108 L712 132" stroke="#4d5258" stroke-width="6" stroke-linecap="round"/>')
    # basamento e coppa
    g.append(f'<path d="M340 300 L770 300 L770 450 L340 450 Z" fill="{LBG}" stroke="{K}" stroke-width="4" stroke-linejoin="round"/>')
    g.append(f'<path d="M390 450 L730 450 L710 506 L410 506 Z" fill="{DBG}" stroke="{K}" stroke-width="4" stroke-linejoin="round"/>')
    for x in (430, 500, 570, 640, 690):
        g.append(f'<path d="M{x} 456 L{x+4} 500" stroke="#55585a" stroke-width="4"/>')
    # coperchio frizione, tappo di riempimento e oblò del livello
    g.append(f'<circle cx="470" cy="378" r="72" fill="#c4c8cb" stroke="{K}" stroke-width="4"/>')
    for i in range(8):
        a = 2*math.pi*i/8
        g.append(f'<circle cx="{470+62*math.cos(a):.1f}" cy="{378+62*math.sin(a):.1f}" r="5" fill="{DBG}" stroke="{K}" stroke-width="2"/>')
    g.append(f'<circle cx="470" cy="378" r="72" fill="url(#cyl)" opacity=".35"/>')
    # oblò: vetro con l'olio al livello, tacche MIN e MAX
    lv = 418 + 16 - 32*livello
    g.append(f'<circle cx="440" cy="418" r="19" fill="#fff" stroke="{K}" stroke-width="3.5"/>')
    g.append(f'<clipPath id="oblo"><circle cx="440" cy="418" r="15"/></clipPath>')
    g.append(f'<rect x="420" y="{lv:.1f}" width="40" height="40" fill="{NEW}" clip-path="url(#oblo)"/>')
    g.append(f'<path d="M431 410 L449 410 M431 426 L449 426" stroke="{K}" stroke-width="2.5"/>')
    # tappo di riempimento (sale quando si toglie)
    ty = 312 - (1-tappo)*70
    g.append(f'<g opacity="{.25 + .75*tappo if tappo < 1 else 1:.2f}"><rect x="{500}" y="{ty-14:.1f}" width="34" height="22" rx="5" fill="{K}"/>'
             f'<rect x="506" y="{ty-24:.1f}" width="22" height="12" rx="3" fill="#4d5258" stroke="{K}" stroke-width="2"/></g>')
    if tappo < 1:
        g.append(f'<ellipse cx="517" cy="312" rx="14" ry="5" fill="{K}"/>')
    # vasca dell'olio sotto la coppa
    if vasca:
        g.append(at(480, 586, bacinella()))
    # tappo di scarico T50 con rondella (scende quando si svita)
    py = 506 + (1-scarico)*46
    g.append(f'<rect x="468" y="{py:.1f}" width="24" height="8" rx="2" fill="{ORA}" stroke="{K}" stroke-width="2.5"/>')
    g.append(f'<rect x="471" y="{py+8:.1f}" width="18" height="16" rx="3" fill="{DBG}" stroke="{K}" stroke-width="3"/>')
    if flusso > 0:
        h = 60*flusso
        g.append(f'<path d="M480 508 C476 520 486 530 480 {508+h:.0f}" fill="none" stroke="{flusso_col}" stroke-width="12" stroke-linecap="round"/>')
        g.append(f'<path d="M480 508 C476 520 486 530 480 {508+h:.0f}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 18" stroke-dashoffset="{-t*120:.1f}" opacity=".5"/>')
    # collettori di scarico: dalla testa giù davanti al motore e sotto
    exh = 'M712 160 C820 190 830 470 770 528 L660 540'
    g.append(f'<path d="{exh}" fill="none" stroke="{K}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>')
    g.append(f'<path d="{exh}" fill="none" stroke="{STEEL}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>')
    g.append(f'<path d="M716 150 C826 182 838 468 776 520" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/>')
    g.append(f'<rect x="590" y="516" width="96" height="48" rx="16" fill="{STEEL}" stroke="{K}" stroke-width="4"/>')
    g.append(f'<rect x="590" y="516" width="96" height="48" rx="16" fill="url(#cyl)" opacity=".4"/>')
    if foil:
        g.append(at(700, 520, alluminio(), 1.1))
    # filtro dell'olio: davanti in basso, accanto ai collettori
    fx, fy = 690 + (1-filtro_st)*60, 408 + (1-filtro_st)*90
    if filtro_st < 1 and filtro_st > 0.001:
        pass
    g.append(f'<rect x="666" y="372" width="48" height="12" rx="3" fill="{DBG}" stroke="{K}" stroke-width="3"/>')
    if filtro_st > 0.001 or filtro_col != BLU:
        g.append(at(fx, fy, filtro(filtro_col), .9, -18))
    if gocce_filtro > 0:
        for j in range(3):
            ph = (t*2.2 + j/3) % 1
            g.append(drops([(fx-14+j*14, fy+48+ph*50)], OLD))
    # pannello basso destro (3 viti T25 + 2 incastri) che scorre via
    if pannello < 1:
        dx, dy = pannello*230, pannello*60
        op = 1 - pannello*.6
        g.append(f'<g transform="translate({dx:.1f} {dy:.1f})" opacity="{op:.2f}">'
                 f'<path d="M600 360 L830 330 L860 470 L800 560 L620 556 Z" fill="{RED}" stroke="{K}" stroke-width="4" stroke-linejoin="round"/>'
                 f'<path d="M640 380 L812 356" stroke="#ff6b5a" stroke-width="6" stroke-linecap="round" opacity=".7"/>'
                 + ''.join(f'<circle cx="{x}" cy="{y}" r="7" fill="{LBG}" stroke="{K}" stroke-width="2.5"/>' for x, y in ((640, 382), (810, 360), (790, 528)))
                 + '</g>')
    return f'<g transform="translate({ox} {oy}) scale({s})">' + ''.join(g) + '</g>'

def suolo(y=640):
    return ''

def calore(t=0.0, op=1):
    return ''.join(f'<path d="M{x} {96-((t*60+i*20) % 40):.1f} C{x-12} {78-((t*60+i*20) % 40):.1f} {x+12} {62-((t*60+i*20) % 40):.1f} {x} {44-((t*60+i*20) % 40):.1f}" fill="none" stroke="{ORA}" stroke-width="7" stroke-linecap="round" opacity="{op:.2f}"/>' for i, x in enumerate((560, 620, 680)))

def lente(cx, cy, livello, ok=True, r=96, to=(440, 418)):
    """oblò ingrandito con MIN e MAX"""
    lv = cy + r*.8 - 1.6*r*livello
    return (f'<path d="M{cx} {cy} L{to[0]:.0f} {to[1]:.0f}" stroke="{K}" stroke-width="3" stroke-dasharray="8 8"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r+12}" fill="{LBG}" stroke="{K}" stroke-width="4"/>'
            f'<clipPath id="lente{cx}"><circle cx="{cx}" cy="{cy}" r="{r}"/></clipPath>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fff"/>'
            f'<rect x="{cx-r}" y="{lv:.1f}" width="{2*r}" height="{2*r}" fill="{NEW}" clip-path="url(#lente{cx})"/>'
            f'<path d="M{cx-r*.7:.0f} {cy-r*.45:.0f} L{cx+r*.7:.0f} {cy-r*.45:.0f} M{cx-r*.7:.0f} {cy+r*.45:.0f} L{cx+r*.7:.0f} {cy+r*.45:.0f}" stroke="{K}" stroke-width="4"/>'
            + txt(cx+r+30, cy-r*.45+10, 'MAX', 26, K, 'start') + txt(cx+r+30, cy+r*.45+10, 'MIN', 26, K, 'start')
            + f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{K}" stroke-width="4"/>')

# ---------------------------------------------------------------- tavole
W, H = 900, 640
SX, SY, SS = 80, 70, .8
E = lambda x, y: (SX + x*SS, SY + y*SS)   # dal disegno del motore alla tavola
def tavola(n, items, scena, extra=''):
    return page(W, H, f'<g transform="translate({SX} {SY}) scale({SS})">{scena}</g>' + extra + callout(items) + step_num(n))

def tavole(OUT):
    os.makedirs(OUT, exist_ok=True)
    P = {}
    # il kit di tutto quello che serve
    body = f'<rect x="30" y="30" width="840" height="580" rx="22" fill="{CALL}" stroke="{CALLB}" stroke-width="5"/>'
    pos = [(120, 190), (290, 190), (450, 175), (600, 190), (770, 200), (175, 455), (400, 440), (590, 460), (770, 455)]
    for (fn, sc, q), (x, y) in zip(KIT_T, pos):
        body += at(x, y, fn(), sc*1.45) + txt(x, y + 130, q, 34)
    P['kit'] = page(W, H, body)
    fil, plug, cap, obl = E(690, 408), E(480, 506), E(517, 312), E(440, 418)
    # 1 via il pannello basso destro (3 viti T25 + 2 incastri), a motore freddo
    P['passo-1'] = tavola(1, [(chiave_l('T25'), .62)], motore(pannello=.55), arrow(640, 560, 780, 600))
    # 2 motore caldo
    P['passo-2'] = tavola(2, [(clock(48, .12), 1)], motore(pannello=1) + calore(0),
                          txt(90, 612, '2-3 minuti al minimo', 30, K, 'start'))
    # 3 tappo di riempimento aperto, tappo di scarico T50, olio vecchio nella vasca
    P['passo-3'] = tavola(3, [(chiave_l('T50'), .62), (bacinella(), .55)],
                          motore(pannello=1, tappo=0, scarico=0, flusso=1, vasca=True, livello=.1),
                          arrow(cap[0], cap[1] - 60, cap[0], cap[1] - 130, YEL, 12))
    # 4 alluminio sui collettori, filtro svitato con la chiave a tazza
    P['passo-4'] = tavola(4, [(tazza(), .62), (alluminio(), .65)],
                          motore(pannello=1, tappo=0, scarico=0, vasca=True, filtro_st=.55, foil=True, gocce_filtro=1, livello=0),
                          rot_arrow(fil[0] + 10, fil[1] + 40, 92, 115, 200))
    # 5 filtro nuovo: guarnizione unta d'olio, a mano e poi 11 Nm
    P['passo-5'] = tavola(5, [(filtro(), .7)],
                          motore(pannello=1, tappo=0, scarico=0, vasca=True, foil=True, livello=0),
                          at(fil[0] + 40, 596, dinamometrica('11 Nm'), .85))
    # 6 tappo di scarico con la rondella nuova, 28 Nm
    P['passo-6'] = tavola(6, [(rondella(), .9)],
                          motore(pannello=1, tappo=0, livello=0),
                          at(plug[0] + 60, 600, dinamometrica('28 Nm'), .85))
    # 7 olio nuovo con l'imbuto
    pour = f'<path d="M496 92 C504 120 512 140 516 168" fill="none" stroke="{NEW}" stroke-width="10" stroke-linecap="round"/>'
    P['passo-7'] = tavola(7, [(bottle(), .62), (imbuto(), .55)],
                          motore(pannello=1, tappo=0, livello=.35) + at(517, 228, imbuto(), .8) + at(470, 60, bottle(), .8, 48) + pour,
                          txt(90, 612, '≈ 3,5 L, poi rabbocca', 30, K, 'start'))
    # 8 livello: un minuto al minimo, spegni, cinque minuti, moto dritta
    P['passo-8'] = tavola(8, [(clock(48, 5/60), 1)],
                          motore(pannello=1, livello=.55),
                          lente(170, 500, .55, to=obl, r=86) + badge(250, 410, True) + txt(700, 612, '1 min + 5 min', 30))
    # 9 nessuna perdita, pannello al suo posto
    P['passo-9'] = tavola(9, [(chiave_l('T25'), .62)],
                          motore(pannello=0, livello=.55),
                          badge(fil[0] + 120, fil[1] - 60, True) + badge(plug[0], 600, True))
    for n, v in P.items():
        open(os.path.join(OUT, n + '.svg'), 'w').write(v)
    print('ok', list(P))

# ---------------------------------------------------------------- cartone
FPS = 30
VW, VH = 1280, 720
VX, VY, VS = 330, 40, .95
EV = lambda x, y: (VX + x*VS, VY + y*VS)
INTRO, STEP, OUTRO = 3.0, 3.4, 2.8
TOTAL = INTRO + 9*STEP + OUTRO
clamp = lambda v, a=0, b=1: max(a, min(b, v))
ease = lambda u: u*u*(3-2*u)
def seg(u, a, b):          # avanzamento 0..1 dentro la finestra [a, b] del passaggio
    return ease(clamp((u - a) / (b - a)))
def pop(u):
    u = clamp(u)
    return 1 + 0.14*math.sin(u*math.pi) if u < 1 else 1
CALLS = {1: [(lambda: chiave_l('T25'), .62)], 2: [(lambda: clock(48, .12), 1)], 3: [(lambda: chiave_l('T50'), .62), (bacinella, .55)],
         4: [(tazza, .62), (alluminio, .65)], 5: [(filtro, .7)], 6: [(rondella, .9)], 7: [(bottle, .62), (imbuto, .55)],
         8: [(lambda: clock(48, 5/60), 1)], 9: [(lambda: chiave_l('T25'), .62)]}

def frame(t):
    if t < INTRO:
        st, u = 0, t / INTRO
    elif t < INTRO + 9*STEP:
        st = int((t - INTRO) // STEP) + 1; u = (t - INTRO - (st-1)*STEP) / STEP
    else:
        st, u = 10, (t - INTRO - 9*STEP) / OUTRO
    m = dict(pannello=0.0, tappo=1.0, scarico=1.0, flusso=0.0, filtro_st=1.0, foil=False, livello=.55, vasca=False, gocce_filtro=0.0, t=t)
    over = ''
    fil, plug, cap, obl = EV(690, 408), EV(480, 506), EV(517, 312), EV(440, 418)
    # stato del motore accumulato: ogni passaggio parte da dove finisce il precedente
    if st >= 1: m['pannello'] = 1.0 if st > 1 else seg(u, .1, .7)
    if st >= 3:
        m['vasca'] = st <= 6
        m['tappo'] = 0.0 if st > 3 else 1 - seg(u, .05, .25)
        m['scarico'] = 0.0 if st > 3 else 1 - seg(u, .3, .5)
        if st == 3:
            k = seg(u, .45, .95)
            m['flusso'] = clamp((u - .45) / .1) * (1 if u < .92 else 1 - (u - .92) / .08)
            m['livello'] = .55 - .5*k
        else:
            m['livello'] = .05
    if st >= 4:
        m['foil'] = st <= 5
        if st == 4:
            m['filtro_st'] = 1 - seg(u, .35, .9)
            m['gocce_filtro'] = 1 if .3 < u < .95 else 0
        else:
            m['filtro_st'] = 1.0 if st > 5 else seg(u, .15, .6)
    if st >= 6: m['scarico'] = 1.0 if st > 6 else seg(u, .1, .45)
    if st >= 7:
        m['livello'] = .05 + .35*seg(u, .25, .9) if st == 7 else .4
    if st >= 8:
        m['livello'] = .4 + .15*seg(u, .3, .8) if st == 8 else .55
        m['tappo'] = seg(u, .0, .2) if st == 8 else 1.0
    if st == 9: m['pannello'] = 1 - seg(u, .1, .65)
    if st >= 10: m['pannello'] = 0.0
    scena = motore(**m)
    if st == 2: scena += calore(t)
    if st == 7:   # imbuto e bottiglia che versa
        k = seg(u, 0, .2)
        scena += at(517, 228, imbuto(), .8*pop(k), 0, k)
        if u > .2:
            pk = seg(u, .2, .35)
            scena += at(470, 60, bottle(), .8, 48*pk)
            if u > .3 and u < .92:
                scena += f'<path d="M496 92 C504 120 512 140 516 168" fill="none" stroke="{NEW}" stroke-width="10" stroke-linecap="round" stroke-dasharray="14 8" stroke-dashoffset="{-t*160:.1f}"/>'
    body = f'<g transform="translate({VX} {VY}) scale({VS})">{scena}</g>'
    if st == 0:   # il kit: i pezzi compaiono uno alla volta
        body += f'<rect x="30" y="30" width="520" height="660" rx="24" fill="{CALL}" stroke="{CALLB}" stroke-width="5"/>'
        pos = [(130, 140), (290, 140), (440, 130), (130, 330), (290, 330), (440, 330), (130, 530), (300, 530), (450, 530)]
        order = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        for i, ((fn, sc, q), (x, y)) in enumerate(zip(KIT_T, pos)):
            k = clamp((t - .15 - order[i]*.27)/.3)
            if k > 0:
                body += at(x, y, fn(), sc*1.05*pop(k)*(.6+.4*ease(k)), 0, ease(k)) + f'<g opacity="{ease(k):.2f}">{txt(x, y + 100, q, 28)}</g>'
    elif st == 10:   # finale: spunta verde e intervallo
        k = clamp(u/.25)
        body += f'<g transform="translate(250 330) scale({pop(k)*ease(k):.3f})"><circle r="120" fill="{GREEN}" stroke="{K}" stroke-width="6"/><path d="M-54 0 L-14 40 L58 -44" fill="none" stroke="#fff" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/></g>'
        k2 = clamp((u-.25)/.25)
        scritte = txt(250, 530, 'ogni 10.000 km', 44) + txt(250, 585, "o una volta l'anno", 34)
        body += f'<g opacity="{ease(k2):.2f}">{scritte}</g>'
        tw = .5+.5*math.sin(t*9)
        body += sparkle(EV(690, 300)[0], EV(690, 300)[1], 20*tw) + sparkle(EV(420, 260)[0], EV(420, 260)[1], 16*(1-tw))
    else:
        k = clamp(u/.1)
        body += callout([(fn(), sc) for fn, sc in CALLS[st]], op=ease(k)) + step_num(st, y=330, op=ease(k))
        if st == 2:
            body += f'<g opacity="{ease(k):.2f}">{txt(60, 420, "2-3 minuti", 34, K, "start")}{txt(60, 462, "al minimo", 34, K, "start")}</g>'
        if st == 1 and u < .75:
            body += arrow(plug[0] + 260, 640, plug[0] + 420, 680) if u > .1 else ''
        if st == 3:
            if u < .3: body += arrow(cap[0], cap[1] - 50, cap[0], cap[1] - 120, YEL, 12)
            if .25 < u < .55:
                body += at(plug[0], plug[1] + 70 + 40*seg(u, .3, .5), chiave_l('T50'), .75, 180 + 25*math.sin(u*40))
        if st == 4 and .1 < u < .9:
            body += at(fil[0], fil[1] + 10 + 90*seg(u, .35, .9), tazza(), .75, -18 - 30*math.sin(u*30))
            body += rot_arrow(fil[0] + 10, fil[1] + 40, 110, 115, 200)
        if st == 5:
            if u < .2:
                body += drops([(fil[0], fil[1] + 70 + 60*(1-u/.2))], NEW)
            if u > .6:
                kk = seg(u, .6, .75)
                body += at(fil[0] + 40, 668, dinamometrica('11 Nm'), .85*pop(kk), 0, kk)
        if st == 6:
            if u < .4:
                body += at(plug[0], plug[1] + 60 + 40*(1-seg(u, .1, .45)), rondella(), .7)
            if u > .5:
                kk = seg(u, .5, .65)
                body += at(plug[0] + 90, 672, dinamometrica('28 Nm'), .85*pop(kk), 0, kk)
        if st == 7 and u > .4:
            body += f'<g opacity="{seg(u, .4, .55):.2f}">{txt(60, 420, "≈ 3,5 L", 40, K, "start")}{txt(60, 462, "poi rabbocca", 32, K, "start")}</g>'
        if st == 8:
            frac = (1/60)*seg(u, .0, .3) + (5/60)*seg(u, .35, .7)
            body += at(120, 470, clock(62, frac))
            kk = seg(u, .25, .45)
            body += f'<g opacity="{kk:.2f}">' + lente(310, 560, m['livello'], to=obl, r=80) + '</g>'
            if u > .8:
                body += badge(400, 470, True)
        if st == 9 and u > .6:
            kk = seg(u, .6, .75)
            body += f'<g transform="translate({fil[0] + 150:.0f} {fil[1] - 80:.0f}) scale({pop(kk)*kk:.3f})">{badge(0, 0, True)}</g>'
            body += f'<g transform="translate({plug[0]:.0f} {plug[1] + 110:.0f}) scale({pop(kk)*kk:.3f})">{badge(0, 0, True)}</g>'
    return page(VW, VH, body, rounded=False)

def video(OUT):
    os.makedirs(OUT, exist_ok=True)
    n = int(TOTAL*FPS)
    for i in range(n):
        open(os.path.join(OUT, f'f{i:04d}.svg'), 'w').write(frame(i/FPS))
    print(n, 'fotogrammi', TOTAL, 's')

if __name__ == '__main__':
    cmd, OUT = sys.argv[1], sys.argv[2]
    if cmd == 'tavole':
        tavole(OUT)
    elif cmd == 'video':
        video(OUT)
    elif cmd == 'prova':   # alcuni fotogrammi sparsi per controllare
        os.makedirs(OUT, exist_ok=True)
        for tt in [float(x) for x in sys.argv[3:]]:
            open(os.path.join(OUT, f'p{tt:05.1f}.svg'), 'w').write(frame(tt))
