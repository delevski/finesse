"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Toolbar - a floating pill toolbar: items pop in with a stagger when it
 * mounts, and each icon shows a springy label bubble above it.
 */
const TOOLS = [
  { label: "מרקר", icon: <><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4z"/></> },
  { label: "טקסט", icon: <path d="M4 7V4h16v3M9 20h6M12 4v16"/> },
  { label: "צורות", icon: <><circle cx="8" cy="8" r="5"/><rect x="12" y="12" width="9" height="9" rx="1.5"/></> },
  { label: "ביטול", icon: <path d="M3 7v6h6M21 17a9 9 0 0 0-15-6.7L3 13"/> },
];

export function Toolbar({ className }: { className?: string }) {
  const [hover, setHover] = React.useState(-1);
  return (
    <div dir="rtl" className={cn("flex gap-1 rounded-full border border-zinc-700 bg-zinc-900/90 p-1.5 shadow-2xl backdrop-blur", className)}>
      {TOOLS.map((t, i) => (
        <span key={t.label} className="relative" onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(-1)}>
          <button
            type="button"
            aria-label={t.label}
            className="grid h-10 w-10 place-items-center rounded-full text-zinc-300 transition-all hover:bg-zinc-800 hover:text-teal-300"
            style={{ animation: `tbIn .5s ${i * 70}ms cubic-bezier(.2,1.5,.3,1) both` }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
          </button>
          <span
            className="pointer-events-none absolute -top-9 right-1/2 translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-200 shadow-lg"
            style={{
              opacity: hover === i ? 1 : 0,
              transform: `translateX(50%) translateY(${hover === i ? 0 : 6}px) scale(${hover === i ? 1 : 0.8})`,
              transition: "all .3s cubic-bezier(.2,1.5,.3,1)",
            }}
          >
            {t.label}
          </span>
        </span>
      ))}
      <style>{`@keyframes tbIn{from{opacity:0;transform:translateY(14px) scale(.6)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
