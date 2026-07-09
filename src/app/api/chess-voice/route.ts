import { NextResponse } from "next/server";
import { PERSONAS } from "@/components/chess/personas";
import type { PieceType } from "@/components/chess/engine";

export const maxDuration = 20;

// Voices the Democratic Chess figures via ElevenLabs. Each piece type has its
// own premade voice (see personas.ts). Without ELEVENLABS_API_KEY — or with
// ELEVENLABS_CHESS_DISABLED=1 as a cost kill switch — the client falls back
// to browser speech synthesis.

const MODEL_ID = process.env.ELEVENLABS_CHESS_MODEL || "eleven_flash_v2_5";
const MAX_CHARS = 220;

const PIECE_TYPES = new Set(["p", "n", "b", "r", "q", "k"]);

export async function POST(request: Request) {
  if (!process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_CHESS_DISABLED === "1") {
    return NextResponse.json({ reason: "voice-disabled" }, { status: 503 });
  }

  let body: { text?: string; piece?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const { text, piece } = body;
  if (
    !text ||
    typeof text !== "string" ||
    text.length > MAX_CHARS ||
    !piece ||
    !PIECE_TYPES.has(piece)
  ) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const persona = PERSONAS[piece as PieceType];
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${persona.voiceId}?output_format=mp3_22050_32`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: { stability: 0.4, similarity_boost: 0.7 },
        }),
      }
    );
    if (!res.ok) {
      // quota exceeded, invalid key, … — client falls back to browser TTS
      return NextResponse.json({ reason: `elevenlabs-${res.status}` }, { status: 503 });
    }
    const audio = await res.arrayBuffer();
    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ reason: "network" }, { status: 503 });
  }
}
