import { React, html } from '../lib/react.js';
import { SecretHeart } from '../components/SecretHeart.js';

export function PastLivesPage({ onContinue, found, onFindHeart }) {
  const pageRef = React.useRef(null);
  const letterRef = React.useRef(null);
  const rafRef = React.useRef(null);

  React.useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) return;

    const animations = [];

    const letter = letterRef.current;
    if (letter) {
      animations.push(
        letter.animate(
          [
            {
              opacity: 0,
              transform: 'translateY(28px) scale(.985) rotate(.35deg)',
              filter: 'blur(7px)',
            },
            {
              opacity: 1,
              transform: 'translateY(0) scale(1) rotate(0deg)',
              filter: 'blur(0)',
            },
          ],
          {
            duration: 1050,
            delay: 120,
            easing: 'cubic-bezier(.18,.82,.22,1)',
            fill: 'both',
          }
        )
      );
    }

    const reveals = page.querySelectorAll('[data-past-reveal]');
    reveals.forEach((el, index) => {
      animations.push(
        el.animate(
          [
            {
              opacity: 0,
              transform: 'translateY(14px)',
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
            delay: 220 + index * 110,
            easing: 'cubic-bezier(.18,.82,.22,1)',
            fill: 'both',
          }
        )
      );
    });

    const title = page.querySelector('[data-past-title]');
    if (title) {
      animations.push(
        title.animate(
          [
            {
              opacity: 0,
              transform: 'translateY(12px) scale(.985)',
              letterSpacing: '.02em',
              filter: 'blur(5px)',
            },
            {
              opacity: 1,
              transform: 'translateY(0) scale(1)',
              letterSpacing: '0em',
              filter: 'blur(0)',
            },
          ],
          {
            duration: 980,
            delay: 300,
            easing: 'cubic-bezier(.16,.84,.22,1)',
            fill: 'both',
          }
        )
      );
    }

    const bodyLines = page.querySelectorAll('[data-past-line]');
    bodyLines.forEach((el, index) => {
      animations.push(
        el.animate(
          [
            {
              opacity: 0,
              transform: 'translateY(10px)',
              filter: 'blur(3px)',
            },
            {
              opacity: 1,
              transform: 'translateY(0)',
              filter: 'blur(0)',
            },
          ],
          {
            duration: 760,
            delay: 620 + index * 125,
            easing: 'cubic-bezier(.18,.82,.22,1)',
            fill: 'both',
          }
        )
      );
    });

    const joke = page.querySelector('[data-past-joke]');
    if (joke) {
      animations.push(
        joke.animate(
          [
            {
              opacity: 0,
              transform: 'translateY(8px) rotate(-4deg) scale(.96)',
            },
            {
              opacity: 1,
              transform: 'translateY(0) rotate(-2deg) scale(1)',
            },
          ],
          {
            duration: 760,
            delay: 1520,
            easing: 'cubic-bezier(.18,.82,.22,1)',
            fill: 'both',
          }
        )
      );
    }

    const quoteBox = page.querySelector('[data-past-quote]');
    if (quoteBox) {
      animations.push(
        quoteBox.animate(
          [
            {
              opacity: 0,
              transform: 'translateY(18px) scale(.985)',
              filter: 'blur(4px)',
            },
            {
              opacity: 1,
              transform: 'translateY(0) scale(1)',
              filter: 'blur(0)',
            },
          ],
          {
            duration: 860,
            delay: 1700,
            easing: 'cubic-bezier(.18,.82,.22,1)',
            fill: 'both',
          }
        )
      );
    }

    const cta = page.querySelector('[data-past-cta]');
    if (cta) {
      animations.push(
        cta.animate(
          [
            {
              opacity: 0,
              transform: 'translateY(12px)',
              filter: 'blur(3px)',
            },
            {
              opacity: 1,
              transform: 'translateY(0)',
              filter: 'blur(0)',
            },
          ],
          {
            duration: 760,
            delay: 1970,
            easing: 'cubic-bezier(.18,.82,.22,1)',
            fill: 'both',
          }
        )
      );
    }

    if (letter && window.innerWidth >= 900) {
      const float = letter.animate(
        [
          { transform: 'translateY(0px)' },
          { transform: 'translateY(-4px)' },
          { transform: 'translateY(0px)' },
        ],
        {
          duration: 5600,
          iterations: Infinity,
          easing: 'ease-in-out',
        }
      );
      animations.push(float);
    }

    return () => {
      animations.forEach((animation) => animation.cancel());
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handlePointerMove = (event) => {
    if (window.innerWidth < 900) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const letter = letterRef.current;
      if (!letter) return;

      const rect = letter.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      letter.style.transform = `
        perspective(1200px)
        rotateX(${y * -1.8}deg)
        rotateY(${x * 2.2}deg)
        translateY(-1px)
      `;
    });
  };

  const handlePointerLeave = () => {
    cancelAnimationFrame(rafRef.current);
    if (letterRef.current) {
      letterRef.current.style.transform =
        'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
    }
  };

  return html`
    <section
      ref=${pageRef}
      id="past-lives"
      className="scene relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28"
    >
      <!-- background -->
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#f8f1e7]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.78),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(187,128,218,.10),transparent_28%),linear-gradient(180deg,rgba(255,249,241,.92),rgba(242,233,220,.94))]"></div>
        <div className="absolute inset-0 opacity-[.18] bg-[linear-gradient(transparent_0%,rgba(120,76,42,.03)_48%,transparent_100%)]"></div>
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#ead9c4]/45 blur-3xl"></div>
        <div className="absolute -right-24 bottom-8 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div
          ref=${letterRef}
          onPointerMove=${handlePointerMove}
          onPointerLeave=${handlePointerLeave}
          className="old-letter relative mx-auto max-w-3xl overflow-hidden rounded-[2.2rem] border border-[#d7c2a7]/70 bg-[linear-gradient(180deg,rgba(250,244,234,.98),rgba(243,232,214,.96))] p-6 shadow-[0_20px_60px_rgba(101,61,33,.12),0_2px_10px_rgba(101,61,33,.08)] transition-transform duration-500 ease-out sm:p-10 md:p-14"
        >
          <!-- soft paper tint -->
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.72),transparent_35%),linear-gradient(135deg,rgba(179,136,255,.06),transparent_25%,transparent_75%,rgba(183,111,167,.05))]"></div>

          <!-- fake stamp -->
          <div className="pointer-events-none absolute right-5 top-5 rounded-full border border-[#b68d5a]/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-[#9a7351]/55 rotate-[10deg]">
            private letter
          </div>

          <div className="relative z-10">
            <p
              data-past-reveal
              className="text-center text-xs font-bold uppercase tracking-[.28em] text-purple-500"
            >
              A SMALL QUESTION FROM ANOTHER CENTURY
            </p>

            <h2
              data-past-title
              className="mt-6 text-center font-display text-[clamp(3.5rem,8vw,6.5rem)] font-semibold leading-[.86] tracking-[-.05em] text-plum"
            >
              What if we had<br />
              <span className="italic text-purple-700">missed each other this time?</span>
            </h2>

            <div className="mx-auto mt-9 max-w-xl space-y-5 font-display text-2xl italic leading-9 text-plum/85">
              <p data-past-line>My dearest stranger,</p>
              <p data-past-line>It is rather inconvenient to miss someone one has not yet met.</p>
              <p data-past-line>Still, I think somewhere I would have looked for a woman whose laugh felt familiar before I knew her name.</p>
              <p data-past-line>Perhaps in a street. Perhaps in church. Perhaps a friend would have enough sense to introduce us.</p>
              <p data-past-line>And perhaps I would still take an unreasonable amount of time to realize what was happening.</p>
            </div>

            <p
              data-past-joke
              className="mt-8 rotate-[-2deg] text-center text-sm font-bold text-fuchsia-600"
            >
              okay why am I getting attacked in 1962 too 😭
            </p>

            <div
              data-past-quote
              className="mt-10 rounded-2xl border border-purple-200/50 bg-purple-50/80 p-5 text-center shadow-[0_10px_30px_rgba(124,67,172,.08)]"
            >
              <p className="font-display text-3xl italic text-plum">
                I do not know if fate works like that.
              </p>
              <p className="mt-2 text-sm leading-6 text-purple-900/70">
                I just like the thought that if the phones, apps, cafés and years changed… I would still end up wanting to know you.
              </p>
            </div>
          </div>
        </div>

        <div data-past-cta className="mt-10 flex justify-center">
          <button
            type="button"
            className="secondary-cta group inline-flex items-center gap-2"
            onClick=${() => onContinue('future')}
          >
            back to the century where MERCEDES exists
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>

      <${SecretHeart}
        id=${16}
        found=${found.has(16)}
        onFind=${onFindHeart}
        className="left-[6%] top-[25%]"
      />
    </section>
  `;
}