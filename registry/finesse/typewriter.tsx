"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Typewriter - types a sentence, pauses, deletes it and types the next,
 * with a blinking block caret.
 */
const LINES = ["בונים ממשקים שמרגישים חיים.", "אנימציה היא לא קישוט - היא שפה.", "RTL מהקו הראשון."];

export function Typewriter({ className }: { className?: string }) {
  const [i, setI] = React.useState(0);
  const [len, setLen] = React.useState(0);
  React.useEffect(() => {
    const full = LINES[i];
    let t: ReturnType<typeof setTimeout>;
    if (len < full.length) t = setTimeout(() => setLen(len + 1), 55);
    else t = setTimeout(() => setLen(0), 1800);
    if (len === 0 && full.length === 0) setI((i + 1) % LINES.length);
    if (len === 0) t = setTimeout(() => { setI((i + 1) % LINES.length); }, 250);
    return () => clearTimeout(t);
  }, [len, i]);
  return (
    <p dir="rtl" className={cn("min-h-7 text-lg font-bold text-zinc-100", className)}>
      {LINES[i].slice(0, len)}
      <span aria-hidden className="mr-0.5 inline-block h-5 w-2.5 translate-y-0.5 bg-teal-400" style={{ animation: "twBlink 1s steps(1) infinite" }} />
      <style>{`@keyframes twBlink{50%{opacity:0}}`}</style>
    </p>
  );
}
