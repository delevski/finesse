"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SwipeActions - list rows that reveal actions underneath when swiped:
 * the archive icon wiggles once armed, release snaps the row open.
 */
export function SwipeActions({
  rows,
  onArchive,
  onDelete,
  className,
}: {
  rows: string[];
  onArchive?: (row: string) => void;
  onDelete?: (row: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid w-full max-w-sm gap-2.5", className)} dir="rtl">
      {rows.map((r) => (
        <SwipeRow key={r} text={r} onArchive={() => onArchive?.(r)} onDelete={() => onDelete?.(r)} />
      ))}
    </div>
  );
}

function SwipeRow({ text, onArchive, onDelete }: { text: string; onArchive?: () => void; onDelete?: () => void }) {
  const [dx, setDx] = React.useState(0);
  const [gone, setGone] = React.useState(false);
  const drag = React.useRef({ on: false, x0: 0 });
  const armed = dx > 70;

  if (gone) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-y-0 left-0 flex">
        <button
          type="button"
          aria-label="ארכיון"
          onClick={() => { setDx(0); onArchive?.(); }}
          className={cn("grid w-16 place-items-center bg-blue-500 text-white transition-transform", armed && "-rotate-6 scale-110")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"/></svg>
        </button>
        <button
          type="button"
          aria-label="מחיקה"
          onClick={() => setGone(true)}
          className="grid w-16 place-items-center bg-red-500 text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-1V7"/></svg>
        </button>
      </div>
      <div
        style={{ transform: `translateX(${dx}px)` }}
        className={cn(
          "relative z-[1] flex touch-pan-y items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 text-sm transition-transform duration-300 [transition-timing-function:cubic-bezier(.2,1.3,.3,1)]",
          drag.current.on && "transition-none"
        )}
        onPointerDown={(e) => { drag.current = { on: true, x0: e.clientX }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => { if (drag.current.on) setDx(Math.max(0, Math.min(e.clientX - drag.current.x0, 140))); }}
        onPointerUp={() => { drag.current.on = false; setDx((d) => (d > 70 ? 128 : 0)); }}
      >
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
        {text}
      </div>
    </div>
  );
}
