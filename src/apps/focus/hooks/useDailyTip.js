/*
 * BEGINNER GUIDE: src/apps/focus/hooks/useDailyTip.js
 * This file handles the Reusable daily-tip hook.
 * Syllabus topics visible here: React state / useState, useCallback, Fetch API / async-await, ES6 arrow functions, ES6 let/const, props / component composition.
 * The code below keeps the original behaviour; comments explain the main jobs.
 */

import { useCallback, useState } from "react";

const TIP_API_URL = "/focus-tips.json";
const LOADING_DELAY_MS = 500;

/**
 * Fetches JSON data and exposes loading/error states.
 * The fetch call returns a Promise; async/await handles that Promise cleanly.
 */
export function useDailyTip() {
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTip = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Keep the loading state visible long enough to demonstrate it in the UI.
      await new Promise((resolve) => setTimeout(resolve, LOADING_DELAY_MS));

      const response = await fetch(TIP_API_URL);

      if (!response.ok) {
        throw new Error("Unable to load the daily tip.");
      }

      const data = await response.json();
      const tips = Array.isArray(data.tips) ? data.tips : [];

      if (tips.length === 0) {
        throw new Error("No focus tips are available.");
      }

      // Avoid showing the same tip twice in a row.
      const availableTips = tips.filter((item) => item !== tip);
      const tipPool = availableTips.length > 0 ? availableTips : tips;
      const randomTip = tipPool[Math.floor(Math.random() * tipPool.length)];

      setTip(randomTip || "Stay focused and keep making progress.");
    } catch (requestError) {
      setTip("");
      setError(requestError.message || "Unable to load the daily tip.");
    } finally {
      setLoading(false);
    }
  }, [tip]);

  return {
    tip,
    loading,
    error,
    refreshTip: fetchTip
  };
}
