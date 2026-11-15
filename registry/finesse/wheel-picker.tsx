"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * WheelPicker - an iOS-style drum: scroll or drag spins it in 3D with
 * detents, and the centered row is the selection.
 */
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

export function WheelPicker({ className }: { className?: string }) {
  const [i, setI] = React.useState(2);
  const ref = React.useRef<HTMLDivElement>(null);
  const lock = React.useRef(false);
  const dragY = React.useRef<number | null>(null);
  const go = (d: number) => {
    if (lock.current) return;
    lock.current = true;
    setI((v) => Math.max(0, Math.min(HOURS.length - 1, v + d)));
    setTimeout(() => (lock.current = false), 180);
  };
  return (
    <div
      ref={ref}
      dir="ltr"
      onPointerDown={(e) => { dragY.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { if (dragY.current === null) return; const d = dragY.current - e.clientY; if (Math.abs(d) > 24) { go(d > 0 ? 1 : -1); dragY.current = e.clientY; } }}
      onPointerUp={() => { dragY.current = null; }}
      onPointerCancel={() => { dragY.current = null; }}
      onWheel={(e) => go(e.deltaY > 0 ? 1 : -1)}
      className={cn("relative h-44 w-40 touch-none overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 [perspective:400px]", className)}
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-9 -translate-y-1/2 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/40" />
      <div
        className="absolute inset-x-0 top-1/2 transition-transform"
        style={{ transform: `translateY(${-i * 36 - 18}px)`, transitionDuration: ".4s", transitionTimingFunction: "cubic-bezier(.2,1.3,.3,1)" }}
      >
        {HOURS.map((h, k) => {
          const d = k - i;
          return (
            <button
              key={h}
              type="button"
              onClick={() => setI(k)}
              className="block h-9 w-full text-center text-sm font-bold leading-9"
              style={{
                transform: `rotateX(${-d * 24}deg) translateZ(34px)`,
                opacity: Math.max(0.15, 1 - Math.abs(d) * 0.34),
                color: d === 0 ? "#2dd4bf" : "#71717a",
                transition: "opacity .3s, color .3s",
              }}
            >
              {h}
            </button>
          );
        })}
      </div>
    </div>
  );
}
