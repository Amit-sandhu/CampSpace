import { useState } from 'react';
import './ChalkpadApp.css';

// 1. Simple lists of data
var subjectsList = [
  { code: '24CSE012', name: 'OOPS', attended: 72, delivered: 89, percent: 80 },
  { code: '24CSE014', name: 'Database Management', attended: 41, delivered: 50, percent: 82 }
];

// 2. Simple Icon Component
function SimpleIcon(props) {
  var iconName = props.name;
  
  if (iconName === 'home') {
    return <span>🏠</span>;
  }
  if (iconName === 'user') {
    return <span>👤</span>;
  }
  return <span>⭐</span>;
}

// 3. Login Screen Component
function LoginScreen(props) {
  var onLoginSuccess = props.onLoginSuccess;
  
  var [usernameInput, setUsernameInput] = useState('');
  var [passwordInput, setPasswordInput] = useState('');

  function handleLoginClick(event) {
    event.preventDefault();

    if (usernameInput === '') {
      alert('Please enter your username.');
      return;
    }

    if (passwordInput === '') {
      alert('Please enter your Chalkpad password.');
      return;
    }

    // Call function passed from parent to enter the app
    onLoginSuccess();
  }

  return (
    <div className="chalk-auth-screen">
      <div className="chalk-auth-inner">
        <h2>Welcome to Chalkpad</h2>
        <p>Please login to continue</p>

        <form onSubmit={handleLoginClick}>
          <label>
            Username:
            <input 
              type="text" 
              value={usernameInput} 
              onChange={function(e) { setUsernameInput(e.target.value); }} 
              placeholder="Enter username"
            />
          </label>

          <label>
            Password:
            <input 
              type="password" 
              value={passwordInput} 
              onChange={function(e) { setPasswordInput(e.target.value); }} 
              placeholder="Enter password"
            />
          </label>

          <button type="submit" className="chalk-primary-btn">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

// 4. Dashboard Screen Component
function DashboardScreen(props) {
  var onLogout = props.onLogout;

  return (
    <div className="chalk-dashboard">
      <div className="chalk-topbar">
        <h2>Dashboard</h2>
        <button onClick={onLogout} className="chalk-outline-btn">
          Sign Out
        </button>
      </div>

      <div className="chalk-today">
        <h3>Enrolled Subjects</h3>
        {subjectsList.map(function(subject, index) {
          return (
            <div className="chalk-subject-card" key={index}>
              <b>{subject.name}</b>
              <span>{subject.attended} / {subject.delivered} Classes Attended</span>
              <strong>{subject.percent}%</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 5. Main Parent Component
export default function ChalkpadApp() {
  // Initialize state by checking localStorage once when the app loads
  var [isLoggedIn, setIsLoggedIn] = useState(function() {
    var savedStatus = localStorage.getItem('chalk_logged_in');
    if (savedStatus === 'true') {
      return true;
    }
    return false;
  });

  // If user is not logged in, show the Login screen
  if (isLoggedIn === false) {
    return (
      <LoginScreen 
        onLoginSuccess={function() {
          localStorage.setItem('chalk_logged_in', 'true');
          setIsLoggedIn(true);
        }} 
      />
    );
  }

  // If user is logged in, show the Dashboard screen
  return (
    <DashboardScreen 
      onLogout={function() {
        localStorage.setItem('chalk_logged_in', 'false');
        setIsLoggedIn(false);
      }} 
    />
  );
}