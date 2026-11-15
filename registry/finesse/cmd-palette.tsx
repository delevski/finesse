"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CmdAction {
  label: string;
  onPick: () => void;
}

/**
 * CmdPalette - a command palette that opens with Cmd/Ctrl+K: live filter,
 * items stagger in on open, the highlight hops with the arrow keys.
 */
export function CmdPalette({
  actions,
  placeholder = "מה עושים היום?",
  className,
}: {
  actions: CmdAction[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [idx, setIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const items = actions.filter((a) => !q || a.label.includes(q));

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (open) { setQ(""); setIdx(0); setTimeout(() => inputRef.current?.focus(), 80); }
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("inline-flex items-center gap-2.5 rounded-xl border bg-card px-5 py-3 text-sm text-muted-foreground", className)}
      >
        <kbd className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[11px]">Cmd</kbd>+
        <kbd className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[11px]">K</kbd>
        פתחו פלטת פקודות
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 grid items-start justify-center bg-black/60 pt-[14vh] backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div dir="rtl" className="w-[min(400px,88vw)] overflow-hidden rounded-2xl border bg-card shadow-2xl">
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => { setQ(e.target.value); setIdx(0); }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setIdx((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % Math.max(1, items.length));
                }
                if (e.key === "Enter" && items[idx]) { items[idx].onPick(); setOpen(false); }
              }}
              placeholder={placeholder}
              className="w-full border-b bg-transparent px-4 py-3.5 text-[15px] outline-none"
            />
            <div className="max-h-[280px] overflow-y-auto p-2">
              {items.length === 0 && <div className="p-4 text-[13.5px] text-muted-foreground">לא נמצאה פעולה</div>}
              {items.map((a, i) => (
                <div
                  key={a.label}
                  style={{ animationDelay: `${i * 45}ms` }}
                  onClick={() => { a.onPick(); setOpen(false); }}
                  className={cn(
                    "cursor-pointer rounded-xl px-3.5 py-2.5 text-sm transition-colors [animation:fadeSlideIn_.3s_cubic-bezier(.2,1.3,.3,1)_backwards]",
                    i === idx && "bg-accent"
                  )}
                >
                  {a.label}
                </div>
              ))}
            </div>
          </div>
          <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
        </div>
      )}
    </>
  );
}
