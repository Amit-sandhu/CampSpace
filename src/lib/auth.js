function runAuthScript() {

  var USERS_KEY = "campspace_users";
  var SESSION_KEY = "campspace_session";

  // Get users from browser storage
  function getUsers() {
    var storedText = localStorage.getItem(USERS_KEY);

    if (storedText === null) {
      return {};
    }

    var parsedData = JSON.parse(storedText);
    return parsedData;
  }

  // Save users to browser storage
  function saveUsers(usersObject) {
    var textData = JSON.stringify(usersObject);
    localStorage.setItem(USERS_KEY, textData);
  }

  // Get current login session
  function getSession() {
    var storedSession = localStorage.getItem(SESSION_KEY);

    if (storedSession === null) {
      return null;
    }

    var parsedSession = JSON.parse(storedSession);
    return parsedSession;
  }

  // Save login session
  function setSession(userObject) {
    var sessionData = {
      email: userObject.email,
      name: userObject.name
    };

    var textData = JSON.stringify(sessionData);
    localStorage.setItem(SESSION_KEY, textData);
  }

  // Clear login session (Logout)
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  // Helper function to show messages on the screen instead of using alert()
  function showMessage(textMessage, isError) {
    var messageElement = document.getElementById("login-message");

    if (messageElement !== null) {
      messageElement.textContent = textMessage;

      if (isError === true) {
        messageElement.style.color = "red";
      } else {
        messageElement.style.color = "green";
      }
    }
  }

  // Handle Login Form (login.html)
  var emailInput = document.getElementById("login-email");
  var passwordInput = document.getElementById("login-password");
  var loginButton = document.getElementById("login-btn");

  if (emailInput !== null) {
    if (passwordInput !== null) {
      if (loginButton !== null) {

        loginButton.addEventListener("click", function (event) {
          event.preventDefault();

          var emailValue = emailInput.value;
          var passwordValue = passwordInput.value;

          if (emailValue === "") {
            showMessage("Please enter your email.", true);
            return;
          }

          if (passwordValue === "") {
            showMessage("Please enter your password.", true);
            return;
          }

          var allUsers = getUsers();
          var existingUser = allUsers[emailValue];

          // If user does not exist, create a new account automatically
          if (existingUser === undefined) {
            var newUser = {
              email: emailValue,
              password: passwordValue,
              name: emailValue
            };

            allUsers[emailValue] = newUser;
            saveUsers(allUsers);
            setSession(newUser);

            showMessage("Account created successfully! Redirecting...");
            
            window.setTimeout(function () {
              window.location.href = "main.html";
            }, 1000);

            return;
          }

          // If user exists, check password
          if (existingUser.password !== passwordValue) {
            showMessage("Incorrect password. Try again.", true);
            return;
          }

          // Login successful
          setSession(existingUser);
          showMessage("Login successful! Redirecting...", false);

          window.setTimeout(function () {
            window.location.href = "main.html";
          }, 1000);

        });

      }
    }
  }
}

export { runAuthScript };