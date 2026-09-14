/*
 * BEGINNER GUIDE: src/apps/focus/utils/sessionHelpers.js
 * This file handles the Focus session calculations.
 * Syllabus topics visible here: ES6 spread/rest, ES6 arrow functions, props / component composition.
 * The code below keeps the original behaviour; comments explain the main jobs.
 */

/**
 * Uses a rest parameter to accept any number of focus sessions and total
 * their durations without changing the existing displayed result.
 */
export function sumSessionMinutes(...sessions) {
  return sessions.reduce(
    (total, session) => total + Number(session.duration || 0),
    0
  );
}
