# Motion recipes

Timing vocabulary, use these, do not freestyle:
- Micro (press, hover): 100-150ms, `ease-out`
- UI (fade, slide, toggle): 200-300ms, `cubic-bezier(0.22, 1, 0.36, 1)` (out-expo feel)
- Entrance choreography: 300-500ms total, stagger 40-60ms per item

Always wrap with reduced motion:

```tsx
const reduce = useReducedMotion(); // framer-motion
// or in CSS:
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

## Staggered list entrance (Framer Motion)

```tsx
const list = { show: { transition: { staggerChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

<motion.ul variants={list} initial="hidden" animate="show">
  {rows.map((r) => <motion.li key={r.id} variants={item}>{/* ... */}</motion.li>)}
</motion.ul>
```

In RTL the stagger order follows reading order automatically when you animate `y` and `opacity` only - prefer that over `x`.

## Press feedback

```tsx
<motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} transition={{ duration: 0.12 }}>
```

## Page / tab transitions

```tsx
<AnimatePresence mode="wait">
  <motion.div key={routeKey}
    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2, ease: "easeOut" }}>
    {children}
  </motion.div>
</AnimatePresence>
```

Keep exit short (<=150ms). The skeleton rule still applies: heavy tabs show a skeleton after the fade-in, not a blank panel.

## Skeleton shimmer (dark UIs)

```css
.shimmer {
  background: linear-gradient(100deg,
    hsl(var(--muted)) 40%, hsl(var(--muted-foreground) / 0.18) 50%, hsl(var(--muted)) 60%);
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
}
@keyframes shimmer { to { background-position: -200% 0; } }
```

In RTL the sweep direction is unchanged - shimmer is ambient, not reading order.

## Count-up numbers

For stat cards, count from 0 to the value over ~600ms with an ease-out. Use a rAF loop, format with `Intl.NumberFormat` (respects the active locale: `he-IL` groups with commas the same as `en-US` - do not hardcode separators).

## Layout transitions

When an element moves because data changed (reorder, resize, appear), use `layout` on the motion component or the View Transitions API for route-level changes. Never animate `top/left/width/height` by hand.
