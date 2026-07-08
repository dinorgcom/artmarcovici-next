"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Chess, type Move, type Square } from "chess.js";
import { PIECE_SYMBOLS, type PieceType } from "../chess/engine";
import {
  START_CASH,
  MOVE_COST,
  EXPLORE_COST,
  DEV_COST,
  MAX_DEV,
  TOLL_BASE,
  TOLL_PER_DEV,
  PASSIVE_PER_DEV,
  dealFinds,
  tollOf,
  passiveIncome,
  explorationEV,
  remainingFinds,
  chooseMoveAI,
  aiWantsExplore,
  aiDevelopAI,
  type Claims,
  type Color,
} from "./engine";

const FILES = "abcdefgh";
const HUMAN: Color = "w";
const AI: Color = "b";

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

interface LogEntry {
  id: number;
  text: string;
  kind: "chess" | "econ" | "find" | "system";
}

type Phase = "human" | "explore" | "develop" | "ai" | "over";

export default function Game() {
  const chessRef = useRef(new Chess());
  const findsRef = useRef<Record<string, number>>(dealFinds());
  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender((n) => n + 1), []);

  const [phase, setPhase] = useState<Phase>("human");
  const [cash, setCash] = useState<Record<Color, number>>({ w: START_CASH, b: START_CASH });
  const [claims, setClaims] = useState<Claims>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [devChoice, setDevChoice] = useState<string>("");
  const [exploreSquare, setExploreSquare] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const logId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const chess = chessRef.current;

  const pushLog = useCallback((text: string, kind: LogEntry["kind"] = "system") => {
    setLog((l) => [...l.slice(-90), { id: logId.current++, text, kind }]);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    pushLog("The board hides treasures worth $32,000 in total. Every move costs $100. Good luck.", "system");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endGame = useCallback(
    (text: string) => {
      setResult(text);
      setPhase("over");
      pushLog(text, "system");
    },
    [pushLog]
  );

  const checkChessEnd = useCallback((): boolean => {
    if (chess.isCheckmate()) {
      endGame(`Checkmate — ${chess.turn() === HUMAN ? "the Syndicate wins" : "you win"}.`);
      return true;
    }
    if (chess.isDraw()) {
      endGame("Draw — the claims are split, nobody wins.");
      return true;
    }
    return false;
  }, [chess, endGame]);

  /* ---------- human move ---------- */

  const legalTargets = useMemo(() => {
    if (!selected || phase !== "human") return new Set<string>();
    return new Set(chess.moves({ square: selected as Square, verbose: true }).map((m) => m.to));
  }, [selected, phase, chess]);

  const executeHumanMove = useCallback(
    (mv: Move) => {
      const m = chess.move({ from: mv.from, to: mv.to, promotion: "q" });
      setSelected(null);
      let w = cash.w - MOVE_COST;
      let b = cash.b;
      pushLog(`You play ${m.san} (−${money(MOVE_COST)} move cost).`, "chess");

      const claim = claims[m.to];
      if (claim && claim.owner === AI) {
        const toll = tollOf(claim);
        w -= toll;
        b += toll;
        pushLog(`You pay ${money(toll)} toll on ${m.to} (level ${claim.dev}).`, "econ");
      }
      setCash({ w, b });
      if (w < 0) return endGame("You cannot pay — bankrupt. The Syndicate wins.");
      if (checkChessEnd()) return;

      if (!claims[m.to] && w >= EXPLORE_COST) {
        setExploreSquare(m.to);
        setPhase("explore");
      } else {
        proceedToDevelop(claims, w);
      }
      rerender();
    },
    [chess, cash, claims, checkChessEnd, endGame, pushLog, rerender]
  );

  const handleSquareClick = useCallback(
    (sq: string) => {
      if (phase !== "human" || result) return;
      const piece = chess.get(sq as Square);
      if (selected && legalTargets.has(sq)) {
        const mv = chess.moves({ square: selected as Square, verbose: true }).find((m) => m.to === sq)!;
        executeHumanMove(mv);
        return;
      }
      if (piece && piece.color === HUMAN) setSelected(sq === selected ? null : sq);
      else setSelected(sq === selected ? null : market(sq) ? sq : null);
      function market(s: string) {
        return claims[s];
      }
    },
    [phase, result, chess, selected, legalTargets, executeHumanMove, claims]
  );

  /* ---------- exploration decision ---------- */

  /** After the move (and exploration): open the development window if possible. */
  const proceedToDevelop = useCallback(
    (claimsNow: Claims, cashNow: number) => {
      const developable = Object.entries(claimsNow)
        .filter(([, c]) => c.owner === HUMAN && c.dev < MAX_DEV)
        .map(([sq]) => sq);
      if (developable.length > 0 && cashNow >= DEV_COST) {
        setDevChoice(developable[0]);
        setPhase("develop");
      } else {
        setPhase("ai");
      }
    },
    []
  );

  const resolveExplore = useCallback(
    (doExplore: boolean) => {
      const sq = exploreSquare;
      setExploreSquare(null);
      if (doExplore && sq) {
        const find = findsRef.current[sq];
        const newClaims: Claims = { ...claims, [sq]: { owner: HUMAN, find, dev: 0 } };
        const newW = cash.w - EXPLORE_COST + find;
        setClaims(newClaims);
        setCash((c) => ({ ...c, w: c.w - EXPLORE_COST + find }));
        pushLog(
          find > 0
            ? `You explore ${sq} for ${money(EXPLORE_COST)} — and strike ${money(find)}! The square is yours.`
            : `You explore ${sq} for ${money(EXPLORE_COST)} — nothing down there, but the square is yours.`,
          "find"
        );
        proceedToDevelop(newClaims, newW);
      } else {
        proceedToDevelop(claims, cash.w);
      }
    },
    [exploreSquare, proceedToDevelop, claims, cash, pushLog]
  );

  /* ---------- develop (only after the move, any of your claims) ---------- */

  const developableClaims = useMemo(
    () =>
      Object.entries(claims)
        .filter(([, c]) => c.owner === HUMAN && c.dev < MAX_DEV)
        .map(([sq, c]) => ({ square: sq, claim: c })),
    [claims]
  );

  const resolveDevelop = useCallback(
    (doDevelop: boolean) => {
      if (doDevelop && devChoice && claims[devChoice] && cash.w >= DEV_COST) {
        const claim = claims[devChoice];
        setClaims((c) => ({ ...c, [devChoice]: { ...claim, dev: claim.dev + 1 } }));
        setCash((c) => ({ ...c, w: c.w - DEV_COST }));
        pushLog(
          `You develop ${devChoice} to level ${claim.dev + 1} (−${money(DEV_COST)}). Toll is now ${money(
            TOLL_BASE + TOLL_PER_DEV * (claim.dev + 1)
          )}.`,
          "econ"
        );
      }
      setPhase("ai");
    },
    [devChoice, claims, cash, pushLog]
  );

  /* ---------- AI turn ---------- */

  useEffect(() => {
    if (phase !== "ai" || result) return;
    const t = setTimeout(() => {
      let b = cash.b;
      let w = cash.w;

      const pass = passiveIncome(claims, AI);
      if (pass > 0) {
        b += pass;
        pushLog(`The Syndicate collects ${money(pass)} from its mines.`, "econ");
      }
      if (b < MOVE_COST) return endGame("The Syndicate cannot afford a move — bankrupt. You win.");

      let nextClaims = claims;
      const mv = chooseMoveAI(chess, nextClaims, b);
      const m = chess.move({ from: mv.from, to: mv.to, promotion: mv.promotion || "q" });
      b -= MOVE_COST;
      pushLog(`The Syndicate plays ${m.san} (−${money(MOVE_COST)}).`, "chess");

      const claim = nextClaims[m.to];
      if (claim && claim.owner === HUMAN) {
        const toll = tollOf(claim);
        b -= toll;
        w += toll;
        pushLog(`The Syndicate pays you ${money(toll)} toll on ${m.to}.`, "econ");
      }
      if (b < 0) {
        setClaims(nextClaims);
        setCash({ w, b });
        return endGame("The Syndicate cannot pay your toll — bankrupt. You win.");
      }

      if (!nextClaims[m.to] && aiWantsExplore(nextClaims, b)) {
        const find = findsRef.current[m.to];
        nextClaims = { ...nextClaims, [m.to]: { owner: AI, find, dev: 0 } };
        b = b - EXPLORE_COST + find;
        pushLog(
          find > 0
            ? `The Syndicate explores ${m.to} — and strikes ${money(find)}!`
            : `The Syndicate explores ${m.to} — dust and rocks.`,
          "find"
        );
      }

      // develop after the move (mirror of the human rule)
      const devSq = aiDevelopAI(chess, nextClaims, b, AI);
      if (devSq) {
        const cur = nextClaims[devSq];
        nextClaims = { ...nextClaims, [devSq]: { ...cur, dev: cur.dev + 1 } };
        b -= DEV_COST;
        pushLog(`The Syndicate develops ${devSq} to level ${cur.dev + 1}.`, "econ");
      }

      setClaims(nextClaims);
      if (checkChessEnd()) {
        setCash({ w, b });
        return;
      }

      // back to the human: passive income + solvency check
      const humanPass = passiveIncome(nextClaims, HUMAN);
      if (humanPass > 0) {
        w += humanPass;
        pushLog(`You collect ${money(humanPass)} from your mines.`, "econ");
      }
      setCash({ w, b });
      if (w < MOVE_COST) return endGame("You cannot afford a move — bankrupt. The Syndicate wins.");
      setPhase("human");
      rerender();
    }, 900);
    timers.current.push(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* ---------- restart ---------- */

  const restart = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    chessRef.current = new Chess();
    findsRef.current = dealFinds();
    setPhase("human");
    setCash({ w: START_CASH, b: START_CASH });
    setClaims({});
    setSelected(null);
    setDevChoice("");
    setExploreSquare(null);
    setLog([]);
    setResult(null);
    pushLog("New game — fresh treasures have been buried.", "system");
  }, [pushLog]);

  /* ---------- board ---------- */

  const board = useMemo(() => {
    const rows: { square: string; dark: boolean }[][] = [];
    for (let r = 8; r >= 1; r--) {
      const row: { square: string; dark: boolean }[] = [];
      for (let f = 0; f < 8; f++) row.push({ square: `${FILES[f]}${r}`, dark: (f + r) % 2 === 0 });
      rows.push(row);
    }
    return rows;
  }, []);

  const finds = remainingFinds(claims);
  const ev = explorationEV(claims);

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <Link href="/" className="text-xs tracking-widest text-gray-500 hover:text-white transition-colors uppercase">
              ← Art Marcovici
            </Link>
            <h1 className="font-serif text-2xl md:text-3xl text-accent tracking-wider">EXPLORATION CHESS</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-600">working title · game logic preview</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-blue-300">You (White)</p>
              <p className={`font-serif text-xl ${cash.w < 400 ? "text-red-400" : "text-white"}`}>{money(cash.w)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-red-300">Syndicate (Black)</p>
              <p className="font-serif text-xl text-gray-300">{money(cash.b)}</p>
            </div>
            <button onClick={restart} className="text-xs text-gray-600 hover:text-accent uppercase tracking-widest">
              Restart
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
          {/* board */}
          <div>
            <div className="border-4 border-[#d8c9a8]/60 rounded-sm select-none">
              {board.map((row, ri) => (
                <div key={ri} className="grid grid-cols-8">
                  {row.map(({ square, dark }) => {
                    const piece = chess.get(square as Square);
                    const claim = claims[square];
                    const isTarget = legalTargets.has(square);
                    const tollDue = claim && claim.owner === AI && isTarget ? tollOf(claim) : 0;
                    return (
                      <button
                        key={square}
                        onClick={() => handleSquareClick(square)}
                        className={`relative aspect-square flex items-center justify-center ${
                          dark ? "bg-[#0a0a0a]" : "bg-[#f2f0ea]"
                        } ${selected === square ? "ring-2 ring-accent ring-inset" : ""}`}
                      >
                        {claim && (
                          <span
                            className={`absolute inset-0.5 pointer-events-none border-2 ${
                              claim.owner === HUMAN ? "border-blue-400/80" : "border-red-500/80"
                            } ${claim.find >= 1000 ? "shadow-[inset_0_0_12px_rgba(212,168,83,0.5)]" : ""}`}
                          />
                        )}
                        {claim && claim.dev > 0 && (
                          <span className="absolute top-0.5 right-1 text-[9px] leading-none pointer-events-none font-bold text-accent">
                            {"▮".repeat(claim.dev)}
                          </span>
                        )}
                        {claim && claim.find > 0 && (
                          <span
                            className={`absolute top-0.5 left-1 text-[8px] leading-none pointer-events-none font-mono ${
                              claim.find >= 1000 ? "text-accent" : dark ? "text-green-400/80" : "text-green-700/80"
                            }`}
                          >
                            {claim.find >= 1000 ? `${claim.find / 1000}k` : claim.find}
                          </span>
                        )}
                        {isTarget && (
                          <span className={`absolute inset-0 pointer-events-none ${piece ? "ring-4 ring-inset ring-accent/70" : ""}`}>
                            {!piece && (
                              <span
                                className={`absolute inset-0 m-auto w-3 h-3 rounded-full ${
                                  tollDue ? "bg-red-400/90" : claims[square] ? "bg-accent/60" : "bg-green-400/70"
                                }`}
                              />
                            )}
                          </span>
                        )}
                        {tollDue > 0 && (
                          <span className="absolute bottom-0.5 right-1 text-[9px] text-red-400 pointer-events-none font-mono">-{tollDue}</span>
                        )}
                        {piece && (
                          <span
                            className={`text-[min(6.5vw,44px)] leading-none pointer-events-none ${
                              piece.color === "w"
                                ? "text-[#f8f6f0] drop-shadow-[0_2px_2px_rgba(30,80,160,0.9)]"
                                : "text-[#141414] drop-shadow-[0_2px_2px_rgba(200,40,40,0.9)]"
                            }`}
                            style={{ WebkitTextStroke: piece.color === "w" ? "1px #666" : "1px #999" }}
                          >
                            {PIECE_SYMBOLS[piece.color][piece.type as PieceType]}
                          </span>
                        )}
                        <span className="absolute bottom-0.5 left-1 text-[8px] text-gray-500/70 pointer-events-none">{square}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-600">
              {phase === "human"
                ? "Your move (−$100). Green dots: unexplored ground. Red dots: toll due."
                : phase === "ai"
                ? "The Syndicate is thinking…"
                : phase === "explore"
                ? "Decision time…"
                : ""}
            </p>
          </div>

          {/* side panel */}
          <div className="space-y-4">
            {/* turn order */}
            <div className="border border-white/10 rounded-lg p-4">
              <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-2">How a turn works</h2>
              <ol className="text-[11px] text-gray-400 list-decimal list-inside space-y-1">
                <li>Move a piece ({money(MOVE_COST)}).</li>
                <li>Landed on unexplored ground? You may explore it ({money(EXPLORE_COST)}) — it becomes yours.</li>
                <li>Develop one of your claims ({money(DEV_COST)}) — or end your turn.</li>
              </ol>
            </div>

            {/* transparent cost table */}
            <div className="border border-white/10 rounded-lg p-4 text-[11px] text-gray-400 space-y-1">
              <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-2">The rules of the market</h2>
              <p>Move a piece: <span className="text-white">{money(MOVE_COST)}</span></p>
              <p>
                Explore the square you moved to: <span className="text-white">{money(EXPLORE_COST)}</span> — the find and
                the square become yours
              </p>
              <p>
                Develop any of your claims after your move (max {MAX_DEV}):{" "}
                <span className="text-white">{money(DEV_COST)}</span> / level
              </p>
              <p>
                Toll on enemy claims: <span className="text-white">{money(TOLL_BASE)} + {money(TOLL_PER_DEV)}×level</span>
              </p>
              <p>Mine income: <span className="text-white">{money(PASSIVE_PER_DEV)}</span> per level per turn</p>
              <p>Bankruptcy loses. Checkmate wins.</p>
              <div className="border-t border-white/10 mt-2 pt-2">
                <p className="text-gray-500 mb-1">Treasures still buried (EV {money(ev)}):</p>
                <div className="grid grid-cols-4 gap-x-2 gap-y-0.5 font-mono">
                  {finds.map((f) => (
                    <p key={f.value} className={f.left === 0 ? "text-gray-700 line-through" : f.value >= 1000 ? "text-accent" : ""}>
                      {f.left}× {f.value >= 1000 ? `$${f.value / 1000}k` : `$${f.value}`}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* log */}
            <div className="border border-white/10 rounded-lg p-4 h-56 overflow-y-auto flex flex-col-reverse">
              <div className="space-y-1 text-xs">
                {log.map((e) => (
                  <p
                    key={e.id}
                    className={
                      e.kind === "find"
                        ? "text-accent"
                        : e.kind === "econ"
                        ? "text-green-300/80"
                        : e.kind === "chess"
                        ? "text-gray-300"
                        : "text-gray-500"
                    }
                  >
                    {e.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* develop prompt (after the move) */}
      {phase === "develop" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="max-w-md w-full border border-accent/40 rounded-xl bg-black/90 p-6 text-center">
            <h2 className="font-serif text-2xl text-accent mb-2">Develop a claim?</h2>
            <p className="text-gray-400 text-sm mb-4">
              One development per turn, {money(DEV_COST)} per level — on any of your claims.
            </p>
            <select
              value={devChoice}
              onChange={(e) => setDevChoice(e.target.value)}
              className="w-full bg-black border border-white/20 text-sm text-gray-200 px-2 py-2 mb-2"
            >
              {developableClaims.map(({ square, claim }) => (
                <option key={square} value={square}>
                  {square} — level {claim.dev} → {claim.dev + 1}, toll {money(tollOf(claim))} →{" "}
                  {money(tollOf(claim) + TOLL_PER_DEV)}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-600 mb-5">Each level also pays you {money(PASSIVE_PER_DEV)} per turn.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => resolveDevelop(true)}
                disabled={!devChoice || cash.w < DEV_COST}
                className="px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-black transition-all text-sm uppercase tracking-widest disabled:opacity-40"
              >
                Develop ({money(DEV_COST)})
              </button>
              <button
                onClick={() => resolveDevelop(false)}
                className="px-6 py-2 border border-white/20 text-gray-400 hover:text-white transition-all text-sm uppercase tracking-widest"
              >
                End turn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* explore prompt */}
      {phase === "explore" && exploreSquare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="max-w-md w-full border border-accent/40 rounded-xl bg-black/90 p-6 text-center">
            <h2 className="font-serif text-2xl text-accent mb-2">Explore {exploreSquare}?</h2>
            <p className="text-gray-400 text-sm mb-1">
              Drilling costs <span className="text-white">{money(EXPLORE_COST)}</span>. Expected find: {money(ev)}.
            </p>
            <p className="text-gray-600 text-xs mb-6">Whatever is down there becomes yours — including nothing.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => resolveExplore(true)}
                className="px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-black transition-all text-sm uppercase tracking-widest"
              >
                Explore ({money(EXPLORE_COST)})
              </button>
              <button
                onClick={() => resolveExplore(false)}
                className="px-6 py-2 border border-white/20 text-gray-400 hover:text-white transition-all text-sm uppercase tracking-widest"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* game over */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="max-w-md w-full border border-white/10 rounded-xl bg-black/90 p-8 text-center">
            <h2 className="font-serif text-3xl text-accent mb-4">{result}</h2>
            <p className="text-gray-500 text-sm mb-6">
              Final balance — you: {money(cash.w)} · Syndicate: {money(cash.b)}
            </p>
            <button
              onClick={restart}
              className="px-8 py-2 border border-accent text-accent hover:bg-accent hover:text-black transition-all text-sm uppercase tracking-widest"
            >
              Play again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
