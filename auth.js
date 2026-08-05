/* ================================================================
   CampSpace - Client-side authentication (prototype layer)

   There is no real server yet, so this file "fakes" a login system
   using localStorage (a small storage area built into the browser):

     - "sign up" saves { email, password, name } into campspace_users
     - "sign in" checks the email/password and starts a session
     - on success, login.html sends the browser to main.html
     - main.html reads the session, if there is one, to show the
       right name/initials and to show a logout button

   NOTE: passwords are stored as plain text in localStorage. This is
   only OK for a local practice project. A real app must never do
   this - it should check passwords on a server instead.

   This file is written in a simple, beginner-friendly style:
     - normal "for" loops instead of forEach/map
     - normal "if / else" instead of the ? : shortcut
     - plain functions that are declared and then called,
       instead of the "immediately invoked function" trick
   ================================================================ */

function runAuthScript() {

  var USERS_KEY = 'campspace_users';
  var SESSION_KEY = 'campspace_session';

  /* ---------------------------------------------------------
     Storage helpers
     --------------------------------------------------------- */
  function getUsers() {
    var storedText = localStorage.getItem(USERS_KEY);

    if (!storedText) {
      return {};
    }

    try {
      var parsed = JSON.parse(storedText);
      if (parsed) {
        return parsed;
      }
      return {};
    } catch (error) {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSession() {
    var storedText = localStorage.getItem(SESSION_KEY);

    if (!storedText) {
      return null;
    }

    try {
      return JSON.parse(storedText);
    } catch (error) {
      return null;
    }
  }

  function setSession(user) {
    var sessionData = {
      email: user.email,
      name: user.name,
      loginAt: Date.now()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function nameFromEmail(email) {
    var parts = email.split('@');
    var local = parts[0];

    if (!local) {
      return 'there';
    }

    var firstLetter = local.charAt(0).toUpperCase();
    var restOfName = local.slice(1);
    return firstLetter + restOfName;
  }

  function initialsFor(name) {
    var text = String(name || '').trim();

    if (text.length === 0) {
      return 'CS';
    }

    var rawParts = text.split(/\s+/);
    var parts = [];
    for (var i = 0; i < rawParts.length; i++) {
      if (rawParts[i].length > 0) {
        parts.push(rawParts[i]);
      }
    }

    if (parts.length === 0) {
      return 'CS';
    }

    var initials = parts[0].charAt(0);
    if (parts.length > 1) {
      var lastPart = parts[parts.length - 1];
      initials = initials + lastPart.charAt(0);
    }

    return initials.toUpperCase();
  }

  // Made available in case other scripts need it later.
  window.CampSpaceAuth = {
    getUsers: getUsers,
    saveUsers: saveUsers,
    getSession: getSession,
    setSession: setSession,
    clearSession: clearSession,
    nameFromEmail: nameFromEmail,
    initialsFor: initialsFor
  };

  /* ============================================================
     PAGE: login.html
     ============================================================ */
  var emailInput = document.getElementById('login-email');
  var passwordInput = document.getElementById('login-password');

  if (emailInput && passwordInput) {
    var loginBtn = document.getElementById('login-btn');
    var loginBtnLabel = document.getElementById('login-btn-label');
    var messageEl = document.getElementById('login-message');
    var toggleLink = document.getElementById('login-toggle-mode');
    var forgotLink = document.getElementById('login-forgot');
    var eyeIcon = document.getElementById('login-eye-toggle');
    var heading = document.getElementById('login-heading');
    var subtitle = document.getElementById('login-subtitle');

    var mode = 'signin'; // can be 'signin' or 'signup'

    function showMessage(text, isError) {
      if (!messageEl) {
        return;
      }

      messageEl.textContent = text;

      if (isError) {
        messageEl.classList.add('login-message--error');
      } else {
        messageEl.classList.remove('login-message--error');
      }

      if (text) {
        messageEl.classList.add('login-message--visible');
      } else {
        messageEl.classList.remove('login-message--visible');
      }
    }

    function setMode(nextMode) {
      mode = nextMode;

      if (mode === 'signup') {
        if (heading) {
          heading.textContent = 'Create your account';
        }
        if (subtitle) {
          subtitle.textContent = 'Set a password to start using CampSpace';
        }
        if (loginBtnLabel) {
          loginBtnLabel.textContent = 'Create account';
        }
        if (toggleLink) {
          toggleLink.textContent = 'Sign in instead \u2190';
        }
      } else {
        if (heading) {
          heading.textContent = 'Welcome back';
        }
        if (subtitle) {
          subtitle.textContent = 'Sign in to continue to your workspace';
        }
        if (loginBtnLabel) {
          loginBtnLabel.textContent = 'Sign In';
        }
        if (toggleLink) {
          toggleLink.textContent = 'Create account \u2192';
        }
      }

      showMessage('', false);
    }

    if (toggleLink) {
      toggleLink.addEventListener('click', function (event) {
        event.preventDefault();
        if (mode === 'signup') {
          setMode('signin');
        } else {
          setMode('signup');
        }
      });
    }

    if (forgotLink) {
      forgotLink.addEventListener('click', function (event) {
        event.preventDefault();
        showMessage("Password reset isn't available in this preview yet.", false);
      });
    }

    if (eyeIcon) {
      eyeIcon.addEventListener('click', function () {
        var showingPassword = passwordInput.type === 'password';

        if (showingPassword) {
          passwordInput.type = 'text';
          eyeIcon.classList.remove('fa-eye');
          eyeIcon.classList.add('fa-eye-slash');
        } else {
          passwordInput.type = 'password';
          eyeIcon.classList.add('fa-eye');
          eyeIcon.classList.remove('fa-eye-slash');
        }
      });
    }

    var socialButtons = document.querySelectorAll('.socials button');
    for (var s = 0; s < socialButtons.length; s++) {
      socialButtons[s].addEventListener('click', function () {
        showMessage('Social sign-in is coming soon.', false);
      });
    }

    function redirectToDashboard() {
      if (loginBtn) {
        loginBtn.disabled = true;
      }

      showMessage('Success \u2014 redirecting\u2026', false);

      window.setTimeout(function () {
        window.location.href = 'main.html';
      }, 350);
    }

    function handleSubmit() {
      var email = emailInput.value.trim().toLowerCase();
      var password = passwordInput.value;

      if (!email || !password) {
        showMessage('Enter both an email and a password.', true);
        return;
      }

      // This checks the email looks like "something@something.something"
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showMessage('Enter a valid email address.', true);
        return;
      }

      if (password.length < 4) {
        showMessage('Password must be at least 4 characters.', true);
        return;
      }

      var users = getUsers();

      if (mode === 'signup') {
        if (users[email]) {
          showMessage('An account with that email already exists \u2014 sign in instead.', true);
          return;
        }

        var newUser = {
          email: email,
          password: password,
          name: nameFromEmail(email)
        };

        users[email] = newUser;
        saveUsers(users);
        setSession(newUser);
        redirectToDashboard();
        return;
      }

      var existingUser = users[email];
      if (!existingUser || existingUser.password !== password) {
        showMessage('Incorrect email or password.', true);
        return;
      }

      setSession(existingUser);
      redirectToDashboard();
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', function (event) {
        event.preventDefault();
        handleSubmit();
      });
    }

    passwordInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
      }
    });

    emailInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        passwordInput.focus();
      }
    });
  }

  /* ============================================================
     PAGE: main.html (dashboard)
     ============================================================ */
  var avatarBtn = document.getElementById('mainpage-avatar-btn');

  if (avatarBtn) {
    var session = getSession();
    var accountWrap = document.getElementById('mainpage-account');
    var menu = document.getElementById('mainpage-account-menu');
    var menuName = document.getElementById('mainpage-account-name');
    var menuEmail = document.getElementById('mainpage-account-email');
    var logoutBtn = document.getElementById('mainpage-logout-btn');
    var signinLink = document.getElementById('mainpage-signin-link');

    if (session) {
      var displayName = session.name || nameFromEmail(session.email);
      avatarBtn.textContent = initialsFor(displayName);

      if (menuName) {
        menuName.textContent = displayName;
      }
      if (menuEmail) {
        menuEmail.textContent = session.email;
      }
      if (logoutBtn) {
        logoutBtn.style.display = '';
      }
      if (signinLink) {
        signinLink.style.display = 'none';
      }
    } else {
      // No session found on this page load. We still show the
      // dashboard, just with a generic avatar instead of
      // forcing the user back to the login page.
      avatarBtn.textContent = 'CS';

      if (menuName) {
        menuName.textContent = 'Not signed in';
      }
      if (menuEmail) {
        menuEmail.textContent = '';
      }
      if (logoutBtn) {
        logoutBtn.style.display = 'none';
      }
      if (signinLink) {
        signinLink.style.display = '';
      }
    }

    function closeMenu() {
      if (menu) {
        menu.classList.remove('mainpage-account-menu--open');
      }
      avatarBtn.setAttribute('aria-expanded', 'false');
    }

    avatarBtn.addEventListener('click', function (event) {
      event.stopPropagation();

      var isCurrentlyOpen = menu && menu.classList.contains('mainpage-account-menu--open');
      var willOpen = !isCurrentlyOpen;

      if (menu) {
        menu.classList.toggle('mainpage-account-menu--open');
      }

      if (willOpen) {
        avatarBtn.setAttribute('aria-expanded', 'true');
      } else {
        avatarBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', function (event) {
      if (accountWrap && !accountWrap.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        clearSession();
        window.location.href = 'login.html';
      });
    }
  }
}

runAuthScript();
