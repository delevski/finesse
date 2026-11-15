"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * RangeSlider - a slider with a spring tooltip bubble, gradient fill and
 * snapping ticks every 25.
 */
export function RangeSlider({ className }: { className?: string }) {
  const [v, setV] = React.useState(40);
  const snap = (x: number) => Math.round(x / 25) * 25 === x ? x : x;
  return (
    <div dir="ltr" className={cn("w-64", className)}>
      <div className="relative">
        <input
          type="range" min={0} max={100} value={v}
          onChange={(e) => setV(Number(e.target.value))}
          onMouseUp={() => setV((x) => Math.round(x / 25) * 25)}
          onTouchEnd={() => setV((x) => Math.round(x / 25) * 25)}
          className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none"
          style={{ background: `linear-gradient(90deg, #2dd4bf ${v}%, #3f3f46 ${v}%)` }}
          aria-label="טווח"
        />
        <span
          className="pointer-events-none absolute -top-9 rounded-lg bg-teal-500 px-2 py-1 text-[11px] font-black text-zinc-950 transition-all"
          style={{ left: `calc(${v}% - 14px)`, transform: `scale(${1 + Math.abs(v % 25) / 200})` }}
          dir="ltr"
        >
          {snap(v)}
        </span>
      </div>
      <div className="mt-1.5 flex justify-between px-0.5">
        {[0, 25, 50, 75, 100].map((t) => (
          <span key={t} className="h-1.5 w-0.5 rounded bg-zinc-600" style={{ background: v >= t ? "#2dd4bf" : "#3f3f46" }} />
        ))}
      </div>
      <style>{`input[type=range]::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:50%;background:#f4f4f5;border:3px solid #0d9488;box-shadow:0 2px 8px rgba(0,0,0,.5);cursor:grab}`}</style>
    </div>
  );
}
