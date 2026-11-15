"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SplitFlap - digits flip like an old airport departure board. Each changed
 * digit folds its top half down, swaps, and folds back over.
 */
export function SplitFlap({
  value,
  digits = 3,
  className,
}: {
  value: number;
  digits?: number;
  className?: string;
}) {
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const str = String(Math.max(0, value)).padStart(digits, "0").slice(-digits);
  return (
    <div className={cn("flex gap-1.5", className)} dir="ltr" aria-label={str}>
      {Array.from({ length: digits }).map((_, i) => (
        <FlapDigit key={i} char={str[i]} reduce={reduce} />
      ))}
    </div>
  );
}

function FlapDigit({ char, reduce }: { char: string; reduce: boolean }) {
  const [shown, setShown] = React.useState(char);
  const flapRef = React.useRef<HTMLDivElement>(null);
  const prev = React.useRef(char);

  React.useEffect(() => {
    if (prev.current === char) return;
    const from = prev.current;
    prev.current = char;
    const flap = flapRef.current;
    if (!flap || reduce) { setShown(char); return; }
    const flapSpan = flap.querySelector("span");
    if (flapSpan) flapSpan.textContent = from;
    flap
      .animate(
        [{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }],
        { duration: 150, easing: "ease-in", fill: "forwards" }
      )
      .finished.then(() => {
        setShown(char);
        if (flapSpan) flapSpan.textContent = char;
        flap.animate(
          [{ transform: "rotateX(88deg)" }, { transform: "rotateX(0deg)" }],
          { duration: 170, easing: "ease-out", fill: "forwards" }
        );
      });
  }, [char, reduce]);

  const cell =
    "absolute inset-0 grid place-items-center rounded-lg border bg-card font-mono text-3xl font-bold text-primary [backface-visibility:hidden]";
  return (
    <div className="relative h-[62px] w-[46px]">
      <div className={cn(cell, "[clip-path:inset(50%_0_0_0)]")}><span>{shown}</span></div>
      <div className={cn(cell, "[clip-path:inset(0_0_50%_0)]")}><span>{shown}</span></div>
      <div ref={flapRef} className={cn(cell, "z-[2] origin-bottom [clip-path:inset(0_0_50%_0)]")}><span>{shown}</span></div>
      <div className="absolute inset-x-0 top-1/2 z-[3] h-[1.5px] bg-black/50" />
    </div>
  );
}
