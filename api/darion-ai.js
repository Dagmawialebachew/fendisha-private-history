import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const TABLE = 'birthday_fendisha_darion_ai_v1';
const SESSION_RE = /^[a-zA-Z0-9_-]{8,120}$/;
const MAX_QUESTION = 700;
const MAX_ANSWER = 1800;

let schemaReadyPromise = null;

function getSql() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured.');
  }

  return neon(connectionString);
}

function ensureSchema(sql) {
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS birthday_fendisha_darion_ai_v1 (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL,
          scene_id TEXT NOT NULL DEFAULT 'entry-gate',
          question TEXT NOT NULL,
          answer TEXT,
          status TEXT NOT NULL DEFAULT 'waiting'
            CHECK (status IN ('waiting', 'answered')),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          answered_at TIMESTAMPTZ
        )
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS birthday_fendisha_darion_ai_v1_session_created_idx
        ON birthday_fendisha_darion_ai_v1 (session_id, created_at)
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS birthday_fendisha_darion_ai_v1_status_created_idx
        ON birthday_fendisha_darion_ai_v1 (status, created_at DESC)
      `;
    })().catch((error) => {
      schemaReadyPromise = null;
      throw error;
    });
  }

  return schemaReadyPromise;
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  if (typeof req.json === 'function') {
    try {
      return await req.json();
    } catch {
      // Fall through to Node request stream parsing.
    }
  }

  let raw = '';

  try {
    for await (const chunk of req) {
      raw += chunk;

      if (raw.length > 12_000) {
        throw new Error('Request body too large.');
      }
    }
  } catch {
    return {};
  }

  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

function normalizeText(value, maxLength) {
  if (typeof value !== 'string') return '';

  return value
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength);
}

function normalizeScene(value) {
  const scene = normalizeText(value, 100);
  return scene || 'entry-gate';
}

function validSession(value) {
  return typeof value === 'string' && SESSION_RE.test(value);
}

function isAdmin(req) {
  const configured = process.env.DARION_AI_ADMIN_KEY || '';
  const supplied = String(req.headers?.['x-darion-key'] || '');

  if (!configured || !supplied) return false;

  const a = Buffer.from(configured);
  const b = Buffer.from(supplied);

  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function publicBaseUrl(req) {
  const forwardedProto = String(req.headers?.['x-forwarded-proto'] || 'https')
    .split(',')[0]
    .trim();

  const forwardedHost = String(
    req.headers?.['x-forwarded-host'] || req.headers?.host || ''
  )
    .split(',')[0]
    .trim();

  if (!forwardedHost) return '';
  return `${forwardedProto}://${forwardedHost}`;
}

async function notifyDarion(req, { question, scene }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const base = publicBaseUrl(req);
  const controlUrl = base ? `${base}/darion-control.html` : '';

  const message = [
    '🤖 DARION AI — NEW QUESTION',
    '',
    `“${question}”`,
    '',
    `page: ${scene}`,
    controlUrl ? `answer: ${controlUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true,
      }),
    });
  } catch {
    // Telegram is optional. Chat must continue even if notification fails.
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      ok: false,
      error: 'Method not allowed.',
    });
  }

  try {
    const body = await readBody(req);
    const action = normalizeText(body.action, 40);
    const sql = getSql();

    await ensureSchema(sql);

    if (action === 'ask') {
      const sessionId = normalizeText(body.sessionId, 120);
      const question = normalizeText(body.question, MAX_QUESTION);
      const scene = normalizeScene(body.sceneId);

      if (!validSession(sessionId)) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Invalid session.',
        });
      }

      if (!question) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Question is empty.',
        });
      }

      const recent = await sql`
        SELECT COUNT(*)::int AS count
        FROM birthday_fendisha_darion_ai_v1
        WHERE session_id = ${sessionId}
          AND created_at > NOW() - INTERVAL '3 seconds'
      `;

      if ((recent[0]?.count || 0) >= 2) {
        return sendJson(res, 429, {
          ok: false,
          error: 'too-fast',
        });
      }

      const id = crypto.randomUUID();

      await sql`
        INSERT INTO birthday_fendisha_darion_ai_v1
          (id, session_id, scene_id, question)
        VALUES
          (${id}, ${sessionId}, ${scene}, ${question})
      `;

      notifyDarion(req, {
        question,
        scene,
      }).catch(() => {});

      return sendJson(res, 200, {
        ok: true,
        id,
        status: 'waiting',
      });
    }

    if (action === 'poll') {
      const sessionId = normalizeText(body.sessionId, 120);

      if (!validSession(sessionId)) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Invalid session.',
        });
      }

      const rows = await sql`
        SELECT
          id,
          scene_id,
          question,
          answer,
          status,
          created_at,
          answered_at
        FROM birthday_fendisha_darion_ai_v1
        WHERE session_id = ${sessionId}
        ORDER BY created_at ASC
        LIMIT 60
      `;

      return sendJson(res, 200, {
        ok: true,
        messages: rows,
      });
    }

    if (action === 'admin-list') {
      if (!isAdmin(req)) {
        return sendJson(res, 401, {
          ok: false,
          error: 'Unauthorized.',
        });
      }

      const rows = await sql`
        SELECT
          id,
          session_id,
          scene_id,
          question,
          answer,
          status,
          created_at,
          answered_at
        FROM birthday_fendisha_darion_ai_v1
        ORDER BY
          CASE WHEN status = 'waiting' THEN 0 ELSE 1 END,
          created_at DESC
        LIMIT 80
      `;

      return sendJson(res, 200, {
        ok: true,
        messages: rows,
      });
    }

    if (action === 'admin-reply') {
      if (!isAdmin(req)) {
        return sendJson(res, 401, {
          ok: false,
          error: 'Unauthorized.',
        });
      }

      const id = normalizeText(body.id, 100);
      const answer = normalizeText(body.answer, MAX_ANSWER);

      if (!id || !answer) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Missing answer.',
        });
      }

      const rows = await sql`
        UPDATE birthday_fendisha_darion_ai_v1
        SET
          answer = ${answer},
          status = 'answered',
          answered_at = NOW()
        WHERE id = ${id}
        RETURNING id, session_id, scene_id, question, answer, status, answered_at
      `;

      if (!rows.length) {
        return sendJson(res, 404, {
          ok: false,
          error: 'Question not found.',
        });
      }

      return sendJson(res, 200, {
        ok: true,
        message: rows[0],
      });
    }

    return sendJson(res, 400, {
      ok: false,
      error: 'Unknown action.',
    });
  } catch (error) {
    console.error('[Darion AI]', error);

    return sendJson(res, 500, {
      ok: false,
      error: 'Darion AI is being dramatic.',
    });
  }
}
