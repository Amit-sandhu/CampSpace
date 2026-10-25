/*
 * REDUX TOOLKIT + ASYNC STATE (FEE topics: global state / Redux Toolkit /
 * async state and loading-error handling)
 *
 * ONE store is shared by BOTH chat screens (Cami AI page and the AI Chat
 * window on the dashboard). Before this, each screen kept its own copy of the
 * same useState code. Now:
 *   - sessions / currentSessionId / history  -> GLOBAL state (this slice)
 *   - status / error                         -> ASYNC state of the AI request
 *   - the text being typed, sidebar open...  -> LOCAL state inside each screen
 *
 * status follows the usual 3-step lifecycle of an async request:
 *   "idle" -> "loading" (pending) -> "succeeded" (fulfilled) | "failed" (rejected)
 * createAsyncThunk dispatches pending / fulfilled / rejected for us, so the UI
 * only has to read `status` to show "Thinking..." or an error message.
 */
import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const SESSIONS_STORAGE_KEY = "campspace-aichat-sessions";
const MAX_HISTORY = 60;
const NO_KEY_MESSAGE = "Cami isn’t set up yet :(";

// ---- Browser storage helpers (chat sessions survive a page refresh) ----
function getStoredSessions() {
  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredSessions(sessions) {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Keep the app working if localStorage is unavailable.
  }
}

// ---- The network call (fetch + async/await) ----
async function callGemini(apiKey, model, history) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    model +
    ":generateContent?key=" +
    encodeURIComponent(apiKey);

  const contents = history
    .filter((message) => message.role === "user" || message.role === "model")
    .map((message) => ({
      role: message.role,
      parts: [{ text: message.text }]
    }));

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 250 } })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      (data && data.error && data.error.message) ||
        "The AI request failed. Check the API key."
    );
  }

  const parts =
    data &&
    data.candidates &&
    data.candidates[0] &&
    data.candidates[0].content &&
    data.candidates[0].content.parts;

  const text = parts ? parts.map((part) => part.text || "").join("") : "";

  if (!text) {
    throw new Error("No response was returned. Try rephrasing your message.");
  }

  return text;
}

// Adds one message to a session (and to the open conversation if it is the
// one on screen). Keeps only the newest MAX_HISTORY messages.
function appendMessage(state, sessionId, message) {
  const session = state.sessions.find((item) => item.id === sessionId);
  if (!session) return; // the chat was deleted while the reply was loading
  const next = [...session.messages, message].slice(-MAX_HISTORY);
  session.messages = next;
  if (state.currentSessionId === sessionId) state.history = next;
}

const initialState = {
  sessions: getStoredSessions(),
  currentSessionId: null,
  history: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null
};

// ASYNC THUNK: add the user's message, call the AI, return the reply.
// `condition` blocks a second request while one is still loading.
export const sendChatMessage = createAsyncThunk(
  "chat/sendChatMessage",
  async ({ text, apiKey, model }, { dispatch, getState, rejectWithValue }) => {
    dispatch(userMessageAdded(text));
    const { currentSessionId: sessionId, history } = getState().chat;

    if (!apiKey) {
      return rejectWithValue({ sessionId, message: NO_KEY_MESSAGE });
    }

    try {
      const reply = await callGemini(apiKey, model, history);
      return { sessionId, reply };
    } catch (error) {
      return rejectWithValue({ sessionId, message: error.message });
    }
  },
  { condition: (_arg, { getState }) => getState().chat.status !== "loading" }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    chatStarted(state) {
      state.currentSessionId = null;
      state.history = [];
    },
    chatSelected(state, action) {
      const session = state.sessions.find((item) => item.id === action.payload);
      state.currentSessionId = action.payload;
      if (session) state.history = session.messages || [];
    },
    chatDeleted(state, action) {
      state.sessions = state.sessions.filter((item) => item.id !== action.payload);
      if (state.currentSessionId === action.payload) {
        state.currentSessionId = null;
        state.history = [];
      }
    },
    userMessageAdded(state, action) {
      const text = action.payload;
      const message = { role: "user", text };

      if (!state.currentSessionId) {
        const id = Date.now().toString();
        const messages = [message];
        state.sessions.unshift({
          id,
          title: text.length > 28 ? text.slice(0, 28) + "..." : text,
          messages
        });
        state.currentSessionId = id;
        state.history = messages;
      } else {
        appendMessage(state, state.currentSessionId, message);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        appendMessage(state, action.payload.sessionId, {
          role: "model",
          text: action.payload.reply
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        const message = action.payload?.message || action.error.message;
        state.status = "failed";
        state.error = message;
        if (action.payload?.sessionId) {
          appendMessage(state, action.payload.sessionId, { role: "error", text: message });
        }
      });
  }
});

export const { chatStarted, chatSelected, chatDeleted, userMessageAdded } = chatSlice.actions;

export const chatStore = configureStore({
  reducer: { chat: chatSlice.reducer }
});

// Persist the chat list to localStorage whenever it changes.
let lastSavedSessions = chatStore.getState().chat.sessions;
chatStore.subscribe(() => {
  const { sessions } = chatStore.getState().chat;
  if (sessions !== lastSavedSessions) {
    lastSavedSessions = sessions;
    saveStoredSessions(sessions);
  }
});
