import { html } from '../lib/react.js';
import { playSfx } from '../lib/audio.js';

const MOODS = {
  smile: {
    order: '01',

    icon: '😂',

    label: 'make me smile',

    micro: 'safe choice... probably',

    eyebrow: 'OKAY. EASY ONE FIRST.',

    title: 'u asked for a smile. fine.',

    lead:
      'three tiny things I know are capable of getting that face out of u.',

    lines: [
      {
        tag: 'EXHIBIT A',

        text:
          'Your mad face is still one of my favorite faces. I know that is an extremely dangerous opinion to have 😭',
      },

      {
        tag: 'UNINVITED THIRD PARTY',

        text:
          'George Russell has somehow been allowed into my relationship and honestly I was never consulted about this.',
      },

      {
        tag: 'FUTURE PROBLEM',

        text:
          'And when the Mercedes eventually appears... I already know I am going to hear about it approximately 700 times 😂',
      },
    ],

    footer:
      'there. smile acquired. now behave.',

    continueLabel:
      'okayyy keep going',

    aura:
      'radial-gradient(circle at 16% 18%, rgba(251,207,232,.74), transparent 36%), radial-gradient(circle at 86% 78%, rgba(216,180,254,.52), transparent 38%)',

    glow:
      'rgba(236,72,153,.16)',
  },

  blush: {
    order: '02',

    icon: '🌷',

    label: 'make me blush',

    micro: 'u chose violence',

    eyebrow: 'YOU PICKED DANGER.',

    title:
      'okay... don’t act shy now.',

    lead:
      'u literally pressed the button. whatever happens next is on u.',

    lines: [
      {
        tag: 'ONE',

        text:
          'I really do notice your eyes. Probably more than I ever properly say out loud.',
      },

      {
        tag: 'TWO',

        text:
          'I like that you can look ridiculously pretty and somehow still make the whole moment feel comfortable instead of intimidating.',
      },

      {
        tag: 'THREE',

        text:
          'And yes... when you sing, I notice. Even when I am pretending to act completely normal about it.',
      },
    ],

    footer:
      'okay enough before this becomes embarrassing for both of us 💜',

    continueLabel:
      'before I say too much',

    aura:
      'radial-gradient(circle at 20% 18%, rgba(244,191,211,.72), transparent 34%), radial-gradient(circle at 84% 80%, rgba(192,132,252,.44), transparent 40%)',

    glow:
      'rgba(190,90,180,.16)',
  },

  emotional: {
    order: '03',

    icon: '🥹',

    label: 'make me emotional',

    micro:
      'u really pressed this?',

    eyebrow:
      'OH. U ACTUALLY CHOSE THIS.',

    title:
      'come here for a second.',

    lead:
      'I’ll keep it simple because the real version of this is bigger than a paragraph.',

    lines: [
      {
        tag: 'I NOTICE',

        text:
          'You love me in a way that makes me feel noticed even during the times I am terrible at explaining what is happening inside my head.',
      },

      {
        tag: 'I REMEMBER',

        text:
          'You have been around while I am still becoming the person I am trying to be... and I do not take that lightly.',
      },

      {
        tag: 'I WANT',

        text:
          'And I genuinely want really good things for you. Even the good things that have absolutely nothing to do with me.',
      },
    ],

    footer:
      'okay enough. it is literally your birthday and somehow YOU are crying 😂💜',

    continueLabel:
      'birthday mode again',

    aura:
      'radial-gradient(circle at 18% 22%, rgba(216,180,254,.70), transparent 36%), radial-gradient(circle at 84% 76%, rgba(251,207,232,.52), transparent 38%)',

    glow:
      'rgba(139,92,246,.16)',
  },
};

const MOOD_KEYS =
  Object.keys(MOODS);

const cardStyle = () => ({
  background:
    'linear-gradient(180deg, rgba(255,255,255,.88), rgba(255,255,255,.64))',

  boxShadow:
    '0 22px 70px rgba(74,39,95,.065)',
});

export function MoodChoicePage({
  mood,
  onMood,
  onContinue,
}) {
  const current =
    mood
      ? MOODS[mood]
      : null;

  const choose = (
    nextMood
  ) => {
    playSfx(
      '/audio/sfx/mood-sparkle.wav',

      {
        volume:
          0.34,

        playbackRate:
          nextMood ===
          'smile'
            ? 1.05
            : nextMood ===
                'emotional'
              ? 0.90
              : 0.98,
      }
    );

    onMood(
      nextMood
    );
  };

  const resetMood = () => {
    playSfx(
      '/audio/sfx/mood-sparkle.wav',

      {
        volume:
          0.14,

        playbackRate:
          1.03,
      }
    );

    onMood(
      null
    );
  };

  return html`
    <section
      id="mood-choice"

      className="
        relative

        min-h-[100svh]

        overflow-hidden

        bg-[#fffafd]

        px-4
        py-12

        sm:px-6
        sm:py-16

        lg:px-8
        lg:py-20
      "
    >
      <!-- BACKGROUND -->

      <div
        className="
          pointer-events-none

          absolute

          inset-0
        "

        style=${{
          background:
            'radial-gradient(circle at 8% 18%, rgba(245,198,223,.28), transparent 30%), radial-gradient(circle at 92% 12%, rgba(183,128,220,.16), transparent 27%), radial-gradient(circle at 70% 92%, rgba(251,207,232,.20), transparent 30%), linear-gradient(180deg,#fffafd 0%,#fff9fc 60%,#fcf7ff 100%)',
        }}
      ></div>

      <!-- TOP HAIRLINE -->

      <div
        className="
          pointer-events-none

          absolute

          left-1/2
          top-0

          h-px

          w-[76vw]
          max-w-6xl

          -translate-x-1/2

          bg-gradient-to-r

          from-transparent
          via-purple-200/80
          to-transparent
        "
      ></div>

      <!-- MAIN -->

      <div
        className="
          relative

          z-10

          mx-auto

          flex

          min-h-[calc(100svh-6rem)]

          w-full
          max-w-6xl

          flex-col

          justify-center
        "
      >
        ${
          !current
            ? html`

                <!-- ============================== -->
                <!-- INITIAL STATE -->
                <!-- ============================== -->

                <div
                  className="
                    grid

                    items-center

                    gap-10

                    lg:grid-cols-[.88fr_1.12fr]

                    lg:gap-14
                  "
                >

                  <!-- LEFT EDITORIAL -->

                  <header
                    className="
                      max-w-xl
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
                          h-px

                          w-9

                          bg-purple-200
                        "
                      ></span>

                      <p
                        className="
                          text-[8px]

                          font-black

                          uppercase

                          tracking-[.32em]

                          text-purple-500
                        "
                      >
                        YOUR TURN
                      </p>
                    </div>

                    <h1
                      className="
                        mt-6

                        font-display

                        text-[clamp(3.6rem,7vw,7rem)]

                        font-semibold

                        leading-[.78]

                        tracking-[-.065em]

                        text-[#4a275f]
                      "
                    >
                      pick your

                      <span
                        className="
                          mt-2

                          block

                          bg-gradient-to-r

                          from-purple-600
                          via-fuchsia-500
                          to-pink-500

                          bg-clip-text

                          text-transparent
                        "
                      >
                        version

                        <br />

                        of me.
                      </span>
                    </h1>

                    <p
                      className="
                        mt-7

                        max-w-md

                        text-sm

                        leading-6

                        text-purple-950/58

                        sm:text-[15px]
                      "
                    >
                      u get me for the next minute.
                      choose what kind 😭
                    </p>

                    <div
                      className="
                        mt-8

                        flex

                        items-center

                        gap-3

                        text-[8px]

                        font-black

                        uppercase

                        tracking-[.16em]

                        text-purple-400
                      "
                    >
                      <span
                        className="
                          h-1.5

                          w-1.5

                          rounded-full

                          bg-purple-400
                        "
                      ></span>

                      one tap · no wrong answer
                    </div>
                  </header>

                  <!-- RIGHT MOOD MENU -->

                  <div
                    className="
                      space-y-3
                    "
                  >
                    ${MOOD_KEYS.map(
                      (
                        key
                      ) => {
                        const item =
                          MOODS[key];

                        return html`
                          <button
                            key=${key}

                            type="button"

                            onClick=${() =>
                              choose(
                                key
                              )
                            }

                            className="
                              group

                              relative

                              w-full

                              overflow-hidden

                              rounded-[1.75rem]

                              border
                              border-white/90

                              p-5

                              text-left

                              transition-all

                              duration-500

                              hover:-translate-y-1

                              hover:border-purple-200/80

                              focus:outline-none

                              focus-visible:ring-4

                              focus-visible:ring-purple-200/60

                              sm:p-6
                            "

                            style=${cardStyle()}
                          >
                            <!-- HOVER AURA -->

                            <div
                              className="
                                pointer-events-none

                                absolute

                                inset-0

                                opacity-0

                                transition-opacity

                                duration-500

                                group-hover:opacity-100
                              "

                              style=${{
                                background:
                                  item.aura,
                              }}
                            ></div>

                            <div
                              className="
                                relative

                                z-10

                                grid

                                items-center

                                gap-4

                                sm:grid-cols-[54px_1fr_auto]
                              "
                            >
                              <!-- NUMBER -->

                              <div
                                className="
                                  font-display

                                  text-[11px]

                                  font-semibold

                                  tracking-[.16em]

                                  text-purple-400
                                "
                              >
                                ${item.order}
                              </div>

                              <!-- TITLE -->

                              <div>
                                <p
                                  className="
                                    text-[8px]

                                    font-black

                                    uppercase

                                    tracking-[.2em]

                                    text-purple-400
                                  "
                                >
                                  ${item.micro}
                                </p>

                                <h2
                                  className="
                                    mt-2

                                    font-display

                                    text-[2rem]

                                    font-semibold

                                    leading-[.92]

                                    tracking-[-.04em]

                                    text-[#4a275f]

                                    sm:text-[2.45rem]
                                  "
                                >
                                  ${item.label}
                                </h2>
                              </div>

                              <!-- ICON + ARROW -->

                              <div
                                className="
                                  flex

                                  items-center

                                  justify-between

                                  gap-4

                                  sm:justify-end
                                "
                              >
                                <span
                                  className="
                                    text-4xl

                                    transition-transform

                                    duration-500

                                    group-hover:scale-110

                                    group-hover:-rotate-3

                                    sm:text-5xl
                                  "
                                >
                                  ${item.icon}
                                </span>

                                <span
                                  className="
                                    grid

                                    h-9
                                    w-9

                                    place-items-center

                                    rounded-full

                                    border
                                    border-purple-100

                                    bg-white/72

                                    text-sm

                                    text-purple-500

                                    transition-all

                                    duration-300

                                    group-hover:translate-x-1

                                    group-hover:border-purple-200

                                    group-hover:bg-white
                                  "
                                >
                                  →
                                </span>
                              </div>
                            </div>
                          </button>
                        `;
                      }
                    )}
                  </div>
                </div>
              `

            : html`

                <!-- ============================== -->
                <!-- SELECTED STATE -->
                <!-- ============================== -->

                <div
                  className="
                    w-full
                  "
                >
                  <!-- TOP CONTROLS -->

                  <div
                    className="
                      mb-4

                      flex

                      flex-wrap

                      items-center

                      justify-between

                      gap-3
                    "
                  >
                    <button
                      type="button"

                      onClick=${resetMood}

                      className="
                        inline-flex

                        items-center

                        gap-2

                        rounded-full

                        border
                        border-purple-100

                        bg-white/70

                        px-4
                        py-2.5

                        text-[8px]

                        font-black

                        uppercase

                        tracking-[.16em]

                        text-purple-600

                        backdrop-blur-xl

                        transition

                        hover:-translate-y-0.5

                        hover:bg-white
                      "
                    >
                      ← choose another
                    </button>

                    <!-- QUICK SWITCH -->

                    <div
                      className="
                        flex

                        items-center

                        gap-2
                      "
                    >
                      ${MOOD_KEYS.map(
                        (
                          key
                        ) => {
                          const item =
                            MOODS[key];

                          const selected =
                            key ===
                            mood;

                          return html`
                            <button
                              key=${key}

                              type="button"

                              onClick=${() =>
                                choose(
                                  key
                                )
                              }

                              className=${`
                                inline-flex

                                items-center

                                gap-2

                                rounded-full

                                border

                                px-3
                                py-2

                                text-[8px]

                                font-black

                                uppercase

                                tracking-[.12em]

                                transition-all

                                ${
                                  selected
                                    ? `
                                      border-purple-200

                                      bg-purple-100/90

                                      text-purple-700
                                    `
                                    : `
                                      border-purple-100

                                      bg-white/60

                                      text-purple-400

                                      hover:bg-white

                                      hover:text-purple-600
                                    `
                                }
                              `}
                            >
                              <span>
                                ${item.icon}
                              </span>

                              <span
                                className="
                                  hidden

                                  sm:inline
                                "
                              >
                                ${item.order}
                              </span>
                            </button>
                          `;
                        }
                      )}
                    </div>
                  </div>

                  <!-- MAIN EXPERIENCE -->

                  <div
                    className="
                      grid

                      overflow-hidden

                      rounded-[2.2rem]

                      border
                      border-white/90

                      bg-white/78

                      shadow-[0_32px_110px_rgba(74,39,95,.11)]

                      backdrop-blur-2xl

                      lg:grid-cols-[.78fr_1.22fr]
                    "
                  >

                    <!-- LEFT MOOD COVER -->

                    <aside
                      className="
                        relative

                        overflow-hidden

                        p-6

                        sm:p-8

                        lg:min-h-[620px]

                        lg:p-10
                      "
                    >
                      <div
                        className="
                          pointer-events-none

                          absolute

                          inset-0
                        "

                        style=${{
                          background:
                            current.aura,
                        }}
                      ></div>

                      <div
                        className="
                          relative

                          z-10

                          flex

                          h-full

                          min-h-[380px]

                          flex-col

                          justify-between

                          lg:min-h-[540px]
                        "
                      >
                        <div>
                          <div
                            className="
                              flex

                              items-center

                              justify-between

                              gap-4
                            "
                          >
                            <p
                              className="
                                text-[8px]

                                font-black

                                uppercase

                                tracking-[.22em]

                                text-purple-500
                              "
                            >
                              YOUR PICK
                            </p>

                            <span
                              className="
                                font-display

                                text-sm

                                tracking-[.12em]

                                text-purple-400
                              "
                            >
                              ${current.order} / 03
                            </span>
                          </div>

                          <div
                            className="
                              mt-10

                              text-6xl

                              sm:text-7xl
                            "
                          >
                            ${current.icon}
                          </div>

                          <p
                            className="
                              mt-8

                              text-[8px]

                              font-black

                              uppercase

                              tracking-[.22em]

                              text-purple-500
                            "
                          >
                            ${current.micro}
                          </p>

                          <h2
                            className="
                              mt-3

                              max-w-sm

                              font-display

                              text-[clamp(3.1rem,5vw,5.5rem)]

                              font-semibold

                              leading-[.82]

                              tracking-[-.06em]

                              text-[#4a275f]
                            "
                          >
                            ${current.label}
                          </h2>
                        </div>

                        <p
                          className="
                            max-w-sm

                            text-sm

                            leading-6

                            text-purple-950/58
                          "
                        >
                          ${current.lead}
                        </p>
                      </div>
                    </aside>

                    <!-- RIGHT LETTER -->

                    <article
                      className="
                        relative

                        border-t
                        border-purple-100/70

                        bg-white/88

                        p-6

                        sm:p-8

                        lg:border-l

                        lg:border-t-0

                        lg:p-10
                      "
                    >
                      <div
                        className="
                          pointer-events-none

                          absolute

                          -right-16

                          -top-16

                          h-56
                          w-56

                          rounded-full

                          blur-3xl
                        "

                        style=${{
                          background:
                            current.glow,
                        }}
                      ></div>

                      <div
                        className="
                          relative

                          z-10
                        "
                      >
                        <!-- HEADER -->

                        <div
                          className="
                            flex

                            items-start

                            justify-between

                            gap-6

                            border-b

                            border-purple-100/70

                            pb-6
                          "
                        >
                          <div>
                            <p
                              className="
                                text-[8px]

                                font-black

                                uppercase

                                tracking-[.23em]

                                text-purple-500
                              "
                            >
                              ${current.eyebrow}
                            </p>

                            <h3
                              className="
                                mt-3

                                max-w-xl

                                font-display

                                text-[clamp(2.5rem,4vw,4.5rem)]

                                font-semibold

                                leading-[.88]

                                tracking-[-.055em]

                                text-[#4a275f]
                              "
                            >
                              ${current.title}
                            </h3>
                          </div>

                          <span
                            className="
                              hidden

                              font-display

                              text-xs

                              italic

                              text-purple-400

                              sm:block
                            "
                          >
                            from Darion
                          </span>
                        </div>

                        <!-- LINES -->

                        <div
                          className="
                            mt-1
                          "
                        >
                          ${current.lines.map(
                            (
                              line
                            ) => html`
                              <div
                                key=${line.tag}

                                className="
                                  grid

                                  gap-3

                                  border-b

                                  border-purple-100/65

                                  py-5

                                  sm:grid-cols-[110px_1fr]

                                  sm:gap-6

                                  sm:py-6
                                "
                              >
                                <span
                                  className="
                                    text-[7px]

                                    font-black

                                    uppercase

                                    tracking-[.18em]

                                    text-purple-400
                                  "
                                >
                                  ${line.tag}
                                </span>

                                <p
                                  className="
                                    max-w-2xl

                                    text-[15px]

                                    leading-7

                                    text-purple-950/74

                                    sm:text-[17px]

                                    sm:leading-8
                                  "
                                >
                                  ${line.text}
                                </p>
                              </div>
                            `
                          )}
                        </div>

                        <!-- FOOTER -->

                        <div
                          className="
                            mt-7

                            flex

                            flex-col

                            gap-5

                            sm:flex-row

                            sm:items-end

                            sm:justify-between
                          "
                        >
                          <p
                            className="
                              max-w-md

                              font-display

                              text-xl

                              italic

                              leading-7

                              text-purple-700

                              sm:text-2xl
                            "
                          >
                            ${current.footer}
                          </p>

                          <button
                            type="button"

                            onClick=${() =>
                              onContinue(
                                'you-at-21'
                              )
                            }

                            className="
                              group

                              inline-flex

                              shrink-0

                              items-center

                              justify-center

                              gap-3

                              rounded-full

                              bg-[#5f3377]

                              px-5

                              py-3.5

                              font-display

                              text-base

                              italic

                              text-white

                              shadow-[0_16px_40px_rgba(95,51,119,.22)]

                              transition-all

                              duration-300

                              hover:-translate-y-0.5

                              hover:bg-[#6d3b87]

                              hover:shadow-[0_20px_50px_rgba(95,51,119,.28)]
                            "
                          >
                            ${current.continueLabel}

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
                    </article>
                  </div>
                </div>
              `
        }
      </div>
    </section>
  `;
}