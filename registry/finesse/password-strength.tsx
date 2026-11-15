"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const FACES = ["🫣", "😬", "😐", "🙂", "💪"];
const LABELS = ["", "חלשה מאוד", "חלשה", "סבירה", "חזקה", "מעולה"];
const COLORS = ["", "#fb7185", "#fb923c", "#f5b453", "#a3e635", "#34d399"];

function score(p: string): number {
  if (!p) return 0;
  let s = 1;
  if (p.length >= 8) s++;
  if (/[0-9]/.test(p) && /[a-zA-Zא-ת]/.test(p)) s++;
  if (/[^a-zA-Z0-9א-ת\s]/.test(p) || p.length >= 12) s++;
  return Math.min(4, s);
}

/**
 * PasswordStrength - segments spring in one by one as the password earns
 * them, and the little face reacts to every change.
 */
export function PasswordStrength({ className }: { className?: string }) {
  const [pw, setPw] = React.useState("");
  const [faceKey, setFaceKey] = React.useState(0);
  const s = score(pw);
  const prev = React.useRef(0);

  React.useEffect(() => {
    if (s !== prev.current) { prev.current = s; setFaceKey((k) => k + 1); }
  }, [s]);

  return (
    <div dir="rtl" className={cn("w-full max-w-xs", className)}>
      <label className="mb-1 flex items-center justify-between text-sm font-semibold">
        סיסמה
        <span key={faceKey} className="text-xl" style={{ animation: "pwFace .4s cubic-bezier(.2,1.5,.3,1) both" }}>
          {FACES[s]}
          <style>{`@keyframes pwFace{from{transform:scale(.4) rotate(-20deg)}to{transform:scale(1) rotate(0)}}`}</style>
        </span>
      </label>
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="נסו: Sun4Flower!"
        className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 dark:border-neutral-700 dark:bg-neutral-900"
      />
      <div className="mt-2 flex gap-1.5" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all"
            style={{
              background: i <= s ? COLORS[s] : "rgba(120,130,145,.25)",
              transform: i <= s ? "scaleY(1.6)" : "scaleY(1)",
              transitionTimingFunction: "cubic-bezier(.2,1.4,.3,1)",
              transitionDuration: "350ms",
              transitionDelay: `${i * 60}ms`,
            }}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs font-semibold" style={{ color: COLORS[s] || "#8fa0b3" }}>{LABELS[s] || " "}</p>
    </div>
  );
}
