"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DURATION = 1400;

/**
 * HoldPublish - press and hold to commit. The ring fills while held, drains
 * with a shake when released early, and bursts on completion.
 */
export function HoldPublish({ className, onDone }: { className?: string; onDone?: () => void }) {
  const [state, setState] = React.useState<"idle" | "holding" | "done">("idle");
  const [pct, setPct] = React.useState(0);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const raf = React.useRef(0);
  const start = React.useRef(0);
  const held = React.useRef(0);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const stop = () => cancelAnimationFrame(raf.current);

  const begin = () => {
    if (state === "done") return;
    setState("holding");
    start.current = performance.now() - held.current * DURATION;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start.current) / DURATION);
      held.current = p;
      setPct(p);
      if (p >= 1) {
        setState("done");
        onDone?.();
        if (btnRef.current && !reduce) {
          btnRef.current.animate(
            [{ transform: "scale(1)" }, { transform: "scale(1.15)" }, { transform: "scale(1)" }],
            { duration: 450, easing: "cubic-bezier(.2,1.4,.3,1)" }
          );
        }
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const cancel = () => {
    if (state !== "holding") return;
    stop();
    setState("idle");
    const from = held.current;
    held.current = 0;
    const t0 = performance.now();
    const drain = (t: number) => {
      const k = Math.min(1, (t - t0) / 250);
      setPct(from * (1 - k));
      if (k < 1) raf.current = requestAnimationFrame(drain);
    };
    raf.current = requestAnimationFrame(drain);
    if (btnRef.current && !reduce) {
      btnRef.current.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }],
        { duration: 260 }
      );
    }
  };

  React.useEffect(() => stop, []);

  return (
    <button
      ref={btnRef}
      type="button"
      dir="rtl"
      onPointerDown={begin}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      className={cn("relative select-none overflow-hidden rounded-full px-8 py-3 text-sm font-bold text-white shadow-lg transition-colors",
        state === "done" ? "bg-emerald-500" : "bg-neutral-900 dark:bg-neutral-700")}
      style={{ touchAction: "none", ...({ "--p": pct } as React.CSSProperties) }}
    >
      <span
        className="absolute inset-0 bg-teal-600 transition-none"
        style={{ transform: `scaleX(${state === "done" ? 0 : pct})`, transformOrigin: "right" }}
        aria-hidden
      />
      <span className="relative">{state === "done" ? "פורסם! 🎉" : state === "holding" ? "ממשיכים להחזיק..." : "החזיקו לפרסום"}</span>
    </button>
  );
}
