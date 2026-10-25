/*
 * BEGINNER GUIDE: src/pages/LoginPage.jsx
 * The email + password form is a real React form:
 *   - controlled inputs + validation + submit  -> useForm (src/hooks/useForm.js)
 *   - validation rules                         -> src/lib/validators.js
 *   - label + input + error markup             -> <FormField> (src/components/FormField.jsx)
 * Local UI state (sign in / create account, show password, message) uses useState.
 * The Google / Microsoft / GitHub buttons are still handled by src/lib/auth.js
 * and src/lib/oauth.js; they show their messages through the bridge set up below.
 */

import { useEffect, useState } from 'react'
import './login.css'
import FormField from '../components/FormField.jsx'
import { useForm } from '../hooks/useForm.js'
import { isEmail, minLength, required } from '../lib/validators.js'
import { runAuthScript } from '../lib/auth.js'
import { runOAuthScript } from '../lib/oauth.js'
import '../lib/oauth-config.js'

// VALIDATION STRATEGY: one schema = list of rules per field (same rules for both modes).
const LOGIN_SCHEMA = {
  email: [required('Enter your email address.'), isEmail('Enter a valid email address.')],
  password: [required('Enter a password.'), minLength(4, 'Password must be at least 4 characters.')],
}

const INITIAL_VALUES = { email: '', password: '' }

// BEGINNER: LoginPage()
// Main job: show the sign-in / create-account card and handle the form with React state.
// FEE topics: form handling, validation strategies, reusable input components, controlled components.
export default function LoginPage() {
  // LOCAL STATE: only this page needs these.
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState({ text: '', isError: false })
  const [redirecting, setRedirecting] = useState(false)

  useEffect(function () {
    document.body.className = ''

    // Bridge: the legacy social sign-in code calls this to show its messages.
    window.CampSpaceLoginMessage = function (text, isError) {
      setMessage({ text: text, isError: Boolean(isError) })
    }

    runAuthScript()
    runOAuthScript()

    return function () {
      delete window.CampSpaceLoginMessage
      document.body.className = ''
    }
  }, [])

  // Runs only after every field passed validation (see useForm.handleSubmit).
  async function submitCredentials(values) {
    const auth = window.CampSpaceAuth
    const email = values.email.trim().toLowerCase()
    const password = values.password
    const users = auth.getUsers()

    if (mode === 'signup') {
      if (users[email]) {
        setMessage({ text: 'An account with that email already exists \u2014 sign in instead.', isError: true })
        return
      }

      const newUser = { email: email, password: password, name: auth.nameFromEmail(email) }
      users[email] = newUser
      auth.saveUsers(users)
      auth.setSession(newUser)
    } else {
      const existingUser = users[email]
      if (!existingUser || existingUser.password !== password) {
        setMessage({ text: 'Incorrect email or password.', isError: true })
        return
      }
      auth.setSession(existingUser)
    }

    setRedirecting(true)
    setMessage({ text: 'Success \u2014 redirecting\u2026', isError: false })
    window.setTimeout(function () {
      window.location.href = '/?page=workspace'
    }, 350)
  }

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: INITIAL_VALUES,
    schema: LOGIN_SCHEMA,
    onSubmit: submitCredentials,
  })

  function toggleMode(event) {
    event.preventDefault()
    setMode(mode === 'signup' ? 'signin' : 'signup')
    setMessage({ text: '', isError: false })
  }

  function showForgotMessage(event) {
    event.preventDefault()
    setMessage({ text: "Password reset isn't available in this preview yet.", isError: false })
  }

  const isSignup = mode === 'signup'

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

        <h1 id="login-heading">{isSignup ? 'Create your account' : 'Welcome back'}</h1>

        <p className="subtitle" id="login-subtitle">
          {isSignup ? 'Set a password to start using CampSpace' : 'Sign in to continue to your workspace'}
        </p>

        {/* FORM HANDLING: onSubmit runs validation first; noValidate lets our own messages show. */}
        <form onSubmit={handleSubmit} noValidate>
          <FormField id="login-email" label="Email" error={errors.email}>
            <div className="input-box">
              <i className="fa-regular fa-envelope"></i>
              <input
                type="email"
                id="login-email"
                name="email"
                placeholder="example@gmail.com"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
              />
            </div>
          </FormField>

          <FormField id="login-password" label="Password" error={errors.password}>
            <div className="input-box">
              <i className="fa-solid fa-lock"></i>

              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                name="password"
                placeholder="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
              />

              <i
                className={showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}
                id="login-eye-toggle"
                role="button"
                tabIndex={0}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setShowPassword(!showPassword)
                  }
                }}
              ></i>
            </div>
          </FormField>

          <p
            className={
              'login-message' +
              (message.text ? ' login-message--visible' : '') +
              (message.isError ? ' login-message--error' : '')
            }
            id="login-message"
            role="status"
          >
            {message.text}
          </p>

          <button
            className="login-btn"
            id="login-btn"
            type="submit"
            disabled={isSubmitting || redirecting}
          >
            <span id="login-btn-label">{isSignup ? 'Create account' : 'Sign In'}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

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
          <a href="#" id="login-forgot" onClick={showForgotMessage}>Forgot password?</a>
          <a href="#" id="login-toggle-mode" onClick={toggleMode}>
            {isSignup ? 'Sign in instead \u2190' : 'Create account \u2192'}
          </a>
        </div>
      </div>
    </div>
  )
}
