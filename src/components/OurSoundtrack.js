import {
  React,
  html,
} from '../lib/react.js';

import {
  soundtrack,
} from '../soundtrack.js';


const SPOTIFY_API_SCRIPT =
  'https://open.spotify.com/embed/iframe-api/v1';


/*
|--------------------------------------------------------------------------
| SPOTIFY URL
|--------------------------------------------------------------------------
*/

function getSpotifyUrl(value) {
  if (
    !value ||
    typeof value !== 'string'
  ) {
    return '';
  }

  const trimmed =
    value.trim();

  if (
    trimmed.startsWith(
      'https://open.spotify.com/'
    )
  ) {
    return trimmed;
  }

  return '';
}


/*
|--------------------------------------------------------------------------
| LOAD SPOTIFY IFRAME API ONCE
|--------------------------------------------------------------------------
*/

function loadSpotifyApi() {
  if (
    window.__fendishaSpotifyApi
  ) {
    return Promise.resolve(
      window.__fendishaSpotifyApi
    );
  }


  if (
    window.__fendishaSpotifyPromise
  ) {
    return window
      .__fendishaSpotifyPromise;
  }


  window.__fendishaSpotifyPromise =
    new Promise(
      (
        resolve,
        reject
      ) => {
        let settled =
          false;


        const finish = api => {
          if (
            settled ||
            !api
          ) {
            return;
          }

          settled =
            true;

          window.__fendishaSpotifyApi =
            api;

          resolve(
            api
          );
        };


        const previous =
          window
            .onSpotifyIframeApiReady;


        window
          .onSpotifyIframeApiReady =
          api => {
            finish(
              api
            );


            if (
              typeof previous ===
              'function'
            ) {
              try {
                previous(
                  api
                );
              } catch {
                // Never let another callback break ours.
              }
            }
          };


        const existing =
          document.querySelector(
            `script[src="${SPOTIFY_API_SCRIPT}"]`
          );


        if (!existing) {
          const script =
            document.createElement(
              'script'
            );

          script.src =
            SPOTIFY_API_SCRIPT;

          script.async =
            true;

          script.onerror =
            () => {
              if (
                settled
              ) {
                return;
              }

              settled =
                true;

              reject(
                new Error(
                  'Spotify iframe API failed to load.'
                )
              );
            };

          document.body.appendChild(
            script
          );
        }


        window.setTimeout(
          () => {
            if (
              settled
            ) {
              return;
            }

            settled =
              true;

            reject(
              new Error(
                'Spotify iframe API timed out.'
              )
            );
          },
          15000
        );
      }
    );


  return window
    .__fendishaSpotifyPromise;
}


/*
|--------------------------------------------------------------------------
| OUR SOUNDTRACK
|--------------------------------------------------------------------------
*/

export function OurSoundtrack({
  visible = true,
}) {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  |
  | activated becomes true the first time we reach Birthday Hero.
  |
  | After that, the Spotify mount stays alive for the rest of the experience.
  | Closing the drawer only HIDES it. It does not unmount it.
  |
  */

  const [
    activated,
    setActivated,
  ] =
    React.useState(
      visible
    );


  const [
    open,
    setOpen,
  ] =
    React.useState(
      false
    );


  const [
    ready,
    setReady,
  ] =
    React.useState(
      false
    );


  const [
    paused,
    setPaused,
  ] =
    React.useState(
      true
    );


  const [
    started,
    setStarted,
  ] =
    React.useState(
      false
    );


  const [
    error,
    setError,
  ] =
    React.useState(
      ''
    );


  /*
  |--------------------------------------------------------------------------
  | REFS
  |--------------------------------------------------------------------------
  */

  const embedRef =
    React.useRef(
      null
    );


  const controllerRef =
    React.useRef(
      null
    );


  const pausedRef =
    React.useRef(
      true
    );


  const resumeAfterVoiceRef =
    React.useRef(
      false
    );


  const voiceDepthRef =
    React.useRef(
      0
    );


  const spotifyUrl =
    getSpotifyUrl(
      soundtrack.spotify
    );


  const playerVisible =
    Boolean(
      visible &&
      open
    );


  /*
  |--------------------------------------------------------------------------
  | ACTIVATE ONCE
  |--------------------------------------------------------------------------
  */

  React.useEffect(
    () => {
      if (
        visible &&
        !activated
      ) {
        setActivated(
          true
        );
      }


      if (
        !visible &&
        open
      ) {
        setOpen(
          false
        );
      }
    },
    [
      visible,
      activated,
      open,
    ]
  );


  /*
  |--------------------------------------------------------------------------
  | KEEP PAUSED STATE FRESH
  |--------------------------------------------------------------------------
  */

  React.useEffect(
    () => {
      pausedRef.current =
        paused;
    },
    [
      paused,
    ]
  );


  /*
  |--------------------------------------------------------------------------
  | CREATE SPOTIFY CONTROLLER
  |--------------------------------------------------------------------------
  */

  React.useEffect(
    () => {
      if (
        !activated ||
        !spotifyUrl ||
        !embedRef.current ||
        controllerRef.current
      ) {
        return;
      }


      let cancelled =
        false;


      setError(
        ''
      );


      loadSpotifyApi()
        .then(
          api => {
            if (
              cancelled ||
              !embedRef.current ||
              controllerRef.current
            ) {
              return;
            }


            api.createController(
              embedRef.current,

              {
                url:
                  spotifyUrl,

                width:
                  '100%',

                height:
                  352,
              },

              controller => {
                if (
                  cancelled
                ) {
                  controller
                    ?.destroy?.();

                  return;
                }


                controllerRef.current =
                  controller;


                setReady(
                  true
                );


                controller
                  .addListener?.(
                    'ready',

                    () => {
                      setReady(
                        true
                      );

                      setError(
                        ''
                      );
                    }
                  );


                controller
                  .addListener?.(
                    'playback_update',

                    event => {
                      const data =
                        event?.data;


                      if (
                        typeof data
                          ?.isPaused ===
                        'boolean'
                      ) {
                        pausedRef.current =
                          data.isPaused;

                        setPaused(
                          data.isPaused
                        );


                        if (
                          !data.isPaused
                        ) {
                          setStarted(
                            true
                          );
                        }
                      }
                    }
                  );


                controller
                  .addListener?.(
                    'playback_started',

                    () => {
                      pausedRef.current =
                        false;

                      setPaused(
                        false
                      );

                      setStarted(
                        true
                      );
                    }
                  );
              }
            );
          }
        )
        .catch(
          () => {
            if (
              cancelled
            ) {
              return;
            }

            setReady(
              false
            );

            setError(
              'playlist could not load 😭'
            );
          }
        );


      return () => {
        cancelled =
          true;
      };
    },
    [
      activated,
      spotifyUrl,
    ]
  );


  /*
  |--------------------------------------------------------------------------
  | DESTROY ONLY WHEN THIS COMPONENT REALLY UNMOUNTS
  |--------------------------------------------------------------------------
  */

  React.useEffect(
    () => {
      return () => {
        try {
          controllerRef
            .current
            ?.destroy?.();
        } catch {
          // Safe cleanup.
        }

        controllerRef.current =
          null;
      };
    },
    []
  );


  /*
  |--------------------------------------------------------------------------
  | VOICE NOTE DUCKING
  |--------------------------------------------------------------------------
  */

  React.useEffect(
    () => {
      const voiceStart =
        () => {
          voiceDepthRef.current +=
            1;


          if (
            voiceDepthRef.current >
            1
          ) {
            return;
          }


          const controller =
            controllerRef.current;


          if (
            !controller
          ) {
            return;
          }


          resumeAfterVoiceRef.current =
            !pausedRef.current;


          if (
            resumeAfterVoiceRef.current
          ) {
            try {
              controller.pause?.();
            } catch {
              // Keep the rest of the site alive.
            }
          }
        };


      const voiceEnd =
        () => {
          voiceDepthRef.current =
            Math.max(
              0,
              voiceDepthRef.current -
                1
            );


          if (
            voiceDepthRef.current >
            0
          ) {
            return;
          }


          const controller =
            controllerRef.current;


          if (
            !controller
          ) {
            resumeAfterVoiceRef.current =
              false;

            return;
          }


          if (
            resumeAfterVoiceRef.current
          ) {
            try {
              if (
                typeof controller.resume ===
                'function'
              ) {
                controller.resume();
              } else {
                controller.play?.();
              }
            } catch {
              // Some browsers may refuse programmatic resume.
            }
          }


          resumeAfterVoiceRef.current =
            false;
        };


      window.addEventListener(
        'fendisha:voice-start',
        voiceStart
      );


      window.addEventListener(
        'fendisha:voice-end',
        voiceEnd
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
      };
    },
    []
  );


  /*
  |--------------------------------------------------------------------------
  | OPEN / CLOSE
  |--------------------------------------------------------------------------
  */

  const openPlayer =
    () => {
      setOpen(
        true
      );

      navigator.vibrate?.(
        6
      );
    };


  const closePlayer =
    () => {
      setOpen(
        false
      );
    };


  /*
  |--------------------------------------------------------------------------
  | PLAY / PAUSE
  |--------------------------------------------------------------------------
  */

  const togglePlay =
    () => {
      const controller =
        controllerRef.current;


      if (
        !controller ||
        !ready
      ) {
        setOpen(
          true
        );

        return;
      }


      setStarted(
        true
      );


      try {
        controller.togglePlay?.();
      } catch {
        setOpen(
          true
        );
      }


      navigator.vibrate?.(
        8
      );
    };


  /*
  |--------------------------------------------------------------------------
  | ESC CLOSES DRAWER
  |--------------------------------------------------------------------------
  */

  React.useEffect(
    () => {
      if (
        !open
      ) {
        return;
      }


      const onKeyDown =
        event => {
          if (
            event.key ===
            'Escape'
          ) {
            closePlayer();
          }
        };


      window.addEventListener(
        'keydown',
        onKeyDown
      );


      return () => {
        window.removeEventListener(
          'keydown',
          onKeyDown
        );
      };
    },
    [
      open,
    ]
  );


  /*
  |--------------------------------------------------------------------------
  | BEFORE FIRST ACTIVATION
  |--------------------------------------------------------------------------
  */

  if (
    !activated
  ) {
    return null;
  }


  return html`
    <div>

      <!-- ============================================================ -->
      <!-- MINI MUSIC DOCK -->
      <!-- ============================================================ -->

      ${
        visible
          ? html`
              <div
                className="
                  fixed

                  bottom-[max(.85rem,env(safe-area-inset-bottom))]
                  right-3

                  z-[8500]

                  sm:bottom-5
                  sm:right-5
                "
              >

                <div
                  className="
                    flex
                    items-center

                    overflow-hidden

                    rounded-full

                    border
                    border-white/90

                    bg-white/86

                    shadow-[0_14px_44px_rgba(74,39,95,.16)]

                    backdrop-blur-2xl
                  "
                >

                  <button
                    type="button"

                    onClick=${openPlayer}

                    className="
                      flex

                      min-h-11

                      items-center

                      gap-2.5

                      px-3.5

                      text-left

                      transition

                      hover:bg-purple-50/70

                      sm:px-4
                    "

                    aria-label="Open our soundtrack"
                  >

                    <span
                      className="
                        relative

                        grid

                        h-7
                        w-7

                        shrink-0

                        place-items-center

                        rounded-full

                        bg-gradient-to-br

                        from-purple-600

                        to-pink-500

                        text-xs

                        text-white

                        shadow-[0_6px_18px_rgba(105,54,135,.18)]
                      "
                    >
                      ♫


                      ${
                        !paused
                          ? html`
                              <span
                                className="
                                  absolute

                                  -right-1
                                  -top-1

                                  h-2
                                  w-2

                                  rounded-full

                                  bg-pink-400

                                  ring-2
                                  ring-white
                                "
                              ></span>
                            `
                          : null
                      }

                    </span>


                    <div
                      className="
                        hidden
                        sm:block
                      "
                    >

                      <p
                        className="
                          text-[8px]

                          font-black

                          uppercase

                          tracking-[.16em]

                          text-purple-400
                        "
                      >
                        OUR SOUNDTRACK
                      </p>


                      <p
                        className="
                          max-w-[210px]

                          truncate

                          font-display

                          text-sm

                          italic

                          text-plum
                        "
                      >
                        ${
                          error
                            ? 'Spotify is being dramatic 😭'

                            : !ready
                              ? 'loading our songs...'

                              : started
                                ? paused
                                  ? 'paused for dramatic reasons'
                                  : 'playing somewhere under all this 💜'

                                : 'tap me'
                        }
                      </p>

                    </div>

                  </button>


                  <div
                    className="
                      h-6
                      w-px

                      bg-purple-100
                    "
                  ></div>


                  <button
                    type="button"

                    onClick=${togglePlay}

                    className="
                      grid

                      h-11
                      w-11

                      shrink-0

                      place-items-center

                      text-sm

                      font-black

                      text-purple-700

                      transition

                      hover:bg-purple-50
                    "

                    aria-label=${
                      !ready
                        ? 'Open soundtrack'

                        : paused
                          ? 'Play soundtrack'
                          : 'Pause soundtrack'
                    }
                  >
                    ${
                      !ready
                        ? '♫'

                        : paused
                          ? '▶'
                          : '❚❚'
                    }
                  </button>

                </div>

              </div>
            `
          : null
      }


      <!-- ============================================================ -->
      <!-- PERSISTENT PLAYLIST DRAWER -->
      <!-- ============================================================ -->
      <!--
        IMPORTANT:

        This is ALWAYS mounted after activation.

        The hidden state is controlled with INLINE styles,
        not Tailwind visibility classes.

        That means:
          - Spotify survives scene changes.
          - Spotify survives drawer close.
          - Closed drawer has ZERO visible leakage.
      -->

      <div
        aria-hidden=${
          playerVisible
            ? 'false'
            : 'true'
        }

        className="
          fixed

          inset-0

          z-[11500]

          flex

          items-end

          justify-center

          px-3

          sm:items-center
          sm:p-6
        "

        style=${{
          visibility:
            playerVisible
              ? 'visible'
              : 'hidden',

          opacity:
            playerVisible
              ? 1
              : 0,

          pointerEvents:
            playerVisible
              ? 'auto'
              : 'none',

          background:
            playerVisible
              ? 'rgba(59, 18, 86, 0.08)'
              : 'transparent',

          backdropFilter:
            playerVisible
              ? 'blur(3px)'
              : 'none',

          WebkitBackdropFilter:
            playerVisible
              ? 'blur(3px)'
              : 'none',

          transition:
            'opacity 220ms ease, visibility 220ms ease, background 220ms ease',
        }}

        onClick=${closePlayer}
      >

        <div
          className="
            relative

            max-h-[88svh]

            w-full

            max-w-xl

            overflow-y-auto

            rounded-t-[2.3rem]

            border

            border-white/90

            bg-[#fffafd]/96

            px-4

            pb-[max(1rem,env(safe-area-inset-bottom))]

            pt-5

            shadow-[0_30px_110px_rgba(74,39,95,.22)]

            backdrop-blur-2xl

            sm:rounded-[2.3rem]
            sm:p-6
          "

          style=${{
            transform:
              playerVisible
                ? 'translateY(0) scale(1)'
                : 'translateY(24px) scale(.985)',

            opacity:
              playerVisible
                ? 1
                : 0,

            transition:
              'transform 260ms cubic-bezier(.18,.88,.22,1), opacity 220ms ease',
          }}

          onClick=${event =>
            event.stopPropagation()
          }
        >

          <!-- ================================= -->
          <!-- CLOSE -->
          <!-- ================================= -->

          <button
            type="button"

            onClick=${closePlayer}

            className="
              absolute

              right-4
              top-4

              z-20

              grid

              h-8
              w-8

              place-items-center

              rounded-full

              bg-purple-50

              text-xs

              font-black

              text-purple-600

              transition

              hover:scale-105

              hover:bg-purple-100
            "

            aria-label="Close soundtrack"
          >
            ×
          </button>


          <!-- ================================= -->
          <!-- HEADER -->
          <!-- ================================= -->

          <p
            className="
              pr-12

              text-[9px]

              font-black

              uppercase

              tracking-[.24em]

              text-purple-500
            "
          >
            DARION × FENDISHA
          </p>


          <h2
            className="
              mt-2

              font-display

              text-[clamp(2.6rem,8vw,4.4rem)]

              font-semibold

              italic

              leading-[.88]

              tracking-[-.045em]

              text-plum
            "
          >
            ${soundtrack.title || 'our soundtrack'}.
          </h2>


          <p
            className="
              mt-3

              max-w-md

              text-sm

              leading-6

              text-purple-900/62
            "
          >
            ${soundtrack.subtitle}
          </p>


          <!-- ================================= -->
          <!-- NO PLAYLIST CONFIGURED -->
          <!-- ================================= -->

          ${
            !spotifyUrl
              ? html`
                  <div
                    className="
                      mt-6

                      rounded-[1.5rem]

                      border

                      border-dashed

                      border-purple-200

                      bg-purple-50/60

                      p-5
                    "
                  >

                    <p
                      className="
                        font-display

                        text-xl

                        italic

                        text-purple-700
                      "
                    >
                      playlist link goes here 🎧
                    </p>


                    <p
                      className="
                        mt-2

                        text-xs

                        leading-5

                        text-purple-900/55
                      "
                    >
                      add the Spotify playlist URL in src/soundtrack.js
                    </p>

                  </div>
                `
              : null
          }


          <!-- ================================= -->
          <!-- PERSISTENT SPOTIFY MOUNT -->
          <!-- ================================= -->

          ${
            spotifyUrl
              ? html`
                  <div
                    className="
                      mt-6

                      overflow-hidden

                      rounded-[1.5rem]

                      bg-purple-50/45
                    "
                  >

                    <div
                      ref=${embedRef}

                      className="
                        min-h-[352px]

                        w-full
                      "
                    ></div>

                  </div>
                `
              : null
          }


          <!-- ================================= -->
          <!-- LOADING -->
          <!-- ================================= -->

          ${
            spotifyUrl &&
            !ready &&
            !error
              ? html`
                  <div
                    className="
                      mt-3

                      flex

                      items-center

                      gap-2

                      text-xs

                      font-bold

                      text-purple-500/70
                    "
                  >

                    <span
                      className="
                        inline-block

                        h-2
                        w-2

                        animate-pulse

                        rounded-full

                        bg-purple-400
                      "
                    ></span>

                    loading our songs...

                  </div>
                `
              : null
          }


          <!-- ================================= -->
          <!-- ERROR -->
          <!-- ================================= -->

          ${
            error
              ? html`
                  <div
                    className="
                      mt-4

                      rounded-[1.25rem]

                      bg-pink-50

                      px-4

                      py-3
                    "
                  >

                    <p
                      className="
                        text-xs

                        font-bold

                        text-pink-600
                      "
                    >
                      ${error}
                    </p>


                    <p
                      className="
                        mt-1

                        text-[10px]

                        leading-4

                        text-pink-700/55
                      "
                    >
                      the rest of the birthday site still works normally.
                    </p>

                  </div>
                `
              : null
          }


          <!-- ================================= -->
          <!-- OUR LINER NOTES -->
          <!-- ================================= -->

          <div
            className="
              mt-7

              border-t

              border-purple-100

              pt-6
            "
          >

            <p
              className="
                text-[8px]

                font-black

                uppercase

                tracking-[.22em]

                text-purple-400
              "
            >
              liner notes from somebody who overthinks songs
            </p>


            <div
              className="
                mt-4

                space-y-3
              "
            >

              ${
                soundtrack.notes.map(
                  (
                    item,
                    index
                  ) => html`

                    <div
                      key=${item.title}

                      className="
                        flex

                        gap-3

                        rounded-[1.25rem]

                        bg-white/70

                        px-4
                        py-3
                      "
                    >

                      <span
                        className="
                          pt-1

                          font-display

                          text-xs

                          italic

                          text-purple-400
                        "
                      >
                        ${String(
                          index + 1
                        ).padStart(
                          2,
                          '0'
                        )}
                      </span>


                      <div
                        className="
                          min-w-0

                          flex-1
                        "
                      >

                        <p
                          className="
                            font-display

                            text-lg

                            font-semibold

                            italic

                            leading-tight

                            text-plum
                          "
                        >
                          ${item.title}
                        </p>


                        ${
                          item.artist
                            ? html`
                                <p
                                  className="
                                    mt-0.5

                                    text-[9px]

                                    font-black

                                    uppercase

                                    tracking-[.12em]

                                    text-purple-400
                                  "
                                >
                                  ${item.artist}
                                </p>
                              `
                            : null
                        }


                        <p
                          className="
                            mt-1

                            text-xs

                            leading-5

                            text-purple-900/57
                          "
                        >
                          ${item.note}
                        </p>

                      </div>

                    </div>

                  `
                )
              }

            </div>

          </div>


          <!-- ================================= -->
          <!-- BOTTOM MICRO COPY -->
          <!-- ================================= -->

          <p
            className="
              mt-6

              text-center

              font-display

              text-sm

              italic

              text-purple-400/75
            "
          >
            keep it playing... there is still a lot left 💜
          </p>

        </div>

      </div>

    </div>
  `;
}