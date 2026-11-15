"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DIGIT_H = 46;

/**
 * Odometer - each digit is a reel that rolls to its value with a per-column
 * stagger, like a real mileage counter. Animates when scrolled into view.
 */
export function Odometer({
  value,
  digits = 5,
  groupAfter = 2,
  className,
}: {
  value: number;
  digits?: number;
  /** show a comma separator after this many digit reels */
  groupAfter?: number;
  className?: string;
}) {
  const [display, setDisplay] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const shown = React.useRef(false);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !shown.current) {
          shown.current = true;
          setTimeout(() => setDisplay(value), 350);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  React.useEffect(() => {
    if (shown.current) setDisplay(value);
  }, [value]);

  const str = String(display).padStart(digits, "0").slice(-digits);

  return (
    <div ref={rootRef} className={cn("flex gap-1", className)} dir="ltr" aria-label={String(display)}>
      {Array.from({ length: digits }).map((_, i) => (
        <React.Fragment key={i}>
          <div className="h-[46px] overflow-hidden rounded-lg border bg-card">
            <div
              className="flex flex-col transition-transform duration-1000 [transition-timing-function:cubic-bezier(.22,1,.36,1)] will-change-transform"
              style={{
                transform: `translateY(${-Number(str[i]) * DIGIT_H}px)`,
                transitionDelay: `${i * 70}ms`,
              }}
            >
              {Array.from({ length: 10 }).map((_, d) => (
                <span
                  key={d}
                  className="h-[46px] w-[26px] text-center font-mono text-2xl font-bold leading-[46px] text-primary"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
          {groupAfter > 0 && i === groupAfter - 1 && (
            <span className="font-mono text-xl leading-[46px] text-muted-foreground">,</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
