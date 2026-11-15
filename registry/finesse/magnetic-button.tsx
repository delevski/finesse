"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MagneticButton - the button leans toward the pointer inside its field
 * and springs back to rest when the pointer leaves.
 */
export function MagneticButton({ className, children = "לחצו עליי" }: { className?: string; children?: React.ReactNode }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [t, setT] = React.useState({ x: 0, y: 0, hot: false });
  return (
    <div className={cn("grid h-32 w-56 place-items-center", className)}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) setT({ x: dx * 0.35, y: dy * 0.35, hot: true });
        else setT({ x: 0, y: 0, hot: false });
      }}
      onPointerLeave={() => setT({ x: 0, y: 0, hot: false })}
    >
      <button
        ref={ref}
        type="button"
        className="rounded-full bg-teal-500 px-7 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-teal-500/30"
        style={{
          transform: `translate(${t.x}px, ${t.y}px)`,
          transition: t.hot ? "transform .08s linear" : "transform .55s cubic-bezier(.2,1.6,.3,1)",
        }}
      >
        {children}
      </button>
    </div>
  );
}
