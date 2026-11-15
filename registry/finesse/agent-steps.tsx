"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * AgentSteps - a vertical run of agent steps: each step spins, then
 * flips to a drawn check while the next one starts.
 */
const STEPS = ["קורא את הקובץ", "מנתח שגיאות", "כותב תיקון", "מריץ בדיקות"];

export function AgentSteps({ className }: { className?: string }) {
  const [step, setStep] = React.useState(-1);
  const [done, setDone] = React.useState(-1);
  React.useEffect(() => {
    if (step < 0 || step >= STEPS.length) return;
    const t = setTimeout(() => { setDone(step); setStep(step + 1); }, 1100);
    return () => clearTimeout(t);
  }, [step]);
  const run = () => { setDone(-1); setStep(0); };
  return (
    <div dir="rtl" className={cn("w-60", className)}>
      <ol className="space-y-2.5">
        {STEPS.map((s, i) => {
          const state = i <= done ? "done" : i === step ? "run" : "wait";
          return (
            <li key={s} className="flex items-center gap-3 text-sm" style={{ color: state === "wait" ? "#52525b" : state === "run" ? "#2dd4bf" : "#a1a1aa" }}>
              <span className="grid h-6 w-6 place-items-center rounded-full border text-[10px]"
                style={{ borderColor: state === "wait" ? "#3f3f46" : "#2dd4bf", background: state === "done" ? "rgba(45,212,191,.15)" : "transparent" }}>
                {state === "run" ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ animation: "agentSpin .8s linear infinite" }}><path d="M21 12a9 9 0 1 1-9-9"/></svg>
                ) : state === "done" ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="m4 12.5 5 5L20 6.5" strokeDasharray="24" strokeDashoffset="0"/></svg>
                ) : (
                  i + 1
                )}
              </span>
              {s}
            </li>
          );
        })}
      </ol>
      <button type="button" onClick={run} className="mt-3 rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-bold text-zinc-950">
        {step >= STEPS.length ? "הריצו שוב" : "הרצה"}
      </button>
      <style>{`@keyframes agentSpin{to{transform:rotate(1turn)}}`}</style>
    </div>
  );
}
