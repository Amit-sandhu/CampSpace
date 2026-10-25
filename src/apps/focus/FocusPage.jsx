/*
 * BEGINNER GUIDE: src/apps/focus/FocusPage.jsx
 * This React file defines the FocusPage component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Provider } from "react-redux";

import Topbar from "./components/layout/Topbar";

import StatCard from "./components/focus/StatCard";
import TodayTasks from "./components/focus/TodayTasks";
import FocusTimer from "./components/focus/FocusTimer";
import RecentSessions from "./components/focus/RecentSessions";
import ProductivityOverview from "./components/focus/ProductivityOverview";
import FocusInsights from "./components/focus/FocusInsights";
import QuickTools from "./components/focus/QuickTools";
import FocusDashboardContext from "./components/focus/FocusDashboardContext";
import { focusUiStore } from "./components/focus/focusUiStore";

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
import "./FocusVisualPolish.css";

// BEGINNER: FocusPage()
// This component/function is responsible for the FocusPage part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
//
// CHANGED (Context API + Redux Toolkit): FocusPage is now a thin wrapper.
//  - <Provider store={focusUiStore}>  -> task search/filter/toast state (Redux Toolkit)
//  - <FocusDashboardContext.Provider> -> shares tasks/sessions (owned by FocusApp) with child components
// This replaces "prop drilling" (passing tasks/setTasks through every level).
function FocusPage(props) {
  return (
    <Provider store={focusUiStore}>
      <FocusDashboardContext.Provider value={props}>
        <FocusDashboardContent />
      </FocusDashboardContext.Provider>
    </Provider>
  );
}

// The real dashboard. It reads the props FocusApp gave FocusPage from context.
function FocusDashboardContent() {
  const {
    tasks,
    setTasks,
    sessions,
    setSessions,
    demoMode,
    demoDate
  } = useContext(FocusDashboardContext);

  // LOCAL state: the "session saved" toast only matters to this page.
  const [toast, setToast] = useState("");

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
     AUTO-DISMISS TOAST (the cleanup function clears the timer)
  ======================================================= */

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast("");
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

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

        setToast(
          `Focus session for “${newSession.task}” was saved.`
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

          {/* CHANGED: these three cards now read their data from context, so no props are passed. */}
          <FocusDashboardContext.Provider
            value={{
              tasks,
              setTasks,
              sessions,
              setSessions,
              todaySessions,
              onSessionComplete: handleSessionComplete
            }}
          >
            <section className="focus-main-grid">
              {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <TodayTasks />

              <FocusTimer />

              <RecentSessions />
            </section>
          </FocusDashboardContext.Provider>

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

      {/* Accessible toast for saved focus sessions (role="status" + aria-live) */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            right: "24px",
            bottom: "24px",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            maxWidth: "calc(100vw - 32px)",
            padding: "14px 16px",
            borderRadius: "12px",
            background: "#10234d",
            color: "#ffffff",
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.22)",
            fontSize: "14px",
            fontWeight: 600
          }}
        >
          <span>{toast}</span>
          <button
            type="button"
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
            style={{
              border: 0,
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
              fontSize: "20px",
              lineHeight: 1,
              padding: "0 2px"
            }}
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
}

export default FocusPage;
