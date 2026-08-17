import { React, html } from '../lib/react.js';
import { SecretHeart } from '../components/SecretHeart.js';


export function HerGiftPage({
  onContinue,
  found,
  onFindHeart,
}) {
  const pageRef = React.useRef(null);
  const quoteRef = React.useRef(null);
  const ctaRef = React.useRef(null);

  const animationsRef = React.useRef([]);
  const observersRef = React.useRef([]);


  /*
  |--------------------------------------------------------------------------
  | REDUCED MOTION
  |--------------------------------------------------------------------------
  */

  const prefersReducedMotion = () =>
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  /*
  |--------------------------------------------------------------------------
  | PAGE ENTRANCE
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    const page = pageRef.current;

    if (!page) return;


    if (
      prefersReducedMotion()
    ) {
      return;
    }


    /*
    |--------------------------------------------------------------------------
    | HEADER
    |--------------------------------------------------------------------------
    */

    const headerItems =
      page.querySelectorAll(
        '[data-gift-header]'
      );


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
              duration: 760,

              delay:
                80 +
                index * 115,

              easing:
                'cubic-bezier(.18,.82,.22,1)',

              fill:
                'both',
            }
          );


        animationsRef.current.push(
          animation
        );
      }
    );


    /*
    |--------------------------------------------------------------------------
    | SCREENSHOTS
    |--------------------------------------------------------------------------
    |
    | Reveal one by one like little pages being placed down.
    |
    */

    const screenshots =
      page.querySelectorAll(
        '[data-gift-shot]'
      );


    screenshots.forEach(
      (
        shot,
        index
      ) => {
        shot.style.opacity =
          '0';


        const observer =
          new IntersectionObserver(
            (
              entries
            ) => {
              entries.forEach(
                (
                  entry
                ) => {
                  if (
                    !entry.isIntersecting
                  ) {
                    return;
                  }


                  const directions = [
                    'translateY(24px) rotate(-1.5deg) scale(.975)',
                    'translateY(24px) rotate(.7deg) scale(.975)',
                    'translateY(24px) rotate(1.4deg) scale(.975)',
                  ];


                  const animation =
                    shot.animate(
                      [
                        {
                          opacity: 0,

                          transform:
                            directions[
                              index %
                              directions.length
                            ],

                          filter:
                            'blur(5px)',
                        },

                        {
                          opacity: 1,

                          transform:
                            'translateY(0) rotate(0deg) scale(1)',

                          filter:
                            'blur(0)',
                        },
                      ],

                      {
                        duration: 820,

                        delay:
                          index * 120,

                        easing:
                          'cubic-bezier(.18,.82,.22,1)',

                        fill:
                          'forwards',
                      }
                    );


                  animationsRef.current.push(
                    animation
                  );


                  observer.disconnect();
                }
              );
            },

            {
              threshold: 0.18,
            }
          );


        observer.observe(
          shot
        );


        observersRef.current.push(
          observer
        );
      }
    );


    /*
    |--------------------------------------------------------------------------
    | QUOTE CARD
    |--------------------------------------------------------------------------
    */

    if (
      quoteRef.current
    ) {
      quoteRef.current.style.opacity =
        '0';


      const observer =
        new IntersectionObserver(
          (
            entries
          ) => {
            entries.forEach(
              (
                entry
              ) => {
                if (
                  !entry.isIntersecting
                ) {
                  return;
                }


                const animation =
                  quoteRef.current.animate(
                    [
                      {
                        opacity: 0,

                        transform:
                          'translateY(22px) scale(.985)',

                        filter:
                          'blur(5px)',
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
                      duration: 900,

                      easing:
                        'cubic-bezier(.16,.84,.22,1)',

                      fill:
                        'forwards',
                    }
                  );


                animationsRef.current.push(
                  animation
                );


                observer.disconnect();
              }
            );
          },

          {
            threshold: 0.22,
          }
        );


      observer.observe(
        quoteRef.current
      );


      observersRef.current.push(
        observer
      );
    }


    /*
    |--------------------------------------------------------------------------
    | CTA LAST
    |--------------------------------------------------------------------------
    */

    if (
      ctaRef.current
    ) {
      ctaRef.current.style.opacity =
        '0';


      const observer =
        new IntersectionObserver(
          (
            entries
          ) => {
            entries.forEach(
              (
                entry
              ) => {
                if (
                  !entry.isIntersecting
                ) {
                  return;
                }


                const animation =
                  ctaRef.current.animate(
                    [
                      {
                        opacity: 0,

                        transform:
                          'translateY(12px)',
                      },

                      {
                        opacity: 1,

                        transform:
                          'translateY(0)',
                      },
                    ],

                    {
                      duration: 720,

                      delay: 140,

                      easing:
                        'cubic-bezier(.18,.82,.22,1)',

                      fill:
                        'forwards',
                    }
                  );


                animationsRef.current.push(
                  animation
                );


                observer.disconnect();
              }
            );
          },

          {
            threshold: 0.2,
          }
        );


      observer.observe(
        ctaRef.current
      );


      observersRef.current.push(
        observer
      );
    }


    return () => {
      observersRef.current.forEach(
        (
          observer
        ) => {
          observer.disconnect();
        }
      );


      animationsRef.current.forEach(
        (
          animation
        ) => {
          animation.cancel();
        }
      );


      observersRef.current = [];
      animationsRef.current = [];
    };
  }, []);


  /*
  |--------------------------------------------------------------------------
  | SCREENSHOT HOVER
  |--------------------------------------------------------------------------
  |
  | Very small premium lift.
  |
  */

  const handleShotEnter = (
    event
  ) => {
    if (
      window.innerWidth < 900 ||
      prefersReducedMotion()
    ) {
      return;
    }


    event.currentTarget.animate(
      [
        {
          transform:
            'translateY(0) scale(1)',
        },

        {
          transform:
            'translateY(-6px) scale(1.015)',
        },
      ],

      {
        duration: 320,

        easing:
          'cubic-bezier(.18,.82,.22,1)',

        fill: 'forwards',
      }
    );
  };


  const handleShotLeave = (
    event
  ) => {
    if (
      window.innerWidth < 900 ||
      prefersReducedMotion()
    ) {
      return;
    }


    event.currentTarget.animate(
      [
        {
          transform:
            'translateY(-6px) scale(1.015)',
        },

        {
          transform:
            'translateY(0) scale(1)',
        },
      ],

      {
        duration: 360,

        easing:
          'cubic-bezier(.18,.82,.22,1)',

        fill: 'forwards',
      }
    );
  };


  return html`
    <section
      ref=${pageRef}

      id="her-gift"

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
      <!-- SOFT BACKGROUND -->
      <!-- ================================= -->

      <div
        aria-hidden="true"

        className="
          pointer-events-none

          absolute

          left-1/2
          top-[18%]

          h-[30rem]
          w-[30rem]

          -translate-x-1/2

          rounded-full

          bg-purple-200/10

          blur-[120px]
        "
      ></div>


      <div
        className="
          relative

          mx-auto

          max-w-6xl
        "
      >

        <!-- ================================= -->
        <!-- HEADER -->
        <!-- ================================= -->

        <div
          className="
            mx-auto

            max-w-3xl

            text-center
          "
        >

          <div
            data-gift-header
          >
            <span
              className="
                birthday-chip
              "
            >
              YOU KIND OF STARTED THIS
            </span>
          </div>


          <h2
            data-gift-header

            className="
              section-title

              mt-5
            "
          >
            You made me a little world

            <br />

            <span
              className="
                text-gradient
              "
            >
              from our memories first.
            </span>
          </h2>


          <p
            data-gift-header

            className="
              section-lead

              mx-auto

              mt-5

              max-w-2xl
            "
          >
            I do not think I explained properly how much I loved
            that you sat there and actually made something for
            my birthday. So yes… this whole ridiculous thing
            you are inside right now might be partly your fault 😂
          </p>

        </div>


        <!-- ================================= -->
        <!-- HER GIFT SCREENSHOTS -->
        <!-- ================================= -->

        <div
          className="
            mt-10

            grid

            gap-4

            lg:grid-cols-3
          "
        >

          <img
            data-gift-shot

            src="/media/her-gift/memories.png"

            alt="A page from the birthday site Fendisha made for Darion"

            onPointerEnter=${handleShotEnter}

            onPointerLeave=${handleShotLeave}

            className="
              w-full

              rounded-3xl

              shadow-soft

              ring-1

              ring-purple-200/70

              will-change-transform
            "
          />


          <img
            data-gift-shot

            src="/media/her-gift/things-i-love.png"

            alt="Things I love page from Fendisha's gift"

            onPointerEnter=${handleShotEnter}

            onPointerLeave=${handleShotLeave}

            className="
              w-full

              rounded-3xl

              shadow-soft

              ring-1

              ring-purple-200/70

              will-change-transform
            "
          />


          <img
            data-gift-shot

            src="/media/her-gift/your-language.png"

            alt="Your language page from Fendisha's gift"

            onPointerEnter=${handleShotEnter}

            onPointerLeave=${handleShotLeave}

            className="
              w-full

              rounded-3xl

              shadow-soft

              ring-1

              ring-purple-200/70

              will-change-transform
            "
          />

        </div>


        <!-- ================================= -->
        <!-- EMOTIONAL CALLBACK -->
        <!-- ================================= -->

        <div
          ref=${quoteRef}

          className="
            mx-auto

            mt-10

            max-w-2xl

            rounded-[2rem]

            bg-purple-50

            p-6

            text-center

            shadow-soft

            sm:p-8
          "
        >

          <p
            className="
              font-display

              text-3xl

              italic

              text-plum
            "
          >
            You hoped you would get to stay beside me
            for more birthdays.
          </p>


          <p
            className="
              mt-3

              text-base

              font-semibold

              text-purple-800
            "
          >
            Here is one more. 💜
          </p>

        </div>


        <!-- ================================= -->
        <!-- NEXT -->
        <!-- ================================= -->

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
              primary-cta

              group

              inline-flex

              items-center

              gap-2
            "

            onClick=${() =>
              onContinue(
                'finale'
              )
            }
          >
            happy birthday, Fendisha

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


      <!-- ================================= -->
      <!-- SECRET HEART -->
      <!-- ================================= -->

      <${SecretHeart}
        id=${18}

        found=${found.has(
          18
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