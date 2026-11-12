# States: the half of the UI agents skip

Every async boundary in the UI has four visible states: pending, success, error, empty. Build all four. The happy path alone is a demo, not a product.

## 1. Submit with pending, guard and retry

```tsx
function useSubmit<T>(fn: () => Promise<T>) {
  const [state, setState] = useState<"idle" | "pending" | "error" | "success">("idle");
  const run = async () => {
    if (state === "pending") return;            // double-click guard
    setState("pending");
    try {
      await fn();
      setState("success");
    } catch {
      setState("error");                        // keep the form data, offer retry
    }
  };
  return { state, run };
}

// In the button:
<Button onClick={run} disabled={state === "pending"} aria-busy={state === "pending"}>
  {state === "pending" ? <Loader2 className="size-4 animate-spin" /> : null}
  {state === "pending" ? "Saving..." : "Save"}
</Button>
{state === "error" && (
  <p role="alert" className="text-sm text-destructive">
    Could not save. <button className="underline" onClick={run}>Try again</button>
  </p>
)}
```

Rules:
- The pending state starts within one frame of the click. Never await-then-setState.
- Disable the control while pending; do not rely on the guard alone.
- On error, keep everything the user typed. The retry reuses it.
- "Saving..." / "שומר..." - say what is happening, not just a spinner.

## 2. Skeletons, not blank screens

Match the skeleton's shape to the content's layout so the swap does not jump:

```tsx
function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4" aria-hidden>
      <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
      <div className="mt-3 h-8 w-1/2 rounded bg-muted animate-pulse" />
    </div>
  );
}
```

- Use it on first load AND on tab switches - cached content stays visible while refetching, a skeleton appears when there is nothing cached.
- `animate-pulse` is the floor; a shimmer sweep (see motion-recipes.md) reads better on dark UIs.

## 3. Empty states that point somewhere

An empty state has three parts: what this space is, why it is empty, one action.

```tsx
<EmptyState
  icon={<Inbox className="size-8 text-muted-foreground" />}
  title="No customers yet"
  body="Customers you add will show up here with their history."
  action={<Button>Add your first customer</Button>}
/>
```

Never a bare "No data" string. Never a card that says "ready to use".

## 4. Full-screen loading and failure

App shell: render the shell (sidebar, header) instantly, skeleton the content region. A whole-screen spinner is a last resort, and it still gets the product name and a logo so the screen never reads as broken.
