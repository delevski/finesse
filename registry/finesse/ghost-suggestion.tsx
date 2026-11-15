"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const OPTIONS = ["חיפה - מרכז", "חיפה - קריות", "תל אביב - דרום", "תל אביב - צפון", "ירושלים - תלפיות", "באר שבע - הנגב"];

/**
 * GhostSuggestion - inline autocomplete: the completion floats ahead as a
 * ghost, and accepting it makes the added letters pop in one by one.
 */
export function GhostSuggestion({ className }: { className?: string }) {
  const [value, setValue] = React.useState("");
  const [pop, setPop] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const match = value ? OPTIONS.find((o) => o.startsWith(value) && o !== value) : undefined;

  const accept = () => {
    if (!match) return;
    setValue(match);
    if (!reduce) {
      setPop(0);
      const added = match.length - value.length;
      for (let k = 1; k <= added; k++) setTimeout(() => setPop(k), k * 45);
      setTimeout(() => setPop(0), added * 45 + 300);
    }
  };

  return (
    <div dir="rtl" className={cn("w-full max-w-xs", className)}>
      <div className="relative">
        <span aria-hidden className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm">
          <span className="invisible">{value}</span>
          <span className="text-neutral-400">{match ? match.slice(value.length) : ""}</span>
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Tab" || e.key === "Enter" || e.key === "ArrowLeft") { if (match) { e.preventDefault(); accept(); } } }}
          placeholder="חפשו סניף..."
          className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>
      <p className="mt-2 text-xs text-neutral-500">
        {match ? "חצים שמאלה או Tab להשלמה" : " "}
      </p>
      {pop > 0 && <span className="sr-only">הושלם אוטומטית</span>}
    </div>
  );
}
