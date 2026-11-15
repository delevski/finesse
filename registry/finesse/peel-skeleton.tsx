"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PeelSkeleton - the skeleton peels itself off like a sticker when the
 * content is ready, instead of a boring fade.
 */
export function PeelSkeleton({
  loading,
  children,
  className,
}: {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const skelRef = React.useRef<HTMLDivElement>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  React.useEffect(() => {
    const el = skelRef.current;
    if (!el) return;
    if (loading) {
      el.style.display = "grid";
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    if (reduce) { el.style.opacity = "0"; return; }
    el.animate(
      [
        { transform: "rotate(0deg) translate(0,0)", opacity: 1 },
        { transform: "rotate(24deg) translate(46%,-14%) skewX(8deg)", opacity: 0.9, offset: 0.55 },
        { transform: "rotate(38deg) translate(120%,-30%) skewX(10deg)", opacity: 0 },
      ],
      { duration: 750, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" }
    );
  }, [loading, reduce]);

  return (
    <div className={cn("relative w-full max-w-xs overflow-hidden rounded-2xl border", className)} dir="rtl">
      <div className="grid gap-2 bg-card p-5">{children}</div>
      <div ref={skelRef} className="absolute inset-0 z-[2] grid origin-top-right content-start gap-2.5 bg-muted p-5">
        <div className="h-4 w-1/3 animate-pulse rounded-lg bg-border" />
        <div className="h-[22px] w-2/3 animate-pulse rounded-lg bg-border" />
        <div className="h-3 w-[88%] animate-pulse rounded-lg bg-border" />
        <div className="h-3 w-3/4 animate-pulse rounded-lg bg-border" />
      </div>
    </div>
  );
}
