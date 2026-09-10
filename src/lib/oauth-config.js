/*
 * BEGINNER GUIDE: src/lib/oauth-config.js
 * This file handles the OAuth configuration values.
 * Syllabus topics visible here: props / component composition.
 * The code below keeps the original behaviour; comments explain the main jobs.
 */

// CampSpace login settings


/* ================================================================
   CampSpace — Social sign-in configuration

   Fill in the values below with your own app credentials from each
   provider. Nothing here works "out of the box" — Google, GitHub,
   and Microsoft all require you to register CampSpace as an app on
   their side first and get back an ID that identifies it. That's
   true for every site that offers "Sign in with Google" etc, not
   just this one.

   None of these steps cost money for a project this size.
   ================================================================

   ---------------------------------------------------------------
   GOOGLE  (fully works from the browser alone, no backend needed)
   ---------------------------------------------------------------
   1. Go to https://console.cloud.google.com/apis/credentials
   2. Create a project (or pick an existing one).
   3. "Configure consent screen" if it asks you to (External, fill in
      the basic app name/email fields).
   4. Create Credentials -> OAuth client ID -> Application type:
      "Web application".
   5. Under "Authorized JavaScript origins" add the URL you open
      CampSpace from, e.g. http://localhost:5500 or
      http://127.0.0.1:5500 (Live Server), or your real domain once
      deployed. No redirect URI is needed for this flow.
   6. Copy the "Client ID" (looks like
      1234567890-abc123.apps.googleusercontent.com) into
      google.clientId below.

   ---------------------------------------------------------------
   MICROSOFT  (fully works from the browser alone, no backend needed)
   ---------------------------------------------------------------
   1. Go to https://portal.azure.com -> "Microsoft Entra ID" ->
      "App registrations" -> "New registration".
   2. Name it "CampSpace".
   3. Under "Redirect URI" choose platform "Single-page application
      (SPA)" and enter the exact URL of your login.html page, e.g.
      http://localhost:5500/login.html
   4. After creating it, copy the "Application (client) ID" from the
      Overview page into microsoft.clientId below.

   ---------------------------------------------------------------
   GITHUB  (needs one small backend endpoint — see below)
   ---------------------------------------------------------------
   GitHub's OAuth flow is the one provider here that does NOT support
   signing in purely from browser JavaScript. After GitHub redirects
   back with a temporary "code", exchanging that code for a real
   access token requires your app's Client *Secret*, and secrets can
   never be placed in front-end code that anyone can view — so that
   one step has to happen on a server you control.

   1. Go to https://github.com/settings/developers -> "New OAuth App".
   2. Homepage URL: your site's URL.
   3. Authorization callback URL: the URL of github-callback.html,
      e.g. http://localhost:5500/github-callback.html
   4. Copy the "Client ID" into github.clientId below.
   5. Generate a "Client secret" — keep this ONLY on your server,
      never in this file. Deploy the small example function in
      /backend-examples/github-oauth-exchange.js (works as-is on
      Vercel/Netlify/Cloudflare Workers with minor tweaks — see the
      comments in that file) and put its deployed URL into
      github.tokenExchangeUrl below.

   If you don't want to stand up that endpoint right now, you can
   leave the GitHub button as-is — Google and Microsoft will work
   fully without it.
   ================================================================ */

window.CAMPSPACE_OAUTH_CONFIG = {

  google: {
    clientId: '232874789719-s9r263p286qmj4ee8m1or5n8bfatqdtv.apps.googleusercontent.com'
  },

  microsoft: {
    clientId: '',
    authority: 'https://login.microsoftonline.com/common'
  },

  github: {
    clientId: '',
    redirectUri: window.location.origin + '/?page=github-callback',
    tokenExchangeUrl: ''
  },

  gemini: {
    apiKey: ''
  }

};
