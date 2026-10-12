# Disegni "a mattoncini" per la guida della catena: primitive condivise da
# tavole (SVG statici) e video (fotogrammi). Tavolozza dei colori LEGO.
import math
K = '#05131d'                       # Black
BG = '#f3f7fb'                      # pagina del libretto
CALL, CALLB = '#c5def2', '#1d4f91'  # riquadro dei pezzi
LBG, DBG = '#a0a5a9', '#6c6e68'     # Light / Dark Bluish Gray
RED, YEL, BLU, ORA = '#c91a09', '#f2cd37', '#0055bf', '#fe8a18'
BROWN, NOUGAT, TAN, GREEN = '#582a12', '#aa7d55', '#e4cd9e', '#237841'
TLB = '#aee9ef'                     # Trans-Light Blue
FONT = "font-family=\"'Arial Rounded MT Bold','Arial Black',Arial,Helvetica,sans-serif\" font-weight=\"900\""
DEFS = ('<defs>'
  '<linearGradient id="cyl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>'
  '<radialGradient id="tyre" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#3a4249"/><stop offset=".7" stop-color="#05131d"/></radialGradient>'
  '<radialGradient id="rim" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#d9dde0"/><stop offset="1" stop-color="#8f9499"/></radialGradient>'
  '</defs>')

def mix(c1, c2, t):
    a = [int(c1[i:i+2], 16) for i in (1, 3, 5)]; b = [int(c2[i:i+2], 16) for i in (1, 3, 5)]
    return '#' + ''.join(f'{round(x + (y - x) * t):02x}' for x, y in zip(a, b))

def page(w, h, body, rounded=True):
    bg = (f'<rect x="2" y="2" width="{w-4}" height="{h-4}" rx="26" fill="{BG}" stroke="#c9d6e2" stroke-width="3"/>'
          if rounded else f'<rect width="{w}" height="{h}" fill="{BG}"/>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{DEFS}{bg}{body}</svg>'

def at(x, y, inner, s=1, rot=0, op=1):
    o = f' opacity="{op:.3f}"' if op < 1 else ''
    return f'<g transform="translate({x:.1f} {y:.1f}) rotate({rot:.1f}) scale({s:.3f})"{o}>{inner}</g>'

def gear(cx, cy, r, teeth=38, depth=7):
    return ' '.join(f'{cx + (r if i % 2 == 0 else r - depth) * math.cos(math.pi * i / teeth):.1f},'
                    f'{cy + (r if i % 2 == 0 else r - depth) * math.sin(math.pi * i / teeth):.1f}' for i in range(teeth * 2))

def scene(cx, cy, R=150, rot=0, dirt=1.0, shine=0.0, dash=0.0, arm=330):
    """forcellone + ruota (girata di rot gradi) + catena; dirt e shine 0..1"""
    rs = R * 0.42
    top, bot = cy - rs - 2, cy + rs + 2
    g = [f'<path d="M{cx} {cy} L{cx-arm} {cy-46} L{cx-arm} {cy+4} L{cx} {cy+40} Z" fill="{DBG}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>']
    w = [f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#tyre)" stroke="{K}" stroke-width="4"/>']
    for i in range(24):
        a = 2*math.pi*i/24
        w.append(f'<path d="M{cx+(R-4)*math.cos(a):.1f} {cy+(R-4)*math.sin(a):.1f} L{cx+(R-16)*math.cos(a+.05):.1f} {cy+(R-16)*math.sin(a+.05):.1f}" stroke="#2b3238" stroke-width="5" stroke-linecap="round"/>')
    w.append(f'<circle cx="{cx}" cy="{cy}" r="{R*.76:.0f}" fill="url(#rim)" stroke="{K}" stroke-width="3.5"/>')
    w.append(f'<circle cx="{cx}" cy="{cy}" r="{R*.68:.0f}" fill="#e4e8eb" stroke="{LBG}" stroke-width="3"/>')
    for i in range(5):
        a = 2*math.pi*i/5 - math.pi/2
        for d in (-.16, .16):
            x2, y2 = cx + R*.66*math.cos(a+d), cy + R*.66*math.sin(a+d)
            w.append(f'<path d="M{cx} {cy} L{x2:.1f} {y2:.1f}" stroke="{K}" stroke-width="13" stroke-linecap="round"/>')
            w.append(f'<path d="M{cx} {cy} L{x2:.1f} {y2:.1f}" stroke="{DBG}" stroke-width="7" stroke-linecap="round"/>')
    w.append(f'<polygon points="{gear(cx, cy, rs)}" fill="{LBG}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>')
    w.append(f'<circle cx="{cx}" cy="{cy}" r="{rs*.78:.0f}" fill="#c4c8cb" stroke="{DBG}" stroke-width="3"/>')
    for i in range(5):
        a = 2*math.pi*i/5 + .3
        w.append(f'<circle cx="{cx+rs*.5*math.cos(a):.1f}" cy="{cy+rs*.5*math.sin(a):.1f}" r="{rs*.16:.1f}" fill="{DBG}" stroke="{K}" stroke-width="3"/>')
    w.append(f'<circle cx="{cx}" cy="{cy}" r="{rs*.26:.0f}" fill="#4d5258" stroke="{K}" stroke-width="3.5"/>')
    g.append(f'<g transform="rotate({rot:.1f} {cx} {cy})">' + ''.join(w) + '</g>')
    path = f'M{cx-arm-30} {top+6} L{cx} {top} A{rs+2} {rs+2} 0 0 1 {cx} {bot} L{cx-arm-30} {bot+10}'
    g.append(f'<path d="{path}" fill="none" stroke="{K}" stroke-width="22" stroke-linejoin="round"/>')
    g.append(f'<path d="{path}" fill="none" stroke="{mix(DBG, "#eef1f3", shine)}" stroke-width="14" stroke-linejoin="round"/>')
    g.append(f'<path d="{path}" fill="none" stroke="{K}" stroke-width="8" stroke-dasharray="5 11" stroke-dashoffset="{dash:.1f}"/>')
    if dirt > 0.01:
        for (x, y, r) in [(cx-300, top+4, 13), (cx-210, top+2, 10), (cx-120, top+1, 14), (cx-40, top, 9), (cx-260, bot+8, 12), (cx-150, bot+6, 10), (cx+rs-2, cy+10, 9)]:
            g.append(f'<ellipse cx="{x}" cy="{y}" rx="{r*dirt:.1f}" ry="{r*.7*dirt:.1f}" fill="{BROWN}" stroke="{K}" stroke-width="3"/>')
    if shine > 0.5:
        k = (shine - .5) * 2
        for (x, y, s) in [(cx-280, top-34, 16), (cx-140, top-30, 12), (cx-20, top-36, 18), (cx+rs+28, cy-20, 13)]:
            g.append(sparkle(x, y, s * k))
    return ''.join(g), (rs, top, bot)

def sparkle(x, y, s):
    return (f'<path d="M{x} {y-s:.1f} L{x+s*.28:.1f} {y-s*.28:.1f} L{x+s:.1f} {y} L{x+s*.28:.1f} {y+s*.28:.1f} L{x} {y+s:.1f} '
            f'L{x-s*.28:.1f} {y+s*.28:.1f} L{x-s:.1f} {y} L{x-s*.28:.1f} {y-s*.28:.1f} Z" fill="#fff" stroke="{K}" stroke-width="3" stroke-linejoin="round"/>')

def rot_arrow(cx, cy, r, a0=205, a1=300, color=YEL):
    pt = lambda a, rr: (cx + rr*math.cos(math.radians(a)), cy + rr*math.sin(math.radians(a)))
    w = 14
    o0, o1, i0, i1 = pt(a0, r+w), pt(a1, r+w), pt(a0, r-w), pt(a1, r-w)
    tip, h0, h1 = pt(a1+12, r), pt(a1, r+w+12), pt(a1, r-w-12)
    d = (f'M{i0[0]:.1f} {i0[1]:.1f} L{o0[0]:.1f} {o0[1]:.1f} A{r+w} {r+w} 0 0 1 {o1[0]:.1f} {o1[1]:.1f} L{h0[0]:.1f} {h0[1]:.1f} '
         f'L{tip[0]:.1f} {tip[1]:.1f} L{h1[0]:.1f} {h1[1]:.1f} L{i1[0]:.1f} {i1[1]:.1f} A{r-w} {r-w} 0 0 0 {i0[0]:.1f} {i0[1]:.1f} Z')
    return f'<path d="{d}" fill="{color}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>'

def arrow(x1, y1, x2, y2, color=YEL, w=13):
    a = math.atan2(y2-y1, x2-x1); L = math.hypot(x2-x1, y2-y1)
    pts = [(0, -w/2), (L-34, -w/2), (L-34, -w*1.6), (L, 0), (L-34, w*1.6), (L-34, w/2), (0, w/2)]
    rp = ' '.join(f'{x1+px*math.cos(a)-py*math.sin(a):.1f},{y1+px*math.sin(a)+py*math.cos(a):.1f}' for px, py in pts)
    return f'<polygon points="{rp}" fill="{color}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>'

# ---- attrezzi, disegnati attorno all'origine
def can():
    return (f'<rect x="-38" y="-52" width="76" height="104" rx="8" fill="#fff" stroke="{K}" stroke-width="4"/>'
            f'<rect x="-38" y="-14" width="76" height="40" fill="{BLU}" stroke="{K}" stroke-width="3.5"/>'
            f'<text x="0" y="16" text-anchor="middle" font-size="26" fill="#fff" {FONT}>1 L</text>'
            f'<path d="M14 -52 L22 -72 L34 -72 L30 -52" fill="{LBG}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>'
            f'<path d="M-24 -52 C-24 -78 2 -78 2 -52" fill="none" stroke="{K}" stroke-width="4"/>'
            f'<rect x="-38" y="-52" width="76" height="104" rx="8" fill="url(#cyl)"/>')
def brush():
    return (f'<rect x="-9" y="-80" width="18" height="70" rx="8" fill="{NOUGAT}" stroke="{K}" stroke-width="3.5"/>'
            f'<rect x="-14" y="-14" width="28" height="18" rx="3" fill="{LBG}" stroke="{K}" stroke-width="3.5"/>'
            f'<path d="M-15 4 L15 4 L18 34 L-18 34 Z" fill="{K}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>'
            f'<path d="M-8 8 L-9 30 M0 8 L0 31 M8 8 L9 30" stroke="#4d5258" stroke-width="2"/>')
def chainbrush():
    # spazzola per catena a tre lati: manico rosso, testa nera, setole gialle a "U"
    return (f'<rect x="-14" y="-96" width="28" height="78" rx="12" fill="{RED}" stroke="{K}" stroke-width="3.5"/>'
            f'<rect x="-8" y="-88" width="6" height="58" rx="3" fill="#fff" opacity=".35"/>'
            f'<rect x="-30" y="-22" width="60" height="22" rx="5" fill="{K}"/>'
            f'<path d="M-30 0 L-30 40 M-22 0 L-22 42 M-14 0 L-14 40 M14 0 L14 40 M22 0 L22 42 M30 0 L30 40" stroke="{YEL}" stroke-width="5" stroke-linecap="round"/>'
            f'<path d="M-10 0 L-10 12 M-4 0 L-4 13 M2 0 L2 13 M8 0 L8 12" stroke="{YEL}" stroke-width="4" stroke-linecap="round"/>'
            f'<path d="M-34 0 L34 0" stroke="{K}" stroke-width="3.5"/>')
def rag():
    return (f'<path d="M-50 -20 C-30 -40 10 -34 44 -26 C54 -6 50 18 40 30 C10 36 -26 34 -48 26 C-58 6 -56 -8 -50 -20 Z" fill="{YEL}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>'
            f'<path d="M-30 -14 C-10 -4 12 -8 30 -2 M-34 10 C-12 18 10 12 32 16" fill="none" stroke="#c79a25" stroke-width="4" stroke-linecap="round"/>')
def airgun():
    return (f'<path d="M-46 0 C-70 0 -80 20 -78 50" fill="none" stroke="{BLU}" stroke-width="9" stroke-linecap="round"/>'
            f'<path d="M-46 -14 L30 -14 L30 10 L-10 10 L-18 46 L-40 46 L-34 10 L-46 10 Z" fill="{RED}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/>'
            f'<rect x="30" y="-8" width="44" height="12" rx="4" fill="{LBG}" stroke="{K}" stroke-width="3.5"/>'
            f'<path d="M-10 10 C-8 22 -2 26 4 24" fill="none" stroke="{K}" stroke-width="3.5" stroke-linecap="round"/>')
def spray():
    return (f'<rect x="-30" y="-50" width="60" height="110" rx="10" fill="{ORA}" stroke="{K}" stroke-width="3.5"/>'
            f'<rect x="-30" y="-6" width="60" height="30" fill="#fff" stroke="{K}" stroke-width="3.5"/>'
            f'<path d="M-22 -50 C-22 -70 22 -70 22 -50" fill="#fff" stroke="{K}" stroke-width="3.5"/>'
            f'<rect x="-8" y="-82" width="16" height="16" rx="3" fill="#fff" stroke="{K}" stroke-width="3.5"/>'
            f'<rect x="8" y="-79" width="12" height="7" fill="{LBG}" stroke="{K}" stroke-width="3"/>'
            f'<rect x="-30" y="-50" width="60" height="110" rx="10" fill="url(#cyl)"/>')
def spray_aim(tx, ty, s=1.0, rot=40, L=190, half=17, on=True):
    """bomboletta inclinata di rot gradi che spruzza dall'erogatore (in cima,
    ugello verso destra) fino al punto (tx, ty) della catena, a distanza L"""
    a = math.radians(rot)
    dx, dy = math.cos(a), math.sin(a)                 # direzione del getto
    nx, ny = 21*s, -75.5*s                            # punta dell'ugello, prima della rotazione
    tipx, tipy = tx - L*dx, ty - L*dy
    cx = tipx - (nx*dx - ny*dy); cy = tipy - (nx*dy + ny*dx)
    def ray(sign):
        b = a + sign*math.radians(half)
        return tipx + L*math.cos(b), tipy + L*math.sin(b)
    (x1, y1), (x2, y2) = ray(-1), ray(1)
    cone = (f'<path d="M{tipx:.1f} {tipy:.1f} L{x1:.1f} {y1:.1f} L{x2:.1f} {y2:.1f} Z" fill="#ffe1bd" stroke="{K}" '
            f'stroke-width="3" stroke-dasharray="8 6" stroke-linejoin="round" opacity=".9"/>') if on else ''
    return cone + at(cx, cy, spray(), s, rot)
def clock(r=58, frac=0.0):
    a = 360 * frac
    big = 1 if a > 180 else 0
    ex, ey = (r-12)*math.sin(math.radians(a)), -(r-12)*math.cos(math.radians(a))
    wedge = (f'<circle r="{r-12}" fill="#f6c6c1"/>' if frac >= .999 else
             (f'<path d="M0 0 L0 {-(r-12)} A{r-12} {r-12} 0 {big} 1 {ex:.1f} {ey:.1f} Z" fill="#f6c6c1"/>' if frac > .001 else ''))
    ticks = ''.join(f'<path d="M{(r-6)*math.sin(math.radians(t)):.1f} {-(r-6)*math.cos(math.radians(t)):.1f} L{(r-14)*math.sin(math.radians(t)):.1f} {-(r-14)*math.cos(math.radians(t)):.1f}" stroke="{K}" stroke-width="4" stroke-linecap="round"/>' for t in range(0, 360, 30))
    return (f'<circle r="{r}" fill="#fff" stroke="{K}" stroke-width="4"/>{wedge}{ticks}'
            f'<path d="M0 0 L0 {-r*.62:.0f}" stroke="{K}" stroke-width="7" stroke-linecap="round"/>'
            f'<path d="M0 0 L{(r*.48)*math.sin(math.radians(a)):.1f} {-(r*.48)*math.cos(math.radians(a)):.1f}" stroke="{RED}" stroke-width="5" stroke-linecap="round"/>'
            f'<circle r="6" fill="{K}"/>')

def callout(items, x=26, y=26, op=1):
    cell = 150
    w = cell*len(items) + 24
    g = [f'<rect x="{x}" y="{y}" width="{w}" height="196" rx="18" fill="{CALL}" stroke="{CALLB}" stroke-width="4"/>']
    for i, (inner, s) in enumerate(items):
        cx = x + 12 + cell*i + cell/2
        g.append(at(cx, y + 84, inner, s*1.3))
        g.append(f'<text x="{cx}" y="{y+180}" text-anchor="middle" font-size="30" fill="{K}" {FONT}>1x</text>')
    return f'<g opacity="{op:.3f}">' + ''.join(g) + '</g>'

def step_num(n, x=40, y=320, op=1):
    return f'<text x="{x}" y="{y}" font-size="92" fill="{K}" opacity="{op:.3f}" {FONT}>{n}</text>'

def drops(pts, color=TLB):
    return ''.join(f'<path d="M{x:.1f} {y-12:.1f} C{x+9:.1f} {y:.1f} {x+8:.1f} {y+9:.1f} {x:.1f} {y+9:.1f} C{x-8:.1f} {y+9:.1f} {x-9:.1f} {y:.1f} {x:.1f} {y-12:.1f} Z" fill="{color}" stroke="{K}" stroke-width="3"/>' for x, y in pts)

def air_lines(x, y, phase=0.0):
    return ''.join(f'<path d="M{x} {y+dy} C{x+30} {y+dy+6} {x+60} {y+dy+18} {x+95} {y+dy*2.2+30}" fill="none" stroke="#5fbff0" stroke-width="6" stroke-linecap="round" stroke-dasharray="26 14" stroke-dashoffset="{-phase:.1f}"/>' for dy in (-18, 0, 18))

def badge(x, y, ok):
    if ok:
        return f'<circle cx="{x}" cy="{y}" r="34" fill="{GREEN}" stroke="{K}" stroke-width="3.5"/><path d="M{x-15} {y} L{x-4} {y+12} L{x+16} {y-12}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'
    return f'<circle cx="{x}" cy="{y}" r="34" fill="{RED}" stroke="{K}" stroke-width="3.5"/><path d="M{x-13} {y-13} L{x+13} {y+13} M{x+13} {y-13} L{x-13} {y+13}" stroke="#fff" stroke-width="9" stroke-linecap="round"/>'

FLAME = f'<path d="M0 50 C-34 50 -44 20 -30 -6 C-24 10 -14 12 -12 2 C-14 -24 4 -40 10 -56 C14 -30 40 -18 36 14 C34 38 22 50 0 50 Z" fill="{ORA}" stroke="{K}" stroke-width="3.5" stroke-linejoin="round"/><path d="M0 44 C-16 44 -20 28 -12 16 C-6 24 2 22 2 12 C12 22 18 36 0 44 Z" fill="{YEL}" stroke="{K}" stroke-width="3"/>'
WINDOW = f'<rect x="-70" y="-70" width="140" height="140" rx="8" fill="{TLB}" stroke="{K}" stroke-width="4"/><path d="M0 -70 L0 70 M-70 0 L70 0" stroke="{K}" stroke-width="4"/>' + ''.join(f'<path d="M80 {dy} C110 {dy-10} 130 {dy+10} 160 {dy}" fill="none" stroke="#5fbff0" stroke-width="6" stroke-linecap="round"/>' for dy in (-30, 0, 30))
KIT = [(can, 1.3), (brush, 1.3), (chainbrush, 1.05), (airgun, 1.15), (rag, 1.4), (lambda: clock(48), 1.3), (spray, 1.15)]
