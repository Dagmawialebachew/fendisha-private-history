import {
  React,
  html,
} from '../lib/react.js';


/*
|--------------------------------------------------------------------------
| HEART REVEAL V3
|--------------------------------------------------------------------------
|
| Normal hearts:
|   iPhone / Dynamic-Island inspired notification from TOP.
|
| Heart 01:
|   Larger tutorial because it introduces the system.
|
| Heart 19:
|   Suspicious notification → real secret experience.
|
| Heart 21:
|   Completion notification.
|
| NO full-screen modal for normal notes.
| NO dark overlay.
|
*/


export function HeartReveal({
  secret,
  foundCount,
  onClose,
  onOpenSecret,
}) {
  const cardRef =
    React.useRef(null);

  const dismissTimerRef =
    React.useRef(null);

  const progressRafRef =
    React.useRef(null);

  const progressStartedRef =
    React.useRef(null);

  const remainingRef =
    React.useRef(6200);

  const pausedRef =
    React.useRef(false);


  const [
    progress,
    setProgress,
  ] =
    React.useState(1);


  /*
  |--------------------------------------------------------------------------
  | TYPE
  |--------------------------------------------------------------------------
  */

  const isIntro =
    secret?.kind ===
    'intro';

  const isReceipt =
    secret?.kind ===
    'receipt';

  const isFinal =
    secret?.kind ===
    'final';

  const isNormal =
    secret &&
    !isIntro &&
    !isReceipt &&
    !isFinal;


  /*
  |--------------------------------------------------------------------------
  | RESET WHEN ANOTHER HEART OPENS
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    setProgress(1);

    remainingRef.current =
      6200;

    pausedRef.current =
      false;
  }, [
    secret?.id,
  ]);


  /*
  |--------------------------------------------------------------------------
  | ENTRANCE
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    if (
      !secret ||
      !cardRef.current
    ) {
      return;
    }


    const reduceMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;


    if (
      reduceMotion
    ) {
      return;
    }


    const element =
      cardRef.current;


    const animation =
      element.animate(
        [
          {
            opacity: 0,

            transform:
              'translateY(-34px) scale(.94)',

            filter:
              'blur(7px)',
          },

          {
            opacity: 1,

            transform:
              'translateY(5px) scale(1.012)',

            filter:
              'blur(0)',

            offset: 0.75,
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
            isIntro
              ? 760
              : 560,

          easing:
            'cubic-bezier(.18,.88,.22,1)',

          fill: 'both',
        }
      );


    return () =>
      animation.cancel();
  }, [
    secret?.id,
  ]);


  /*
  |--------------------------------------------------------------------------
  | AUTO DISMISS
  |--------------------------------------------------------------------------
  |
  | ONLY normal little notes.
  |
  | Intro, #19 and #21 stay until she closes / interacts.
  |
  */

  React.useEffect(() => {
    if (
      !isNormal
    ) {
      return;
    }


    const runTimer = () => {
      cancelAnimationFrame(
        progressRafRef.current
      );


      progressStartedRef.current =
        performance.now();


      const total =
        remainingRef.current;


      const tick = (
        now
      ) => {
        if (
          pausedRef.current
        ) {
          return;
        }


        const elapsed =
          now -
          progressStartedRef.current;


        const next =
          Math.max(
            0,

            1 -
              elapsed /
                total
          );


        setProgress(
          next
        );


        if (
          next <= 0
        ) {
          onClose?.();
          return;
        }


        progressRafRef.current =
          requestAnimationFrame(
            tick
          );
      };


      progressRafRef.current =
        requestAnimationFrame(
          tick
        );
    };


    runTimer();


    return () => {
      cancelAnimationFrame(
        progressRafRef.current
      );

      clearTimeout(
        dismissTimerRef.current
      );
    };
  }, [
    secret?.id,
    isNormal,
  ]);


  /*
  |--------------------------------------------------------------------------
  | PAUSE WHILE SHE TOUCHES / HOVERS
  |--------------------------------------------------------------------------
  */

  const pauseDismiss = () => {
    if (
      !isNormal ||
      pausedRef.current
    ) {
      return;
    }


    pausedRef.current =
      true;


    const now =
      performance.now();


    const elapsed =
      now -
      (
        progressStartedRef.current ||
        now
      );


    remainingRef.current =
      Math.max(
        0,

        remainingRef.current -
          elapsed
      );


    cancelAnimationFrame(
      progressRafRef.current
    );
  };


  const resumeDismiss = () => {
    if (
      !isNormal ||
      !pausedRef.current
    ) {
      return;
    }


    pausedRef.current =
      false;


    progressStartedRef.current =
      performance.now();


    const startingProgress =
      progress;


    const tick = (
      now
    ) => {
      if (
        pausedRef.current
      ) {
        return;
      }


      const elapsed =
        now -
        progressStartedRef.current;


      const next =
        Math.max(
          0,

          startingProgress -
            elapsed /
              6200
        );


      setProgress(
        next
      );


      if (
        next <= 0
      ) {
        onClose?.();
        return;
      }


      progressRafRef.current =
        requestAnimationFrame(
          tick
        );
    };


    progressRafRef.current =
      requestAnimationFrame(
        tick
      );
  };


  /*
  |--------------------------------------------------------------------------
  | ESCAPE
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    if (!secret) {
      return;
    }


    const keydown = (
      event
    ) => {
      if (
        event.key ===
        'Escape'
      ) {
        onClose?.();
      }
    };


    window.addEventListener(
      'keydown',
      keydown
    );


    return () => {
      window.removeEventListener(
        'keydown',
        keydown
      );
    };
  }, [
    secret?.id,
  ]);


  if (!secret) {
    return null;
  }


  /*
  |--------------------------------------------------------------------------
  | 01 — INTRO
  |--------------------------------------------------------------------------
  */

  const renderIntro = () =>
    html`
      <div
        className="
          px-5
          pb-5
          pt-4

          sm:px-6
          sm:pb-6
        "
      >

        <div
          className="
            flex

            items-start

            gap-3
          "
        >

          <div
            className="
              grid

              h-11
              w-11

              shrink-0

              place-items-center

              rounded-[14px]

              bg-gradient-to-br

              from-purple-600

              to-pink-500

              text-lg

              text-white

              shadow-[0_8px_24px_rgba(118,63,150,.24)]
            "
          >
            ♥
          </div>


          <div
            className="
              min-w-0

              flex-1

              text-left
            "
          >

            <div
              className="
                flex

                items-center

                justify-between

                gap-3
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
                HIDDEN NOTE · 01 / 21
              </p>


              <button
                type="button"

                onClick=${onClose}

                className="
                  grid

                  h-7
                  w-7

                  shrink-0

                  place-items-center

                  rounded-full

                  bg-purple-50

                  text-xs

                  font-black

                  text-purple-500

                  transition

                  hover:bg-purple-100
                "
              >
                ×
              </button>

            </div>


            <h2
              className="
                mt-2

                font-display

                text-3xl

                font-semibold

                italic

                leading-[.95]

                tracking-[-.035em]

                text-plum

                sm:text-4xl
              "
            >
              ${secret.title}
            </h2>

          </div>

        </div>


        <p
          className="
            mt-4

            text-sm

            leading-6

            text-purple-900/68
          "
        >
          ${secret.body}
        </p>


        <div
          className="
            mt-4

            rounded-[1.25rem]

            bg-purple-50/90

            px-4
            py-3.5
          "
        >

          <p
            className="
              font-display

              text-lg

              italic

              leading-6

              text-purple-800
            "
          >
            ${secret.secondary}
          </p>


          <p
            className="
              mt-2

              text-[11px]

              font-bold

              text-purple-500/75
            "
          >
            ${secret.footer}
          </p>

        </div>


        <div
          className="
            mt-4

            flex

            items-center

            justify-between

            gap-4
          "
        >

          <p
            className="
              text-[9px]

              font-black

              uppercase

              tracking-[.16em]

              text-purple-400
            "
          >
            tiny heart detector unlocked
          </p>


          <span
            className="
              font-display

              text-sm

              italic

              text-purple-500
            "
          >
            ♥ ${foundCount}/21
          </span>

        </div>

      </div>
    `;


  /*
  |--------------------------------------------------------------------------
  | NORMAL NOTIFICATION
  |--------------------------------------------------------------------------
  */

  const renderNormal = () =>
    html`
      <div
        className="
          relative

          overflow-hidden

          px-4
          py-3.5

          sm:px-5
          sm:py-4
        "
      >

        <div
          className="
            flex

            items-start

            gap-3
          "
        >

          <div
            className="
              grid

              h-10
              w-10

              shrink-0

              place-items-center

              rounded-[13px]

              bg-gradient-to-br

              from-purple-600

              to-pink-500

              text-base

              text-white

              shadow-[0_7px_20px_rgba(105,54,135,.21)]
            "
          >
            ♥
          </div>


          <div
            className="
              min-w-0

              flex-1

              text-left
            "
          >

            <div
              className="
                flex

                items-center

                justify-between

                gap-2
              "
            >

              <p
                className="
                  truncate

                  text-[9px]

                  font-black

                  uppercase

                  tracking-[.15em]

                  text-purple-500
                "
              >
                HIDDEN NOTE · ${String(
                  secret.id
                ).padStart(
                  2,
                  '0'
                )}/21
              </p>


              <div
                className="
                  flex

                  shrink-0

                  items-center

                  gap-2
                "
              >

                <span
                  className="
                    text-[9px]

                    font-semibold

                    text-purple-400/75
                  "
                >
                  now
                </span>


                <button
                  type="button"

                  onClick=${onClose}

                  className="
                    grid

                    h-6
                    w-6

                    place-items-center

                    rounded-full

                    text-[10px]

                    font-black

                    text-purple-400

                    transition

                    hover:bg-purple-50

                    hover:text-purple-700
                  "
                >
                  ×
                </button>

              </div>

            </div>


            <p
              className="
                mt-1

                font-display

                text-[1.15rem]

                font-semibold

                italic

                leading-[1.15]

                text-plum

                sm:text-[1.25rem]
              "
            >
              ${secret.message ||
              secret.title}
            </p>


            ${
              secret.sub
                ? html`
                    <p
                      className="
                        mt-1

                        text-[11px]

                        leading-[1.45]

                        text-purple-900/58
                      "
                    >
                      ${secret.sub}
                    </p>
                  `
                : null
            }

          </div>

        </div>


        <div
          className="
            absolute

            bottom-0

            left-0

            h-[2px]

            bg-gradient-to-r

            from-purple-500

            to-pink-400
          "

          style=${{
            width:
              `${progress * 100}%`,

            transition:
              'width 70ms linear',
          }}
        ></div>

      </div>
    `;


  /*
  |--------------------------------------------------------------------------
  | 19 — SECRET RECEIPT TEASER
  |--------------------------------------------------------------------------
  |
  | No fake receipt here.
  |
  | This notification hands control to
  | SecretCrushReveal through onOpenSecret.
  |
  */

  const renderReceipt = () =>
    html`
      <div
        className="
          px-4
          py-4

          sm:px-5
        "
      >

        <div
          className="
            flex

            items-start

            gap-3
          "
        >

          <div
            className="
              grid

              h-11
              w-11

              shrink-0

              place-items-center

              rounded-[14px]

              bg-gradient-to-br

              from-purple-700

              to-fuchsia-500

              text-lg

              text-white

              shadow-[0_8px_24px_rgba(105,54,135,.24)]
            "
          >
            👀
          </div>


          <div
            className="
              min-w-0

              flex-1

              text-left
            "
          >

            <div
              className="
                flex

                items-center

                justify-between

                gap-2
              "
            >

              <p
                className="
                  text-[9px]

                  font-black

                  uppercase

                  tracking-[.16em]

                  text-fuchsia-500
                "
              >
                HIDDEN NOTE XIX · suspicious
              </p>


              <button
                type="button"

                onClick=${onClose}

                className="
                  grid

                  h-6
                  w-6

                  place-items-center

                  rounded-full

                  text-[10px]

                  font-black

                  text-purple-400

                  transition

                  hover:bg-purple-50

                  hover:text-purple-700
                "
              >
                ×
              </button>

            </div>


            <p
              className="
                mt-1.5

                font-display

                text-xl

                font-semibold

                italic

                leading-tight

                text-plum
              "
            >
              okay... this one isn't actually a little note.
            </p>


            <p
              className="
                mt-1.5

                text-[11px]

                leading-[1.5]

                text-purple-900/58
              "
            >
              ${secret.title}
            </p>


            <button
              type="button"

              onClick=${() => {
                navigator.vibrate?.(
                  [
                    12,
                    30,
                    18,
                    45,
                    24,
                  ]
                );

                if (
                  typeof onOpenSecret ===
                  'function'
                ) {
                  onOpenSecret();
                  return;
                }

                onClose?.();
              }}

              className="
                mt-3

                inline-flex

                items-center

                gap-2

                rounded-full

                bg-purple-50

                px-3.5
                py-2

                text-[10px]

                font-black

                uppercase

                tracking-[.12em]

                text-purple-700

                transition

                hover:-translate-y-px

                hover:bg-purple-100

                active:translate-y-0
              "
            >
              see what I know 👀
              <span>→</span>
            </button>

          </div>

        </div>

      </div>
    `;


  /*
  |--------------------------------------------------------------------------
  | 21 — FINAL NOTIFICATION
  |--------------------------------------------------------------------------
  */

  const renderFinal = () =>
    html`
      <div
        className="
          px-5
          pb-5
          pt-4

          sm:px-6
          sm:pb-6
        "
      >

        <div
          className="
            flex

            items-start

            gap-3
          "
        >

          <div
            className="
              grid

              h-12
              w-12

              shrink-0

              place-items-center

              rounded-[15px]

              bg-gradient-to-br

              from-purple-600

              to-pink-500

              text-xl

              text-white

              shadow-[0_8px_28px_rgba(105,54,135,.26)]
            "
          >
            ♥
          </div>


          <div
            className="
              min-w-0

              flex-1

              text-left
            "
          >

            <div
              className="
                flex

                items-center

                justify-between

                gap-3
              "
            >

              <p
                className="
                  text-[9px]

                  font-black

                  uppercase

                  tracking-[.2em]

                  text-purple-500
                "
              >
                ♡ 21 / 21 · COMPLETE
              </p>


              <button
                type="button"

                onClick=${onClose}

                className="
                  grid

                  h-7
                  w-7

                  place-items-center

                  rounded-full

                  bg-purple-50

                  text-xs

                  font-black

                  text-purple-500
                "
              >
                ×
              </button>

            </div>


            <p
              className="
                mt-2

                font-display

                text-2xl

                font-semibold

                italic

                leading-tight

                text-plum

                sm:text-3xl
              "
            >
              ${secret.title}
            </p>

          </div>

        </div>


        <p
          className="
            mt-4

            text-sm

            leading-6

            text-purple-900/68
          "
        >
          ${secret.body}
        </p>


        <p
          className="
            mt-3

            font-display

            text-xl

            italic

            leading-7

            text-purple-700
          "
        >
          ${secret.finale}
        </p>


        <p
          className="
            mt-3

            text-[10px]

            font-bold

            text-purple-500/70
          "
        >
          ${secret.footer}
        </p>

      </div>
    `;


  /*
  |--------------------------------------------------------------------------
  | WRAPPER
  |--------------------------------------------------------------------------
  */

  const wide =
    isIntro ||
    isFinal;


  return html`
    <div
      className="
        pointer-events-none

        fixed

        inset-x-0

        top-0

        z-[12000]

        flex

        justify-center

        px-2.5

        pt-[max(.65rem,env(safe-area-inset-top))]

        sm:px-4

        sm:pt-[max(1rem,env(safe-area-inset-top))]
      "
    >

      <div
        ref=${cardRef}

        className=${`
          pointer-events-auto

          relative

          w-full

          overflow-hidden

          border

          border-white/85

          bg-white/88

          shadow-[0_18px_60px_rgba(74,39,95,.18)]

          backdrop-blur-2xl

          ${
            wide
              ? `
                max-w-[560px]

                rounded-[2rem]
              `
              : `
                max-w-[430px]

                rounded-[1.65rem]
              `
          }
        `}

        onPointerEnter=${pauseDismiss}

        onPointerLeave=${resumeDismiss}

        onPointerDown=${pauseDismiss}

        onPointerUp=${resumeDismiss}

        onPointerCancel=${resumeDismiss}
      >

        <div
          aria-hidden="true"

          className="
            pointer-events-none

            absolute

            inset-x-8

            top-0

            h-px

            bg-gradient-to-r

            from-transparent

            via-white

            to-transparent
          "
        ></div>


        ${
          isIntro
            ? renderIntro()

            : isReceipt
              ? renderReceipt()

              : isFinal
                ? renderFinal()

                : renderNormal()
        }

      </div>

    </div>
  `;
}