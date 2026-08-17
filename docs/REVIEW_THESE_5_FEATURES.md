# Review build — only the 5 locked upgrades

This build intentionally adds **only** the five upgrades agreed with Darion. The beloved white / pink / purple birthday experience and its existing story stay intact underneath.

## 1 — Mysterious heart + passcode entry
File: `src/pages/01_EntryGatePage.js`

- Three deliberate taps progressively crack the glass heart.
- Small hearts escape as the cracks grow.
- The six-digit memory challenge appears only after the third break.
- The answer is **not shown upfront**.
- Wrong attempts progressively make the clue clearer without making Fendisha feel stupid.
- Correct passcode remains `521152`.

Reset the experience with: `http://localhost:4173/?reset=1`

## 2 — Birthday Room parallax
File: `src/pages/02_BirthdayRoomPage.js`
Art: `public/art/birthday-room-*.svg`

- A birthday-first purple / pink / white room appears immediately after entry.
- The page clearly says to scroll slowly.
- Scroll depth moves the room toward the purple door.
- The door only becomes the next action once Fendisha reaches it.
- It is original layered artwork, not presented as a real memory.

## 3 — 21 little things Darion notices
Component: `src/components/SecretHeart.js`
Content: `src/content.js` → `heartNotes`

- Exactly 21 optional hearts are distributed through the whole experience.
- They are observations, jokes and tiny truths — not a generic “21 reasons” list.
- Progress persists locally.

## 4 — Choose the mood
File: `src/pages/03_MoodChoicePage.js`

Fendisha chooses one short birthday detour:
- make me smile
- make me blush
- make me emotional

The choice changes the next mini-sequence, then rejoins the same main birthday story. The choice persists on return.

## 5 — Old Soul Mode
File: `src/components/OldSoulToggle.js`
Styles: `src/styles.input.css`

- A small correspondence-seal control toggles the experience into a warmer ivory / letter-like treatment.
- It changes material, typography and atmosphere — not Darion's actual voice.
- It is a subtle nod to the old-world romance she loves, not a direct imitation of a specific show.

## What was deliberately NOT added
No feature #6 or later ideas were added. This ZIP is for reviewing these five additions only.
