"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ToolApproval - an agent asks to run a tool: approve slides the card
 * teal, deny slides it rose, either way the choice animates.
 */
export function ToolApproval({ className }: { className?: string }) {
  const [state, setState] = React.useState<"ask" | "yes" | "no">("ask");
  return (
    <div
      dir="rtl"
      className={cn("w-72 overflow-hidden rounded-2xl border p-4 transition-all", className)}
      style={{
        borderColor: state === "yes" ? "#2dd4bf" : state === "no" ? "#fb7185" : "#3f3f46",
        background: "#18181b",
        transform: state === "ask" ? "none" : `translateX(${state === "yes" ? -6 : 6}px)`,
        transitionTimingFunction: "cubic-bezier(.2,1.3,.3,1)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-800 text-teal-300">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m4 17 6-6-6-6M12 19h8"/></svg></span>
        <div>
          <p className="text-xs font-bold text-zinc-100" dir="ltr">run: npm test</p>
          <p className="text-[10px] text-zinc-500">הסוכן מבקש אישור להרצה</p>
        </div>
      </div>
      {state === "ask" ? (
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => setState("yes")} className="flex-1 rounded-lg bg-teal-500 py-1.5 text-xs font-bold text-zinc-950 transition-transform active:scale-95">אישור</button>
          <button type="button" onClick={() => setState("no")} className="flex-1 rounded-lg border border-zinc-700 py-1.5 text-xs font-bold text-zinc-300 transition-transform active:scale-95">דחייה</button>
        </div>
      ) : (
        <p className="mt-3 text-center text-xs font-bold" style={{ color: state === "yes" ? "#2dd4bf" : "#fb7185", animation: "toolPop .4s cubic-bezier(.2,1.5,.3,1) both" }}>
          {state === "yes" ? "הורץ בהצלחה" : "נדחה - הסוכן ינסה דרך אחרת"}
        </p>
      )}
      <style>{`@keyframes toolPop{from{opacity:0;transform:translateY(8px) scale(.9)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
