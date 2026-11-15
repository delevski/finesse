"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const SPRING = "cubic-bezier(.2,1.25,.3,1)";

/**
 * PlanSwitch - a monthly/yearly pricing toggle. The pill springs to the new
 * side and the price flips vertically like a departures board.
 */
export function PlanSwitch({ className }: { className?: string }) {
  const [yearly, setYearly] = React.useState(false);
  const [price, setPrice] = React.useState(49);
  const barRef = React.useRef<HTMLDivElement>(null);
  const pillRef = React.useRef<HTMLDivElement>(null);
  const btnRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const priceRef = React.useRef<HTMLSpanElement>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const movePill = React.useCallback((i: number) => {
    const bar = barRef.current, pill = pillRef.current, btn = btnRefs.current[i];
    if (!bar || !pill || !btn) return;
    const br = bar.getBoundingClientRect(), tr = btn.getBoundingClientRect();
    if (reduce) {
      pill.style.transform = `translateX(${tr.left - br.left}px)`;
      pill.style.width = `${tr.width}px`;
      return;
    }
    pill.animate(
      [
        { transform: pill.style.transform || "translateX(0px)", width: pill.style.width || `${tr.width}px` },
        { transform: `translateX(${tr.left - br.left}px)`, width: `${tr.width}px` },
      ],
      { duration: 480, easing: SPRING, fill: "forwards" }
    );
    pill.style.transform = `translateX(${tr.left - br.left}px)`;
    pill.style.width = `${tr.width}px`;
  }, [reduce]);

  React.useEffect(() => { movePill(0); }, [movePill]);

  const pick = (i: number) => {
    const toYearly = i === 1;
    if (toYearly === yearly) return;
    setYearly(toYearly);
    movePill(i);
    const next = toYearly ? 39 : 49;
    const el = priceRef.current;
    if (el && !reduce) {
      el.animate(
        [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-110%)", opacity: 0 }],
        { duration: 180, easing: "ease-in", fill: "forwards" }
      ).onfinish = () => {
        setPrice(next);
        el.animate(
          [{ transform: "translateY(110%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
          { duration: 340, easing: SPRING, fill: "forwards" }
        );
      };
    } else setPrice(next);
  };

  return (
    <div dir="rtl" className={cn("flex flex-col items-center gap-5", className)}>
      <div ref={barRef} className="relative flex rounded-full border border-neutral-300 bg-neutral-100 p-1 dark:border-neutral-700 dark:bg-neutral-800">
        <div ref={pillRef} className="absolute top-1 right-1 h-[calc(100%-8px)] rounded-full bg-teal-600 shadow" style={{ width: 96 }} />
        {["חודשי", "שנתי"].map((label, i) => (
          <button
            key={label}
            ref={(el) => { btnRefs.current[i] = el; }}
            type="button"
            onClick={() => pick(i)}
            className={cn(
              "relative z-10 rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-300",
              (yearly ? i === 1 : i === 0) ? "text-white" : "text-neutral-500"
            )}
          >
            {label}
            {i === 1 && (
              <span className="absolute -top-2 left-2 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-amber-950">
                חיסכון 20%
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="flex items-baseline gap-1 text-3xl font-extrabold tabular-nums" dir="ltr">
        <span>₪</span>
        <span ref={priceRef} className="inline-block">{price}</span>
        <span className="text-sm font-medium text-neutral-500">/ לחודש</span>
      </div>
    </div>
  );
}
