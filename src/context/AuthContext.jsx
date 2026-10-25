/*
 * CONTEXT API (FEE topic: Context API / global vs local state)
 * "Who is signed in?" is needed by many unrelated components (the route guard,
 * the sidebar, ...). Passing it down as props through every level (prop drilling)
 * would be noisy, so it lives in a Context: <AuthProvider> fills the shared box
 * once in App.jsx and any child reads it with the useAuth() hook.
 *
 * GLOBAL vs LOCAL state in CampSpace:
 *   global (Context / Redux) -> signed-in user, chat sessions
 *   local  (useState)        -> things only one component cares about (is the
 *                               sidebar open? what is typed in the input box?)
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const SESSION_KEY = "campspace_session";

const AuthContext = createContext(null);

// The login page stores { email, name, ... } as JSON under SESSION_KEY.
function readSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return saved && saved.email ? saved : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const refreshUser = useCallback(() => setUser(readSession()), []);

  const logout = useCallback(() => {
    if (window.CampSpaceAuth?.clearSession) {
      window.CampSpaceAuth.clearSession();
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    setUser(null);
  }, []);

  // Keep the context in sync if the session changes in another tab.
  useEffect(() => {
    window.addEventListener("storage", refreshUser);
    return () => window.removeEventListener("storage", refreshUser);
  }, [refreshUser]);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), logout, refreshUser }),
    [user, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth() must be used inside <AuthProvider>.");
  }
  return context;
}
