// Nachrechnen im Stillstand: Steht die Kamera, wird dasselbe Bild viele Male mit winzigen Abweichungen gerendert
// (Pixelversatz, Position der Leuchten, Punkt auf der Blende) und gemittelt. Das ergibt ohne Pathtracer, mit allen
// eigenen Shadern: saubere Kanten, weiche Schatten mit hartem Kontakt und echte Tiefenschaerfe.
import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

export class AccumulatePass extends Pass {
  constructor(renderer) {
    super();
    this.count = 0; // bisher gemittelte Bilder - auf 0 setzen beginnt von vorn
    this._type = renderer.extensions.has('EXT_color_buffer_float') ? THREE.FloatType : THREE.HalfFloatType;
    this._targets = [];
    this._material = new THREE.ShaderMaterial({
      uniforms: { tFrame: { value: null }, tMean: { value: null }, uWeight: { value: 1 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: `uniform sampler2D tFrame; uniform sampler2D tMean; uniform float uWeight; varying vec2 vUv;
        void main(){ gl_FragColor = mix(texture2D(tMean, vUv), texture2D(tFrame, vUv), uWeight); }`,
      depthTest: false, depthWrite: false,
    });
    this._quad = new FullScreenQuad(this._material);
  }

  setSize(width, height) {
    for (const t of this._targets) t.dispose();
    const options = { type: this._type, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: false };
    this._targets = [new THREE.WebGLRenderTarget(width, height, options), new THREE.WebGLRenderTarget(width, height, options)];
    this.count = 0;
  }

  render(renderer, writeBuffer, readBuffer) {
    const u = this._material.uniforms, [mean, next] = this._targets;
    u.tFrame.value = readBuffer.texture;
    u.tMean.value = mean.texture;
    u.uWeight.value = 1 / (this.count + 1);
    renderer.setRenderTarget(next);
    this._quad.render(renderer);
    this._targets.reverse();
    this.count++;
    u.tFrame.value = next.texture; // Mittelwert weiterreichen
    u.uWeight.value = 1;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this._quad.render(renderer);
  }

  dispose() {
    for (const t of this._targets) t.dispose();
    this._material.dispose();
    this._quad.dispose();
  }
}

// n Stichproben mit je drei gleichmaessig gestreuten 2D-Punkten: Pixel (-0.5..0.5), Leuchte und Blende (Kreisscheibe).
// Je Paar ein eigenes, gemischtes Raster - so haengen die drei Streuungen nicht zusammen. Stichprobe 0 = Mitte.
export function makeSamples(n, seed = 7) {
  let state = seed >>> 0;
  const rnd = () => { // mulberry32: gleiche Folge bei jedem Aufruf, damit Bilder reproduzierbar sind
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const grid = () => {
    const side = Math.ceil(Math.sqrt(n)), cells = [];
    for (let i = 0; i < side * side; i++) cells.push([((i % side) + rnd()) / side, (Math.floor(i / side) + rnd()) / side]);
    for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [cells[i], cells[j]] = [cells[j], cells[i]]; }
    return cells;
  };
  const disc = ([a, b]) => { const r = Math.sqrt(a), phi = 2 * Math.PI * b; return [r * Math.cos(phi), r * Math.sin(phi)]; };
  const pixel = grid(), light = grid(), lens = grid();
  const out = [{ pixel: [0, 0], light: [0, 0], lens: [0, 0] }];
  for (let i = 1; i < n; i++) out.push({ pixel: [pixel[i][0] - 0.5, pixel[i][1] - 0.5], light: disc(light[i]), lens: disc(lens[i]) });
  return out;
}
