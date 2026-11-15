"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * DynamicMenu - items you pick get promoted to the top with a FLIP
 * animation, so the menu learns your habits.
 */
const BASE = ["העתקה", "הדבקה", "שיתוף", "שמירה", "מחיקה"];

export function DynamicMenu({ className }: { className?: string }) {
  const [items, setItems] = React.useState(BASE);
  const refs = React.useRef(new Map<string, HTMLElement>());
  const promote = (it: string) => {
    const prev = new Map([...refs.current].map(([k, el]) => [k, el.getBoundingClientRect().top]));
    setItems((arr) => [it, ...arr.filter((x) => x !== it)]);
    requestAnimationFrame(() => {
      refs.current.forEach((el, k) => {
        const before = prev.get(k);
        if (before === undefined) return;
        const dy = before - el.getBoundingClientRect().top;
        if (dy) {
          el.animate([{ transform: `translateY(${dy}px)` }, { transform: "translateY(0)" }], {
            duration: 450, easing: "cubic-bezier(.2,1.3,.3,1)",
          });
        }
      });
    });
  };
  return (
    <div dir="rtl" className={cn("w-52 space-y-1.5", className)}>
      {items.map((it, i) => (
        <button
          key={it}
          ref={(el) => { if (el) refs.current.set(it, el); }}
          type="button"
          onClick={() => promote(it)}
          className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-200 hover:border-teal-600"
        >
          {it}
          {i === 0 && <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[10px] font-bold text-teal-300">שכיח</span>}
        </button>
      ))}
    </div>
  );
}
