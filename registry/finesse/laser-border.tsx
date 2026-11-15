"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * LaserBorder (adapted from threeui's laser, MIT) - a card outlined by a
 * laser beam that continuously traces its rounded border.
 */
export function LaserBorder({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("relative w-64 overflow-hidden rounded-2xl p-[2px]", className)}>
      <span
        aria-hidden
        className="absolute inset-[-40%]"
        style={{
          background: "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, #2dd4bf 340deg, #a5f3fc 355deg, transparent 360deg)",
          animation: "laserSpin 3s linear infinite",
        }}
      />
      <div dir="rtl" className="relative rounded-[14px] bg-zinc-950 p-4">
        {children ?? (
          <>
            <p className="text-sm font-bold text-zinc-100">כרטיס מוגן</p>
            <p className="mt-1 text-xs text-zinc-500">הלייזר סורק את ההיקף ללא הפסקה.</p>
          </>
        )}
      </div>
      <style>{`@keyframes laserSpin{to{transform:rotate(1turn)}}`}</style>
    </div>
  );
}
