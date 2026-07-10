"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Billboard, Text } from "@react-three/drei";

/**
 * C3 — Money in the World, 1950 to today, as a walkable 3D room.
 * Cube volumes are proportional to the amounts (side = k * cbrt(trillions)).
 * Scrub or play the timeline and watch credit and derivatives swell while
 * cash stays small and cryptocurrencies appear only at the very end.
 *
 * Amounts in nominal USD trillions. Anchors: IIF Global Debt Monitor (debt),
 * BIS OTC statistics (derivatives notional), World Gold Council (gold stock),
 * central bank data (cash); values before ~1990 are honest estimates.
 */

const YEARS = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2018, 2026];

interface Item {
  key: string;
  label: string;
  series: number[]; // trillions USD at YEARS
  color: string;
  accent?: boolean;
  note: string;
}

const ITEMS: Item[] = [
  {
    key: "crypto",
    label: "Cryptocurrencies",
    series: [0, 0, 0, 0, 0, 0, 0, 0.09, 2.25],
    color: "#29abe2",
    accent: true,
    note:
      "Born in 2009 — and still a speck next to the money of the world. C3's answer: credit money on the blockchain, every ccoin fully backed by assets posted as collateral.",
  },
  {
    key: "gold",
    label: "Gold",
    series: [0.08, 0.1, 0.11, 2.2, 1.6, 1.3, 6.5, 7.3, 29],
    color: "#cfcabc",
    note:
      "All the gold ever mined, at the gold price of the day. The stock grows slowly — the price does not: $35 an ounce until 1971, around $4,000 today.",
  },
  {
    key: "cash",
    label: "Cash & coins",
    series: [0.05, 0.09, 0.18, 0.45, 1.0, 1.9, 4.8, 7.9, 8.9],
    color: "#c9c9c9",
    note: "Banknotes and coins issued by the central banks of the world.",
  },
  {
    key: "narrow",
    label: "Central bank money",
    series: [0.1, 0.2, 0.45, 1.1, 2.5, 4.5, 12, 14, 26],
    color: "#c9c9c9",
    note: "Narrow or central bank money — the reserves beyond the banknotes (estimate).",
  },
  {
    key: "credit",
    label: "Credit / debt",
    series: [0.5, 1.2, 2.8, 12, 35, 87, 175, 230, 348],
    color: "#c2c2c2",
    note:
      "Money created as credit — most of the money in the world is debt. A record 348 trillion USD at the end of 2025 (IIF).",
  },
  {
    key: "derivatives",
    label: "Derivatives",
    series: [0, 0, 0.1, 1, 15, 95, 601, 550, 846],
    color: "#bcbcbc",
    note:
      "Notional value of derivatives — essentially zero before the 1970s, 846 trillion USD by mid-2025 (BIS). Nobody knows exactly what every instrument is worth.",
  },
];

const SIDE_K = 0.55;
const YEAR_MIN = YEARS[0];
const YEAR_MAX = YEARS[YEARS.length - 1];

/** amount at a fractional year: log-interpolated between decade anchors */
function amountAt(series: number[], year: number): number {
  if (year <= YEAR_MIN) return series[0];
  if (year >= YEAR_MAX) return series[series.length - 1];
  let i = 0;
  while (YEARS[i + 1] < year) i++;
  const a = series[i];
  const b = series[i + 1];
  const t = (year - YEARS[i]) / (YEARS[i + 1] - YEARS[i]);
  if (a <= 0 || b <= 0) return a + (b - a) * t;
  return Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * t);
}

function formatAmount(v: number): string {
  if (v <= 0) return "—";
  if (v < 0.01) return "<0.01";
  if (v < 1) return v.toFixed(2);
  if (v < 20) return v.toFixed(1);
  return String(Math.round(v));
}

function Room() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#6a6a6a" roughness={0.95} />
      </mesh>
      <mesh position={[0, 15, -12]} receiveShadow>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial color="#565454" roughness={1} />
      </mesh>
    </group>
  );
}

export default function C3World() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>("crypto");
  const [year, setYear] = useState(YEAR_MIN);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number>(0);

  // autoplay: one slow sweep 1950 -> 2026 (~18s), starts shortly after load
  useEffect(() => {
    const t = setTimeout(() => setPlaying(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setYear((y) => {
        const next = y + dt * ((YEAR_MAX - YEAR_MIN) / 18);
        if (next >= YEAR_MAX) {
          setPlaying(false);
          return YEAR_MAX;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  // sizes and positions for the current year
  const placed = useMemo(() => {
    let x = -9;
    return ITEMS.map((item) => {
      const amount = amountAt(item.series, year);
      const s = Math.max(0.001, SIDE_K * Math.cbrt(Math.max(0, amount)));
      const visible = amount > 0.0005;
      x += (visible ? s : 0) / 2;
      const cube = { item, amount, s, x, visible };
      x += (visible ? s / 2 + 1.1 : 0.25);
      return cube;
    });
  }, [year]);

  const active = hovered ?? selected;
  const activeCube = placed.find((p) => p.item.key === active && p.visible) ?? null;
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
        {placed.map(({ item, s, x, visible }) =>
          visible ? (
            <group key={item.key} position={[x, 0, 0]}>
              <mesh
                position={[0, s / 2, 0]}
                scale={[s, s, s]}
                castShadow
                receiveShadow
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(item.key);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHovered(item.key);
                  document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                  setHovered(null);
                  document.body.style.cursor = "auto";
                }}
              >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                  color={item.color}
                  roughness={0.75}
                  metalness={0.02}
                  emissive={
                    active === item.key ? (item.accent ? "#29abe2" : "#d4a853") : "#000000"
                  }
                  emissiveIntensity={active === item.key ? 0.35 : 0}
                />
              </mesh>
              {item.accent && (
                <mesh position={[0, s / 2, 0]} scale={[s * 1.4, s * 1.4, s * 1.4]}>
                  <sphereGeometry args={[1, 20, 16]} />
                  <meshBasicMaterial color="#29abe2" transparent opacity={0.25} depthWrite={false} />
                </mesh>
              )}
              {/* floating label: what the cube is, and how much right now */}
              <Billboard position={[0, s + 0.55, 0]} follow>
                <Text
                  fontSize={Math.min(0.42, Math.max(0.18, 0.14 + s * 0.045))}
                  color={item.accent ? "#5ec4ee" : "#efefef"}
                  anchorX="center"
                  anchorY="bottom"
                  outlineWidth={0.006}
                  outlineColor="#2b2a2a"
                  letterSpacing={0.06}
                >
                  {item.label.toUpperCase()}
                </Text>
                <Text
                  position={[0, -0.08, 0]}
                  fontSize={Math.min(0.34, Math.max(0.15, 0.11 + s * 0.035))}
                  color={item.accent ? "#29abe2" : "#b9b9b9"}
                  anchorX="center"
                  anchorY="top"
                  outlineWidth={0.005}
                  outlineColor="#2b2a2a"
                >
                  {`${formatAmount(amountAt(item.series, year))} trillion $`}
                </Text>
              </Billboard>
            </group>
          ) : null
        )}
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
            Money in the World
          </h1>
          <p className="text-[11px] text-gray-400 tracking-wide mt-1">
            Nominal USD · cube volumes proportional to the amounts · estimates before 1990
          </p>
        </div>
      </div>

      {/* legend with live values */}
      <div className="absolute left-4 sm:left-6 top-44 sm:top-48 pointer-events-auto">
        <ul className="space-y-1.5">
          {placed
            .slice()
            .reverse()
            .map(({ item, amount }) => {
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
                    <span className="tabular-nums inline-block w-16 text-right mr-2">
                      {formatAmount(amount)}
                    </span>
                    <span className={item.accent ? "" : "text-gray-400"}>{item.label}</span>
                  </button>
                </li>
              );
            })}
        </ul>
        <p className="text-[10px] text-gray-500 mt-2 ml-1">trillion USD</p>
      </div>

      {/* year + timeline */}
      <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 px-4 pointer-events-none">
        {selectedItem && (
          <div className="max-w-xl text-center bg-black/55 backdrop-blur-sm rounded-lg px-5 py-3 border border-white/10 pointer-events-auto mb-1">
            <p
              className="text-[10px] uppercase tracking-widest mb-1"
              style={{ color: selectedItem.accent ? "#29abe2" : "#d4a853" }}
            >
              {formatAmount(amountAt(selectedItem.series, year))} trillion USD —{" "}
              {selectedItem.label}
            </p>
            <p className="text-sm text-gray-200 leading-relaxed">{selectedItem.note}</p>
          </div>
        )}
        <div className="flex items-center gap-4 w-full max-w-xl pointer-events-auto bg-black/45 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
          <button
            onClick={() => {
              if (!playing && year >= YEAR_MAX - 0.1) setYear(YEAR_MIN);
              setPlaying((p) => !p);
            }}
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-accent/50 text-accent hover:border-accent transition-colors"
            title={playing ? "Pause" : "Play 1950 → today"}
          >
            {playing ? (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
            ) : (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4l13 8-13 8z" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={0.1}
            value={year}
            onChange={(e) => {
              setPlaying(false);
              setYear(Number(e.target.value));
            }}
            className="flex-1 accent-[#d4a853]"
          />
          <span className="font-serif text-2xl text-white/90 tabular-nums w-20 text-right">
            {Math.floor(year)}
          </span>
        </div>
      </div>

      {/* hover readout */}
      {activeCube && hovered && (
        <div className="absolute top-32 right-4 sm:right-6 text-right pointer-events-none">
          <p className="text-xs uppercase tracking-widest text-gray-400">{activeCube.item.label}</p>
          <p
            className="font-serif text-2xl"
            style={{ color: activeCube.item.accent ? "#29abe2" : "#ffffff" }}
          >
            {formatAmount(activeCube.amount)}{" "}
            <span className="text-sm text-gray-400">trillion USD</span>
          </p>
        </div>
      )}
    </div>
  );
}
