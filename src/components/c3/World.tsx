"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/**
 * C3 — Money in the World Today, as a walkable 3D room.
 * Cube volumes are proportional to the amounts (side = k * cbrt(trillions)),
 * faithful to the 2018 infographic of the C3 / CryptoCreditCoin project.
 */

interface Item {
  key: string;
  label: string;
  amount: number; // trillions USD (display)
  display: string;
  color: string;
  accent?: boolean;
  note: string;
}

const ITEMS: Item[] = [
  {
    key: "crypto",
    label: "Cryptocurrencies",
    amount: 0.09,
    display: "0.09 trillion",
    color: "#29abe2",
    accent: true,
    note:
      "The entire cryptocurrency market next to the money of the world. C3's answer: credit money on the blockchain — every ccoin fully backed by assets posted as collateral.",
  },
  {
    key: "gold",
    label: "Gold",
    amount: 7.3,
    display: "7.3 trillion",
    color: "#cfcabc",
    note: "All the gold ever mined, at market value — 7.3 trillion USD.",
  },
  {
    key: "cash",
    label: "Cash & coins",
    amount: 10,
    display: "10 trillion",
    color: "#c9c9c9",
    note: "10 trillion USD in cash and coins issued by the central banks of the world.",
  },
  {
    key: "narrow",
    label: "Narrow money",
    amount: 14,
    display: "14 trillion",
    color: "#c9c9c9",
    note: "14 trillion USD in narrow or central bank money.",
  },
  {
    key: "credit",
    label: "Commercial bank credit",
    amount: 300,
    display: "300 trillion",
    color: "#c2c2c2",
    note:
      "About 300 trillion USD created by commercial banks as credit — most of the money in the world is debt.",
  },
  {
    key: "derivatives",
    label: "Derivatives",
    amount: 1000,
    display: "600–1,500 trillion",
    color: "#bcbcbc",
    note:
      "600 to 1,500 trillion USD in derivatives — nobody knows exactly how many there are, or what every instrument is worth.",
  },
];

const SIDE_K = 0.55;
function side(amount: number) {
  return SIDE_K * Math.cbrt(amount);
}

// cubes in a row, ascending, with breathing room between them
function layout(): { item: Item; s: number; x: number }[] {
  let x = -8.5;
  return ITEMS.map((item) => {
    const s = side(item.amount);
    x += s / 2;
    const placed = { item, s, x };
    x += s / 2 + 1.1;
    return placed;
  });
}

function MoneyCube({
  s,
  x,
  item,
  active,
  onHover,
  onSelect,
}: {
  s: number;
  x: number;
  item: Item;
  active: boolean;
  onHover: (key: string | null) => void;
  onSelect: (key: string) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (halo.current) {
      const t = clock.elapsedTime;
      const pulse = 1 + Math.sin(t * 2.2) * 0.12;
      halo.current.scale.setScalar(pulse);
      (halo.current.material as THREE.MeshBasicMaterial).opacity = 0.28 + Math.sin(t * 2.2) * 0.1;
    }
  });

  return (
    <group position={[x, 0, 0]}>
      <mesh
        ref={mesh}
        position={[0, s / 2, 0]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.key);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(item.key);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[s, s, s]} />
        <meshStandardMaterial
          color={item.color}
          roughness={0.75}
          metalness={0.02}
          emissive={active ? (item.accent ? "#29abe2" : "#d4a853") : "#000000"}
          emissiveIntensity={active ? 0.35 : 0}
        />
      </mesh>
      {/* the crypto cube glows — it is the point of the piece */}
      {item.accent && (
        <mesh ref={halo} position={[0, s / 2, 0]}>
          <sphereGeometry args={[s * 1.4, 20, 16]} />
          <meshBasicMaterial color="#29abe2" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function Room() {
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#6a6a6a" roughness={0.95} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 15, -12]} receiveShadow>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial color="#565454" roughness={1} />
      </mesh>
      {/* side wall, like the corner room of the infographic */}
      <mesh position={[14, 15, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial color="#7d7b7b" roughness={1} />
      </mesh>
    </group>
  );
}

export default function C3World() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>("crypto");
  const placed = useMemo(layout, []);
  const active = hovered ?? selected;
  const activeItem = ITEMS.find((i) => i.key === active) ?? null;
  const selectedItem = ITEMS.find((i) => i.key === selected) ?? null;

  return (
    <div className="fixed inset-0 bg-[#4a4848]">
      <Canvas shadows camera={{ position: [-9, 6.5, 13], fov: 42, near: 0.1 }}>
        <ambientLight intensity={0.85} />
        <directionalLight
          position={[-10, 18, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        <directionalLight position={[8, 10, -6]} intensity={0.4} />
        <Room />
        {placed.map(({ item, s, x }) => (
          <MoneyCube
            key={item.key}
            item={item}
            s={s}
            x={x}
            active={active === item.key}
            onHover={setHovered}
            onSelect={setSelected}
          />
        ))}
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          minDistance={2}
          maxDistance={26}
          maxPolarAngle={Math.PI / 2.05}
          target={[-2, 1.6, 0]}
        />
      </Canvas>

      {/* header */}
      <div className="absolute top-16 left-0 right-0 px-4 sm:px-6 py-4 pointer-events-none">
        <div className="pointer-events-auto">
          <Link
            href="/work/c3"
            className="text-xs tracking-widest text-gray-400 hover:text-white transition-colors uppercase whitespace-nowrap"
          >
            ← C3
          </Link>
          <h1 className="font-serif text-xl sm:text-2xl text-white/90 tracking-[0.2em] uppercase">
            Money in the World Today
          </h1>
          <p className="text-[11px] text-gray-400 tracking-wide mt-1">
            Cube volumes are proportional to the amounts · drag to look around
          </p>
        </div>
      </div>

      {/* legend, like the label column of the infographic */}
      <div className="absolute left-4 sm:left-6 top-44 sm:top-48 pointer-events-auto">
        <ul className="space-y-1.5">
          {[...ITEMS].reverse().map((item) => {
            const isActive = active === item.key;
            return (
              <li key={item.key}>
                <button
                  onMouseEnter={() => setHovered(item.key)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(item.key)}
                  className={`text-left text-xs sm:text-sm tracking-wide transition-colors ${
                    item.accent
                      ? isActive
                        ? "text-[#5ec4ee]"
                        : "text-[#29abe2]"
                      : isActive
                        ? "text-white"
                        : "text-gray-300 hover:text-white"
                  }`}
                >
                  <span className="tabular-nums">{item.display}</span>{" "}
                  <span className={item.accent ? "" : "text-gray-400"}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* info panel for the selected amount */}
      {selectedItem && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center px-4 pointer-events-none">
          <div className="max-w-xl text-center bg-black/55 backdrop-blur-sm rounded-lg px-5 py-3 border border-white/10 pointer-events-auto">
            <p
              className="text-[10px] uppercase tracking-widest mb-1"
              style={{ color: selectedItem.accent ? "#29abe2" : "#d4a853" }}
            >
              {selectedItem.display} USD — {selectedItem.label}
            </p>
            <p className="text-sm text-gray-200 leading-relaxed">{selectedItem.note}</p>
          </div>
        </div>
      )}

      {/* hover tag following nothing — simple and quiet; the legend is the map */}
      {activeItem && hovered && (
        <div className="absolute top-32 right-4 sm:right-6 text-right pointer-events-none">
          <p className="text-xs uppercase tracking-widest text-gray-400">{activeItem.label}</p>
          <p
            className="font-serif text-2xl"
            style={{ color: activeItem.accent ? "#29abe2" : "#ffffff" }}
          >
            {activeItem.display} <span className="text-sm text-gray-400">USD</span>
          </p>
        </div>
      )}
    </div>
  );
}
