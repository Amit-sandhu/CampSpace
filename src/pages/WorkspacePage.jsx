/*
 * BEGINNER GUIDE: src/pages/WorkspacePage.jsx
 * This React file defines the WorkspacePage component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import { useEffect } from 'react';
import './workspace.css';
import { runAuthScript } from '../lib/auth.js';
import { runMainPageScript } from '../lib/main.js';
import {
  DashboardApp,
  CalendarApp,
  NotepadApp,
  CalculatorApp,
  CodeEditorApp,
  AIChatApp,
  CampusChatApp,
  ClassSessionApp,
  ChalkpadWindow,
} from '../apps/index.js';

// BEGINNER: WorkspaceDashboard()
// This component controls the WorkspaceDashboard part of the application structure.
// It connects the current route/layout with the child React components shown to the user.
// FEE topics: React components, JSX, routing, and component composition.
function WorkspaceDashboard() {
  useEffect(() => {
    document.body.className = 'mainpage-body'
    runAuthScript();
    runMainPageScript();
    return () => { document.body.className = ''; }
  }, []);

  return (
    <div className="mainpage-app-root">
  <header className="mainpage-nav">
    {/* Semantic header that identifies the top part of this ui section. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
    <div className="mainpage-nav-left">
      <div className="mainpage-logo">
        <svg className="mainpage-logo-mark" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 19c1.2 1.6 3.4 2.5 6 2.5s4.8-.9 6-2.5" stroke="#FAFAFB" strokeWidth="1.8" strokeLinecap="round" fill="none"></path>
        </svg>
        <span className="mainpage-logo-text">
          CampSpace
        </span>
      </div>
      <button className="mainpage-kbd-hint" type="button" aria-hidden="true">
        ⌘ K
      </button>
    </div>
    <div className="mainpage-nav-center">
      <button className="mainpage-search-trigger" id="mainpage-search-trigger" type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span className="mainpage-search-placeholder">
          Search CampSpace...
        </span>
        <span className="mainpage-search-kbd">
          ⌘ K
        </span>
      </button>
    </div>
    <div className="mainpage-nav-right">
      <button className="mainpage-btn mainpage-btn--ghost" id="mainpage-auto-arrange" type="button">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l1.8 5.6L19 9l-5.2 1.4L12 16l-1.8-5.6L5 9l5.2-1.4L12 2z"></path>
        </svg>
        
        Auto-arrange
      
      </button>
      <div className="mainpage-layouts" id="mainpage-layouts">
        <button className="mainpage-btn mainpage-btn--ghost" id="mainpage-layouts-btn" type="button" aria-haspopup="true" aria-expanded="false">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="18" rx="1.5"></rect>
            <rect x="14" y="3" width="7" height="8" rx="1.5"></rect>
            <rect x="14" y="15" width="7" height="6" rx="1.5"></rect>
          </svg>
          
          Layouts
        
        </button>
        <div className="mainpage-layouts-menu" id="mainpage-layouts-menu" role="menu">
          <div className="mainpage-layouts-save-row">
            <input type="text" id="mainpage-layout-name-input" placeholder="Layout name..." maxLength="30" autoComplete="off" />
            <button className="mainpage-layouts-save-btn" id="mainpage-layout-save-btn" type="button" aria-label="Save current layout">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <div className="mainpage-layouts-list" id="mainpage-layouts-list">
            <div className="mainpage-layouts-empty" id="mainpage-layouts-empty">
              No saved layouts yet
            </div>
          </div>
        </div>
      </div>
      <button className="mainpage-btn mainpage-btn--primary" id="mainpage-new-btn" type="button">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        
        New
      
      </button>
      <button className="mainpage-icon-btn" id="mainpage-theme-toggle" type="button" aria-label="Toggle dark mode">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" id="mainpage-theme-icon">
          <circle cx="12" cy="12" r="4"></circle>
          <line x1="12" y1="2" x2="12" y2="4"></line>
          <line x1="12" y1="20" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line>
          <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="4" y2="12"></line>
          <line x1="20" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line>
          <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>
        </svg>
      </button>
      <button className="mainpage-icon-btn" id="mainpage-notif-btn" type="button" aria-label="Notifications">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span className="mainpage-notif-dot"></span>
      </button>
      <div className="mainpage-account" id="mainpage-account">
        <button className="mainpage-avatar" id="mainpage-avatar-btn" type="button" aria-label="Profile" aria-haspopup="true" aria-expanded="false">
          AR
        </button>
        <div className="mainpage-account-menu" id="mainpage-account-menu" role="menu">
          <div className="mainpage-account-menu-header">
            <span className="mainpage-account-menu-name" id="mainpage-account-name">
              —
            </span>
            <span className="mainpage-account-menu-email" id="mainpage-account-email">
              —
            </span>
          </div>
          <button className="mainpage-account-menu-item" id="mainpage-logout-btn" type="button" role="menuitem">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            
            Log out
          
          </button>
          <a className="mainpage-account-menu-item" id="mainpage-signin-link" href="/?page=login" role="menuitem" style={{display: "none", textDecoration: "none"}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            
            Sign in
          
          </a>
        </div>
      </div>
    </div>
  </header>
  <main className="mainpage-canvas-viewport">
    {/* Main semantic container for the primary page content. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
    <div className="mainpage-canvas" id="mainpage-canvas">
            {/* APP WINDOWS */}
      <DashboardApp />
      <CalendarApp />
      <NotepadApp />
      <CalculatorApp />
      <CodeEditorApp />
      <AIChatApp />
      <CampusChatApp />
      <ClassSessionApp />
      <ChalkpadWindow />
    </div>
  </main>
  <nav className="mainpage-dock" aria-label="Application dock">
    {/* Navigation area containing links or controls for moving around the app. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
    <button className="mainpage-dock-item mainpage-dock-item--active" data-mainpage-dock-app="dashboard" data-mainpage-tip="Dashboard">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
        <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
        <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
        <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
      </svg>
    </button>
    <button className="mainpage-dock-item" data-mainpage-dock-app="chalkpad" data-mainpage-tip="Chalkpad">
      <span style={{fontWeight: 800, fontSize: '15px', color: '#ff7a00'}}>✓</span>
    </button>
    <button className="mainpage-dock-item" data-mainpage-dock-app="calendar" data-mainpage-tip="Calendar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </button>
    <button className="mainpage-dock-item" data-mainpage-dock-app="notepad" data-mainpage-tip="Notepad">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="8" y1="13" x2="16" y2="13"></line>
        <line x1="8" y1="17" x2="13" y2="17"></line>
      </svg>
    </button>
    <button className="mainpage-dock-item" data-mainpage-dock-app="calculator" data-mainpage-tip="Calculator">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"></rect>
        <line x1="8" y1="6" x2="16" y2="6"></line>
        <line x1="8" y1="11" x2="8" y2="11.01"></line>
        <line x1="12" y1="11" x2="12" y2="11.01"></line>
        <line x1="16" y1="11" x2="16" y2="11.01"></line>
        <line x1="8" y1="15" x2="8" y2="15.01"></line>
        <line x1="12" y1="15" x2="12" y2="15.01"></line>
        <line x1="16" y1="15" x2="16" y2="15.01"></line>
        <line x1="8" y1="19" x2="8" y2="19.01"></line>
        <line x1="12" y1="19" x2="12" y2="19.01"></line>
        <line x1="16" y1="19" x2="16" y2="19.01"></line>
      </svg>
    </button>
    <button className="mainpage-dock-item" data-mainpage-dock-app="code" data-mainpage-tip="Code Editor">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    </button>
    <button className="mainpage-dock-item" data-mainpage-dock-app="aichat" data-mainpage-tip="AI Chatbot">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5" width="16" height="12" rx="3"></rect>
        <path d="M9 21h6"></path>
        <path d="M12 17v4"></path>
        <line x1="9" y1="10" x2="9" y2="11"></line>
        <line x1="15" y1="10" x2="15" y2="11"></line>
      </svg>
    </button>
    <button className="mainpage-dock-item" data-mainpage-dock-app="chat" data-mainpage-tip="Campus Chat">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    </button>
    <button className="mainpage-dock-item" data-mainpage-dock-app="session" data-mainpage-tip="Class Session">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 7l-7 5 7 5V7z"></path>
        <rect x="1" y="5" width="15" height="14" rx="2"></rect>
      </svg>
    </button>
  </nav>
  <div className="mainpage-palette-overlay" id="mainpage-palette-overlay">
    <div className="mainpage-palette" role="dialog" aria-modal="true" aria-label="Search CampSpace">
      <div className="mainpage-palette-input-row">
        {/* Row that combines a text input with its related action button. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="mainpage-palette-input" placeholder="Search apps or commands..." autoComplete="off" />
        <span className="mainpage-palette-esc">
          ESC
        </span>
      </div>
      <div className="mainpage-palette-results" id="mainpage-palette-results">
        <span className="mainpage-palette-group-label">
          Apps
        </span>
        <button className="mainpage-palette-row" data-mainpage-palette-app="dashboard">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
          </svg>
          Dashboard
        </button>
        <button className="mainpage-palette-row" data-mainpage-palette-app="chalkpad">
          <span style={{fontWeight: 800, color: '#ff7a00'}}>✓</span>
          Chalkpad
        </button>
        <button className="mainpage-palette-row" data-mainpage-palette-app="calendar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Calendar
        </button>
        <button className="mainpage-palette-row" data-mainpage-palette-app="notepad">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          Notepad
        </button>
        <button className="mainpage-palette-row" data-mainpage-palette-app="calculator">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
          </svg>
          Calculator
        </button>
        <button className="mainpage-palette-row" data-mainpage-palette-app="code">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          Code Editor
        </button>
        <button className="mainpage-palette-row" data-mainpage-palette-app="aichat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="5" width="16" height="12" rx="3"></rect>
            <path d="M9 21h6"></path>
            <path d="M12 17v4"></path>
          </svg>
          AI Chatbot
        </button>
        <button className="mainpage-palette-row" data-mainpage-palette-app="chat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7"></path>
          </svg>
          Campus Chat
        </button>
        <button className="mainpage-palette-row" data-mainpage-palette-app="session">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="5" width="15" height="14" rx="2"></rect>
          </svg>
          Class Session
        </button>
        <span className="mainpage-palette-group-label">
          Commands
        </span>
        <button className="mainpage-palette-row" data-mainpage-palette-command="auto-arrange">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l1.8 5.6L19 9l-5.2 1.4L12 16l-1.8-5.6L5 9l5.2-1.4L12 2z"></path>
          </svg>
          Auto-arrange windows
        </button>
      </div>
    </div>
  </div>
    </div>
  );
}


// BEGINNER: WorkspacePage()
// This component controls the WorkspacePage part of the application structure.
// It connects the current route/layout with the child React components shown to the user.
// FEE topics: React components, JSX, routing, and component composition.
export default function WorkspacePage() {
  return <WorkspaceDashboard />;
}
