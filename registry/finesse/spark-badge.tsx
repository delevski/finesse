"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SparkBadge (adapted from threeui's spark-badge, MIT) - a badge with
 * sparks orbiting it on a tiny canvas.
 */
export function SparkBadge({ className, children = "חדש" }: { className?: string; children?: React.ReactNode }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0, t = 0;
    const sparks = Array.from({ length: 14 }, (_, i) => ({
      a: (i / 14) * Math.PI * 2, r: 34 + (i % 4) * 7, s: 0.6 + (i % 3) * 0.35, o: 0.4 + (i % 5) * 0.12,
    }));
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, c.width, c.height);
      sparks.forEach((p) => {
        const ang = p.a + t * p.s;
        const x = c.width / 2 + Math.cos(ang) * p.r;
        const y = c.height / 2 + Math.sin(ang) * p.r * 0.55;
        const tw = 0.5 + 0.5 * Math.sin(t * 3 + p.a * 7);
        ctx.globalAlpha = p.o * tw;
        ctx.fillStyle = "#5eead4";
        ctx.beginPath(); ctx.arc(x, y, 1.4 + tw, 0, 7); ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <span className={cn("relative inline-grid h-20 w-32 place-items-center", className)}>
      <canvas ref={ref} width={128} height={80} className="absolute inset-0" aria-hidden />
      <span className="relative rounded-full bg-teal-500/15 px-4 py-1.5 text-xs font-black text-teal-300 ring-1 ring-teal-500/50">
        {children}
      </span>
    </span>
  );
}
