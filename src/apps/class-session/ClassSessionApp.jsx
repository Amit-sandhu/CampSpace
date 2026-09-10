/*
 * BEGINNER GUIDE: src/apps/class-session/ClassSessionApp.jsx
 * This React file defines the ClassSessionApp component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

// BEGINNER: ClassSessionApp()
// This component/function is responsible for the ClassSessionApp part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function ClassSessionApp() {
  return (

      <section className="mainpage-window mainpage-window--session mainpage-window--hidden" data-mainpage-window="" data-app="session" style={{'--mainpage-x': "1010px", '--mainpage-y': "90px", '--mainpage-w': "340px"}}>
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
            Class Session
          </h2>
        </header>
        <div className="mainpage-window-body mainpage-session-body">
          <div className="mainpage-session-panel" id="mainpage-session-idle">
            <p className="mainpage-session-lead">
              Start a session as a teacher, or join one a teacher already started.
            </p>
            <button className="mainpage-btn mainpage-btn--primary mainpage-session-full-btn" id="mainpage-session-start-btn" type="button">
              Start a session
            </button>
            <div className="mainpage-session-divider">
              or
            </div>
            <div className="mainpage-session-join-row">
              <input type="text" id="mainpage-session-code-input" placeholder="Enter session code" maxLength="6" autoComplete="off" />
              <button className="mainpage-btn mainpage-btn--ghost" id="mainpage-session-join-btn" type="button">
                Join
              </button>
            </div>
            <p className="mainpage-session-note" id="mainpage-session-idle-note"></p>
          </div>
          <div className="mainpage-session-panel mainpage-session-panel--hidden" id="mainpage-session-teacher">
            <div className="mainpage-session-code-card">
              {/* Content card that groups one related set of information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <span>
                Session code
              </span>
              <strong id="mainpage-session-code-display">
                ------
              </strong>
            </div>
            <p className="mainpage-session-lead">
              Students who join can see this code is active. This shows which CampSpace app each of them currently has open — not anything outside CampSpace.
            </p>
            <div className="mainpage-session-roster" id="mainpage-session-roster">
              <p className="mainpage-session-roster-empty">
                No students have joined yet.
              </p>
            </div>
            <button className="mainpage-btn mainpage-btn--ghost mainpage-session-full-btn" id="mainpage-session-end-btn" type="button">
              End session
            </button>
          </div>
          <div className="mainpage-session-panel mainpage-session-panel--hidden" id="mainpage-session-student">
            <div className="mainpage-session-code-card">
              {/* Content card that groups one related set of information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <span>
                Joined session
              </span>
              <strong id="mainpage-session-joined-code-display">
                ------
              </strong>
            </div>
            <p className="mainpage-session-lead">
              Your teacher can see which CampSpace app you currently have open while this session is active.
            </p>
            <button className="mainpage-btn mainpage-btn--ghost mainpage-session-full-btn" id="mainpage-session-leave-btn" type="button">
              Leave session
            </button>
          </div>
        </div>
      </section>
  );
}
