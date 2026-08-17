# Audio used by the five-feature review build

All new interaction SFX in this build are original procedural WAV files bundled in `public/audio/sfx/`, so this review build does **not** require downloading third-party audio.

- `glass-tap.wav` — gentle wrong-attempt / glass touch
- `glass-crack-1.wav` — first heart crack
- `glass-crack-2.wav` — second crack
- `glass-crack-3.wav` — final break
- `heart-chime.wav` — successful reveal / unlock
- `door-open.wav` — Birthday Room door
- `mood-sparkle.wav` — mood choice
- `paper-seal.wav` — Old Soul Mode toggle
- `birthday-room-ambience.wav` — soft room ambience

If these are later replaced with downloaded sounds, keep the same filenames and paths so no React file needs changing.

Music is intentionally not baked into every screen. Darion's real voice and selected personal audio should remain the emotional focus; `docs/VOICE_GUIDE.md` covers those slots.
