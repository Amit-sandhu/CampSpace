/*
 * BEGINNER GUIDE: src/apps/ai-chat/AIChatApp.jsx
 * This React file defines the AIChatApp component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import { useEffect, useMemo, useState, useRef } from "react";

const RANDOM_PROMPTS = [
  "Explain array destructuring in JS simply.",
  "How do I optimize React render performance?",
  "Write a Python script to filter JSON data.",
  "What is the difference between Flexbox and Grid?",
  "How do Laplace transforms simplify differential equations?",
  "Generate a CSS glassmorphism card layout.",
  "Write a C function to reverse an array in-place."
];

const WELCOME_MESSAGES = [
  "Welcome back. What are we working on today?",
  "Good to see you again. Ready to get something done?",
  "Welcome back — let’s make today a productive one.",
  "Hey, welcome back. I’m here whenever you need me.",
  "Back again? Nice. What’s on your mind?",
  "Welcome back. Pick a problem and let’s solve it together."
];

const SESSIONS_STORAGE_KEY = "campspace-aichat-sessions";
const MAX_HISTORY = 60;
const GEMINI_MODEL = "gemini-3.6-flash";

// BEGINNER: getApiKey()
// This component/function is responsible for the getApiKey part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function getApiKey() {
  const config =
    (window.CAMPSPACE_OAUTH_CONFIG &&
      window.CAMPSPACE_OAUTH_CONFIG.gemini) ||
    {};
  const key = config.apiKey || import.meta.env?.VITE_GEMINI_API_KEY || "";
  if (!key || key === "GEMINI_API_KEY") return "";
  return key;
}

// BEGINNER: getStoredSessions()
// This component/function is responsible for the getStoredSessions part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
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

// BEGINNER: saveStoredSessions()
// This component/function is responsible for the saveStoredSessions part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function saveStoredSessions(sessions) {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Keep app functional if localStorage fails
  }
}

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

async function callGemini(apiKey, history) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    GEMINI_MODEL +
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
    body: JSON.stringify({
      contents,
      generationConfig: {
        maxOutputTokens: 250
      }
    })
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

// BEGINNER: AIChatApp()
// This component/function is responsible for the AIChatApp part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function AIChatApp() {
  const welcome = useMemo(
    () => WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)],
    []
  );

  const [sessions, setSessions] = useState(getStoredSessions);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  const messagesEndRef = useRef(null);

  const windowStyle = useMemo(
    () => ({
      "--mainpage-x": "780px",
      "--mainpage-y": "460px",
      "--mainpage-w": "400px"
    }),
    []
  );

  // Pick 3 random prompt suggestions on load
  useEffect(() => {
    const shuffled = [...RANDOM_PROMPTS].sort(() => 0.5 - Math.random());
    setSuggestedPrompts(shuffled.slice(0, 3));
  }, []);

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

  // Load history when current session ID changes
  useEffect(() => {
    if (!currentSessionId) {
      setHistory([]);
      return;
    }
    const current = sessions.find((s) => s.id === currentSessionId);
    if (current) {
      setHistory(current.messages || []);
    }
  }, [currentSessionId]);

  // Persist sessions whenever they update
  useEffect(() => {
    saveStoredSessions(sessions);
  }, [sessions]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isSending, elapsedTime]);

  async function sendMessage(textToSend) {
    const text = (textToSend || input).trim();
    if (isSending || !text) return;

    const apiKey = getApiKey();
    const nextHistory = [...history, { role: "user", text }];

    let activeSessionId = currentSessionId;

    if (!activeSessionId) {
      activeSessionId = Date.now().toString();
      const newSession = {
        id: activeSessionId,
        title: text.length > 28 ? text.slice(0, 28) + "..." : text,
        messages: nextHistory
      };
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(activeSessionId);
    } else {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, messages: nextHistory } : s
        )
      );
    }

    if (!textToSend) setInput("");
    setHistory(nextHistory);

    if (!apiKey) {
      const errorHistory = [
        ...nextHistory,
        { role: "error", text: "Cami isn’t set up yet :(" }
      ];
      setHistory(errorHistory);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, messages: errorHistory } : s
        )
      );
      return;
    }

    setIsSending(true);

    try {
      const reply = await callGemini(apiKey, nextHistory);
      const finalHistory = [
        ...nextHistory,
        { role: "model", text: reply }
      ].slice(-MAX_HISTORY);

      setHistory(finalHistory);
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === activeSessionId ? { ...s, messages: finalHistory } : s
        )
      );
    } catch (error) {
      const errorHistory = [
        ...nextHistory,
        { role: "error", text: error.message }
      ].slice(-MAX_HISTORY);

      setHistory(errorHistory);
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === activeSessionId ? { ...s, messages: errorHistory } : s
        )
      );
    } finally {
      setIsSending(false);
    }
  }

  // BEGINNER: handleKeyDown()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section
      className="mainpage-window mainpage-window--aichat mainpage-window--hidden"
      data-mainpage-window=""
      data-app="aichat"
      style={windowStyle}
    >
      <header className="mainpage-window-bar" data-mainpage-drag-handle="">
        {/* Semantic header that identifies the top part of this ui section. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <div className="mainpage-traffic-lights">
          {/* Window control buttons for close, minimize, and maximize. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <button
            className="mainpage-tl mainpage-tl--red"
            data-mainpage-action="close"
            aria-label="Close"
          ></button>
          <button
            className="mainpage-tl mainpage-tl--yellow"
            data-mainpage-action="minimize"
            aria-label="Minimize"
          ></button>
          <button
            className="mainpage-tl mainpage-tl--green"
            data-mainpage-action="maximize"
            aria-label="Maximize"
          ></button>
        </div>
        <h2 className="mainpage-window-title">Cami</h2>
      </header>

      <div className="mainpage-window-body mainpage-aichat-body">
        {/* Campus chat interface containing messages and the message input. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}
        <div className="mainpage-aichat-messages">
          {/* Campus chat interface containing messages and the message input. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}
          {history.length === 0 && (
            <div className="cami-welcome" style={{ padding: "12px 0", textAlign: "center" }}>
              {/* Welcome area with the current date and quick actions. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <h2 style={{ fontSize: "1rem", fontWeight: "500", opacity: 0.8 }}>{welcome}</h2>
            </div>
          )}

          {history.map((msg, idx) => (
            <div key={`${idx}-${msg.role}`} className={`cami-msg-row ${msg.role === 'model' ? 'ai' : msg.role}`}>
              <div className={`cami-avatar ${msg.role === 'model' ? 'ai' : msg.role}`}>
                {msg.role === 'model' ? '✦' : msg.role === 'error' ? '!' : 'U'}
              </div>
              {msg.role === "user" ? (
                <div className="cami-msg-bubble">{msg.text}</div>
              ) : (
                <div
                  className="cami-msg-bubble"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(msg.text)
                  }}
                />
              )}
            </div>
          ))}

          {isSending && (
            <div className="cami-msg-row ai">
              <div className="cami-avatar ai">✦</div>
              <div className="cami-msg-bubble typing">
                Thinking ({formatTime(elapsedTime)})...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {history.length === 0 && (
          <div className="cami-prompt-chips">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="cami-chip"
                onClick={() => sendMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="mainpage-aichat-input-row">
          {/* Campus chat interface containing messages and the message input. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Cami..."
            autoComplete="off"
            maxLength={4000}
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={isSending || !input.trim()}
            aria-label="Send"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
