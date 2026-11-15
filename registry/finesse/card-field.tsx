"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CardField - a payment input that groups digits live, detects the brand
 * and flips the mini card to the CVV side when you focus the code.
 */
export function CardField({ className }: { className?: string }) {
  const [num, setNum] = React.useState("");
  const [cvv, setCvv] = React.useState(false);
  const grouped = num.replace(/(.{4})/g, "$& ").trim();
  const brand = num.startsWith("4") ? "Visa" : num.startsWith("5") ? "Mastercard" : "כרטיס";
  return (
    <div dir="rtl" className={cn("w-72", className)}>
      <div className="mb-3 h-28 [perspective:700px]">
        <div className="relative h-full transition-transform [transform-style:preserve-3d]"
          style={{ transform: cvv ? "rotateY(180deg)" : "none", transitionDuration: ".6s", transitionTimingFunction: "cubic-bezier(.3,1.2,.3,1)" }}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-900 p-4 [backface-visibility:hidden]">
            <p className="text-[10px] text-teal-200">{brand}</p>
            <p className="mt-5 font-mono text-lg tracking-widest text-white" dir="ltr">{grouped || "•••• •••• •••• ••••"}</p>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 p-4 [backface-visibility:hidden]" style={{ transform: "rotateY(180deg)" }}>
            <div className="h-6 rounded bg-zinc-950/70" />
            <p className="mt-3 text-left font-mono text-white" dir="ltr">CVV</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2" dir="ltr">
        <input
          inputMode="numeric"
          placeholder="4580 1234 5678 9012"
          value={grouped}
          onChange={(e) => setNum(e.target.value.replace(/\D/g, "").slice(0, 16))}
          onFocus={() => setCvv(false)}
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 font-mono text-sm text-zinc-100 outline-none focus:border-teal-500"
        />
        <input
          inputMode="numeric" placeholder="CVV" maxLength={4}
          onFocus={() => setCvv(true)}
          className="w-16 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-center font-mono text-sm text-zinc-100 outline-none focus:border-teal-500"
        />
      </div>
    </div>
  );
}
