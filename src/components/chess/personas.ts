import type { PieceType } from "./engine";

/**
 * Coffeehouse personas for the camera-figures. One character per piece type:
 * the voice they speak with (ElevenLabs), the fallback pitch for browser TTS,
 * and the character sketch used to prompt the dialogue generator.
 */
export interface Persona {
  name: string;
  voiceId: string; // ElevenLabs premade voice
  pitch: number; // browser speechSynthesis fallback
  sketch: string; // for the LLM prompt
}

export const PERSONAS: Record<PieceType, Persona> = {
  p: {
    name: "the pawn",
    voiceId: "pFZP5JQG7iQjIQuC4Bku",
    pitch: 1.6,
    sketch:
      "Pawn: young, eager, slightly anxious. Desperate to be picked, dreams of promotion, quotes what some grandmaster allegedly said.",
  },
  n: {
    name: "the knight",
    voiceId: "TX3LPaxmHKxFdv7VOQHJ",
    pitch: 1.25,
    sketch:
      "Knight: the coffeehouse hustler. Loves tricks and forks, bets an imaginary schilling on everything, interrupts everyone mid-sentence.",
  },
  b: {
    name: "the bishop",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    pitch: 1.05,
    sketch:
      "Bishop: the know-it-all theoretician. Cites openings nobody asked about, corrects everyone's plans, sighs about declining standards.",
  },
  r: {
    name: "the rook",
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
    pitch: 0.85,
    sketch:
      "Rook: the old regular at the corner table. Nostalgic, tells rambling anecdotes about games long past, always orders another Einspänner.",
  },
  q: {
    name: "the queen",
    voiceId: "cgSgspJ2msm6clMCkdW9",
    pitch: 1.4,
    sketch:
      "Queen: dramatic prima donna. Everything is either brilliant or a catastrophe, takes any disagreement personally.",
  },
  k: {
    name: "the king",
    voiceId: "onwK4e9ZLuTAKqWW03F9",
    pitch: 0.65,
    sketch:
      "King: weary philosopher. Speaks slowly about responsibility and the impossibility of the right move; secretly just worried about himself.",
  },
};
