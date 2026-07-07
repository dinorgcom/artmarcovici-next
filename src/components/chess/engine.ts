import { Chess, type Move, type Square } from "chess.js";

export type Color = "w" | "b";
export type PieceType = "p" | "n" | "b" | "r" | "q" | "k";

export interface PieceState {
  id: string;
  color: Color;
  type: PieceType;
  square: string | null; // null = captured
  initialSquare: string;
}

export type Role = { kind: "player"; color: Color } | { kind: "piece"; pieceId: string };

export const PIECE_NAMES: Record<PieceType, string> = {
  p: "Pawn",
  n: "Knight",
  b: "Bishop",
  r: "Rook",
  q: "Queen",
  k: "King",
};

export const PIECE_SYMBOLS: Record<Color, Record<PieceType, string>> = {
  w: { p: "♙", n: "♘", b: "♗", r: "♖", q: "♕", k: "♔" },
  b: { p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚" },
};

const PIECE_VALUES: Record<PieceType, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

// Body heights of the camera-figures, roughly matching the installation:
// same diameter canisters, taller the more important the piece.
export const BODY_HEIGHTS: Record<PieceType, number> = {
  p: 0.55,
  r: 0.72,
  n: 0.82,
  b: 0.92,
  q: 1.08,
  k: 1.2,
};

export function eyeHeight(type: PieceType): number {
  return BODY_HEIGHTS[type] + 0.22; // camera head sits on top of the body
}

export function buildInitialPieces(chess: Chess): PieceState[] {
  const pieces: PieceState[] = [];
  for (const row of chess.board()) {
    for (const cell of row) {
      if (!cell) continue;
      pieces.push({
        id: `${cell.color}-${cell.type}-${cell.square}`,
        color: cell.color,
        type: cell.type,
        square: cell.square,
        initialSquare: cell.square,
      });
    }
  }
  return pieces;
}

export function applyMoveToPieces(pieces: PieceState[], m: Move): PieceState[] {
  return pieces.map((p) => {
    if (p.square === null) return p;
    if (m.flags.includes("e") && p.color !== m.color) {
      const capturedSquare = m.to[0] + m.from[1];
      if (p.square === capturedSquare) return { ...p, square: null };
    }
    if (m.captured && p.color !== m.color && p.square === m.to) {
      return { ...p, square: null };
    }
    if (p.color === m.color && p.square === m.from) {
      return { ...p, square: m.to, type: (m.promotion as PieceType) || p.type };
    }
    if (m.piece === "k" && p.color === m.color && p.type === "r") {
      const rank = m.from[1];
      if (m.flags.includes("k") && p.square === `h${rank}`) return { ...p, square: `f${rank}` };
      if (m.flags.includes("q") && p.square === `a${rank}`) return { ...p, square: `d${rank}` };
    }
    return p;
  });
}

export function squareToWorld(square: string): [number, number] {
  const file = square.charCodeAt(0) - 97; // a..h -> 0..7
  const rank = Number(square[1]); // 1..8
  return [file - 3.5, 4.5 - rank]; // x, z — white side at +z
}

export function movablePieces(chess: Chess, pieces: PieceState[]): PieceState[] {
  const turn = chess.turn();
  return pieces.filter(
    (p) =>
      p.color === turn &&
      p.square !== null &&
      chess.moves({ square: p.square as Square, verbose: true }).length > 0
  );
}

export function legalMovesFor(chess: Chess, square: string): Move[] {
  return chess.moves({ square: square as Square, verbose: true });
}

function bestGain(chess: Chess, square: string): number {
  let best = 0;
  for (const m of legalMovesFor(chess, square)) {
    if (m.captured) best = Math.max(best, PIECE_VALUES[m.captured as PieceType]);
  }
  return best;
}

/**
 * AI commander: decides WHICH piece moves (never where).
 * Slightly prefers pieces that could capture something; strongly prefers the
 * human's piece when it can move, so a human playing a piece gets called on.
 */
export function commanderPickAI(
  chess: Chess,
  pieces: PieceState[],
  humanPieceId: string | null
): PieceState {
  const candidates = movablePieces(chess, pieces);
  const human = humanPieceId ? candidates.find((p) => p.id === humanPieceId) : undefined;
  if (human && (candidates.length === 1 || Math.random() < 0.5)) return human;

  const weights = candidates.map((p) => 1 + bestGain(chess, p.square as string) * 1.5);
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

/**
 * AI piece: decides WHERE to move among its own legal moves.
 * Greedy with a little noise: likes captures, checks and promotion,
 * dislikes stepping onto attacked squares.
 */
export function pieceChooseMoveAI(chess: Chess, square: string): Move {
  const moves = legalMovesFor(chess, square);
  let best: Move = moves[0];
  let bestScore = -Infinity;
  for (const m of moves) {
    let score = Math.random() * 1.5;
    if (m.captured) score += PIECE_VALUES[m.captured as PieceType] * 3;
    if (m.promotion) score += 8;
    const probe = new Chess(chess.fen());
    probe.move({ from: m.from, to: m.to, promotion: m.promotion || "q" });
    if (probe.isCheckmate()) score += 1000;
    else if (probe.isCheck()) score += 2;
    if (probe.isAttacked(m.to, m.color === "w" ? "b" : "w")) {
      score -= PIECE_VALUES[m.piece as PieceType] * 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  return best;
}
