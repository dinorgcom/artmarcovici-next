"use client";

import {
  colorForT,
  cssColor,
  gridPosition,
  textColorOn,
  type ElementDatum,
} from "@/data/elements";

export type ElementCell = {
  el: ElementDatum;
  value: number | null;
  t: number | null; // normalized log position on the price scale, null = no market
};

type Props = {
  data: ElementCell[];
  selectedZ: number | null;
  onSelect: (z: number) => void;
};

export default function PeriodicTable2D({ data, selectedZ, onSelect }: Props) {
  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="grid min-w-[780px] gap-1"
        style={{
          gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
          gridTemplateRows: "repeat(7, auto) 14px repeat(2, auto)",
        }}
      >
        {data.map(({ el, t }) => {
          const { col, row } = gridPosition(el.z);
          const rgb = t === null ? null : colorForT(t);
          const selected = selectedZ === el.z;
          return (
            <button
              key={el.z}
              onClick={() => onSelect(el.z)}
              onMouseEnter={() => onSelect(el.z)}
              onFocus={() => onSelect(el.z)}
              style={{
                gridColumn: col,
                gridRow: row,
                backgroundColor: rgb ? cssColor(rgb) : "#1a1a1a",
                color: rgb ? textColorOn(rgb) : "#666666",
              }}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-[3px] leading-none transition-transform hover:z-10 hover:scale-110 ${
                selected ? "z-10 ring-2 ring-white" : ""
              }`}
              title={el.name}
            >
              <span className="text-[8px] opacity-70">{el.z}</span>
              <span className="text-[11px] font-bold">{el.symbol}</span>
            </button>
          );
        })}
        {/* f-block markers */}
        <div
          style={{ gridColumn: 3, gridRow: 6 }}
          className="flex aspect-square items-center justify-center rounded-[3px] border border-white/10 text-[8px] text-muted"
        >
          57–71
        </div>
        <div
          style={{ gridColumn: 3, gridRow: 7 }}
          className="flex aspect-square items-center justify-center rounded-[3px] border border-white/10 text-[8px] text-muted"
        >
          89–103
        </div>
      </div>
    </div>
  );
}
