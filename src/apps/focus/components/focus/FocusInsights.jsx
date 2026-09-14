/*
 * BEGINNER GUIDE: src/apps/focus/components/focus/FocusInsights.jsx
 * This React file defines the FocusInsights component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import {
  useMemo
} from "react";

import { useDailyTip } from "../../hooks/useDailyTip";

import {
  SparklesIcon,
  TrendingUpIcon,
  StarIcon,
  TargetIcon
} from "../common/Icons";

import "./FocusInsights.css";


// BEGINNER: FocusInsights()
// This component/function is responsible for the FocusInsights part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function FocusInsights({
  tasks = [],
  todaySessions = [],
  allSessions = []
}) {

  const {
    tip,
    loading,
    error,
    refreshTip
  } = useDailyTip();

  const completedTasks =
    useMemo(() => {
      return tasks.filter(
        (task) =>
          task.completed
      ).length;
    }, [
      tasks
    ]);

  const percentage =
    tasks.length === 0
      ? 0
      :
      Math.round(
        (
          completedTasks /
          tasks.length
        ) * 100
      );

  const longestSession =
    useMemo(() => {
      if (
        todaySessions.length === 0
      ) {
        return null;
      }
      return todaySessions.reduce(
        (
          longest,
          current
        ) =>
          Number(
            current.duration
          ) >
          Number(
            longest.duration
          )
            ? current
            : longest
      );
    }, [
      todaySessions
    ]);

  const focusDays =
    useMemo(() => {
      return new Set(
        allSessions.map(
          (session) =>
            session.date
        )
      ).size;
    }, [
      allSessions
    ]);

  return (
    <section className="insights-card">
      {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

      {/* HEADER */}

      <div className="insights-header">
        {/* Productivity insights area containing calculated observations. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

        <div className="insights-header-icon">
          {/* Productivity insights area containing calculated observations. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <SparklesIcon />
        </div>

        <div>
          <h2>
            Focus Insights
          </h2>

          <p>
            Your productivity patterns
          </p>
        </div>

      </div>


      {/* TASK */}

      <div className="insight-item">

        <div className="insight-icon green">
          <TrendingUpIcon />
        </div>

        <div>
          <h3>
            {completedTasks === 0
              ? "Start your first task"
              :
              `You've completed ${
                completedTasks
              } task${
                completedTasks === 1
                  ? ""
                  : "s"
              }!`
            }
          </h3>

          <p>
            {percentage >= 60
              ? "Great progress. Keep it up!"
              : "Keep working through your pending tasks."
            }
          </p>
        </div>

      </div>


      {/* LONGEST */}

      <div className="insight-item">

        <div className="insight-icon yellow">
          <StarIcon />
        </div>

        <div>
          <h3>
            Your longest focus session
          </h3>

          <p>
            {longestSession
              ? `Your longest session today was ${longestSession.duration} minutes.`
              : "Complete a focus session to see your best session."
            }
          </p>
        </div>

      </div>


      {/* CONSISTENCY */}

      <div className="insight-item">

        <div className="insight-icon red">
          <TargetIcon />
        </div>

        <div>
          <h3>
            {focusDays > 0
              ? "You're building a consistent routine!"
              : "Start building your routine."
            }
          </h3>

          <p>
            {focusDays > 0
              ? `You've logged focus sessions on ${focusDays} day${focusDays === 1 ? "" : "s"}.`
              : "Complete focus sessions to build your routine."
            }
          </p>
        </div>

      </div>


      {/* API / ASYNC JAVASCRIPT DEMONSTRATION */}

      <div className="insight-item">

        <div className="insight-icon green">
          <SparklesIcon />
        </div>

        <div>
          <h3>
            Daily Focus Tip
          </h3>

          <p>
            {loading
              ? "Loading a live tip..."
              : error
                ? error
                : tip
                  ? tip
                  : "Stay focused and keep making progress."
            }
          </p>

          <button
            type="button"
            className="insight-refresh"
            onClick={refreshTip}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh tip"}
          </button>
        </div>

      </div>

    </section>
  );
}

export default FocusInsights;
