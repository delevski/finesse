"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * UndoButton - after an action, an undo button appears with a circular
 * countdown; letting it lapse "locks in" the change.
 */
export function UndoButton({ className }: { className?: string }) {
  const [state, setState] = React.useState<"idle" | "undo" | "gone">("idle");
  const C = 2 * Math.PI * 9;
  return (
    <div dir="rtl" className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={() => { setState("undo"); setTimeout(() => setState((s) => (s === "undo" ? "gone" : s)), 4000); }}
        className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-bold text-zinc-950 transition-transform active:scale-95"
      >
        מחיקת פריט
      </button>
      {state === "undo" && (
        <button
          type="button"
          onClick={() => setState("idle")}
          className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-bold text-zinc-200"
          style={{ animation: "undoIn .4s cubic-bezier(.2,1.5,.3,1) both" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" fill="none" stroke="#3f3f46" strokeWidth="2.5" />
            <circle cx="12" cy="12" r="9" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={C} transform="rotate(-90 12 12)">
              <animate attributeName="stroke-dashoffset" from="0" to={String(C)} dur="4s" fill="freeze" />
            </circle>
            <path d="M9 10V7l-3 3 3 3v-3h6" fill="none" stroke="#e4e4e7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ביטול
        </button>
      )}
      {state === "gone" && <span className="text-xs text-zinc-500" style={{ animation: "undoIn .3s both" }}>הפריט נמחק לצמיתות</span>}
      <style>{`@keyframes undoIn{from{opacity:0;transform:translateX(10px) scale(.85)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
