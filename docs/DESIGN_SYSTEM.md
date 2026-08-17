# Design System

## Emotional direction

Birthday first. Relationship second.

The world should feel like:

- white + soft cream base
- lavender / purple as the main identity
- blush pink hearts and highlights
- translucent glass used as jewelry, not generic SaaS cards
- old-letter typography in selected scenes
- Darion's casual sentences interrupting any scene that becomes too dramatic

## Colors

Tailwind theme tokens live in `src/styles.input.css`.

Key custom tokens:

- `cream` — page base
- `plum` — primary text instead of black
- `berry`, `orchid`, `roseglass` — relationship palette
- built-in Tailwind purple/fuchsia/pink ranges for states and surfaces

## Typography

- Display: Cormorant Garamond
- Body/UI: DM Sans
- Ethiopic if added later: Noto Serif Ethiopic

Fonts load from Google Fonts with system fallbacks. No font files are bundled.

## Responsive approach

Mobile is not a shrunk desktop:

- single-column reading rhythm
- large touch targets
- clear instructions above interactions
- no hover-only required actions
- place cards tap open
- HOLD uses Pointer Events so mouse and touch share the same behavior

At `md` and `lg`, memory rows and grids become editorial multi-column layouts.
