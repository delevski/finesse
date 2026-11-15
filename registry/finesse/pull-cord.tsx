"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PullCord - drag the cord down past the threshold and release: it snaps back
 * swinging and toggles the lamp. Pure pointer physics, no library.
 */
export function PullCord({ className }: { className?: string }) {
  const [on, setOn] = React.useState(false);
  const cordRef = React.useRef<HTMLDivElement>(null);
  const knobRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ y0: number; pull: number } | null>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const setPull = (p: number) => {
    const cord = cordRef.current, knob = knobRef.current;
    if (!cord || !knob) return;
    cord.style.height = `${90 + p}px`;
    knob.style.transform = `translateY(${p}px)`;
  };

  const snapBack = (fired: boolean) => {
    const knob = knobRef.current;
    if (!knob) return;
    if (reduce) { setPull(0); return; }
    const frames = fired
      ? [0, -14, 8, -4, 2, 0].map((y) => ({ transform: `translateY(${y}px)` }))
      : [0, 6, -3, 0].map((y) => ({ transform: `translateY(${y}px)` }));
    knob.animate(frames, { duration: fired ? 700 : 380, easing: "ease-out" }).onfinish = () => setPull(0);
    const cord = cordRef.current;
    if (cord) {
      cord.animate(
        fired ? [{ height: "76px" }, { height: "96px" }, { height: "90px" }] : [{ height: "90px" }],
        { duration: fired ? 700 : 300, easing: "ease-out" }
      ).onfinish = () => setPull(0);
    }
  };

  return (
    <div
      dir="rtl"
      className={cn("relative flex w-full max-w-xs flex-col items-center gap-4 rounded-2xl border border-neutral-200 p-6 transition-colors duration-500 dark:border-neutral-700", className)}
      style={{ background: on ? "radial-gradient(220px 160px at 50% 0%, rgba(245,180,83,.25), transparent 70%)" : "transparent" }}
    >
      <div className="text-4xl transition-all duration-500" style={{ filter: on ? "none" : "grayscale(1) opacity(.45)", transform: on ? "scale(1.12)" : "scale(1)" }}>
        💡
      </div>
      <div
        ref={cordRef}
        className="w-0.5 bg-neutral-400 dark:bg-neutral-500"
        style={{ height: 90, touchAction: "none" }}
      />
      <div
        ref={knobRef}
        role="switch"
        aria-checked={on}
        tabIndex={0}
        className="h-7 w-7 cursor-grab rounded-full bg-gradient-to-b from-amber-300 to-amber-500 shadow-md active:cursor-grabbing"
        style={{ touchAction: "none" }}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          drag.current = { y0: e.clientY, pull: 0 };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const p = Math.max(0, Math.min(96, (e.clientY - drag.current.y0) * 0.9));
          drag.current.pull = p;
          setPull(p);
        }}
        onPointerUp={() => {
          const p = drag.current?.pull ?? 0;
          drag.current = null;
          const fired = p > 55;
          if (fired) setOn((v) => !v);
          snapBack(fired);
        }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOn((v) => !v); } }}
      />
      <p className="text-xs text-neutral-500">{on ? "דולק - משכו שוב לכיבוי" : "משכו את החבל להדלקה"}</p>
    </div>
  );
}
