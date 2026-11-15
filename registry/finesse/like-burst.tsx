"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * LikeBurst - a heart that pops with a spring, throws a ring and a dozen
 * particles, and rolls the counter up.
 */
export function LikeBurst({ className }: { className?: string }) {
  const [likes, setLikes] = React.useState(128);
  const [liked, setLiked] = React.useState(false);
  const hostRef = React.useRef<HTMLButtonElement>(null);
  const countRef = React.useRef<HTMLSpanElement>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const burst = () => {
    const host = hostRef.current;
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    if (countRef.current && !reduce) {
      countRef.current.animate(
        [{ transform: "translateY(60%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
        { duration: 350, easing: "cubic-bezier(.2,1.4,.3,1)" }
      );
    }
    if (!host || reduce || !next) return;
    host.animate(
      [{ transform: "scale(1)" }, { transform: "scale(.8)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
      { duration: 480, easing: "cubic-bezier(.2,1.4,.3,1)" }
    );
    const ring = document.createElement("span");
    ring.style.cssText = "position:absolute;inset:0;border-radius:9999px;border:2px solid #fb7185;pointer-events:none";
    host.appendChild(ring);
    ring.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(2.1)", opacity: 0 }], { duration: 500, easing: "ease-out" }).onfinish = () => ring.remove();
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("span");
      const a = (i / 12) * Math.PI * 2;
      p.style.cssText = `position:absolute;top:50%;right:50%;width:6px;height:6px;border-radius:9999px;background:${i % 2 ? "#fb7185" : "#f5b453"};pointer-events:none`;
      host.appendChild(p);
      p.animate(
        [{ transform: "translate(50%,-50%) scale(1)", opacity: 1 }, { transform: `translate(calc(50% + ${Math.cos(a) * 52}px), calc(-50% + ${Math.sin(a) * 52}px)) scale(.2)`, opacity: 0 }],
        { duration: 620 + Math.random() * 200, easing: "cubic-bezier(.1,.8,.3,1)" }
      ).onfinish = () => p.remove();
    }
  };

  return (
    <div dir="rtl" className={cn("flex items-center gap-3", className)}>
      <button
        ref={hostRef}
        type="button"
        aria-pressed={liked}
        aria-label="לייק"
        onClick={burst}
        className="relative grid h-12 w-12 place-items-center rounded-full bg-white text-2xl shadow-md ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700"
        style={{ filter: liked ? "none" : "grayscale(1) opacity(.6)" }}
      >
        ❤️
      </button>
      <span ref={countRef} className="text-lg font-bold tabular-nums">{likes}</span>
    </div>
  );
}
