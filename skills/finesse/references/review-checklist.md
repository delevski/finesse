# Pre-ship review checklist

Run this before handing back any UI work. Answer out loud; "yes" means you checked.

## States
- [ ] Every submit/save/delete shows pending, guards double clicks, and offers retry on error
- [ ] First load and every tab switch render a skeleton or cached content - no blank screen, ever
- [ ] Every list has a designed empty state with one next action
- [ ] Every control on the screen works; nothing half-built is rendered

## Tokens and theme
- [ ] No hex colors or font-family outside the token block
- [ ] No raw grays where a semantic token exists
- [ ] Dark mode re-tuned, not inverted; no flash of wrong theme on load

## Motion
- [ ] No `transition: all`; transforms and opacity only
- [ ] Reduced-motion fallback verified
- [ ] Entrance choreography under ~500ms total; nothing blocks reading

## RTL (if the product serves RTL languages)
- [ ] Zero physical margin/padding/position utilities in the diff
- [ ] Directional icons mirror; logos and media controls do not
- [ ] Phones, numbers, dates wrapped `dir="ltr"` and formatted with Intl
- [ ] Hebrew font covers the whole UI, including generated/LLM text - English strings in a Hebrew UI are a bug

## Accessibility floor
- [ ] Visible `:focus-visible` on every interactive element
- [ ] Icon-only buttons have `aria-label`
- [ ] Errors use `role="alert"`; busy regions use `aria-busy`

## Content
- [ ] No invented metrics, testimonials or people
- [ ] Demo data is labelled as demo
