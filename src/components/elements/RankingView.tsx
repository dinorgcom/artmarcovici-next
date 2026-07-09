"use client";

import { useMemo } from "react";
import {
  ELEMENTS,
  colorForT,
  cssColor,
  formatUSD,
  metricValue,
  type MetricKey,
} from "@/data/elements";
import type { ElementCell } from "./PeriodicTable2D";

type Props = {
  data: ElementCell[];
  metric: MetricKey;
  selectedZ: number | null;
  onSelect: (z: number) => void;
};

// Rank 1 = most expensive, computed once as the $/kg baseline.
function kgRanks(): Map<number, number> {
  const priced = ELEMENTS.filter((el) => el.price !== null).sort(
    (a, b) => metricValue(b, "kg")! - metricValue(a, "kg")!
  );
  return new Map(priced.map((el, i) => [el.z, i + 1]));
}

export default function RankingView({ data, metric, selectedZ, onSelect }: Props) {
  const rows = useMemo(() => {
    const baseline = kgRanks();
    return data
      .filter((c): c is ElementCell & { value: number; t: number } => c.value !== null)
      .sort((a, b) => b.value - a.value)
      .map((cell, i) => ({
        cell,
        rank: i + 1,
        delta: metric === "kg" ? 0 : (baseline.get(cell.el.z) ?? i + 1) - (i + 1),
      }));
  }, [data, metric]);

  return (
    <div className="max-h-[65vh] overflow-y-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(({ cell, rank, delta }) => {
            const rgb = colorForT(cell.t);
            const selected = selectedZ === cell.el.z;
            return (
              <tr
                key={cell.el.z}
                onClick={() => onSelect(cell.el.z)}
                onMouseEnter={() => onSelect(cell.el.z)}
                className={`cursor-pointer border-b border-white/5 transition-colors ${
                  selected ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <td className="w-10 px-3 py-1.5 text-right text-xs text-gray-500">{rank}</td>
                <td className="w-14 px-1 py-1.5 text-center text-xs">
                  {metric !== "kg" &&
                    (delta > 0 ? (
                      <span className="text-red-400">▲{delta}</span>
                    ) : delta < 0 ? (
                      <span className="text-emerald-400">▼{-delta}</span>
                    ) : (
                      <span className="text-gray-600">=</span>
                    ))}
                </td>
                <td className="w-32 whitespace-nowrap py-1.5 pr-2">
                  <span className="font-bold text-white">{cell.el.symbol}</span>{" "}
                  <span className="text-xs text-gray-400">{cell.el.name}</span>
                </td>
                <td className="py-1.5 pr-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 rounded-sm"
                      style={{
                        width: `${Math.max(1, cell.t * 100)}%`,
                        backgroundColor: cssColor(rgb),
                      }}
                    />
                    <span className="whitespace-nowrap text-xs text-gray-300">
                      {formatUSD(cell.value)}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
