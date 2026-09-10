/*
 * BEGINNER GUIDE: src/apps/focus/utils/dateHelpers.js
 * This file handles the Date formatting helpers.
 * Syllabus topics visible here: ES6 let/const, props / component composition.
 * The code below keeps the original behaviour; comments explain the main jobs.
 */

/* =========================================================
   SHARED DATE HELPER
   -----------------------------------------------------
   Used by App.jsx and FocusPage.jsx so "today" is always
   calculated the same way in both places. Reading the date
   with toISOString() converts to UTC first, which can shift
   the calendar day depending on timezone. getDateString()
   reads the LOCAL date instead, so the two files can never
   quietly disagree with each other again.
========================================================= */

export function getDateString(date) {

  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1).padStart(2, "0");

  const day =
    String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}