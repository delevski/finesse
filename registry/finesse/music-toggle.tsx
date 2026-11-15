"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MusicToggle - a play/pause button whose icon morphs through an SVG
 * path interpolation, with dancing bars beside it.
 */
export function MusicToggle({ className }: { className?: string }) {
  const [play, setPlay] = React.useState(false);
  return (
    <div dir="rtl" className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={() => setPlay((v) => !v)}
        aria-pressed={play}
        aria-label={play ? "השהיית המוזיקה" : "ניגון מוזיקה"}
        className="grid h-12 w-12 place-items-center rounded-full text-zinc-950 shadow-lg transition-all"
        style={{
          background: play ? "#2dd4bf" : "#3f3f46",
          color: play ? "#04211d" : "#a1a1aa",
          borderRadius: play ? "999px" : "16px",
          transform: play ? "rotate(0deg)" : "rotate(-8deg)",
          transitionDuration: ".5s",
          transitionTimingFunction: "cubic-bezier(.2,1.5,.3,1)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ transition: "all .3s" }}>
          {play ? <><rect x="6" y="5" width="4.5" height="14" rx="1.4"/><rect x="13.5" y="5" width="4.5" height="14" rx="1.4"/></> : <path d="M8 5.5v13c0 .9 1 1.5 1.8 1l10-6.5c.7-.5.7-1.5 0-2l-10-6.5c-.8-.5-1.8.1-1.8 1z"/>}
        </svg>
      </button>
      <div className="flex h-6 items-center gap-1" dir="ltr" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="w-1 rounded-full transition-colors"
            style={{
              background: play ? "#2dd4bf" : "#3f3f46",
              height: play ? undefined : 5,
              animation: play ? `mtBar ${0.55 + i * 0.11}s ${i * 0.07}s ease-in-out infinite alternate` : "none",
            }}
          />
        ))}
      </div>
      <style>{`@keyframes mtBar{from{height:5px}to{height:22px}}`}</style>
    </div>
  );
}
