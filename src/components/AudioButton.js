import {
  React,
  html,
} from '../lib/react.js';

import {
  playAudio,
} from '../lib/audio.js';


/*
|--------------------------------------------------------------------------
| GLOBAL ACTIVE VOICE
|--------------------------------------------------------------------------
|
| Only one Darion voice note should play at a time.
|
*/

let activeVoice = null;


/*
|--------------------------------------------------------------------------
| EVENTS FOR OUR SOUNDTRACK
|--------------------------------------------------------------------------
*/

function emitVoiceStart() {
  window.dispatchEvent(
    new CustomEvent(
      'fendisha:voice-start'
    )
  );
}


function emitVoiceEnd() {
  window.dispatchEvent(
    new CustomEvent(
      'fendisha:voice-end'
    )
  );
}


/*
|--------------------------------------------------------------------------
| STOP CURRENT VOICE
|--------------------------------------------------------------------------
*/

function stopActiveVoice() {
  if (
    !activeVoice
  ) {
    return;
  }


  const current =
    activeVoice;


  activeVoice =
    null;


  try {
    current.audio?.pause?.();

    if (
      current.audio
    ) {
      current.audio.currentTime =
        0;
    }
  } catch {
    // safe stop
  }


  current.finish?.();
}


/*
|--------------------------------------------------------------------------
| AUDIO BUTTON
|--------------------------------------------------------------------------
*/

export function AudioButton({
  src,
  children,
  className = 'secondary-cta',
}) {
  const [
    playing,
    setPlaying,
  ] =
    React.useState(false);


  const audioRef =
    React.useRef(null);


  const finishedRef =
    React.useRef(false);


  /*
  |--------------------------------------------------------------------------
  | FINISH THIS VOICE
  |--------------------------------------------------------------------------
  */

  const finish =
    React.useCallback(
      () => {
        if (
          finishedRef.current
        ) {
          return;
        }


        finishedRef.current =
          true;


        setPlaying(
          false
        );


        if (
          activeVoice?.audio ===
          audioRef.current
        ) {
          activeVoice =
            null;
        }


        emitVoiceEnd();
      },
      []
    );


  /*
  |--------------------------------------------------------------------------
  | CLEANUP IF BUTTON/PAGE UNMOUNTS
  |--------------------------------------------------------------------------
  */

  React.useEffect(
    () => {
      return () => {
        const audio =
          audioRef.current;


        if (
          !audio
        ) {
          return;
        }


        try {
          audio.pause?.();
        } catch {
          // safe cleanup
        }


        if (
          activeVoice?.audio ===
          audio
        ) {
          activeVoice =
            null;

          if (
            !finishedRef.current
          ) {
            finishedRef.current =
              true;

            emitVoiceEnd();
          }
        }
      };
    },
    []
  );


  /*
  |--------------------------------------------------------------------------
  | PLAY / STOP
  |--------------------------------------------------------------------------
  */

  const toggleAudio =
    () => {
      /*
      | No source configured.
      */

      if (
        !src
      ) {
        return;
      }


      /*
      |--------------------------------------------------------------------------
      | SAME BUTTON IS ALREADY PLAYING
      |--------------------------------------------------------------------------
      */

      if (
        playing &&
        audioRef.current
      ) {
        try {
          audioRef.current.pause?.();

          audioRef.current.currentTime =
            0;
        } catch {
          // safe stop
        }


        finish();

        return;
      }


      /*
      |--------------------------------------------------------------------------
      | STOP ANOTHER VOICE FIRST
      |--------------------------------------------------------------------------
      */

      if (
        activeVoice
      ) {
        stopActiveVoice();
      }


      /*
      |--------------------------------------------------------------------------
      | CREATE AUDIO
      |--------------------------------------------------------------------------
      */

      let audio =
        null;


      try {
        audio =
          playAudio(
            src
          );
      } catch {
        return;
      }


      if (
        !audio
      ) {
        return;
      }


      audioRef.current =
        audio;

      finishedRef.current =
        false;


      activeVoice = {
        audio,
        finish,
      };


      setPlaying(
        true
      );


      /*
      | Tell soundtrack to pause.
      */

      emitVoiceStart();


      /*
      |--------------------------------------------------------------------------
      | AUDIO FINISHED
      |--------------------------------------------------------------------------
      */

      const onEnded =
        () => {
          cleanupListeners();

          finish();
        };


      /*
      |--------------------------------------------------------------------------
      | AUDIO FAILED
      |--------------------------------------------------------------------------
      */

      const onError =
        () => {
          cleanupListeners();

          finish();
        };


      /*
      |--------------------------------------------------------------------------
      | AUDIO WAS INTERRUPTED
      |--------------------------------------------------------------------------
      */

      const onAbort =
        () => {
          cleanupListeners();

          finish();
        };


      const cleanupListeners =
        () => {
          audio.removeEventListener?.(
            'ended',
            onEnded
          );

          audio.removeEventListener?.(
            'error',
            onError
          );

          audio.removeEventListener?.(
            'abort',
            onAbort
          );
        };


      audio.addEventListener?.(
        'ended',
        onEnded,
        {
          once: true,
        }
      );


      audio.addEventListener?.(
        'error',
        onError,
        {
          once: true,
        }
      );


      audio.addEventListener?.(
        'abort',
        onAbort,
        {
          once: true,
        }
      );


      navigator.vibrate?.(
        8
      );
    };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return html`
    <button
      type="button"

      className=${`
        ${className}

        ${playing
          ? 'is-playing'
          : ''
        }
      `}

      onClick=${toggleAudio}

      aria-pressed=${playing}

      aria-label=${
        playing
          ? 'Stop voice note'
          : 'Play voice note'
      }
    >

      ${
        playing
          ? html`
              <span
                className="
                  inline-flex

                  items-center

                  gap-2
                "
              >

                <span
                  className="
                    inline-flex

                    items-end

                    gap-[2px]
                  "

                  aria-hidden="true"
                >

                  <span
                    className="
                      h-2
                      w-[2px]

                      animate-pulse

                      rounded-full

                      bg-current
                    "
                  ></span>

                  <span
                    className="
                      h-3
                      w-[2px]

                      animate-pulse

                      rounded-full

                      bg-current
                    "

                    style=${{
                      animationDelay:
                        '120ms',
                    }}
                  ></span>

                  <span
                    className="
                      h-2
                      w-[2px]

                      animate-pulse

                      rounded-full

                      bg-current
                    "

                    style=${{
                      animationDelay:
                        '240ms',
                    }}
                  ></span>

                </span>


                <span>
                  playing...
                </span>

              </span>
            `

          : children
      }

    </button>
  `;
}