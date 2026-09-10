/*
 * BEGINNER GUIDE: src/apps/focus/components/focus/RecentSessions.jsx
 * This React file defines the RecentSessions component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import { useState } from "react";

import {
  ClockIcon,
  FileTextIcon,
  BarChart3Icon,
  FolderIcon,
  BookOpenIcon,
  CodeIcon,
  CheckIcon
} from "../common/Icons";

import "./RecentSessions.css";


const SESSION_ICONS = {
  Academic: BookOpenIcon,
  Study: BarChart3Icon,
  Project: FolderIcon,
  Learning: CodeIcon,
  Personal: FileTextIcon
};

const DEFAULT_ICON = CheckIcon;

const VISIBLE_LIMIT = 5;


/* =========================================================
   VISUAL ICON CHOICE
   Task-specific where possible; type-based fallback remains.
   Session data/logic is unchanged.
========================================================= */

// BEGINNER: getSessionIcon()
// This component/function is responsible for the getSessionIcon part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function getSessionIcon(task, type) {

  const taskName =
    String(task || "").toLowerCase();


  if (taskName.includes("fee")) {
    return FileTextIcon;
  }

  if (taskName.includes("dsa")) {
    return BarChart3Icon;
  }

  if (taskName.includes("research")) {
    return BookOpenIcon;
  }

  if (taskName.includes("web")) {
    return CodeIcon;
  }

  if (taskName.includes("reading")) {
    return BookOpenIcon;
  }

  return SESSION_ICONS[type] || DEFAULT_ICON;
}


// BEGINNER: RecentSessions()
// This component/function is responsible for the RecentSessions part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function RecentSessions({
  sessions = []
}) {

  const [showAll, setShowAll] =
    useState(false);


  const visibleSessions =
    showAll
      ? sessions
      : sessions.slice(0, VISIBLE_LIMIT);


  const hasMore =
    sessions.length > VISIBLE_LIMIT;


  return (
    <section className="sessions-card">
      {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

      <div className="sessions-header">
        {/* Recent focus-session history area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

        <div className="sessions-title">
          {/* Recent focus-session history area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

          <span>
            <ClockIcon />
          </span>

          <div>
            <h2>
              Recent Focus Sessions
            </h2>

            <p>
              Your completed focus sessions
            </p>
          </div>

        </div>


        {hasMore && (

          <button
            type="button"
            className="sessions-view-all"
            onClick={() =>
              setShowAll(
                (previous) => !previous
              )
            }
          >
            {showAll ? "Show Less" : "View All"} →
          </button>

        )}

      </div>


      <div className="sessions-list">
        {/* Recent focus-session history area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

        {sessions.length === 0 ? (

          <div className="sessions-empty">
            {/* Recent focus-session history area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

            <div>
              <ClockIcon />
            </div>

            <strong>
              No focus sessions yet.
            </strong>

            <span>
              Complete a timer session
              to see it here.
            </span>

          </div>

        ) : (

          visibleSessions.map(
            (session) => {

              const SessionIcon =
                getSessionIcon(
                  session.task,
                  session.type
                );


              return (

                <div
                  className="session-row"
                  key={session.id}
                >

                  <div
                    className={
                      `session-icon ${
                        session.type
                          ? session.type.toLowerCase()
                          : ""
                      }`
                    }
                  >
                    <SessionIcon />
                  </div>


                  <div className="session-details">

                    <strong>
                      {session.task}
                    </strong>

                    <span>
                      {session.type}
                    </span>

                  </div>


                  <div className="session-duration">

                    <strong>
                      {session.duration}
                    </strong>

                    <span>
                      min
                    </span>

                  </div>


                  <div className="session-time">
                    {session.completedAt}
                  </div>

                </div>
              );
            }
          )
        )}

      </div>

    </section>
  );
}

export default RecentSessions;
