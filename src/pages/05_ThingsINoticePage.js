import { React, html } from '../lib/react.js';
import { playSfx } from '../lib/audio.js';
import { SecretHeart } from '../components/SecretHeart.js';


/*
|--------------------------------------------------------------------------
| THINGS I ACTUALLY NOTICE ABOUT YOU
|--------------------------------------------------------------------------
|
| Completely local to this page.
| Nothing comes from content.js anymore.
|
*/

const TRUTHS = [
  {
    icon: '😂',

    title:
      'your laugh',

    body:
      'I think this one is obvious 😭. I love when u really laugh — not the polite one, the actual Fendisha laugh that changes your whole face and somehow makes me start laughing too.',
  },

  {
    icon: '🥹',

    title:
      'the way u care for your family',

    body:
      'I notice how much your family matters to u — your sisters, your brothers, the way their happiness, their problems and the things happening in their lives actually matter to your heart. That says a lot about the kind of person u are.',
  },

  {
    icon: '🎶',

    title:
      'when u sing',

    body:
      'I notice it more than I act like I do. There is something about hearing u sing that makes the moment softer... even when I am pretending to behave completely normal about it.',
  },

  {
    icon: '😒',

    title:
      'your mad face',

    body:
      'Unfortunately for u, this is genuinely one of my favorite versions of your face 😭. Especially when u are trying very hard to stay annoyed with me.',
  },

  {
    icon: '💜',

    title:
      'how deeply u love',

    body:
      'U do not love people halfway. When u care, u really care. U worry, u check, u remember, u give... and I know that kind of heart is not something everybody has.',
  },

  {
    icon: '✝️',

    title:
      'the quiet side of u',

    body:
      'There is a part of u that feels softer and older than the rest of the world around us — your faith, the things u value, the way some things actually mean something to u. I notice that side too.',
  },
];


export function ThingsINoticePage({
  onContinue,
  found,
  onFindHeart,
}) {
  const pageRef =
    React.useRef(null);

  const ctaRef =
    React.useRef(null);

  const tapTimer =
    React.useRef(null);

  const [hoveredCard, setHoveredCard] =
    React.useState(null);

  const [tappedCard, setTappedCard] =
    React.useState(null);


  /*
  |--------------------------------------------------------------------------
  | ENTRANCE
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    const page =
      pageRef.current;

    if (!page) {
      return;
    }

    const reduceMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    if (reduceMotion) {
      return;
    }


    /*
    | Header
    */

    const headerItems =
      page.querySelectorAll(
        '[data-notice-header]'
      );

    const headerAnimations =
      [];

    headerItems.forEach(
      (
        element,
        index
      ) => {
        const animation =
          element.animate(
            [
              {
                opacity: 0,

                transform:
                  'translateY(16px)',

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
              duration:
                720,

              delay:
                100 +
                index * 105,

              easing:
                'cubic-bezier(.18,.82,.22,1)',

              fill:
                'both',
            }
          );

        headerAnimations.push(
          animation
        );
      }
    );


    /*
    | Cards — arrive one after another
    */

    const cards =
      page.querySelectorAll(
        '[data-truth-card]'
      );

    const cardAnimations =
      [];

    cards.forEach(
      (
        card,
        index
      ) => {
        const animation =
          card.animate(
            [
              {
                opacity:
                  0,

                transform:
                  'translateY(20px) scale(.975)',

                filter:
                  'blur(4px)',
              },

              {
                opacity:
                  1,

                transform:
                  'translateY(0) scale(1)',

                filter:
                  'blur(0)',
              },
            ],

            {
              duration:
                660,

              delay:
                390 +
                index * 82,

              easing:
                'cubic-bezier(.16,.84,.22,1)',

              fill:
                'both',
            }
          );

        cardAnimations.push(
          animation
        );
      }
    );


    /*
    | CTA comes after the cards
    */

    let ctaAnimation =
      null;

    if (
      ctaRef.current
    ) {
      ctaAnimation =
        ctaRef.current.animate(
          [
            {
              opacity:
                0,

              transform:
                'translateY(10px)',
            },

            {
              opacity:
                1,

              transform:
                'translateY(0)',
            },
          ],

          {
            duration:
              650,

            delay:
              520 +
              TRUTHS.length *
                82,

            easing:
              'cubic-bezier(.18,.82,.22,1)',

            fill:
              'both',
          }
        );
    }


    return () => {
      headerAnimations.forEach(
        (animation) =>
          animation.cancel()
      );

      cardAnimations.forEach(
        (animation) =>
          animation.cancel()
      );

      ctaAnimation?.cancel();
    };
  }, []);


  /*
  |--------------------------------------------------------------------------
  | DESKTOP TILT
  |--------------------------------------------------------------------------
  */

  const moveCard = (
    event
  ) => {
    if (
      window.innerWidth <
      768
    ) {
      return;
    }

    const card =
      event.currentTarget;

    const bounds =
      card.getBoundingClientRect();

    const x =
      (
        event.clientX -
        bounds.left
      ) /
        bounds.width -
      0.5;

    const y =
      (
        event.clientY -
        bounds.top
      ) /
        bounds.height -
      0.5;

    const rotateY =
      x * 3.2;

    const rotateX =
      y * -3.2;


    card.style.transform =
      `
        perspective(900px)
        translateY(-4px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;


    card.style.boxShadow =
      `
        0 24px 64px
        rgba(105,63,145,.13)
      `;
  };


  const resetCard = (
    event
  ) => {
    const card =
      event.currentTarget;

    card.style.transform =
      `
        perspective(900px)
        translateY(0)
        rotateX(0)
        rotateY(0)
      `;

    card.style.boxShadow =
      '';
  };


  /*
  |--------------------------------------------------------------------------
  | CARD TAP
  |--------------------------------------------------------------------------
  */

  const touchTruth = (
    index,
    event
  ) => {
    const card =
      event.currentTarget;

    setTappedCard(
      index
    );

    clearTimeout(
      tapTimer.current
    );

    tapTimer.current =
      setTimeout(
        () => {
          setTappedCard(
            null
          );
        },

        850
      );


    playSfx(
      '/audio/sfx/mood-sparkle.wav',

      {
        volume:
          0.11,

        playbackRate:
          1.08,
      }
    );


    /*
    | card response
    */

    card.animate(
      [
        {
          transform:
            'scale(1)',
        },

        {
          transform:
            'scale(1.018)',
        },

        {
          transform:
            'scale(.995)',
        },

        {
          transform:
            'scale(1)',
        },
      ],

      {
        duration:
          420,

        easing:
          'cubic-bezier(.34,1.56,.64,1)',
      }
    );


    /*
    | icon response
    */

    const icon =
      card.querySelector(
        '[data-truth-icon]'
      );

    icon?.animate(
      [
        {
          transform:
            'translateY(0) rotate(0deg) scale(1)',
        },

        {
          transform:
            'translateY(-5px) rotate(-5deg) scale(1.10)',
        },

        {
          transform:
            'translateY(1px) rotate(3deg) scale(.98)',
        },

        {
          transform:
            'translateY(0) rotate(0deg) scale(1)',
        },
      ],

      {
        duration:
          520,

        easing:
          'cubic-bezier(.34,1.56,.64,1)',
      }
    );
  };


  React.useEffect(() => {
    return () => {
      clearTimeout(
        tapTimer.current
      );
    };
  }, []);


  return html`
    <section
      ref=${pageRef}

      id="things-i-notice"

      className="
        scene

        relative

        px-4
        py-20

        sm:px-6
        sm:py-28
      "
    >

      <div
        className="
          mx-auto

          max-w-6xl
        "
      >

        <!-- HEADER -->

        <div
          className="
            mx-auto

            max-w-3xl

            text-center
          "
        >
          <div
            data-notice-header
          >
            <span
              className="
                birthday-chip
              "
            >
              A FEW THINGS THAT ARE VERY YOU
            </span>
          </div>


          <h2
            data-notice-header

            className="
              section-title

              mt-5
            "
          >
            Before there was “us,”

            <br />

            <span
              className="
                text-gradient
              "
            >
              there was you.
            </span>
          </h2>


          <p
            data-notice-header

            className="
              section-lead

              mx-auto

              mt-5

              max-w-2xl
            "
          >
            Not a generic “21 reasons I love you” list.
            Just some little things about u that somehow stayed in my head.
          </p>
        </div>


        <!-- TRUTH GRID -->

        <div
          className="
            mt-12

            grid

            gap-4

            sm:grid-cols-2

            lg:grid-cols-3
          "
        >
          ${TRUTHS.map(
            (
              item,
              index
            ) => {
              const anotherHovered =
                hoveredCard !==
                  null &&
                hoveredCard !==
                  index;

              const isTapped =
                tappedCard ===
                  index;


              return html`
                <article
                  key=${item.title}

                  data-truth-card

                  onMouseEnter=${() =>
                    setHoveredCard(
                      index
                    )
                  }

                  onMouseLeave=${(
                    event
                  ) => {
                    setHoveredCard(
                      null
                    );

                    resetCard(
                      event
                    );
                  }}

                  onMouseMove=${moveCard}

                  onClick=${(
                    event
                  ) =>
                    touchTruth(
                      index,
                      event
                    )
                  }

                  className=${`
                    truth-card

                    relative

                    cursor-default

                    overflow-hidden

                    transition-[opacity,filter]

                    duration-300

                    ${
                      anotherHovered
                        ? `
                          opacity-[.67]

                          saturate-[.88]
                        `
                        : `
                          opacity-100
                        `
                    }
                  `}
                >

                  <!-- SOFT HOVER LIGHT -->

                  <div
                    className="
                      pointer-events-none

                      absolute

                      -right-12
                      -top-12

                      h-28
                      w-28

                      rounded-full

                      bg-purple-200/20

                      blur-3xl
                    "
                  ></div>


                  <!-- ICON -->

                  <div
                    data-truth-icon

                    className="
                      truth-icon

                      relative

                      z-10
                    "
                  >
                    ${item.icon}
                  </div>


                  <!-- TITLE -->

                  <h3
                    className="
                      relative

                      z-10

                      mt-4

                      font-display

                      text-3xl

                      font-semibold

                      text-plum
                    "
                  >
                    ${item.title}
                  </h3>


                  <!-- BODY -->

                  <p
                    className="
                      relative

                      z-10

                      mt-2

                      text-sm

                      leading-6

                      text-purple-900/68
                    "
                  >
                    ${item.body}
                  </p>


                  <!-- TAP HEART -->

                  <span
                    className="
                      pointer-events-none

                      absolute

                      right-4

                      top-4

                      z-20

                      text-lg

                      transition-all

                      duration-300
                    "

                    style=${{
                      opacity:
                        isTapped
                          ? 1
                          : 0,

                      transform:
                        isTapped
                          ? 'translateY(0) scale(1)'
                          : 'translateY(5px) scale(.65)',
                    }}
                  >
                    💜
                  </span>

                </article>
              `;
            }
          )}
        </div>


        <!-- CTA -->

        <div
          ref=${ctaRef}

          className="
            mt-10

            flex

            justify-center
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
                'our-moments'
              )
            }
          >
            then somehow… there was us

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


      <!-- SECRET HEARTS -->

      <${SecretHeart}
        id=${3}

        found=${found.has(
          3
        )}

        onFind=${onFindHeart}

        className="
          left-[5%]

          top-[45%]
        "
      />


      <${SecretHeart}
        id=${4}

        found=${found.has(
          4
        )}

        onFind=${onFindHeart}

        className="
          right-[5%]

          top-[35%]
        "
      />

    </section>
  `;
}