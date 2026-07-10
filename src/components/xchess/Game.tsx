"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Chess, type Move, type Square } from "chess.js";
import { PIECE_SYMBOLS, type PieceType } from "../chess/engine";
import {
  START_CASH,
  MOVE_COST,
  EXPLORE_COST,
  MAX_DEV,
  TOLL_BY_DEV,
  DEV_COSTS,
  PASSIVE_PER_DEV,
  dealFinds,
  tollOf,
  devCostOf,
  moveTolls,
  moveCostOf,
  hasAffordableMove,
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

type Phase = "human" | "explore" | "reveal" | "develop" | "ai" | "over";

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
  const [reveal, setReveal] = useState<{ square: string; find: number; claims: Claims; w: number } | null>(null);
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
    pushLog("Resources worth $7,100 per round are hidden under the board. Every move costs $100. Good luck.", "system");
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

  /** Every legal target of the selected piece, with its full price (tolls included). */
  const targetCosts = useMemo(() => {
    const map = new Map<string, { cost: number; move: Move }>();
    if (!selected || phase !== "human") return map;
    for (const m of chess.moves({ square: selected as Square, verbose: true })) {
      map.set(m.to, { cost: moveCostOf(m, claims, AI), move: m });
    }
    return map;
  }, [selected, phase, chess, claims]);

  const legalTargets = useMemo(() => new Set(targetCosts.keys()), [targetCosts]);

  const executeHumanMove = useCallback(
    (mv: Move) => {
      const tolls = moveTolls(mv, claims, AI);
      const m = chess.move({ from: mv.from, to: mv.to, promotion: "q" });
      setSelected(null);
      let w = cash.w - MOVE_COST;
      let b = cash.b;
      pushLog(`You play ${m.san} (−${money(MOVE_COST)} move cost).`, "chess");

      if (tolls.length > 0) {
        const total = tolls.reduce((s, t) => s + t.toll, 0);
        w -= total;
        b += total;
        const parts = tolls.map((t) => `${t.square} ${t.transit ? "transit " : ""}${money(t.toll)}`).join(" + ");
        pushLog(`You pay ${money(total)} toll (${parts}).`, "econ");
      }
      setCash({ w, b });
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
      const target = targetCosts.get(sq);
      if (selected && target) {
        if (target.cost > cash.w) {
          pushLog(`${sq} is blocked — the move would cost ${money(target.cost)}, you have ${money(cash.w)}.`, "econ");
          return;
        }
        executeHumanMove(target.move);
        return;
      }
      if (piece && piece.color === HUMAN) setSelected(sq === selected ? null : sq);
      else setSelected(sq === selected ? null : market(sq) ? sq : null);
      function market(s: string) {
        return claims[s];
      }
    },
    [phase, result, chess, selected, targetCosts, cash.w, executeHumanMove, pushLog, claims]
  );

  /* ---------- exploration decision ---------- */

  /** After the move (and exploration): open the development window if possible. */
  const proceedToDevelop = useCallback(
    (claimsNow: Claims, cashNow: number) => {
      const developable = Object.entries(claimsNow)
        .filter(([, c]) => c.owner === HUMAN && c.dev < MAX_DEV && cashNow >= devCostOf(c))
        .map(([sq]) => sq);
      if (developable.length > 0) {
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
        const newW = cash.w - EXPLORE_COST;
        setClaims(newClaims);
        setCash((c) => ({ ...c, w: c.w - EXPLORE_COST }));
        pushLog(
          find > 0
            ? `You explore ${sq} for ${money(EXPLORE_COST)} — and strike ${money(find)} per round! The square is yours.`
            : `You explore ${sq} for ${money(EXPLORE_COST)} — nothing down there, but the square is yours.`,
          "find"
        );
        setReveal({ square: sq, find, claims: newClaims, w: newW });
        setPhase("reveal");
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
      if (doDevelop && devChoice && claims[devChoice] && cash.w >= devCostOf(claims[devChoice])) {
        const claim = claims[devChoice];
        const price = devCostOf(claim);
        setClaims((c) => ({ ...c, [devChoice]: { ...claim, dev: claim.dev + 1 } }));
        setCash((c) => ({ ...c, w: c.w - price }));
        pushLog(
          `You develop ${devChoice} to level ${claim.dev + 1} (−${money(price)}). Toll is now ${money(
            TOLL_BY_DEV[claim.dev + 1]
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

      let nextClaims = claims;
      const mv = chooseMoveAI(chess, nextClaims, b);
      if (!mv) {
        setCash({ w, b });
        return endGame("Economic checkmate — the Syndicate cannot afford any legal move. You win.");
      }
      const tolls = moveTolls(mv, nextClaims, HUMAN);
      const m = chess.move({ from: mv.from, to: mv.to, promotion: mv.promotion || "q" });
      b -= MOVE_COST;
      pushLog(`The Syndicate plays ${m.san} (−${money(MOVE_COST)}).`, "chess");

      if (tolls.length > 0) {
        const total = tolls.reduce((s, t) => s + t.toll, 0);
        b -= total;
        w += total;
        const parts = tolls.map((t) => `${t.square} ${t.transit ? "transit " : ""}${money(t.toll)}`).join(" + ");
        pushLog(`The Syndicate pays you ${money(total)} toll (${parts}).`, "econ");
      }

      if (!nextClaims[m.to] && aiWantsExplore(nextClaims, b)) {
        const find = findsRef.current[m.to];
        nextClaims = { ...nextClaims, [m.to]: { owner: AI, find, dev: 0 } };
        b -= EXPLORE_COST;
        pushLog(
          find > 0
            ? `The Syndicate explores ${m.to} — and strikes ${money(find)} per round!`
            : `The Syndicate explores ${m.to} — dust and rocks.`,
          "find"
        );
      }

      // develop after the move (mirror of the human rule)
      const devSq = aiDevelopAI(chess, nextClaims, b, AI);
      if (devSq) {
        const cur = nextClaims[devSq];
        const price = devCostOf(cur);
        nextClaims = { ...nextClaims, [devSq]: { ...cur, dev: cur.dev + 1 } };
        b -= price;
        pushLog(
          `The Syndicate develops ${devSq} to level ${cur.dev + 1} — toll there is now ${money(TOLL_BY_DEV[cur.dev + 1])}.`,
          "econ"
        );
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
      if (!hasAffordableMove(chess, nextClaims, w, HUMAN)) {
        return endGame("Economic checkmate — you cannot afford any legal move. The Syndicate wins.");
      }
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
    setReveal(null);
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
                    const target = targetCosts.get(square);
                    const isTarget = legalTargets.has(square);
                    const tollDue = target ? target.cost - MOVE_COST : 0;
                    const blocked = target ? target.cost > cash.w : false;
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
                        {claim && (
                          <span
                            className={`absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 py-[1px] pointer-events-none font-mono text-[9px] leading-none text-white ${
                              claim.owner === HUMAN ? "bg-blue-600/85" : "bg-red-700/85"
                            }`}
                          >
                            <span className="opacity-90">{claim.owner === HUMAN ? "YOU" : "SYN"}</span>
                            {claim.dev > 0 && <span className="text-accent tracking-tighter">{"▮".repeat(claim.dev)}</span>}
                            <span>${tollOf(claim)}</span>
                          </span>
                        )}
                        {claim && claim.find > 0 && (
                          <span
                            className={`absolute top-0.5 left-1 text-[8px] leading-none pointer-events-none font-mono ${
                              claim.find >= 250 ? "text-accent" : dark ? "text-green-400/80" : "text-green-700/80"
                            }`}
                          >
                            +{claim.find}/r
                          </span>
                        )}
                        {isTarget && !blocked && (
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
                        {isTarget && blocked && (
                          <span
                            className="absolute inset-0 pointer-events-none flex items-center justify-center bg-red-950/50"
                            title={`Blocked — this move costs ${money(target!.cost)}`}
                          >
                            <span className="text-red-400 font-mono text-sm leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                              ✕ ${target!.cost}
                            </span>
                          </span>
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
                        <span className="absolute top-0.5 right-1 text-[8px] text-gray-500/70 pointer-events-none">{square}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-600">
              {phase === "human"
                ? "Your move (−$100). Green dots: unexplored ground. Red dots: toll due. ✕: too expensive — blocked."
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
                <li>Develop one of your claims ({money(DEV_COSTS[0])}–{money(DEV_COSTS[2])}) — or end your turn.</li>
              </ol>
            </div>

            {/* transparent cost table */}
            <div className="border border-white/10 rounded-lg p-4 text-[11px] text-gray-400 space-y-1">
              <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-2">The rules of the market</h2>
              <p>Move a piece: <span className="text-white">{money(MOVE_COST)}</span></p>
              <p>
                Explore the square you moved to: <span className="text-white">{money(EXPLORE_COST)}</span> — the square
                becomes yours and pays its resource <span className="text-white">every round</span>
              </p>
              <p>
                Develop any of your claims after your move (max {MAX_DEV}):{" "}
                <span className="text-white">{DEV_COSTS.map((c) => money(c)).join(" / ")}</span> per level
              </p>
              <p>
                Toll on enemy claims by level:{" "}
                <span className="text-white">{TOLL_BY_DEV.map((t) => money(t)).join(" → ")}</span>
              </p>
              <p>
                Sliding pieces pay the toll of <span className="text-white">every enemy square they cross</span> — developed
                squares cut lines
              </p>
              <p>Development bonus: <span className="text-white">{money(PASSIVE_PER_DEV)}</span> per level per round</p>
              <p>Moves you cannot pay for are blocked. No affordable move left = economic checkmate. Checkmate wins.</p>
              <div className="border-t border-white/10 mt-2 pt-2">
                <p className="text-gray-500 mb-1">Resources still buried (pay per round · EV {money(ev)}/round):</p>
                <div className="grid grid-cols-4 gap-x-2 gap-y-0.5 font-mono">
                  {finds.map((f) => (
                    <p key={f.value} className={f.left === 0 ? "text-gray-700 line-through" : f.value >= 250 ? "text-accent" : ""}>
                      {f.left}× ${f.value}
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

      {/* exploration result */}
      {phase === "reveal" && reveal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="max-w-md w-full border border-accent/40 rounded-xl bg-black/90 p-8 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Exploration result — {reveal.square}</p>
            {reveal.find > 0 ? (
              <>
                <h2 className="font-serif text-5xl text-accent mb-2">{money(reveal.find)}</h2>
                <p className="text-gray-300 mb-6">per round, every round — the claim is yours.</p>
              </>
            ) : (
              <>
                <h2 className="font-serif text-4xl text-gray-500 mb-2">Nothing.</h2>
                <p className="text-gray-400 mb-6">Dust and rocks. At least the square is yours now.</p>
              </>
            )}
            <button
              onClick={() => {
                const r = reveal;
                setReveal(null);
                proceedToDevelop(r.claims, r.w);
              }}
              className="px-8 py-2 border border-accent text-accent hover:bg-accent hover:text-black transition-all text-sm uppercase tracking-widest"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* develop prompt (after the move) */}
      {phase === "develop" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="max-w-md w-full border border-accent/40 rounded-xl bg-black/90 p-6 text-center">
            <h2 className="font-serif text-2xl text-accent mb-2">Develop a claim?</h2>
            <p className="text-gray-400 text-sm mb-4">
              One development per turn — {DEV_COSTS.map((c) => money(c)).join(" / ")} per level. Higher levels charge
              much steeper tolls.
            </p>
            <select
              value={devChoice}
              onChange={(e) => setDevChoice(e.target.value)}
              className="w-full bg-black border border-white/20 text-sm text-gray-200 px-2 py-2 mb-2"
            >
              {developableClaims.map(({ square, claim }) => (
                <option key={square} value={square}>
                  {square} — level {claim.dev} → {claim.dev + 1} for {money(devCostOf(claim))}, toll {money(tollOf(claim))} →{" "}
                  {money(TOLL_BY_DEV[claim.dev + 1])}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-600 mb-5">Each level also pays you {money(PASSIVE_PER_DEV)} per turn.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => resolveDevelop(true)}
                disabled={!devChoice || !claims[devChoice] || cash.w < devCostOf(claims[devChoice])}
                className="px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-black transition-all text-sm uppercase tracking-widest disabled:opacity-40"
              >
                Develop{devChoice && claims[devChoice] ? ` (${money(devCostOf(claims[devChoice]))})` : ""}
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
              Drilling costs <span className="text-white">{money(EXPLORE_COST)}</span>. Expected yield: {money(ev)} per
              round.
            </p>
            <p className="text-gray-600 text-xs mb-6">Whatever is down there pays you every round — or nothing, forever.</p>
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
