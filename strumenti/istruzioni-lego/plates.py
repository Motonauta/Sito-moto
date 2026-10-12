import os, sys
from lego import *
OUT = sys.argv[1]
W, H = 900, 640
CX, CY = 610, 400
P = {}
s, (rs, top, bot) = scene(CX, CY, dirt=1, shine=0)
P['passo-1'] = page(W, H, callout([(can(), .8), (brush(), .8)]) + step_num(1) + s + rot_arrow(CX, CY, 182)
    + at(380, top-40, brush(), 1.25, 35) + drops([(352, top+20), (392, top+30), (430, top+18)]) + at(150, 560, can(), .9))
s, (rs, top, bot) = scene(CX, CY, dirt=.6, shine=0)
P['passo-2'] = page(W, H, callout([(chainbrush(), .62)]) + step_num(2) + s + at(380, top+2, chainbrush(), 1.1)
    + arrow(250, top-150, 520, top-150) + arrow(520, top-190, 250, top-190))
s, (rs, top, bot) = scene(CX, CY, dirt=0, shine=.15)
P['passo-3'] = page(W, H, callout([(airgun(), .75)]) + step_num(3) + s
    + at(300, top-120, airgun(), 1.2, 32) + air_lines(370, top-60) + drops([(500, top-20), (540, top-34), (585, top-12)]))
s, (rs, top, bot) = scene(CX, CY, dirt=0, shine=.3)
P['passo-4'] = page(W, H, callout([(rag(), .9)]) + step_num(4) + s + at(400, top-4, rag(), 1.2, -8)
    + arrow(260, top-80, 500, top-80) + arrow(500, top-120, 260, top-120))
s, (rs, top, bot) = scene(CX, CY, dirt=0, shine=.4)
evap = ''.join(f'<path d="M{x} {top-20} C{x-14} {top-40} {x+14} {top-56} {x} {top-76} C{x-14} {top-96} {x+14} {top-112} {x} {top-130}" fill="none" stroke="#9fd6f5" stroke-width="6" stroke-linecap="round"/>' for x in (300, 400, 500))
P['passo-5'] = page(W, H, callout([(clock(48, .25), 1)]) + step_num(5) + s + evap + at(170, 470, clock(80, 1))
    + f'<text x="170" y="600" text-anchor="middle" font-size="40" fill="{K}" {FONT}>1h</text>')
s, (rs, top, bot) = scene(CX, CY, dirt=0, shine=1)
P['passo-6'] = page(W, H, callout([(spray(), .75)]) + step_num(6) + s + rot_arrow(CX, CY, 182) + spray_aim(450, top, 1.05, 32, 175))
s, (rs, top, bot) = scene(560, 300, R=120, dirt=0, shine=.3)
cardboard = f'<path d="M300 452 L760 452 L780 482 L320 482 Z" fill="{TAN}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>'
P['accortezze'] = page(W, H, s + drops([(560, 435), (600, 445)]) + cardboard + badge(820, 466, True)
    + arrow(700, 150, 640, 205, YEL, 11) + badge(740, 120, False) + at(110, 120, FLAME) + badge(160, 70, False)
    + at(130, 520, WINDOW, .7) + badge(220, 470, True))
# copertina 16:9
s, (rs, top, bot) = scene(1250, 520, R=240, dirt=0, shine=1, arm=420)
cov = s + f'<rect x="40" y="40" width="820" height="620" rx="26" fill="{CALL}" stroke="{CALLB}" stroke-width="5"/>'
pos = [(180, 190), (430, 190), (680, 175), (190, 470), (390, 470), (580, 470), (760, 470)]
for (fn, sc), (x, y) in zip(KIT, pos):
    cov += at(x, y, fn(), sc*.95) + f'<text x="{x}" y="{y+140}" text-anchor="middle" font-size="34" fill="{K}" {FONT}>1x</text>'
P['copertina'] = page(1600, 900, cov, rounded=False)
for n, v in P.items():
    open(os.path.join(OUT, n + '.svg'), 'w').write(v)
print('ok', list(P))
