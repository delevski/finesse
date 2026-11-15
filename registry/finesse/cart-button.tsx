"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CartButton - adding to cart flies a mini item into the basket icon and
 * the badge pops with the new count.
 */
export function CartButton({ className }: { className?: string }) {
  const [n, setN] = React.useState(2);
  const [fly, setFly] = React.useState(0);
  const [pop, setPop] = React.useState(false);
  const add = () => {
    setFly((f) => f + 1);
    setTimeout(() => { setN((v) => v + 1); setPop(true); setTimeout(() => setPop(false), 450); }, 380);
  };
  return (
    <div dir="rtl" className={cn("flex items-center gap-5", className)}>
      <button type="button" onClick={add}
        className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-bold text-zinc-950 shadow-lg shadow-teal-500/25 transition-transform active:scale-95">
        הוספה לסל
      </button>
      <span className="relative grid h-11 w-11 place-items-center rounded-2xl border border-zinc-700 bg-zinc-900 text-zinc-200">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .6h8.9a1 1 0 0 0 1-.8L20 7H6"/></svg>
        <span
          className="absolute -left-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white"
          style={{ transform: pop ? "scale(1.45)" : "scale(1)", transition: "transform .4s cubic-bezier(.2,1.8,.3,1)" }}
        >
          {n}
        </span>
        {fly > 0 && (
          <span
            key={fly}
            aria-hidden
            className="pointer-events-none absolute right-14 top-1/2 h-3.5 w-3.5 rounded-md bg-teal-400"
            style={{ animation: "cartFly .4s ease-in both" }}
          />
        )}
      </span>
      <style>{`@keyframes cartFly{from{transform:translate(0,-50%) scale(1);opacity:1}to{transform:translate(44px,-50%) scale(.2);opacity:.4}}`}</style>
    </div>
  );
}
