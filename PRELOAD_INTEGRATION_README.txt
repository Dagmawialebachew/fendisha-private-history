FENDISHA — PRELOAD / HERO / ARTIFACT INTEGRATION
================================================

WHAT CHANGED
------------
1. Added src/assetManifest.js
   - Lists every visual asset that should be warmed while the pre-birthday gate is still visible.
   - Lists audio separately so photographs get network priority.

2. Added src/components/AssetPreloader.js
   - Starts automatically when PreBirthdayGate mounts.
   - Preloads ALL visual assets + waits for web fonts.
   - Uses a 5-file image pool so it does not open dozens of connections at once.
   - Individual failed assets NEVER brick the door.
   - Audio warms afterward with low concurrency.

3. Updated src/components/PreBirthdayGate.js
   - Silent preload starts while she is still locked.
   - If she presses OPEN THE DOOR before visuals are finished, the gate stays in place.
   - It changes to an old-world preparation message with REAL asset-count progress.
   - ExperienceApp is not entered until the visual preload settles.

4. Updated src/pages/04_BirthdayHeroPage.js
   - Hero now expects the 2x2 favorites collage.
   - It displays square without cropping the collage.

5. Updated src/config.js
   - Added media.heroCollage.

6. Updated index.html
   - Browser begins fetching the room master + hero collage before the React app even starts.

7. Updated vercel.json
   - release-status.json remains no-store.
   - media/art/audio now revalidate so stale pre-launch files do not stay stuck in a browser cache.

WHAT YOU MUST ADD TO PUBLIC
---------------------------
You did not send /public. That is okay for the source integration, but BEFORE BUILD/DEPLOY make sure these are present:

NEW HERO COLLAGE (REQUIRED)
public/media/photos/fendisha-favorites-collage.webp

REAL HANDWRITTEN NOTE (ALREADY WIRED BY EXISTING ARTIFACT PAGE)
public/media/photos/handwritten-letter.jpg

VOICE FILES (EXISTING PATHS)
public/media/voice/01-opening.mp3
public/media/voice/02-calls.mp3
public/media/voice/03-distance.mp3
public/media/voice/04-faith.mp3
public/media/voice/05-future.mp3
public/media/voice/06-final-birthday.mp3

IMPORTANT
---------
- Keep your existing public folder. Do NOT replace it with an empty one.
- Copy these patched source files into the real project, where your current public folder already exists.
- Then run npm run build.
- Test ?releasedPreview=1 in a clean/incognito browser.
- On the released page, press OPEN THE DOOR. If images are not ready yet, you should see the preparation percentage instead of entering instantly.
- If the gate has been open for a while, the percentage may already be 100% and entry will feel instant. That is the intended behavior.
