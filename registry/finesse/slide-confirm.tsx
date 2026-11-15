"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SlideConfirm - drag the knob across the track; a shimmer hints the
 * direction and the knob springs back if released early.
 */
export function SlideConfirm({ className, label = "החליקו לאישור" }: { className?: string; label?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [x, setX] = React.useState(0);
  const [ok, setOk] = React.useState(false);
  const [drag, setDrag] = React.useState(false);
  const MAX = Math.max(0, (ref.current?.clientWidth || 288) - 56);
  const onMove = (e: React.PointerEvent) => {
    if (!drag || ok) return;
    const r = ref.current!.getBoundingClientRect();
    setX(Math.max(0, Math.min(MAX, r.right - e.clientX - 28)));
  };
  const end = () => {
    setDrag(false);
    if (x > MAX * 0.85) { setX(MAX); setOk(true); }
    else setX(0);
  };
  return (
    <div
      ref={ref}
      dir="rtl"
      onPointerMove={onMove}
      onPointerUp={end}
      onPointerLeave={end}
      className={cn("relative h-14 w-72 touch-none select-none overflow-hidden rounded-full border", className)}
      style={{ borderColor: ok ? "#2dd4bf" : "#3f3f46", background: ok ? "rgba(45,212,191,.15)" : "#18181b" }}
    >
      <span className="pointer-events-none absolute inset-0 grid place-items-center text-xs font-semibold"
        style={{ color: ok ? "#2dd4bf" : "#71717a", opacity: drag ? 0.3 : 1, transition: "opacity .2s" }}>
        {ok ? "אושר!" : label}
      </span>
      {!ok && (
        <span aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(90deg, transparent 30%, rgba(45,212,191,.18) 50%, transparent 70%)", backgroundSize: "200% 100%", animation: "slideShine 2.2s linear infinite" }} />
      )}
      <span
        role="slider" aria-valuenow={Math.round((x / MAX) * 100)} aria-label={label} tabIndex={0}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setX(MAX); setOk(true); } }}
        className="absolute right-1 top-1 grid h-12 w-12 cursor-grab place-items-center rounded-full bg-teal-500 text-zinc-950 shadow-lg"
        style={{ transform: `translateX(${-x}px)`, transition: drag ? "none" : "transform .5s cubic-bezier(.2,1.5,.3,1)" }}
      >
        {ok ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="m4 12.5 5 5L20 6.5"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m14 6-6 6 6 6"/></svg>
        )}
      </span>
      <style>{`@keyframes slideShine{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}
