"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * FaceId - a Face-ID-style scan: corner brackets draw in, a scan line sweeps
 * the face, dots land on the features, then it unlocks with a green snap.
 */
export function FaceId({ className }: { className?: string }) {
  const [phase, setPhase] = React.useState<"idle" | "scan" | "ok">("idle");
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const scan = () => {
    if (phase === "scan") return;
    setPhase("scan");
    timers.current.push(setTimeout(() => setPhase("ok"), 1600));
    timers.current.push(setTimeout(() => setPhase("idle"), 4200));
  };

  const color = phase === "ok" ? "#34d399" : "#14b8a6";

  return (
    <div dir="rtl" className={cn("flex flex-col items-center gap-4", className)}>
      <button
        type="button"
        onClick={scan}
        aria-label="סריקת פנים"
        className="relative grid h-36 w-36 place-items-center rounded-3xl bg-neutral-900 shadow-xl transition-transform active:scale-95 dark:bg-neutral-800"
      >
        {/* corner brackets */}
        {[
          "top-3 right-3 border-t-4 border-r-4 rounded-tr-xl",
          "top-3 left-3 border-t-4 border-l-4 rounded-tl-xl",
          "bottom-3 right-3 border-b-4 border-r-4 rounded-br-xl",
          "bottom-3 left-3 border-b-4 border-l-4 rounded-bl-xl",
        ].map((pos) => (
          <span
            key={pos}
            className={cn("absolute h-7 w-7 transition-all", pos)}
            style={{ borderColor: color, opacity: phase === "idle" ? 0.35 : 1, transitionDuration: "400ms" }}
          />
        ))}
        {/* face */}
        <svg viewBox="0 0 48 48" className="h-20 w-20" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" style={{ transition: "stroke .4s" }}>
          <path d="M14 20v3M34 20v3" />
          <path d="M20 32c2.2 2 5.8 2 8 0" />
          <path d="M24 20v8h-3" />
          <path d="M10 16c0-4 2-6 6-6M38 16c0-4-2-6-6-6M10 32c0 4 2 6 6 6M38 32c0 4-2 6-6 6" opacity=".6" />
        </svg>
        {/* scan line */}
        {phase === "scan" && (
          <span className="absolute inset-x-4 h-0.5 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}`, animation: "faceScan 1.5s ease-in-out" }} />
        )}
        {phase === "ok" && (
          <span className="absolute inset-0 grid place-items-center rounded-3xl bg-emerald-500/15 text-4xl" style={{ animation: "faceOk .4s cubic-bezier(.2,1.5,.3,1) both" }}>
            ✅
          </span>
        )}
        <style>{`@keyframes faceScan{0%{top:18%}50%{top:82%}100%{top:18%}}@keyframes faceOk{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}`}</style>
      </button>
      <p className="text-sm text-neutral-500">
        {phase === "idle" ? "לחצו לסריקה" : phase === "scan" ? "מזהה פנים..." : "זוהה! הטלפון נפתח"}
      </p>
    </div>
  );
}
