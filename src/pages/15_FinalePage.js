import { React, html } from '../lib/react.js';
import { media } from '../config.js';
import { AudioButton } from '../components/AudioButton.js';
import { SecretHeart } from '../components/SecretHeart.js';

/*
|--------------------------------------------------------------------------
| FULL-SCREEN BIRTHDAY RAIN
|--------------------------------------------------------------------------
|
| This starts IMMEDIATELY.
| It never waits for the cake.
|
| z-index is intentionally above the page content.
| pointer-events:none means it never blocks buttons.
|
*/

const RAIN_ICONS = [
  '🍿',
  '🍬',
  '💜',
  '✨',
  '🎀',
  '🍭',
  '💗',
  '🍿',
  '✨',
  '🍬',
  '💜',
];


const rainParticles = Array.from(
  { length: 96 },
  (_, index) => {
    const depth =
      0.58 +
      ((index * 19) % 55) / 100;

    return {
      id: `rain-${index}`,

      icon:
        RAIN_ICONS[
          index %
          RAIN_ICONS.length
        ],

      left:
        `${(index * 37) % 100}%`,

      size:
        10 +
        ((index * 13) % 23),

      duration:
        5.2 +
        ((index * 17) % 48) / 10,

      delay:
        -(
          ((index * 29) % 105) /
          10
        ),

      drift:
        -70 +
        ((index * 43) % 141),

      spin:
        -420 +
        ((index * 61) % 900),

      depth,
    };
  }
);


/*
|--------------------------------------------------------------------------
| ACTUAL CONFETTI PIECES
|--------------------------------------------------------------------------
*/

const CONFETTI_COLORS = [
  '#8f4fb3',
  '#b780dc',
  '#f5c6df',
  '#d989bc',
  '#efe2f8',
  '#ffffff',
];


const confettiRain = Array.from(
  { length: 72 },
  (_, index) => ({
    id:
      `confetti-${index}`,

    left:
      `${(index * 53) % 100}%`,

    width:
      4 +
      ((index * 7) % 7),

    height:
      9 +
      ((index * 11) % 12),

    color:
      CONFETTI_COLORS[
        index %
        CONFETTI_COLORS.length
      ],

    duration:
      4.9 +
      ((index * 19) % 40) / 10,

    delay:
      -(
        ((index * 31) % 100) /
        10
      ),

    drift:
      -85 +
      ((index * 47) % 171),

    spin:
      -540 +
      ((index * 73) % 1080),
  })
);


/*
|--------------------------------------------------------------------------
| CAKE DECORATIONS
|--------------------------------------------------------------------------
|
| Every decoration has a threshold.
|
| 12%  → first decoration flies
| 24%  → second
| ...
| 94%  → last one
|
| So she watches them get blown OFF THE CAKE
| one after another while she holds.
|
*/

const CAKE_ITEMS = [
  {
    id: 'candy-a',
    icon: '🍬',
    left: 16,
    top: 42,
    threshold: 0.12,
    direction: -1,
  },

  {
    id: 'candle-a',
    icon: '🕯️',
    left: 28,
    top: 20,
    threshold: 0.24,
    direction: -1,
  },

  {
    id: 'lollipop-a',
    icon: '🍭',
    left: 39,
    top: 38,
    threshold: 0.36,
    direction: 1,
  },

  {
    id: 'candle-b',
    icon: '🕯️',
    left: 48,
    top: 13,
    threshold: 0.48,
    direction: -1,
  },

  {
    id: 'candy-b',
    icon: '🍬',
    left: 58,
    top: 41,
    threshold: 0.6,
    direction: 1,
  },

  {
    id: 'candle-c',
    icon: '🕯️',
    left: 68,
    top: 18,
    threshold: 0.72,
    direction: 1,
  },

  {
    id: 'lollipop-b',
    icon: '🍭',
    left: 77,
    top: 38,
    threshold: 0.83,
    direction: -1,
  },

  {
    id: 'candle-d',
    icon: '🕯️',
    left: 86,
    top: 23,
    threshold: 0.94,
    direction: 1,
  },
];


/*
|--------------------------------------------------------------------------
| THE VERSIONS OF HER
|--------------------------------------------------------------------------
|
| Five older photos + one present-day photo.
|
| Do NOT label these with grades unless you later confirm them.
| Put the five older photos at the exact paths below.
|
*/

const VERSION_PHOTOS = [
  {
    id: 'version-01',
    src: '/media/photos/fendisha-school-01.jpg',
    alt: 'An earlier school-age photo of Fendisha',
  },

  {
    id: 'version-02',
    src: '/media/photos/fendisha-school-02.jpg',
    alt: 'Another earlier school-age photo of Fendisha',
  },

  {
    id: 'version-03',
    src: '/media/photos/fendisha-school-03.jpg',
    alt: 'Fendisha growing up',
  },

  {
    id: 'version-04',
    src: '/media/photos/fendisha-school-04.jpg',
    alt: 'A later school-age photo of Fendisha',
  },

  {
    id: 'version-05',
    src: '/media/photos/fendisha-school-05.jpg',
    alt: 'Fendisha closer to the version Darion would meet',
  },

  {
    id: 'version-now',
    src: '/media/photos/favorite-her-1.jpg',
    alt: 'Fendisha now',
    current: true,
  },
];


export function FinalePage({
  onContinue,
  found,
  onFindHeart,
}) {
  const pageRef =
    React.useRef(null);

  const cakeRef =
    React.useRef(null);

  const cakeStageRef =
    React.useRef(null);

  const windRef =
    React.useRef(null);

  const holdButtonRef =
    React.useRef(null);

  const itemRefs =
    React.useRef({});

  const rafRef =
    React.useRef(null);

  const lastFrameRef =
    React.useRef(null);

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT FIX
  |--------------------------------------------------------------------------
  |
  | React state is NOT reliable inside a requestAnimationFrame loop
  | immediately after setState().
  |
  | This ref changes synchronously.
  |
  */

  const holdingRef =
    React.useRef(false);

  const progressRef =
    React.useRef(0);

  const blownRef =
    React.useRef(
      new Set()
    );


  const [
    cakeVisible,
    setCakeVisible,
  ] =
    React.useState(false);


  const [
    holding,
    setHolding,
  ] =
    React.useState(false);


  const [
    progress,
    setProgress,
  ] =
    React.useState(0);


  const [
    finished,
    setFinished,
  ] =
    React.useState(false);



  /*
  |--------------------------------------------------------------------------
  | VERSION SEQUENCE
  |--------------------------------------------------------------------------
  */

  const versionStageRef =
    React.useRef(null);

  const versionFrameRef =
    React.useRef(null);

  const versionNumberRef =
    React.useRef(null);

  const versionPhotoRefs =
    React.useRef({});

  const versionSliceRefs =
    React.useRef([]);

  const versionKickerRef =
    React.useRef(null);

  const versionCaptionRef =
    React.useRef(null);

  const versionFinalOneRef =
    React.useRef(null);

  const versionFinalTwoRef =
    React.useRef(null);

  const versionFinalThreeRef =
    React.useRef(null);

  const versionReplayRef =
    React.useRef(null);

  const versionAnimationsRef =
    React.useRef([]);

  const versionTimersRef =
    React.useRef([]);

  const versionRunRef =
    React.useRef(0);

  const versionStartedRef =
    React.useRef(false);


  const [
    versionRunning,
    setVersionRunning,
  ] =
    React.useState(false);


  const [
    versionDone,
    setVersionDone,
  ] =
    React.useState(false);


  /*
  |--------------------------------------------------------------------------
  | MOTION SETTING
  |--------------------------------------------------------------------------
  */

  const prefersReducedMotion = () =>
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  /*
  |--------------------------------------------------------------------------
  | MAIN PAGE ENTRANCE
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    const page =
      pageRef.current;

    if (
      !page ||
      prefersReducedMotion()
    ) {
      return;
    }


    const animations = [];


    /*
    | GIANT HAPPY 21ST
    */

    const hero =
      page.querySelector(
        '[data-finale-hero]'
      );


    if (hero) {
      animations.push(
        hero.animate(
          [
            {
              opacity: 0,

              transform:
                'translateY(46px) scale(.88)',

              filter:
                'blur(14px)',
            },

            {
              opacity: 1,

              transform:
                'translateY(-4px) scale(1.015)',

              filter:
                'blur(0)',

              offset: 0.78,
            },

            {
              opacity: 1,

              transform:
                'translateY(0) scale(1)',

              filter:
                'blur(0)',
            },
          ],

          {
            duration: 1250,

            easing:
              'cubic-bezier(.16,.84,.22,1)',

            fill:
              'both',
          }
        )
      );
    }


    /*
    | MY FENDISHA
    */

    const name =
      page.querySelector(
        '[data-finale-name]'
      );


    if (name) {
      animations.push(
        name.animate(
          [
            {
              opacity: 0,

              transform:
                'translateY(24px) rotate(-1deg)',

              filter:
                'blur(5px)',
            },

            {
              opacity: 1,

              transform:
                'translateY(0) rotate(0deg)',

              filter:
                'blur(0)',
            },
          ],

          {
            duration: 900,

            delay: 430,

            easing:
              'cubic-bezier(.18,.82,.22,1)',

            fill:
              'both',
          }
        )
      );
    }


    /*
    | INTRO
    */

    const intro =
      page.querySelector(
        '[data-finale-intro]'
      );


    if (intro) {
      animations.push(
        intro.animate(
          [
            {
              opacity: 0,

              transform:
                'translateY(18px)',

              filter:
                'blur(4px)',
            },

            {
              opacity: 1,

              transform:
                'translateY(0)',

              filter:
                'blur(0)',
            },
          ],

          {
            duration: 820,

            delay: 690,

            easing:
              'cubic-bezier(.18,.82,.22,1)',

            fill:
              'both',
          }
        )
      );
    }


    /*
    | PHOTOS DROP IN ONE BY ONE
    */

    const photos =
      page.querySelectorAll(
        '[data-finale-photo]'
      );


    photos.forEach(
      (
        photo,
        index
      ) => {
        const angle =
          index === 0
            ? '-4deg'
            : index === 2
              ? '4deg'
              : '0deg';


        animations.push(
          photo.animate(
            [
              {
                opacity: 0,

                transform:
                  `
                    translateY(42px)
                    rotate(${angle})
                    scale(.91)
                  `,

                filter:
                  'blur(8px)',
              },

              {
                opacity: 1,

                transform:
                  index === 1
                    ? 'translateY(-1.25rem) rotate(0deg) scale(1)'
                    : 'translateY(0) rotate(0deg) scale(1)',

                filter:
                  'blur(0)',
              },
            ],

            {
              duration: 920,

              delay:
                930 +
                index * 150,

              easing:
                'cubic-bezier(.18,.82,.22,1)',

              fill:
                'both',
            }
          )
        );
      }
    );


    /*
    | EMOTIONAL CARD
    */

    const card =
      page.querySelector(
        '[data-finale-card]'
      );


    if (card) {
      animations.push(
        card.animate(
          [
            {
              opacity: 0,

              transform:
                'translateY(32px) scale(.97)',

              filter:
                'blur(6px)',
            },

            {
              opacity: 1,

              transform:
                'translateY(0) scale(1)',

              filter:
                'blur(0)',
            },
          ],

          {
            duration: 960,

            delay: 1460,

            easing:
              'cubic-bezier(.16,.84,.22,1)',

            fill:
              'both',
          }
        )
      );
    }


    /*
    | CAKE CTA
    */

    const cakeTrigger =
      page.querySelector(
        '[data-cake-trigger]'
      );


    if (cakeTrigger) {
      animations.push(
        cakeTrigger.animate(
          [
            {
              opacity: 0,

              transform:
                'translateY(22px) scale(.94)',
            },

            {
              opacity: 1,

              transform:
                'translateY(0) scale(1)',
            },
          ],

          {
            duration: 820,

            delay: 1780,

            easing:
              'cubic-bezier(.34,1.56,.64,1)',

            fill:
              'both',
          }
        )
      );
    }


    return () => {
      animations.forEach(
        (
          animation
        ) => {
          animation.cancel();
        }
      );
    };
  }, []);


  /*
  |--------------------------------------------------------------------------
  | SHOW CAKE
  |--------------------------------------------------------------------------
  */

  const showCake = () => {
    setCakeVisible(true);


    if (
      navigator.vibrate
    ) {
      navigator.vibrate(
        [12, 45, 15]
      );
    }


    requestAnimationFrame(
      () => {
        const stage =
          cakeStageRef.current;


        if (
          !stage ||
          prefersReducedMotion()
        ) {
          return;
        }


        stage.animate(
          [
            {
              opacity: 0,

              transform:
                'translateY(110px) scale(.72)',

              filter:
                'blur(14px)',
            },

            {
              opacity: 1,

              transform:
                'translateY(-15px) scale(1.04)',

              filter:
                'blur(0)',

              offset: 0.72,
            },

            {
              opacity: 1,

              transform:
                'translateY(0) scale(1)',

              filter:
                'blur(0)',
            },
          ],

          {
            duration: 1150,

            easing:
              'cubic-bezier(.18,.9,.22,1)',

            fill: 'both',
          }
        );
      }
    );
  };


  /*
  |--------------------------------------------------------------------------
  | BLOW ONE DECORATION
  |--------------------------------------------------------------------------
  */

  const blowDecoration = (
    item,
    index
  ) => {
    if (
      blownRef.current.has(
        item.id
      )
    ) {
      return;
    }


    blownRef.current.add(
      item.id
    );


    const element =
      itemRefs.current[
        item.id
      ];


    if (!element) {
      return;
    }


    if (
      navigator.vibrate
    ) {
      navigator.vibrate(7);
    }


    if (
      prefersReducedMotion()
    ) {
      element.style.opacity =
        '0';

      return;
    }


    /*
    | Strong right/left gust.
    */

    const x =
      item.direction *
      (
        260 +
        index * 32
      );


    const y =
      -(
        80 +
        index * 13
      );


    const rotation =
      item.direction *
      (
        340 +
        index * 95
      );


    element.animate(
      [
        {
          opacity: 1,

          transform:
            'translate(-50%, 0) rotate(0deg) scale(1)',

          filter:
            'blur(0)',
        },

        {
          opacity: 1,

          transform:
            `
              translate(
                calc(-50% + ${x * 0.18}px),
                ${y * 0.15}px
              )
              rotate(${rotation * 0.18}deg)
              scale(1.12)
            `,

          offset: 0.18,
        },

        {
          opacity: 0.9,

          transform:
            `
              translate(
                calc(-50% + ${x * 0.55}px),
                ${y * 0.55}px
              )
              rotate(${rotation * 0.58}deg)
              scale(1.05)
            `,

          offset: 0.56,
        },

        {
          opacity: 0,

          transform:
            `
              translate(
                calc(-50% + ${x}px),
                ${y}px
              )
              rotate(${rotation}deg)
              scale(.72)
            `,

          filter:
            'blur(4px)',
        },
      ],

      {
        duration:
          760,

        easing:
          'cubic-bezier(.12,.78,.18,1)',

        fill:
          'forwards',
      }
    );
  };


  /*
  |--------------------------------------------------------------------------
  | FINISH
  |--------------------------------------------------------------------------
  */

  const completeBlow = () => {
    holdingRef.current =
      false;

    setHolding(false);

    progressRef.current =
      1;

    setProgress(1);

    setFinished(true);


    cancelAnimationFrame(
      rafRef.current
    );


    if (
      windRef.current
    ) {
      windRef.current.style.opacity =
        '0';
    }


    if (
      cakeRef.current
    ) {
      cakeRef.current.style.transform =
        '';
    }


    if (
      navigator.vibrate
    ) {
      navigator.vibrate(
        [
          18,
          45,
          20,
          45,
          30,
          70,
          35,
        ]
      );
    }


    /*
    | Cake celebration pop.
    */

    if (
      cakeRef.current &&
      !prefersReducedMotion()
    ) {
      cakeRef.current.animate(
        [
          {
            transform:
              'scale(1)',
          },

          {
            transform:
              'scale(1.08)',
          },

          {
            transform:
              'scale(.985)',
          },

          {
            transform:
              'scale(1)',
          },
        ],

        {
          duration: 720,

          easing:
            'cubic-bezier(.34,1.56,.64,1)',
        }
      );
    }
  };


  /*
  |--------------------------------------------------------------------------
  | HOLD LOOP
  |--------------------------------------------------------------------------
  |
  | THIS is the part that was broken before.
  |
  | holdingRef.current is synchronous.
  |
  */

  const runBlow = (
    timestamp
  ) => {
    if (
      !holdingRef.current ||
      finished
    ) {
      return;
    }


    if (
      lastFrameRef.current ===
      null
    ) {
      lastFrameRef.current =
        timestamp;
    }


    const delta =
      Math.min(
        50,
        timestamp -
          lastFrameRef.current
      );


    lastFrameRef.current =
      timestamp;


    /*
    | Full blow takes ~4.8 seconds.
    */

    const nextProgress =
      Math.min(
        1,

        progressRef.current +
          delta / 4800
      );


    progressRef.current =
      nextProgress;


    setProgress(
      nextProgress
    );


    /*
    |--------------------------------------------------------------------------
    | THROW DECORATIONS OFF AS PROGRESS PASSES THRESHOLDS
    |--------------------------------------------------------------------------
    */

    CAKE_ITEMS.forEach(
      (
        item,
        index
      ) => {
        if (
          nextProgress >=
          item.threshold
        ) {
          blowDecoration(
            item,
            index
          );
        }
      }
    );


    /*
    |--------------------------------------------------------------------------
    | STRONGER WIND AS SHE HOLDS LONGER
    |--------------------------------------------------------------------------
    */

    if (
      windRef.current
    ) {
      const opacity =
        0.18 +
        nextProgress * 0.72;


      windRef.current.style.opacity =
        `${opacity}`;


      windRef.current.style.transform =
        `
          translateX(
            ${28 - nextProgress * 42}%
          )
          skewX(-14deg)
          scaleX(
            ${0.72 + nextProgress * 0.65}
          )
        `;
    }


    /*
    |--------------------------------------------------------------------------
    | CAKE REACTS TO AIR PRESSURE
    |--------------------------------------------------------------------------
    */

    if (
      cakeRef.current &&
      !prefersReducedMotion()
    ) {
      const shakeX =
        Math.sin(
          timestamp / 24
        ) *
        nextProgress *
        2.8;


      const shakeY =
        Math.cos(
          timestamp / 37
        ) *
        nextProgress *
        0.8;


      cakeRef.current.style.transform =
        `
          translate3d(
            ${shakeX}px,
            ${shakeY}px,
            0
          )
        `;
    }


    /*
    |--------------------------------------------------------------------------
    | COMPLETE
    |--------------------------------------------------------------------------
    */

    if (
      nextProgress >= 1
    ) {
      completeBlow();
      return;
    }


    /*
    | Continue ONLY while finger/mouse remains held.
    */

    if (
      holdingRef.current
    ) {
      rafRef.current =
        requestAnimationFrame(
          runBlow
        );
    }
  };


  /*
  |--------------------------------------------------------------------------
  | START HOLD
  |--------------------------------------------------------------------------
  */

  const startHold = (
    event
  ) => {
    if (
      finished ||
      !cakeVisible
    ) {
      return;
    }


    event.preventDefault();


    /*
    | Capture pointer so dragging slightly off button
    | does NOT accidentally stop the blowing.
    */

    if (
      event.currentTarget
        ?.setPointerCapture &&
      event.pointerId !==
        undefined
    ) {
      try {
        event.currentTarget
          .setPointerCapture(
            event.pointerId
          );
      } catch {}
    }


    /*
    | IMPORTANT:
    | set ref BEFORE starting RAF.
    */

    holdingRef.current =
      true;

    setHolding(true);

    lastFrameRef.current =
      null;


    if (
      navigator.vibrate
    ) {
      navigator.vibrate(12);
    }


    cancelAnimationFrame(
      rafRef.current
    );


    rafRef.current =
      requestAnimationFrame(
        runBlow
      );
  };


  /*
  |--------------------------------------------------------------------------
  | STOP HOLD
  |--------------------------------------------------------------------------
  */

  const stopHold = () => {
    if (
      finished ||
      !holdingRef.current
    ) {
      return;
    }


    holdingRef.current =
      false;

    setHolding(false);

    lastFrameRef.current =
      null;


    cancelAnimationFrame(
      rafRef.current
    );


    /*
    | Progress does NOT reset.
    | She can continue where she stopped.
    */

    if (
      windRef.current
    ) {
      windRef.current.style.opacity =
        '0';

      windRef.current.style.transform =
        'translateX(28%) skewX(-14deg) scaleX(.72)';
    }


    if (
      cakeRef.current
    ) {
      cakeRef.current.style.transform =
        '';
    }
  };


  /*
  |--------------------------------------------------------------------------
  | CLEANUP
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    return () => {
      holdingRef.current =
        false;

      cancelAnimationFrame(
        rafRef.current
      );
    };
  }, []);


  /*
  |--------------------------------------------------------------------------
  | CINEMATIC "VERSIONS OF YOU" SEQUENCE
  |--------------------------------------------------------------------------
  |
  | This replaces the old intro paragraph + three-photo grid.
  |
  | Nothing below the sequence is changed.
  |
  */

  const clearVersionWork = () => {
    versionTimersRef.current.forEach(
      timer => {
        clearTimeout(
          timer
        );
      }
    );

    versionTimersRef.current = [];


    versionAnimationsRef.current.forEach(
      animation => {
        try {
          animation.cancel();
        } catch {
          // Safe cleanup.
        }
      }
    );

    versionAnimationsRef.current = [];
  };


  const versionWait = (
    duration
  ) =>
    new Promise(
      resolve => {
        const timer =
          window.setTimeout(
            resolve,
            duration
          );

        versionTimersRef.current.push(
          timer
        );
      }
    );


  const versionAnimate = (
    element,
    keyframes,
    options
  ) => {
    if (!element) {
      return Promise.resolve();
    }


    const animation =
      element.animate(
        keyframes,
        {
          fill: 'forwards',
          ...options,
        }
      );


    versionAnimationsRef.current.push(
      animation
    );


    return animation
      .finished
      .catch(
        () => {}
      );
  };


  const setVersionCaption = (
    text
  ) => {
    if (
      versionCaptionRef.current
    ) {
      versionCaptionRef.current
        .textContent =
        text;
    }
  };


  const resetVersionStage = () => {
    clearVersionWork();


    const number =
      versionNumberRef.current;

    const kicker =
      versionKickerRef.current;

    const caption =
      versionCaptionRef.current;

    const finalOne =
      versionFinalOneRef.current;

    const finalTwo =
      versionFinalTwoRef.current;

    const finalThree =
      versionFinalThreeRef.current;

    const replay =
      versionReplayRef.current;


    if (number) {
      Object.assign(
        number.style,
        {
          opacity: '0.025',
          transform:
            'translate(-50%, -50%) scale(.94)',
        }
      );
    }


    if (kicker) {
      Object.assign(
        kicker.style,
        {
          opacity: '0',
          transform:
            'translateY(12px)',
          filter:
            'blur(5px)',
        }
      );
    }


    if (caption) {
      caption.textContent =
        '';

      Object.assign(
        caption.style,
        {
          opacity: '0',
          transform:
            'translateY(10px)',
          filter:
            'blur(4px)',
        }
      );
    }


    [
      finalOne,
      finalTwo,
      finalThree,
      replay,
    ].forEach(
      element => {
        if (!element) {
          return;
        }

        Object.assign(
          element.style,
          {
            opacity: '0',
            transform:
              'translateY(12px)',
            filter:
              'blur(4px)',
            pointerEvents:
              element === replay
                ? 'none'
                : '',
          }
        );
      }
    );


    VERSION_PHOTOS.forEach(
      item => {
        const element =
          versionPhotoRefs.current[
            item.id
          ];


        if (!element) {
          return;
        }


        Object.assign(
          element.style,
          {
            opacity: '0',
            transform:
              'translate3d(0,0,0) scale(.92) rotate(0deg)',
            filter:
              'blur(0px)',
            clipPath:
              'inset(0 0 0 0 round 2rem)',
            transformOrigin:
              '50% 50%',
            zIndex:
              item.current
                ? '35'
                : '20',
          }
        );
      }
    );


    versionSliceRefs.current.forEach(
      slice => {
        if (!slice) {
          return;
        }

        Object.assign(
          slice.style,
          {
            opacity: '0',
            transform:
              'translate3d(0,0,0) rotate(0deg) scale(1)',
            filter:
              'blur(0px)',
          }
        );
      }
    );
  };


  const runVersionSequence =
    async (
      force = false
    ) => {
      if (
        versionRunning &&
        !force
      ) {
        return;
      }


      const stage =
        versionStageRef.current;

      const frame =
        versionFrameRef.current;


      if (
        !stage ||
        !frame
      ) {
        return;
      }


      versionRunRef.current +=
        1;

      const runId =
        versionRunRef.current;


      resetVersionStage();

      setVersionDone(
        false
      );

      setVersionRunning(
        true
      );


      const oldPhotos =
        VERSION_PHOTOS
          .filter(
            item =>
              !item.current
          )
          .map(
            item =>
              versionPhotoRefs.current[
                item.id
              ]
          );


      const currentPhoto =
        versionPhotoRefs.current[
          'version-now'
        ];


      const stillCurrent = () =>
        versionRunRef.current ===
        runId;


      /*
      |--------------------------------------------------------------------------
      | REDUCED MOTION
      |--------------------------------------------------------------------------
      */

      if (
        prefersReducedMotion()
      ) {
        if (currentPhoto) {
          Object.assign(
            currentPhoto.style,
            {
              opacity: '1',
              transform:
                'translate3d(0,0,0) scale(1)',
              clipPath:
                'inset(0 0 0 0 round 2rem)',
            }
          );
        }


        if (
          versionNumberRef.current
        ) {
          versionNumberRef.current
            .style.opacity =
            '0.08';
        }


        [
          versionFinalOneRef.current,
          versionFinalTwoRef.current,
          versionFinalThreeRef.current,
          versionReplayRef.current,
        ].forEach(
          element => {
            if (!element) {
              return;
            }

            element.style.opacity =
              '1';

            element.style.transform =
              'translateY(0)';

            element.style.filter =
              'blur(0px)';
          }
        );


        if (
          versionReplayRef.current
        ) {
          versionReplayRef.current
            .style.pointerEvents =
            'auto';
        }


        setVersionRunning(
          false
        );

        setVersionDone(
          true
        );

        return;
      }


      /*
      |--------------------------------------------------------------------------
      | OPENING — THE SCREEN QUIETS DOWN
      |--------------------------------------------------------------------------
      */

      await Promise.all([
        versionAnimate(
          versionKickerRef.current,
          [
            {
              opacity: 0,
              transform:
                'translateY(14px)',
              filter:
                'blur(6px)',
              letterSpacing:
                '.32em',
            },

            {
              opacity: 1,
              transform:
                'translateY(0)',
              filter:
                'blur(0px)',
              letterSpacing:
                '.22em',
            },
          ],
          {
            duration: 880,
            easing:
              'cubic-bezier(.16,.84,.22,1)',
          }
        ),

        versionAnimate(
          versionNumberRef.current,
          [
            {
              opacity: 0.015,
              transform:
                'translate(-50%, -50%) scale(.88)',
            },

            {
              opacity: 0.035,
              transform:
                'translate(-50%, -50%) scale(1)',
            },
          ],
          {
            duration: 1300,
            easing:
              'cubic-bezier(.16,.84,.22,1)',
          }
        ),
      ]);


      if (!stillCurrent()) {
        return;
      }


      await versionWait(
        430
      );


      /*
      |--------------------------------------------------------------------------
      | PHOTO 01 — COMES FROM FAR AWAY
      |--------------------------------------------------------------------------
      */

      const photoOne =
        oldPhotos[0];


      setVersionCaption(
        'somewhere before I knew u.'
      );


      await Promise.all([
        versionAnimate(
          photoOne,
          [
            {
              opacity: 0,
              transform:
                'translate3d(0,34px,0) scale(.28) rotate(-7deg)',
              filter:
                'blur(18px)',
            },

            {
              opacity: 1,
              transform:
                'translate3d(0,-5px,0) scale(1.025) rotate(-1.4deg)',
              filter:
                'blur(0px)',
              offset: 0.82,
            },

            {
              opacity: 1,
              transform:
                'translate3d(0,0,0) scale(1) rotate(-1deg)',
              filter:
                'blur(0px)',
            },
          ],
          {
            duration: 1450,
            easing:
              'cubic-bezier(.16,1,.3,1)',
          }
        ),

        versionAnimate(
          versionCaptionRef.current,
          [
            {
              opacity: 0,
              transform:
                'translateY(10px)',
              filter:
                'blur(4px)',
            },

            {
              opacity: 1,
              transform:
                'translateY(0)',
              filter:
                'blur(0px)',
            },
          ],
          {
            duration: 700,
            delay: 620,
            easing:
              'cubic-bezier(.18,.82,.22,1)',
          }
        ),
      ]);


      if (!stillCurrent()) {
        return;
      }


      await versionWait(
        900
      );


      /*
      |--------------------------------------------------------------------------
      | PHOTO 01 → PHOTO 02
      |
      | The first image breaks into five vertical pieces.
      |--------------------------------------------------------------------------
      */

      const photoTwo =
        oldPhotos[1];


      if (photoTwo) {
        Object.assign(
          photoTwo.style,
          {
            opacity: '1',
            transform:
              'translate3d(0,0,0) scale(.985) rotate(.6deg)',
            filter:
              'blur(0px)',
            zIndex: '18',
          }
        );
      }


      const firstSource =
        VERSION_PHOTOS[0]
          .src;


      versionSliceRefs.current.forEach(
        (
          slice,
          index
        ) => {
          if (!slice) {
            return;
          }


          Object.assign(
            slice.style,
            {
              opacity: '1',
              backgroundImage:
                `url("${firstSource}")`,
              backgroundSize:
                '500% 100%',
              backgroundPosition:
                `${index * 25}% 50%`,
              zIndex: '30',
            }
          );
        }
      );


      if (photoOne) {
        photoOne.style.opacity =
          '0';
      }


      setVersionCaption(
        ''
      );


      await Promise.all(
        versionSliceRefs.current.map(
          (
            slice,
            index
          ) => {
            const middle =
              index - 2;

            const x =
              middle * 58;

            const y =
              Math.abs(
                middle
              ) * -24 -
              18;

            const rotation =
              middle * 5.5;


            return versionAnimate(
              slice,
              [
                {
                  opacity: 1,
                  transform:
                    'translate3d(0,0,0) rotate(0deg) scale(1)',
                  filter:
                    'blur(0px)',
                },

                {
                  opacity: 0.96,
                  transform:
                    `translate3d(${x * .34}px,${y * .34}px,0) rotate(${rotation * .34}deg) scale(1.015)`,
                  filter:
                    'blur(.5px)',
                  offset: 0.38,
                },

                {
                  opacity: 0,
                  transform:
                    `translate3d(${x}px,${y}px,0) rotate(${rotation}deg) scale(.96)`,
                  filter:
                    'blur(5px)',
                },
              ],
              {
                duration:
                  820 +
                  Math.abs(
                    middle
                  ) * 45,

                easing:
                  'cubic-bezier(.12,.78,.18,1)',
              }
            );
          }
        )
      );


      if (!stillCurrent()) {
        return;
      }


      versionSliceRefs.current.forEach(
        slice => {
          if (slice) {
            slice.style.opacity =
              '0';
          }
        }
      );


      setVersionCaption(
        "another Fendisha I would've probably annoyed too 😭"
      );


      await versionAnimate(
        versionCaptionRef.current,
        [
          {
            opacity: 0,
            transform:
              'translateY(8px)',
          },

          {
            opacity: 1,
            transform:
              'translateY(0)',
          },
        ],
        {
          duration: 520,
          easing:
            'cubic-bezier(.18,.82,.22,1)',
        }
      );


      await versionWait(
        780
      );


      /*
      |--------------------------------------------------------------------------
      | PHOTO 02 → PHOTO 03
      |
      | One year folds down while another rises behind it.
      |--------------------------------------------------------------------------
      */

      const photoThree =
        oldPhotos[2];


      if (photoTwo) {
        photoTwo.style.zIndex =
          '24';
      }


      if (photoThree) {
        Object.assign(
          photoThree.style,
          {
            opacity: '1',
            transform:
              'perspective(1100px) rotateX(-78deg) scale(.94)',
            transformOrigin:
              '50% 100%',
            filter:
              'blur(5px)',
            zIndex: '23',
          }
        );
      }


      setVersionCaption(
        ''
      );


      await Promise.all([
        versionAnimate(
          photoTwo,
          [
            {
              opacity: 1,
              transform:
                'perspective(1100px) rotateX(0deg) scale(1)',
              transformOrigin:
                '50% 100%',
              filter:
                'blur(0px)',
            },

            {
              opacity: 0,
              transform:
                'perspective(1100px) rotateX(78deg) scale(.94)',
              transformOrigin:
                '50% 100%',
              filter:
                'blur(5px)',
            },
          ],
          {
            duration: 760,
            easing:
              'cubic-bezier(.6,.02,.3,1)',
          }
        ),

        versionAnimate(
          photoThree,
          [
            {
              opacity: 0.15,
              transform:
                'perspective(1100px) rotateX(-78deg) scale(.94)',
              transformOrigin:
                '50% 100%',
              filter:
                'blur(5px)',
            },

            {
              opacity: 1,
              transform:
                'perspective(1100px) rotateX(0deg) scale(1)',
              transformOrigin:
                '50% 100%',
              filter:
                'blur(0px)',
            },
          ],
          {
            duration: 840,
            delay: 120,
            easing:
              'cubic-bezier(.16,.84,.22,1)',
          }
        ),
      ]);


      if (!stillCurrent()) {
        return;
      }


      await versionWait(
        520
      );


      /*
      |--------------------------------------------------------------------------
      | PHOTO 03 → PHOTO 04
      |
      | Time starts accelerating.
      |--------------------------------------------------------------------------
      */

      const photoFour =
        oldPhotos[3];


      if (photoFour) {
        Object.assign(
          photoFour.style,
          {
            opacity: '1',
            clipPath:
              'inset(0 100% 0 0 round 2rem)',
            transform:
              'translate3d(18px,0,0) scale(1.02) rotate(.8deg)',
            filter:
              'blur(2px)',
            zIndex: '26',
          }
        );
      }


      await Promise.all([
        versionAnimate(
          photoThree,
          [
            {
              opacity: 1,
              transform:
                'translate3d(0,0,0) scale(1)',
              filter:
                'blur(0px)',
            },

            {
              opacity: 0,
              transform:
                'translate3d(-22px,0,0) scale(1.06)',
              filter:
                'blur(6px)',
            },
          ],
          {
            duration: 620,
            easing:
              'cubic-bezier(.3,.7,.2,1)',
          }
        ),

        versionAnimate(
          photoFour,
          [
            {
              opacity: 1,
              clipPath:
                'inset(0 100% 0 0 round 2rem)',
              transform:
                'translate3d(18px,0,0) scale(1.02) rotate(.8deg)',
              filter:
                'blur(2px)',
            },

            {
              opacity: 1,
              clipPath:
                'inset(0 0% 0 0 round 2rem)',
              transform:
                'translate3d(0,0,0) scale(1) rotate(-.4deg)',
              filter:
                'blur(0px)',
            },
          ],
          {
            duration: 680,
            easing:
              'cubic-bezier(.16,.84,.22,1)',
          }
        ),
      ]);


      if (!stillCurrent()) {
        return;
      }


      await versionWait(
        430
      );


      /*
      |--------------------------------------------------------------------------
      | PHOTO 04 → PHOTO 05
      |--------------------------------------------------------------------------
      */

      const photoFive =
        oldPhotos[4];


      setVersionCaption(
        'getting closer to the version I would actually meet.'
      );


      if (photoFive) {
        Object.assign(
          photoFive.style,
          {
            opacity: '0',
            transform:
              'translate3d(0,14px,0) scale(1.12) rotate(-1deg)',
            filter:
              'blur(14px)',
            zIndex: '28',
          }
        );
      }


      await Promise.all([
        versionAnimate(
          photoFour,
          [
            {
              opacity: 1,
              transform:
                'translate3d(0,0,0) scale(1) rotate(-.4deg)',
              filter:
                'blur(0px)',
            },

            {
              opacity: 0,
              transform:
                'translate3d(0,-12px,0) scale(.91) rotate(1deg)',
              filter:
                'blur(10px)',
            },
          ],
          {
            duration: 560,
            easing:
              'cubic-bezier(.3,.7,.2,1)',
          }
        ),

        versionAnimate(
          photoFive,
          [
            {
              opacity: 0,
              transform:
                'translate3d(0,14px,0) scale(1.12) rotate(-1deg)',
              filter:
                'blur(14px)',
            },

            {
              opacity: 1,
              transform:
                'translate3d(0,0,0) scale(1) rotate(.35deg)',
              filter:
                'blur(0px)',
            },
          ],
          {
            duration: 720,
            easing:
              'cubic-bezier(.16,.84,.22,1)',
          }
        ),

        versionAnimate(
          versionCaptionRef.current,
          [
            {
              opacity: 0,
              transform:
                'translateY(8px)',
            },

            {
              opacity: 1,
              transform:
                'translateY(0)',
            },
          ],
          {
            duration: 480,
            delay: 180,
            easing:
              'cubic-bezier(.18,.82,.22,1)',
          }
        ),
      ]);


      if (!stillCurrent()) {
        return;
      }


      await versionWait(
        760
      );


      /*
      |--------------------------------------------------------------------------
      | ALL FIVE COME BACK
      |--------------------------------------------------------------------------
      */

      setVersionCaption(
        'all these versions...'
      );


      const orbitTransforms = [
        'translate3d(clamp(-220px,-23vw,-105px),-92px,0) rotate(-11deg) scale(.56)',
        'translate3d(clamp(105px,23vw,220px),-84px,0) rotate(9deg) scale(.58)',
        'translate3d(clamp(-235px,-25vw,-112px),118px,0) rotate(7deg) scale(.52)',
        'translate3d(clamp(110px,25vw,235px),122px,0) rotate(-8deg) scale(.54)',
        'translate3d(0,10px,0) rotate(.4deg) scale(.69)',
      ];


      await Promise.all(
        oldPhotos.map(
          (
            photo,
            index
          ) => {
            if (!photo) {
              return Promise.resolve();
            }


            photo.style.zIndex =
              `${20 + index}`;


            return versionAnimate(
              photo,
              [
                {
                  opacity:
                    index === 4
                      ? 1
                      : 0,

                  transform:
                    index === 4
                      ? 'translate3d(0,0,0) rotate(.35deg) scale(1)'
                      : 'translate3d(0,0,0) rotate(0deg) scale(.82)',

                  filter:
                    index === 4
                      ? 'blur(0px)'
                      : 'blur(7px)',
                },

                {
                  opacity:
                    index === 2
                      ? .72
                      : .86,

                  transform:
                    orbitTransforms[
                      index
                    ],

                  filter:
                    index === 2
                      ? 'blur(1.2px)'
                      : 'blur(.3px)',
                },
              ],
              {
                duration:
                  960 +
                  index * 55,

                easing:
                  'cubic-bezier(.16,.84,.22,1)',
              }
            );
          }
        )
      );


      if (!stillCurrent()) {
        return;
      }


      await versionWait(
        500
      );


      setVersionCaption(
        "were becoming somebody I hadn't met yet."
      );


      await versionAnimate(
        versionCaptionRef.current,
        [
          {
            opacity: 0,
            transform:
              'translateY(10px)',
            filter:
              'blur(4px)',
          },

          {
            opacity: 1,
            transform:
              'translateY(0)',
            filter:
              'blur(0px)',
          },
        ],
        {
          duration: 620,
          easing:
            'cubic-bezier(.18,.82,.22,1)',
        }
      );


      await versionWait(
        800
      );


      /*
      |--------------------------------------------------------------------------
      | THE FIVE STACK INTO ONE
      |--------------------------------------------------------------------------
      */

      await Promise.all(
        oldPhotos.map(
          (
            photo,
            index
          ) =>
            versionAnimate(
              photo,
              [
                {
                  opacity:
                    index === 2
                      ? .72
                      : .86,

                  transform:
                    orbitTransforms[
                      index
                    ],

                  filter:
                    index === 2
                      ? 'blur(1.2px)'
                      : 'blur(.3px)',
                },

                {
                  opacity:
                    .95 -
                    index * .035,

                  transform:
                    `translate3d(0,0,0) rotate(${(index - 2) * .45}deg) scale(${.91 - index * .018})`,

                  filter:
                    'blur(0px)',
                },
              ],
              {
                duration:
                  880 +
                  index * 45,

                easing:
                  'cubic-bezier(.2,.82,.2,1)',
              }
            )
        )
      );


      if (!stillCurrent()) {
        return;
      }


      setVersionCaption(
        ''
      );


      /*
      |--------------------------------------------------------------------------
      | STACK COLLAPSES INTO A THIN LINE
      |--------------------------------------------------------------------------
      */

      await Promise.all(
        oldPhotos.map(
          (
            photo,
            index
          ) =>
            versionAnimate(
              photo,
              [
                {
                  opacity:
                    .95 -
                    index * .035,

                  transform:
                    `translate3d(0,0,0) rotate(${(index - 2) * .45}deg) scale(${.91 - index * .018})`,

                  filter:
                    'blur(0px)',
                },

                {
                  opacity: 0,
                  transform:
                    'translate3d(0,0,0) scaleX(.92) scaleY(.012) rotate(0deg)',
                  filter:
                    'blur(2px)',
                },
              ],
              {
                duration: 520,
                delay:
                  index * 34,

                easing:
                  'cubic-bezier(.55,.02,.4,1)',
              }
            )
        )
      );


      if (!stillCurrent()) {
        return;
      }


      /*
      |--------------------------------------------------------------------------
      | CURRENT FENDISHA GROWS OUT OF THAT LINE
      |--------------------------------------------------------------------------
      */

      if (currentPhoto) {
        Object.assign(
          currentPhoto.style,
          {
            opacity: '1',
            transform:
              'translate3d(0,0,0) scale(.985)',
            clipPath:
              'inset(49.8% 0 49.8% 0 round 2rem)',
            filter:
              'blur(1px)',
            zIndex: '40',
          }
        );
      }


      await Promise.all([
        versionAnimate(
          currentPhoto,
          [
            {
              opacity: 1,
              transform:
                'translate3d(0,0,0) scale(.985)',
              clipPath:
                'inset(49.8% 0 49.8% 0 round 2rem)',
              filter:
                'blur(1px)',
            },

            {
              opacity: 1,
              transform:
                'translate3d(0,0,0) scale(1.012)',
              clipPath:
                'inset(0% 0 0% 0 round 2rem)',
              filter:
                'blur(0px)',
              offset: .82,
            },

            {
              opacity: 1,
              transform:
                'translate3d(0,0,0) scale(1)',
              clipPath:
                'inset(0% 0 0% 0 round 2rem)',
              filter:
                'blur(0px)',
            },
          ],
          {
            duration: 1550,
            easing:
              'cubic-bezier(.16,.84,.22,1)',
          }
        ),

        versionAnimate(
          versionNumberRef.current,
          [
            {
              opacity: .035,
              transform:
                'translate(-50%, -50%) scale(1)',
            },

            {
              opacity: .085,
              transform:
                'translate(-50%, -50%) scale(1.04)',
            },
          ],
          {
            duration: 1500,
            easing:
              'cubic-bezier(.16,.84,.22,1)',
          }
        ),
      ]);


      if (!stillCurrent()) {
        return;
      }


      /*
      |--------------------------------------------------------------------------
      | STILLNESS
      |--------------------------------------------------------------------------
      |
      | No explosion here.
      | No fast movement.
      | Just her.
      |
      */

      await versionWait(
        420
      );


      await versionAnimate(
        versionFinalOneRef.current,
        [
          {
            opacity: 0,
            transform:
              'translateY(14px)',
            filter:
              'blur(5px)',
          },

          {
            opacity: 1,
            transform:
              'translateY(0)',
            filter:
              'blur(0px)',
          },
        ],
        {
          duration: 760,
          easing:
            'cubic-bezier(.18,.82,.22,1)',
        }
      );


      await versionWait(
        520
      );


      await versionAnimate(
        versionFinalTwoRef.current,
        [
          {
            opacity: 0,
            transform:
              'translateY(12px)',
            filter:
              'blur(4px)',
          },

          {
            opacity: 1,
            transform:
              'translateY(0)',
            filter:
              'blur(0px)',
          },
        ],
        {
          duration: 780,
          easing:
            'cubic-bezier(.18,.82,.22,1)',
        }
      );


      await versionWait(
        520
      );


      await versionAnimate(
        versionFinalThreeRef.current,
        [
          {
            opacity: 0,
            transform:
              'translateY(10px)',
          },

          {
            opacity: 1,
            transform:
              'translateY(0)',
          },
        ],
        {
          duration: 700,
          easing:
            'cubic-bezier(.18,.82,.22,1)',
        }
      );


      await versionAnimate(
        versionReplayRef.current,
        [
          {
            opacity: 0,
            transform:
              'translateY(8px)',
          },

          {
            opacity: .7,
            transform:
              'translateY(0)',
          },
        ],
        {
          duration: 520,
          delay: 300,
          easing:
            'cubic-bezier(.18,.82,.22,1)',
        }
      );


      if (
        versionReplayRef.current
      ) {
        versionReplayRef.current
          .style.pointerEvents =
          'auto';
      }


      if (!stillCurrent()) {
        return;
      }


      setVersionRunning(
        false
      );

      setVersionDone(
        true
      );
    };


  /*
  |--------------------------------------------------------------------------
  | START THE SEQUENCE WHEN SHE ACTUALLY REACHES IT
  |--------------------------------------------------------------------------
  */

  React.useEffect(
    () => {
      const stage =
        versionStageRef.current;


      if (!stage) {
        return;
      }


      resetVersionStage();


      const observer =
        new IntersectionObserver(
          entries => {
            const entry =
              entries[0];


            if (
              !entry?.isIntersecting ||
              versionStartedRef.current
            ) {
              return;
            }


            versionStartedRef.current =
              true;


            window.setTimeout(
              () => {
                runVersionSequence();
              },
              280
            );


            observer.disconnect();
          },

          {
            threshold: 0.42,
          }
        );


      observer.observe(
        stage
      );


      return () => {
        observer.disconnect();

        versionRunRef.current +=
          1;

        clearVersionWork();
      };
    },
    []
  );


  const replayVersionSequence =
    () => {
      if (
        versionRunning
      ) {
        return;
      }


      navigator.vibrate?.(
        8
      );


      runVersionSequence(
        true
      );
    };


  /*
  |--------------------------------------------------------------------------
  | PROGRESS COPY
  |--------------------------------------------------------------------------
  */

  const percent =
    Math.round(
      progress * 100
    );


  const blownCount =
    CAKE_ITEMS.filter(
      (
        item
      ) =>
        progress >=
        item.threshold
    ).length;


  const remaining =
    CAKE_ITEMS.length -
    blownCount;


  const progressMessage =
    progress < 0.08
      ? 'keep holding... build the wind 😭'
      : progress < 0.28
        ? 'YES 😂 the first ones are moving'
        : progress < 0.52
          ? 'okayyy that wind is actually working 💨'
          : progress < 0.76
            ? 'KEEP HOLDING FKR 😭'
            : progress < 0.94
              ? 'ALMOST THERE — DO NOT LET GO 😂'
              : 'ONE LAST PUSH 💨💨💨';


  return html`
    <section
      ref=${pageRef}

      id="finale"

      className="
        scene

        relative

        overflow-hidden

        px-4
        py-20

        sm:px-6
        sm:py-28
      "
    >

      <!-- ================================= -->
      <!-- ORIGINAL SOFT TOP LIGHT -->
      <!-- ================================= -->

      <div
        className="
          pointer-events-none

          absolute

          inset-x-0
          top-0

          h-64

          bg-gradient-to-b

          from-pink-100/60

          to-transparent
        "
      ></div>


      <!-- ================================= -->
      <!-- FULL VIEWPORT RAIN -->
      <!-- ================================= -->

      <div
        aria-hidden="true"

        className="
          pointer-events-none

          fixed

          inset-0

          z-[40]

          overflow-hidden
        "
      >

        <!-- POPCORN / HEART / CANDY RAIN -->

        ${
          rainParticles.map(
            (
              item
            ) => html`

              <span
                key=${item.id}

                className="
                  absolute

                  -top-16

                  select-none

                  will-change-transform

                  drop-shadow-[0_8px_12px_rgba(92,46,120,.14)]
                "

                style=${{
                  left:
                    item.left,

                  fontSize:
                    `${item.size}px`,

                  opacity:
                    item.depth,

                  '--rain-drift':
                    `${item.drift}px`,

                  '--rain-spin':
                    `${item.spin}deg`,

                  animation:
                    `
                      finaleEmojiRain
                      ${item.duration}s
                      linear
                      ${item.delay}s
                      infinite
                    `,
                }}
              >
                ${item.icon}
              </span>

            `
          )
        }


        <!-- REAL CONFETTI -->

        ${
          confettiRain.map(
            (
              item
            ) => html`

              <span
                key=${item.id}

                className="
                  absolute

                  -top-10

                  block

                  rounded-[2px]

                  will-change-transform
                "

                style=${{
                  left:
                    item.left,

                  width:
                    `${item.width}px`,

                  height:
                    `${item.height}px`,

                  background:
                    item.color,

                  '--confetti-drift':
                    `${item.drift}px`,

                  '--confetti-spin':
                    `${item.spin}deg`,

                  animation:
                    `
                      finaleConfettiRain
                      ${item.duration}s
                      linear
                      ${item.delay}s
                      infinite
                    `,
                }}
              ></span>

            `
          )
        }

      </div>


      <!-- ================================= -->
      <!-- MAIN CONTENT -->
      <!-- ================================= -->

      <div
        className="
          relative

          z-10

          mx-auto

          max-w-6xl
        "
      >

        <!-- ================================= -->
        <!-- HERO -->
        <!-- ================================= -->

        <div
          className="
            mx-auto

            max-w-3xl

            text-center
          "
        >

          <div
            className="
              mb-6

              inline-flex

              items-center

              gap-2

              rounded-full

              border

              border-purple-200/70

              bg-white/70

              px-4
              py-2

              text-[9px]

              font-black

              uppercase

              tracking-[.25em]

              text-purple-500

              shadow-sm

              backdrop-blur-xl
            "
          >
            <span>🎉</span>

            OFFICIALLY TWENTY-ONE

            <span>🎉</span>
          </div>


          <p
            data-finale-hero

            className="
              font-display

              text-[clamp(5rem,13vw,10rem)]

              font-semibold

              leading-[.72]

              tracking-[-.07em]

              text-plum
            "
          >
            Happy

            <br />

            <span
              className="
                text-gradient

                italic
              "
            >
              21st
            </span>
          </p>


          <p
            data-finale-name

            className="
              mt-7

              font-display

              text-[clamp(2.6rem,6vw,5.2rem)]

              italic

              leading-none

              text-purple-700
            "
          >
            My Fendisha 🍿
          </p>


          <!-- ================================= -->
          <!-- THE VERSIONS OF YOU -->
          <!-- ================================= -->
          <!--
            This replaces the old "Before you were my girlfriend..."
            paragraph and the old three-photo grid.

            Everything before and after this stays exactly where it was.
          -->

        </div>


        <div
          ref=${versionStageRef}

          className="
            relative

            mx-auto

            mt-10

            min-h-[760px]

            max-w-5xl

            overflow-hidden

            rounded-[2.8rem]

            border

            border-purple-200/55

            bg-white/58

            px-3

            py-10

            shadow-[0_34px_100px_rgba(92,46,120,.12)]

            backdrop-blur-xl

            sm:min-h-[820px]
            sm:px-8
            sm:py-14
          "
        >

          <!-- HUGE 21 / TIME MARK -->

          <div
            ref=${versionNumberRef}

            aria-hidden="true"

            className="
              pointer-events-none

              absolute

              left-1/2
              top-[44%]

              select-none

              font-display

              text-[clamp(15rem,48vw,38rem)]

              font-semibold

              leading-none

              tracking-[-.09em]

              text-purple-700

              will-change-transform
            "

            style=${{
              opacity: 0.025,

              transform:
                'translate(-50%, -50%) scale(.94)',
            }}
          >
            21
          </div>


          <!-- OPENING MICRO TITLE -->

          <p
            ref=${versionKickerRef}

            style=${{
              opacity: 0,

              transform:
                'translateY(12px)',

              filter:
                'blur(5px)',
            }}

            className="
              relative

              z-20

              mx-auto

              text-center

              text-[9px]

              font-black

              uppercase

              tracking-[.22em]

              text-purple-500
            "
          >
            THE VERSIONS OF YOU I NEVER GOT TO KNOW
          </p>


          <!-- CINEMATIC PHOTO STAGE -->

          <div
            className="
              relative

              z-20

              mx-auto

              mt-8

              flex

              min-h-[520px]

              items-center

              justify-center

              sm:min-h-[560px]
            "
          >

            <div
              ref=${versionFrameRef}

              className="
                relative

                aspect-[4/5]

                w-[min(78vw,420px)]

                overflow-visible

                [perspective:1200px]
              "
            >

              ${
                VERSION_PHOTOS.map(
                  item => html`

                    <img
                      key=${item.id}

                      ref=${node => {
                        versionPhotoRefs
                          .current[
                            item.id
                          ] =
                          node;
                      }}

                      src=${item.src}

                      alt=${item.alt}

                      draggable="false"

                      className="
                        absolute

                        inset-0

                        h-full
                        w-full

                        select-none

                        rounded-[2rem]

                        object-cover

                        shadow-[0_28px_80px_rgba(74,39,95,.18)]

                        will-change-[transform,opacity,filter,clip-path]
                      "

                      style=${{
                        opacity: 0,

                        zIndex:
                          item.current
                            ? 35
                            : 20,
                      }}
                    />

                  `
                )
              }


              <!--
                FIVE SLICES.

                They briefly become PHOTO 01 during
                the first major transition.
              -->

              ${
                Array.from(
                  {
                    length: 5,
                  },

                  (
                    _,
                    index
                  ) => html`

                    <span
                      key=${`version-slice-${index}`}

                      ref=${node => {
                        versionSliceRefs
                          .current[
                            index
                          ] =
                          node;
                      }}

                      aria-hidden="true"

                      className="
                        pointer-events-none

                        absolute

                        top-0

                        h-full

                        overflow-hidden

                        will-change-[transform,opacity,filter]
                      "

                      style=${{
                        left:
                          `${index * 20}%`,

                        width:
                          '20%',

                        borderRadius:
                          index === 0
                            ? '2rem 0 0 2rem'
                            : index === 4
                              ? '0 2rem 2rem 0'
                              : '0',

                        backgroundRepeat:
                          'no-repeat',

                        opacity: 0,
                      }}
                    ></span>

                  `
                )
              }

            </div>

          </div>


          <!-- EPHEMERAL STORY COPY -->

          <div
            className="
              relative

              z-30

              mx-auto

              -mt-2

              min-h-[78px]

              max-w-xl

              px-3

              text-center
            "
          >

            <p
              ref=${versionCaptionRef}

              className="
                font-display

                text-xl

                italic

                leading-7

                text-purple-700

                sm:text-2xl
              "
            ></p>


            <!-- FINAL COPY — APPEARS ONLY WHEN CURRENT PHOTO ARRIVES -->

            <p
              ref=${versionFinalOneRef}

              style=${{
                opacity: 0,

                transform:
                  'translateY(12px)',

                filter:
                  'blur(4px)',
              }}

              className="
                mt-1

                font-display

                text-[clamp(2rem,5vw,3.3rem)]

                font-semibold

                italic

                leading-none

                text-plum
              "
            >
              and then… this one.
            </p>


            <p
              ref=${versionFinalTwoRef}

              style=${{
                opacity: 0,

                transform:
                  'translateY(12px)',

                filter:
                  'blur(4px)',
              }}

              className="
                mx-auto

                mt-3

                max-w-lg

                font-display

                text-xl

                italic

                leading-7

                text-purple-700

                sm:text-2xl
              "
            >
              the version I actually got lucky enough to know.
            </p>


            <div
              ref=${versionFinalThreeRef}

              style=${{
                opacity: 0,

                transform:
                  'translateY(12px)',

                filter:
                  'blur(4px)',
              }}

              className="
                mt-5
              "
            >

              <p
                className="
                  text-[9px]

                  font-black

                  uppercase

                  tracking-[.24em]

                  text-purple-400
                "
              >
                21 YEARS OF BECOMING HER
              </p>


              <p
                className="
                  mt-1

                  font-display

                  text-2xl

                  font-semibold

                  italic

                  text-plum
                "
              >
                happy birthday fkr 💜
              </p>

            </div>


            <button
              ref=${versionReplayRef}

              type="button"

              style=${{
                opacity: 0,

                transform:
                  'translateY(12px)',

                filter:
                  'blur(4px)',

                pointerEvents:
                  'none',
              }}

              onClick=${replayVersionSequence}

              className="
                mt-5

                text-[9px]

                font-black

                uppercase

                tracking-[.18em]

                text-purple-400

                transition

                hover:text-purple-700
              "

              aria-label="Watch the photo sequence again"
            >
              ↻ watch that again
            </button>

          </div>


          ${
            versionRunning
              ? html`
                  <span
                    className="
                      pointer-events-none

                      absolute

                      bottom-5
                      right-6

                      z-30

                      text-[8px]

                      font-black

                      uppercase

                      tracking-[.18em]

                      text-purple-300
                    "
                  >
                    time moving →
                  </span>
                `
              : null
          }

        </div>


        <!-- ================================= -->
        <!-- EMOTIONAL CARD -->
        <!-- ================================= -->

        <div
          data-finale-card

          className="
            mx-auto

            mt-12

            max-w-2xl

            overflow-hidden

            rounded-[2rem]

            border

            border-purple-200/60

            bg-white/82

            p-6

            text-center

            shadow-soft

            backdrop-blur-xl

            sm:p-8
          "
        >

          <p
            className="
              text-[9px]

              font-black

              uppercase

              tracking-[.25em]

              text-purple-400
            "
          >
            EVERY VERSION SO FAR
          </p>


          <p
            className="
              mt-4

              font-display

              text-3xl

              italic

              leading-tight

              text-plum
            "
          >
            Easy us. Confused us. Laughing us.

            <br />

            Far-away us. Praying us. Still-learning us.
          </p>


          <div
            className="
              mx-auto

              my-6

              h-px

              w-20

              bg-gradient-to-r

              from-transparent

              via-purple-300

              to-transparent
            "
          ></div>


          <p
            className="
              font-display

              text-2xl

              font-semibold

              italic

              text-purple-700
            "
          >
            After all of that…
          </p>


          <p
            className="
              mt-1

              font-display

              text-[clamp(2.2rem,5vw,3.8rem)]

              font-semibold

              italic

              leading-none

              text-plum
            "
          >
            fkr, I still choose you.
          </p>


          <p
            className="
              mx-auto

              mt-5

              max-w-md

              text-sm

              leading-6

              text-purple-900/65
            "
          >
            And today I just want you to feel celebrated.
            Not tested. Not guilty.

            <strong className="text-purple-700">
              Celebrated. 💜
            </strong>
          </p>

        </div>


        <!-- ================================= -->
        <!-- BRING CAKE -->
        <!-- ================================= -->

        ${
          !cakeVisible
            ? html`
                <div
                  data-cake-trigger

                  className="
                    mt-12

                    flex

                    flex-col

                    items-center

                    text-center
                  "
                >

                  <p
                    className="
                      text-[9px]

                      font-black

                      uppercase

                      tracking-[.25em]

                      text-purple-400
                    "
                  >
                    WAIT A DAMN SECOND
                  </p>


                  <p
                    className="
                      mt-2

                      font-display

                      text-3xl

                      italic

                      text-plum
                    "
                  >
                    birthday without cake?
                    absolutely not 😭
                  </p>


                  <button
                    type="button"

                    onClick=${showCake}

                    className="
                      group

                      relative

                      mt-5

                      inline-flex

                      items-center

                      gap-3

                      overflow-hidden

                      rounded-full

                      px-9
                      py-4

                      font-display

                      text-xl

                      font-semibold

                      italic

                      text-white

                      shadow-[0_22px_65px_rgba(111,59,142,.28)]

                      transition-all

                      duration-300

                      hover:-translate-y-1

                      hover:scale-[1.035]

                      sm:text-2xl
                    "

                    style=${{
                      background:
                        'linear-gradient(135deg,#6f3b8e,#9652b8 52%,#cf6fa9)',
                    }}
                  >

                    <span
                      className="
                        text-3xl
                      "
                    >
                      🎂
                    </span>

                    bring out my cake

                    <span
                      className="
                        transition-transform

                        duration-300

                        group-hover:translate-x-1
                      "
                    >
                      →
                    </span>

                  </button>

                </div>
              `
            : null
        }


        <!-- ================================= -->
        <!-- CAKE EXPERIENCE -->
        <!-- ================================= -->

        ${
          cakeVisible
            ? html`
                <div
                  ref=${cakeStageRef}

                  className="
                    relative

                    mx-auto

                    mt-14

                    max-w-3xl

                    rounded-[2.5rem]

                    border

                    border-purple-200/60

                    bg-white/72

                    px-4
                    py-8

                    text-center

                    shadow-float

                    backdrop-blur-xl

                    sm:px-8
                    sm:py-10
                  "
                >

                  <!-- INSTRUCTIONS -->

                  ${
                    !finished
                      ? html`
                          <div
                            className="
                              mx-auto

                              max-w-xl
                            "
                          >

                            <span
                              className="
                                birthday-chip
                              "
                            >
                              🎂 ONE LAST BIRTHDAY JOB
                            </span>


                            <h3
                              className="
                                mt-5

                                font-display

                                text-[clamp(2.7rem,6vw,4.8rem)]

                                font-semibold

                                italic

                                leading-[.92]

                                tracking-[-.04em]

                                text-plum
                              "
                            >
                              Blow the damn

                              <br />

                              <span
                                className="
                                  text-gradient
                                "
                              >
                                cake clean 😂
                              </span>
                            </h3>


                            <div
                              className="
                                mx-auto

                                mt-5

                                max-w-md

                                rounded-2xl

                                bg-purple-50/90

                                px-5
                                py-4

                                text-sm

                                leading-6

                                text-purple-900/70
                              "
                            >

                              <p>
                                Put your finger on the
                                <strong> BLOW </strong>
                                button and
                                <strong> keep holding it.</strong>
                              </p>


                              <p
                                className="
                                  mt-1

                                  font-semibold

                                  text-plum
                                "
                              >
                                Watch the meter.
                                The longer u hold,
                                the stronger the wind gets. I am watching you blow using your mouth
                              </p>


                              <p
                                className="
                                  mt-1

                                  text-xs

                                  text-purple-600/70
                                "
                              >
                                release = pause · hold again = continue
                              </p>

                            </div>

                          </div>
                        `
                      : null
                  }


                  <!-- ================================= -->
                  <!-- CAKE -->
                  <!-- ================================= -->

                  <div
                    className="
                      relative

                      mx-auto

                      mt-6

                      h-[330px]

                      max-w-[560px]
                    "
                  >

                    <!-- WIND -->

                    <div
                      ref=${windRef}

                      aria-hidden="true"

                      className="
                        pointer-events-none

                        absolute

                        left-[38%]
                        top-[16%]

                        z-40

                        h-36

                        w-[88%]

                        opacity-0

                        will-change-transform
                      "

                      style=${{
                        background:
                          `
                            repeating-linear-gradient(
                              0deg,
                              transparent 0 13px,
                              rgba(213,184,239,.18) 14px 17px,
                              rgba(255,255,255,.92) 18px 20px,
                              transparent 21px 31px
                            )
                          `,

                        filter:
                          'blur(5px)',

                        transform:
                          'translateX(28%) skewX(-14deg) scaleX(.72)',
                      }}
                    ></div>


                    <!-- WHOLE CAKE -->

                    <div
                      ref=${cakeRef}

                      className="
                        absolute

                        bottom-2
                        left-1/2

                        w-[94%]

                        -translate-x-1/2

                        will-change-transform
                      "
                    >

                      <!-- DECORATION AREA -->

                      <div
                        className="
                          relative

                          mx-auto

                          h-28

                          w-[82%]
                        "
                      >

                        ${
                          CAKE_ITEMS.map(
                            (
                              item,
                              index
                            ) => html`

                              <span
                                key=${item.id}

                                ref=${(
                                  node
                                ) => {
                                  itemRefs.current[
                                    item.id
                                  ] =
                                    node;
                                }}

                                className="
                                  absolute

                                  z-30

                                  -translate-x-1/2

                                  select-none

                                  text-3xl

                                  drop-shadow-[0_8px_10px_rgba(92,46,120,.18)]

                                  will-change-transform

                                  sm:text-4xl
                                "

                                style=${{
                                  left:
                                    `${item.left}%`,

                                  top:
                                    `${item.top}%`,
                                }}
                              >
                                ${item.icon}
                              </span>

                            `
                          )
                        }

                      </div>


                      <!-- ICING TOP -->

                      <div
                        className="
                          relative

                          mx-auto

                          h-20

                          w-[84%]

                          rounded-[50%_50%_20%_20%/60%_60%_18%_18%]

                          border

                          border-pink-200/80

                          bg-gradient-to-b

                          from-white

                          via-pink-50

                          to-pink-100

                          shadow-[0_10px_35px_rgba(127,67,164,.12)]
                        "
                      >

                        <span
                          className="
                            absolute

                            left-[12%]
                            top-[35%]

                            h-3
                            w-3

                            rounded-full

                            bg-purple-300
                          "
                        ></span>


                        <span
                          className="
                            absolute

                            left-[31%]
                            top-[54%]

                            h-4
                            w-4

                            rounded-full

                            bg-pink-300
                          "
                        ></span>


                        <span
                          className="
                            absolute

                            left-[51%]
                            top-[28%]

                            h-3
                            w-3

                            rounded-full

                            bg-purple-200
                          "
                        ></span>


                        <span
                          className="
                            absolute

                            right-[19%]
                            top-[48%]

                            h-4
                            w-4

                            rounded-full

                            bg-fuchsia-200
                          "
                        ></span>

                      </div>


                      <!-- CAKE BODY -->

                      <div
                        className="
                          relative

                          mx-auto

                          -mt-5

                          h-32

                          w-[78%]

                          overflow-hidden

                          rounded-b-[3rem]

                          border

                          border-purple-200/50

                          bg-gradient-to-b

                          from-[#f8ddec]

                          via-[#efc4df]

                          to-[#dca3d1]

                          shadow-[0_30px_70px_rgba(102,53,126,.22)]
                        "
                      >

                        <div
                          className="
                            pointer-events-none

                            absolute

                            inset-x-0
                            top-0

                            h-10

                            bg-gradient-to-b

                            from-white/35

                            to-transparent
                          "
                        ></div>


                        <div
                          className="
                            relative

                            pt-9
                          "
                        >

                          <p
                            className="
                              text-[9px]

                              font-black

                              uppercase

                              tracking-[.26em]

                              text-purple-600/55
                            "
                          >
                            MY FENDISHA
                          </p>


                          <p
                            className="
                              mt-1

                              font-display

                              text-5xl

                              font-semibold

                              italic

                              leading-none

                              text-plum
                            "
                          >
                            21
                          </p>

                        </div>

                      </div>


                      <!-- PLATE -->

                      <div
                        className="
                          mx-auto

                          mt-2

                          h-5

                          w-[92%]

                          rounded-[50%]

                          bg-white

                          shadow-[0_12px_28px_rgba(102,53,126,.14)]
                        "
                      ></div>

                    </div>

                  </div>


                  <!-- ================================= -->
                  <!-- BLOW CONTROLS -->
                  <!-- ================================= -->

                  ${
                    !finished
                      ? html`
                          <div
                            className="
                              mx-auto

                              mt-6

                              max-w-lg
                            "
                          >

                            <!-- PROGRESS HEADING -->

                            <div
                              className="
                                flex

                                items-end

                                justify-between

                                gap-4
                              "
                            >

                              <div
                                className="
                                  text-left
                                "
                              >

                                <p
                                  className="
                                    text-[9px]

                                    font-black

                                    uppercase

                                    tracking-[.22em]

                                    text-purple-400
                                  "
                                >
                                  BLOWING POWER
                                </p>


                                <p
                                  className="
                                    mt-1

                                    font-display

                                    text-2xl

                                    font-semibold

                                    italic

                                    text-plum
                                  "
                                >
                                  ${progressMessage}
                                </p>

                              </div>


                              <p
                                className="
                                  font-display

                                  text-4xl

                                  font-semibold

                                  italic

                                  text-purple-700
                                "
                              >
                                ${percent}%
                              </p>

                            </div>


                            <!-- PROGRESS TRACK -->

                            <div
                              className="
                                relative

                                mt-4

                                h-4

                                overflow-hidden

                                rounded-full

                                border

                                border-purple-200/70

                                bg-purple-50

                                p-[2px]

                                shadow-inner
                              "
                            >

                              <div
                                className="
                                  h-full

                                  rounded-full

                                  transition-[width]

                                  duration-75
                                "

                                style=${{
                                  width:
                                    `${percent}%`,

                                  background:
                                    'linear-gradient(90deg,#a66ac7,#c86db5,#ed8eb4)',
                                }}
                              ></div>

                            </div>


                            <!-- NUMBERS -->

                            <div
                              className="
                                mt-3

                                flex

                                items-center

                                justify-between

                                text-[10px]

                                font-bold

                                text-purple-500/60
                              "
                            >

                              <span>
                                🌬️ wind
                              </span>


                              <span>
                                ${remaining}
                                ${
                                  remaining === 1
                                    ? ' decoration'
                                    : ' decorations'
                                }
                                left
                              </span>

                            </div>


                            <!-- HOLD BUTTON -->

                            <button
                              ref=${holdButtonRef}

                              type="button"

                              onPointerDown=${startHold}

                              onPointerUp=${stopHold}

                              onPointerCancel=${stopHold}

                              onLostPointerCapture=${stopHold}

                              onContextMenu=${(
                                event
                              ) =>
                                event.preventDefault()
                              }

                              className="
                                group

                                relative

                                mt-6

                                inline-flex

                                min-h-[68px]

                                w-full

                                touch-none

                                select-none

                                items-center

                                justify-center

                                gap-3

                                overflow-hidden

                                rounded-full

                                px-7
                                py-4

                                font-display

                                text-xl

                                font-semibold

                                italic

                                text-white

                                shadow-[0_22px_65px_rgba(111,59,142,.32)]

                                transition-transform

                                duration-150

                                active:scale-[.975]

                                sm:text-2xl
                              "

                              style=${{
                                background:
                                  holding
                                    ? 'linear-gradient(135deg,#8641a7,#c557af,#eb79a7)'
                                    : 'linear-gradient(135deg,#693687,#934ab3,#c963a7)',
                              }}
                            >

                              <!-- HOLD PROGRESS INSIDE BUTTON -->

                              <span
                                aria-hidden="true"

                                className="
                                  pointer-events-none

                                  absolute

                                  inset-y-0
                                  left-0

                                  bg-white/13

                                  transition-[width]

                                  duration-75
                                "

                                style=${{
                                  width:
                                    `${percent}%`,
                                }}
                              ></span>


                              ${
                                holding
                                  ? html`
                                      <span
                                        className="
                                          pointer-events-none

                                          absolute

                                          inset-0

                                          animate-pulse

                                          bg-white/10
                                        "
                                      ></span>
                                    `
                                  : null
                              }


                              <span
                                className="
                                  relative

                                  z-10

                                  text-3xl
                                "
                              >
                                ${
                                  holding
                                    ? '💨'
                                    : '🌬️'
                                }
                              </span>


                              <span
                                className="
                                  relative

                                  z-10
                                "
                              >
                                ${
                                  holding
                                    ? `KEEP BLOWING — ${percent}%`
                                    : progress > 0
                                      ? 'HOLD AGAIN TO KEEP BLOWING'
                                      : 'PRESS + HOLD TO BLOW'
                                }
                              </span>

                            </button>


                            <p
                              className="
                                mt-4

                                text-xs

                                font-semibold

                                leading-5

                                text-purple-600/65
                              "
                            >
                              ${
                                holding
                                  ? 'do not lift your finger 😭 watch the cake decorations'
                                  : progress > 0
                                    ? `paused at ${percent}% — nothing reset, just hold again 💜`
                                    : 'hold it for a few seconds — clicking quickly will not work 😂'
                              }
                            </p>

                          </div>
                        `
                      : null
                  }


                  <!-- ================================= -->
                  <!-- COMPLETED -->
                  <!-- ================================= -->

                  ${
                    finished
                      ? html`
                          <div
                            className="
                              mx-auto

                              mt-8

                              max-w-xl
                            "
                          >

                            <p
                              className="
                                text-[9px]

                                font-black

                                uppercase

                                tracking-[.28em]

                                text-purple-400
                              "
                            >
                              CAKE STATUS
                            </p>


                            <p
                              className="
                                mt-2

                                font-display

                                text-3xl

                                font-semibold

                                italic

                                text-plum
                              "
                            >
                              absolutely violated 😭
                            </p>


                            <div
                              className="
                                mx-auto

                                mt-8

                                rounded-[2rem]

                                border

                                border-purple-200/70

                                bg-white/88

                                p-7

                                shadow-soft

                                sm:p-9
                              "
                            >

                              <p
                                className="
                                  text-4xl
                                "
                              >
                                🎉 🍿 💜
                              </p>


                              <p
                                className="
                                  mt-5

                                  font-display

                                  text-[clamp(3rem,7vw,5rem)]

                                  font-semibold

                                  leading-[.88]

                                  tracking-[-.045em]

                                  text-plum
                                "
                              >
                                Happy Birthday,

                                <br />

                                <span
                                  className="
                                    text-gradient

                                    italic
                                  "
                                >
                                  My Fendisha.
                                </span>
                              </p>


                              <p
                                className="
                                  mx-auto

                                  mt-6

                                  max-w-md

                                  font-display

                                  text-2xl

                                  italic

                                  leading-8

                                  text-purple-700
                                "
                              >
                                okay... now that u have successfully
                                blown half the bakery into another
                                dimension 😭
                              </p>


                              <p
                                className="
                                  mt-3

                                  text-sm

                                  font-semibold

                                  text-purple-900/60
                                "
                              >
                                hear the part that actually matters.
                              </p>


                              <${AudioButton}
                                src=${media.voiceFinal}

                                className="
                                  primary-cta

                                  mt-7
                                "
                              >
                                ▶ Play my birthday message
                              <//>

                            </div>


                            <div
                              className="
                                mt-9
                              "
                            >

                              <button
                                type="button"

                                className="
                                  secondary-cta

                                  group

                                  inline-flex

                                  items-center

                                  gap-2
                                "

                                onClick=${() =>
                                  onContinue(
                                    'afterword'
                                  )
                                }
                              >
                                P.S. want to know why this page looks like this?

                                <span
                                  className="
                                    transition-transform

                                    duration-300

                                    group-hover:translate-x-1
                                  "
                                >
                                  →
                                </span>

                              </button>

                            </div>

                          </div>
                        `
                      : null
                  }

                </div>
              `
            : null
        }

      </div>


      <!-- ================================= -->
      <!-- ANIMATIONS -->
      <!-- ================================= -->

      <style>
        ${`

          /*
          |--------------------------------------------------------------------------
          | EMOJI / POPCORN / CANDY RAIN
          |--------------------------------------------------------------------------
          */

          @keyframes finaleEmojiRain {

            0% {
              opacity: 0;

              transform:
                translate3d(
                  0,
                  -12vh,
                  0
                )
                rotate(0deg)
                scale(.72);
            }


            6% {
              opacity: .85;
            }


            88% {
              opacity: .85;
            }


            100% {
              opacity: 0;

              transform:
                translate3d(
                  var(--rain-drift),
                  112vh,
                  0
                )
                rotate(var(--rain-spin))
                scale(1.08);
            }

          }


          /*
          |--------------------------------------------------------------------------
          | CONFETTI
          |--------------------------------------------------------------------------
          */

          @keyframes finaleConfettiRain {

            0% {
              opacity: 0;

              transform:
                translate3d(
                  0,
                  -10vh,
                  0
                )
                rotateX(0deg)
                rotateY(0deg)
                rotateZ(0deg);
            }


            7% {
              opacity: .9;
            }


            87% {
              opacity: .9;
            }


            100% {
              opacity: 0;

              transform:
                translate3d(
                  var(--confetti-drift),
                  112vh,
                  0
                )
                rotateX(640deg)
                rotateY(520deg)
                rotateZ(
                  var(--confetti-spin)
                );
            }

          }


          @media (
            prefers-reduced-motion:
            reduce
          ) {

            [style*="finaleEmojiRain"],
            [style*="finaleConfettiRain"] {
              animation-duration:
                14s !important;
            }

          }

        `}
      </style>

        <!-- ================================= -->
            <!-- SECRET HEART -->
            <!-- ================================= -->
      
            <${SecretHeart}
              id=${19}
      
              found=${found.has(
                19
              )}
      
              onFind=${onFindHeart}
      
              className="
                bottom-[10%]
      
                left-[8%]
              "
            />

    </section>
  `;
}