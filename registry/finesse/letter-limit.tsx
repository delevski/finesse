"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const MAX = 60;

/**
 * LetterLimit - a character budget you can feel. Remaining letters sit as
 * tiles under the field and physically drop off as you spend them.
 */
export function LetterLimit({ className }: { className?: string }) {
  const [value, setValue] = React.useState("");
  const tilesRef = React.useRef<HTMLDivElement>(null);
  const prevLeft = React.useRef(MAX);
  const left = MAX - value.length;
  const tone = left <= 8 ? "#fb7185" : left <= 20 ? "#f5b453" : "#14b8a6";

  React.useEffect(() => {
    const box = tilesRef.current;
    if (!box) return;
    const tiles = Array.from(box.children) as HTMLElement[];
    const spent = MAX - left;
    tiles.forEach((t, i) => {
      const gone = i < spent;
      if (gone && !t.dataset.gone) {
        t.dataset.gone = "1";
        t.animate(
          [
            { transform: "translateY(0) rotate(0deg)", opacity: 1 },
            { transform: `translateY(26px) rotate(${(i % 2 ? -1 : 1) * 70}deg)`, opacity: 0 },
          ],
          { duration: 420, easing: "cubic-bezier(.5,-.2,.7,.4)", fill: "forwards" }
        );
      } else if (!gone && t.dataset.gone) {
        delete t.dataset.gone;
        t.animate(
          [
            { transform: "translateY(-18px) scale(.4)", opacity: 0 },
            { transform: "translateY(0) scale(1)", opacity: 1 },
          ],
          { duration: 380, easing: "cubic-bezier(.2,1.4,.3,1)", fill: "forwards" }
        );
      }
    });
    prevLeft.current = left;
  }, [left]);

  return (
    <div dir="rtl" className={cn("w-full max-w-sm", className)}>
      <textarea
        value={value}
        maxLength={MAX}
        rows={3}
        onChange={(e) => setValue(e.target.value.slice(0, MAX))}
        placeholder="כתבו הודעה קצרה..."
        className="w-full resize-none rounded-xl border border-neutral-300 bg-white p-3 text-sm outline-none transition focus:border-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
      />
      <div className="mt-2 flex items-center justify-between">
        <div ref={tilesRef} className="flex gap-1" aria-hidden>
          {Array.from({ length: MAX }).map((_, i) => (
            <span key={i} className="block h-2 w-1 rounded-full" style={{ background: tone, transition: "background .3s" }} />
          ))}
        </div>
        <span className="text-xs font-semibold tabular-nums" style={{ color: tone, transition: "color .3s" }}>
          נותרו {left}
        </span>
      </div>
    </div>
  );
}
