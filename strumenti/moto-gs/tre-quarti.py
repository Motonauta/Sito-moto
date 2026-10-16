# Genera la vista di tre quarti (muso verso chi guarda, fianco destro) del GS
# carico, con le stesse misure dei disegni di profilo e di fronte della home.
# Coordinate 3D: x avanti (0 = centro moto), y lato destro (verso chi guarda
# nel profilo), z in alto da terra. Profilo: x = x_svg - 155, z = 196 - y_svg.
# Frontale: y = 160 - x_svg.
import math

A = math.radians(45)          # quanto è girata la moto
PP = 1000.0                   # prospettiva
CX = 157.0
GROUND = 196.0

def P(x, y, z):
    X0 = x * math.cos(A) - y * math.sin(A)
    D = x * math.sin(A) + y * math.cos(A)
    f = PP / (PP - D)
    return (CX + X0 * f, GROUND - z * f)

def pts(points):
    return " ".join(f"{a:.1f},{b:.1f}" for a, b in points)

def poly(points3, fill, extra=""):
    return f'<polygon points="{pts([P(*p) for p in points3])}" fill="{fill}"{extra}/>'

def line(points3, stroke, width, extra=""):
    d = "M" + " L".join(f"{a:.1f} {b:.1f}" for a, b in (P(*p) for p in points3))
    return f'<path d="{d}" stroke="{stroke}" stroke-width="{width}" fill="none"{extra}/>'

def limb(points3, w, inner, outer="#22252b"):
    return line(points3, outer, w) + line(points3, inner, w - 3)

def box(x0, x1, y0, y1, z0, z1, front, side, extra=""):
    """scatola: si vedono la faccia davanti (+x) e quella destra (+y)"""
    s = poly([(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)], side, extra)
    f = poly([(x1, y0, z0), (x1, y1, z0), (x1, y1, z1), (x1, y0, z1)], front, extra)
    return s + f

def circle_xz(xc, y, zc, r, n=36):
    return [(xc + r * math.cos(t), y, zc + r * math.sin(t)) for t in (2 * math.pi * i / n for i in range(n))]

def circle_yz(x, yc, zc, r, n=28):
    return [(x, yc + r * math.cos(t), zc + r * math.sin(t)) for t in (2 * math.pi * i / n for i in range(n))]

def hull(p):
    p = sorted(set(p))
    def cross(o, a, b): return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
    lo, up = [], []
    for q in p:
        while len(lo) >= 2 and cross(lo[-2], lo[-1], q) <= 0: lo.pop()
        lo.append(q)
    for q in reversed(p):
        while len(up) >= 2 and cross(up[-2], up[-1], q) <= 0: up.pop()
        up.append(q)
    return lo[:-1] + up[:-1]

def wheel(xc, zc, r, rim, half, spokes_scale=1.0):
    out = []
    far = [P(*q) for q in circle_xz(xc, -half, zc, r)]
    near = [P(*q) for q in circle_xz(xc, half, zc, r)]
    out.append(f'<polygon points="{pts(hull(far + near))}" fill="#141416"/>')
    out.append(f'<polygon points="{pts(near)}" fill="#1b1c20"/>')
    tread = [P(*q) for q in circle_xz(xc, half, zc, r - 2)]
    out.append(f'<polygon points="{pts(tread)}" fill="none" stroke="#2e3036" stroke-width="3.2" stroke-dasharray="3.2 3"/>')
    rimp = [P(*q) for q in circle_xz(xc, half + 1, zc, rim)]
    out.append(f'<polygon points="{pts(rimp)}" fill="#141416" stroke="#d4aa4c" stroke-width="3.4"/>')
    for i in range(12):
        t = 2 * math.pi * i / 12 + 0.13
        a = P(xc, half + 1, zc); b = P(xc + (rim - 1.6) * math.cos(t), half + 1, zc + (rim - 1.6) * math.sin(t))
        out.append(f'<path d="M{a[0]:.1f} {a[1]:.1f} L{b[0]:.1f} {b[1]:.1f}" stroke="#d5d9df" stroke-width=".9"/>')
    hub = [P(*q) for q in circle_xz(xc, half + 2, zc, 6)]
    out.append(f'<polygon points="{pts(hub)}" fill="#2a2c31"/>')
    return "".join(out)

svg = []
add = svg.append

# 1) valigia sinistra (dietro)
add(box(-113, -39, -60, -34, 40, 90, "url(#gsAlu)", "url(#gsAlu)"))
# 2) ruota posteriore e fanalino
add(wheel(-75, 32, 32, 22, 9))
add(poly([(-96, 14, 88), (-88, 14, 88), (-88, 14, 92), (-96, 14, 92)], "#d23a33"))
# 3) bauletto e borsello
add(box(-127, -69, -28, 28, 95, 136, "url(#gsAlu)", "url(#gsAlu)"))
add(poly([(-127, 28, 126), (-69, 28, 126), (-69, 28, 127.5), (-127, 28, 127.5)], "#4a4e57", ' stroke="none"'))
add(poly([(-127, 28, 95), (-121, 28, 95), (-121, 28, 101), (-127, 28, 101)], "#1a1b1f", ' stroke="none"'))
add(poly([(-75, 28, 95), (-69, 28, 95), (-69, 28, 101), (-75, 28, 101)], "#1a1b1f", ' stroke="none"'))
add(poly([(-75, 28, 130), (-69, 28, 130), (-69, 28, 136), (-75, 28, 136)], "#1a1b1f", ' stroke="none"'))
add(box(-117, -79, -19, 19, 136, 151, "url(#gsDark)", "url(#gsDark)"))
add(line([(-106, 19, 136), (-106, 19, 151)], "#d23a33", 2.4) + line([(-90, 19, 136), (-90, 19, 151)], "#d23a33", 2.4))
# 4) borsa a rotolo (gonfia)
far_end = [P(*q) for q in circle_xz(-45, -32, 110, 14)]
near_end = [P(*q) for q in circle_xz(-45, 32, 110, 14)]
add(f'<polygon points="{pts(hull(far_end + near_end))}" fill="url(#gsRed)"/>')
add(f'<polygon points="{pts(near_end)}" fill="#8a1a1f"/>')
add(line([(-52, -10, 96), (-52, -10, 124)], "#141416", 2.6) + line([(-38, 10, 96), (-38, 10, 124)], "#141416", 2.6))
# 5) cilindro e borsa del paramotore di sinistra (si vedono appena)
add(box(27, 57, -58, -38, 34, 60, "url(#gsSteel)", "url(#gsSteel)"))
add(box(40, 70, -74, -58, 34, 62, "url(#gsDark)", "url(#gsDark)"))
# 6) silenziatore sul lato destro
s0, s1 = (-79, 22, 45), (-25, 22, 66)
add(line([s0, s1], "#0c0c0b", 17) + line([s0, s1], "#a9afb8", 14.5) + line([(-75, 22, 48.5), (-29, 22, 68.5)], "#eef0f3", 2.5))
add(f'<circle cx="{P(*s0)[0]:.1f}" cy="{P(*s0)[1]:.1f}" r="5" fill="#1a1b1f"/>')
# 7) valigia destra (davanti a noi)
add(box(-113, -39, 34, 60, 40, 90, "url(#gsAlu)", "url(#gsAlu)"))
for (xa, za) in [(-113, 40), (-47, 40), (-113, 82), (-47, 82)]:
    add(poly([(xa, 60, za), (xa + 8, 60, za), (xa + 8, 60, za + 8), (xa, 60, za + 8)], "#1a1b1f", ' stroke="none"'))
add(poly([(-113, 60, 79), (-39, 60, 79), (-39, 60, 80.5), (-113, 60, 80.5)], "#4a4e57", ' stroke="none"'))
add(poly([(-84, 60, 72), (-70, 60, 72), (-70, 60, 77), (-84, 60, 77)], "#26282d"))
# 8) blocco motore
add(box(-27, 33, -22, 22, 28, 82, "url(#gsDark)", "url(#gsDark)"))
# 9) sella (dietro nera, davanti rossa)
add(box(-69, -33, -16, 16, 86, 100, "#1d1e22", "#1d1e22"))
add(box(-35, 15, -16, 16, 82, 94, "url(#gsRed)", "url(#gsRed)"))
# 10) zaino sulla schiena
add(box(-38, -24, -16, 16, 98, 140, "url(#gsRed)", "url(#gsRed)"))
# 11) gamba sinistra (sulla pedana)
add(limb([(-17, -10, 90), (17, -26, 78), (-1, -34, 46)], 15, "#272a31", "#1b1d22"))
add(line([(-3, -34, 44), (15, -34, 40)], "#141416", 11))
# 12) busto
add(line([(-17, 0, 96), (-4, 0, 128)], "#22252b", 46) + line([(-17, 0, 96), (-4, 0, 128)], "url(#gsJacket)", 42.5))
add(line([(-10, 22, 98), (0, 20, 128)], "#d23a33", 2.6) + line([(-12, 12, 118), (-4, 20, 120)], "#2f6fbf", 2))
# 13) braccio sinistro
add(limb([(-3, -20, 130), (21, -32, 118), (45, -46, 110)], 11, "#2c3038", "#1b1d22"))
# 14) serbatoio: fianco destro e strisce
tank = [(164, 106), (172, 96), (204, 88), (214, 94), (212, 104), (170, 110)]
add(poly([(x - 155, 20, 196 - y) for x, y in tank], "url(#gsWhite)"))
# 15) borsa da serbatoio
add(box(13, 52, -16, 16, 94, 117, "url(#gsDark)", "url(#gsDark)"))
add(poly([(13, 16, 108), (52, 16, 112), (52, 16, 116), (13, 16, 112)], "url(#gsRed)"))
# 16) ala destra del radiatore con la livrea HP
wing = [(168, 110), (212, 100), (226, 106), (230, 122), (214, 136), (180, 132)]
add(poly([(x - 155, 40, 196 - y) for x, y in wing], "url(#gsWhite)"))
for pts2, col in [([(176, 130), (214, 102), (220, 104), (186, 132)], "#2f6fbf"),
                  ([(188, 132), (221, 105), (225, 107), (196, 133)], "#16325c"),
                  ([(199, 134), (226, 109), (229, 116), (208, 135)], "#d23a33")]:
    add(poly([(x - 155, 40.5, 196 - y) for x, y in pts2], col, ' stroke="none"'))
# 17) gamba destra: il piede a terra
add(limb([(-17, 10, 90), (-5, 23, 57), (-1, 29, 20)], 15, "#2f333b"))
add(f'<circle cx="{P(-5, 24, 57)[0]:.1f}" cy="{P(-5, 24, 57)[1]:.1f}" r="4.5" fill="#4a4e57" stroke="none"/>')
add(line([(-2, 29, 22), (0, 30, 6), (12, 31, 3)], "#17181b", 12))
add(line([(-3, 30, 12), (8, 31, 10)], "#d23a33", 1.8))
# 18) cilindro destro del boxer, paramotore e borsa
add(box(11, 31, 20, 40, 36, 58, "#3a3e46", "#3a3e46"))
add(box(27, 57, 38, 58, 34, 60, "url(#gsSteel)", "url(#gsSteel)"))
add(poly([(31, 58.5, 38), (53, 58.5, 38), (53, 58.5, 56), (31, 58.5, 56)], "#26282d"))
cb = [(23, 24, 70), (52, 62, 66), (60, 68, 44), (44, 46, 26)]
add(line(cb, "#0c0c0b", 5) + line(cb, "#4a4e57", 2.6))
add(box(40, 70, 58, 74, 34, 62, "url(#gsDark)", "url(#gsDark)"))
add(poly([(40, 74, 54), (70, 74, 54), (70, 74, 62), (40, 74, 62)], "#d23a33"))
# 19) ruota anteriore, forcella, disco
add(line([(55, 11, 100), (76, 11, 36)], "#1d1e22", 7) + line([(66, 11, 70), (76, 11, 36)], "#c7ccd3", 4.5))
add(wheel(77, 35, 33, 24.5, 8))
disc = [P(*q) for q in circle_xz(77, 10, 35, 14.5)]
add(f'<polygon points="{pts(disc)}" fill="none" stroke="#b9bfc7" stroke-width="3"/>')
# 20) becco (fianco destro) con le strisce
beak = [(220, 108), (274, 124), (268, 129), (244, 132), (226, 127)]
add(poly([(x - 155, 9, 196 - y) for x, y in beak], "url(#gsWhite)"))
add(poly([(x - 155, 9.5, 196 - y) for x, y in [(236, 116), (272, 125), (269, 127), (240, 121)]], "#d23a33", ' stroke="none"'))
add(line([(81, 9.5, 69), (109, 9.5, 68)], "#2f6fbf", 2.4))
# 21) cupolino/maschera: fianco destro e faccia davanti col faro
nose = [(208, 86), (232, 92), (240, 106), (234, 114), (218, 112), (210, 98)]
add(poly([(x - 155, 20, 196 - y) for x, y in nose], "url(#gsWhite)"))
mask = [(142, 82), (178, 82), (182, 96), (176, 112), (144, 112), (138, 96)]
add(poly([(84, 160 - x, 196 - y) for x, y in mask], "url(#gsWhite)"))
add(poly([(85, 160 - x, 196 - y) for x, y in [(146, 90), (174, 90), (172, 108), (148, 108)]], "#1a1b1f"))
for (cx_, cy_, r_) in [(155, 99, 6), (167, 98.5, 4.4)]:
    lens = [P(*q) for q in circle_yz(86, 160 - cx_, 196 - cy_, r_)]
    add(f'<polygon points="{pts(lens)}" fill="#e8f2ff" stroke-width="1.2"/>')
# 22) casco con frontino e visiera verso di noi
hc = P(9, 0, 158)
add(f'<circle cx="{hc[0]:.1f}" cy="{hc[1]:.1f}" r="14" fill="url(#gsWhite)"/>')
add(f'<path d="M{hc[0]-10:.1f} {hc[1]-9:.1f} Q{hc[0]+6:.1f} {hc[1]-19:.1f} {hc[0]+19:.1f} {hc[1]-10:.1f} L{hc[0]+15:.1f} {hc[1]-5:.1f} Q{hc[0]+4:.1f} {hc[1]-11:.1f} {hc[0]-8:.1f} {hc[1]-4:.1f} Z" fill="#d23a33"/>')
add(f'<path d="M{hc[0]-2:.1f} {hc[1]-4:.1f} Q{hc[0]+9:.1f} {hc[1]-7:.1f} {hc[0]+14:.1f} {hc[1]-3:.1f} L{hc[0]+12:.1f} {hc[1]+6:.1f} Q{hc[0]+5:.1f} {hc[1]+8:.1f} {hc[0]-1:.1f} {hc[1]+5:.1f} Z" fill="url(#gsVisor)" stroke-width="1.2"/>')
add(f'<path d="M{hc[0]+1:.1f} {hc[1]+8:.1f} L{hc[0]+13:.1f} {hc[1]+8:.1f} L{hc[0]+9:.1f} {hc[1]+15:.1f} L{hc[0]-1:.1f} {hc[1]+14:.1f} Z" fill="url(#gsWhite)"/>')
add(f'<path d="M{hc[0]-12:.1f} {hc[1]-3:.1f} Q{hc[0]-8:.1f} {hc[1]-9:.1f} {hc[0]-2:.1f} {hc[1]-9:.1f}" stroke="#2f6fbf" stroke-width="2" fill="none"/>')
# 23) braccio destro verso la manopola
add(limb([(-3, 20, 130), (21, 32, 118), (45, 46, 110)], 12, "#3b414c"))
# 24) cupolino trasparente
add(poly([(70, -18, 106), (70, 18, 106), (52, 14, 146), (52, -14, 146)], "url(#gsScreen)", ' stroke-width="1.2"'))
# 25) manubrio, paramani, specchi, guanti
add(line([(45, -50, 110), (45, 50, 110)], "#1a1b1f", 4.5))
for s in (1, -1):
    add(poly([(50, s * 46, 104), (50, s * 58, 108), (50, s * 58, 118), (50, s * 46, 116)], "url(#gsWhite)"))
    add(line([(46, s * 48, 112), (40, s * 54, 136)], "#1a1b1f", 1.8))
    m = P(40, s * 55, 137)
    add(f'<ellipse cx="{m[0]:.1f}" cy="{m[1]:.1f}" rx="5" ry="3.4" fill="#26282d"/>')
for s in (1, -1):
    g = P(45, s * 46, 110)
    add(f'<circle cx="{g[0]:.1f}" cy="{g[1]:.1f}" r="5" fill="#17181b"/>')

body = "\n".join(svg)
print(f'''<svg class="km-ride-svg km-ride-svg--tq" viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <g stroke="#0c0c0b" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
{body}
  </g>
</svg>''')
