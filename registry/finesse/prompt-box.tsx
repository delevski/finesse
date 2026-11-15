"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PromptBox - an AI prompt field that grows on focus, counts characters,
 * and morphs its send button into a stop button while "thinking".
 */
export function PromptBox({ className }: { className?: string }) {
  const [val, setVal] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  return (
    <div dir="rtl" className={cn("w-72 rounded-2xl border border-zinc-700 bg-zinc-900 p-3 shadow-xl transition-all", className)}
      style={{ borderColor: busy ? "#2dd4bf" : undefined }}>
      <textarea
        maxLength={200}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={val.length > 40 ? 3 : 1}
        placeholder="בקשו מהסוכן משהו..."
        className="w-full resize-none bg-transparent text-sm text-zinc-100 outline-none transition-all"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-zinc-500" dir="ltr">{val.length}/200</span>
        <button
          type="button"
          onClick={() => setBusy((v) => !v)}
          className="grid h-8 w-8 place-items-center rounded-full text-zinc-950 transition-all"
          style={{
            background: busy ? "#fb7185" : val ? "#2dd4bf" : "#3f3f46",
            borderRadius: busy ? "10px" : "999px",
            transform: busy ? "rotate(90deg)" : "none",
            transitionTimingFunction: "cubic-bezier(.2,1.4,.3,1)",
          }}
          aria-label={busy ? "עצירה" : "שליחה"}
        >
          {busy ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}
