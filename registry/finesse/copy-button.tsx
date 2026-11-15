"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CopyButton - the copy icon morphs into a drawn check with a bubble
 * confirmation, then quietly returns.
 */
export function CopyButton({ className, text = "npm i finesse" }: { className?: string; text?: string }) {
  const [done, setDone] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard?.writeText(text).catch(() => {}); setDone(true); setTimeout(() => setDone(false), 1600); }}
      className={cn("relative flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all", className)}
      style={{
        borderColor: done ? "#2dd4bf" : "#3f3f46",
        background: done ? "rgba(45,212,191,.12)" : "#18181b",
        color: done ? "#2dd4bf" : "#d4d4d8",
        transform: done ? "scale(1.05)" : "scale(1)",
        transitionTimingFunction: "cubic-bezier(.2,1.5,.3,1)",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {done ? (
          <path d="m4 12.5 5 5L20 6.5" strokeDasharray="24" strokeDashoffset="24">
            <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.35s" fill="freeze" />
          </path>
        ) : (
          <><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></>
        )}
      </svg>
      {done ? "הועתק!" : "העתקה"}
    </button>
  );
}
