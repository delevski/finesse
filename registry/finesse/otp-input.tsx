"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * OtpInput - per-digit cells with an elastic pop on entry, blinking caret on
 * the active cell, row shake on a wrong code and a staggered green pop on
 * success. Accepts digits only; works with SMS autofill (one-time-code).
 */
export function OtpInput({
  length = 6,
  onComplete,
  className,
}: {
  length?: number;
  /** return true when the code is correct; false triggers the shake + clear */
  onComplete?: (code: string) => boolean;
  className?: string;
}) {
  const [value, setValue] = React.useState("");
  const [state, setState] = React.useState<"idle" | "err" | "ok">("idle");
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const reduce = React.useMemo(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const handle = (v: string) => {
    const clean = v.replace(/\D/g, "").slice(0, length);
    setValue(clean);
    if (clean.length === length) {
      const good = onComplete ? onComplete(clean) : true;
      if (good) {
        setState("ok");
        setTimeout(() => { setState("idle"); setValue(""); }, 2600);
      } else {
        setState("err");
        setTimeout(() => { setState("idle"); setValue(""); }, reduce ? 60 : 900);
      }
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)} dir="ltr">
      <div
        role="group"
        aria-label="קוד אימות"
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "flex cursor-text gap-2.5",
          state === "err" && "[&>*]:animate-[shakeX_.4s_ease] [&>*]:border-destructive [&>*]:text-destructive",
          state === "ok" && "[&>*]:border-green-500 [&>*]:text-green-500"
        )}
      >
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            style={{ animationDelay: state === "ok" ? `${i * 55}ms` : undefined }}
            className={cn(
              "relative grid h-[54px] w-11 place-items-center rounded-xl border-[1.5px] bg-card font-mono text-[22px] font-bold transition-colors",
              value[i] && "border-primary",
              focused && i === value.length && "border-primary",
              value[i] && "animate-[otpPop_.35s_cubic-bezier(.34,1.8,.64,1)]",
              state === "ok" && "animate-[otpPop_.4s_cubic-bezier(.34,1.8,.64,1)_backwards]"
            )}
          >
            {value[i] ?? ""}
            {focused && i === value.length && (
              <span className="absolute h-6 w-0.5 animate-pulse bg-primary" aria-hidden />
            )}
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        aria-label="קוד אימות"
        value={value}
        onChange={(e) => handle(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="pointer-events-none absolute opacity-0"
      />
      <style>{`@keyframes otpPop{0%{transform:scale(.7)}60%{transform:scale(1.12)}100%{transform:scale(1)}}@keyframes shakeX{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}50%{transform:translateX(5px)}75%{transform:translateX(-3px)}}`}</style>
    </div>
  );
}
