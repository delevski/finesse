---
name: finesse
description: "Design skill for Next.js + shadcn/ui + Tailwind app interfaces. Use when building or refactoring React components, pages, dashboards, forms, chats or settings screens so they come out polished, animated and RTL-aware instead of default-looking. Trigger when the user asks to build a UI, says 'finesse', 'make it look designed', 'polish this', or when a component looks like library defaults."
argument-hint: "[component or page path] | audit <path>"
version: 1.0.0
metadata:
  opencode/slash: "true"
---

# Finesse

Makes the interfaces a coding assistant generates feel designed: a hard bar for interaction states, motion with intent, a real token system, and first-class RTL. Built for app UI - dashboards, forms, lists, chats - not landing pages.

Above the bar you are the designer. Below it, nothing ships.

## The Bar

Binds every component and page, none of it waivable:

1. **Every action shows feedback.** Any submit, save, delete or fetch shows a pending state (spinner or skeleton), guards against double submit, and on failure shows an inline error with retry. A button that silently does nothing is a bug. See `references/states.md`.
2. **Never a blank screen.** First load, tab switches and route changes render a skeleton or cached content immediately. An empty list gets a designed empty state with one clear next action, not a void.
3. **Tokens only.** Every color, radius, shadow and font comes from the theme tokens (`hsl(var(--...))` in shadcn, CSS variables otherwise). No hex literals, no `font-family` outside the token block, no one-off Tailwind grays when a semantic token exists (`muted-foreground`, not `text-gray-500`).
4. **Motion has a reason.** Entrance stagger for lists, layout transitions when elements move, micro-feedback on press. Never `transition: all`. Never animate `width`, `height`, `top` or `left` - use `transform` and `opacity`. Every animation has a `prefers-reduced-motion` fallback. See `references/motion-recipes.md`.
5. **RTL is structural, not an afterthought.** Logical properties everywhere (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-` - never `ml/mr/pl/pr/left/right` for layout). Directional icons mirror. Numbers, phones and dates stay LTR inside RTL text. Hebrew gets a font built for it (Heebo, Assistant). Full rules: `references/rtl.md`.
6. **Every interactive element has a visible `:focus-visible` state** and a real `aria-label` when its label is an icon.
7. **Never invented content.** No fake metrics, testimonials, avatars of "real" people, or placeholder copy that reads as fact in a production UI. Demo content is labelled as demo.
8. **No dead controls.** Every button, tab, filter and toggle you render must work or must not render. A disabled control says why.

## Flow

0. **Read the project first.** `app/globals.css` for the token set, `tailwind.config`, existing components for the established patterns. Match them before inventing anything.
1. **Build the states first.** Skeleton, empty, error, success - then the happy path. The happy path is the easy half.
2. **Add motion with intent.** Pick from `references/motion-recipes.md`; do not freestyle timing curves.
3. **If the product serves Hebrew or Arabic, build RTL from the first commit**, not as a later pass. `references/rtl.md`.
4. **Self-review** against `references/review-checklist.md` before handing back. If the harness can render, screenshot at mobile and desktop widths and look at it.

## Verbs

- `finesse <path>` - apply the full bar to the component or page at path.
- `finesse audit <path>` - report only: list every violation of the bar with file and line, no edits.

Any other change to an existing design is not a finesse run: do it as asked, in the project's own system.

## Reference files

- `references/states.md` - loading, empty, error, retry, double-submit guard, with copy-paste React patterns.
- `references/motion-recipes.md` - Framer Motion and CSS recipes: staggered lists, page transitions, press feedback, skeleton shimmer, count-up numbers.
- `references/rtl.md` - the complete RTL checklist: logical properties, icon mirroring, bidi text, Hebrew fonts, number and date formatting.
- `references/shadcn-theme.md` - building a real token system on shadcn/ui: semantic colors, radius and elevation scale, dark mode.
- `examples/before-after/` - pairs of components: the default-looking version an agent produces, and the same component after finesse.
