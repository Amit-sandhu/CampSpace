/*
 * BEGINNER GUIDE: src/apps/focus/components/focus/ProductivityOverview.jsx
 * This React file defines the ProductivityOverview component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import {
  useMemo,
  useState
} from "react";

import { getDateString } from "../../utils/dateHelpers";

import {
  BarChart3Icon,
  ClockIcon,
  CheckIcon,
  FlameIcon
} from "../common/Icons";

import "./ProductivityOverview.css";


/**
 * Turns an hours value into a clean axis label — "2h", "1.5h", "0h" —
 * without an ugly trailing ".0" on whole numbers.
 */
// BEGINNER: formatHours()
// This component/function is responsible for the formatHours part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function formatHours(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}h` : `${rounded.toFixed(1)}h`;
}


function ProductivityOverview({
  sessions = [],
  tasks = [],
  currentDate
}) {

  const [week, setWeek] =
    useState("This Week");


  /* =====================================================
     CURRENT WEEK
  ===================================================== */

  const currentWeek =
    useMemo(() => {

      const today =
        new Date(
          currentDate
        );

      const day =
        today.getDay();

      const mondayOffset =
        day === 0
          ? 6
          : day - 1;


      const monday =
        new Date(
          today
        );

      monday.setDate(
        today.getDate() -
        mondayOffset
      );


      const days = [];


      for (
        let i = 0;
        i < 7;
        i++
      ) {

        const date =
          new Date(
            monday
          );

        date.setDate(
          monday.getDate() +
          i
        );


        days.push({

          name:
            date.toLocaleDateString(
              "en-US",
              {
                weekday:
                  "short"
              }
            ),

          date:
            getDateString(date)

        });
      }


      return days;

    }, [
      currentDate
    ]);


  /* =====================================================
     PREVIOUS WEEK
  ===================================================== */

  const previousWeek =
    useMemo(() => {

      return currentWeek.map(
        (day) => {

          const date =
            new Date(
              day.date
            );


          date.setDate(
            date.getDate() -
            7
          );


          return {

            name:
              day.name,

            date:
              getDateString(date)

          };

        }
      );

    }, [
      currentWeek
    ]);


  const selectedDays =
    week === "This Week"
      ? currentWeek
      : previousWeek;


  /* =====================================================
     GRAPH DATA
  ===================================================== */

  const graphData =
    useMemo(() => {

      return selectedDays.map(
        (day) => {

          const daySessions =
            sessions.filter(
              (session) =>
                session.date ===
                day.date
            );


          const minutes =
            daySessions.reduce(
              (
                total,
                session
              ) =>
                total +
                Number(
                  session.duration || 0
                ),
              0
            );


          return {

            name:
              day.name,

            date:
              day.date,

            minutes,

            hours:
              minutes / 60
          };

        }
      );

    }, [
      selectedDays,
      sessions
    ]);


  /* =====================================================
     TOTAL
  ===================================================== */

  const totalMinutes =
    graphData.reduce(
      (total, day) =>
        total +
        day.minutes,
      0
    );


  const totalHours =
    totalMinutes / 60;


  /* =====================================================
     SESSIONS
  ===================================================== */

  const totalSessions =
    graphData.reduce(
      (
        total,
        day
      ) =>
        total +
        sessions.filter(
          (session) =>
            session.date ===
            day.date
        ).length,
      0
    );


  /* =====================================================
     TASKS
  ===================================================== */

  const completedTasks =
    tasks.filter(
      (task) =>
        task.completed
    ).length;


  const taskCompletion =
    tasks.length === 0
      ? 0
      :
      Math.round(
        (
          completedTasks /
          tasks.length
        ) * 100
      );


  /* =====================================================
     TODAY
  ===================================================== */

  const today =
    getDateString(
      new Date(
        currentDate
      )
    );


  /* =====================================================
     MAX HOURS
  ===================================================== */

  const maxHours =
    Math.max(
      2,
      Math.ceil(
        Math.max(
          0,
          ...graphData.map(
            (day) =>
              day.hours
          )
        )
      )
    );


  /* =====================================================
     SCALE LABELS
  ===================================================== */

  const scaleMarks =
    [4, 3, 2, 1, 0].map(
      (step) =>
        (maxHours / 4) * step
    );


  return (
    <section className="productivity-card">
      {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}


      {/* HEADER */}

      <div className="productivity-header">
        {/* Productivity summary and chart area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

        <div className="productivity-title">
          {/* Productivity summary and chart area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

          <span>
            <BarChart3Icon />
          </span>

          <div>

            <h2>
              Productivity Overview
            </h2>

            <p>
              Focus Time (Hours)
            </p>

          </div>

        </div>


        <select
          value={week}
          onChange={(event) =>
            setWeek(
              event.target.value
            )
          }
        >

          <option>
            This Week
          </option>

          <option>
            Previous Week
          </option>

        </select>

      </div>


      {/* CHART */}

      <div className="productivity-chart">
        {/* Productivity summary and chart area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

        <div className="chart-scale">
          {/* Chart section that visually represents data. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

          {scaleMarks.map(
            (mark) => (

              <span key={mark}>
                {formatHours(mark)}
              </span>

            )
          )}

        </div>


        <div className="chart-area">
          {/* Chart section that visually represents data. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

          <div className="chart-lines">
            {/* Chart section that visually represents data. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>

          </div>


          <div className="chart-bars">
            {/* Chart section that visually represents data. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

            {graphData.map(
              (day) => {

                const height =
                  day.hours === 0
                    ? 0
                    :
                    Math.max(
                      6,
                      (
                        day.hours /
                        maxHours
                      ) * 100
                    );


                const isToday =
                  day.date ===
                  today &&
                  week ===
                    "This Week";


                return (

                  <div
                    className="chart-day"
                    key={
                      day.date
                    }
                  >

                    <div className="bar-container">

                      <div
                        className={
                          isToday
                            ? "focus-bar today"
                            : "focus-bar"
                        }
                        style={{
                          height:
                            `${height}%`
                        }}
                        title={
                          `${day.name}: ` +
                          `${day.hours.toFixed(1)}h`
                        }
                      ></div>

                    </div>


                    <span
                      className={
                        isToday
                          ? "chart-label today"
                          : "chart-label"
                      }
                    >
                      {day.name}
                    </span>

                  </div>
                );

              }
            )}

          </div>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="productivity-summary">
        {/* Productivity summary and chart area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

        <div className="summary-box">
          {/* Summary section that presents calculated or stored information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

          <div className="summary-icon time">
            {/* Summary section that presents calculated or stored information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <ClockIcon />
          </div>

          <div className="summary-text">
            {/* Summary section that presents calculated or stored information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

            <span>
              Total Focus Time
            </span>

            <strong>
              {totalHours.toFixed(1)}h
            </strong>

            <small>
              {week}
            </small>

          </div>

        </div>


        <div className="summary-box">
          {/* Summary section that presents calculated or stored information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

          <div className="summary-icon tasks">
            {/* Task-management area where tasks can be created, filtered, edited, and completed. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}
            <CheckIcon />
          </div>

          <div className="summary-text">
            {/* Summary section that presents calculated or stored information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

            <span>
              Tasks Completed
            </span>

            <strong>
              {completedTasks} / {tasks.length}
            </strong>

            <small>
              {taskCompletion}% completed
            </small>

          </div>

        </div>


        <div className="summary-box">
          {/* Summary section that presents calculated or stored information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

          <div className="summary-icon sessions">
            {/* Recent focus-session history area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <FlameIcon />
          </div>

          <div className="summary-text">
            {/* Summary section that presents calculated or stored information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

            <span>
              Focus Sessions
            </span>

            <strong>
              {totalSessions}
            </strong>

            <small>
              {week}
            </small>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ProductivityOverview;
