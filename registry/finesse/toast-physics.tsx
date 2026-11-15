"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PhysicsToast {
  id: number;
  text: string;
}

/**
 * PhysicsToasts - toasts spring in, stack, and can be flung away sideways
 * with real throw velocity; they also auto-dismiss.
 * Render <ToastsHost> once and call pushToast(text) from the returned hook.
 */
export function usePhysicsToasts() {
  const [toasts, setToasts] = React.useState<PhysicsToast[]>([]);
  const idRef = React.useRef(0);

  const push = React.useCallback((text: string) => {
    const id = ++idRef.current;
    setToasts((ts) => [{ id, text }, ...ts].slice(0, 4));
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 3800);
  }, []);

  const dismiss = React.useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  return { toasts, push, dismiss };
}

export function ToastsHost({
  toasts,
  dismiss,
  className,
}: {
  toasts: PhysicsToast[];
  dismiss: (id: number) => void;
  className?: string;
}) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-x-0 bottom-3 grid place-items-center", className)}
      dir="rtl"
    >
      {toasts.map((t, i) => (
        <ToastCard key={t.id} toast={t} index={i} dismiss={dismiss} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  index,
  dismiss,
}: {
  toast: PhysicsToast;
  index: number;
  dismiss: (id: number) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef({ on: false, x0: 0, dx: 0, vx: 0, lx: 0, lt: 0 });
  const [dx, setDx] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.animate(
      [
        { transform: "translateY(70px) scale(.8)", opacity: 0 },
        { transform: "translateY(-4px) scale(1.03)", opacity: 1, offset: 0.7 },
        { transform: "translateY(0) scale(1)", opacity: 1 },
      ],
      { duration: 480, easing: "cubic-bezier(.2,1.25,.3,1)" }
    );
  }, []);

  const fling = (dir: number) => {
    const el = ref.current;
    if (el) {
      el.style.transition = "transform .45s cubic-bezier(.3,.7,.4,1),opacity .4s";
      el.style.transform = `translateX(${dir * 320}px) rotate(${dir * 12}deg)`;
      el.style.opacity = "0";
    }
    setTimeout(() => dismiss(toast.id), 380);
  };

  return (
    <div
      ref={ref}
      role="status"
      style={{
        transform: `translateX(${dx}px) translateY(${-index * 64}px) rotate(${dx * 0.03}deg)`,
        zIndex: 40 - index,
      }}
      className={cn(
        "pointer-events-auto absolute bottom-0 flex cursor-grab touch-none select-none items-center gap-2.5 whitespace-nowrap rounded-xl border border-l-4 border-l-primary bg-card px-4 py-3 text-[13.5px] shadow-xl transition-[transform,opacity] duration-400 [transition-timing-function:cubic-bezier(.2,1.25,.3,1)]",
        drag.current.on && "cursor-grabbing transition-none"
      )}
      onPointerDown={(e) => {
        const d = drag.current;
        d.on = true; d.x0 = e.clientX; d.dx = 0; d.vx = 0; d.lx = e.clientX; d.lt = performance.now();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d.on) return;
        const now = performance.now();
        d.vx = (e.clientX - d.lx) / Math.max(1, now - d.lt);
        d.lx = e.clientX; d.lt = now;
        d.dx = e.clientX - d.x0;
        setDx(d.dx);
      }}
      onPointerUp={() => {
        const d = drag.current;
        if (!d.on) return;
        d.on = false;
        if (Math.abs(d.dx) > 80 || Math.abs(d.vx) > 0.5) fling(Math.sign(d.dx || d.vx));
        else setDx(0);
      }}
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">✓</span>
      {toast.text}
    </div>
  );
}
