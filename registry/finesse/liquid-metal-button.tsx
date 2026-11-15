"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * LiquidMetalButton (adapted from threeui's liquid-metal-button, MIT) -
 * a chrome button with a flowing metallic sheen and press physics.
 */
export function LiquidMetalButton({ className, children = "שידרוג" }: { className?: string; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      className={cn("relative overflow-hidden rounded-full px-8 py-3 text-sm font-black text-zinc-900 transition-transform active:scale-95", className)}
      style={{
        background: "linear-gradient(135deg,#e5e7eb 0%,#9ca3af 25%,#f9fafb 50%,#6b7280 75%,#e5e7eb 100%)",
        backgroundSize: "220% 220%",
        animation: "lmFlow 3.2s ease-in-out infinite",
        boxShadow: "0 10px 26px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.7)",
      }}
    >
      <span className="relative z-10">{children}</span>
      <span aria-hidden className="absolute inset-0"
        style={{ background: "linear-gradient(105deg,transparent 42%,rgba(255,255,255,.85) 50%,transparent 58%)", backgroundSize: "260% 100%", animation: "lmSheen 2.4s linear infinite", mixBlendMode: "screen" }} />
      <style>{`@keyframes lmFlow{0%,100%{background-position:0% 40%}50%{background-position:100% 60%}}
@keyframes lmSheen{0%{background-position:160% 0}100%{background-position:-160% 0}}`}</style>
    </button>
  );
}
