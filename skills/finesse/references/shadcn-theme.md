# A real token system on shadcn/ui

The default shadcn theme is a starting point, not a design. A designed product has a point of view: one accent, a deliberate neutral scale, a radius personality, an elevation scale.

## Semantic tokens only

Components consume semantic tokens, never raw palette colors:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 4%;
  --card: 0 0% 100%;
  --muted: 240 5% 96%;
  --muted-foreground: 240 4% 46%;
  --primary: 173 80% 40%;       /* the ONE accent - pick it on purpose */
  --primary-foreground: 0 0% 100%;
  --destructive: 0 72% 51%;
  --border: 240 6% 90%;
  --ring: 173 80% 40%;
  --radius: 0.75rem;            /* radius personality: sharp 0.25, friendly 0.75, soft 1 */
}
.dark { /* the same semantics, re-tuned - never an inverted copy */ }
```

In components: `bg-card text-muted-foreground border-border` - never `bg-white text-gray-500`.

## Elevation is a scale, not a sprinkle

Pick 3-4 shadows and name them (e.g. `--shadow-1` rest card, `--shadow-2` hover/raised, `--shadow-3` overlay). Dark mode: shadows barely read - use border contrast and background lightness steps instead.

## Dark mode

- It is a second design, not `filter: invert`. Muted surfaces go lighter than background, borders get more contrast.
- Persist the choice (`localStorage` + class strategy), respect `prefers-color-scheme` as the default, never flash the wrong theme on load (inline the theme script in `<head>`).

## Focus ring

One ring style product-wide: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`. It appears on keyboard focus, instantly, on everything interactive.
