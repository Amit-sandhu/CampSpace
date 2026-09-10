/*
 * BEGINNER GUIDE: src/apps/chalkpad/ChalkpadWindow.jsx
 * This React file defines the ChalkpadWindow component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import ChalkpadApp from './ChalkpadContent.jsx';

// BEGINNER: ChalkpadWindow()
// This component/function is responsible for the ChalkpadWindow part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function ChalkpadWindow() {
  return (

      <section className="mainpage-window mainpage-window--chalkpad mainpage-window--hidden" data-mainpage-window="" data-app="chalkpad" style={{'--mainpage-x': "300px", '--mainpage-y': "90px", '--mainpage-w': "720px"}}>
        {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <header className="mainpage-window-bar" data-mainpage-drag-handle="">
          {/* Semantic header that identifies the top part of this ui section. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <div className="mainpage-traffic-lights">
            {/* Window control buttons for close, minimize, and maximize. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <button className="mainpage-tl mainpage-tl--red" data-mainpage-action="close" aria-label="Close"></button>
            <button className="mainpage-tl mainpage-tl--yellow" data-mainpage-action="minimize" aria-label="Minimize"></button>
            <button className="mainpage-tl mainpage-tl--green" data-mainpage-action="maximize" aria-label="Maximize"></button>
          </div>
          <h2 className="mainpage-window-title">Chalkpad</h2>
        </header>
        <div className="mainpage-window-body mainpage-chalkpad-body">
          {/* Chalkpad interface section for student academic information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <ChalkpadApp />
        </div>
      </section>
  );
}
