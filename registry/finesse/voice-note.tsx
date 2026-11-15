"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const HEIGHTS = [35, 55, 80, 60, 90, 45, 70, 95, 50, 65, 85, 40, 75, 95, 55, 70, 45, 88, 60, 78, 42, 68, 92, 58, 72, 38];

/**
 * VoiceNote - a voice-message bubble whose waveform comes alive while
 * playing: bars fill with progress and bounce like an equalizer.
 */
export function VoiceNote({
  seconds = 12,
  className,
}: {
  seconds?: number;
  className?: string;
}) {
  const [playing, setPlaying] = React.useState(false);
  const [t, setT] = React.useState(0);
  const barsRef = React.useRef<(HTMLElement | null)[]>([]);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  React.useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const toggle = () => {
    if (playing) {
      if (timer.current) clearInterval(timer.current);
      setPlaying(false);
      return;
    }
    setPlaying(true);
    const perBar = (seconds * 1000) / HEIGHTS.length;
    timer.current = setInterval(() => {
      setT((prev) => {
        const next = prev + 120;
        const upto = Math.floor(next / perBar);
        barsRef.current.forEach((b, i) => {
          if (!b) return;
          b.classList.toggle("bg-black/70", i < upto);
          if (i >= upto && i < upto + 3 && !reduce) {
            b.animate(
              [{ height: HEIGHTS[i] + "%" }, { height: Math.min(100, HEIGHTS[i] * 1.5) + "%" }, { height: HEIGHTS[i] + "%" }],
              { duration: 300 }
            );
          }
        });
        if (next >= seconds * 1000) {
          if (timer.current) clearInterval(timer.current);
          setPlaying(false);
          barsRef.current.forEach((b) => b?.classList.remove("bg-black/70"));
          return 0;
        }
        return next;
      });
    }, 120);
  };

  const left = Math.max(0, seconds - Math.floor(t / 1000));
  return (
    <div
      dir="rtl"
      className={cn("flex w-[min(300px,86%)] items-center gap-3.5 rounded-2xl rounded-tr-md bg-gradient-to-br from-primary to-primary/70 px-4 py-3.5", className)}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "השהיה" : "נגינה"}
        className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-black/70 text-primary-foreground"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>
      <div className="flex h-9 flex-1 items-center gap-[3px]">
        {HEIGHTS.map((h, i) => (
          <i
            key={i}
            ref={(el) => { barsRef.current[i] = el; }}
            style={{ height: h + "%" }}
            className="w-[3px] rounded-full bg-black/30 transition-colors"
          />
        ))}
      </div>
      <span dir="ltr" className="font-mono text-[11.5px] text-black/70">
        0:{String(left).padStart(2, "0")}
      </span>
    </div>
  );
}
