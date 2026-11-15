"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SidebarCollapse - a mini app sidebar that folds to an icon rail with a
 * spring, labels fading as it narrows.
 */
const NAV = [
  { label: "לוח בקרה", icon: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></> },
  { label: "לידים", icon: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></> },
  { label: "הגדרות", icon: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></> },
];

export function SidebarCollapse({ className }: { className?: string }) {
  const [folded, setFolded] = React.useState(false);
  const [active, setActive] = React.useState(0);
  return (
    <div
      dir="rtl"
      className={cn("flex h-56 flex-col gap-1 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 p-2 transition-all", className)}
      style={{ width: folded ? 56 : 168, transitionDuration: ".5s", transitionTimingFunction: "cubic-bezier(.2,1.3,.3,1)" }}
    >
      <button
        type="button"
        onClick={() => setFolded((v) => !v)}
        aria-label="כיווץ תפריט"
        className="mb-2 grid h-8 w-8 place-items-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ transform: folded ? "scaleX(-1)" : "none", transition: "transform .4s" }}><path d="m9 6 6 6-6 6"/></svg>
      </button>
      {NAV.map((n, i) => (
        <button
          key={n.label}
          type="button"
          onClick={() => setActive(i)}
          className="flex items-center gap-2.5 rounded-xl px-2 py-2 text-xs font-semibold transition-colors"
          style={{ background: active === i ? "rgba(45,212,191,.12)" : "transparent", color: active === i ? "#2dd4bf" : "#a1a1aa", justifyContent: folded ? "center" : "flex-start" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="shrink-0">{n.icon}</svg>
          <span style={{ opacity: folded ? 0 : 1, width: folded ? 0 : "auto", overflow: "hidden", transition: "opacity .25s, width .3s", whiteSpace: "nowrap" }}>{n.label}</span>
        </button>
      ))}
    </div>
  );
}
