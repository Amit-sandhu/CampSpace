import { useState, useRef, useEffect } from "react";

const GEMINI_MODEL = "gemini-3.6-flash";

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

function getApiKey() {
  var config = (window.CAMPSPACE_OAUTH_CONFIG && window.CAMPSPACE_OAUTH_CONFIG.gemini) || {};
  var key = config.apiKey || "";
  if (!key || key === "GEMINI_API_KEY") return "";
  return key;
}

function formatTime(totalSeconds) {
  if (totalSeconds < 60) {
    return totalSeconds + "s";
  }
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  if (seconds > 0) {
    return minutes + "m " + seconds + "s";
  } else {
    return minutes + "m";
  }
}

export default function AIChatApp() {
  var [messages, setMessages] = useState([]);
  var [input, setInput] = useState("");
  var [isSending, setIsSending] = useState(false);
  var [elapsedTime, setElapsedTime] = useState(0);
  
  var [welcomeMessage] = useState(function() {
    return WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
  });
  
  var [suggestedPrompts, setSuggestedPrompts] = useState([]);
  var messagesEndRef = useRef(null);

  useEffect(function() {
    var shuffled = [...RANDOM_PROMPTS].sort(function() { return 0.5 - Math.random(); });
    setSuggestedPrompts(shuffled.slice(0, 3));
  }, []);

  useEffect(function() {
    var timerId;
    if (isSending) {
      setElapsedTime(0);
      timerId = setInterval(function() {
        setElapsedTime(function(prev) { return prev + 1; });
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return function() {
      if (timerId) clearInterval(timerId);
    };
  }, [isSending]);

  function sendMessage(textToSend) {
    var text = (textToSend || input).trim();
    if (isSending || text === "") return;

    var apiKey = getApiKey();
    var newHistory = [...messages, { role: "user", text: text }];
    
    setMessages(newHistory);
    if (!textToSend) setInput("");

    if (!apiKey) {
      setMessages([...newHistory, { role: "error", text: "API key is missing or not set." }]);
      return;
    }

    setIsSending(true);

    var url = "https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODEL + ":generateContent?key=" + encodeURIComponent(apiKey);
    
    var contents = newHistory
      .filter(function(m) { return m.role === "user" || m.role === "model"; })
      .map(function(m) {
        return {
          role: m.role,
          parts: [{ text: m.text }]
        };
      });

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: contents })
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
      var reply = parts ? parts.map(function(p) { return p.text || ""; }).join("") : "";
      
      if (!reply) {
        throw new Error("No response returned from Gemini.");
      }

      setMessages([...newHistory, { role: "model", text: reply }]);
    })
    .catch(function(error) {
      setMessages([...newHistory, { role: "error", text: error.message || "Failed to fetch response." }]);
    })
    .finally(function() {
      setIsSending(false);
    });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <section
      className="mainpage-window mainpage-window--aichat mainpage-window--hidden"
      data-mainpage-window=""
      data-app="aichat"
      style={{ "--mainpage-x": "780px", "--mainpage-y": "460px", "--mainpage-w": "400px" }}
    >
      <header className="mainpage-window-bar" data-mainpage-drag-handle="">
        <div className="mainpage-traffic-lights">
          <button className="mainpage-tl mainpage-tl--red" data-mainpage-action="close" aria-label="Close"></button>
          <button className="mainpage-tl mainpage-tl--yellow" data-mainpage-action="minimize" aria-label="Minimize"></button>
          <button className="mainpage-tl mainpage-tl--green" data-mainpage-action="maximize" aria-label="Maximize"></button>
        </div>
        <h2 className="mainpage-window-title">Cami</h2>
      </header>

      <div className="mainpage-window-body mainpage-aichat-body">
        <div className="mainpage-aichat-messages">
          {messages.length === 0 && (
            <div className="cami-welcome" style={{ padding: "12px 0", textAlign: "center" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: "500", opacity: 0.8 }}>
                {welcomeMessage}
              </h2>
            </div>
          )}

          {messages.map(function(msg, idx) {
            return (
              <div key={idx} className={"cami-msg-row " + (msg.role === 'model' ? 'ai' : msg.role)}>
                <div className={"cami-avatar " + (msg.role === 'model' ? 'ai' : msg.role)}>
                  {msg.role === 'model' ? '✦' : msg.role === 'error' ? '!' : 'U'}
                </div>
                <div className="cami-msg-bubble">{msg.text}</div>
              </div>
            );
          })}

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

        {messages.length === 0 && (
          <div className="cami-prompt-chips">
            {suggestedPrompts.map(function(prompt, idx) {
              return (
                <button
                  key={idx}
                  type="button"
                  className="cami-chip"
                  onClick={function() { sendMessage(prompt); }}
                >
                  {prompt}
                </button>
              );
            })}
          </div>
        )}

        <div className="mainpage-aichat-input-row">
          <input
            type="text"
            value={input}
            onChange={function(e) { setInput(e.target.value); }}
            onKeyDown={handleKeyDown}
            placeholder="Ask Cami..."
            autoComplete="off"
            maxLength={4000}
          />
          <button
            type="button"
            onClick={function() { sendMessage(); }}
            disabled={isSending || input.trim() === ""}
            aria-label="Send"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}