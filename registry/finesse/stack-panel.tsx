"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * StackPanel - stacked panels that fan open like a deck on hover, each
 * card rotating out with a spring.
 */
const PANELS = [
  { t: "עיצוב", c: "#2dd4bf" },
  { t: "פיתוח", c: "#a78bfa" },
  { t: "שיווק", c: "#fbbf24" },
];

export function StackPanel({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      dir="rtl"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className={cn("relative h-44 w-44 cursor-pointer", className)}
    >
      {PANELS.map((p, i) => (
        <div
          key={p.t}
          className="absolute inset-0 grid place-items-center rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl transition-all"
          style={{
            transform: open
              ? `rotate(${(i - 1) * 14}deg) translate(${(i - 1) * -52}px, ${Math.abs(i - 1) * 8}px)`
              : `rotate(${(i - 1) * 3}deg)`,
            transitionDuration: ".5s",
            transitionDelay: `${i * 40}ms`,
            transitionTimingFunction: "cubic-bezier(.2,1.4,.3,1)",
            zIndex: PANELS.length - i,
          }}
        >
          <span className="text-sm font-bold" style={{ color: p.c }}>{p.t}</span>
        </div>
      ))}
    </div>
  );
}
