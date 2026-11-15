"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const LABELS = ["", "לא התחברתי", "בסדר", "טוב", "ממש טוב", "מושלם!"];

/**
 * StarRating - stars fill with a staggered springy pop and a little spin;
 * the reaction label swaps with a flip.
 */
export function StarRating({ className, onRate }: { className?: string; onRate?: (n: number) => void }) {
  const [rating, setRating] = React.useState(0);
  const [labelKey, setLabelKey] = React.useState(0);
  const starRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const rate = (n: number) => {
    setRating(n);
    setLabelKey((k) => k + 1);
    onRate?.(n);
    if (reduce) return;
    starRefs.current.forEach((el, i) => {
      if (!el || i >= n) return;
      el.animate(
        [{ transform: "scale(.3) rotate(-40deg)" }, { transform: "scale(1.35) rotate(12deg)" }, { transform: "scale(1) rotate(0deg)" }],
        { duration: 460, delay: i * 70, easing: "cubic-bezier(.2,1.5,.3,1)", fill: "backwards" }
      );
    });
  };

  return (
    <div dir="rtl" className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex gap-1" role="radiogroup" aria-label="דירוג">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            ref={(el) => { starRefs.current[n - 1] = el; }}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} כוכבים`}
            onClick={() => rate(n)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <svg viewBox="0 0 24 24" width="30" height="30" strokeLinejoin="round" strokeLinecap="round">
              <path
                d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"
                fill={n <= rating ? "#f5b453" : "none"}
                stroke={n <= rating ? "#f5b453" : "#94a3b8"}
                strokeWidth="1.6"
              />
            </svg>
          </button>
        ))}
      </div>
      <div key={labelKey} className="h-6 text-sm font-semibold text-teal-600 dark:text-teal-400" style={{ animation: "rateLabel .35s cubic-bezier(.2,1.4,.3,1) both" }}>
        {LABELS[rating]}
        <style>{`@keyframes rateLabel{from{opacity:0;transform:translateY(8px) scale(.8)}to{opacity:1;transform:none}}`}</style>
      </div>
    </div>
  );
}
