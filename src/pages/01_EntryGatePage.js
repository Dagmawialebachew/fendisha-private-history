import { React, html } from '../lib/react.js';
import { config } from '../config.js';
import { playSfx } from '../lib/audio.js';

const breakCopy = [
  {
    eyebrow: 'THE GLASS HEART',
    title: 'Break into my heart.',
    body: 'Not metaphorically. I actually put something behind the glass. Three taps. Take your time.',
    note: 'yes fkr... I made your entrance unnecessarily dramatic 😂',
    cta: 'first tap',
  },
  {
    eyebrow: 'ONE OF THREE',
    title: 'It heard you.',
    body: 'A hairline fracture. Barely damage. Tap the same heart again.',
    note: 'okay... maybe do not enjoy this part too much 😂',
    cta: 'again',
  },
  {
    eyebrow: 'TWO OF THREE',
    title: 'Now it knows it is you.',
    body: 'The crack is spreading. One last tap, fkr.',
    note: 'I can already see the light getting out.',
    cta: 'one more',
  },
  {
    eyebrow: 'ACCESS: ALMOST YOURS',
    title: 'There you are.',
    body: 'I knew you would find your way in.',
    note: 'stay there for one second...',
    cta: '',
  },
];

const hintCopy = [
  {
    label: 'FIRST CLUE',
    body: 'Start with our first real date — the one that changed what “us” meant.',
    foot: 'Six digits. And no... I do not want them in the normal direction.',
  },
  {
    label: 'A LITTLE KINDER',
    body: 'November 25, 2025.',
    foot: '25 · 11 · 25. Same date... just look at it from the other side.',
  },
  {
    label: 'OKAY FKR 😭',
    body: 'Same six digits. Nothing new to remember.',
    foot: 'Think mirror: what happens to 25 · 11 · 25 when the direction flips?',
  },
  {
    label: 'BIRTHDAY PRIVILEGE',
    body: '521152',
    foot: 'okay enough 😂 I refuse to let six numbers keep u outside.',
  },
];

const particles = [
  { x: -94, y: -76, s: 7, d: 0, r: -18 },
  { x: -52, y: -112, s: 5, d: 55, r: 22 },
  { x: 18, y: -122, s: 6, d: 85, r: -8 },
  { x: 78, y: -86, s: 8, d: 35, r: 28 },
  { x: 108, y: -24, s: 5, d: 110, r: 14 },
  { x: 82, y: 54, s: 7, d: 70, r: -22 },
  { x: 22, y: 104, s: 5, d: 140, r: 12 },
  { x: -48, y: 92, s: 8, d: 95, r: -28 },
  { x: -104, y: 42, s: 5, d: 125, r: 18 },
  { x: -126, y: -18, s: 6, d: 45, r: -12 },
  { x: 46, y: -64, s: 4, d: 165, r: 0 },
  { x: -26, y: -54, s: 4, d: 185, r: 0 },
];


const celebrationPalette = [
  '#7f43a4',
  '#9d5cc1',
  '#b780dc',
  '#d58bd0',
  '#ec9fc8',
  '#f5c6df',
  '#efe2f8',
  '#ffffff',
];

const fallingConfetti = Array.from({ length: 84 }, (_, index) => {
  const lane = (index * 37) % 100;
  const depth = 0.72 + ((index * 13) % 40) / 100;
  const duration = 6.4 + ((index * 17) % 46) / 10;
  const delay = -(((index * 29) % 95) / 10);
  const drift = -34 + ((index * 41) % 69);
  const spin = -380 + ((index * 67) % 760);
  const size = 5 + ((index * 11) % 9);

  const kind = index % 13 === 0
    ? 'heart'
    : index % 9 === 0
      ? 'pearl'
      : index % 5 === 0
        ? 'ribbon'
        : 'paper';

  return {
    id: `fall-${index}`,
    left: `${lane}%`,
    depth,
    duration: `${duration}s`,
    delay: `${delay}s`,
    drift: `${drift}px`,
    spin: `${spin}deg`,
    size: `${size}px`,
    color: celebrationPalette[index % celebrationPalette.length],
    kind,
  };
});

const burstConfetti = Array.from({ length: 42 }, (_, index) => {
  const angle = (-152 + (index * 304) / 41) * (Math.PI / 180);
  const distance = 150 + ((index * 31) % 190);
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance - 40;
  const size = 6 + ((index * 7) % 10);

  return {
    id: `burst-${index}`,
    x: `${x.toFixed(1)}px`,
    y: `${y.toFixed(1)}px`,
    rotate: `${-220 + ((index * 79) % 520)}deg`,
    delay: `${(index % 8) * 22}ms`,
    size: `${size}px`,
    color: celebrationPalette[(index * 3) % celebrationPalette.length],

    kind:
      index % 11 === 0
        ? 'heart'
        : index % 7 === 0
          ? 'pearl'
          : index % 4 === 0
            ? 'ribbon'
            : 'paper',
  };
});


const experienceGuide = [
  {
    icon: '↓',
    title: 'Scroll slowly',
    text: 'some moments change while u move. no speed-running this 😂',
  },
  {
    icon: '○',
    title: 'Tap things',
    text: 'if something looks interesting, try it. I probably put it there for a reason.',
  },
  {
    icon: '♡',
    title: 'When I say HOLD',
    text: 'keep your finger or mouse down until it finishes. I will make it obvious.',
  },
  {
    icon: '♬',
    title: 'Keep the sound on',
    text: 'headphones if u can. some parts are meant to be heard, not just read.',
  },
];


export class EntryGatePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      breakStep: 0,

      stage:
        props.alreadyUnlocked
          ? 'return'
          : 'invitation',

      passcode: '',
      attempts: 0,
      status: '',
      burst: 0,
    };

    this.passcodeInput = null;
    this.stageTimer = null;
  }


  componentWillUnmount() {
    if (this.stageTimer) {
      clearTimeout(this.stageTimer);
    }
  }


  openInvitation = () => {
    playSfx(
      '/audio/sfx/heart-chime.wav',
      {
        volume: 0.2,
        playbackRate: 0.94,
      }
    );

    this.setState({
      stage: 'break',
    });
  };


  crack = () => {
    if (
      this.state.stage !== 'break' ||
      this.state.breakStep >= 3
    ) {
      return;
    }

    const next =
      this.state.breakStep + 1;

    const sfx =
      next === 1
        ? '/audio/sfx/glass-crack-1.wav'

        : next === 2
          ? '/audio/sfx/glass-crack-2.wav'

          : '/audio/sfx/glass-crack-3.wav';


    playSfx(
      sfx,
      {
        volume:
          next === 3
            ? 0.78
            : 0.62,

        playbackRate:
          next === 1
            ? 1.04

            : next === 2
              ? 0.99

              : 0.96,
      }
    );


    if (
      navigator.vibrate
    ) {
      navigator.vibrate(
        next === 3
          ? [12, 28, 18, 24]

          : next === 2
            ? [10, 18]

            : 10
      );
    }


    this.setState({
      breakStep: next,
      burst: Date.now(),
    });


    if (
      next === 3
    ) {
      this.stageTimer =
        setTimeout(
          () => {
            playSfx(
              '/audio/sfx/heart-chime.wav',
              {
                volume: 0.34,
                playbackRate: 0.92,
              }
            );


            this.setState(
              {
                stage: 'password',
              },

              () => {
                setTimeout(
                  () =>
                    this.passcodeInput?.focus(),
                  180
                );
              }
            );
          },

          1550
        );
    }
  };


  unlock = () => {
    const value =
      this.state.passcode.replace(
        /\D/g,
        ''
      );


    if (
      value.length !== 6
    ) {
      this.setState({
        status:
          'Six digits, fkr. That is all you need. 💜',
      });

      return;
    }


    if (
      value !== config.passcode
    ) {
      const attempts =
        Math.min(
          3,
          this.state.attempts + 1
        );


      playSfx(
        '/audio/sfx/glass-tap.wav',
        {
          volume: 0.28,
          playbackRate: 0.92,
        }
      );


      this.setState(
        {
          attempts,

          passcode: '',

          status:
            attempts === 1
              ? 'not that one 😂. same date though... just do not read it normally.'

              : attempts === 2
                ? 'u are basically there, fkr 😭. mirror. reverse the direction.'

                : 'okay enough mystery 😭 — birthday privilege is active.',
        },

        () => {
          setTimeout(
            () =>
              this.passcodeInput?.focus(),
            40
          );
        }
      );

      return;
    }


    playSfx(
      '/audio/sfx/heart-chime.wav',
      {
        volume: 0.42,
        playbackRate: 0.96,
      }
    );


    this.setState({
      status:
        'That is my Fendisha. 💜',
    });


    this.stageTimer =
      setTimeout(
        () => {
          this.setState(
            {
              stage: 'celebration',
              status: '',
            },

            () => {
              playSfx(
                '/audio/sfx/birthday-confetti-pop.wav',
                {
                  volume: 0.58,
                  playbackRate: 1,
                }
              );


              playSfx(
                '/audio/sfx/birthday-sparkle.wav',
                {
                  volume: 0.22,
                  playbackRate: 1,
                  delay: 230,
                }
              );
            }
          );
        },

        720
      );
  };


  scrollToExperienceGuide = () => {
    const guide =
      document.getElementById(
        'birthday-experience-guide'
      );

    if (guide) {
      guide.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };


  enterBirthdayRoom = () => {
    playSfx(
      '/audio/sfx/heart-chime.wav',
      {
        volume: 0.26,
        playbackRate: 1.02,
      }
    );

    this.props.onUnlock();
  };


  renderEscapingLight() {
    if (
      !this.state.breakStep
    ) {
      return null;
    }


    const count =
      this.state.breakStep === 1
        ? 3

        : this.state.breakStep === 2
          ? 7

          : particles.length;


    return html`
      <div
        key=${this.state.burst}

        className=${`
          escaping-light
          escaping-light-${this.state.breakStep}
        `}

        aria-hidden="true"
      >
        ${
          particles
            .slice(
              0,
              count
            )
            .map(
              (
                particle,
                index
              ) => html`
                <span
                  key=${`${this.state.burst}-${index}`}

                  className=${`
                    light-particle

                    ${
                      index % 4 === 0
                        ? 'light-heart'

                        : index % 3 === 0
                          ? 'light-petal'

                          : 'light-spark'
                    }
                  `}

                  style=${{
                    '--x':
                      `${particle.x}px`,

                    '--y':
                      `${particle.y}px`,

                    '--s':
                      `${particle.s}px`,

                    '--delay':
                      `${particle.d}ms`,

                    '--rotate':
                      `${particle.r}deg`,
                  }}
                ></span>
              `
            )
        }
      </div>
    `;
  }


  renderCrystalHeart() {
    const step =
      this.state.breakStep;


    return html`
      <div
        className=${`
          crystal-heart-wrap

          crack-${step}

          ${
            step === 3
              ? 'is-shattered'
              : ''
          }
        `}
      >
        <svg
          className="
            crystal-heart-svg
          "

          viewBox="
            0 0 320 300
          "

          role="img"

          aria-label=${
            step < 3
              ? 'Glass heart'
              : 'Broken glass heart'
          }
        >
          <defs>

            <linearGradient
              id="heartGlass"

              x1="0%"
              y1="0%"

              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"

                stopColor="
                  rgba(255,255,255,.92)
                "
              ></stop>


              <stop
                offset="28%"

                stopColor="
                  rgba(255,255,255,.42)
                "
              ></stop>


              <stop
                offset="62%"

                stopColor="
                  rgba(205,159,236,.34)
                "
              ></stop>


              <stop
                offset="100%"

                stopColor="
                  rgba(244,177,215,.48)
                "
              ></stop>
            </linearGradient>


            <linearGradient
              id="heartEdge"

              x1="0%"
              y1="0%"

              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"

                stopColor="
                  rgba(255,255,255,.96)
                "
              ></stop>


              <stop
                offset="48%"

                stopColor="
                  rgba(190,132,220,.42)
                "
              ></stop>


              <stop
                offset="100%"

                stopColor="
                  rgba(255,255,255,.80)
                "
              ></stop>
            </linearGradient>


            <radialGradient
              id="heartGlow"

              cx="42%"
              cy="38%"
              r="64%"
            >
              <stop
                offset="0%"

                stopColor="
                  rgba(255,255,255,.62)
                "
              ></stop>


              <stop
                offset="52%"

                stopColor="
                  rgba(227,191,248,.16)
                "
              ></stop>


              <stop
                offset="100%"

                stopColor="
                  rgba(199,123,215,0)
                "
              ></stop>
            </radialGradient>


            <filter
              id="heartShadow"

              x="-40%"
              y="-40%"

              width="180%"
              height="190%"
            >
              <feDropShadow
                dx="0"
                dy="22"

                stdDeviation="18"

                floodColor="#6f3b8e"

                floodOpacity=".18"
              ></feDropShadow>
            </filter>


            <filter
              id="fractureGlow"

              x="-80%"
              y="-80%"

              width="260%"
              height="260%"
            >
              <feGaussianBlur
                stdDeviation="1.1"

                result="blur"
              ></feGaussianBlur>


              <feMerge>
                <feMergeNode
                  in="blur"
                ></feMergeNode>

                <feMergeNode
                  in="SourceGraphic"
                ></feMergeNode>
              </feMerge>
            </filter>


            <clipPath
              id="heartClip"
            >
              <path
                d="
                  M160 276
                  C144 260 43 183 43 101
                  C43 54 75 24 116 24
                  C139 24 151 37 160 52
                  C169 37 181 24 204 24
                  C245 24 277 54 277 101
                  C277 183 176 260 160 276
                  Z
                "
              ></path>
            </clipPath>

          </defs>


          <g
            filter="
              url(#heartShadow)
            "
          >
            <path
              className="
                heart-body
              "

              d="
                M160 276
                C144 260 43 183 43 101
                C43 54 75 24 116 24
                C139 24 151 37 160 52
                C169 37 181 24 204 24
                C245 24 277 54 277 101
                C277 183 176 260 160 276
                Z
              "

              fill="
                url(#heartGlass)
              "

              stroke="
                url(#heartEdge)
              "

              strokeWidth="2.2"
            ></path>


            <path
              className="
                heart-inner-glow
              "

              d="
                M160 264
                C142 246 56 178 56 104
                C56 65 82 39 116 39
                C138 39 151 54 160 69
                C169 54 182 39 204 39
                C238 39 264 65 264 104
                C264 178 178 246 160 264
                Z
              "

              fill="
                url(#heartGlow)
              "
            ></path>


            <path
              className="
                heart-highlight
              "

              d="
                M87 67
                C101 47 127 44 143 61
                C126 60 110 71 99 88
                C91 101 87 114 86 129
              "

              fill="none"

              stroke="
                rgba(255,255,255,.78)
              "

              strokeWidth="7"

              strokeLinecap="round"
            ></path>


            <path
              className="
                heart-rim-light
              "

              d="
                M225 55
                C250 75 258 105 250 136
              "

              fill="none"

              stroke="
                rgba(255,255,255,.30)
              "

              strokeWidth="3"

              strokeLinecap="round"
            ></path>


            <text
              className="
                heart-engraving
              "

              x="160"

              y="160"

              textAnchor="middle"
            >
              D + F
            </text>

          </g>


          <g
            className="
              fractures
            "

            clipPath="
              url(#heartClip)
            "

            filter="
              url(#fractureGlow)
            "
          >
            <path
              className="
                fracture
                fracture-1
              "

              d="
                M160 55
                L153 84
                L165 103
                L151 127
                L160 150
              "
            ></path>


            <path
              className="
                fracture
                fracture-2
              "

              d="
                M153 84
                L134 94
                L118 115
              "
            ></path>


            <path
              className="
                fracture
                fracture-2
              "

              d="
                M165 103
                L188 92
                L207 98
              "
            ></path>


            <path
              className="
                fracture
                fracture-2
              "

              d="
                M151 127
                L130 143
                L118 164
              "
            ></path>


            <path
              className="
                fracture
                fracture-2
              "

              d="
                M160 150
                L181 170
                L203 174
              "
            ></path>


            <path
              className="
                fracture
                fracture-3
              "

              d="
                M118 115
                L96 130
                L83 151
                L60 163
              "
            ></path>


            <path
              className="
                fracture
                fracture-3
              "

              d="
                M207 98
                L232 113
                L251 138
                L270 145
              "
            ></path>


            <path
              className="
                fracture
                fracture-3
              "

              d="
                M118 164
                L102 188
                L76 208
              "
            ></path>


            <path
              className="
                fracture
                fracture-3
              "

              d="
                M181 170
                L170 198
                L182 223
                L160 271
              "
            ></path>


            <path
              className="
                fracture
                fracture-3
              "

              d="
                M203 174
                L229 189
                L245 210
              "
            ></path>
          </g>


          <g
            className="
              crystal-shards
            "

            clipPath="
              url(#heartClip)
            "

            aria-hidden="true"
          >

            <polygon
              className="
                crystal-shard
                shard-a
              "

              points="
                43,101
                57,55
                116,24
                153,84
                134,94
                96,130
                60,163
              "

              fill="
                url(#heartGlass)
              "
            ></polygon>


            <polygon
              className="
                crystal-shard
                shard-b
              "

              points="
                116,24
                160,52
                153,84
                165,103
                134,94
              "

              fill="
                url(#heartGlass)
              "
            ></polygon>


            <polygon
              className="
                crystal-shard
                shard-c
              "

              points="
                160,52
                204,24
                263,57
                277,101
                207,98
                188,92
                165,103
              "

              fill="
                url(#heartGlass)
              "
            ></polygon>


            <polygon
              className="
                crystal-shard
                shard-d
              "

              points="
                60,163
                96,130
                118,115
                151,127
                130,143
                118,164
                102,188
                76,208
                52,176
              "

              fill="
                url(#heartGlass)
              "
            ></polygon>


            <polygon
              className="
                crystal-shard
                shard-e
              "

              points="
                153,84
                165,103
                151,127
                160,150
                130,143
                118,115
                134,94
              "

              fill="
                url(#heartGlass)
              "
            ></polygon>


            <polygon
              className="
                crystal-shard
                shard-f
              "

              points="
                165,103
                188,92
                207,98
                270,145
                245,177
                203,174
                181,170
                160,150
                151,127
              "

              fill="
                url(#heartGlass)
              "
            ></polygon>


            <polygon
              className="
                crystal-shard
                shard-g
              "

              points="
                76,208
                102,188
                118,164
                130,143
                160,150
                137,207
                109,239
              "

              fill="
                url(#heartGlass)
              "
            ></polygon>


            <polygon
              className="
                crystal-shard
                shard-h
              "

              points="
                160,150
                181,170
                170,198
                182,223
                160,276
                137,207
              "

              fill="
                url(#heartGlass)
              "
            ></polygon>


            <polygon
              className="
                crystal-shard
                shard-i
              "

              points="
                181,170
                203,174
                245,177
                235,213
                196,248
                160,276
                182,223
                170,198
              "

              fill="
                url(#heartGlass)
              "
            ></polygon>

          </g>
        </svg>


        <div
          className="
            crystal-caustic
            crystal-caustic-a
          "

          aria-hidden="true"
        ></div>


        <div
          className="
            crystal-caustic
            crystal-caustic-b
          "

          aria-hidden="true"
        ></div>


        ${
          this.renderEscapingLight()
        }

      </div>
    `;
  }


  renderInvitation() {
    return html`
      <div
        className="
          entry-invitation

          mx-auto

          max-w-2xl

          text-center
        "
      >
        <p
          className="
            text-[10px]

            font-bold

            uppercase

            tracking-[.32em]

            text-purple-500

            sm:text-xs
          "
        >
          18 AUGUST 2026 · PRIVATE INVITATION
        </p>


        <h1
          className="
            mt-6

            font-display

            text-[clamp(4.6rem,13vw,8rem)]

            font-semibold

            leading-[.78]

            tracking-[-.06em]

            text-plum
          "
        >
          Twenty-One.
        </h1>


        <p
          className="
            mt-5

            font-display

            text-2xl

            italic

            text-purple-700

            sm:text-3xl
          "
        >
          Tonight belongs to you.
        </p>


        <p
          className="
            mx-auto

            mt-4

            max-w-lg

            text-sm

            leading-6

            text-purple-900/65

            sm:text-base
          "
        >
          I may have made your entrance a little unreasonable. Feels appropriate.
        </p>


        <div
          className="
            invitation-ticket

            mx-auto

            mt-8

            max-w-md
          "
        >
          <div
            className="
              invitation-ticket-inner
            "
          >
            <span
              className="
                invitation-kicker
              "
            >
              ADMIT ONE
            </span>

            <strong
              className="
                invitation-name
              "
            >
              My Fendisha 🍿
            </strong>

            <span
              className="
                invitation-sub
              "
            >
              one very loved birthday girl
            </span>
          </div>
        </div>


        <button
          type="button"

          className="
            primary-cta
            mt-7
          "

          onClick=${
            this.openInvitation
          }
        >
          open your invitation →
        </button>


        <p
          className="
            mt-4

            text-xs

            font-semibold

            text-purple-700/55
          "
        >
          headphones recommended · trust me.
        </p>

      </div>
    `;
  }


  renderReturn() {
    return html`
      <div
        className="
          mx-auto

          max-w-xl

          text-center

          entry-return
        "
      >
        <p
          className="
            text-[10px]

            font-bold

            uppercase

            tracking-[.30em]

            text-purple-500
          "
        >
          PRIVATE BIRTHDAY LETTER
        </p>


        <h1
          className="
            mt-5

            font-display

            text-[clamp(3.5rem,10vw,6.5rem)]

            font-semibold

            leading-[.82]

            tracking-[-.055em]

            text-plum
          "
        >
          You came back. 💜
        </h1>


        <p
          className="
            mx-auto

            mt-5

            max-w-md

            text-sm

            leading-6

            text-purple-900/70

            sm:text-base
          "
        >
          Good. I was hoping this would be the kind of thing you open more than once.
        </p>


        <button
          type="button"

          className="
            primary-cta
            mt-7
          "

          onClick=${
            this.props.onUnlock
          }
        >
          continue where the door opens →
        </button>

      </div>
    `;
  }


  renderPassword() {
    const hint =
      hintCopy[
        Math.min(
          this.state.attempts,
          hintCopy.length - 1
        )
      ];


    return html`
      <div
        className="
          mx-auto

          w-full

          max-w-xl

          text-left

          password-reveal
        "
      >
        <div
          className="
            password-card
          "
        >
          <div
            className="
              flex

              items-center

              gap-3
            "
          >
            <span
              className="
                password-mark
              "

              aria-hidden="true"
            >
              ♡
            </span>


            <div>
              <p
                className="
                  text-[10px]

                  font-bold

                  uppercase

                  tracking-[.24em]

                  text-purple-500
                "
              >
                ONE LAST LITTLE SECRET
              </p>


              <h1
                className="
                  mt-1

                  font-display

                  text-3xl

                  font-semibold

                  leading-none

                  text-plum

                  sm:text-4xl
                "
              >
                I need one memory from you.
              </h1>
            </div>
          </div>


          <div
            className="
              password-clue

              mt-6
            "
          >
            <p
              className="
                text-[10px]

                font-bold

                uppercase

                tracking-[.20em]

                text-purple-500
              "
            >
              ${hint.label}
            </p>


            <p
              className="
                mt-2

                font-display

                text-2xl

                italic

                leading-8

                text-plum

                sm:text-[1.75rem]
              "
            >
              ${hint.body}
            </p>


            <p
              className="
                mt-2

                text-xs

                font-semibold

                text-purple-700/55
              "
            >
              ${hint.foot}
            </p>
          </div>


          <label
            className="
              mt-6

              block

              text-sm

              font-bold

              text-plum
            "

            htmlFor="passcode"
          >
            Your six-digit memory
          </label>


          <div
            className="
              passcode-shell

              mt-3
            "
          >
            <input
              ref=${(
                element
              ) => {
                this.passcodeInput =
                  element;
              }}

              id="passcode"

              className="
                passcode-native
              "

              inputMode="numeric"

              pattern="[0-9]*"

              autoComplete="off"

              maxLength="6"

              value=${
                this.state.passcode
              }

              onInput=${(
                event
              ) =>
                this.setState({
                  passcode:
                    event.target.value
                      .replace(
                        /\D/g,
                        ''
                      )
                      .slice(
                        0,
                        6
                      ),

                  status: '',
                })
              }

              onKeyDown=${(
                event
              ) => {
                if (
                  event.key ===
                  'Enter'
                ) {
                  this.unlock();
                }
              }}

              aria-label="
                Enter the six digit memory code
              "
            />


            <div
              className="
                passcode-slots
              "

              aria-hidden="true"
            >
              ${
                [
                  0,
                  1,
                  2,
                  3,
                  4,
                  5,
                ].map(
                  (
                    index
                  ) => html`
                    <span
                      key=${
                        index
                      }

                      className=${`
                        passcode-slot

                        ${
                          this.state.passcode[
                            index
                          ]
                            ? 'is-filled'
                            : ''
                        }
                      `}
                    >
                      ${
                        this.state.passcode[
                          index
                        ] || ''
                      }
                    </span>
                  `
                )
              }
            </div>
          </div>


          <p
            className="
              mt-3

              min-h-6

              text-center

              text-sm

              font-semibold

              text-purple-700
            "
          >
            ${this.state.status}
          </p>


          <button
            type="button"

            className="
              primary-cta

              mt-2

              w-full
            "

            onClick=${
              this.unlock
            }

            disabled=${
              this.state.passcode.length !==
              6
            }
          >
            let me in 💜
          </button>


          ${
            this.state.attempts === 0
              ? html`
                  <p
                    className="
                      mt-4

                      text-center

                      text-xs

                      leading-5

                      text-purple-700/55
                    "
                  >
                    do not overthink it, fkr.
                    I am not letting a password
                    ruin your birthday 😂
                  </p>
                `
              : null
          }

        </div>
      </div>
    `;
  }


  renderCelebrationConfetti() {
    return html`
      <div
        className="
          birthday-confetti-dom
        "

        aria-hidden="true"
      >
        <div
          className="
            birthday-confetti-burst
          "
        >
          ${
            burstConfetti.map(
              (
                piece
              ) => html`
                <i
                  key=${
                    piece.id
                  }

                  className=${`
                    birthday-confetti-piece

                    burst-piece

                    is-${piece.kind}
                  `}

                  style=${{
                    '--x':
                      piece.x,

                    '--y':
                      piece.y,

                    '--r':
                      piece.rotate,

                    '--delay':
                      piece.delay,

                    '--size':
                      piece.size,

                    '--piece':
                      piece.color,
                  }}
                ></i>
              `
            )
          }
        </div>


        <div
          className="
            birthday-confetti-rain
          "
        >
          ${
            fallingConfetti.map(
              (
                piece
              ) => html`
                <i
                  key=${
                    piece.id
                  }

                  className=${`
                    birthday-confetti-piece

                    rain-piece

                    is-${piece.kind}
                  `}

                  style=${{
                    '--left':
                      piece.left,

                    '--depth':
                      piece.depth,

                    '--duration':
                      piece.duration,

                    '--delay':
                      piece.delay,

                    '--drift':
                      piece.drift,

                    '--r':
                      piece.spin,

                    '--size':
                      piece.size,

                    '--piece':
                      piece.color,
                  }}
                ></i>
              `
            )
          }
        </div>
      </div>
    `;
  }


  renderCelebration() {
    return html`
      <main
        className="
          birthday-celebration-page

          relative

          overflow-x-hidden
        "
      >
        ${
          this.renderCelebrationConfetti()
        }


        <div
          className="
            celebration-orb
            celebration-orb-a
          "

          aria-hidden="true"
        ></div>


        <div
          className="
            celebration-orb
            celebration-orb-b
          "

          aria-hidden="true"
        ></div>


        <div
          className="
            celebration-orb
            celebration-orb-c
          "

          aria-hidden="true"
        ></div>


        <section
          className="
            celebration-hero

            relative

            z-10

            flex

            min-h-[100svh]

            items-center

            justify-center

            px-4

            pb-28

            pt-12

            sm:px-6

            sm:pb-32
          "
        >
          <div
            className="
              mx-auto

              w-full

              max-w-5xl

              text-center
            "
          >
            <p
              className="
                celebration-kicker
              "
            >
              18 AUGUST 2026 · THE BIRTHDAY GIRL MADE IT IN
            </p>


            <div
              className="
                celebration-number-wrap
              "

              aria-label="
                Twenty one
              "
            >
              <span
                className="
                  celebration-number
                "
              >
                21
              </span>

              <span
                className="
                  celebration-number-glint
                "

                aria-hidden="true"
              ></span>
            </div>


            <p
              className="
                celebration-overline
              "
            >
              HAPPY 21ST BIRTHDAY
            </p>


            <h1
              className="
                celebration-name
              "
            >
              My Fendisha 🍿
            </h1>


            <p
              className="
                mx-auto

                mt-5

                max-w-xl

                font-display

                text-2xl

                italic

                leading-8

                text-purple-800/80

                sm:text-3xl
              "
            >
              Twenty-one looks very good on you already.
            </p>


            <p
              className="
                mt-3

                text-sm

                font-semibold

                text-purple-700/60

                sm:text-base
              "
            >
              yeah ik you've technically been 21 for like 4 seconds 😭
            </p>


            <div
              className="
                celebration-21-lights

                mx-auto

                mt-8
              "

              aria-label="
                Twenty one birthday lights
              "
            >
              ${
                Array.from(
                  {
                    length: 21,
                  },

                  (
                    _,
                    index
                  ) => html`
                    <span
                      key=${
                        index
                      }

                      className="
                        celebration-light-dot
                      "

                      style=${{
                        '--i':
                          index,
                      }}
                    ></span>
                  `
                )
              }
            </div>


            <p
              className="
                celebration-twentyone-line

                mt-4

                font-display

                text-lg

                italic

                text-purple-700/70

                sm:text-xl
              "
            >
              all twenty-one made it here.
            </p>
          </div>


          <button
            type="button"

            onClick=${
              this.scrollToExperienceGuide
            }

            className="
              absolute

              bottom-5

              left-1/2

              z-[70]

              flex

              -translate-x-1/2

              items-center

              gap-3

              whitespace-nowrap

              rounded-full

              border

              border-purple-200/80

              bg-white/95

              px-5

              py-3

              text-purple-800

              shadow-[0_18px_55px_rgba(92,46,120,.22)]

              backdrop-blur-xl

              transition

              duration-200

              hover:-translate-y-1

              hover:shadow-[0_22px_65px_rgba(92,46,120,.28)]

              focus:outline-none

              focus-visible:ring-4

              focus-visible:ring-purple-200

              sm:bottom-7

              sm:px-6

              sm:py-3.5
            "

            aria-label="
              Scroll to the quick guide
            "
          >
            <span
              className="
                flex

                h-8
                w-8

                items-center

                justify-center

                rounded-full

                bg-gradient-to-br

                from-purple-600

                to-pink-500

                text-lg

                font-bold

                text-white

                shadow-[0_8px_20px_rgba(147,51,234,.25)]

                animate-bounce
              "
            >
              ↓
            </span>


            <span
              className="
                text-left
              "
            >
              <span
                className="
                  block

                  text-[9px]

                  font-black

                  uppercase

                  tracking-[.22em]

                  text-purple-400
                "
              >
                DON'T STOP HERE 😂
              </span>


              <span
                className="
                  mt-0.5

                  block

                  text-xs

                  font-black

                  uppercase

                  tracking-[.14em]

                  text-purple-800

                  sm:text-sm
                "
              >
                keep going · scroll down
              </span>

            </span>
          </button>

        </section>


        <section
          id="
            birthday-experience-guide
          "

          className="
            relative

            z-10

            flex

            min-h-[90svh]

            scroll-mt-4

            items-center

            justify-center

            px-4

            py-16

            sm:px-6

            sm:py-20
          "
        >
          <div
            className="
              mx-auto

              w-full

              max-w-4xl
            "
          >
            <div
              className="
                overflow-hidden

                rounded-[2rem]

                border

                border-purple-200/70

                bg-white/90

                p-5

                shadow-[0_28px_90px_rgba(92,46,120,.14)]

                backdrop-blur-2xl

                sm:rounded-[2.5rem]

                sm:p-8

                md:p-10
              "
            >
              <div
                className="
                  mx-auto

                  max-w-2xl

                  text-center
                "
              >
                <div
                  className="
                    mx-auto

                    flex

                    h-12
                    w-12

                    items-center

                    justify-center

                    rounded-full

                    border

                    border-purple-200

                    bg-gradient-to-br

                    from-purple-50

                    to-pink-50

                    text-2xl

                    text-purple-600

                    shadow-[0_10px_30px_rgba(92,46,120,.10)]
                  "
                >
                  ♡
                </div>


                <p
                  className="
                    mt-5

                    text-[10px]

                    font-black

                    uppercase

                    tracking-[.28em]

                    text-purple-500

                    sm:text-xs
                  "
                >
                  ONE TINY THING BEFORE WE GO FURTHER
                </p>


                <h2
                  className="
                    mt-4

                    font-display

                    text-[clamp(2.8rem,8vw,5.4rem)]

                    font-semibold

                    leading-[.9]

                    tracking-[-.045em]

                    text-plum
                  "
                >
                  I'm with u through this whole thing.
                </h2>


                <p
                  className="
                    mx-auto

                    mt-5

                    max-w-xl

                    text-sm

                    leading-7

                    text-purple-900/70

                    sm:text-base
                  "
                >
                  fkr, u don't need to know how anything works.
                  If I want u to tap, hold, scroll, listen or do
                  something weird... I'll tell u right there.
                  Just follow me.
                </p>

              </div>


              <div
                className="
                  mt-8

                  grid

                  gap-3

                  sm:grid-cols-2

                  sm:gap-4
                "
              >
                ${
                  experienceGuide.map(
                    (
                      item
                    ) => html`
                      <div
                        key=${
                          item.title
                        }

                        className="
                          rounded-[1.5rem]

                          border

                          border-purple-100

                          bg-gradient-to-br

                          from-white

                          to-purple-50/60

                          p-4

                          text-left

                          shadow-[0_10px_28px_rgba(92,46,120,.06)]

                          sm:p-5
                        "
                      >
                        <div
                          className="
                            flex

                            items-start

                            gap-4
                          "
                        >
                          <span
                            className="
                              flex

                              h-10
                              w-10

                              shrink-0

                              items-center

                              justify-center

                              rounded-xl

                              bg-purple-100

                              text-lg

                              font-black

                              text-purple-700
                            "
                          >
                            ${item.icon}
                          </span>


                          <div>
                            <h3
                              className="
                                text-sm

                                font-black

                                text-purple-950

                                sm:text-base
                              "
                            >
                              ${item.title}
                            </h3>


                            <p
                              className="
                                mt-1

                                text-xs

                                leading-5

                                text-purple-800/65

                                sm:text-sm

                                sm:leading-6
                              "
                            >
                              ${item.text}
                            </p>
                          </div>

                        </div>
                      </div>
                    `
                  )
                }
              </div>


              <div
                className="
                  mt-6

                  rounded-[1.6rem]

                  border

                  border-purple-300/60

                  bg-gradient-to-br

                  from-purple-700

                  via-purple-600

                  to-pink-500

                  p-5

                  text-left

                  text-white

                  shadow-[0_20px_55px_rgba(126,68,176,.24)]

                  sm:p-6
                "
              >
                <div
                  className="
                    flex

                    items-start

                    gap-4
                  "
                >
                  <span
                    className="
                      flex

                      h-11
                      w-11

                      shrink-0

                      items-center

                      justify-center

                      rounded-full

                      bg-white/15

                      text-xl

                      backdrop-blur
                    "
                  >
                    💬
                  </span>


                  <div>
                    <p
                      className="
                        text-[9px]

                        font-black

                        uppercase

                        tracking-[.24em]

                        text-white/65

                        sm:text-[10px]
                      "
                    >
                      ONE REQUEST FROM ME
                    </p>


                    <h3
                      className="
                        mt-1

                        font-display

                        text-3xl

                        font-semibold

                        leading-none

                        sm:text-4xl
                      "
                    >
                      And tell me everything.
                    </h3>


                    <p
                      className="
                        mt-3

                        max-w-2xl

                        text-sm

                        leading-6

                        text-white/85

                        sm:text-base

                        sm:leading-7
                      "
                    >
                      what made u laugh, what u loved,
                      what confused u, what made u emotional...
                      literally everything. I wanna hear it all
                      when we talk 😂💜
                    </p>


                    <p
                      className="
                        mt-3

                        text-sm

                        font-black

                        text-white
                      "
                    >
                      deal? don't just say “it was nice” 😭
                    </p>

                  </div>
                </div>
              </div>


              <p
                className="
                  mt-5

                  text-center

                  text-xs

                  font-semibold

                  leading-5

                  text-purple-700/50
                "
              >
                and yeah... if I add more weird features later,
                I'll explain those too 😂
              </p>

            </div>
          </div>
        </section>


        <section
          className="
            celebration-message

            relative

            z-10

            flex

            min-h-[78svh]

            items-center

            justify-center

            px-4

            pb-20

            pt-12

            sm:px-6

            sm:pb-24
          "
        >
          <div
            className="
              celebration-message-card

              mx-auto

              w-full

              max-w-3xl

              text-center
            "
          >
            <p
              className="
                text-[10px]

                font-bold

                uppercase

                tracking-[.28em]

                text-purple-500

                sm:text-xs
              "
            >
              BEFORE EVERYTHING ELSE
            </p>


            <h2
              className="
                mt-5

                font-display

                text-[clamp(3.8rem,11vw,7.2rem)]

                font-semibold

                leading-[.82]

                tracking-[-.06em]

                text-plum
              "
            >
              today is yours.
            </h2>


            <p
              className="
                mt-5

                font-display

                text-2xl

                italic

                text-purple-700

                sm:text-3xl
              "
            >
              Not ours. Yours.
            </p>


            <p
              className="
                mx-auto

                mt-5

                max-w-xl

                text-sm

                leading-7

                text-purple-900/68

                sm:text-base
              "
            >
              Before the memories, the stupid moments, the places,
              the songs and everything else I hid in here...
              I want this part to be simple.
            </p>


            <p
              className="
                mx-auto

                mt-4

                max-w-lg

                font-display

                text-xl

                italic

                leading-7

                text-purple-800/78

                sm:text-2xl
              "
            >
              I'm really happy you exist.
              And I'm really happy I get to know this version of you.
            </p>


            <p
              className="
                mt-5

                text-sm

                font-semibold

                text-purple-700/64

                sm:text-base
              "
            >
              so just let me celebrate u properly
              for a little bit, fkr 💜
            </p>


            <div
              className="
                celebration-room-divider

                mx-auto

                mt-9
              "

              aria-hidden="true"
            >
              <span></span>

              <i>
                ♡
              </i>

              <span></span>
            </div>


            <p
              className="
                mt-8

                text-[10px]

                font-bold

                uppercase

                tracking-[.26em]

                text-purple-500
              "
            >
              NEXT
            </p>


            <h3
              className="
                mt-2

                font-display

                text-4xl

                font-semibold

                text-plum

                sm:text-5xl
              "
            >
              Your room is ready.
            </h3>


            <button
              type="button"

              className="
                primary-cta

                mt-7
              "

              onClick=${
                this.enterBirthdayRoom
              }
            >
              open your birthday room →
            </button>


            <p
              className="
                mt-4

                text-xs

                font-semibold

                text-purple-700/50
              "
            >
              take your time. nothing in here is in a hurry.
            </p>

          </div>
        </section>

      </main>
    `;
  }


  renderBreak() {
    const copy =
      breakCopy[
        this.state.breakStep
      ];


    return html`
      <div
        className="
          entry-break

          mx-auto

          flex

          max-w-2xl

          flex-col

          items-center

          text-center
        "
      >
        <p
          className="
            text-[10px]

            font-bold

            uppercase

            tracking-[.30em]

            text-purple-500

            sm:text-xs
          "
        >
          PRIVATE INVITATION · FOR MY FENDISHA 🍿
        </p>


        <p
          className="
            mt-3

            text-[10px]

            font-bold

            uppercase

            tracking-[.20em]

            text-purple-400
          "
        >
          ${copy.eyebrow}
        </p>


        <button
          id="break-heart"

          type="button"

          className="
            group

            mt-6

            rounded-full

            focus:outline-none

            focus-visible:ring-4

            focus-visible:ring-purple-300/40
          "

          onClick=${
            this.crack
          }

          aria-label=${
            this.state.breakStep < 3

              ? `Tap ${
                  3 -
                  this.state.breakStep
                } more time${
                  3 -
                    this.state.breakStep ===
                  1
                    ? ''
                    : 's'
                } to break the glass heart`

              : 'The glass heart is broken'
          }

          disabled=${
            this.state.breakStep >=
            3
          }
        >
          ${
            this.renderCrystalHeart()
          }
        </button>


        <h1
          className="
            mt-5

            font-display

            text-[clamp(2.9rem,8vw,5.5rem)]

            font-semibold

            leading-[.86]

            tracking-[-.05em]

            text-plum
          "
        >
          ${copy.title}
        </h1>


        <p
          className="
            mx-auto

            mt-4

            max-w-lg

            text-sm

            leading-6

            text-purple-900/68

            sm:text-base
          "
        >
          ${copy.body}
        </p>


        <p
          className="
            mt-3

            font-display

            text-lg

            italic

            text-purple-700/72
          "
        >
          ${copy.note}
        </p>


        ${
          this.state.breakStep < 3

            ? html`
                <button
                  type="button"

                  className="
                    primary-cta

                    mt-6
                  "

                  onClick=${
                    this.crack
                  }
                >
                  ${copy.cta}
                </button>
              `

            : html`
                <div
                  className="
                    mt-6

                    flex

                    items-center

                    gap-2

                    text-xs

                    font-bold

                    uppercase

                    tracking-[.18em]

                    text-purple-500/70
                  "
                >
                  <span
                    className="
                      entry-loader-dot
                    "
                  ></span>

                  opening what was behind it
                </div>
              `
        }


        <div
          className="
            mt-5

            flex

            items-center

            gap-2
          "

          aria-label="
            Three taps needed
          "
        >
          ${
            [
              1,
              2,
              3,
            ].map(
              (
                number
              ) => html`
                <span
                  key=${
                    number
                  }

                  className=${`
                    entry-progress-line

                    ${
                      this.state.breakStep >=
                      number
                        ? 'is-done'
                        : ''
                    }
                  `}
                ></span>
              `
            )
          }
        </div>


        <p
          className="
            mt-2

            text-[10px]

            font-bold

            uppercase

            tracking-[.18em]

            text-purple-400
          "
        >
          ${
            Math.min(
              this.state.breakStep,
              3
            )
          } / 3
        </p>

      </div>
    `;
  }


  render() {
    if (
      this.state.stage ===
      'celebration'
    ) {
      return this.renderCelebration();
    }


    return html`
      <main
        className="
          entry-gate

          relative

          flex

          min-h-[100svh]

          items-center

          justify-center

          overflow-hidden

          px-4

          py-8

          sm:px-6

          sm:py-10
        "
      >
        <div
          className="
            heart-aurora

            pointer-events-none

            absolute

            inset-0
          "
        ></div>


        <div
          className="
            entry-light

            entry-light-a
          "

          aria-hidden="true"
        ></div>


        <div
          className="
            entry-light

            entry-light-b
          "

          aria-hidden="true"
        ></div>


        <section
          className="
            relative

            z-10

            mx-auto

            w-full

            max-w-3xl
          "
        >
          <div
            className="
              paper-card

              entry-card

              overflow-hidden

              rounded-[2rem]

              p-5

              shadow-float

              sm:rounded-[3rem]

              sm:p-8

              md:p-10
            "
          >
            ${
              this.state.stage ===
              'return'

                ? this.renderReturn()

                : this.state.stage ===
                    'invitation'

                  ? this.renderInvitation()

                  : this.state.stage ===
                      'password'

                    ? this.renderPassword()

                    : this.renderBreak()
            }

          </div>
        </section>

      </main>
    `;
  }
}