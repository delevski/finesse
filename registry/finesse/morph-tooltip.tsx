"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MorphTooltip - the "?" button itself grows into the tooltip with a real
 * FLIP morph (position, size and corner radius), never a pop-from-nowhere.
 */
export function MorphTooltip({ className, text = "אפשר לשנות את התוכנית בכל רגע, בלי דפי ביטול ובלי קנסות." }: { className?: string; text?: string }) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const tipRef = React.useRef<HTMLDivElement>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const morph = (toOpen: boolean) => {
    const btn = btnRef.current, tip = tipRef.current;
    if (!btn || !tip) return;
    setOpen(toOpen);
    if (reduce) return;
    if (toOpen) {
      const b = btn.getBoundingClientRect();
      requestAnimationFrame(() => {
        const t = tip.getBoundingClientRect();
        const dx = b.left + b.width / 2 - (t.left + t.width / 2);
        const dy = b.top + b.height / 2 - (t.top + t.height / 2);
        tip.animate(
          [
            { transform: `translate(${dx}px, ${dy}px) scale(${b.width / t.width}, ${b.height / t.height})`, borderRadius: "50%", opacity: 0.6 },
            { transform: "translate(0,0) scale(1,1)", borderRadius: "16px", opacity: 1 },
          ],
          { duration: 420, easing: "cubic-bezier(.2,1.25,.3,1)", fill: "backwards" }
        );
      });
    }
  };

  return (
    <div dir="rtl" className={cn("relative inline-flex flex-col items-center", className)}>
      {open ? (
        <div ref={tipRef} className="w-64 rounded-2xl bg-neutral-900 p-4 text-sm leading-6 text-white shadow-xl dark:bg-neutral-100 dark:text-neutral-900">
          {text}
          <button type="button" onClick={() => morph(false)} className="mt-2 block text-xs font-semibold text-teal-400 dark:text-teal-700">
            הבנתי, תודה
          </button>
        </div>
      ) : (
        <button
          ref={btnRef}
          type="button"
          aria-label="מידע נוסף"
          onClick={() => morph(true)}
          className="grid h-10 w-10 place-items-center rounded-full bg-teal-600 font-bold text-white shadow-lg transition-transform hover:scale-110"
        >
          ?
        </button>
      )}
    </div>
  );
}
