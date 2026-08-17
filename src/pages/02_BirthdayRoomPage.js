import { React, html } from '../lib/react.js';
import { playAudio, playSfx } from '../lib/audio.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;

const ease = (t) => {
  const x = clamp(t, 0, 1);
  return 1 - Math.pow(1 - x, 4);
};

const SCENE_WIDTH = 1672;
const SCENE_HEIGHT = 941;

const ZOOM_STEP = 0.055;
const MAX_MANUAL_ZOOM = 0.20;
const MIN_MANUAL_ZOOM = -0.07;

const CAMERA_DURATION_MIN = 900;
const CAMERA_DURATION_MAX = 1400;
const ZOOM_DURATION = 460;

const VIEWS = [
  {
    id: 'room',
    x: 50,
    y: 50,
    scale: 1,
    label: 'whole room',
    kicker: 'A TINY PREVIEW OF SOMEDAY',
    title: 'I built u a little piece of a future dream.',
    body:
      'Not the real one yet 😭... just one room made from little things that somehow feel like u.',
    description: 'top-left',
    controls: 'bottom',
    arrow: false,
  },
  {
    id: 'car',
    x: 77,
    y: 12,
    scale: 1.18,
    label: 'Formula 1',
    kicker: 'OF COURSE THIS MADE IT IN',
    title: '63 had to get a proper shelf.',
    body:
      'I know how much F1 makes u light up, so obviously it deserved its own little corner 😂',
    description: 'bottom-left',
    controls: 'bottom',
  },
  {
    id: 'hat',
    x: 73.5,
    y: 21.5,
    scale: 1.19,
    label: '#63',
    kicker: 'ONE VERY SPECIFIC NUMBER',
    title: 'and yeah... the 63 stays.',
    body:
      'A tiny George Russell detail because apparently I actually remember the suspiciously specific things u love.',
    description: 'bottom-left',
    controls: 'bottom',
  },
  {
    id: 'lana',
    x: 80.5,
    y: 41.5,
    scale: 1.17,
    label: 'Lana mood',
    kicker: 'MORE OF A FEELING THAN AN OBJECT',
    title: 'some parts of u feel like a whole soundtrack.',
    body:
      'Soft, dramatic, feminine, old-soul... I wanted one little corner to carry that Lana kind of atmosphere.',
    description: 'top-left',
    controls: 'bottom',
  },
  {
    id: 'record',
    x: 76,
    y: 88,
    scale: 1.18,
    label: 'record player',
    kicker: 'THE ROOM NEEDED A SOUND',
    title: 'something here had to feel nostalgic.',
    body:
      'Because a room that reminds me of u should have music somewhere in it too... soft, warm and playing in the background.',
    description: 'top-left',
    controls: 'top',
  },
  {
    id: 'mirror',
    x: 92,
    y: 28,
    scale: 1.16,
    label: 'mirror',
    kicker: 'VERY OBVIOUS REASON',
    title: 'this was meant to hold the prettiest thing here.',
    body:
      'I could decorate every corner perfectly and the mirror would still win the second u stand in front of it.',
    description: 'bottom-left',
    controls: 'bottom',
  },
  {
    id: 'key',
    x: 19,
    y: 88,
    scale: 1.18,
    label: 'MERCEDES key + glass',
    kicker: 'A SMALL FUTURE DETAIL',
    title: 'I let one little future flex sneak in.',
    body:
      'Not some dramatic promise... just me imagining u grown, doing well, enjoying life and having nice things that are completely yours.',
    description: 'top-right',
    controls: 'top',
  },
  {
    id: 'clothes',
    x: 58,
    y: 66,
    scale: 1.15,
    label: 'your style',
    kicker: 'BECAUSE U WOULD ACTUALLY LIVE HERE',
    title: 'the room needed your clothes too.',
    body:
      'Soft purple, something relaxed, something feminine... otherwise this would just be a pretty showroom instead of your room.',
    description: 'top-left',
    controls: 'bottom',
  },
  {
    id: 'begena',
    x: 18,
    y: 50,
    scale: 1.18,
    label: 'Begena',
    kicker: 'THIS ONE WAS NON-NEGOTIABLE',
    title: 'some things about u feel timeless.',
    body:
      'The Begena belongs here because it carries that quiet, rooted, old-soul side of u that a normal pretty bedroom could never explain.',
    description: 'top-right',
    controls: 'bottom',
  },
  {
    id: 'roses',
    x: 7.5,
    y: 45,
    scale: 1.17,
    label: 'roses',
    kicker: 'ROOM RULES',
    title: 'there was never going to be just one flower.',
    body:
      'Roses, pink flowers, soft little details everywhere... because flowers somehow always make the room feel more like u.',
    description: 'top-right',
    controls: 'bottom',
  },
  {
    id: 'teddy',
    x: 29,
    y: 67,
    scale: 1.18,
    label: 'little bear',
    kicker: 'U KNOW THIS GUY 💛',
    title: 'the little lemon guy survived every redesign.',
    body:
      'Because he is not random decoration to me. He is one of those tiny real things between us that deserves to stay.',
    description: 'top-right',
    controls: 'bottom',
  },
  {
    id: 'faith',
    x: 38,
    y: 16,
    scale: 1.16,
    label: 'faith',
    kicker: 'THE QUIETEST PART OF THE ROOM',
    title: 'this belongs here because it belongs to who u are.',
    body:
      'Your faith did not need some huge dramatic setup. Just something calm, respectful and quietly present.',
    description: 'bottom-right',
    controls: 'bottom',
  },
  {
    id: 'door',
    x: 53.5,
    y: 31,
    scale: 1.17,
    label: 'the door',
    kicker: 'LAST STOP',
    title: 'okay... this one actually goes somewhere.',
    body:
      'That is everything I wanted u to see in here. When you are ready... open it and come with me.',
    description: 'top-left',
    controls: 'bottom',
  },
];

const WALKTHROUGH = [
  {
    action: 'next',
    title: 'start here 😭',
    body: 'tap this arrow once. I’ll move the room for u.',
  },
  {
    action: 'zoom-in',
    title: 'now get closer.',
    body: 'tap + once. zoom always stays centered on what we’re actually looking at.',
  },
  {
    action: 'info',
    title: 'these little notes are optional.',
    body: 'tap i once. it hides my explanations. u can turn them back on whenever u want.',
  },
  {
    action: 'help',
    title: 'last thing.',
    body: 'tap ? once. if u forget anything, this explains the controls.',
  },
];

export class BirthdayRoomPage extends React.Component {
  constructor(props) {
    super(props);

    let walkthroughDone = false;

    try {
      walkthroughDone =
        window.localStorage.getItem('fendisha-room-walkthrough') === 'done';
    } catch (error) {
      walkthroughDone = false;
    }

    this.state = {
      currentView: 0,

      cameraX: VIEWS[0].x,
      cameraY: VIEWS[0].y,
      cameraScale: VIEWS[0].scale,

      manualZoom: 0,

      pointerX: 0,
      pointerY: 0,

      helpOpen: false,
      introVisible: true,
      showDescriptions: true,

      walkthroughDone,
      walkthroughStep: walkthroughDone ? -1 : 0,

      transitioning: false,
      transitionPhase: 0,

      viewportVersion: 0,
    };

    this.ambient = null;

    this.animRaf = null;
    this.pointerRaf = null;

    this.introTimer = null;
    this.transitionTimer = null;
    this.pageTimer = null;

    this.touchStart = null;
  }

  componentDidMount() {
    window.addEventListener('pointermove', this.onPointerMove, {
      passive: true,
    });

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('resize', this.onResize);

    this.ambient = playAudio('/audio/sfx/birthday-room-ambience.wav', {
      volume: 0.14,
      loop: true,
    });

    this.introTimer = setTimeout(() => {
      this.setState({
        introVisible: false,
      });
    }, 7000);
  }

  componentWillUnmount() {
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('resize', this.onResize);

    cancelAnimationFrame(this.animRaf);
    cancelAnimationFrame(this.pointerRaf);

    clearTimeout(this.introTimer);
    clearTimeout(this.transitionTimer);
    clearTimeout(this.pageTimer);

    if (this.ambient) {
      this.ambient.pause();
      this.ambient = null;
    }
  }

  onResize = () => {
    this.setState((state) => ({
      viewportVersion: state.viewportVersion + 1,
    }));
  };

  onPointerMove = (event) => {
    if (this.state.transitioning) return;

    cancelAnimationFrame(this.pointerRaf);

    this.pointerRaf = requestAnimationFrame(() => {
      const x = clamp(
        (event.clientX / window.innerWidth - 0.5) * 2,
        -1,
        1
      );

      const y = clamp(
        (event.clientY / window.innerHeight - 0.5) * 2,
        -1,
        1
      );

      this.setState({
        pointerX: x,
        pointerY: y,
      });
    });
  };

  onKeyDown = (event) => {
    if (
      this.state.helpOpen ||
      this.state.transitioning ||
      !this.state.walkthroughDone
    ) {
      return;
    }

    if (event.key === 'ArrowRight') {
      this.nextView();
    }

    if (event.key === 'ArrowLeft') {
      this.previousView();
    }

    if (event.key === '+' || event.key === '=') {
      this.zoomIn();
    }

    if (event.key === '-') {
      this.zoomOut();
    }

    if (event.key.toLowerCase() === 'i') {
      this.toggleDescriptions();
    }

    if (event.key === 'Escape' || event.key === 'Home') {
      this.goHome();
    }
  };

  dismissIntro = () => {
    clearTimeout(this.introTimer);

    this.setState({
      introVisible: false,
    });
  };

  getWalkthroughAction = () => {
    if (
      this.state.walkthroughDone ||
      this.state.walkthroughStep < 0
    ) {
      return null;
    }

    return (
      WALKTHROUGH[
        this.state.walkthroughStep
      ]?.action || null
    );
  };

  advanceWalkthrough = (action) => {
    if (this.state.walkthroughDone) {
      return true;
    }

    const expected =
      this.getWalkthroughAction();

    if (expected !== action) {
      return false;
    }

    const nextStep =
      this.state.walkthroughStep + 1;

    if (
      nextStep >=
      WALKTHROUGH.length
    ) {
      try {
        window.localStorage.setItem(
          'fendisha-room-walkthrough',
          'done'
        );
      } catch (error) {
        // continue normally
      }

      this.setState({
        walkthroughDone: true,
        walkthroughStep: -1,
        showDescriptions: true,
      });

      return true;
    }

    this.setState({
      walkthroughStep:
        nextStep,
    });

    return true;
  };

  resetWalkthrough = () => {
    try {
      window.localStorage.removeItem(
        'fendisha-room-walkthrough'
      );
    } catch (error) {
      // no-op
    }

    this.setState({
      walkthroughDone: false,
      walkthroughStep: 0,
      helpOpen: false,
      showDescriptions: true,
      introVisible: false,
    });
  };

  animateCamera = (
    targetIndex,
    targetZoom = 0
  ) => {
    if (
      this.state.transitioning
    ) {
      return;
    }

    cancelAnimationFrame(
      this.animRaf
    );

    const target =
      VIEWS[targetIndex];

    const startX =
      this.state.cameraX;

    const startY =
      this.state.cameraY;

    const startScale =
      this.state.cameraScale;

    const endScale =
      target.scale +
      targetZoom;

    const distance =
      Math.abs(
        target.x -
          startX
      ) +
      Math.abs(
        target.y -
          startY
      );

    const duration =
      clamp(
        760 +
          distance * 7,

        CAMERA_DURATION_MIN,

        CAMERA_DURATION_MAX
      );

    const startedAt =
      performance.now();

    this.setState({
      currentView:
        targetIndex,

      manualZoom:
        targetZoom,

      introVisible:
        false,
    });

    const tick = (now) => {
      const t =
        ease(
          (
            now -
            startedAt
          ) /
            duration
        );

      this.setState({
        cameraX:
          lerp(
            startX,
            target.x,
            t
          ),

        cameraY:
          lerp(
            startY,
            target.y,
            t
          ),

        cameraScale:
          lerp(
            startScale,
            endScale,
            t
          ),
      });

      if (
        t <
        0.999
      ) {
        this.animRaf =
          requestAnimationFrame(
            tick
          );
      } else {
        this.setState({
          cameraX:
            target.x,

          cameraY:
            target.y,

          cameraScale:
            endScale,
        });
      }
    };

    this.animRaf =
      requestAnimationFrame(
        tick
      );

    playSfx(
      '/audio/sfx/mood-sparkle.wav',
      {
        volume: 0.07,
        playbackRate: 0.92,
      }
    );
  };

  animateZoom = (
    targetZoom
  ) => {
    if (
      this.state.transitioning
    ) {
      return;
    }

    cancelAnimationFrame(
      this.animRaf
    );

    const view =
      VIEWS[
        this.state.currentView
      ];

    const startScale =
      this.state.cameraScale;

    const startX =
      this.state.cameraX;

    const startY =
      this.state.cameraY;

    const targetScale =
      Math.max(
        1,
        view.scale +
          targetZoom
      );

    const startedAt =
      performance.now();

    const tick = (now) => {
      const t =
        ease(
          (
            now -
            startedAt
          ) /
            ZOOM_DURATION
        );

      this.setState({
        cameraX:
          lerp(
            startX,
            view.x,
            t
          ),

        cameraY:
          lerp(
            startY,
            view.y,
            t
          ),

        cameraScale:
          lerp(
            startScale,
            targetScale,
            t
          ),
      });

      if (
        t <
        0.999
      ) {
        this.animRaf =
          requestAnimationFrame(
            tick
          );
      } else {
        this.setState({
          cameraX:
            view.x,

          cameraY:
            view.y,

          cameraScale:
            targetScale,
        });
      }
    };

    this.animRaf =
      requestAnimationFrame(
        tick
      );
  };

  previousView = () => {
    if (
      this.state.transitioning
    ) {
      return;
    }

    if (
      !this.state.walkthroughDone
    ) {
      return;
    }

    const nextIndex =
      Math.max(
        0,
        this.state.currentView -
          1
      );

    this.animateCamera(
      nextIndex,
      0
    );
  };

  nextView = () => {
    if (
      this.state.transitioning
    ) {
      return;
    }

    if (
      !this.state.walkthroughDone
    ) {
      if (
        !this.advanceWalkthrough(
          'next'
        )
      ) {
        return;
      }
    }

    if (
      this.state.currentView ===
      VIEWS.length - 1
    ) {
      this.enterDoor();
      return;
    }

    const nextIndex =
      Math.min(
        VIEWS.length - 1,
        this.state.currentView +
          1
      );

    this.animateCamera(
      nextIndex,
      0
    );
  };

  goHome = () => {
    if (
      this.state.transitioning ||
      !this.state.walkthroughDone
    ) {
      return;
    }

    this.animateCamera(
      0,
      0
    );
  };

  zoomIn = () => {
    if (
      this.state.transitioning
    ) {
      return;
    }

    if (
      !this.state.walkthroughDone
    ) {
      if (
        !this.advanceWalkthrough(
          'zoom-in'
        )
      ) {
        return;
      }
    }

    const nextZoom =
      clamp(
        this.state.manualZoom +
          ZOOM_STEP,

        0,

        MAX_MANUAL_ZOOM
      );

    this.setState({
      manualZoom:
        nextZoom,

      introVisible:
        false,
    });

    this.animateZoom(
      nextZoom
    );
  };

  zoomOut = () => {
    if (
      this.state.transitioning ||
      !this.state.walkthroughDone
    ) {
      return;
    }

    const nextZoom =
      clamp(
        this.state.manualZoom -
          ZOOM_STEP,

        MIN_MANUAL_ZOOM,

        MAX_MANUAL_ZOOM
      );

    this.setState({
      manualZoom:
        nextZoom,

      introVisible:
        false,
    });

    this.animateZoom(
      nextZoom
    );
  };

  toggleDescriptions = () => {
    if (
      this.state.transitioning
    ) {
      return;
    }

    if (
      !this.state.walkthroughDone
    ) {
      if (
        !this.advanceWalkthrough(
          'info'
        )
      ) {
        return;
      }

      this.setState({
        showDescriptions:
          false,

        introVisible:
          false,
      });

      return;
    }

    this.setState(
      (state) => ({
        showDescriptions:
          !state.showDescriptions,

        introVisible:
          false,
      })
    );
  };

  openHelp = () => {
    if (
      this.state.transitioning
    ) {
      return;
    }

    if (
      !this.state.walkthroughDone
    ) {
      if (
        !this.advanceWalkthrough(
          'help'
        )
      ) {
        return;
      }
    }

    this.setState({
      helpOpen:
        true,

      introVisible:
        false,

      showDescriptions:
        true,
    });
  };

  enterDoor = () => {
    if (
      this.state.transitioning
    ) {
      return;
    }

    if (
      this.state.currentView !==
      VIEWS.length - 1
    ) {
      this.animateCamera(
        VIEWS.length - 1,
        0
      );

      return;
    }

    playSfx(
      '/audio/sfx/door-open.wav',
      {
        volume: 0.62,
        playbackRate: 0.96,
      }
    );

    this.setState({
      transitioning:
        true,

      transitionPhase:
        1,

      helpOpen:
        false,

      introVisible:
        false,
    });

    this.transitionTimer =
      setTimeout(() => {
        this.setState({
          transitionPhase:
            2,
        });
      }, 220);

    this.pageTimer =
      setTimeout(() => {
        this.props.onContinue(
          'mood-choice'
        );
      }, 1250);
  };

  getImageFrame() {
    const viewportWidth =
      Math.max(
        1,
        window.innerWidth ||
          1
      );

    const viewportHeight =
      Math.max(
        1,
        window.innerHeight ||
          1
      );

    const isPortrait =
      viewportHeight >
      viewportWidth *
        1.08;

    const coverScale =
      Math.max(
        viewportWidth /
          SCENE_WIDTH,

        viewportHeight /
          SCENE_HEIGHT
      );

    const scale =
      isPortrait
        ? 1 +
          (
            this.state
              .cameraScale -
            1
          ) *
            0.42

        : this.state
            .cameraScale;

    const width =
      SCENE_WIDTH *
      coverScale *
      scale;

    const height =
      SCENE_HEIGHT *
      coverScale *
      scale;

    const focusX =
      (
        this.state.cameraX /
        100
      ) *
      width;

    const focusY =
      (
        this.state.cameraY /
        100
      ) *
      height;

    let left =
      viewportWidth /
        2 -
      focusX;

    let top =
      viewportHeight /
        2 -
      focusY;

    const minLeft =
      Math.min(
        0,
        viewportWidth -
          width
      );

    const minTop =
      Math.min(
        0,
        viewportHeight -
          height
      );

    left =
      clamp(
        left,
        minLeft,
        0
      );

    top =
      clamp(
        top,
        minTop,
        0
      );

    const pointerAmount =
      isPortrait
        ? 0
        : 6;

    left +=
      this.state.pointerX *
      -pointerAmount;

    top +=
      this.state.pointerY *
      -pointerAmount *
      0.45;

    return {
      width,
      height,
      left,
      top,
      isPortrait,
      viewportWidth,
      viewportHeight,
    };
  }

  mapImagePoint(
    xPercent,
    yPercent,
    frame
  ) {
    return {
      x:
        frame.left +
        (
          xPercent /
          100
        ) *
          frame.width,

      y:
        frame.top +
        (
          yPercent /
          100
        ) *
          frame.height,
    };
  }

  onTouchStart = (
    event
  ) => {
    const touch =
      event.touches?.[0];

    if (!touch) {
      return;
    }

    this.touchStart = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  onTouchEnd = (
    event
  ) => {
    if (
      !this.touchStart ||
      this.state.transitioning ||
      !this.state.walkthroughDone
    ) {
      return;
    }

    const touch =
      event.changedTouches?.[0];

    if (!touch) {
      return;
    }

    const dx =
      touch.clientX -
      this.touchStart.x;

    if (
      Math.abs(dx) >
      55
    ) {
      if (dx < 0) {
        this.nextView();
      } else {
        this.previousView();
      }
    }

    this.touchStart =
      null;
  };

  getDescriptionClass(
    view
  ) {
    const positions = {
      'top-left': `
        sm:left-[clamp(1rem,4vw,3.5rem)]
        sm:top-[clamp(5.5rem,13vh,8rem)]
      `,

      'top-right': `
        sm:right-[clamp(1rem,4vw,3.5rem)]
        sm:top-[clamp(5.5rem,13vh,8rem)]
      `,

      'bottom-left': `
        sm:left-[clamp(1rem,4vw,3.5rem)]
        sm:bottom-[6.5rem]
      `,

      'bottom-right': `
        sm:right-[clamp(1rem,4vw,3.5rem)]
        sm:bottom-[6.5rem]
      `,
    };

    return (
      positions[
        view.description
      ] ||
      positions[
        'top-left'
      ]
    );
  }

  renderPointer(
    view,
    frame
  ) {
    if (
      !this.state
        .showDescriptions ||
      this.state
        .introVisible ||
      view.arrow === false
    ) {
      return null;
    }

    const target =
      this.mapImagePoint(
        view.x,
        view.y,
        frame
      );

    const vw =
      frame.viewportWidth;

    const vh =
      frame.viewportHeight;

    const rightCard =
      view.description.includes(
        'right'
      );

    const bottomCard =
      view.description.includes(
        'bottom'
      );

    const startX =
      frame.isPortrait
        ? vw * 0.5

        : rightCard
          ? vw - 305
          : 305;

    const startY =
      frame.isPortrait
        ? vh - 185

        : bottomCard
          ? vh - 170
          : 165;

    const dx =
      target.x -
      startX;

    const dy =
      target.y -
      startY;

    const length =
      Math.sqrt(
        dx * dx +
        dy * dy
      ) || 1;

    const stopBack =
      22;

    const endX =
      target.x -
      (
        dx /
        length
      ) *
        stopBack;

    const endY =
      target.y -
      (
        dy /
        length
      ) *
        stopBack;

    return html`
      <svg
        className="
          pointer-events-none
          absolute inset-0
          z-20
          h-full w-full
        "
        viewBox=${`0 0 ${vw} ${vh}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="room-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L8,4 L0,8 Z"
              fill="rgba(112,63,141,.72)"
            />
          </marker>
        </defs>

        <path
          d=${`
            M ${startX} ${startY}
            Q
            ${(startX + endX) / 2}
            ${
              Math.min(
                startY,
                endY
              ) -
              16
            }
            ${endX}
            ${endY}
          `}
          fill="none"
          stroke="rgba(112,63,141,.50)"
          strokeWidth="1.1"
          strokeLinecap="round"
          markerEnd="url(#room-arrow)"
        />

        <circle
          cx=${target.x}
          cy=${target.y}
          r="7"
          fill="rgba(255,255,255,.06)"
          stroke="rgba(255,255,255,.82)"
          strokeWidth="1"
        />

        <circle
          cx=${target.x}
          cy=${target.y}
          r="2.2"
          fill="rgba(112,63,141,.86)"
        />
      </svg>
    `;
  }

  renderDescription(
    view
  ) {
    if (
      !this.state
        .showDescriptions ||
      this.state
        .introVisible
    ) {
      return null;
    }

    return html`
      <div
        key=${view.id}
        className=${`
          pointer-events-none
          absolute z-30

          left-3 right-3
          bottom-[5.9rem]

          sm:left-auto
          sm:right-auto
          sm:bottom-auto

          ${this.getDescriptionClass(
            view
          )}
        `}
      >
        <div
          className="
            w-full
            max-w-[292px]

            rounded-[1.2rem]

            border
            border-white/72

            bg-white/74

            px-3.5
            py-3

            shadow-[0_15px_44px_rgba(74,39,95,.12)]

            backdrop-blur-2xl
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
                text-[7px]
                font-black
                uppercase
                tracking-[.2em]
                text-purple-500
              "
            >
              ${view.kicker}
            </p>

            <span
              className="
                shrink-0
                rounded-full
                bg-purple-50/90
                px-2 py-1
                text-[7px]
                font-black
                tracking-[.1em]
                text-purple-600
              "
            >
              ${String(
                this.state
                  .currentView +
                  1
              ).padStart(
                2,
                '0'
              )}
              /
              ${String(
                VIEWS.length
              ).padStart(
                2,
                '0'
              )}
            </span>
          </div>

          <h2
            className="
              mt-1.5
              font-display
              text-[1.22rem]
              font-semibold
              leading-[.98]
              tracking-[-.03em]
              text-[#4a275f]
              sm:text-[1.42rem]
            "
          >
            ${view.title}
          </h2>

          <p
            className="
              mt-2
              text-[9.5px]
              leading-[1.58]
              text-purple-950/66
              sm:text-[10.5px]
            "
          >
            ${view.body}
          </p>
        </div>
      </div>
    `;
  }

  renderHelp() {
    if (
      !this.state.helpOpen
    ) {
      return null;
    }

    return html`
      <div
        className="
          fixed inset-0
          z-[100]
          flex items-end
          justify-center
          bg-[#4a275f]/12
          px-3
          pb-[max(.8rem,env(safe-area-inset-bottom))]
          pt-20
          backdrop-blur-[3px]
          sm:items-center
          sm:p-6
        "
        onClick=${() =>
          this.setState({
            helpOpen:
              false,
          })
        }
      >
        <div
          className="
            relative
            w-full
            max-w-sm
            rounded-[2rem]
            border
            border-white/80
            bg-white/94
            p-5
            shadow-[0_35px_100px_rgba(74,39,95,.24)]
            backdrop-blur-2xl
            sm:p-6
          "
          onClick=${(
            event
          ) =>
            event.stopPropagation()
          }
        >
          <button
            type="button"
            className="
              absolute
              right-4
              top-4
              grid
              h-8
              w-8
              place-items-center
              rounded-full
              bg-purple-50
              text-sm
              font-black
              text-purple-700
            "
            onClick=${() =>
              this.setState({
                helpOpen:
                  false,
              })
            }
            aria-label="Close help"
          >
            ×
          </button>

          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[.24em]
              text-purple-500
            "
          >
            how to be nosy 😂
          </p>

          <h3
            className="
              mt-2
              pr-10
              font-display
              text-3xl
              font-semibold
              leading-[.95]
              tracking-[-.035em]
              text-[#4a275f]
            "
          >
            explore your room.
          </h3>

          <div
            className="
              mt-5
              space-y-3
              text-sm
              leading-6
              text-purple-950/70
            "
          >
            <p>
              <strong className="text-purple-800">
                ← / →
              </strong>
              ${' '}
              move through all 13 stops.
            </p>

            <p>
              <strong className="text-purple-800">
                + / −
              </strong>
              ${' '}
              get closer to the exact thing we are looking at or back away.
            </p>

            <p>
              <strong className="text-purple-800">
                ⌂
              </strong>
              ${' '}
              return to the whole room.
            </p>

            <p>
              <strong className="text-purple-800">
                i
              </strong>
              ${' '}
              hide or show my explanations.
            </p>

            <p>
              <strong className="text-purple-800">
                mouse
              </strong>
              ${' '}
              the room moves just a tiny bit with u.
            </p>

            <p
              className="
                sm:hidden
              "
            >
              <strong className="text-purple-800">
                phone
              </strong>
              ${' '}
              swipe left/right or use the arrows.
            </p>
          </div>

          <button
            type="button"
            className="
              mt-5
              w-full
              rounded-full
              border
              border-purple-100
              bg-purple-50/80
              px-4
              py-2.5
              text-[9px]
              font-black
              uppercase
              tracking-[.15em]
              text-purple-600
            "
            onClick=${this.resetWalkthrough}
          >
            show me the tiny tutorial again
          </button>
        </div>
      </div>
    `;
  }

  renderWalkthrough() {
    if (
      this.state.walkthroughDone ||
      this.state.walkthroughStep < 0 ||
      this.state.introVisible
    ) {
      return null;
    }

    const step =
      WALKTHROUGH[
        this.state.walkthroughStep
      ];

    return html`
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          z-[65]
          w-[min(88vw,260px)]
          -translate-x-1/2
        "
        style=${{
          bottom:
            VIEWS[
              this.state.currentView
            ].controls === 'top'
              ? '1rem'
              : '6.4rem',
        }}
      >
        <div
          className="
            rounded-[1.2rem]
            border
            border-white/80
            bg-white/90
            px-4
            py-3
            text-center
            shadow-[0_18px_50px_rgba(74,39,95,.18)]
            backdrop-blur-2xl
          "
        >
          <p
            className="
              text-[8px]
              font-black
              uppercase
              tracking-[.18em]
              text-purple-500
            "
          >
            tiny tutorial
            ${' · '}
            ${this.state.walkthroughStep + 1}
            /
            ${WALKTHROUGH.length}
          </p>

          <p
            className="
              mt-1.5
              font-display
              text-xl
              font-semibold
              text-[#4a275f]
            "
          >
            ${step.title}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              leading-5
              text-purple-950/65
            "
          >
            ${step.body}
          </p>
        </div>
      </div>
    `;
  }

  renderCoachHand(
    action
  ) {
    if (
      this.state.walkthroughDone ||
      this.getWalkthroughAction() !==
        action
    ) {
      return null;
    }

    return html`
      <span
        className="
          pointer-events-none
          absolute
          -top-9
          left-1/2
          z-20
          -translate-x-1/2
          animate-bounce
          text-2xl
          drop-shadow-[0_4px_10px_rgba(74,39,95,.22)]
        "
        aria-hidden="true"
      >
        👆
      </span>
    `;
  }

  render() {
    const frame =
      this.getImageFrame();

    const view =
      VIEWS[
        this.state.currentView
      ];

    const isDoor =
      view.id ===
      'door';

    const controlsAtTop =
      view.controls ===
      'top';

    const progressPercent =
      (
        (
          this.state
            .currentView +
          1
        ) /
        VIEWS.length
      ) *
      100;

    const walkthroughAction =
      this.getWalkthroughAction();

    const tutorialActive =
      !this.state
        .walkthroughDone &&
      !this.state
        .introVisible;

    const canUse = (
      action
    ) =>
      !tutorialActive ||
      walkthroughAction ===
        action;

    return html`
      <section
        id="birthday-room"
        className="
          relative
          h-[100svh]
          min-h-[620px]
          overflow-hidden
          bg-[#fff8fc]
          touch-pan-y
        "
        onTouchStart=${this.onTouchStart}
        onTouchEnd=${this.onTouchEnd}
      >
        <img
          src="/art/room/fendisha-room-master.png"
          className="
            absolute
            left-0
            top-0
            max-w-none
            select-none
            will-change-transform
          "
          style=${{
            width:
              `${frame.width}px`,

            height:
              `${frame.height}px`,

            transform:
              `translate3d(
                ${frame.left}px,
                ${frame.top}px,
                0
              )`,

            transition:
              'filter 700ms ease',

            filter:
              this.state
                .transitioning
                ? 'blur(2px) brightness(1.08)'
                : 'none',
          }}
          alt="A lavender dream room"
          draggable="false"
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[linear-gradient(
              180deg,
              rgba(255,255,255,.025),
              transparent_40%,
              rgba(67,34,83,.055)
            )]
          "
        ></div>

        ${this.renderPointer(
          view,
          frame
        )}

        <div
          className="
            absolute
            inset-x-0
            top-0
            z-40
            flex
            justify-center
            px-4
            pt-[max(1rem,env(safe-area-inset-top))]
            transition-all
            duration-700
          "
          style=${{
            opacity:
              this.state
                .introVisible
                ? 1
                : 0,

            transform:
              this.state
                .introVisible
                ? 'translateY(0)'
                : 'translateY(-18px)',

            pointerEvents:
              this.state
                .introVisible
                ? 'auto'
                : 'none',
          }}
        >
          <div
            className="
              relative
              w-full
              max-w-lg
              rounded-[1.6rem]
              border
              border-white/80
              bg-white/80
              px-5
              py-4
              text-center
              shadow-[0_22px_65px_rgba(74,39,95,.14)]
              backdrop-blur-2xl
            "
          >
            <button
              type="button"
              className="
                absolute
                right-3
                top-3
                grid
                h-8
                w-8
                place-items-center
                rounded-full
                bg-purple-50
                text-sm
                font-black
                text-purple-600
              "
              onClick=${this.dismissIntro}
              aria-label="Dismiss"
            >
              ×
            </button>

            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[.24em]
                text-purple-500
              "
            >
              A TINY PREVIEW OF SOMEDAY 💜
            </p>

            <h1
              className="
                mx-auto
                mt-2
                max-w-md
                font-display
                text-3xl
                font-semibold
                leading-[.96]
                tracking-[-.04em]
                text-[#4a275f]
                sm:text-4xl
              "
            >
              I built u a little piece of a future dream.
            </h1>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                text-xs
                leading-5
                text-purple-950/68
                sm:text-sm
              "
            >
              not the real one yet 😭...
              just a room made from little things that somehow feel like u.
              I left my explanations on because none of this was random.
            </p>

            <p
              className="
                mt-3
                font-display
                text-lg
                italic
                text-purple-700
              "
            >
              go be nosy, fkr. 13 stops before that door.
            </p>

            ${
              !this.state
                .walkthroughDone
                ? html`
                    <p
                      className="
                        mt-3
                        text-[8px]
                        font-black
                        uppercase
                        tracking-[.15em]
                        text-purple-500/70
                      "
                    >
                      close this and I’ll teach u the controls in like 10 seconds 😂
                    </p>
                  `
                : null
            }
          </div>
        </div>

        ${this.renderDescription(
          view
        )}

        ${this.renderWalkthrough()}

        <div
          className=${`
            absolute
            left-1/2
            z-50
            w-[min(92vw,430px)]
            -translate-x-1/2

            ${
              controlsAtTop
                ? `
                  top-[max(.7rem,env(safe-area-inset-top))]
                `
                : `
                  bottom-[max(.7rem,env(safe-area-inset-bottom))]
                `
            }
          `}
          style=${{
            opacity:
              this.state
                .transitioning
                ? 0
                : 1,

            transition:
              'all 600ms cubic-bezier(.22,.8,.2,1)',

            pointerEvents:
              this.state
                .transitioning
                ? 'none'
                : 'auto',
          }}
        >
          <div
            className="
              overflow-visible
              rounded-[1.35rem]
              border
              border-white/80
              bg-white/78
              shadow-[0_18px_55px_rgba(74,39,95,.17)]
              backdrop-blur-2xl
            "
          >
            <div
              className="
                h-[2px]
                w-full
                overflow-hidden
                rounded-t-[1.35rem]
                bg-purple-100
              "
            >
              <div
                className="
                  h-full
                  bg-gradient-to-r
                  from-purple-500
                  to-pink-400
                  transition-[width]
                  duration-700
                "
                style=${{
                  width:
                    `${progressPercent}%`,
                }}
              ></div>
            </div>

            <div
              className="
                flex
                items-center
                justify-center
                gap-0.5
                p-1
                sm:gap-1
                sm:p-1.5
              "
            >
              <button
                type="button"
                className="
                  relative
                  grid
                  h-9
                  w-9
                  place-items-center
                  rounded-full
                  text-base
                  text-purple-700
                  transition
                  hover:bg-purple-100
                  disabled:opacity-20
                  sm:h-10
                  sm:w-10
                "
                onClick=${this.previousView}
                disabled=${
                  this.state
                    .currentView === 0 ||
                  tutorialActive
                }
                aria-label="Previous"
                title="previous"
              >
                ←
              </button>

              <button
                type="button"
                className="
                  relative
                  grid
                  h-9
                  w-9
                  place-items-center
                  rounded-full
                  text-lg
                  text-purple-700
                  transition
                  hover:bg-purple-100
                  disabled:opacity-20
                  sm:h-10
                  sm:w-10
                "
                onClick=${this.zoomOut}
                disabled=${tutorialActive}
                aria-label="Zoom out"
                title="zoom out"
              >
                −
              </button>

              <button
                type="button"
                className="
                  relative
                  grid
                  h-10
                  w-10
                  place-items-center
                  rounded-full
                  bg-gradient-to-br
                  from-purple-600
                  to-pink-500
                  text-sm
                  text-white
                  shadow-[0_8px_24px_rgba(143,79,179,.24)]
                  transition
                  hover:scale-105
                  disabled:opacity-30
                  sm:h-11
                  sm:w-11
                "
                onClick=${this.goHome}
                disabled=${tutorialActive}
                aria-label="Whole room"
                title="whole room"
              >
                ⌂
              </button>

              <button
                type="button"
                className=${`
                  relative

                  grid
                  h-9
                  w-9
                  place-items-center

                  rounded-full

                  text-lg
                  text-purple-700

                  transition

                  hover:bg-purple-100

                  disabled:opacity-20

                  sm:h-10
                  sm:w-10

                  ${
                    walkthroughAction ===
                    'zoom-in'
                      ? `
                        ring-4
                        ring-purple-300/45
                        bg-purple-100
                        scale-110
                      `
                      : ''
                  }
                `}
                onClick=${this.zoomIn}
                disabled=${!canUse(
                  'zoom-in'
                )}
                aria-label="Zoom in"
                title="emphasize this"
              >
                ${this.renderCoachHand(
                  'zoom-in'
                )}
                +
              </button>

              <button
                type="button"
                className=${`
                  relative

                  grid
                  h-9
                  min-w-9
                  place-items-center

                  rounded-full

                  px-2.5

                  font-display
                  text-base
                  italic

                  transition

                  disabled:opacity-20

                  sm:h-10
                  sm:px-3

                  ${
                    isDoor
                      ? `
                        bg-purple-600
                        text-white
                      `
                      : `
                        text-purple-700
                        hover:bg-purple-100
                      `
                  }

                  ${
                    walkthroughAction ===
                    'next'
                      ? `
                        ring-4
                        ring-purple-300/45
                        bg-purple-100
                        scale-110
                      `
                      : ''
                  }
                `}
                onClick=${this.nextView}
                disabled=${!canUse(
                  'next'
                )}
                aria-label=${isDoor
                  ? 'Open the door'
                  : 'Next'
                }
                title=${isDoor
                  ? 'open it'
                  : 'next'
                }
              >
                ${this.renderCoachHand(
                  'next'
                )}

                ${isDoor
                  ? 'open it →'
                  : '→'
                }
              </button>

              <div
                className="
                  mx-0.5
                  h-5
                  w-px
                  bg-purple-200
                "
              ></div>

              <button
                type="button"
                className=${`
                  relative

                  grid
                  h-9
                  w-9
                  place-items-center

                  rounded-full

                  border

                  text-[10px]
                  font-black

                  transition

                  disabled:opacity-20

                  sm:h-10
                  sm:w-10

                  ${
                    this.state
                      .showDescriptions
                      ? `
                        border-purple-200
                        bg-purple-100
                        text-purple-700
                      `
                      : `
                        border-purple-100
                        bg-white/50
                        text-purple-400
                      `
                  }

                  ${
                    walkthroughAction ===
                    'info'
                      ? `
                        ring-4
                        ring-purple-300/45
                        scale-110
                      `
                      : ''
                  }
                `}
                onClick=${this.toggleDescriptions}
                disabled=${!canUse(
                  'info'
                )}
                aria-label="Toggle explanations"
                title="explanations"
              >
                ${this.renderCoachHand(
                  'info'
                )}
                i
              </button>

              <button
                type="button"
                className=${`
                  relative

                  grid
                  h-9
                  w-9
                  place-items-center

                  rounded-full

                  border
                  border-purple-100

                  bg-purple-50

                  text-xs
                  font-black
                  text-purple-700

                  transition

                  disabled:opacity-20

                  sm:h-10
                  sm:w-10

                  ${
                    walkthroughAction ===
                    'help'
                      ? `
                        ring-4
                        ring-purple-300/45
                        scale-110
                      `
                      : ''
                  }
                `}
                onClick=${this.openHelp}
                disabled=${!canUse(
                  'help'
                )}
                aria-label="Help"
                title="help"
              >
                ${this.renderCoachHand(
                  'help'
                )}
                ?
              </button>
            </div>
          </div>

          <div
            className="
              mt-1.5
              flex
              items-center
              justify-between
              px-2
              text-[7px]
              font-black
              uppercase
              tracking-[.15em]
              text-purple-700/58
            "
          >
            <span>
              ${String(
                this.state
                  .currentView +
                  1
              ).padStart(
                2,
                '0'
              )}
              /
              ${String(
                VIEWS.length
              ).padStart(
                2,
                '0'
              )}
            </span>

            <span>
              ${isDoor
                ? 'last stop · open when ready'
                : view.label
              }
            </span>
          </div>
        </div>

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[80]
            flex
            items-center
            justify-center
          "
          style=${{
            opacity:
              this.state
                .transitioning
                ? 1
                : 0,

            transition:
              'opacity 700ms ease',
          }}
        >
          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(
                circle_at_54%_31%,
                rgba(255,255,255,.98)_0%,
                rgba(247,226,255,.96)_18%,
                rgba(207,163,232,.70)_44%,
                rgba(155,93,190,.34)_68%,
                rgba(255,250,252,0)_100%
              )]
            "
            style=${{
              transform:
                this.state
                  .transitionPhase >=
                2
                  ? 'scale(2.2)'
                  : 'scale(.6)',

              transition:
                'transform 950ms cubic-bezier(.2,.8,.2,1)',
            }}
          ></div>

          <div
            className="
              absolute
              inset-0
              bg-white
            "
            style=${{
              opacity:
                this.state
                  .transitionPhase >=
                2
                  ? 0.94
                  : 0,

              transition:
                'opacity 850ms ease',
            }}
          ></div>

          <p
            className="
              relative
              z-10
              font-display
              text-2xl
              italic
              text-purple-700
              sm:text-3xl
            "
            style=${{
              opacity:
                this.state
                  .transitionPhase >=
                2
                  ? 0
                  : 1,

              transition:
                'all 500ms ease',
            }}
          >
            come with me.
          </p>
        </div>

        ${this.renderHelp()}
      </section>
    `;
  }
}