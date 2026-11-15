"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * UplinkLoader (adapted from threeui's uplink-loader, MIT) - packets of
 * light rise up a beam into a hub, with progress text.
 */
export function UplinkLoader({ className, label = "מעלה נתונים" }: { className?: string; label?: string }) {
  return (
    <span className={cn("relative grid h-32 w-24 place-items-center", className)} dir="rtl">
      <span aria-hidden className="absolute bottom-6 top-2 w-px bg-gradient-to-t from-teal-500/60 to-transparent" />
      {[0, 1, 2, 3].map((i) => (
        <span key={i} aria-hidden className="absolute bottom-6 h-1.5 w-1.5 rounded-full bg-teal-300"
          style={{ animation: `upRise 1.6s ${i * 0.4}s cubic-bezier(.4,0,.6,1) infinite` }} />
      ))}
      <span aria-hidden className="absolute top-0 h-3 w-3 rounded-full bg-teal-400"
        style={{ boxShadow: "0 0 14px rgba(45,212,191,.9)", animation: "upHub 1.6s ease-in-out infinite" }} />
      <span className="absolute -bottom-1 text-[10px] font-semibold text-zinc-400">{label}...</span>
      <style>{`@keyframes upRise{0%{transform:translateY(0) scale(1);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateY(-92px) scale(.4);opacity:0}}
@keyframes upHub{0%,100%{transform:scale(1)}50%{transform:scale(1.35)}}`}</style>
    </span>
  );
}
