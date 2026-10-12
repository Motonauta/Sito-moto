# fotogrammi del cartone "a mattoncini": 1280x720, 30 fps
import math, os, sys
from lego import *
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
FPS = 30
W, H = 1280, 720
CX, CY, R = 850, 430, 170
INTRO, STEP, OUTRO = 2.6, 3.0, 2.6
TOTAL = INTRO + 6*STEP + OUTRO
clamp = lambda v, a=0, b=1: max(a, min(b, v))
ease = lambda u: u*u*(3-2*u)
def pop(u):   # comparsa con un piccolo rimbalzo
    u = clamp(u)
    return 1 + 0.12*math.sin(u*math.pi) if u < 1 else 1
ITEMS = {1: [(can, .8), (brush, .8)], 2: [(chainbrush, .62)], 3: [(airgun, .75)], 4: [(rag, .9)], 5: [(lambda: clock(48, .25), 1)], 6: [(spray, .75)]}
ROTATING = {1, 2, 6}

def state(t):
    """quanto ha girato la ruota, sporco e lucentezza al tempo t"""
    rot, tt = 0.0, 0.0
    step_dt = 1/FPS
    # rotazione integrata: gira durante i passaggi 1, 2, 6 e nel finale
    n = int(t*FPS)
    for i in range(n):
        x = i/FPS
        st = int((x-INTRO)//STEP)+1 if INTRO <= x < INTRO+6*STEP else (0 if x < INTRO else 7)
        if st in ROTATING or st == 7: rot += 70*step_dt
    st = int((t-INTRO)//STEP)+1 if INTRO <= t < INTRO+6*STEP else (0 if t < INTRO else 7)
    u = clamp((t-INTRO-(st-1)*STEP)/STEP) if 1 <= st <= 6 else 0
    dirt = 1 if st <= 1 else (1-ease(u) if st == 2 else 0)
    shine = {0: 0, 1: 0, 2: 0, 3: .15*u, 4: .15+.2*u, 5: .35+.15*u, 6: .5+.5*ease(u), 7: 1}[st]
    return st, u, rot, dirt, shine

def frame(t):
    st, u, rot, dirt, shine = state(t)
    rs = R*.42
    dash = -math.radians(rot)*(rs+2)
    s, (rs, top, bot) = scene(CX, CY, R=R, rot=rot, dirt=dirt, shine=shine, dash=dash, arm=420)
    body = s
    if st == 0:   # il kit: pezzi che compaiono uno alla volta
        body += f'<rect x="40" y="40" width="560" height="560" rx="26" fill="{CALL}" stroke="{CALLB}" stroke-width="5"/>'
        pos = [(130, 170), (290, 170), (450, 160), (140, 410), (310, 410), (460, 410), (300, 540)]
        pos = [(130, 175), (300, 175), (470, 160), (150, 400), (330, 400), (480, 400), (300, 530)]
        for i, ((fn, sc), (x, y)) in enumerate(zip(KIT, pos)):
            k = clamp((t - .15 - i*.28)/.3)
            if k > 0:
                body += at(x, y, fn(), sc*.78*pop(k)*(.6+.4*ease(k)), 0, ease(k))
    elif st == 7: # finale: catena che brilla e spunta verde
        k = clamp((t-INTRO-6*STEP)/.5)
        body += rot_arrow(CX, CY, R+32)
        body += f'<g transform="translate(250 360) scale({pop(k)*ease(k):.3f})"><circle r="110" fill="{GREEN}" stroke="{K}" stroke-width="6"/><path d="M-50 0 L-14 38 L54 -40" fill="none" stroke="#fff" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/></g>'
        tw = .5+.5*math.sin(t*9)
        body += sparkle(CX-360, top-60, 22*tw) + sparkle(CX+rs+60, CY-70, 18*(1-tw)) + sparkle(CX-120, top-70, 16*(1-tw))
    else:
        k = clamp(u/.1)
        body += callout([(fn(), sc) for fn, sc in ITEMS[st]], op=ease(k)) + step_num(st, y=330, op=ease(k))
        if st in ROTATING: body += rot_arrow(CX, CY, R+32)
        if st == 1:   # pennello che passa sulla catena, gocce di petrolio
            x = 470 + 300*(.5-.5*math.cos(u*2*math.pi*1.5))
            body += at(x, top-46, brush(), 1.35, 35)
            for j in range(3):
                ph = (u*4 + j/3) % 1
                body += drops([(x-30+j*22, top+14+ph*90)])
            body += at(150, 620, can(), .9)
        elif st == 2: # spazzola per catena avanti e indietro, sporco che cade
            x = 600 + 140*math.sin(u*2*math.pi*3)
            body += at(x, top+2, chainbrush(), 1.2)
            for j in range(5):
                ph = (u*3 + j/5) % 1
                body += f'<circle cx="{x-30+j*14:.1f}" cy="{top+50+ph*140:.1f}" r="{5*(1-ph)*dirt+1:.1f}" fill="{BROWN}"/>'
            body += arrow(480, top-200, 760, top-200) + arrow(760, top-240, 480, top-240)
        elif st == 3: # aria compressa: getto e gocce spurgate via
            body += at(440, top-130, airgun(), 1.25, 32) + air_lines(515, top-70, phase=t*260)
            for j in range(4):
                ph = (u*3.2 + j/4) % 1
                body += drops([(650+ph*260, top-10-ph*120+ph*ph*160)])
        elif st == 4: # panno che asciuga da sinistra a destra
            x = 470 + 330*(.5-.5*math.cos(u*2*math.pi*1.5))
            body += at(x, top-4, rag(), 1.25, -8+6*math.sin(u*40))
        elif st == 5: # un'ora: la lancetta fa il giro, il petrolio evapora
            body += at(210, 540, clock(95, ease(u))) + f'<text x="210" y="690" text-anchor="middle" font-size="44" fill="{K}" {FONT}>1h</text>'
            for j, x in enumerate((560, 680, 800)):
                ph = (u*2 + j/3) % 1
                y0 = top-20-ph*90
                body += f'<path d="M{x} {y0} C{x-14} {y0-20} {x+14} {y0-36} {x} {y0-56}" fill="none" stroke="#9fd6f5" stroke-width="6" stroke-linecap="round" opacity="{1-ph:.2f}"/>'
        elif st == 6: # grasso spray
            on = (math.sin(u*2*math.pi*6) > -.3)
            if on:
                body += f'<path d="M560 {top-150} L700 {top-14} L640 {top+8} Z" fill="#ffe1bd" stroke="{K}" stroke-width="3" stroke-dasharray="8 6" opacity=".9"/>'
            body += at(520, top-190, spray(), 1.15, -48)
    return page(W, H, body, rounded=False)

n = int(TOTAL*FPS)
for i in range(n):
    open(os.path.join(OUT, f'f{i:04d}.svg'), 'w').write(frame(i/FPS))
print(n, 'fotogrammi', TOTAL, 's')
