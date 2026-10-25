/*
 * CHANGED in this file (what + why):
 *  - CONTEXT: tasks + onSessionComplete come from FocusDashboardContext instead of props
 *  - BUG FIX: the old timer called onSessionComplete from inside a setState updater.
 *    React may run updaters twice (StrictMode), which could save one session twice.
 *    Now a 1-second setTimeout counts down and a ref (completionHandledRef) makes
 *    sure the finished session is saved exactly once.
 */
import {
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import {
  ClockIcon,
  PlayIcon,
  PauseIcon,
  RefreshIcon
} from "../common/Icons";

import FocusDashboardContext from "./FocusDashboardContext";

import "./FocusTimer.css";

const POMODORO_SECONDS = 25 * 60;

function FocusTimer() {
  const { tasks, onSessionComplete } =
    useContext(FocusDashboardContext);

  const [mode, setMode] = useState("pomodoro");
  const [customMinutes, setCustomMinutes] = useState(60);
  const [timeLeft, setTimeLeft] = useState(POMODORO_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  // Prevent the same timer completion from being saved twice.
  const completionHandledRef = useRef(false);

  const totalTime =
    mode === "pomodoro"
      ? POMODORO_SECONDS
      : customMinutes * 60;

  const isLocked =
    isRunning ||
    (timeLeft > 0 && timeLeft < totalTime);

  // Timer countdown and one-time session completion.
  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      if (timeLeft <= 1) {
        setTimeLeft(0);
        setIsRunning(false);

        if (completionHandledRef.current) {
          return;
        }

        completionHandledRef.current = true;

        const selectedTask = tasks.find(
          (task) => task.id === Number(selectedTaskId)
        );

        if (selectedTask) {
          onSessionComplete({
            taskId: selectedTask.id,
            task: selectedTask.title,
            type: selectedTask.type,
            duration: Math.ceil(totalTime / 60)
          });
        }

        return;
      }

      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [
    isRunning,
    timeLeft,
    tasks,
    selectedTaskId,
    totalTime,
    onSessionComplete
  ]);

  function startTimer() {
    if (selectedTaskId === "") {
      alert("Please select a task first.");
      return;
    }

    completionHandledRef.current = false;

    if (timeLeft === 0) {
      setTimeLeft(totalTime);
    }

    setIsRunning(true);
  }

  function pauseTimer() {
    setIsRunning(false);
  }

  function resetTimer() {
    setIsRunning(false);
    completionHandledRef.current = false;
    setTimeLeft(totalTime);
  }

  function choosePomodoro() {
    setIsRunning(false);
    completionHandledRef.current = false;
    setMode("pomodoro");
    setTimeLeft(POMODORO_SECONDS);
  }

  function chooseCustom() {
    setIsRunning(false);
    completionHandledRef.current = false;
    setMode("custom");
    setTimeLeft(customMinutes * 60);
  }

  function changeMinutes(event) {
    const value = Number(event.target.value);
    // Keep custom sessions within the range exposed by the input.
    const minutes = Math.min(180, Math.max(1, Math.floor(value || 1)));

    setCustomMinutes(minutes);

    if (!isRunning && mode === "custom") {
      setTimeLeft(minutes * 60);
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  const progress =
    totalTime === 0
      ? 0
      : ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <section className="timer-card">
      <div className="timer-header">
        <div className="timer-title">
          <span>
            <ClockIcon />
          </span>
          <h2>Focus Timer</h2>
        </div>
      </div>

      <div className="timer-tabs">
        <button
          type="button"
          className={
            mode === "pomodoro"
              ? "timer-tab active"
              : "timer-tab"
          }
          onClick={choosePomodoro}
          disabled={isLocked}
          aria-pressed={mode === "pomodoro"}
        >
          Pomodoro
        </button>

        <button
          type="button"
          className={
            mode === "custom"
              ? "timer-tab active"
              : "timer-tab"
          }
          onClick={chooseCustom}
          disabled={isLocked}
          aria-pressed={mode === "custom"}
        >
          Timer (Custom)
        </button>
      </div>

      {mode === "custom" && (
        <div className="custom-time">
          <label>Minutes</label>

          <input
            type="number"
            min="1"
            max="180"
            step="1"
            value={customMinutes}
            onChange={changeMinutes}
            disabled={isLocked}
          />
        </div>
      )}

      <div className="timer-select">
        <label>Select Task</label>

        <select
          value={selectedTaskId}
          onChange={(event) =>
            setSelectedTaskId(event.target.value)
          }
          disabled={isLocked}
        >
          <option value="">Select a task</option>

          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title} — {task.type}
            </option>
          ))}
        </select>
      </div>

      <div className="timer-circle-area">
        <div
          className="timer-circle"
          style={{
            background: `conic-gradient(
              #2563eb ${progress}%,
              #dce7f5 ${progress}% 100%
            )`
          }}
        >
          <div className="timer-circle-inner">
            <strong>{formatTime(timeLeft)}</strong>

            <span>
              {isRunning
                ? "Focusing..."
                : timeLeft === 0
                  ? "Session complete"
                  : "Ready to focus"}
            </span>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        <button
          type="button"
          className="timer-start"
          onClick={isRunning ? pauseTimer : startTimer}
        >
          {isRunning ? (
            <>
              <PauseIcon />
              <span>Pause</span>
            </>
          ) : (
            <>
              <PlayIcon />
              <span>Start</span>
            </>
          )}
        </button>

        <button
          type="button"
          className="timer-reset"
          onClick={resetTimer}
          aria-label="Reset timer"
        >
          <RefreshIcon />
        </button>
      </div>
    </section>
  );
}

export default FocusTimer;