// Materialien als Volumentexturen im Objektraum - gleiche Logik wie die Blender-Shader in blender/cado_bricks.py,
// gespeist aus derselben materials.json. Jahresringe laufen um eine Stammachse, daher stimmen Hirnholz und
// Laengsholz ohne UVs und ohne Naehte. Pro Material-ART gibt es ein Shader-Programm, die Werte kommen als Uniforms.
import * as THREE from 'three';
import data from './materials.json';

export const MATERIALS = data.materials;
export const GROUPS = data.groups;
const SPEC = Object.fromEntries(MATERIALS.map((m) => [m.id, m]));

// Fuge: dunkle Linie entlang der Kanten, hinter denen ein Nachbarstein oder der Boden anliegt. Die Fase der Steine
// (0,45 mm) ist aus normaler Entfernung kleiner als ein Pixel - ohne diese Linie verschmilzt eine Wand zu einem Block.
// uHalf = halbe Kantenlaengen der Huelle (0 = keine Fugen), uCover* = 1, wenn die Huellflaeche +x/+y/+z bzw. -x/-y/-z belegt ist.
// Gilt fuer jede Form: wo eine Oberflaeche nah an eine belegte Huellflaeche kommt, liegt sie am Nachbarn (z. B. Saeulentrommeln).
const JOINT = /* glsl */ `
uniform vec3 uHalf;
uniform vec3 uCenter;
uniform vec3 uCoverPos;
uniform vec3 uCoverNeg;
uniform float uTone;
float cadoJoint(vec3 pos, vec3 nrm){
  if (uHalf.x <= 0.0) return 0.0;
  vec3 p = pos - uCenter;
  vec3 q = max(uHalf - abs(p), 0.0);
  float w = max(0.0011, 1.3 * length(fwidth(pos))); // mindestens 1,1 mm, aber nie schmaler als gut ein Pixel
  vec3 l = (1.0 - smoothstep(vec3(0.0), vec3(w), q)) * mix(uCoverNeg, uCoverPos, step(0.0, p));
  vec3 an = abs(nrm); // die Flaeche, auf der wir gerade sind, zaehlt nicht
  if (an.x >= an.y && an.x >= an.z) l.x = 0.0; else if (an.y >= an.z) l.y = 0.0; else l.z = 0.0;
  return 0.46 * (1.0 - smoothstep(0.0025, 0.009, w)) * max(l.x, max(l.y, l.z)); // in der Ferne ausblenden
}
`;

const HEADER = /* glsl */ `
varying vec3 vCadoPos;
varying vec3 vCadoNrm;
${JOINT}
uniform vec3 uSeed;
uniform int uGrain;
uniform vec4 uStops[5];
uniform vec4 uP;
uniform vec3 uC[4];
uniform float uBump;
uniform float uPeel;
float cadoHeight = 0.0; // Relief: jede Oberflaeche darf hier eine Hoehe (0..1) hinterlegen
float cadoPeel = 0.0;   // Relief nur der Klarlackschicht (Orangenhaut)
float cadoMetal = 1.0;  // Faktor auf die Metallizitaet (z. B. abgeriebenes Blattgold)
float cadoHash(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float cadoNoise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = cadoHash(i), b = cadoHash(i + vec3(1,0,0)), c = cadoHash(i + vec3(0,1,0)), d = cadoHash(i + vec3(1,1,0));
  float e = cadoHash(i + vec3(0,0,1)), g = cadoHash(i + vec3(1,0,1)), h = cadoHash(i + vec3(0,1,1)), k = cadoHash(i + vec3(1,1,1));
  return mix(mix(mix(a,b,f.x), mix(c,d,f.x), f.y), mix(mix(e,g,f.x), mix(h,k,f.x), f.y), f.z);
}
float cadoFbm(vec3 p, int oct){
  float a = 0.5, s = 0.0, n = 0.0;
  for (int i = 0; i < 6; i++){ if (i >= oct) break; s += a * cadoNoise(p); n += a; p = p * 2.03 + 17.13; a *= 0.5; }
  return s / n;
}
// Detail ausblenden, sobald es kleiner als ein Pixel wird (prozedurale Texturen haben keine Mipmaps)
float cadoFade(vec3 p){ return smoothstep(0.3, 0.9, length(fwidth(p))); }
float cadoGrit(vec3 p){ return mix(cadoNoise(p), 0.5, cadoFade(p)); }
// Normale aus der Hoehe ableiten (wie Bump-Mapping, nur ohne Textur)
vec3 cadoPerturb(vec3 pos, vec3 nrm, vec2 dH, float face){
  vec3 sx = normalize(dFdx(pos)), sy = normalize(dFdy(pos));
  vec3 r1 = cross(sy, nrm), r2 = cross(nrm, sx);
  float det = dot(sx, r1) * face;
  return normalize(abs(det) * nrm - sign(det) * (dH.x * r1 + dH.y * r2));
}
// Abstand zur naechsten und zweitnaechsten Zelle (Worley) -> Differenz = Fugenlinie
vec2 cadoWorley(vec3 p){
  vec3 ip = floor(p), fp = fract(p);
  float f1 = 9.0, f2 = 9.0;
  for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) for (int z = -1; z <= 1; z++){
    vec3 o = vec3(x, y, z), c = ip + o;
    vec3 d = o + vec3(cadoHash(c), cadoHash(c + 17.3), cadoHash(c + 41.7)) - fp;
    float dd = dot(d, d);
    if (dd < f1){ f2 = f1; f1 = dd; } else if (dd < f2){ f2 = dd; }
  }
  return sqrt(vec2(f1, f2));
}
`;

// je Art: vec4 cadoSurface(pos, nrm) -> rgb = Farbe, a = Faktor auf die Rauheit
const SURFACES = {
  wood: /* glsl */ `
vec3 cadoRamp(float t){
  vec3 c = uStops[0].rgb;
  for (int i = 1; i < 5; i++){
    float p0 = uStops[i-1].a, p1 = uStops[i].a;
    c = mix(c, uStops[i].rgb, clamp((t - p0) / max(p1 - p0, 1e-4), 0.0, 1.0));
  }
  return c;
}
vec3 cadoGrain(vec3 p){ if (uGrain == 0) return vec3(p.y, p.z, p.x); if (uGrain == 1) return vec3(p.z, p.x, p.y); return p; }
vec4 cadoSurface(vec3 pos, vec3 nrm){
  vec3 p = cadoGrain(pos) + uSeed * 0.08;
  vec3 q = vec3(p.xy + vec2(0.055, 0.03), p.z * 0.1);
  float n = length(q.xy) / uP.x + uP.y * (cadoFbm(q * uP.z, 3) - 0.5) * 2.0;
  vec3 col = mix(cadoRamp(fract(n)), uC[0], smoothstep(0.12, 0.45, fwidth(n))); // uC[0] = Mittel der Rampe
  float pores = cadoGrit(vec3(p.xy * 2200.0, p.z * 88.0));
  col *= mix(1.0 - uP.w, 1.0 + uP.w * 0.3, smoothstep(0.25, 0.75, pores));
  return vec4(col, 1.0 + (pores - 0.5) * 0.25);
}`,
  marble: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  vec3 p = pos + uSeed, s = p * uP.x;
  float stone = cadoHash(uSeed * 53.7 + 1.3); // Charakter je Stein: 0 = fast rein, 1 = stark geadert
  float amount = mix(0.25, 1.2, stone);
  vec3 w = s + uP.z * vec3(cadoFbm(s + 3.1, 3), cadoFbm(s + 11.7, 3), cadoFbm(s + 5.3, 3));
  float ridge = abs(cadoFbm(w, 5) - 0.5) * 2.0;
  // Hauptadern laufen aus: ihre Staerke schwankt entlang der Ader
  float strength = mix(0.3, 1.0, smoothstep(0.25, 0.7, cadoFbm(p * 5.0 + 23.0, 2))) * amount;
  float vein = (1.0 - smoothstep(uP.y * 0.5, uP.y * 1.5 + fwidth(ridge), ridge)) * strength;
  // feine Nebenadern: schmal und schwach
  vec3 w2 = s * 2.4 + 0.5 * uP.z * vec3(cadoFbm(s * 2.4 + 7.0, 2), cadoFbm(s * 2.4 + 19.0, 2), cadoFbm(s * 2.4 + 2.0, 2));
  float ridge2 = abs(cadoFbm(w2 + 31.0, 4) - 0.5) * 2.0;
  float fine = (1.0 - smoothstep(0.0, uP.y * 0.7 + fwidth(ridge2), ridge2)) * 0.4 * amount;
  // Schleier: weiche Wolken und ein zarter Hof um die Adern
  vec3 col = uC[0] * mix(uC[2], vec3(1.0), smoothstep(0.35, 0.65, cadoFbm(p * 12.0 + 40.0, 4)));
  float halo = (1.0 - smoothstep(0.0, uP.y * 5.0, ridge)) * 0.3 * strength;
  col = mix(col, mix(uC[0], uC[1], 0.5), halo);
  col = mix(col, uC[1], clamp(vein + fine, 0.0, 1.0));
  return vec4(col, 1.0);
}`,
  onyx: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  // CADO-Onyx: milchiger, leicht durchscheinender Stein mit weichen Honig-Wolken, keine Baender
  vec3 p = pos + uSeed;
  float cloud = cadoFbm(p * 22.0, 4);
  float milk = cadoFbm(p * 9.0 + 17.0, 3);
  float grain = mix(cadoNoise(p * 700.0), 0.5, cadoFade(p * 700.0)); // Kristallkorn
  float big = cadoFbm(p * 7.0 + 3.0, 3);                              // grosse Honigzonen
  vec3 col = mix(uC[0], uC[1], clamp(smoothstep(0.38, 0.6, cloud) * 0.9 + smoothstep(0.48, 0.68, big) * 0.6, 0.0, 1.0)); // creme -> honig
  col = mix(col, uC[2], smoothstep(0.6, 0.78, milk));                  // -> milchig weiss
  col = mix(col, uC[3], 0.6 * smoothstep(0.6, 0.7, cadoFbm(p * 14.0 + 41.0, 3))); // rosa Zonen
  col *= 0.94 + 0.12 * grain;
  float speck = smoothstep(0.86, 0.9, cadoNoise(p * 1100.0 + 5.0)) * (1.0 - cadoFade(p * 1100.0)); // vereinzelte Einschluesse
  return vec4(col * (1.0 - 0.3 * speck), 1.0 + 0.2 * speck);
}`,
  granite: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  vec3 g = (pos + uSeed) * uP.x;
  vec3 col = mix(uC[0], uC[1], smoothstep(0.44, 0.56, cadoNoise(g)));
  col = mix(col, uC[2], smoothstep(0.68, 0.72, cadoNoise(g * 2.3 + 19.0)));
  return vec4(mix(col, mix(mix(uC[0], uC[1], 0.5), uC[2], 0.12), cadoFade(g)), 1.0);
}`,
  sandstone: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  vec3 p = pos + uSeed;
  float bed = cadoFbm(vec3(p.x, p.y * 8.0, p.z) * 14.0, 3);
  vec3 col = mix(uC[1], uC[0], smoothstep(0.38, 0.62, bed));
  float grit = cadoGrit(p * 1500.0);
  cadoHeight = 0.8 * grit;
  return vec4(col * mix(0.86, 1.08, grit), 1.0);
}`,
  concrete: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  vec3 p = pos + uSeed;
  vec3 col = mix(uC[0], uC[1], smoothstep(0.35, 0.65, cadoFbm(p * 30.0, 4))); // zarte Wolken
  float grain = cadoGrit(p * 2600.0), sand = cadoGrit(p * 900.0); // feines Korn
  col *= 0.84 + 0.2 * grain + 0.12 * sand;
  float scuff = abs(cadoFbm(vec3(p.x * 35.0, p.y * 260.0, p.z * 35.0), 3) - 0.5) * 2.0; // helle Schlieren
  col *= 1.0 + 0.22 * (1.0 - smoothstep(0.0, 0.035, scuff)) * smoothstep(0.55, 0.7, cadoFbm(p * 18.0 + 9.0, 2));
  vec3 pp = p * 300.0; // Lunker: kleine runde Poren, nur stellenweise
  float pore = (1.0 - smoothstep(0.09, 0.16, cadoWorley(pp).x)) * smoothstep(0.58, 0.66, cadoNoise(p * 85.0)) * (1.0 - cadoFade(pp));
  cadoHeight = 0.35 * grain + 0.35 * sand - 1.2 * pore;
  return vec4(col * (1.0 - 0.45 * pore), 1.0);
}`,
  rust: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  // Rost nach Referenzfotos: grosse Zonen aus dunkler Kruste und orangem Pulver, mittlere Fleckung, ueberall koernig,
  // Schuppen (~7 mm) mit dunklen Rissen, vereinzelte Poren und helle Sprenkel frischen Rosts
  vec3 p = pos + uSeed;
  float zone = cadoFbm(p * 28.0, 4);
  float mottle = cadoFbm(p * 95.0 + 5.0, 4);
  float grain = mix(cadoNoise(p * 1100.0), 0.5, cadoFade(p * 1100.0));
  float speck = smoothstep(0.64, 0.72, cadoNoise(p * 1300.0 + 3.0)) * (1.0 - cadoFade(p * 1300.0));
  vec2 w = cadoWorley(p * 120.0 + 0.9 * vec3(cadoFbm(p * 40.0 + 9.0, 2), cadoFbm(p * 40.0 + 19.0, 2), cadoFbm(p * 40.0 + 29.0, 2))); // Schuppen, verzerrt
  float crust = smoothstep(0.5, 0.68, zone);                        // nur in der dunklen Kruste
  float plate = smoothstep(0.04, 0.14, w.y - w.x) * crust;
  float crack = (1.0 - smoothstep(0.02, 0.1, w.y - w.x)) * crust;
  vec2 pw = cadoWorley(p * 520.0 + 11.0);
  float pit = (1.0 - smoothstep(0.06, 0.13, pw.x)) * smoothstep(0.6, 0.68, cadoNoise(p * 60.0)) * (1.0 - cadoFade(p * 520.0));
  float fine = mix(cadoNoise(p * 2600.0 + 1.0), 0.5, cadoFade(p * 2600.0));
  float t = mix(zone, mottle, 0.45) + 0.08 * (grain - 0.5) + 0.05 * (fine - 0.5);
  vec3 col = mix(uC[0], uC[1], smoothstep(0.42, 0.56, t));
  col = mix(col, uC[2], smoothstep(0.58, 0.72, t));
  col = mix(col, uC[3], 0.5 * speck + 0.3 * smoothstep(0.72, 0.84, t)); // frisches Pulver
  col *= 0.74 + 0.3 * grain + 0.14 * fine;
  col *= 1.0 - 0.25 * crack - 0.5 * pit - 0.12 * plate;
  cadoHeight = 0.6 * plate + 0.8 * grain + 0.5 * fine + 0.35 * mottle - 1.2 * pit + 0.4 * speck;
  return vec4(col, 1.05 + 0.15 * (1.0 - plate));
}`,
  felt: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  vec3 p = pos + uSeed;
  float fibers = cadoGrit(p * 1800.0);
  float tufts = mix(cadoNoise(p * 900.0), 0.5, cadoFade(p * 900.0)); // Flocken der Walkung
  float nap = cadoFbm(p * 90.0, 3);                                    // Wolken
  float tips = smoothstep(0.72, 0.8, cadoNoise(p * 2600.0 + 7.0)) * (1.0 - cadoFade(p * 2600.0)); // einzelne Faserspitzen
  cadoHeight = 1.0 * fibers + 0.7 * tufts + 0.25 * nap;
  vec3 col = uC[0] * (0.7 + 0.36 * fibers + 0.24 * tufts + 0.1 * (nap - 0.5)) * (1.0 + 0.25 * tips);
  return vec4(col, 1.0 + 0.1 * tufts);
}`,
  camo: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  vec3 s = (pos + uSeed) * uP.x;
  float n = cadoFbm(s + 0.9 * vec3(cadoNoise(s + 5.0), cadoNoise(s + 9.0), cadoNoise(s + 13.0)), 2);
  float aa = fwidth(n) + 1e-4;
  vec3 col = mix(uC[0], uC[1], smoothstep(0.43 - aa, 0.43 + aa, n));
  col = mix(col, uC[2], smoothstep(0.50 - aa, 0.50 + aa, n));
  col = mix(col, uC[3], smoothstep(0.58 - aa, 0.58 + aa, n));
  return vec4(col, 1.0);
}`,
  mosaic: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  vec3 g = (pos + uSeed) * uP.x;
  vec2 w = cadoWorley(g);
  float e = w.y - w.x;
  vec3 col = mix(uC[1], uC[0], smoothstep(uP.y, uP.y + fwidth(e) * 1.5 + 0.02, e));
  return vec4(mix(col, mix(uC[0], uC[1], 0.25), cadoFade(g * 2.0)), 1.0);
}`,
  leather: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  vec3 p = pos + uSeed;
  float nap = cadoFbm(p * 55.0, 4); // Strichrichtungs-Wolken des Velours
  float brushed = cadoFbm(vec3(p.x * 240.0, p.y * 40.0, p.z * 240.0), 3);
  float fibers = cadoGrit(p * 1900.0);
  vec3 col = uC[0] * mix(0.74, 1.2, smoothstep(0.3, 0.7, mix(nap, brushed, 0.35)));
  col *= 0.88 + 0.22 * fibers;
  cadoHeight = 0.6 * fibers + 0.5 * nap;
  return vec4(col, 1.0);
}`,
  moss: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  vec3 p = pos + uSeed;
  float n = mix(cadoFbm(p * 260.0, 4), 0.5, cadoFade(p * 260.0));
  vec3 col = mix(uC[0], uC[1], smoothstep(0.38, 0.5, n));
  col = mix(col, uC[2], smoothstep(0.52, 0.66, n));
  float tuft = 1.0 - smoothstep(0.0, 0.6, cadoWorley(p * 330.0).x); // einzelne Polster
  float fibers = cadoGrit(p * 1400.0);
  cadoHeight = 1.4 * n + 1.2 * tuft + 0.5 * fibers;
  col *= 0.62 + 0.55 * tuft + 0.18 * fibers; // Spitzen hell, Tiefen dunkel
  return vec4(col * mix(0.8, 1.1, cadoFbm(p * 40.0, 3)), 1.0);
}`,
  gilded: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  vec3 p = pos + uSeed;
  float tarnish = cadoFbm(p * 25.0 + 3.0, 4);
  vec3 col = mix(uC[0], uC[1], smoothstep(0.38, 0.72, tarnish) * 0.75); // angelaufenes Gold
  // Naehte der Blattgold-Quadrate (ca. 14 mm), auf der jeweiligen Flaeche
  vec2 t = abs(nrm.x) > 0.6 ? p.yz : abs(nrm.y) > 0.6 ? p.xz : p.xy;
  vec2 c = fract(t * uP.x + 0.3 * vec2(cadoNoise(p * 30.0), cadoNoise(p * 30.0 + 5.0)));
  float seam = 1.0 - smoothstep(0.0, 0.03, min(min(c.x, 1.0 - c.x), min(c.y, 1.0 - c.y)));
  col *= 1.0 - 0.13 * seam;
  float wear = smoothstep(0.56, 0.7, cadoFbm(p * 55.0, 4)); // abgerieben: roter Bolus scheint durch
  col = mix(col, uC[2], wear * 0.9);
  cadoMetal = 1.0 - 0.9 * wear;
  float grainy = cadoGrit(vec3(p.x * 900.0, p.y * 60.0, p.z * 900.0)); // Holzstruktur unter dem Blatt
  cadoHeight = 0.5 * grainy + 0.2 * seam - 0.7 * wear;
  return vec4(col, 0.75 + 0.9 * tarnish + 1.2 * wear);
}`,
  // ---- einfarbige Materialien mit Oberflaeche (materials.json "finish")
  plain: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){ return vec4(uC[0], 1.0); }`,
  lacquer: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  // Lack auf Holz: Orangenhaut im Klarlack (~2,5 mm), kaum sichtbare Wolken im Farbton
  vec3 p = pos + uSeed;
  cadoPeel = mix(cadoNoise(p * 380.0), 0.5, cadoFade(p * 380.0));
  return vec4(uC[0] * (0.97 + 0.06 * cadoFbm(p * 30.0, 3)), 1.0);
}`,
  brushed: /* glsl */ `
vec3 cadoBrush(vec3 p){ if (uGrain == 0) return vec3(p.y, p.z, p.x); if (uGrain == 1) return vec3(p.z, p.x, p.y); return p; }
vec4 cadoSurface(vec3 pos, vec3 nrm){
  // gebuerstetes Aluminium: feine Riefen laengs des Steins, je Stein etwas anders
  vec3 p = pos + uSeed * 0.05, q = cadoBrush(p);
  vec3 s1 = vec3(q.xy * 2600.0, q.z * 14.0), s2 = vec3(q.xy * 900.0, q.z * 6.0) + 7.0;
  float b = 0.6 * mix(cadoNoise(s1), 0.5, cadoFade(s1)) + 0.4 * mix(cadoNoise(s2), 0.5, cadoFade(s2));
  float cloud = cadoFbm(p * 40.0, 3);
  cadoHeight = 0.5 * b;
  return vec4(uC[0] * (0.95 + 0.08 * b) * (0.97 + 0.05 * cloud), 0.75 + 0.55 * b);
}`,
  brass: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  // Messing: leichte Patina in Wolken, einzelne matte Flecken
  vec3 p = pos + uSeed;
  float patina = smoothstep(0.5, 0.75, cadoFbm(p * 45.0, 4));
  float spots = smoothstep(0.7, 0.8, cadoNoise(p * 260.0)) * (1.0 - cadoFade(p * 260.0));
  float fine = cadoGrit(p * 1500.0);
  vec3 col = mix(uC[0], uC[0] * vec3(0.62, 0.55, 0.42), 0.55 * patina + 0.3 * spots) * (0.96 + 0.08 * fine);
  cadoMetal = 1.0 - 0.25 * patina;
  cadoHeight = 0.3 * fine;
  return vec4(col, 1.0 + 1.6 * patina + 0.8 * spots);
}`,
  mill: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  // Stahl schwarz: blaeulich-graue Walzhaut in Flecken, feines Korn
  vec3 p = pos + uSeed;
  float scale = cadoFbm(p * 35.0, 4), flake = smoothstep(0.55, 0.7, cadoFbm(p * 140.0 + 3.0, 3)), g = cadoGrit(p * 1200.0);
  vec3 col = mix(uC[0], uC[0] * vec3(1.35, 1.4, 1.6), smoothstep(0.4, 0.7, scale)) * (0.85 + 0.25 * g);
  cadoHeight = 0.4 * flake + 0.3 * g;
  return vec4(col, 0.8 + 0.5 * scale + 0.4 * flake);
}`,
  glaze: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  // Keramik: Glasur mit sanft welliger Oberflaeche und leichten Farbschwankungen
  vec3 p = pos + uSeed;
  cadoPeel = cadoFbm(p * 160.0, 2);
  return vec4(uC[0] * (0.95 + 0.08 * cadoFbm(p * 50.0, 3)), 1.0);
}`,
  rubber: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  vec3 p = pos + uSeed;
  float g = cadoGrit(p * 1600.0);
  cadoHeight = 0.5 * g;
  return vec4(uC[0] * (0.9 + 0.2 * g), 1.0 + 0.1 * g);
}`,
  wax: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  // Wachs: weiche Wolken, durchscheinend (Transmission in baseParams)
  vec3 p = pos + uSeed;
  float c = cadoFbm(p * 25.0, 4);
  cadoHeight = 0.3 * cadoGrit(p * 900.0);
  return vec4(uC[0] * (0.88 + 0.2 * c), 0.9 + 0.3 * c);
}`,
  duo: /* glsl */ `
vec4 cadoSurface(vec3 pos, vec3 nrm){
  return vec4(abs(nrm.x) > 0.7 ? uC[1] : uC[0], 1.0);
}`,
};

// Metalle spiegeln die Studio-Umgebung kraeftiger als der Rest der Szene: eigene envMap -> eigene Intensitaet
// (three nimmt fuer Materialien ohne eigene envMap immer scene.environmentIntensity)
const METAL_BOOST = 1.5;
let ENV = null, ENV_SCALE = 0.62;
const metals = new Set();
export function setEnvironment(texture, intensity) {
  ENV = texture;
  ENV_SCALE = intensity;
  for (const m of metals) { m.envMap = ENV; m.envMapIntensity = ENV_SCALE * METAL_BOOST; }
}
function boostMetal(m, spec) {
  if ((spec.metalness ?? 0) < 0.85) return;
  m.envMap = ENV;
  m.envMapIntensity = ENV_SCALE * METAL_BOOST;
  metals.add(m);
}

const GRAIN_INDEX = { X: 0, Z: 1, Y: 2 }; // Blender-Achse -> three (Y oben): X->x, Z->y, Y->z
const vec = (c) => new THREE.Vector3(...(c ?? [0, 0, 0]));

// mittlere Farbe einer Holz-Rampe (gleiche Interpolation wie cadoRamp im Shader)
function rampMean(stops) {
  const sum = [0, 0, 0], N = 96;
  for (let k = 0; k < N; k++) {
    const t = (k + 0.5) / N;
    let c = stops[0][1];
    for (let i = 1; i < stops.length; i++) {
      const p0 = stops[i - 1][0], p1 = stops[i][0], f = Math.min(1, Math.max(0, (t - p0) / Math.max(p1 - p0, 1e-4)));
      c = c.map((v, j) => v + (stops[i][1][j] - v) * f);
    }
    c.forEach((v, j) => { sum[j] += v / N; });
  }
  return sum;
}

// Streuung je Stein (Charge, Alterung): so viel heller oder dunkler darf ein einzelner Stein sein
const TONE = { wood: 0.085, marble: 0.04, onyx: 0.05, granite: 0.04, sandstone: 0.06, concrete: 0.07, rust: 0.07, felt: 0.04,
  leather: 0.045, moss: 0.06, gilded: 0.05, camo: 0.02, mosaic: 0.03, duo: 0.02,
  lacquer: 0.02, brushed: 0.03, brass: 0.04, mill: 0.05, glaze: 0.02, rubber: 0.03, wax: 0.05, plain: 0.028 };

const kindOf = (spec) => spec.finish ?? spec.kind;

function jointUniforms(spec, seed) {
  const amp = spec.params.emission ? 0 : TONE[kindOf(spec)] ?? (spec.metalness > 0.5 ? 0.035 : 0.028);
  const r = (Math.sin(seed * 912.37 + 1.7) * 43758.5453) % 1;
  return {
    uHalf: { value: new THREE.Vector3() }, uCenter: { value: new THREE.Vector3() },
    uCoverPos: { value: new THREE.Vector3() }, uCoverNeg: { value: new THREE.Vector3() },
    uTone: { value: 1 + (Math.abs(r) * 2 - 1) * amp },
  };
}

const BUMP = { concrete: 0.9, rust: 4.0, leather: 1.1, sandstone: 0.8, felt: 1.3, moss: 3.5, gilded: 0.9, brushed: 0.25, brass: 0.2, mill: 0.5, rubber: 0.6, wax: 0.3 };
const PEEL = { lacquer: 0.12, glaze: 0.06 };

function uniformsFor(spec, kind) {
  const p = spec.params;
  const colors = p.colors ?? [p.stops ? rampMean(p.stops) : p.base ?? p.cell ?? p.color, p.vein ?? p.line, p.cloud];
  const stops = (p.stops ?? [[0, [0, 0, 0]]]).map(([pos, c]) => new THREE.Vector4(c[0], c[1], c[2], pos));
  while (stops.length < 5) stops.push(stops[stops.length - 1].clone());
  const P = {
    wood: [p.ring, p.distortion, p.detail, p.fiber], marble: [p.scale, p.width, p.warp, 0],
    granite: [p.scale, 0, 0, 0], camo: [p.scale, 0, 0, 0],
    mosaic: [p.scale, p.width, 0, 0], gilded: [p.scale, 0, 0, 0],
  }[kind] ?? [0, 0, 0, 0];
  return {
    uStops: { value: stops },
    uP: { value: new THREE.Vector4(...P) },
    uC: { value: [0, 1, 2, 3].map((i) => vec(colors[i])) },
    uBump: { value: spec.bump ?? BUMP[kind] ?? 0 },
    uPeel: { value: PEEL[kind] ?? 0 },
  };
}

function baseParams(spec) {
  const out = { roughness: spec.roughness ?? 0.5, metalness: spec.metalness ?? 0 };
  if (spec.clearcoat) Object.assign(out, { clearcoat: spec.clearcoat, clearcoatRoughness: 0.08 });
  if (spec.kind === 'leather') {
    const c = spec.params.color;
    Object.assign(out, { sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color().setRGB(...c.map((v) => Math.min(1, v * 1.5 + 0.06))) });
  }
  if (spec.kind === 'moss') Object.assign(out, { sheen: 0.5, sheenRoughness: 0.7 });
  if (spec.params.emission) {
    Object.assign(out, { emissive: new THREE.Color().setRGB(...spec.params.color), emissiveIntensity: spec.params.emission * 0.4 });
  }
  if (spec.kind === 'felt') {
    const c = spec.params.color;
    Object.assign(out, { sheen: 1, sheenRoughness: 0.8, sheenColor: new THREE.Color().setRGB(...c.map((v) => Math.min(1, v * 1.4 + 0.05))) });
  }
  if (spec.kind === 'onyx') {
    // leicht durchscheinend: Licht dringt ein paar Millimeter ein und wird honigfarben
    Object.assign(out, {
      transmission: spec.params.transmission ?? 0.5, thickness: 0.02, ior: 1.5,
      attenuationColor: new THREE.Color().setRGB(...spec.params.colors[1]), attenuationDistance: 0.05,
    });
  }
  if (spec.finish === 'wax') {
    Object.assign(out, { transmission: 0.35, thickness: 0.03, ior: 1.45, attenuationColor: new THREE.Color().setRGB(...spec.params.color), attenuationDistance: 0.02 });
  }
  return out;
}

// Werte je Stein: als Uniform (Einzelstein) oder als Instanz-Attribut (gebuendelt, siehe Builder._rebuildBatches)
const PER_BRICK = [['vec3', 'uSeed'], ['float', 'uTone'], ['vec3', 'uHalf'], ['vec3', 'uCenter'], ['vec3', 'uCoverPos'], ['vec3', 'uCoverNeg']];
function header(kind, instanced) {
  let h = `${HEADER}\n${SURFACES[kind]}`;
  if (instanced) for (const [t, n] of PER_BRICK) h = h.replace(`uniform ${t} ${n};`, `varying ${t} ${n};`);
  return h;
}
const INSTANCE_VERTEX = `attribute vec4 aSeedTone;
attribute vec3 aHalf;
attribute vec3 aCenter;
attribute vec3 aCoverPos;
attribute vec3 aCoverNeg;
${PER_BRICK.map(([t, n]) => `varying ${t} ${n};`).join('\n')}`;
const INSTANCE_ASSIGN = 'uSeed = aSeedTone.xyz; uTone = aSeedTone.w; uHalf = aHalf; uCenter = aCenter; uCoverPos = aCoverPos; uCoverNeg = aCoverNeg;';

const seedVector = (seed) => new THREE.Vector3((seed * 7.31) % 1, (seed * 19.13) % 1, (seed * 13.77) % 1);

function build(spec, grainAxis, seed, instanced) {
  const kind = SURFACES[kindOf(spec)] ? kindOf(spec) : 'plain';
  const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, ...baseParams(spec) });
  const joint = jointUniforms(spec, seed);
  const uniforms = { ...uniformsFor(spec, kind), uGrain: { value: GRAIN_INDEX[grainAxis] ?? 1 } };
  if (!instanced) Object.assign(uniforms, joint, { uSeed: { value: seedVector(seed) } });
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vCadoPos;\nvarying vec3 vCadoNrm;${instanced ? '\n' + INSTANCE_VERTEX : ''}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\nvCadoPos = position;\nvCadoNrm = normal;${instanced ? '\n' + INSTANCE_ASSIGN : ''}`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${header(kind, instanced)}`)
      .replace('#include <color_fragment>', '#include <color_fragment>\nvec4 cadoSurf = cadoSurface(vCadoPos, normalize(vCadoNrm));\ndiffuseColor.rgb = cadoSurf.rgb * uTone * (1.0 - cadoJoint(vCadoPos, normalize(vCadoNrm)));')
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\nnormal = cadoPerturb(-vViewPosition, normal, vec2(dFdx(cadoHeight), dFdy(cadoHeight)) * uBump, faceDirection);')
      .replace('#include <clearcoat_normal_fragment_maps>', '#include <clearcoat_normal_fragment_maps>\n#ifdef USE_CLEARCOAT\nclearcoatNormal = cadoPerturb(-vViewPosition, clearcoatNormal, vec2(dFdx(cadoPeel), dFdy(cadoPeel)) * uPeel, faceDirection);\n#endif')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor *= cadoMetal;')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor * cadoSurf.a, 0.04, 1.0);');
  };
  m.customProgramCacheKey = () => `cado-${kind}${instanced ? '-i' : ''}`;
  m.userData.owned = true; // pro Stein bzw. Buendel erzeugt -> beim Entfernen freigeben
  if (!instanced) {
    m.userData.joint = joint; // der Builder traegt hier Quadermass und belegte Flaechen ein
    m.userData.seed = uniforms.uSeed.value;
  }
  boostMetal(m, spec);
  return m;
}

const shared = {};
function glass(spec) {
  shared[spec.id] ??= new THREE.MeshPhysicalMaterial({
    color: new THREE.Color().setRGB(...spec.params.color), roughness: spec.roughness, metalness: 0, transmission: 1, ior: 1.49,
    thickness: 0.03, attenuationColor: new THREE.Color().setRGB(...spec.params.tint), attenuationDistance: 0.08,
    clearcoat: 0.3, clearcoatRoughness: 0.03,
  });
  return shared[spec.id];
}

// Einzelstein (Palette, Miniaturen, Datentraeger der Steine im Builder)
export function createMaterial(id, grainAxis, seed) {
  const spec = SPEC[id] ?? SPEC.maple;
  return spec.kind === 'glass' ? glass(spec) : build(spec, grainAxis, seed, false);
}

// Buendel: ein Material fuer alle Steine einer Form in einem Material; Werte je Stein kommen aus Instanz-Attributen
export function createBatchMaterial(id, grainAxis) {
  const spec = SPEC[id] ?? SPEC.maple;
  return spec.kind === 'glass' ? glass(spec) : build(spec, grainAxis, 0, true);
}

export function releaseMaterial(m) {
  if (!m?.userData.owned) return;
  metals.delete(m);
  m.dispose();
}

// typische Farbe eines Materials (fuer die Vorschau beim Setzen)
export function mainColor(id) {
  const p = (SPEC[id] ?? SPEC.maple).params;
  const c = p.color ?? p.base ?? p.cell ?? p.stops?.[0][1] ?? p.colors[Math.min(1, p.colors.length - 1)];
  return new THREE.Color().setRGB(...c);
}
