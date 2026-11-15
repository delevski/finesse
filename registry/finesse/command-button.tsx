"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CommandButton - a ⌘K button whose key chips shimmer, and which pulses
 * when the real shortcut is pressed.
 */
export function CommandButton({ className }: { className?: string }) {
  const [pulse, setPulse] = React.useState(false);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPulse(true);
        setTimeout(() => setPulse(false), 650);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <button
      type="button"
      onClick={() => { setPulse(true); setTimeout(() => setPulse(false), 650); }}
      className={cn(
        "relative flex items-center gap-2 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 shadow-lg transition-transform",
        className
      )}
      style={{ transform: pulse ? "scale(1.06)" : "scale(1)", transitionTimingFunction: "cubic-bezier(.2,1.6,.3,1)" }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      חיפוש מהיר
      <span className="flex gap-1" dir="ltr">
        {["⌘", "K"].map((k) => (
          <kbd key={k} className="rounded-md border border-zinc-600 bg-zinc-800 px-1.5 py-0.5 text-[11px] font-bold text-zinc-200">{k}</kbd>
        ))}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(45,212,191,.25) 50%, transparent 60%)",
          backgroundSize: "250% 100%",
          animation: "cmdShimmer 2.8s linear infinite",
        }}
      />
      <style>{`@keyframes cmdShimmer{0%{background-position:130% 0}100%{background-position:-130% 0}}`}</style>
    </button>
  );
}
