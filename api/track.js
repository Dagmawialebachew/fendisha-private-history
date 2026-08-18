/*
|--------------------------------------------------------------------------
| /api/track — SERVER-SIDE TELEGRAM LIVE FEED
|--------------------------------------------------------------------------
|
| Vercel Environment Variables required:
|   TELEGRAM_BOT_TOKEN
|   TELEGRAM_CHAT_ID
|
| Optional:
|   TRACKING_ALLOWED_HOST = your-domain.vercel.app
|
| Bot token NEVER reaches the browser.
|
*/

const ALLOWED_EVENTS = new Set([
  'experience_opened',
  'entry_unlocked',
  'scene_entered',
  'mood_selected',
  'old_soul_changed',
  'heart_found',
  'all_hearts_found',
  'secret_19_opened',
  'voice_started',
  'voice_finished',
  'soundtrack_started',
  'cake_blown',
  'experience_completed',
  'session_paused',
]);

const SCENE_LABELS = {
  'entry-gate': 'Entry Gate',
  'birthday-room': 'Birthday Room 🪻',
  'mood-choice': 'Mood Choice',
  'you-at-21': 'Birthday Hero 🎂',
  'things-i-notice': 'Things I Notice',
  'our-moments': 'Our Moments 💜',
  calls: 'Calls 📞',
  places: 'Places 📍',
  'feb-13': 'Feb 13 🤫',
  distance: 'Distance',
  faith: 'Faith ✝️',
  'past-lives': 'Past Lives',
  future: 'Future',
  'her-gift': 'Her Gift',
  finale: 'Finale 🎂',
  afterword: 'Afterword',
  artifact: 'Artifact ✉️',
};

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function labelScene(value) {
  return SCENE_LABELS[value] || value || 'unknown';
}

function formatDuration(seconds) {
  const n = Math.max(0, Number(seconds) || 0);
  if (n < 60) return `${n}s`;
  const m = Math.floor(n / 60);
  const s = n % 60;
  return `${m}m ${s}s`;
}

function addisTime(iso) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Addis_Ababa',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return '--:--';
  }
}

function shortSession(value) {
  const raw = String(value || '');
  return raw ? raw.slice(0, 8) : 'unknown';
}

function messageFor(payload) {
  const event = payload.event;
  const d = payload.data || {};
  const scene = labelScene(d.scene);
  const time = addisTime(payload.at);
  const device = payload.device || 'device';

  let headline = '🍿 <b>FENDISHA LIVE</b>';
  let body = '';

  switch (event) {
    case 'experience_opened':
      body = `🚪 She opened the birthday experience.`;
      break;

    case 'entry_unlocked':
      body = `🔓 <b>Entry unlocked.</b> She is actually in.`;
      break;

    case 'scene_entered': {
      const previous = d.previousScene
        ? `\n↩️ Previous: ${escapeHtml(labelScene(d.previousScene))} · ${escapeHtml(formatDuration(d.previousSeconds))}`
        : '';
      body = `📍 <b>${escapeHtml(scene)}</b>${previous}`;
      break;
    }

    case 'mood_selected':
      body = `🥹 Mood choice: <b>${escapeHtml(d.mood)}</b>`;
      break;

    case 'old_soul_changed':
      body = d.enabled
        ? `✉️ She turned <b>Old Soul mode ON</b> at ${escapeHtml(scene)}.`
        : `😂 Old Soul mode OFF.`;
      break;

    case 'heart_found':
      body = `💜 <b>Heart #${escapeHtml(d.id)}</b> found · ${escapeHtml(d.totalFound)}/21\n📍 ${escapeHtml(scene)}`;
      break;

    case 'all_hearts_found':
      headline = '💜 <b>ALL 21 HEARTS FOUND</b>';
      body = `She actually found every single one 😭`;
      break;

    case 'secret_19_opened':
      headline = '😭 <b>SHE OPENED #19</b>';
      body = `“is he single?” proof reveal opened.`;
      break;

    case 'voice_started':
      body = `🎙️ Voice note started\n📍 ${escapeHtml(scene)}`;
      break;

    case 'voice_finished':
      // Don't spam Telegram for every normal voice finish.
      return null;

    case 'soundtrack_started':
      body = `🎵 She started <b>Our Soundtrack</b>\n📍 ${escapeHtml(scene)}`;
      break;

    case 'cake_blown':
      headline = '🎂 <b>CAKE BLOWN</b>';
      body = `She finished the cake interaction 😭💜`;
      break;

    case 'experience_completed':
      headline = '🏁 <b>SHE REACHED THE ARTIFACT</b>';
      body = `Full journey: ${escapeHtml(formatDuration(d.totalSeconds))}`;
      break;

    case 'session_paused':
      // Useful if she closes/reloads, but not worth live-message spam.
      return null;

    default:
      return null;
  }

  return `${headline}\n\n${body}\n\n<code>${escapeHtml(time)} · ${escapeHtml(device)} · ${escapeHtml(shortSession(payload.sessionId))}</code>`;
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // Never expose which secret is missing to the browser.
    return res.status(204).end();
  }

  const allowedHost = process.env.TRACKING_ALLOWED_HOST;
  if (allowedHost) {
    try {
      const origin = req.headers.origin;
      if (origin) {
        const hostname = new URL(origin).hostname;
        if (hostname !== allowedHost) {
          return res.status(204).end();
        }
      }
    } catch {
      return res.status(204).end();
    }
  }

  const payload = readBody(req);

  if (
    !payload ||
    !ALLOWED_EVENTS.has(payload.event) ||
    typeof payload.sessionId !== 'string' ||
    payload.sessionId.length > 100
  ) {
    return res.status(204).end();
  }

  const text = messageFor(payload);

  // Valid event, but intentionally not Telegram-worthy.
  if (!text) {
    return res.status(204).end();
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    );

    // Never let Telegram failure break the client experience.
    if (!response.ok) {
      console.error('Telegram tracking send failed:', response.status);
    }
  } catch (error) {
    console.error('Telegram tracking send failed.');
  }

  return res.status(204).end();
}
