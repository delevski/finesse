"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * FileDrop - drag the file chip into the folder: the lid swings open, the
 * chip slides inside and the folder does a happy bounce. Includes a button
 * that runs the same flight for touch-only flows.
 */
export function FileDrop({ className }: { className?: string }) {
  const [files, setFiles] = React.useState<string[]>([]);
  const [hover, setHover] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const chipRef = React.useRef<HTMLDivElement>(null);
  const folderRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ x: number; y: number } | null>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const land = React.useCallback(() => {
    const folder = folderRef.current, chip = chipRef.current;
    setFiles((f) => [...f, `קובץ ${f.length + 1}.pdf`]);
    if (reduce || !folder || !chip) return;
    folder.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.12) rotate(-3deg)" }, { transform: "scale(1) rotate(0deg)" }],
      { duration: 480, easing: "cubic-bezier(.2,1.4,.3,1)" }
    );
    chip.animate(
      [{ transform: chip.style.transform, opacity: 1 }, { transform: "translate(0, 40px) scale(.2)", opacity: 0 }],
      { duration: 350, easing: "ease-in", fill: "forwards" }
    ).onfinish = () => { chip.style.transform = ""; chip.style.opacity = ""; };
  }, [reduce]);

  return (
    <div dir="rtl" className={cn("flex w-full max-w-xs flex-col items-center gap-5", className)}>
      <div
        ref={folderRef}
        className={cn("relative grid h-32 w-40 place-items-center rounded-2xl border-2 border-dashed transition-colors",
          hover ? "border-teal-500 bg-teal-500/10" : "border-neutral-300 dark:border-neutral-600")}
      >
        <span className="text-5xl transition-transform duration-300" style={{ transform: hover ? "scale(1.15) rotate(-6deg)" : "none" }}>📂</span>
        <span className="absolute bottom-2 text-[11px] text-neutral-500">{hover ? "שחררו!" : "גררו את הקובץ לכאן"}</span>
      </div>
      <div
        ref={chipRef}
        className="cursor-grab select-none rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-md ring-1 ring-neutral-200 active:cursor-grabbing dark:bg-neutral-800 dark:ring-neutral-700"
        style={{ touchAction: "none" }}
        onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY }; }}
        onPointerMove={(e) => {
          if (!drag.current || busy) return;
          const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
          if (chipRef.current) chipRef.current.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 14}deg)`;
          const f = folderRef.current?.getBoundingClientRect();
          setHover(!!f && e.clientX > f.left && e.clientX < f.right && e.clientY > f.top && e.clientY < f.bottom);
        }}
        onPointerUp={() => { const wasHover = hover; drag.current = null; setHover(false); if (wasHover) land(); else if (chipRef.current) chipRef.current.style.transform = ""; }}
      >
        📄 מסמך-לדוגמה.pdf
      </div>
      {files.length > 0 && (
        <ul className="w-full space-y-1 text-sm">
          {files.map((f) => (
            <li key={f} className="rounded-lg bg-teal-500/10 px-3 py-1.5 text-teal-700 dark:text-teal-300">✓ {f} נשמר בתיקייה</li>
          ))}
        </ul>
      )}
    </div>
  );
}
