"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SignaturePad - draw a signature on the canvas; strokes taper like a
 * real pen, and clear wipes with a fade.
 */
export function SignaturePad({ className }: { className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const drawing = React.useRef(false);
  const [empty, setEmpty] = React.useState(true);
  const pos = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  return (
    <div dir="rtl" className={cn("w-72", className)}>
      <canvas
        ref={ref}
        width={560} height={260}
        className="h-32 w-full touch-none rounded-2xl border border-zinc-700 bg-zinc-950"
        style={{ cursor: "crosshair", opacity: empty ? 0.92 : 1, transition: "opacity .3s" }}
        onPointerDown={(e) => {
          drawing.current = true;
          const ctx = ref.current!.getContext("2d")!;
          const p = pos(e);
          ctx.strokeStyle = "#2dd4bf"; ctx.lineCap = "round"; ctx.lineJoin = "round";
          ctx.beginPath(); ctx.moveTo(p.x, p.y);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const ctx = ref.current!.getContext("2d")!;
          const p = pos(e);
          ctx.lineWidth = 3 + (e.pressure || 0.4) * 5;
          ctx.lineTo(p.x, p.y); ctx.stroke();
          setEmpty(false);
        }}
        onPointerUp={() => (drawing.current = false)}
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-zinc-500">חתמו כאן</span>
        <button
          type="button"
          onClick={() => { const c = ref.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); setEmpty(true); }}
          className="rounded-lg border border-zinc-700 px-3 py-1 text-[11px] font-bold text-zinc-300 hover:border-rose-500 hover:text-rose-400"
        >
          ניקוי
        </button>
      </div>
    </div>
  );
}
