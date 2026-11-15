"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SiriOrb - a layered gradient orb that breathes, and flares up while
 * you hold it (like speaking to Siri).
 */
export function SiriOrb({ className }: { className?: string }) {
  const [hot, setHot] = React.useState(false);
  const blob = (c1: string, c2: string, dur: string, delay = "0s"): React.CSSProperties => ({
    position: "absolute", inset: 0, borderRadius: "50%",
    background: `radial-gradient(circle at 35% 35%, ${c1}, ${c2})`,
    filter: "blur(6px)", mixBlendMode: "screen",
    animation: `siriSpin ${dur} linear infinite`, animationDelay: delay,
    transformOrigin: "58% 42%",
  });
  return (
    <button
      type="button"
      aria-label="דברו אליי"
      onPointerDown={() => setHot(true)}
      onPointerUp={() => setHot(false)}
      onPointerLeave={() => setHot(false)}
      className={cn("relative h-28 w-28 cursor-pointer select-none", className)}
      style={{ transform: hot ? "scale(1.12)" : "scale(1)", transition: "transform .4s cubic-bezier(.2,1.4,.3,1)" }}
    >
      <span style={blob("#2dd4bf", "transparent 65%", "7s")} />
      <span style={blob("#818cf8", "transparent 65%", "5s", "-2s")} />
      <span style={blob("#f472b6", "transparent 62%", "9s", "-4s")} />
      <span
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: hot ? "0 0 44px rgba(45,212,191,.55)" : "0 0 22px rgba(129,140,248,.3)", transition: "box-shadow .3s" }}
      />
      <style>{`@keyframes siriSpin{to{transform:rotate(1turn) scale(1.08)}}`}</style>
    </button>
  );
}
