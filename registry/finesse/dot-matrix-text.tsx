"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * DotMatrixText (adapted from threeui's dot-matrix, MIT) - the word
 * assembles itself from a grid of dots that fade in cell by cell.
 */
export function DotMatrixText({ className, text = "finesse" }: { className?: string; text?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const off = document.createElement("canvas");
    off.width = c.width; off.height = c.height;
    const octx = off.getContext("2d")!;
    octx.fillStyle = "#fff";
    octx.font = "900 44px Inter, sans-serif";
    octx.textAlign = "center"; octx.textBaseline = "middle";
    octx.fillText(text, c.width / 2, c.height / 2);
    const img = octx.getImageData(0, 0, c.width, c.height).data;
    const G = 7;
    const cells: { x: number; y: number; d: number }[] = [];
    for (let y = 0; y < c.height; y += G)
      for (let x = 0; x < c.width; x += G)
        if (img[(y * c.width + x) * 4 + 3] > 128) cells.push({ x, y, d: Math.random() * 1.2 });
    let raf = 0, t0 = performance.now();
    const draw = (t: number) => {
      const el = (t - t0) / 1000;
      ctx.clearRect(0, 0, c.width, c.height);
      cells.forEach((p) => {
        const a = Math.max(0, Math.min(1, (el - p.d) * 2.4));
        const pulse = 0.85 + 0.15 * Math.sin(el * 2 + p.x * 0.05);
        ctx.globalAlpha = a;
        ctx.fillStyle = "#5eead4";
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.1 * pulse * (0.3 + 0.7 * a), 0, 7); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return <canvas ref={ref} width={280} height={80} className={className} aria-label={text} role="img" />;
}
