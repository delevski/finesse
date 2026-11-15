"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GlassLens - a lens that follows the pointer over a card and magnifies
 * the content underneath it.
 */
const LINES = ["מבט מקרוב על הדו״ח השבועי", "הכנסות: ₪48,200 (+12%)", "משתמשים פעילים: 8,431", "המרה: 3.8% ← 4.2%"];

export function GlassLens({ className }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  const Z = 1.8, R = 52;
  return (
    <div
      ref={ref}
      dir="rtl"
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onPointerLeave={() => setPos(null)}
      className={cn("relative w-72 cursor-none overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 p-5", className)}
    >
      <div className="space-y-2">
        {LINES.map((l, i) => (
          <p key={i} className={i === 0 ? "text-sm font-bold text-zinc-100" : "text-xs text-zinc-400"}>{l}</p>
        ))}
      </div>
      {pos && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute space-y-2 p-5"
            style={{
              inset: 0,
              transform: `scale(${Z})`,
              transformOrigin: `${pos.x}px ${pos.y}px`,
              clipPath: `circle(${R}px at ${pos.x}px ${pos.y}px)`,
              background: "#27272a",
            }}
          >
            {LINES.map((l, i) => (
              <p key={i} className={i === 0 ? "text-sm font-bold text-teal-300" : "text-xs text-zinc-300"}>{l}</p>
            ))}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute rounded-full border-2 border-teal-400/70 shadow-2xl"
            style={{ width: R * 2, height: R * 2, left: pos.x - R, top: pos.y - R, boxShadow: "inset 0 0 24px rgba(45,212,191,.15), 0 12px 32px rgba(0,0,0,.5)" }}
          />
        </>
      )}
    </div>
  );
}
