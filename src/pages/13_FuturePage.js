import { React, html } from '../lib/react.js';
import { futureCards } from '../content.js';
import { media } from '../config.js';
import { AudioButton } from '../components/AudioButton.js';
import { SecretHeart } from '../components/SecretHeart.js';


export function FuturePage({
  onContinue,
  found,
  onFindHeart,
}) {
  const pageRef = React.useRef(null);
  const finalCardRef = React.useRef(null);
  const rafRef = React.useRef(null);

  const observersRef = React.useRef([]);
  const animationsRef = React.useRef([]);


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


    if (prefersReducedMotion()) {
      return;
    }


    /*
    |--------------------------------------------------------------------------
    | HEADER
    |--------------------------------------------------------------------------
    */

    const headerPieces =
      page.querySelectorAll(
        '[data-future-header]'
      );


    headerPieces.forEach(
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
                  'blur(5px)',
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
                index * 120,

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
    | FUTURE CARDS
    |--------------------------------------------------------------------------
    |
    | Each one arrives when she reaches it.
    |
    | Feels like pages that haven't happened yet
    | quietly entering the story.
    |
    */

    const cards =
      page.querySelectorAll(
        '[data-future-card]'
      );


    cards.forEach(
      (
        card,
        index
      ) => {
        card.style.opacity = '0';


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
                    card.animate(
                      [
                        {
                          opacity: 0,

                          transform:
                            'translateY(24px) scale(.975)',

                          filter:
                            'blur(4px)',
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
                        duration: 720,

                        delay:
                          (index % 3) *
                          90,

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


        observer.observe(card);

        observersRef.current.push(
          observer
        );
      }
    );


    /*
    |--------------------------------------------------------------------------
    | FINAL WHITE CARD
    |--------------------------------------------------------------------------
    |
    | Slower entrance.
    | This is the emotional landing point of the page.
    |
    */

    const finalCard =
      finalCardRef.current;


    if (finalCard) {
      finalCard.style.opacity = '0';


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
                  finalCard.animate(
                    [
                      {
                        opacity: 0,

                        transform:
                          'translateY(28px) scale(.98)',

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
                      duration: 950,

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
            threshold: 0.24,
          }
        );


      observer.observe(
        finalCard
      );


      observersRef.current.push(
        observer
      );
    }


    /*
    |--------------------------------------------------------------------------
    | CTA
    |--------------------------------------------------------------------------
    */

    const cta =
      page.querySelector(
        '[data-future-next]'
      );


    if (cta) {
      cta.style.opacity = '0';


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
                  cta.animate(
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
                      duration: 700,

                      delay: 180,

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
        cta
      );


      observersRef.current.push(
        observer
      );
    }


    /*
    |--------------------------------------------------------------------------
    | CLEANUP
    |--------------------------------------------------------------------------
    */

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
  | CARD HOVER
  |--------------------------------------------------------------------------
  |
  | Very small lift.
  | No redesign.
  |--------------------------------------------------------------------------
  */

  const handleCardEnter = (
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
            'translateY(-5px) scale(1.012)',
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


  const handleCardLeave = (
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
            'translateY(-5px) scale(1.012)',
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


  /*
  |--------------------------------------------------------------------------
  | FINAL CARD MICRO PARALLAX
  |--------------------------------------------------------------------------
  */

  const handleFinalMove = (
    event
  ) => {
    if (
      window.innerWidth < 900 ||
      prefersReducedMotion()
    ) {
      return;
    }


    cancelAnimationFrame(
      rafRef.current
    );


    rafRef.current =
      requestAnimationFrame(
        () => {
          const card =
            finalCardRef.current;


          if (!card) return;


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


          card.style.transform =
            `
              perspective(1000px)
              rotateX(${y * -1.2}deg)
              rotateY(${x * 1.6}deg)
              translateY(-2px)
            `;
        }
      );
  };


  const handleFinalLeave = () => {
    cancelAnimationFrame(
      rafRef.current
    );


    if (
      finalCardRef.current
    ) {
      finalCardRef.current.style.transform =
        `
          perspective(1000px)
          rotateX(0deg)
          rotateY(0deg)
          translateY(0)
        `;
    }
  };


  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(
        rafRef.current
      );
    };
  }, []);


  return html`
    <section
      ref=${pageRef}

      id="future"

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
      <!-- VERY SOFT FUTURE ATMOSPHERE -->
      <!-- ================================= -->

      <div
        aria-hidden="true"

        className="
          pointer-events-none

          absolute

          left-1/2
          top-[18%]

          h-[32rem]
          w-[32rem]

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
            text-center
          "
        >

          <div
            data-future-header
          >
            <span
              className="
                birthday-chip
              "
            >
              NOT YET PHOTOGRAPHED
            </span>
          </div>


          <h2
            data-future-header

            className="
              section-title

              mt-5
            "
          >
            There are still pages

            <br />

            <span
              className="
                text-gradient
              "
            >
              life has not given us yet.
            </span>
          </h2>


          <p
            data-future-header

            className="
              section-lead

              mx-auto

              mt-5

              max-w-2xl
            "
          >
            No fake future wedding photos.
            No AI children.
            Just a few things I have imagined,
            hoped for, or would be happy to live
            if life takes us there.
          </p>

        </div>


        <!-- ================================= -->
        <!-- FUTURE CARDS -->
        <!-- ================================= -->

        <div
          className="
            mt-12

            grid

            gap-4

            sm:grid-cols-2

            lg:grid-cols-3
          "
        >

          ${
            futureCards.map(
              (
                item
              ) => html`

                <article
                  key=${item.title}

                  data-future-card

                  className="
                    future-card

                    p-6

                    will-change-transform
                  "

                  onPointerEnter=${handleCardEnter}

                  onPointerLeave=${handleCardLeave}
                >

                  <h3
                    className="
                      font-display

                      text-3xl

                      font-semibold

                      leading-tight

                      text-plum
                    "
                  >
                    ${item.title}
                  </h3>


                  <p
                    className="
                      mt-3

                      text-sm

                      leading-6

                      text-purple-900/68
                    "
                  >
                    ${item.body}
                  </p>

                </article>

              `
            )
          }

        </div>


        <!-- ================================= -->
        <!-- EMOTIONAL LANDING -->
        <!-- ================================= -->

        <div
          ref=${finalCardRef}

          className="
            mx-auto

            mt-10

            max-w-2xl

            rounded-[2rem]

            bg-white/80

            p-6

            text-center

            shadow-soft

            backdrop-blur-xl

            will-change-transform

            sm:p-8
          "

          onPointerMove=${handleFinalMove}

          onPointerLeave=${handleFinalLeave}
        >

          <p
            className="
              font-display

              text-3xl

              italic

              text-plum
            "
          >
            I do not know exactly what our future looks like.
          </p>


          <p
            className="
              mt-3

              text-sm

              leading-6

              text-purple-900/70
            "
          >
            I just know that when I picture my life ahead,
            you show up in it a lot.
          </p>


          <${AudioButton}
            src=${media.voiceFuture}

            className="
              secondary-cta

              mt-5
            "
          >
            ▶ Hear the rest from me
          <//>

        </div>


        <!-- ================================= -->
        <!-- NEXT -->
        <!-- ================================= -->

        <div
          data-future-next

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
                'her-gift'
              )
            }
          >
            there is something you started

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
        id=${17}

        found=${found.has(
          17
        )}

        onFind=${onFindHeart}

        className="
          left-[7%]

          top-[30%]
        "
      />

    </section>
  `;
}