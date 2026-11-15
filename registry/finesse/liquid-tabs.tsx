"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LiquidTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

/**
 * LiquidTabs - the indicator stretches like jelly toward the new tab, then
 * settles (real FLIP measurement between states).
 */
export function LiquidTabs({ tabs, className }: { tabs: LiquidTab[]; className?: string }) {
  const [active, setActive] = React.useState(0);
  const [swapping, setSwapping] = React.useState(false);
  const barRef = React.useRef<HTMLDivElement>(null);
  const gooRef = React.useRef<HTMLDivElement>(null);
  const btnRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const move = React.useCallback(
    (i: number, animate = true) => {
      const bar = barRef.current, goo = gooRef.current, btn = btnRefs.current[i];
      if (!bar || !goo || !btn) return;
      const gr = bar.getBoundingClientRect(), br = btn.getBoundingClientRect();
      const tx = br.left - gr.left, tw = br.width;
      if (reduce || !animate) {
        goo.style.left = `${tx}px`;
        goo.style.width = `${tw}px`;
        return;
      }
      const curL = parseFloat(goo.style.left || "0") || tx;
      const curW = parseFloat(goo.style.width || "0") || tw;
      const dir = tx > curL ? 1 : -1;
      const midW = Math.abs(tx + (dir > 0 ? tw : 0) - curL) * 1.06;
      const midL = dir > 0 ? curL : tx - 4;
      goo.animate(
        [
          { left: `${curL}px`, width: `${curW}px` },
          { left: `${midL}px`, width: `${midW}px`, offset: 0.45 },
          { left: `${tx}px`, width: `${tw}px` },
        ],
        { duration: 460, easing: "cubic-bezier(.2,1.25,.3,1)", fill: "forwards" }
      );
      goo.style.left = `${tx}px`;
      goo.style.width = `${tw}px`;
    },
    [reduce]
  );

  React.useEffect(() => {
    move(0, false);
    const onResize = () => move(active, false);
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("w-full max-w-sm", className)} dir="rtl">
      <div
        ref={barRef}
        role="tablist"
        className="relative flex gap-0.5 rounded-2xl border bg-card p-1.5"
      >
        <div
          ref={gooRef}
          aria-hidden
          className="absolute bottom-1.5 top-1.5 z-0 rounded-xl bg-primary will-change-[left,width]"
        />
        {tabs.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={i === active}
            ref={(el) => { btnRefs.current[i] = el; }}
            onClick={() => {
              setActive(i);
              move(i);
              setSwapping(true);
              setTimeout(() => setSwapping(false), reduce ? 0 : 180);
            }}
            className={cn(
              "relative z-10 flex-1 rounded-xl px-1 py-2.5 text-[13.5px] font-semibold transition-colors",
              i === active ? "text-primary-foreground" : "text-muted-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        className={cn(
          "mt-4 min-h-[52px] text-center text-sm leading-relaxed text-muted-foreground transition-all duration-200",
          swapping && "-translate-y-1 opacity-0 blur-sm"
        )}
      >
        {tabs[active]?.content}
      </div>
    </div>
  );
}
