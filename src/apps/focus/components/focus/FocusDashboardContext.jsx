/*
 * CONTEXT API (FEE topic: Context API / global vs local state)
 * A context is a "shared box" any child component can read from without
 * receiving props through every level. FocusPage fills this box with
 * tasks + sessions; TodayTasks, FocusTimer and RecentSessions read it.
 */
import { createContext } from "react";

const FocusDashboardContext = createContext(null);

export default FocusDashboardContext;
