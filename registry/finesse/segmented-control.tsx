"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SegmentedControl - a four-way segmented control with a spring pill
 * that overshoots then settles.
 */
const SEGS = ["יומי", "שבועי", "חודשי", "שנתי"];

export function SegmentedControl({ className }: { className?: string }) {
  const [i, setI] = React.useState(0);
  return (
    <div dir="rtl" className={cn("relative flex rounded-2xl border border-zinc-700 bg-zinc-900 p-1", className)}>
      <span
        aria-hidden
        className="absolute top-1 bottom-1 rounded-xl bg-teal-500 transition-all"
        style={{
          right: `calc(${i} * 25% + 4px)`,
          width: "calc(25% - 8px)",
          transitionDuration: ".55s",
          transitionTimingFunction: "cubic-bezier(.2,1.5,.3,1)",
        }}
      />
      {SEGS.map((s, k) => (
        <button
          key={s}
          type="button"
          onClick={() => setI(k)}
          className="relative z-10 w-16 py-2 text-xs font-bold transition-colors"
          style={{ color: i === k ? "#04211d" : "#a1a1aa" }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
