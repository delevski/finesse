# Finesse

This repo is a design skill for coding agents. The canonical skill lives at
[`skills/finesse/SKILL.md`](skills/finesse/SKILL.md) - read it before building
or refactoring any UI in a Next.js + shadcn/ui + Tailwind project.

The short version that binds every UI change:

1. Every action shows feedback: pending state, double-submit guard, error with retry.
2. Never a blank screen: skeletons on first load and tab switches, designed empty states.
3. Tokens only: no hex colors or font stacks outside the theme.
4. Motion with intent: transform/opacity only, reduced-motion fallback, no `transition: all`.
5. RTL is structural: logical properties, mirrored directional icons, LTR islands for numbers/phones, Hebrew-capable fonts.
6. Every rendered control works. No dead buttons, no "ready to use" cards.
7. No invented content; demo data is labelled.

Details and copy-paste patterns: `skills/finesse/references/`.
Before/after component pairs: `skills/finesse/examples/before-after/`.
Live gallery: https://delevski.github.io/finesse/
