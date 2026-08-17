import { React, html } from '../lib/react.js';
import { config } from '../config.js';
import { HoldToOpen } from '../components/HoldToOpen.js';
import { SecretHeart } from '../components/SecretHeart.js';


/*
|--------------------------------------------------------------------------
| SMALL FINAL-PAGE ATMOSPHERE
|--------------------------------------------------------------------------
|
| Not Finale-level confetti.
| This is quieter: tiny hearts / stars / XXI dust.
|
*/

const FINAL_DUST = Array.from(
  { length: 28 },
  (_, index) => ({
    id: `final-dust-${index}`,

    symbol:
      ['✦', '♡', '·', '✧', '💜'][
        index % 5
      ],

    left:
      `${(index * 37) % 100}%`,

    top:
      `${8 + ((index * 29) % 86)}%`,

    size:
      8 + ((index * 11) % 13),

    duration:
      4.5 + ((index * 17) % 30) / 10,

    delay:
      -(((index * 19) % 45) / 10),
  })
);


export class ArtifactPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.pageRef = React.createRef();
    this.lockRef = React.createRef();
    this.revealRef = React.createRef();
    this.letterRef = React.createRef();
    this.callRef = React.createRef();
    this.restartRef = React.createRef();

    this.animations = [];
    this.revealTimers = [];
  }


  /*
  |--------------------------------------------------------------------------
  | MOTION
  |--------------------------------------------------------------------------
  */

  prefersReducedMotion = () => {
    return window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  };


  /*
  |--------------------------------------------------------------------------
  | INITIAL PAGE ENTRANCE
  |--------------------------------------------------------------------------
  */

  componentDidMount() {
    const page =
      this.pageRef.current;

    if (
      !page ||
      this.prefersReducedMotion()
    ) {
      return;
    }


    /*
    |--------------------------------------------------------------------------
    | GIANT XXI
    |--------------------------------------------------------------------------
    */

    const giantMark =
      page.querySelector(
        '[data-artifact-xxi]'
      );

    if (giantMark) {
      this.animations.push(
        giantMark.animate(
          [
            {
              opacity: 0,
              transform:
                'translate(-50%, -50%) scale(.82)',
              filter:
                'blur(12px)',
            },

            {
              opacity: 1,
              transform:
                'translate(-50%, -50%) scale(1)',
              filter:
                'blur(0)',
            },
          ],
          {
            duration: 1500,
            easing:
              'cubic-bezier(.16,.84,.22,1)',
            fill: 'both',
          }
        )
      );


      /*
      | Slow breathing after entrance.
      */

      this.revealTimers.push(
        setTimeout(() => {
          if (!giantMark) return;

          this.animations.push(
            giantMark.animate(
              [
                {
                  transform:
                    'translate(-50%, -50%) scale(1)',
                },

                {
                  transform:
                    'translate(-50%, -50%) scale(1.035)',
                },

                {
                  transform:
                    'translate(-50%, -50%) scale(1)',
                },
              ],
              {
                duration: 6000,
                iterations: Infinity,
                easing: 'ease-in-out',
              }
            )
          );
        }, 1600)
      );
    }


    /*
    |--------------------------------------------------------------------------
    | HEADER
    |--------------------------------------------------------------------------
    */

    const header =
      page.querySelectorAll(
        '[data-artifact-header]'
      );

    header.forEach(
      (element, index) => {
        this.animations.push(
          element.animate(
            [
              {
                opacity: 0,
                transform:
                  'translateY(20px)',
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
              duration: 800,
              delay:
                160 + index * 140,
              easing:
                'cubic-bezier(.18,.82,.22,1)',
              fill: 'both',
            }
          )
        );
      }
    );


    /*
    |--------------------------------------------------------------------------
    | LOCK CARD
    |--------------------------------------------------------------------------
    */

    if (this.lockRef.current) {
      this.animations.push(
        this.lockRef.current.animate(
          [
            {
              opacity: 0,
              transform:
                'translateY(30px) scale(.965)',
              filter:
                'blur(7px)',
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
            delay: 650,
            easing:
              'cubic-bezier(.18,.82,.22,1)',
            fill: 'both',
          }
        )
      );
    }
  }


  /*
  |--------------------------------------------------------------------------
  | AFTER OPEN
  |--------------------------------------------------------------------------
  */

  componentDidUpdate(prevProps, prevState) {
    if (
      !prevState.open &&
      this.state.open
    ) {
      this.animateOpenReveal();
    }
  }


  componentWillUnmount() {
    this.animations.forEach(
      animation => {
        try {
          animation.cancel();
        } catch {}
      }
    );

    this.revealTimers.forEach(
      timer => clearTimeout(timer)
    );
  }


  /*
  |--------------------------------------------------------------------------
  | UNLOCK COMPLETE
  |--------------------------------------------------------------------------
  */

  handleUnlock = () => {
    if (this.state.open) {
      return;
    }

    if (navigator.vibrate) {
      navigator.vibrate(
        [20, 45, 20, 80, 35]
      );
    }

    this.setState({
      open: true,
    });
  };


  /*
  |--------------------------------------------------------------------------
  | BIG REVEAL SEQUENCE
  |--------------------------------------------------------------------------
  */

  animateOpenReveal = () => {
    if (
      this.prefersReducedMotion()
    ) {
      return;
    }


    requestAnimationFrame(() => {
      const reveal =
        this.revealRef.current;

      if (reveal) {
        this.animations.push(
          reveal.animate(
            [
              {
                opacity: 0,
                transform:
                  'translateY(30px) scale(.96)',
                filter:
                  'blur(10px)',
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
              duration: 1150,
              easing:
                'cubic-bezier(.16,.84,.22,1)',
              fill: 'both',
            }
          )
        );
      }


      /*
      |--------------------------------------------------------------------------
      | AUTHORIZED
      |--------------------------------------------------------------------------
      */

      const authorized =
        reveal?.querySelector(
          '[data-authorized]'
        );

      if (authorized) {
        this.animations.push(
          authorized.animate(
            [
              {
                opacity: 0,
                transform:
                  'translateY(20px) scale(.8)',
                filter:
                  'blur(7px)',
              },

              {
                opacity: 1,
                transform:
                  'translateY(-2px) scale(1.06)',
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
              duration: 900,
              delay: 170,
              easing:
                'cubic-bezier(.34,1.56,.64,1)',
              fill: 'both',
            }
          )
        );
      }


      /*
      |--------------------------------------------------------------------------
      | OPEN IT NOW COPY
      |--------------------------------------------------------------------------
      */

      const copy =
        reveal?.querySelector(
          '[data-open-copy]'
        );

      if (copy) {
        this.animations.push(
          copy.animate(
            [
              {
                opacity: 0,
                transform:
                  'translateY(14px)',
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
              duration: 750,
              delay: 480,
              easing:
                'cubic-bezier(.18,.82,.22,1)',
              fill: 'both',
            }
          )
        );
      }


      /*
      |--------------------------------------------------------------------------
      | HANDWRITTEN LETTER
      |--------------------------------------------------------------------------
      */

      if (this.letterRef.current) {
        this.animations.push(
          this.letterRef.current.animate(
            [
              {
                opacity: 0,
                transform:
                  'translateY(60px) rotate(-4deg) scale(.9)',
                filter:
                  'blur(8px)',
              },

              {
                opacity: 1,
                transform:
                  'translateY(-7px) rotate(1deg) scale(1.02)',
                filter:
                  'blur(0)',
                offset: 0.76,
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
              duration: 1100,
              delay: 680,
              easing:
                'cubic-bezier(.18,.9,.22,1)',
              fill: 'both',
            }
          )
        );
      }


      /*
      |--------------------------------------------------------------------------
      | CALL CARD
      |--------------------------------------------------------------------------
      */

      if (this.callRef.current) {
        this.animations.push(
          this.callRef.current.animate(
            [
              {
                opacity: 0,
                transform:
                  'translateY(26px) scale(.975)',
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
              duration: 900,
              delay: 1100,
              easing:
                'cubic-bezier(.18,.82,.22,1)',
              fill: 'both',
            }
          )
        );
      }


      /*
      |--------------------------------------------------------------------------
      | RESTART CARD LAST
      |--------------------------------------------------------------------------
      */

      if (this.restartRef.current) {
        this.animations.push(
          this.restartRef.current.animate(
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
              duration: 800,
              delay: 1450,
              easing:
                'cubic-bezier(.18,.82,.22,1)',
              fill: 'both',
            }
          )
        );
      }
    });
  };


  /*
  |--------------------------------------------------------------------------
  | CALL
  |--------------------------------------------------------------------------
  */

  handleCallClick = event => {
    const {
      showToast,
    } = this.props;

    if (config.phone) {
      return;
    }

    event.preventDefault();

    showToast?.(
      'Add Darion’s phone number in src/config.js before deployment. The button is ready 💜'
    );
  };


  /*
  |--------------------------------------------------------------------------
  | START THE WHOLE EXPERIENCE AGAIN
  |--------------------------------------------------------------------------
  |
  | Best option:
  | Pass onRestart from the parent so the parent can reset:
  | - current scene
  | - found hearts
  | - entry state
  | - anything else
  |
  | If you have not wired onRestart yet,
  | this fallback resets the known current-scene key and reloads.
  |
  */

  restartExperience = () => {
    if (
      typeof this.props.onRestart ===
      'function'
    ) {
      this.props.onRestart();
      return;
    }


    try {
      localStorage.removeItem(
        'fendisha-current-scene'
      );
    } catch {}


    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });


    window.location.reload();
  };


  render() {
    const {
      found,
      onFindHeart,
    } = this.props;


    return html`
      <section
        ref=${this.pageRef}

        id="artifact"

        className="
          scene

          relative

          flex

          min-h-[100svh]

          items-center

          overflow-hidden

          px-4
          py-20

          sm:px-6
        "
      >

        <!-- ================================= -->
        <!-- FINAL ATMOSPHERE -->
        <!-- ================================= -->

        <div
          className="
            pointer-events-none

            absolute

            left-1/2
            top-1/2

            h-[38rem]
            w-[38rem]

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-purple-300/25

            blur-3xl
          "
        ></div>


        <!-- giant XXI -->

        <div
          data-artifact-xxi

          aria-hidden="true"

          className="
            pointer-events-none

            absolute

            left-1/2
            top-1/2

            -translate-x-1/2
            -translate-y-1/2

            select-none

            font-display

            text-[clamp(14rem,40vw,34rem)]

            font-semibold

            leading-none

            tracking-[-.09em]

            text-purple-200/20
          "
        >
          XXI
        </div>


        <!-- floating final dust -->

        <div
          aria-hidden="true"

          className="
            pointer-events-none

            absolute

            inset-0

            overflow-hidden
          "
        >

          ${
            FINAL_DUST.map(
              item => html`
                <span
                  key=${item.id}

                  className="
                    absolute

                    select-none

                    text-purple-400/30
                  "

                  style=${{
                    left: item.left,
                    top: item.top,

                    fontSize:
                      `${item.size}px`,

                    animation:
                      `
                        artifactFloat
                        ${item.duration}s
                        ease-in-out
                        ${item.delay}s
                        infinite
                        alternate
                      `,
                  }}
                >
                  ${item.symbol}
                </span>
              `
            )
          }

        </div>


        <!-- ================================= -->
        <!-- CONTENT -->
        <!-- ================================= -->

        <div
          className="
            relative

            z-10

            mx-auto

            w-full

            max-w-3xl

            text-center
          "
        >

          <!-- ================================= -->
          <!-- HEADER -->
          <!-- ================================= -->

          <div
            data-artifact-header
          >
            <span
              className="
                birthday-chip
              "
            >
              ARTIFACT XXI
            </span>
          </div>


          <h2
            data-artifact-header

            className="
              section-title

              mt-5
            "
          >
            The screen is done.

            <br />

            <span
              className="
                text-gradient
              "
            >
              The real thing is beside you.
            </span>
          </h2>


          <p
            data-artifact-header

            className="
              section-lead

              mx-auto

              mt-5

              max-w-xl
            "
          >
            If the package is near you,
            leave it closed for ten more seconds.
            Yes, I know you are touching it 😂
          </p>


          <!-- ================================= -->
          <!-- FINAL LOCK -->
          <!-- ================================= -->

          ${
            !this.state.open
              ? html`
                  <div
                    ref=${this.lockRef}

                    className="
                      mx-auto

                      mt-9

                      max-w-md

                      overflow-hidden

                      rounded-[2rem]

                      border

                      border-purple-200

                      bg-white/85

                      p-6

                      shadow-float

                      backdrop-blur-xl

                      sm:p-8
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
                      FINAL LOCK
                    </p>


                    <p
                      className="
                        mt-3

                        font-display

                        text-3xl

                        font-semibold

                        italic

                        text-plum
                      "
                    >
                      One last tiny bit of patience 😭
                    </p>


                    <p
                      className="
                        mx-auto

                        mt-4

                        max-w-sm

                        text-sm

                        leading-6

                        text-purple-900/65
                      "
                    >
                      <strong className="text-plum">
                        Press and keep holding
                      </strong>
                      the purple heart below.

                      Do not tap quickly.

                      <strong className="text-purple-700">
                        Keep holding until the ring fills all the way.
                      </strong>
                    </p>


                    <div
                      className="
                        mx-auto

                        my-5

                        h-px

                        w-16

                        bg-gradient-to-r

                        from-transparent

                        via-purple-300

                        to-transparent
                      "
                    ></div>


                    <p
                      className="
                        text-[10px]

                        font-bold

                        uppercase

                        tracking-[.18em]

                        text-purple-400
                      "
                    >
                      HOLD UNTIL AUTHORIZED
                    </p>


                    <div
                      className="
                        mt-6
                      "
                    >

                      <${HoldToOpen}
                        onComplete=${this.handleUnlock}
                      />

                    </div>


                    <p
                      className="
                        mt-5

                        text-xs

                        font-semibold

                        text-purple-500/55
                      "
                    >
                      yes... this website has one final security system 😂
                    </p>

                  </div>
                `
              : null
          }


          <!-- ================================= -->
          <!-- OPEN REVEAL -->
          <!-- ================================= -->

          ${
            this.state.open
              ? html`
                  <div
                    ref=${this.revealRef}

                    className="
                      mt-9

                      artifact-open-reveal
                    "
                  >

                    <!-- AUTHORIZED -->

                    <div
                      data-authorized

                      className="
                        mx-auto

                        inline-flex

                        items-center

                        gap-3

                        rounded-full

                        border

                        border-purple-200

                        bg-white/85

                        px-5
                        py-2

                        shadow-soft

                        backdrop-blur-xl
                      "
                    >
                      <span>
                        ✓
                      </span>

                      <span
                        className="
                          text-[10px]

                          font-black

                          uppercase

                          tracking-[.24em]

                          text-purple-600
                        "
                      >
                        AUTHORIZED
                      </span>

                      <span>
                        💜
                      </span>
                    </div>


                    <p
                      className="
                        mt-5

                        font-display

                        text-[clamp(3.8rem,9vw,6rem)]

                        font-semibold

                        italic

                        leading-[.86]

                        tracking-[-.05em]

                        text-plum
                      "
                    >
                      Open it

                      <span
                        className="
                          text-gradient
                        "
                      >
                        now.
                      </span>
                    </p>


                    <p
                      data-open-copy

                      className="
                        mx-auto

                        mt-5

                        max-w-lg

                        text-base

                        leading-7

                        text-purple-900/70
                      "
                    >
                      The handwritten letter inside
                      is the part I did not want
                      a screen to imitate.
                    </p>


                    <p
                      data-open-copy

                      className="
                        mx-auto

                        mt-3

                        max-w-md

                        font-display

                        text-2xl

                        italic

                        leading-8

                        text-purple-700
                      "
                    >
                      Some things should still
                      arrive in handwriting.
                    </p>


                    <!-- ================================= -->
                    <!-- LETTER -->
                    <!-- ================================= -->

                    <div
                      ref=${this.letterRef}

                      className="
                        relative

                        mx-auto

                        mt-8

                        max-w-lg
                      "
                    >

                      <div
                        aria-hidden="true"

                        className="
                          pointer-events-none

                          absolute

                          -inset-6

                          -z-10

                          rounded-[3rem]

                          bg-purple-200/20

                          blur-3xl
                        "
                      ></div>


                      <img
                        src="/media/photos/handwritten-letter.jpg"

                        alt="Darion's handwritten letter"

                        className="
                          w-full

                          rounded-[2rem]

                          shadow-float

                          ring-8

                          ring-white/60
                        "
                      />


                      <div
                        className="
                          absolute

                          -bottom-3
                          -right-2

                          rotate-[-4deg]

                          rounded-xl

                          bg-white

                          px-4
                          py-2

                          shadow-soft

                          sm:-right-5
                        "
                      >
                        <p
                          className="
                            font-display

                            text-lg

                            italic

                            text-plum
                          "
                        >
                          not generated.
                        </p>

                        <p
                          className="
                            text-[9px]

                            font-bold

                            uppercase

                            tracking-[.18em]

                            text-purple-400
                          "
                        >
                          actually written by Darion
                        </p>
                      </div>

                    </div>


                    <!-- ================================= -->
                    <!-- FINAL SECRET HEART -->
                    <!-- ================================= -->

                    <div
                      className="
                        mt-9
                      "
                    >

                      <${SecretHeart}
                        id=${21}

                        found=${found.has(
                          21
                        )}

                        onFind=${onFindHeart}

                        className="
                          static

                          inline-grid
                        "
                      />

                    </div>


                    <!-- ================================= -->
                    <!-- CALL ME -->
                    <!-- ================================= -->

                    <div
                      ref=${this.callRef}

                      className="
                        relative

                        mt-10

                        overflow-hidden

                        rounded-[2rem]

                        p-6

                        text-white

                        shadow-purple

                        sm:p-8
                      "

                      style=${{
                        background:
                          `
                            linear-gradient(
                              135deg,
                              #6f3b8e,
                              #9550b8 52%,
                              #cf6fa9
                            )
                          `,
                      }}
                    >

                      <!-- light sweep -->

                      <div
                        aria-hidden="true"

                        className="
                          pointer-events-none

                          absolute

                          -left-[35%]
                          top-0

                          h-full

                          w-[30%]

                          skew-x-[-18deg]

                          bg-white/12

                          animate-[artifactSweep_4.5s_ease-in-out_infinite]
                        "
                      ></div>


                      <p
                        className="
                          text-[9px]

                          font-black

                          uppercase

                          tracking-[.28em]

                          text-white/60
                        "
                      >
                        WEBSITE → REAL LIFE
                      </p>


                      <p
                        className="
                          mt-3

                          font-display

                          text-[clamp(3rem,7vw,4.8rem)]

                          italic

                          leading-none
                        "
                      >
                        Now call me.
                      </p>


                      <p
                        className="
                          mt-3

                          text-sm

                          text-white/80
                        "
                      >
                        Gondar is waiting on the other side.
                      </p>


                      <p
                        className="
                          mx-auto

                          mt-2

                          max-w-md

                          font-display

                          text-xl

                          italic

                          text-white/90
                        "
                      >
                        I have been hiding behind JavaScript
                        long enough 😂
                      </p>


                      <a
                        href=${config.phone
                          ? `tel:${config.phone}`
                          : '#'
                        }

                        onClick=${this.handleCallClick}

                        className="
                          group

                          relative

                          mt-6

                          inline-flex

                          min-h-12

                          items-center

                          justify-center

                          gap-2

                          overflow-hidden

                          rounded-full

                          bg-white

                          px-7
                          py-3

                          text-sm

                          font-bold

                          text-purple-700

                          shadow-soft

                          transition-all

                          duration-300

                          hover:-translate-y-1

                          hover:scale-[1.025]
                        "
                      >

                        <span
                          className="
                            text-lg
                          "
                        >
                          📞
                        </span>

                        Call Darion

                        <span>
                          💜
                        </span>

                      </a>

                    </div>


                    <!-- ================================= -->
                    <!-- THE END? -->
                    <!-- ================================= -->

                    <div
                      ref=${this.restartRef}

                      className="
                        mx-auto

                        mt-12

                        max-w-xl

                        border-t

                        border-purple-200/70

                        pt-10
                      "
                    >

                      <p
                        className="
                          text-[9px]

                          font-black

                          uppercase

                          tracking-[.3em]

                          text-purple-400
                        "
                      >
                        THE END?
                      </p>


                      <p
                        className="
                          mt-3

                          font-display

                          text-[clamp(2.6rem,6vw,4rem)]

                          font-semibold

                          italic

                          leading-none

                          text-plum
                        "
                      >
                        lol. technically.

                        <br />

                        <span
                          className="
                            text-gradient
                          "
                        >
                          But you can go back.
                        </span>
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
                        If u want to walk through
                        this ridiculous little world
                        again from the very beginning...
                        I apparently built that button too 😭
                      </p>


                      <!-- RESTART -->

                      <button
                        type="button"

                        onClick=${this.restartExperience}

                        className="
                          group

                          relative

                          mt-6

                          inline-flex

                          items-center

                          justify-center

                          gap-3

                          overflow-hidden

                          rounded-full

                          px-8
                          py-4

                          font-display

                          text-xl

                          font-semibold

                          italic

                          text-white

                          shadow-[0_20px_60px_rgba(111,59,142,.26)]

                          transition-all

                          duration-300

                          hover:-translate-y-1

                          hover:scale-[1.025]
                        "

                        style=${{
                          background:
                            `
                              linear-gradient(
                                135deg,
                                #6f3b8e,
                                #9a50b9,
                                #cf70a9
                              )
                            `,
                        }}
                      >

                        <span
                          className="
                            text-2xl

                            transition-transform

                            duration-700

                            group-hover:-rotate-[360deg]
                          "
                        >
                          ↺
                        </span>


                        start the whole thing again

                      </button>


                      <p
                        className="
                          mt-4

                          text-xs

                          font-semibold

                          text-purple-500/55
                        "
                      >
                        yes, all the way back 😭💜
                      </p>


                      <!-- tiny final signature -->

                      <div
                        className="
                          mt-10
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
                          Happy 21st, My Fendisha 🍿
                        </p>


                        <p
                          className="
                            mt-2

                            text-[9px]

                            font-black

                            uppercase

                            tracking-[.25em]

                            text-purple-400
                          "
                        >
                          BUILT WITH AN UNREASONABLE AMOUNT OF LOVE
                        </p>

                      </div>

                    </div>

                  </div>
                `
              : null
          }

        </div>


        <!-- ================================= -->
        <!-- LOCAL ANIMATION KEYFRAMES -->
        <!-- ================================= -->

        <style>
          ${`

            @keyframes artifactFloat {

              0% {
                transform:
                  translate3d(
                    0,
                    -5px,
                    0
                  )
                  rotate(-3deg);

                opacity: .18;
              }


              100% {
                transform:
                  translate3d(
                    0,
                    8px,
                    0
                  )
                  rotate(3deg);

                opacity: .48;
              }

            }


            @keyframes artifactSweep {

              0% {
                transform:
                  translateX(-40%)
                  skewX(-18deg);

                opacity: 0;
              }


              16% {
                opacity: .8;
              }


              42% {
                transform:
                  translateX(470%)
                  skewX(-18deg);

                opacity: 0;
              }


              100% {
                transform:
                  translateX(470%)
                  skewX(-18deg);

                opacity: 0;
              }

            }


            @media (
              prefers-reduced-motion:
              reduce
            ) {

              [style*="artifactFloat"],
              [style*="artifactSweep"] {
                animation: none !important;
              }

            }

          `}
        </style>

      </section>
    `;
  }
}