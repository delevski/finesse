"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * BoardingPass - a flight ticket with a perforated stub: hover tilts it
 * in 3D and the barcode stripes dance.
 */
export function BoardingPass({ className }: { className?: string }) {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  return (
    <div
      dir="rtl"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -10, y: ((e.clientX - r.left) / r.width - 0.5) * 10 });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className={cn("w-72 [perspective:700px]", className)}
    >
      <div
        className="rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl transition-transform"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transitionDuration: tilt.x || tilt.y ? ".1s" : ".5s", transitionTimingFunction: "cubic-bezier(.2,1.3,.3,1)" }}
      >
        <div className="flex items-center justify-between p-4">
          <div><p className="text-[10px] text-zinc-500">מוצא</p><p className="text-xl font-black text-zinc-100" dir="ltr">TLV</p></div>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(90deg)" }}>
            <path d="M17.8 19.2 16 11l3.5-3.5c1.5-1.5 1.5-3 .8-3.8-.8-.8-2.3-.8-3.8.8L13 8 4.8 6.2c-.5-.1-1 .1-1.2.6l-.2.5c-.2.5 0 1.1.5 1.4L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.3 5.1c.3.5.9.7 1.4.5l.5-.2c.5-.2.7-.7.6-1.2z"/>
          </svg>
          <div><p className="text-[10px] text-zinc-500">יעד</p><p className="text-xl font-black text-zinc-100" dir="ltr">LHR</p></div>
        </div>
        <div className="relative border-t border-dashed border-zinc-600 py-1">
          <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-zinc-950" />
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-zinc-950" />
        </div>
        <div className="flex items-end justify-between p-4">
          <div className="flex h-9 items-end gap-[3px]" dir="ltr" aria-hidden>
            {[5,9,3,7,4,8,2,6,9,3,5,7,4,6,8].map((h, i) => (
              <span key={i} className="w-[3px] rounded-sm bg-zinc-200" style={{ height: h * 3.4, animation: `bpBar 1.6s ${i * 0.12}s ease-in-out infinite alternate` }} />
            ))}
          </div>
          <p className="text-[10px] text-zinc-500">מושב 12A · מבטא 3</p>
        </div>
      </div>
      <style>{`@keyframes bpBar{from{transform:scaleY(.55)}to{transform:scaleY(1)}}`}</style>
    </div>
  );
}
