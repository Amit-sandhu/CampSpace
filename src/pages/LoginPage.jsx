/*
 * BEGINNER GUIDE: src/pages/LoginPage.jsx
 * This React file defines the LoginPage component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import { useEffect } from 'react'
import './login.css'
import { runAuthScript } from '../lib/auth.js'
import { runOAuthScript } from '../lib/oauth.js'
import '../lib/oauth-config.js'

// BEGINNER: LoginPage()
// This component/function is responsible for the LoginPage part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function LoginPage() {
  useEffect(function () {
    document.body.className = ''

    runAuthScript()
    runOAuthScript()

    return function () {
      document.body.className = ''
    }
  }, [])

  return (
    <div className="login-page-root">
      <video autoPlay muted loop playsInline className="background-video">
        <source src="/videos/login_bg_loop.mp4" type="video/mp4" />
      </video>

      <header className="brand">
        {/* Semantic header that identifies the top part of this ui section. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <img src="/images/campspace_text.png" alt="CampSpace" />
      </header>

      <div className="login-card">
        {/* Content card that groups one related set of information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <div className="glass-highlight"></div>

        <img className="logo" src="/images/octopus.png" alt="CampSpace" />

        <h1 id="login-heading">Welcome back</h1>

        <p className="subtitle" id="login-subtitle">
          Sign in to continue to your workspace
        </p>

        <label htmlFor="login-email">Email</label>

        <div className="input-box">
          <i className="fa-regular fa-envelope"></i>
          <input
            type="email"
            id="login-email"
            placeholder="example@gmail.com"
            autoComplete="email"
          />
        </div>

        <label htmlFor="login-password">Password</label>

        <div className="input-box">
          <i className="fa-solid fa-lock"></i>

          <input
            type="password"
            id="login-password"
            placeholder="password"
            autoComplete="current-password"
          />

          <i className="fa-regular fa-eye" id="login-eye-toggle"></i>
        </div>

        <p className="login-message" id="login-message"></p>

        <button className="login-btn" id="login-btn" type="button">
          <span id="login-btn-label">Sign In</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>

        <div className="divider">or continue with</div>

        <div className="socials">
          <button
            type="button"
            id="social-github-btn"
            aria-label="Sign in with GitHub"
          >
            <img
              height="30px"
              src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
              alt="GitHub"
            />
          </button>

          <button
            type="button"
            id="social-google-btn"
            aria-label="Sign in with Google"
          >
            <img
              height="30px"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png"
              alt="Google"
            />
          </button>

          <button
            type="button"
            id="social-microsoft-btn"
            aria-label="Sign in with Microsoft"
          >
            <img
              height="35px"
              src="https://static.vecteezy.com/system/resources/thumbnails/027/127/473/small/microsoft-logo-microsoft-icon-transparent-free-png.png"
              alt="Microsoft"
            />
          </button>
        </div>

        <div className="footer-links">
          <a href="#" id="login-forgot">Forgot password?</a>
          <a href="#" id="login-toggle-mode">Create account →</a>
        </div>
      </div>
    </div>
  )
}
