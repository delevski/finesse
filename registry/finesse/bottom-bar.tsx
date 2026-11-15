"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * BottomBar - a phone-style tab bar with a goo indicator that stretches
 * toward the tapped tab.
 */
const TABS = [
  { label: "בית", icon: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" /> },
  { label: "חיפוש", icon: <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></> },
  { label: "התראות", icon: <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" /> },
  { label: "פרופיל", icon: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></> },
];

export function BottomBar({ className }: { className?: string }) {
  const [active, setActive] = React.useState(0);
  const W = 72;
  return (
    <div dir="rtl" className={cn("relative flex rounded-3xl border border-zinc-700 bg-zinc-900 p-1.5", className)}>
      <span
        aria-hidden
        className="absolute top-1.5 bottom-1.5 rounded-2xl bg-teal-500/15 transition-all"
        style={{
          right: 6 + active * W,
          width: W - 4,
          transitionDuration: ".5s",
          transitionTimingFunction: "cubic-bezier(.2,1.5,.3,1)",
        }}
      />
      {TABS.map((t, i) => (
        <button
          key={t.label}
          type="button"
          onClick={() => setActive(i)}
          className="relative z-10 flex w-[68px] flex-col items-center gap-1 rounded-2xl py-2 text-[10px] font-semibold transition-colors"
          style={{ color: active === i ? "#2dd4bf" : "#71717a" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: active === i ? "translateY(-2px) scale(1.12)" : "none", transition: "transform .4s cubic-bezier(.2,1.6,.3,1)" }}>
            {t.icon}
          </svg>
          {t.label}
        </button>
      ))}
    </div>
  );
}
