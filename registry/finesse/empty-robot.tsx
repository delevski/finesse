"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * EmptyRobot - a sad little robot for empty states that perks up when the
 * first item arrives: eyes open, antenna springs, a happy hop.
 */
export function EmptyRobot({
  itemCount,
  emptyText = "עוד אין פריטים - הרובוט קצת עצוב",
  happyText,
  className,
}: {
  itemCount: number;
  emptyText?: string;
  happyText?: (n: number) => string;
  className?: string;
}) {
  const happy = itemCount > 0;
  const robotRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = robotRef.current;
    if (!el || !happy) return;
    el.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(-16px)", offset: 0.4 },
        { transform: "translateY(-8px)" },
      ],
      { duration: 450, easing: "cubic-bezier(.2,1.4,.3,1)", fill: "forwards" }
    );
  }, [happy]);

  return (
    <div className={cn("grid justify-items-center gap-3", className)} dir="rtl">
      <div ref={robotRef} className="relative h-[86px] w-[70px]">
        <span
          className={cn(
            "absolute left-1/2 top-0 h-[18px] w-[3px] -translate-x-1/2 rounded bg-border transition-transform duration-300",
            happy && "-rotate-12"
          )}
        >
          <span className={cn("absolute -top-[7px] left-1/2 h-[9px] w-[9px] -translate-x-1/2 rounded-full transition-colors", happy ? "bg-primary" : "bg-muted-foreground/50")} />
        </span>
        <span className="absolute left-1/2 top-[18px] flex h-[42px] w-[56px] -translate-x-1/2 justify-center gap-2.5 rounded-[14px] border-2 bg-card pt-[13px]">
          <i className={cn("h-1 w-[9px] rounded bg-muted-foreground/50 transition-all duration-300", happy && "h-[11px] rounded-full bg-primary")} />
          <i className={cn("h-1 w-[9px] rounded bg-muted-foreground/50 transition-all duration-300", happy && "h-[11px] rounded-full bg-primary")} />
        </span>
        <span className="absolute bottom-0 left-1/2 h-[22px] w-[42px] -translate-x-1/2 rounded-b-[13px] rounded-t-[9px] border-2 bg-card" />
      </div>
      <p className="text-center text-[13px] text-muted-foreground">
        {happy ? (happyText ? happyText(itemCount) : `${itemCount} פריטים - הרובוט מאושר`) : emptyText}
      </p>
    </div>
  );
}
