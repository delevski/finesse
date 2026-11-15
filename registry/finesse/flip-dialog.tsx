"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * FlipDialog - the trigger card itself expands into the dialog (FLIP:
 * measure, invert, play), not a panel popping out of nowhere.
 */
export function FlipDialog({
  trigger,
  children,
  className,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [gone, setGone] = React.useState(false);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLButtonElement>(null);
  const dlgRef = React.useRef<HTMLDivElement>(null);
  const flipping = React.useRef(false);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const openFlip = () => {
    if (flipping.current || !stageRef.current || !cardRef.current || !dlgRef.current) return;
    flipping.current = true;
    const cr = cardRef.current.getBoundingClientRect();
    const sr = stageRef.current.getBoundingClientRect();
    const dw = sr.width - 28, dh = sr.height - 52;
    const sx = cr.width / dw, sy = cr.height / dh;
    const ox = cr.left - sr.left - 14, oy = cr.top - sr.top - 26;
    setOpen(true);
    setGone(true);
    if (!reduce) {
      const dlg = dlgRef.current;
      dlg.style.transition = "none";
      dlg.style.transform = `translate(${ox}px,${oy}px) scale(${sx},${sy})`;
      void dlg.offsetWidth;
      dlg.style.transition = "transform .48s cubic-bezier(.22,1,.36,1)";
      dlg.style.transform = "translate(0,0) scale(1,1)";
    }
    setTimeout(() => { flipping.current = false; }, 500);
  };

  const closeFlip = React.useCallback(() => {
    if (flipping.current || !stageRef.current || !cardRef.current || !dlgRef.current) return;
    flipping.current = true;
    const cr = cardRef.current.getBoundingClientRect();
    const sr = stageRef.current.getBoundingClientRect();
    const dw = sr.width - 28, dh = sr.height - 52;
    const sx = cr.width / dw, sy = cr.height / dh;
    const ox = cr.left - sr.left - 14, oy = cr.top - sr.top - 26;
    if (!reduce) {
      const dlg = dlgRef.current;
      dlg.style.transition = "transform .4s cubic-bezier(.5,0,.75,0)";
      dlg.style.transform = `translate(${ox}px,${oy}px) scale(${sx},${sy})`;
    }
    setTimeout(() => {
      setOpen(false);
      setGone(false);
      flipping.current = false;
    }, reduce ? 0 : 380);
  }, [reduce]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeFlip(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeFlip]);

  return (
    <div
      ref={stageRef}
      className={cn("relative grid min-h-[400px] w-full place-items-center overflow-hidden rounded-xl bg-background", className)}
      dir="rtl"
    >
      <button
        ref={cardRef}
        type="button"
        onClick={openFlip}
        className={cn(
          "w-[min(240px,74%)] rounded-2xl border bg-card p-4 text-start shadow-md transition hover:border-primary",
          gone && "pointer-events-none scale-90 opacity-0"
        )}
      >
        {trigger}
      </button>
      <div
        aria-hidden
        onClick={closeFlip}
        className={cn(
          "absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300",
          open && "opacity-100"
        )}
      />
      <div
        ref={dlgRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute inset-x-3.5 inset-y-6 origin-top-left rounded-2xl border bg-card p-5 shadow-2xl will-change-transform",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <button
          type="button"
          aria-label="סגירה"
          onClick={closeFlip}
          className="absolute end-3 top-3 grid h-8 w-8 place-items-center rounded-full border text-muted-foreground"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
