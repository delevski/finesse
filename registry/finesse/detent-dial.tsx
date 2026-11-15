"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const STEPS = 10;

/**
 * DetentDial - a rotary knob with real detents. Drag to spin; on release it
 * snaps to the nearest tick with a spring and lights the active mark.
 */
export function DetentDial({ className, onChange }: { className?: string; onChange?: (v: number) => void }) {
  const [value, setValue] = React.useState(4);
  const knobRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ y0: number; v0: number; v: number } | null>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const angle = (v: number) => -135 + (v / STEPS) * 270;

  const render = (v: number, animate = false) => {
    const knob = knobRef.current;
    if (!knob) return;
    const a = angle(v);
    if (animate && !reduce) {
      const from = parseFloat(knob.dataset.a || "0");
      knob.dataset.a = String(a);
      knob.animate([{ transform: `rotate(${from}deg)` }, { transform: `rotate(${a + (a > from ? 8 : -8)}deg)` }, { transform: `rotate(${a}deg)` }], {
        duration: 380,
        easing: "cubic-bezier(.2,1.3,.3,1)",
        fill: "forwards",
      });
    }
    knob.style.transform = `rotate(${a}deg)`;
  };

  React.useEffect(() => { render(value); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  return (
    <div dir="rtl" className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative h-40 w-40">
        {Array.from({ length: STEPS + 1 }).map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-2 w-1 rounded-full transition-colors"
            style={{
              transform: `translate(-50%,-50%) rotate(${angle(i)}deg) translateY(-74px)`,
              background: i <= value ? "#14b8a6" : "#475569",
              transformOrigin: "center",
            }}
          />
        ))}
        <div
          ref={knobRef}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={STEPS}
          aria-valuenow={value}
          tabIndex={0}
          className="absolute inset-4 cursor-grab rounded-full bg-gradient-to-b from-neutral-100 to-neutral-300 shadow-lg active:cursor-grabbing dark:from-neutral-600 dark:to-neutral-800"
          style={{ touchAction: "none", transition: reduce ? "none" : undefined }}
          onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); drag.current = { y0: e.clientY, v0: value, v: value }; }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const v = Math.max(0, Math.min(STEPS, drag.current.v0 + (drag.current.y0 - e.clientY) / 22));
            drag.current.v = v;
            render(v);
            setValue(Math.round(v));
          }}
          onPointerUp={() => {
            if (!drag.current) return;
            const snapped = Math.round(drag.current.v);
            drag.current = null;
            setValue(snapped);
            onChange?.(snapped);
            render(snapped, true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") { setValue((v) => { const n = Math.min(STEPS, v + 1); render(n, true); return n; }); }
            if (e.key === "ArrowDown" || e.key === "ArrowRight") { setValue((v) => { const n = Math.max(0, v - 1); render(n, true); return n; }); }
          }}
        >
          <span className="absolute left-1/2 top-2 h-5 w-1 -translate-x-1/2 rounded-full bg-teal-600" />
        </div>
      </div>
      <div dir="ltr" className="text-2xl font-extrabold tabular-nums">{value}<span className="text-sm font-medium text-neutral-500"> / {STEPS}</span></div>
    </div>
  );
}
