/* ================================================================
   GitHub OAuth token exchange — example backend endpoint

   WHY THIS FILE EXISTS
   ---------------------------------------------------------------
   GitHub's OAuth flow is the one sign-in provider CampSpace can't
   finish entirely in the browser. After GitHub redirects the user
   back to github-callback.html with a temporary "code", that code
   has to be swapped for a real access token — and that swap
   requires your GitHub OAuth app's Client Secret. A secret can never
   sit in front-end JavaScript (anyone could open dev tools and steal
   it), so this one step has to run on a server you control instead.

   This file does exactly that swap, and nothing else. It's written
   as a Vercel serverless function, but the logic in the middle
   (the fetch to github.com/login/oauth/access_token) is the same
   no matter where you host it — Netlify Functions, Cloudflare
   Workers, a small Express route, AWS Lambda, etc. all just need
   the request/response wrapped differently.

   DEPLOYING THIS ON VERCEL (the easiest option)
   ---------------------------------------------------------------
   1. Put this file at  api/github-oauth-exchange.js  in a new (or
      existing) Vercel project.
   2. In the Vercel dashboard, add two environment variables:
        GITHUB_CLIENT_ID     = the same Client ID used in oauth-config.js
        GITHUB_CLIENT_SECRET = the Client Secret GitHub gave you
      (Never put the secret in oauth-config.js or any file that ships
      to the browser.)
   3. Deploy. Your endpoint will be:
        https://your-project.vercel.app/api/github-oauth-exchange
   4. Put that URL into github.tokenExchangeUrl in oauth-config.js.

   ADAPTING TO EXPRESS / NODE INSTEAD
   ---------------------------------------------------------------
   Wrap the same logic in a route:
     app.post('/api/github-oauth-exchange', async (req, res) => { ... })
   and read req.body.code / req.body.redirect_uri instead of the
   Vercel-style (req, res) shown below — the fetch to GitHub and the
   response shape stay identical.
   ================================================================ */

export default async function handler(req, res) {
  // Basic CORS so github-callback.html (likely on a different origin
  // than this function) is allowed to call it. Tighten the origin
  // below to your real domain before going to production.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST' });
    return;
  }

  var code = req.body && req.body.code;
  var redirectUri = req.body && req.body.redirect_uri;

  if (!code) {
    res.status(400).json({ error: 'Missing "code"' });
    return;
  }

  try {
    var tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: redirectUri
      })
    });

    var tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      res.status(400).json({ error: tokenData.error_description || 'GitHub did not return an access token' });
      return;
    }

    // Only the access token goes back to the browser — the client
    // secret never leaves this server.
    res.status(200).json({ access_token: tokenData.access_token });
  } catch (err) {
    res.status(500).json({ error: 'Token exchange failed' });
  }
}
