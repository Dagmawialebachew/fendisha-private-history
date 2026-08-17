# Asset Guide

The current files are polished purple/pink placeholders so the page never looks broken. Replace only what you actually have.

## Required photos

| File | Put here | What to use |
|---|---|---|
| `favorite-her.jpg` | `public/media/photos/` | Your favorite beautiful photo of her. This is the main birthday hero. |
| `fendisha-laugh.jpg` | same | Her laughing / smiling naturally. |
| `fendisha-mad.jpg` | same | The mad-face photo you actually love 😂 |
| `first-date.jpg` | same | Best photo connected to Nov 25, 2025. If none exists, use another early photo rather than inventing one. |
| `kemis-netela.jpg` | same | The real Feb 13 photo of you in kemis + netela. |
| `handwritten-letter.jpg` | same | A clean phone photo/scan of your real handwritten final letter. |

## Relationship-place photos

These are recommended, but the site stays attractive with placeholders:

- `library.jpg`
- `basketball.jpg`
- `bowling.jpg`
- `cinema.jpg`
- `kukuye.jpg`
- `ginfle.jpg`
- `walking.jpg`
- `gondar.jpg`

## Optional

- `childhood.jpg` — currently not displayed prominently; useful if you later add a “before Darion” strip.

## Places where you have no photo

Do **not** generate an AI image and present it like a real memory.

The project already includes:

- `public/art/aau-fifth-gate-reimagined.svg`
- `public/art/frfr-cafe-reimagined.svg`

They are intentionally labeled as reimagined illustrations. This solves the missing-photo problem without lying to her.

If you later generate a nicer stylized illustration, keep a tiny “reimagined” note somewhere in the artwork/caption.

## Her birthday gift to you

Three screenshots you provided are already included under:

`public/media/her-gift/`

They appear in the “You kind of started this” section.

## After replacing media

Run:

```powershell
npm run sync:media
```

Then refresh the browser.
