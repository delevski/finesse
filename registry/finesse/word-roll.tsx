"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const WORDS = ["אנימציות", "מיקרו־אינטראקציות", "פיזיקה", "ג׳לי"];

/**
 * WordRoll - the headline verb rolls up out of frame while the next one
 * snaps in with a spring, on an endless loop.
 */
export function WordRoll({ className }: { className?: string }) {
  const [i, setI] = React.useState(0);
  const colRef = React.useRef<HTMLDivElement>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  React.useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    const col = colRef.current;
    if (!col) return;
    if (reduce) { col.style.transform = `translateY(${-i * 1.5}em)`; return; }
    col.animate(
      [{ transform: col.style.transform || "translateY(0)" }, { transform: `translateY(${-i * 1.5}em)` }],
      { duration: 560, easing: "cubic-bezier(.2,1.3,.3,1)", fill: "forwards" }
    );
    col.style.transform = `translateY(${-i * 1.5}em)`;
  }, [i, reduce]);

  return (
    <h2 dir="rtl" className={cn("text-2xl font-extrabold leading-normal", className)}>
      אנחנו מייצרים{" "}
      <span className="inline-block h-[1.5em] overflow-hidden align-bottom">
        <span ref={colRef} className="block">
          {WORDS.map((w, k) => (
            <span key={w} className={cn("block h-[1.5em]", k === i ? "text-teal-500" : "text-neutral-400")}>{w}</span>
          ))}
        </span>
      </span>{" "}
      שמרגישות חיות
    </h2>
  );
}
