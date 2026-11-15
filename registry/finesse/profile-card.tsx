"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ProfileCard - hover (or tap) slides a stats panel up over the avatar
 * card, bars growing with a stagger.
 */
const STATS = [["עוקבים", 86], ["פרויקטים", 64], ["השפעה", 92]];

export function ProfileCard({ className }: { className?: string }) {
  const [on, setOn] = React.useState(false);
  return (
    <div
      dir="rtl"
      onPointerEnter={(e) => { if (e.pointerType !== "touch") setOn(true); }}
      onPointerLeave={(e) => { if (e.pointerType !== "touch") setOn(false); }}
      onClick={() => setOn((v) => !v)}
      className={cn("relative w-56 cursor-pointer overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900", className)}
    >
      <div className="flex items-center gap-3 p-4">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-teal-700 text-lg font-black text-zinc-950">א</span>
        <div>
          <p className="text-sm font-bold text-zinc-100">אבי כהן</p>
          <p className="text-xs text-zinc-500">מעצב מוצר</p>
        </div>
      </div>
      <div
        className="space-y-2 bg-zinc-800/95 p-4 backdrop-blur transition-transform"
        style={{ transform: on ? "translateY(0)" : "translateY(101%)", transitionDuration: ".45s", transitionTimingFunction: "cubic-bezier(.2,1.3,.3,1)" }}
      >
        {STATS.map(([k, v], i) => (
          <div key={k as string}>
            <div className="flex justify-between text-[11px] text-zinc-400"><span>{k}</span><span dir="ltr">{v}%</span></div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-700">
              <div className="h-full rounded-full bg-teal-400 transition-all"
                style={{ width: on ? `${v}%` : "0%", transitionDuration: ".6s", transitionDelay: `${i * 90}ms`, transitionTimingFunction: "cubic-bezier(.2,1.2,.3,1)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
