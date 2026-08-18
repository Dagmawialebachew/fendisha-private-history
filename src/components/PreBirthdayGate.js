import {
  React,
  html,
} from '../lib/react.js';

import {
  useAssetPreloader,
} from './AssetPreloader.js';


/*
|-----------------------------------------------------------------------------
| MY FENDISHA · PRE-BIRTHDAY GATE
|-----------------------------------------------------------------------------
|
| One URL. One codebase. The finished birthday experience stays behind this.
|
| Public states:
|   1) before Aug 18, 00:00 Addis Ababa -> mysterious countdown
|   2) birthday started + remote false       -> birthday, still sealed
|   3) remote true                           -> release sequence -> she enters
|
| The real experience is not mounted until she is allowed in.
|
*/


const BIRTHDAY_AT =
  new Date(
    '2026-08-18T00:00:00+03:00'
  ).getTime();


/*
| Same-domain switch.
|
| public/release-status.json
|
| {
|   "released": false
| }
|
| Tomorrow, when YOU decide: false -> true.
*/

const RELEASE_STATUS_URL =
  '/release-status.json';

const POLL_EVERY_MS =
  12000;


/*
|-----------------------------------------------------------------------------
| PRELUDE AUDIO
|-----------------------------------------------------------------------------
|
| Ticking is synthesized in-browser. No tick file is needed.
|
| For the very soft birthday jazz, place the audio file you are allowed to use
| here:
|
| public/audio/prelude/birthday-jazz.m4a
|
| The page sets it extremely low (0.018) and loops it.
|
| A Spotify iframe is intentionally NOT used here: browser autoplay + iframe
| volume rules make it unreliable for a quiet background layer.
*/

const JAZZ_AUDIO_SRC =
  '/audio/prelude/birthday-jazz.m4a';

const JAZZ_VOLUME =
  0.09;

const JAZZ_UNDER_SOUNDTRACK_VOLUME =
  0.004;

const JAZZ_UNDER_VOICE_VOLUME =
  0.0015;

const JAZZ_FADE_MS =
  700;

const TICK_VOLUME =
  0.0075;


const ENTERED_KEY =
  'fendisha-prelude-entered';

const RELEASE_SEEN_KEY =
  'fendisha-release-seen';

const VISITS_KEY =
  'fendisha-prelude-visits';

const QUESTION_KEY =
  'fendisha-prelude-past-self-answer';


const TOUCH_LINES = [
  'I knew u were going to touch it 😭',
  'fkr. that was literally the only instruction.',
  'interesting. access remains aggressively denied.',
  'okay... maybe touching it was part of the page. maybe not.',
  'the seal remembers everything btw.',
  'u are making a very strong case for supervision 😭',
  'keep going. surely attempt number seven is the one.',
];


const CHECK_LINES = [
  'not yet.',
  'the door heard u. it ignored u.',
  'still sealed, fkr 😭',
  'I checked too. nothing moved.',
  'wrong moment. right amount of impatience.',
];


const CLUES = [
  {
    id: 'c01',
    text: '01 / 21',
    left: '7%',
    top: '26%',
    rotate: '-7deg',
    delay: '0s',
  },
  {
    id: 'c63',
    text: '63',
    left: '88%',
    top: '23%',
    rotate: '6deg',
    delay: '1.4s',
  },
  {
    id: 'cmusic',
    text: '♪',
    left: '11%',
    top: '72%',
    rotate: '8deg',
    delay: '2.1s',
  },
  {
    id: 'cpop',
    text: '🍿',
    left: '89%',
    top: '70%',
    rotate: '-5deg',
    delay: '.7s',
  },
  {
    id: 'cfaith',
    text: '✝',
    left: '81%',
    top: '48%',
    rotate: '2deg',
    delay: '2.8s',
  },
];


function safeGet(key) {
  try {
    return localStorage.getItem(
      key
    );
  } catch {
    return null;
  }
}


function safeSet(
  key,
  value
) {
  try {
    localStorage.setItem(
      key,
      value
    );
  } catch {
    // Persistence is optional.
  }
}


function clamp(
  value,
  min,
  max
) {
  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );
}


function pad2(value) {
  return String(
    Math.max(
      0,
      Math.floor(value)
    )
  ).padStart(
    2,
    '0'
  );
}


function getCountdown(now) {
  const remaining =
    Math.max(
      0,
      BIRTHDAY_AT - now
    );

  const totalSeconds =
    Math.floor(
      remaining / 1000
    );

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60
    );

  const seconds =
    totalSeconds % 60;

  return {
    remaining,
    hours,
    minutes,
    seconds,
  };
}


function getVisitCopy(
  visits,
  remaining
) {
  if (
    remaining > 0 &&
    remaining <= 10 * 60 * 1000
  ) {
    return {
      kicker:
        'THE CLOCK IS GETTING RUDE',
      title:
        'almost 21.',
      body:
        'I would tell u to stop staring at it, but we both know that is not happening.',
    };
  }

  if (
    remaining > 0 &&
    remaining <= 60 * 60 * 1000
  ) {
    return {
      kicker:
        'ONE HOUR OR LESS',
      title:
        'fkr... go sleep 😭',
      body:
        'the clock will move whether u supervise it or not.',
    };
  }

  if (visits >= 5) {
    return {
      kicker:
        'RETURN VISIT DETECTED · AGAIN',
      title:
        'u are STILL here?',
      body:
        'this is becoming less of a countdown and more of an investigation.',
    };
  }

  if (visits >= 3) {
    return {
      kicker:
        'RETURN VISIT DETECTED',
      title:
        'u came back. again.',
      body:
        'I am starting to think telling u not to look made this worse.',
    };
  }

  if (visits >= 2) {
    return {
      kicker:
        'OH. YOU AGAIN.',
      title:
        'u came back 😭',
      body:
        'nothing has changed. probably.',
    };
  }

  return {
    kicker:
      'PRIVATE PRELUDE · FOR ONE PERSON ONLY',
    title:
      'not yet, fkr.',
    body:
      'I know u want to know what is behind the door. that is exactly why I am not telling u.',
  };
}


function releaseUrlReady() {
  return Boolean(
    RELEASE_STATUS_URL
  );
}


async function fetchReleaseStatus() {
  if (!releaseUrlReady()) {
    return false;
  }

  const separator =
    RELEASE_STATUS_URL.includes('?')
      ? '&'
      : '?';

  const url =
    `${RELEASE_STATUS_URL}${separator}fendisha=${Date.now()}`;

  const response =
    await fetch(
      url,
      {
        cache:
          'no-store',
        headers: {
          Accept:
            'application/json',
        },
      }
    );

  if (!response.ok) {
    throw new Error(
      `Release check failed (${response.status}).`
    );
  }

  const data =
    await response.json();

  return data?.released === true;
}


function isSmallScreenNow() {
  return (
    typeof window !== 'undefined' &&
    window.innerWidth < 900
  );
}


export function PreBirthdayGate({
  children,
}) {
  const params =
    new URLSearchParams(
      window.location.search
    );


  /*
  | Start warming the finished experience immediately — even while the door
  | is still locked. Photos + artwork + fonts get priority; audio is warmed
  | only after the visuals have finished.
  */
  const preload =
    useAssetPreloader();


  /*
  | Private previews.
  |
  | ?darionPreview=1    -> skip gate, show finished site
  | ?preludePreview=1   -> force countdown design
  | ?lockedPreview=1    -> force birthday-but-locked design
  | ?releasedPreview=1  -> force released design
  | ?mobilePreview=1    -> allow the full prelude on a narrow screen
  */

  const darionPreview =
    params.get('darionPreview') === '1' ||
    params.get('darionpreview') === '1';

  const preludePreview =
    params.get('preludePreview') === '1' ||
    params.get('preludepreview') === '1';

  const lockedPreview =
    params.get('lockedPreview') === '1' ||
    params.get('lockedpreview') === '1';

  const releasedPreview =
    params.get('releasedPreview') === '1' ||
    params.get('releasedpreview') === '1';

  const mobilePreview =
    params.get('mobilePreview') === '1' ||
    params.get('mobilepreview') === '1';


  const [
    now,
    setNow,
  ] =
    React.useState(
      () => Date.now()
    );

  const [
    released,
    setReleased,
  ] =
    React.useState(
      () =>
        safeGet(
          RELEASE_SEEN_KEY
        ) === '1'
    );

  const [
    entered,
    setEntered,
  ] =
    React.useState(
      () =>
        safeGet(
          ENTERED_KEY
        ) === '1' &&
        safeGet(
          RELEASE_SEEN_KEY
        ) === '1'
    );

  const [
    releasePhase,
    setReleasePhase,
  ] =
    React.useState(
      released
        ? 'ready'
        : 'locked'
    );

  const [
    checking,
    setChecking,
  ] =
    React.useState(false);

  const [
    checkMessage,
    setCheckMessage,
  ] =
    React.useState('');

  const [
    checkCount,
    setCheckCount,
  ] =
    React.useState(0);

  const [
    touchCount,
    setTouchCount,
  ] =
    React.useState(0);

  const [
    questionOpen,
    setQuestionOpen,
  ] =
    React.useState(false);

  const [
    answer,
    setAnswer,
  ] =
    React.useState(
      () =>
        safeGet(
          QUESTION_KEY
        ) || ''
    );

  const [
    answerSaved,
    setAnswerSaved,
  ] =
    React.useState(
      () => Boolean(
        safeGet(
          QUESTION_KEY
        )
      )
    );

  const [
    visits,
    setVisits,
  ] =
    React.useState(1);

  const [
    smallScreen,
    setSmallScreen,
  ] =
    React.useState(
      () =>
        isSmallScreenNow()
    );

  const [
    soundEnabled,
    setSoundEnabled,
  ] =
    React.useState(false);

  const [
    jazzAvailable,
    setJazzAvailable,
  ] =
    React.useState(true);

  const [
    preparingToEnter,
    setPreparingToEnter,
  ] =
    React.useState(false);


  const gateRef =
    React.useRef(null);

  const previousReleasedRef =
    React.useRef(
      released
    );

  const releaseTimersRef =
    React.useRef([]);

  const audioContextRef =
    React.useRef(null);

  const jazzRef =
    React.useRef(null);

  const jazzFadeRafRef =
    React.useRef(null);

  const soundtrackPlayingRef =
    React.useRef(false);

  const voiceDepthRef =
    React.useRef(0);

  const lastTickSecondRef =
    React.useRef(null);

  const soundStartingRef =
    React.useRef(false);


  const countdown =
    getCountdown(
      now
    );

  const realBirthdayStarted =
    countdown.remaining <= 0;

  const birthdayStarted =
    lockedPreview
      ? true
      : preludePreview
        ? false
        : realBirthdayStarted;

  const visualReleased =
    released ||
    releasedPreview;


  const visitCopy =
    getVisitCopy(
      visits,
      countdown.remaining
    );


  const midnightProgress =
    clamp(
      1 -
        countdown.remaining /
          (24 * 60 * 60 * 1000),
      0,
      1
    );


  React.useEffect(() => {
    const previous =
      Number(
        safeGet(
          VISITS_KEY
        ) || '0'
      );

    const next =
      Number.isFinite(previous)
        ? previous + 1
        : 1;

    safeSet(
      VISITS_KEY,
      String(next)
    );

    setVisits(
      next
    );
  }, []);


  React.useEffect(() => {
    const timer =
      window.setInterval(
        () => {
          setNow(
            Date.now()
          );
        },
        250
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, []);


  React.useEffect(() => {
    const onResize =
      () => {
        setSmallScreen(
          isSmallScreenNow()
        );
      };

    window.addEventListener(
      'resize',
      onResize,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        'resize',
        onResize
      );
  }, []);


  const synthTick =
    React.useCallback(
      () => {
        const context =
          audioContextRef.current;

        if (
          !soundEnabled ||
          !context ||
          context.state !== 'running'
        ) {
          return;
        }

        const nowAt =
          context.currentTime;

        const oscillator =
          context.createOscillator();

        const gain =
          context.createGain();

        oscillator.type =
          'sine';

        oscillator.frequency.setValueAtTime(
          1320,
          nowAt
        );

        oscillator.frequency.exponentialRampToValueAtTime(
          880,
          nowAt + 0.026
        );

        gain.gain.setValueAtTime(
          0.00001,
          nowAt
        );

        gain.gain.exponentialRampToValueAtTime(
          TICK_VOLUME,
          nowAt + 0.003
        );

        gain.gain.exponentialRampToValueAtTime(
          0.00001,
          nowAt + 0.040
        );

        oscillator.connect(
          gain
        );

        gain.connect(
          context.destination
        );

        oscillator.start(
          nowAt
        );

        oscillator.stop(
          nowAt + 0.045
        );
      },
      [
        soundEnabled,
      ]
    );


  React.useEffect(() => {
    if (
      !soundEnabled ||
      birthdayStarted ||
      visualReleased
    ) {
      return;
    }

    const second =
      Math.floor(
        now / 1000
      );

    if (
      lastTickSecondRef.current ===
      second
    ) {
      return;
    }

    lastTickSecondRef.current =
      second;

    synthTick();
  }, [
    now,
    soundEnabled,
    birthdayStarted,
    visualReleased,
    synthTick,
  ]);


  const getJazzTargetVolume =
    React.useCallback(
      () => {
        if (voiceDepthRef.current > 0) {
          return JAZZ_UNDER_VOICE_VOLUME;
        }

        if (soundtrackPlayingRef.current) {
          return JAZZ_UNDER_SOUNDTRACK_VOLUME;
        }

        return JAZZ_VOLUME;
      },
      []
    );


  const fadeJazzTo =
    React.useCallback(
      (target, duration = JAZZ_FADE_MS) => {
        const jazz =
          jazzRef.current;

        if (!jazz) {
          return;
        }

        if (jazzFadeRafRef.current) {
          cancelAnimationFrame(
            jazzFadeRafRef.current
          );

          jazzFadeRafRef.current =
            null;
        }

        const from =
          jazz.volume;

        const to =
          clamp(
            target,
            0,
            1
          );

        const startedAt =
          performance.now();

        const step =
          timestamp => {
            const raw =
              clamp(
                (timestamp - startedAt) /
                  Math.max(1, duration),
                0,
                1
              );

            const eased =
              raw * raw *
              (3 - 2 * raw);

            jazz.volume =
              from +
              (to - from) * eased;

            if (raw < 1) {
              jazzFadeRafRef.current =
                requestAnimationFrame(
                  step
                );

              return;
            }

            jazz.volume =
              to;

            jazzFadeRafRef.current =
              null;
          };

        jazzFadeRafRef.current =
          requestAnimationFrame(
            step
          );
      },
      []
    );


  const syncJazzBed =
    React.useCallback(
      (duration = JAZZ_FADE_MS) => {
        fadeJazzTo(
          getJazzTargetVolume(),
          duration
        );
      },
      [
        fadeJazzTo,
        getJazzTargetVolume,
      ]
    );


  const startAtmosphere =
    React.useCallback(
      async () => {
        if (soundStartingRef.current) {
          return;
        }

        // If jazz is already genuinely playing, there is nothing to unlock.
        // If soundEnabled is true but playback is paused/blocked, allow the
        // next real user gesture to retry it.
        if (
          soundEnabled &&
          jazzRef.current &&
          !jazzRef.current.paused
        ) {
          return;
        }

        soundStartingRef.current =
          true;

        try {
          const AudioContextCtor =
            window.AudioContext ||
            window.webkitAudioContext;

          if (
            AudioContextCtor &&
            !audioContextRef.current
          ) {
            audioContextRef.current =
              new AudioContextCtor();
          }

          if (
            audioContextRef.current?.state ===
            'suspended'
          ) {
            await audioContextRef.current.resume();
          }

          if (!jazzRef.current) {
            const jazz =
              new Audio(
                JAZZ_AUDIO_SRC
              );

            jazz.preload =
              'auto';

            jazz.loop =
              true;

            jazz.volume =
              getJazzTargetVolume();

            jazz.addEventListener(
              'error',
              () => {
                setJazzAvailable(
                  false
                );
              },
              { once: true }
            );

            jazzRef.current =
              jazz;
          }

          try {
            jazzRef.current.volume =
              getJazzTargetVolume();

            await jazzRef.current.play();

            setJazzAvailable(
              true
            );
          } catch (error) {
            // Do not permanently lock ourselves out after one blocked play.
            // A later click/tap/keypress will retry startAtmosphere().
            console.warn(
              '[Fendisha jazz] playback did not start yet:',
              error
            );
          }

          setSoundEnabled(
            true
          );
        } finally {
          soundStartingRef.current =
            false;
        }
      },
      [soundEnabled]
    );


  /*
  | Browser autoplay rules require a genuine user gesture. The old version
  | attached that gesture only to the visible pre-birthday gate. That meant
  | ?darionPreview=1 or a refresh after ENTERED_KEY was saved could render
  | the finished experience directly and never unlock jazz at all.
  |
  | Listen globally until playback has been unlocked so the FIRST click/tap
  | anywhere in either the gate OR the finished experience can start jazz.
  */
  React.useEffect(() => {
    const unlockFromGesture =
      () => {
        startAtmosphere();
      };

    document.addEventListener(
      'pointerdown',
      unlockFromGesture,
      true
    );

    document.addEventListener(
      'keydown',
      unlockFromGesture,
      true
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        unlockFromGesture,
        true
      );

      document.removeEventListener(
        'keydown',
        unlockFromGesture,
        true
      );
    };
  }, [startAtmosphere]);


  React.useEffect(() => {
    return () => {
      if (jazzFadeRafRef.current) {
        cancelAnimationFrame(
          jazzFadeRafRef.current
        );

        jazzFadeRafRef.current =
          null;
      }

      try {
        jazzRef.current?.pause();
      } catch {}

      try {
        audioContextRef.current?.close();
      } catch {}
    };
  }, []);


  React.useEffect(() => {
    const onVisibility =
      () => {
        if (
          document.visibilityState !==
            'visible' ||
          !soundEnabled ||
          !jazzRef.current
        ) {
          return;
        }

        jazzRef.current.play()
          .then(
            () => {
              syncJazzBed(
                280
              );
            }
          )
          .catch(
            () => {}
          );
      };

    document.addEventListener(
      'visibilitychange',
      onVisibility
    );

    return () =>
      document.removeEventListener(
        'visibilitychange',
        onVisibility
      );
  }, [
    soundEnabled,
    syncJazzBed,
  ]);


  React.useEffect(() => {
    const onSoundtrackState =
      event => {
        soundtrackPlayingRef.current =
          event?.detail?.playing ===
          true;

        syncJazzBed();
      };

    const onVoiceStart =
      () => {
        voiceDepthRef.current +=
          1;

        syncJazzBed(
          420
        );
      };

    const onVoiceEnd =
      () => {
        voiceDepthRef.current =
          Math.max(
            0,
            voiceDepthRef.current -
              1
          );

        syncJazzBed(
          700
        );
      };

    window.addEventListener(
      'fendisha:soundtrack-state',
      onSoundtrackState
    );

    window.addEventListener(
      'fendisha:voice-start',
      onVoiceStart
    );

    window.addEventListener(
      'fendisha:voice-end',
      onVoiceEnd
    );

    return () => {
      window.removeEventListener(
        'fendisha:soundtrack-state',
        onSoundtrackState
      );

      window.removeEventListener(
        'fendisha:voice-start',
        onVoiceStart
      );

      window.removeEventListener(
        'fendisha:voice-end',
        onVoiceEnd
      );
    };
  }, [
    syncJazzBed,
  ]);


  const beginReleaseSequence =
    React.useCallback(
      () => {
        releaseTimersRef.current.forEach(
          timer =>
            window.clearTimeout(
              timer
            )
        );

        releaseTimersRef.current = [];

        

        setReleasePhase(
          'changed'
        );

        const schedule =
          (
            delay,
            phase
          ) => {
            const timer =
              window.setTimeout(
                () => {
                  setReleasePhase(
                    phase
                  );
                },
                delay
              );

            releaseTimersRef.current.push(
              timer
            );
          };

        schedule(
          950,
          'oh'
        );

        schedule(
          2050,
          'opening'
        );

        schedule(
          3600,
          'ready'
        );
      },
      []
    );


  const applyReleased =
    React.useCallback(
      () => {
        safeSet(
          RELEASE_SEEN_KEY,
          '1'
        );

        setReleased(
          true
        );

        if (
          !previousReleasedRef.current
        ) {
          previousReleasedRef.current =
            true;

          beginReleaseSequence();
        }
      },
      [beginReleaseSequence]
    );


  const checkRelease =
    React.useCallback(
      async ({
        manual = false,
      } = {}) => {
        if (released) {
          return true;
        }

        /*
        | Production safety:
        | remote true can never open the real site before midnight.
        |
        | releasedPreview intentionally bypasses this for Darion only.
        */

        if (
          !realBirthdayStarted &&
          !releasedPreview
        ) {
          return false;
        }

        if (manual) {
          setChecking(
            true
          );
        }

        try {
          const isReleased =
            releasedPreview
              ? true
              : await fetchReleaseStatus();

          if (isReleased) {
            if (!releasedPreview) {
              applyReleased();
            }

            setCheckMessage('');
            return true;
          }

          if (manual) {
            const nextCount =
              checkCount + 1;

            setCheckCount(
              nextCount
            );

            setCheckMessage(
              CHECK_LINES[
                (nextCount - 1) %
                  CHECK_LINES.length
              ]
            );
          }

          return false;
        } catch {
          if (manual) {
            setCheckMessage(
              'the door refused to answer. very dramatic. try again in a second 😭'
            );
          }

          return false;
        } finally {
          if (manual) {
            setChecking(
              false
            );
          }
        }
      },
      [
        released,
        realBirthdayStarted,
        releasedPreview,
        checkCount,
        applyReleased,
      ]
    );


  React.useEffect(() => {
    if (
      released ||
      releasedPreview
    ) {
      return;
    }

    checkRelease();

    const timer =
      window.setInterval(
        () => {
          checkRelease();
        },
        POLL_EVERY_MS
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [
    released,
    releasedPreview,
    checkRelease,
  ]);


  React.useEffect(() => {
    return () => {
      releaseTimersRef.current.forEach(
        timer =>
          window.clearTimeout(
            timer
          )
      );
    };
  }, []);


  React.useEffect(() => {
    const onVisibility =
      () => {
        if (
          document.visibilityState ===
            'visible' &&
          !released &&
          !releasedPreview
        ) {
          setNow(
            Date.now()
          );

          checkRelease();
        }
      };

    document.addEventListener(
      'visibilitychange',
      onVisibility
    );

    return () =>
      document.removeEventListener(
        'visibilitychange',
        onVisibility
      );
  }, [
    released,
    releasedPreview,
    checkRelease,
  ]);


  if (darionPreview) {
    return children || null;
  }


  if (entered) {
    return children || null;
  }


  const onTouchSeal =
    () => {
      startAtmosphere();

      const next =
        touchCount + 1;

      setTouchCount(
        next
      );

      navigator.vibrate?.(
        next % 4 === 0
          ? [8, 22, 10]
          : 7
      );
    };


  const saveAnswer =
    () => {
      startAtmosphere();

      const clean =
        answer.trim();

      if (!clean) {
        return;
      }

      safeSet(
        QUESTION_KEY,
        clean
      );

      setAnswerSaved(
        true
      );

      navigator.vibrate?.(
        [8, 24, 8]
      );
    };


  const enterExperience =
    async () => {
      if (
        !released &&
        !releasedPreview
      ) {
        return;
      }

      if (preparingToEnter) {
        return;
      }

      /*
      | Never let Page 1 open while future photographs are still arriving.
      | In the normal case this resolves instantly because the locked prelude
      | has already spent minutes/hours warming the browser cache.
      */
      if (!preload.visualReady) {
        setPreparingToEnter(
          true
        );

        await preload
          .waitForVisuals();
      }

      if (!releasedPreview) {
        safeSet(
          ENTERED_KEY,
          '1'
        );
      }

      // Keep the jazz bed alive across the hand-off into the experience.
      syncJazzBed(
        500
      );

      navigator.vibrate?.(
        [12, 40, 18]
      );

      const gate =
        gateRef.current;

      if (
        gate &&
        !window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches
      ) {
        const animation =
          gate.animate(
            [
              {
                opacity: 1,
                transform:
                  'scale(1)',
                filter:
                  'blur(0)',
              },
              {
                opacity: 0,
                transform:
                  'scale(1.018)',
                filter:
                  'blur(13px)',
              },
            ],
            {
              duration: 760,
              easing:
                'cubic-bezier(.16,.84,.22,1)',
              fill:
                'forwards',
            }
          );

        animation.finished
          .catch(
            () => {}
          )
          .finally(
            () => {
              setEntered(
                true
              );
            }
          );

        return;
      }

      setEntered(
        true
      );
    };


  const touchLine =
    touchCount > 0
      ? TOUCH_LINES[
          (touchCount - 1) %
            TOUCH_LINES.length
        ]
      : 'one instruction: do not touch this.';


  const releaseCopy =
    releasePhase === 'changed'
      ? {
          eyebrow:
            'THE PAGE NOTICED SOMETHING',
          title:
            'something moved.',
          body:
            'do not refresh.',
        }
      : releasePhase === 'oh'
        ? {
            eyebrow:
              '...',
            title:
              'oh.',
            body:
              'that was not the clock.',
          }
        : releasePhase === 'opening'
          ? {
              eyebrow:
                'THE KEY TURNED',
              title:
                'I opened it.',
              body:
                'whatever u think is behind this door... keep that guess for a few more seconds.',
            }
          : {
              eyebrow:
                'FOR MY FENDISHA · ONLY NOW',
              title:
                'come in, fkr.',
              body:
                'and go slowly. nothing inside was put there by accident.',
            };


  /*
  |--------------------------------------------------------------------------
  | PHONE BLOCKER
  |--------------------------------------------------------------------------
  |
  | The real prelude is intentionally held back on narrow screens.
  | Same link. Bigger screen.
  |
  */

  if (
    smallScreen &&
    !mobilePreview
  ) {
    return html`
      <section
        ref=${gateRef}

        onPointerDownCapture=${
          startAtmosphere
        }

        className="
          relative
          min-h-[100svh]
          overflow-hidden
          bg-[#fff9fc]
          px-5
          py-7
          text-plum
        "
      >

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
          "
        >
          <div
            className="
              absolute
              left-1/2
              top-[43%]
              -translate-x-1/2
              -translate-y-1/2
              select-none
              font-display
              text-[18rem]
              font-semibold
              leading-none
              tracking-[-.12em]
              text-purple-950/[.035]
            "
          >
            21
          </div>

          <div
            className="
              absolute
              -left-20
              top-12
              h-64
              w-64
              rounded-full
              bg-purple-100/60
              blur-3xl
            "
          ></div>

          <div
            className="
              absolute
              -right-24
              bottom-10
              h-72
              w-72
              rounded-full
              bg-pink-100/70
              blur-3xl
            "
          ></div>
        </div>


        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[calc(100svh-3.5rem)]
            max-w-md
            flex-col
            justify-between
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
                tracking-[.26em]
                text-purple-500/70
              "
            >
              PRIVATE · 01 / 21
            </p>

            <span
              className="
                rounded-full
                border
                border-purple-200/70
                bg-white/80
                px-3
                py-2
                text-[9px]
                font-black
                uppercase
                tracking-[.16em]
                text-purple-600/70
                shadow-sm
              "
            >
              wrong screen
            </span>
          </div>


          <div
            className="
              py-12
              text-center
            "
          >
            <div
              className="
                mx-auto
                grid
                h-20
                w-20
                place-items-center
                rounded-full
                border
                border-purple-200/80
                bg-white/82
                shadow-[0_22px_70px_rgba(103,56,135,.10)]
              "
            >
              <span
                className="
                  font-display
                  text-3xl
                  font-semibold
                  italic
                  text-purple-700
                "
              >
                21
              </span>
            </div>

            <p
              className="
                mt-7
                text-[9px]
                font-black
                uppercase
                tracking-[.30em]
                text-purple-400
              "
            >
              FKR 😭 WRONG SCREEN
            </p>

            <h1
              className="
                mt-4
                font-display
                text-[clamp(3.6rem,17vw,5.4rem)]
                font-semibold
                italic
                leading-[.82]
                tracking-[-.06em]
                text-plum
              "
            >
              go get your
              <br />
              computer.
            </h1>

            <p
              className="
                mx-auto
                mt-6
                max-w-sm
                text-sm
                leading-6
                text-purple-900/66
              "
            >
              yes, I know the page technically works here.
              that is not the point.
            </p>

            <p
              className="
                mx-auto
                mt-3
                max-w-sm
                font-display
                text-xl
                italic
                leading-7
                text-purple-700
              "
            >
              some things were made for a bigger room.
            </p>

            <div
              className="
                mx-auto
                mt-8
                max-w-xs
                rounded-[1.6rem]
                border
                border-purple-200/70
                bg-white/80
                px-5
                py-4
                shadow-[0_18px_55px_rgba(103,56,135,.08)]
              "
            >
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[.22em]
                  text-purple-400
                "
              >
                SAME LINK · BIGGER SCREEN
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-purple-900/60
                "
              >
                open this exact link again from your laptop / computer.
                I will wait.
              </p>
            </div>

            ${
              !birthdayStarted
                ? html`
                    <p
                      className="
                        mt-7
                        font-display
                        text-2xl
                        italic
                        tracking-[.02em]
                        text-purple-600/55
                      "
                      style=${{
                        fontVariantNumeric:
                          'tabular-nums',
                      }}
                    >
                      ${pad2(countdown.hours)}:${pad2(countdown.minutes)}:${pad2(countdown.seconds)}
                    </p>
                  `
                : null
            }
          </div>


          <div
            className="
              text-center
            "
          >
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[.24em]
                text-purple-400/65
              "
            >
              everything here has a reason.
            </p>
          </div>

        </div>
      </section>
    `;
  }


  return html`
    <section
      ref=${gateRef}

      id="pre-birthday-gate"

      onPointerDownCapture=${
        startAtmosphere
      }

      className="
        relative
        min-h-[100svh]
        overflow-hidden
        bg-[#fff9fc]
        px-5
        py-7
        text-plum
        sm:px-7
        sm:py-8
      "
    >

      <!-- ================================= -->
      <!-- CINEMATIC BIRTHDAY FIELD -->
      <!-- ================================= -->

      <div
        aria-hidden="true"

        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            inset-0
          "
          style=${{
            background:
              `
                radial-gradient(circle at 50% 10%, rgba(240,215,250,.72), transparent 33%),
                radial-gradient(circle at 7% 82%, rgba(248,213,231,.62), transparent 30%),
                radial-gradient(circle at 92% 74%, rgba(225,206,243,.48), transparent 31%),
                linear-gradient(180deg, #fffafd 0%, #fff8fc 52%, #fffafd 100%)
              `,
          }}
        ></div>


        <div
          className="
            prelude-giant-21
            absolute
            left-1/2
            top-[46%]
            -translate-x-1/2
            -translate-y-1/2
            select-none
            font-display
            text-[clamp(24rem,52vw,52rem)]
            font-semibold
            leading-none
            tracking-[-.13em]
            text-purple-950
          "

          style=${{
            opacity:
              visualReleased
                ? 0.070
                : birthdayStarted
                  ? 0.050
                  : 0.030,
          }}
        >
          21
        </div>


        <div
          className="
            prelude-halo-one
            absolute
            left-1/2
            top-[46%]
            h-[min(62vw,760px)]
            w-[min(62vw,760px)]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-purple-200/45
          "
        ></div>


        <div
          className="
            prelude-halo-two
            absolute
            left-1/2
            top-[46%]
            h-[min(45vw,540px)]
            w-[min(45vw,540px)]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-pink-200/50
          "
        ></div>


        ${
          CLUES.map(
            clue => html`
              <span
                key=${clue.id}

                className="
                  prelude-clue
                  absolute
                  select-none
                  font-display
                  text-sm
                  font-semibold
                  italic
                  tracking-[.12em]
                  text-purple-600/28
                "

                style=${{
                  left:
                    clue.left,
                  top:
                    clue.top,
                  transform:
                    `rotate(${clue.rotate})`,
                  animationDelay:
                    clue.delay,
                }}
              >
                ${clue.text}
              </span>
            `
          )
        }


        ${
          Array.from(
            { length: 18 },
            (_, index) => {
              const left =
                `${(index * 37 + 7) % 97}%`;

              const size =
                4 +
                ((index * 11) % 8);

              const delay =
                -(
                  ((index * 17) % 60) /
                  10
                );

              const duration =
                6.5 +
                ((index * 13) % 28) /
                  10;

              return html`
                <span
                  key=${`birthday-dust-${index}`}

                  className="
                    prelude-birthday-dust
                    absolute
                    -top-8
                    rounded-full
                  "

                  style=${{
                    left,
                    width:
                      `${size}px`,
                    height:
                      `${size}px`,
                    animationDuration:
                      `${duration}s`,
                    animationDelay:
                      `${delay}s`,
                    background:
                      index % 3 === 0
                        ? 'rgba(207,111,169,.32)'
                        : index % 3 === 1
                          ? 'rgba(183,128,220,.30)'
                          : 'rgba(245,198,223,.46)',
                  }}
                ></span>
              `;
            }
          )
        }

      </div>


      <!-- ================================= -->
      <!-- TOP BAR -->
      <!-- ================================= -->

      <div
        className="
          relative
          z-20
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          gap-5
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              h-px
              w-8
              bg-purple-300/70
            "
          ></span>

          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[.30em]
              text-purple-500/72
            "
          >
            PRIVATE PRELUDE · 01 / 21
          </p>
        </div>


        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <button
            type="button"

            onClick=${
              event => {
                event.stopPropagation();
                startAtmosphere();
              }
            }

            className="
              hidden
              items-center
              gap-2
              rounded-full
              border
              border-purple-200/70
              bg-white/76
              px-3
              py-2
              text-[9px]
              font-black
              uppercase
              tracking-[.16em]
              text-purple-600/68
              shadow-sm
              backdrop-blur-xl
              sm:inline-flex
            "
          >
            <span>
              ${
                soundEnabled
                  ? '♪'
                  : '○'
              }
            </span>

            ${
              soundEnabled
                ? jazzAvailable
                  ? 'sound · whispering'
                  : 'tick · whispering'
                : 'tap once for sound'
            }
          </button>


          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-purple-200/70
              bg-white/76
              px-3
              py-2
              text-[9px]
              font-black
              uppercase
              tracking-[.16em]
              text-purple-600/68
              shadow-sm
              backdrop-blur-xl
            "
          >
            <span
              className=${
                visualReleased
                  ? 'prelude-status-dot prelude-status-dot-open'
                  : 'prelude-status-dot'
              }
            ></span>

            ${
              visualReleased
                ? 'door open'
                : 'sealed'
            }
          </div>

        </div>

      </div>


      <!-- ================================= -->
      <!-- MAIN STAGE -->
      <!-- ================================= -->

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100svh-6rem)]
          max-w-7xl
          flex-col
          items-center
          justify-center
          py-10
          text-center
        "
      >

        ${
          visualReleased
            ? html`

                <!-- ================================= -->
                <!-- RELEASED -->
                <!-- ================================= -->

                <div
                  className="
                    mx-auto
                    w-full
                    max-w-4xl
                  "
                >

                  <div
                    className="
                      mx-auto
                      grid
                      h-24
                      w-24
                      place-items-center
                      rounded-full
                      border
                      border-purple-200/80
                      bg-white/82
                      shadow-[0_26px_90px_rgba(103,56,135,.14)]
                      backdrop-blur-xl
                    "
                  >
                    <div
                      className=${
                        releasePhase === 'ready' ||
                        releasedPreview
                          ? 'prelude-seal prelude-seal-open'
                          : 'prelude-seal prelude-seal-unlocking'
                      }
                    >
                      ${
                        releasePhase === 'ready' ||
                        releasedPreview
                          ? '↗'
                          : '21'
                      }
                    </div>
                  </div>


                  <p
                    key=${`${releasePhase}-eyebrow`}
                    className="
                      prelude-copy-enter
                      mt-8
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[.34em]
                      text-purple-400
                    "
                  >
                    ${
                      releasedPreview
                        ? 'FOR MY FENDISHA · ONLY NOW'
                        : releaseCopy.eyebrow
                    }
                  </p>


                  <h1
                    key=${`${releasePhase}-title`}
                    className="
                      prelude-copy-enter
                      mt-3
                      font-display
                      text-[clamp(5rem,12vw,9.5rem)]
                      font-semibold
                      italic
                      leading-[.76]
                      tracking-[-.075em]
                      text-plum
                    "
                  >
                    ${
                      releasedPreview
                        ? 'come in, fkr.'
                        : releaseCopy.title
                    }
                  </h1>


                  <p
                    key=${`${releasePhase}-body`}
                    className="
                      prelude-copy-enter
                      mx-auto
                      mt-7
                      max-w-2xl
                      font-display
                      text-2xl
                      italic
                      leading-8
                      text-purple-700
                    "
                  >
                    ${
                      releasedPreview
                        ? 'and go slowly. nothing inside was put there by accident.'
                        : releaseCopy.body
                    }
                  </p>


                  ${
                    releasePhase === 'ready' ||
                    releasedPreview
                      ? html`

                          <div
                            className="
                              mx-auto
                              mt-8
                              max-w-xl
                              rounded-[1.8rem]
                              border
                              border-purple-200/65
                              bg-white/72
                              px-6
                              py-5
                              shadow-[0_22px_70px_rgba(103,56,135,.09)]
                              backdrop-blur-xl
                            "
                          >
                            <p
                              className="
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[.26em]
                                text-purple-400
                              "
                            >
                              ${
                                preparingToEnter
                                  ? 'ONE MOMENT, MY LADY'
                                  : 'ONE THING BEFORE THE DOOR'
                              }
                            </p>

                            <p
                              className="
                                mt-3
                                text-sm
                                leading-6
                                text-purple-900/66
                              "
                            >
                              ${
                                preparingToEnter
                                  ? 'A lady should never be made to witness unfinished preparations. The photographs are being put in their proper places.'
                                  : 'whatever u think this is right now — keep the guess. I would rather let the first page answer badly than explain it well.'
                              }
                            </p>

                            <p
                              className="
                                mt-3
                                font-display
                                text-xl
                                italic
                                text-purple-700
                              "
                            >
                              ${
                                preparingToEnter
                                  ? preload.visualPercent >= 90
                                    ? 'one final inspection…'
                                    : preload.visualPercent >= 70
                                      ? 'hiding twenty-one little things…'
                                      : preload.visualPercent >= 45
                                        ? 'arranging the photographs…'
                                        : 'drawing the curtains…'
                                  : 'everything has a reason. even the stupid little things.'
                              }
                            </p>
                          </div>


                          <button
                            type="button"

                            onClick=${
                              enterExperience
                            }

                            disabled=${
                              preparingToEnter
                            }

                            className="
                              group
                              relative
                              mt-9
                              inline-flex
                              min-h-[66px]
                              items-center
                              gap-4
                              overflow-hidden
                              rounded-full
                              px-10
                              py-4
                              font-display
                              text-2xl
                              font-semibold
                              italic
                              text-white
                              shadow-[0_28px_90px_rgba(111,59,142,.27)]
                              transition-transform
                              duration-300
                              hover:-translate-y-1
                              hover:scale-[1.025]
                              active:scale-[.985]
                            "

                            style=${{
                              background:
                                'linear-gradient(135deg,#663382,#8f4fb3 52%,#cf6fa9)',
                            }}
                          >
                            <span>
                              ${
                                preparingToEnter
                                  ? `preparing the house · ${preload.visualPercent}%`
                                  : 'open the door'
                              }
                            </span>

                            <span
                              className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                              "
                            >
                              ${
                                preparingToEnter
                                  ? '…'
                                  : '→'
                              }
                            </span>
                          </button>


                          <p
                            className="
                              mt-4
                              text-[10px]
                              font-semibold
                              tracking-[.07em]
                              text-purple-500/56
                            "
                          >
                            ${
                              preparingToEnter
                                ? `${preload.visualDone} / ${preload.visualTotal} visual preparations checked`
                                : 'for My Fendisha 🍿 · nobody else'
                            }
                          </p>

                        `
                      : html`
                          <div
                            className="
                              mx-auto
                              mt-10
                              h-px
                              w-44
                              overflow-hidden
                              bg-purple-100
                            "
                          >
                            <div
                              className="
                                prelude-release-line
                                h-full
                                w-14
                                bg-purple-400/70
                              "
                            ></div>
                          </div>
                        `
                  }

                </div>

              `
            : birthdayStarted
              ? html`

                  <!-- ================================= -->
                  <!-- BIRTHDAY, STILL LOCKED -->
                  <!-- ================================= -->

                  <div
                    className="
                      mx-auto
                      w-full
                      max-w-4xl
                    "
                  >

                    <p
                      className="
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[.34em]
                        text-purple-400
                      "
                    >
                      AUGUST 18 · THE CLOCK KEPT ITS PROMISE
                    </p>


                    <h1
                      className="
                        mt-4
                        font-display
                        text-[clamp(5.4rem,13vw,10rem)]
                        font-semibold
                        leading-[.73]
                        tracking-[-.08em]
                        text-plum
                      "
                    >
                      21.
                    </h1>


                    <p
                      className="
                        mt-5
                        font-display
                        text-[clamp(2.8rem,6vw,5rem)]
                        font-semibold
                        italic
                        leading-none
                        text-purple-700
                      "
                    >
                      happy birthday, My Fendisha. 💜
                    </p>


                    <p
                      className="
                        mx-auto
                        mt-7
                        max-w-2xl
                        text-sm
                        leading-7
                        text-purple-900/64
                        sm:text-base
                      "
                    >
                      the countdown was real.
                      unfortunately, it was never the key.
                    </p>


                    <div
                      className="
                        mx-auto
                        mt-9
                        max-w-xl
                        rounded-[2rem]
                        border
                        border-purple-200/70
                        bg-white/80
                        p-6
                        shadow-[0_26px_90px_rgba(103,56,135,.11)]
                        backdrop-blur-xl
                      "
                    >

                      <button
                        type="button"

                        onClick=${
                          () => {
                            startAtmosphere();
                            checkRelease({
                              manual: true,
                            });
                          }
                        }

                        disabled=${
                          checking
                        }

                        className="
                          group
                          flex
                          w-full
                          items-center
                          gap-4
                          rounded-[1.4rem]
                          border
                          border-purple-200/80
                          bg-purple-50/70
                          px-5
                          py-5
                          text-left
                          transition-all
                          duration-300
                          hover:border-purple-300
                          hover:bg-purple-50
                          disabled:cursor-wait
                        "
                      >
                        <span
                          className="
                            prelude-lock-pulse
                            grid
                            h-11
                            w-11
                            shrink-0
                            place-items-center
                            rounded-full
                            bg-white
                            font-display
                            text-lg
                            font-semibold
                            italic
                            text-purple-700
                            shadow-sm
                          "
                        >
                          21
                        </span>

                        <span
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <span
                            className="
                              block
                              text-[9px]
                              font-black
                              uppercase
                              tracking-[.22em]
                              text-purple-400
                            "
                          >
                            ${
                              checking
                                ? 'LISTENING AT THE DOOR...'
                                : 'DARION HAS NOT TURNED THE KEY'
                            }
                          </span>

                          <span
                            className="
                              mt-1
                              block
                              font-display
                              text-xl
                              font-semibold
                              italic
                              text-plum
                            "
                          >
                            ${
                              checking
                                ? 'one second...'
                                : 'touch it if u really think that helps.'
                            }
                          </span>
                        </span>

                        <span
                          className="
                            text-purple-400
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        >
                          →
                        </span>
                      </button>


                      ${
                        checkMessage
                          ? html`
                              <p
                                key=${checkMessage}
                                className="
                                  prelude-copy-enter
                                  mt-5
                                  font-display
                                  text-xl
                                  italic
                                  text-purple-700
                                "
                              >
                                ${checkMessage}
                              </p>
                            `
                          : null
                      }


                      <div
                        className="
                          mx-auto
                          my-6
                          h-px
                          w-20
                          bg-gradient-to-r
                          from-transparent
                          via-purple-300
                          to-transparent
                        "
                      ></div>


                      <p
                        className="
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[.24em]
                          text-purple-400
                        "
                      >
                        TINY NOTE
                      </p>

                      <p
                        className="
                          mt-2
                          text-sm
                          leading-6
                          text-purple-900/64
                        "
                      >
                        when this finally opens, do not rush through it.
                        some details will look random before they make sense.
                      </p>

                      <p
                        className="
                          mt-3
                          font-display
                          text-xl
                          italic
                          text-purple-700
                        "
                      >
                        none of them are random.
                      </p>

                    </div>


                    <p
                      className="
                        mx-auto
                        mt-7
                        max-w-lg
                        text-xs
                        leading-5
                        text-purple-900/50
                      "
                    >
                      go enjoy being 21 for a minute. I will know when it is time.
                    </p>

                  </div>

                `
              : html`

                  <!-- ================================= -->
                  <!-- PRE-MIDNIGHT · MAIN MYSTERY -->
                  <!-- ================================= -->

                  <div
                    className="
                      mx-auto
                      w-full
                      max-w-6xl
                    "
                  >

                    <p
                      className="
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[.36em]
                        text-purple-400
                      "
                    >
                      ${visitCopy.kicker}
                    </p>


                    <h1
                      className="
                        mx-auto
                        mt-4
                        max-w-5xl
                        font-display
                        text-[clamp(5.6rem,12vw,10rem)]
                        font-semibold
                        italic
                        leading-[.74]
                        tracking-[-.08em]
                        text-plum
                      "
                    >
                      ${visitCopy.title}
                    </h1>


                    <p
                      className="
                        mx-auto
                        mt-6
                        max-w-2xl
                        text-sm
                        leading-7
                        text-purple-900/64
                        sm:text-base
                      "
                    >
                      ${visitCopy.body}
                    </p>


                    <!-- ULTRA CLEAN HOROLOGY DISPLAY -->

                    <div
                      className="
                        relative
                        mx-auto
                        mt-8
                        max-w-5xl
                        overflow-hidden
                        rounded-[2.4rem]
                        border
                        border-purple-200/70
                        bg-white/74
                        px-6
                        py-7
                        shadow-[0_32px_100px_rgba(103,56,135,.10)]
                        backdrop-blur-2xl
                        sm:px-9
                        sm:py-9
                      "
                    >

                      <div
                        aria-hidden="true"
                        className="
                          pointer-events-none
                          absolute
                          inset-x-0
                          top-0
                          h-px
                          bg-gradient-to-r
                          from-transparent
                          via-purple-300/65
                          to-transparent
                        "
                      ></div>


                      <div
                        className="
                          flex
                          items-end
                          justify-between
                          gap-6
                          text-left
                        "
                      >
                        <div>
                          <p
                            className="
                              text-[9px]
                              font-black
                              uppercase
                              tracking-[.27em]
                              text-purple-400
                            "
                          >
                            ADDIS ABABA · AUGUST 17 → 18
                          </p>

                          <p
                            className="
                              mt-2
                              font-display
                              text-2xl
                              italic
                              text-purple-700
                            "
                          >
                            the only honest thing on this page
                          </p>
                        </div>


                        <p
                          className="
                            hidden
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[.22em]
                            text-purple-400/70
                            sm:block
                          "
                        >
                          UNTIL TWENTY-ONE
                        </p>
                      </div>


                      <div
                        className="
                          mt-6
                          flex
                          items-baseline
                          justify-center
                          gap-[clamp(.4rem,2vw,1.4rem)]
                        "
                        style=${{
                          fontVariantNumeric:
                            'tabular-nums',
                        }}
                      >

                        <div
                          className="
                            min-w-0
                            text-center
                          "
                        >
                          <span
                            className="
                              block
                              font-display
                              text-[clamp(4.8rem,10vw,8.4rem)]
                              font-semibold
                              leading-none
                              tracking-[-.07em]
                              text-plum
                            "
                          >
                            ${pad2(countdown.hours)}
                          </span>

                          <span
                            className="
                              mt-2
                              block
                              text-[8px]
                              font-black
                              uppercase
                              tracking-[.26em]
                              text-purple-400
                            "
                          >
                            hours
                          </span>
                        </div>


                        <span
                          className="
                            prelude-colon
                            -translate-y-4
                            font-display
                            text-[clamp(3.6rem,8vw,6.6rem)]
                            font-light
                            leading-none
                            text-purple-300
                          "
                        >
                          :
                        </span>


                        <div
                          className="
                            min-w-0
                            text-center
                          "
                        >
                          <span
                            className="
                              block
                              font-display
                              text-[clamp(4.8rem,10vw,8.4rem)]
                              font-semibold
                              leading-none
                              tracking-[-.07em]
                              text-plum
                            "
                          >
                            ${pad2(countdown.minutes)}
                          </span>

                          <span
                            className="
                              mt-2
                              block
                              text-[8px]
                              font-black
                              uppercase
                              tracking-[.26em]
                              text-purple-400
                            "
                          >
                            minutes
                          </span>
                        </div>


                        <span
                          className="
                            prelude-colon
                            -translate-y-4
                            font-display
                            text-[clamp(3.6rem,8vw,6.6rem)]
                            font-light
                            leading-none
                            text-purple-300
                          "
                        >
                          :
                        </span>


                        <div
                          className="
                            min-w-0
                            text-center
                          "
                        >
                          <span
                            className="
                              prelude-second-number
                              block
                              font-display
                              text-[clamp(4.8rem,10vw,8.4rem)]
                              font-semibold
                              leading-none
                              tracking-[-.07em]
                              text-plum
                            "
                          >
                            ${pad2(countdown.seconds)}
                          </span>

                          <span
                            className="
                              mt-2
                              block
                              text-[8px]
                              font-black
                              uppercase
                              tracking-[.26em]
                              text-purple-400
                            "
                          >
                            seconds
                          </span>
                        </div>

                      </div>


                      <div
                        className="
                          mx-auto
                          mt-6
                          max-w-3xl
                        "
                      >
                        <div
                          className="
                            relative
                            h-[3px]
                            overflow-hidden
                            rounded-full
                            bg-purple-100/85
                          "
                        >
                          <div
                            className="
                              absolute
                              inset-y-0
                              left-0
                              rounded-full
                            "
                            style=${{
                              width:
                                `${midnightProgress * 100}%`,
                              background:
                                'linear-gradient(90deg,#b780dc,#d37ab7,#f2a3c6)',
                            }}
                          ></div>

                          <span
                            className="
                              absolute
                              top-1/2
                              h-2.5
                              w-2.5
                              -translate-x-1/2
                              -translate-y-1/2
                              rounded-full
                              bg-white
                              shadow-[0_0_0_3px_rgba(183,128,220,.25)]
                            "
                            style=${{
                              left:
                                `${midnightProgress * 100}%`,
                            }}
                          ></span>
                        </div>

                        <div
                          className="
                            mt-3
                            flex
                            items-center
                            justify-between
                            gap-4
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[.20em]
                            text-purple-400/68
                          "
                        >
                          <span>
                            today
                          </span>
                          <span>
                            21
                          </span>
                        </div>
                      </div>


                      <p
                        className="
                          mx-auto
                          mt-6
                          max-w-xl
                          font-display
                          text-xl
                          italic
                          leading-7
                          text-purple-700
                        "
                      >
                        when this reaches zero, one thing changes.
                        not everything.
                      </p>

                    </div>


                    <!-- ROMANTIC NOTE + CLUE -->

                    <div
                      className="
                        mx-auto
                        mt-6
                        grid
                        max-w-5xl
                        gap-4
                        lg:grid-cols-[1fr_.88fr]
                      "
                    >

                      <div
                        className="
                          rounded-[1.9rem]
                          border
                          border-purple-200/60
                          bg-white/68
                          px-6
                          py-5
                          text-left
                          shadow-[0_20px_65px_rgba(103,56,135,.07)]
                          backdrop-blur-xl
                        "
                      >
                        <p
                          className="
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[.25em]
                            text-purple-400
                          "
                        >
                          A VERY SMALL RULE
                        </p>

                        <p
                          className="
                            mt-3
                            font-display
                            text-2xl
                            italic
                            leading-8
                            text-plum
                          "
                        >
                          everything here has a reason.
                        </p>

                        <p
                          className="
                            mt-2
                            text-sm
                            leading-6
                            text-purple-900/62
                          "
                        >
                          some things on this page belong to tonight.
                          some belong to tomorrow.
                          and some will only make sense much later inside.
                        </p>

                        <p
                          className="
                            mt-3
                            text-xs
                            font-semibold
                            leading-5
                            text-purple-600/62
                          "
                        >
                          I am not telling u which is which.
                        </p>
                      </div>


                      <button
                        type="button"

                        onClick=${
                          onTouchSeal
                        }

                        className="
                          group
                          relative
                          overflow-hidden
                          rounded-[1.9rem]
                          border
                          border-pink-200/65
                          bg-white/70
                          px-6
                          py-5
                          text-left
                          shadow-[0_20px_65px_rgba(103,56,135,.07)]
                          backdrop-blur-xl
                          transition-transform
                          duration-300
                          hover:-translate-y-1
                          active:scale-[.988]
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-4
                          "
                        >
                          <span
                            className="
                              prelude-wax
                              grid
                              h-14
                              w-14
                              shrink-0
                              place-items-center
                              rounded-full
                              font-display
                              text-xl
                              font-semibold
                              italic
                              text-purple-700
                            "
                          >
                            21
                          </span>

                          <span>
                            <span
                              className="
                                block
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[.22em]
                                text-purple-400
                              "
                            >
                              SEALED · DO NOT PRESS
                            </span>

                            <span
                              key=${touchLine}
                              className="
                                prelude-copy-enter
                                mt-2
                                block
                                font-display
                                text-lg
                                italic
                                leading-6
                                text-purple-700
                              "
                            >
                              ${touchLine}
                            </span>
                          </span>
                        </div>

                        <span
                          aria-hidden="true"
                          className="
                            absolute
                            -right-7
                            -top-7
                            font-display
                            text-8xl
                            font-semibold
                            italic
                            text-purple-100/55
                          "
                        >
                          01
                        </span>
                      </button>

                    </div>


                    <!-- ONE QUESTION -->

                    <div
                      className="
                        mx-auto
                        mt-6
                        max-w-3xl
                      "
                    >

                      ${
                        !questionOpen
                          ? html`
                              <button
                                type="button"

                                onClick=${
                                  () => {
                                    startAtmosphere();
                                    setQuestionOpen(
                                      true
                                    );
                                  }
                                }

                                className="
                                  group
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-full
                                  border
                                  border-purple-200/60
                                  bg-white/62
                                  px-5
                                  py-3
                                  text-[10px]
                                  font-bold
                                  tracking-[.05em]
                                  text-purple-600/68
                                  shadow-sm
                                  backdrop-blur-xl
                                  transition-all
                                  hover:-translate-y-0.5
                                  hover:text-purple-700
                                "
                              >
                                there is one question I am allowed to ask before tomorrow

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
                            `
                          : html`
                              <div
                                className="
                                  prelude-question-enter
                                  rounded-[2rem]
                                  border
                                  border-purple-200/65
                                  bg-white/78
                                  p-6
                                  text-left
                                  shadow-[0_24px_80px_rgba(103,56,135,.09)]
                                  backdrop-blur-xl
                                  sm:p-7
                                "
                              >
                                <div
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-5
                                  "
                                >
                                  <p
                                    className="
                                      text-[9px]
                                      font-black
                                      uppercase
                                      tracking-[.25em]
                                      text-purple-400
                                    "
                                  >
                                    ONE QUESTION · KEEP THE ANSWER
                                  </p>

                                  <span
                                    className="
                                      font-display
                                      text-lg
                                      italic
                                      text-purple-300
                                    "
                                  >
                                    01 / 21
                                  </span>
                                </div>


                                <p
                                  className="
                                    mt-4
                                    font-display
                                    text-3xl
                                    italic
                                    leading-9
                                    text-plum
                                    sm:text-4xl
                                    sm:leading-[1.05]
                                  "
                                >
                                  if u could meet one version of yourself from the past for five minutes...
                                  which one would u choose?
                                </p>


                                ${
                                  answerSaved
                                    ? html`
                                        <div
                                          className="
                                            mt-6
                                            rounded-[1.4rem]
                                            bg-purple-50/80
                                            px-5
                                            py-4
                                          "
                                        >
                                          <p
                                            className="
                                              text-[9px]
                                              font-black
                                              uppercase
                                              tracking-[.20em]
                                              text-purple-400
                                            "
                                          >
                                            ANSWER SEALED
                                          </p>

                                          <p
                                            className="
                                              mt-2
                                              font-display
                                              text-xl
                                              italic
                                              text-purple-700
                                            "
                                          >
                                            noted. no reason I asked btw 😭
                                          </p>
                                        </div>
                                      `
                                    : html`
                                        <textarea
                                          value=${answer}

                                          onInput=${
                                            event =>
                                              setAnswer(
                                                event.currentTarget.value
                                              )
                                          }

                                          rows="3"

                                          placeholder="write whichever version came to mind first..."

                                          className="
                                            mt-6
                                            w-full
                                            resize-none
                                            rounded-[1.4rem]
                                            border
                                            border-purple-200/80
                                            bg-[#fffafd]/90
                                            px-4
                                            py-3
                                            text-sm
                                            leading-6
                                            text-purple-950
                                            outline-none
                                            transition
                                            placeholder:text-purple-300
                                            focus:border-purple-400
                                            focus:ring-4
                                            focus:ring-purple-100
                                          "
                                        ></textarea>

                                        <button
                                          type="button"

                                          onClick=${
                                            saveAnswer
                                          }

                                          disabled=${
                                            !answer.trim()
                                          }

                                          className="
                                            mt-3
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            bg-purple-700
                                            px-5
                                            py-2.5
                                            text-xs
                                            font-bold
                                            text-white
                                            transition
                                            hover:-translate-y-0.5
                                            hover:bg-purple-800
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                          "
                                        >
                                          seal this answer
                                          <span>→</span>
                                        </button>
                                      `
                                }
                              </div>
                            `
                      }

                    </div>

                  </div>

                `
        }


        <!-- ================================= -->
        <!-- FOOTER -->
        <!-- ================================= -->

        <div
          className="
            mt-10
            flex
            items-center
            gap-4
            text-[9px]
            font-black
            uppercase
            tracking-[.27em]
            text-purple-400/62
          "
        >
          <span
            className="
              h-px
              w-10
              bg-purple-200
            "
          ></span>

          <span>
            01 / 21
          </span>

          <span
            className="
              h-px
              w-10
              bg-purple-200
            "
          ></span>
        </div>


        <p
          className="
            mt-3
            text-[9px]
            font-semibold
            tracking-[.08em]
            text-purple-500/42
          "
        >
          My Fendisha 🍿 · some things make sense only after u walk past them.
        </p>

      </div>


      <!-- ================================= -->
      <!-- PAGE LOCAL MOTION -->
      <!-- ================================= -->

      <style>
        ${`

          @keyframes preludeHaloOne {
            from {
              transform:
                translate(-50%, -50%)
                rotate(0deg)
                scale(1);
            }

            50% {
              transform:
                translate(-50%, -50%)
                rotate(180deg)
                scale(1.025);
            }

            to {
              transform:
                translate(-50%, -50%)
                rotate(360deg)
                scale(1);
            }
          }


          @keyframes preludeHaloTwo {
            from {
              transform:
                translate(-50%, -50%)
                rotate(360deg);
            }

            to {
              transform:
                translate(-50%, -50%)
                rotate(0deg);
            }
          }


          @keyframes preludeGiant21 {
            0%, 100% {
              transform:
                translate(-50%, -50%)
                scale(1);
            }

            50% {
              transform:
                translate(-50%, -50%)
                scale(1.018);
            }
          }


          @keyframes preludeClueFloat {
            0%, 100% {
              opacity: .22;
              translate: 0 0;
            }

            50% {
              opacity: .42;
              translate: 0 -8px;
            }
          }


          @keyframes preludeBirthdayDust {
            0% {
              opacity: 0;
              transform:
                translate3d(0,-10vh,0)
                rotate(0deg);
            }

            12% {
              opacity: .75;
            }

            82% {
              opacity: .55;
            }

            100% {
              opacity: 0;
              transform:
                translate3d(36px,110vh,0)
                rotate(260deg);
            }
          }


          @keyframes preludePulse {
            0%, 100% {
              transform: scale(1);
              opacity: .62;
            }

            50% {
              transform: scale(1.34);
              opacity: 1;
            }
          }


          @keyframes preludeColon {
            0%, 100% {
              opacity: .40;
            }

            48% {
              opacity: .88;
            }

            52% {
              opacity: .88;
            }
          }


          @keyframes preludeSecond {
            from {
              opacity: .72;
              transform: translateY(2px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }


          @keyframes preludeCopyEnter {
            from {
              opacity: 0;
              transform: translateY(12px);
              filter: blur(5px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }


          @keyframes preludeQuestionEnter {
            from {
              opacity: 0;
              transform:
                translateY(18px)
                scale(.985);
              filter: blur(6px);
            }

            to {
              opacity: 1;
              transform:
                translateY(0)
                scale(1);
              filter: blur(0);
            }
          }


          @keyframes preludeReleaseLine {
            0% {
              transform: translateX(-180%);
              opacity: 0;
            }

            18% {
              opacity: 1;
            }

            82% {
              opacity: 1;
            }

            100% {
              transform: translateX(420%);
              opacity: 0;
            }
          }


          @keyframes preludeSealUnlock {
            0%, 100% {
              transform:
                rotate(0deg)
                scale(1);
            }

            24% {
              transform:
                rotate(-4deg)
                scale(1.04);
            }

            52% {
              transform:
                rotate(3deg)
                scale(.98);
            }

            76% {
              transform:
                rotate(-1deg)
                scale(1.03);
            }
          }


          @keyframes preludeSealOpen {
            0% {
              transform:
                scale(.6)
                rotate(-24deg);
              opacity: 0;
            }

            70% {
              transform:
                scale(1.12)
                rotate(4deg);
              opacity: 1;
            }

            100% {
              transform:
                scale(1)
                rotate(0deg);
              opacity: 1;
            }
          }


          .prelude-giant-21 {
            animation:
              preludeGiant21
              8s
              ease-in-out
              infinite;
          }


          .prelude-halo-one {
            animation:
              preludeHaloOne
              52s
              linear
              infinite;
          }


          .prelude-halo-one::before {
            content: '';
            position: absolute;
            left: 13%;
            top: -4px;
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background:
              rgba(143,79,179,.30);
            box-shadow:
              0 0 0 5px
              rgba(143,79,179,.045);
          }


          .prelude-halo-two {
            animation:
              preludeHaloTwo
              36s
              linear
              infinite;
          }


          .prelude-halo-two::before {
            content: '';
            position: absolute;
            right: 9%;
            bottom: 5%;
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background:
              rgba(207,111,169,.34);
          }


          .prelude-clue {
            animation:
              preludeClueFloat
              5.5s
              ease-in-out
              infinite;
          }


          .prelude-birthday-dust {
            animation-name:
              preludeBirthdayDust;
            animation-timing-function:
              linear;
            animation-iteration-count:
              infinite;
          }


          .prelude-status-dot {
            display: block;
            width: 7px;
            height: 7px;
            border-radius: 999px;
            background: #c9a5dc;
            animation:
              preludePulse
              2.2s
              ease-in-out
              infinite;
          }


          .prelude-status-dot-open {
            background: #9652b8;
          }


          .prelude-lock-pulse {
            animation:
              preludePulse
              2.5s
              ease-in-out
              infinite;
          }


          .prelude-colon {
            animation:
              preludeColon
              1s
              ease-in-out
              infinite;
          }


          .prelude-second-number {
            animation:
              preludeSecond
              260ms
              ease-out
              both;
          }


          .prelude-copy-enter {
            animation:
              preludeCopyEnter
              640ms
              cubic-bezier(.18,.82,.22,1)
              both;
          }


          .prelude-question-enter {
            animation:
              preludeQuestionEnter
              760ms
              cubic-bezier(.16,.84,.22,1)
              both;
          }


          .prelude-release-line {
            animation:
              preludeReleaseLine
              1.55s
              ease-in-out
              infinite;
          }


          .prelude-seal {
            display: grid;
            place-items: center;
            width: 58px;
            height: 58px;
            border-radius: 999px;
            background:
              linear-gradient(
                135deg,
                #f7eafa,
                #fbe5f1
              );
            box-shadow:
              inset 0 0 0 1px
                rgba(143,79,179,.14);
            font-family:
              'Cormorant Garamond',
              serif;
            font-weight: 700;
            font-style: italic;
            color: #6f3b8e;
          }


          .prelude-wax {
            background:
              radial-gradient(
                circle at 35% 30%,
                #f9edf9,
                #efdcf5 48%,
                #e9d1f2 100%
              );
            box-shadow:
              inset 0 0 0 1px
                rgba(143,79,179,.16),
              inset 3px 4px 12px
                rgba(255,255,255,.72),
              0 9px 24px
                rgba(103,56,135,.12);
          }


          .prelude-seal-unlocking {
            animation:
              preludeSealUnlock
              950ms
              ease-in-out
              infinite;
          }


          .prelude-seal-open {
            animation:
              preludeSealOpen
              760ms
              cubic-bezier(.34,1.56,.64,1)
              both;
          }


          @media (
            prefers-reduced-motion:
            reduce
          ) {
            .prelude-giant-21,
            .prelude-halo-one,
            .prelude-halo-two,
            .prelude-clue,
            .prelude-birthday-dust,
            .prelude-status-dot,
            .prelude-lock-pulse,
            .prelude-colon,
            .prelude-second-number,
            .prelude-copy-enter,
            .prelude-question-enter,
            .prelude-release-line,
            .prelude-seal-unlocking,
            .prelude-seal-open {
              animation: none !important;
            }
          }

        `}
      </style>

    </section>
  `;
}
