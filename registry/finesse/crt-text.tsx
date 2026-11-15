"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CRTText (adapted from threeui's crt, MIT) - text boots up like an old
 * CRT: a bright line snaps open, scanlines and a subtle flicker follow.
 */
export function CRTText({ className, children = "SYSTEM ONLINE" }: { className?: string; children?: React.ReactNode }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setOn(true), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <button type="button" onClick={() => { setOn(false); setTimeout(() => setOn(true), 250); }} className={cn("block", className)} aria-label="הפעלה מחדש של המסך">
      <span
        dir="ltr"
        className="relative inline-block overflow-hidden rounded-lg bg-zinc-950 px-6 py-3 font-mono text-lg font-bold tracking-widest text-teal-300"
        style={{
          transform: on ? "scaleY(1)" : "scaleY(0.01)",
          filter: on ? "brightness(1)" : "brightness(3)",
          transition: "transform .5s cubic-bezier(.2,1.2,.3,1), filter .6s",
          textShadow: "0 0 12px rgba(45,212,191,.7)",
        }}
      >
        {children}
        <span aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: "repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,.28) 2px 3px)", animation: "crtFlick 4s linear infinite" }} />
      </span>
      <style>{`@keyframes crtFlick{0%,94%,100%{opacity:1}95%{opacity:.86}97%{opacity:.94}}`}</style>
    </button>
  );
}
