import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Chess } from "chess.js";

export const maxDuration = 20;

// The figures in Democratic Chess debate the moves. This route asks Claude to
// voice 2-3 of them with short in-character tips for the human player.
// Without ANTHROPIC_API_KEY the client falls back to locally generated tips.

const MODEL = process.env.CHESS_TIPS_MODEL || "claude-haiku-4-5";

const TIPS_SCHEMA = {
  type: "object" as const,
  properties: {
    tips: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          square: { type: "string" as const, description: "Board square of the speaking figure, e.g. e2" },
          text: { type: "string" as const, description: "The figure's spoken tip, max 14 words" },
        },
        required: ["square", "text"],
        additionalProperties: false,
      },
    },
  },
  required: ["tips"],
  additionalProperties: false,
};

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ tips: null, reason: "no-api-key" }, { status: 200 });
  }

  let body: { fen?: string; mode?: string; excludeSquare?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const { fen, mode, excludeSquare } = body;
  if (!fen || typeof fen !== "string" || fen.length > 100 || (mode !== "commander" && mode !== "piece")) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  let chess: Chess;
  try {
    chess = new Chess(fen);
  } catch {
    return NextResponse.json({ error: "invalid fen" }, { status: 400 });
  }

  const turn = chess.turn() === "w" ? "White" : "Black";
  const moves = chess.moves({ verbose: true });
  const moveList = moves.map((m) => `${m.piece}@${m.from}->${m.to}${m.captured ? ` takes ${m.captured}` : ""}`).join(", ");

  const task =
    mode === "commander"
      ? `The human is the ${turn} PLAYER and must choose WHICH figure moves (the figure itself decides where). The figures campaign to be picked or point at a teammate.`
      : `The human is the ${turn} figure on ${excludeSquare} and must choose WHERE to move. Nearby allied figures shout advice about concrete destination squares.`;

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system:
        "You voice the chess figures in Michael Marcovici's art installation 'Democratic Chess' — IP surveillance cameras standing on a chessboard, debating their moves democratically. They are opinionated, a bit dramatic, sometimes bickering, always brief.",
      messages: [
        {
          role: "user",
          content: `Position (FEN): ${fen}\nIt is ${turn}'s turn. ${task}\nLegal moves: ${moveList}\n\nGive exactly 3 tips from three DIFFERENT ${turn} figures (identified by their current square${excludeSquare ? `, none of them ${excludeSquare}` : ""}). Each tip max 14 words, in character, referencing real squares or moves from the legal list. Mix good advice with personality — one figure may disagree with another.`,
        },
      ],
      output_config: { format: { type: "json_schema", schema: TIPS_SCHEMA } },
    });

    const block = response.content.find((b) => b.type === "text");
    const parsed = block && "text" in block ? (JSON.parse(block.text) as { tips: { square: string; text: string }[] }) : null;
    if (!parsed?.tips?.length) {
      return NextResponse.json({ tips: null, reason: "empty" }, { status: 200 });
    }
    // only keep tips from squares that actually hold a friendly piece
    const valid = parsed.tips.filter((t) => {
      try {
        const p = chess.get(t.square as Parameters<Chess["get"]>[0]);
        return !!p && p.color === chess.turn() && t.square !== excludeSquare && t.text.length <= 140;
      } catch {
        return false;
      }
    });
    return NextResponse.json({ tips: valid.slice(0, 3), source: "claude" });
  } catch (err) {
    console.error("chess-tips error", err);
    return NextResponse.json({ tips: null, reason: "api-error" }, { status: 200 });
  }
}
