"use client";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import {
  STATIONS,
  MAP_BOUNDS,
  REF_CITIES,
  MEMORIALS,
  BORDERS,
  RIVERS,
  COASTLINE,
  project,
  type Station,
  type StationKind,
} from "./stations";

/* Muted, wintry palette — this is a memorial, not a game. */
const COLORS = {
  ground: "#33322e",
  path: "#8f8a80",
  plaster: "#6a665c",
  plasterDark: "#57534a",
  roof: "#3f3b33",
  wood: "#46423a",
  dark: "#33302c",
  metal: "#4a4a48",
  window: "#1c1b18",
  frame: "#7d786c",
  accentWindow: "#d4a853",
  tree: "#2c2e28",
  trunk: "#413c34",
  brick: "#5a4a42",
};

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- procedural textures (created once inside the Canvas) ---------- */

interface Textures {
  plaster: THREE.CanvasTexture;
  planks: THREE.CanvasTexture;
  roof: THREE.CanvasTexture;
  brick: THREE.CanvasTexture;
  ground: THREE.CanvasTexture;
}

function makeTexture(
  size: number,
  draw: (ctx: CanvasRenderingContext2D, s: number, rnd: () => number) => void,
  repeat: [number, number] = [1, 1]
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, size, mulberry32(size * 7 + 13));
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.anisotropy = 4;
  return tex;
}

function createTextures(): Textures {
  const noise = (ctx: CanvasRenderingContext2D, s: number, rnd: () => number, base: string, n: number, alpha: number) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < n; i++) {
      const g = 60 + rnd() * 140;
      ctx.fillStyle = `rgba(${g},${g},${g * 0.95},${alpha})`;
      ctx.fillRect(rnd() * s, rnd() * s, 1 + rnd() * 3, 1 + rnd() * 3);
    }
  };
  return {
    plaster: makeTexture(128, (ctx, s, rnd) => noise(ctx, s, rnd, "#8a857a", 900, 0.08)),
    planks: makeTexture(128, (ctx, s, rnd) => {
      noise(ctx, s, rnd, "#6e675c", 500, 0.06);
      ctx.strokeStyle = "rgba(20,16,10,0.55)";
      ctx.lineWidth = 2;
      for (let x = 0; x <= s; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x + (rnd() - 0.5) * 2, 0);
        ctx.lineTo(x + (rnd() - 0.5) * 2, s);
        ctx.stroke();
      }
    }),
    roof: makeTexture(128, (ctx, s, rnd) => {
      noise(ctx, s, rnd, "#6b665c", 400, 0.05);
      ctx.strokeStyle = "rgba(15,13,10,0.5)";
      ctx.lineWidth = 2;
      for (let y = 0; y <= s; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(s, y);
        ctx.stroke();
      }
    }),
    brick: makeTexture(128, (ctx, s, rnd) => {
      ctx.fillStyle = "#7a6358";
      ctx.fillRect(0, 0, s, s);
      const bh = 10;
      const bw = 24;
      ctx.fillStyle = "rgba(35,26,22,0.6)";
      for (let y = 0; y < s; y += bh) {
        ctx.fillRect(0, y, s, 2);
        const off = (y / bh) % 2 ? bw / 2 : 0;
        for (let x = -bw; x < s; x += bw) ctx.fillRect(x + off, y, 2, bh);
      }
      for (let i = 0; i < 300; i++) {
        const g = 90 + rnd() * 60;
        ctx.fillStyle = `rgba(${g},${g * 0.8},${g * 0.7},0.15)`;
        ctx.fillRect(rnd() * s, rnd() * s, 3, 3);
      }
    }),
    ground: createMapTexture(),
  };
}

/**
 * The ground is a subtle map of central Europe, so the reader can see where
 * the journey went: faint borders, the Baltic, the Danube and the Vistula,
 * and a few reference cities. Stations sit at their real coordinates.
 */
function createMapTexture(): THREE.CanvasTexture {
  const W = MAP_BOUNDS.xMax - MAP_BOUNDS.xMin;
  const H = MAP_BOUNDS.zMax - MAP_BOUNDS.zMin;
  const cw = 2048;
  const ch = Math.round((cw * H) / W);
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d")!;
  const rnd = mulberry32(1940);

  const toCanvas = (lat: number, lon: number): [number, number] => {
    const [x, z] = project(lat, lon);
    return [((x - MAP_BOUNDS.xMin) / W) * cw, ((z - MAP_BOUNDS.zMin) / H) * ch];
  };
  const tracePath = (pts: [number, number][]) => {
    ctx.beginPath();
    pts.forEach(([lat, lon], i) => {
      const [cx, cy] = toCanvas(lat, lon);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
  };

  // land
  ctx.fillStyle = "#54524b";
  ctx.fillRect(0, 0, cw, ch);
  // mottled ground noise
  for (let i = 0; i < 9000; i++) {
    const g = 62 + rnd() * 46;
    ctx.fillStyle = `rgba(${g},${g},${g * 0.92},0.22)`;
    const r = 1 + rnd() * 5;
    ctx.beginPath();
    ctx.arc(rnd() * cw, rnd() * ch, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // the Baltic: everything north of the coastline
  tracePath(COASTLINE);
  ctx.lineTo(cw + 20, toCanvas(COASTLINE[COASTLINE.length - 1][0], 25.8)[1]);
  ctx.lineTo(cw + 20, -20);
  ctx.lineTo(-20, -20);
  ctx.lineTo(-20, toCanvas(COASTLINE[0][0], 12)[1]);
  ctx.closePath();
  ctx.fillStyle = "#454a52";
  ctx.fill();
  ctx.strokeStyle = "rgba(190,195,205,0.4)";
  ctx.lineWidth = 3;
  tracePath(COASTLINE);
  ctx.stroke();

  // rivers
  ctx.strokeStyle = "rgba(130,142,165,0.55)";
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  for (const river of RIVERS) {
    tracePath(river);
    ctx.stroke();
  }

  // borders
  ctx.strokeStyle = "rgba(215,210,198,0.32)";
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 10]);
  for (const border of BORDERS) {
    tracePath(border);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // reference cities
  ctx.font = "italic 30px Georgia, serif";
  ctx.textAlign = "left";
  for (const city of REF_CITIES) {
    const [cx, cy] = toCanvas(city.lat, city.lon);
    ctx.fillStyle = "rgba(215,210,198,0.5)";
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(215,210,198,0.45)";
    ctx.fillText(city.name, cx + 14, cy + 10);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

const TexturesContext = createContext<Textures | null>(null);
const useTextures = () => useContext(TexturesContext)!;

function TexturesProvider({ children }: { children: React.ReactNode }) {
  const textures = useMemo(() => createTextures(), []);
  return <TexturesContext.Provider value={textures}>{children}</TexturesContext.Provider>;
}

/* ---------- shared parts ---------- */

function Window({
  w = 0.16,
  h = 0.22,
  warm = false,
}: {
  w?: number;
  h?: number;
  warm?: boolean;
}) {
  return (
    <group>
      <mesh>
        <planeGeometry args={[w + 0.05, h + 0.05]} />
        <meshStandardMaterial color={COLORS.frame} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={[w, h]} />
        {warm ? (
          <meshStandardMaterial color={COLORS.accentWindow} emissive={COLORS.accentWindow} emissiveIntensity={1.3} />
        ) : (
          <meshStandardMaterial color={COLORS.window} roughness={0.25} metalness={0.3} />
        )}
      </mesh>
      {/* mullion */}
      <mesh position={[0, 0, 0.006]}>
        <planeGeometry args={[0.015, h]} />
        <meshStandardMaterial color={COLORS.frame} />
      </mesh>
    </group>
  );
}

function Door({ w = 0.24, h = 0.42 }: { w?: number; h?: number }) {
  return (
    <group>
      <mesh>
        <planeGeometry args={[w + 0.05, h + 0.03]} />
        <meshStandardMaterial color={COLORS.frame} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.01, 0.004]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color={COLORS.dark} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Gable roof with overhang: two slopes + two gable triangles. Ridge runs along z. */
function GableRoof({
  w,
  d,
  rise = 0.42,
  overhang = 0.12,
  map,
}: {
  w: number;
  d: number;
  rise?: number;
  overhang?: number;
  map?: THREE.Texture;
}) {
  const half = w / 2 + overhang;
  const slopeLen = Math.hypot(half, rise);
  const pitch = Math.atan2(rise, half);
  const gable = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0);
    s.lineTo(w / 2, 0);
    s.lineTo(0, rise);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, [w, rise]);
  return (
    <group>
      <mesh position={[-half / 2, rise / 2, 0]} rotation={[0, 0, pitch]} castShadow>
        <boxGeometry args={[slopeLen, 0.05, d + overhang * 2]} />
        <meshStandardMaterial map={map} color={COLORS.roof} roughness={0.95} />
      </mesh>
      <mesh position={[half / 2, rise / 2, 0]} rotation={[0, 0, -pitch]} castShadow>
        <boxGeometry args={[slopeLen, 0.05, d + overhang * 2]} />
        <meshStandardMaterial map={map} color={COLORS.roof} roughness={0.95} />
      </mesh>
      <mesh geometry={gable} position={[0, 0, d / 2 - 0.001]}>
        <meshStandardMaterial color={COLORS.plasterDark} roughness={0.95} />
      </mesh>
      <mesh geometry={gable} position={[0, 0, -d / 2 + 0.001]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial color={COLORS.plasterDark} roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ---------- buildings ---------- */

function House({
  w = 1.4,
  d = 1.1,
  h = 0.85,
  warm = false,
  windows = 2,
  seed = 1,
}: {
  w?: number;
  d?: number;
  h?: number;
  warm?: boolean;
  windows?: number;
  seed?: number;
}) {
  const tx = useTextures();
  const tint = useMemo(() => {
    const rnd = mulberry32(seed * 91);
    const shades = ["#6a665c", "#6f685c", "#635f56", "#6c665e"];
    return shades[Math.floor(rnd() * shades.length)];
  }, [seed]);
  const winXs = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < windows; i++) out.push(-w / 2 + ((i + 1) * w) / (windows + 1));
    return out;
  }, [w, windows]);
  return (
    <group>
      <mesh position={[0, 0.045, 0]} castShadow>
        <boxGeometry args={[w + 0.08, 0.09, d + 0.08]} />
        <meshStandardMaterial color={COLORS.dark} roughness={1} />
      </mesh>
      <mesh position={[0, h / 2 + 0.06, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial map={tx.plaster} color={tint} roughness={0.95} />
      </mesh>
      <group position={[0, h + 0.06, 0]}>
        <GableRoof w={w} d={d} rise={0.34 + h * 0.18} map={tx.roof} />
      </group>
      {/* chimney */}
      <mesh position={[w * 0.22, h + 0.42, d * 0.12]} castShadow>
        <boxGeometry args={[0.14, 0.34, 0.14]} />
        <meshStandardMaterial map={tx.brick} color={COLORS.brick} roughness={1} />
      </mesh>
      {/* door on the front (+z) */}
      <group position={[winXs[0] ?? 0, 0.28, d / 2 + 0.006]}>
        <Door />
      </group>
      {/* windows: front (skip the door slot) + gable side */}
      {winXs.slice(1).map((x) => (
        <group key={`f${x}`} position={[x, h * 0.55, d / 2 + 0.006]}>
          <Window warm={warm} />
        </group>
      ))}
      {winXs.map((x) => (
        <group key={`b${x}`} position={[x, h * 0.55, -d / 2 - 0.006]} rotation={[0, Math.PI, 0]}>
          <Window warm={warm} />
        </group>
      ))}
      <group position={[w / 2 + 0.006, h * 0.55, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Window warm={warm} />
      </group>
    </group>
  );
}

function Barrack({ len = 2.6 }: { len?: number }) {
  const tx = useTextures();
  const winXs = useMemo(() => [-len * 0.32, -len * 0.11, len * 0.11, len * 0.32], [len]);
  return (
    <group>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[len + 0.08, 0.06, 0.98]} />
        <meshStandardMaterial color={COLORS.dark} roughness={1} />
      </mesh>
      <mesh position={[0, 0.33, 0]} castShadow>
        <boxGeometry args={[len, 0.56, 0.9]} />
        <meshStandardMaterial map={tx.planks} color={COLORS.wood} roughness={0.95} />
      </mesh>
      <group position={[0, 0.61, 0]} rotation={[0, Math.PI / 2, 0]}>
        <GableRoof w={0.9} d={len} rise={0.22} overhang={0.09} map={tx.roof} />
      </group>
      {winXs.map((x) => (
        <group key={x} position={[x, 0.38, 0.456]}>
          <Window w={0.14} h={0.14} />
        </group>
      ))}
      <group position={[len / 2 + 0.006, 0.24, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Door w={0.22} h={0.38} />
      </group>
      {/* small brick chimney pipe */}
      <mesh position={[-len * 0.25, 0.86, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.28, 8]} />
        <meshStandardMaterial color="#2c2a26" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Watchtower() {
  const legs: [number, number][] = [
    [-0.2, -0.2],
    [0.2, -0.2],
    [-0.2, 0.2],
    [0.2, 0.2],
  ];
  return (
    <group>
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.62, z]} castShadow>
          <boxGeometry args={[0.05, 1.24, 0.05]} />
          <meshStandardMaterial color={COLORS.trunk} roughness={0.95} />
        </mesh>
      ))}
      {/* X bracing on two sides */}
      {[0.21, -0.21].map((z, i) => (
        <group key={i} position={[0, 0.55, z]}>
          <mesh rotation={[0, 0, 0.62]}>
            <boxGeometry args={[0.74, 0.035, 0.03]} />
            <meshStandardMaterial color={COLORS.trunk} roughness={0.95} />
          </mesh>
          <mesh rotation={[0, 0, -0.62]}>
            <boxGeometry args={[0.74, 0.035, 0.03]} />
            <meshStandardMaterial color={COLORS.trunk} roughness={0.95} />
          </mesh>
        </group>
      ))}
      {/* platform + cabin */}
      <mesh position={[0, 1.28, 0]} castShadow>
        <boxGeometry args={[0.66, 0.06, 0.66]} />
        <meshStandardMaterial color={COLORS.wood} roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.52, 0.38, 0.52]} />
        <meshStandardMaterial color={COLORS.dark} roughness={0.9} />
      </mesh>
      {/* railing */}
      {[
        [0, 0.33],
        [0, -0.33],
        [0.33, 0],
        [-0.33, 0],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.38, z]} rotation={[0, x === 0 ? 0 : Math.PI / 2, 0]}>
          <boxGeometry args={[0.66, 0.025, 0.02]} />
          <meshStandardMaterial color={COLORS.trunk} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, 1.78, 0]} castShadow>
        <coneGeometry args={[0.46, 0.26, 4]} />
        <meshStandardMaterial color={COLORS.roof} roughness={0.95} />
      </mesh>
      {/* searchlight */}
      <mesh position={[0.24, 1.6, 0.24]} rotation={[0.5, 0.8, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 10]} />
        <meshStandardMaterial color={COLORS.metal} roughness={0.4} metalness={0.6} />
      </mesh>
      {/* ladder */}
      <group position={[0.31, 0.6, 0]} rotation={[0, 0, -0.12]}>
        {[-0.05, 0.05].map((z) => (
          <mesh key={z} position={[0, 0, z]}>
            <cylinderGeometry args={[0.014, 0.014, 1.3, 5]} />
            <meshStandardMaterial color={COLORS.trunk} roughness={0.95} />
          </mesh>
        ))}
        {[-0.45, -0.25, -0.05, 0.15, 0.35, 0.55].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 0.12, 5]} />
            <meshStandardMaterial color={COLORS.trunk} roughness={0.95} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Fence({ from, to }: { from: [number, number]; to: [number, number] }) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.hypot(dx, dz);
  const angle = Math.atan2(dx, dz);
  const posts = Math.max(3, Math.round(len / 0.65));
  return (
    <group position={[(from[0] + to[0]) / 2, 0, (from[1] + to[1]) / 2]} rotation={[0, angle, 0]}>
      {Array.from({ length: posts + 1 }, (_, i) => (
        <group key={i} position={[0, 0, -len / 2 + (len * i) / posts]}>
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.022, 0.026, 0.56, 6]} />
            <meshStandardMaterial color={COLORS.trunk} roughness={1} />
          </mesh>
          {/* angled barbed-wire arm */}
          <mesh position={[0.045, 0.6, 0]} rotation={[0, 0, -0.7]}>
            <cylinderGeometry args={[0.013, 0.015, 0.16, 5]} />
            <meshStandardMaterial color={COLORS.trunk} roughness={1} />
          </mesh>
        </group>
      ))}
      {/* horizontal wires */}
      {[0.18, 0.32, 0.46].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.006, 0.006, len, 4]} />
          <meshStandardMaterial color={COLORS.metal} roughness={0.5} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0.1, 0.66, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.005, len, 4]} />
        <meshStandardMaterial color={COLORS.metal} roughness={0.5} metalness={0.6} />
      </mesh>
    </group>
  );
}

function Wheel({ r = 0.14 }: { r?: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[r, r, 0.05, 14]} />
      <meshStandardMaterial color="#22211f" roughness={0.5} metalness={0.5} />
    </mesh>
  );
}

function Train() {
  const tx = useTextures();
  return (
    <group>
      {/* track bed, sleepers and rails */}
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.4, 1.0]} />
        <meshStandardMaterial color="#2b2a27" roughness={1} />
      </mesh>
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[-3.4 + i * 0.36, 0.02, 0]}>
          <boxGeometry args={[0.12, 0.03, 0.78]} />
          <meshStandardMaterial color={COLORS.trunk} roughness={1} />
        </mesh>
      ))}
      {[0.28, -0.28].map((z) => (
        <mesh key={z} position={[0, 0.045, z]}>
          <boxGeometry args={[7.2, 0.035, 0.045]} />
          <meshStandardMaterial color={COLORS.metal} roughness={0.35} metalness={0.75} />
        </mesh>
      ))}

      {/* locomotive */}
      <group position={[-2.2, 0, 0]}>
        <mesh position={[0.1, 0.52, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.15, 14]} />
          <meshStandardMaterial color="#2e2c29" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[-0.62, 0.62, 0]} castShadow>
          <boxGeometry args={[0.62, 0.85, 0.72]} />
          <meshStandardMaterial color="#33312d" roughness={0.8} />
        </mesh>
        <mesh position={[-0.62, 1.1, 0]} castShadow>
          <boxGeometry args={[0.7, 0.08, 0.8]} />
          <meshStandardMaterial color={COLORS.dark} roughness={0.9} />
        </mesh>
        {[0.22, -0.22].map((z) => (
          <group key={z} position={[-0.52, 0.72, z * 1.65]}>
            <mesh>
              <planeGeometry args={[0.16, 0.16]} />
              <meshStandardMaterial color={COLORS.window} roughness={0.3} />
            </mesh>
          </group>
        ))}
        <mesh position={[0.5, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.11, 0.32, 10]} />
          <meshStandardMaterial color="#22211f" roughness={0.8} />
        </mesh>
        <mesh position={[0.05, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.14, 10]} />
          <meshStandardMaterial color="#2e2c29" roughness={0.8} />
        </mesh>
        {/* buffer beam */}
        <mesh position={[0.74, 0.32, 0]}>
          <boxGeometry args={[0.08, 0.2, 0.7]} />
          <meshStandardMaterial color="#26241f" roughness={0.9} />
        </mesh>
        {[-0.5, 0.05, 0.45].map((x) =>
          [0.36, -0.36].map((z) => (
            <group key={`${x}${z}`} position={[x, 0.2, z]}>
              <Wheel r={0.17} />
            </group>
          ))
        )}
      </group>

      {/* freight cars */}
      {[-0.35, 1.5].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.56, 0]} castShadow>
            <boxGeometry args={[1.5, 0.68, 0.78]} />
            <meshStandardMaterial map={tx.planks} color={COLORS.wood} roughness={0.95} />
          </mesh>
          {/* sliding door + rail */}
          <mesh position={[0, 0.52, 0.396]}>
            <planeGeometry args={[0.42, 0.5]} />
            <meshStandardMaterial color={COLORS.dark} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.82, 0.398]}>
            <planeGeometry args={[1.3, 0.03]} />
            <meshStandardMaterial color={COLORS.metal} metalness={0.6} roughness={0.4} />
          </mesh>
          {/* small vent grid */}
          <mesh position={[-0.55, 0.74, 0.398]}>
            <planeGeometry args={[0.16, 0.1]} />
            <meshStandardMaterial color={COLORS.window} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.945, 0]} castShadow>
            <boxGeometry args={[1.56, 0.06, 0.86]} />
            <meshStandardMaterial color={COLORS.roof} roughness={0.95} />
          </mesh>
          {[-0.5, 0.5].map((wx) =>
            [0.36, -0.36].map((z) => (
              <group key={`${wx}${z}`} position={[wx, 0.16, z]}>
                <Wheel />
              </group>
            ))
          )}
          {/* chassis */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[1.5, 0.06, 0.5]} />
            <meshStandardMaterial color="#26241f" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Factory() {
  const tx = useTextures();
  const teeth = [-0.8, 0, 0.8];
  return (
    <group>
      {/* main hall */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[2.6, 1.2, 1.5]} />
        <meshStandardMaterial map={tx.brick} color={COLORS.brick} roughness={0.95} />
      </mesh>
      {/* sawtooth roof: sloped panel + vertical glass per tooth */}
      {teeth.map((x) => (
        <group key={x} position={[x, 1.2, 0]}>
          <mesh position={[-0.14, 0.17, 0]} rotation={[0, 0, 0.42]} castShadow>
            <boxGeometry args={[0.72, 0.045, 1.56]} />
            <meshStandardMaterial map={tx.roof} color={COLORS.roof} roughness={0.95} />
          </mesh>
          <mesh position={[0.26, 0.14, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.5, 0.28]} />
            <meshStandardMaterial color={COLORS.window} roughness={0.3} metalness={0.2} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      {/* tall window grid on the front */}
      {[-0.9, -0.3, 0.3, 0.9].map((x) => (
        <group key={x} position={[x, 0.62, 0.756]}>
          <Window w={0.3} h={0.55} />
        </group>
      ))}
      {/* gate */}
      <group position={[-1.306, 0.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <Door w={0.5} h={0.7} />
      </group>
      {/* annex */}
      <mesh position={[1.75, 0.32, 0.35]} castShadow>
        <boxGeometry args={[0.9, 0.64, 0.8]} />
        <meshStandardMaterial map={tx.plaster} color={COLORS.plasterDark} roughness={0.95} />
      </mesh>
      <group position={[1.75, 0.64, 0.35]}>
        <GableRoof w={0.9} d={0.8} rise={0.2} overhang={0.08} map={tx.roof} />
      </group>
      {/* chimney with collar */}
      <mesh position={[0.95, 1.7, -0.45]} castShadow>
        <cylinderGeometry args={[0.13, 0.19, 2.0, 12]} />
        <meshStandardMaterial map={tx.brick} color={COLORS.brick} roughness={0.95} />
      </mesh>
      <mesh position={[0.95, 2.55, -0.45]}>
        <cylinderGeometry args={[0.16, 0.14, 0.12, 12]} />
        <meshStandardMaterial color="#3d322c" roughness={0.95} />
      </mesh>
    </group>
  );
}

function Ruins({ seed = 7 }: { seed?: number }) {
  const tx = useTextures();
  const rubble = useMemo(() => {
    const rnd = mulberry32(seed * 3);
    return Array.from({ length: 12 }, () => ({
      x: (rnd() - 0.5) * 2.6,
      z: (rnd() - 0.5) * 2.0,
      s: 0.06 + rnd() * 0.16,
      ry: rnd() * Math.PI,
    }));
  }, [seed]);
  return (
    <group>
      {/* broken gable wall with window holes */}
      <group position={[-0.5, 0, -0.3]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.5, 1.0, 0.14]} />
          <meshStandardMaterial map={tx.plaster} color={COLORS.plasterDark} roughness={1} />
        </mesh>
        <mesh position={[-0.35, 1.15, 0]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.14]} />
          <meshStandardMaterial map={tx.plaster} color={COLORS.plasterDark} roughness={1} />
        </mesh>
        {[[-0.4, 0.55], [0.35, 0.55], [-0.35, 1.15]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.075]}>
            <planeGeometry args={[0.22, 0.3]} />
            <meshStandardMaterial color="#141311" roughness={1} />
          </mesh>
        ))}
      </group>
      {/* side wall, lower and broken */}
      <mesh position={[0.55, 0.3, 0.5]} rotation={[0, 0.5, 0.04]} castShadow>
        <boxGeometry args={[1.3, 0.6, 0.14]} />
        <meshStandardMaterial map={tx.plaster} color={COLORS.plasterDark} roughness={1} />
      </mesh>
      {/* fallen beam */}
      <mesh position={[0.1, 0.18, 0.1]} rotation={[0.1, 0.7, 0.5]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.08]} />
        <meshStandardMaterial color={COLORS.trunk} roughness={1} />
      </mesh>
      {rubble.map((r, i) => (
        <mesh key={i} position={[r.x, r.s / 2, r.z]} rotation={[0, r.ry, 0]}>
          <icosahedronGeometry args={[r.s, 0]} />
          <meshStandardMaterial color={COLORS.plasterDark} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function StationModel({ kind }: { kind: StationKind }) {
  switch (kind) {
    case "city":
      return (
        <group>
          <House w={1.5} d={1.2} h={1.15} windows={3} seed={1} />
          <group position={[1.6, 0, 0.5]} rotation={[0, -0.25, 0]}>
            <House w={1.0} d={0.9} h={0.8} seed={2} />
          </group>
          <group position={[-1.5, 0, 0.3]} rotation={[0, 0.2, 0]}>
            <House w={1.1} d={0.9} h={0.95} seed={3} />
          </group>
        </group>
      );
    case "train":
      return <Train />;
    case "town":
      return (
        <group>
          <group position={[-1.0, 0, 0]} rotation={[0, 0.3, 0]}>
            <House w={0.9} d={0.8} h={0.6} seed={4} />
          </group>
          <group position={[0.25, 0, 0.65]} rotation={[0, -0.4, 0]}>
            <House w={0.8} d={0.7} h={0.55} seed={5} />
          </group>
          <group position={[1.25, 0, -0.3]} rotation={[0, 0.15, 0]}>
            <House w={0.9} d={0.8} h={0.6} seed={6} />
          </group>
          <group position={[0.1, 0, -0.95]} rotation={[0, -0.2, 0]}>
            <House w={0.7} d={0.7} h={0.5} windows={1} seed={7} />
          </group>
        </group>
      );
    case "camp":
      return (
        <group>
          <group position={[-0.6, 0, -0.5]}>
            <Barrack />
          </group>
          <group position={[-0.6, 0, 0.7]}>
            <Barrack />
          </group>
          <group position={[-0.6, 0, 1.9]}>
            <Barrack len={2.0} />
          </group>
          <group position={[1.7, 0, -1.2]}>
            <Watchtower />
          </group>
          <Fence from={[-2.3, -1.4]} to={[2.3, -1.4]} />
          <Fence from={[-2.3, 2.7]} to={[2.3, 2.7]} />
          <Fence from={[-2.3, -1.4]} to={[-2.3, 2.7]} />
        </group>
      );
    case "admin":
      return <House w={1.25} d={1.0} h={0.95} windows={3} seed={8} />;
    case "factory":
      return <Factory />;
    case "ruins":
      return <Ruins />;
    case "home":
      return <House w={1.2} d={1.0} h={0.9} warm seed={9} />;
  }
}

/* ---------- landscape ---------- */

function Trees() {
  const trees = useMemo(() => {
    const rnd = mulberry32(42);
    const out: { x: number; z: number; h: number; bare: boolean }[] = [];
    let guard = 0;
    while (out.length < 52 && guard++ < 600) {
      const x = MAP_BOUNDS.xMin + 2 + rnd() * (MAP_BOUNDS.xMax - MAP_BOUNDS.xMin - 4);
      const z = MAP_BOUNDS.zMin + 4 + rnd() * (MAP_BOUNDS.zMax - MAP_BOUNDS.zMin - 6);
      if (z < -22) continue; // the Baltic
      const nearStation = STATIONS.some((s) => (s.pos[0] - x) ** 2 + (s.pos[1] - z) ** 2 < 16);
      const nearMemorial = MEMORIALS.some((m) => {
        const [mx, mz] = project(m.lat, m.lon);
        return (mx - x) ** 2 + (mz - z) ** 2 < 4;
      });
      if (nearStation || nearMemorial) continue;
      out.push({ x, z, h: 0.8 + rnd() * 1.5, bare: rnd() < 0.4 });
    }
    return out;
  }, []);
  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh position={[0, t.h * 0.35, 0]}>
            <cylinderGeometry args={[0.035, 0.055, t.h * 0.7, 5]} />
            <meshStandardMaterial color={COLORS.trunk} roughness={1} />
          </mesh>
          {t.bare ? (
            <>
              <mesh position={[0.05, t.h * 0.72, 0]} rotation={[0, 0, -0.35]}>
                <cylinderGeometry args={[0.01, 0.02, t.h * 0.3, 4]} />
                <meshStandardMaterial color={COLORS.trunk} roughness={1} />
              </mesh>
              <mesh position={[-0.04, t.h * 0.8, 0.02]} rotation={[0.15, 0, 0.3]}>
                <cylinderGeometry args={[0.008, 0.016, t.h * 0.26, 4]} />
                <meshStandardMaterial color={COLORS.trunk} roughness={1} />
              </mesh>
              <mesh position={[0, t.h * 0.9, -0.02]} rotation={[-0.2, 0, -0.1]}>
                <cylinderGeometry args={[0.006, 0.013, t.h * 0.22, 4]} />
                <meshStandardMaterial color={COLORS.trunk} roughness={1} />
              </mesh>
            </>
          ) : (
            <>
              <mesh position={[0, t.h * 0.75, 0]}>
                <coneGeometry args={[t.h * 0.3, t.h * 0.6, 7]} />
                <meshStandardMaterial color={COLORS.tree} roughness={1} />
              </mesh>
              <mesh position={[0, t.h * 1.05, 0]}>
                <coneGeometry args={[t.h * 0.22, t.h * 0.5, 7]} />
                <meshStandardMaterial color={COLORS.tree} roughness={1} />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
}

function Ground() {
  const tx = useTextures();
  const w = MAP_BOUNDS.xMax - MAP_BOUNDS.xMin;
  const h = MAP_BOUNDS.zMax - MAP_BOUNDS.zMin;
  return (
    <group>
      {/* endless base plane fading into the fog (fog far is 60, so r=80 reads as endless) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[80, 40]} />
        <meshStandardMaterial color="#54524b" roughness={1} />
      </mesh>
      {/* the map itself */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[(MAP_BOUNDS.xMin + MAP_BOUNDS.xMax) / 2, 0, (MAP_BOUNDS.zMin + MAP_BOUNDS.zMax) / 2]}
        receiveShadow
      >
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={tx.ground} roughness={1} />
      </mesh>
    </group>
  );
}

/** Quiet memorial markers for the camps named in the book — not stations. */
function Memorials() {
  return (
    <group>
      {MEMORIALS.map((m) => {
        const [x, z] = project(m.lat, m.lon);
        return (
          <group key={m.name} position={[x, 0, z]}>
            <mesh position={[0, 0.22, 0]} castShadow>
              <boxGeometry args={[0.16, 0.44, 0.16]} />
              <meshStandardMaterial color="#1f1e1b" roughness={1} />
            </mesh>
            <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.28, 0.32, 32]} />
              <meshBasicMaterial color="#55534d" transparent opacity={0.5} />
            </mesh>
            <Html position={[0, 0.85, 0]} center distanceFactor={16} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  color: "rgba(232,230,225,0.65)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                  whiteSpace: "nowrap",
                }}
              >
                {m.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

/** The airfield and the town of Irena, both part of the Dęblin chapter. */
function DeblinSurroundings() {
  const [dx, dz] = project(51.56, 21.86);
  return (
    <group>
      {/* the airfield, south-west of the camp */}
      <group position={[dx - 3.1, 0, dz + 1.9]} rotation={[0, 0.5, 0]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.6, 0.55]} />
          <meshStandardMaterial color="#45443f" roughness={1} />
        </mesh>
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 0.04]} />
          <meshStandardMaterial color="#5c5a52" roughness={1} />
        </mesh>
        {/* hangar */}
        <group position={[-0.7, 0, 0.75]}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 1.0, 12, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#4a4841" roughness={0.95} />
          </mesh>
        </group>
        <Html position={[0.4, 0.7, 0.2]} center distanceFactor={16} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "10px",
              fontStyle: "italic",
              color: "rgba(232,230,225,0.55)",
              textShadow: "0 1px 3px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            the airfield
          </div>
        </Html>
      </group>
      {/* Irena, the adjoining town */}
      <group position={[dx + 1.9, 0, dz + 1.6]}>
        <group rotation={[0, 0.4, 0]}>
          <House w={0.55} d={0.5} h={0.4} windows={1} seed={11} />
        </group>
        <group position={[0.75, 0, 0.35]} rotation={[0, -0.3, 0]}>
          <House w={0.5} d={0.45} h={0.36} windows={1} seed={12} />
        </group>
        <Html position={[0.4, 1.0, 0.2]} center distanceFactor={16} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "10px",
              fontStyle: "italic",
              color: "rgba(232,230,225,0.55)",
              textShadow: "0 1px 3px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            Irena
          </div>
        </Html>
      </group>
    </group>
  );
}

function Path() {
  const geometry = useMemo(() => {
    const pts = STATIONS.filter((s) => s.kind !== "admin").map(
      (s) => new THREE.Vector3(s.pos[0], 0.03, s.pos[1])
    );
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.35);
    return new THREE.TubeGeometry(curve, 120, 0.07, 6, false);
  }, []);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={COLORS.path} roughness={1} />
    </mesh>
  );
}

/* ---------- camera focus ---------- */

function CameraRig({ focus, controlsRef }: { focus: Station | null; controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 2));
  const keys = useRef<Set<string>>(new Set());
  const panning = useRef(false); // arrow keys override the station camera-follow

  useEffect(() => {
    const relevant = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"]);
    const isTyping = () => {
      const el = document.activeElement;
      return !!el && ["INPUT", "TEXTAREA", "SELECT", "AUDIO"].includes(el.tagName);
    };
    const down = (e: KeyboardEvent) => {
      if (!relevant.has(e.key) || isTyping()) return;
      if (e.key.startsWith("Arrow")) e.preventDefault();
      keys.current.add(e.key.toLowerCase());
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    panning.current = false; // a newly selected station takes the camera again
  }, [focus?.slug]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    // arrow-key / WASD panning in the viewing direction
    const k = keys.current;
    let dx = 0;
    let dz = 0;
    if (k.has("arrowup") || k.has("w")) dz += 1;
    if (k.has("arrowdown") || k.has("s")) dz -= 1;
    if (k.has("arrowleft") || k.has("a")) dx -= 1;
    if (k.has("arrowright") || k.has("d")) dx += 1;
    if (dx !== 0 || dz !== 0) {
      panning.current = true;
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0));
      const speed = 12 * delta;
      const move = forward.multiplyScalar(dz * speed).add(right.multiplyScalar(dx * speed));
      // stay on the map — clamp the target, move the camera by the clamped delta
      const before = controls.target.clone();
      controls.target.add(move);
      controls.target.x = THREE.MathUtils.clamp(controls.target.x, MAP_BOUNDS.xMin - 4, MAP_BOUNDS.xMax + 4);
      controls.target.z = THREE.MathUtils.clamp(controls.target.z, MAP_BOUNDS.zMin - 4, MAP_BOUNDS.zMax + 4);
      camera.position.add(controls.target.clone().sub(before));
    } else if (focus && !panning.current) {
      targetPos.current.set(focus.pos[0], 0.4, focus.pos[1]);
      controls.target.lerp(targetPos.current, 0.06);
      const desired = new THREE.Vector3(focus.pos[0] + 3.5, 3.2, focus.pos[1] + 5.5);
      camera.position.lerp(desired, 0.04);
    }
    controls.update();
  });
  return null;
}

/* ---------- scene root ---------- */

export default function JourneyScene({
  focus,
  onSelect,
}: {
  focus: Station | null;
  onSelect: (s: Station) => void;
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  return (
    <Canvas shadows camera={{ position: [-14, 12, 18], fov: 45 }} style={{ background: "#a7abb0" }}>
      <TexturesProvider>
        <fog attach="fog" args={["#a7abb0", 20, 60]} />
        <hemisphereLight args={["#cdd1d7", "#4a4a44", 1.15]} />
        <directionalLight position={[10, 14, 6]} intensity={1.15} castShadow shadow-mapSize={[2048, 2048]} />

        <Ground />
        <Path />
        <Trees />
        <Memorials />
        <DeblinSurroundings />

        {STATIONS.map((s, i) => (
          <group key={s.slug} position={[s.pos[0], 0, s.pos[1]]}>
            <StationModel kind={s.kind} />
            {/* invisible hit volume */}
            <mesh
              position={[0, 0.8, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(s);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "auto";
              }}
              visible={false}
            >
              <boxGeometry args={[4.5, 2.4, 4.5]} />
            </mesh>
            {/* marker + label */}
            <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.5, 0.56, 40]} />
              <meshBasicMaterial
                color={focus?.slug === s.slug ? "#d4a853" : "#8f8a80"}
                transparent
                opacity={focus?.slug === s.slug ? 0.95 : 0.5}
              />
            </mesh>
            <Html position={[0, 2.5, 0]} center distanceFactor={16} zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
              <div
                style={{
                  textAlign: "center",
                  fontFamily: "Georgia, serif",
                  color: focus?.slug === s.slug ? "#d4a853" : "#e8e6e1",
                  textShadow: "0 1px 4px rgba(0,0,0,0.7)",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ fontSize: "11px", letterSpacing: "0.2em", opacity: 0.75 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontSize: "15px", letterSpacing: "0.06em" }}>{s.title}</div>
              </div>
            </Html>
          </group>
        ))}

        <OrbitControls
          ref={controlsRef}
          enablePan
          minDistance={4}
          maxDistance={38}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 0, 2]}
        />
        <CameraRig focus={focus} controlsRef={controlsRef} />
      </TexturesProvider>
    </Canvas>
  );
}
