/*
 * Compatibility route for the Focus page's existing Quick Tools links.
 *
 * The Focus page intentionally keeps its original navigation:
 *   /workspace/notes
 *   /workspace/calendar
 *   /workspace/code
 *
 * The integrated CampSpace app uses the legacy workspace dashboard to host
 * those tools as windows. This wrapper opens the requested window after the
 * dashboard DOM and its workspace script have mounted.
 *
 * This file does not modify the Focus page or its business logic.
 */

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WorkspacePage from './WorkspacePage.jsx';

const WORKSPACE_TOOL_MAP = {
  notes: 'notepad',
  calendar: 'calendar',
  code: 'code',
};

export default function WorkspaceToolPage() {
  const { tool } = useParams();

  useEffect(() => {
    const app = WORKSPACE_TOOL_MAP[tool];
    if (!app) return undefined;

    // WorkspacePage mounts the legacy workspace behaviour in its own effect.
    // A zero-delay task lets that setup finish before we trigger the window.
    const timer = window.setTimeout(() => {
      const button = document.querySelector(
        `[data-mainpage-dock-app="${app}"]`
      );
      button?.click();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [tool]);

  return <WorkspacePage />;
}
