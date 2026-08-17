import { React, html } from '../lib/react.js';

export function SecretHeart({
  id,
  found,
  onFind,
  className = '',
  tease = false,
  teaseText = "don't touch this 👀",
}) {
  const [hintVisible, setHintVisible] =
    React.useState(false);

  const hintTimerRef =
    React.useRef(null);

  const hideTimerRef =
    React.useRef(null);

  const pulseTimerRef =
    React.useRef(null);

  const buttonRef =
    React.useRef(null);


  React.useEffect(() => {
    if (
      found ||
      !tease
    ) {
      setHintVisible(false);
      return;
    }

    const showHint = () => {
      setHintVisible(true);

      clearTimeout(
        hideTimerRef.current
      );

      hideTimerRef.current =
        setTimeout(() => {
          setHintVisible(false);
        }, 2600);


      if (
        buttonRef.current &&
        !window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches
      ) {
        buttonRef.current.animate(
          [
            {
              transform:
                'rotate(0deg) scale(1)',
            },
            {
              transform:
                'rotate(-9deg) scale(1.2)',
            },
            {
              transform:
                'rotate(8deg) scale(1.2)',
            },
            {
              transform:
                'rotate(-5deg) scale(1.14)',
            },
            {
              transform:
                'rotate(0deg) scale(1)',
            },
          ],
          {
            duration: 780,
            easing:
              'cubic-bezier(.34,1.56,.64,1)',
          }
        );
      }
    };


    /*
    |--------------------------------------------------------------------------
    | FIRST SUSPICIOUS APPEARANCE
    |--------------------------------------------------------------------------
    */

    hintTimerRef.current =
      setTimeout(
        showHint,
        1800
      );


    /*
    |--------------------------------------------------------------------------
    | REMIND HER OCCASIONALLY
    |--------------------------------------------------------------------------
    */

    pulseTimerRef.current =
      setInterval(
        showHint,
        6200
      );


    return () => {
      clearTimeout(
        hintTimerRef.current
      );

      clearTimeout(
        hideTimerRef.current
      );

      clearInterval(
        pulseTimerRef.current
      );
    };
  }, [
    found,
    tease,
  ]);


  const handleClick = () => {
    if (
      navigator.vibrate
    ) {
      navigator.vibrate(
        found
          ? 8
          : [10, 22, 16]
      );
    }


    if (
      buttonRef.current &&
      !window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      buttonRef.current.animate(
        [
          {
            transform:
              'scale(1)',
          },
          {
            transform:
              'scale(1.55)',
          },
          {
            transform:
              'scale(.92)',
          },
          {
            transform:
              'scale(1)',
          },
        ],
        {
          duration: 520,
          easing:
            'cubic-bezier(.34,1.56,.64,1)',
        }
      );
    }


    onFind?.(
      id
    );
  };


  return html`
    <div
      className=${`
        absolute

        ${className}
      `}
    >

      ${
        tease &&
        !found
          ? html`
              <div
                className="
                  pointer-events-none

                  absolute

                  bottom-[calc(100%+.55rem)]
                  left-1/2

                  z-[3]

                  w-max

                  max-w-[180px]

                  -translate-x-1/2

                  transition-all
                  duration-500
                "

                style=${{
                  opacity:
                    hintVisible
                      ? 1
                      : 0,

                  transform:
                    hintVisible
                      ? 'translate(-50%, 0) scale(1)'
                      : 'translate(-50%, 7px) scale(.96)',
                }}
              >

                <div
                  className="
                    rounded-full

                    border
                    border-purple-200/80

                    bg-white/94

                    px-3
                    py-1.5

                    font-display

                    text-sm

                    italic

                    text-purple-700

                    shadow-[0_12px_34px_rgba(74,39,95,.18)]

                    backdrop-blur-xl
                  "
                >
                  ${teaseText}
                </div>


                <div
                  className="
                    mx-auto

                    h-2
                    w-2

                    -translate-y-1

                    rotate-45

                    border-b
                    border-r

                    border-purple-200/80

                    bg-white/94
                  "
                ></div>

              </div>
            `
          : null
      }


      <button
        ref=${buttonRef}

        type="button"

        className=${`
          secret-heart

          ${found
            ? 'is-found'
            : ''
          }

          relative

          grid

          h-8
          w-8

          place-items-center

          rounded-full

          border

          transition-all

          duration-300

          focus:outline-none

          focus-visible:ring-4

          focus-visible:ring-purple-300/40

          ${
            found
              ? `
                border-purple-200/45
                bg-white/42
                text-purple-400/50
                opacity-60
                hover:opacity-100
              `
              : `
                border-purple-200/75
                bg-white/72
                text-purple-600
                shadow-[0_8px_24px_rgba(111,59,142,.17)]
                hover:scale-125
                hover:bg-white
              `
          }
        `}

        aria-label=${
          found
            ? `Little heart ${id} already found. Tap to read it again.`
            : `Find hidden heart ${id}`
        }

        onClick=${handleClick}
      >

        <span
          aria-hidden="true"

          className="
            relative
            z-[2]

            text-[12px]
          "
        >
          ♥
        </span>


        ${
          !found
            ? html`
                <span
                  aria-hidden="true"

                  className="
                    pointer-events-none

                    absolute

                    inset-[-6px]

                    rounded-full

                    border

                    border-purple-300/25

                    animate-ping
                  "

                  style=${{
                    animationDuration:
                      tease
                        ? '2.6s'
                        : '4.6s',
                  }}
                ></span>
              `
            : null
        }

      </button>

    </div>
  `;
}