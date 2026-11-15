"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * TiltCard - pointer-tracked 3D tilt with a specular glare that follows the
 * touch/cursor; springs back to flat on release/leave.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 14,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [live, setLive] = React.useState(false);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <div className="[perspective:900px]" dir="rtl">
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-card p-6 shadow-xl [transform-style:preserve-3d]",
          live ? "transition-none" : "transition-transform duration-500 [transition-timing-function:cubic-bezier(.2,1.2,.3,1)]",
          className
        )}
        onPointerMove={(e) => {
          if (reduce) return;
          const el = ref.current;
          if (!el) return;
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          el.style.setProperty("--gx", `${px * 100}%`);
          el.style.setProperty("--gy", `${py * 100}%`);
          el.style.transform = `rotateY(${((px - 0.5) * maxTilt).toFixed(1)}deg) rotateX(${(-(py - 0.5) * (maxTilt - 2)).toFixed(1)}deg)`;
          setLive(true);
        }}
        onPointerLeave={() => {
          if (ref.current) ref.current.style.transform = "rotateY(0deg) rotateX(0deg)";
          setLive(false);
        }}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-300",
            live ? "opacity-100" : "opacity-0"
          )}
          style={{
            background:
              "radial-gradient(240px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,.17), transparent 60%)",
          }}
        />
        <div className="[transform:translateZ(34px)]">{children}</div>
      </div>
    </div>
  );
}
