"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CheckboxList - ticking an item draws the check, strikes the label
 * through with an animated line, and drops it below the pending tasks.
 */
const TASKS = ["לסיים את הדף", "לתקן באג RTL", "לעדכן README", "לפרסם גרסה"];

export function CheckboxList({ className }: { className?: string }) {
  const [done, setDone] = React.useState<Set<string>>(new Set());
  const toggle = (t: string) => setDone((s) => { const n = new Set(s); n.has(t) ? n.delete(t) : n.add(t); return n; });
  const ordered = [...TASKS.filter((t) => !done.has(t)), ...TASKS.filter((t) => done.has(t))];
  return (
    <ul dir="rtl" className={cn("w-64 space-y-1", className)}>
      {ordered.map((t) => {
        const isDone = done.has(t);
        return (
          <li key={t}>
            <button
              type="button"
              onClick={() => toggle(t)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-sm transition-all hover:bg-zinc-800/60"
              style={{ color: isDone ? "#71717a" : "#e4e4e7" }}
            >
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-all"
                style={{ borderColor: isDone ? "#2dd4bf" : "#52525b", background: isDone ? "#2dd4bf" : "transparent", transform: isDone ? "scale(1.1)" : "scale(1)", transitionTimingFunction: "cubic-bezier(.2,1.6,.3,1)" }}
              >
                {isDone && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#04211d" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m4 12.5 5 5L20 6.5" strokeDasharray="24" strokeDashoffset="24"><animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.3s" fill="freeze"/></path>
                  </svg>
                )}
              </span>
              <span className="relative">
                {t}
                <span
                  aria-hidden
                  className="absolute right-0 top-1/2 h-px bg-zinc-500 transition-all"
                  style={{ width: isDone ? "100%" : "0%", transitionDuration: ".35s" }}
                />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
