"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * TagInput - chips pop in with a spring and a random little tilt; removing
 * one shrinks it into its own center.
 */
export function TagInput({ className }: { className?: string }) {
  const [tags, setTags] = React.useState<string[]>(["עיצוב", "אנימציה"]);
  const [value, setValue] = React.useState("");
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const add = () => {
    const t = value.trim();
    if (!t || tags.includes(t) || tags.length >= 6) return;
    setTags((v) => [...v, t]);
    setValue("");
  };

  const remove = (t: string, el: HTMLElement) => {
    if (reduce) { setTags((v) => v.filter((x) => x !== t)); return; }
    el.animate(
      [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(.3)", opacity: 0 }],
      { duration: 220, easing: "ease-in", fill: "forwards" }
    ).onfinish = () => setTags((v) => v.filter((x) => x !== t));
  };

  return (
    <div dir="rtl" className={cn("w-full max-w-sm rounded-xl border border-neutral-300 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900", className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((t, i) => (
          <span
            key={t}
            className="flex items-center gap-1 rounded-full bg-teal-600/10 px-3 py-1 text-sm font-semibold text-teal-700 dark:text-teal-300"
            style={{ animation: reduce ? undefined : `tagPop .4s ${i === tags.length - 1 ? "0" : "0"}ms cubic-bezier(.2,1.5,.3,1) both`, rotate: `${(i % 2 ? -1 : 1) * 1.5}deg` }}
          >
            {t}
            <button type="button" aria-label={`הסרת ${t}`} onClick={(e) => remove(t, (e.target as HTMLElement).closest("span")!)} className="text-teal-500 hover:text-teal-800">×</button>
          </span>
        ))}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder={tags.length ? "" : "הוסיפו תגית ו-Enter..."}
          className="min-w-24 flex-1 bg-transparent p-1 text-sm outline-none"
        />
      </div>
      <style>{`@keyframes tagPop{from{opacity:0;transform:scale(.4) rotate(-8deg)}to{opacity:1;transform:scale(1) rotate(0deg)}}`}</style>
    </div>
  );
}
