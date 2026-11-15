"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SunsetToggle - a mini landscape: the sun sinks, the sky gradient sweeps to
 * dusk, and stars come out. A sunset instead of a switch.
 */
export function SunsetToggle({ className }: { className?: string }) {
  const [dusk, setDusk] = React.useState(false);
  const stars = React.useMemo(
    () => Array.from({ length: 14 }).map((_, i) => ({ top: 6 + ((i * 37) % 44), left: 4 + ((i * 61) % 92), delay: (i % 7) * 0.1 })),
    []
  );

  return (
    <div className={cn("grid w-full max-w-sm justify-items-center gap-4", className)} dir="rtl">
      <div className="relative h-[220px] w-full overflow-hidden rounded-2xl border">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-b from-sky-300 via-amber-200 to-amber-300 transition-all duration-1000",
            dusk && "brightness-[.32] hue-rotate-180 saturate-150"
          )}
        />
        <div
          className={cn(
            "absolute left-1/2 top-[18%] -ms-[26px] h-[52px] w-[52px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff7d6,#fbbf24_70%)] shadow-[0_0_34px_10px_rgba(251,191,36,.55)] transition-all duration-1000 [transition-timing-function:cubic-bezier(.4,0,.6,1)]",
            dusk && "translate-y-[150px] bg-[radial-gradient(circle_at_35%_35%,#e2e8f0,#94a3b8_70%)] shadow-[0_0_22px_6px_rgba(148,163,184,.35)]"
          )}
        />
        <div
          className={cn(
            "absolute -bottom-1 -inset-x-[6%] h-[44%] bg-[radial-gradient(120%_130%_at_50%_130%,#14532d_60%,transparent_61%),radial-gradient(140%_150%_at_18%_135%,#166534_58%,transparent_59%)] transition-all duration-1000",
            dusk && "brightness-[.35]"
          )}
        />
        {stars.map((s, i) => (
          <span
            key={i}
            style={{ top: s.top + "%", left: s.left + "%", transitionDelay: s.delay + "s" }}
            className={cn("absolute h-[3px] w-[3px] rounded-full bg-white opacity-0 transition-opacity duration-700", dusk && "opacity-90")}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setDusk((d) => !d)}
        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        {dusk ? "האירו" : "החשכה"}
      </button>
    </div>
  );
}
