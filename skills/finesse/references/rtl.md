# RTL: build it in, do not bolt it on

Applies whenever the product serves Hebrew, Arabic or any RTL language - even "later". Retrofitting RTL into a codebase built on physical properties costs days; logical properties from the first commit cost nothing.

## 1. Logical properties, always

Banned for layout: `ml- mr- pl- pr- left- right- text-left text-right border-l border-r rounded-l rounded-r`.
Use instead: `ms- me- ps- pe- start- end- text-start text-end border-s border-e rounded-s rounded-e`.

In raw CSS: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `border-start-start-radius`.

`w-`/`h-` are fine (axis, not direction). `top-`/`bottom-` are fine.

## 2. Direction comes from the document, not from components

- Set `dir="rtl"` and `lang="he"` on `<html>` (or the locale's layout), never per-component.
- Components use logical properties and inherit direction. A component that hardcodes a direction is a bug.
- Chat UIs: the current user's messages sit on the trailing edge (right in both LTR and RTL, like iMessage), the other party on the leading edge - this is a physical convention, so use physical alignment (`margin-left:auto`) for the bubbles, while text and padding inside them stay logical.

## 3. Icons that must mirror in RTL

Mirror (flip horizontally): arrows (`ArrowRight`, `ChevronRight`, `Undo`, `Reply`, `Send` when it points), back/forward navigation, "progress" metaphors (sliders, step indicators, reading progress).

Never mirror: clocks, logos, media controls (play/pause/skip are physical metaphors), checkmarks, search, most brand icons.

```tsx
import { ArrowRight } from "lucide-react";
// Mirrors itself in RTL:
<ArrowRight className="rtl:-scale-x-100" />
```

Tailwind's `rtl:` variant works when the dir attribute is set. For libraries without variants, wrap in a `.icon-dir { }` class and flip with `[dir="rtl"] .icon-dir { transform: scaleX(-1); }`.

## 4. Bidi: numbers, phones, dates stay LTR

Phone numbers, credit card fragments, dates and code snippets are LTR content even inside RTL text:

```tsx
<span dir="ltr" className="tabular-nums">054-123-4567</span>
```

Mixed strings (a Hebrew label + an English product name) usually need `dir="auto"` on the element so the base direction follows the first strong character.

Format with the locale, never string-concat:
- Dates: `new Intl.DateTimeFormat("he-IL", { dateStyle: "medium" })`
- Numbers/currency: `new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" })`

## 5. Hebrew typography

- Body/UI font: Heebo or Assistant (both cover Hebrew + Latin properly). Rubik is a third option.
- Set the stack once: `font-family: "Heebo", "Inter", system-ui, sans-serif;` so Latin falls through to Inter.
- Hebrew has no italics tradition and no small caps - do not use either for emphasis in Hebrew text; use weight and color.
- Line height: Hebrew diacritic-free text reads tight; `leading-relaxed` (1.625) minimum for body.
- Text aligns `text-start` - in RTL that is right-aligned automatically. Never `text-right` directly.

## 6. Test it

Every build that touches layout gets one RTL pass: `<html dir="rtl" lang="he">`, walk the screen, look for unmirrored arrows, clipped text, and LTR islands that broke alignment. If the harness can render, screenshot both directions.
