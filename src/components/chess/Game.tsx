"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Chess, type Move, type Square } from "chess.js";
import ChessScene, { type ViewMode } from "./Scene";
import { getTips, speakTips, stopSpeech, type Tip } from "./tips";
import { setSlideMuted } from "./slideSound";
import FigureBoard, { capitalize, pieceLabel } from "./FigureBoard";
import FigureIcon from "./FigureIcon";
import {
  applyMoveToPieces,
  buildInitialPieces,
  commanderPickAI,
  legalMovesFor,
  movablePieces,
  pieceChooseMoveAI,
  PIECE_NAMES,
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
  const roleLabel =
    role?.kind === "player"
      ? `${colorName(role.color).toLowerCase()} player`
      : humanPiece
        ? pieceLabel(humanPiece)
        : "";

  const statusText = useMemo(() => {
    if (phase === "over") return result ?? "Game over.";
    if (captured) return "You were captured. Watching from above.";
    if (phase === "commander") {
      if (humanColor === turn) return "Your turn: choose which figure moves.";
      return `The ${colorName(turn).toLowerCase()} player is choosing a figure…`;
    }
    if (phase === "piece" && selectedPiece) {
      if (selectedPiece.id === humanPieceId)
        return "Your turn: choose a glowing square.";
      return `${describePiece(selectedPiece)} is deciding its move…`;
    }
    return "";
  }, [phase, result, captured, humanColor, turn, selectedPiece, humanPieceId]);

  const prompt = useMemo(() => {
    if (phase === "commander" && humanColor === turn)
      return { title: "Your move", sub: "Choose which figure moves: click one with a gold ring." };
    if (phase === "piece" && selectedPieceId === humanPieceId && humanPieceId)
      return { title: "You've been called", sub: "Drag to look around, then click a glowing square." };
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
      {phase !== "role" && (
        <div className="absolute top-16 left-0 right-0 flex items-start justify-between gap-3 px-4 sm:px-6 pt-3 pb-10 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none">
          <div className="pointer-events-auto min-w-0">
            <Link
              href="/work/democratic-chess"
              className="text-xs text-gray-500 hover:text-white transition-colors whitespace-nowrap"
            >
              ← About the installation
            </Link>
            <div className="mt-2 flex items-center gap-2.5">
              {humanPiece ? (
                <FigureIcon color={humanPiece.color} type={humanPiece.type} className="w-6 h-9 shrink-0" />
              ) : (
                <span
                  className={`w-3.5 h-3.5 rounded-full shrink-0 ring-1 ${
                    humanColor === "w" ? "bg-[#efece5] ring-white/40" : "bg-[#1d1d1d] ring-white/30"
                  }`}
                />
              )}
              <p className="font-serif text-base sm:text-lg text-gray-100 truncate">
                <span className="sm:hidden">{capitalize(roleLabel)}</span>
                <span className="hidden sm:inline">You are the {roleLabel}</span>
              </p>
            </div>
          </div>
          <div className="text-right pointer-events-auto min-w-0">
            <p className="flex items-center justify-end gap-2 text-xs sm:text-sm text-gray-200">
              {phase !== "over" && (
                <span
                  className={`w-2.5 h-2.5 rounded-full ring-1 ${
                    turn === "w" ? "bg-[#efece5] ring-white/40" : "bg-[#1d1d1d] ring-white/40"
                  }`}
                />
              )}
              <span>{phase === "over" ? "Game over" : `${colorName(turn)} to move`}</span>
            </p>
            <p className="hidden sm:block mt-1 text-xs text-gray-500 max-w-sm ml-auto">{statusText}</p>
            <div className="mt-2.5 flex items-center justify-end gap-2">
              <button
                onClick={() => setMuted((m) => !m)}
                title={muted ? "Unmute figure voices" : "Mute figure voices"}
                aria-pressed={!muted}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] transition-colors ${
                  muted
                    ? "border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300"
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
                <span className="hidden sm:inline">{muted ? "Voices off" : "Voices on"}</span>
              </button>
              <button
                onClick={restart}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 text-[11px] text-gray-400 hover:border-white/30 hover:text-gray-200 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12a7.5 7.5 0 0113.05-5.1M19.5 12a7.5 7.5 0 01-13.05 5.1M17.55 3v3.9h-3.9M6.45 21v-3.9h3.9"
                  />
                </svg>
                <span className="hidden sm:inline">New game</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* prominent prompt when it is the human's turn — fades in once per call */}
      {prompt && (
        <div className="absolute inset-x-0 top-[24%] sm:top-[14%] flex justify-center pointer-events-none">
          <div
            key={prompt.title}
            className="dc-prompt text-center px-10 py-6 [background:radial-gradient(closest-side,rgba(0,0,0,0.7),transparent)]"
          >
            <p className="font-serif text-3xl sm:text-5xl md:text-6xl text-accent drop-shadow-[0_0_24px_rgba(212,168,83,0.45)]">
              {prompt.title}
            </p>
            <p className="mt-3 text-sm sm:text-base text-gray-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              {prompt.sub}
            </p>
          </div>
        </div>
      )}

      {/* table talk: everything said and played at the table */}
      {phase !== "role" && (
        <div className="absolute bottom-4 left-4 w-[22rem] max-w-[calc(100vw-2rem)] rounded-lg border border-white/10 bg-black/75 backdrop-blur-md">
          <p className="px-4 pt-3 pb-1 font-serif text-sm text-accent">Table talk</p>
          <div className="dc-log max-h-24 sm:max-h-52 overflow-y-auto px-4 pb-3 text-xs leading-relaxed space-y-1.5">
            {log.slice(-14).map((e) => (
              <p key={e.id} className="flex gap-2">
                <span
                  className={`mt-[5px] w-1.5 h-1.5 rounded-full shrink-0 ${
                    e.color === "w" ? "bg-[#efece5]" : e.color === "b" ? "bg-gray-600 ring-1 ring-gray-400/40" : "bg-accent"
                  }`}
                />
                <span className={e.color === "w" ? "text-gray-200" : e.color === "b" ? "text-gray-400" : "text-accent/90"}>
                  {e.text}
                </span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* captured overlay */}
      {captured && phase !== "over" && !spectating && (
        <Overlay title="You've been captured">
          <p className="text-gray-400 mb-6">
            Your camera went dark. The game goes on without you.
          </p>
          <div className="flex gap-3 justify-center">
            <OverlayButton onClick={() => setSpectating(true)}>Watch the rest</OverlayButton>
            <OverlayButton onClick={restart} primary>New game</OverlayButton>
          </div>
        </Overlay>
      )}

      {/* game over overlay */}
      {phase === "over" && (
        <Overlay title={result ?? "Game over"}>
          <div className="flex gap-3 justify-center">
            <OverlayButton onClick={restart} primary>Play again</OverlayButton>
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
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="dc-prompt text-center px-8 py-10 border border-accent/25 rounded-xl bg-black/85 max-w-md shadow-[0_30px_90px_-30px_rgba(212,168,83,0.35)]">
        <h2 className="font-serif text-3xl sm:text-4xl text-accent mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function OverlayButton({
  onClick,
  children,
  primary,
}: {
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full text-sm transition-colors ${
        primary
          ? "bg-accent text-black hover:bg-[#e2bb6c]"
          : "border border-white/20 text-gray-200 hover:border-white/50"
      }`}
    >
      {children}
    </button>
  );
}

function SeatButton({ color, onClick }: { color: Color; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full flex items-center gap-4 px-4 py-3 rounded-md border border-white/12 bg-black/40 hover:border-accent hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors text-left"
    >
      <span
        className={`w-5 h-5 rounded-full shrink-0 ring-1 ${
          color === "w" ? "bg-[#efece5] ring-white/40" : "bg-[#1d1d1d] ring-white/40"
        }`}
      />
      <span className="min-w-0">
        <span className="block font-serif text-lg text-gray-100 group-hover:text-accent transition-colors">
          Play as the {colorName(color).toLowerCase()} player
        </span>
        <span className="block text-xs text-gray-500">
          Sit at the {colorName(color).toLowerCase()} side and decide which figure moves
        </span>
      </span>
    </button>
  );
}

function RoleSelect({ pieces, onStart }: { pieces: PieceState[]; onStart: (r: Role) => void }) {
  const [hovered, setHovered] = useState<PieceState | null>(null);

  return (
    <div className="absolute inset-0 overflow-y-auto bg-black/85 lg:bg-transparent lg:bg-gradient-to-r lg:from-black lg:via-black/85 lg:to-black/55">
      <div className="min-h-full max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-16 grid gap-10 lg:gap-x-16 lg:gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:grid-rows-[1fr_1fr] content-center">
        <section className="order-1 lg:order-none max-w-lg lg:col-start-1 lg:row-start-1 lg:self-end">
          <Link
            href="/work/democratic-chess"
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            ← About the installation
          </Link>
          <h1 className="mt-6 font-serif text-5xl sm:text-6xl xl:text-7xl leading-[0.95] text-accent">
            Democratic
            <br />
            Chess
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            Two players and thirty-two camera-figures. The players decide which figure moves.
            The figure looks through its own lens and decides where it goes.
          </p>
        </section>

        <section className="order-3 lg:order-none max-w-lg lg:col-start-1 lg:row-start-2 lg:self-start">
          <dl className="space-y-4 border-l border-accent/40 pl-5">
            <div>
              <dt className="font-serif text-gray-100">The players</dt>
              <dd className="text-sm text-gray-400">call on a figure — they never choose the square.</dd>
            </div>
            <div>
              <dt className="font-serif text-gray-100">The figure that is called</dt>
              <dd className="text-sm text-gray-400">sees the board from its own camera and picks its move.</dd>
            </div>
            <div>
              <dt className="font-serif text-gray-100">Everyone else</dt>
              <dd className="text-sm text-gray-400">talks, advises and argues at the table — out loud.</dd>
            </div>
          </dl>

          <p className="mt-8 text-sm text-gray-500">
            Take a seat or click any figure to become it. The computer plays the other 33 roles.
          </p>
        </section>

        <section
          aria-label="Choose your role"
          className="order-2 lg:order-none w-full max-w-[440px] mx-auto lg:mx-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center"
        >
          <SeatButton color="b" onClick={() => onStart({ kind: "player", color: "b" })} />
          <div className="my-5 pl-5">
            <FigureBoard
              pieces={pieces}
              active={hovered?.id ?? null}
              onHover={setHovered}
              onPick={(pieceId) => onStart({ kind: "piece", pieceId })}
            />
          </div>
          <SeatButton color="w" onClick={() => onStart({ kind: "player", color: "w" })} />
          <p aria-live="polite" className="mt-4 h-5 text-center text-sm text-gray-400">
            {hovered ? (
              <>
                Play as the <span className="text-accent">{pieceLabel(hovered)}</span>
              </>
            ) : (
              "…or click a figure on the board"
            )}
          </p>
        </section>
      </div>
    </div>
  );
}
