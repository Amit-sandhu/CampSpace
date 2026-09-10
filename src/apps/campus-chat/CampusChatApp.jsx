/*
 * BEGINNER GUIDE: src/apps/campus-chat/CampusChatApp.jsx
 * This React file defines the CampusChatApp component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

// BEGINNER: CampusChatApp()
// This component/function is responsible for the CampusChatApp part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function CampusChatApp() {

  return (



      <section className="mainpage-window mainpage-window--chat mainpage-window--hidden" data-mainpage-window="" data-app="chat" style={{'--mainpage-x': "1010px", '--mainpage-y': "460px", '--mainpage-w': "360px"}}>
        {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

        <header className="mainpage-window-bar" data-mainpage-drag-handle="">
          {/* Semantic header that identifies the top part of this ui section. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

          <div className="mainpage-traffic-lights">
            {/* Window control buttons for close, minimize, and maximize. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

            <button className="mainpage-tl mainpage-tl--red" data-mainpage-action="close" aria-label="Close"></button>

            <button className="mainpage-tl mainpage-tl--yellow" data-mainpage-action="minimize" aria-label="Minimize"></button>

            <button className="mainpage-tl mainpage-tl--green" data-mainpage-action="maximize" aria-label="Maximize"></button>

          </div>

          <h2 className="mainpage-window-title">

            Campus Chat

          </h2>

        </header>

        <div className="mainpage-window-body mainpage-chat-body">
          {/* Campus chat interface containing messages and the message input. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

          <p className="mainpage-chat-hint">

            Public board for notes & info — synced across tabs open on this device.

          </p>

          <div className="mainpage-chat-messages" id="mainpage-chat-messages"></div>
            {/* Campus chat interface containing messages and the message input. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

          <div className="mainpage-chat-input-row">
            {/* Campus chat interface containing messages and the message input. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

            <input type="text" id="mainpage-chat-input" placeholder="Share a note..." autoComplete="off" maxLength="500" />

            <button id="mainpage-chat-send" type="button" aria-label="Send">

              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">

                <line x1="22" y1="2" x2="11" y2="13"></line>

                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>

              </svg>

            </button>

          </div>

        </div>

      </section>

  );

}
