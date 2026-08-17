import {
  React,
  html,
} from '../lib/react.js';


export function SecretCrushReveal({
  open,
  onClose,

  /*
  | If you eventually get
  | the ACTUAL screenshot:
  |
  | proofImage="/media/secrets/is-he-single.jpg"
  */

  proofImage = '',
}) {
  const [
    step,
    setStep,
  ] =
    React.useState(0);


  const cardRef =
    React.useRef(null);


  React.useEffect(() => {
    if (!open) {
      setStep(
        0
      );

      return;
    }


    requestAnimationFrame(
      () => {
        cardRef.current
          ?.animate(
            [
              {
                opacity: 0,

                transform:
                  'translateY(-38px) scale(.96)',

                filter:
                  'blur(8px)',
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
              duration:
                700,

              easing:
                'cubic-bezier(.18,.88,.22,1)',

              fill:
                'both',
            }
          );
      }
    );
  }, [
    open,
  ]);


  if (!open) {
    return null;
  }


  const next = () => {
    setStep(
      value =>
        Math.min(
          3,
          value + 1
        )
    );


    navigator.vibrate?.(
      10
    );
  };


  return html`
    <div
      className="
        fixed

        inset-0

        z-[12500]

        overflow-y-auto

        bg-[#fffafd]/86

        px-3

        pb-8

        pt-[max(1rem,env(safe-area-inset-top))]

        backdrop-blur-xl

        sm:p-6
      "
    >

      <div
        ref=${cardRef}

        className="
          relative

          mx-auto

          w-full

          max-w-2xl

          overflow-hidden

          rounded-[2.25rem]

          border

          border-white/90

          bg-white/94

          p-5

          shadow-[0_35px_120px_rgba(74,39,95,.20)]

          sm:p-8
        "
      >

        <!-- ================================= -->
        <!-- CLOSE -->
        <!-- ================================= -->

        <button
          type="button"

          onClick=${onClose}

          className="
            absolute

            right-4
            top-4

            z-20

            grid

            h-8
            w-8

            place-items-center

            rounded-full

            bg-purple-50

            text-xs

            font-black

            text-purple-600
          "
        >
          ×
        </button>


        <!-- ================================= -->
        <!-- HEADER -->
        <!-- ================================= -->

        <p
          className="
            pr-12

            text-[8px]

            font-black

            uppercase

            tracking-[.25em]

            text-fuchsia-500
          "
        >
          ONE THING U PROBABLY THOUGHT I NEVER KNEW
        </p>


        <h2
          className="
            mt-3

            max-w-xl

            font-display

            text-[clamp(2.7rem,8vw,5rem)]

            font-semibold

            italic

            leading-[.87]

            tracking-[-.05em]

            text-plum
          "
        >
          soooo...

          <br />

          <span
            className="
              text-gradient
            "
          >
            I heard something. 👀
          </span>
        </h2>


        <!-- ================================= -->
        <!-- STEP 0 -->
        <!-- ================================= -->

        ${
          step === 0
            ? html`
                <div
                  className="
                    mt-8
                  "
                >

                  <p
                    className="
                      max-w-lg

                      text-sm

                      leading-7

                      text-purple-900/68

                      sm:text-base
                    "
                  >
                    A long time ago,
                    one of my friends
                    posted me on his story
                    for my birthday.
                  </p>


                  <p
                    className="
                      mt-4

                      font-display

                      text-2xl

                      italic

                      text-purple-700
                    "
                  >
                    apparently somebody
                    replied to that story 😭
                  </p>


                  <button
                    type="button"

                    onClick=${next}

                    className="
                      primary-cta

                      mt-7
                    "
                  >
                    okay what did they say? 👀
                  </button>

                </div>
              `
            : null
        }


        <!-- ================================= -->
        <!-- STEP 1 -->
        <!-- ================================= -->

        ${
          step === 1
            ? html`
                <div
                  className="
                    mt-8
                  "
                >

                  <p
                    className="
                      text-[9px]

                      font-black

                      uppercase

                      tracking-[.18em]

                      text-purple-400
                    "
                  >
                    MESSAGE RECEIVED A VERY LONG TIME AGO
                  </p>


                  <div
                    className="
                      mt-5

                      rounded-[1.7rem]

                      border

                      border-purple-100

                      bg-purple-50/70

                      p-5
                    "
                  >

                    <p
                      className="
                        text-xs

                        text-purple-900/52
                      "
                    >
                      replying to a birthday story...
                    </p>


                    <div
                      className="
                        mt-4

                        ml-auto

                        w-fit

                        max-w-[82%]

                        rounded-[1.5rem]

                        rounded-br-[.45rem]

                        bg-gradient-to-br

                        from-purple-600

                        to-fuchsia-500

                        px-5

                        py-3.5

                        text-white

                        shadow-[0_12px_30px_rgba(111,59,142,.18)]
                      "
                    >

                      <p
                        className="
                          font-display

                          text-2xl

                          italic
                        "
                      >
                        is he single?
                      </p>

                    </div>

                  </div>


                  ${
                    !proofImage
                      ? html`
                          <p
                            className="
                              mt-3

                              text-[9px]

                              font-bold

                              uppercase

                              tracking-[.14em]

                              text-purple-400/70
                            "
                          >
                            recreated from what I was told · not the original screenshot
                          </p>
                        `
                      : null
                  }


                  <button
                    type="button"

                    onClick=${next}

                    className="
                      secondary-cta

                      mt-7
                    "
                  >
                    wait... WHAT 😭 →
                  </button>

                </div>
              `
            : null
        }


        <!-- ================================= -->
        <!-- STEP 2 -->
        <!-- REAL SCREENSHOT IF AVAILABLE -->
        <!-- ================================= -->

        ${
          step === 2
            ? html`
                <div
                  className="
                    mt-8
                  "
                >

                  ${
                    proofImage

                      ? html`
                          <div
                            className="
                              rounded-[1.8rem]

                              border

                              border-purple-100

                              bg-purple-50/55

                              p-3
                            "
                          >

                            <img
                              src=${proofImage}

                              alt="Original screenshot of the old message"

                              className="
                                mx-auto

                                max-h-[52svh]

                                w-auto

                                rounded-[1.25rem]

                                object-contain

                                shadow-soft
                              "
                            />

                          </div>


                          <p
                            className="
                              mt-3

                              text-[9px]

                              font-black

                              uppercase

                              tracking-[.16em]

                              text-purple-400
                            "
                          >
                            yes. this is the actual receipt 😭
                          </p>
                        `

                      : html`
                          <div
                            className="
                              rounded-[1.8rem]

                              bg-purple-50

                              p-6

                              text-center
                            "
                          >

                            <p
                              className="
                                font-display

                                text-[clamp(3rem,10vw,5.5rem)]

                                font-semibold

                                italic

                                leading-none

                                text-purple-700
                              "
                            >
                              FKR 😭😭😭
                            </p>


                            <p
                              className="
                                mt-4

                                text-sm

                                font-black

                                leading-6

                                text-fuchsia-600
                              "
                            >
                              U REALLY THOUGHT THIS INFORMATION
                              WAS NEVER GOING TO REACH ME???
                            </p>

                          </div>
                        `
                  }


                  <button
                    type="button"

                    onClick=${next}

                    className="
                      primary-cta

                      mt-7
                    "
                  >
                    okay let me explain 😂
                  </button>

                </div>
              `
            : null
        }


        <!-- ================================= -->
        <!-- STEP 3 — SOFT LANDING -->
        <!-- ================================= -->

        ${
          step === 3
            ? html`
                <div
                  className="
                    mt-8
                  "
                >

                  <p
                    className="
                      max-w-xl

                      text-sm

                      leading-7

                      text-purple-900/68

                      sm:text-base
                    "
                  >
                    I am not showing u this
                    to embarrass u.
                  </p>


                  <p
                    className="
                      mt-4

                      max-w-xl

                      font-display

                      text-2xl

                      italic

                      leading-8

                      text-plum

                      sm:text-3xl
                    "
                  >
                    I just think it is ridiculously cute
                    knowing there was a version of us where
                    u were somewhere asking about me...
                    while I had absolutely no idea 😂
                  </p>


                  <div
                    className="
                      mt-6

                      rounded-[1.6rem]

                      bg-purple-50/80

                      p-5
                    "
                  >

                    <p
                      className="
                        font-display

                        text-xl

                        italic

                        text-purple-700
                      "
                    >
                      anyway...
                      secret safe with me.
                    </p>


                    <p
                      className="
                        mt-1

                        text-xs

                        font-bold

                        text-purple-500
                      "
                    >
                      well... mostly 😭💜
                    </p>

                  </div>


                  <button
                    type="button"

                    onClick=${onClose}

                    className="
                      secondary-cta

                      mt-7
                    "
                  >
                    GET ME OUT OF HERE 😭
                  </button>

                </div>
              `
            : null
        }

      </div>

    </div>
  `;
}