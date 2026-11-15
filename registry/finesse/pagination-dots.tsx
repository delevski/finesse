"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const PAGES = 5;

/**
 * PaginationDots - a liquid "worm" that stretches toward the active dot and
 * snaps onto it, instead of a dot simply getting bigger.
 */
export function PaginationDots({ className }: { className?: string }) {
  const [active, setActive] = React.useState(0);
  const barRef = React.useRef<HTMLDivElement>(null);
  const wormRef = React.useRef<HTMLDivElement>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const GAP = 28;

  const go = (i: number) => {
    const next = Math.max(0, Math.min(PAGES - 1, i));
    setActive(next);
    const worm = wormRef.current;
    if (!worm) return;
    const from = parseFloat(worm.dataset.x || "0");
    const to = next * GAP;
    if (reduce) { worm.style.transform = `translateX(${-to}px)`; worm.dataset.x = String(to); return; }
    const dir = to > from ? 1 : -1;
    const stretch = Math.abs(to - from) + 10;
    worm.animate(
      [
        { transform: `translateX(${-from}px) scaleX(1)` },
        { transform: `translateX(${-(from + (to - from) * 0.5)}px) scaleX(${stretch / 10})`, offset: 0.45 },
        { transform: `translateX(${-to}px) scaleX(1)` },
      ],
      { duration: 460, easing: "cubic-bezier(.2,1.2,.3,1)", fill: "forwards", direction: dir < 0 ? "normal" : "normal" }
    );
    worm.dataset.x = String(to);
    worm.style.transform = `translateX(${-to}px)`;
  };

  return (
    <div dir="rtl" className={cn("flex items-center gap-4", className)}>
      <button type="button" aria-label="הקודם" onClick={() => go(active - 1)} className="grid h-8 w-8 place-items-center rounded-full border border-neutral-300 dark:border-neutral-600">→</button>
      <div ref={barRef} className="relative flex items-center" style={{ gap: GAP - 10, padding: "0 5px" }}>
        <div ref={wormRef} className="absolute right-0 h-2.5 w-2.5 rounded-full bg-teal-500" style={{ transformOrigin: "center" }} />
        {Array.from({ length: PAGES }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`עמוד ${i + 1}`}
            onClick={() => go(i)}
            className="h-2.5 w-2.5 rounded-full bg-neutral-300 transition-transform hover:scale-125 dark:bg-neutral-600"
            style={{ visibility: i === active ? "hidden" : "visible" }}
          />
        ))}
      </div>
      <button type="button" aria-label="הבא" onClick={() => go(active + 1)} className="grid h-8 w-8 place-items-center rounded-full border border-neutral-300 dark:border-neutral-600">←</button>
    </div>
  );
}
