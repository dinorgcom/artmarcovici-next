"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Chess, type Move, type Square } from "chess.js";
import ChessScene, { type ViewMode } from "./Scene";
import { getTips, speakTips, stopSpeech, type Tip } from "./tips";
import { setSlideMuted } from "./slideSound";
import {
  applyMoveToPieces,
  buildInitialPieces,
  commanderPickAI,
  legalMovesFor,
  movablePieces,
  pieceChooseMoveAI,
  PIECE_NAMES,
  PIECE_SYMBOLS,
  type Color,
  type PieceState,
  type Role,
} from "./engine";

type Phase = "role" | "commander" | "piece" | "over";

interface LogEntry {
  id: number;
  text: string;
  color?: Color;
}

const colorName = (c: Color) => (c === "w" ? "White" : "Black");

function describePiece(p: PieceState) {
  return `${PIECE_NAMES[p.type]} ${p.initialSquare}`;
}

export default function Game() {
  const chessRef = useRef(new Chess());
  const [pieces, setPieces] = useState<PieceState[]>(() => buildInitialPieces(chessRef.current));
  const [phase, setPhase] = useState<Phase>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [captured, setCaptured] = useState(false);
  const [spectating, setSpectating] = useState(false);
  const [subtitle, setSubtitle] = useState<Tip | null>(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const tipsKey = useRef<string | null>(null);
  const subtitleRound = useRef(0);
  const logId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pushLog = useCallback((text: string, color?: Color) => {
    setLog((l) => [...l.slice(-60), { id: logId.current++, text, color }]);
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const humanPieceId = role?.kind === "piece" ? role.pieceId : null;
  const humanColor = role?.kind === "player" ? role.color : null;
  const turn: Color = chessRef.current.turn();

  const humanPiece = useMemo(
    () => (humanPieceId ? pieces.find((p) => p.id === humanPieceId) ?? null : null),
    [pieces, humanPieceId]
  );

  /* ---------- executing a move ---------- */

  const executeMove = useCallback(
    (moverId: string, mv: { from: string; to: string; promotion?: string }) => {
      const chess = chessRef.current;
      const mover = pieces.find((p) => p.id === moverId);
      const m: Move = chess.move({
        from: mv.from as Square,
        to: mv.to as Square,
        promotion: (mv.promotion as "q" | "r" | "b" | "n") || "q",
      });
      const next = applyMoveToPieces(pieces, m);
      setPieces(next);
      setSelectedPieceId(null);
      // the table talk deliberately keeps running through the move —
      // coffeehouse regulars don't stop mid-sentence just because someone plays

      if (mover) {
        let line = `${describePiece(mover)}: "${m.san}"`;
        if (m.captured) line += ` — captures on ${m.to}!`;
        pushLog(line, m.color);
      }
      if (humanPieceId) {
        const me = next.find((p) => p.id === humanPieceId);
        if (me && me.square === null && !captured) {
          setCaptured(true);
          pushLog("You have been taken off the board.", undefined);
        }
      }

      if (chess.isGameOver()) {
        let r: string;
        if (chess.isCheckmate()) r = `Checkmate — ${colorName(m.color)} wins.`;
        else if (chess.isStalemate()) r = "Stalemate — draw.";
        else if (chess.isThreefoldRepetition()) r = "Draw by repetition.";
        else if (chess.isInsufficientMaterial()) r = "Draw — insufficient material.";
        else r = "Draw.";
        setResult(r);
        setPhase("over");
        pushLog(r);
        return;
      }
      if (chess.isCheck()) pushLog(`${colorName(chess.turn())} is in check.`, chess.turn());
      setPhase("commander");
    },
    [pieces, humanPieceId, captured, pushLog]
  );

  /* ---------- phase driver: AI commander & AI pieces ---------- */

  useEffect(() => {
    const chess = chessRef.current;
    if (phase === "commander") {
      if (humanColor === turn) return; // human commander picks via click
      later(() => {
        const pick = commanderPickAI(chess, pieces, humanPieceId);
        setSelectedPieceId(pick.id);
        pushLog(`${colorName(turn)} player: "${describePiece(pick)}, your move."`, turn);
        setPhase("piece");
      }, 900);
    } else if (phase === "piece" && selectedPieceId) {
      const piece = pieces.find((p) => p.id === selectedPieceId);
      if (!piece || piece.square === null) return;
      if (humanPieceId === selectedPieceId) return; // human piece decides via click
      later(() => {
        const mv = pieceChooseMoveAI(chess, piece.square as string);
        executeMove(piece.id, mv);
      }, 1100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, selectedPieceId]);

  /* ---------- human interactions ---------- */

  const selectablePieceIds = useMemo(() => {
    if (phase !== "commander" || humanColor !== turn) return [];
    return movablePieces(chessRef.current, pieces).map((p) => p.id);
  }, [phase, humanColor, turn, pieces]);

  const onPiecePick = useCallback(
    (id: string) => {
      const piece = pieces.find((p) => p.id === id);
      if (!piece || piece.square === null) return;
      setSelectedPieceId(id);
      pushLog(`You: "${describePiece(piece)}, your move."`, turn);
      setPhase("piece");
    },
    [pieces, turn, pushLog]
  );

  const targetSquares = useMemo(() => {
    if (phase !== "piece" || !selectedPieceId || selectedPieceId !== humanPieceId) return [];
    const piece = pieces.find((p) => p.id === selectedPieceId);
    if (!piece || piece.square === null) return [];
    return [...new Set(legalMovesFor(chessRef.current, piece.square).map((m) => m.to as string))];
  }, [phase, selectedPieceId, humanPieceId, pieces]);

  const onSquarePick = useCallback(
    (square: string) => {
      if (!humanPiece || humanPiece.square === null) return;
      executeMove(humanPiece.id, { from: humanPiece.square, to: square });
    },
    [humanPiece, executeMove]
  );

  /* ---------- role selection / restart ---------- */

  const startAs = useCallback(
    (r: Role) => {
      setRole(r);
      setPhase("commander");
      if (r.kind === "player") {
        pushLog(`You are the ${colorName(r.color)} player. You decide WHO moves — never where.`);
      } else {
        const p = pieces.find((x) => x.id === r.pieceId)!;
        pushLog(
          `You are the ${colorName(p.color)} ${describePiece(p)}. Wait until your player calls on you — then decide your own move.`
        );
      }
    },
    [pieces, pushLog]
  );

  const restart = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    stopSpeech();
    setSubtitle(null);
    tipsKey.current = null;
    chessRef.current = new Chess();
    setPieces(buildInitialPieces(chessRef.current));
    setPhase("role");
    setRole(null);
    setSelectedPieceId(null);
    setLog([]);
    setResult(null);
    setCaptured(false);
    setSpectating(false);
  }, []);

  /* ---------- view ---------- */

  const view: ViewMode = useMemo(() => {
    if (phase === "role" || spectating || phase === "over") return { kind: "orbit" };
    if (role?.kind === "player") return { kind: "commander", color: role.color };
    if (role?.kind === "piece") {
      if (captured) return { kind: "orbit" };
      return { kind: "firstPerson", pieceId: role.pieceId };
    }
    return { kind: "orbit" };
  }, [phase, role, captured, spectating]);

  const selectedPiece = selectedPieceId ? pieces.find((p) => p.id === selectedPieceId) : null;

  const statusText = useMemo(() => {
    if (phase === "over") return result ?? "Game over.";
    if (captured) return "You were captured — spectating from above.";
    if (phase === "commander") {
      if (humanColor === turn) return "Your move as player: choose WHICH piece moves.";
      return `${colorName(turn)} player is choosing a piece…`;
    }
    if (phase === "piece" && selectedPiece) {
      if (selectedPiece.id === humanPieceId)
        return "You have been called! Look around (drag) and click a glowing square.";
      return `${describePiece(selectedPiece)} is deciding its move…`;
    }
    return "";
  }, [phase, result, captured, humanColor, turn, selectedPiece, humanPieceId]);

  const prompt = useMemo(() => {
    if (phase === "commander" && humanColor === turn)
      return { title: "YOUR MOVE", sub: "choose which figure moves — click a ringed figure" };
    if (phase === "piece" && selectedPieceId === humanPieceId && humanPieceId)
      return { title: "YOU ARE CALLED", sub: "drag to look around — click a glowing square" };
    return null;
  }, [phase, humanColor, turn, selectedPieceId, humanPieceId]);

  /* ---------- tips from the other figures when it's the human's turn ---------- */

  useEffect(() => {
    mutedRef.current = muted;
    setSlideMuted(muted);
    if (muted) stopSpeech();
  }, [muted]);

  useEffect(() => {
    if (!prompt) {
      // let the current round of talk finish on its own; only forget the key
      tipsKey.current = null;
      return;
    }
    const chess = chessRef.current;
    const mode = humanColor === turn && phase === "commander" ? "commander" : "piece";
    const key = `${mode}-${chess.history().length}`;
    if (tipsKey.current === key) return;
    tipsKey.current = key;

    let cancelled = false;
    const fen = chess.fen();
    const exclude = mode === "piece" ? humanPiece?.square ?? undefined : undefined;
    getTips(fen, mode, exclude).then((tips) => {
      if (cancelled || tipsKey.current !== key) return;
      subtitleRound.current++; // retire any earlier muted rotation
      tips.forEach((t) => pushLog(`${t.square}: "${t.text}"`, turn));
      if (!mutedRef.current) {
        const probe = new Chess(fen);
        speakTips(
          tips,
          (square) => {
            const p = probe.get(square as Square);
            return p ? p.type : null;
          },
          // unguarded: the round keeps talking (and subtitling) through moves;
          // speakTips' generation counter retires it when a new round starts
          (line) => setSubtitle(line)
        );
      } else {
        // muted: rotate the subtitles on a timer instead of following the voices.
        // Guarded by the round counter (not the tips key) so the rotation keeps
        // running through moves and only a newer round retires it.
        const round = subtitleRound.current;
        tips.forEach((t, i) =>
          later(() => {
            if (subtitleRound.current === round) setSubtitle(t);
          }, i * 4500)
        );
        later(() => {
          if (subtitleRound.current === round) setSubtitle(null);
        }, tips.length * 4500);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, phase, turn]);

  const subtitleSpeaker = useMemo(() => {
    if (!subtitle) return null;
    const piece = pieces.find((p) => p.square === subtitle.square);
    return piece ? `${PIECE_NAMES[piece.type]} ${subtitle.square}` : subtitle.square;
  }, [subtitle, pieces]);

  /* ---------- render ---------- */

  return (
    <div className="fixed inset-0 bg-black">
      <ChessScene
        pieces={pieces}
        view={view}
        selectablePieceIds={selectablePieceIds}
        selectedPieceId={selectedPieceId}
        targetSquares={targetSquares}
        onPiecePick={onPiecePick}
        onSquarePick={onSquarePick}
      />

      {/* film-style subtitle: who is talking right now */}
      {subtitle && (
        <div className="absolute inset-x-0 bottom-28 sm:bottom-20 flex justify-center px-4 pointer-events-none">
          <div className="relative max-w-xl text-center bg-black/65 backdrop-blur-sm rounded-lg pl-5 pr-9 py-3 border border-white/10 pointer-events-auto">
            <p className="text-[10px] uppercase tracking-widest text-accent mb-1">
              {subtitleSpeaker}
            </p>
            <p className="font-serif italic text-sm sm:text-base text-gray-100">
              “{subtitle.text}”
            </p>
            <button
              onClick={() => {
                subtitleRound.current++;
                stopSpeech();
                setSubtitle(null);
              }}
              title="Enough chatter"
              className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full text-gray-500 hover:text-accent hover:bg-white/5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* top bar */}
      <div className="absolute top-16 left-0 right-0 flex items-start justify-between gap-3 px-4 py-3 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <div className="pointer-events-auto shrink-0">
          <Link href="/work/democratic-chess" className="text-xs tracking-widest text-gray-500 hover:text-white transition-colors uppercase whitespace-nowrap">
            ← Democratic Chess
          </Link>
          <h1 className="hidden sm:block font-serif text-xl text-accent tracking-wider">DEMOCRATIC CHESS</h1>
        </div>
        {phase !== "role" && (
          <div className="text-right pointer-events-auto min-w-0">
            <p className="text-xs sm:text-sm text-gray-300">{statusText}</p>
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setMuted((m) => !m)}
                title={muted ? "Unmute figure voices" : "Mute figure voices"}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest transition-colors ${
                  muted
                    ? "border-white/10 text-gray-600 hover:border-white/30 hover:text-gray-300"
                    : "border-accent/40 text-accent hover:border-accent"
                }`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 9v6h3.5L14 19.5v-15L8.75 9h-3.5z"
                  />
                  {muted ? (
                    <path strokeLinecap="round" d="M17 9.5l4 5m0-5l-4 5" />
                  ) : (
                    <path strokeLinecap="round" d="M17.5 8.5a5 5 0 010 7M19.5 6.5a8 8 0 010 11" />
                  )}
                </svg>
                Sound
              </button>
              <button
                onClick={restart}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-gray-500 hover:border-white/30 hover:text-gray-300 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12a7.5 7.5 0 0113.05-5.1M19.5 12a7.5 7.5 0 01-13.05 5.1M17.55 3v3.9h-3.9M6.45 21v-3.9h3.9"
                  />
                </svg>
                Restart
              </button>
            </div>
          </div>
        )}
      </div>

      {/* prominent center prompt when it is the human's turn */}
      {prompt && (
        <div className="absolute inset-x-0 top-[24%] sm:top-[15%] flex justify-center pointer-events-none">
          <div className="text-center animate-pulse px-4">
            <p className="font-serif text-2xl sm:text-4xl md:text-6xl tracking-widest text-orange-400 drop-shadow-[0_0_18px_rgba(251,146,60,0.65)]">
              {prompt.title}
            </p>
            <p className="mt-2 text-xs sm:text-sm md:text-base uppercase tracking-widest text-orange-300/90 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]">
              {prompt.sub}
            </p>
          </div>
        </div>
      )}

      {/* dispatch log */}
      {phase !== "role" && (
        <div className="absolute bottom-4 left-4 w-80 max-w-[calc(100vw-2rem)] max-h-24 sm:max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-black/70 backdrop-blur-sm p-3 text-xs space-y-1">
          {log.slice(-14).map((e) => (
            <p
              key={e.id}
              className={
                e.color === "w" ? "text-gray-200" : e.color === "b" ? "text-gray-500" : "text-accent"
              }
            >
              {e.text}
            </p>
          ))}
        </div>
      )}

      {/* captured overlay */}
      {captured && phase !== "over" && !spectating && (
        <Overlay title="You have been captured">
          <p className="text-gray-400 mb-6">
            Your camera went dark. The game continues without you.
          </p>
          <div className="flex gap-3 justify-center">
            <OverlayButton onClick={() => setSpectating(true)}>Spectate</OverlayButton>
            <OverlayButton onClick={restart}>New game</OverlayButton>
          </div>
        </Overlay>
      )}

      {/* game over overlay */}
      {phase === "over" && (
        <Overlay title={result ?? "Game over"}>
          <div className="flex gap-3 justify-center">
            <OverlayButton onClick={restart}>Play again</OverlayButton>
          </div>
        </Overlay>
      )}

      {/* role selection */}
      {phase === "role" && <RoleSelect pieces={pieces} onStart={startAs} />}
    </div>
  );
}

/* ---------- small UI helpers ---------- */

function Overlay({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="text-center px-6 py-8 border border-white/10 rounded-xl bg-black/80 max-w-md">
        <h2 className="font-serif text-3xl text-accent mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function OverlayButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-black transition-all text-sm uppercase tracking-widest"
    >
      {children}
    </button>
  );
}

function RoleSelect({ pieces, onStart }: { pieces: PieceState[]; onStart: (r: Role) => void }) {
  const rows: { label: string; color: Color }[] = [
    { label: "White", color: "w" },
    { label: "Black", color: "b" },
  ];
  return (
    <div className="absolute inset-0 overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-accent tracking-wider mb-3">
          DEMOCRATIC CHESS
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-2">
          34 roles: two players and thirty-two camera-figures. The players only decide{" "}
          <span className="text-white">which</span> figure moves. The figure sees the board through
          its own camera and decides <span className="text-white">where</span> to go.
        </p>
        <p className="text-gray-600 text-sm mb-10">Choose who you are — the other 33 are AI.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {rows.map(({ label, color }) => (
            <button
              key={color}
              onClick={() => onStart({ kind: "player", color })}
              className="p-6 border border-white/15 rounded-lg hover:border-accent transition-colors group"
            >
              <span className="font-serif text-2xl group-hover:text-accent transition-colors">
                {label} Player
              </span>
              <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">
                Command — choose who moves
              </p>
            </button>
          ))}
        </div>

        {rows.map(({ label, color }) => (
          <div key={color} className="mb-8">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
              …or be a {label} figure
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {pieces
                .filter((p) => p.color === color)
                .sort((a, b) => a.initialSquare.localeCompare(b.initialSquare))
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onStart({ kind: "piece", pieceId: p.id })}
                    title={`${PIECE_NAMES[p.type]} on ${p.initialSquare}`}
                    className="py-2 border border-white/10 rounded hover:border-accent hover:text-accent transition-colors"
                  >
                    <span className="text-2xl leading-none">{PIECE_SYMBOLS[p.color][p.type]}</span>
                    <span className="block text-[10px] text-gray-500">{p.initialSquare}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
        <p className="text-gray-700 text-xs max-w-md mx-auto">
          Based on the installation “Democratic Chess” by Michael Marcovici — IP cameras as chess
          figures, debating their moves.
        </p>
      </div>
    </div>
  );
}
