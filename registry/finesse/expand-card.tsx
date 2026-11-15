"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ExpandCard - a compact card that springs open in place to reveal
 * detail rows, with a rotating chevron.
 */
const ROWS = [["סטטוס", "פעיל"], ["עדכון אחרון", "לפני שעתיים"], ["בעלים", "צוות המוצר"]];

export function ExpandCard({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      dir="rtl"
      onClick={() => setOpen((v) => !v)}
      className={cn("w-64 cursor-pointer overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 p-4 transition-all", className)}
      style={{ maxHeight: open ? 260 : 76, transitionDuration: ".5s", transitionTimingFunction: "cubic-bezier(.2,1.3,.3,1)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-zinc-100">כרטיס פרויקט</p>
          <p className="text-xs text-zinc-500">לחצו לפרטים</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className="text-zinc-400 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none", transitionDuration: ".4s" }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      <div className="mt-3 space-y-2" style={{ opacity: open ? 1 : 0, transition: "opacity .3s .15s" }}>
        {ROWS.map(([k, v], i) => (
          <div key={k} className="flex justify-between border-t border-zinc-800 pt-2 text-xs"
            style={{ transform: open ? "translateY(0)" : "translateY(8px)", transition: `transform .4s ${i * 60}ms cubic-bezier(.2,1.4,.3,1), opacity .3s ${i * 60}ms`, opacity: open ? 1 : 0 }}>
            <span className="text-zinc-500">{k}</span>
            <span className="font-semibold text-zinc-200">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
