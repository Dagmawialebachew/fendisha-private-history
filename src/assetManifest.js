/*
|-----------------------------------------------------------------------------
| ASSET PRELOAD MANIFEST
|-----------------------------------------------------------------------------
|
| The birthday experience mounts one scene at a time, which is great for DOM
| performance, but it also means a future scene would normally request its
| images only when that scene appears.
|
| We intentionally preload every visual asset while the pre-birthday gate is
| still on screen so later pages do not pause to fetch photographs.
|
| Audio is warmed separately and never blocks entry.
|
*/

export const VISUAL_ASSETS = [
  '/art/hearts-pattern.svg',
  '/art/room/fendisha-room-master.png',
  '/art/aau-fifth-gate-reimagined.svg',
  '/art/frfr-cafe-reimagined.svg',
  '/art/kidane-mihret-line.svg',

  // Birthday Hero — new 2x2 favorites collage.
  '/media/photos/favorite-her.jpg',

  '/media/photos/fendisha-laugh.jpg',
  '/media/photos/fendisha-mad.jpg',
  '/media/photos/first-date.jpg',
  '/media/photos/kemis-netela.jpg',

  '/media/photos/library.jpg',
  '/media/photos/basketball.jpg',
  '/media/photos/bowling.jpg',
  '/media/photos/cinema.jpg',
  '/media/photos/kukuye.jpg',
  '/media/photos/ginfle.jpg',
  '/media/photos/concert.jpg',
  '/media/photos/airport.jpg',
  '/media/photos/walking.jpg',
  '/media/photos/gondar.jpg',

  // Finale — all versions of her.
  '/media/photos/fendisha-school-01.jpg',
  '/media/photos/fendisha-school-02.jpg',
  '/media/photos/fendisha-school-03.jpg',
  '/media/photos/fendisha-school-04.jpg',
  '/media/photos/fendisha-school-05.jpg',
  '/media/photos/favorite-her-1.jpg',

  // Artifact + hidden receipt.
  '/media/photos/handwritten-letter.jpg',
  '/media/secrets/is-he-single.jpg',

  // Her birthday website to Darion.
  '/media/her-gift/memories.png',
  '/media/her-gift/things-i-love.png',
  '/media/her-gift/your-language.png',
];


export const AUDIO_ASSETS = [
  '/audio/prelude/birthday-jazz.m4a',

  '/audio/sfx/birthday-confetti-pop.wav',
  '/audio/sfx/birthday-room-ambience.wav',
  '/audio/sfx/birthday-sparkle.wav',
  '/audio/sfx/door-open.wav',
  '/audio/sfx/glass-crack-1.wav',
  '/audio/sfx/glass-crack-2.wav',
  '/audio/sfx/glass-crack-3.wav',
  '/audio/sfx/glass-tap.wav',
  '/audio/sfx/heart-chime.wav',
  '/audio/sfx/mood-sparkle.wav',
  '/audio/sfx/paper-seal.wav',

  '/media/voice/01-opening.mp3',
  '/media/voice/02-calls.mp3',
  '/media/voice/03-distance.mp3',
  '/media/voice/04-faith.mp3',
  '/media/voice/05-future.mp3',
  '/media/voice/06-final-birthday.mp3',
  '/media/voice/fendisha-laugh.mp3',
];
