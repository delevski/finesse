"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * JellySlider - the thumb stretches with drag velocity and wobbles back to a
 * circle on release. The value bubble trails behind with lag.
 */
export function JellySlider({ className, onChange }: { className?: string; onChange?: (v: number) => void }) {
  const [value, setValue] = React.useState(40);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const bubbleRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef(false);
  const lastX = React.useRef(0);
  const bubbleX = React.useRef(0);
  const raf = React.useRef(0);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const render = React.useCallback((v: number, vel: number) => {
    const track = trackRef.current, thumb = thumbRef.current;
    if (!track || !thumb) return;
    const x = (v / 100) * track.clientWidth;
    const stretch = reduce ? 1 : 1 + Math.min(0.5, Math.abs(vel) / 40);
    thumb.style.transform = `translateX(${x}px) translateX(-50%) scaleX(${stretch}) scaleY(${2 - stretch})`;
    thumb.dataset.x = String(x);
  }, [reduce]);

  React.useEffect(() => {
    const loop = () => {
      const thumb = thumbRef.current, bubble = bubbleRef.current, track = trackRef.current;
      if (thumb && bubble && track) {
        const target = parseFloat(thumb.dataset.x || "0");
        bubbleX.current += (target - bubbleX.current) * 0.16;
        bubble.style.transform = `translateX(${bubbleX.current}px) translateX(-50%)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const fromEvent = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    const r = track.getBoundingClientRect();
    const v = Math.round(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
    const vel = e.clientX - lastX.current;
    lastX.current = e.clientX;
    setValue(v);
    onChange?.(v);
    render(v, vel);
  };

  const release = () => {
    drag.current = false;
    const thumb = thumbRef.current;
    if (thumb && !reduce) {
      const x = thumb.dataset.x || "0";
      thumb.animate(
        [
          { transform: `translateX(${x}px) translateX(-50%) scaleX(1.35) scaleY(.65)` },
          { transform: `translateX(${x}px) translateX(-50%) scaleX(.85) scaleY(1.2)` },
          { transform: `translateX(${x}px) translateX(-50%) scaleX(1) scaleY(1)` },
        ],
        { duration: 520, easing: "cubic-bezier(.2,1.4,.3,1)", fill: "forwards" }
      );
    }
  };

  return (
    <div dir="ltr" className={cn("w-full max-w-xs pt-8", className)}>
      <div ref={trackRef} className="relative h-2 rounded-full bg-neutral-200 dark:bg-neutral-700"
        onPointerDown={(e) => { drag.current = true; lastX.current = e.clientX; (e.target as HTMLElement).setPointerCapture(e.pointerId); fromEvent(e); }}
        onPointerMove={(e) => drag.current && fromEvent(e)}
        onPointerUp={release}
        style={{ touchAction: "none" }}
      >
        <div ref={bubbleRef} className="pointer-events-none absolute -top-9 right-auto rounded-md bg-neutral-900 px-2 py-0.5 text-xs font-bold text-white dark:bg-neutral-100 dark:text-neutral-900" style={{ left: 0 }}>
          {value}
        </div>
        <div ref={thumbRef} className="absolute top-1/2 h-6 w-6 -translate-y-1/2 cursor-grab rounded-full bg-teal-500 shadow-md active:cursor-grabbing" style={{ left: 0 }} />
      </div>
    </div>
  );
}
