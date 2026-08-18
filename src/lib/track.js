/*
|--------------------------------------------------------------------------
| FENDISHA — LIVE EXPERIENCE TRACKER (CLIENT)
|--------------------------------------------------------------------------
|
| Privacy boundary:
| - only tracks interactions INSIDE this birthday site
| - no passwords / typed text / camera / mic / GPS / browser history
| - failures are silent and NEVER break the birthday experience
|
*/

const ENDPOINT = '/api/track';
const SESSION_KEY = 'fendisha-live-session-v1';

function makeId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `f_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function getTrackingSessionId() {
  try {
    let value = sessionStorage.getItem(SESSION_KEY);
    if (!value) {
      value = makeId();
      sessionStorage.setItem(SESSION_KEY, value);
    }
    return value;
  } catch {
    return makeId();
  }
}

function safeData(value) {
  if (!value || typeof value !== 'object') return {};
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    if (item === undefined || typeof item === 'function') continue;
    if (typeof item === 'string') result[key] = item.slice(0, 180);
    else if (typeof item === 'number' && Number.isFinite(item)) result[key] = item;
    else if (typeof item === 'boolean' || item === null) result[key] = item;
  }
  return result;
}

export function track(event, data = {}) {
  try {
    if (!event || typeof event !== 'string') return;

    const payload = {
      event: event.slice(0, 80),
      data: safeData(data),
      sessionId: getTrackingSessionId(),
      at: new Date().toISOString(),
      page: location.pathname,
      device:
        window.innerWidth < 700
          ? 'phone'
          : window.innerWidth < 1100
            ? 'tablet'
            : 'desktop',
    };

    const body = JSON.stringify(payload);

    // sendBeacon is ideal during pagehide/unload.
    if (
      event === 'session_paused' &&
      navigator.sendBeacon
    ) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(ENDPOINT, blob);
      return;
    }

    fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      keepalive: true,
      credentials: 'same-origin',
    }).catch(() => {
      // Tracking must NEVER affect the experience.
    });
  } catch {
    // absolutely silent by design
  }
}

// Optional tiny hook for one-off premium events such as cake_blown.
try {
  window.fendishaTrack = track;
} catch {}
