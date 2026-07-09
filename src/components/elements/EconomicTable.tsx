"use client";

import { useMemo, useState } from "react";
import {
  ELEMENTS,
  METRICS,
  colorForT,
  cssColor,
  formatUSD,
  metricValue,
  type MetricKey,
} from "@/data/elements";
import PeriodicTable2D, { type ElementCell } from "./PeriodicTable2D";
import PeriodicTable3D from "./PeriodicTable3D";

export default function EconomicTable() {
  const [metric, setMetric] = useState<MetricKey>("kg");
  const [view, setView] = useState<"2d" | "3d">("2d");
  const [selectedZ, setSelectedZ] = useState<number | null>(79); // gold

  const { cells, min, max, cheapest, dearest } = useMemo(() => {
    const values = ELEMENTS.map((el) => ({ el, value: metricValue(el, metric) }));
    const priced = values.filter((v) => v.value !== null) as {
      el: (typeof ELEMENTS)[number];
      value: number;
    }[];
    const logs = priced.map((v) => Math.log10(v.value));
    const lo = Math.min(...logs);
    const hi = Math.max(...logs);
    const cells: ElementCell[] = values.map((v) => ({
      ...v,
      t: v.value === null ? null : (Math.log10(v.value) - lo) / (hi - lo),
    }));
    const sorted = [...priced].sort((a, b) => a.value - b.value);
    return {
      cells,
      min: sorted[0].value,
      max: sorted[sorted.length - 1].value,
      cheapest: sorted[0].el,
      dearest: sorted[sorted.length - 1].el,
    };
  }, [metric]);

  const selected = selectedZ === null ? null : ELEMENTS.find((el) => el.z === selectedZ) ?? null;
  const activeMetric = METRICS.find((m) => m.key === metric)!;
  const legendGradient = `linear-gradient(to right, ${[0, 0.2, 0.4, 0.6, 0.8, 1]
    .map((t) => cssColor(colorForT(t)))
    .join(", ")})`;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              title={m.description}
              className={`rounded-full border px-3 py-1.5 text-xs tracking-wide transition-colors ${
                metric === m.key
                  ? "border-accent bg-accent text-black"
                  : "border-white/15 text-gray-400 hover:border-white/40 hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5">
          {(
            [
              ["2d", "2D — Color"],
              ["3d", "3D — Height"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`rounded-full border px-3 py-1.5 text-xs tracking-wide transition-colors ${
                view === key
                  ? "border-white bg-white text-black"
                  : "border-white/15 text-gray-400 hover:border-white/40 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="whitespace-nowrap">
          {formatUSD(min)} <span className="text-gray-600">({cheapest.name})</span>
        </span>
        <div className="h-2 min-w-24 flex-1 rounded-full" style={{ background: legendGradient }} />
        <span className="whitespace-nowrap">
          {formatUSD(max)} <span className="text-gray-600">({dearest.name})</span>
        </span>
        <span className="hidden whitespace-nowrap text-gray-600 sm:inline">log scale</span>
      </div>

      {/* Table */}
      {view === "2d" ? (
        <PeriodicTable2D data={cells} selectedZ={selectedZ} onSelect={setSelectedZ} />
      ) : (
        <PeriodicTable3D data={cells} selectedZ={selectedZ} onSelect={setSelectedZ} />
      )}

      {/* Detail panel */}
      {selected && (
        <div className="rounded-lg border border-white/10 bg-surface p-5">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 className="font-serif text-2xl text-accent">
              {selected.name} <span className="text-gray-500">({selected.symbol})</span>
            </h2>
            <span className="text-sm text-muted">
              Z = {selected.z} · {selected.mass} g/mol
              {selected.density !== null && ` · ${selected.density} g/cm³`}
            </span>
            {selected.note && <span className="text-xs italic text-gray-500">{selected.note}</span>}
          </div>
          {selected.price === null ? (
            <p className="mt-3 text-sm text-muted">
              No market price — this element has never been traded in weighable quantities.
            </p>
          ) : (
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
              {METRICS.map((m) => {
                const v = metricValue(selected, m.key);
                return (
                  <div
                    key={m.key}
                    className={`rounded-md px-2 py-1.5 ${m.key === metric ? "bg-white/10" : ""}`}
                  >
                    <dt className="text-[10px] uppercase tracking-wider text-gray-500">{m.label}</dt>
                    <dd className="mt-0.5 text-sm text-white">{v === null ? "—" : formatUSD(v)}</dd>
                  </div>
                );
              })}
            </dl>
          )}
        </div>
      )}

      <p className="text-xs leading-relaxed text-gray-600">
        Prices are approximate USD per kilogram of the pure element, compiled from public market
        data and literature (2019–2025). Synthetic and radioactive elements carry
        order-of-magnitude estimates for research quantities. Gray cells have no market at all.
        Per-liter prices use densities at standard conditions — gases as gas at STP, bromine and
        mercury as liquids.
      </p>
    </div>
  );
}
