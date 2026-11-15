"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * NumberStepper - plus/minus stepper whose digits roll vertically like
 * an odometer, bouncing on change.
 */
export function NumberStepper({ className, min = 0, max = 9 }: { className?: string; min?: number; max?: number }) {
  const [n, setN] = React.useState(() => Math.max(min, Math.min(max, 3)));
  const bump = (d: number) => setN((v) => Math.max(min, Math.min(max, v + d)));
  return (
    <div dir="ltr" className={cn("flex items-center gap-3", className)}>
      <button type="button" onClick={() => bump(-1)} aria-label="הורדה"
        className="grid h-9 w-9 place-items-center rounded-full border border-zinc-700 bg-zinc-900 text-lg text-zinc-200 transition-transform active:scale-90">−</button>
      <span className="relative h-10 w-8 overflow-hidden text-center">
        <span
          className="absolute inset-x-0 top-0 transition-transform"
          style={{ transform: `translateY(${-(n - min) * 40}px)`, transitionDuration: ".45s", transitionTimingFunction: "cubic-bezier(.2,1.4,.3,1)" }}
        >
          {Array.from({ length: max - min + 1 }, (_, k) => (
            <span key={k} className="block h-10 text-2xl font-black leading-10 text-zinc-100">{min + k}</span>
          ))}
        </span>
      </span>
      <button type="button" onClick={() => bump(1)} aria-label="הוספה"
        className="grid h-9 w-9 place-items-center rounded-full bg-teal-500 text-lg font-bold text-zinc-950 transition-transform active:scale-90">+</button>
    </div>
  );
}
