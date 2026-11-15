"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TEXT = "בבוקר הלכנו לים, הרוח הייתה עדינה והמים היו שקופים לגמרי, ואז הילדים בנו טירת חול ענקית עם חפיר וגשר.";

/**
 * ReadAlong - karaoke-style reading: a pill highlight hops word to word at
 * reading pace, with a progress line underneath.
 */
export function ReadAlong({ className }: { className?: string }) {
  const words = React.useMemo(() => TEXT.split(" "), []);
  const [idx, setIdx] = React.useState(-1);
  const [playing, setPlaying] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => { if (timer.current) clearInterval(timer.current); timer.current = null; setPlaying(false); };

  const play = () => {
    if (playing) { stop(); return; }
    setPlaying(true);
    setIdx((v) => (v >= words.length - 1 ? 0 : v));
    timer.current = setInterval(() => {
      setIdx((v) => {
        if (v + 1 >= words.length) { stop(); return v; }
        return v + 1;
      });
    }, 380);
  };

  React.useEffect(() => stop, []);

  return (
    <div dir="rtl" className={cn("max-w-md", className)}>
      <p className="text-xl leading-10">
        {words.map((w, i) => (
          <span
            key={i}
            className="mx-0.5 inline-block rounded-md px-1 transition-all duration-200"
            style={
              i === idx
                ? { background: "#14b8a6", color: "#fff", transform: "translateY(-2px) scale(1.06)" }
                : i < idx
                  ? { color: "#14b8a6" }
                  : undefined
            }
          >
            {w}
          </span>
        ))}
      </p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div className="h-full rounded-full bg-teal-500 transition-all duration-300" style={{ width: `${((idx + 1) / words.length) * 100}%` }} />
      </div>
      <button type="button" onClick={play} className="mt-3 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
        {playing ? "עצירה" : idx >= 0 ? "המשך קריאה" : "קראו לי"}
      </button>
    </div>
  );
}
