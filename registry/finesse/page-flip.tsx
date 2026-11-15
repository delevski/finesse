"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PageFlip - a card whose corner peels like a real page, revealing the
 * back face with a 3D flip.
 */
export function PageFlip({ className }: { className?: string }) {
  const [flip, setFlip] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlip((v) => !v)}
      className={cn("relative h-44 w-40 [perspective:800px]", className)}
      aria-label="הפיכת עמוד"
    >
      <span
        className="absolute inset-0 transition-transform [transform-style:preserve-3d]"
        style={{ transform: flip ? "rotateY(-180deg)" : "none", transitionDuration: ".8s", transitionTimingFunction: "cubic-bezier(.3,1.2,.3,1)" }}
      >
        <span dir="rtl" className="absolute inset-0 grid place-items-center rounded-2xl border border-zinc-700 bg-zinc-900 p-4 text-sm font-bold text-zinc-100 [backface-visibility:hidden]">
          עמוד 1<br /><span className="text-xs font-normal text-zinc-500">לחצו להפיכה</span>
        </span>
        <span dir="rtl" className="absolute inset-0 grid place-items-center rounded-2xl border border-teal-700 bg-teal-950 p-4 text-sm font-bold text-teal-200 [backface-visibility:hidden]" style={{ transform: "rotateY(180deg)" }}>
          עמוד 2<br /><span className="text-xs font-normal text-teal-500">הצד השני!</span>
        </span>
      </span>
    </button>
  );
}
