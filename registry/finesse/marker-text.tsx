"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MarkerText - key phrases get swept with a hand-drawn marker highlight,
 * one after another, like someone marking a printout.
 */
export function MarkerText({ className }: { className?: string }) {
  const [swept, setSwept] = React.useState(0);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const sweep = () => {
    setSwept(0);
    if (reduce) { setSwept(3); return; }
    [1, 2, 3].forEach((n, i) => setTimeout(() => setSwept(n), 350 + i * 480));
  };

  const mark = (i: number, kids: React.ReactNode) => (
    <span className="relative inline-block px-0.5 font-semibold">
      <span
        aria-hidden
        className="absolute inset-0 -skew-x-6 rounded-sm bg-amber-300/70 dark:bg-amber-400/50"
        style={{
          transform: swept >= i ? "skewX(-6deg) scaleX(1)" : "skewX(-6deg) scaleX(0)",
          transformOrigin: "right",
          transition: "transform .45s cubic-bezier(.3,1.1,.4,1)",
        }}
      />
      <span className="relative">{kids}</span>
    </span>
  );

  return (
    <div dir="rtl" className={cn("max-w-md", className)}>
      <p className="text-lg leading-9">
        אנחנו בונים {mark(1, "ממשקים שאנשים זוכרים")}, עם תשומת לב לכל {mark(2, "מיקרו־אינטראקציה")} ועם {mark(3, "פיזיקה אמיתית")} בכל תנועה.
      </p>
      <button type="button" onClick={sweep} className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
        סמנו שוב
      </button>
    </div>
  );
}
