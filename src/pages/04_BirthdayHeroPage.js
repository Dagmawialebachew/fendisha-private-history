import { React, html } from '../lib/react.js';
import { SecretHeart } from '../components/SecretHeart.js';

export function BirthdayHeroPage({
  onContinue,
  found,
  onFindHeart,
}) {
  const pageRef = React.useRef(null);
  const numberRef = React.useRef(null);
  const portraitRef = React.useRef(null);
  const orbitRef = React.useRef(null);
  const captionRef = React.useRef(null);
  const popcornRef = React.useRef(null);

  const [burst, setBurst] = React.useState(0);

  /*
  |--------------------------------------------------------------------------
  | PAGE ARRIVAL
  |--------------------------------------------------------------------------
  |
  | We keep the original design.
  | This only controls HOW it enters.
  |
  */

  React.useEffect(() => {
    const reduceMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    if (reduceMotion) {
      return;
    }

    const page =
      pageRef.current;

    if (!page) {
      return;
    }

    /*
      Whole page gently appears first.
    */

    const pageAnimation =
      page.animate(
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
          duration: 650,
          easing:
            'cubic-bezier(.18,.82,.22,1)',
          fill: 'both',
        }
      );

    /*
      Then each important piece
      comes in separately.
    */

    const revealItems =
      page.querySelectorAll(
        '[data-birthday-reveal]'
      );

    const revealAnimations =
      [];

    revealItems.forEach(
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
                  'translateY(18px)',

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
              duration: 760,

              delay:
                130 +
                index * 100,

              easing:
                'cubic-bezier(.18,.82,.22,1)',

              fill: 'both',
            }
          );

        revealAnimations.push(
          animation
        );
      }
    );

    /*
      Portrait arrives slightly
      differently from the text.

      It should feel like SHE enters
      the page rather than just an image
      loading beside the copy.
    */

    const portraitAnimation =
      portraitRef.current?.animate(
        [
          {
            opacity: 0,

            transform:
              'translateY(24px) scale(.97)',

            filter:
              'blur(5px)',
          },

          {
            opacity: 1,

            transform:
              'translateY(0) scale(1)',

            filter:
              'blur(0px)',
          },
        ],
        {
          duration: 1000,

          delay: 380,

          easing:
            'cubic-bezier(.16,1,.3,1)',

          fill: 'both',
        }
      );

    /*
      Giant 21.

      Slow enough that it doesn't
      scream "animation".
    */

    const numberAnimation =
      numberRef.current?.animate(
        [
          {
            transform:
              'translateX(-50%) translateY(0) scale(1)',

            opacity: 0.20,
          },

          {
            transform:
              'translateX(-50%) translateY(7px) scale(1.035)',

            opacity: 0.29,
          },

          {
            transform:
              'translateX(-50%) translateY(0) scale(1)',

            opacity: 0.20,
          },
        ],
        {
          duration: 7200,

          iterations:
            Infinity,

          easing:
            'ease-in-out',
        }
      );

    /*
      Caption follows the photo.
    */

    const captionAnimation =
      captionRef.current?.animate(
        [
          {
            opacity: 0,

            transform:
              'translate(-10px, 12px) rotate(-5deg)',
          },

          {
            opacity: 1,

            transform:
              'translate(0,0) rotate(-5deg)',
          },
        ],
        {
          duration: 760,

          delay: 850,

          easing:
            'cubic-bezier(.16,1,.3,1)',

          fill: 'both',
        }
      );

    /*
      Popcorn mostly rests.

      Every few seconds:
      tiny hop → tilt → settle.

      Cute, not annoying.
    */

    const popcornAnimation =
      popcornRef.current?.animate(
        [
          {
            transform:
              'translateY(0) rotate(0deg) scale(1)',
          },

          {
            transform:
              'translateY(0) rotate(0deg) scale(1)',

            offset: 0.70,
          },

          {
            transform:
              'translateY(-7px) rotate(-9deg) scale(1.08)',

            offset: 0.78,
          },

          {
            transform:
              'translateY(1px) rotate(6deg) scale(.97)',

            offset: 0.86,
          },

          {
            transform:
              'translateY(-2px) rotate(-2deg) scale(1.025)',

            offset: 0.93,
          },

          {
            transform:
              'translateY(0) rotate(0deg) scale(1)',
          },
        ],
        {
          duration: 3900,

          iterations:
            Infinity,

          easing:
            'cubic-bezier(.34,1.56,.64,1)',
        }
      );

    return () => {
      pageAnimation.cancel();

      revealAnimations.forEach(
        (animation) =>
          animation.cancel()
      );

      portraitAnimation?.cancel();

      numberAnimation?.cancel();

      captionAnimation?.cancel();

      popcornAnimation?.cancel();
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | PORTRAIT PARALLAX
  |--------------------------------------------------------------------------
  |
  | VERY small.
  |
  | This isn't Page 02.
  | Her photo stays calm.
  |
  */

  const movePortrait = (
    event
  ) => {
    if (
      window.innerWidth <
      1024
    ) {
      return;
    }

    const page =
      pageRef.current;

    if (!page) {
      return;
    }

    const bounds =
      page.getBoundingClientRect();

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

    if (
      portraitRef.current
    ) {
      portraitRef.current.style.transform =
        `
          translate3d(
            ${x * 5}px,
            ${y * 4}px,
            0
          )
        `;
    }

    if (
      orbitRef.current
    ) {
      orbitRef.current.style.transform =
        `
          translate3d(
            ${x * -9}px,
            ${y * -7}px,
            0
          )
          rotate(7deg)
        `;
    }

    if (
      captionRef.current
    ) {
      captionRef.current.style.transform =
        `
          translate3d(
            ${x * -2}px,
            ${y * -2}px,
            0
          )
          rotate(-5deg)
        `;
    }
  };

  const resetPortrait = () => {
    if (
      portraitRef.current
    ) {
      portraitRef.current.style.transform =
        'translate3d(0,0,0)';
    }

    if (
      orbitRef.current
    ) {
      orbitRef.current.style.transform =
        'translate3d(0,0,0) rotate(7deg)';
    }

    if (
      captionRef.current
    ) {
      captionRef.current.style.transform =
        'translate3d(0,0,0) rotate(-5deg)';
    }
  };

  /*
  |--------------------------------------------------------------------------
  | POPCORN INTERACTION
  |--------------------------------------------------------------------------
  */

  const popFendisha = () => {
    const popcorn =
      popcornRef.current;

    if (!popcorn) {
      return;
    }

    popcorn.animate(
      [
        {
          transform:
            'translateY(0) rotate(0deg) scale(1)',
        },

        {
          transform:
            'translateY(-14px) rotate(-12deg) scale(1.17)',
        },

        {
          transform:
            'translateY(2px) rotate(9deg) scale(.93)',
        },

        {
          transform:
            'translateY(-4px) rotate(-4deg) scale(1.06)',
        },

        {
          transform:
            'translateY(0) rotate(0deg) scale(1)',
        },
      ],
      {
        duration: 620,

        easing:
          'cubic-bezier(.34,1.56,.64,1)',
      }
    );

    setBurst(
      (value) =>
        value + 1
    );
  };

  /*
  |--------------------------------------------------------------------------
  | GIANT 21 INTERACTION
  |--------------------------------------------------------------------------
  */

  const teaseTwentyOne = () => {
    const number =
      numberRef.current;

    if (!number) {
      return;
    }

    number.animate(
      [
        {
          transform:
            'translateX(-50%) scale(1)',
        },

        {
          transform:
            'translateX(-50%) scale(1.055)',
        },

        {
          transform:
            'translateX(-50%) scale(1)',
        },
      ],
      {
        duration: 700,

        easing:
          'cubic-bezier(.34,1.56,.64,1)',
      }
    );
  };

  return html`
    <section
      ref=${pageRef}

      id="you-at-21"

      className="
        scene

        relative

        flex

        min-h-[100svh]

        items-center

        overflow-hidden

        px-4

        py-12

        sm:px-6
        sm:py-14

        lg:min-h-[720px]
        lg:py-8
      "

      onPointerMove=${movePortrait}

      onPointerLeave=${resetPortrait}
    >

      <!-- ===================================== -->
      <!-- GIANT 21 -->
      <!-- ===================================== -->

      <button
        ref=${numberRef}

        type="button"

        tabindex="-1"

        aria-hidden="true"

        onMouseEnter=${teaseTwentyOne}

        onClick=${teaseTwentyOne}

        className="
          pointer-events-auto

          absolute

          left-1/2

          top-3

          -translate-x-1/2

          select-none

          border-0

          bg-transparent

          p-0

          font-display

          text-[10rem]

          font-semibold

          leading-none

          tracking-[-.08em]

          text-purple-200/25

          outline-none

          sm:text-[16rem]

          lg:top-[-1rem]

          lg:text-[21rem]
        "
      >
        21
      </button>

      <!-- ===================================== -->
      <!-- ORIGINAL SPLIT DESIGN -->
      <!-- ===================================== -->

      <div
        className="
          mx-auto

          grid

          w-full
          max-w-6xl

          items-center

          gap-10

          lg:grid-cols-[1.05fr_.95fr]

          lg:gap-12
        "
      >

        <!-- =================================== -->
        <!-- COPY -->
        <!-- =================================== -->

        <div
          className="
            relative

            z-10
          "
        >

          <div
            data-birthday-reveal
          >
            <span
              className="
                birthday-chip
              "
            >
              TODAY IS ABOUT YOU
            </span>
          </div>

          <h2
            className="
              mt-5

              font-display

              text-[clamp(4rem,10vw,8.5rem)]

              font-semibold

              leading-[.78]

              tracking-[-.065em]

              text-plum
            "
          >
            <span
              data-birthday-reveal

              className="
                block
              "
            >
              Happy
            </span>

            <span
              data-birthday-reveal

              className="
                text-gradient

                block
              "
            >
              21st Birthday
            </span>
          </h2>

          <!-- ================================= -->
          <!-- FENDISHA / POPCORN -->
          <!-- ================================= -->

          <div
            data-birthday-reveal

            className="
              mt-5

              flex

              items-center

              gap-2
            "
          >
            <p
              className="
                font-display

                text-[clamp(2.2rem,5vw,4.3rem)]

                italic

                leading-none

                text-purple-700
              "
            >
              My Fendisha
            </p>

            <button
              type="button"

              onClick=${popFendisha}

              onMouseEnter=${popFendisha}

              className="
                relative

                grid

                h-12
                w-12

                shrink-0

                place-items-center

                rounded-full

                border
                border-purple-100/70

                bg-white/55

                text-[1.75rem]

                shadow-[0_9px_26px_rgba(105,63,145,.08)]

                backdrop-blur-xl

                transition

                hover:-translate-y-0.5

                hover:bg-white/85

                focus:outline-none

                focus-visible:ring-4

                focus-visible:ring-purple-200/40
              "

              aria-label="Pop the Fendisha"
            >
              <span
                ref=${popcornRef}

                className="
                  relative

                  z-10

                  inline-block
                "
              >
                🍿
              </span>

              <!-- tiny burst -->

              <span
                key=${`burst-a-${burst}`}

                className="
                  pointer-events-none

                  absolute

                  left-1/2
                  top-1/2

                  text-[9px]
                "

                style=${{
                  opacity:
                    burst
                      ? 1
                      : 0,

                  animation:
                    burst
                      ? 'heart-fly 700ms ease-out both'
                      : 'none',

                  '--x':
                    '-22px',

                  '--y':
                    '-28px',

                  '--r':
                    '-18deg',
                }}
              >
                ✦
              </span>

              <span
                key=${`burst-b-${burst}`}

                className="
                  pointer-events-none

                  absolute

                  left-1/2
                  top-1/2

                  text-[8px]
                "

                style=${{
                  opacity:
                    burst
                      ? 1
                      : 0,

                  animation:
                    burst
                      ? 'heart-fly 760ms ease-out both'
                      : 'none',

                  '--x':
                    '25px',

                  '--y':
                    '-23px',

                  '--r':
                    '22deg',
                }}
              >
                ✦
              </span>

              <span
                key=${`burst-c-${burst}`}

                className="
                  pointer-events-none

                  absolute

                  left-1/2
                  top-1/2

                  text-[8px]
                "

                style=${{
                  opacity:
                    burst
                      ? 1
                      : 0,

                  animation:
                    burst
                      ? 'heart-fly 820ms ease-out both'
                      : 'none',

                  '--x':
                    '9px',

                  '--y':
                    '-34px',

                  '--r':
                    '12deg',
                }}
              >
                💜
              </span>
            </button>
          </div>

          <!-- ================================= -->
          <!-- EMOTIONAL STOP -->
          <!-- ================================= -->

          <div
            className="
              mt-7

              max-w-xl

              space-y-4

              text-base

              leading-7

              text-purple-900/75

              sm:text-lg
              sm:leading-8
            "
          >
            <p
              data-birthday-reveal
            >
              Twenty-one looks
              <strong>
                ${' '}very good on u
              </strong>
              , btw.
            </p>

            <p
              data-birthday-reveal
            >
              Before I take u through all the random things I remember,
              notice, laugh about and probably overthink...
              I wanted one page that just
              <strong>
                ${' '}stops here.
              </strong>
            </p>

            <p
              data-birthday-reveal

              className="
                font-display

                text-[1.65rem]

                italic

                leading-7

                text-purple-700

                sm:text-[1.9rem]

                sm:leading-8
              "
            >
              On you. Right now. At 21.
            </p>

            <p
              data-birthday-reveal
            >
              There are already so many little versions of u
              I’ve gotten to know...
              and somehow I still feel like
              <strong>
                ${' '}I’m only at the beginning.
              </strong>
            </p>
          </div>

          <!-- CTA -->

          <div
            data-birthday-reveal
          >
            <button
              type="button"

              className="
                primary-cta

                group

                mt-7

                inline-flex

                items-center

                gap-2.5
              "

              onClick=${() =>
                onContinue(
                  'things-i-notice'
                )
              }
            >
              okay... let me show u what I notice

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

        <!-- =================================== -->
        <!-- PORTRAIT -->
        <!-- =================================== -->

        <div
          className="
            relative

            mx-auto

            w-full

            max-w-[470px]

            lg:max-w-[500px]
          "
        >
          <div
            ref=${orbitRef}

            className="
              portrait-orbit

              transition-transform

              duration-700

              ease-out
            "
          ></div>

          <div
            ref=${portraitRef}

            className="
              relative

              z-10

              transition-transform

              duration-700

              ease-out
            "
          >
            <img
              src="/media/photos/favorite-her.jpg"

              alt="Favorite photo of My Fendisha"

              className="
                aspect-[4/5]

                w-full

                rounded-[2.5rem]

                object-cover

                shadow-float

                ring-8

                ring-white/65

                transition-all

                duration-700

                ease-out

                hover:-translate-y-1

                hover:scale-[1.008]
              "

              draggable="false"
            />
          </div>

          <!-- original caption style -->

          <div
            ref=${captionRef}

            className="
              absolute

              -bottom-5

              -left-4

              z-20

              rotate-[-5deg]

              rounded-2xl

              bg-white

              px-5

              py-4

              shadow-soft

              transition-transform

              duration-700

              ease-out

              sm:-left-8
            "
          >
            <p
              className="
                font-display

                text-2xl

                italic

                text-plum
              "
            >
              twenty-one.
            </p>

            <p
              className="
                text-xs

                font-semibold

                text-purple-600
              "
            >
              still becoming. already loved.
            </p>
          </div>
        </div>
      </div>

      <!-- ===================================== -->
      <!-- KEEP ORIGINAL HEART SYSTEM -->
      <!-- ===================================== -->

      <${SecretHeart}
  id=${1}

  found=${found.has(1)}

  onFind=${onFindHeart}

  tease=${!found.has(1)}

  teaseText="don't touch this 👀"

  className="
    left-[7%]
    top-[22%]
    z-30
  "
/>


<${SecretHeart}
  id=${2}

  found=${found.has(2)}

  onFind=${onFindHeart}

  className="
    bottom-[12%]
    right-[8%]
    z-30
  "
/>
    </section>
  `;

  
}



