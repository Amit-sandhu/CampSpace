/*
 * BEGINNER GUIDE: src/apps/focus/components/focus/StatCard.jsx
 * This React file defines the StatCard component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import "./StatCard.css";


// BEGINNER: StatCard()
// This component/function is responsible for the StatCard part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function StatCard({
  title,
  value,
  subtitle,
  progress,
  trend,
  icon,
  accent
}) {

  return (
    <div
      className={
        `stat-card ${accent}`
      }
    >

      <div className="stat-icon">
        {/* Summary statistics displayed as small dashboard cards. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        {icon}
      </div>

      <div className="stat-content">
        {/* Summary statistics displayed as small dashboard cards. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

        <h3>
          {title}
        </h3>

        <strong>
          {value}
        </strong>

        {progress !== undefined && (
          <div className="stat-progress">
            {/* Summary statistics displayed as small dashboard cards. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <div className="stat-progress-track">
              {/* Summary statistics displayed as small dashboard cards. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <div
                className="stat-progress-fill"
                style={{
                  width:
                    `${progress}%`
                }}
              ></div>
            </div>
            <span>
              {progress}%
            </span>
          </div>
        )}

        {trend && (
          <div
            className={
              `stat-trend ${trend.direction}`
            }
          >
            <span className="stat-trend-arrow">
              {trend.direction === "up"
                ? "↑"
                : trend.direction === "down"
                  ? "↓"
                  : "→"
              }
            </span>

            <span>
              {trend.text}
            </span>
          </div>
        )}

        {subtitle && !trend && (
          <p>
            {subtitle}
          </p>
        )}

      </div>

    </div>
  );
}

export default StatCard;
