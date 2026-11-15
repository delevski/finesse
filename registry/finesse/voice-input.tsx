"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * VoiceInput - hold the mic: live waveform bars dance while recording,
 * then the "transcript" types itself out.
 */
export function VoiceInput({ className }: { className?: string }) {
  const [rec, setRec] = React.useState(false);
  const [text, setText] = React.useState("");
  React.useEffect(() => {
    if (rec || !text) return;
  }, [rec, text]);
  const stop = () => {
    setRec(false);
    const full = "הזכר לי לשלוח את ההצעה מחר בבוקר";
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setText(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, 40);
  };
  return (
    <div dir="rtl" className={cn("flex w-72 items-center gap-3 rounded-2xl border p-3 transition-colors", className)}
      style={{ borderColor: rec ? "#fb7185" : "#3f3f46", background: "#18181b" }}>
      <button
        type="button"
        aria-pressed={rec}
        aria-label="הקלטה"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setText(""); setRec(true); }}
        onPointerUp={stop}
        onPointerCancel={() => rec && stop()}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full transition-all"
        style={{ background: rec ? "#fb7185" : "#2dd4bf", color: "#04211d", transform: rec ? "scale(1.12)" : "scale(1)", transitionTimingFunction: "cubic-bezier(.2,1.5,.3,1)" }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3"/></svg>
      </button>
      {rec ? (
        <div className="flex h-8 flex-1 items-center justify-center gap-1" dir="ltr" aria-hidden>
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} className="w-1 rounded-full bg-rose-400"
              style={{ animation: `voiceBar ${0.5 + (i % 5) * 0.09}s ${i * 0.05}s ease-in-out infinite alternate`, height: 6 }} />
          ))}
        </div>
      ) : (
        <p className="flex-1 text-sm" style={{ color: text ? "#e4e4e7" : "#52525b" }}>{text || "החזיקו את המיקרופון ודברו"}</p>
      )}
      <style>{`@keyframes voiceBar{from{height:5px}to{height:${4 + 22}px}}`}</style>
    </div>
  );
}
