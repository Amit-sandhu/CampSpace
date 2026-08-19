/* ================================================================
   CampSpace — Google OAuth
   ================================================================ */

(function () {
    "use strict";

    /*
     * Get Google Client ID from oauth-config.js
     */
    const GOOGLE_CLIENT_ID =
        window.CAMPSPACE_OAUTH_CONFIG?.google?.clientId;


    /* ============================================================
       CHECK CONFIG
       ============================================================ */

    if (!GOOGLE_CLIENT_ID ||
        GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE")) {

        console.error(
            "CampSpace OAuth: Google Client ID is missing."
        );

        return;
    }


    /* ============================================================
       LOAD GOOGLE IDENTITY SERVICES
       ============================================================ */

    function loadGoogleScript() {

        return new Promise((resolve, reject) => {

            /*
             * Already loaded
             */
            if (
                window.google &&
                window.google.accounts &&
                window.google.accounts.id
            ) {
                resolve();
                return;
            }


            /*
             * Check if script already exists
             */
            const existingScript =
                document.querySelector(
                    'script[src="https://accounts.google.com/gsi/client"]'
                );


            if (existingScript) {

                existingScript.addEventListener(
                    "load",
                    resolve
                );

                existingScript.addEventListener(
                    "error",
                    reject
                );

                return;
            }


            /*
             * Create Google script
             */
            const script =
                document.createElement("script");

            script.src =
                "https://accounts.google.com/gsi/client";

            script.async = true;
            script.defer = true;


            script.onload = resolve;

            script.onerror = function () {

                reject(
                    new Error(
                        "Google Identity Services failed to load."
                    )
                );

            };


            document.head.appendChild(script);

        });

    }


    /* ============================================================
       GOOGLE LOGIN CALLBACK
       ============================================================ */

    function handleGoogleLogin(response) {

        console.log(
            "Google login response received."
        );


        if (
            !response ||
            !response.credential
        ) {

            showMessage(
                "Google login failed. Please try again."
            );

            return;
        }


        /*
         * Decode the Google ID token
         */
        const user =
            decodeJwt(response.credential);


        if (!user) {

            showMessage(
                "Unable to read Google account information."
            );

            return;
        }


        console.log(
            "Google user:",
            user
        );


        /*
         * Create CampSpace user
         */
        const campSpaceUser = {

            id: user.sub,

            name:
                user.name ||
                user.given_name ||
                "Google User",

            firstName:
                user.given_name || "",

            lastName:
                user.family_name || "",

            email:
                user.email || "",

            picture:
                user.picture || "",

            provider:
                "google",

            emailVerified:
                user.email_verified === true,

            loginTime:
                new Date().toISOString()

        };


        /*
         * Save user
         */
        localStorage.setItem(
            "campspace_user",
            JSON.stringify(campSpaceUser)
        );


        localStorage.setItem(
            "campspace_logged_in",
            "true"
        );


        localStorage.setItem(
            "campspace_auth_provider",
            "google"
        );


        /*
         * Store Google credential for this browser session
         */
        sessionStorage.setItem(
            "campspace_google_credential",
            response.credential
        );


        console.log(
            "CampSpace Google login successful:",
            campSpaceUser
        );


        /*
         * Notify auth.js / other CampSpace code
         */
        document.dispatchEvent(
            new CustomEvent(
                "campspace:google-login",
                {
                    detail: campSpaceUser
                }
            )
        );


        /*
         * If auth.js provides a callback
         */
        if (
            typeof window.onCampSpaceGoogleLogin ===
            "function"
        ) {

            window.onCampSpaceGoogleLogin(
                campSpaceUser
            );

        }


        /*
         * Redirect after successful login
         *
         * Change this later if your dashboard has
         * another filename.
         */
        window.location.href = "dashboard.html";

    }


    /* ============================================================
       DECODE GOOGLE JWT
       ============================================================ */

    function decodeJwt(token) {

        try {

            const parts =
                token.split(".");

            if (parts.length !== 3) {

                throw new Error(
                    "Invalid JWT"
                );

            }


            const base64Url =
                parts[1];


            const base64 =
                base64Url
                    .replace(/-/g, "+")
                    .replace(/_/g, "/");


            const jsonPayload =
                decodeURIComponent(
                    atob(base64)
                        .split("")
                        .map(function (char) {

                            return (
                                "%" +
                                (
                                    "00" +
                                    char
                                        .charCodeAt(0)
                                        .toString(16)
                                ).slice(-2)
                            );

                        })
                        .join("")
                );


            return JSON.parse(
                jsonPayload
            );

        } catch (error) {

            console.error(
                "CampSpace: JWT decoding failed.",
                error
            );

            return null;
        }

    }


    /* ============================================================
       SHOW LOGIN MESSAGE
       ============================================================ */

    function showMessage(message) {

        const messageElement =
            document.getElementById(
                "login-message"
            );


        if (messageElement) {

            messageElement.textContent =
                message;

        }

    }


    /* ============================================================
       INITIALIZE GOOGLE
       ============================================================ */

    async function initializeGoogleOAuth() {

        try {

            await loadGoogleScript();


            /*
             * Initialize Google
             */
            google.accounts.id.initialize({

                client_id:
                    GOOGLE_CLIENT_ID,

                callback:
                    handleGoogleLogin,

                auto_select:
                    false,

                cancel_on_tap_outside:
                    true

            });


            /*
             * Connect your existing CampSpace
             * Google button.
             */
            const googleButton =
                document.getElementById(
                    "social-google-btn"
                );


            if (!googleButton) {

                console.error(
                    "CampSpace: Google button not found."
                );

                return;
            }


            /*
             * Clicking your button starts
             * Google's login flow.
             */
            googleButton.addEventListener(
                "click",
                function () {

                    console.log(
                        "Opening Google Sign-In..."
                    );


                    google.accounts.id.prompt();

                }
            );


            console.log(
                "CampSpace: Google OAuth initialized."
            );


        } catch (error) {

            console.error(
                "CampSpace: Google OAuth initialization failed.",
                error
            );


            showMessage(
                "Google Sign-In could not be loaded."
            );

        }

    }


    /* ============================================================
       LOGOUT
       ============================================================ */

    function logoutGoogle() {

        if (
            window.google &&
            window.google.accounts &&
            window.google.accounts.id
        ) {

            window.google.accounts.id.disableAutoSelect();

        }


        localStorage.removeItem(
            "campspace_user"
        );

        localStorage.removeItem(
            "campspace_logged_in"
        );

        localStorage.removeItem(
            "campspace_auth_provider"
        );

        sessionStorage.removeItem(
            "campspace_google_credential"
        );

    }


    /* ============================================================
       PUBLIC API
       ============================================================ */

    window.CampSpaceOAuth = {

        google: {

            login:
                initializeGoogleOAuth,

            logout:
                logoutGoogle

        },

        logout:
            logoutGoogle

    };


    /* ============================================================
       START
       ============================================================ */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeGoogleOAuth
        );

    } else {

        initializeGoogleOAuth();

    }

})();
