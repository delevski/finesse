"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SpringyInput - a field that springs up on focus, floats its label,
 * and shakes with physics on invalid input.
 */
export function SpringyInput({ className }: { className?: string }) {
  const [val, setVal] = React.useState("");
  const [focus, setFocus] = React.useState(false);
  const [shake, setShake] = React.useState(0);
  const bad = val.length > 0 && !val.includes("@");
  return (
    <div dir="rtl" className={cn("relative w-64", className)}>
      <label
        className="pointer-events-none absolute right-3 transition-all"
        style={{
          top: focus || val ? "-9px" : "12px",
          fontSize: focus || val ? "11px" : "14px",
          color: bad ? "#fb7185" : focus ? "#2dd4bf" : "#a1a1aa",
          background: "#18181b",
          padding: "0 4px",
          transitionTimingFunction: "cubic-bezier(.2,1.4,.3,1)",
          transitionDuration: ".3s",
        }}
      >
        אימייל
      </label>
      <input
        dir="rtl"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => { setFocus(false); if (bad) setShake((s) => s + 1); }}
        className="w-full rounded-xl border bg-zinc-900 px-3 py-3 text-sm text-zinc-100 outline-none"
        style={{
          borderColor: bad ? "#fb7185" : focus ? "#2dd4bf" : "#3f3f46",
          transform: focus ? "scale(1.03)" : "scale(1)",
          transition: "border-color .2s, transform .35s cubic-bezier(.2,1.5,.3,1)",
          animation: shake ? "springyShake .45s" : undefined,
        }}
        key={shake}
      />
      {bad && !focus && <p className="mt-1 text-xs text-rose-400">חסר @ - נסו שוב</p>}
      <style>{`@keyframes springyShake{0%{transform:translateX(0)}25%{transform:translateX(7px)}50%{transform:translateX(-6px)}75%{transform:translateX(4px)}100%{transform:translateX(0)}}`}</style>
    </div>
  );
}
