import { React, html } from '../lib/react.js';

export function SceneGate({
  sceneKey,
  children,
  canGoBack = false,
  onBack,
  backLabel = 'back',
  direction = 'forward',
}) {
  const gateRef = React.useRef(null);
  const [edgeHint, setEdgeHint] = React.useState(false);
  const hintTimerRef = React.useRef(null);
  const touchStartRef = React.useRef(null);

  React.useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const oldRootOverflow = root.style.overflow;
    const oldBodyOverflow = body.style.overflow;
    const oldBodyOverscroll = body.style.overscrollBehavior;

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';

    if (gateRef.current) {
      gateRef.current.scrollTop = 0;
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let arrivalAnimation = null;

    if (!reduceMotion && gateRef.current) {
      const offset = direction === 'back' ? '-8px' : '8px';

      arrivalAnimation = gateRef.current.animate(
        [
          {
            opacity: 0,
            transform: `translateY(${offset})`,
          },
          {
            opacity: 1,
            transform: 'translateY(0)',
          },
        ],
        {
          duration: 420,
          easing: 'cubic-bezier(.18,.82,.22,1)',
          fill: 'both',
        }
      );
    }

    return () => {
      arrivalAnimation?.cancel();
      clearTimeout(hintTimerRef.current);

      root.style.overflow = oldRootOverflow;
      body.style.overflow = oldBodyOverflow;
      body.style.overscrollBehavior = oldBodyOverscroll;
    };
  }, [sceneKey, direction]);

  const showEdgeHint = () => {
    setEdgeHint(true);
    clearTimeout(hintTimerRef.current);

    hintTimerRef.current = setTimeout(() => {
      setEdgeHint(false);
    }, 1100);
  };

  const atBottom = (element) => {
    return (
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - 2
    );
  };

  const onWheel = (event) => {
    const gate = event.currentTarget;

    if (event.deltaY > 0 && atBottom(gate)) {
      showEdgeHint();
    }
  };

  const onTouchStart = (event) => {
    const touch = event.touches?.[0];
    if (!touch) return;

    touchStartRef.current = {
      y: touch.clientY,
    };
  };

  const onTouchEnd = (event) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches?.[0];

    touchStartRef.current = null;

    if (!start || !touch || !gateRef.current) return;

    const dy = touch.clientY - start.y;

    if (dy < -38 && atBottom(gateRef.current)) {
      showEdgeHint();
    }
  };

  return html`
    <div
      ref=${gateRef}
      data-scene=${sceneKey}
      onWheel=${onWheel}
      onTouchStart=${onTouchStart}
      onTouchEnd=${onTouchEnd}
      className="
        relative
        h-[100svh]
        w-full
        overflow-x-hidden
        overflow-y-auto
        overscroll-contain
        scroll-smooth
      "
      style=${{
        WebkitOverflowScrolling: 'touch',
      }}
    >
      ${
        canGoBack
          ? html`
              <div
                className="
                  fixed
                  left-[max(.7rem,env(safe-area-inset-left))]
                  top-[max(.7rem,env(safe-area-inset-top))]
                  z-[900]
                "
              >
                <button
                  type="button"
                  onClick=${onBack}
                  aria-label=${backLabel}
                  title=${backLabel}
                  className="
                    group
                    flex
                    h-10
                    items-center
                    overflow-hidden
                    rounded-full
                    border border-white/78
                    bg-white/62
                    text-purple-700
                    shadow-[0_10px_30px_rgba(74,39,95,.10)]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-white/90
                    hover:shadow-[0_15px_38px_rgba(74,39,95,.14)]
                    focus:outline-none
                    focus-visible:ring-4
                    focus-visible:ring-purple-200/40
                  "
                >
                  <span
                    className="
                      grid
                      h-10 w-10
                      shrink-0
                      place-items-center
                      font-display
                      text-lg
                      leading-none
                      transition-transform
                      duration-300
                      group-hover:-translate-x-[1px]
                    "
                  >
                    ←
                  </span>

                  <span
                    className="
                      max-w-0
                      overflow-hidden
                      whitespace-nowrap
                      pr-0
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[.14em]
                      text-purple-600/75
                      opacity-0
                      transition-all
                      duration-300
                      group-hover:max-w-[12rem]
                      group-hover:pr-4
                      group-hover:opacity-100
                    "
                  >
                    ${backLabel}
                  </span>
                </button>
              </div>
            `
          : null
      }

      ${children}

      <div
        className="
          pointer-events-none
          fixed
          bottom-[max(1rem,env(safe-area-inset-bottom))]
          left-1/2
          z-[950]
          -translate-x-1/2
          transition-all
          duration-300
        "
        style=${{
          opacity: edgeHint ? 1 : 0,
          transform: edgeHint
            ? 'translate(-50%, 0)'
            : 'translate(-50%, 7px)',
        }}
      >
        <div
          className="
            whitespace-nowrap
            rounded-full
            border border-purple-100
            bg-white/90
            px-4 py-2
            text-[8px]
            font-black
            uppercase
            tracking-[.14em]
            text-purple-600
            shadow-[0_14px_38px_rgba(74,39,95,.12)]
            backdrop-blur-xl
          "
        >
          not yet 😭 · use the button
        </div>
      </div>
    </div>
  `;
}
