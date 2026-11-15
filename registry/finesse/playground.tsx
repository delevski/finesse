"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MotionPlayground - sliders tune a spring bezier + duration live on a demo
 * ball, and "copy tuned values" puts the CSS on the clipboard.
 */
export function MotionPlayground({ className }: { className?: string }) {
  const [stiff, setStiff] = React.useState(1.4);
  const [dur, setDur] = React.useState(600);
  const [copied, setCopied] = React.useState(false);
  const ballRef = React.useRef<HTMLDivElement>(null);
  const side = React.useRef(1);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const play = () => {
    const el = ballRef.current;
    if (!el) return;
    side.current *= -1;
    if (reduce) { el.style.transform = `translateX(${side.current * 105}px)`; return; }
    const stretch = 1 + 0.16 * (stiff - 1);
    el.animate(
      [
        { transform: `translateX(${-side.current * 105}px) scale(1)` },
        { transform: `translateX(${side.current * 105}px) scale(${stretch.toFixed(2)},${(2 - stretch).toFixed(2)})`, offset: 0.55 },
        { transform: `translateX(${side.current * 105}px) scale(1)` },
      ],
      { duration: dur, easing: `cubic-bezier(.2,${stiff},.3,1)`, fill: "forwards" }
    );
  };

  return (
    <div className={cn("grid w-full max-w-sm justify-items-center gap-6", className)} dir="rtl">
      <div className="grid min-h-[130px] w-full place-items-center">
        <div ref={ballRef} className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-xl" />
      </div>
      <div className="grid w-full gap-3.5">
        <label className="grid gap-1.5 text-xs text-muted-foreground">
          <span className="flex justify-between"><span>קשיחות הקפיץ</span><span dir="ltr">{stiff.toFixed(1)}</span></span>
          <input type="range" min={0.4} max={2.6} step={0.1} value={stiff} onChange={(e) => setStiff(+e.target.value)} className="w-full accent-primary" />
        </label>
        <label className="grid gap-1.5 text-xs text-muted-foreground">
          <span className="flex justify-between"><span>משך (ms)</span><span dir="ltr">{dur}</span></span>
          <input type="range" min={200} max={1400} step={50} value={dur} onChange={(e) => setDur(+e.target.value)} className="w-full accent-primary" />
        </label>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={play} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            נגנו
          </button>
          <button
            type="button"
            className="rounded-xl border px-4 py-2.5 text-xs font-semibold text-muted-foreground"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(`transition-timing-function: cubic-bezier(0.2, ${stiff.toFixed(1)}, 0.3, 1);\ntransition-duration: ${dur}ms;`);
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              } catch { /* clipboard unavailable */ }
            }}
          >
            {copied ? "הועתק!" : "העתק ערכים מכוונים"}
          </button>
        </div>
      </div>
    </div>
  );
}
