import { Chess, type Move, type Square } from "chess.js";

export type Color = "w" | "b";

/* ---------- economy ---------- */

export const START_CASH = 1000;
export const TURN_INCOME = 40;
export const RENT_RATE = 0.25;
export const MAX_DEV = 3;

export interface Ownership {
  owner: Color;
  dev: number; // 0..MAX_DEV
}

export type Market = Record<string, Ownership>; // square -> ownership

export const PIECE_CASH_VALUE: Record<string, number> = {
  p: 60,
  n: 180,
  b: 180,
  r: 300,
  q: 550,
  k: 9999,
};

const FILES = "abcdefgh";

export function allSquares(): string[] {
  const out: string[] = [];
  for (let f = 0; f < 8; f++) for (let r = 1; r <= 8; r++) out.push(`${FILES[f]}${r}`);
  return out;
}

/** Ring distance from the board center: 0 = d4/d5/e4/e5, 3 = edge. */
export function ringOf(square: string): number {
  const f = square.charCodeAt(0) - 97;
  const r = Number(square[1]) - 1;
  return Math.max(Math.abs(f - 3.5), Math.abs(r - 3.5)) - 0.5;
}

export function basePrice(square: string): number {
  return [300, 200, 120, 80][ringOf(square)] ?? 80;
}

export function squareValue(square: string, own: Ownership): number {
  return Math.round(basePrice(square) * (1 + own.dev));
}

export function rentOf(square: string, own: Ownership): number {
  return Math.round(squareValue(square, own) * RENT_RATE);
}

export function devCost(square: string): number {
  return Math.round(basePrice(square) * 0.5);
}

/* ---------- deals ---------- */

export interface Deal {
  from: Color; // who pays
  amount: number;
  protectedSquare: string; // piece on this square may not be captured next move
}

/* ---------- chess AI (whole side, economy-aware) ---------- */

function attackerColor(c: Color): Color {
  return c === "w" ? "b" : "w";
}

export interface AiMoveContext {
  market: Market;
  cash: number;
  honorDeal: Deal | null; // a deal the AI accepted (protects a human piece)
  willHonor: boolean;
}

export function chooseMoveAI(chess: Chess, ctx: AiMoveContext): Move {
  const me = chess.turn();
  const moves = chess.moves({ verbose: true });
  let best: Move = moves[0];
  let bestScore = -Infinity;
  for (const m of moves) {
    let score = Math.random() * 20;
    if (m.captured) {
      const isProtected =
        ctx.honorDeal && ctx.willHonor && m.to === ctx.honorDeal.protectedSquare;
      if (isProtected) {
        score -= 10_000; // keep the promise (this time)
      } else {
        score += PIECE_CASH_VALUE[m.captured] * 1.2;
      }
    }
    if (m.promotion) score += 400;
    // rent we would pay on landing
    const own = ctx.market[m.to];
    if (own && own.owner !== me) {
      const rent = rentOf(m.to, own);
      score -= rent * (rent >= ctx.cash ? 30 : 1.5); // never walk into bankruptcy
    }
    const probe = new Chess(chess.fen());
    probe.move({ from: m.from, to: m.to, promotion: m.promotion || "q" });
    if (probe.isCheckmate()) score += 100_000;
    else if (probe.isCheck()) score += 60;
    if (probe.isAttacked(m.to, attackerColor(me))) {
      score -= PIECE_CASH_VALUE[m.piece] * 0.9;
    }
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  return best;
}

/* ---------- economic AI decisions ---------- */

export interface EconAction {
  kind: "buy" | "develop";
  square: string;
  cost: number;
}

/** Squares the opponent's pieces can currently move to — likely rent traffic. */
function trafficMap(chess: Chess, forColor: Color): Record<string, number> {
  const probe = new Chess(chess.fen());
  const traffic: Record<string, number> = {};
  // if it's not `forColor`'s opponent to move, flip the turn via a null-ish fen edit
  const fenParts = probe.fen().split(" ");
  fenParts[1] = forColor === "w" ? "b" : "w";
  fenParts[3] = "-"; // clear en passant to keep the fen valid
  let moves: Move[] = [];
  try {
    const p2 = new Chess(fenParts.join(" "));
    moves = p2.moves({ verbose: true });
  } catch {
    moves = [];
  }
  for (const m of moves) traffic[m.to] = (traffic[m.to] || 0) + 1;
  return traffic;
}

export function econActionAI(chess: Chess, me: Color, market: Market, cash: number): EconAction | null {
  const traffic = trafficMap(chess, me);
  // develop an owned high-traffic square
  let bestDev: EconAction | null = null;
  let bestDevScore = 0;
  for (const [sq, own] of Object.entries(market)) {
    if (own.owner !== me || own.dev >= MAX_DEV) continue;
    const cost = devCost(sq);
    if (cost > cash - 250) continue;
    const score = (traffic[sq] || 0.3) * basePrice(sq);
    if (score > bestDevScore) {
      bestDevScore = score;
      bestDev = { kind: "develop", square: sq, cost };
    }
  }
  // buy the best unowned square
  let bestBuy: EconAction | null = null;
  let bestBuyScore = 0;
  for (const sq of allSquares()) {
    if (market[sq]) continue;
    const cost = basePrice(sq);
    if (cost > cash - 300) continue;
    const score = ((traffic[sq] || 0) + 0.4) * (4 - ringOf(sq));
    if (score > bestBuyScore) {
      bestBuyScore = score;
      bestBuy = { kind: "buy", square: sq, cost };
    }
  }
  if (bestDev && bestDevScore >= bestBuyScore * 60) return bestDev;
  return bestBuy ?? bestDev;
}

/**
 * After the AI moved: does it want to offer the human money to spare one of
 * its pieces? Returns the offer, or null.
 */
export function aiOfferAI(chess: Chess, aiColor: Color, cash: number): Deal | null {
  if (chess.turn() === aiColor) return null; // it's the human's move now
  const human = chess.turn();
  const captures = chess.moves({ verbose: true }).filter((m) => m.captured);
  let worst: { square: string; value: number } | null = null;
  for (const m of captures) {
    const value = PIECE_CASH_VALUE[m.captured as string] || 0;
    const defended = new Chess(chess.fen());
    try {
      defended.move({ from: m.from, to: m.to, promotion: "q" });
    } catch {
      continue;
    }
    const recapture = defended.moves({ verbose: true }).some((r) => r.to === m.to && r.captured);
    const attackerValue = PIECE_CASH_VALUE[m.piece] || 0;
    const netLoss = recapture ? value - attackerValue : value;
    if (netLoss >= 180 && (!worst || netLoss > worst.value)) {
      worst = { square: m.to, value: netLoss };
    }
  }
  if (!worst) return null;
  const amount = Math.min(Math.round(worst.value * 0.4), Math.round(cash * 0.35));
  if (amount < 50) return null;
  return { from: aiColor, amount, protectedSquare: worst.square };
}

/** Should the AI accept the human's bribe to spare a piece? */
export function aiAcceptsBribe(chess: Chess, deal: Deal): boolean {
  // what would the AI gain by capturing the protected piece?
  const captures = chess
    .moves({ verbose: true })
    .filter((m) => m.captured && m.to === deal.protectedSquare);
  if (captures.length === 0) return deal.amount >= 40; // free money
  const piece = chess.get(deal.protectedSquare as Square);
  const gain = piece ? PIECE_CASH_VALUE[piece.type] : 0;
  return deal.amount >= Math.round(gain * 0.3);
}
