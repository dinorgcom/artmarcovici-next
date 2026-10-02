// CADO Builder - Kern ohne UI-Framework, damit er spaeter unveraendert in den Shop (Next.js) wandern kann.
// Einheiten: Meter (wie die GLBs), Raster 30 mm, Fangweite 5 mm.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { AccumulatePass, makeSamples } from './accumulate.js';
import { createMaterial, createBatchMaterial, releaseMaterial, mainColor, setEnvironment } from './materials.js';
import { BOX_CODES, MATERIALS, MATERIAL, isAvailable, unitPrice } from './catalog.js';
import { TEMPLATES, templateToBricks } from './templates.js';

const MM = 0.001;
const SNAP = 5 * MM;
const EPS = 0.05 * MM;
const PLATE = 600 * MM;
const STORAGE_KEY = 'cado-builder-state-v1';
const DOWN = new THREE.Vector3(0, -1, 0);
const Q_TURN = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
const Q_TIP = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
const SUN_SIZE = 0.06; // Radius der Hauptleuchte beim Nachrechnen (bei 1,16 m Abstand) -> Breite der Halbschatten
const LAMP_SIZE = 0.012; // Radius der Deckenstrahler
const CENTER = new THREE.Vector2();
const THUMB_SEED = 0.53; // Vorschau-Seed: zeigt bei Marmor einen kraeftig geaderten Stein
const EYE = 0.09; // Augenhoehe beim Begehen: 90 mm = drei Steine
const LAMP_POS = [[-0.32, 0.62, 0.32], [0.32, 0.62, 0.32], [-0.32, 0.62, -0.32], [0.32, 0.62, -0.32]]; // Deckenstrahler ueber dem Raster

// Khronos-Neutral-Tonemapping wie in three.js. Seit der Nachbearbeitung (Fugenschatten) laeuft auch der Hintergrund
// durch das Tonemapping - er wird deshalb vorab "rueckwaerts" gerechnet und behaelt so exakt seine Farbe.
function untonemap(color) {
  let { r, g, b } = color;
  const out = Math.max(r, g, b);
  if (out >= 0.76) { // Kompression der Lichter zurueck (samt leichter Entsaettigung)
    const peak = 0.0576 / (1 - Math.min(out, 0.999)) + 0.52, t = 1 - 1 / (0.15 * (peak - out) + 1);
    [r, g, b] = [r, g, b].map((v) => ((v - out * t) / (1 - t)) * (peak / out));
  }
  const x = Math.min(r, g, b); // Versatz der Schatten zurueck
  const offset = x < 0.04 ? Math.sqrt(x / 6.25) - x : 0.04;
  return color.setRGB(r + offset, g + offset, b + offset);
}

const snap = (v) => Math.round(v / SNAP) * SNAP;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const round = (v, d) => Math.round(v * d) / d;

export class Builder extends EventTarget {
  constructor(container) {
    super();
    this.container = container;
    this.shapes = {};
    this.meta = {};
    this.bricks = [];
    this.history = [];
    this.historyIndex = -1;
    this.activeCode = null;
    this.activeMat = 'maple';
    this.ghostQ = new THREE.Quaternion();
    this.hoverBrick = null;
    this._nextId = 1;
    this._dirty = true;
    this._pointer = new THREE.Vector2();
    this._pointerInside = false;
    this._raycaster = new THREE.Raycaster();
    this._probe = new THREE.Raycaster();
    this._groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this._keys = new Set();
    this.selection = new Set();
    this.stamp = null; // Gruppe am Cursor: { items, box, moving }
    this.clipboard = null;
    this._clock = performance.now();
    this.walking = false;
    this.photo = false;
    this.aperture = 3 * MM; // Blendenradius im Foto-Modus
    try { this.aperture = Number(localStorage.getItem('cado-aperture') ?? 3) * MM; } catch { /* privater Modus */ }
    this._focusPoint = null; // angeklickter Schaerfepunkt, sonst Bildmitte
    this._focusDepth = 0.5;
    this._samples = makeSamples(36);
    this._refine = 0;
    this._stillAt = 0;
    this._camPos = new THREE.Vector3();
    this._bufferSize = new THREE.Vector2();
    this._initScene();
    this._initInput();
    this._loop();
  }

  // --------------------------------------------------------------------- Szene

  _initScene() {
    const r = (this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }));
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.shadowMap.autoUpdate = false; // Schatten nur einmal je Bild rechnen - die Nachbearbeitung rendert die Szene zweimal
    r.toneMapping = THREE.NeutralToneMapping;
    this.container.appendChild(r.domElement);

    const scene = (this.scene = new THREE.Scene());
    this.background = new THREE.Color('#f6f5f2');
    scene.background = this.background;
    this.env = this._makeEnvironment();
    scene.environment = this.env;
    scene.environmentIntensity = 0.62;
    // Metalle spiegeln eine kontrastreichere Fassung des Studios (dunklerer Raum, dunklerer Tisch): so zeigen sie Form
    this.envMetal = this._makeEnvironment(0.5, 0.3);
    setEnvironment(this.envMetal, 0.62);

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.01, 20);
    this.controls = new OrbitControls(this.camera, r.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.12;
    this.controls.minDistance = 0.12;
    this.controls.maxDistance = 2.4;
    this.controls.maxPolarAngle = Math.PI * 0.495;
    this.resetView();

    const sun = (this.sun = new THREE.DirectionalLight(0xffffff, 1.9));
    sun.position.set(-0.5, 0.95, 0.45);
    this._sunDir = sun.position.clone().normalize();
    this._sunBase = sun.position.clone();
    this._sunJitter = SUN_SIZE;
    scene.add(sun.target);
    this._sunT = new THREE.Vector3(0, 1, 0).cross(this._sunBase).normalize(); // Ebene quer zur Lichtrichtung
    this._sunB = this._sunBase.clone().cross(this._sunT).normalize();
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -0.5, right: 0.5, top: 0.5, bottom: -0.5, near: 0.1, far: 3 });
    sun.shadow.bias = -0.0002;
    sun.shadow.normalBias = 0.0006;
    sun.shadow.radius = 3;
    this.hemi = new THREE.HemisphereLight(0xffffff, 0xe6e4e0, 0.35);
    scene.add(sun, this.hemi);

    // heller Modus: nur der Schatten ist sichtbar; dunkler Modus: matter dunkler Boden, der Schatten aufnimmt
    this._floorLight = new THREE.ShadowMaterial({ opacity: 0.26 });
    this._bgUniform = { value: new THREE.Color() };
    this._floorDark = this._litFloor(0x1b1b1a);
    this._floorLit = this._litFloor(0xf6f5f2);
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), this._floorLight);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    scene.add(this.floor, this._makeGrid());

    // Steine: je Stein ein unsichtbares Objekt (Ebene 1) zum Anklicken und Pruefen; gezeichnet wird gebuendelt
    // je Form und Material (batchGroup), mit den Werten je Stein als Instanz-Attribute.
    this.bricksGroup = new THREE.Group();
    this.batchGroup = new THREE.Group();
    this._batches = new Map();
    this._batchDirty = true;
    this._raycaster.layers.set(1);
    this._probe.layers.set(1);
    scene.add(this.bricksGroup, this.batchGroup);

    this.ghostMesh = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.55, roughness: 0.6, depthWrite: false }),
    );
    this.ghostEdges = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x1d1d1b }));
    this.ghost = new THREE.Group();
    this.ghost.add(this.ghostMesh, this.ghostEdges);
    this.ghost.visible = false;
    this.hoverEdges = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x1d1d1b, depthTest: false }));
    this.hoverEdges.visible = false;
    this.hoverEdges.renderOrder = 10;
    scene.add(this.ghost, this.hoverEdges);
    this.selectionLines = new THREE.Group();
    this._selectionMaterial = new THREE.LineBasicMaterial({ color: 0xd9483b, depthTest: false });
    this.stampGhost = new THREE.Group();
    this.stampGhost.visible = false;
    this._stampMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.5, roughness: 0.6, depthWrite: false });
    scene.add(this.selectionLines, this.stampGhost);

    // Nachbearbeitung: Fugenschatten (Umgebungsverdeckung) in Fugen, Ecken und am Boden, danach Tonemapping
    this.composer = new EffectComposer(r, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }));
    this.renderPass = new RenderPass(scene, this.camera);
    this.ao = new GTAOPass(scene, this.camera, 1, 1);
    this.ao.blendIntensity = 0.95;
    this.ao.updateGtaoMaterial({ radius: 0.022, distanceExponent: 1.5, thickness: 1.4, scale: 1.15, samples: 16, distanceFallOff: 1, screenSpaceRadius: false });
    this.ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 5, radiusExponent: 1.3, rings: 2, samples: 16 });
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.ao);
    this.accum = new AccumulatePass(r); // mittelt die Bilder beim Nachrechnen (vor dem Tonemapping, also im Licht)
    this.composer.addPass(this.accum);
    // Gluehen: nur was deutlich heller als weiss ist (Lichtsteine, Strahler-Glanz), bekommt einen weichen Hof
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.3, 0.4, 3.0);
    this.composer.addPass(this.bloom);
    this._maxRatio = Math.min(window.devicePixelRatio, 2);
    this.composer.addPass(new OutputPass());

    this._initStudio();
    let dark = false;
    try { dark = localStorage.getItem('cado-dark') === '1'; } catch { /* privater Modus */ }
    this.setDark(dark);
    new ResizeObserver(() => this._resize()).observe(this.container);
    this._resize();
  }

  // Helles Fotostudio als Umgebung: Softboxen fuer Glanzlichter, zwei dunkle Blenden geben Metall Kontur
  _makeEnvironment(roomValue = 0.8, tableValue = 0.5) {
    const studio = new THREE.Scene();
    const glow = (v) => new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(v), side: THREE.DoubleSide });
    const room = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 10), glow(roomValue));
    room.position.y = 2.9;
    studio.add(room);
    const table = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), glow(tableValue)); // Tisch: Horizontlinie in Spiegelungen
    table.rotation.x = -Math.PI / 2;
    table.position.y = -0.02;
    studio.add(table);
    for (const [w, h, v, x, y, z] of [
      [5, 5, 5.5, 0, 5.6, 0], [3, 4, 4, -4.6, 2.6, 2], [2, 4, 1.6, 4.6, 2.2, -1],
      [6, 0.5, 6, 0, 4.2, -4.7], [0.5, 4, 3.5, 4.5, 2.5, 3.5], // schmale Lichtkanten
      [1.1, 5, 0.02, 3, 2.5, 4.4], [1.1, 5, 0.02, -2.6, 2.5, -4.6],
    ]) {
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glow(v));
      panel.position.set(x, y, z);
      panel.lookAt(0, 0.5, 0);
      studio.add(panel);
    }
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const texture = pmrem.fromScene(studio, 0.03).texture;
    pmrem.dispose();
    studio.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); });
    return texture;
  }

  _makeGrid() {
    const half = PLATE / 2, y = 0.0003;
    const fine = [], frame = [];
    for (let i = 1; i < 20; i++) {
      const p = -half + i * 30 * MM;
      fine.push(p, y, -half, p, y, half, -half, y, p, half, y, p);
    }
    frame.push(-half, y, -half, half, y, -half, half, y, -half, half, y, half, half, y, half, -half, y, half, -half, y, half, -half, y, -half);
    const line = (pts, color, opacity) => {
      const g = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
    };
    this.grid = new THREE.Group();
    this.grid.add(line(fine, 0x8f8a80, 0.22), line(frame, 0x55524c, 0.55));
    return this.grid;
  }

  setDark(on) {
    this.dark = on;
    this._applyLight();
    const [fine, frame] = this.grid.children;
    fine.material.color.set(on ? 0xffffff : 0x8f8a80);
    fine.material.opacity = on ? 0.09 : 0.22;
    frame.material.color.set(on ? 0xffffff : 0x55524c);
    frame.material.opacity = on ? 0.3 : 0.55;
    this.ghostEdges.material.color.set(on ? 0xf2f0ea : 0x1d1d1b);
    this.hoverEdges.material.color.set(on ? 0xf2f0ea : 0x1d1d1b);
    try { localStorage.setItem('cado-dark', on ? '1' : '0'); } catch { /* privater Modus */ }
    this._dirty = true;
  }

  // ------------------------------------------------------------------- Lichtstudio

  _initStudio() {
    const defaults = { brightness: 1, ambient: 1, kelvin: 6500, tint: '#ffffff', lamps: LAMP_POS.map(() => ({ on: false, color: '#ffffff' })) };
    this.studio = defaults;
    try {
      const saved = JSON.parse(localStorage.getItem('cado-studio') || 'null');
      if (saved?.lamps?.length === LAMP_POS.length) this.studio = { ...defaults, ...saved };
    } catch { /* privater Modus */ }

    // zarte Traverse mit vier kleinen Strahlern
    const railY = LAMP_POS[0][1] + 0.05;
    const pts = [];
    [0, 1, 3, 2].forEach((i, n, order) => {
      const p = LAMP_POS[i], q = LAMP_POS[order[(n + 1) % 4]];
      pts.push(p[0], railY, p[2], q[0], railY, q[2], p[0], railY, p[2], p[0], p[1], p[2]);
    });
    this.lampGroup = new THREE.Group();
    this.lampRail = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)),
      new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55 }),
    );
    this.lampGroup.add(this.lampRail);
    this.lampBody = new THREE.MeshBasicMaterial();
    const down = new THREE.Vector3(0, -1, 0);
    this.lamps = LAMP_POS.map((p) => {
      const light = new THREE.SpotLight(0xffffff, 0, 3, 0.66, 0.85, 2);
      light.position.set(...p);
      light.target.position.set(p[0] * 0.4, 0.02, p[2] * 0.4);
      light.castShadow = true;
      light.shadow.mapSize.set(1024, 1024);
      light.shadow.bias = -0.0003;
      light.shadow.normalBias = 0.0008;
      light.shadow.radius = 4;
      light.shadow.camera.near = 0.15;
      light.shadow.camera.far = 2;
      const head = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.013, 0.026, 28), this.lampBody);
      head.position.copy(light.position);
      head.quaternion.setFromUnitVectors(down, light.target.position.clone().sub(light.position).normalize());
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.0115, 28), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false }));
      lens.position.y = -0.0132;
      lens.rotation.x = Math.PI / 2;
      head.add(lens);
      this.scene.add(light, light.target);
      this.lampGroup.add(head);
      return { light, lens };
    });
    this.scene.add(this.lampGroup);
  }

  // Boden, der Licht annimmt (Lichtkegel der Strahler) und zum Rand in den Hintergrund ausblendet
  _litFloor(color) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.94, metalness: 0 });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uBg = this._bgUniform;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vFloorPos;')
        .replace('#include <project_vertex>', '#include <project_vertex>\nvFloorPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 uBg;\nvarying vec3 vFloorPos;')
        .replace('#include <dithering_fragment>', '#include <dithering_fragment>\ngl_FragColor.rgb = mix(gl_FragColor.rgb, uBg, smoothstep(0.9, 2.4, length(vFloorPos.xz)));');
    };
    return m;
  }

  // Grundlicht (Sonne, Himmel, Umgebung, Hintergrund) und die vier Strahler nach den Studio-Einstellungen setzen
  _applyLight() {
    if (!this.studio) return;
    const s = this.studio;
    const base = this.dark ? [1.15, 0.18, 0.42] : [1.9, 0.35, 0.62];
    this.sun.intensity = base[0] * s.ambient;
    this.sun.color.set(s.tint);
    this.hemi.intensity = base[1] * s.ambient;
    this.hemi.color.set(s.tint);
    this.scene.environmentIntensity = base[2] * (0.15 + 0.85 * s.ambient);
    setEnvironment(this.envMetal, this.scene.environmentIntensity);
    // der Hintergrund ist die Studiowand: mit weniger Grundlicht wird auch sie dunkler
    untonemap(this.background.set(this.dark ? '#141413' : '#f6f5f2').multiplyScalar(0.25 + 0.75 * Math.min(s.ambient, 1)));
    this._bgUniform.value.copy(this.background);
    let lit = false;
    this.lamps.forEach(({ light, lens }, i) => {
      const lamp = s.lamps[i];
      const on = lamp.on && s.brightness > 0;
      light.visible = on;
      light.intensity = 0.5 * s.brightness;
      light.color.set(lamp.color);
      lens.material.color.set(on ? lamp.color : (this.dark ? '#2c2b29' : '#bdb9b0'));
      lit ||= on;
    });
    this.lampGroup.visible = s.lamps.some((l) => l.on) && !this.photo;
    this.lampBody.color.set(this.dark ? '#4a4844' : '#e4e1da');
    this.lampRail.material.color.set(this.dark ? '#f2f0ea' : '#8f8a80');
    this.lampRail.material.opacity = this.dark ? 0.3 : 0.55;
    this.floor.material = this.dark ? this._floorDark : lit ? this._floorLit : this._floorLight;
    this._dirty = true;
  }

  setStudio(change) {
    Object.assign(this.studio, change);
    try { localStorage.setItem('cado-studio', JSON.stringify(this.studio)); } catch { /* privater Modus */ }
    this._applyLight();
    this.dispatchEvent(new CustomEvent('light'));
  }

  setLamp(index, change) {
    const lamps = this.studio.lamps.map((l, i) => (i === index ? { ...l, ...change } : l));
    this.setStudio({ lamps });
  }

  _resize() {
    const w = this.container.clientWidth || 1, h = this.container.clientHeight || 1;
    this.renderer.setSize(w, h);
    this.composer.setPixelRatio(this.renderer.getPixelRatio());
    this.composer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this._dirty = true;
  }

  // ------------------------------------------------------------------- Qualitaet
  // hoch: alles an. mittel: ohne Fugenschatten, Aufloesung 1. niedrig: auch ohne Gluehen, kleinere Schattenkarte,
  // geringere Aufloesung, kuerzeres Nachrechnen. "auto" misst nach dem Laden die Bildrate und stuft bei Bedarf ab.
  setQuality(level, remember = true) {
    this.qualitySetting = level;
    if (remember) try { localStorage.setItem('cado-quality', level); } catch { /* privater Modus */ }
    const eff = level === 'auto' ? this.quality ?? 'hoch' : level;
    this.quality = eff;
    const ratio = { hoch: this._maxRatio, mittel: Math.min(this._maxRatio, 1), niedrig: Math.min(this._maxRatio, 0.75) }[eff];
    this.renderer.setPixelRatio(ratio);
    this.ao.enabled = eff === 'hoch';
    this.bloom.enabled = eff !== 'niedrig';
    const map = eff === 'niedrig' ? 1024 : 2048;
    if (this.sun.shadow.mapSize.x !== map) {
      this.sun.shadow.mapSize.set(map, map);
      this.sun.shadow.map?.dispose();
      this.sun.shadow.map = null;
    }
    this._samples = makeSamples(this.photo ? 72 : eff === 'niedrig' ? 12 : 36);
    this._resize();
    this.dispatchEvent(new CustomEvent('quality'));
  }

  // Bildrate messen: 30 Bilder erzwingen, Median der Abstaende; zu langsam -> eine Stufe herunter, erneut messen
  benchmark() {
    if (document.hidden || this.qualitySetting !== 'auto') return;
    this._bench = { last: 0, gaps: [] };
  }

  _benchStep(now) {
    const b = this._bench;
    if (b.last) b.gaps.push(now - b.last);
    b.last = now;
    this._dirty = true;
    if (b.gaps.length < 30) return;
    this._bench = null;
    const median = b.gaps.sort((x, y) => x - y)[15];
    const next = { hoch: 'mittel', mittel: 'niedrig' }[this.quality];
    if (median > 26 && next) {
      this.quality = next;
      this.setQuality('auto', false);
      this.benchmark();
    }
  }

  _loop = () => {
    requestAnimationFrame(this._loop);
    const now = performance.now(), dt = Math.min((now - this._clock) / 1000, 0.05);
    this._clock = now;
    if (this._bench) this._benchStep(now);
    if (this._keys.size) this._walk(dt);
    if (this.controls.update() || this._dirty) {
      this._dirty = false;
      this._refine = 0;
      this._stillAt = now;
      this._renderSample(0, this._samples);
    } else if (this._refine < this._samples.length - 1 && now - this._stillAt > 160) {
      // nichts bewegt sich: Bild fuer Bild nachrechnen, bis alle Stichproben gemittelt sind
      if (this._refine === 0) this._updateFocus(this.camera);
      this._renderSample(++this._refine, this._samples);
    }
  };

  // Ein Bild rendern. k = 0: normales Bild (beginnt das Mitteln neu); k > 0: k-te Stichprobe zum Nachrechnen mit
  // Pixelversatz (Kanten), verschobenen Leuchten (weiche Schatten) und - im Foto-Modus - Punkt auf der Blende.
  _renderSample(k, samples, camera = this.camera) {
    if (this._batchDirty) this._rebuildBatches();
    const s = samples[k], still = k > 0;
    if (!still) this.accum.count = 0;
    this.sun.position.copy(this._sunBase).addScaledVector(this._sunT, s.light[0] * this._sunJitter).addScaledVector(this._sunB, s.light[1] * this._sunJitter);
    this.sun.shadow.radius = still ? 1.2 : 3; // beim Nachrechnen macht die Flaeche der Leuchte den Schatten weich
    this.lamps.forEach(({ light }, i) => {
      light.position.set(LAMP_POS[i][0] + s.light[1] * LAMP_SIZE, LAMP_POS[i][1], LAMP_POS[i][2] - s.light[0] * LAMP_SIZE);
      light.shadow.radius = still ? 1.5 : 4;
    });
    const size = this.renderer.getDrawingBufferSize(this._bufferSize);
    // Blende waechst mit der Fokusdistanz mit - so wirkt die Unschaerfe nah wie fern aehnlich stark
    const lens = still && this.photo && camera.isPerspectiveCamera ? this.aperture * clamp(this._focusDepth / 0.5, 0.2, 1.6) : 0;
    let px = s.pixel[0], py = s.pixel[1];
    if (lens > 0) {
      camera.updateMatrixWorld();
      const e = camera.matrixWorld.elements, ox = s.lens[0] * lens, oy = s.lens[1] * lens; // Spalten: rechts, oben
      this._camPos.copy(camera.position);
      camera.position.set(this._camPos.x + e[0] * ox + e[4] * oy, this._camPos.y + e[1] * ox + e[5] * oy, this._camPos.z + e[2] * ox + e[6] * oy);
      // Schaerfeebene festhalten: den Bildausschnitt um die Parallaxe verschieben, die ein Punkt in dieser Ebene haette
      const span = 2 * this._focusDepth * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      px -= (ox / (span * camera.aspect)) * size.x;
      py += (oy / span) * size.y;
    }
    if (still) camera.setViewOffset(size.x, size.y, px, py, size.x, size.y);
    this.renderer.shadowMap.needsUpdate = true;
    this.composer.render();
    if (still) camera.clearViewOffset();
    if (lens > 0) camera.position.copy(this._camPos);
  }

  // Schaerfe: angeklickter Punkt, sonst das, was in der Bildmitte liegt
  _updateFocus(camera) {
    camera.updateMatrixWorld();
    let point = this._focusPoint;
    if (!point) {
      this._raycaster.setFromCamera(CENTER, camera);
      point = this._raycaster.intersectObjects(this.bricksGroup.children, false)[0]?.point ?? this.controls.target;
    }
    this._focusDepth = Math.max(0.02, point.clone().sub(camera.position).dot(camera.getWorldDirection(new THREE.Vector3())));
  }

  // Foto-Modus: Hilfslinien aus, Tiefenschaerfe an; ein Klick stellt scharf. Gebaut wird hier nicht.
  setPhotoMode(on) {
    this.photo = on;
    if (on) this.cancelStamp();
    this.grid.visible = !on;
    this.selectionLines.visible = !on;
    this._focusPoint = null;
    this._samples = makeSamples(on ? 72 : 36);
    this._applyLight();
    this._updateHover();
    this.dispatchEvent(new CustomEvent('tool'));
  }

  setAperture(mm) {
    this.aperture = mm * MM;
    try { localStorage.setItem('cado-aperture', String(mm)); } catch { /* privater Modus */ }
    this._dirty = true;
  }

  // Pfeiltasten: vor/zurueck gehen, links/rechts drehen; mit Shift seitwaerts gehen bzw. Hoehe aendern
  _walk(dt) {
    const cam = this.camera.position, target = this.controls.target;
    const fwd = new THREE.Vector3().subVectors(target, cam);
    const reach = fwd.length();
    fwd.y = 0;
    if (fwd.lengthSq() < 1e-9) fwd.set(0, 0, -1);
    fwd.normalize();
    const side = new THREE.Vector3(-fwd.z, 0, fwd.x);
    const speed = (this.walking ? 0.1 : Math.max(0.12, reach * 0.45)) * dt, turn = 1.5 * dt;
    const move = new THREE.Vector3();
    const has = (k) => this._keys.has(k);
    const shift = has('Shift');
    if (has('ArrowUp')) shift ? (move.y += speed) : move.addScaledVector(fwd, speed);
    if (has('ArrowDown')) shift ? (move.y -= speed) : move.addScaledVector(fwd, -speed);
    if (shift && has('ArrowLeft')) move.addScaledVector(side, -speed);
    if (shift && has('ArrowRight')) move.addScaledVector(side, speed);
    if (cam.y + move.y < 0.008) move.y = 0.008 - cam.y;
    cam.add(move);
    target.add(move);
    if (!shift && (has('ArrowLeft') || has('ArrowRight'))) {
      // auf der Stelle drehen: Blickpunkt um die Kamera schwenken
      const angle = has('ArrowLeft') ? turn : -turn;
      target.sub(cam).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle).add(cam);
    }
    this._dirty = true;
  }

  // Begehen: Kamera auf Augenhoehe 90 mm = drei Steine (Massstab ca. 1:20), weiter Blickwinkel
  setWalkMode(on, view = null) {
    this.walking = on;
    this.camera.fov = on ? (view?.fov ?? 62) : 30;
    this.camera.near = on ? 0.002 : 0.01;
    this.camera.updateProjectionMatrix();
    this.controls.minDistance = on ? 0.01 : 0.12;
    this.controls.maxPolarAngle = Math.PI * (on ? 0.8 : 0.495);
    if (!on) { this.fitView(); this.dispatchEvent(new CustomEvent('tool')); return; }
    if (view) {
      const mm = ([x, y, z]) => new THREE.Vector3(x * MM, z * MM, -y * MM);
      this.camera.position.copy(mm(view.pos));
      this.controls.target.copy(mm(view.look));
      this.controls.update();
      this._dirty = true;
      this.dispatchEvent(new CustomEvent('tool'));
      return;
    }
    const box = new THREE.Box3();
    for (const b of this.bricks) box.union(b.aabb);
    const c = box.isEmpty() ? new THREE.Vector3() : box.getCenter(new THREE.Vector3());
    const depth = box.isEmpty() ? 0.1 : (box.max.z - box.min.z) / 2;
    this.camera.position.set(c.x, EYE, c.z + depth + 0.2);
    this.controls.target.set(c.x, EYE - 0.012, c.z + depth + 0.14);
    this.controls.update();
    this._dirty = true;
    this.dispatchEvent(new CustomEvent('tool'));
  }

  resetView() {
    this.camera.position.set(0.42, 0.34, 0.62);
    this.controls.target.set(0, 0.035, 0);
    this.controls.update();
    this._dirty = true;
  }

  fitView() {
    if (!this.bricks.length) return this.resetView();
    const box = new THREE.Box3();
    for (const b of this.bricks) box.union(b.aabb);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const half = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const narrow = Math.min(half, Math.atan(Math.tan(half) * this.camera.aspect)); // Hochformat: Breite begrenzt
    const dist = Math.max(0.35, (sphere.radius / Math.sin(narrow)) * 1.1);
    this.controls.target.copy(sphere.center);
    this.camera.position.copy(sphere.center).addScaledVector(new THREE.Vector3(0.42, 0.3, 0.62).normalize(), dist);
    this.controls.update();
    this._dirty = true;
  }

  // --------------------------------------------------------------------- Laden

  async load() {
    // Basisadresse: lokal "/", auf biest.com "/cado-builder/". Bevorzugt die komprimierte Fassung (npm run models).
    const base = import.meta.env?.BASE_URL ?? '/';
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const [gltf, catalog] = await Promise.all([
      loader.loadAsync(`${base}models/cado_elements_all.min.glb`).catch(() => loader.loadAsync(`${base}models/cado_elements_all.glb`)),
      fetch(`${base}catalog.json`).then((res) => res.json()),
    ]);
    for (const s of catalog.shapes) this.meta[s.code] = s;
    gltf.scene.updateMatrixWorld(true);
    const inserts = {};
    gltf.scene.traverse((o) => {
      if (!o.isMesh) return;
      const [, code, isInsert] = o.name.match(/^CADO_([A-Z]*\d{3})(_INS)?/) || [];
      if (!code) return;
      const geometry = o.geometry.clone().applyMatrix4(o.matrixWorld);
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      if (isInsert) {
        inserts[code] = geometry;
        return;
      }
      this.shapes[code] = {
        code, geometry, box: geometry.boundingBox.clone(), isBox: BOX_CODES.has(code), joints: !code.startsWith('MOO'), // Moos ist zu knubbelig fuer Fugenlinien
        edges: new THREE.EdgesGeometry(geometry, 30),
      };
    });

    // Einsatz = fest mit dem Stein verbundenes Teil aus anderem Material (catalog.json: "insert")
    for (const [code, geometry] of Object.entries(inserts)) {
      if (this.shapes[code]) this.shapes[code].insert = { geometry, mat: this.meta[code]?.insert ?? 'aluminium' };
    }

    let restored = false;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved?.bricks?.length) {
        this._restore(saved);
        restored = true;
      }
    } catch { /* kein gespeicherter Stand */ }
    if (!restored) this._restore({ bricks: this._templateBricks(TEMPLATES.findIndex((t) => t.name === 'Lounge')) });
    this._commit();
    this.dispatchEvent(new CustomEvent('ready'));
  }

  // --------------------------------------------------------------------- Steine & Zustand

  // Fugen: je Stein feststellen, welche seiner sechs Flaechen von Nachbarn (oder dem Boden) belegt sind,
  // und das in den Objektraum des Steins uebersetzen - der Shader zeichnet dort die Fugenlinie.
  // Buendel neu aufbauen: je Form+Material ein InstancedMesh, Instanz-Daten aus den Einzelsteinen
  _rebuildBatches() {
    this._batchDirty = false;
    const groups = new Map();
    for (const b of this.bricks) {
      if (!b.mesh.visible) continue;
      const key = b.code + '|' + b.mat;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(b);
    }
    for (const [key, batch] of this._batches) {
      if (groups.has(key)) continue;
      this._disposeBatch(batch);
      this._batches.delete(key);
    }
    for (const [key, list] of groups) {
      let batch = this._batches.get(key);
      if (batch && batch.capacity < list.length) { this._disposeBatch(batch); batch = null; }
      if (!batch) {
        const [code, mat] = key.split('|');
        batch = this._createBatch(code, mat, Math.ceil(Math.max(list.length, 4) * 1.5));
        this._batches.set(key, batch);
      }
      const { mesh, attrs } = batch;
      list.forEach((b, i) => {
        b.mesh.updateMatrix();
        mesh.setMatrixAt(i, b.mesh.matrix);
        const joint = b.mesh.material.userData.joint, seed = b.mesh.material.userData.seed;
        attrs.aSeedTone.setXYZW(i, seed?.x ?? 0, seed?.y ?? 0, seed?.z ?? 0, joint?.uTone.value ?? 1);
        for (const [name, u] of [['aHalf', 'uHalf'], ['aCenter', 'uCenter'], ['aCoverPos', 'uCoverPos'], ['aCoverNeg', 'uCoverNeg']]) {
          const v = joint?.[u].value;
          attrs[name].setXYZ(i, v?.x ?? 0, v?.y ?? 0, v?.z ?? 0);
        }
      });
      mesh.count = list.length;
      mesh.instanceMatrix.needsUpdate = true;
      for (const a of Object.values(attrs)) a.needsUpdate = true;
      mesh.boundingSphere = null;
      mesh.boundingBox = null;
    }
    this._fitShadow();
  }

  _createBatch(code, mat, capacity) {
    const shape = this.shapes[code];
    const geometry = new THREE.BufferGeometry();
    for (const [name, attr] of Object.entries(shape.geometry.attributes)) geometry.setAttribute(name, attr); // Puffer geteilt
    geometry.setIndex(shape.geometry.index);
    geometry.boundingBox = shape.geometry.boundingBox;
    geometry.boundingSphere = shape.geometry.boundingSphere;
    const attrs = {};
    for (const [name, size] of [['aSeedTone', 4], ['aHalf', 3], ['aCenter', 3], ['aCoverPos', 3], ['aCoverNeg', 3]]) {
      attrs[name] = new THREE.InstancedBufferAttribute(new Float32Array(capacity * size), size);
      attrs[name].setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute(name, attrs[name]);
    }
    const material = createBatchMaterial(mat, this.meta[code]?.grain_axis ?? 'Z');
    const mesh = new THREE.InstancedMesh(geometry, material, capacity);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.raycast = () => {}; // angeklickt werden die Einzelsteine
    this.batchGroup.add(mesh);
    return { mesh, attrs, capacity, shapeAttrs: Object.keys(shape.geometry.attributes) };
  }

  _disposeBatch({ mesh, shapeAttrs }) {
    this.batchGroup.remove(mesh);
    // geteilte Form-Puffer vor dem Freigeben abhaengen, sonst verlieren die Einzelsteine ihre GPU-Puffer
    for (const name of shapeAttrs) mesh.geometry.deleteAttribute(name);
    mesh.geometry.setIndex(null);
    mesh.geometry.dispose();
    releaseMaterial(mesh.material);
    mesh.dispose();
  }

  // Schattenbereich der Hauptleuchte eng um Modell und Schattenwurf legen: scharfe Schatten auch bei grossen Modellen
  _fitShadow() {
    const pts = [], d = this._sunDir;
    for (const b of this.bricks) {
      for (const x of [b.aabb.min.x, b.aabb.max.x]) for (const y of [b.aabb.min.y, b.aabb.max.y]) for (const z of [b.aabb.min.z, b.aabb.max.z]) {
        pts.push(new THREE.Vector3(x, y, z), new THREE.Vector3(x - (d.x * y) / d.y, 0, z - (d.z * y) / d.y));
      }
    }
    const sphere = pts.length ? new THREE.Box3().setFromPoints(pts).getBoundingSphere(new THREE.Sphere()) : new THREE.Sphere(new THREE.Vector3(), 0.5);
    const r = Math.max(sphere.radius * 1.04, 0.12), dist = r + 1;
    this._sunBase.copy(sphere.center).addScaledVector(d, dist);
    this._sunJitter = SUN_SIZE * (dist / 1.16); // gleicher Winkel der Leuchte, also gleich weiche Schatten
    this.sun.target.position.copy(sphere.center);
    this.sun.target.updateMatrixWorld();
    Object.assign(this.sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 0.05, far: dist + r + 0.1 });
    this.sun.shadow.camera.updateProjectionMatrix();
  }

  _updateJoints() {
    const T = 0.4 * MM, list = this.bricks, n = list.length;
    const area = list.map(() => [0, 0, 0, 0, 0, 0]); // +x -x +y -y +z -z
    const ax = ['x', 'y', 'z'];
    for (let i = 0; i < n; i++) {
      const a = list[i].aabb;
      if (a.min.y < T) area[i][3] = Infinity;
      for (let j = i + 1; j < n; j++) {
        const b = list[j].aabb;
        if (a.max.x < b.min.x - T || b.max.x < a.min.x - T || a.max.y < b.min.y - T || b.max.y < a.min.y - T
          || a.max.z < b.min.z - T || b.max.z < a.min.z - T) continue;
        for (let k = 0; k < 3; k++) {
          const u = ax[(k + 1) % 3], v = ax[(k + 2) % 3], w = ax[k];
          const o = Math.max(0, Math.min(a.max[u], b.max[u]) - Math.max(a.min[u], b.min[u]))
            * Math.max(0, Math.min(a.max[v], b.max[v]) - Math.max(a.min[v], b.min[v]));
          if (o <= 0) continue;
          if (Math.abs(a.max[w] - b.min[w]) < T) { area[i][2 * k] += o; area[j][2 * k + 1] += o; }
          if (Math.abs(a.min[w] - b.max[w]) < T) { area[i][2 * k + 1] += o; area[j][2 * k] += o; }
        }
      }
    }
    const dir = new THREE.Vector3(), size = new THREE.Vector3();
    list.forEach((brick, i) => {
      const joint = brick.mesh.material.userData.joint;
      if (!joint) return;
      if (!brick.shape.joints) { joint.uHalf.value.set(0, 0, 0); return; }
      brick.shape.box.getSize(joint.uHalf.value).multiplyScalar(0.5);
      brick.shape.box.getCenter(joint.uCenter.value);
      brick.aabb.getSize(size);
      const covered = (f) => {
        const k = f >> 1, face = size[ax[(k + 1) % 3]] * size[ax[(k + 2) % 3]];
        return area[i][f] > 0.45 * face ? 1 : 0;
      };
      for (let c = 0; c < 3; c++) {
        dir.set(0, 0, 0).setComponent(c, 1).applyQuaternion(brick.mesh.quaternion);
        const k = Math.abs(dir.x) > 0.5 ? 0 : Math.abs(dir.y) > 0.5 ? 1 : 2, positive = dir.getComponent(k) > 0;
        joint.uCoverPos.value.setComponent(c, covered(2 * k + (positive ? 0 : 1)));
        joint.uCoverNeg.value.setComponent(c, covered(2 * k + (positive ? 1 : 0)));
      }
    });
  }

  _rotatedBox(code, q) {
    const b = this.shapes[code].box, out = new THREE.Box3(), v = new THREE.Vector3();
    for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) {
      out.expandByPoint(v.set(x, y, z).applyQuaternion(q));
    }
    for (const p of [out.min, out.max]) p.set(round(p.x, 1e7), round(p.y, 1e7), round(p.z, 1e7));
    return out;
  }

  _addBrick(data) {
    const shape = this.shapes[data.code];
    if (!shape) return null;
    if (!MATERIAL[data.mat]) data = { ...data, mat: 'maple' }; // Stand aus aelterer Version
    const mesh = new THREE.Mesh(shape.geometry, createMaterial(data.mat, this.meta[data.code]?.grain_axis ?? 'Z', data.s));
    mesh.position.fromArray(data.p);
    mesh.quaternion.fromArray(data.q);
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.layers.set(1); // nur fuer Raycasts - gezeichnet wird im Buendel
    this._batchDirty = true;
    if (shape.insert) mesh.add(this._insertMesh(shape, data.s));
    this._syncGlow(mesh, data.mat, shape);
    const brick = { id: data.id, code: data.code, mat: data.mat, s: data.s, shape, mesh, aabb: new THREE.Box3() };
    mesh.userData.brick = brick;
    this._updateAabb(brick);
    this.bricksGroup.add(mesh);
    this.bricks.push(brick);
    return brick;
  }

  // Lichtstein: leuchtet nicht nur selbst, sondern beleuchtet seine Umgebung (hoechstens 12 Lichtquellen)
  _syncGlow(mesh, mat, shape) {
    const old = mesh.children.find((c) => c.isLight);
    if (old) mesh.remove(old);
    const spec = MATERIAL[mat];
    if (!spec?.params?.emission) return;
    const lights = this.bricks.filter((b) => b.mesh.children.some((c) => c.isLight)).length;
    if (lights >= 12) return;
    const glow = new THREE.PointLight(new THREE.Color().setRGB(...spec.params.color), spec.params.emission * 0.004, 0.6, 2);
    shape.box.getCenter(glow.position);
    mesh.add(glow);
  }

  _insertMesh(shape, seed) {
    const part = new THREE.Mesh(shape.insert.geometry, createMaterial(shape.insert.mat, 'Z', seed));
    part.castShadow = part.receiveShadow = true;
    return part;
  }

  _updateAabb(brick) {
    this._batchDirty = true;
    brick.mesh.updateMatrixWorld(true);
    brick.aabb.copy(this._rotatedBox(brick.code, brick.mesh.quaternion)).translate(brick.mesh.position);
  }

  _dropBrick(brick) {
    this.bricksGroup.remove(brick.mesh);
    this._batchDirty = true;
    releaseMaterial(brick.mesh.material);
    for (const part of brick.mesh.children) releaseMaterial(part.material);
    this.bricks.splice(this.bricks.indexOf(brick), 1);
    if (this.hoverBrick === brick) this.hoverBrick = null;
    this.selection.delete(brick);
  }

  getState() {
    return {
      bricks: this.bricks.map((b) => ({
        id: b.id, code: b.code, mat: b.mat, s: b.s,
        p: b.mesh.position.toArray().map((v) => round(v, 1e6)),
        q: b.mesh.quaternion.toArray().map((v) => round(v, 1e5)),
      })),
    };
  }

  _restore(state) {
    for (const b of [...this.bricks]) this._dropBrick(b);
    for (const d of state.bricks) this._addBrick(d);
    this._updateJoints();
    this._focusPoint = null;
    this._syncSelection();
    this._nextId = Math.max(0, ...this.bricks.map((b) => b.id)) + 1;
    this._dirty = true;
  }

  _commit() {
    this._updateJoints();
    const snapshot = JSON.stringify(this.getState());
    if (snapshot === this.history[this.historyIndex]) return;
    this.history.length = this.historyIndex + 1;
    this.history.push(snapshot);
    this.historyIndex++;
    try { localStorage.setItem(STORAGE_KEY, snapshot); } catch { /* privater Modus */ }
    this._dirty = true;
    this.dispatchEvent(new CustomEvent('change'));
  }

  _travel(step) {
    const i = this.historyIndex + step;
    if (i < 0 || i >= this.history.length) return;
    this.historyIndex = i;
    this._restore(JSON.parse(this.history[i]));
    try { localStorage.setItem(STORAGE_KEY, this.history[i]); } catch { /* privater Modus */ }
    this._updateHover();
    this.dispatchEvent(new CustomEvent('change'));
  }

  undo() { this._travel(-1); }
  redo() { this._travel(1); }
  get canUndo() { return this.historyIndex > 0; }
  get canRedo() { return this.historyIndex < this.history.length - 1; }

  clear() {
    this._restore({ bricks: [] });
    this._commit();
  }

  loadState(state) {
    this._restore(state);
    this._commit();
  }

  _templateBricks(index) {
    this._nextId = 1;
    return templateToBricks(TEMPLATES[index], () => this._nextId++, (code, q) => this._rotatedBox(code, q));
  }

  // Aktuellen Stand ins Vorlagenformat [Code, Material, x, y, z, Lage, Seed] (mm, Mitte der Standflaeche) umrechnen;
  // im Begehen-Modus wird der Kamerastandpunkt als Foto-Ansicht mitgespeichert
  toTemplate() {
    const r = (v) => Math.round(v * 10) / 10;
    const bricks = this.bricks.map((b) => {
      const box = this._rotatedBox(b.code, b.mesh.quaternion), p = b.mesh.position;
      const x = (p.x + (box.min.x + box.max.x) / 2) * 1000, z = (p.y + box.min.y) * 1000, y = -(p.z + (box.min.z + box.max.z) / 2) * 1000;
      return [b.code, b.mat, r(x), r(y), r(z), b.mesh.quaternion.toArray().map((v) => Math.round(v * 1e5) / 1e5), b.s];
    });
    const mm = (v) => [r(v.x * 1000), r(-v.z * 1000), r(v.y * 1000)];
    const view = this.walking ? { pos: mm(this.camera.position), look: mm(this.controls.target), fov: Math.round(this.camera.fov) } : undefined;
    return { bricks, dark: this.dark, view };
  }

  loadTemplate(index) {
    const tpl = TEMPLATES[index];
    this.currentTemplate = index;
    this._restore({ bricks: this._templateBricks(index) });
    this._commit();
    if (tpl.dark !== undefined) this.setDark(tpl.dark);
    if (tpl.view) this.setWalkMode(true, tpl.view); // Kamerastandpunkt des Fotos
    else if (this.walking) this.setWalkMode(false);
    else this.fitView();
  }

  // ------------------------------------------------------------------- Auswahl, Duplizieren, Verschieben

  select(brick, additive = false) {
    if (!additive) this.selection.clear();
    if (this.selection.has(brick)) this.selection.delete(brick);
    else this.selection.add(brick);
    this._syncSelection();
  }

  clearSelection() {
    if (!this.selection.size) return;
    this.selection.clear();
    this._syncSelection();
  }

  selectAll() {
    this.selection = new Set(this.bricks);
    this._syncSelection();
  }

  _syncSelection() {
    this.selectionLines.clear();
    for (const b of this.selection) {
      const lines = new THREE.LineSegments(b.shape.edges, this._selectionMaterial);
      lines.position.copy(b.mesh.position);
      lines.quaternion.copy(b.mesh.quaternion);
      lines.renderOrder = 9;
      this.selectionLines.add(lines);
    }
    this._dirty = true;
    this.dispatchEvent(new CustomEvent('tool'));
  }

  deleteSelection() {
    if (!this.selection.size) return;
    for (const b of [...this.selection]) this._dropBrick(b);
    this._settle();
    this._commit();
    this._syncSelection();
  }

  // aktives Material auf alle ausgewaehlten Steine, soweit es die Form in diesem Material gibt
  paintSelection(mat) {
    let changed = false;
    for (const b of this.selection) {
      if (b.mat === mat || !isAvailable(mat, b.code)) continue;
      releaseMaterial(b.mesh.material);
      b.mat = mat;
      b.mesh.material = createMaterial(mat, this.meta[b.code]?.grain_axis ?? 'Z', b.s);
      this._syncGlow(b.mesh, mat, b.shape);
      this._batchDirty = true;
      changed = true;
    }
    if (changed) this._commit();
  }

  // Gruppe relativ zu ihrem Ankerpunkt (Mitte der Standflaeche der gemeinsamen Huelle)
  _groupFrom(bricks) {
    const hull = new THREE.Box3();
    for (const b of bricks) hull.union(b.aabb);
    const anchor = new THREE.Vector3((hull.min.x + hull.max.x) / 2, hull.min.y, (hull.min.z + hull.max.z) / 2);
    return {
      box: hull.clone().translate(anchor.clone().negate()),
      items: bricks.map((b) => ({ code: b.code, mat: b.mat, s: b.s, q: b.mesh.quaternion.clone(), offset: b.mesh.position.clone().sub(anchor) })),
    };
  }

  copySelection() {
    if (this.selection.size) this.clipboard = this._groupFrom([...this.selection]);
  }

  paste() {
    if (this.clipboard) this._startStamp(this.clipboard, false);
  }

  // Duplizieren: die Kopie haengt am Cursor und laesst sich beliebig oft setzen (Esc beendet)
  duplicateSelection() {
    if (!this.selection.size) return;
    this.copySelection();
    this.paste();
  }

  // Verschieben: die Auswahl wird aufgenommen und einmal neu gesetzt (Esc stellt sie wieder her)
  moveSelection() {
    if (!this.selection.size) return;
    const group = this._groupFrom([...this.selection]);
    const backup = JSON.stringify(this.getState());
    for (const b of [...this.selection]) this._dropBrick(b);
    this._syncSelection();
    this._startStamp(group, true, backup);
  }

  _startStamp(group, moving, backup = null) {
    this.activeCode = null;
    this.stamp = { box: group.box.clone(), items: group.items.map((i) => ({ ...i, q: i.q.clone(), offset: i.offset.clone() })), moving, backup };
    this._buildStampGhost();
    this._emitTool();
  }

  _buildStampGhost() {
    this.stampGhost.clear();
    for (const item of this.stamp.items) {
      const m = new THREE.Mesh(this.shapes[item.code].geometry, this._stampMaterial);
      m.position.copy(item.offset);
      m.quaternion.copy(item.q);
      this.stampGhost.add(m);
    }
  }

  _rotateStamp() {
    const box = new THREE.Box3();
    for (const item of this.stamp.items) {
      item.offset.applyQuaternion(Q_TURN);
      item.q.premultiply(Q_TURN).normalize();
      box.union(this._rotatedBox(item.code, item.q).translate(item.offset));
    }
    // Anker bleibt die Mitte der Standflaeche
    const shift = new THREE.Vector3((box.min.x + box.max.x) / 2, box.min.y, (box.min.z + box.max.z) / 2);
    for (const item of this.stamp.items) item.offset.sub(shift);
    this.stamp.box = box.translate(shift.negate());
    this._buildStampGhost();
    this._emitTool();
  }

  _placeStamp() {
    const p = this._placement;
    if (!p?.valid || !this.stamp) return;
    const placed = [];
    for (const item of this.stamp.items) {
      placed.push(this._addBrick({
        id: this._nextId++, code: item.code, mat: item.mat, s: this.stamp.moving ? item.s : round(Math.random(), 1e4),
        p: p.position.clone().add(item.offset).toArray(), q: item.q.toArray(),
      }));
    }
    this._settle();
    this._commit();
    if (this.stamp.moving) {
      this.stamp = null;
      this.selection = new Set(placed.filter(Boolean));
      this._syncSelection();
    }
    this._updateHover();
  }

  cancelStamp() {
    if (!this.stamp) return;
    const { moving, backup } = this.stamp;
    this.stamp = null;
    if (moving && backup) this._restore(JSON.parse(backup));
    this._emitTool();
  }

  removeBrick(brick) {
    this._dropBrick(brick);
    this._settle();
    this._commit();
    this._updateHover();
  }

  // Nach dem Entfernen rutschen darueberliegende Steine nach - nichts schwebt.
  _settle() {
    const done = [];
    for (const b of [...this.bricks].sort((a, c) => a.aabb.min.y - c.aabb.min.y)) {
      const fp = { minX: b.aabb.min.x, maxX: b.aabb.max.x, minZ: b.aabb.min.z, maxZ: b.aabb.max.z };
      let s = 0;
      for (const o of this._overlapping(fp, done)) {
        const t = this._localTop(o, b.aabb.min.y + EPS);
        if (t !== null && t > s) s = t;
      }
      const dy = round(s, 1e6) - b.aabb.min.y;
      if (Math.abs(dy) > 1e-7) {
        b.mesh.position.y += dy;
        this._updateAabb(b);
      }
      done.push(b);
    }
  }

  // Baubarkeit pruefen (Konsole: cado.validate()): schwebt etwas, durchdringen sich Quader, liegt der Schwerpunkt auf?
  validate() {
    const issues = [];
    for (const b of this.bricks) {
      const fp = { minX: b.aabb.min.x, maxX: b.aabb.max.x, minZ: b.aabb.min.z, maxZ: b.aabb.max.z };
      const others = this._overlapping(fp, this.bricks.filter((o) => o !== b));
      const rest = new THREE.Box2();
      let s = 0;
      for (const o of others) {
        const t = this._localTop(o, b.aabb.min.y + EPS);
        if (t !== null && t > s) s = t;
        if (t !== null && Math.abs(t - b.aabb.min.y) < 2 * EPS) {
          rest.expandByPoint(new THREE.Vector2(o.x0, o.z0)).expandByPoint(new THREE.Vector2(o.x1, o.z1));
        }
        const shared = Math.min(b.aabb.max.y, o.brick.aabb.max.y) - Math.max(b.aabb.min.y, o.brick.aabb.min.y);
        if (b.shape.isBox && o.brick.shape.isBox && o.brick.id > b.id && shared > EPS) {
          issues.push(`${b.code}#${b.id} durchdringt ${o.brick.code}#${o.brick.id}`);
        }
      }
      if (!isAvailable(b.mat, b.code)) issues.push(`${b.code} gibt es nicht in ${b.mat}`);
      const c = b.aabb.getCenter(new THREE.Vector3());
      const label =`${b.code}#${b.id} @ ${c.toArray().map((v) => Math.round(v * 1000)).join(',')}`;
      if (Math.abs(s - b.aabb.min.y) > 2 * EPS) {
        issues.push(`${label} schwebt ${Math.round((b.aabb.min.y - s) * 1e4) / 10} mm`);
      } else if (s > 0 && (rest.isEmpty() || c.x < rest.min.x - EPS || c.x > rest.max.x + EPS || c.z < rest.min.y - EPS || c.z > rest.max.y + EPS)) {
        issues.push(`${label} kippt (Schwerpunkt nicht unterstuetzt)`);
      }
    }
    return issues;
  }

  bom() {
    const rows = new Map();
    for (const b of this.bricks) {
      const key = `${b.mat}|${b.code}`;
      const row = rows.get(key) || { mat: b.mat, code: b.code, count: 0 };
      row.count++;
      rows.set(key, row);
    }
    const order = MATERIALS.map((m) => m.id);
    const list = [...rows.values()].sort((a, b) => order.indexOf(a.mat) - order.indexOf(b.mat) || a.code.localeCompare(b.code));
    let pieces = 0, price = 0, weight = 0;
    for (const row of list) {
      const m = MATERIAL[row.mat];
      row.unit = unitPrice(row.mat, row.code);
      row.total = row.unit * row.count;
      row.weight = (this.meta[row.code]?.volume_cm3 ?? 0) * m.density * row.count;
      pieces += row.count;
      price += row.total;
      weight += row.weight;
    }
    return { rows: list, pieces, price, weight };
  }

  // --------------------------------------------------------------------- Werkzeug

  _emitTool() {
    this._updateHover();
    this.dispatchEvent(new CustomEvent('tool'));
  }

  setShape(code) {
    if (code && this.stamp) this.cancelStamp();
    this.activeCode = code && isAvailable(this.activeMat, code) ? code : null;
    if (this.activeCode) {
      this.ghostMesh.geometry = this.shapes[code].geometry;
      this.ghostEdges.geometry = this.shapes[code].edges;
    }
    this._emitTool();
  }

  setMaterial(mat) {
    this.activeMat = mat;
    if (this.activeCode && !isAvailable(mat, this.activeCode)) this.activeCode = null;
    this._emitTool();
  }

  _spin(q) {
    this.ghostQ.premultiply(q).normalize();
    const c = this.ghostQ.toArray().map((v) => round(v, 1e6));
    this.ghostQ.fromArray(c).normalize();
    this._emitTool();
  }

  rotate() { this.stamp ? this._rotateStamp() : this._spin(Q_TURN); }
  tip() { this._spin(Q_TIP); }

  // --------------------------------------------------------------------- Platzierung

  _overlapping(fp, bricks = this.bricks) {
    const out = [];
    for (const brick of bricks) {
      const bb = brick.aabb;
      const x0 = Math.max(fp.minX, bb.min.x), x1 = Math.min(fp.maxX, bb.max.x);
      const z0 = Math.max(fp.minZ, bb.min.z), z1 = Math.min(fp.maxZ, bb.max.z);
      if (x1 - x0 > EPS && z1 - z0 > EPS) out.push({ brick, x0, x1, z0, z1 });
    }
    return out;
  }

  // Hoechster Punkt des Steins innerhalb der Ueberlappung, gesehen von fromY abwaerts.
  _localTop(o, fromY) {
    const bb = o.brick.aabb;
    if (o.brick.shape.isBox) return bb.max.y <= fromY ? bb.max.y : null;
    if (bb.min.y >= fromY) return null;
    const d = 0.02 * MM, y = Math.min(fromY, bb.max.y + MM);
    let top = null;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const x = o.x0 + d + ((o.x1 - o.x0 - 2 * d) * i) / 2;
      const z = o.z0 + d + ((o.z1 - o.z0 - 2 * d) * j) / 2;
      this._probe.set(new THREE.Vector3(x, y, z), DOWN);
      const hit = this._probe.intersectObject(o.brick.mesh, false)[0];
      if (hit && (top === null || hit.point.y > top)) top = hit.point.y;
    }
    return top;
  }

  _computePlacement(hit, rb = this._rotatedBox(this.activeCode, this.ghostQ)) {
    const size = rb.getSize(new THREE.Vector3());
    const onTop = !hit.brick || hit.normal.y > 0.6;
    let cx = hit.point.x, cz = hit.point.z, ceiling = 0;
    if (hit.brick) {
      ceiling = onTop ? hit.brick.aabb.max.y : hit.point.y;
      if (!onTop && hit.normal.y > -0.6) {
        cx += hit.normal.x * (size.x / 2 + EPS);
        cz += hit.normal.z * (size.z / 2 + EPS);
      }
    }
    const half = PLATE / 2;
    let minX = snap(cx - size.x / 2), minZ = snap(cz - size.z / 2), s = 0;
    for (let iter = 0; iter < 8; iter++) {
      minX = clamp(minX, -half, half - size.x);
      minZ = clamp(minZ, -half, half - size.z);
      const fp = { minX, maxX: minX + size.x, minZ, maxZ: minZ + size.z };
      const over = this._overlapping(fp);
      s = 0;
      for (const o of over) {
        const t = this._localTop(o, ceiling + EPS);
        if (t !== null && t > s) s = t;
      }
      s = round(s, 1e6);
      const blocker = over.find((o) => o.brick.aabb.min.y < s + size.y - EPS && (this._localTop(o, Infinity) ?? 0) > s + EPS);
      if (!blocker) return { valid: true, position: new THREE.Vector3(minX - rb.min.x, s - rb.min.y, minZ - rb.min.z) };
      // buendig an den Nachbarn schieben - kleinster Weg gewinnt
      const bb = blocker.brick.aabb;
      const moves = [[bb.min.x - fp.maxX, 0], [bb.max.x - fp.minX, 0], [0, bb.min.z - fp.maxZ], [0, bb.max.z - fp.minZ]];
      moves.sort((a, b) => Math.abs(a[0] + a[1]) - Math.abs(b[0] + b[1]));
      minX += moves[0][0];
      minZ += moves[0][1];
    }
    return { valid: false, position: new THREE.Vector3(minX - rb.min.x, s - rb.min.y, minZ - rb.min.z) };
  }

  _pick() {
    this._raycaster.setFromCamera(this._pointer, this.camera);
    const hit = this._raycaster.intersectObjects(this.bricksGroup.children, false)[0];
    if (hit) {
      return { point: hit.point, normal: hit.face.normal.clone().applyQuaternion(hit.object.quaternion), brick: hit.object.userData.brick };
    }
    const point = this._raycaster.ray.intersectPlane(this._groundPlane, new THREE.Vector3());
    if (!point || Math.abs(point.x) > PLATE / 2 || Math.abs(point.z) > PLATE / 2) return null;
    return { point, normal: new THREE.Vector3(0, 1, 0), brick: null };
  }

  _updateHover() {
    this._dirty = true;
    this.ghost.visible = false;
    this.stampGhost.visible = false;
    this.hoverEdges.visible = false;
    this.hoverBrick = null;
    this._placement = null;
    if (this.photo) { this.renderer.domElement.style.cursor = 'crosshair'; return; }
    if (!this._pointerInside || this._dragging) return;
    const hit = this._pick();
    if (!hit) return;
    this.hoverBrick = hit.brick;
    if (this.stamp) {
      const p = (this._placement = this._computePlacement(hit, this.stamp.box));
      this.stampGhost.position.copy(p.position);
      this._stampMaterial.color.set(p.valid ? (this.dark ? '#f2f0ea' : '#6b675f') : '#d9483b');
      this.stampGhost.visible = true;
    } else if (this.activeCode && !this._modifier) {
      const p = (this._placement = this._computePlacement(hit));
      this.ghost.position.copy(p.position);
      this.ghost.quaternion.copy(this.ghostQ);
      this.ghostMesh.material.color.set(p.valid ? mainColor(this.activeMat) : '#d9483b');
      this.ghostEdges.material.color.set(p.valid ? (this.dark ? 0xf2f0ea : 0x1d1d1b) : 0xb3261e);
      this.ghost.visible = true;
    } else if (hit.brick) {
      this.hoverEdges.geometry = hit.brick.shape.edges;
      this.hoverEdges.position.copy(hit.brick.mesh.position);
      this.hoverEdges.quaternion.copy(hit.brick.mesh.quaternion);
      this.hoverEdges.visible = true;
    }
    this.renderer.domElement.style.cursor = this.activeCode || this.stamp ? 'crosshair' : hit.brick ? 'pointer' : 'default';
  }

  _place() {
    const p = this._placement;
    if (!p?.valid) return;
    this._addBrick({
      id: this._nextId++, code: this.activeCode, mat: this.activeMat, s: round(Math.random(), 1e4),
      p: p.position.toArray(), q: this.ghostQ.toArray(),
    });
    this._commit();
    this._updateHover();
  }

  // --------------------------------------------------------------------- Eingabe

  _initInput() {
    const el = this.renderer.domElement;
    let down = null, pressTimer = 0;
    const touches = new Set(); // aktive Finger: bei zwei Fingern wird gedreht/gezoomt, nicht gebaut
    const cancelPress = () => { clearTimeout(pressTimer); pressTimer = 0; };
    const setPointer = (e) => {
      const r = el.getBoundingClientRect();
      this._pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      this._modifier = e.altKey || e.shiftKey;
    };
    el.addEventListener('pointermove', (e) => {
      setPointer(e);
      this._pointerInside = true;
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > (e.pointerType === 'touch' ? 10 : 5)) { this._dragging = true; cancelPress(); }
      this._updateHover();
    });
    el.addEventListener('pointerleave', () => { this._pointerInside = false; this._updateHover(); });
    const frame = document.createElement('div');
    frame.style.cssText = 'position:absolute;display:none;border:1px dashed #d9483b;background:rgba(217,72,59,0.08);pointer-events:none;z-index:5';
    this.container.appendChild(frame);
    const frameRect = (e) => {
      const r = el.getBoundingClientRect();
      return { x0: Math.min(down.x, e.clientX) - r.left, y0: Math.min(down.y, e.clientY) - r.top, x1: Math.max(down.x, e.clientX) - r.left, y1: Math.max(down.y, e.clientY) - r.top, w: r.width, h: r.height };
    };
    el.addEventListener('pointermove', (e) => {
      if (!down?.frame || !this._dragging) return;
      const f = frameRect(e);
      Object.assign(frame.style, { display: 'block', left: f.x0 + 'px', top: f.y0 + 'px', width: f.x1 - f.x0 + 'px', height: f.y1 - f.y0 + 'px' });
    });
    el.addEventListener('pointerdown', (e) => {
      if (e.button === 1) e.preventDefault();
      if (e.pointerType === 'touch') {
        touches.add(e.pointerId);
        if (touches.size > 1) { cancelPress(); down = null; this._dragging = true; return; } // Geste mit zwei Fingern
        // langes Druecken (0,55 s, ohne zu ziehen) wirkt wie ein Rechtsklick: Stein entfernen bzw. Stempel beenden
        pressTimer = setTimeout(() => {
          pressTimer = 0;
          if (!down || this._dragging) return;
          setPointer(e);
          this._updateHover();
          this._click({ button: 2, altKey: false, shiftKey: false, ctrlKey: false, metaKey: false });
          navigator.vibrate?.(15);
          down = null;
        }, 550);
      }
      setPointer(e);
      this._pointerInside = true;
      // Shift+Ziehen im Auswahlmodus zieht einen Rahmen auf statt die Ansicht zu drehen
      const frameMode = e.button === 0 && e.shiftKey && !this.activeCode && !this.stamp;
      down = { x: e.clientX, y: e.clientY, button: e.button, frame: frameMode };
      if (frameMode) this.controls.enabled = false;
    });
    const endTouch = (e) => {
      if (e.pointerType !== 'touch') return;
      touches.delete(e.pointerId);
      cancelPress();
      if (!touches.size) this._pointerInside = false; // kein Schweben auf dem Handy: Vorschau nach dem Tippen weg
    };
    el.addEventListener('pointercancel', (e) => { endTouch(e); down = null; this._dragging = false; });
    el.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch' && touches.size > 1) { endTouch(e); return; }
      if (down?.frame) {
        this.controls.enabled = true;
        frame.style.display = 'none';
        if (this._dragging) {
          const f = frameRect(e), v = new THREE.Vector3();
          this.camera.updateMatrixWorld();
          for (const b of this.bricks) {
            b.aabb.getCenter(v).project(this.camera);
            const sx = ((v.x + 1) / 2) * f.w, sy = ((1 - v.y) / 2) * f.h;
            if (v.z < 1 && sx >= f.x0 && sx <= f.x1 && sy >= f.y0 && sy <= f.y1) this.selection.add(b);
          }
          this._syncSelection();
        }
      }
      const click = down && !this._dragging && down.button === e.button;
      down = null;
      this._dragging = false;
      setPointer(e);
      this._updateHover();
      if (click) this._click(e);
      endTouch(e);
      if (e.pointerType === 'touch') this._updateHover();
    });
    el.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('keydown', (e) => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key.startsWith('Arrow')) { e.preventDefault(); this._keys.add(e.key); if (e.shiftKey) this._keys.add('Shift'); return; }
      const k = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      if (this.photo) { if (k === 'escape') this.setPhotoMode(false); return; } // im Foto-Modus wird nicht gebaut
      if (ctrl && k === 'a') { e.preventDefault(); this.selectAll(); return; }
      if (ctrl && k === 'd') { e.preventDefault(); this.duplicateSelection(); return; }
      if (ctrl && k === 'c') { this.copySelection(); return; }
      if (ctrl && k === 'v') { this.paste(); return; }
      if (!ctrl && k === 'm') { this.moveSelection(); return; }
      if (k === 'escape' && this.stamp) { this.cancelStamp(); return; }
      if (k === 'escape' && this.selection.size && !this.activeCode) { this.clearSelection(); return; }
      if ((k === 'delete' || k === 'backspace') && this.selection.size) { this.deleteSelection(); return; }
      if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? this.redo() : this.undo(); }
      else if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); this.redo(); }
      else if (k === 'r') this.rotate();
      else if (k === 't') this.tip();
      else if (k === 'escape') this.setShape(null);
      else if ((k === 'delete' || k === 'backspace') && this.hoverBrick) this.removeBrick(this.hoverBrick);
      else if (k === 'alt' || k === 'shift') { this._modifier = true; this._updateHover(); }
    });
    window.addEventListener('blur', () => this._keys.clear());
    window.addEventListener('keyup', (e) => {
      this._keys.delete(e.key);
      if (!e.shiftKey) this._keys.delete('Shift');
      if (e.key === 'Alt' || e.key === 'Shift') { this._modifier = e.altKey || e.shiftKey; this._updateHover(); }
    });
  }

  _click(e) {
    if (this.photo) {
      // Foto-Modus: Klick stellt auf diesen Punkt scharf (Klick ins Leere = wieder Bildmitte)
      if (e.button === 0) { this._focusPoint = this._pick()?.point.clone() ?? null; this._dirty = true; }
      return;
    }
    const brick = this.hoverBrick;
    if (e.button === 1) {
      // Mittelklick wie in Minecraft: Form, Material und Lage des Steins uebernehmen
      if (brick) { this.ghostQ.copy(brick.mesh.quaternion); this.activeMat = brick.mat; this.setShape(brick.code); }
    } else if (e.button === 2) {
      if (this.stamp) this.cancelStamp();
      else if (brick) this.removeBrick(brick);
    } else if (e.button !== 0) {
      return;
    } else if (this.stamp) {
      this._placeStamp();
    } else if (e.altKey && brick) {
      // Pipette: Form, Material und Lage uebernehmen
      this.ghostQ.copy(brick.mesh.quaternion);
      this.activeMat = brick.mat;
      this.setShape(brick.code);
    } else if (e.shiftKey && brick && this.activeCode) {
      // Umfaerben im Baumodus: aktives Material auf den Stein
      if (brick.mat !== this.activeMat && isAvailable(this.activeMat, brick.code)) {
        releaseMaterial(brick.mesh.material);
        brick.mat = this.activeMat;
        brick.mesh.material = createMaterial(brick.mat, this.meta[brick.code]?.grain_axis ?? 'Z', brick.s);
        this._syncGlow(brick.mesh, brick.mat, brick.shape);
        this._batchDirty = true;
        this._commit();
      }
    } else if (this.activeCode) {
      this._place();
    } else if (brick) {
      // Auswahlmodus: Klick waehlt, mit Shift/Strg kommen weitere dazu
      this.select(brick, e.shiftKey || e.ctrlKey || e.metaKey);
    } else {
      this.clearSelection();
    }
  }

  // --------------------------------------------------------------------- Bilder

  _snapshot(scene, camera, size, samples = 24) {
    const r = this.renderer, prevSize = r.getSize(new THREE.Vector2()), prevRatio = r.getPixelRatio();
    r.setPixelRatio(1);
    r.setSize(size.x, size.y, false);
    if (scene === this.scene) {
      // das Modell selbst: mit Nachbearbeitung, wie auf dem Bildschirm
      this.renderPass.camera = this.ao.camera = camera;
      this.composer.setPixelRatio(1);
      this.composer.setSize(size.x, size.y);
      const table = makeSamples(samples); // in voller Qualitaet: alle Stichproben sofort rechnen und mitteln
      this._updateFocus(camera);
      for (let k = 0; k < table.length; k++) this._renderSample(k, table, camera);
    } else r.render(scene, camera);
    const url = r.domElement.toDataURL('image/png');
    r.setPixelRatio(prevRatio);
    r.setSize(prevSize.x, prevSize.y, false);
    if (scene === this.scene) {
      this.renderPass.camera = this.ao.camera = this.camera;
      this.composer.setPixelRatio(prevRatio);
      this.composer.setSize(prevSize.x, prevSize.y);
    }
    this._dirty = true;
    return url;
  }

  // Miniaturen fuer die Palette: Formen als zarte Strichzeichnung, Materialien als echter Wuerfel.
  // Mit matId: alle in diesem Material lieferbaren Formen, im Material gerendert (wird je Material gemerkt).
  makeThumbs(px = 160, matId = null) {
    this._shapeThumbs ??= {};
    if (matId && this._shapeThumbs[matId]) return this._shapeThumbs[matId];
    const scene = new THREE.Scene();
    scene.environment = this.env;
    scene.environmentIntensity = 0.8;
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-0.6, 1, 0.5);
    scene.add(key, new THREE.HemisphereLight(0xffffff, 0xe6e4e0, 0.9));
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10);
    const dir = new THREE.Vector3(1, 0.85, 1.25).normalize();
    const size = new THREE.Vector2(px, px);
    const paper = new THREE.MeshStandardMaterial({ color: 0xf3efe6, roughness: 0.9 });
    const ink = new THREE.LineBasicMaterial({ color: 0x2b2a27, transparent: true, opacity: 0.75 });

    const shoot = (object, sphere, minRadius) => {
      const h = Math.max(sphere.radius, minRadius) * 1.1;
      Object.assign(cam, { left: -h, right: h, top: h, bottom: -h });
      cam.position.copy(sphere.center).addScaledVector(dir, 2);
      cam.lookAt(sphere.center);
      cam.updateProjectionMatrix();
      scene.add(object);
      const url = this._snapshot(scene, cam, size);
      scene.remove(object);
      return url;
    };

    const out = { shapes: {}, materials: {} };
    for (const shape of Object.values(this.shapes)) {
      if (matId && !isAvailable(matId, shape.code)) continue;
      const mat = matId ? createMaterial(matId, this.meta[shape.code]?.grain_axis ?? 'Z', THUMB_SEED) : paper;
      const g = new THREE.Group();
      g.add(new THREE.Mesh(shape.geometry, mat));
      if (!shape.code.startsWith('GRI')) g.add(new THREE.LineSegments(shape.edges, ink)); // Gitter: keine Kantenlinien
      if (shape.insert && matId) g.add(this._insertMesh(shape, THUMB_SEED));
      out.shapes[shape.code] = shoot(g, shape.geometry.boundingSphere, 0.04);
      if (matId) releaseMaterial(mat);
    }
    for (const m of matId ? [] : MATERIALS) {
      // Filz gibt es nur als Platte -> Platte als Muster
      const sample = this.shapes[m.only && !m.only.includes('001') && !m.only[0].startsWith('PAN') ? m.only[0] : '001'];
      const mat = createMaterial(m.id, 'Z', THUMB_SEED);
      const g = new THREE.Group();
      g.add(new THREE.Mesh(sample.geometry, mat), new THREE.LineSegments(sample.edges, ink));
      out.materials[m.id] = shoot(g, sample.geometry.boundingSphere, 0.02);
      releaseMaterial(mat);
    }
    paper.dispose();
    ink.dispose();
    if (matId) this._shapeThumbs[matId] = out.shapes;
    return matId ? out.shapes : out;
  }

  // Vorschaubild einer Vorlage in eigener Szene (stoert das aktuelle Modell nicht), transparenter Hintergrund
  templateThumb(index, w, h) {
    const scene = new THREE.Scene();
    scene.environment = this.env;
    scene.environmentIntensity = 0.7;
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-0.6, 1, 0.5);
    scene.add(key, new THREE.HemisphereLight(0xffffff, 0xe6e4e0, 0.8));
    const box = new THREE.Box3(), mats = [];
    for (const d of this._templateBricks(index)) {
      const shape = this.shapes[d.code];
      if (!shape) continue;
      const mat = createMaterial(d.mat, this.meta[d.code]?.grain_axis ?? 'Z', d.s);
      mats.push(mat);
      const mesh = new THREE.Mesh(shape.geometry, mat);
      mesh.position.fromArray(d.p);
      mesh.quaternion.fromArray(d.q);
      if (shape.insert) mesh.add(this._insertMesh(shape, d.s));
      scene.add(mesh);
      box.union(this._rotatedBox(d.code, mesh.quaternion).translate(mesh.position));
    }
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const cam = new THREE.PerspectiveCamera(30, w / h, 0.01, 20);
    const half = THREE.MathUtils.degToRad(15);
    cam.position.copy(sphere.center).addScaledVector(new THREE.Vector3(0.42, 0.3, 0.62).normalize(), (sphere.radius / Math.sin(half)) * 1.02);
    cam.lookAt(sphere.center);
    const bg = this.scene.background;
    const url = this._snapshot(scene, cam, new THREE.Vector2(w, h));
    scene.traverse((o) => { if (o.isMesh && o.parent !== scene) releaseMaterial(o.material); });
    for (const m of mats) releaseMaterial(m);
    this.scene.background = bg;
    return url;
  }

  screenshot() {
    const ghost = this.ghost.visible, hover = this.hoverEdges.visible;
    this.ghost.visible = this.hoverEdges.visible = false;
    const s = this.renderer.getSize(new THREE.Vector2()).multiplyScalar(2);
    const url = this._snapshot(this.scene, this.camera, s, this.photo ? 96 : 48);
    this.ghost.visible = ghost;
    this.hoverEdges.visible = hover;
    return url;
  }
}
