"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * StepWalker - a progress stepper whose dot hops between steps with a squash
 * bounce while the track fills behind it.
 */
export function StepWalker({
  steps,
  value,
  onChange,
  className,
}: {
  steps: number;
  value: number;
  onChange: (step: number) => void;
  className?: string;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const walkerRef = React.useRef<HTMLDivElement>(null);
  const animating = React.useRef(false);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const go = (to: number) => {
    if (animating.current || to === value || to < 0 || to >= steps) return;
    const track = trackRef.current, walker = walkerRef.current;
    if (!track || !walker) { onChange(to); return; }
    if (reduce) { onChange(to); return; }
    animating.current = true;
    const w = track.offsetWidth;
    const fromX = (value / (steps - 1)) * w;
    const toX = (to / (steps - 1)) * w;
    const ball = walker.querySelector("span");
    walker.animate(
      [
        { transform: `translateX(${fromX}px)` },
        { transform: `translateX(${(fromX + toX) / 2}px) translateY(-22px)`, offset: 0.5 },
        { transform: `translateX(${toX}px)` },
      ],
      { duration: 520, easing: "cubic-bezier(.3,.9,.4,1)", fill: "forwards" }
    );
    ball?.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(.85,1.2)", offset: 0.35 },
        { transform: "scale(1.25,.75)", offset: 0.75 },
        { transform: "scale(1)" },
      ],
      { duration: 520, easing: "ease-out" }
    );
    setTimeout(() => { animating.current = false; onChange(to); }, 500);
  };

  const pct = `${(value / (steps - 1)) * 100}%`;
  return (
    <div className={cn("grid w-full max-w-sm justify-items-center gap-6", className)} dir="rtl">
      <div ref={trackRef} className="relative h-1 w-full rounded-full bg-border">
        <div style={{ width: pct }} className="absolute inset-y-0 right-0 rounded-full bg-primary transition-all duration-500" />
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
          {Array.from({ length: steps }).map((_, i) => (
            <span key={i} className={cn("h-3.5 w-3.5 rounded-full border-[2.5px] bg-card transition-colors", i <= value ? "border-primary bg-primary" : "border-border")} />
          ))}
        </div>
        <div ref={walkerRef} style={{ insetInlineStart: pct }} className="absolute -top-[11px] z-[2] -ms-[13px] grid h-[26px] w-[26px] place-items-center">
          <span className="h-4 w-4 rounded-full bg-primary shadow-[0_0_0_5px] shadow-primary/20" />
        </div>
      </div>
      <div className="flex gap-2.5">
        <button type="button" onClick={() => go(value + 1)} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">השלב הבא</button>
        <button type="button" onClick={() => go(value - 1)} className="rounded-xl border px-4 py-2.5 text-sm text-muted-foreground">חזרה</button>
      </div>
    </div>
  );
}
