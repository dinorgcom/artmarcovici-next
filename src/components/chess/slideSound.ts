/**
 * Sliding sound for the camera-figures: a loop of low-pass filtered brown
 * noise whose volume follows the figure's speed — heavy canisters gliding
 * over a lacquered board. Web Audio only, no asset needed.
 */

let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let muted = false;
let failed = false;

function ensure(): boolean {
  if (typeof window === "undefined" || failed) return false;
  if (ctx && gain) {
    if (ctx.state === "suspended") void ctx.resume();
    return true;
  }
  try {
    ctx = new AudioContext();
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02; // brown-ish noise
      data[i] = last * 3.5;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;
    filter.Q.value = 0.7;
    gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    return true;
  } catch {
    failed = true;
    ctx = null;
    gain = null;
    return false;
  }
}

/** Report a figure's current speed (world units/s); 0 ends its slide. */
export function reportSlide(speed: number) {
  if (muted || !ensure() || !ctx || !gain) return;
  const target = Math.min(0.11, Math.max(0, speed) * 0.035);
  const t = ctx.currentTime;
  // quick attack, soft release
  gain.gain.setTargetAtTime(target, t, target > gain.gain.value ? 0.03 : 0.12);
}

export function setSlideMuted(m: boolean) {
  muted = m;
  if (m && gain && ctx) gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
}
