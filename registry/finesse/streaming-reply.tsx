"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const FULL = "היי! סקרתי את הבקשה שלך - הוספתי שלוש אנימציות חדשות לגלריה, תיקנתי את הריווח במובייל, והכול עבר בדיקה נקייה. רוצה שאעלה גרסה?";

/**
 * StreamingReply - an AI answer that streams in chunk by chunk with a block
 * cursor, the bubble growing with a soft spring under the text.
 */
export function StreamingReply({ className }: { className?: string }) {
  const [shown, setShown] = React.useState(0);
  const [streaming, setStreaming] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const start = () => {
    if (streaming) return;
    if (reduce) { setShown(FULL.length); return; }
    setShown(0);
    setStreaming(true);
    timer.current = setInterval(() => {
      setShown((v) => {
        const next = v + 2 + Math.floor(Math.random() * 4);
        if (next >= FULL.length) {
          if (timer.current) clearInterval(timer.current);
          setStreaming(false);
          return FULL.length;
        }
        return next;
      });
    }, 70);
  };

  React.useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return (
    <div dir="rtl" className={cn("flex w-full max-w-sm flex-col items-start gap-3", className)}>
      <div className="min-h-[72px] w-full rounded-2xl rounded-tr-sm bg-neutral-100 p-4 text-sm leading-7 transition-all dark:bg-neutral-800">
        {FULL.slice(0, shown)}
        {streaming && <span className="mx-0.5 inline-block h-4 w-2 animate-pulse rounded-[2px] bg-teal-500 align-middle" />}
        {!streaming && shown === 0 && <span className="text-neutral-400">התשובה תופיע כאן...</span>}
      </div>
      <button type="button" onClick={start} disabled={streaming} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
        {shown > 0 && !streaming ? "הזרימו שוב" : "שאלו את הסוכן"}
      </button>
    </div>
  );
}
