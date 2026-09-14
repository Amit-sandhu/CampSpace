import { useEffect, useMemo, useState, useRef } from "react";
import "./CamiAI.css";

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
const GEMINI_MODEL = "gemini-3.8-flash";

// Get API key from browser global settings
function getApiKey() {
  if (window.CAMPSPACE_OAUTH_CONFIG && window.CAMPSPACE_OAUTH_CONFIG.gemini) {
    const key = window.CAMPSPACE_OAUTH_CONFIG.gemini.apiKey;
    if (key && key !== "GEMINI_API_KEY") {
      return key;
    }
  }
  return "";
}

// Load saved chat sessions from browser storage
function getStoredSessions() {
  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    return [];
  }
}

// Save chat sessions to browser storage
function saveStoredSessions(sessions) {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    // Ignore storage errors so app stays functional
  }
}

// Format seconds into readable time (e.g., "5s", "1m 10s")
function formatTime(totalSeconds) {
  if (totalSeconds < 60) {
    return totalSeconds + "s";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (seconds > 0) {
    return minutes + "m " + seconds + "s";
  }
  return minutes + "m";
}

// Simple text formatter for code tags, bold, and line breaks
function renderMarkdown(markdown) {
  if (!markdown) return "";
  
  let safe = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  safe = safe.replace(/`([^`]+)`/g, "<code>$1</code>");
  safe = safe.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  safe = safe.replace(/\n/g, "<br />");
  
  return safe;
}

// Call the Gemini API server
async function callGemini(apiKey, history) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODEL + ":generateContent?key=" + encodeURIComponent(apiKey);

  const contents = [];
  for (let i = 0; i < history.length; i++) {
    const msg = history[i];
    if (msg.role === "user" || msg.role === "model") {
      contents.push({
        role: msg.role,
        parts: [{ text: msg.text }]
      });
    }
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: contents,
      generationConfig: {
        maxOutputTokens: 250
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data && data.error && data.error.message;
    throw new Error(errorMsg || "The AI request failed. Check the API key.");
  }

  if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
    const parts = data.candidates[0].content.parts;
    if (parts && parts[0] && parts[0].text) {
      return parts[0].text;
    }
  }

  throw new Error("No response was returned. Try rephrasing your message.");
}

export default function CamiAI() {
  const welcome = useMemo(function() {
    const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
    return WELCOME_MESSAGES[randomIndex];
  }, []);

  const [sessions, setSessions] = useState(getStoredSessions);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  const messagesEndRef = useRef(null);

  // Timer interval while waiting for AI response
  useEffect(function() {
    let timerId;
    if (isSending) {
      setElapsedTime(0);
      timerId = setInterval(function() {
        setElapsedTime(function(prev) {
          return prev + 1;
        });
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return function() {
      if (timerId) clearInterval(timerId);
    };
  }, [isSending]);

  // Load chat messages when active session changes
  useEffect(function() {
    if (!currentSessionId) {
      setHistory([]);
      return;
    }
    const current = sessions.find(function(s) {
      return s.id === currentSessionId;
    });
    if (current) {
      setHistory(current.messages || []);
    }
  }, [currentSessionId, sessions]);

  // Save sessions to local storage whenever they update
  useEffect(function() {
    saveStoredSessions(sessions);
  }, [sessions]);

  // Scroll to bottom automatically on new messages or timer updates
  useEffect(function() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isSending, elapsedTime]);

  function startNewChat() {
    setCurrentSessionId(null);
    setHistory([]);
    setInput("");
  }

  function selectSession(id) {
    setCurrentSessionId(id);
  }

  function deleteSession(id, e) {
    e.stopPropagation();
    const updated = sessions.filter(function(s) {
      return s.id !== id;
    });
    setSessions(updated);
    if (currentSessionId === id) {
      startNewChat();
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (isSending || text === "") return;

    const apiKey = getApiKey();
    const nextHistory = [...history, { role: "user", text: text }];

    let activeSessionId = currentSessionId;

    if (!activeSessionId) {
      activeSessionId = Date.now().toString();
      const shortTitle = text.length > 28 ? text.slice(0, 28) + "..." : text;
      const newSession = {
        id: activeSessionId,
        title: shortTitle,
        messages: nextHistory
      };
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(activeSessionId);
    } else {
      const updatedSessions = sessions.map(function(s) {
        if (s.id === activeSessionId) {
          return { ...s, messages: nextHistory };
        }
        return s;
      });
      setSessions(updatedSessions);
    }

    setInput("");
    setHistory(nextHistory);

    if (!apiKey) {
      const errorHistory = [...nextHistory, { role: "error", text: "Cami isn’t set up yet :(" }];
      setHistory(errorHistory);
      const updatedSessions = sessions.map(function(s) {
        if (s.id === activeSessionId) {
          return { ...s, messages: errorHistory };
        }
        return s;
      });
      setSessions(updatedSessions);
      return;
    }

    setIsSending(true);

    try {
      const reply = await callGemini(apiKey, nextHistory);
      const finalHistory = [...nextHistory, { role: "model", text: reply }].slice(-MAX_HISTORY);

      setHistory(finalHistory);
      setSessions(function(prevSessions) {
        return prevSessions.map(function(s) {
          if (s.id === activeSessionId) {
            return { ...s, messages: finalHistory };
          }
          return s;
        });
      });
    } catch (error) {
      const errorHistory = [...nextHistory, { role: "error", text: error.message }].slice(-MAX_HISTORY);

      setHistory(errorHistory);
      setSessions(function(prevSessions) {
        return prevSessions.map(function(s) {
          if (s.id === activeSessionId) {
            return { ...s, messages: errorHistory };
          }
          return s;
        });
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="cami-page">
      <aside className={`cami-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="cami-sidebar-top">
          <button
            className="cami-icon-btn"
            onClick={function() { setIsSidebarOpen(!isSidebarOpen); }}
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
              sessions.map(function(s) {
                return (
                  <div
                    key={s.id}
                    className={`cami-history-item ${s.id === currentSessionId ? "active" : ""}`}
                    onClick={function() { selectSession(s.id); }}
                  >

                    <span className="cami-chat-title">{s.title}</span>
                    <span className="cami-chat-icon">⠇</span>
                    <button
                      className="cami-delete-btn"
                      onClick={function(e) { deleteSession(s.id, e); }}
                      title="Delete Chat"
                    >
                      ×
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </aside>

      <div className="cami-main">
        <header className="cami-brand">
          <span className="cami-brand-icon">✦</span>
          <span className="cami-brand-title">Cami</span>
        </header>

        <div className="cami-container">
          <main className="cami-chat">
            {history.length === 0 && (
              <div className="cami-welcome">
                <h2>{welcome}</h2>
              </div>
            )}

            <div className="cami-messages">
              {history.map(function(message, index) {
                return (
                  <div
                    key={index + "-" + message.role}
                    className={`cami-message-row cami-row-${message.role}`}
                  >
                    {message.role === "user" ? (
                      <div className="cami-user-box">{message.text}</div>
                    ) : (
                      <div
                        className="cami-model-text"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(message.text)
                        }}
                      />
                    )}
                  </div>
                );
              })}

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
                onChange={function(e) { setInput(e.target.value); }}
                onKeyDown={function(event) {
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
                disabled={isSending || input.trim() === ""}
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