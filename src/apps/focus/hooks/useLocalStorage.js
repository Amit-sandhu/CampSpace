/*
 * BEGINNER GUIDE: src/apps/focus/hooks/useLocalStorage.js
 * This file handles the Reusable localStorage React hook.
 * Syllabus topics visible here: React state / useState, useEffect, Browser storage / JSON, ES6 arrow functions, ES6 let/const, props / component composition.
 * The code below keeps the original behaviour; comments explain the main jobs.
 */

import { useEffect, useState } from "react";

// BEGINNER: readStoredValue()
// Main job: perform one focused task for this file.
// It receives data/props, performs the required work, and returns the result or UI.
// Keeping this job in one function makes the code easier to follow during the PPT.
function readStoredValue(key, initialValue) {
  try {
    const saved = localStorage.getItem(key);

    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch {
    // Invalid stored JSON falls back to the provided initial value.
  }

  return typeof initialValue === "function"
    ? initialValue()
    : initialValue;
}

/**
 * Reusable custom hook for React state that persists to browser storage.
 * It keeps the existing CampSpace localStorage behaviour unchanged while
 * demonstrating reusable hook architecture for the evaluation.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() =>
    readStoredValue(key, initialValue)
  );

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage failures should not crash the application.
    }
  }, [key, value]);

  return [value, setValue];
}
