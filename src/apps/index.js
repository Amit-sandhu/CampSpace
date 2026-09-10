/*
 * BEGINNER GUIDE: src/apps/index.js
 * This file handles the Module re-exports.
 * Syllabus topics visible here: props / component composition.
 * The code below keeps the original behaviour; comments explain the main jobs.
 */

// Central app registry.
// Add a new workspace app under src/apps/<app-name>/ and export it here.

export { default as DashboardApp } from './dashboard/DashboardApp.jsx';
export { default as CalendarApp } from './calendar/CalendarApp.jsx';
export { default as NotepadApp } from './notepad/NotepadApp.jsx';
export { default as CalculatorApp } from './calculator/CalculatorApp.jsx';
export { default as CodeEditorApp } from './code-editor/CodeEditorApp.jsx';
export { default as AIChatApp } from './ai-chat/AIChatApp.jsx';
export { default as CampusChatApp } from './campus-chat/CampusChatApp.jsx';
export { default as ClassSessionApp } from './class-session/ClassSessionApp.jsx';
export { default as ChalkpadWindow } from './chalkpad/ChalkpadWindow.jsx';

export { default as Sidebar } from './sidebar/Sidebar.jsx';
export { default as FocusApp } from './focus/FocusApp.jsx';
export { default as CamiAI } from './cami/CamiAI.jsx';
