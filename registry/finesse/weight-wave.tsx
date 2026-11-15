"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * WeightWave - a variable-font weight wave. Letters fatten around the
 * pointer; untouched, a slow wave rolls through on its own.
 * Requires a variable font (Heebo wght 100..900 works great for Hebrew).
 */
export function WeightWave({ className, text = "פינסה" }: { className?: string; text?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const letters = React.useRef<(HTMLSpanElement | null)[]>([]);
  const pointer = React.useRef<number | null>(null);
  const weights = React.useRef<number[]>([]);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  React.useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      const els = letters.current;
      els.forEach((el, i) => {
        if (!el) return;
        let target = 400;
        if (pointer.current !== null) {
          const r = el.getBoundingClientRect();
          const d = pointer.current - (r.left + r.width / 2);
          target = 400 + 450 * Math.exp(-((d / 60) ** 2));
        } else {
          target = 400 + 320 * (0.5 + 0.5 * Math.sin(t / 500 - i * 0.9));
        }
        weights.current[i] = (weights.current[i] ?? 400) + (target - (weights.current[i] ?? 400)) * 0.18;
        el.style.fontVariationSettings = `"wght" ${Math.round(weights.current[i])}`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <div
      ref={ref}
      dir="rtl"
      className={cn("cursor-crosshair select-none text-6xl", className)}
      style={{ fontFamily: '"Heebo", sans-serif' }}
      onPointerMove={(e) => { pointer.current = e.clientX; }}
      onPointerLeave={() => { pointer.current = null; }}
    >
      {text.split("").map((ch, i) => (
        <span key={i} ref={(el) => { letters.current[i] = el; }} className="inline-block" style={{ fontVariationSettings: '"wght" 400' }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </div>
  );
}
