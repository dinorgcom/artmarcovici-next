"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Chess, type Move, type Square } from "chess.js";
import { PIECE_SYMBOLS, PIECE_NAMES, type PieceType } from "../chess/engine";
import {
  START_CASH,
  TURN_INCOME,
  MAX_DEV,
  PIECE_CASH_VALUE,
  basePrice,
  devCost,
  rentOf,
  chooseMoveAI,
  econActionAI,
  aiOfferAI,
  aiAcceptsBribe,
  type Color,
  type Market,
  type Deal,
} from "./engine";

const FILES = "abcdefgh";
const HUMAN: Color = "w";
const AI: Color = "b";

interface LogEntry {
  id: number;
  text: string;
  kind: "chess" | "econ" | "deal" | "system";
}

type Phase = "human" | "ai" | "over";

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function Game() {
  const chessRef = useRef(new Chess());
  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender((n) => n + 1), []);

  const [phase, setPhase] = useState<Phase>("human");
  const [cash, setCash] = useState<Record<Color, number>>({ w: START_CASH, b: START_CASH });
  const [market, setMarket] = useState<Market>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [buyMode, setBuyMode] = useState(false);
  const [econUsed, setEconUsed] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [aiOffer, setAiOffer] = useState<Deal | null>(null); // AI offers human money
  const [humanDeal, setHumanDeal] = useState<Deal | null>(null); // accepted AI offer (human took money)
  const [aiDeal, setAiDeal] = useState<{ deal: Deal; willHonor: boolean } | null>(null); // human bribed AI
  const [bribeOpen, setBribeOpen] = useState(false);
  const [bribeSquare, setBribeSquare] = useState<string>("");
  const [bribeAmount, setBribeAmount] = useState<number>(100);
  const [betrayals, setBetrayals] = useState<{ byHuman: boolean; byAi: boolean }>({ byHuman: false, byAi: false });
  const logId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const chess = chessRef.current;

  const pushLog = useCallback((text: string, kind: LogEntry["kind"] = "system") => {
    setLog((l) => [...l.slice(-80), { id: logId.current++, text, kind }]);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /* ---------- game end helpers ---------- */

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
      endGame(`Checkmate — ${chess.turn() === "w" ? "the AFA" : "you"} win${chess.turn() === "w" ? "s" : ""} the old-fashioned way.`);
      return true;
    }
    if (chess.isDraw()) {
      endGame("Draw — the market closes without a winner.");
      return true;
    }
    return false;
  }, [chess, endGame]);

  /* ---------- rent settlement ---------- */

  const settleRent = useCallback(
    (mover: Color, to: string, currentCash: Record<Color, number>): Record<Color, number> => {
      const own = market[to];
      if (!own || own.owner === mover) return currentCash;
      const rent = rentOf(to, own);
      const next = { ...currentCash, [mover]: currentCash[mover] - rent, [own.owner]: currentCash[own.owner] + rent };
      pushLog(
        `${mover === HUMAN ? "You pay" : "The AFA pays"} ${money(rent)} rent on ${to} (level ${own.dev}).`,
        "econ"
      );
      return next;
    },
    [market, pushLog]
  );

  /* ---------- human move ---------- */

  const legalTargets = useMemo(() => {
    if (!selected || phase !== "human") return new Set<string>();
    return new Set(chess.moves({ square: selected as Square, verbose: true }).map((m) => m.to));
  }, [selected, phase, chess]);

  const handleSquareClick = useCallback(
    (sq: string) => {
      if (phase !== "human" || result) return;

      if (buyMode) {
        setBuyMode(false);
        if (market[sq]) return pushLog(`${sq} is already owned.`, "econ");
        const price = basePrice(sq);
        if (econUsed) return pushLog("You already made a market action this turn.", "econ");
        if (cash.w < price) return pushLog(`Not enough cash for ${sq} (${money(price)}).`, "econ");
        setMarket((m) => ({ ...m, [sq]: { owner: HUMAN, dev: 0 } }));
        setCash((c) => ({ ...c, w: c.w - price }));
        setEconUsed(true);
        pushLog(`You buy ${sq} for ${money(price)}.`, "econ");
        return;
      }

      const piece = chess.get(sq as Square);
      if (selected && legalTargets.has(sq)) {
        // make the move
        const mv = chess
          .moves({ square: selected as Square, verbose: true })
          .find((m) => m.to === sq)!;
        executeHumanMove(mv);
        return;
      }
      if (piece && piece.color === HUMAN) {
        setSelected(sq === selected ? null : sq);
      } else {
        setSelected(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, result, buyMode, market, econUsed, cash, selected, legalTargets, chess]
  );

  const executeHumanMove = useCallback(
    (mv: Move) => {
      const m = chess.move({ from: mv.from, to: mv.to, promotion: "q" });
      setSelected(null);
      let nextCash = { ...cash };

      pushLog(`You play ${m.san}.`, "chess");
      if (m.captured && humanDeal && m.to === humanDeal.protectedSquare) {
        setBetrayals((b) => ({ ...b, byHuman: true }));
        pushLog(`You took the money AND the piece. There is no judge. The AFA will remember this.`, "deal");
      }
      setHumanDeal(null);

      nextCash = settleRent(HUMAN, m.to, nextCash);
      setCash(nextCash);
      if (nextCash.w < 0) return endGame("You cannot pay the rent — bankrupt. The AFA wins.");
      if (checkChessEnd()) return;

      setPhase("ai");
      rerender();
    },
    [chess, cash, humanDeal, settleRent, checkChessEnd, endGame, pushLog, rerender]
  );

  /* ---------- AI turn ---------- */

  useEffect(() => {
    if (phase !== "ai" || result) return;
    const t = setTimeout(() => {
      let aiCash = cash.b + TURN_INCOME;
      pushLog(`The AFA collects ${money(TURN_INCOME)} income.`, "econ");

      // economy
      const econ = econActionAI(chess, AI, market, aiCash);
      let nextMarket = market;
      if (econ) {
        aiCash -= econ.cost;
        if (econ.kind === "buy") {
          nextMarket = { ...market, [econ.square]: { owner: AI, dev: 0 } };
          pushLog(`The AFA buys ${econ.square} for ${money(econ.cost)}.`, "econ");
        } else {
          const cur = market[econ.square];
          nextMarket = { ...market, [econ.square]: { owner: AI, dev: cur.dev + 1 } };
          pushLog(`The AFA develops ${econ.square} to level ${cur.dev + 1}.`, "econ");
        }
        setMarket(nextMarket);
      }

      // honor or betray a bribe
      let willHonor = true;
      if (aiDeal) {
        willHonor = betrayals.byHuman ? Math.random() < 0.25 : Math.random() < 0.85;
      }
      const mv = chooseMoveAI(chess, {
        market: nextMarket,
        cash: aiCash,
        honorDeal: aiDeal?.deal ?? null,
        willHonor,
      });
      const m = chess.move({ from: mv.from, to: mv.to, promotion: mv.promotion || "q" });
      pushLog(`The AFA plays ${m.san}.`, "chess");
      if (aiDeal && m.captured && m.to === aiDeal.deal.protectedSquare) {
        setBetrayals((b) => ({ ...b, byAi: true }));
        pushLog(`The AFA took your money and captured anyway. There is no judge.`, "deal");
      }
      setAiDeal(null);

      let nextCash = { ...cash, b: aiCash };
      nextCash = settleRent(AI, m.to, nextCash);
      setCash(nextCash);
      if (nextCash.b < 0) return endGame("The AFA cannot pay your rent — bankrupt. You win.");
      if (checkChessEnd()) return;

      // human turn begins: income + possible AI offer
      setCash((c) => ({ ...c, w: c.w + TURN_INCOME }));
      pushLog(`You collect ${money(TURN_INCOME)} income.`, "econ");
      setEconUsed(false);
      const offer = aiOfferAI(chess, AI, nextCash.b);
      if (offer && !betrayals.byHuman) setAiOffer(offer);
      setPhase("human");
      rerender();
    }, 900);
    timers.current.push(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* ---------- econ actions (human) ---------- */

  const developSelected = useCallback(() => {
    if (!selectedOwnedSquare || econUsed) return;
    const sq = selectedOwnedSquare;
    const own = market[sq];
    const cost = devCost(sq);
    if (own.dev >= MAX_DEV || cash.w < cost) return;
    setMarket((m) => ({ ...m, [sq]: { owner: HUMAN, dev: own.dev + 1 } }));
    setCash((c) => ({ ...c, w: c.w - cost }));
    setEconUsed(true);
    pushLog(`You develop ${sq} to level ${own.dev + 1} for ${money(cost)}.`, "econ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market, cash, econUsed]);

  const offerBribe = useCallback(() => {
    const amount = Math.max(10, Math.round(bribeAmount));
    if (!bribeSquare || econUsed || cash.w < amount) return;
    setBribeOpen(false);
    setEconUsed(true);
    const deal: Deal = { from: HUMAN, amount, protectedSquare: bribeSquare };
    if (aiAcceptsBribe(chess, deal)) {
      setCash((c) => ({ ...c, w: c.w - amount, b: c.b + amount }));
      const honor = betrayals.byHuman ? Math.random() < 0.25 : Math.random() < 0.85;
      setAiDeal({ deal, willHonor: honor });
      pushLog(`Deal: you pay the AFA ${money(amount)} to spare ${bribeSquare} next move. It "agrees".`, "deal");
    } else {
      pushLog(`The AFA rejects your ${money(amount)} offer for ${bribeSquare}. Too cheap.`, "deal");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bribeSquare, bribeAmount, econUsed, cash, betrayals, chess]);

  const respondToOffer = useCallback(
    (accept: boolean) => {
      if (!aiOffer) return;
      if (accept) {
        setCash((c) => ({ ...c, w: c.w + aiOffer.amount, b: c.b - aiOffer.amount }));
        setHumanDeal(aiOffer);
        pushLog(`Deal: the AFA pays you ${money(aiOffer.amount)} to spare ${aiOffer.protectedSquare} this move.`, "deal");
      } else {
        pushLog(`You decline the AFA's ${money(aiOffer.amount)} offer.`, "deal");
      }
      setAiOffer(null);
    },
    [aiOffer, pushLog]
  );

  /* ---------- restart ---------- */

  const restart = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    chessRef.current = new Chess();
    setPhase("human");
    setCash({ w: START_CASH, b: START_CASH });
    setMarket({});
    setSelected(null);
    setBuyMode(false);
    setEconUsed(false);
    setLog([]);
    setResult(null);
    setAiOffer(null);
    setHumanDeal(null);
    setAiDeal(null);
    setBribeOpen(false);
    setBetrayals({ byHuman: false, byAi: false });
    pushLog("New game. Everyone starts with " + money(START_CASH) + ".", "system");
  }, [pushLog]);

  useEffect(() => {
    pushLog("Welcome to the free market. Buy squares, collect rent, make deals — there is no judge.", "system");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- derived ---------- */

  const selectedOwnedSquare = useMemo(() => {
    if (!selected) return null;
    const own = market[selected];
    return own && own.owner === HUMAN ? selected : null;
  }, [selected, market]);

  const humanPieces = useMemo(() => {
    const out: { square: string; type: PieceType }[] = [];
    for (const row of chess.board()) {
      for (const cell of row) {
        if (cell && cell.color === HUMAN) out.push({ square: cell.square, type: cell.type as PieceType });
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, log.length]);

  /* ---------- board rendering ---------- */

  const board = useMemo(() => {
    const rows: { square: string; dark: boolean }[][] = [];
    for (let r = 8; r >= 1; r--) {
      const row: { square: string; dark: boolean }[] = [];
      for (let f = 0; f < 8; f++) {
        row.push({ square: `${FILES[f]}${r}`, dark: (f + r) % 2 === 0 });
      }
      rows.push(row);
    }
    return rows;
  }, []);

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <Link href="/work/free-market-chess" className="text-xs tracking-widest text-gray-500 hover:text-white transition-colors uppercase">
              ← Free Market Chess
            </Link>
            <h1 className="font-serif text-2xl md:text-3xl text-accent tracking-wider">FREE MARKET CHESS</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-blue-300">You (White)</p>
              <p className={`font-serif text-xl ${cash.w < 150 ? "text-red-400" : "text-white"}`}>{money(cash.w)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-red-300">AFA (Black)</p>
              <p className="font-serif text-xl text-gray-300">{money(cash.b)}</p>
            </div>
            <button onClick={restart} className="text-xs text-gray-600 hover:text-accent uppercase tracking-widest">
              Restart
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          {/* board */}
          <div>
            <div className="border-4 border-[#d8c9a8]/60 rounded-sm select-none">
              {board.map((row, ri) => (
                <div key={ri} className="grid grid-cols-8">
                  {row.map(({ square, dark }) => {
                    const piece = chess.get(square as Square);
                    const own = market[square];
                    const isTarget = legalTargets.has(square);
                    const rentDue = own && own.owner === AI && isTarget ? rentOf(square, own) : 0;
                    return (
                      <button
                        key={square}
                        onClick={() => handleSquareClick(square)}
                        className={`relative aspect-square flex items-center justify-center transition-shadow ${
                          dark ? "bg-[#0a0a0a]" : "bg-[#f2f0ea]"
                        } ${selected === square ? "ring-2 ring-accent ring-inset" : ""} ${
                          buyMode && !own ? "cursor-crosshair hover:ring-2 hover:ring-green-400 hover:ring-inset" : ""
                        }`}
                      >
                        {own && (
                          <span
                            className={`absolute inset-0.5 pointer-events-none border-2 ${
                              own.owner === HUMAN ? "border-blue-400/80" : "border-red-500/80"
                            }`}
                          />
                        )}
                        {own && own.dev > 0 && (
                          <span className="absolute top-0.5 right-1 text-[9px] leading-none pointer-events-none font-bold text-accent">
                            {"▮".repeat(own.dev)}
                          </span>
                        )}
                        {isTarget && (
                          <span
                            className={`absolute inset-0 pointer-events-none ${
                              piece ? "ring-4 ring-inset ring-accent/70" : ""
                            }`}
                          >
                            {!piece && (
                              <span className={`absolute inset-0 m-auto w-3 h-3 rounded-full ${rentDue ? "bg-red-400/90" : "bg-accent/80"}`} />
                            )}
                          </span>
                        )}
                        {rentDue > 0 && (
                          <span className="absolute bottom-0.5 right-1 text-[9px] text-red-400 pointer-events-none font-mono">
                            -{rentDue}
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
                        <span className="absolute bottom-0.5 left-1 text-[8px] text-gray-500/70 pointer-events-none">
                          {square}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-600">
              {phase === "human"
                ? buyMode
                  ? "Buy mode: click any unowned square to purchase it."
                  : "Your move — click a piece, then a target. Red dots cost rent."
                : phase === "ai"
                ? "The AFA is thinking…"
                : ""}
            </p>
          </div>

          {/* side panel */}
          <div className="space-y-4">
            {/* market actions */}
            <div className="border border-white/10 rounded-lg p-4">
              <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                Market — one action per turn {econUsed && <span className="text-accent">(used)</span>}
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setBuyMode((b) => !b)}
                  disabled={econUsed || phase !== "human"}
                  className={`w-full px-3 py-2 text-sm border transition-colors disabled:opacity-40 ${
                    buyMode ? "border-green-400 text-green-300" : "border-white/20 text-gray-300 hover:border-accent"
                  }`}
                >
                  {buyMode ? "Cancel buying" : "Buy a square"}
                </button>
                <button
                  onClick={developSelected}
                  disabled={!selectedOwnedSquare || econUsed || phase !== "human" || (selectedOwnedSquare ? market[selectedOwnedSquare].dev >= MAX_DEV || cash.w < devCost(selectedOwnedSquare) : true)}
                  className="w-full px-3 py-2 text-sm border border-white/20 text-gray-300 hover:border-accent transition-colors disabled:opacity-40"
                >
                  {selectedOwnedSquare
                    ? `Develop ${selectedOwnedSquare} (${money(devCost(selectedOwnedSquare))})`
                    : "Develop (select your square)"}
                </button>
                <button
                  onClick={() => setBribeOpen((o) => !o)}
                  disabled={econUsed || phase !== "human"}
                  className="w-full px-3 py-2 text-sm border border-white/20 text-gray-300 hover:border-accent transition-colors disabled:opacity-40"
                >
                  Offer the AFA a deal
                </button>
              </div>
              {bribeOpen && (
                <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
                  <p className="text-xs text-gray-500">Pay the AFA to spare one of your pieces next move:</p>
                  <select
                    value={bribeSquare}
                    onChange={(e) => setBribeSquare(e.target.value)}
                    className="w-full bg-black border border-white/20 text-sm text-gray-200 px-2 py-1.5"
                  >
                    <option value="">— choose a piece —</option>
                    {humanPieces.map((p) => (
                      <option key={p.square} value={p.square}>
                        {PIECE_NAMES[p.type]} on {p.square}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min={10}
                      step={10}
                      value={bribeAmount}
                      onChange={(e) => setBribeAmount(Number(e.target.value))}
                      className="w-24 bg-black border border-white/20 text-sm text-gray-200 px-2 py-1.5"
                    />
                    <button
                      onClick={offerBribe}
                      disabled={!bribeSquare || cash.w < bribeAmount}
                      className="flex-1 px-3 py-1.5 text-sm border border-accent text-accent hover:bg-accent hover:text-black transition-colors disabled:opacity-40"
                    >
                      Offer
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-600">Deals are not enforceable. There is no judge.</p>
                </div>
              )}
            </div>

            {/* square info */}
            {selected && (
              <div className="border border-white/10 rounded-lg p-4 text-sm">
                <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Square {selected}</h2>
                {market[selected] ? (
                  <p className="text-gray-300">
                    Owned by {market[selected].owner === HUMAN ? "you" : "the AFA"} · level {market[selected].dev} ·
                    rent {money(rentOf(selected, market[selected]))}
                  </p>
                ) : (
                  <p className="text-gray-300">Unowned · price {money(basePrice(selected))} · rent {money(Math.round(basePrice(selected) * 0.25))}</p>
                )}
              </div>
            )}

            {/* log */}
            <div className="border border-white/10 rounded-lg p-4 h-64 overflow-y-auto flex flex-col-reverse">
              <div className="space-y-1 text-xs">
                {log.map((e) => (
                  <p
                    key={e.id}
                    className={
                      e.kind === "deal"
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

      {/* AI offer modal */}
      {aiOffer && phase === "human" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="max-w-md w-full border border-accent/40 rounded-xl bg-black/90 p-6 text-center">
            <h2 className="font-serif text-2xl text-accent mb-3">The AFA proposes a deal</h2>
            <p className="text-gray-300 mb-6">
              “We pay you <span className="text-white">{money(aiOffer.amount)}</span> if you leave our piece on{" "}
              <span className="text-white">{aiOffer.protectedSquare}</span> alone this move.”
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => respondToOffer(true)}
                className="px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-black transition-all text-sm uppercase tracking-widest"
              >
                Take the money
              </button>
              <button
                onClick={() => respondToOffer(false)}
                className="px-6 py-2 border border-white/20 text-gray-400 hover:text-white transition-all text-sm uppercase tracking-widest"
              >
                Decline
              </button>
            </div>
            <p className="mt-4 text-[10px] text-gray-600 uppercase tracking-widest">Contracts are not enforceable</p>
          </div>
        </div>
      )}

      {/* game over */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="max-w-md w-full border border-white/10 rounded-xl bg-black/90 p-8 text-center">
            <h2 className="font-serif text-3xl text-accent mb-4">{result}</h2>
            <p className="text-gray-500 text-sm mb-6">
              Final balance — you: {money(cash.w)} · AFA: {money(cash.b)}
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
