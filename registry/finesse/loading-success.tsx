"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * LoadingSuccess - the submit button morphs into a circular spinner while
 * working, then springs back green with a drawn check.
 */
export function LoadingSuccess({ className, onSave }: { className?: string; onSave?: () => Promise<void> | void }) {
  const [state, setState] = React.useState<"idle" | "loading" | "done">("idle");
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const run = async () => {
    if (state !== "idle") return;
    setState("loading");
    try { await onSave?.(); } catch { /* demo keeps flowing */ }
    await new Promise((r) => setTimeout(r, 1400));
    setState("done");
    setTimeout(() => setState("idle"), 2200);
  };

  return (
    <button
      type="button"
      dir="rtl"
      onClick={run}
      disabled={state !== "idle"}
      className={cn(
        "relative grid place-items-center overflow-hidden font-bold text-white shadow-lg",
        state === "done" ? "bg-emerald-500" : "bg-teal-600"
      )}
      style={{
        width: state === "loading" ? 48 : 170,
        height: 48,
        borderRadius: state === "loading" ? 999 : 12,
        transition: reduce ? "none" : "width .45s cubic-bezier(.2,1.2,.3,1), border-radius .45s, background .3s",
      }}
    >
      {state === "idle" && <span className="text-sm">שמירת שינויים</span>}
      {state === "loading" && (
        <svg viewBox="0 0 24 24" className="h-6 w-6 animate-spin" fill="none" aria-label="טוען">
          <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {state === "done" && (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-label="נשמר">
          <path d="m5 12 5 5 9-11" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24" strokeDashoffset="24">
            <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.4s" fill="freeze" />
          </path>
        </svg>
      )}
    </button>
  );
}
