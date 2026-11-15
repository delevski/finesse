"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MorphIsland - a Dynamic-Island-style pill that springs open into a mini
 * music player and settles back with the same physical morph.
 */
export function MorphIsland({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [playing, setPlaying] = React.useState(true);
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const toggle = () => {
    const el = ref.current;
    setOpen((v) => !v);
    setPlaying(true);
    if (!el || reduce) return;
    el.animate(
      [{ transform: "scale(.92, .7)", borderRadius: "999px" }, { transform: "scale(1.04, 1.05)" }, { transform: "scale(1)" }],
      { duration: 520, easing: "cubic-bezier(.2,1.3,.3,1)" }
    );
  };

  return (
    <div dir="rtl" className={cn("flex justify-center", className)}>
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
        className="cursor-pointer select-none overflow-hidden bg-neutral-900 text-white shadow-2xl transition-all duration-500 dark:bg-neutral-100 dark:text-neutral-900"
        style={{
          width: open ? 320 : 150,
          height: open ? 132 : 42,
          borderRadius: open ? 26 : 999,
          transitionTimingFunction: "cubic-bezier(.2,1.2,.3,1)",
        }}
      >
        {!open ? (
          <div className="flex h-full items-center justify-center gap-2 text-sm font-semibold">
            <span className="flex items-end gap-[3px]" aria-hidden>
              {[10, 16, 8, 14].map((h, i) => (
                <span key={i} className="w-[3px] rounded bg-teal-400" style={{ height: h, animation: `islEq 1s ${i * 0.15}s ease-in-out infinite alternate` }} />
              ))}
            </span>
            מתנגן עכשיו
          </div>
        ) : (
          <div className="flex h-full flex-col justify-center gap-2 px-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm font-bold">שיר הבוקר של אורי</div>
            <div className="text-xs opacity-60">פודקאסט המוצר · פרק 12</div>
            <div className="mt-1 flex items-center gap-3">
              <button type="button" onClick={() => setPlaying((p) => !p)} className="grid h-8 w-8 place-items-center rounded-full bg-teal-500 text-sm text-white">
                {playing ? "⏸" : "▶"}
              </button>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-700">
                <div className="h-full w-1/3 rounded-full bg-teal-400" style={playing && !reduce ? { animation: "islProg 12s linear infinite" } : undefined} />
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes islEq{from{transform:scaleY(.4)}to{transform:scaleY(1.2)}}@keyframes islProg{from{width:8%}to{width:96%}}`}</style>
    </div>
  );
}
