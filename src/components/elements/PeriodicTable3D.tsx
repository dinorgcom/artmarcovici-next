"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { colorForT, cssColor, gridPosition, textColorOn } from "@/data/elements";
import type { ElementCell } from "./PeriodicTable2D";

const MAX_BAR_HEIGHT = 7;

type BarProps = {
  cell: ElementCell;
  selected: boolean;
  onSelect: (z: number) => void;
};

function Bar({ cell, selected, onSelect }: BarProps) {
  const { col, row } = gridPosition(cell.el.z);
  const x = col - 9.5;
  const zPos = row - 5.5;
  const h = cell.t === null ? 0.08 : 0.15 + cell.t * MAX_BAR_HEIGHT;
  const rgb = cell.t === null ? null : colorForT(cell.t);

  return (
    <group position={[x, 0, zPos]}>
      <mesh
        position={[0, h / 2, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onSelect(cell.el.z);
        }}
      >
        <boxGeometry args={[0.85, h, 0.85]} />
        <meshStandardMaterial
          color={rgb ? cssColor(rgb) : "#222222"}
          emissive={selected ? "#ffffff" : "#000000"}
          emissiveIntensity={selected ? 0.3 : 0}
        />
      </mesh>
      <Text
        position={[0, h + 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.32}
        color={rgb ? textColorOn(rgb) : "#777777"}
        anchorX="center"
        anchorY="middle"
      >
        {cell.el.symbol}
      </Text>
    </group>
  );
}

type Props = {
  data: ElementCell[];
  selectedZ: number | null;
  onSelect: (z: number) => void;
};

export default function PeriodicTable3D({ data, selectedZ, onSelect }: Props) {
  return (
    <div className="h-[65vh] min-h-[420px] w-full overflow-hidden rounded-lg border border-white/10">
      <Canvas camera={{ position: [0, 13, 15], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[8, 18, 10]} intensity={1.4} />
        <directionalLight position={[-10, 8, -6]} intensity={0.4} />
        {data.map((cell) => (
          <Bar
            key={cell.el.z}
            cell={cell}
            selected={selectedZ === cell.el.z}
            onSelect={onSelect}
          />
        ))}
        <OrbitControls
          target={[0, 1.5, 0]}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={6}
          maxDistance={40}
        />
      </Canvas>
    </div>
  );
}
