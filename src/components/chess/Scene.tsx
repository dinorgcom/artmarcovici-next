"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { reportSlide } from "./slideSound";
import {
  BODY_HEIGHTS,
  eyeHeight,
  squareToWorld,
  PIECE_SYMBOLS,
  type PieceState,
  type Color,
} from "./engine";

export type ViewMode =
  | { kind: "orbit" } // role selection / spectate
  | { kind: "commander"; color: Color }
  | { kind: "firstPerson"; pieceId: string };

interface SceneProps {
  pieces: PieceState[];
  view: ViewMode;
  selectablePieceIds: string[]; // pieces the human commander may pick
  selectedPieceId: string | null; // piece currently chosen to move
  targetSquares: string[]; // legal destinations for the human piece
  onPiecePick: (id: string) => void;
  onSquarePick: (square: string) => void;
}

/* ---------- piece symbol as canvas texture (matches printed canisters) ---------- */

function useSymbolTexture(color: Color, type: PieceState["type"]) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 256, 256);
    ctx.fillStyle = color === "w" ? "#1c1a17" : "#efece5";
    ctx.font = '170px "Segoe UI Symbol", "Noto Sans Symbols 2", serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(PIECE_SYMBOLS[color][type], 128, 138);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    return tex;
  }, [color, type]);
}

/* ---------- curved symbol band hugging the tapered body ---------- */

function SymbolDecal({
  texture,
  bodyH,
  rotationY,
}: {
  texture: THREE.CanvasTexture;
  bodyH: number;
  rotationY: number;
}) {
  // body tapers from r=0.25 at the base to r=0.23 at the top; the band
  // follows that taper sitting a hair above the surface
  const radiusAt = (y: number) => 0.25 - 0.02 * (y / bodyH) + 0.004;
  const bandH = Math.min(0.38, bodyH * 0.7);
  const y0 = bodyH * 0.5;
  const thetaLen = 1.35;
  return (
    <mesh position={[0, y0, 0]} rotation={[0, rotationY, 0]}>
      <cylinderGeometry
        args={[
          radiusAt(y0 + bandH / 2),
          radiusAt(y0 - bandH / 2),
          bandH,
          24,
          1,
          true,
          Math.PI - thetaLen / 2,
          thetaLen,
        ]}
      />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ---------- one camera-figure ---------- */

function PieceFigure({
  piece,
  selectable,
  selected,
  onPick,
  hidden,
}: {
  piece: PieceState;
  selectable: boolean;
  selected: boolean;
  onPick: (id: string) => void;
  hidden: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const symbol = useSymbolTexture(piece.color, piece.type);
  // deterministic per-piece phase so each camera pans on its own rhythm
  const phase = useMemo(() => {
    let h = 0;
    for (const c of piece.id) h = (h * 31 + c.charCodeAt(0)) % 997;
    return (h / 997) * Math.PI * 2;
  }, [piece.id]);

  const bodyH = BODY_HEIGHTS[piece.type];
  const bodyColor = piece.color === "w" ? "#ece9e2" : "#181818";
  const headColor = piece.color === "w" ? "#dfdcd5" : "#242424";
  const forward = piece.color === "w" ? 0 : Math.PI; // yaw 0 faces -z = toward the black side

  // Place the figure imperatively exactly once, on mount. The group gets no
  // position prop at all, so nothing React does can ever teleport it — from
  // then on the only thing moving it is the per-frame glide below.
  const placeRef = useCallback(
    (g: THREE.Group | null) => {
      group.current = g;
      if (g && !g.userData.placed) {
        const [ix, iz] = squareToWorld(piece.square ?? piece.initialSquare);
        g.position.set(ix, 0, iz);
        g.userData.placed = true;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const wasSliding = useRef(false);
  const ring = useRef<THREE.MeshBasicMaterial>(null);
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useFrame(({ clock }, delta) => {
    // figures the commander may call breathe softly so they read as clickable
    if (ring.current) {
      const t = clock.elapsedTime;
      ring.current.opacity = selected
        ? 0.95
        : hovered
          ? 0.9
          : reducedMotion
            ? 0.45
            : 0.3 + 0.3 * (0.5 + 0.5 * Math.sin(t * 2.6 + phase));
    }
    if (!group.current || piece.square === null) return;
    const [x, z] = squareToWorld(piece.square);
    // glide across the board to the current square (frame-rate independent)
    const before = group.current.position.clone();
    group.current.position.x = THREE.MathUtils.damp(before.x, x, 3.2, delta);
    group.current.position.z = THREE.MathUtils.damp(before.z, z, 3.2, delta);
    // sliding sound follows the speed; one final 0 ends it cleanly
    const moved = Math.hypot(group.current.position.x - before.x, group.current.position.z - before.z);
    const speed = delta > 0 ? moved / delta : 0;
    if (speed > 0.12) {
      wasSliding.current = true;
      reportSlide(speed);
    } else if (wasSliding.current) {
      wasSliding.current = false;
      reportSlide(0);
    }
    // idle: the IP cameras slowly pan around, like in the installation
    if (head.current) {
      const t = clock.elapsedTime;
      head.current.rotation.y = forward + Math.sin(t * 0.35 + phase) * 0.7;
      head.current.rotation.x = Math.sin(t * 0.22 + phase * 1.7) * 0.12;
    }
  });

  if (piece.square === null || hidden) return null;

  return (
    <group
      ref={placeRef}
      onClick={(e) => {
        if (!selectable) return;
        e.stopPropagation();
        onPick(piece.id);
      }}
      onPointerOver={(e) => {
        if (!selectable) return;
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* canister body */}
      <mesh position={[0, bodyH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.25, bodyH, 24]} />
        <meshStandardMaterial color={bodyColor} roughness={0.55} metalness={0.05} />
      </mesh>
      {/* printed piece symbol, curved onto the tapered body — on both sides */}
      <SymbolDecal texture={symbol} bodyH={bodyH} rotationY={forward} />
      <SymbolDecal texture={symbol} bodyH={bodyH} rotationY={forward + Math.PI} />
      {/* pan-tilt camera head */}
      <group ref={head} position={[0, bodyH + 0.13, 0]} rotation={[0, forward, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.17, 24, 18]} />
          <meshStandardMaterial color={headColor} roughness={0.4} />
        </mesh>
        {/* lens barrel + reflective glass lens looking along -z of the head */}
        <mesh position={[0, 0, -0.145]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.07, 20]} />
          <meshStandardMaterial
            color={piece.color === "w" ? "#c9c6bf" : "#3a3a3a"}
            roughness={0.25}
            metalness={0.3}
            envMapIntensity={0.8}
          />
        </mesh>
        <mesh position={[0, 0, -0.181]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.014, 24]} />
          <meshPhysicalMaterial
            color="#05070d"
            roughness={0.04}
            metalness={0.7}
            clearcoat={1}
            clearcoatRoughness={0.03}
            envMapIntensity={2.2}
          />
        </mesh>
        {/* specular glint on the glass */}
        <mesh position={[0.02, 0.022, -0.189]}>
          <sphereGeometry args={[0.011, 8, 8]} />
          <meshBasicMaterial color="#dcebff" />
        </mesh>
        {/* antenna: hinge base, tapered shaft, ball tip */}
        <group position={[0.1, 0.1, 0.06]} rotation={[0.12, 0, -0.32]}>
          <mesh position={[0, 0.025, 0]}>
            <cylinderGeometry args={[0.02, 0.026, 0.05, 10]} />
            <meshStandardMaterial color={headColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.17, 0]}>
            <cylinderGeometry args={[0.007, 0.014, 0.24, 8]} />
            <meshStandardMaterial color={headColor} roughness={0.45} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.017, 10, 8]} />
            <meshStandardMaterial color={headColor} roughness={0.4} />
          </mesh>
        </group>
      </group>
      {/* selection ring for the commander */}
      {(selectable || selected) && (
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.38, 40]} />
          <meshBasicMaterial ref={ring} color="#d4a853" transparent opacity={0.4} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- board ---------- */

const FILES = "abcdefgh";
const PODIUM = 9.3;

/** Gold inlay line and a–h / 1–8 on the podium rim, readable from both sides. */
function useCoordinateTexture() {
  return useMemo(() => {
    const size = 2048;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const px = (world: number) => ((world + PODIUM / 2) / PODIUM) * size;
    // inlay
    ctx.strokeStyle = "rgba(212,168,83,0.75)";
    ctx.lineWidth = 5;
    ctx.strokeRect(px(-4.12), px(-4.12), px(4.12) - px(-4.12), px(4.12) - px(-4.12));
    ctx.strokeStyle = "rgba(212,168,83,0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(px(-4.58), px(-4.58), px(4.58) - px(-4.58), px(4.58) - px(-4.58));
    // labels
    ctx.fillStyle = "rgba(212,168,83,0.9)";
    ctx.font = '600 58px "Playfair Display", Georgia, serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = (text: string, x: number, z: number, flip: boolean) => {
      ctx.save();
      ctx.translate(px(x), px(z));
      if (flip) ctx.rotate(Math.PI);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };
    for (let i = 0; i < 8; i++) {
      const file = FILES[i];
      const fx = i - 3.5;
      label(file, fx, 4.36, false); // white side
      label(file, fx, -4.36, true); // black side
      const rank = String(i + 1);
      const rz = 4.5 - (i + 1);
      label(rank, -4.36, rz, false);
      label(rank, 4.36, rz, true);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Board({
  targetSquares,
  onSquarePick,
}: {
  targetSquares: string[];
  onSquarePick: (square: string) => void;
}) {
  const squares = useMemo(() => {
    const list: { square: string; x: number; z: number; dark: boolean }[] = [];
    for (let f = 0; f < 8; f++) {
      for (let r = 1; r <= 8; r++) {
        const square = `${FILES[f]}${r}`;
        const [x, z] = squareToWorld(square);
        list.push({ square, x, z, dark: (f + r) % 2 === 1 }); // a1 dark, h1 light
      }
    }
    return list;
  }, []);
  const targets = useMemo(() => new Set(targetSquares), [targetSquares]);
  const coords = useCoordinateTexture();

  return (
    <group>
      {squares.map(({ square, x, z, dark }) => (
        <mesh
          key={square}
          position={[x, -0.025, z]}
          receiveShadow
          onClick={(e) => {
            if (!targets.has(square)) return;
            e.stopPropagation();
            onSquarePick(square);
          }}
          onPointerOver={(e) => {
            if (!targets.has(square)) return;
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <boxGeometry args={[0.98, 0.05, 0.98]} />
          <meshPhysicalMaterial
            color={dark ? "#050505" : "#f4f4f2"}
            roughness={0.08}
            clearcoat={1}
            clearcoatRoughness={0.06}
          />
        </mesh>
      ))}
      {/* podium the board sits on, with gold inlay and coordinates */}
      <mesh position={[0, -0.27, 0]} receiveShadow castShadow>
        <boxGeometry args={[PODIUM, 0.42, PODIUM]} />
        <meshStandardMaterial color="#0e0d0b" roughness={0.38} metalness={0.25} />
      </mesh>
      <mesh position={[0, -0.0585, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PODIUM, PODIUM]} />
        <meshBasicMaterial map={coords} transparent toneMapped={false} />
      </mesh>
      {/* target markers: glowing square + light pillar so they read in first person */}
      {targetSquares.map((square) => {
        const [x, z] = squareToWorld(square);
        return (
          <group key={`t-${square}`}>
            <mesh
              position={[x, 0.004, z]}
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSquarePick(square);
              }}
            >
              <planeGeometry args={[0.9, 0.9]} />
              <meshBasicMaterial color="#d4a853" transparent opacity={0.45} />
            </mesh>
            <mesh position={[x, 0.6, z]}>
              <cylinderGeometry args={[0.06, 0.06, 1.2, 10]} />
              <meshBasicMaterial color="#d4a853" transparent opacity={0.22} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ---------- camera rigs ---------- */

function CameraRig({ view, pieces }: { view: ViewMode; pieces: PieceState[] }) {
  const { camera, gl } = useThree();
  const look = useRef({ yaw: 0, pitch: -0.1, dragging: false, lastX: 0, lastY: 0 });
  const lastPieceId = useRef<string | null>(null);

  useFrame(() => {
    if (view.kind === "firstPerson") {
      const piece = pieces.find((p) => p.id === view.pieceId);
      if (!piece || piece.square === null) return;
      if (lastPieceId.current !== view.pieceId) {
        lastPieceId.current = view.pieceId;
        look.current.yaw = piece.color === "w" ? 0 : Math.PI;
        look.current.pitch = -0.12;
      }
      const [x, z] = squareToWorld(piece.square);
      const y = eyeHeight(piece.type);
      camera.position.lerp(new THREE.Vector3(x, y, z), 0.12);
      camera.rotation.set(look.current.pitch, look.current.yaw, 0, "YXZ");
    } else if (view.kind === "commander") {
      const zSide = view.color === "w" ? 8.4 : -8.4;
      camera.position.lerp(new THREE.Vector3(0, 5.4, zSide), 0.08);
      camera.lookAt(0, 0, 0);
    }
  });

  // pointer-drag look-around for first person
  const el = gl.domElement;
  useEffect(() => {
    // without this the browser hijacks touch drags for scrolling and the
    // camera barely moves on phones
    const prevTouchAction = el.style.touchAction;
    el.style.touchAction = "none";
    const st = look.current;
    let activeId: number | null = null;
    const down = (e: PointerEvent) => {
      if (activeId !== null) return; // extra fingers must not reset the drag origin
      activeId = e.pointerId;
      st.dragging = true;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
    };
    const move = (e: PointerEvent) => {
      if (!st.dragging || e.pointerId !== activeId) return;
      // fingers travel shorter distances than a mouse — boost sensitivity
      const k = e.pointerType === "touch" ? 4 : 1;
      st.yaw -= (e.clientX - st.lastX) * 0.005 * k;
      st.pitch = THREE.MathUtils.clamp(
        st.pitch - (e.clientY - st.lastY) * 0.004 * k,
        -1.2,
        0.6
      );
      st.lastX = e.clientX;
      st.lastY = e.clientY;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId === activeId) {
        activeId = null;
        st.dragging = false;
      }
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.style.touchAction = prevTouchAction;
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [el]);

  return view.kind === "orbit" ? (
    <OrbitControls
      autoRotate
      autoRotateSpeed={0.6}
      enablePan={false}
      minDistance={6}
      maxDistance={16}
      maxPolarAngle={Math.PI / 2.2}
      target={[0, 0.4, 0]}
    />
  ) : null;
}

/* ---------- scene root ---------- */

export default function ChessScene({
  pieces,
  view,
  selectablePieceIds,
  selectedPieceId,
  targetSquares,
  onPiecePick,
  onSquarePick,
}: SceneProps) {
  const selectable = useMemo(() => new Set(selectablePieceIds), [selectablePieceIds]);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 6, 10], fov: 55, near: 0.05 }}
      gl={{ alpha: true, antialias: true }}
      style={{
        // a dim gallery: the pool of light under the spot fades into black
        background: "radial-gradient(ellipse 70% 60% at 50% 45%, #17140f 0%, #070605 55%, #000 100%)",
      }}
    >
      <fog attach="fog" args={["#040403", 13, 32]} />
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#3a3a45", "#0a0a0a", 0.45]} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, 8, -6]} intensity={0.45} />
      {/* warm overhead spot: the board as an exhibit */}
      <spotLight
        position={[0, 12, 1.5]}
        angle={0.5}
        penumbra={0.85}
        intensity={140}
        distance={40}
        decay={2}
        color="#fff1d6"
      />
      {/* gallery floor */}
      <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial color="#0b0a09" roughness={0.75} metalness={0.1} />
      </mesh>
      {/* studio-style environment for reflections on lenses and board */}
      <Environment resolution={64} frames={1}>
        <Lightformer position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} intensity={1.6} color="#ffffff" />
        <Lightformer position={[-6, 3, -4]} rotation={[0, Math.PI / 2, 0]} scale={[6, 3, 1]} intensity={1.2} color="#e8ecf5" />
        <Lightformer position={[6, 2, 4]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 2, 1]} intensity={0.9} color="#fff4e0" />
      </Environment>
      <Board targetSquares={targetSquares} onSquarePick={onSquarePick} />
      {pieces.map((piece) => (
        <PieceFigure
          key={piece.id}
          piece={piece}
          selectable={selectable.has(piece.id)}
          selected={selectedPieceId === piece.id}
          onPick={onPiecePick}
          hidden={view.kind === "firstPerson" && view.pieceId === piece.id}
        />
      ))}
      <CameraRig view={view} pieces={pieces} />
    </Canvas>
  );
}
