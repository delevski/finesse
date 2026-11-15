"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * TaskList - checking a task pops it with confetti ticks and slides it
 * to the done pile with a spring.
 */
const TASKS = [
  { t: "סקיצה ראשונה", d: true },
  { t: "בניית פרוטוטייפ", d: true },
  { t: "בדיקות משתמשים", d: false },
  { t: "השקה", d: false },
];

export function TaskList({ className }: { className?: string }) {
  const [items, setItems] = React.useState(TASKS);
  const [burst, setBurst] = React.useState<string | null>(null);
  const toggle = (t: string) => {
    setItems((arr) => arr.map((x) => (x.t === t ? { ...x, d: !x.d } : x)));
    setBurst(t);
    setTimeout(() => setBurst(null), 700);
  };
  const doneN = items.filter((x) => x.d).length;
  return (
    <div dir="rtl" className={cn("w-64", className)}>
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
        <span>משימות הספרינט</span>
        <span dir="ltr">{doneN}/{items.length}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-teal-400 transition-all" style={{ width: `${(doneN / items.length) * 100}%`, transitionDuration: ".5s", transitionTimingFunction: "cubic-bezier(.2,1.3,.3,1)" }} />
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((x) => (
          <li key={x.t} className="relative">
            <button
              type="button"
              onClick={() => toggle(x.t)}
              className="flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition-all"
              style={{
                borderColor: x.d ? "rgba(45,212,191,.4)" : "#3f3f46",
                background: x.d ? "rgba(45,212,191,.07)" : "#18181b",
                color: x.d ? "#5eead4" : "#e4e4e7",
                transform: burst === x.t ? "scale(1.04)" : "scale(1)",
                transitionTimingFunction: "cubic-bezier(.2,1.6,.3,1)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                {x.d ? <path d="m4 12.5 5 5L20 6.5"/> : <circle cx="12" cy="12" r="8" opacity=".4"/>}
              </svg>
              <span style={{ textDecoration: x.d ? "line-through" : "none", opacity: x.d ? 0.75 : 1 }}>{x.t}</span>
            </button>
            {burst === x.t && x.d && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <span key={i} aria-hidden className="pointer-events-none absolute right-5 top-1/2 h-1.5 w-1.5 rounded-sm"
                style={{
                  background: i % 2 ? "#2dd4bf" : "#fbbf24",
                  animation: `taskConf .6s ${i * 0.02}s ease-out both`,
                  transform: `rotate(${i * 45}deg)`,
                }}
              />
            ))}
          </li>
        ))}
      </ul>
      <style>{`@keyframes taskConf{from{opacity:1;transform:rotate(var(--rr,0deg)) translateY(0) scale(1)}to{opacity:0;transform:rotate(var(--rr,0deg)) translateY(-26px) scale(.4)}}`}</style>
    </div>
  );
}
