// CampSpace backend: Express API + MySQL.
//   npm run server      -> starts on http://127.0.0.1:5000
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDb, db, sandboxConfigured, getSandboxPool } from './db.js';
import { detectLanguages, LANGUAGES } from './languages.js';
import { runCode } from './runner.js';
import { runSql } from './sql-runner.js';

const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || '127.0.0.1';
const LIMITS = {
  timeoutMs: Number(process.env.RUN_TIMEOUT_MS || 10000),
  maxBytes: Number(process.env.MAX_OUTPUT_BYTES || 65536),
  maxCode: Number(process.env.MAX_CODE_BYTES || 100000),
  maxConcurrent: Number(process.env.MAX_CONCURRENT_RUNS || 3),
};

const app = express();
app.use(cors({ origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()) }));
app.use(express.json({ limit: '300kb' }));

// Who is calling? The frontend sends the email from the CampSpace session.
// NOTE: this is NOT real authentication (see README_BACKEND.md "Next steps").
function owner(req) {
  const raw = String(req.get('x-campspace-user') || 'guest').trim().toLowerCase();
  return raw.slice(0, 255) || 'guest';
}

// ---- simple per-IP rate limit (no extra package needed) --------------------
const hits = new Map();
function rateLimit(max, windowMs) {
  return (req, res, next) => {
    const now = Date.now();
    const recent = (hits.get(req.ip + req.path) || []).filter((t) => now - t < windowMs);
    if (recent.length >= max) return res.status(429).json({ error: 'Too many requests, slow down a little.' });
    recent.push(now);
    hits.set(req.ip + req.path, recent);
    next();
  };
}

let languages = {};
let running = 0;

app.get('/api/health', async (_req, res) => {
  try {
    await db().query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch (e) {
    res.status(500).json({ ok: false, database: e.message });
  }
});

app.get('/api/languages', (_req, res) => {
  res.json(Object.values(languages).map(({ tools, ...rest }) => rest));
});

// ---- run code ---------------------------------------------------------------
app.post('/api/run', rateLimit(30, 60_000), async (req, res) => {
  const { language, code, stdin = '' } = req.body || {};
  const lang = languages[language];

  if (!lang) return res.status(400).json({ error: `Unknown language "${language}"` });
  if (typeof code !== 'string' || !code.trim()) return res.status(400).json({ error: 'No code to run' });
  if (Buffer.byteLength(code) > LIMITS.maxCode) return res.status(413).json({ error: 'Code is too large' });
  if (lang.mode === 'preview') return res.status(400).json({ error: `${lang.label} is previewed in the browser, not run on the server` });
  if (!lang.runnable) return res.status(501).json({ error: `${lang.label} is not available: ${lang.reason}` });
  if (running >= LIMITS.maxConcurrent) return res.status(503).json({ error: 'Server is busy, try again in a moment.' });

  running++;
  const user = owner(req);
  try {
    const result =
      lang.mode === 'sql'
        ? await runSql({ code, owner: user, timeoutMs: LIMITS.timeoutMs })
        : await runCode({ language, code, stdin: String(stdin).slice(0, 10000), tools: lang.tools, limits: LIMITS });

    // Save to history (a database hiccup should never break running code)
    db()
      .query(
        `INSERT INTO runs (owner, language, code, stdin_text, stdout_text, stderr_text, exit_code, timed_out, duration_ms)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [user, language, code, stdin || null, result.stdout, result.stderr, result.exitCode, result.timedOut ? 1 : 0, result.durationMs]
      )
      .catch((e) => console.error('Could not save run history:', e.message));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while running the code' });
  } finally {
    running--;
  }
});

// ---- saved snippets ---------------------------------------------------------
app.get('/api/snippets', async (req, res) => {
  const [rows] = await db().query(
    'SELECT id, title, language, updated_at FROM snippets WHERE owner = ? ORDER BY updated_at DESC LIMIT 100',
    [owner(req)]
  );
  res.json(rows);
});

app.get('/api/snippets/:id', async (req, res) => {
  const [rows] = await db().query('SELECT id, title, language, code FROM snippets WHERE id = ? AND owner = ?', [
    req.params.id, owner(req),
  ]);
  if (!rows.length) return res.status(404).json({ error: 'Snippet not found' });
  res.json(rows[0]);
});

function validSnippet(body) {
  const title = String(body?.title || '').trim().slice(0, 120);
  const language = String(body?.language || '');
  const code = body?.code;
  if (!title) return { error: 'Give the snippet a title' };
  if (!LANGUAGES[language]) return { error: 'Unknown language' };
  if (typeof code !== 'string' || Buffer.byteLength(code) > LIMITS.maxCode) return { error: 'Code missing or too large' };
  return { title, language, code };
}

app.post('/api/snippets', async (req, res) => {
  const s = validSnippet(req.body);
  if (s.error) return res.status(400).json({ error: s.error });
  const [r] = await db().query('INSERT INTO snippets (owner, title, language, code) VALUES (?,?,?,?)', [
    owner(req), s.title, s.language, s.code,
  ]);
  res.status(201).json({ id: r.insertId, title: s.title, language: s.language });
});

app.put('/api/snippets/:id', async (req, res) => {
  const s = validSnippet(req.body);
  if (s.error) return res.status(400).json({ error: s.error });
  const [r] = await db().query('UPDATE snippets SET title=?, language=?, code=? WHERE id=? AND owner=?', [
    s.title, s.language, s.code, req.params.id, owner(req),
  ]);
  if (!r.affectedRows) return res.status(404).json({ error: 'Snippet not found' });
  res.json({ id: Number(req.params.id), title: s.title, language: s.language });
});

app.delete('/api/snippets/:id', async (req, res) => {
  const [r] = await db().query('DELETE FROM snippets WHERE id=? AND owner=?', [req.params.id, owner(req)]);
  if (!r.affectedRows) return res.status(404).json({ error: 'Snippet not found' });
  res.json({ ok: true });
});

// ---- run history ------------------------------------------------------------
app.get('/api/runs', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const [rows] = await db().query(
    'SELECT id, language, exit_code, timed_out, duration_ms, created_at FROM runs WHERE owner = ? ORDER BY id DESC LIMIT ?',
    [owner(req), limit]
  );
  res.json(rows);
});

// FIX: an unknown /api/... URL used to get Express's HTML 404 page, which the frontend
// (src/lib/api.js) misreads as "backend offline". Answer with JSON instead.
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Catch errors from async routes so the server never crashes on a bad query
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// ---- start ------------------------------------------------------------------
async function main() {
  await initDb();
  console.log('MySQL connected.');

  let sqlReady = false;
  if (sandboxConfigured()) {
    try {
      await getSandboxPool().query('SELECT 1');
      sqlReady = true;
    } catch (e) {
      console.warn(`MYSQL language disabled - sandbox user could not connect: ${e.message}`);
    }
  }

  languages = detectLanguages({ sqlReady });
  const ready = Object.values(languages).filter((l) => l.runnable).map((l) => l.id);
  const missing = Object.values(languages).filter((l) => l.mode !== 'preview' && !l.runnable).map((l) => l.id);
  console.log(`Runnable languages: ${ready.join(', ')}`);
  if (missing.length) console.log(`Not installed / unavailable: ${missing.join(', ')}`);

  app.listen(PORT, HOST, () => console.log(`CampSpace API running at http://${HOST}:${PORT}`));
}

// Express 4 doesn't catch rejected promises in async routes; wrap them.
for (const layer of app._router.stack) {
  if (layer.route) {
    for (const l of layer.route.stack) {
      const fn = l.handle;
      if (fn.constructor.name === 'AsyncFunction') {
        l.handle = (req, res, next) => fn(req, res, next).catch(next);
      }
    }
  }
}

main().catch((e) => {
  console.error('Failed to start:', e.message);
  process.exit(1);
});
