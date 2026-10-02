# CADO Elements - parametrische 3D-Bibliothek
# Aufruf:  blender -b -P cado_bricks.py -- [--quick] [--no-render] [--shots lineup,materials,hero,all]
#
# Erzeugt: glb/CADO_<code>.glb (+ cado_elements_all.glb, auch nach web/public/models), catalog.json,
#          renders/*.png und cado_bricks.blend
# Masse in mm laut Tabelle auf biest.com, Raster 30 mm. Ursprung jedes Steins: Mitte der Standflaeche.
# Materialien kommen aus web/src/builder/materials.json - dieselbe Datei liest der Web-Builder.

import bpy, bmesh, math, os, sys, json, shutil
from math import radians, sin, cos, tan, atan, pi
from mathutils import Vector, Matrix, noise as mnoise

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_RENDER = os.path.join(ROOT, "renders")
OUT_GLB = os.path.join(ROOT, "glb")
WEB_PUBLIC = os.path.join(ROOT, "web", "public")
MATERIALS_JSON = os.path.join(ROOT, "web", "src", "builder", "materials.json")
MM = 0.001
UV_UNIT = 0.1  # 1 UV-Einheit = 100 mm, damit kachelbare Texturen ueberall gleich gross sind

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
QUICK = "--quick" in argv
NO_RENDER = "--no-render" in argv
SHOTS = argv[argv.index("--shots") + 1].split(",") if "--shots" in argv else ["lineup", "materials", "hero", "all"]

with open(MATERIALS_JSON, encoding="utf-8") as fh:
    MATERIAL_DATA = json.load(fh)
SPECS = {m["id"]: m for m in MATERIAL_DATA["materials"]}


# ----------------------------------------------------------------------------- Profile

def rect(w, h):
    return [(0, 0), (w, 0), (w, h), (0, h)]


def arc(cx, cy, r, a0, a1, n):
    return [(cx + r * cos(radians(a0 + (a1 - a0) * k / n)),
             cy + r * sin(radians(a0 + (a1 - a0) * k / n))) for k in range(n + 1)]


def circle(r, n=128):
    return arc(0, 0, r, 0, 360, n)[:-1]


def quarter(r, n=48):
    return [(0, 0)] + arc(0, 0, r, 0, 90, n)


def half(r, n=64):
    return arc(0, 0, r, 0, 180, n)


def concave(size, r, n=40):
    # Wuerfelgrundriss mit viertelkreisfoermiger Hohlkehle an einer Ecke
    return [(0, 0), (size, 0)] + arc(size, size, r, 270, 180, n) + [(0, size)]


def pyramid(base, height):
    h = base / 2
    return ([(-h, -h, 0), (h, -h, 0), (h, h, 0), (-h, h, 0), (0, 0, height)],
            [(0, 1, 2, 3), (0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4)])


# Sonderprofile
TPROF = [(10, 0), (20, 0), (20, 10), (30, 10), (30, 20), (0, 20), (0, 10), (10, 10)]  # T-Profil, Steg unten
PACMAN = [(0, 0)] + arc(0, 0, 15, 90, 360, 96)  # Dreiviertelzylinder: in die Kerbe passt ein Viertelstab R15


# Linse (ALAIR): zwei Kreisboegen, 60 lang, 30 breit
LENS = arc(0, -22.5, 37.5, 36.87, 143.13, 40) + arc(0, 22.5, 37.5, 216.87, 323.13, 40)[1:-1]


def ramp(length, low=0):
    return [(0, 0), (length, 0), (0, 30)] if not low else [(0, 0), (length, 0), (length, low), (0, 30)]


# Eck-Tetraeder und sein Gegenstueck: zusammen ergeben 025 + 026 wieder einen Wuerfel
TETRA = ([(0, 0, 0), (30, 0, 0), (0, 30, 0), (0, 0, 30)], [(0, 1, 2), (0, 1, 3), (1, 2, 3), (0, 2, 3)])
CUT_CUBE = ([(0, 0, 0), (30, 0, 0), (30, 30, 0), (0, 30, 0), (0, 0, 30), (30, 0, 30), (0, 30, 30)],
            [(0, 1, 2, 3), (0, 1, 5, 4), (0, 3, 6, 4), (4, 5, 6), (1, 2, 5), (2, 3, 6), (5, 2, 6)])


# ----------------------------------------------------------------------------- Formen
# code: (Name, Bauart, Parameter, Faserrichtung, unsicher?)
# prism: (Profil, Laenge, Extrusionsachse) - Profil liegt in der Ebene senkrecht zur Achse
# poly:  (Ecken, Flaechen)
SHAPES = {
    "001": ("Wuerfel 30", "prism", (rect(30, 30), 30, "Z"), "Z", False),
    "002": ("Quader 30x30x60", "prism", (rect(30, 30), 60, "Z"), "Z", False),
    "003": ("Quader 30x30x90", "prism", (rect(30, 30), 90, "Z"), "Z", False),
    "004": ("Platte 30x30x10", "prism", (rect(30, 10), 30, "Y"), "Y", False),
    "005": ("Platte 30x30x5", "prism", (rect(30, 5), 30, "Y"), "Y", False),
    "006": ("Platte 30x60x10", "prism", (rect(30, 10), 60, "Y"), "Y", False),
    "007": ("Platte 30x90x10", "prism", (rect(30, 10), 90, "Y"), "Y", False),
    "008": ("Dreikant 30", "prism", ([(0, 0), (30, 0), (0, 30)], 30, "Y"), "Y", False),
    "009": ("Dreieckplatte 30x30x5", "prism", ([(0, 0), (30, 0), (0, 30)], 5, "Z"), "X", True),
    "010": ("Zylinder 30x30", "prism", (circle(15), 30, "Z"), "Z", False),
    "011": ("Zylinder 30x60", "prism", (circle(15), 60, "Z"), "Z", False),
    "012": ("Zylinder 30x90", "prism", (circle(15), 90, "Z"), "Z", False),
    "013": ("Wuerfel mit Hohlkehle", "prism", (concave(30, 20), 30, "Z"), "Z", True),
    "014": ("Stab 10x10x60", "prism", (rect(10, 10), 60, "Y"), "Y", False),
    "015": ("Stab 10x10x90", "prism", (rect(10, 10), 90, "Y"), "Y", False),
    "016": ("Stab 10x10x180", "prism", (rect(10, 10), 180, "Y"), "Y", False),
    "017": ("Wuerfel 10", "prism", (rect(10, 10), 10, "Z"), "Z", False),
    "018": ("Viertelzylinder R30x30", "prism", (quarter(30), 30, "Z"), "Z", False),
    "019": ("Halbzylinder 30x30", "prism", (half(15), 30, "Z"), "Z", True),
    "020": ("Rampe 30x30x10", "prism", ([(0, 0), (30, 0), (0, 10)], 30, "Y"), "Y", False),
    "021": ("Scheibe 30x5", "prism", (circle(15), 5, "Z"), "Z", False),
    "022": ("Dreikant 10", "prism", ([(0, 0), (10, 0), (0, 10)], 10, "Y"), "Y", False),
    "023": ("Halbscheibe 30x15", "prism", (half(15), 15, "Y"), "Y", True),
    "024": ("Quader 15x15x30", "prism", (rect(15, 15), 30, "Z"), "Z", False),
    "025": ("Eck-Tetraeder 30", "poly", TETRA, "Z", False),
    "026": ("Wuerfel mit Eckschnitt", "poly", CUT_CUBE, "Z", False),
    "027": ("Pyramide 30", "poly", pyramid(30, 30), "Z", False),
    "028": ("Dreikant 15x15x30", "prism", ([(0, 0), (15, 0), (0, 15)], 30, "Y"), "Y", False),
    "029": ("Pyramide flach 30x15", "poly", pyramid(30, 15), "Z", False),
    "030": ("Staebchen 10x10x30", "prism", (rect(10, 10), 30, "Y"), "Y", True),
    "031": ("Rhomboid 90", "prism", ([(0, 0), (60, 0), (90, 30), (30, 30)], 30, "Y"), "X", True),
    "035": ("Trapez 90", "prism", ([(0, 0), (90, 0), (60, 30), (30, 30)], 30, "Y"), "X", False),
    "036": ("Pultdach 30x30x60", "prism", ([(0, 0), (30, 0), (30, 30), (0, 60)], 30, "Y"), "Z", False),
    "037": ("Keil 45", "prism", ([(0, 0), (45, 0), (0, 45)], 30, "Y"), "Y", False),
    "041": ("Rundstab 10x10", "prism", (circle(5, 64), 10, "Z"), "Z", True),
    "042": ("Rundstab 10x30", "prism", (circle(5, 64), 30, "Z"), "Z", True),
    "043": ("Rundstab 10x60", "prism", (circle(5, 64), 60, "Z"), "Z", True),
    "044": ("Viertelzylinder R30x60", "prism", (quarter(30), 60, "Z"), "Z", False),
    "045": ("Viertelzylinder R30x90", "prism", (quarter(30), 90, "Z"), "Z", False),
    "046": ("Viertelstab R15x30", "prism", (quarter(15, 32), 30, "Z"), "Z", False),
    "047": ("Viertelstab R15x60", "prism", (quarter(15, 32), 60, "Z"), "Z", False),
    "048": ("Viertelstab R15x90", "prism", (quarter(15, 32), 90, "Z"), "Z", False),
    # --- Sonderformen: keine Masstabelle auf der Seite, Masse aus Fotos am 30-mm-Raster geschaetzt ---
    "039": ("Pfeiler 10x10x45", "prism", (rect(10, 10), 45, "Z"), "Z", False),
    "040": ("Platte 60x60x5", "prism", (rect(60, 5), 60, "Y"), "Y", False),
    "053": ("Stab 10x10x90", "prism", (rect(10, 10), 90, "Y"), "Y", False),
    "063": ("Rampe 65/30", "prism", (ramp(65), 30, "Y"), "X", True),
    "114": ("Rampe 90/30", "prism", (ramp(90), 30, "Y"), "X", False),
    "094": ("Pultkeil 30", "prism", (ramp(30, 10), 30, "Y"), "X", False),  # 30 -> 10 hoch, von Mike bestaetigt
    "095": ("Pultkeil 60", "prism", (ramp(60, 10), 30, "Y"), "X", False),
    "096": ("Pultkeil 90", "prism", (ramp(90, 10), 30, "Y"), "X", False),
    "120": ("Rhomboid 90", "prism", ([(0, 0), (60, 0), (90, 30), (30, 30)], 30, "Y"), "X", False),  # 90 ueber alles, 45 Grad, Kante 60 (wie 031)
    "123": ("Platte 30x120x5", "prism", (rect(30, 5), 120, "Y"), "Y", False),
    "121": ("Matte 60x90x5", "prism", (rect(60, 5), 90, "Y"), "Y", True),
    "135": ("Scheibe 30x10", "prism", (circle(15), 10, "Z"), "Z", True),
    "073": ("Zylinder 60x60", "prism", (circle(30), 60, "Z"), "Z", False),
    "074": ("Zylinder 60x90", "prism", (circle(30), 90, "Z"), "Z", False),
    "093": ("T-Profil 30", "prism", (TPROF, 30, "Y"), "Y", True),
    "065": ("T-Profil 60", "prism", (TPROF, 60, "Y"), "Y", True),
    "064": ("T-Profil 90", "prism", (TPROF, 90, "Y"), "Y", True),
    "049": ("Ring 30x10", "tube", (15, 5.5, 10), "Z", True),
    "058": ("Rohr 30x30", "tube", (15, 5.5, 30), "Z", True),
    "057": ("Rohr 30x60", "tube", (15, 5.5, 60), "Z", True),
    "056": ("Rohr 30x90", "tube", (15, 5.5, 90), "Z", True),
    "117": ("Dreiviertelzylinder 30", "prism", (PACMAN, 30, "Z"), "Z", True),
    "116": ("Dreiviertelzylinder 60", "prism", (PACMAN, 60, "Z"), "Z", True),
    "068": ("Schraegschnitt 30", "cut", (15, 3, 30), "Z", True),
    "067": ("Schraegschnitt 60", "cut", (15, 30, 60), "Z", True),
    # --- Design-Serie (25 EUR): Standardmasse auf 30x30-Basis, besondere Bauweise ---
    "GRI001": ("Gitterwuerfel 30", "cage", (30, 30, 30), "Z", True),
    "GRI002": ("Gitterquader 60", "cage", (30, 30, 60), "Z", True),
    "GRI003": ("Gitterquader 90", "cage", (30, 30, 90), "Z", True),
    "GRI004": ("Gitterplatte 30", "cage", (30, 30, 10), "Z", True),
    "GRI007": ("Gitterplatte 90", "cage", (30, 90, 10), "Z", True),
    "059": ("Holzrahmen 30", "frame", (30, 30, 30), "Z", True),
    "060": ("Holzrahmen 60", "frame", (30, 30, 60), "Z", True),
    "061": ("Holzrahmen 90", "frame", (30, 30, 90), "Z", True),
    "PAN001": ("Kugelwuerfel", "bubble", (1,), "Z", True),
    "PAN002": ("Kugelwuerfel 2-fach", "bubble", (2,), "Z", True),
    "PAN003": ("Kugelwuerfel 3-fach", "bubble", (3,), "Z", True),
    "ALWE001": ("Wuerfel mit Alu-Buchse", "holed", (30, "X"), "Z", True),
    "ALWE002": ("Quader 60 mit Alu-Buchsen", "holed", (60, "XY"), "Z", True),
    "ALWE003": ("Quader 90 mit Alu-Buchsen", "holed", (90, "XYX"), "Z", True),
    "AIR078": ("Linse 60x30x30", "prism", (LENS, 30, "Z"), "Z", True),
    "AIR079": ("Linse 60x30x60", "prism", (LENS, 60, "Z"), "Z", True),
    "PRO151": ("U-Profil 30", "prism", ([(0, 0), (30, 0), (30, 2.5), (2.5, 2.5), (2.5, 27.5), (30, 27.5), (30, 30), (0, 30)], 30, "Y"), "Y", True),
    "SSP012": ("Edelstahlrohr 30x90", "tube", (15, 14, 90), "Z", True),
    "MOX003": ("Acrylbox mit Moos", "hollow", (30, 30, 90, 2), "Z", True),
    "LEGO003": ("Lederblock 90", "leatherblock", (30, 90), "Z", True),
    "MOO001": ("Moos-Wuerfel 30", "moss", ("box", 30, 30), "Z", True),
    "MOO002": ("Moos-Quader 60", "moss", ("box", 30, 60), "Z", True),
    "MOO003": ("Moos-Quader 90", "moss", ("box", 30, 90), "Z", True),
    "MOO010": ("Moos-Zylinder 30", "moss", ("round", 30, 30), "Z", True),
    "MOO011": ("Moos-Zylinder 60", "moss", ("round", 30, 60), "Z", True),
    "MOO012": ("Moos-Zylinder 90", "moss", ("round", 30, 90), "Z", True),
}

DESIGN_PRICE = 25
NO_BEVEL = {"cage", "frame", "bubble", "holed", "leatherblock", "moss"}  # Boolesche/zusammengesetzte Netze: Kanten per Winkel scharf statt Fase


# ----------------------------------------------------------------------------- Geometrie

def build_prism(profile, length, axis):
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    n = len(profile)

    def P(a, b, t):
        if axis == "Z":
            return (a * MM, b * MM, t * MM)
        if axis == "Y":
            return (a * MM, t * MM, b * MM)
        return (t * MM, a * MM, b * MM)

    v0 = [bm.verts.new(P(a, b, 0)) for a, b in profile]
    v1 = [bm.verts.new(P(a, b, length)) for a, b in profile]
    cum = [0.0]
    for i in range(n):
        a0, b0 = profile[i]
        a1, b1 = profile[(i + 1) % n]
        cum.append(cum[-1] + math.hypot(a1 - a0, b1 - b0))

    for ring in (v0, v1):
        index = {v: i for i, v in enumerate(ring)}
        f = bm.faces.new(ring)
        for loop in f.loops:
            a, b = profile[index[loop.vert]]
            loop[uv].uv = (a * MM / UV_UNIT, b * MM / UV_UNIT)
    for i in range(n):
        j = (i + 1) % n
        f = bm.faces.new((v0[i], v0[j], v1[j], v1[i]))
        uvs = ((cum[i], 0), (cum[i + 1], 0), (cum[i + 1], length), (cum[i], length))
        for loop, (u, v) in zip(f.loops, uvs):
            loop[uv].uv = (u * MM / UV_UNIT, v * MM / UV_UNIT)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    return bm


def build_poly(verts, faces):
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    vs = [bm.verts.new((x * MM, y * MM, z * MM)) for x, y, z in verts]
    for idx in faces:
        bm.faces.new([vs[i] for i in idx])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.normal_update()
    for f in bm.faces:
        t = f.normal.orthogonal().normalized()
        b = f.normal.cross(t)
        for loop in f.loops:
            loop[uv].uv = (loop.vert.co.dot(t) / UV_UNIT, loop.vert.co.dot(b) / UV_UNIT)
    return bm


def planar_uvs(bm, uv):
    bm.normal_update()
    for f in bm.faces:
        t = f.normal.orthogonal().normalized()
        b = f.normal.cross(t)
        for loop in f.loops:
            loop[uv].uv = (loop.vert.co.dot(t) / UV_UNIT, loop.vert.co.dot(b) / UV_UNIT)


def build_tube(r_out, r_in, height, n=96):
    # Rohr: in die Bohrung passen die Rundstaebe 041-043
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")

    def ring(r, z):
        return [bm.verts.new((r * cos(2 * pi * k / n) * MM, r * sin(2 * pi * k / n) * MM, z * MM)) for k in range(n)]

    o0, i0, o1, i1 = ring(r_out, 0), ring(r_in, 0), ring(r_out, height), ring(r_in, height)
    for k in range(n):
        j = (k + 1) % n
        bm.faces.new((o0[k], o0[j], o1[j], o1[k]))
        bm.faces.new((i0[j], i0[k], i1[k], i1[j]))
        bm.faces.new((o0[j], o0[k], i0[k], i0[j]))
        bm.faces.new((o1[k], o1[j], i1[j], i1[k]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    planar_uvs(bm, uv)
    return bm


def build_cut(r, h_low, h_high, n=96):
    # Zylinder mit schraeg abgeschnittenem Kopf
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    pts = [(r * cos(2 * pi * k / n), r * sin(2 * pi * k / n)) for k in range(n)]
    bottom = [bm.verts.new((x * MM, y * MM, 0)) for x, y in pts]
    top = [bm.verts.new((x * MM, y * MM, (h_low + (h_high - h_low) * (x + r) / (2 * r)) * MM)) for x, y in pts]
    bm.faces.new(bottom)
    bm.faces.new(top)
    for k in range(n):
        j = (k + 1) % n
        bm.faces.new((bottom[k], bottom[j], top[j], top[k]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    planar_uvs(bm, uv)
    return bm


def add_box(bm, x0, y0, z0, x1, y1, z1, flip=False):
    v = [bm.verts.new((x * MM, y * MM, z * MM)) for x, y, z in (
        (x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1))]
    quads = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    for q in quads:
        idx = q[::-1] if flip else q
        bm.faces.new([v[i] for i in idx])


def steps(length, pitch):
    n = round(length / pitch)
    return [length * k / n for k in range(n + 1)]


def build_cage(w, d, h, pitch=3.0, t=0.8):
    # Gitterkoerper: Drahtnetz auf allen sechs Flaechen, Aussenmass wie der massive Stein
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    c = lambda v, hi: min(max(v - t / 2, 0), hi - t)  # Draht bleibt innerhalb der Huelle
    for x in steps(w, pitch):
        for y in (0, d - t):
            add_box(bm, c(x, w), y, 0, c(x, w) + t, y + t, h)          # senkrecht, vorn/hinten
        for z in (0, h - t):
            add_box(bm, c(x, w), 0, z, c(x, w) + t, d, z + t)          # Boden/Deckel laengs y
    for y in steps(d, pitch):
        for x in (0, w - t):
            add_box(bm, x, c(y, d), 0, x + t, c(y, d) + t, h)          # senkrecht, links/rechts
        for z in (0, h - t):
            add_box(bm, 0, c(y, d), z, w, c(y, d) + t, z + t)          # Boden/Deckel laengs x
    for z in steps(h, pitch):
        for y in (0, d - t):
            add_box(bm, 0, y, c(z, h), w, y + t, c(z, h) + t)          # Ringe vorn/hinten
        for x in (0, w - t):
            add_box(bm, x, 0, c(z, h), x + t, d, c(z, h) + t)          # Ringe links/rechts
    planar_uvs(bm, uv)
    return bm


def build_frame(w, d, h, t=3.5):
    # Holzrahmen: nur die zwoelf Kanten
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    for x in (0, w - t):
        for y in (0, d - t):
            add_box(bm, x, y, 0, x + t, y + t, h)
    for z in (0, h - t):
        for y in (0, d - t):
            add_box(bm, t, y, z, w - t, y + t, z + t)
        for x in (0, w - t):
            add_box(bm, x, t, z, x + t, d - t, z + t)
    planar_uvs(bm, uv)
    return bm


def build_hollow(w, d, h, wall):
    # geschlossene Box mit Hohlraum (Innenflaechen nach innen gerichtet -> Volumen stimmt)
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    add_box(bm, 0, 0, 0, w, d, h)
    add_box(bm, wall, wall, wall, w - wall, d - wall, h - wall, flip=True)
    planar_uvs(bm, uv)
    return bm


def temp_object(bm, name="tmp"):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def boolean(base, cutter, operation):
    mod = base.modifiers.new("bool", "BOOLEAN")
    mod.operation = operation
    mod.object = cutter
    mod.solver = "EXACT"
    bpy.context.view_layer.update()
    me = bpy.data.meshes.new_from_object(base.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    out = bpy.data.objects.new(base.name, me)
    bpy.context.scene.collection.objects.link(out)
    for ob in (base, cutter):
        bpy.data.objects.remove(ob, do_unlink=True)
    return out


def to_bmesh(ob):
    bm = bmesh.new()
    bm.from_mesh(ob.data)
    bpy.data.objects.remove(ob, do_unlink=True)
    uv = bm.loops.layers.uv.verify()
    planar_uvs(bm, uv)
    return bm


def sphere_bm(radius, z=0.0):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=72, v_segments=36, radius=radius * MM)
    bmesh.ops.translate(bm, verts=bm.verts[:], vec=Vector((0, 0, z * MM)))
    return bm


def build_bubble(count):
    # Kugelwuerfel: Wuerfel, aussen kugelig gerundet, innen Hohlkugel -> grosse runde Oeffnungen auf allen Seiten
    out = None
    for k in range(count):
        z = 15 + 30 * k
        cube = bmesh.new()
        bmesh.ops.create_cube(cube, size=30 * MM)
        bmesh.ops.translate(cube, verts=cube.verts[:], vec=Vector((0, 0, z * MM)))
        unit = boolean(temp_object(cube), temp_object(sphere_bm(20.5, z)), "INTERSECT")
        unit = boolean(unit, temp_object(sphere_bm(18.0, z)), "DIFFERENCE")
        out = unit if out is None else boolean(out, unit, "UNION")
    return to_bmesh(out)


def cylinder_bm(radius, length, axis, z):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=64, radius1=radius * MM, radius2=radius * MM, depth=length * MM)
    rot = Matrix.Rotation(radians(90), 4, "Y" if axis == "X" else "X")
    bmesh.ops.rotate(bm, verts=bm.verts[:], cent=(0, 0, 0), matrix=rot)
    bmesh.ops.translate(bm, verts=bm.verts[:], vec=Vector((0, 0, z * MM)))
    return bm


def build_holed(height, axes, r_hole=8.5, r_in=7.0):
    # Quader mit Querbohrungen je 30-mm-Etage, abwechselnd in x und y; die Alu-Buchsen sind ein eigenes Teil
    block = bmesh.new()
    bmesh.ops.create_cube(block, size=1.0)
    bmesh.ops.scale(block, verts=block.verts[:], vec=(30 * MM, 30 * MM, height * MM))
    bmesh.ops.translate(block, verts=block.verts[:], vec=Vector((0, 0, height / 2 * MM)))
    body = temp_object(block)
    liners = bmesh.new()
    for k, axis in enumerate(axes):
        z = 15 + 30 * k
        body = boolean(body, temp_object(cylinder_bm(r_hole, 40, axis, z)), "DIFFERENCE")
        tube = build_tube(r_hole, r_in, 30, 64)
        bmesh.ops.translate(tube, verts=tube.verts[:], vec=Vector((0, 0, -15 * MM)))
        bmesh.ops.rotate(tube, verts=tube.verts[:], cent=(0, 0, 0), matrix=Matrix.Rotation(radians(90), 4, "Y" if axis == "X" else "X"))
        bmesh.ops.translate(tube, verts=tube.verts[:], vec=Vector((0, 0, z * MM)))
        tmp = bpy.data.meshes.new("liner")
        tube.to_mesh(tmp)
        tube.free()
        liners.from_mesh(tmp)
        bpy.data.meshes.remove(tmp)
    return to_bmesh(body), liners


def rounded_square(h, r, n=8, div=6):
    # Umriss eines Quadrats (Halbmass h) mit Eckradius r, gegen den Uhrzeigersinn; gerade Seiten unterteilt
    pts = []
    for cx, cy, a0 in ((h - r, h - r, 0), (-(h - r), h - r, 90), (-(h - r), -(h - r), 180), (h - r, -(h - r), 270)):
        for k in range(n + 1):
            a = radians(a0 + 90 * k / n)
            pts.append((cx + r * cos(a), cy + r * sin(a)))
        nx, ny = ((-(h - r), h), (-h, -(h - r)), (h - r, -h), (h, h - r))[a0 // 90]
        lx, ly = pts[-1]
        for k in range(1, div):
            pts.append((lx + (nx - lx) * k / div, ly + (ny - ly) * k / div))
    return pts


def build_leather_block(size, length):
    # Gepolsterter, in Velours eingeschlagener Block: runde Laengskanten, leicht kissenfoermig,
    # Stirnseiten mit umlaufendem Wulst und vertieftem Spiegel, Ueberlappungsnaht an einer Laengsseite
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    h, r, re = size / 2 - 0.4, 4.5, 3.2  # 0,4 mm Polsterwoelbung -> Aussenmass bleibt das Nennmass
    rings = []  # (Einzug, z)
    cap = [(5.6, 1.2), (4.7, 1.0), (4.0, 0.0), (re, 0.0)]  # Spiegel -> Wulst
    quarter_steps = [(re * (1 - sin(radians(90 * k / 5))), re * (1 - cos(radians(90 * k / 5)))) for k in range(1, 6)]
    body = [(-0.4 * sin(pi * t / 8), re + (length - 2 * re) * t / 8) for t in range(1, 8)]
    rings = cap + quarter_steps + body
    rings += [(d, length - z) for d, z in reversed(cap + quarter_steps)]
    loops = []
    for d, z in rings:
        loop = []
        for x, y in rounded_square(h - d, max(r - d, 0.4)):
            if 1.0 < z < length - 1.0 and x > h - d - 0.01:  # Naht: oberhalb des ueberlappenden Streifens springt die Flaeche zurueck
                x -= 0.5 * min(max((y + h - 5.0) / 1.2, 0), 1)
            loop.append(bm.verts.new((x * MM, y * MM, z * MM)))
        loops.append(loop)
    n = len(loops[0])
    for a, b in zip(loops, loops[1:]):
        for i in range(n):
            j = (i + 1) % n
            bm.faces.new((a[i], a[j], b[j], b[i]))
    bm.faces.new(list(reversed(loops[0])))
    bm.faces.new(loops[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    planar_uvs(bm, uv)
    return bm


def build_moss(form, size, height, origin=(0.0, 0.0, 0.0)):
    # Moospolster: feines Netz, das nach innen knubbelig eingedrueckt wird - die Huelle bleibt das Nennmass
    bm = bmesh.new()
    if form == "box":
        bmesh.ops.create_cube(bm, size=1.0)
        bmesh.ops.scale(bm, verts=bm.verts[:], vec=(size * MM, size * MM, height * MM))
    else:
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=True, segments=32, radius1=size / 2 * MM, radius2=size / 2 * MM, depth=height * MM)
    bmesh.ops.translate(bm, verts=bm.verts[:], vec=Vector((origin[0] * MM, origin[1] * MM, (origin[2] + height / 2) * MM)))
    for _ in range(6):
        long_edges = [e for e in bm.edges if e.calc_length() > 3.6 * MM]
        if not long_edges:
            break
        bmesh.ops.subdivide_edges(bm, edges=long_edges, cuts=1, use_grid_fill=True)
    bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 4])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])  # Normalen sicher nach aussen
    bm.normal_update()
    base = origin[2] * MM
    cx, cy, half = origin[0] * MM, origin[1] * MM, size / 2 * MM
    for v in bm.verts:
        if v.co.z < base + 0.3 * MM:
            continue  # Standflaeche bleibt eben
        p = v.co * 130.0
        lump = mnoise.turbulence(p, 3, False, noise_basis='PERLIN_ORIGINAL')
        fine = mnoise.turbulence(p * 3.1, 2, False, noise_basis='PERLIN_ORIGINAL')
        v.co -= v.normal * (0.3 + 3.0 * lump + 0.9 * fine) * MM
        # Huelle bleibt das Nennmass
        v.co.z = min(max(v.co.z, base), base + height * MM)
        if form == "box":
            v.co.x = min(max(v.co.x, cx - half), cx + half)
            v.co.y = min(max(v.co.y, cy - half), cy + half)
        else:
            r = math.hypot(v.co.x - cx, v.co.y - cy)
            if r > half:
                v.co.x, v.co.y = cx + (v.co.x - cx) * half / r, cy + (v.co.y - cy) * half / r
    uv = bm.loops.layers.uv.new("UVMap")
    planar_uvs(bm, uv)
    return bm


def build_moss_insert(w, d, h, wall):
    g = wall + 0.4
    return build_moss("box", w - 2 * g, h - 2 * g, origin=(w / 2, d / 2, g))


def finish_mesh(bm, name, bevel_edges=True, offset=None):
    xs, ys, zs = zip(*[v.co[:] for v in bm.verts])
    if offset is None:
        offset = Vector((-(min(xs) + max(xs)) / 2, -(min(ys) + max(ys)) / 2, -min(zs)))
    bmesh.ops.translate(bm, verts=bm.verts[:], vec=offset)
    dims = (max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs))
    volume_cm3 = abs(bm.calc_volume()) * 1e6
    if not bevel_edges:
        for f in bm.faces:
            f.smooth = True
        me = bpy.data.meshes.new(name)
        bm.to_mesh(me)
        bm.free()
        try:
            me.set_sharp_from_angle(angle=radians(32))
        except Exception:
            pass
        me.materials.append(None)
        return me, dims, volume_cm3, offset

    # leicht gebrochene Kanten wie am echten Stein; Mantelkanten runder Formen bleiben weich
    bevel = min(0.45, min(dims) / MM * 0.07) * MM
    sharp = [e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0.0) > radians(20)]
    bmesh.ops.bevel(bm, geom=sharp, offset=bevel, offset_type="OFFSET", segments=3,
                    profile=0.5, affect="EDGES", clamp_overlap=True)
    for f in bm.faces:
        f.smooth = True
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(None)
    return me, dims, volume_cm3, offset


INSERTS = {}
DESIGN_CODES = {c for c in SHAPES if not c.isdigit()} | {"059", "060", "061"}


def build_library(coll):
    lib, catalog = {}, []
    for code, (label, kind, params, grain, unsure) in SHAPES.items():
        insert_bm, insert_mat = None, None
        if kind == "holed":
            bm, insert_bm = build_holed(*params)
            insert_mat = "aluminium"
        elif kind == "hollow":
            bm = build_hollow(*params)
            insert_bm, insert_mat = build_moss_insert(*params), "moss"
        else:
            bm = {"prism": build_prism, "poly": build_poly, "tube": build_tube, "cut": build_cut,
                  "cage": build_cage, "frame": build_frame, "bubble": build_bubble,
                  "leatherblock": build_leather_block, "moss": build_moss}[kind](*params)
        me, dims, vol, offset = finish_mesh(bm, f"CADO_{code}", bevel_edges=kind not in NO_BEVEL)
        ob = bpy.data.objects.new(f"CADO_{code}", me)
        wn = ob.modifiers.new("WeightedNormal", "WEIGHTED_NORMAL")
        wn.keep_sharp = kind in NO_BEVEL and kind != "leatherblock"
        wn.weight = 50
        if insert_bm is not None:
            ime, _, ivol, _ = finish_mesh(insert_bm, f"CADO_{code}_INS", bevel_edges=False, offset=offset)
            ins = bpy.data.objects.new(f"CADO_{code}_INS", ime)
            ins["insert_material"] = insert_mat
            coll.objects.link(ins)
            INSERTS[code] = (ins, insert_mat)
        ob["cado_code"] = code
        ob["cado_name"] = label
        ob["grain_axis"] = grain
        ob["dims_mm"] = [round(d / MM, 2) for d in dims]
        ob["volume_cm3"] = round(vol, 3)
        coll.objects.link(ob)
        lib[code] = ob
        catalog.append({
            "code": code, "name": label, "dims_mm": [round(d / MM, 2) for d in dims],
            "volume_cm3": round(vol, 3), "grain_axis": grain, "form_unsicher": unsure,
        })
        if code in DESIGN_CODES:
            catalog[-1]["price"] = DESIGN_PRICE
        if code in INSERTS:
            catalog[-1]["insert"] = INSERTS[code][1]
    return lib, catalog


# ----------------------------------------------------------------------------- Material-Bausteine

def new_mat(name):
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(bsdf.outputs[0], out.inputs[0])
    return m, nt, bsdf, out


def node(nt, kind, **props):
    n = nt.nodes.new(kind)
    for k, v in props.items():
        setattr(n, k, v)
    return n


def setin(n, **vals):
    for k, v in vals.items():
        n.inputs[k.replace("_", " ")].default_value = v


def rgba(c):
    return (c[0], c[1], c[2], 1.0)


def math_node(nt, op, a, b=None):
    n = node(nt, "ShaderNodeMath", operation=op)
    for i, x in enumerate((a, b)):
        if x is None:
            continue
        if isinstance(x, (int, float)):
            n.inputs[i].default_value = x
        else:
            nt.links.new(x, n.inputs[i])
    return n.outputs[0]


def ramp_node(nt, fac, stops, interpolation="LINEAR"):
    r = node(nt, "ShaderNodeValToRGB")
    r.color_ramp.interpolation = interpolation
    els = r.color_ramp.elements
    while len(els) < len(stops):
        els.new(0.5)
    for el, (pos, col) in zip(els, stops):
        el.position = pos
        el.color = rgba(col)
    nt.links.new(fac, r.inputs[0])
    return r.outputs[0]


def mix_color(nt, a, b, fac=1.0, blend="MULTIPLY"):
    mx = node(nt, "ShaderNodeMix", data_type="RGBA", blend_type=blend)
    for sock, val in ((mx.inputs[0], fac), (mx.inputs[6], a), (mx.inputs[7], b)):
        if isinstance(val, (int, float)):
            sock.default_value = val
        elif isinstance(val, (tuple, list)):
            sock.default_value = rgba(val)
        else:
            nt.links.new(val, sock)
    return mx.outputs[2]


def noise(nt, vec, scale, detail=2.0, roughness=0.5, distortion=0.0):
    n = node(nt, "ShaderNodeTexNoise")
    setin(n, Scale=scale, Detail=detail, Roughness=roughness, Distortion=distortion)
    nt.links.new(vec, n.inputs["Vector"])
    return n.outputs[0]


def map_range(nt, value, to_min, to_max, from_min=0.0, from_max=1.0):
    mr = node(nt, "ShaderNodeMapRange")
    setin(mr, From_Min=from_min, From_Max=from_max, To_Min=to_min, To_Max=to_max)
    nt.links.new(value, mr.inputs["Value"])
    return mr.outputs[0]


def obj_coords(nt, spread):
    # Objektkoordinaten + Zufallsversatz je Stein: kein Stein gleicht dem anderen
    tc = node(nt, "ShaderNodeTexCoord")
    oi = node(nt, "ShaderNodeObjectInfo")
    comb = node(nt, "ShaderNodeCombineXYZ")
    for i, k in enumerate((0.731, 1.913, 1.377)):
        nt.links.new(math_node(nt, "MULTIPLY", oi.outputs["Random"], k * spread), comb.inputs[i])
    add = node(nt, "ShaderNodeVectorMath", operation="ADD")
    nt.links.new(tc.outputs["Object"], add.inputs[0])
    nt.links.new(comb.outputs[0], add.inputs[1])
    return add.outputs[0]


def mapping(nt, vec, loc=(0, 0, 0), rot=(0, 0, 0), scale=(1, 1, 1)):
    mp = node(nt, "ShaderNodeMapping", vector_type="POINT")
    mp.inputs["Location"].default_value = loc
    mp.inputs["Rotation"].default_value = rot
    mp.inputs["Scale"].default_value = scale
    nt.links.new(vec, mp.inputs["Vector"])
    return mp.outputs[0]


def bump(nt, bsdf, height, distance, strength=1.0):
    b = node(nt, "ShaderNodeBump")
    setin(b, Strength=strength, Distance=distance)
    nt.links.new(height, b.inputs["Height"])
    nt.links.new(b.outputs[0], bsdf.inputs["Normal"])


def base_props(bsdf, spec):
    setin(bsdf, Roughness=spec.get("roughness", 0.5), Metallic=spec.get("metalness", 0.0))
    if spec.get("clearcoat"):
        setin(bsdf, Coat_Weight=spec["clearcoat"], Coat_Roughness=0.12)


# ----------------------------------------------------------------------------- Material-Arten

GRAIN_ROT = {"Z": (0, 0, 0), "Y": (radians(90), 0, 0), "X": (0, radians(-90), 0)}


def make_wood(spec, grain):
    # echte Volumentextur: Jahresringe um eine Stammachse -> Hirnholz und Laengsholz stimmen automatisch
    p = spec["params"]
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}_{grain}")
    base_props(bsdf, spec)
    trunk = mapping(nt, obj_coords(nt, 0.08), rot=GRAIN_ROT[grain])
    rings_co = mapping(nt, trunk, loc=(0.055, 0.03, 0), scale=(1, 1, 0.1))
    scale = 0.314159 / p["ring"]
    wave = node(nt, "ShaderNodeTexWave", wave_type="RINGS", rings_direction="Z", wave_profile="SAW")
    setin(wave, Scale=scale, Distortion=p["distortion"] * 2 * pi, Detail=3.0,
          Detail_Scale=p["detail"] / scale, Detail_Roughness=0.55)
    nt.links.new(rings_co, wave.inputs["Vector"])
    color = ramp_node(nt, wave.outputs[1], [(pos, col) for pos, col in p["stops"]])
    pores = noise(nt, mapping(nt, trunk, scale=(1, 1, 0.04)), 2200.0, 4.0, 0.6)
    fiber = p["fiber"]
    shade = map_range(nt, pores, 1.0 - fiber, 1.0 + fiber * 0.3, 0.25, 0.75)
    nt.links.new(mix_color(nt, color, shade), bsdf.inputs["Base Color"])
    bump(nt, bsdf, pores, 0.00015, 0.6)
    return m


def make_plain(spec, grain):
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    setin(bsdf, Base_Color=rgba(spec["params"]["color"]))
    if spec["params"].get("emission"):
        setin(bsdf, Emission_Strength=spec["params"]["emission"])
        bsdf.inputs["Emission Color"].default_value = rgba(spec["params"]["color"])
    if spec["params"].get("subsurface"):
        setin(bsdf, Subsurface_Weight=spec["params"]["subsurface"], Subsurface_Scale=0.006)
        bsdf.inputs["Subsurface Radius"].default_value = (1.0, 0.6, 0.25)
    if spec.get("metalness"):
        rough = spec["roughness"]
        scratch = noise(nt, mapping(nt, obj_coords(nt, 1.0), scale=(1, 1, 0.03)), 900.0, 5.0, 0.7)
        nt.links.new(map_range(nt, scratch, rough * 0.6, rough * 1.7), bsdf.inputs["Roughness"])
    return m


def make_duo(spec, grain):
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    a, b = spec["params"]["colors"]
    sep = node(nt, "ShaderNodeSeparateXYZ")
    nt.links.new(node(nt, "ShaderNodeTexCoord").outputs["Normal"], sep.inputs[0])
    side = math_node(nt, "GREATER_THAN", math_node(nt, "ABSOLUTE", sep.outputs[0]), 0.7)
    nt.links.new(mix_color(nt, a, b, side, "MIX"), bsdf.inputs["Base Color"])
    return m


def make_camo(spec, grain):
    p = spec["params"]
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    n = noise(nt, obj_coords(nt, 1.0), p["scale"], 1.5, 0.45, 0.9)
    stops = list(zip((0.0, 0.43, 0.5, 0.58), p["colors"]))
    nt.links.new(ramp_node(nt, n, stops, "CONSTANT"), bsdf.inputs["Base Color"])
    return m


def make_marble(spec, grain):
    p = spec["params"]
    base, vein = p["base"], p["vein"]
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    co = obj_coords(nt, 1.0)
    veins = noise(nt, co, p["scale"] * 1.2, 7.0, 0.58, p["warp"] * 1.15)
    ridge = math_node(nt, "MULTIPLY", math_node(nt, "ABSOLUTE", math_node(nt, "SUBTRACT", veins, 0.5)), 2.0)
    mid = [(a + 2 * b) / 3 for a, b in zip(vein, base)]
    vein_col = ramp_node(nt, ridge, [(0.0, vein), (p["width"] * 0.45, mid), (p["width"] * 2.0, base)])
    # Adern laufen aus (Verlauf entlang der Ader) und sind je Stein verschieden stark (Zufall je Objekt)
    run = map_range(nt, noise(nt, co, 5.0, 2.0, 0.5), 0.3, 1.0, 0.25, 0.7)
    amount = map_range(nt, node(nt, "ShaderNodeObjectInfo").outputs["Random"], 0.25, 1.2)
    veined = mix_color(nt, base, vein_col, math_node(nt, "MULTIPLY", run, amount), "MIX")
    # feine Nebenadern: schmal und schwach
    fine = noise(nt, co, p["scale"] * 2.9, 5.0, 0.55, p["warp"] * 0.6)
    ridge2 = math_node(nt, "MULTIPLY", math_node(nt, "ABSOLUTE", math_node(nt, "SUBTRACT", fine, 0.5)), 2.0)
    fine_mask = map_range(nt, ridge2, 1.0, 0.0, 0.0, p["width"] * 0.7)
    veined = mix_color(nt, veined, vein, math_node(nt, "MULTIPLY", fine_mask, math_node(nt, "MULTIPLY", amount, 0.4)), "MIX")
    clouds = noise(nt, co, 14.0, 5.0, 0.55, 0.6)
    cloud_col = ramp_node(nt, clouds, [(0.35, p["cloud"]), (0.7, (1, 1, 1))])
    nt.links.new(mix_color(nt, veined, cloud_col), bsdf.inputs["Base Color"])
    if p.get("subsurface"):
        setin(bsdf, Subsurface_Weight=p["subsurface"], Subsurface_Scale=0.0015)
        bsdf.inputs["Subsurface Radius"].default_value = (1, 1, 1)
    return m


def make_onyx(spec, grain):
    # CADO-Onyx: milchig, leicht durchscheinend, weiche Honig-Wolken und rosa Zonen - keine Baender
    p = spec["params"]
    cream, honey, milk, pink = p["colors"]
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    co = obj_coords(nt, 1.0)
    col = ramp_node(nt, noise(nt, co, 22.0, 4.0, 0.55), [(0.42, cream), (0.66, honey)])
    col = mix_color(nt, col, milk, map_range(nt, noise(nt, mapping(nt, co, loc=(17, 17, 17)), 9.0, 3.0, 0.5), 0.0, 1.0, 0.55, 0.75), "MIX")
    col = mix_color(nt, col, pink, math_node(nt, "MULTIPLY", map_range(nt, noise(nt, mapping(nt, co, loc=(41, 41, 41)), 14.0, 3.0, 0.5), 0.0, 1.0, 0.6, 0.7), 0.6), "MIX")
    nt.links.new(mix_color(nt, col, map_range(nt, noise(nt, co, 700.0, 2.0, 0.6), 0.94, 1.06)), bsdf.inputs["Base Color"])
    setin(bsdf, Transmission_Weight=p.get("transmission", 0.5), Subsurface_Weight=0.3, Subsurface_Scale=0.004)
    bsdf.inputs["Subsurface Radius"].default_value = (1.0, 0.7, 0.4)
    return m


def make_granite(spec, grain):
    p = spec["params"]
    a, b, c = p["colors"]
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    co = obj_coords(nt, 1.0)
    crystals = ramp_node(nt, noise(nt, co, p["scale"], 1.0, 0.5), [(0.44, a), (0.56, b)])
    specks = math_node(nt, "GREATER_THAN", noise(nt, co, p["scale"] * 2.3, 0.0), 0.68)
    nt.links.new(mix_color(nt, crystals, c, specks, "MIX"), bsdf.inputs["Base Color"])
    return m


def make_sandstone(spec, grain):
    base, dark = spec["params"]["colors"]
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    co = obj_coords(nt, 1.0)
    bedding = noise(nt, mapping(nt, co, scale=(1, 1, 8)), 14.0, 3.0, 0.5)
    col = ramp_node(nt, bedding, [(0.35, dark), (0.65, base)])
    grainy = noise(nt, co, 1500.0, 3.0, 0.7)
    nt.links.new(mix_color(nt, col, map_range(nt, grainy, 0.86, 1.08)), bsdf.inputs["Base Color"])
    bump(nt, bsdf, grainy, 0.0002, 0.8)
    return m


def make_concrete(spec, grain):
    p = spec["params"]
    gain = p.get("blender_gain", 1.0)
    dark, light = ([c * gain for c in col] for col in p["colors"])
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    co = obj_coords(nt, 1.0)
    base = ramp_node(nt, noise(nt, co, 30.0, 4.0, 0.55), [(0.35, dark), (0.65, light)])  # zarte Wolken
    fine = noise(nt, co, 2600.0, 4.0, 0.75)  # feines Korn
    nt.links.new(mix_color(nt, base, map_range(nt, fine, 0.86, 1.1)), bsdf.inputs["Base Color"])
    # Lunker: duenn gestreute kleine Poren
    vor = node(nt, "ShaderNodeTexVoronoi", feature="F1")
    setin(vor, Scale=420.0)
    nt.links.new(co, vor.inputs["Vector"])
    pit = math_node(nt, "MULTIPLY", math_node(nt, "LESS_THAN", vor.outputs["Distance"], 0.16),
                    math_node(nt, "GREATER_THAN", noise(nt, co, 70.0, 2.0), 0.58))
    bump(nt, bsdf, math_node(nt, "SUBTRACT", math_node(nt, "MULTIPLY", fine, 0.25), pit), 0.0004, 1.0)
    return m


def make_rust(spec, grain):
    # nach Referenzfotos: Zonen aus dunkler Kruste und orangem Pulver, Fleckung, Koernung, Schuppen mit Rissen, Poren
    colors = spec["params"]["colors"]
    c0, c1, c2 = colors[:3]
    c3 = colors[3] if len(colors) > 3 else c2
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    co = obj_coords(nt, 1.0)
    zone = noise(nt, co, 28.0, 4.0, 0.6)
    mottle = noise(nt, mapping(nt, co, loc=(5, 5, 5)), 95.0, 4.0, 0.6)
    mixed = math_node(nt, "ADD", math_node(nt, "MULTIPLY", zone, 0.6), math_node(nt, "MULTIPLY", mottle, 0.4))
    col = ramp_node(nt, mixed, [(0.32, c0), (0.48, c1), (0.64, c2), (0.8, c3)])
    grain_n = noise(nt, co, 650.0, 2.0, 0.7)
    col = mix_color(nt, col, map_range(nt, grain_n, 0.72, 1.22))  # koernig
    plates = node(nt, "ShaderNodeTexVoronoi", feature="DISTANCE_TO_EDGE")
    setin(plates, Scale=140.0)
    nt.links.new(co, plates.inputs["Vector"])
    plate = map_range(nt, plates.outputs["Distance"], 0.0, 1.0, 0.05, 0.16)  # 0 = Riss, 1 = Schuppe
    plate = math_node(nt, "MULTIPLY", plate, map_range(nt, zone, 0.0, 1.0, 0.3, 0.55))  # Schuppen nur in der Kruste
    col = mix_color(nt, col, map_range(nt, plate, 0.6, 1.0))  # Risse dunkel
    pores = node(nt, "ShaderNodeTexVoronoi", feature="F1")
    setin(pores, Scale=520.0)
    nt.links.new(mapping(nt, co, loc=(11, 11, 11)), pores.inputs["Vector"])
    pit = map_range(nt, pores.outputs["Distance"], 1.0, 0.0, 0.06, 0.13)
    pit = math_node(nt, "MULTIPLY", pit, map_range(nt, noise(nt, co, 60.0, 2.0, 0.5), 0.0, 1.0, 0.6, 0.68))
    nt.links.new(mix_color(nt, col, map_range(nt, pit, 1.0, 0.5)), bsdf.inputs["Base Color"])
    height = math_node(nt, "ADD", math_node(nt, "MULTIPLY", plate, 1.2), math_node(nt, "MULTIPLY", grain_n, 0.9))
    height = math_node(nt, "SUBTRACT", height, math_node(nt, "MULTIPLY", pit, 1.2))
    bump(nt, bsdf, height, 0.002, 1.0)
    return m


def make_felt(spec, grain):
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    co = obj_coords(nt, 1.0)
    fibers = noise(nt, co, 1800.0, 2.0, 0.6)
    tufts = noise(nt, co, 420.0, 2.0, 0.6)  # groebere Flocken der Walkung
    col = mix_color(nt, spec["params"]["color"], map_range(nt, fibers, 0.78, 1.12))
    nt.links.new(mix_color(nt, col, map_range(nt, tufts, 0.86, 1.1)), bsdf.inputs["Base Color"])
    setin(bsdf, Sheen_Weight=0.3, Sheen_Roughness=0.8)
    height = math_node(nt, "ADD", math_node(nt, "MULTIPLY", fibers, 0.9), math_node(nt, "MULTIPLY", tufts, 1.2))
    bump(nt, bsdf, height, 0.0005, 1.2)
    return m


def make_mosaic(spec, grain):
    p = spec["params"]
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    vor = node(nt, "ShaderNodeTexVoronoi", feature="DISTANCE_TO_EDGE")
    setin(vor, Scale=p["scale"])
    nt.links.new(obj_coords(nt, 1.0), vor.inputs["Vector"])
    col = ramp_node(nt, vor.outputs["Distance"], [(0.0, p["line"]), (p["width"], p["line"]), (p["width"] + 0.015, p["cell"])])
    nt.links.new(col, bsdf.inputs["Base Color"])
    return m


def make_leather(spec, grain):
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    co = obj_coords(nt, 1.0)
    nap = noise(nt, co, 55.0, 4.0, 0.6)  # Strichrichtungs-Wolken des Velours
    fibers = noise(nt, co, 1900.0, 3.0, 0.7)
    tone = mix_color(nt, spec["params"]["color"], map_range(nt, nap, 0.74, 1.2, 0.3, 0.7))
    nt.links.new(mix_color(nt, tone, map_range(nt, fibers, 0.88, 1.1)), bsdf.inputs["Base Color"])
    setin(bsdf, Sheen_Weight=0.55, Sheen_Roughness=0.5)
    bump(nt, bsdf, fibers, 0.0003, 1.0)
    return m


def make_moss(spec, grain):
    dark, mid, light = spec["params"]["colors"]
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    co = obj_coords(nt, 1.0)
    clumps = noise(nt, co, 260.0, 5.0, 0.7)
    nt.links.new(ramp_node(nt, clumps, [(0.3, dark), (0.5, mid), (0.72, light)]), bsdf.inputs["Base Color"])
    setin(bsdf, Sheen_Weight=0.4, Sheen_Roughness=0.7)
    fine = noise(nt, co, 1100.0, 3.0, 0.7)
    bump(nt, bsdf, math_node(nt, "ADD", clumps, math_node(nt, "MULTIPLY", fine, 0.5)), 0.003, 1.0)
    return m


def make_gilded(spec, grain):
    # altes Blattgold auf Holz: angelaufen, an abgeriebenen Stellen scheint der rote Bolus durch
    gold, dark, bole = spec["params"]["colors"]
    m, nt, bsdf, _ = new_mat(f"CADO_{spec['id']}")
    base_props(bsdf, spec)
    co = obj_coords(nt, 1.0)
    tarnish = noise(nt, co, 25.0, 5.0, 0.6)
    leaf = ramp_node(nt, tarnish, [(0.38, gold), (0.72, dark)])
    wear = ramp_node(nt, noise(nt, co, 55.0, 5.0, 0.65), [(0.55, (0, 0, 0)), (0.7, (1, 1, 1))])
    nt.links.new(mix_color(nt, leaf, bole, wear, "MIX"), bsdf.inputs["Base Color"])
    nt.links.new(math_node(nt, "SUBTRACT", 1.0, wear), bsdf.inputs["Metallic"])
    nt.links.new(map_range(nt, tarnish, 0.2, 0.55), bsdf.inputs["Roughness"])
    fibers = noise(nt, mapping(nt, co, scale=(1, 1, 0.06)), 900.0, 3.0, 0.6)  # Holzstruktur unter dem Blatt
    bump(nt, bsdf, math_node(nt, "SUBTRACT", fibers, math_node(nt, "MULTIPLY", wear, 0.8)), 0.0004, 1.0)
    return m


def make_glass(spec, grain):
    m, nt, bsdf, out = new_mat(f"CADO_{spec['id']}")
    setin(bsdf, Base_Color=(0.84, 0.93, 0.95, 1), Roughness=0.015, IOR=1.49, Transmission_Weight=1.0)
    # helle Schatten statt schwarzer Klotz-Schatten
    lp = node(nt, "ShaderNodeLightPath")
    transp = node(nt, "ShaderNodeBsdfTransparent")
    transp.inputs[0].default_value = (0.93, 0.96, 0.97, 1)
    mix = node(nt, "ShaderNodeMixShader")
    nt.links.new(math_node(nt, "MULTIPLY", lp.outputs["Is Shadow Ray"], 0.6), mix.inputs[0])
    nt.links.new(bsdf.outputs[0], mix.inputs[1])
    nt.links.new(transp.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs[0])
    return m


MAKERS = {
    "wood": make_wood, "plain": make_plain, "duo": make_duo, "camo": make_camo, "marble": make_marble,
    "onyx": make_onyx, "granite": make_granite, "sandstone": make_sandstone, "concrete": make_concrete,
    "rust": make_rust, "felt": make_felt, "glass": make_glass,
    "mosaic": make_mosaic, "leather": make_leather, "moss": make_moss, "gilded": make_gilded,
}


class Materials:
    """Erzeugt Materialien bei Bedarf; nur Holz braucht je Faserrichtung eine eigene Variante."""

    def __init__(self):
        self.cache = {}

    def __getitem__(self, key):
        mat_id, grain = key
        spec = SPECS[mat_id]
        if spec["kind"] != "wood":
            grain = "-"
        if (mat_id, grain) not in self.cache:
            self.cache[mat_id, grain] = MAKERS[spec["kind"]](spec, grain)
        return self.cache[mat_id, grain]


def make_backdrop():
    m, nt, bsdf, _ = new_mat("Studio_Backdrop")
    # leichte Eigenhelligkeit: High-Key-Hintergrund, Schatten bleiben zart
    setin(bsdf, Base_Color=(0.9, 0.9, 0.89, 1), Roughness=0.7, Emission_Strength=0.14)
    bsdf.inputs["Emission Color"].default_value = (1, 1, 1, 1)
    return m


# ----------------------------------------------------------------------------- Szene

def place(coll, lib, mats, code, material, x, y, z=0.0, rot=0.0):
    src = lib[code]
    ob = bpy.data.objects.new(f"{src.name}_{material}", src.data)
    wn = ob.modifiers.new("WeightedNormal", "WEIGHTED_NORMAL")
    wn.keep_sharp = False
    wn.weight = 50
    ob.location = (x * MM, y * MM, z * MM)
    ob.rotation_euler = (0, 0, radians(rot))
    coll.objects.link(ob)
    slot = ob.material_slots[0]
    slot.link = "OBJECT"
    slot.material = mats[material, src["grain_axis"]]
    if code in INSERTS:
        ins_src, ins_mat = INSERTS[code]
        ins = bpy.data.objects.new(f"{ob.name}_INS", ins_src.data)
        ins.parent = ob
        coll.objects.link(ins)
        ins.material_slots[0].link = "OBJECT"
        ins.material_slots[0].material = mats[ins_mat, "Z"]
    return ob


def footprint(ob, rot):
    dx, dy, _ = ob["dims_mm"]
    return (dy, dx) if rot % 180 else (dx, dy)


def layout_rows(coll, lib, mats, rows, gap=14, row_gap=62):
    # rows: Listen aus (Code, Drehung, Material)
    y = (len(rows) - 1) * row_gap / 2
    for row in rows:
        widths = [footprint(lib[c], r)[0] for c, r, _ in row]
        x = -(sum(widths) + gap * (len(row) - 1)) / 2
        for (code, rot, mat), w in zip(row, widths):
            place(coll, lib, mats, code, mat, x + w / 2, y, rot=rot)
            x += w + gap
        y -= row_gap


def build_studio(coll):
    # Hohlkehle
    prof = [(-3.0, 0.0)] + [(y, z) for y, z in arc(1.0, 0.6, 0.6, -90, 0, 24)] + [(1.6, 3.0)]
    bm = bmesh.new()
    rows = [(bm.verts.new((-5, y, z)), bm.verts.new((5, y, z))) for y, z in prof]
    for (a0, b0), (a1, b1) in zip(rows, rows[1:]):
        bm.faces.new((a0, b0, b1, a1))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    for f in bm.faces:
        f.smooth = True
    me = bpy.data.meshes.new("Studio_Cyc")
    bm.to_mesh(me)
    bm.free()
    me.materials.append(make_backdrop())
    cyc = bpy.data.objects.new("Studio_Cyc", me)
    coll.objects.link(cyc)

    lights = {}
    for name in ("Key", "Fill", "Rim"):
        ld = bpy.data.lights.new(f"Studio_{name}", "AREA")
        ld.shape = "SQUARE"
        lo = bpy.data.objects.new(f"Studio_{name}", ld)
        coll.objects.link(lo)
        lights[name] = lo
    # dunkle Reflexkarten: nur in Spiegelungen sichtbar, geben poliertem Metall Kontur vor Weiss
    dark, nt, bsdf, _ = new_mat("Studio_Flag")
    setin(bsdf, Base_Color=(0.015, 0.015, 0.015, 1), Roughness=1.0)
    for name in ("FlagR", "FlagL"):
        me = bpy.data.meshes.new(f"Studio_{name}")
        me.from_pydata([(-0.5, -0.5, 0), (0.5, -0.5, 0), (0.5, 0.5, 0), (-0.5, 0.5, 0)], [], [(0, 1, 2, 3)])
        me.materials.append(dark)
        fo = bpy.data.objects.new(f"Studio_{name}", me)
        fo.visible_camera = fo.visible_diffuse = fo.visible_shadow = fo.visible_transmission = False
        coll.objects.link(fo)
        lights[name] = fo
    cd = bpy.data.cameras.new("Studio_Cam")
    cam = bpy.data.objects.new("Studio_Cam", cd)
    coll.objects.link(cam)
    return lights, cam


def look_at(ob, target):
    ob.rotation_euler = (target - ob.location).to_track_quat("-Z", "Y").to_euler()


def setup_shot(scene, lights, cam, objs, res, elev, azim, lens=85, fstop=11, margin=1.12, exposure=0.0):
    pts = [o.matrix_world @ Vector(c) for o in objs for c in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), 0))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    ext = hi - lo
    target = (lo + hi) / 2
    target.z = ext.z * 0.42
    el, az = radians(elev), radians(azim)

    scene.render.resolution_x, scene.render.resolution_y = res
    hfov = 2 * atan(18 / lens)
    vfov = 2 * atan(18 / lens * res[1] / res[0])
    half_w = (ext.x * abs(cos(az)) + ext.y * abs(sin(az))) / 2
    half_h = ((ext.y * abs(cos(az)) + ext.x * abs(sin(az))) * sin(el) + ext.z * cos(el)) / 2
    dist = margin * max(half_w / tan(hfov / 2), half_h / tan(vfov / 2)) + ext.y / 2
    cam.location = target + Vector((dist * cos(el) * sin(az), -dist * cos(el) * cos(az), dist * sin(el)))
    look_at(cam, target)
    cam.data.lens = lens
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = dist
    cam.data.dof.aperture_fstop = fstop
    cam.data.clip_start = 0.01
    scene.camera = cam

    # Lichtaufbau skaliert mit dem Motiv: Groesse ~ Abstand, Leistung ~ Abstand^2 -> gleiche Belichtung
    R = max(ext.x, ext.y, ext.z) / 2
    for name, direction, d, size, k in (
        ("Key", (-0.75, -0.55, 0.95), 3.2, 3.0, 7.0),
        ("Fill", (1.0, -0.5, 0.35), 3.6, 3.4, 1.2),
        ("Rim", (0.25, 0.9, 0.85), 3.2, 2.2, 4.0),
    ):
        lo_ = lights[name]
        dd = d * R
        lo_.location = target + Vector(direction).normalized() * dd
        look_at(lo_, target)
        lo_.data.size = size * R
        lo_.data.energy = k * dd * dd
    for name, direction in (("FlagR", (1.0, -0.15, 0.25)), ("FlagL", (-0.7, 0.75, 0.3))):
        fo = lights[name]
        fo.location = target + Vector(direction).normalized() * 3.0 * R
        look_at(fo, target)
        fo.scale = (1.1 * R, 4.0 * R, 1)
    scene.view_settings.exposure = exposure


def setup_render(scene):
    scene.render.engine = "CYCLES"
    try:
        if "--cpu" in argv:
            raise RuntimeError("--cpu gesetzt")
        prefs = bpy.context.preferences.addons["cycles"].preferences
        for t in ("OPTIX", "CUDA"):
            try:
                prefs.compute_device_type = t
                break
            except Exception:
                continue
        prefs.refresh_devices()
        for d in prefs.devices:
            d.use = d.type != "CPU"
        scene.cycles.device = "GPU"
    except Exception as e:
        print("GPU nicht verfuegbar, rendere auf CPU:", e)
    scene.cycles.samples = 48 if QUICK else 384
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 12
    scene.cycles.transmission_bounces = 12
    scene.cycles.glossy_bounces = 8
    scene.render.resolution_percentage = 50 if QUICK else 100
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"

    world = bpy.data.worlds.new("Studio_World")
    try:
        world.use_nodes = True
    except Exception:
        pass
    bg = next(n for n in world.node_tree.nodes if n.type == "BACKGROUND")
    bg.inputs[0].default_value = (1, 1, 1, 1)
    bg.inputs[1].default_value = 0.42
    scene.world = world


def new_collection(scene, name):
    c = bpy.data.collections.new(name)
    scene.collection.children.link(c)
    return c


def render_shot(scene, shot_colls, active, filename):
    for name, c in shot_colls.items():
        c.hide_render = name != active
    scene.render.filepath = os.path.join(OUT_RENDER, filename)
    bpy.ops.render.render(write_still=True)
    print("gerendert:", scene.render.filepath)


# ----------------------------------------------------------------------------- Ablauf

def export_glb(lib):
    def export(objs, path):
        for o in bpy.context.view_layer.objects:
            o.select_set(False)
        for o in objs:
            o.select_set(True)
        bpy.context.view_layer.objects.active = objs[0]
        bpy.ops.export_scene.gltf(filepath=path, export_format="GLB", use_selection=True,
                                  export_apply=True, export_extras=True, export_materials="NONE")

    extra = {code: ins for code, (ins, _) in INSERTS.items()}
    for code, ob in lib.items():
        export([ob] + ([extra[code]] if code in extra else []), os.path.join(OUT_GLB, f"CADO_{code}.glb"))
    export(list(lib.values()) + list(extra.values()), os.path.join(OUT_GLB, "cado_elements_all.glb"))


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    os.makedirs(OUT_RENDER, exist_ok=True)
    os.makedirs(OUT_GLB, exist_ok=True)

    lib_coll = new_collection(scene, "CADO_Library")
    lib, catalog = build_library(lib_coll)
    mats = Materials()
    for ob in lib.values():
        ob.material_slots[0].link = "OBJECT"
        ob.material_slots[0].material = mats["maple", ob["grain_axis"]]
    with open(os.path.join(ROOT, "catalog.json"), "w", encoding="utf-8") as f:
        json.dump({"unit": "mm", "grid": 30, "shapes": catalog}, f, indent=2)
    export_glb(lib)
    # der Web-Builder laedt genau diese beiden Dateien
    if os.path.isdir(WEB_PUBLIC):
        os.makedirs(os.path.join(WEB_PUBLIC, "models"), exist_ok=True)
        shutil.copy(os.path.join(OUT_GLB, "cado_elements_all.glb"), os.path.join(WEB_PUBLIC, "models"))
        shutil.copy(os.path.join(ROOT, "catalog.json"), WEB_PUBLIC)
    lib_coll.hide_render = True
    lib_coll.hide_viewport = True

    setup_render(scene)
    lights, cam = build_studio(new_collection(scene, "Studio"))
    shots = {k: new_collection(scene, f"Shot_{k}") for k in ("lineup", "materials", "hero", "all", "design", "detail")}

    # 1) alle Formen in Ahorn
    lineup = [
        ["003", "012", ("045", -90), ("048", -90), "043", "002", "011", ("044", -90), ("047", -90), "036"],
        ["001", "010", ("013", 180), ("018", -90), ("019", 180), "026", "027", "008", "037", "024", ("046", -90), "042"],
        ["004", ("006", 90), ("007", 90), "005", "009", "021", "023", "020", "029", "025", "028", "022", "017", "041", ("030", 90)],
        ["035", "031", ("014", 90), ("015", 90), ("016", 90)],
        ["039", "074", "056", "057", "116", "067", "073", "058", "117", "068", "049", "135", "094", "095", "096"],
        ["040", ("123", 90), ("121", 90), "063", "114", "120", ("093", 90), ("065", 90), ("064", 90), ("053", 90)],
    ]
    layout_rows(shots["lineup"], lib, mats,
                [[(e, 0, "maple") if isinstance(e, str) else (e[0], e[1], "maple") for e in row] for row in lineup],
                gap=16, row_gap=84)

    # 2) Materialreihe
    order = ["maple", "wenge", "aluminium", "brass", "carrara", "concrete", "acrylic"]
    for i, mat in enumerate(order):
        x = (i - 3) * 52
        place(shots["materials"], lib, mats, "002", mat, x, 26)
        place(shots["materials"], lib, mats, "010", mat, x - 4, -22)
        place(shots["materials"], lib, mats, "001", mat, x + 12, -66, rot=18)

    # 3) Komposition
    H = shots["hero"]
    for args in (
        ("003", "wenge", 0, 30), ("002", "carrara", 30, 30), ("012", "aluminium", 60, 30),
        ("001", "concrete", 0, 0), ("027", "maple", 0, 0, 30), ("001", "acrylic", 30, 0),
        ("021", "brass", 30, 0, 30), ("044", "maple", 60, 0, 0, -90),
        ("007", "concrete", 105, 15), ("010", "wenge", 105, 30, 10), ("017", "aluminium", 105, 30, 40),
        ("035", "carrara", 102, -52), ("015", "brass", 40, -46, 0, 90), ("020", "maple", 0, -32, 0, -90),
        ("046", "wenge", -34, 6), ("042", "brass", -36, 34),
    ):
        place(H, lib, mats, *args)

    # 4) alle Materialien, je Gruppe eine Reihe (Filz gibt es nur als Platte)
    rows = []
    for group in MATERIAL_DATA["groups"]:
        rows.append([("004" if s["kind"] == "felt" else "001", 0, s["id"])
                     for s in MATERIAL_DATA["materials"] if s["group"] == group])
    layout_rows(shots["all"], lib, mats, rows, gap=20, row_gap=66)

    # 5) Design-Serie
    layout_rows(shots["design"], lib, mats, [
        [("GRI003", 0, "aluminium_black"), ("GRI003", 0, "aluminium"), ("061", 0, "maple"), ("PAN003", 0, "lacquer_red"),
         ("ALWE003", 0, "wenge"), ("MOX003", 0, "acrylic"), ("SSP012", 0, "stainless"), ("003", 0, "light"),
         ("LEGO003", 0, "leather_blue"), ("LEGO003", 0, "leather_red"), ("LEGO003", 0, "leather_beige"), ("003", 0, "mosaic_copper")],
        [("GRI002", 0, "aluminium"), ("060", 0, "maple"), ("PAN002", 0, "lacquer_white"), ("ALWE002", 0, "wenge"),
         ("AIR079", 0, "aluminium"), ("MOO002", 0, "moss"), ("MOO011", 0, "moss"), ("002", 0, "wax"), ("002", 0, "rubber"), ("002", 0, "mosaic_copper")],
        [("GRI001", 0, "aluminium"), ("GRI001", 0, "aluminium_black"), ("059", 0, "maple"), ("PAN001", 0, "lacquer_red"),
         ("PAN001", 0, "lacquer_white"), ("ALWE001", 0, "wenge"), ("AIR078", 0, "aluminium"), ("PRO151", 0, "aluminium"),
         ("MOO001", 0, "moss"), ("001", 0, "wax"), ("001", 0, "rubber")],
        [("GRI007", 90, "aluminium"), ("GRI004", 0, "aluminium"), ("007", 90, "mosaic_red"), ("123", 90, "mosaic_red"),
         ("006", 90, "mosaic_red"), ("008", 0, "mosaic_red"), ("024", 0, "mosaic_red"), ("135", 0, "mosaic_red"),
         ("017", 0, "ceramic_red"), ("017", 0, "ceramic_white")],
    ], gap=18, row_gap=74)

    # 6) Nahaufnahme: Leder, Beton, Rost
    D = shots["detail"]
    place(D, lib, mats, "LEGO003", "leather_red", -70, 20)
    lying = place(D, lib, mats, "LEGO003", "leather_beige", -25, -30, 15)
    lying.rotation_euler = (radians(90), 0, radians(-70))
    place(D, lib, mats, "003", "concrete", 25, 25)
    place(D, lib, mats, "010", "concrete", 55, -25)
    place(D, lib, mats, "003", "rust", 100, 30)
    place(D, lib, mats, "011", "rust", 125, -20)
    place(D, lib, mats, "036", "gold", 165, 25)
    place(D, lib, mats, "010", "gold", 185, -25)
    place(D, lib, mats, "MOO002", "moss", 225, 25)
    place(D, lib, mats, "MOO010", "moss", 250, -25)
    glow = place(D, lib, mats, "003", "light", 200, -75, 15)
    glow.rotation_euler = (radians(90), 0, radians(90))

    bpy.context.view_layer.update()
    plan = {
        "lineup": ("01_formen_ahorn.png", (2400, 1200), 30, 14, 16),
        "materials": ("02_materialien.png", (2400, 1200), 24, -16, 16),
        "hero": ("03_komposition.png", (2400, 1600), 20, -28, 11),
        "all": ("04_alle_materialien.png", (2400, 1350), 34, 10, 16),
        "design": ("05_design_serie.png", (2400, 1350), 30, 12, 16),
        "detail": ("06_detail_leder_beton_rost.png", (2400, 1350), 16, -26, 11),
    }
    for key in SHOTS:
        fn, res, elev, azim, fstop = plan[key]
        setup_shot(scene, lights, cam, list(shots[key].objects), res, elev, azim, fstop=fstop)
        if not NO_RENDER:
            render_shot(scene, shots, key, fn)

    for name, c in shots.items():
        c.hide_render = name != "hero"
        c.hide_viewport = name != "hero"
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "cado_bricks.blend"))
    print("FERTIG")


main()
