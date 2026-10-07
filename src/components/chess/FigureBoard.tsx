"use client";

import FigureIcon from "./FigureIcon";
import { PIECE_NAMES, type Color, type PieceState } from "./engine";

const FILES = "abcdefgh";
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

export const colorName = (c: Color) => (c === "w" ? "White" : "Black");
export const pieceLabel = (p: Pick<PieceState, "color" | "type" | "initialSquare">) =>
  `${colorName(p.color).toLowerCase()} ${PIECE_NAMES[p.type].toLowerCase()} ${p.initialSquare}`;
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * The board in its starting position, populated with camera-figures.
 * With `onPick` every figure is a button (the role picker); without it the
 * board is a static picture.
 */
export default function FigureBoard({
  pieces,
  onPick,
  onHover,
  active,
  className = "",
}: {
  pieces: PieceState[];
  onPick?: (pieceId: string) => void;
  onHover?: (piece: PieceState | null) => void;
  active?: string | null; // piece id to highlight
  className?: string;
}) {
  const bySquare = new Map(pieces.filter((p) => p.square).map((p) => [p.square as string, p]));

  return (
    <div className={`relative ${className}`}>
      <div
        className="grid grid-cols-8 overflow-hidden rounded-[3px] ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
        onMouseLeave={() => onHover?.(null)}
      >
        {RANKS.map((rank) =>
          FILES.split("").map((file, f) => {
            const square = `${file}${rank}`;
            const dark = (f + rank) % 2 === 1; // a1 is dark
            const piece = bySquare.get(square);
            const isActive = piece && active === piece.id;
            const squareClass = `relative aspect-square flex items-end justify-center ${
              dark ? "bg-[#070707]" : "bg-[#f2f0ea]"
            }`;
            const figure = piece ? (
              <FigureIcon
                color={piece.color}
                type={piece.type}
                className={`w-[82%] h-[96%] transition-transform duration-200 ${
                  isActive ? "-translate-y-[6%] scale-110" : ""
                }`}
              />
            ) : null;

            if (piece && onPick) {
              return (
                <button
                  key={square}
                  type="button"
                  onClick={() => onPick(piece.id)}
                  onMouseEnter={() => onHover?.(piece)}
                  onFocus={() => onHover?.(piece)}
                  onBlur={() => onHover?.(null)}
                  aria-label={`Play as the ${pieceLabel(piece)}`}
                  className={`${squareClass} group cursor-pointer outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset`}
                >
                  <span
                    className={`absolute inset-0 transition-colors duration-200 ${
                      isActive ? "bg-accent/35" : "group-hover:bg-accent/25"
                    }`}
                  />
                  <span className="relative w-full h-full flex items-end justify-center">{figure}</span>
                </button>
              );
            }
            return (
              <div key={square} className={squareClass}>
                {figure}
              </div>
            );
          })
        )}
      </div>
      {/* coordinates */}
      <div className="pointer-events-none absolute -left-5 inset-y-0 grid grid-rows-8 text-[10px] text-accent/70 font-serif">
        {RANKS.map((r) => (
          <span key={r} className="flex items-center justify-center">
            {r}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute -bottom-5 inset-x-0 grid grid-cols-8 text-[10px] text-accent/70 font-serif">
        {FILES.split("").map((f) => (
          <span key={f} className="flex items-center justify-center">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
