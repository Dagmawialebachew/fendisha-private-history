import {
  React,
} from '../lib/react.js';

import {
  VISUAL_ASSETS,
  AUDIO_ASSETS,
} from '../assetManifest.js';


/*
|-----------------------------------------------------------------------------
| SHARED PRELOAD STATE
|-----------------------------------------------------------------------------
|
| PreBirthdayGate can re-render hundreds of times because of the clock and
| release polling. The actual downloads must only start once.
|
*/

const listeners =
  new Set();


const state = {
  visualStarted: false,
  visualDone: 0,
  visualTotal:
    VISUAL_ASSETS.length + 1, // + fonts
  visualReady: false,
  visualFailures: [],

  audioStarted: false,
  audioDone: 0,
  audioTotal:
    AUDIO_ASSETS.length,
  audioReady: false,
};


let visualPromise =
  null;

let audioPromise =
  null;


function emit() {
  listeners.forEach(
    listener => {
      try {
        listener();
      } catch {
        // A preload observer should never break the experience.
      }
    }
  );
}


function snapshot() {
  const visualPercent =
    state.visualTotal > 0
      ? Math.round(
          (
            state.visualDone /
            state.visualTotal
          ) * 100
        )
      : 100;

  const overallDone =
    state.visualDone +
    state.audioDone;

  const overallTotal =
    state.visualTotal +
    state.audioTotal;

  return {
    ...state,
    visualPercent:
      Math.min(
        100,
        visualPercent
      ),
    overallPercent:
      overallTotal > 0
        ? Math.min(
            100,
            Math.round(
              (
                overallDone /
                overallTotal
              ) * 100
            )
          )
        : 100,
  };
}


function settleVisual(
  url,
  ok
) {
  state.visualDone =
    Math.min(
      state.visualTotal,
      state.visualDone + 1
    );

  if (!ok && url) {
    state.visualFailures = [
      ...state.visualFailures,
      url,
    ];
  }

  emit();
}


function preloadImage(
  url,
  timeoutMs = 18000
) {
  return new Promise(
    resolve => {
      const image =
        new Image();

      let settled =
        false;

      const finish =
        ok => {
          if (settled) {
            return;
          }

          settled = true;

          window.clearTimeout(
            timer
          );

          image.onload =
            null;

          image.onerror =
            null;

          settleVisual(
            url,
            ok
          );

          resolve(ok);
        };

      const timer =
        window.setTimeout(
          () => finish(false),
          timeoutMs
        );

      image.onload =
        () => finish(true);

      image.onerror =
        () => finish(false);

      /*
      | Exact same URL used later by <img>.
      | That lets the browser reuse the HTTP cache instead of downloading the
      | photograph again when its scene finally mounts.
      */
      image.src =
        url;

      /*
      | decode() is a bonus when supported. load still remains the source of
      | truth because decode can reject for valid SVGs or memory pressure.
      */
      image.decode?.()
        .catch(
          () => {}
        );
    }
  );
}


async function preloadFonts() {
  if (
    !document.fonts ||
    !document.fonts.ready
  ) {
    settleVisual(
      'fonts',
      true
    );

    return;
  }

  let timer;

  try {
    await Promise.race([
      document.fonts.ready,
      new Promise(
        resolve => {
          timer =
            window.setTimeout(
              resolve,
              8000
            );
        }
      ),
    ]);

    settleVisual(
      'fonts',
      true
    );
  } catch {
    settleVisual(
      'fonts',
      false
    );
  } finally {
    if (timer) {
      window.clearTimeout(
        timer
      );
    }
  }
}


async function runPool(
  items,
  worker,
  concurrency
) {
  let cursor =
    0;

  const runners =
    Array.from(
      {
        length:
          Math.max(
            1,
            Math.min(
              concurrency,
              items.length || 1
            )
          ),
      },
      async () => {
        while (
          cursor <
          items.length
        ) {
          const index =
            cursor;

          cursor += 1;

          await worker(
            items[index]
          );
        }
      }
    );

  await Promise.all(
    runners
  );
}


export function startVisualPreload() {
  if (visualPromise) {
    return visualPromise;
  }

  state.visualStarted =
    true;

  emit();

  visualPromise =
    Promise.all([
      preloadFonts(),
      runPool(
        VISUAL_ASSETS,
        preloadImage,
        5
      ),
    ])
      .catch(
        () => {
          // Every individual asset already settles itself. This guard is only
          // here so one unexpected browser error can never brick the door.
        }
      )
      .then(
        () => {
          state.visualReady =
            true;

          state.visualDone =
            state.visualTotal;

          emit();

          /*
          | Audio is intentionally second priority. Photographs win bandwidth.
          */
          startAudioPreload();

          return snapshot();
        }
      );

  return visualPromise;
}


function warmAudio(
  url,
  timeoutMs = 20000
) {
  return new Promise(
    resolve => {
      const controller =
        new AbortController();

      const timer =
        window.setTimeout(
          () => {
            controller.abort();
          },
          timeoutMs
        );

      fetch(
        url,
        {
          method:
            'GET',
          cache:
            'force-cache',
          signal:
            controller.signal,
        }
      )
        .catch(
          () => null
        )
        .finally(
          () => {
            window.clearTimeout(
              timer
            );

            state.audioDone =
              Math.min(
                state.audioTotal,
                state.audioDone + 1
              );

            emit();

            resolve();
          }
        );
    }
  );
}


export function startAudioPreload() {
  if (audioPromise) {
    return audioPromise;
  }

  state.audioStarted =
    true;

  emit();

  audioPromise =
    runPool(
      AUDIO_ASSETS,
      warmAudio,
      2
    )
      .catch(
        () => {}
      )
      .then(
        () => {
          state.audioReady =
            true;

          state.audioDone =
            state.audioTotal;

          emit();

          return snapshot();
        }
      );

  return audioPromise;
}


export function waitForVisuals() {
  return startVisualPreload();
}


export function getPreloadSnapshot() {
  return snapshot();
}


export function useAssetPreloader() {
  const [view, setView] =
    React.useState(
      () => snapshot()
    );

  React.useEffect(
    () => {
      const update =
        () => {
          setView(
            snapshot()
          );
        };

      listeners.add(
        update
      );

      startVisualPreload();

      update();

      return () => {
        listeners.delete(
          update
        );
      };
    },
    []
  );

  return {
    ...view,
    waitForVisuals,
  };
}
