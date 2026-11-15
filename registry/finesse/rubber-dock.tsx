"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const ICONS = ["🏠", "🔍", "📊", "💬", "⚙️", "👤"];

/**
 * RubberDock - macOS-style magnification. Icons scale with a gaussian falloff
 * around the pointer; works with a finger sliding across on touch.
 */
export function RubberDock({ className }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const icons = React.useRef<(HTMLDivElement | null)[]>([]);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const magnify = (clientX: number | null) => {
    icons.current.forEach((el) => {
      if (!el) return;
      let s = 1;
      if (clientX !== null && !reduce) {
        const r = el.getBoundingClientRect();
        const d = clientX - (r.left + r.width / 2);
        s = 1 + 0.85 * Math.exp(-((d / 72) ** 2));
      }
      el.style.transform = `translateY(${-(s - 1) * 26}px) scale(${s})`;
    });
  };

  return (
    <div
      ref={ref}
      dir="rtl"
      className={cn("flex items-end gap-2 rounded-2xl border border-neutral-200/60 bg-white/60 px-3 pb-2 pt-6 shadow-lg backdrop-blur dark:border-neutral-700 dark:bg-neutral-800/60", className)}
      onPointerMove={(e) => magnify(e.clientX)}
      onPointerLeave={() => magnify(null)}
      style={{ touchAction: "pan-y" }}
    >
      {ICONS.map((icon, i) => (
        <div
          key={i}
          ref={(el) => { icons.current[i] = el; }}
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-xl bg-gradient-to-b from-neutral-100 to-neutral-200 text-xl shadow dark:from-neutral-700 dark:to-neutral-800"
          style={{ transition: "transform .18s cubic-bezier(.2,1.2,.3,1)", transformOrigin: "bottom center" }}
        >
          {icon}
        </div>
      ))}
    </div>
  );
}
