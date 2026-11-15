"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * HoldButton - press and hold: a ring fills around the label, the button
 * tightens, and only a full hold commits the action.
 */
export function HoldButton({ className, label = "החזיקו לאישור", done = "אושר!" }: { className?: string; label?: string; done?: string }) {
  const [p, setP] = React.useState(0);
  const [ok, setOk] = React.useState(false);
  const raf = React.useRef<number>(0);
  const start = () => {
    if (ok) { setOk(false); setP(0); return; }
    const t0 = performance.now();
    const tick = (t: number) => {
      const v = Math.min(1, (t - t0) / 1400);
      setP(v);
      if (v < 1) raf.current = requestAnimationFrame(tick);
      else setOk(true);
    };
    raf.current = requestAnimationFrame(tick);
  };
  const stop = () => { if (!ok && raf.current) { cancelAnimationFrame(raf.current); setP(0); } };
  const C = 2 * Math.PI * 26;
  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      className={cn("relative grid h-16 w-40 select-none place-items-center rounded-2xl border text-sm font-bold transition-all", className)}
      style={{
        borderColor: ok ? "#2dd4bf" : "#3f3f46",
        background: ok ? "rgba(45,212,191,.15)" : "#18181b",
        color: ok ? "#2dd4bf" : "#e4e4e7",
        transform: p > 0 && !ok ? `scale(${1 - p * 0.05})` : "scale(1)",
      }}
    >
      <svg className="absolute inset-0 m-auto" width="52" height="52" viewBox="0 0 60 60" style={{ opacity: p > 0 || ok ? 1 : 0, transition: "opacity .2s" }}>
        <circle cx="30" cy="30" r="26" fill="none" stroke="#3f3f46" strokeWidth="3" opacity=".35" />
        <circle cx="30" cy="30" r="26" fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - (ok ? 1 : p))} transform="rotate(-90 30 30)" />
      </svg>
      {ok ? done : label}
    </button>
  );
}
