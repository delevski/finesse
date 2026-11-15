"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Scrubber - a media scrubber with a springy preview bubble that follows
 * the drag and shows the timestamp.
 */
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function Scrubber({ className, duration = 96 }: { className?: string; duration?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [v, setV] = React.useState(0.3);
  const [drag, setDrag] = React.useState(false);
  const set = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setV(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
  };
  return (
    <div dir="ltr" className={cn("w-72", className)}>
      <div
        ref={ref}
        onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); setDrag(true); set(e); }}
        onPointerMove={(e) => drag && set(e)}
        onPointerUp={() => setDrag(false)}
        className="relative h-8 cursor-pointer touch-none"
      >
        <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-zinc-700"
          style={{ transform: `translateY(-50%) scaleY(${drag ? 1.8 : 1})`, transition: "transform .3s cubic-bezier(.2,1.4,.3,1)" }} />
        <span className="absolute right-auto top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-teal-400"
          style={{ left: 0, width: `${v * 100}%`, transform: `translateY(-50%) scaleY(${drag ? 1.8 : 1})`, transition: "transform .3s cubic-bezier(.2,1.4,.3,1)" }} />
        <span className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-zinc-100 shadow"
          style={{ left: `calc(${v * 100}% - 8px)`, transform: `translateY(-50%) scale(${drag ? 1.3 : 1})`, transition: "transform .25s cubic-bezier(.2,1.5,.3,1)" }} />
        <span
          className="pointer-events-none absolute -top-9 rounded-lg bg-zinc-800 px-2 py-1 text-[11px] font-bold text-zinc-100 shadow-lg"
          dir="ltr"
          style={{
            left: `${v * 100}%`,
            transform: `translateX(-50%) translateY(${drag ? 0 : 6}px) scale(${drag ? 1 : 0.7})`,
            opacity: drag ? 1 : 0,
            transition: "all .3s cubic-bezier(.2,1.5,.3,1)",
          }}
        >
          {fmt(v * duration)}
        </span>
      </div>
      <div className="flex justify-between text-[10px] text-zinc-500" dir="ltr"><span>{fmt(v * duration)}</span><span>{fmt(duration)}</span></div>
    </div>
  );
}
