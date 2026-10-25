/*
 * BEGINNER GUIDE: src/lib/api.js
 * Small helper for talking to the CampSpace backend (server/index.js).
 * Syllabus topics visible here: Fetch API / async-await, Browser storage / JSON, error handling.
 *
 * In development, Vite forwards every /api/... request to the backend (see vite.config.js),
 * so BASE can stay empty. When the site is deployed somewhere else, set VITE_API_URL
 * (for example https://campspace-api.onrender.com) in your hosting settings.
 */

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// The backend identifies people by the email stored in the CampSpace login session.
export function currentUser() {
  try {
    const session = JSON.parse(localStorage.getItem('campspace_session') || 'null');
    return (session && session.email) || 'guest';
  } catch {
    return 'guest';
  }
}

// api('/api/snippets')  or  api('/api/run', { method: 'POST', body: { ... } })
// Throws an Error. error.offline === true means the backend could not be reached at all.
export async function api(path, { method = 'GET', body, timeoutMs = 45000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(BASE + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-campspace-user': currentUser(),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (cause) {
    const error = new Error('Cannot reach the CampSpace backend. Is "npm run server" running?');
    error.offline = true;
    throw error;
  } finally {
    clearTimeout(timer);
  }

  // A dev proxy with nothing behind it answers 500/502/504 with a non-JSON body.
  let data = null;
  try {
    data = await response.json();
  } catch {
    const error = new Error('Cannot reach the CampSpace backend. Is "npm run server" running?');
    error.offline = true;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(data && data.error ? data.error : `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}
