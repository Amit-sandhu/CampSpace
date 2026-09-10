/*
 * BEGINNER GUIDE: src/apps/notepad/NotepadApp.jsx
 * This React file defines the NotepadApp component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

// BEGINNER: NotepadApp()
// This component/function is responsible for the NotepadApp part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function NotepadApp() {
  return (

      <section className="mainpage-window mainpage-window--notepad mainpage-window--hidden" data-mainpage-window="" data-app="notepad" style={{'--mainpage-x': "1010px", '--mainpage-y': "100px", '--mainpage-w': "380px"}}>
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
            Notepad
          </h2>
          <button className="mainpage-window-action mainpage-window-action--icon" id="mainpage-notepad-clear">
            Clear
          </button>
        </header>
        <div className="mainpage-window-body mainpage-notepad-body">
          <textarea className="mainpage-notepad-textarea" id="mainpage-notepad-textarea" placeholder="Start typing..." spellCheck="false"></textarea>
          <div className="mainpage-notepad-footer">
            <span id="mainpage-notepad-count">
              0 words · 0 characters
            </span>
            <span id="mainpage-notepad-status">
              Saved
            </span>
          </div>
        </div>
      </section>
  );
}
