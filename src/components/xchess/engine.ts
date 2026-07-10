import { Chess, type Move } from "chess.js";

export type Color = "w" | "b";

/* ---------- constants (all costs are shown to the players) ---------- */

export const START_CASH = 2500;
export const MOVE_COST = 100;
export const EXPLORE_COST = 300;
export const MAX_DEV = 3;
/** Toll by development level — steep, so developed squares block early. */
export const TOLL_BY_DEV = [100, 500, 1500, 4000];
/** Cost of developing FROM level i to i+1. */
export const DEV_COSTS = [250, 500, 1000];
export const PASSIVE_PER_DEV = 25;

/**
 * The hidden resource distribution — each value is RECURRING income the owner
 * collects every round: 32×0, 16×$50, 8×$100, 4×$250, 2×$500, 1×$1000, 1×$2500.
 */
export const FIND_DISTRIBUTION: { value: number; count: number }[] = [
  { value: 0, count: 32 },
  { value: 50, count: 16 },
  { value: 100, count: 8 },
  { value: 250, count: 4 },
  { value: 500, count: 2 },
  { value: 1000, count: 1 },
  { value: 2500, count: 1 },
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
  find: number; // the revealed recurring resource
  dev: number; // 0..MAX_DEV
}

export type Claims = Record<string, Claim>; // only explored squares

export function tollOf(claim: Claim): number {
  return TOLL_BY_DEV[claim.dev];
}

/** Cost of the next development level for this claim (Infinity when maxed). */
export function devCostOf(claim: Claim): number {
  return DEV_COSTS[claim.dev] ?? Infinity;
}

/* ---------- transit tolls: enemy squares tax the squares you slide across ---------- */

/** Squares strictly between from and to on a straight or diagonal line (knights jump: empty). */
export function pathSquares(from: string, to: string): string[] {
  const f0 = FILES.indexOf(from[0]);
  const r0 = Number(from[1]);
  const f1 = FILES.indexOf(to[0]);
  const r1 = Number(to[1]);
  const adf = Math.abs(f1 - f0);
  const adr = Math.abs(r1 - r0);
  const straight = (f0 === f1 && r0 !== r1) || (r0 === r1 && f0 !== f1);
  const diagonal = adf === adr && adf > 0;
  if (!straight && !diagonal) return [];
  const df = Math.sign(f1 - f0);
  const dr = Math.sign(r1 - r0);
  const out: string[] = [];
  let f = f0 + df;
  let r = r0 + dr;
  while (f !== f1 || r !== r1) {
    out.push(`${FILES[f]}${r}`);
    f += df;
    r += dr;
  }
  return out;
}

export interface TollItem {
  square: string;
  toll: number;
  transit: boolean; // true = crossed, false = landed on
}

/** Every enemy claim this move pays toll to — crossed squares and the landing square. */
export function moveTolls(mv: { from: string; to: string }, claims: Claims, enemy: Color): TollItem[] {
  const items: TollItem[] = [];
  for (const sq of pathSquares(mv.from, mv.to)) {
    const c = claims[sq];
    if (c && c.owner === enemy) items.push({ square: sq, toll: tollOf(c), transit: true });
  }
  const dst = claims[mv.to];
  if (dst && dst.owner === enemy) items.push({ square: mv.to, toll: tollOf(dst), transit: false });
  return items;
}

export function moveTollTotal(mv: { from: string; to: string }, claims: Claims, enemy: Color): number {
  return moveTolls(mv, claims, enemy).reduce((sum, t) => sum + t.toll, 0);
}

/** Full price of a move: move cost plus all tolls due. */
export function moveCostOf(mv: { from: string; to: string }, claims: Claims, enemy: Color): number {
  return MOVE_COST + moveTollTotal(mv, claims, enemy);
}

/** Is there any legal move this player can pay for? (false = economic checkmate) */
export function hasAffordableMove(chess: Chess, claims: Claims, cash: number, color: Color): boolean {
  if (chess.turn() !== color) return true;
  const enemy: Color = color === "w" ? "b" : "w";
  return chess.moves({ verbose: true }).some((m) => moveCostOf(m, claims, enemy) <= cash);
}

/** Per-round income: every owned claim pays its find, plus $25 per development level. */
export function passiveIncome(claims: Claims, color: Color): number {
  let total = 0;
  for (const c of Object.values(claims)) {
    if (c.owner === color) total += c.find + c.dev * PASSIVE_PER_DEV;
  }
  return total;
}

/** Expected per-round yield of exploring right now, given what has been found so far. */
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

/** Best affordable move, or null when every legal move is too expensive (economic checkmate). */
export function chooseMoveAI(chess: Chess, claims: Claims, cash: number): Move | null {
  const me = chess.turn();
  const enemy: Color = me === "w" ? "b" : "w";
  const moves = chess.moves({ verbose: true });
  let best: Move | null = null;
  let bestScore = -Infinity;
  for (const m of moves) {
    const tollTotal = moveTollTotal(m, claims, enemy);
    if (MOVE_COST + tollTotal > cash) continue; // cannot pay — blocked
    let score = Math.random() * 30;
    if (m.captured) score += PIECE_CASH_VALUE[m.captured] * 1.1;
    if (m.promotion) score += 800;
    // tolls hurt — badly, when they eat a big share of the war chest
    score -= tollTotal * (tollTotal >= cash * 0.4 ? 4 : 1.6);
    if (!claims[m.to] && cash > EXPLORE_COST + 500) {
      score += Math.min(explorationEV(claims) * 4, 350); // recurring income is worth chasing
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
  // a recurring find pays for many rounds — explore when the 8-round EV beats the cost
  return explorationEV(claims) * 8 > EXPLORE_COST || cash > 2000;
}

/** Pick a square the AI should develop, or null. */
export function aiDevelopAI(chess: Chess, claims: Claims, cash: number, me: Color): string | null {
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
    if (cash < devCostOf(c) + 700) continue; // keep a war chest
    const score = (enemyTargets.has(sq) ? 3 : 1) + c.dev * 0.5;
    if (score > bestScore) {
      bestScore = score;
      best = sq;
    }
  }
  return bestScore >= 3 || cash > 2500 ? best : null;
}
