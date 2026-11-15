"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * DynamicText - the headline swaps its keyword with a blur + slide
 * transition, looping through the product's verbs.
 */
const WORDS = ["מהירה", "זורמת", "חיה", "מרשימה"];

export function DynamicText({ className }: { className?: string }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <h2 dir="rtl" className={cn("text-xl font-black text-zinc-100", className)}>
      האנימציה שלכם{" "}
      <span className="relative inline-block overflow-hidden align-bottom text-teal-400" style={{ minWidth: "3.2em" }}>
        <span
          key={i}
          className="inline-block"
          style={{ animation: "dynIn .5s cubic-bezier(.2,1.3,.3,1) both" }}
        >
          {WORDS[i]}
        </span>
      </span>
      <style>{`@keyframes dynIn{from{opacity:0;transform:translateY(70%);filter:blur(6px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}`}</style>
    </h2>
  );
}
