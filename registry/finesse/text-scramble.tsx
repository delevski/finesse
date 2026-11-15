"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const HEBREW_POOL = "אבגדהוזחטיכלמנסעפצקרשת";

/**
 * TextScramble - the text decodes letter by letter when it scrolls into view,
 * random glyphs before each character settles. Hebrew-aware (RTL).
 */
export function TextScramble({
  text,
  className,
  speed = 52,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const raf = React.useRef<number>(0);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const play = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    if (reduce) { el.textContent = text; return; }
    const chars = [...text];
    const t0 = performance.now();
    const total = chars.length * speed + 380;
    const step = (now: number) => {
      const t = now - t0;
      let out = "";
      chars.forEach((ch, i) => {
        if (ch === " ") { out += " "; return; }
        if (t > i * speed + 380) out += ch;
        else if (t > i * speed)
          out += `<span class="opacity-40">${HEBREW_POOL[Math.floor(Math.random() * HEBREW_POOL.length)]}</span>`;
        else out += '<span class="opacity-0">_</span>';
      });
      el.innerHTML = out;
      if (t < total) raf.current = requestAnimationFrame(step);
      else el.textContent = text;
    };
    raf.current = requestAnimationFrame(step);
  }, [text, speed, reduce]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) { play(); io.disconnect(); }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); };
  }, [play]);

  return (
    <span
      ref={ref}
      dir="rtl"
      onClick={play}
      className={cn("inline-block min-h-[1.4em] cursor-pointer font-extrabold", className)}
      aria-label={text}
    >
      {text}
    </span>
  );
}
