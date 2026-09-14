import { useState } from 'react';

export default function ClassSessionApp() {
  var [view, setView] = useState('idle');
  var [sessionCode, setSessionCode] = useState('------');
  var [joinInput, setJoinInput] = useState('');

  function handleStartSession() {
    var randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(randomCode);
    setView('teacher');
  }

  function handleJoinSession(e) {
    e.preventDefault();
    if (joinInput.trim().length > 0) {
      setSessionCode(joinInput.trim().toUpperCase());
      setView('student');
    }
  }

  function handleReset() {
    setView('idle');
    setSessionCode('------');
    setJoinInput('');
  }

  return (
    <section className="mainpage-window mainpage-window--session mainpage-window--hidden" data-mainpage-window="" data-app="session" style={{'--mainpage-x': "1010px", '--mainpage-y': "90px", '--mainpage-w': "340px"}}>
      <header className="mainpage-window-bar" data-mainpage-drag-handle="">
        <div className="mainpage-traffic-lights">
          <button className="mainpage-tl mainpage-tl--red" data-mainpage-action="close" aria-label="Close"></button>
          <button className="mainpage-tl mainpage-tl--yellow" data-mainpage-action="minimize" aria-label="Minimize"></button>
          <button className="mainpage-tl mainpage-tl--green" data-mainpage-action="maximize" aria-label="Maximize"></button>
        </div>
        <h2 className="mainpage-window-title">
          Class Session
        </h2>
      </header>
      <div className="mainpage-window-body mainpage-session-body">
        
        {/* IDLE PANEL */}
        <div className={`mainpage-session-panel ${view !== 'idle' ? 'mainpage-session-panel--hidden' : ''}`}>
          <p className="mainpage-session-lead">
            Start a session as a teacher, or join one a teacher already started.
          </p>
          <button 
            className="mainpage-btn mainpage-btn--primary mainpage-session-full-btn" 
            type="button"
            onClick={handleStartSession}
          >
            Start a session
          </button>
          <div className="mainpage-session-divider">
            or
          </div>
          <form className="mainpage-session-join-row" onSubmit={handleJoinSession}>
            <input 
              type="text" 
              placeholder="Enter session code" 
              maxLength="6" 
              autoComplete="off" 
              value={joinInput}
              onChange={function(e) { setJoinInput(e.target.value); }}
            />
            <button className="mainpage-btn mainpage-btn--ghost" type="submit">
              Join
            </button>
          </form>
          <p className="mainpage-session-note"></p>
        </div>

        {/* TEACHER PANEL */}
        <div className={`mainpage-session-panel ${view !== 'teacher' ? 'mainpage-session-panel--hidden' : ''}`}>
          <div className="mainpage-session-code-card">
            <span>
              Session code
            </span>
            <strong>
              {sessionCode}
            </strong>
          </div>
          <p className="mainpage-session-lead">
            Students who join can see this code is active. This shows which CampSpace app each of them currently has open — not anything outside CampSpace.
          </p>
          <div className="mainpage-session-roster">
            <p className="mainpage-session-roster-empty">
              No students have joined yet.
            </p>
          </div>
          <button 
            className="mainpage-btn mainpage-btn--ghost mainpage-session-full-btn" 
            type="button"
            onClick={handleReset}
          >
            End session
          </button>
        </div>

        {/* STUDENT PANEL */}
        <div className={`mainpage-session-panel ${view !== 'student' ? 'mainpage-session-panel--hidden' : ''}`}>
          <div className="mainpage-session-code-card">
            <span>
              Joined session
            </span>
            <strong>
              {sessionCode}
            </strong>
          </div>
          <p className="mainpage-session-lead">
            Your teacher can see which CampSpace app you currently have open while this session is active.
          </p>
          <button 
            className="mainpage-btn mainpage-btn--ghost mainpage-session-full-btn" 
            type="button"
            onClick={handleReset}
          >
            Leave session
          </button>
        </div>

      </div>
    </section>
  );
}