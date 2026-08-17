export const HEART_TOTAL =
  21;


export const heartSecrets = [

  /*
  |--------------------------------------------------------------------------
  | 01 — TUTORIAL
  |--------------------------------------------------------------------------
  */

  {
    id: 1,

    kind:
      'intro',

    title:
      'okayyy 😭 u touched it.',

    body:
      'I was actually wondering how long it would take u.',

    secondary:
      'Some of these tiny hearts are hiding little things from me. If u see another one anywhere in here... touch it.',

    footer:
      "I'm not telling u where they are though 💜. But it is better to look for after finishing the page content fully",
  },


  /*
  |--------------------------------------------------------------------------
  | 02 — BIRTHDAY HERO
  |--------------------------------------------------------------------------
  */

  {
    id: 2,

    kind:
      'note',

    message:
      'twenty-one looks really good on u.',

    sub:
      'yeah ik u have barely been 21 for five minutes 😭',
  },


  /*
  |--------------------------------------------------------------------------
  | 03 — THINGS I NOTICE
  |--------------------------------------------------------------------------
  */

  {
    id: 3,

    kind:
      'note',

    message:
      'I love your actual Fendisha laugh 😂',

    sub:
      'the one that changes your whole face.',
  },


  /*
  |--------------------------------------------------------------------------
  | 04 — THINGS I NOTICE
  |--------------------------------------------------------------------------
  */

  {
    id: 4,

    kind:
      'note',

    message:
      'I notice how deeply u care about your people.',

    sub:
      'that kind of heart is not something everybody has.',
  },


  /*
  |--------------------------------------------------------------------------
  | 05 — OUR MOMENTS
  |--------------------------------------------------------------------------
  */

  {
    id: 5,

    kind:
      'note',

    message:
      'Frfr Tera Café somehow became important.',

    sub:
      'one introduction... and somehow all this 😂',
  },


  /*
  |--------------------------------------------------------------------------
  | 06 — OUR MOMENTS
  |--------------------------------------------------------------------------
  */

  {
    id: 6,

    kind:
      'note',

    message:
      'I still remember seeing u at Fifth Gate.',

    sub:
      'another normal place that stopped feeling normal.',
  },


  /*
  |--------------------------------------------------------------------------
  | 07 — CALLS
  |--------------------------------------------------------------------------
  */

  {
    id: 7,

    kind:
      'note',

    message:
      'Ethio Telecom really tried to separate us every 2 hours 😭',

    sub:
      'we simply called again.',
  },


  /*
  |--------------------------------------------------------------------------
  | 08 — CALLS
  |--------------------------------------------------------------------------
  */

  {
    id: 8,

    kind:
      'note',

    message:
      'I really love hearing u sing.',

    sub:
      'yes... I notice more than I act like I do.',
  },


  /*
  |--------------------------------------------------------------------------
  | 09 — PLACES
  |--------------------------------------------------------------------------
  */

  {
    id: 9,

    kind:
      'note',

    message:
      'Kukuye is one of those memories I would happily replay.',

    sub:
      'simple day. very good feeling.',
  },


  /*
  |--------------------------------------------------------------------------
  | 10 — PLACES
  |--------------------------------------------------------------------------
  */

  {
    id: 10,

    kind:
      'note',

    message:
      'Ginfle: 2 people, 2 stolen phones 😭',

    sub:
      'elite awareness of our surroundings.',
  },


  /*
  |--------------------------------------------------------------------------
  | 11 — PLACES
  |--------------------------------------------------------------------------
  */

  {
    id: 11,

    kind:
      'note',

    message:
      'the airport hit differently.',

    sub:
      'I still remember how that goodbye felt.',
  },


  /*
  |--------------------------------------------------------------------------
  | 12 — FEB 13
  |--------------------------------------------------------------------------
  */

  {
    id: 12,

    kind:
      'note',

    message:
      'yes, the kemis + netela photo still exists 😂',

    sub:
      'and unfortunately I looked kind of good.',
  },


  /*
  |--------------------------------------------------------------------------
  | 13 — DISTANCE
  |--------------------------------------------------------------------------
  */

  {
    id: 13,

    kind:
      'note',

    message:
      'quiet never meant u stopped mattering.',

    sub:
      'I just need to show that better.',
  },


  /*
  |--------------------------------------------------------------------------
  | 14 — DISTANCE
  |--------------------------------------------------------------------------
  */

  {
    id: 14,

    kind:
      'note',

    message:
      'distance cannot delete what already matters.',

    sub:
      'Addis still has my favorite girl anyway 💜',
  },


  /*
  |--------------------------------------------------------------------------
  | 15 — FAITH
  |--------------------------------------------------------------------------
  */

  {
    id: 15,

    kind:
      'note',

    message:
      'I really did pray about u.',

    sub:
      '“if she is for me... keep her.”',
  },


  /*
  |--------------------------------------------------------------------------
  | 16 — PAST LIVES
  |--------------------------------------------------------------------------
  */

  {
    id: 16,

    kind:
      'note',

    message:
      'I would probably be slow in 1925 too 😭',

    sub:
      'somebody would still have to introduce us.',
  },


  /*
  |--------------------------------------------------------------------------
  | 17 — FUTURE
  |--------------------------------------------------------------------------
  */

  {
    id: 17,

    kind:
      'note',

    message:
      'I genuinely want really good things for u.',

    sub:
      'even the good things that have nothing to do with me.',
  },


  /*
  |--------------------------------------------------------------------------
  | 18 — HER GIFT
  |--------------------------------------------------------------------------
  */

  {
    id: 18,

    kind:
      'note',

    message:
      'this entire website is partly your fault 😂',

    sub:
      'u made me a world from our memories first.',
  },


  /*
  |--------------------------------------------------------------------------
  | 19 — THE SECRET RECEIPT
  |--------------------------------------------------------------------------
  */

  {
    id: 19,

    kind:
      'receipt',

    title:
      'there is something u probably thought I never knew.',

    intro:
      'A long time ago... one of my friends posted me on his story for my birthday.',

    setup:
      'And apparently one particular girl replied with a very interesting question 😭',

    quote:
      '“is he single?”',

    reaction:
      'FKR 😭😭😭 U REALLY THOUGHT THIS INFORMATION WAS NEVER GOING TO REACH ME???',

    body:
      'I am not showing u this to embarrass u. I just think it is ridiculously cute knowing u were somewhere asking about me while I had absolutely no idea.',

    footer:
      'secret safe with me... well, mostly 😭💜',
  },


  /*
  |--------------------------------------------------------------------------
  | 20 — AFTERWORD
  |--------------------------------------------------------------------------
  */

  {
    id: 20,

    kind:
      'note',

    message:
      'none of the tiny details were random.',

    sub:
      'yes... I massively overthought your birthday website.',
  },


  /*
  |--------------------------------------------------------------------------
  | 21 — FINAL HEART
  |--------------------------------------------------------------------------
  */

  {
    id: 21,

    kind:
      'final',

    title:
      'u actually found all 21?? 😭',

    body:
      'okay then... nothing left for the tiny hearts to hide.',

    finale:
      'I notice u. I remember things. And I love u. 💜',

    footer:
      'happy 21st, My Fendisha 🍿',
  },

];


export function getHeartSecret(
  id
) {
  return (
    heartSecrets.find(
      item =>
        item.id ===
        Number(id)
    ) ||
    null
  );
}