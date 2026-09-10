/*
 * BEGINNER GUIDE: src/App.jsx
 * This React file defines the App component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage.jsx';
import WorkspacePage from './pages/WorkspacePage.jsx';
import WorkspaceToolPage from './pages/WorkspaceToolPage.jsx';
import FocusApp from './apps/focus/FocusApp.jsx';
import CamiAI from './apps/cami/CamiAI.jsx';
import FeeSyllabusPage, { SyllabusTopic } from './fee-syllabus/FeeSyllabusPage.jsx';
import Sidebar, { getLastRoute, rememberRoute } from './apps/sidebar/Sidebar.jsx';

const WORKSPACE_ROUTES = ['/dashboard', '/focus', '/cami'];

// BEGINNER: hasSession()
// This component/function is responsible for the hasSession part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function hasSession() {
  try {
    return Boolean(localStorage.getItem('campspace_session'));
  } catch {
    return false;
  }
}

function getInitialPath() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('page') === 'login') return '/login';
  if (params.get('page') === 'workspace') return getLastRoute();
  if (WORKSPACE_ROUTES.includes(window.location.pathname)) return window.location.pathname;
  return hasSession() ? getLastRoute() : '/login';
}

// BEGINNER: RouteMemory()
// This component controls the RouteMemory part of the application structure.
// It connects the current route/layout with the child React components shown to the user.
// FEE topics: React components, JSX, routing, and component composition.
function RouteMemory() {
  const location = useLocation();

  useEffect(() => {
    if (WORKSPACE_ROUTES.includes(location.pathname)) {
      rememberRoute(location.pathname);
      // Remember the page, not the previous scroll offset. Each route opens
      // at its own top; a reload still stays on the same route.
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        document.querySelector('.focus-layout')?.scrollTo({ top: 0, left: 0 });
      });
    }

    document.title =
      location.pathname === '/focus'
        ? 'Focus - CampSpace'
        : location.pathname === '/cami'
          ? 'Cami AI - CampSpace'
          : 'CampSpace';
  }, [location.pathname]);

  return null;
}

// BEGINNER: WorkspaceLayout()
// This component controls the WorkspaceLayout part of the application structure.
// It connects the current route/layout with the child React components shown to the user.
// FEE topics: React components, JSX, routing, and component composition.
function WorkspaceLayout() {
  return (
    <div className="campspace-route-shell">
      <Sidebar />
      <main className="campspace-route-content">
        {/* Main semantic container for the primary page content. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <Outlet />
      </main>
    </div>
  );
}

// BEGINNER: ProtectedWorkspace()
// This component controls the ProtectedWorkspace part of the application structure.
// It connects the current route/layout with the child React components shown to the user.
// FEE topics: React components, JSX, routing, and component composition.
function ProtectedWorkspace() {
  if (!hasSession()) {
    return <Navigate to="/login" replace />;
  }
  return <WorkspaceLayout />;
}

function RouterApp() {
  const initialPath = getInitialPath();

  return (
    <BrowserRouter>
      <RouteMemory />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedWorkspace />}>
          <Route path="/dashboard" element={<WorkspacePage />} />
          {/* Compatibility routes for Focus Quick Tools. */}
          <Route path="/workspace/:tool" element={<WorkspaceToolPage />} />
          <Route path="/focus" element={<FocusApp />} />
          <Route path="/cami" element={<CamiAI />} />
          {/* FEE syllabus lab: isolated practice route; existing CampSpace pages are unchanged. */}
          <Route path="/fee-syllabus" element={<FeeSyllabusPage />}>
            <Route path=":topic" element={<SyllabusTopic />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to={initialPath} replace />} />
        <Route path="*" element={<Navigate to={hasSession() ? getLastRoute() : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// BEGINNER: App()
// This is the React entry component for the application or router.
// It decides which page/component React should render for the current route.
// FEE topics: React components, JSX, React Router, and component composition.
export default function App() {
  return <RouterApp />;
}
