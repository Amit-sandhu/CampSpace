/*
 * BEGINNER GUIDE: src/apps/focus/components/layout/Topbar.jsx
 * This React file defines the Topbar component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Topbar.css';
import FocusDashboardContext from '../focus/FocusDashboardContext.jsx';
import { setSearchTerm } from '../focus/focusUiStore.js';
import { getDateString } from '../../utils/dateHelpers.js';

// BEGINNER: Topbar()
// This component/function is responsible for the Topbar part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function Topbar({ date = new Date(), title = "Focus & Productivity" }) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.focusUi.searchTerm);
  const dashboard = useContext(FocusDashboardContext) || {};
  const { tasks = [], sessions = [], demoMode = false, demoDate } = dashboard;
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const todayDate = demoMode && demoDate ? demoDate : new Date();
  const today = getDateString(todayDate);
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const todaySessions = sessions.filter(
    (session) => session.date === today && session.recent !== false
  ).length;

  return (
    <header className="campspace-topbar">
      {/* Semantic header that identifies the top part of this ui section. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
      <div className="topbar-left">
        {/* Top navigation bar containing the page title and user controls. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <h2 className="topbar-title">{title}</h2>
        <span className="topbar-divider">|</span>
        <span className="topbar-date">{formattedDate}</span>
      </div>

      <div className="topbar-right">
        {/* Top navigation bar containing the page title and user controls. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        {/* Search Input */}
        <div className="topbar-search">
          {/* Top navigation bar containing the page title and user controls. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            aria-label="Search tasks"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(event) => dispatch(setSearchTerm(event.target.value))}
          />
        </div>

        {/* Focus activity summary */}
        <div className="topbar-notifications-wrap">
          <button
            type="button"
            className="topbar-icon-btn"
            title="Focus notifications"
            aria-label="Focus notifications"
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen((open) => !open)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          {notificationsOpen && (
            <div className="topbar-notifications-popover" role="status">
              <strong>Focus summary</strong>
              <p>{pendingTasks} {pendingTasks === 1 ? 'task remains' : 'tasks remain'} incomplete.</p>
              <p>{todaySessions} {todaySessions === 1 ? 'focus session' : 'focus sessions'} recorded today.</p>
            </div>
          )}
        </div>

        {/* User Profile Capsule */}
        <div className="topbar-user-profile">
          {/* Top navigation bar containing the page title and user controls. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <div className="avatar">CS</div>
          <div className="user-info">
            {/* User/profile area displaying account information or controls. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <span className="user-name">Student</span>
            <span className="user-role">College Student</span>
          </div>
        </div>
      </div>
    </header>
  );
}
