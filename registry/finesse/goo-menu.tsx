"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GooMenu - a FAB whose actions emerge as liquid blobs: an SVG goo filter
 * makes the circles merge with the trigger while they spring out.
 */
const ITEMS = [
  { icon: "✏️", label: "עריכה" },
  { icon: "📎", label: "שיתוף" },
  { icon: "🗑️", label: "מחיקה" },
];

export function GooMenu({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div dir="rtl" className={cn("relative h-56 w-56", className)}>
      <svg width="0" height="0" aria-hidden>
        <defs>
          <filter id="gooMenuFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div className="absolute inset-0" style={{ filter: "url(#gooMenuFilter)" }}>
        <button
          type="button"
          aria-expanded={open}
          aria-label="תפריט פעולות"
          onClick={() => setOpen((v) => !v)}
          className="absolute bottom-4 right-4 z-10 grid h-14 w-14 place-items-center rounded-full bg-teal-600 text-2xl text-white shadow-xl transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "none", transitionTimingFunction: "cubic-bezier(.2,1.3,.3,1)" }}
        >
          +
        </button>
        {ITEMS.map((it, i) => (
          <button
            key={it.label}
            type="button"
            aria-label={it.label}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-teal-600 text-lg shadow-lg transition-transform"
            style={{
              transform: open ? `translateY(${-64 * (i + 1)}px) scale(1)` : "translateY(0) scale(.4)",
              transitionDuration: "420ms",
              transitionDelay: open ? `${i * 60}ms` : `${(ITEMS.length - i) * 40}ms`,
              transitionTimingFunction: open ? "cubic-bezier(.2,1.5,.3,1)" : "ease-in",
            }}
          >
            {it.icon}
          </button>
        ))}
      </div>
      {open && (
        <div className="absolute bottom-5 right-20 flex flex-col items-end gap-[26px] pb-1 text-xs font-semibold text-neutral-500">
          {ITEMS.map((it, i) => (
            <span key={it.label} style={{ animation: `gooLabel .3s ${i * 60 + 120}ms both` }}>{it.label}</span>
          ))}
        </div>
      )}
      <style>{`@keyframes gooLabel{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
