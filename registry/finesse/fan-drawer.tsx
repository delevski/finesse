"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FanOption {
  id: string;
  title: string;
  subtitle?: string;
  /** one or two letters shown in the avatar circle */
  initials: string;
}

/**
 * FanDrawer - options unfold like a hand of cards from a shared pivot;
 * the chosen card flies a circular arc and lands in the trigger.
 * RTL-safe: symmetric rotation, physical margins for centering.
 */
export function FanDrawer({
  options,
  value,
  onChange,
  placeholder = "בחירה",
  className,
}: {
  options: FanOption[];
  value?: FanOption | null;
  onChange?: (o: FanOption) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [flying, setFlying] = React.useState(false);
  const [landed, setLanded] = React.useState(false);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const cardRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const pick = async (o: FanOption, i: number) => {
    if (flying) return;
    setFlying(true);
    const card = cardRefs.current[i];
    const trig = triggerRef.current;
    if (!reduce && card && trig) {
      await flyArc(card.getBoundingClientRect(), trig.getBoundingClientRect(), o);
    }
    onChange?.(o);
    setLanded(true);
    setOpen(false);
    setTimeout(() => setLanded(false), 600);
    setTimeout(() => setFlying(false), reduce ? 0 : 350);
  };

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative min-h-[400px] w-full overflow-hidden rounded-xl bg-background",
        className
      )}
      dir="rtl"
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "absolute left-1/2 top-5 z-10 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border bg-card px-5 py-2.5 text-sm font-semibold shadow-sm transition",
          landed && "animate-[landPop_.55s_cubic-bezier(.34,1.8,.64,1)]"
        )}
      >
        {value ? (
          <>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {value.initials}
            </span>
            {value.title}
          </>
        ) : (
          placeholder
        )}
        <span className={cn("transition-transform duration-300", open && "rotate-180")}>▾</span>
      </button>

      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "absolute inset-0 bg-black/55 opacity-0 transition-opacity duration-300",
          open && "opacity-100"
        )}
      />

      <div className="absolute bottom-14 left-1/2 z-[5]">
        {options.map((o, i) => {
          const mid = (options.length - 1) / 2;
          const angle = (i - mid) * 13;
          return (
            <button
              key={o.id}
              type="button"
              ref={(el) => { cardRefs.current[i] = el; }}
              onClick={() => pick(o, i)}
              style={
                {
                  "--a": `${angle}deg`,
                  "--i": i,
                  zIndex: 2 + (options.length - Math.abs(i - mid)),
                  transform: open
                    ? `rotate(${angle}deg)`
                    : "rotate(0deg) translateY(60px) scale(.4)",
                  transitionDelay: `${i * 55}ms`,
                } as React.CSSProperties
              }
              className={cn(
                "absolute bottom-0 left-0 -ml-11 flex h-[122px] w-[88px] origin-[50%_175%] flex-col items-center justify-start gap-1.5 rounded-2xl border bg-card p-3 pt-3 shadow-xl transition-[transform,opacity,border-color] duration-500 [transition-timing-function:cubic-bezier(.2,1.45,.32,1)]",
                open ? "opacity-100" : "pointer-events-none opacity-0",
                "hover:-translate-y-2 hover:border-primary"
              )}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                {o.initials}
              </span>
              <b className="text-center text-[10px] leading-tight">{o.title}</b>
              {o.subtitle && (
                <small className="text-center text-[9px] leading-tight text-muted-foreground">
                  {o.subtitle}
                </small>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Fly a clone of the picked option along a quadratic arc to the trigger. */
function flyArc(from: DOMRect, to: DOMRect, o: FanOption, dur = 680) {
  return new Promise<void>((res) => {
    const x0 = from.left + from.width / 2, y0 = from.top + from.height / 2;
    const x1 = to.left + to.width / 2, y1 = to.top + to.height / 2;
    const el = document.createElement("div");
    el.className =
      "pointer-events-none fixed z-[70] flex items-center gap-2 rounded-xl border bg-card px-3.5 py-2.5 text-sm font-semibold shadow-xl";
    el.textContent = o.title;
    el.style.left = `${x0}px`;
    el.style.top = `${y0}px`;
    document.body.appendChild(el);
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
    const px = -dy / len, py = dx / len, side = x0 <= x1 ? 1 : -1;
    const cx = (x0 + x1) / 2 + px * len * 0.3 * side;
    const cy = (y0 + y1) / 2 + py * len * 0.3 * side - len * 0.08;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const u = 1 - e;
      const x = u * u * x0 + 2 * u * e * cx + e * e * x1;
      const y = u * u * y0 + 2 * u * e * cy + e * e * y1;
      el.style.transform = `translate(-50%,-50%) translate(${x - x0}px,${y - y0}px) scale(${1 - 0.68 * e})`;
      if (t < 1) requestAnimationFrame(step);
      else { el.remove(); res(); }
    };
    requestAnimationFrame(step);
  });
}
