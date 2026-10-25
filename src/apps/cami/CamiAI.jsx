/*
 * BEGINNER GUIDE: src/apps/cami/CamiAI.jsx
 * This React file defines the CamiAI component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  chatDeleted,
  chatSelected,
  chatStarted,
  sendChatMessage
} from "../../store/chatStore.js";
import "./CamiAI.css";

const WELCOME_MESSAGES = [
  "Welcome back. What are we working on today?",
  "Good to see you again. Ready to get something done?",
  "Welcome back — let’s make today a productive one.",
  "Hey, welcome back. I’m here whenever you need me.",
  "Back again? Nice. What’s on your mind?",
  "Welcome back. Pick a problem and let’s solve it together."
];

const GEMINI_MODEL = "gemini-3.8-flash";

// BEGINNER: getApiKey()
// This component/function is responsible for the getApiKey part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function getApiKey() {
  const config =
    (window.CAMPSPACE_OAUTH_CONFIG &&
      window.CAMPSPACE_OAUTH_CONFIG.gemini) ||
    {};
  const key = config.apiKey || "";
  if (!key || key === "GEMINI_API_KEY") return "";
  return key;
}

// Timer Formatter: Converts seconds into "1s", "45s", "1m 5s", etc.
function formatTime(totalSeconds) {
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

// BEGINNER: renderMarkdown()
// This component/function is responsible for the renderMarkdown part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function renderMarkdown(markdown) {
  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  let safe = escapeHtml(markdown || "");
  safe = safe.replace(/`([^`]+)`/g, "<code>$1</code>");
  safe = safe.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  safe = safe.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  safe = safe.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  safe = safe.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");
  safe = safe.replace(/(?<!_)_([^_\n]+)_(?!_)/g, "<em>$1</em>");
  safe = safe.replace(/\n/g, "<br />");
  return safe;
}

// BEGINNER: CamiAI()
// This component/function is responsible for the CamiAI part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function CamiAI() {
  const welcome = useMemo(
    () => WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)],
    []
  );

  // GLOBAL STATE (Redux Toolkit): chat sessions, the open conversation and the
  // loading/error status of the AI request live in src/store/chatStore.js.
  const dispatch = useDispatch();
  const { sessions, currentSessionId, history, status } = useSelector(
    (state) => state.chat
  );
  const isSending = status === "loading";

  // LOCAL STATE (useState): only this screen cares about these.
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  const messagesEndRef = useRef(null);

  // Opening the Cami page always starts on a fresh chat.
  useEffect(() => {
    dispatch(chatStarted());
  }, [dispatch]);

  // Timer interval hook triggered when isSending changes
  useEffect(() => {
    let timerId;
    if (isSending) {
      setElapsedTime(0);
      timerId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isSending]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isSending, elapsedTime]);

  // BEGINNER: startNewChat()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  const startNewChat = () => {
    dispatch(chatStarted());
    setInput("");
  };

  const selectSession = (id) => {
    dispatch(chatSelected(id));
  };

  // BEGINNER: deleteSession()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  const deleteSession = (id, e) => {
    e.stopPropagation();
    dispatch(chatDeleted(id));
    if (currentSessionId === id) setInput("");
  };

  // Dispatching the async thunk starts the request; the store moves
  // status idle -> loading -> succeeded/failed and adds the reply or error.
  function sendMessage() {
    if (isSending || !input.trim()) return;

    dispatch(
      sendChatMessage({ text: input.trim(), apiKey: getApiKey(), model: GEMINI_MODEL })
    );
    setInput("");
  }

  return (
    <section className="cami-page">
      {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
      <aside className={`cami-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        {/* Secondary sidebar/aside content that supports the main page. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <div className="cami-sidebar-top">
          {/* Sidebar navigation used to move between campspace applications. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <button
            className="cami-icon-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Toggle Sidebar"
          >
            ☰
          </button>
          <button className="cami-new-chat-btn" onClick={startNewChat}>
            <span className="plus-icon">+</span>
            {isSidebarOpen && <span>New chat</span>}
          </button>
        </div>

        {isSidebarOpen && (
          <div className="cami-history-list">
            <div className="cami-history-title">Recent</div>
            {sessions.length === 0 ? (
              <div className="cami-no-history">No recent chats</div>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  className={`cami-history-item ${
                    s.id === currentSessionId ? "active" : ""
                  }`}
                  onClick={() => selectSession(s.id)}
                >
                  <span className="cami-chat-icon">💬</span>
                  <span className="cami-chat-title">{s.title}</span>
                  <button
                    className="cami-delete-btn"
                    onClick={(e) => deleteSession(s.id, e)}
                    title="Delete Chat"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </aside>

      <div className="cami-main">
        <header className="cami-brand">
          {/* Semantic header that identifies the top part of this ui section. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <span className="cami-brand-icon">✦</span>
          <span className="cami-brand-title">Cami</span>
        </header>

        <div className="cami-container">
          <main className="cami-chat">
            {/* Main semantic container for the primary page content. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}
            {history.length === 0 && (
              <div className="cami-welcome">
                {/* Welcome area with the current date and quick actions. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
                <h2>{welcome}</h2>
              </div>
            )}

            <div className="cami-messages">
              {history.map((message, index) => (
                <div
                  key={`${index}-${message.role}`}
                  className={`cami-message-row cami-row-${message.role}`}
                >
                  {message.role === "user" ? (
                    <div className="cami-user-box">{message.text}</div>
                      /* User/profile area displaying account information or controls. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */
                  ) : (
                    <div
                      className="cami-model-text"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(message.text)
                      }}
                    />
                  )}
                </div>
              ))}

              {isSending && (
                <div className="cami-message-row cami-row-model">
                  <div className="cami-model-text cami-thinking">
                    Thinking ({formatTime(elapsedTime)})...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </main>

          <div className="cami-input-container">
            <div className="cami-input-box">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask Cami..."
                rows={1}
                maxLength={4000}
              />
              <button
                type="button"
                className="cami-send-btn"
                onClick={sendMessage}
                disabled={isSending || !input.trim()}
                aria-label="Send message"
              >
                ↑
              </button>
            </div>
            <div className="cami-disclaimer">
              Cami is an AI and can make mistakes.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
