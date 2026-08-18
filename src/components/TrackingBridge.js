import {
  React,
} from '../lib/react.js';

import {
  track,
} from '../lib/track.js';

/*
|--------------------------------------------------------------------------
| FENDISHA — TRACKING BRIDGE
|--------------------------------------------------------------------------
|
| Invisible React component. Renders nothing.
| Observes meaningful state transitions only.
|
*/

export function TrackingBridge({
  unlocked = false,
  sceneId = '',
  sceneIndex = 0,
  found,
  mood = '',
  oldSoul = false,
  secretCrushOpen = false,
}) {
  const mountedAtRef =
    React.useRef(Date.now());

  const unlockedRef =
    React.useRef(Boolean(unlocked));

  const sceneRef =
    React.useRef('');

  const sceneStartedAtRef =
    React.useRef(Date.now());

  const foundRef =
    React.useRef(new Set(found || []));

  const moodRef =
    React.useRef(mood || '');

  const oldSoulRef =
    React.useRef(Boolean(oldSoul));

  const secretCrushRef =
    React.useRef(Boolean(secretCrushOpen));

  const soundtrackPlayingRef =
    React.useRef(false);

  const currentSceneForEventsRef =
    React.useRef(sceneId || 'entry-gate');


  /* EXPERIENCE ENTERED — PreBirthdayGate has already let her through. */
  React.useEffect(() => {
    track('experience_opened', {
      scene: unlocked
        ? (sceneId || 'birthday-room')
        : 'entry-gate',
    });
  }, []);


  /* ENTRY GATE UNLOCKED */
  React.useEffect(() => {
    const wasUnlocked = unlockedRef.current;
    unlockedRef.current = Boolean(unlocked);

    if (!wasUnlocked && unlocked) {
      track('entry_unlocked');

      const firstScene = sceneId || 'birthday-room';
      sceneRef.current = firstScene;
      currentSceneForEventsRef.current = firstScene;
      sceneStartedAtRef.current = Date.now();

      track('scene_entered', {
        scene: firstScene,
        sceneIndex,
      });
    }
  }, [unlocked]);


  /* SCENE CHANGES + TIME SPENT ON PREVIOUS SCENE */
  React.useEffect(() => {
    if (!unlocked || !sceneId) return;

    currentSceneForEventsRef.current = sceneId;

    const previousScene = sceneRef.current;

    if (!previousScene) {
      sceneRef.current = sceneId;
      sceneStartedAtRef.current = Date.now();
      return;
    }

    if (previousScene === sceneId) return;

    const now = Date.now();
    const previousSeconds = Math.max(
      0,
      Math.round((now - sceneStartedAtRef.current) / 1000)
    );

    track('scene_entered', {
      scene: sceneId,
      sceneIndex,
      previousScene,
      previousSeconds,
    });

    sceneRef.current = sceneId;
    sceneStartedAtRef.current = now;

    if (sceneId === 'artifact') {
      track('experience_completed', {
        totalSeconds: Math.max(
          0,
          Math.round((now - mountedAtRef.current) / 1000)
        ),
      });
    }
  }, [unlocked, sceneId, sceneIndex]);


  /* MOOD CHOICE */
  React.useEffect(() => {
    if (mood && mood !== moodRef.current) {
      track('mood_selected', {
        mood,
      });
    }

    moodRef.current = mood || '';
  }, [mood]);


  /* OLD-SOUL TOGGLE */
  React.useEffect(() => {
    const before = oldSoulRef.current;
    const after = Boolean(oldSoul);

    if (before !== after) {
      track('old_soul_changed', {
        enabled: after,
        scene: currentSceneForEventsRef.current,
      });
    }

    oldSoulRef.current = after;
  }, [oldSoul]);


  /* HEARTS — only NEW finds */
  React.useEffect(() => {
    const current = new Set(found || []);
    const previous = foundRef.current;

    for (const id of current) {
      if (!previous.has(id)) {
        track('heart_found', {
          id: Number(id),
          totalFound: current.size,
          scene: currentSceneForEventsRef.current,
        });
      }
    }

    if (
      current.size >= 21 &&
      previous.size < 21
    ) {
      track('all_hearts_found', {
        totalFound: current.size,
      });
    }

    foundRef.current = current;
  }, [found]);


  /* SECRET #19 PROOF OPENED */
  React.useEffect(() => {
    const before = secretCrushRef.current;
    const after = Boolean(secretCrushOpen);

    if (!before && after) {
      track('secret_19_opened', {
        scene: currentSceneForEventsRef.current,
      });
    }

    secretCrushRef.current = after;
  }, [secretCrushOpen]);


  /* VOICE + SPOTIFY EVENTS — no changes required to those components. */
  React.useEffect(() => {
    const voiceStart = () => {
      track('voice_started', {
        scene: currentSceneForEventsRef.current,
      });
    };

    const voiceEnd = () => {
      track('voice_finished', {
        scene: currentSceneForEventsRef.current,
      });
    };

    const soundtrackState = event => {
      const playing = Boolean(
        event?.detail?.playing
      );

      if (
        playing &&
        !soundtrackPlayingRef.current
      ) {
        track('soundtrack_started', {
          scene: currentSceneForEventsRef.current,
        });
      }

      soundtrackPlayingRef.current = playing;
    };

    const cakeBlown = () => {
      track('cake_blown', {
        scene: 'finale',
      });
    };

    window.addEventListener(
      'fendisha:voice-start',
      voiceStart
    );

    window.addEventListener(
      'fendisha:voice-end',
      voiceEnd
    );

    window.addEventListener(
      'fendisha:soundtrack-state',
      soundtrackState
    );

    window.addEventListener(
      'fendisha:cake-blown',
      cakeBlown
    );

    return () => {
      window.removeEventListener(
        'fendisha:voice-start',
        voiceStart
      );
      window.removeEventListener(
        'fendisha:voice-end',
        voiceEnd
      );
      window.removeEventListener(
        'fendisha:soundtrack-state',
        soundtrackState
      );
      window.removeEventListener(
        'fendisha:cake-blown',
        cakeBlown
      );
    };
  }, []);


  /* TAB CLOSED / REFRESHED / LEFT */
  React.useEffect(() => {
    const pauseSession = () => {
      if (!unlockedRef.current) return;

      track('session_paused', {
        scene: currentSceneForEventsRef.current,
        secondsOnScene: Math.max(
          0,
          Math.round(
            (Date.now() - sceneStartedAtRef.current) / 1000
          )
        ),
      });
    };

    window.addEventListener(
      'pagehide',
      pauseSession
    );

    return () =>
      window.removeEventListener(
        'pagehide',
        pauseSession
      );
  }, []);


  return null;
}
