import { BODY_HEIGHTS, PIECE_SYMBOLS, type Color, type PieceType } from "./engine";

// A camera-figure from the installation, seen from the front: a printed
// canister (taller for more important pieces) carrying a pan-tilt IP camera.
// Drawn as SVG so it renders identically on every platform — the plain
// Unicode chess glyphs fall back to colour emoji on some systems.

// U+FE0E forces the text (not emoji) presentation of the glyph
const glyph = (color: Color, type: PieceType) => `${PIECE_SYMBOLS[color][type]}︎`;

const PALETTE = {
  w: { body: "#efece5", edge: "#bdb8ad", head: "#e3e0d8", ring: "#b9b4aa", print: "#1c1a17" },
  b: { body: "#1d1d1d", edge: "#3b3b3b", head: "#2a2a2a", ring: "#4b4b4b", print: "#ece8de" },
} as const;

export default function FigureIcon({
  color,
  type,
  className,
  title,
}: {
  color: Color;
  type: PieceType;
  className?: string;
  title?: string;
}) {
  const c = PALETTE[color];
  // canister height in px of the 40×60 viewBox, proportional to the 3D bodies
  const h = 15 + ((BODY_HEIGHTS[type] - BODY_HEIGHTS.p) / (BODY_HEIGHTS.k - BODY_HEIGHTS.p)) * 17;
  const base = 56;
  const top = base - h;
  const headY = top - 7.5;

  return (
    <svg viewBox="0 0 40 60" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {/* contact shadow */}
      <ellipse cx="20" cy={base + 0.6} rx="12" ry="2" fill="#000" opacity="0.45" />
      {/* antenna */}
      <line x1="25" y1={headY - 3} x2="30" y2={headY - 13} stroke={c.edge} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="30.3" cy={headY - 13.6} r="1.4" fill={c.head} stroke={c.edge} strokeWidth="0.6" />
      {/* tapered canister body */}
      <path
        d={`M9 ${base} L10 ${top + 2} Q10 ${top} 12 ${top} L28 ${top} Q30 ${top} 30 ${top + 2} L31 ${base} Z`}
        fill={c.body}
        stroke={c.edge}
        strokeWidth="0.8"
      />
      {/* printed piece symbol */}
      <text
        x="20"
        y={top + h * 0.56}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={Math.min(13, h * 0.62)}
        fill={c.print}
        style={{ fontFamily: '"Segoe UI Symbol", "Noto Sans Symbols 2", "Apple Symbols", "DejaVu Sans", serif' }}
      >
        {glyph(color, type)}
      </text>
      {/* camera head with lens */}
      <circle cx="20" cy={headY} r="7.5" fill={c.head} stroke={c.edge} strokeWidth="0.8" />
      <circle cx="20" cy={headY + 0.6} r="3.9" fill={c.ring} />
      <circle cx="20" cy={headY + 0.6} r="2.7" fill="#06080d" />
      <circle cx="21.1" cy={headY - 0.5} r="0.8" fill="#dcebff" />
    </svg>
  );
}
