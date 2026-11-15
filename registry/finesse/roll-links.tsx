"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * RollLinks - navigation links whose label rolls up to reveal a twin
 * in the accent colour.
 */
const LINKS = ["ראשי", "גלריות", "רכיבים", "תיעוד", "GitHub"];

export function RollLinks({ className }: { className?: string }) {
  return (
    <nav dir="rtl" className={cn("flex gap-6", className)}>
      {LINKS.map((l) => (
        <a key={l} href="#" onClick={(e) => e.preventDefault()}
          className="group relative overflow-hidden text-sm font-semibold text-zinc-300" style={{ height: "1.4em" }}>
          <span className="block transition-transform duration-300 group-hover:-translate-y-1/2" style={{ transitionTimingFunction: "cubic-bezier(.2,1.3,.3,1)" }}>
            <span className="block">{l}</span>
            <span className="block text-teal-400" aria-hidden>{l}</span>
          </span>
        </a>
      ))}
    </nav>
  );
}
