import { React, html } from '../lib/react.js';
import { media } from '../config.js';
import { SecretHeart } from '../components/SecretHeart.js';

/*
|--------------------------------------------------------------------------
| IMPORTANT
|--------------------------------------------------------------------------
|
| Add these to config.js / media if they are not there yet:
|
| concert: '/media/photos/concert.jpg',
| airport: '/media/photos/airport.jpg',
|
*/

const PLACES = [
  {
    name: 'Library',
    media: media.library,
    emoji: '📚',
    hint: 'movie nights somehow became a whole thing',
    line:
      'I don’t think libraries were designed for the amount of romance we somehow managed to attach to this one 😭. Movie nights, sitting together, doing almost nothing... and somehow I still remember them.',
  },

  {
    name: 'Basketball',
    media: media.basketball,
    emoji: '🏀',
    hint: 'apparently this also became a date',
    line:
      'Somehow even basketball made the list 😂. I like that not every memory with u needed some dramatic romantic plan. Sometimes we were just doing something together and that was enough.',
  },

  {
    name: 'Bowling',
    media: media.bowling,
    emoji: '🎳',
    hint: 'competitive behavior was observed',
    line:
      'I remember the fun more than whoever actually won... which is convenient because I can now confidently rewrite history in my favor 😭.',
  },

  {
    name: 'Cinema',
    media: media.cinema,
    emoji: '🎬',
    hint: 'we really kept coming back here',
    line:
      'Three cinema dates is enough evidence that apparently putting us in a dark room with a giant screen was a recurring activity 😂. I probably remember parts of being there with u better than some of the movies.',
  },

  {
    name: 'First Concert',
    media: media.concert,
    emoji: '🎶',
    hint: 'loud place... soft memory',
    line:
      'Concerts are supposed to be about the music, but this one stayed with me because u were there. It felt loud everywhere else and still somehow personal where we stood.',
  },

  {
    name: 'Kukuye',
    media: media.kukuye,
    emoji: '🌷',
    hint: 'this one feels very us',
    line:
      'Kukuye is one of those memories that feels warm before I even properly think about what happened there. Some places just end up carrying a whole feeling with them.',
  },

  {
    name: 'Ginfle',
    media: media.ginfle,
    emoji: '😭',
    hint: 'this day became way more memorable than planned',
    line:
      'Okay... tiny side story 😂. We were apparently so busy being romantic and distracted with each other that BOTH of our phones got stolen 😭. Two people. Two phones. Same day. Absolutely elite awareness of our surroundings. Still one of the most ridiculous endings to a romantic day we have managed so far.',
  },

  {
    name: 'Airport',
    media: media.airport,
    emoji: '✈️',
    hint: 'the last one before Gondar',
    line:
      'This one hit differently. It was our latest memory together before I came to Gondar, and u made that moment feel heavier, sweeter, and harder to forget than I expected. I still remember that feeling.',
  },
];

export class PlacesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: '',
    };

    this.pageRef = null;
    this.observers = [];
    this.headerAnimations = [];
  }

  componentDidMount() {
    this.animateHeader();
    this.observeCards();
  }

  componentWillUnmount() {
    this.headerAnimations.forEach((animation) => animation.cancel());
    this.observers.forEach((observer) => observer.disconnect());
  }

  prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  animateHeader = () => {
    if (!this.pageRef || this.prefersReducedMotion()) return;

    const elements = this.pageRef.querySelectorAll('[data-places-header]');

    elements.forEach((element, index) => {
      const animation = element.animate(
        [
          {
            opacity: 0,
            transform: 'translateY(18px)',
            filter: 'blur(4px)',
          },
          {
            opacity: 1,
            transform: 'translateY(0)',
            filter: 'blur(0)',
          },
        ],
        {
          duration: 720,
          delay: 80 + index * 110,
          easing: 'cubic-bezier(.18,.82,.22,1)',
          fill: 'both',
        }
      );

      this.headerAnimations.push(animation);
    });
  };

  observeCards = () => {
    if (!this.pageRef) return;

    const cards = this.pageRef.querySelectorAll('[data-place-card]');

    if (this.prefersReducedMotion()) {
      cards.forEach((card) => {
        card.style.opacity = '1';
      });
      return;
    }

    cards.forEach((card, index) => {
      const image = card.querySelector('[data-place-image]');

      card.style.opacity = '0';

      if (image) {
        image.style.filter = 'saturate(.72) brightness(1.04)';
        image.style.transform = 'scale(1.045)';
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            card.animate(
              [
                {
                  opacity: 0,
                  transform: 'translateY(26px) scale(.985)',
                },
                {
                  opacity: 1,
                  transform: 'translateY(0) scale(1)',
                },
              ],
              {
                duration: 680,
                delay: Math.min(index, 2) * 65,
                easing: 'cubic-bezier(.18,.82,.22,1)',
                fill: 'forwards',
              }
            );

            if (image) {
              image.animate(
                [
                  {
                    filter: 'saturate(.72) brightness(1.04)',
                    transform: 'scale(1.045)',
                  },
                  {
                    filter: 'saturate(1) brightness(1)',
                    transform: 'scale(1)',
                  },
                ],
                {
                  duration: 950,
                  delay: 100,
                  easing: 'cubic-bezier(.18,.82,.22,1)',
                  fill: 'forwards',
                }
              );
            }

            observer.disconnect();
          });
        },
        { threshold: 0.18 }
      );

      observer.observe(card);
      this.observers.push(observer);
    });
  };

  togglePlace = (name, event) => {
  /*
  |--------------------------------------------------------------------------
  | IMPORTANT
  |--------------------------------------------------------------------------
  |
  | Capture the actual DOM element NOW.
  |
  | event.currentTarget is only reliable while
  | the click handler itself is running.
  |
  */

  const card =
    event.currentTarget;

  const opening =
    this.state.open !==
    name;


  this.setState(
    {
      open:
        opening
          ? name
          : '',
    },

    () => {
      /*
      |--------------------------------------------------------------------------
      | NOTHING ELSE TO DO WHEN CLOSING
      |--------------------------------------------------------------------------
      */

      if (
        !opening ||
        this.prefersReducedMotion()
      ) {
        return;
      }


      /*
      |--------------------------------------------------------------------------
      | SAFETY
      |--------------------------------------------------------------------------
      */

      if (!card) {
        return;
      }


      const image =
        card.querySelector(
          '[data-place-image]'
        );


      const note =
        card.querySelector(
          '[data-place-extra]'
        );


      /*
      |--------------------------------------------------------------------------
      | CARD RESPONSE
      |--------------------------------------------------------------------------
      */

      card.animate(
        [
          {
            transform:
              'scale(1)',
          },

          {
            transform:
              'scale(1.012)',
          },

          {
            transform:
              'scale(1)',
          },
        ],

        {
          duration:
            420,

          easing:
            'cubic-bezier(.34,1.56,.64,1)',
        }
      );


      /*
      |--------------------------------------------------------------------------
      | IMAGE PUSH-IN
      |--------------------------------------------------------------------------
      */

      if (image) {
        image.animate(
          [
            {
              transform:
                'scale(1)',
            },

            {
              transform:
                'scale(1.035)',
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
      }


      /*
      |--------------------------------------------------------------------------
      | NOTE REVEAL
      |--------------------------------------------------------------------------
      */

      if (note) {
        note.animate(
          [
            {
              opacity:
                0,

              transform:
                'translateY(10px)',

              filter:
                'blur(3px)',
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
              480,

            delay:
              90,

            easing:
              'cubic-bezier(.18,.82,.22,1)',
          }
        );
      }
    }
  );
};

  render() {
    const { onContinue, found, onFindHeart } = this.props;

    return html`
      <section
        ref=${(element) => {
          this.pageRef = element;
        }}
        id="places"
        className="scene relative px-4 py-20 sm:px-6 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div data-places-header>
              <span className="birthday-chip">ADDIS, BUT PERSONAL</span>
            </div>

            <h2 data-places-header className="section-title mt-5">
              A city full of
              <br />
              <span className="text-gradient">little versions of us.</span>
            </h2>

            <p data-places-header className="section-lead mx-auto mt-5 max-w-2xl">
              Some places are just places until somebody happens there with u. Then suddenly Addis has locations I can’t look at normally anymore.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            ${PLACES.map((item) => {
              const isOpen = this.state.open === item.name;

              return html`
                <button
                  key=${item.name}
                  type="button"
                  data-place-card
                  className=${`place-card group ${isOpen ? 'is-open' : ''}`}
                  aria-expanded=${isOpen}
                  onClick=${(event) => this.togglePlace(item.name, event)}
                >
                  <img
                    data-place-image
                    src=${item.media}
                    alt=${`${item.name} memory`}
                    loading="lazy"
                    className="transition-transform duration-700"
                  />

                  <div className="place-copy">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                        ${item.emoji}
                      </span>

                      <h3 className="font-display text-3xl font-semibold">
                        ${item.name}
                      </h3>
                    </div>

                    <p className="mt-1 text-xs font-semibold text-white/75">
                      ${isOpen ? 'tap again to close' : 'Tap to read the tiny note'}
                    </p>

                    <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[.12em] text-white/55">
                      ${item.hint}
                    </p>

                    <div data-place-extra className="place-extra">
                      <div className="mt-3 border-t border-white/20 pt-3">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="h-px w-5 bg-white/40"></span>

                          <span className="text-[8px] font-black uppercase tracking-[.18em] text-white/60">
                            ${item.name === 'Ginfle' ? 'TINY SIDE STORY 😂' : 'WHAT I REMEMBER'}
                          </span>
                        </div>

                        <p className="text-sm leading-6 text-white/92">
                          ${item.line}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              `;
            })}
          </div>

          <div data-places-header className="mt-10 flex justify-center">
            <button
              type="button"
              className="secondary-cta group/next inline-flex items-center gap-2"
              onClick=${() => onContinue('feb13')}
            >
              open one very private page
              <span className="transition-transform duration-300 group-hover/next:translate-x-1">→</span>
            </button>
          </div>
        </div>

        <${SecretHeart}
          id=${9}
          found=${found.has(9)}
          onFind=${onFindHeart}
          className="left-[5%] top-[30%]"
        />

        <${SecretHeart}
          id=${10}
          found=${found.has(10)}
          onFind=${onFindHeart}
          className="right-[7%] bottom-[12%]"
        />
      </section>
    `;
  }
}