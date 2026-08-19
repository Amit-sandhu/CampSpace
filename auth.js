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

    // Optional extras from social sign-in (not present for plain
    // email/password accounts).
    if (user.picture) {
      sessionData.picture = user.picture;
    }
    if (user.provider) {
      sessionData.provider = user.provider;
    }

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

    /* -------------------------------------------------------
       Social sign-in: Google, Microsoft, GitHub

       These read their app credentials from oauth-config.js
       (window.CAMPSPACE_OAUTH_CONFIG). Until real values are filled
       in there, each button explains what's missing instead of
       silently failing.
       ------------------------------------------------------- */
    var oauthConfig = window.CAMPSPACE_OAUTH_CONFIG || {};

    function isPlaceholder(value) {
      return !value || value.indexOf('YOUR_') === 0 || value.indexOf('YOUR-') !== -1;
    }

    function loadScriptOnce(src, onReady) {
      var existing = document.querySelector('script[data-campspace-src="' + src + '"]');
      if (existing) {
        if (existing.getAttribute('data-loaded') === 'true') {
          onReady();
        } else {
          existing.addEventListener('load', onReady);
        }
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-campspace-src', src);
      script.addEventListener('load', function () {
        script.setAttribute('data-loaded', 'true');
        onReady();
      });
      script.addEventListener('error', function () {
        showMessage('Could not reach ' + src + '. Check your internet connection.', true);
      });
      document.head.appendChild(script);
    }

    function finishSocialSignIn(email, name, picture, provider) {
      var users = getUsers();
      var existingUser = users[email] || {};

      var user = {
        email: email,
        name: name || existingUser.name || nameFromEmail(email),
        password: existingUser.password || null, // social accounts have no local password
        picture: picture || existingUser.picture,
        provider: provider
      };

      users[email] = user;
      saveUsers(users);
      setSession(user);
      redirectToDashboard();
    }

    /* ---- Google ---- */
    var googleBtn = document.getElementById('social-google-btn');
    if (googleBtn) {
      googleBtn.addEventListener('click', function () {
        var config = oauthConfig.google || {};
        if (isPlaceholder(config.clientId)) {
          showMessage('Google sign-in needs a Client ID in oauth-config.js first.', true);
          return;
        }

        showMessage('Opening Google sign-in\u2026', false);

        loadScriptOnce('https://accounts.google.com/gsi/client', function () {
          var tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: config.clientId,
            scope: 'openid email profile',
            callback: function (tokenResponse) {
              if (!tokenResponse || tokenResponse.error) {
                showMessage('Google sign-in was cancelled or failed.', true);
                return;
              }

              fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: 'Bearer ' + tokenResponse.access_token }
              })
                .then(function (response) { return response.json(); })
                .then(function (profile) {
                  finishSocialSignIn(profile.email, profile.name, profile.picture, 'google');
                })
                .catch(function () {
                  showMessage('Signed in, but could not load your Google profile.', true);
                });
            }
          });

          tokenClient.requestAccessToken();
        });
      });
    }

    /* ---- Microsoft ---- */
    var microsoftBtn = document.getElementById('social-microsoft-btn');
    if (microsoftBtn) {
      microsoftBtn.addEventListener('click', function () {
        var config = oauthConfig.microsoft || {};
        if (isPlaceholder(config.clientId)) {
          showMessage('Microsoft sign-in needs an Application (client) ID in oauth-config.js first.', true);
          return;
        }

        showMessage('Opening Microsoft sign-in\u2026', false);

        loadScriptOnce('https://alcdn.msauth.net/browser/2.35.0/js/msal-browser.min.js', function () {
          var msalInstance = new msal.PublicClientApplication({
            auth: {
              clientId: config.clientId,
              authority: config.authority || 'https://login.microsoftonline.com/common'
            }
          });

          msalInstance.loginPopup({ scopes: ['User.Read'] })
            .then(function (response) {
              var account = response.account || {};
              var email = account.username;
              var name = account.name;
              finishSocialSignIn(email, name, null, 'microsoft');
            })
            .catch(function (error) {
              showMessage('Microsoft sign-in was cancelled or failed.', true);
            });
        });
      });
    }

    /* ---- GitHub ----
       GitHub's OAuth flow needs a server to exchange the temporary
       code for an access token (that step requires a Client Secret,
       which can never live in front-end code). This button starts
       the flow; github-callback.html finishes it. See
       oauth-config.js for setup steps. */
    var githubBtn = document.getElementById('social-github-btn');
    if (githubBtn) {
      githubBtn.addEventListener('click', function () {
        var config = oauthConfig.github || {};
        if (isPlaceholder(config.clientId)) {
          showMessage('GitHub sign-in needs a Client ID in oauth-config.js first.', true);
          return;
        }
        if (isPlaceholder(config.tokenExchangeUrl)) {
          showMessage('GitHub sign-in also needs a backend token-exchange URL \u2014 see oauth-config.js.', true);
          return;
        }

        var state = String(Date.now()) + '-' + Math.random().toString(36).slice(2);
        sessionStorage.setItem('campspace_github_oauth_state', state);

        var authorizeUrl = 'https://github.com/login/oauth/authorize'
          + '?client_id=' + encodeURIComponent(config.clientId)
          + '&redirect_uri=' + encodeURIComponent(config.redirectUri)
          + '&scope=' + encodeURIComponent('read:user user:email')
          + '&state=' + encodeURIComponent(state);

        window.location.href = authorizeUrl;
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

      if (session.picture) {
        avatarBtn.textContent = '';
        avatarBtn.style.backgroundImage = 'url(' + session.picture + ')';
        avatarBtn.style.backgroundSize = 'cover';
        avatarBtn.style.backgroundPosition = 'center';
      } else {
        avatarBtn.textContent = initialsFor(displayName);
      }

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
