import {
  html,
} from '../lib/react.js';


export function HeartTracker({
  count = 0,
  started = false,
}) {
  if (
    !started
  ) {
    return null;
  }


  const safeCount =
    Math.max(
      0,
      Math.min(
        21,
        Number(count) || 0
      )
    );


  const complete =
    safeCount === 21;


  return html`
    <div
      className="
        pointer-events-none

        fixed

        right-3

        top-[max(.8rem,env(safe-area-inset-top))]

        z-[9000]

        sm:right-5
        sm:top-[max(1rem,env(safe-area-inset-top))]
      "
    >

      <div
        className=${`
          flex

          items-center

          gap-2

          rounded-full

          border

          px-3
          py-2

          shadow-[0_12px_34px_rgba(74,39,95,.14)]

          backdrop-blur-2xl

          transition-all

          duration-500

          ${
            complete
              ? `
                border-purple-300/80
                bg-purple-600
                text-white
              `

              : `
                border-white/90
                bg-white/78
                text-purple-700
              `
          }
        `}
      >

        <span
          className=${`
            grid

            h-5
            w-5

            place-items-center

            rounded-full

            text-xs

            ${
              complete
                ? `
                  bg-white/16
                  text-white
                `

                : `
                  bg-purple-50
                  text-purple-600
                `
            }
          `}
        >
          ♥
        </span>


        <span
          className="
            text-[9px]

            font-black

            tracking-[.15em]
          "
        >
          ${String(
            safeCount
          ).padStart(
            2,
            '0'
          )}
          /
          21
        </span>

      </div>

    </div>
  `;
}