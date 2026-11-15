"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface StackCard {
  id: string;
  title: string;
  subtitle?: string;
  accent?: string;
}

/**
 * SwipeStack - an endless deck of cards: drag, fling with real momentum,
 * spring back under the threshold; the deck rotates.
 */
export function SwipeStack({ cards, className }: { cards: StackCard[]; className?: string }) {
  const [order, setOrder] = React.useState<number[]>(cards.map((_, i) => i));
  const drag = React.useRef({ on: false, sx: 0, sy: 0, vx: 0, lx: 0, lt: 0, dx: 0, dy: 0 });
  const [, force] = React.useReducer((x) => x + 1, 0);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const topIdx = order[0];

  return (
    <div
      className={cn("relative grid min-h-[320px] w-full place-items-center", className)}
      dir="rtl"
      onPointerDown={(e) => {
        const d = drag.current;
        d.on = true; d.sx = e.clientX; d.sy = e.clientY; d.dx = 0; d.dy = 0;
        d.vx = 0; d.lx = e.clientX; d.lt = performance.now();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d.on) return;
        const now = performance.now();
        d.vx = (e.clientX - d.lx) / Math.max(1, now - d.lt);
        d.lx = e.clientX; d.lt = now;
        d.dx = e.clientX - d.sx; d.dy = (e.clientY - d.sy) * 0.35;
        force();
      }}
      onPointerUp={() => {
        const d = drag.current;
        if (!d.on) return;
        d.on = false;
        if (Math.abs(d.dx) > 110 || Math.abs(d.vx) > 0.5) {
          const dir = d.dx || d.vx ? Math.sign(d.dx || d.vx) : 1;
          if (!reduce) {
            const el = document.getElementById(`sw-card-${cards[topIdx].id}`);
            if (el) {
              el.style.transition = "transform .5s cubic-bezier(.3,.7,.4,1),opacity .5s";
              el.style.transform = `translateX(calc(-50% + ${dir * 420}px)) rotate(${dir * 28}deg)`;
              el.style.opacity = "0";
            }
          }
          setTimeout(() => setOrder((o) => [...o.slice(1), o[0]]), reduce ? 0 : 260);
        } else {
          force();
        }
      }}
    >
      {order.map((cardIdx, pos) => {
        const c = cards[cardIdx];
        const isTop = pos === 0;
        const d = drag.current;
        const style: React.CSSProperties =
          isTop && d.on
            ? {
                transform: `translateX(calc(-50% + ${d.dx}px)) translateY(${d.dy}px) rotate(${d.dx * 0.09}deg)`,
                zIndex: 10,
                transition: "none",
              }
            : {
                transform: `translateX(-50%) translateY(${pos * 10}px) scale(${1 - pos * 0.05})`,
                zIndex: 10 - pos,
                opacity: pos > 2 ? 0 : 1,
              };
        return (
          <div
            key={c.id}
            id={`sw-card-${c.id}`}
            style={style}
            className={cn(
              "absolute top-6 left-1/2 flex h-[180px] w-[min(250px,78%)] cursor-grab touch-none flex-col gap-2 rounded-2xl border bg-card p-4 shadow-xl transition-[transform,opacity] duration-500 [transition-timing-function:cubic-bezier(.2,1.3,.3,1)] select-none",
              isTop && d.on && "cursor-grabbing"
            )}
          >
            {c.accent && (
              <span
                className="w-fit rounded-full px-2.5 py-0.5 text-[10.5px] font-bold"
                style={{ color: c.accent, background: `color-mix(in srgb, ${c.accent} 18%, transparent)` }}
              >
                כרטיס
              </span>
            )}
            <span className="text-[15.5px] font-bold">{c.title}</span>
            {c.subtitle && <span className="text-xs leading-relaxed text-muted-foreground">{c.subtitle}</span>}
          </div>
        );
      })}
    </div>
  );
}
