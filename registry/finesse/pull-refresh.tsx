"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PullRefresh - drag the list down and a little climber descends on his rope;
 * release past the threshold and he slingshots up while a new item drops in.
 */
export function PullRefresh({
  renderItem,
  fetchItem,
  initial,
  className,
}: {
  renderItem: (text: string) => React.ReactNode;
  fetchItem: () => string;
  initial: string[];
  className?: string;
}) {
  const [items, setItems] = React.useState(initial);
  const [dy, setDy] = React.useState(0);
  const [smooth, setSmooth] = React.useState(true);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const climberRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef({ on: false, y0: 0, busy: false });
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <div
      ref={stageRef}
      className={cn("relative h-[250px] w-full max-w-sm touch-none select-none overflow-hidden rounded-2xl border bg-card", className)}
      dir="rtl"
      onPointerDown={(e) => {
        if (drag.current.busy) return;
        drag.current = { on: true, y0: e.clientY, busy: false };
        setSmooth(false);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current.on) return;
        setDy(Math.max(0, Math.min(e.clientY - drag.current.y0, 150)));
      }}
      onPointerUp={() => {
        if (!drag.current.on) return;
        drag.current.on = false;
        setSmooth(true);
        if (dy > 90 && !reduce) {
          drag.current.busy = true;
          setDy(110);
          const c = climberRef.current;
          if (c) {
            c.style.transition = "transform .38s cubic-bezier(.5,-.3,.6,.4)";
            c.style.transform = "translate(-50%,-170px) rotate(-18deg)";
          }
          setTimeout(() => {
            setItems((it) => [fetchItem(), ...it]);
            setDy(0);
            setTimeout(() => {
              if (c) { c.style.transition = "none"; c.style.transform = "translate(-50%,-80px)"; }
              drag.current.busy = false;
            }, 300);
          }, 420);
        } else setDy(0);
      }}
    >
      <div
        ref={climberRef}
        style={{ transform: `translate(-50%,${Math.min(dy * 0.85, 120) - 80}px)`, transition: smooth ? "transform .45s cubic-bezier(.3,.8,.4,1)" : "none" }}
        className="absolute left-1/2 top-0 z-10 grid justify-items-center"
      >
        <span className="h-[60px] w-[2.5px] rounded bg-border" />
        <span className="h-4 w-4 rounded-full bg-[#f5c89a]" />
        <span className="mt-0.5 h-5 w-3 rounded-md bg-primary" />
      </div>
      <div style={{ transform: `translateY(${dy}px)`, transition: smooth ? "transform .4s cubic-bezier(.2,1.4,.3,1)" : "none" }} className="grid gap-2.5 p-4">
        {items.map((t, i) => (
          <div key={`${t}-${i}`} className="rounded-xl border bg-background px-4 py-3 text-sm">
            {renderItem(t)}
          </div>
        ))}
      </div>
    </div>
  );
}
