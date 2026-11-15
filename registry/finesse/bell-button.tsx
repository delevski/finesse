"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * BellButton - the bell rings with a real swing arc and spark particles,
 * and the badge counts up.
 */
export function BellButton({ className }: { className?: string }) {
  const [n, setN] = React.useState(3);
  const [ring, setRing] = React.useState(0);
  return (
    <button
      type="button"
      aria-label={`${n} התראות`}
      onClick={() => { setRing((r) => r + 1); setN(0); }}
      className={cn("relative grid h-12 w-12 place-items-center rounded-2xl border border-zinc-700 bg-zinc-900 text-zinc-200", className)}
    >
      <svg key={ring} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        style={{ transformOrigin: "top center", animation: ring ? "bellRing .8s cubic-bezier(.2,1.4,.3,1)" : "none" }}>
        <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </svg>
      {n > 0 && (
        <span className="absolute -left-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white"
          style={{ animation: "bellPop .4s cubic-bezier(.2,1.8,.3,1) both" }}>{n}</span>
      )}
      {ring > 0 && [0, 1, 2, 3, 4, 5].map((i) => (
        <span key={`${ring}-${i}`} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-teal-300"
          style={{ animation: `bellSpark .6s ${i * 0.03}s ease-out both`, transform: `rotate(${i * 60}deg)` }} />
      ))}
      <style>{`@keyframes bellRing{0%{transform:rotate(0)}20%{transform:rotate(18deg)}45%{transform:rotate(-14deg)}70%{transform:rotate(8deg)}100%{transform:rotate(0)}}
@keyframes bellPop{from{transform:scale(.4)}to{transform:scale(1)}}
@keyframes bellSpark{from{opacity:1;transform:rotate(var(--r,0)) translateY(-4px) scale(1)}to{opacity:0;transform:rotate(var(--r,0)) translateY(-20px) scale(.3)}}`}</style>
    </button>
  );
}
