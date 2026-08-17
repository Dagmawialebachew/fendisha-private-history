import { React, html } from '../lib/react.js';
import { inspirationNotes } from '../content.js';
import { SecretHeart } from '../components/SecretHeart.js';


export function AfterwordPage({
  onContinue,
  found,
  onFindHeart,
}) {
  const pageRef =
    React.useRef(null);

  const observersRef =
    React.useRef([]);

  const animationsRef =
    React.useRef([]);


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
  | PAGE ANIMATIONS
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    const page =
      pageRef.current;

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
        '[data-afterword-header]'
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
    | INSPIRATION CARDS
    |--------------------------------------------------------------------------
    |
    | Reveal when she reaches them.
    |
    */

    const cards =
      page.querySelectorAll(
        '[data-afterword-card]'
      );


    cards.forEach(
      (
        card,
        index
      ) => {
        card.style.opacity =
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


                  /*
                  | Animate the little mark separately.
                  */

                  const mark =
                    card.querySelector(
                      '[data-afterword-mark]'
                    );


                  if (mark) {
                    const markAnimation =
                      mark.animate(
                        [
                          {
                            opacity: 0,

                            transform:
                              'translateY(7px) scale(.72) rotate(-7deg)',
                          },

                          {
                            opacity: 1,

                            transform:
                              'translateY(0) scale(1.08) rotate(2deg)',

                            offset: 0.72,
                          },

                          {
                            opacity: 1,

                            transform:
                              'translateY(0) scale(1) rotate(0deg)',
                          },
                        ],

                        {
                          duration: 620,

                          delay:
                            140 +
                            (index % 3) *
                              90,

                          easing:
                            'cubic-bezier(.34,1.56,.64,1)',

                          fill:
                            'both',
                        }
                      );


                    animationsRef.current.push(
                      markAnimation
                    );
                  }


                  observer.disconnect();
                }
              );
            },

            {
              threshold: 0.18,
            }
          );


        observer.observe(
          card
        );


        observersRef.current.push(
          observer
        );
      }
    );


    /*
    |--------------------------------------------------------------------------
    | REIMAGINED PHOTO NOTE
    |--------------------------------------------------------------------------
    */

    const note =
      page.querySelector(
        '[data-afterword-note]'
      );


    if (note) {
      note.style.opacity =
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
                  note.animate(
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
        note
      );


      observersRef.current.push(
        observer
      );
    }


    /*
    |--------------------------------------------------------------------------
    | FINAL CTA
    |--------------------------------------------------------------------------
    */

    const cta =
      page.querySelector(
        '[data-afterword-cta]'
      );


    if (cta) {
      cta.style.opacity =
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
                  cta.animate(
                    [
                      {
                        opacity: 0,

                        transform:
                          'translateY(14px) scale(.97)',
                      },

                      {
                        opacity: 1,

                        transform:
                          'translateY(0) scale(1)',
                      },
                    ],

                    {
                      duration: 720,

                      delay: 160,

                      easing:
                        'cubic-bezier(.34,1.56,.64,1)',

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
  | SMALL DESKTOP CARD LIFT
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


  return html`
    <section
      ref=${pageRef}

      id="afterword"

      className="
        scene

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
            data-afterword-header
          >
            <span
              className="
                birthday-chip
              "
            >
              A TINY APPENDIX FOR THE CURIOUS GIRL
            </span>
          </div>


          <h2
            data-afterword-header

            className="
              section-title

              mt-5
            "
          >
            How this little world

            <br />

            <span
              className="
                text-gradient
              "
            >
              ended up looking like you.
            </span>
          </h2>


          <p
            data-afterword-header

            className="
              section-lead

              mx-auto

              mt-5

              max-w-2xl
            "
          >
            I did not pick a random “girlfriend birthday template.”
            Every weird little choice came from something I know you like.
          </p>

        </div>


        <!-- ================================= -->
        <!-- INSPIRATION CARDS -->
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
            inspirationNotes.map(
              (
                item
              ) => html`

                <article
                  key=${item.title}

                  data-afterword-card

                  className="
                    inspiration-card

                    p-6

                    will-change-transform
                  "

                  onPointerEnter=${handleCardEnter}

                  onPointerLeave=${handleCardLeave}
                >

                  <div
                    data-afterword-mark

                    className="
                      text-3xl
                    "
                  >
                    ${item.mark}
                  </div>


                  <h3
                    className="
                      mt-3

                      font-display

                      text-3xl

                      font-semibold

                      text-plum
                    "
                  >
                    ${item.title}
                  </h3>


                  <p
                    className="
                      mt-2

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
        <!-- IMAGE NOTE -->
        <!-- ================================= -->

        <div
          data-afterword-note

          className="
            mx-auto

            mt-10

            max-w-3xl

            rounded-[2rem]

            border

            border-purple-200

            bg-white/78

            p-6

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
            About the pictures I did not have:
          </p>


          <p
            className="
              mt-3

              text-sm

              leading-6

              text-purple-900/70
            "
          >
            For places like Fifth Gate or the tiny café,
            I used a clearly
            <strong>
              reimagined illustration
            </strong>
            instead of pretending an AI image was a real memory.
            Real photos stay real.
            Reimagined places are labeled as reimagined.
            I like it better that way.
          </p>

        </div>


        <!-- ================================= -->
        <!-- FINAL CTA -->
        <!-- ================================= -->

        <div
          data-afterword-cta

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
                'artifact'
              )
            }
          >
            okay… one last thing 💜

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
              id=${20}
      
              found=${found.has(
                20
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