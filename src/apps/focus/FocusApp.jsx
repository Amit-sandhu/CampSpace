/*
 * BEGINNER GUIDE: src/apps/focus/FocusApp.jsx
 * This React file defines the FocusApp component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import { useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getDateString } from './utils/dateHelpers';
import FocusPage from './FocusPage.jsx';

const DEMO_MODE = false;
const DEMO_DATE = new Date(2026, 8, 10, 10, 0, 0);

// BEGINNER: getToday()
// This component/function is responsible for the getToday part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function getToday() {
  return DEMO_MODE ? DEMO_DATE : new Date();
}

function getInitialTasks() {
  const saved = localStorage.getItem('campSpaceTasks');
  if (saved) {
    try { return JSON.parse(saved); } catch { return []; }
  }

  return [
    { id: 1, title: 'Complete FEE project', type: 'Academic', completed: true },
    { id: 2, title: 'Study DSA (2 hrs)', type: 'Study', completed: false },
    { id: 3, title: 'Read research paper', type: 'Learning', completed: false },
    { id: 4, title: 'Prepare PPT', type: 'Academic', completed: true },
    { id: 5, title: 'Revise Java', type: 'Personal', completed: true }
  ];
}

// BEGINNER: getInitialSessions()
// This component/function is responsible for the getInitialSessions part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function getInitialSessions() {
  const saved = localStorage.getItem('campSpaceSessions');
  if (saved) {
    try { return JSON.parse(saved); } catch { return []; }
  }

  const today = getToday();
  const todayString = getDateString(today);
  const todayName = today.toLocaleDateString('en-US', { weekday: 'short' });
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? 6 : currentDay - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);
  const sessions = [];

  const weeklyData = [
    { offset: 0, task: 'DSA Practice', type: 'Study', duration: 40, time: '9:00 AM' },
    { offset: 1, task: 'Web Technologies', type: 'Learning', duration: 55, time: '10:20 AM' },
    { offset: 2, task: 'Research Paper', type: 'Academic', duration: 65, time: '1:20 PM' },
    { offset: 4, task: 'Java Revision', type: 'Study', duration: 60, time: '4:30 PM' },
    { offset: 5, task: 'Reading', type: 'Learning', duration: 25, time: '5:10 PM' },
    { offset: 6, task: 'Web Technologies', type: 'Learning', duration: 37, time: '3:40 PM' }
  ];

  weeklyData.forEach((item, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + item.offset);
    sessions.push({
      id: 1000 + index,
      taskId: 100 + index,
      task: item.task,
      type: item.type,
      duration: item.duration,
      completedAt: item.time,
      date: getDateString(date),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      recent: false
    });
  });

  [
    { id: 2001, taskId: 1, task: 'FEE Project', type: 'Project', duration: 30, completedAt: '10:00 AM' },
    { id: 2002, taskId: 2, task: 'DSA Practice', type: 'Study', duration: 25, completedAt: '11:15 AM' },
    { id: 2003, taskId: 3, task: 'Research Paper', type: 'Academic', duration: 25, completedAt: '1:20 PM' },
    { id: 2004, taskId: 4, task: 'Web Technologies', type: 'Learning', duration: 22, completedAt: '3:40 PM' }
  ].forEach((session) => {
    sessions.push({ ...session, date: todayString, day: todayName, recent: true });
  });

  return sessions;
}

// BEGINNER: FocusApp()
// This component/function is responsible for the FocusApp part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function FocusApp() {
  // Keep Focus visually consistent with the dashboard theme/background.
  // The dashboard owns the theme toggle; Focus only mirrors the persisted choice.
  useEffect(() => {
    document.body.classList.add('mainpage-body');
    const isDark = localStorage.getItem('campspace-theme') === 'dark';
    document.body.classList.toggle('mainpage-body--dark', isDark);

    return () => {
      document.body.classList.remove('mainpage-body', 'mainpage-body--dark');
    };
  }, []);

  const [tasks, setTasks] = useLocalStorage('campSpaceTasks', getInitialTasks);
  const [sessions, setSessions] = useLocalStorage('campSpaceSessions', getInitialSessions);

  return (
    <FocusPage
      tasks={tasks}
      setTasks={setTasks}
      sessions={sessions}
      setSessions={setSessions}
      demoMode={DEMO_MODE}
      demoDate={getToday()}
    />
  );
}
