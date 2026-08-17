# For My Fendisha 🍿 — 21st Birthday

A light, purple/pink, heart-filled birthday experience built around **her first**, then the relationship around her. The visual direction is feminine old-soul romance + modern glass details + Darion's normal voice and stupid jokes.

## What this rebuild intentionally fixes

- No black full-screen sections.
- Purple is the dominant identity because it is her favorite color.
- The page is a **birthday gift**, not an anniversary report.
- No “she fell first / she had the crush” framing.
- No phone-loss guilt scene.
- No forensic February 13 message log.
- The opening interaction explains itself step by step.
- The heart “break-in” happens across three clear taps with cracks + heart bursts before the password appears.
- Every HOLD interaction says exactly what holding means for mouse and touch.
- Copy uses easy English, a little old-world romance, and Darion-style interruptions instead of archive-bot language.
- Missing real-location photos use clearly labeled **reimagined illustrations**, never fake evidence.
- Responsive layouts are mobile-first and intentionally change at tablet/desktop sizes.
- An optional appendix explains the little choices inspired by her tastes.

## Stack

- Semantic HTML
- Modular ES modules
- TailwindCSS 4 build pipeline
- Small custom material/animation layer for the glass heart, paper, hearts and hold interaction
- No runtime framework dependency: once `/dist` is built, it is a static site and loads fast on Android/desktop

This is deliberate: the birthday experience does not need a framework boot sequence or a server dependency to work.

## Preview

The ZIP already includes `/dist`.

```powershell
npm run start
```

Then open `http://localhost:4173`.

The six-digit passcode is `521152`.

## Rebuild after editing source

```powershell
npm install
npm run build
npm run start
```

`npm run build` compiles Tailwind utilities from the actual classes in the project and copies source/media into `/dist`.

## Replacing only photos or voice notes

Replace files inside `public/media/...`, then:

```powershell
npm run sync:media
```

No Tailwind rebuild is required for media-only changes.

## Deployment

Deploy the **contents of `/dist`** to any static host. `index.html` already contains `noindex,nofollow,noarchive` metadata. The password is sentimental access control, not cryptographic security; use an unguessable private URL in addition to it.
