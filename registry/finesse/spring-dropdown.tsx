"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SpringDropdown - a menu whose items cascade in with spring overshoot,
 * each item trailing the one above it.
 */
const ITEMS = ["עריכה", "שכפול", "העברה לארכיון", "מחיקה"];

export function SpringDropdown({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [picked, setPicked] = React.useState<string | null>(null);
  return (
    <div dir="rtl" className={cn("relative w-56", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-100"
      >
        {picked ?? "בחרו פעולה"}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .35s cubic-bezier(.2,1.4,.3,1)" }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div className="absolute inset-x-0 top-full z-10 mt-2" style={{ pointerEvents: open ? "auto" : "none" }}>
        {ITEMS.map((it, i) => (
          <button
            key={it}
            type="button"
            tabIndex={open ? 0 : -1}
            onClick={() => { setPicked(it); setOpen(false); }}
            className="block w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-right text-sm text-zinc-200 shadow-lg first:rounded-t-xl last:rounded-b-xl hover:bg-zinc-800 hover:text-teal-300"
            style={{
              transform: open ? "translateY(0) scale(1)" : "translateY(-14px) scale(.92)",
              opacity: open ? 1 : 0,
              transition: "transform .5s cubic-bezier(.2,1.5,.3,1), opacity .25s, background .15s",
              transitionDelay: open ? `${i * 55}ms` : "0ms",
            }}
          >
            {it}
          </button>
        ))}
      </div>
    </div>
  );
}
