/*
|--------------------------------------------------------------------------
| FENDISHA — SOUNDTRACK CONFIG
|--------------------------------------------------------------------------
|
| OurSoundtrack.js ENFORCES these values.
|
| playForSeconds = how long the track actually plays
| gapAfterMs = jazz-only breathing gap before the next track
| startWindowSeconds = random point inside the song where playback begins
|
*/

export const soundtrack = {
  spotify:
    'https://open.spotify.com/playlist/0YQnOwNO5BvM7DIFNWJ0Kw?si=a-y6fQUYQLezjOEFXhm0Iw',

  title:
    'our soundtrack',

  subtitle:
    'some songs became ours without asking permission.',

  playback: {
    defaultPlayForSeconds:
      75,

    defaultGapAfterMs:
      7000,

    startTrackIndex:
      0,

    loopSequence:
      true,

    startMode:
      'random-window',

    forceBeginning:
      false,
  },

  notes: [
    {
      title:
        "Say You Won't Let Go",

      artist:
        'James Arthur',

      note:
        'yeah... obviously this one had to be first 💜',

      spotify:
        'https://open.spotify.com/track/5uCax9HTNlzGybIStD3vDh?si=0fe08567ac454d03',

      playForSeconds:
        120,

      gapAfterMs:
        8000,

      startWindowSeconds:
        [20, 50],
    },

    {
      title:
        'Yefikir Mrchay',

      artist:
        'Michael Belayneh',

      note:
        'one of those songs that already knew what it was doing.',

      spotify:
        'https://open.spotify.com/track/3isJiU3US5yIh8GltAi02o?si=460fb359a1724e80',

      playForSeconds:
        82,

      gapAfterMs:
        7000,

      startWindowSeconds:
        [20, 55],
    },

    {
      title:
        'Aydenegtim Lebe',

      artist:
        'Teddy Afro',

      note:
        'some songs just feel more Ethiopian when they become attached to somebody 😂',

      spotify:
        'https://open.spotify.com/track/7HcJHbcodXhoFaRrvbUIKD?si=9ab8ea21976a40b4',

      playForSeconds:
        80,

      gapAfterMs:
        7000,

      startWindowSeconds:
        [25, 60],
    },

    {
      title:
        'Young And Beautiful',

      artist:
        'Lana Del Rey',

      note:
        'the Lana corner was legally required for u.',

      spotify:
        'https://open.spotify.com/track/2nMeu6UenVvwUktBCpLMK9?si=6923fec4659c49a5',

      playForSeconds:
        88,

      gapAfterMs:
        8000,

      startWindowSeconds:
        [20, 55],
    },

    {
      title:
        'Maebel New',

      artist:
        'Neway Debebe',

      note:
        'old-soul Fendisha needed this one too.',

      spotify:
        'https://open.spotify.com/track/6AZBq0ykRFW65H0NU0S75z?si=87d0a7d753c74e7b',

      playForSeconds:
        78,

      gapAfterMs:
        7000,

      startWindowSeconds:
        [25, 60],
    },

    {
      title:
        'And Alegn',

      artist:
        'Abdu Kiar',

      note:
        'yeah... this one earned its place here too. no argument 😂💜',

      spotify:
        'https://open.spotify.com/track/2eVRM3K4l18AOQ4fhru2KT?si=873a3baa8c614ce2',

      playForSeconds:
        85,

      gapAfterMs:
        8000,

      startWindowSeconds:
        [25, 60],
    },

    {
      title:
        'Happy Birthday Classic Jazz 1',

      artist:
        'Catshi',

      note:
        'because apparently even your birthday needed a little jazz 🎷😂',

      spotify:
        'https://open.spotify.com/track/4GrnON2kk7JwcYu9PnJkOS?si=f8b0283a49174352',

      playForSeconds:
        60,

      gapAfterMs:
        10000,

      startWindowSeconds:
        [5, 25],
    },
  ],
};
