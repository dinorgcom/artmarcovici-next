import { Chess, type Square } from "chess.js";
import { PIECE_NAMES, type PieceType } from "./engine";

export interface Tip {
  square: string;
  text: string;
}

export type TipMode = "commander" | "piece";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Local tip generator — used when the Claude API route is unavailable.
 * Grounded in the actual legal moves so the advice is always real.
 */
export function localTips(fen: string, mode: TipMode, excludeSquare?: string): Tip[] {
  const chess = new Chess(fen);
  const turn = chess.turn();
  const allies: { square: string; type: PieceType }[] = [];
  for (const row of chess.board()) {
    for (const cell of row) {
      if (cell && cell.color === turn && cell.square !== excludeSquare) {
        allies.push({ square: cell.square, type: cell.type as PieceType });
      }
    }
  }
  if (allies.length === 0) return [];
  const speakers = [...allies].sort(() => Math.random() - 0.5).slice(0, 3);
  const tips: Tip[] = [];

  if (mode === "piece" && excludeSquare) {
    const moves = chess.moves({ square: excludeSquare as Square, verbose: true });
    if (moves.length === 0) return [];
    const captures = moves.filter((m) => m.captured);
    const lines: string[] = [];
    if (captures.length > 0) {
      const c = pick(captures);
      lines.push(`Take the ${PIECE_NAMES[c.captured as PieceType]} on ${c.to}!`);
    }
    const m1 = pick(moves);
    lines.push(pick([
      `${m1.to} looks good from here.`,
      `I'd go to ${m1.to} if I were you.`,
      `Careful — but ${m1.to} seems safe.`,
    ]));
    const m2 = pick(moves);
    lines.push(pick([
      `Don't listen to them. ${m2.to}!`,
      `We voted for ${m2.to}. Well, some of us.`,
      `Whatever you do, do it with conviction.`,
    ]));
    speakers.forEach((s, i) => {
      if (lines[i]) tips.push({ square: s.square, text: lines[i] });
    });
  } else {
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return [];
    const captures = moves.filter((m) => m.captured);
    const suggested = captures.length > 0 ? pick(captures) : pick(moves);
    tips.push({
      square: pick(allies).square,
      text: `Send the ${PIECE_NAMES[suggested.piece as PieceType]} on ${suggested.from}!`,
    });
    const self = pick(allies.filter((a) => chess.moves({ square: a.square as Square, verbose: true }).length > 0));
    if (self) {
      tips.push({ square: self.square, text: pick([
        "Pick me! I have a plan.",
        "I've been watching them. Let me go.",
        "My lens sees everything from here. Choose me.",
      ]) });
    }
    const grump = pick(allies);
    tips.push({ square: grump.square, text: pick([
      "This is not a democracy anymore…",
      "Take your time. We're only standing here.",
      "Whoever goes — no heroics, please.",
    ]) });
  }

  // one tip per distinct speaker
  const seen = new Set<string>();
  return tips.filter((t) => (seen.has(t.square) ? false : (seen.add(t.square), true))).slice(0, 3);
}

/** Fetch tips from the Claude-backed API route; fall back to local generation. */
export async function getTips(fen: string, mode: TipMode, excludeSquare?: string): Promise<Tip[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    const res = await fetch("/api/chess-tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fen, mode, excludeSquare }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = (await res.json()) as { tips: Tip[] | null };
      if (data.tips && data.tips.length > 0) return data.tips;
    }
  } catch {
    // fall through to local tips
  }
  return localTips(fen, mode, excludeSquare);
}

/* ---------- speech: each figure gets its own voice pitch ---------- */

const PITCH: Record<PieceType, number> = { p: 1.6, n: 1.25, b: 1.05, r: 0.85, q: 1.4, k: 0.65 };

export function speakTips(tips: Tip[], typeOf: (square: string) => PieceType | null) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  tips.forEach((tip, i) => {
    const u = new SpeechSynthesisUtterance(tip.text);
    const type = typeOf(tip.square) ?? "p";
    u.pitch = PITCH[type];
    u.rate = 1.05;
    u.volume = 0.9;
    u.lang = "en-US";
    setTimeout(() => window.speechSynthesis.speak(u), i * 300);
  });
}

export function stopSpeech() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
