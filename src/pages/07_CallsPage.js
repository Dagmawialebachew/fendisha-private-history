import { React, html } from '../lib/react.js';
import { media } from '../config.js';
import { AudioButton } from '../components/AudioButton.js';
import { SecretHeart } from '../components/SecretHeart.js';


export class CallsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: '01:59:57',

      ended: false,

      reconnecting: false,

      callCount: 1,

      quoteVisible: false,
    };


    this.timers = [];

    this.pageRef = null;

    this.phoneRef = null;
  }


  /*
  |--------------------------------------------------------------------------
  | LIFECYCLE
  |--------------------------------------------------------------------------
  */

  componentDidMount() {
    this.animateEntrance();

    this.startCountdown();
  }


  componentDidUpdate(
    prevProps,
    prevState
  ) {
    /*
    |--------------------------------------------------------------------------
    | PHONE REACTION WHEN ETHIO TELECOM ENDS THE CALL 😭
    |--------------------------------------------------------------------------
    */

    if (
      this.state.ended &&
      !prevState.ended
    ) {
      this.shakePhone();
    }
  }


  componentWillUnmount() {
    this.clearTimers();
  }


  /*
  |--------------------------------------------------------------------------
  | TIMER HELPERS
  |--------------------------------------------------------------------------
  */

  clearTimers = () => {
    this.timers.forEach(
      (
        timer
      ) => {
        clearTimeout(
          timer
        );
      }
    );


    this.timers = [];
  };


  queue = (
    callback,
    delay
  ) => {
    const timer =
      setTimeout(
        callback,
        delay
      );


    this.timers.push(
      timer
    );


    return timer;
  };


  /*
  |--------------------------------------------------------------------------
  | ORIGINAL TWO-HOUR JOKE
  |--------------------------------------------------------------------------
  |
  | 01:59:57
  | 01:59:58
  | 01:59:59
  |
  | ...and then Ethio Telecom decides we've spoken enough 😂
  |
  */

  startCountdown = () => {
    this.clearTimers();


    this.setState({
      timer:
        '01:59:57',

      ended:
        false,

      reconnecting:
        false,
    });


    this.queue(
      () => {
        this.setState({
          timer:
            '01:59:58',
        });
      },

      900
    );


    this.queue(
      () => {
        this.setState({
          timer:
            '01:59:59',
        });
      },

      1800
    );


    /*
      Tiny pause on 01:59:59.

      Makes the punchline land better.
    */

    this.queue(
      () => {
        this.setState({
          timer:
            'CALL ENDED',

          ended:
            true,
        });
      },

      2950
    );
  };


  /*
  |--------------------------------------------------------------------------
  | CALL AGAIN
  |--------------------------------------------------------------------------
  */

  callAgain = () => {
    if (
      !this.state.ended ||
      this.state.reconnecting
    ) {
      return;
    }


    this.clearTimers();


    const nextCall =
      this.state.callCount + 1;


    this.setState({
      callCount:
        nextCall,

      timer:
        'CALLING AGAIN...',

      ended:
        false,

      reconnecting:
        true,

      /*
        First redial unlocks the emotional part.
      */

      quoteVisible:
        true,
    });


    /*
      Let the little ringing state breathe
      before throwing us back toward 2 hours 😭
    */

    this.queue(
      () => {
        this.setState(
          {
            timer:
              '01:59:57',

            reconnecting:
              false,
          },

          () => {
            this.startCountdown();
          }
        );
      },

      1050
    );
  };


  /*
  |--------------------------------------------------------------------------
  | ENTRANCE
  |--------------------------------------------------------------------------
  */

  animateEntrance = () => {
    const page =
      this.pageRef;


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


    const pieces =
      page.querySelectorAll(
        '[data-call-reveal]'
      );


    pieces.forEach(
      (
        element,
        index
      ) => {
        element.animate(
          [
            {
              opacity:
                0,

              transform:
                'translateY(18px)',

              filter:
                'blur(4px)',
            },

            {
              opacity:
                1,

              transform:
                'translateY(0)',

              filter:
                'blur(0)',
            },
          ],

          {
            duration:
              700,

            delay:
              80 +
              index * 110,

            easing:
              'cubic-bezier(.18,.82,.22,1)',

            fill:
              'both',
          }
        );
      }
    );
  };


  /*
  |--------------------------------------------------------------------------
  | PHONE SHAKE
  |--------------------------------------------------------------------------
  */

  shakePhone = () => {
    if (
      !this.phoneRef
    ) {
      return;
    }


    const reduceMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;


    if (reduceMotion) {
      return;
    }


    this.phoneRef.animate(
      [
        {
          transform:
            'translateX(0) rotate(0deg)',
        },

        {
          transform:
            'translateX(-4px) rotate(-.4deg)',
        },

        {
          transform:
            'translateX(4px) rotate(.4deg)',
        },

        {
          transform:
            'translateX(-3px) rotate(-.25deg)',
        },

        {
          transform:
            'translateX(3px) rotate(.25deg)',
        },

        {
          transform:
            'translateX(0) rotate(0deg)',
        },
      ],

      {
        duration:
          430,

        easing:
          'ease-out',
      }
    );
  };


  /*
  |--------------------------------------------------------------------------
  | DYNAMIC PHONE COPY
  |--------------------------------------------------------------------------
  */

  getCallLabel() {
    if (
      this.state.reconnecting
    ) {
      return 'CALLING AGAIN...';
    }


    if (
      this.state.ended
    ) {
      return 'ETHIO TELECOM HAS SPOKEN 😭';
    }


    if (
      this.state.callCount > 1
    ) {
      return 'BACK ON THE PHONE';
    }


    return 'CALLING';
  }


  getCallNote() {
    if (
      this.state.reconnecting
    ) {
      return 'because obviously we were not done 😂';
    }


    if (
      this.state.callCount >= 3
    ) {
      return 'at this point Ethio Telecom was basically the third person in our relationship 😭';
    }


    if (
      this.state.callCount === 2
    ) {
      return 'call #2 · because clearly we learned nothing';
    }


    if (
      this.state.ended
    ) {
      return 'apparently two hours was enough according to one company.';
    }


    return 'the network is about to do what it always did...';
  }


  render() {
    const {
      onContinue,
      found,
      onFindHeart,
    } =
      this.props;


    const {
      timer,
      ended,
      reconnecting,
      callCount,
      quoteVisible,
    } =
      this.state;


    const callLabel =
      this.getCallLabel();


    const callNote =
      this.getCallNote();


    return html`
      <section
        ref=${(
          element
        ) => {
          this.pageRef =
            element;
        }}

        id="calls"

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

            grid

            max-w-6xl

            items-center

            gap-10

            lg:grid-cols-2
          "
        >

          <!-- ================================= -->
          <!-- LEFT SIDE -->
          <!-- ================================= -->

          <div>

            <div
              data-call-reveal
            >
              <span
                className="
                  birthday-chip
                "
              >
                NO PHOTO REQUIRED
              </span>
            </div>


            <h2
              data-call-reveal

              className="
                section-title

                mt-5
              "
            >
              Some of my favorite memories

              <br />

              <span
                className="
                  text-gradient
                "
              >
                were just your voice.
              </span>
            </h2>


            <p
              data-call-reveal

              className="
                section-lead

                mt-5
              "
            >
              Two hours. Call ends. One of us calls again
              immediately 😭. Then another two hours.
              Apparently Ethio Telecom had boundaries.
              We did not.
            </p>


            <!-- REAL VOICE -->

            <div
              data-call-reveal
            >
              <p
                className="
                  mt-7

                  text-[9px]

                  font-black

                  uppercase

                  tracking-[.20em]

                  text-purple-400
                "
              >
                ANYWAY... THIS IS WHERE I STOP JOKING FOR A SEC
              </p>


              <${AudioButton}
                src=${media.voiceCalls}

                className="
                  secondary-cta

                  mt-3
                "
              >
                ▶ I have something to say about these calls
              <//>
            </div>

          </div>


          <!-- ================================= -->
          <!-- PHONE -->
          <!-- ================================= -->

          <div
            data-call-reveal

            ref=${(
              element
            ) => {
              this.phoneRef =
                element;
            }}

            className="
              mx-auto

              w-full

              max-w-md

              rounded-[3rem]

              border

              border-purple-200/80

              bg-white/78

              p-4

              shadow-float

              backdrop-blur-2xl

              sm:p-6
            "
          >

            <div
              className="
                rounded-[2.3rem]

                bg-gradient-to-b

                from-purple-100

                via-pink-50

                to-white

                p-6

                text-center

                sm:p-8
              "
            >

              <!-- ================================= -->
              <!-- 🍿 CALL AVATAR -->
              <!-- ================================= -->

              <div
                className="
                  relative

                  mx-auto

                  h-20
                  w-20
                "
              >

                ${
                  reconnecting
                    ? html`
                        <span
                          className="
                            absolute

                            inset-0

                            rounded-full

                            bg-purple-300/30

                            animate-ping
                          "
                        ></span>


                        <span
                          className="
                            absolute

                            -inset-2

                            rounded-full

                            border

                            border-purple-300/40

                            animate-pulse
                          "
                        ></span>
                      `
                    : null
                }


                <div
                  className="
                    relative

                    z-10

                    grid

                    h-20
                    w-20

                    place-items-center

                    rounded-full

                    bg-gradient-to-br

                    from-purple-500

                    to-pink-400

                    text-3xl

                    text-white

                    shadow-purple
                  "
                >
                  🍿
                </div>

              </div>


              <!-- CALL STATUS -->

              <p
                className=${`
                  mt-5

                  text-xs

                  font-bold

                  uppercase

                  tracking-[.22em]

                  transition-colors

                  duration-300

                  ${
                    ended
                      ? 'text-pink-500'
                      : 'text-purple-500'
                  }
                `}
              >
                ${callLabel}
              </p>


              <!-- NAME -->

              <h3
                className="
                  mt-2

                  font-display

                  text-4xl

                  font-semibold

                  text-plum
                "
              >
                My Fendisha
              </h3>


              <!-- TIMER -->

              <p
                aria-live="polite"

                className=${`
                  mt-3

                  min-h-[1.5rem]

                  font-bold

                  tabular-nums

                  transition-all

                  duration-300

                  ${
                    ended
                      ? `
                        text-sm

                        tracking-[.14em]

                        text-pink-600
                      `
                      : reconnecting
                        ? `
                          text-xs

                          tracking-[.10em]

                          text-purple-600
                        `
                        : `
                          text-sm

                          text-purple-700
                        `
                  }
                `}
              >
                ${timer}
              </p>


              <!-- CALL NUMBER / JOKE -->

              <p
                className="
                  mx-auto

                  mt-2

                  min-h-[2.5rem]

                  max-w-[17rem]

                  text-[10px]

                  font-semibold

                  leading-5

                  text-purple-700/52
                "
              >
                ${callNote}
              </p>


              <!-- REDIAL BUTTON -->

              <button
  type="button"

  disabled=${!ended}

  onClick=${this.callAgain}

  className="
    mt-5

    rounded-full

    px-6
    py-3

    text-sm

    font-bold

    shadow-purple

    transition-all

    duration-300

    hover:-translate-y-0.5

    hover:shadow-[0_14px_34px_rgba(126,68,176,.30)]

    disabled:cursor-default
  "

  style=${{
    background:
      ended
        ? '#6f3b8e'
        : 'rgba(111,59,142,.16)',

    color:
      ended
        ? '#ffffff'
        : 'rgba(111,59,142,.48)',

    opacity:
      1,
  }}
>
  ${
    ended
      ? callCount >= 2
        ? 'call her AGAIN because why not 😂'
        : 'call her again obviously 😂'

      : reconnecting
        ? 'calling again...'

        : 'wait for it… 😂'
  }
</button>

            </div>


            <!-- ================================= -->
            <!-- QUOTE / TRUST MEMORY -->
            <!-- ================================= -->
            <!--
              Hidden until she actually redials once.

              Laugh first.
              Then quietly change the temperature.
            -->

            <div
              className="
                overflow-hidden

                transition-all

                duration-700
              "

              style=${{
                maxHeight:
                  quoteVisible
                    ? '430px'
                    : '0px',

                opacity:
                  quoteVisible
                    ? 1
                    : 0,

                transform:
                  quoteVisible
                    ? 'translateY(0)'
                    : 'translateY(10px)',

                marginTop:
                  quoteVisible
                    ? '1rem'
                    : '0rem',
              }}
            >

              <div
                className="
                  rounded-2xl

                  bg-pink-50

                  p-4

                  text-sm

                  leading-6

                  text-purple-900/75
                "
              >

                <p
                  className="
                    text-[9px]

                    font-black

                    uppercase

                    tracking-[.18em]

                    text-purple-500
                  "
                >
                  SOMETHING ELSE I REMEMBER FROM YOUR TEXT
                </p>


                <p
                  className="
                    mt-3

                    font-display

                    text-2xl

                    italic

                    leading-8

                    text-plum
                  "
                >
                  “I am taking off my bulletproof vest,
                  just so I can hug u better.” Jan,02,2026
                </p>


                <p
                  className="
                    mt-4

                    font-display

                    text-lg

                    italic

                    text-purple-800/80
                  "
                >
                  yeah... I remembered that one.
                </p>


                <p
                  className="
                    mt-2

                    text-xs

                    font-semibold

                    leading-5

                    text-purple-700/65
                  "
                >
                  Some things u say sound small in the moment
                  and then stay with me way longer than u
                  probably realize.
                </p>

              </div>
            </div>

          </div>

        </div>


        <!-- ================================= -->
        <!-- SECRET HEARTS -->
        <!-- ================================= -->

        <${SecretHeart}
          id=${7}

          found=${found.has(
            7
          )}

          onFind=${onFindHeart}

          className="
            left-[6%]

            bottom-[16%]
          "
        />


        <${SecretHeart}
          id=${8}

          found=${found.has(
            8
          )}

          onFind=${onFindHeart}

          className="
            right-[7%]

            top-[20%]
          "
        />


        <!-- ================================= -->
        <!-- NEXT -->
        <!-- ================================= -->

        <div
          className="
            mt-12

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
                'places'
              )
            }
          >
            take me around Addis

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

      </section>
    `;
  }
}