/*
 * BEGINNER GUIDE: src/apps/chalkpad/ChalkpadContent.jsx
 * This React file defines the ChalkpadContent component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import { useMemo, useState } from 'react';
import './ChalkpadApp.css';

const subjects = [
  { code: '24CSE012', name: 'Data Structures using Object Oriented Programming', attended: 72, delivered: 89, percent: 80.9 },
  { code: '24CSE014', name: 'Database Management Systems', attended: 41, delivered: 50, percent: 82 },
  { code: '24CSE016', name: 'Operating Systems', attended: 34, delivered: 45, percent: 75.6 },
  { code: '24MAT102', name: 'Mathematics for Computing', attended: 31, delivered: 48, percent: 64.6 },
];

const timetable = [
  { time: '09:00 AM', end: '10:00 AM', name: 'Data Structures', teacher: 'Dr. Sharma', room: 'C-204', status: 'done' },
  { time: '10:00 AM', end: '11:00 AM', name: 'Database Management Systems', teacher: 'Dr. Kaur', room: 'C-204', status: 'current' },
  { time: '11:15 AM', end: '12:15 PM', name: 'Operating Systems', teacher: 'Mr. Singh', room: 'B-106', status: 'upcoming' },
  { time: '02:00 PM', end: '04:00 PM', name: 'Web Development Lab', teacher: 'Ms. Mehta', room: 'Lab-3', status: 'upcoming' },
];

const circulars = [
  { title: 'Mid Semester Examination Schedule', date: 'Sep 08, 2026', tag: 'Academic' },
  { title: 'Holiday Notice — University Foundation Day', date: 'Sep 07, 2026', tag: 'Notice' },
  { title: 'Placement Cell: Registration Open', date: 'Sep 05, 2026', tag: 'Placement' },
];

const reportRows = [
  ['Data Structures', 'A', '86'],
  ['Database Management Systems', 'A-', '82'],
  ['Operating Systems', 'B+', '78'],
  ['Mathematics for Computing', 'B', '72'],
];

// BEGINNER: Icon()
// This component/function is responsible for the Icon part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function Icon({ name, size = 20 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 5.5v16"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10 21h4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    arrow: <><path d="m9 18 6-6-6-6"/></>,
    back: <><path d="m15 18-6-6 6-6"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.6v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.6h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V4h2.6v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.6h-.2a1.7 1.7 0 0 0-1.5 1Z"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

// BEGINNER: Login()
// This component/function is responsible for the Login part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function Login({ onLogin }) {
  const [school, setSchool] = useState('800002');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [schoolModal, setSchoolModal] = useState(false);
  const [tempSchool, setTempSchool] = useState(school);

  function submit(e) {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    setError('');
    onLogin({ username, school });
  }

  return <div className="chalk-auth-screen">
    <div className="chalk-auth-inner">
      {/* Chalkpad interface section for student academic information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
      <div className="chalk-auth-logo"><span>✓</span><b>chalkpad</b></div>
        {/* Chalkpad interface section for student academic information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
      <div className="chalk-login-heading"><div className="chalk-login-icon">✓</div><h2>Welcome back!</h2><p>Login to your account</p></div>
        {/* Chalkpad interface section for student academic information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
      <form className="chalk-form" onSubmit={submit}>
        {/* Form that groups related user inputs and handles submission. — FEE topics: JSX + semantic HTML + forms/events; className connects this structure to the CSS styling. */}
        <label>Username<input value={username} onChange={e => setUsername(e.target.value)} placeholder="Roll Number" autoCapitalize="none" /></label>
        <label>Password<div className="chalk-password"><input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" /><button type="button" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button></div></label>
        {error && <div className="chalk-error">{error}</div>}
        <button className="chalk-primary-btn" type="submit">Log In</button>
      </form>
      <div className="chalk-divider"><span>or</span></div>
        {/* Chalkpad interface section for student academic information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
      <button className="chalk-demo-btn" onClick={() => onLogin({ username: 'Demo Student', school })}>Try Demo</button>
      <p className="chalk-login-footer">Let's get learning!</p>
      <button className="chalk-school-link" onClick={() => setSchoolModal(true)}>School Code: <b>{school}</b><span>Change School</span></button>
    </div>
    {schoolModal && <div className="chalk-modal-backdrop" onClick={() => setSchoolModal(false)}><div className="chalk-modal" onClick={e => e.stopPropagation()}><h3>Change School Code</h3><p>Enter your school's unique code to connect to the correct branch.</p><input value={tempSchool} onChange={e => setTempSchool(e.target.value)} /><div className="chalk-modal-actions"><button onClick={() => setSchoolModal(false)}>Cancel</button><button className="chalk-accent-btn" onClick={() => { setSchool(tempSchool); setSchoolModal(false); }}>Save</button></div></div></div>}
  </div>;
}

// BEGINNER: OTP()
// This component/function is responsible for the OTP part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function OTP({ onBack, onVerify }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  function change(value, index) {
    const next = [...otp];
    next[index] = value.replace(/\D/g, '').slice(-1);
    setOtp(next);
    if (value && index < 3) document.getElementById(`chalk-otp-${index + 1}`)?.focus();
  }
  function verify() {
    const code = otp.join('');
    if (code.length !== 4) return setError('Please enter the complete 4-digit code');
    onVerify();
  }
  return <div className="chalk-auth-screen chalk-otp-screen"><div className="chalk-otp-card">
    <button className="chalk-back-btn" onClick={onBack}><Icon name="back" size={20}/></button>
    <div className="chalk-otp-icon">✦</div><h2>Verify your account</h2><p>Enter the 4-digit code sent to your registered mobile number.</p>
      {/* Chalkpad interface section for student academic information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
    <div className="chalk-otp-inputs">{otp.map((v, i) => <input key={i} id={`chalk-otp-${i}`} value={v} maxLength={1} inputMode="numeric" onChange={e => change(e.target.value, i)} onKeyDown={e => e.key === 'Backspace' && !v && i > 0 && document.getElementById(`chalk-otp-${i - 1}`)?.focus()} />)}</div>
      {/* Chalkpad interface section for student academic information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
    {error && <div className="chalk-error">{error}</div>}
    <button className="chalk-primary-btn" onClick={verify}>Continue</button>
    <button className="chalk-text-btn">Didn't receive it? Resend code</button>
  </div></div>;
}

// BEGINNER: Welcome()
// This component/function is responsible for the Welcome part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function Welcome({ onStart }) {
  return <div className="chalk-auth-screen chalk-welcome"><div className="chalk-welcome-inner">
    <div className="chalk-auth-logo"><span>✓</span><b>chalkpad</b></div>
      {/* Chalkpad interface section for student academic information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
    <div className="chalk-welcome-art"><div className="chalk-art-card"><div className="chalk-art-ring">81%</div><div><b>Attendance</b><small>Stay on track</small></div></div><div className="chalk-art-card chalk-art-card-two"><Icon name="calendar" size={24}/><div><b>Today's classes</b><small>4 classes scheduled</small></div></div></div>
      {/* Welcome area with the current date and quick actions. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
    <h1>Welcome to Chalkpad</h1><p>Your smart school companion.</p><button className="chalk-gradient-btn" onClick={onStart}>Get Started</button><small className="chalk-made">Made with ❤️ for students</small>
  </div></div>;
}

function Dashboard({ setView, dark, toggleDark }) {
  const overall = Math.round(subjects.reduce((a, s) => a + s.attended, 0) / subjects.reduce((a, s) => a + s.delivered, 0) * 100);
  return <div className="chalk-dashboard">
    <div className="chalk-topbar"><div className="chalk-user"><div className="chalk-avatar">AS</div><div><small>Welcome back,</small><b>Student</b></div></div><div className="chalk-top-actions"><button onClick={() => setView('services')}><Icon name="search"/></button><button onClick={toggleDark}><Icon name="moon"/></button><button><Icon name="bell"/></button></div></div>
      {/* Chalkpad interface section for student academic information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
    <div className="chalk-hero"><div><small>Tuesday, Sep 08</small><h1>Your academic day</h1><p>Here's what actually matters today.</p></div><div className="chalk-overall"><div className="chalk-progress-ring" style={{ '--pct': `${overall}%` }}><b>{overall}%</b></div><span>Overall attendance</span></div></div>
      {/* Chalkpad interface section for student academic information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
    <div className="chalk-today"><div className="chalk-section-head"><h3>Today's timetable</h3><button onClick={() => setView('timetable')}>View all <Icon name="arrow" size={16}/></button></div>{timetable.map((x, i) => <div className={`chalk-class ${x.status}`} key={i}><div className="chalk-time">{x.time}<small>{x.end}</small></div><div className="chalk-class-dot"></div><div className="chalk-class-main"><b>{x.name}</b><span>{x.teacher} · {x.room}</span></div><em>{x.status === 'current' ? 'Now' : x.status === 'done' ? 'Done' : 'Upcoming'}</em></div>)}</div>
      {/* Chalkpad interface section for student academic information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
    <div className="chalk-section-head"><h3>Attendance</h3><button onClick={() => setView('attendance')}>See details <Icon name="arrow" size={16}/></button></div>
      {/* Chalkpad interface section for student academic information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
    <div className="chalk-subject-grid">{subjects.map(s => <button className="chalk-subject-card" key={s.code} onClick={() => setView('attendance', s)}><div className="chalk-subject-icon">✓</div><div><b>{s.name}</b><span>{s.attended}/{s.delivered} classes</span></div><strong className={s.percent < 75 ? 'danger' : ''}>{s.percent}%</strong></button>)}</div>
      {/* Responsive grid that arranges the dashboard information cards. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
    <div className="chalk-quick-grid"><button onClick={() => setView('circulars')}><span><Icon name="bell"/></span><div><b>Announcements</b><small>{circulars.length} recent notices</small></div><Icon name="arrow"/></button><button onClick={() => setView('leave')}><span><Icon name="calendar"/></span><div><b>Need time off?</b><small>Submit a leave request</small></div><Icon name="arrow"/></button><button onClick={() => setView('reportcard')}><span><Icon name="book"/></span><div><b>Report Card</b><small>Check your latest grades</small></div><Icon name="arrow"/></button></div>
      {/* Responsive grid that arranges the dashboard information cards. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
  </div>;
}

// BEGINNER: Attendance()
// This component/function is responsible for the Attendance part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function Attendance({ setView, selected }) {
  const [tab, setTab] = useState('summary');
  const [whatIf, setWhatIf] = useState(0);
  const s = selected || subjects[0];
  const projected = Math.round((s.attended / (s.delivered + whatIf)) * 1000) / 10;
  const skip = Math.max(0, Math.floor((s.attended - 0.75 * s.delivered) / 0.75));
  const recovery = Math.max(0, Math.ceil((0.75 * s.delivered - s.attended) / 0.25));
  return <div className="chalk-page"><PageHead title="Attendance" onBack={() => setView('dashboard')}/><div className="chalk-tabs"><button className={tab === 'summary' ? 'active' : ''} onClick={() => setTab('summary')}>Summary</button><button className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}>Register</button></div>
    {tab === 'summary' ? <><div className="chalk-att-card"><div><small>{s.code}</small><h2>{s.name}</h2><span>20 Jan 2026 — 31 Mar 2026</span><label className={s.percent >= 75 ? 'safe' : 'risk'}>{s.percent >= 75 ? '✓ Safe Zone' : '⚠ Needs Attention'}</label></div><div className="chalk-big-ring" style={{ '--pct': `${s.percent}%` }}><b>{Math.round(s.percent)}%</b></div></div><div className="chalk-info-card"><b>Skip Budget</b><span>You can safely skip the next <strong>{skip}</strong> classes.</span><div className="chalk-mini-icon">⌁</div></div><div className="chalk-whatif"><h3>What if I skip...</h3><div><button className={whatIf === 1 ? 'active' : ''} onClick={() => setWhatIf(1)}>Today</button><button className={whatIf === 2 ? 'active' : ''} onClick={() => setWhatIf(2)}>Tomorrow</button><button className={whatIf === 0 ? 'active' : ''} onClick={() => setWhatIf(0)}>Custom...</button></div><p>Skipping {whatIf || 0} class{whatIf === 1 ? ' today' : 'es'} will change your attendance to <b>{whatIf ? projected : s.percent}%</b>.</p></div><div className="chalk-breakdown"><h3>Attendance Breakdown</h3><div><article><small>Attended</small><b>{s.attended}</b></article><article><small>Delivered</small><b>{s.delivered}</b></article><article><small>Can recover</small><b>{recovery}</b></article></div></div></> : <div className="chalk-register">{Array.from({ length: 14 }).map((_, i) => <div key={i}><span>Sep {String(i + 1).padStart(2, '0')}</span><b>{i % 5 === 0 ? 'ML' : i % 4 === 0 ? 'A' : i % 7 === 0 ? 'DL' : 'P'}</b><small>{i % 4 === 0 ? 'Absent' : 'Present'}</small></div>)}</div>}
  </div>;
}

// BEGINNER: Timetable()
// This component/function is responsible for the Timetable part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function Timetable({ setView }) { return <div className="chalk-page"><PageHead title="Timetable" onBack={() => setView('dashboard')}/><div className="chalk-week"><button>‹</button><b>Sep 07 — Sep 13</b><button>›</button></div><div className="chalk-timetable-list">{timetable.concat([{ time: '04:00 PM', end: '05:00 PM', name: 'Quantitative Aptitude', teacher: 'Dr. Verma', room: 'A-302', status: 'upcoming' }]).map((x, i) => <div className="chalk-timetable-row" key={i}><div className="chalk-time">{x.time}<small>{x.end}</small></div><div><b>{x.name}</b><span>{x.teacher} · {x.room}</span></div><i className={x.status}></i></div>)}</div></div>; }
function Circulars({ setView }) { return <div className="chalk-page"><PageHead title="Circulars & Feed" onBack={() => setView('dashboard')}/>{circulars.map((c, i) => <article className="chalk-circular" key={i}><div className="chalk-circular-tag">{c.tag}</div><h3>{c.title}</h3><p>University announcement and important information for students. Tap to read the complete notice.</p><small>{c.date}</small></article>)}</div>; }
function Leave({ setView }) { const [sent, setSent] = useState(false); return <div className="chalk-page"><PageHead title="Leave Management" onBack={() => setView('dashboard')}/>{sent ? <div className="chalk-success"><div>✓</div><h2>Request submitted</h2><p>Your leave request has been saved successfully.</p><button onClick={() => setSent(false)}>Submit another</button></div> : <div className="chalk-leave-form"><label>Leave type<select><option>Medical Leave</option><option>Duty Leave</option><option>Gatepass</option></select></label><div className="chalk-two"><label>From<input type="date"/></label><label>To<input type="date"/></label></div><label>Reason<textarea placeholder="Tell us why you need leave..."/></label><button className="chalk-primary-btn" onClick={() => setSent(true)}>Submit Request</button></div>}</div>; }
function ReportCard({ setView }) { return <div className="chalk-page"><PageHead title="Report Card" onBack={() => setView('dashboard')}/><div className="chalk-result-hero"><small>Semester 3</small><b>8.4 CGPA</b><span>Current academic performance</span></div><div className="chalk-report-table"><div className="head"><span>Subject</span><span>Grade</span><span>Score</span></div>{reportRows.map(r => <div key={r[0]}><span>{r[0]}</span><b>{r[1]}</b><span>{r[2]}</span></div>)}</div></div>; }
function Subjects({ setView }) { return <div className="chalk-page"><PageHead title="Subjects" onBack={() => setView('dashboard')}/>{subjects.map(s => <button className="chalk-list-card" key={s.code} onClick={() => setView('attendance', s)}><div className="chalk-subject-icon">✓</div><div><b>{s.name}</b><span>{s.code}</span></div><strong>{s.percent}%</strong><Icon name="arrow"/></button>)}</div>; }
function Profile({ setView, dark, toggleDark }) { return <div className="chalk-page"><PageHead title="Profile" onBack={() => setView('dashboard')}/><div className="chalk-profile-head"><div className="chalk-avatar big">AS</div><h2>Student</h2><span>24CSE012 · CSE</span></div><div className="chalk-settings-list"><button><Icon name="user"/><span><b>Personal Details</b><small>Roll number, contact and profile</small></span><Icon name="arrow"/></button><button onClick={toggleDark}><Icon name="moon"/><span><b>Appearance</b><small>{dark ? 'Dark mode' : 'Light mode'}</small></span><em className={dark ? 'on' : ''}></em></button><button><Icon name="settings"/><span><b>Session</b><small>2026 — 2027 · Semester 3</small></span><Icon name="arrow"/></button></div><button className="chalk-outline-btn">Sign out</button></div>; }
function Services({ setView, close }) { const services = [['attendance','Attendance','View your attendance records','✓'],['timetable','Timetable','View your weekly schedule','◷'],['circulars','Circulars','Announcements and notices','!'],['leave','Leave Request','Submit leave applications','↗'],['reportcard','Report Card','Check your grades and results','A'],['subjects','Subjects','View enrolled subjects','▤'],['profile','Profile','View and edit your profile','●']]; return <div className="chalk-modal-backdrop" onClick={close}><div className="chalk-services" onClick={e => e.stopPropagation()}><div className="chalk-services-head"><h2>Services</h2><button onClick={close}><Icon name="close"/></button></div><div className="chalk-service-search"><Icon name="search"/><input placeholder="Search services..."/></div>{services.map(s => <button key={s[0]} onClick={() => { setView(s[0]); close(); }}><span>{s[3]}</span><div><b>{s[1]}</b><small>{s[2]}</small></div><Icon name="arrow"/></button>)}</div></div>; }
function PageHead({ title, onBack }) { return <div className="chalk-page-head"><button onClick={onBack}><Icon name="back"/></button><h2>{title}</h2><span></span></div>; }

export default function ChalkpadApp() {
  const [stage, setStage] = useState('welcome');
  const [view, setViewState] = useState('dashboard');
  const [selected, setSelected] = useState(null);
  const [dark, setDark] = useState(false);
  const [showServices, setShowServices] = useState(false);
  // BEGINNER: setView()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  const setView = (next, subject = null) => { if (next === 'services') return setShowServices(true); setSelected(subject); setViewState(next); };
  const themeClass = dark ? 'chalkpad-root chalk-dark' : 'chalkpad-root';

  if (stage === 'welcome') return <div className={themeClass}><Welcome onStart={() => setStage('login')} /></div>;
  if (stage === 'login') return <div className={themeClass}><Login onLogin={() => setStage('otp')} /></div>;
  if (stage === 'otp') return <div className={themeClass}><OTP onBack={() => setStage('login')} onVerify={() => setStage('app')} /></div>;

  let content;
  if (view === 'dashboard') content = <Dashboard setView={setView} dark={dark} toggleDark={() => setDark(!dark)} />;
  else if (view === 'attendance') content = <Attendance setView={setView} selected={selected} />;
  else if (view === 'timetable') content = <Timetable setView={setView} />;
  else if (view === 'circulars') content = <Circulars setView={setView} />;
  else if (view === 'leave') content = <Leave setView={setView} />;
  else if (view === 'reportcard') content = <ReportCard setView={setView} />;
  else if (view === 'subjects') content = <Subjects setView={setView} />;
  else if (view === 'profile') content = <Profile setView={setView} dark={dark} toggleDark={() => setDark(!dark)} />;
  else content = <Dashboard setView={setView} dark={dark} toggleDark={() => setDark(!dark)} />;

  return <div className={themeClass}><div className="chalk-shell">{content}<nav className="chalk-bottom-nav"><button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}><Icon name="calendar"/><span>Home</span></button><button className={view === 'attendance' ? 'active' : ''} onClick={() => setView('attendance')}><Icon name="check"/><span>Attendance</span></button><button onClick={() => setShowServices(true)} className="chalk-nav-main"><span>+</span><small>Services</small></button><button className={view === 'timetable' ? 'active' : ''} onClick={() => setView('timetable')}><Icon name="book"/><span>Classes</span></button><button className={view === 'profile' ? 'active' : ''} onClick={() => setView('profile')}><Icon name="user"/><span>Profile</span></button></nav></div>{showServices && <Services setView={setView} close={() => setShowServices(false)} />}</div>;
}
