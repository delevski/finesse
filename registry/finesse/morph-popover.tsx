"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MorphPopover - the trigger button itself grows into the popover panel
 * with a FLIP-ish morph and rounded-corner interpolation.
 */
export function MorphPopover({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div dir="rtl" className={cn("relative h-44 w-56", className)}>
      <div
        onClick={() => setOpen((v) => !v)}
        className="absolute bottom-0 right-0 cursor-pointer border border-zinc-700 bg-zinc-900 shadow-xl transition-all"
        style={{
          width: open ? 224 : 120,
          height: open ? 150 : 44,
          borderRadius: open ? 18 : 999,
          transitionDuration: ".5s",
          transitionTimingFunction: "cubic-bezier(.2,1.35,.3,1)",
        }}
      >
        <div className="grid h-11 place-items-center text-sm font-bold"
          style={{ color: open ? "#2dd4bf" : "#e4e4e7", opacity: open ? 0 : 1, transition: "opacity .2s", position: "absolute", insetInline: 0, bottom: open ? "auto" : 0, top: open ? 0 : "auto" }}>
          {open ? "" : "פתיחה"}
        </div>
        <div className="p-4 text-xs" style={{ opacity: open ? 1 : 0, transition: "opacity .3s .18s" }}>
          <p className="mb-2 text-sm font-bold text-zinc-100">פעולות מהירות</p>
          {["שיתוף הקישור", "שכפול הדף", "העברה לארכיון"].map((a) => (
            <button key={a} type="button" className="block w-full rounded-lg px-2 py-1.5 text-right text-zinc-300 hover:bg-zinc-800 hover:text-teal-300">{a}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
