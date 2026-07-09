"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { STATIONS, type Station, type StationKind } from "./stations";

/* Muted, wintry palette — this is a memorial, not a game. */
const COLORS = {
  ground: "#33322e",
  path: "#8f8a80",
  wall: "#5d594f",
  roof: "#454138",
  dark: "#3a3733",
  accentWindow: "#d4a853",
  tree: "#2c2e28",
  trunk: "#413c34",
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

/* ---------- small building blocks ---------- */

function House({ w = 1.4, d = 1.1, h = 0.8, warm = false }: { w?: number; d?: number; h?: number; warm?: boolean }) {
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={COLORS.wall} roughness={0.9} />
      </mesh>
      <mesh position={[0, h + 0.28, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[Math.max(w, d) * 0.78, 0.6, 4]} />
        <meshStandardMaterial color={COLORS.roof} roughness={0.9} />
      </mesh>
      {warm && (
        <mesh position={[0, h * 0.5, d / 2 + 0.005]}>
          <planeGeometry args={[0.22, 0.28]} />
          <meshStandardMaterial color={COLORS.accentWindow} emissive={COLORS.accentWindow} emissiveIntensity={1.4} />
        </mesh>
      )}
    </group>
  );
}

function Barrack({ len = 2.6 }: { len?: number }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[len, 0.6, 0.9]} />
        <meshStandardMaterial color={COLORS.dark} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.68, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[len + 0.1, 0.16, 1.05]} />
        <meshStandardMaterial color={COLORS.roof} roughness={0.95} />
      </mesh>
    </group>
  );
}

function Watchtower() {
  return (
    <group>
      {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.65, z]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.3, 6]} />
          <meshStandardMaterial color={COLORS.trunk} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.55, 0.35, 0.55]} />
        <meshStandardMaterial color={COLORS.dark} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.66, 0]} castShadow>
        <coneGeometry args={[0.45, 0.28, 4]} />
        <meshStandardMaterial color={COLORS.roof} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Fence({ from, to }: { from: [number, number]; to: [number, number] }) {
  const posts = useMemo(() => {
    const out: [number, number][] = [];
    const n = 7;
    for (let i = 0; i <= n; i++) {
      out.push([from[0] + ((to[0] - from[0]) * i) / n, from[1] + ((to[1] - from[1]) * i) / n]);
    }
    return out;
  }, [from, to]);
  return (
    <group>
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.25, z]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 5]} />
          <meshStandardMaterial color={COLORS.trunk} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Train() {
  return (
    <group>
      {/* rails */}
      <mesh position={[0, 0.02, 0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 0.05]} />
        <meshStandardMaterial color={COLORS.trunk} roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, -0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 0.05]} />
        <meshStandardMaterial color={COLORS.trunk} roughness={0.6} metalness={0.4} />
      </mesh>
      {/* locomotive */}
      <group position={[-1.9, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.3, 0.75, 0.8]} />
          <meshStandardMaterial color={COLORS.dark} roughness={0.85} />
        </mesh>
        <mesh position={[0.35, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.35, 8]} />
          <meshStandardMaterial color={COLORS.dark} roughness={0.85} />
        </mesh>
      </group>
      {/* freight cars */}
      {[0, 1.7].map((x) => (
        <mesh key={x} position={[x - 0.1, 0.48, 0]} castShadow>
          <boxGeometry args={[1.45, 0.7, 0.78]} />
          <meshStandardMaterial color={COLORS.wall} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function Factory() {
  return (
    <group>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[2.4, 1.1, 1.4]} />
        <meshStandardMaterial color={COLORS.wall} roughness={0.9} />
      </mesh>
      <mesh position={[0.85, 1.55, -0.4]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 1.6, 10]} />
        <meshStandardMaterial color={COLORS.dark} roughness={0.9} />
      </mesh>
      {[-0.7, 0, 0.7].map((x) => (
        <mesh key={x} position={[x, 1.25, 0]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[0.42, 0.4, 4]} />
          <meshStandardMaterial color={COLORS.roof} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Ruins({ seed = 7 }: { seed?: number }) {
  const parts = useMemo(() => {
    const rnd = mulberry32(seed);
    return Array.from({ length: 6 }, () => ({
      x: (rnd() - 0.5) * 2.2,
      z: (rnd() - 0.5) * 1.8,
      w: 0.3 + rnd() * 0.9,
      h: 0.25 + rnd() * 0.75,
      rot: (rnd() - 0.5) * 0.8,
    }));
  }, [seed]);
  return (
    <group>
      {parts.map((p, i) => (
        <mesh key={i} position={[p.x, p.h / 2, p.z]} rotation={[0, p.rot, (i % 2 ? 1 : -1) * 0.06]} castShadow>
          <boxGeometry args={[p.w, p.h, 0.16]} />
          <meshStandardMaterial color={COLORS.wall} roughness={1} />
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
          <House w={1.5} d={1.2} h={1.1} />
          <group position={[1.5, 0, 0.5]}>
            <House w={1.0} d={0.9} h={0.8} />
          </group>
          <group position={[-1.4, 0, 0.3]}>
            <House w={1.1} d={0.9} h={0.9} />
          </group>
        </group>
      );
    case "train":
      return <Train />;
    case "town":
      return (
        <group>
          <group position={[-1.0, 0, 0]}>
            <House w={0.9} d={0.8} h={0.6} />
          </group>
          <group position={[0.2, 0, 0.6]}>
            <House w={0.8} d={0.7} h={0.55} />
          </group>
          <group position={[1.2, 0, -0.3]}>
            <House w={0.9} d={0.8} h={0.6} />
          </group>
          <group position={[0.1, 0, -0.9]}>
            <House w={0.7} d={0.7} h={0.5} />
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
          <group position={[1.6, 0, -1.2]}>
            <Watchtower />
          </group>
          <Fence from={[-2.2, -1.3]} to={[2.2, -1.3]} />
          <Fence from={[-2.2, 2.6]} to={[2.2, 2.6]} />
        </group>
      );
    case "admin":
      return (
        <group>
          <House w={1.2} d={1.0} h={0.9} />
        </group>
      );
    case "factory":
      return <Factory />;
    case "ruins":
      return <Ruins />;
    case "home":
      return <House w={1.2} d={1.0} h={0.9} warm />;
  }
}

/* ---------- landscape ---------- */

function Trees() {
  const trees = useMemo(() => {
    const rnd = mulberry32(42);
    const out: { x: number; z: number; h: number }[] = [];
    let guard = 0;
    while (out.length < 46 && guard++ < 400) {
      const x = (rnd() - 0.5) * 52;
      const z = (rnd() - 0.5) * 34;
      const nearStation = STATIONS.some((s) => (s.pos[0] - x) ** 2 + (s.pos[1] - z) ** 2 < 14);
      if (nearStation) continue;
      out.push({ x, z, h: 0.8 + rnd() * 1.4 });
    }
    return out;
  }, []);
  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh position={[0, t.h * 0.35, 0]}>
            <cylinderGeometry args={[0.035, 0.05, t.h * 0.7, 5]} />
            <meshStandardMaterial color={COLORS.trunk} roughness={1} />
          </mesh>
          <mesh position={[0, t.h * 0.85, 0]}>
            <coneGeometry args={[t.h * 0.28, t.h * 0.8, 6]} />
            <meshStandardMaterial color={COLORS.tree} roughness={1} />
          </mesh>
        </group>
      ))}
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
  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (focus) {
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
      <fog attach="fog" args={["#a7abb0", 18, 55]} />
      <hemisphereLight args={["#c7cbd1", "#3a3a36", 0.9]} />
      <directionalLight position={[10, 14, 6]} intensity={0.9} castShadow shadow-mapSize={[2048, 2048]} />

      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[42, 48]} />
        <meshStandardMaterial color={COLORS.ground} roughness={1} />
      </mesh>

      <Path />
      <Trees />

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
          <Html position={[0, 2.3, 0]} center distanceFactor={16} zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
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
    </Canvas>
  );
}
