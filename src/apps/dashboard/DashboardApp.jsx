/*
 * BEGINNER GUIDE: src/apps/dashboard/DashboardApp.jsx
 * This React file defines the DashboardApp component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

// BEGINNER: DashboardApp()
// This component/function is responsible for the DashboardApp part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function DashboardApp() {
  return (

      <section className="mainpage-window mainpage-window--dashboard" data-mainpage-window="" data-app="dashboard" style={{'--mainpage-x': "120px", '--mainpage-y': "100px", '--mainpage-w': "560px"}}>
        {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <header className="mainpage-window-bar" data-mainpage-drag-handle="">
          {/* Semantic header that identifies the top part of this ui section. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <div className="mainpage-traffic-lights">
            {/* Window control buttons for close, minimize, and maximize. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <button className="mainpage-tl mainpage-tl--red" data-mainpage-action="close" aria-label="Close"></button>
            <button className="mainpage-tl mainpage-tl--yellow" data-mainpage-action="minimize" aria-label="Minimize"></button>
            <button className="mainpage-tl mainpage-tl--green" data-mainpage-action="maximize" aria-label="Maximize"></button>
          </div>
          <h2 className="mainpage-window-title">
            Dashboard
          </h2>
        </header>
        <div className="mainpage-window-body mainpage-dashboard-body">
          {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <div className="mainpage-dashboard-welcome">
            {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <div>
              <p className="mainpage-dashboard-date" id="mainpage-dashboard-date">
                Today
              </p>
              <h3>
                Welcome back, Student!
              </h3>
              <span>
                Here is a quick look at your campus day.
              </span>
            </div>
            <div className="mainpage-dashboard-actions">
              {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <button type="button" data-mainpage-dashboard-open="notepad">
                New note
              </button>
              <button type="button" data-mainpage-dashboard-open="calendar">
                Calendar
              </button>
            </div>
          </div>
          <div className="mainpage-stat-row mainpage-dashboard-stats">
            {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <div className="mainpage-stat">
              {/* Summary statistics displayed as small dashboard cards. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <span className="mainpage-stat-label">
                Tasks due
              </span>
              <strong className="mainpage-stat-value">
                3
              </strong>
              <span className="mainpage-stat-delta mainpage-stat-delta--up">
                This week
              </span>
            </div>
            <div className="mainpage-stat">
              {/* Summary statistics displayed as small dashboard cards. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <span className="mainpage-stat-label">
                Upcoming events
              </span>
              <strong className="mainpage-stat-value">
                2
              </strong>
              <span className="mainpage-stat-delta">
                Next 7 days
              </span>
            </div>
            <div className="mainpage-stat">
              {/* Summary statistics displayed as small dashboard cards. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <span className="mainpage-stat-label">
                Course progress
              </span>
              <strong className="mainpage-stat-value">
                68
                <small>
                  %
                </small>
              </strong>
              <span className="mainpage-stat-delta mainpage-stat-delta--up">
                On track
              </span>
            </div>
          </div>
          <div className="mainpage-dashboard-grid">
            {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <section className="mainpage-dashboard-card">
              {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <div className="mainpage-dashboard-card-heading">
                {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
                <h4>
                  Tasks due soon
                </h4>
                <button type="button" data-mainpage-dashboard-open="notepad">
                  View notes
                </button>
              </div>
              <label className="mainpage-dashboard-task">
                <input type="checkbox" />
                <span></span>
                <b>
                  Finish DBMS assignment
                </b>
                <small>
                  Due today
                </small>
              </label>
              <label className="mainpage-dashboard-task">
                <input type="checkbox" />
                <span></span>
                <b>
                  Review operating systems
                </b>
                <small>
                  Tomorrow
                </small>
              </label>
              <label className="mainpage-dashboard-task">
                <input type="checkbox" />
                <span></span>
                <b>
                  Prepare project presentation
                </b>
                <small>
                  Friday
                </small>
              </label>
            </section>
            <section className="mainpage-dashboard-card">
              {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <div className="mainpage-dashboard-card-heading">
                {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
                <h4>
                  Upcoming schedule
                </h4>
                <button type="button" data-mainpage-dashboard-open="calendar">
                  Open
                </button>
              </div>
              <div className="mainpage-dashboard-event">
                {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
                <i className="mainpage-upcoming-dot mainpage-upcoming-dot--blue"></i>
                <div>
                  <b>
                    Web Development class
                  </b>
                  <span>
                    Today · 2:00 PM
                  </span>
                </div>
              </div>
              <div className="mainpage-dashboard-event">
                {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
                <i className="mainpage-upcoming-dot mainpage-upcoming-dot--purple"></i>
                <div>
                  <b>
                    Project team meeting
                  </b>
                  <span>
                    Wednesday · 4:30 PM
                  </span>
                </div>
              </div>
              <div className="mainpage-dashboard-event">
                {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
                <i className="mainpage-upcoming-dot mainpage-upcoming-dot--orange"></i>
                <div>
                  <b>
                    DBMS assignment
                  </b>
                  <span>
                    Friday · 11:59 PM
                  </span>
                </div>
              </div>
            </section>
            <section className="mainpage-dashboard-card mainpage-dashboard-card--wide">
              {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <div className="mainpage-dashboard-card-heading">
                {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
                <h4>
                  Recent activity
                </h4>
                <span>
                  Today
                </span>
              </div>
              <div className="mainpage-dashboard-activity">
                {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
                <b>
                  Notes
                </b>
                <span>
                  Updated your “DBMS revision” note
                </span>
                <time>
                  10 min ago
                </time>
              </div>
              <div className="mainpage-dashboard-activity">
                {/* Dashboard area showing the student summary, tasks, schedule, and recent activity. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
                <b>
                  Calendar
                </b>
                <span>
                  Added Web Development class
                </span>
                <time>
                  1 hr ago
                </time>
              </div>
            </section>
          </div>
        </div>
      </section>
  );
}
