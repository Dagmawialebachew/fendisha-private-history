import { React, html } from '../lib/react.js';
import { media } from '../config.js';
import { AudioButton } from '../components/AudioButton.js';
import { SecretHeart } from '../components/SecretHeart.js';


export function FaithPage({
  onContinue,
  found,
  onFindHeart,
}) {
  const pageRef = React.useRef(null);
  const artWrapRef = React.useRef(null);
  const artRef = React.useRef(null);
  const rafRef = React.useRef(null);


  /*
  |--------------------------------------------------------------------------
  | PAGE ENTRANCE
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    const page = pageRef.current;

    if (!page) return;


    const reduceMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;


    if (reduceMotion) return;


    const animations = [];


    /*
    |--------------------------------------------------------------------------
    | ARTWORK
    |--------------------------------------------------------------------------
    */

    if (artWrapRef.current) {
      const animation =
        artWrapRef.current.animate(
          [
            {
              opacity: 0,
              transform:
                'translateX(-22px) scale(.975)',
              filter:
                'blur(6px)',
            },

            {
              opacity: 1,
              transform:
                'translateX(0) scale(1)',
              filter:
                'blur(0)',
            },
          ],

          {
            duration: 1000,
            delay: 160,
            easing:
              'cubic-bezier(.18,.82,.22,1)',
            fill: 'both',
          }
        );


      animations.push(animation);
    }


    /*
    |--------------------------------------------------------------------------
    | TEXT STAGGER
    |--------------------------------------------------------------------------
    */

    const reveals =
      page.querySelectorAll(
        '[data-faith-reveal]'
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
              duration: 720,
              delay:
                80 +
                index * 110,
              easing:
                'cubic-bezier(.18,.82,.22,1)',
              fill: 'both',
            }
          );


        animations.push(animation);
      }
    );


    /*
    |--------------------------------------------------------------------------
    | PRAYER LINE
    |--------------------------------------------------------------------------
    |
    | Give this one a slower, quieter arrival.
    |
    */

    const prayer =
      page.querySelector(
        '[data-faith-prayer]'
      );


    if (prayer) {
      const animation =
        prayer.animate(
          [
            {
              opacity: 0,
              transform:
                'translateY(12px) scale(.985)',
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
            duration: 1050,
            delay: 720,
            easing:
              'cubic-bezier(.18,.82,.22,1)',
            fill: 'both',
          }
        );


      animations.push(animation);
    }


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
  | SUBTLE ART PARALLAX
  |--------------------------------------------------------------------------
  |
  | Desktop only.
  | Very restrained.
  |
  */

  const handlePointerMove = (
    event
  ) => {
    if (
      window.innerWidth < 900 ||
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      return;
    }


    cancelAnimationFrame(
      rafRef.current
    );


    rafRef.current =
      requestAnimationFrame(
        () => {
          const wrap =
            artWrapRef.current;

          const art =
            artRef.current;


          if (
            !wrap ||
            !art
          ) {
            return;
          }


          const bounds =
            wrap.getBoundingClientRect();


          const x =
            (
              event.clientX -
              bounds.left
            ) /
              bounds.width -
            0.5;


          const y =
            (
              event.clientY -
              bounds.top
            ) /
              bounds.height -
            0.5;


          art.style.transform =
            `
              scale(1.018)
              translate3d(
                ${x * -6}px,
                ${y * -5}px,
                0
              )
            `;
        }
      );
  };


  const handlePointerLeave = () => {
    cancelAnimationFrame(
      rafRef.current
    );


    if (artRef.current) {
      artRef.current.style.transform =
        'scale(1) translate3d(0,0,0)';
    }
  };


  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(
        rafRef.current
      );
    };
  }, []);


  return html`
    <section
      ref=${pageRef}

      id="faith"

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

          max-w-6xl
        "
      >

        <div
          className="
            grid

            items-center

            gap-10

            lg:grid-cols-2
          "
        >

          <!-- ================================= -->
          <!-- ART -->
          <!-- ================================= -->

          <div
            ref=${artWrapRef}

            onPointerMove=${handlePointerMove}

            onPointerLeave=${handlePointerLeave}
          >

            <img
              ref=${artRef}

              src="/art/kidane-mihret-line.svg"

              alt="Soft line illustration inspired by Kidane Mihret"

              className="
                w-full

                rounded-[2.5rem]

                shadow-soft

                transition-transform

                duration-700

                ease-out

                will-change-transform
              "
            />

          </div>


          <!-- ================================= -->
          <!-- COPY -->
          <!-- ================================= -->

          <div>

            <div
              data-faith-reveal
            >
              <span
                className="
                  birthday-chip
                "
              >
                THE PLACE WE KEEP RETURNING TO
              </span>
            </div>


            <h2
              data-faith-reveal

              className="
                section-title

                mt-5
              "
            >
              Kidane Mihret.
            </h2>


            <div
              className="
                mt-6

                space-y-4

                text-base

                leading-7

                text-purple-900/75

                sm:text-lg

                sm:leading-8
              "
            >

              <p
                data-faith-reveal
              >
                Our first date made this place part of our story.
                Then we kept returning when we could.
              </p>


              <p
                data-faith-reveal
              >
                And there was another day when I came to church
                with a question I did not know how to carry by myself.
              </p>


              <p
                data-faith-reveal
              >
                I did not go to ask God to force you to stay.
                I was scared of losing you, yes — but I was also
                asking myself whether loving you meant wanting what
                was right for you, even if it scared me.
              </p>


              <p
                data-faith-prayer

                className="
                  font-display

                  text-3xl

                  italic

                  leading-tight

                  text-plum
                "
              >
                My prayer was simple:
                if she is for me… keep her.
              </p>

            </div>


            <div
              data-faith-reveal
            >
              <${AudioButton}
                src=${media.voiceFaith}

                className="
                  secondary-cta

                  mt-7
                "
              >
                ▶ Hear me tell this properly
              <//>
            </div>

          </div>

        </div>


        <!-- ================================= -->
        <!-- NEXT -->
        <!-- ================================= -->

        <div
          data-faith-reveal

          className="
            mt-10

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
                'past-lives'
              )
            }
          >
            now let me be dramatic for 3 minutes 😂

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
        id=${15}

        found=${found.has(
          15
        )}

        onFind=${onFindHeart}

        className="
          left-[8%]

          bottom-[12%]
        "
      />

    </section>
  `;
}