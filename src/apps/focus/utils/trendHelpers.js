/*
 * BEGINNER GUIDE: src/apps/focus/utils/trendHelpers.js
 * This file handles the Productivity trend calculations.
 * Syllabus topics visible here: ES6 let/const, props / component composition.
 * The code below keeps the original behaviour; comments explain the main jobs.
 */

/* =========================================================
   TREND TEXT HELPERS
   -----------------------------------------------------
   Turns two plain numbers (today vs. yesterday) into the
   arrow + sentence StatCard displays — e.g. "20 min from
   yesterday". Kept in one place so both trend cards format
   their text the exact same way.
========================================================= */

export function compareMinutes(currentMinutes, previousMinutes) {

  if (previousMinutes === null || previousMinutes === undefined) {
    return { direction: "neutral", text: "No data for yesterday yet" };
  }

  const diff = currentMinutes - previousMinutes;

  if (diff === 0) {
    return { direction: "neutral", text: "Same as yesterday" };
  }

  const magnitude = Math.abs(diff);
  const hours = Math.floor(magnitude / 60);
  const minutes = magnitude % 60;

  const magnitudeText =
    hours > 0
      ? `${hours}h ${minutes}m`
      : `${minutes} min`;

  return {
    direction: diff > 0 ? "up" : "down",
    text: `${magnitudeText} from yesterday`
  };
}


export function comparePercentPoints(currentPercent, previousPercent) {

  if (previousPercent === null || previousPercent === undefined) {
    return { direction: "neutral", text: "No data for yesterday yet" };
  }

  const diff = Math.round(currentPercent - previousPercent);

  if (diff === 0) {
    return { direction: "neutral", text: "Same as yesterday" };
  }

  return {
    direction: diff > 0 ? "up" : "down",
    text: `${Math.abs(diff)}% from yesterday`
  };
}