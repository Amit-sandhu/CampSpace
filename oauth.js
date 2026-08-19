/* ================================================================
   CampSpace - Google OAuth

   This file handles Google Sign-In for the custom CampSpace
   Google button.

   oauth-config.js MUST be loaded before this file.
   ================================================================ */

(function () {
  'use strict';

  /* -------------------------------------------------------------
     Get Google Client ID from oauth-config.js
     ------------------------------------------------------------- */

  var oauthConfig = window.CAMPSPACE_OAUTH_CONFIG || {};
  var googleConfig = oauthConfig.google || {};
  var clientId = googleConfig.clientId;


  /* -------------------------------------------------------------
     Check whether Client ID exists
     ------------------------------------------------------------- */

  function isPlaceholder(value) {
    if (!value) {
      return true;
    }

    if (value.indexOf('YOUR_') === 0) {
      return true;
    }

    if (value.indexOf('YOUR-') !== -1) {
      return true;
    }

    return false;
  }


  /* -------------------------------------------------------------
     Show message on login page
     ------------------------------------------------------------- */

  function showMessage(text, isError) {
    var messageEl = document.getElementById('login-message');

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


  /* -------------------------------------------------------------
     Load Google Identity Services
     ------------------------------------------------------------- */

  function loadGoogleScript(onReady) {

    var src = 'https://accounts.google.com/gsi/client';

    /*
     * Google library already loaded
     */
    if (
      window.google &&
      window.google.accounts &&
      window.google.accounts.id
    ) {
      onReady();
      return;
    }


    /*
     * Check if another script is already loading it
     */
    var existingScript =
      document.querySelector(
        'script[data-campspace-google-oauth="true"]'
      );


    if (existingScript) {

      existingScript.addEventListener(
        'load',
        onReady
      );

      existingScript.addEventListener(
        'error',
        function () {
          showMessage(
            'Could not load Google Sign-In.',
            true
          );
        }
      );

      return;
    }


    /*
     * Create Google script
     */
    var script =
      document.createElement('script');

    script.src = src;
    script.async = true;
    script.defer = true;

    script.setAttribute(
      'data-campspace-google-oauth',
      'true'
    );


    script.addEventListener(
      'load',
      function () {

        if (
          window.google &&
          window.google.accounts &&
          window.google.accounts.id
        ) {
          onReady();
        } else {
          showMessage(
            'Google Sign-In loaded incorrectly.',
            true
          );
        }

      }
    );


    script.addEventListener(
      'error',
      function () {

        showMessage(
          'Could not reach Google Sign-In. Check your internet connection.',
          true
        );

      }
    );


    document.head.appendChild(script);
  }


  /* -------------------------------------------------------------
     Decode Google ID token
     ------------------------------------------------------------- */

  function decodeJwt(token) {

    try {

      var parts = token.split('.');

      if (parts.length !== 3) {
        return null;
      }


      var base64Url = parts[1];

      var base64 =
        base64Url
          .replace(/-/g, '+')
          .replace(/_/g, '/');


      /*
       * Add missing Base64 padding
       */
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }


      var binary =
        atob(base64);


      var bytes = '';

      for (var i = 0; i < binary.length; i++) {

        bytes +=
          '%' +
          ('00' + binary.charCodeAt(i).toString(16))
            .slice(-2);

      }


      var jsonPayload =
        decodeURIComponent(bytes);


      return JSON.parse(jsonPayload);

    } catch (error) {

      console.error(
        'CampSpace Google OAuth: Could not decode token.',
        error
      );

      return null;
    }
  }


  /* -------------------------------------------------------------
     Google login successful
     ------------------------------------------------------------- */

  function handleGoogleCredential(response) {

    if (
      !response ||
      !response.credential
    ) {

      showMessage(
        'Google sign-in failed. Please try again.',
        true
      );

      return;
    }


    /*
     * Decode Google's ID token
     */
    var profile =
      decodeJwt(response.credential);


    if (!profile) {

      showMessage(
        'Could not read your Google account information.',
        true
      );

      return;
    }


    /*
     * Make sure an email was returned
     */
    if (!profile.email) {

      showMessage(
        'Google did not provide an email address.',
        true
      );

      return;
    }


    console.log(
      'CampSpace Google profile:',
      profile
    );


    /* -----------------------------------------------------------
       Create CampSpace user
       ----------------------------------------------------------- */

    var email =
      profile.email.toLowerCase();

    var name =
      profile.name ||
      profile.given_name ||
      'CampSpace User';

    var picture =
      profile.picture || '';


    var users =
      window.CampSpaceAuth.getUsers();


    var existingUser =
      users[email] || {};


    var user = {

      email: email,

      name:
        name ||
        existingUser.name ||
        window.CampSpaceAuth.nameFromEmail(email),

      /*
       * Google accounts don't use the CampSpace
       * local password.
       */
      password:
        existingUser.password || null,

      picture:
        picture ||
        existingUser.picture ||
        null,

      provider:
        'google'

    };


    /*
     * Save / update user
     */
    users[email] = user;

    window.CampSpaceAuth.saveUsers(users);


    /*
     * Create CampSpace session
     */
    window.CampSpaceAuth.setSession(user);


    /*
     * Store Google credential for this browser session.
     *
     * Important:
     * This is only being kept because this is currently
     * a client-side prototype.
     */
    sessionStorage.setItem(
      'campspace_google_credential',
      response.credential
    );


    showMessage(
      'Success — redirecting…',
      false
    );


    /*
     * Redirect to the same dashboard used by
     * normal email/password login.
     */
    window.setTimeout(
      function () {

        window.location.href =
          'main.html';

      },
      350
    );
  }


  /* -------------------------------------------------------------
     Initialize Google
     ------------------------------------------------------------- */

  function initializeGoogleOAuth() {

    /*
     * Make sure Client ID exists
     */
    if (isPlaceholder(clientId)) {

      console.error(
        'CampSpace Google OAuth: Client ID is missing.'
      );

      return;
    }


    /*
     * Find your existing CampSpace Google button
     */
    var googleBtn =
      document.getElementById(
        'social-google-btn'
      );


    if (!googleBtn) {

      /*
       * This is fine if we're not on the login page.
       */
      return;
    }


    /*
     * Load Google's library
     */
    loadGoogleScript(
      function () {

        /*
         * Initialize Google Identity Services
         */
        google.accounts.id.initialize({

          client_id: clientId,

          callback:
            handleGoogleCredential,

          auto_select: false,

          cancel_on_tap_outside: true

        });


        /*
         * Connect Google's authentication to
         * your existing CampSpace button.
         */
        googleBtn.addEventListener(
          'click',
          function () {

            showMessage(
              'Opening Google sign-in…',
              false
            );


            /*
             * Open Google One Tap / account selector
             */
            google.accounts.id.prompt(
              function (notification) {

                /*
                 * If Google cannot display the prompt,
                 * give a useful message.
                 */
                if (
                  notification.isNotDisplayed() ||
                  notification.isSkippedMoment()
                ) {

                  console.log(
                    'Google prompt was not displayed.'
                  );

                }

              }
            );

          }
        );


        console.log(
          'CampSpace: Google OAuth initialized successfully.'
        );

      }
    );
  }


  /* -------------------------------------------------------------
     Start OAuth after page is ready
     ------------------------------------------------------------- */

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initializeGoogleOAuth
    );

  } else {

    initializeGoogleOAuth();

  }

})();
