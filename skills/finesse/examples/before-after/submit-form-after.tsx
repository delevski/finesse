// AFTER: pending state in one frame, double-submit guard, inline error
// with retry that keeps the input, success feedback, focus rings,
// logical properties, labels tied to inputs.

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "pending" | "error" | "success">("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "pending") return; // double-click guard
    setState("pending");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", { method: "POST", body: data });
      if (!res.ok) throw new Error();
      setState("success");
    } catch {
      setState("error"); // FormData already captured; the form keeps its values
    }
  };

  if (state === "success")
    return (
      <div className="flex items-center gap-2 rounded-xl border bg-card p-4 text-sm">
        <CheckCircle2 className="size-4 text-emerald-500" aria-hidden />
        Message sent. We will get back to you soon.
      </div>
    );

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" dir="ltr" autoComplete="email" required />
      </div>
      <Button disabled={state === "pending"} aria-busy={state === "pending"}>
        {state === "pending" && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {state === "pending" ? "Sending..." : "Send"}
      </Button>
      {state === "error" && (
        <p role="alert" className="text-sm text-destructive">
          Sending failed. Your message is still here - try again.
        </p>
      )}
    </form>
  );
}
