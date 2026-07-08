import { Chess, type Move } from "chess.js";

export type Color = "w" | "b";

/* ---------- constants (all costs are shown to the players) ---------- */

export const START_CASH = 2500;
export const MOVE_COST = 100;
export const EXPLORE_COST = 300;
export const DEV_COST = 250;
export const MAX_DEV = 3;
export const TOLL_BASE = 100;
export const TOLL_PER_DEV = 250;
export const PASSIVE_PER_DEV = 25;

/** The hidden treasure distribution: 32×0, 16×250, 8×500, 4×1000, 2×2500, 1×5000, 1×10000. */
export const FIND_DISTRIBUTION: { value: number; count: number }[] = [
  { value: 0, count: 32 },
  { value: 250, count: 16 },
  { value: 500, count: 8 },
  { value: 1000, count: 4 },
  { value: 2500, count: 2 },
  { value: 5000, count: 1 },
  { value: 10000, count: 1 },
];

const FILES = "abcdefgh";

export function allSquares(): string[] {
  const out: string[] = [];
  for (let f = 0; f < 8; f++) for (let r = 1; r <= 8; r++) out.push(`${FILES[f]}${r}`);
  return out;
}

/** Shuffle the 64 finds onto the squares. */
export function dealFinds(): Record<string, number> {
  const values: number[] = [];
  for (const { value, count } of FIND_DISTRIBUTION) {
    for (let i = 0; i < count; i++) values.push(value);
  }
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  const map: Record<string, number> = {};
  allSquares().forEach((sq, i) => (map[sq] = values[i]));
  return map;
}

export interface Claim {
  owner: Color;
  find: number; // the revealed one-time treasure
  dev: number; // 0..MAX_DEV
}

export type Claims = Record<string, Claim>; // only explored squares

export function tollOf(claim: Claim): number {
  return TOLL_BASE + TOLL_PER_DEV * claim.dev;
}

export function passiveIncome(claims: Claims, color: Color): number {
  let dev = 0;
  for (const c of Object.values(claims)) if (c.owner === color) dev += c.dev;
  return dev * PASSIVE_PER_DEV;
}

/** Expected value of exploring right now, given what has been found so far. */
export function explorationEV(claims: Claims): number {
  const remaining: Record<number, number> = {};
  for (const { value, count } of FIND_DISTRIBUTION) remaining[value] = count;
  for (const c of Object.values(claims)) remaining[c.find] = (remaining[c.find] ?? 0) - 1;
  let total = 0;
  let n = 0;
  for (const [v, count] of Object.entries(remaining)) {
    total += Number(v) * Math.max(0, count);
    n += Math.max(0, count);
  }
  return n === 0 ? 0 : Math.round(total / n);
}

export function remainingFinds(claims: Claims): { value: number; left: number; total: number }[] {
  return FIND_DISTRIBUTION.map(({ value, count }) => ({
    value,
    total: count,
    left: count - Object.values(claims).filter((c) => c.find === value).length,
  }));
}

/* ---------- AI ---------- */

const PIECE_CASH_VALUE: Record<string, number> = {
  p: 150,
  n: 450,
  b: 450,
  r: 750,
  q: 1300,
  k: 99999,
};

export function chooseMoveAI(chess: Chess, claims: Claims, cash: number): Move {
  const me = chess.turn();
  const enemy: Color = me === "w" ? "b" : "w";
  const moves = chess.moves({ verbose: true });
  let best: Move = moves[0];
  let bestScore = -Infinity;
  for (const m of moves) {
    let score = Math.random() * 30;
    if (m.captured) score += PIECE_CASH_VALUE[m.captured] * 1.1;
    if (m.promotion) score += 800;
    const claim = claims[m.to];
    if (claim && claim.owner === enemy) {
      const toll = tollOf(claim);
      score -= toll * (toll >= cash - MOVE_COST ? 40 : 1.6);
    }
    if (!claim && cash > EXPLORE_COST + 500) {
      score += Math.min(explorationEV(claims) * 0.35, 250); // treasure hunting
    }
    const probe = new Chess(chess.fen());
    probe.move({ from: m.from, to: m.to, promotion: m.promotion || "q" });
    if (probe.isCheckmate()) score += 1_000_000;
    else if (probe.isCheck()) score += 120;
    if (probe.isAttacked(m.to, enemy)) score -= PIECE_CASH_VALUE[m.piece] * 0.9;
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  return best;
}

export function aiWantsExplore(claims: Claims, cash: number): boolean {
  if (cash < EXPLORE_COST + 400) return false;
  return explorationEV(claims) > EXPLORE_COST * 0.55 || cash > 2000;
}

/** Pick a square the AI should develop, or null. */
export function aiDevelopAI(chess: Chess, claims: Claims, cash: number, me: Color): string | null {
  if (cash < DEV_COST + 700) return null;
  // develop own squares that enemy pieces can currently reach
  const fen = chess.fen().split(" ");
  fen[1] = me === "w" ? "b" : "w";
  fen[3] = "-";
  let enemyTargets = new Set<string>();
  try {
    enemyTargets = new Set(new Chess(fen.join(" ")).moves({ verbose: true }).map((m) => m.to));
  } catch {
    /* keep empty */
  }
  let best: string | null = null;
  let bestScore = 0;
  for (const [sq, c] of Object.entries(claims)) {
    if (c.owner !== me || c.dev >= MAX_DEV) continue;
    const score = (enemyTargets.has(sq) ? 3 : 1) + c.dev * 0.2;
    if (score > bestScore) {
      bestScore = score;
      best = sq;
    }
  }
  return bestScore >= 3 || cash > 2500 ? best : null;
}
