import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Chess } from "chess.js";
import { PERSONAS } from "@/components/chess/personas";
import type { PieceType } from "@/components/chess/engine";

export const maxDuration = 20;

// Coffeehouse chess: the figures in Democratic Chess talk the player's ear
// off. This route asks Claude to voice 4 of them — three pushing DIFFERENT
// moves against each other, one drifting off into coffeehouse small talk
// (sometimes about today's headlines). The point of the piece: it is hard to
// find the right move when everyone is talking you into a different one.
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
          square: {
            type: "string" as const,
            description: "Board square of the speaking figure, e.g. e2",
          },
          text: {
            type: "string" as const,
            description: "The figure's spoken line, max 22 words",
          },
        },
        required: ["square", "text"],
        additionalProperties: false,
      },
    },
  },
  required: ["tips"],
  additionalProperties: false,
};

/* ---------- daily headlines for the digressions, cached ~6h ---------- */

let headlineCache: { at: number; titles: string[] } = { at: 0, titles: [] };

async function getHeadlines(): Promise<string[]> {
  if (Date.now() - headlineCache.at < 6 * 3600_000) return headlineCache.titles;
  try {
    const res = await fetch("https://feeds.bbci.co.uk/news/world/rss.xml", {
      signal: AbortSignal.timeout(4000),
    });
    const xml = await res.text();
    const titles = [...xml.matchAll(/<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>/g)]
      .map((m) => m[1])
      .slice(0, 5);
    headlineCache = { at: Date.now(), titles };
  } catch {
    headlineCache = { at: Date.now(), titles: [] };
  }
  return headlineCache.titles;
}

/* ---------- route ---------- */

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
  if (
    !fen ||
    typeof fen !== "string" ||
    fen.length > 100 ||
    (mode !== "commander" && mode !== "piece")
  ) {
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
  const moveList = moves
    .map((m) => `${m.piece}@${m.from}->${m.to}${m.captured ? ` takes ${m.captured}` : ""}`)
    .join(", ");

  const task =
    mode === "commander"
      ? `The human is the ${turn} PLAYER and must choose WHICH figure moves (the figure itself decides where). The figures campaign to be picked or push a teammate forward.`
      : `The human is the ${turn} figure on ${excludeSquare} and must choose WHERE to move. The figures around the table shout destination squares at them.`;

  const personaList = (Object.keys(PERSONAS) as PieceType[])
    .map((t) => `- ${t}: ${PERSONAS[t].sketch}`)
    .join("\n");

  const headlines = await getHeadlines();
  const headlineBlock = headlines.length
    ? `\nToday's newspaper on the table (for the digression, if it fits): ${headlines.join(" · ")}`
    : "";

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system:
        "You voice the chess figures in Michael Marcovici's art installation 'Democratic Chess' — IP surveillance cameras on a chessboard, arguing like the regulars of an old Viennese coffeehouse (think Café Central: opinionated, nostalgic, theatrical, endlessly interrupting each other over a Melange). The heart of the piece: when everyone talks you into something different, the right move becomes almost impossible to see. In-character sketches by piece type:\n" +
        personaList,
      messages: [
        {
          role: "user",
          content: `Position (FEN): ${fen}\nIt is ${turn}'s turn. ${task}\nLegal moves: ${moveList}${headlineBlock}\n\nGive exactly 4 lines from four DIFFERENT ${turn} figures (identified by their current square${excludeSquare ? `, none of them ${excludeSquare}` : ""}), forming one overheard round of coffeehouse table talk:\n1. Confident concrete advice naming a real move from the legal list.\n2. A DIFFERENT figure contradicting line 1 and pushing a DIFFERENT real move.\n3. A third figure dismissing both and pushing yet another real move — or sowing doubt about all of them.\n4. A pure digression: coffeehouse small talk — the old days, the waiter, prices, or today's newspaper — only loosely (or ironically) connected to the game.\nEach line max 22 words, matching the speaker's persona. The three advices MUST name three different moves. Never agree with the previous speaker.`,
        },
      ],
      output_config: { format: { type: "json_schema", schema: TIPS_SCHEMA } },
    });

    const block = response.content.find((b) => b.type === "text");
    const parsed =
      block && "text" in block
        ? (JSON.parse(block.text) as { tips: { square: string; text: string }[] })
        : null;
    if (!parsed?.tips?.length) {
      return NextResponse.json({ tips: null, reason: "empty" }, { status: 200 });
    }
    // only keep tips from squares that actually hold a friendly piece
    const valid = parsed.tips.filter((t) => {
      try {
        const p = chess.get(t.square as Parameters<Chess["get"]>[0]);
        return !!p && p.color === chess.turn() && t.square !== excludeSquare && t.text.length <= 180;
      } catch {
        return false;
      }
    });
    return NextResponse.json({ tips: valid.slice(0, 4), source: "claude" });
  } catch (err) {
    console.error("chess-tips error", err);
    return NextResponse.json({ tips: null, reason: "api-error" }, { status: 200 });
  }
}
