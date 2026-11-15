"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GooMorph - two blobs that merge and split through an SVG goo filter,
 * morphing a play icon into a pause icon.
 */
export function GooMorph({ className }: { className?: string }) {
  const [on, setOn] = React.useState(false);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setOn((v) => !v)}
      className={cn("relative grid h-24 w-40 place-items-center", className)}
      aria-label={on ? "השהיה" : "ניגון"}
    >
      <svg width="0" height="0" aria-hidden>
        <defs>
          <filter id="gooMorphFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="atop" />
          </filter>
        </defs>
      </svg>
      <span className="absolute inset-0" style={{ filter: "url(#gooMorphFilter)" }}>
        <span
          className="absolute top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-teal-500 transition-all"
          style={{ right: on ? "52%" : "18%", transitionDuration: ".6s", transitionTimingFunction: "cubic-bezier(.2,1.4,.3,1)" }}
        />
        <span
          className="absolute top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-teal-500 transition-all"
          style={{ right: on ? "18%" : "52%", transitionDuration: ".6s", transitionTimingFunction: "cubic-bezier(.2,1.4,.3,1)" }}
        />
      </span>
      <svg viewBox="0 0 24 24" width="26" height="26" className="relative z-10 text-zinc-950" fill="currentColor">
        {on ? <><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></> : <path d="M7 4.8v14.4c0 .8.9 1.3 1.6.9l11-7.2c.6-.4.6-1.4 0-1.8l-11-7.2c-.7-.4-1.6.1-1.6.9z"/>}
      </svg>
    </button>
  );
}
