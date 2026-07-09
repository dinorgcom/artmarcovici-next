import { Chess, type Square } from "chess.js";
import { PIECE_NAMES, type PieceType } from "./engine";
import { PERSONAS } from "./personas";

export interface Tip {
  square: string;
  text: string;
}

export type TipMode = "commander" | "piece";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ---------- local coffeehouse fallback ---------- */

const DIGRESSIONS = [
  "Herr Ober, another Einspänner! Thinking is thirsty work.",
  "In my day we thought three hours about one move. Wonderful times.",
  "Have you read the paper today? The world plays worse than we do.",
  "The coffee here gets weaker every year, I swear it.",
  "Capablanca would have moved already. Just saying.",
  "My cousin at the Café Central saw this exact position in 1962.",
  "Whatever you do, the kibitzers will say it was wrong.",
  "Prices, politics, pawn structures — everything worse than before.",
  "Quiet please! No — actually, keep arguing. It passes the time.",
  "A newspaper, a Melange, and a lost position. Life is complete.",
];

const DOUBTS = [
  "Nonsense, both of you. Nothing works here — think first, move never.",
  "I've heard three plans and believe none of them.",
  "They all sound so sure. That's how we lost the last game.",
  "Advice is cheap at this table. Losing is expensive.",
];

/**
 * Local tip generator — used when the Claude API route is unavailable.
 * Grounded in the actual legal moves so the advice is always real.
 * Three voices pushing different moves, one drifting off — coffeehouse chess.
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
  const speakers = [...allies].sort(() => Math.random() - 0.5);
  const tips: Tip[] = [];
  const say = (text: string) => {
    const s = speakers[tips.length];
    if (s) tips.push({ square: s.square, text });
  };

  if (mode === "piece" && excludeSquare) {
    const moves = chess.moves({ square: excludeSquare as Square, verbose: true });
    if (moves.length === 0) return [];
    const distinct = [...moves].sort(() => Math.random() - 0.5).slice(0, 3);
    const captures = moves.filter((m) => m.captured);
    if (captures.length > 0) {
      const c = pick(captures);
      say(`Take the ${PIECE_NAMES[c.captured as PieceType]} on ${c.to}! It's sitting right there!`);
    } else {
      say(`${distinct[0].to}. Trust me, I see the whole board from here.`);
    }
    if (distinct[1]) {
      say(pick([
        `Don't listen to that. ${distinct[1].to} — obviously ${distinct[1].to}.`,
        `${distinct[1].to}, and I'll bet a schilling on it.`,
        `Wrong table, wrong advice. ${distinct[1].to} is the move.`,
      ]));
    }
    if (distinct[2]) {
      say(pick([
        `Both blind! ${distinct[2].to} — Capablanca himself would play ${distinct[2].to}.`,
        pick(DOUBTS),
      ]));
    } else {
      say(pick(DOUBTS));
    }
    say(pick(DIGRESSIONS));
  } else {
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return [];
    const distinct = [...moves].sort(() => Math.random() - 0.5).slice(0, 3);
    const captures = moves.filter((m) => m.captured);
    const first = captures.length > 0 ? pick(captures) : distinct[0];
    say(`Send the ${PIECE_NAMES[first.piece as PieceType]} on ${first.from}! Now, before the coffee gets cold!`);
    if (distinct[1]) {
      say(pick([
        `Madness. The ${PIECE_NAMES[distinct[1].piece as PieceType]} on ${distinct[1].from} — anyone can see that.`,
        `No no no. ${PIECE_NAMES[distinct[1].piece as PieceType]}, ${distinct[1].from}. I've been watching all game.`,
      ]));
    }
    if (distinct[2]) {
      say(pick([
        `You're both wrong, as usual. The ${PIECE_NAMES[distinct[2].piece as PieceType]} on ${distinct[2].from}, nothing else.`,
        pick(DOUBTS),
      ]));
    } else {
      say(pick(DOUBTS));
    }
    say(pick(DIGRESSIONS));
  }

  // one tip per distinct speaker
  const seen = new Set<string>();
  return tips
    .filter((t) => (seen.has(t.square) ? false : (seen.add(t.square), true)))
    .slice(0, 4);
}

/** Fetch tips from the Claude-backed API route; fall back to local generation. */
export async function getTips(fen: string, mode: TipMode, excludeSquare?: string): Promise<Tip[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
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

/* ---------- speech: ElevenLabs voices, browser TTS as fallback ---------- */

let speechGeneration = 0;
let currentAudio: HTMLAudioElement | null = null;
let voiceRouteBroken = false; // remember quota/key failures for this session

async function fetchVoice(text: string, piece: PieceType): Promise<string | null> {
  if (voiceRouteBroken) return null;
  try {
    const res = await fetch("/api/chess-voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, piece }),
    });
    if (!res.ok) {
      if (res.status === 503) voiceRouteBroken = true;
      return null;
    }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

function speakFallback(text: string, type: PieceType): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = PERSONAS[type].pitch;
    u.rate = 1.05;
    u.volume = 0.9;
    u.lang = "en-US";
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

function playUrl(url: string): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.play().catch(() => resolve());
  });
}

/**
 * Speak the round of table talk one figure after the other — a proper
 * coffeehouse argument, not a chorus. ElevenLabs voices per piece type;
 * browser speech synthesis when the voice route is unavailable.
 */
export function speakTips(tips: Tip[], typeOf: (square: string) => PieceType | null) {
  if (typeof window === "undefined") return;
  const generation = ++speechGeneration;
  stopPlayback();

  (async () => {
    // prefetch all voices in parallel so the argument flows without gaps
    const prepared = await Promise.all(
      tips.map(async (tip) => {
        const type = typeOf(tip.square) ?? "p";
        return { tip, type, url: await fetchVoice(tip.text, type) };
      })
    );
    for (const { tip, type, url } of prepared) {
      if (generation !== speechGeneration) {
        if (url) URL.revokeObjectURL(url);
        continue;
      }
      if (url) await playUrl(url);
      else await speakFallback(tip.text, type);
      await new Promise((r) => setTimeout(r, 350));
    }
  })();
}

function stopPlayback() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function stopSpeech() {
  speechGeneration++;
  stopPlayback();
}
