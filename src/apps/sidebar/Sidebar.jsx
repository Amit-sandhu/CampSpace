/*
 * BEGINNER GUIDE: src/apps/sidebar/Sidebar.jsx
 * This React file defines the Sidebar component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

export const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: '⣿' },
  { id: 'focus', label: 'Focus', path: '/focus', icon: '◎' },
  { id: 'cami', label: 'Cami AI', path: '/cami', icon: '✦' },
];

const LAST_ROUTE_KEY = 'campspace_last_route';

export function rememberRoute(path) {
  if (SIDEBAR_ITEMS.some((item) => item.path === path)) {
    localStorage.setItem(LAST_ROUTE_KEY, path);
  }
}

export function getLastRoute() {
  try {
    const saved = localStorage.getItem(LAST_ROUTE_KEY);
    return SIDEBAR_ITEMS.some((item) => item.path === saved) ? saved : '/dashboard';
  } catch {
    return '/dashboard';
  }
}

// BEGINNER: Sidebar()
// This component/function is responsible for the Sidebar part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('campspace-sidebar-open', open);
    return () => document.body.classList.remove('campspace-sidebar-open');
  }, [open]);

  useEffect(() => {
    // BEGINNER: onKeyDown()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function goTo(path) {
    rememberRoute(path);
    navigate(path);
    setOpen(false);
  }

  // BEGINNER: logout()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function logout() {
    if (window.CampSpaceAuth?.clearSession) {
      window.CampSpaceAuth.clearSession();
    } else {
      localStorage.removeItem('campspace_session');
    }
    localStorage.removeItem(LAST_ROUTE_KEY);
    window.location.href = '/?page=login';
  }

  return (
    <>
      <button
        className={`campspace-sidebar-menu-button ${open ? 'is-open' : ''}`}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Hide navigation' : 'Show navigation'}
        aria-expanded={open}
        title={open ? 'Hide navigation' : 'Show navigation'}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </button>

      <div
        className={`campspace-sidebar-backdrop ${open ? 'is-visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside className={`campspace-sidebar ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        {/* Secondary sidebar/aside content that supports the main page. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <div className="campspace-sidebar-brand">
          {/* Sidebar navigation used to move between campspace applications. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <div className="campspace-sidebar-logo">C</div>
            {/* Sidebar navigation used to move between campspace applications. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <span>CampSpace</span>
        </div>

        <nav className="campspace-sidebar-nav" aria-label="CampSpace navigation">
          {/* Navigation area containing links or controls for moving around the app. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          {SIDEBAR_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.id}
                type="button"
                className={`campspace-sidebar-item ${active ? 'active' : ''}`}
                onClick={() => goTo(item.path)}
                tabIndex={open ? 0 : -1}
              >
                <span className="campspace-sidebar-icon">{item.icon}</span>
                <span className="campspace-sidebar-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar navigation used to move between campspace applications. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <div className="campspace-sidebar-spacer" />

        <button
          type="button"
          className="campspace-sidebar-item campspace-sidebar-logout"
          onClick={logout}
          tabIndex={open ? 0 : -1}
        >
          <span className="campspace-sidebar-icon">↪</span>
          <span className="campspace-sidebar-label">Logout</span>
        </button>
      </aside>
    </>
  );
}
