import { React, html } from '../lib/react.js';
import { media } from '../config.js';
import { playSfx } from '../lib/audio.js';
import { SecretHeart } from '../components/SecretHeart.js';


/*
|--------------------------------------------------------------------------
| FOUR FRAMES THAT STAYED
|--------------------------------------------------------------------------
|
| This page is deliberately independent from content.js.
|
| Page 05 = things I notice about HER
| Page 06 = moments where "us" quietly started forming
| Page 08 = the actual PLACES that became ours
|
*/

const MOMENTS = [
  {
    key: 'frfr',

    image:
      media.frfr,

    eyebrow:
      'BEFORE IT WAS REALLY “US”',

    title:
      'Frfr Tera',

    body:
      'At the time it was literally just a café where I properly met u. Nothing cinematic happened. No background music. No dramatic camera angle 😭. It is just funny how a completely normal place can become important before u even know it is becoming important.',

    memory:
      'what stayed in my head: that was one of the first times “you” stopped being just a person I had heard about and became an actual memory in my life.',
  },

  {
    key: 'gate',

    image:
      media.gate,

    eyebrow:
      'AAU · 5TH GATE',

    title:
      'You were waiting there.',

    body:
      'I was dealing with that whole transfer thing and u were there waiting with my friends. It was not some huge romantic event... which is probably exactly why I like remembering it. Just u being there.',

    memory:
      'what stayed in my head: I do not even know why this scene stayed this clearly... but when I think about that time, I can still picture u there.',
  },

  {
    key: 'firstDate',

    image:
      media.firstDate,

    eyebrow:
      '25 · 11 · 25',

    title:
      'The date that changed something.',

    body:
      'Our first real date. One of those dates that looked completely normal on a calendar and then quietly became one I would never read normally again.',

    memory:
      'what stayed in my head: apparently this date became important enough for me to make u solve it backwards just to enter your own birthday gift 😭',
  },

  {
    key: 'walking',

    image:
      media.walking,

    eyebrow:
      'SOMEWHERE AFTER THAT',

    title:
      'Then even walking became a memory.',

    body:
      'Somewhere along the way it stopped needing to be a special place or some perfectly planned date. Walking somewhere with u was already enough for the day to stick in my head.',

    memory:
      'what stayed in my head: I think some of my favorite moments with u happened while we were literally just going somewhere.',
  },
];


export function OurMomentsPage({
  onContinue,
  found,
  onFindHeart,
}) {
  const pageRef =
    React.useRef(null);

  const [openMemory, setOpenMemory] =
    React.useState(null);

  const [hoveredMoment, setHoveredMoment] =
    React.useState(null);


  /*
  |--------------------------------------------------------------------------
  | PAGE ENTRANCE
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    const page =
      pageRef.current;

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


    /*
    |--------------------------------------------------------------------------
    | HEADER
    |--------------------------------------------------------------------------
    */

    const headerItems =
      page.querySelectorAll(
        '[data-moments-header]'
      );


    const headerAnimations =
      [];


    headerItems.forEach(
      (
        element,
        index
      ) => {
        const animation =
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
                720,

              delay:
                90 +
                index * 110,

              easing:
                'cubic-bezier(.18,.82,.22,1)',

              fill:
                'both',
            }
          );


        headerAnimations.push(
          animation
        );
      }
    );


    /*
    |--------------------------------------------------------------------------
    | MEMORY ROWS
    |--------------------------------------------------------------------------
    |
    | They arrive like photographs developing.
    |
    */

    const rows =
      page.querySelectorAll(
        '[data-moment-row]'
      );


    const observers =
      [];


    rows.forEach(
      (
        row,
        index
      ) => {
        const image =
          row.querySelector(
            '[data-moment-image]'
          );

        const copy =
          row.querySelector(
            '[data-moment-copy]'
          );


        /*
          Initial state before the observer reveals it.
        */

        row.style.opacity =
          '0';


        if (image) {
          image.style.filter =
            'grayscale(.34) saturate(.72) brightness(1.06)';

          image.style.transform =
            'scale(1.035)';
        }


        if (copy) {
          copy.style.opacity =
            '0';

          copy.style.transform =
            index % 2 === 0
              ? 'translateX(18px)'
              : 'translateX(-18px)';
        }


        const observer =
          new IntersectionObserver(
            (
              entries
            ) => {
              entries.forEach(
                (
                  entry
                ) => {
                  if (
                    !entry.isIntersecting
                  ) {
                    return;
                  }


                  row.animate(
                    [
                      {
                        opacity:
                          0,

                        transform:
                          'translateY(22px)',
                      },

                      {
                        opacity:
                          1,

                        transform:
                          'translateY(0)',
                      },
                    ],

                    {
                      duration:
                        700,

                      easing:
                        'cubic-bezier(.18,.82,.22,1)',

                      fill:
                        'forwards',
                    }
                  );


                  if (image) {
                    image.animate(
                      [
                        {
                          filter:
                            'grayscale(.34) saturate(.72) brightness(1.06)',

                          transform:
                            'scale(1.035)',
                        },

                        {
                          filter:
                            'grayscale(0) saturate(1) brightness(1)',

                          transform:
                            'scale(1)',
                        },
                      ],

                      {
                        duration:
                          index === 2
                            ? 1200
                            : 900,

                        delay:
                          120,

                        easing:
                          'cubic-bezier(.18,.82,.22,1)',

                        fill:
                          'forwards',
                      }
                    );
                  }


                  if (copy) {
                    copy.animate(
                      [
                        {
                          opacity:
                            0,

                          transform:
                            index % 2 === 0
                              ? 'translateX(18px)'
                              : 'translateX(-18px)',
                        },

                        {
                          opacity:
                            1,

                          transform:
                            'translateX(0)',
                        },
                      ],

                      {
                        duration:
                          650,

                        delay:
                          220,

                        easing:
                          'cubic-bezier(.18,.82,.22,1)',

                        fill:
                          'forwards',
                      }
                    );
                  }


                  observer.disconnect();
                }
              );
            },

            {
              threshold:
                0.24,
            }
          );


        observer.observe(
          row
        );


        observers.push(
          observer
        );
      }
    );


    return () => {
      headerAnimations.forEach(
        (
          animation
        ) => {
          animation.cancel();
        }
      );


      observers.forEach(
        (
          observer
        ) => {
          observer.disconnect();
        }
      );
    };
  }, []);


  /*
  |--------------------------------------------------------------------------
  | OPEN / CLOSE "WHAT STAYED"
  |--------------------------------------------------------------------------
  */

  const toggleMemory = (
    index
  ) => {
    const opening =
      openMemory !==
      index;


    setOpenMemory(
      opening
        ? index
        : null
    );


    playSfx(
      '/audio/sfx/mood-sparkle.wav',

      {
        volume:
          opening
            ? 0.12
            : 0.07,

        playbackRate:
          opening
            ? 1.04
            : 0.96,
      }
    );
  };


  return html`
    <section
      ref=${pageRef}

      id="our-moments"

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

        <!-- ================================= -->
        <!-- HEADER -->
        <!-- ================================= -->

        <div
          className="
            max-w-3xl
          "
        >

          <div
            data-moments-header
          >
            <span
              className="
                birthday-chip
              "
            >
              FOUR FRAMES I STILL REMEMBER
            </span>
          </div>


          <h2
            data-moments-header

            className="
              section-title

              mt-5
            "
          >
            It didn’t happen

            <br />

            <span
              className="
                text-gradient
              "
            >
              all at once.
            </span>
          </h2>


          <p
            data-moments-header

            className="
              section-lead

              mt-5

              max-w-2xl
            "
          >
            I’m not making u relive our entire relationship
            timeline on your birthday 😭. These are just a
            few moments that somehow stayed unusually clear
            in my head.
          </p>

        </div>


        <!-- ================================= -->
        <!-- MOMENTS -->
        <!-- ================================= -->

        <div
          className="
            mt-12

            space-y-6
          "
        >

          ${
            MOMENTS.map(
              (
                item,
                index
              ) => {
                const isOpen =
                  openMemory ===
                  index;


                const isHovered =
                  hoveredMoment ===
                  index;


                return html`
                  <article
                    key=${item.key}

                    data-moment-row

                    className="
                      moment-row

                      group

                      relative
                    "

                    onMouseEnter=${() =>
                      setHoveredMoment(
                        index
                      )
                    }

                    onMouseLeave=${() =>
                      setHoveredMoment(
                        null
                      )
                    }
                  >

                    <!-- ============================= -->
                    <!-- IMAGE -->
                    <!-- ============================= -->

                    <div
                      className="
                        moment-image

                        relative

                        overflow-hidden
                      "
                    >

                      <img
                        data-moment-image

                        src=${item.image}

                        alt=${item.title}

                        loading="lazy"

                        className="
                          transition-transform

                          duration-700

                          group-hover:scale-[1.018]
                        "
                      />


                      <!--
                        Quiet image veil.
                        Keeps the little memory button readable.
                      -->

                      <div
                        className="
                          pointer-events-none

                          absolute

                          inset-0

                          bg-gradient-to-t

                          from-purple-950/20

                          via-transparent

                          to-transparent

                          transition-opacity

                          duration-500
                        "

                        style=${{
                          opacity:
                            isHovered ||
                            isOpen
                              ? 1
                              : 0.45,
                        }}
                      ></div>


                      <!--
                        Tiny expandable memory control.

                        This is deliberately small.
                        It should feel discovered,
                        not like another CTA.
                      -->

                      <button
                        type="button"

                        onClick=${() =>
                          toggleMemory(
                            index
                          )
                        }

                        aria-expanded=${isOpen}

                        aria-label=${
                          isOpen
                            ? `Close private memory for ${item.title}`
                            : `Open private memory for ${item.title}`
                        }

                        className="
                          absolute

                          bottom-4
                          right-4

                          z-20

                          flex

                          h-10
                          w-10

                          items-center

                          justify-center

                          rounded-full

                          border

                          border-white/80

                          bg-white/82

                          font-display

                          text-xl

                          text-purple-700

                          shadow-[0_10px_30px_rgba(74,39,95,.15)]

                          backdrop-blur-xl

                          transition-all

                          duration-300

                          hover:-translate-y-0.5

                          hover:bg-white

                          focus:outline-none

                          focus-visible:ring-4

                          focus-visible:ring-purple-200/50
                        "
                      >
                        <span
                          className="
                            transition-transform

                            duration-300
                          "

                          style=${{
                            transform:
                              isOpen
                                ? 'rotate(45deg)'
                                : 'rotate(0deg)',
                          }}
                        >
                          +
                        </span>
                      </button>


                      <!-- DESKTOP MICRO HINT -->

                      <div
                        className="
                          pointer-events-none

                          absolute

                          bottom-[4.25rem]
                          right-4

                          hidden

                          rounded-full

                          border

                          border-white/70

                          bg-white/78

                          px-3
                          py-1.5

                          text-[7px]

                          font-black

                          uppercase

                          tracking-[.14em]

                          text-purple-700/75

                          shadow-[0_8px_24px_rgba(74,39,95,.08)]

                          backdrop-blur-xl

                          transition-all

                          duration-300

                          md:block
                        "

                        style=${{
                          opacity:
                            isHovered &&
                            !isOpen
                              ? 1
                              : 0,

                          transform:
                            isHovered &&
                            !isOpen
                              ? 'translateY(0)'
                              : 'translateY(4px)',
                        }}
                      >
                        what stayed in my head
                      </div>

                    </div>


                    <!-- ============================= -->
                    <!-- COPY -->
                    <!-- ============================= -->

                    <div
                      data-moment-copy

                      className="
                        moment-copy
                      "
                    >

                      <p
                        className="
                          text-[10px]

                          font-bold

                          uppercase

                          tracking-[.22em]

                          text-purple-500
                        "
                      >
                        ${item.eyebrow}
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
                        ${item.title}
                      </h3>


                      <p
                        className="
                          mt-3

                          max-w-xl

                          text-sm

                          leading-6

                          text-purple-900/70

                          sm:text-base

                          sm:leading-7
                        "
                      >
                        ${item.body}
                      </p>


                      <!-- ============================= -->
                      <!-- EXPANDED LITTLE MEMORY -->
                      <!-- ============================= -->

                      <div
                        className="
                          overflow-hidden

                          transition-all

                          duration-500
                        "

                        style=${{
                          maxHeight:
                            isOpen
                              ? '220px'
                              : '0px',

                          opacity:
                            isOpen
                              ? 1
                              : 0,

                          transform:
                            isOpen
                              ? 'translateY(0)'
                              : 'translateY(8px)',

                          marginTop:
                            isOpen
                              ? '1.25rem'
                              : '0rem',
                        }}
                      >

                        <div
                          className="
                            max-w-xl

                            border-l-2

                            border-purple-200

                            pl-4
                          "
                        >

                          <p
                            className="
                              text-[8px]

                              font-black

                              uppercase

                              tracking-[.18em]

                              text-purple-400
                            "
                          >
                            WHAT STAYED IN MY HEAD
                          </p>


                          <p
                            className="
                              mt-2

                              font-display

                              text-lg

                              italic

                              leading-7

                              text-purple-800/78

                              sm:text-xl
                            "
                          >
                            ${item.memory}
                          </p>

                        </div>
                      </div>

                    </div>

                  </article>
                `;
              }
            )
          }

        </div>


        <!-- ================================= -->
        <!-- CTA -->
        <!-- ================================= -->

        <div
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
                'calls'
              )
            }
          >
            okay... apparently we could also never stop talking

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
      <!-- EXISTING SECRET HEARTS -->
      <!-- ================================= -->

      <${SecretHeart}
        id=${5}

        found=${found.has(
          5
        )}

        onFind=${onFindHeart}

        className="
          left-[9%]

          top-[18%]
        "
      />


      <${SecretHeart}
        id=${6}

        found=${found.has(
          6
        )}

        onFind=${onFindHeart}

        className="
          bottom-[8%]

          right-[10%]
        "
      />

    </section>
  `;
}