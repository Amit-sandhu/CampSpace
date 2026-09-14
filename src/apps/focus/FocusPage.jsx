/*
 * BEGINNER GUIDE: src/apps/focus/FocusPage.jsx
 * This React file defines the FocusPage component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import {
  useCallback,
  useEffect,
  useMemo
} from "react";

import Topbar from "./components/layout/Topbar";

import StatCard from "./components/focus/StatCard";
import TodayTasks from "./components/focus/TodayTasks";
import FocusTimer from "./components/focus/FocusTimer";
import RecentSessions from "./components/focus/RecentSessions";
import ProductivityOverview from "./components/focus/ProductivityOverview";
import FocusInsights from "./components/focus/FocusInsights";
import QuickTools from "./components/focus/QuickTools";

import { getDateString } from "./utils/dateHelpers";
import {
  TargetIcon,
  ClipboardListIcon,
  ClockIcon,
  BarChart3Icon,
  FlameIcon
} from "./components/common/Icons";
import { recordTodayCompletion } from "./utils/taskHistory";
import { sumSessionMinutes } from "./utils/sessionHelpers";

import "./FocusPage.css";

// BEGINNER: FocusPage()
// This component/function is responsible for the FocusPage part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function FocusPage({
  tasks,
  setTasks,
  sessions,
  setSessions,
  demoMode,
  demoDate
}) {

  /* =======================================================
     DATE
  ======================================================= */

  const todayDate =
    demoMode
      ? demoDate
      : new Date();

  const today =
    getDateString(
      todayDate
    );

  /* =======================================================
     TASK CALCULATIONS
  ======================================================= */

  const completedTasks =
    useMemo(() => {
      return tasks.filter(
        (task) =>
          task.completed
      ).length;
    }, [
      tasks
    ]);

  const taskCompletion =
    useMemo(() => {
      if (
        tasks.length === 0
      ) {
        return 0;
      }

      return Math.round(
        (
          completedTasks /
          tasks.length
        ) * 100
      );
    }, [
      completedTasks,
      tasks.length
    ]);

  /* =======================================================
     TODAY'S SESSIONS
  ======================================================= */

  const todaySessions =
    useMemo(() => {
      return sessions.filter(
        (session) =>
          session.date === today &&
          session.recent !== false
      );
    }, [
      sessions,
      today
    ]);

  /* =======================================================
     TODAY FOCUS TIME
  ======================================================= */

  const todayFocusMinutes =
    useMemo(() => {
      return sumSessionMinutes(
        ...todaySessions
      );
    }, [
      todaySessions
    ]);

  const focusHours =
    Math.floor(
      todayFocusMinutes / 60
    );

  const focusMinutes =
    todayFocusMinutes % 60;

  const focusTime =
    `${focusHours}h ${String(
      focusMinutes
    ).padStart(
      2,
      "0"
    )}m`;

  useEffect(() => {
    recordTodayCompletion(
      today,
      taskCompletion
    );
  }, [
    today,
    taskCompletion
  ]);

  /* =======================================================
     TIMER SESSION COMPLETE
  ======================================================= */

  const handleSessionComplete =
    useCallback(
      (session) => {
        const now =
          demoMode
            ? new Date(
                demoDate
              )
            : new Date();

        if (demoMode) {
          const currentTime =
            new Date();

          now.setHours(
            currentTime.getHours(),
            currentTime.getMinutes(),
            currentTime.getSeconds()
          );
        }

        const newSession = {
          id:
            Date.now(),
          taskId:
            session.taskId,
          task:
            session.task,
          type:
            session.type,
          duration:
            Number(
              session.duration
            ),
          completedAt:
            now.toLocaleTimeString(
              [],
              {
                hour:
                  "2-digit",
                minute:
                  "2-digit"
              }
            ),
          date:
            demoMode
              ? getDateString(demoDate)
              : getDateString(now),
          day:
            demoMode
              ? demoDate.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short"
                  }
                )
              : now.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short"
                  }
                ),
          recent:
            true
        };

        setSessions(
          (
            previousSessions
          ) => [
            newSession,
            ...previousSessions
          ]
        );
      },
      [
        demoMode,
        demoDate,
        setSessions
      ]
    );

  return (
    <div className="focus-layout">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="focus-background">
        <div className="background-light light-one"></div>
        <div className="background-light light-two"></div>
        <div className="background-light light-three"></div>

        <div className="tentacle tentacle-top">
          <span></span>
        </div>
        <div className="tentacle tentacle-left">
          <span></span>
        </div>
        <div className="tentacle tentacle-right">
          <span></span>
        </div>

        <div className="glass-bubble bubble-one"></div>
        <div className="glass-bubble bubble-two"></div>
        <div className="glass-bubble bubble-three"></div>
        <div className="glass-bubble bubble-four"></div>
        <div className="glass-bubble bubble-five"></div>
      </div>

      {/* MAIN */}

      <div className="focus-main">

        <Topbar
          date={
            todayDate
          }
          title="Focus"
        />

        <main className="focus-page">
          {/* Main semantic container for the primary page content. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

          {/* =================================================
              HEADER
          ================================================= */}

          <header className="focus-header">
            {/* Semantic header that identifies the top part of this ui section. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <div className="focus-main-icon">
              <TargetIcon />
            </div>

            <div>
              <h1>
                Focus & Productivity
              </h1>
              <p>
                Plan. Work. Improve.
              </p>
            </div>
          </header>

          {/* =================================================
              STATS
          ================================================= */}

          <section className="focus-stats">
            {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <StatCard
              title="Today's Tasks"
              value={
                `${completedTasks} / ${tasks.length}`
              }
              progress={
                taskCompletion
              }
              icon={<ClipboardListIcon />}
              accent="blue"
            />

            <StatCard
              title="Focus Time (Today)"
              value={focusTime}
              icon={<ClockIcon />}
              accent="green"
            />

            <StatCard
              title="Task Completion"
              value={
                `${taskCompletion}%`
              }
              icon={<BarChart3Icon />}
              accent="purple"
            />

            <StatCard
              title="Focus Sessions (Today)"
              value={
                todaySessions.length
              }
              subtitle="Today"
              icon={<FlameIcon />}
              accent="red"
            />
          </section>

          {/* =================================================
              MAIN ROW
              TASKS | TIMER | SESSIONS
          ================================================= */}

          <section className="focus-main-grid">
            {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <TodayTasks
              tasks={tasks}
              setTasks={setTasks}
            />

            <FocusTimer
              tasks={tasks}
              onSessionComplete={
                handleSessionComplete
              }
            />

            <RecentSessions
              sessions={
                todaySessions
              }
            />
          </section>

          {/* =================================================
              BOTTOM ROW
          ================================================= */}

          <section className="focus-bottom-grid">
            {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <ProductivityOverview
              sessions={sessions}
              tasks={tasks}
              currentDate={
                todayDate
              }
            />

            <FocusInsights
              tasks={
                tasks
              }
              todaySessions={
                todaySessions
              }
              allSessions={
                sessions
              }
            />

            <QuickTools />
          </section>

        </main>

      </div>

    </div>
  );
}

export default FocusPage;
