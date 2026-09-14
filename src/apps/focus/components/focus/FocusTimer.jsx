/*
 * BEGINNER GUIDE: src/apps/focus/components/focus/FocusTimer.jsx
 * This React file defines the FocusTimer component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import {
  useEffect,
  useState
} from "react";

import {
  ClockIcon,
  PlayIcon,
  PauseIcon,
  RefreshIcon
} from "../common/Icons";

import "./FocusTimer.css";


const POMODORO_SECONDS =
  25 * 60;


// BEGINNER: FocusTimer()
// This component/function is responsible for the FocusTimer part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function FocusTimer({
  tasks,
  onSessionComplete
}) {

  const [mode, setMode] =
    useState("pomodoro");

  const [customMinutes, setCustomMinutes] =
    useState(60);

  const [timeLeft, setTimeLeft] =
    useState(
      POMODORO_SECONDS
    );

  const [isRunning, setIsRunning] =
    useState(false);

  const [selectedTaskId, setSelectedTaskId] =
    useState("");


  const totalTime =
    mode === "pomodoro"
      ? POMODORO_SECONDS
      : customMinutes * 60;


  /* =====================================================
     LOCKED
     -------------------------------------------------
     True from the moment Start is clicked until the
     session either finishes or is reset — covers BOTH
     "actively running" and "paused mid-session", so the
     task/minutes can't be swapped out from under an
     in-progress session. (timeLeft === totalTime means
     "not started yet"; timeLeft === 0 means "just
     finished" — neither of those counts as in-progress.)
  ===================================================== */

  const isLocked =
    isRunning ||
    (
      timeLeft > 0 &&
      timeLeft < totalTime
    );


  /* =====================================================
     TIMER EFFECT
  ===================================================== */

  useEffect(() => {

    if (!isRunning) {
      return;
    }


    const intervalId =
      setInterval(() => {

        setTimeLeft(
          (previousTime) => {

            if (
              previousTime <= 1
            ) {

              clearInterval(
                intervalId
              );


              const selectedTask =
                tasks.find(
                  (task) =>
                    task.id ===
                    Number(
                      selectedTaskId
                    )
                );


              if (selectedTask) {

                onSessionComplete({

                  taskId:
                    selectedTask.id,

                  task:
                    selectedTask.title,

                  type:
                    selectedTask.type,

                  duration:
                    Math.ceil(
                      totalTime / 60
                    )

                });

              }


              setIsRunning(false);

              return 0;
            }


            return previousTime - 1;
          }
        );

      }, 1000);


    return () =>
      clearInterval(
        intervalId
      );

  }, [
    isRunning,
    tasks,
    selectedTaskId,
    totalTime,
    onSessionComplete
  ]);


  /* =====================================================
     START
  ===================================================== */

  // BEGINNER: startTimer()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function startTimer() {

    if (
      selectedTaskId === ""
    ) {

      alert(
        "Please select a task first."
      );

      return;
    }


    if (
      timeLeft === 0
    ) {

      setTimeLeft(
        totalTime
      );

    }


    setIsRunning(true);
  }


  /* =====================================================
     PAUSE
  ===================================================== */

  // BEGINNER: pauseTimer()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function pauseTimer() {
    setIsRunning(false);
  }


  /* =====================================================
     RESET
  ===================================================== */

  function resetTimer() {

    setIsRunning(false);

    setTimeLeft(
      totalTime
    );
  }


  /* =====================================================
     POMODORO
  ===================================================== */

  // BEGINNER: choosePomodoro()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function choosePomodoro() {

    setIsRunning(false);

    setMode("pomodoro");

    setTimeLeft(
      POMODORO_SECONDS
    );
  }


  /* =====================================================
     CUSTOM
  ===================================================== */

  // BEGINNER: chooseCustom()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function chooseCustom() {

    setIsRunning(false);

    setMode("custom");

    setTimeLeft(
      customMinutes * 60
    );
  }


  /* =====================================================
     CUSTOM MINUTES
  ===================================================== */

  // BEGINNER: changeMinutes()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function changeMinutes(event) {

    const value =
      Number(
        event.target.value
      );


    const minutes =
      value > 0
        ? value
        : 1;


    setCustomMinutes(
      minutes
    );


    if (
      !isRunning &&
      mode === "custom"
    ) {

      setTimeLeft(
        minutes * 60
      );
    }
  }


  /* =====================================================
     FORMAT
  ===================================================== */

  // BEGINNER: formatTime()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function formatTime(
    seconds
  ) {

    const minutes =
      Math.floor(
        seconds / 60
      );


    const remainingSeconds =
      seconds % 60;


    return (
      `${String(
        minutes
      ).padStart(
        2,
        "0"
      )}:${String(
        remainingSeconds
      ).padStart(
        2,
        "0"
      )}`
    );
  }


  const progress =
    totalTime === 0
      ? 0
      :
      (
        (
          totalTime -
          timeLeft
        ) /
        totalTime
      ) * 100;


  return (
    <section className="timer-card">
      {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}


      {/* HEADER */}

      <div className="timer-header">
        {/* Focus timer interface with duration selection and timer controls. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

        <div className="timer-title">
          {/* Focus timer interface with duration selection and timer controls. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

          <span>
            <ClockIcon />
          </span>

          <h2>
            Focus Timer
          </h2>

        </div>

      </div>


      {/* TABS */}

      <div className="timer-tabs">
        {/* Focus timer interface with duration selection and timer controls. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

        <button
          type="button"
          className={
            mode === "pomodoro"
              ? "timer-tab active"
              : "timer-tab"
          }
          onClick={
            choosePomodoro
          }
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
          onClick={
            chooseCustom
          }
        >
          Timer (Custom)
        </button>

      </div>


      {/* CUSTOM TIME */}

      {mode === "custom" && (

        <div className="custom-time">

          <label>
            Minutes
          </label>

          <input
            type="number"
            min="1"
            max="180"
            value={
              customMinutes
            }
            onChange={
              changeMinutes
            }
            disabled={
              isLocked
            }
          />

        </div>

      )}


      {/* SELECT TASK */}

      <div className="timer-select">
        {/* Focus timer interface with duration selection and timer controls. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

        <label>
          Select Task
        </label>

        <select
          value={
            selectedTaskId
          }
          onChange={(event) =>
            setSelectedTaskId(
              event.target.value
            )
          }
          disabled={
            isLocked
          }
        >

          <option value="">
            Select a task
          </option>


          {tasks.map(
            (task) => (

              <option
                key={task.id}
                value={task.id}
              >
                {task.title} — {task.type}
              </option>

            )
          )}

        </select>

      </div>


      {/* CIRCLE */}

      <div className="timer-circle-area">
        {/* Focus timer interface with duration selection and timer controls. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

        <div
          className="timer-circle"
          style={{
            background:
              `conic-gradient(
                #2563eb ${progress}%,
                #dce7f5 ${progress}% 100%
              )`
          }}
        >

          <div className="timer-circle-inner">
            {/* Focus timer interface with duration selection and timer controls. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

            <strong>
              {formatTime(
                timeLeft
              )}
            </strong>

            <span>

              {isRunning
                ? "Focusing..."
                : timeLeft === 0
                  ? "Session complete"
                  : "Ready to focus"
              }

            </span>

          </div>

        </div>

      </div>


      {/* CONTROLS */}

      <div className="timer-controls">
        {/* Focus timer interface with duration selection and timer controls. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

        <button
          type="button"
          className="timer-start"
          onClick={
            isRunning
              ? pauseTimer
              : startTimer
          }
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
          onClick={
            resetTimer
          }
          aria-label="Reset timer"
        >
          <RefreshIcon />
        </button>

      </div>

    </section>
  );
}

export default FocusTimer;
