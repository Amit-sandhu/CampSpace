/*
 * BEGINNER GUIDE: src/apps/focus/components/common/Icons.jsx
 * This React file defines the Icons component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

// BEGINNER: base()
// This component/function is responsible for the base part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function base(props) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props
  };
}


/* =========================================================
   SIDEBAR
========================================================= */

export function HomeIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 10.8 12 3.7l8.5 7.1" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  );
}


export function GraduationCapIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M2.5 8.5 12 4l9.5 4.5L12 13z" />
      <path d="M6 10.5v4.7c0 1.4 2.7 2.9 6 2.9s6-1.5 6-2.9v-4.7" />
      <path d="M21.5 8.5v5" />
    </svg>
  );
}


/* =========================================================
   FOCUS
========================================================= */

export function TargetIcon(props) {
  return (
    <svg {...base(props)}>
      {/* Outer target ring */}
      <circle
        cx="12"
        cy="12"
        r="8"
        strokeWidth="2"
      />

      {/* Middle target ring */}
      <circle
        cx="12"
        cy="12"
        r="4.8"
        strokeWidth="2"
      />

      {/* Bullseye */}
      <circle
        cx="12"
        cy="12"
        r="1.8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}


export function LayoutGridIcon(props) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.5" />
      <rect x="14" y="14" width="6.5" height="6.5" rx="1.5" />
    </svg>
  );
}


export function UserIcon(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="3.7" />
      <path d="M4.5 20c.5-4 3.1-6 7.5-6s7 2 7.5 6" />
    </svg>
  );
}


/* =========================================================
   TOPBAR
========================================================= */

export function BellIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M6.2 10.2a5.8 5.8 0 0 1 11.6 0v3.1c0 1.4.5 2.5 1.5 3.5H4.7c1-1 1.5-2.1 1.5-3.5z" />
      <path d="M9.5 20C9.9 20.6 10.7 21 12 21s2.1-.4 2.5-1" />
    </svg>
  );
}


export function ChevronDownIcon(props) {
  return (
    <svg {...base(props)}>
      <polyline points="6.5 9.5 12 15 17.5 9.5" />
    </svg>
  );
}


/* =========================================================
   FOCUS / STATS
========================================================= */

export function ClipboardListIcon(props) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="4.5" width="14" height="16" rx="2" />
      <rect x="8.5" y="2.5" width="7" height="3.5" rx="1.4" />

      <line x1="8.5" y1="10" x2="15.5" y2="10" />
      <line x1="8.5" y1="14" x2="15.5" y2="14" />
      <line x1="8.5" y1="18" x2="13" y2="18" />
    </svg>
  );
}


export function ClockIcon(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v4.8l3.2 2" />
    </svg>
  );
}


export function TimerIcon(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="13" r="7.8" />
      <path d="M12 8.5v4.8l3.3 1.9" />
      <path d="M9.5 3h5" />
      <path d="M12 3v2" />
    </svg>
  );
}


export function BarChart3Icon(props) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="13" width="4" height="7" rx="1" />
      <rect x="10" y="9" width="4" height="11" rx="1" />
      <rect x="16" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}


export function FlameIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M12.2 2.5c.6 2.4-1.2 3.9-2.4 5.3-1 1.2-1.7 2.3-1.7 4.1a3.9 3.9 0 0 0 7.8 0c0-1.6-.6-2.9-1.6-4.1 1.8.8 3.2 2.9 3.2 5.4a5.5 5.5 0 0 1-11 0c0-3.8 2.7-6.5 5.7-10.7z" />
    </svg>
  );
}


/* =========================================================
   INSIGHTS
========================================================= */

export function TrendingUpIcon(props) {
  return (
    <svg {...base(props)}>
      <polyline points="4 16.5 9 11.5 13 14.5 20 7.5" />
      <polyline points="14.5 7.5 20 7.5 20 13" />
    </svg>
  );
}


export function StarIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="m12 3 2.55 5.25 5.8.85-4.2 4.1.99 5.8L12 16.2 6.86 19l.99-5.8-4.2-4.1 5.8-.85z" />
    </svg>
  );
}


export function LightbulbIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M8.2 14.5A6.2 6.2 0 1 1 15.8 14.5c-.7.5-1.1 1.2-1.1 2.1H9.3c0-.9-.4-1.6-1.1-2.1z" />
      <path d="M9.5 19h5" />
      <path d="M10.5 21h3" />
    </svg>
  );
}


export function SparklesIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 13.5 7.8 18 9.5l-4.5 1.7L12 16l-1.5-4.8L6 9.5l4.5-1.7z" />
      <path d="m19 14 .7 2.3L22 17l-2.3.7z" />
    </svg>
  );
}


/* =========================================================
   QUICK TOOLS / SESSIONS
========================================================= */

export function FileTextIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
  );
}


export function CalendarIcon(props) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
      <line x1="8" y1="2.5" x2="8" y2="6.5" />
      <line x1="16" y1="2.5" x2="16" y2="6.5" />
    </svg>
  );
}


export function CodeIcon(props) {
  return (
    <svg {...base(props)}>
      <polyline points="8.5 6 3 12 8.5 18" />
      <polyline points="15.5 6 21 12 15.5 18" />
    </svg>
  );
}


export function FolderIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 6.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z" />
    </svg>
  );
}


export function BookOpenIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 6.5c-2-1.4-4.5-2-8-2v13c3.5 0 6 .6 8 2 2-1.4 4.5-2 8-2v-13c-3.5 0-6 .6-8 2z" />
      <line x1="12" y1="6.5" x2="12" y2="19.5" />
    </svg>
  );
}


export function HeartIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 20.5S4.2 15.8 3 10.5C2.2 7.2 4.2 5 7 5c2 0 3.8 1.2 5 3 1.2-1.8 3-3 5-3 2.8 0 4.8 2.2 4 5.5-1.2 5.3-9 10-9 10z" />
    </svg>
  );
}


/* =========================================================
   ACTIONS
========================================================= */

export function CheckIcon(props) {
  return (
    <svg {...base(props)}>
      <polyline points="4.5 12.5 9.5 17.5 19.5 6.5" />
    </svg>
  );
}


export function MoreVerticalIcon(props) {
  return (
    <svg {...base(props)}>
      <circle
        cx="12"
        cy="5"
        r="1.2"
        fill="currentColor"
        stroke="none"
      />

      <circle
        cx="12"
        cy="12"
        r="1.2"
        fill="currentColor"
        stroke="none"
      />

      <circle
        cx="12"
        cy="19"
        r="1.2"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}


export function PlusIcon(props) {
  return (
    <svg {...base(props)}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}


export function RefreshIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M20 11a8 8 0 0 0-14.8-4L3 10" />
      <polyline points="3 5 3 10 8 10" />
      <path d="M4 13a8 8 0 0 0 14.8 4L21 14" />
      <polyline points="21 19 21 14 16 14" />
    </svg>
  );
}


export function PlayIcon(props) {
  return (
    <svg {...base(props)}>
      <polygon
        points="9 6 19 12 9 18"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}


export function PauseIcon(props) {
  return (
    <svg {...base(props)}>
      <line
        x1="9"
        y1="6"
        x2="9"
        y2="18"
        strokeWidth="3"
      />

      <line
        x1="15"
        y1="6"
        x2="15"
        y2="18"
        strokeWidth="3"
      />
    </svg>
  );
}


export function ArrowRightIcon(props) {
  return (
    <svg {...base(props)}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}
