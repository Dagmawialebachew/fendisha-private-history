import { React, html } from '../lib/react.js';
import { media } from '../config.js';
import { AudioButton } from '../components/AudioButton.js';
import { SecretHeart } from '../components/SecretHeart.js';


export function DistancePage({
  onContinue,
  found,
  onFindHeart,
}) {
  const pageRef = React.useRef(null);
  const addisRef = React.useRef(null);
  const apologyRef = React.useRef(null);
  const specialSignalRef = React.useRef(null);
  const deliveryTimerRef = React.useRef(null);
  const resetTimerRef = React.useRef(null);

  const [sending, setSending] = React.useState(false);
  const [delivered, setDelivered] = React.useState(false);


  const prefersReducedMotion = () =>
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  /*
  |--------------------------------------------------------------------------
  | HARD RESET THE GATED SCENE SCROLL POSITION
  |--------------------------------------------------------------------------
  |
  | The blank area is almost certainly the scene gate keeping
  | the scrollTop from the page that was mounted before this one.
  |
  | So:
  | - no scrollIntoView()
  | - no smooth scrolling
  | - reset EVERY ancestor that can hold scroll
  | - reset document/window too
  | - do it before paint
  |
  */

  React.useLayoutEffect(() => {
    const page = pageRef.current;

    if (!page) return;


    const resetEverything = () => {
      /*
      | Browser/document scroll
      */

      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
        document.scrollingElement.scrollLeft = 0;
      }

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      window.scrollTo(0, 0);


      /*
      | Gated scene / nested scroll containers
      */

      let node = page.parentElement;

      while (node) {
        node.scrollTop = 0;
        node.scrollLeft = 0;

        node = node.parentElement;
      }
    };


    /*
    | Immediately — before browser paints.
    */

    resetEverything();


    /*
    | Again after layout settles.
    */

    const frame = requestAnimationFrame(() => {
      resetEverything();

      requestAnimationFrame(() => {
        resetEverything();
      });
    });


    /*
    | One final guard against mounting/layout changes.
    */

    resetTimerRef.current = setTimeout(
      resetEverything,
      80
    );


    return () => {
      cancelAnimationFrame(frame);

      clearTimeout(
        resetTimerRef.current
      );
    };
  }, []);


  /*
  |--------------------------------------------------------------------------
  | PAGE ENTRANCE
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    const page = pageRef.current;

    if (
      !page ||
      prefersReducedMotion()
    ) {
      return;
    }


    const animations = [];


    const reveals =
      page.querySelectorAll(
        '[data-distance-reveal]'
      );


    reveals.forEach(
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
              duration: 700,

              delay:
                70 +
                index * 90,

              easing:
                'cubic-bezier(.18,.82,.22,1)',

              fill:
                'both',
            }
          );


        animations.push(
          animation
        );
      }
    );


    /*
    | Addis + Gondar
    */

    const cities =
      page.querySelectorAll(
        '[data-distance-city]'
      );


    cities.forEach(
      (
        city,
        index
      ) => {
        animations.push(
          city.animate(
            [
              {
                opacity: 0,

                transform:
                  index === 0
                    ? 'translateX(-16px)'
                    : 'translateX(16px)',
              },

              {
                opacity: 1,

                transform:
                  'translateX(0)',
              },
            ],

            {
              duration: 720,

              delay:
                420 +
                index * 110,

              easing:
                'cubic-bezier(.18,.82,.22,1)',

              fill:
                'both',
            }
          )
        );
      }
    );


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
  | CLEANUP
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    return () => {
      clearTimeout(
        deliveryTimerRef.current
      );

      clearTimeout(
        resetTimerRef.current
      );
    };
  }, []);


  /*
  |--------------------------------------------------------------------------
  | SEND THE SPECIAL MESSAGE
  |--------------------------------------------------------------------------
  */

  const sendSignal = () => {
    if (
      sending ||
      delivered
    ) {
      return;
    }


    setSending(true);


    const signal =
      specialSignalRef.current;


    /*
    | The normal transmitter circles continue moving.
    |
    | This larger 💜 signal is only the special thing
    | she intentionally sends by pressing the button.
    */

    if (
      signal &&
      !prefersReducedMotion()
    ) {
      signal.animate(
        [
          {
            left: '100%',

            opacity: 0,

            transform:
              'translate(-50%, -50%) scale(.55)',
          },

          {
            left: '96%',

            opacity: 1,

            transform:
              'translate(-50%, -50%) scale(1)',

            offset: 0.08,
          },

          {
            left: '75%',

            opacity: 1,

            transform:
              'translate(-50%, -50%) scale(1)',

            offset: 0.28,
          },

          {
            left: '50%',

            opacity: 1,

            transform:
              'translate(-50%, -50%) scale(1.14)',

            offset: 0.52,
          },

          {
            left: '25%',

            opacity: 1,

            transform:
              'translate(-50%, -50%) scale(1)',

            offset: 0.75,
          },

          {
            left: '4%',

            opacity: 1,

            transform:
              'translate(-50%, -50%) scale(1)',

            offset: 0.93,
          },

          {
            left: '0%',

            opacity: 0,

            transform:
              'translate(-50%, -50%) scale(1.5)',
          },
        ],

        {
          duration: 1800,

          easing:
            'cubic-bezier(.22,.76,.22,1)',

          fill:
            'forwards',
        }
      );
    }


    if (
      navigator.vibrate
    ) {
      navigator.vibrate(
        [10, 60, 12]
      );
    }


    deliveryTimerRef.current =
      setTimeout(
        () => {
          setSending(false);
          setDelivered(true);


          requestAnimationFrame(() => {
            /*
            | Addis receives it.
            */

            if (
              addisRef.current &&
              !prefersReducedMotion()
            ) {
              addisRef.current.animate(
                [
                  {
                    transform:
                      'scale(1)',
                  },

                  {
                    transform:
                      'scale(1.12)',
                  },

                  {
                    transform:
                      'scale(.98)',
                  },

                  {
                    transform:
                      'scale(1)',
                  },
                ],

                {
                  duration:
                    620,

                  easing:
                    'cubic-bezier(.34,1.56,.64,1)',
                }
              );
            }


            /*
            | Then the message appears.
            */

            if (
              apologyRef.current &&
              !prefersReducedMotion()
            ) {
              apologyRef.current.animate(
                [
                  {
                    opacity:
                      0,

                    transform:
                      'translateY(16px) scale(.985)',

                    filter:
                      'blur(5px)',
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
                    820,

                  easing:
                    'cubic-bezier(.18,.82,.22,1)',
                }
              );
            }
          });
        },

        prefersReducedMotion()
          ? 100
          : 1690
      );
  };


  return html`
    <section
      ref=${pageRef}

      id="distance"

      className="
        scene

        relative

        m-0

        w-full

        overflow-hidden

        px-4

        pb-16
        pt-5

        sm:px-6
        sm:pb-20
        sm:pt-7
      "

      style=${{
        marginTop:
          '0px',

        paddingTop:
          '20px',

        verticalAlign:
          'top',

        minHeight:
          '100svh',
      }}
    >

      <!-- ================================= -->
      <!-- BACKGROUND -->
      <!-- ================================= -->

      <div
        aria-hidden="true"

        className="
          pointer-events-none

          absolute

          -left-40
          -top-20

          h-[30rem]
          w-[30rem]

          rounded-full

          bg-purple-200/20

          blur-[115px]
        "
      ></div>


      <div
        aria-hidden="true"

        className="
          pointer-events-none

          -right-40
          top-[22%]

          h-[30rem]
          w-[30rem]

          rounded-full

          bg-pink-200/20

          blur-[115px]
        "
      ></div>


      <!-- ================================= -->
      <!-- MAIN CARD -->
      <!-- ================================= -->

      <div
        className="
          relative

          mx-auto

          w-full

          max-w-5xl

          rounded-[3rem]

          border

          border-purple-200/70

          bg-white/72

          p-6

          shadow-float

          backdrop-blur-2xl

          sm:p-9

          md:p-11
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
            data-distance-reveal
          >
            <span
              className="
                birthday-chip
              "
            >
              ADDIS ↔ GONDAR
            </span>
          </div>


          <h2
            data-distance-reveal

            className="
              section-title

              mt-5
            "
          >
            Even when I go quiet,

            <br />

            <span
              className="
                text-gradient
              "
            >
              you still matter to me.
            </span>
          </h2>


          <p
            data-distance-reveal

            className="
              section-lead

              mx-auto

              mt-5

              max-w-2xl
            "
          >
            I’m not putting this here to make u sad
            on your birthday. I just understand something
            better now: silence can feel much louder
            to the person waiting on the other side.
          </p>

        </div>


        <!-- ================================= -->
        <!-- ROUTE -->
        <!-- ================================= -->

        <div
          data-distance-reveal

          className="
            distance-line

            mx-auto

            mt-10

            max-w-3xl
          "
        >

          <!-- ADDIS -->

          <div
            ref=${addisRef}

            data-distance-city

            className="
              distance-city
            "
          >

            <div
              className="
                grid

                h-12
                w-12

                place-items-center

                rounded-full

                border-2

                border-purple-400

                bg-white

                text-base

                shadow-[0_8px_24px_rgba(139,75,174,.14)]

                transition-all

                duration-500
              "
            >
              💜
            </div>


            <strong>
              ADDIS
            </strong>


            <small>
              My Fendisha
            </small>

          </div>


          <!-- ================================= -->
          <!-- TRANSMISSION LINE -->
          <!-- ================================= -->

          <div
            className="
              distance-thread
            "
          >


            <i
              aria-hidden="true"

              style=${{
                background:
                  '#ffffff',

                border:
                  '2px solid #a855f7',

                width:
                  '11px',

                height:
                  '11px',

                animationDuration:
                  '2.7s',

                animationTimingFunction:
                  'linear',

                animationIterationCount:
                  'infinite',

                animationDirection:
                  'reverse',

                animationDelay:
                  '0s',
              }}
            ></i>


            <!-- CONTINUOUS TRANSMITTER #2 -->

            <i
              aria-hidden="true"

              style=${{
                background:
                  '#ffffff',

                border:
                  '2px solid #a855f7',

                width:
                  '11px',

                height:
                  '11px',

                animationDuration:
                  '2.7s',

                animationTimingFunction:
                  'linear',

                animationIterationCount:
                  'infinite',

                animationDirection:
                  'reverse',

                animationDelay:
                  '-0.9s',
              }}
            ></i>


            <!-- CONTINUOUS TRANSMITTER #3 -->

            <i
              aria-hidden="true"

              style=${{
                background:
                  '#ffffff',

                border:
                  '2px solid #a855f7',

                width:
                  '11px',

                height:
                  '11px',

                animationDuration:
                  '2.7s',

                animationTimingFunction:
                  'linear',

                animationIterationCount:
                  'infinite',

                animationDirection:
                  'reverse',

                animationDelay:
                  '-1.8s',
              }}
            ></i>


            <!-- ================================= -->
            <!-- SPECIAL HEART SIGNAL -->
            <!-- ================================= -->

            <span
              ref=${specialSignalRef}

              aria-hidden="true"

              className="
                pointer-events-none

                absolute

                left-full
                top-1/2

                z-30

                grid

                h-9
                w-9

                -translate-x-1/2
                -translate-y-1/2

                place-items-center

                rounded-full

                border-2

                border-purple-500

                bg-white

                text-sm

                opacity-0

                shadow-[0_8px_28px_rgba(139,75,174,.30)]
              "
            >
              💜
            </span>

          </div>


          <!-- GONDAR -->

          <div
            data-distance-city

            className="
              distance-city
            "
          >

            <div
              className="
                grid

                h-12
                w-12

                place-items-center

                rounded-full

                border-2

                border-purple-400

                bg-white

                text-base

                shadow-[0_8px_24px_rgba(139,75,174,.14)]
              "
            >
              💜
            </div>


            <strong>
              GONDAR
            </strong>


            <small>
              Darion
            </small>

          </div>

        </div>


        <!-- ================================= -->
        <!-- TRUTH -->
        <!-- ================================= -->

        <div
          data-distance-reveal

          className="
            mx-auto

            mt-9

            max-w-2xl

            rounded-2xl

            bg-purple-50

            p-5

            text-center

            text-sm

            leading-6

            text-purple-900/75

            sm:p-6
          "
        >

          <p>
            In my head, needing space never meant
            I stopped loving u.
          </p>


          <p
            className="
              mt-2

              font-semibold

              text-plum
            "
          >
            But u don’t live inside my head.
            U only get what I show u.
          </p>

        </div>


        <!-- ================================= -->
        <!-- SEND BUTTON -->
        <!-- ================================= -->

        ${
          !delivered
            ? html`
                <div
                  data-distance-reveal

                  className="
                    mt-8

                    text-center
                  "
                >

                  <p
                    className="
                      font-display

                      text-xl

                      italic

                      text-purple-600
                    "
                  >
                    psst... yene Fendisha 👀
                  </p>


                  <p
                    className="
                      mt-1

                      text-[9px]

                      font-black

                      uppercase

                      tracking-[.20em]

                      text-purple-400
                    "
                  >
                    SOMETHING FROM MY SIDE IS WAITING FOR U
                  </p>


                  <button
                    type="button"

                    disabled=${sending}

                    onClick=${sendSignal}

                    className="
                      group

                      relative

                      mx-auto

                      mt-4

                      inline-flex

                      items-center

                      justify-center

                      gap-3

                      overflow-hidden

                      rounded-full

                      px-7
                      py-4

                      font-display

                      text-lg

                      font-semibold

                      italic

                      text-white

                      transition-all

                      duration-300

                      hover:-translate-y-1

                      hover:scale-[1.03]

                      focus:outline-none

                      focus-visible:ring-4

                      focus-visible:ring-purple-200

                      disabled:cursor-default

                      sm:px-8

                      sm:text-xl
                    "

                    style=${{
                      background:
                        'linear-gradient(135deg,#6d388a 0%,#914db1 54%,#b761a7 100%)',

                      boxShadow:
                        '0 18px 52px rgba(111,59,142,.27)',
                    }}
                  >

                    <!-- LIVE PULSE -->

                    ${
                      !sending
                        ? html`
                            <span
                              className="
                                absolute

                                inset-0

                                rounded-full

                                border

                                border-white/35

                                animate-pulse
                              "
                            ></span>
                          `
                        : null
                    }


                    <!-- SHINE -->

                    <span
                      aria-hidden="true"

                      className="
                        pointer-events-none

                        absolute

                        inset-y-0

                        -left-1/3

                        w-1/3

                        skew-x-[-18deg]

                        bg-white/20

                        transition-all

                        duration-700

                        group-hover:left-[120%]
                      "
                    ></span>


                    <!-- LITTLE WHITE TRANSMITTER -->

                    <span
                      className="
                        relative

                        z-10

                        grid

                        h-9
                        w-9

                        place-items-center

                        rounded-full

                        border-2

                        border-purple-200

                        bg-white

                        text-sm

                        shadow-sm
                      "
                    >
                      💜
                    </span>


                    <span
                      className="
                        relative

                        z-10
                      "
                    >
                      ${
                        sending
                          ? 'waittt... it’s coming 😭'
                          : 'fkr tap this... I sent u something'
                      }
                    </span>


                    ${
                      !sending
                        ? html`
                            <span
                              className="
                                relative

                                z-10

                                text-xl

                                transition-transform

                                duration-300

                                group-hover:-translate-x-1
                              "
                            >
                              ←
                            </span>
                          `
                        : null
                    }

                  </button>


                  <p
                    className="
                      mt-3

                      text-[10px]

                      font-semibold

                      text-purple-500/60
                    "
                  >
                    ${
                      sending
                        ? 'Gondar → Addis · delivering...'
                        : 'yes u actually have to touch it 😂'
                    }
                  </p>

                </div>
              `
            : null
        }


        <!-- ================================= -->
        <!-- DELIVERED MESSAGE -->
        <!-- ================================= -->

        ${
          delivered
            ? html`
                <div
                  ref=${apologyRef}

                  className="
                    mx-auto

                    mt-9

                    max-w-2xl
                  "
                >

                  <div
                    className="
                      rounded-[2rem]

                      border

                      border-purple-200/70

                      bg-gradient-to-br

                      from-white

                      via-purple-50/70

                      to-pink-50/80

                      p-6

                      text-center

                      shadow-[0_22px_65px_rgba(92,46,120,.11)]

                      sm:p-8
                    "
                  >

                    <div
                      className="
                        mx-auto

                        grid

                        h-12
                        w-12

                        place-items-center

                        rounded-full

                        border-2

                        border-purple-400

                        bg-white

                        text-xl

                        shadow-[0_0_0_8px_rgba(183,128,220,.10)]
                      "
                    >
                      💜
                    </div>


                    <p
                      className="
                        mt-5

                        text-[9px]

                        font-black

                        uppercase

                        tracking-[.22em]

                        text-purple-400
                      "
                    >
                      DELIVERED · ADDIS
                    </p>


                    <h3
                      className="
                        mt-3

                        font-display

                        text-3xl

                        font-semibold

                        text-plum

                        sm:text-4xl
                      "
                    >
                      And yeah...

                      <br />

                      I owe u a small sorry too.
                    </h3>


                    <div
                      className="
                        mx-auto

                        mt-5

                        max-w-xl

                        space-y-4

                        text-sm

                        leading-7

                        text-purple-900/72

                        sm:text-base
                      "
                    >

                      <p>
                        I’m sorry for the times my silence
                        made u feel like u had to guess
                        where u stood with me.
                      </p>


                      <p>
                        In my head it was just me needing
                        some space sometimes. But I understand
                        that from your side, silence can feel
                        completely different.
                      </p>


                      <p
                        className="
                          font-display

                          text-xl

                          italic

                          leading-7

                          text-plum

                          sm:text-2xl
                        "
                      >
                        U shouldn’t have to read my mind
                        just to know that u matter to me.
                      </p>


                      <p>
                        I’m not turning your birthday into
                        one huge apology letter 😭.
                        I just wanted to say that one properly.
                      </p>

                    </div>


                    <p
                      className="
                        mt-6

                        text-xs

                        font-semibold

                        leading-5

                        text-purple-600/60
                      "
                    >
                      and yes... instead of texting normally
                      I apparently built Gondar → Addis
                      emotional infrastructure 😂
                    </p>

                  </div>

                </div>
              `
            : null
        }


        <!-- ================================= -->
        <!-- AUDIO + NEXT -->
        <!-- ================================= -->

        <div
          data-distance-reveal

          className="
            mt-8

            flex

            flex-wrap

            justify-center

            gap-3
          "
        >

          <${AudioButton}
            src=${media.voiceDistance}
          >
            ▶ hear me say this properly
          <//>


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
                'faith'
              )
            }
          >
            keep going

            <span
              className="
                transition-transform

                duration-300

                group-hover:translate-x-1
              "
            >
              💜
            </span>

          </button>

        </div>

      </div>


      <${SecretHeart}
        id=${16}

        found=${found.has(
          16
        )}

        onFind=${onFindHeart}

        className="
          left-[6%]

          top-[34%]
        "
      />

    </section>
  `;
}