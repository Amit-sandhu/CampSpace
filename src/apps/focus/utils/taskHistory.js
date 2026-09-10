/*
 * BEGINNER GUIDE: src/apps/focus/utils/taskHistory.js
 * This file handles the Task history data helpers.
 * Syllabus topics visible here: Browser storage / JSON, ES6 let/const, props / component composition.
 * The code below keeps the original behaviour; comments explain the main jobs.
 */

/* =========================================================
   TASK COMPLETION HISTORY (localStorage)
   -----------------------------------------------------
   Tasks have no date attached to them, so there's no way to
   look back and see what yesterday's completion % was just
   from the tasks list itself. This file saves a tiny daily
   snapshot so tomorrow's page can compare against it — the
   same idea as the localStorage save effects already in
   App.jsx for tasks/sessions, just for one extra number.

   NOTE: Focus TIME does NOT need this file. FocusPage.jsx
   computes that trend directly from the sessions list, which
   already has real dated history from App.jsx's weekly seed.
========================================================= */

const HISTORY_KEY = "campSpaceTaskHistory";

// BEGINNER: loadHistory()
// Main job: perform one focused task for this file.
// It receives data/props, performs the required work, and returns the result or UI.
// Keeping this job in one function makes the code easier to follow during the PPT.
function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Private browsing / full storage shouldn't crash the app.
  }
}


/**
 * Reads yesterday's saved completion %, if one was ever saved.
 * On a brand-new install (nothing saved yet), seeds a friendly
 * placeholder for yesterday — the same "fallback demo data" idea
 * already used by getInitialTasks()/getInitialSessions() in
 * App.jsx — so the trend badge has something to show for your
 * evaluation instead of "no data yet" on the very first load.
 */
export function getYesterdayCompletion(yesterdayKey) {

  const history = loadHistory();

  if (history[yesterdayKey] !== undefined) {
    return history[yesterdayKey];
  }

  if (Object.keys(history).length === 0) {
    const seeded = { [yesterdayKey]: 45 };
    saveHistory(seeded);
    return 45;
  }

  return null;
}


/** Saves today's completion % so tomorrow's page can compare against it. */
export function recordTodayCompletion(todayKey, completionPercent) {
  const history = loadHistory();
  history[todayKey] = completionPercent;
  saveHistory(history);
}