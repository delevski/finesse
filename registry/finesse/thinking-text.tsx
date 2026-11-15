"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ThinkingText - shimmering "thinking" text with bouncing dots: the
 * standard agent-loading line, done tastefully.
 */
export function ThinkingText({ className, text = "הסוכן חושב" }: { className?: string; text?: string }) {
  return (
    <span dir="rtl" className={cn("inline-flex items-center gap-1.5 text-sm font-semibold", className)}>
      <span
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage: "linear-gradient(90deg,#71717a 30%,#f4f4f5 50%,#71717a 70%)",
          backgroundSize: "200% 100%",
          animation: "thinkShine 1.6s linear infinite",
        }}
      >
        {text}
      </span>
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-teal-400"
          style={{ animation: `thinkDot 1.2s ${i * 0.18}s ease-in-out infinite` }} />
      ))}
      <style>{`@keyframes thinkShine{0%{background-position:180% 0}100%{background-position:-180% 0}}@keyframes thinkDot{0%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}`}</style>
    </span>
  );
}
