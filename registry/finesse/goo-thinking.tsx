"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * GooThinking - an AI "thinking" indicator: three blobs merge and split under
 * a goo filter, then collapse into the answer chip.
 */
export function GooThinking({ className }: { className?: string }) {
  const [answered, setAnswered] = React.useState(false);
  return (
    <div dir="rtl" className={cn("flex flex-col items-center gap-4", className)}>
      <svg width="0" height="0" aria-hidden>
        <defs>
          <filter id="gooThinkFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      {!answered ? (
        <div className="flex h-14 items-center justify-center gap-0" style={{ filter: "url(#gooThinkFilter)", width: 120 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute h-4 w-4 rounded-full bg-teal-500"
              style={{ animation: `gooThink 1.4s ${i * 0.22}s ease-in-out infinite` }}
            />
          ))}
          <style>{`@keyframes gooThink{0%,100%{transform:translateX(-26px) scale(.85)}50%{transform:translateX(26px) scale(1.1)}}`}</style>
        </div>
      ) : (
        <div className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg" style={{ animation: "gooAnswer .45s cubic-bezier(.2,1.4,.3,1) both" }}>
          מצאתי 3 סניפים פתוחים עכשיו באזור שלך ✨
          <style>{`@keyframes gooAnswer{from{opacity:0;transform:scale(.5) translateY(10px)}to{opacity:1;transform:none}}`}</style>
        </div>
      )}
      <button type="button" onClick={() => setAnswered((v) => !v)} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold dark:border-neutral-600">
        {answered ? "חשבו שוב" : "קבלו תשובה"}
      </button>
    </div>
  );
}
