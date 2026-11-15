"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * NotificationStack - collapsed cards peek behind each other; hover
 * fans them out, and a swipe tosses the top card away.
 */
const NOTES = [
  { t: "ליד חדש נכנס", s: "לפני 2 דקות", c: "#2dd4bf" },
  { t: "התשלום התקבל", s: "לפני שעה", c: "#a78bfa" },
  { t: "משימה הושלמה", s: "אתמול", c: "#fbbf24" },
];

export function NotificationStack({ className }: { className?: string }) {
  const [items, setItems] = React.useState(NOTES);
  const [open, setOpen] = React.useState(false);
  const toss = (t: string, el: HTMLElement) => {
    el.animate([{ transform: "translateX(0) rotate(0)" }, { transform: "translateX(-140%) rotate(-8deg)" }], { duration: 350, easing: "ease-in", fill: "forwards" })
      .onfinish = () => setItems((arr) => arr.filter((n) => n.t !== t));
  };
  return (
    <div
      dir="rtl"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      className={cn("relative h-48 w-72", className)}
    >
      {items.length === 0 && (
        <button type="button" onClick={() => setItems(NOTES)} className="absolute inset-x-0 top-16 rounded-xl border border-dashed border-zinc-700 py-3 text-xs text-zinc-500">
          הכול טופל. להחזיר?
        </button>
      )}
      {items.map((n, i) => (
        <div
          key={n.t}
          onClick={(e) => toss(n.t, e.currentTarget)}
          className="absolute inset-x-0 cursor-pointer rounded-2xl border border-zinc-700 bg-zinc-900 p-3.5 shadow-xl transition-all"
          style={{
            top: open ? i * 62 : i * 14,
            scale: open ? "1" : String(1 - i * 0.04),
            zIndex: items.length - i,
            transitionDuration: ".45s",
            transitionTimingFunction: "cubic-bezier(.2,1.3,.3,1)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: n.c }} />
            <p className="text-sm font-bold text-zinc-100">{n.t}</p>
            <span className="mr-auto text-[10px] text-zinc-500">{n.s}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
