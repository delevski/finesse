"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ExposureSlider - dragging the sun slider crossfades a scene between
 * night and blazing day, with a rotating sun/moon icon.
 */
export function ExposureSlider({ className }: { className?: string }) {
  const [v, setV] = React.useState(35);
  return (
    <div dir="ltr" className={cn("w-64", className)}>
      <div
        className="relative h-32 overflow-hidden rounded-2xl border border-zinc-700 transition-all"
        style={{
          background: `linear-gradient(180deg,
            hsl(${220 - v * 1.4} ${30 + v * 0.5}% ${12 + v * 0.55}%) 0%,
            hsl(${200 - v * 1.1} ${45 + v * 0.4}% ${20 + v * 0.6}%) 100%)`,
        }}
      >
        <span
          className="absolute rounded-full transition-all"
          style={{
            width: 34, height: 34,
            left: `${12 + v * 0.62}%`, top: `${52 - v * 0.32}%`,
            background: v > 50 ? "#fde047" : "#e2e8f0",
            boxShadow: v > 50 ? "0 0 30px rgba(253,224,71,.8)" : "0 0 18px rgba(226,232,240,.5)",
          }}
        />
        <span className="absolute inset-x-0 bottom-0 h-8" style={{ background: `linear-gradient(180deg, transparent, rgba(6,20,16,${0.75 - v * 0.005}))` }} />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>
        <input type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
          style={{ background: `linear-gradient(90deg,#fde047 ${v}%,#3f3f46 ${v}%)` }} aria-label="חשיפה" />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fde047" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
      </div>
      <style>{`input[type=range]::-webkit-slider-thumb{appearance:none;width:16px;height:16px;border-radius:50%;background:#f4f4f5;border:2px solid #0d9488;cursor:grab}`}</style>
    </div>
  );
}
