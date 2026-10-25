/*
 * BEGINNER GUIDE: src/apps/code-editor/CodeEditorApp.jsx
 * This React file defines the CodeEditorApp component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import React, { useEffect, useRef, useState } from "react";
import { maxLength, required, validateField } from "../../lib/validators.js";
import { api } from "../../lib/api.js";

// Boilerplates for default editor snippets
const DEFAULT_BOILERPLATES = {
  javascript: 'console.log("Hello from JavaScript!");',
  typescript: 'const msg: string = "Hello from TypeScript!";\nconsole.log(msg);',
  python: 'print("Hello from Python!")',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}',
  go: 'package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}',
  rust: 'fn main() {\n    println!("Hello from Rust!");\n}',
  csharp: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello from C#!");\n    }\n}',
  kotlin: 'fun main() {\n    println("Hello from Kotlin!")\n}',
  swift: 'print("Hello from Swift!")',
  php: '<?php\necho "Hello from PHP!";',
  ruby: 'puts "Hello from Ruby!"',
  bash: 'echo "Hello from Bash!"',
  lua: 'print("Hello from Lua!")',
  r: 'cat("Hello from R!\\n")',
  html: '<h1>Hello from HTML!</h1>',
  css: 'body { background-color: #f0f0f0; }',
  react: 'export default function App() {\n  return <h1>Hello from React!</h1>;\n}',
  mysql: 'SELECT "Hello from SQL!" AS Greeting;'
};

// Wandbox API Compiler Identifiers
const WANDBOX_COMPILER_MAP = {
  javascript: "nodejs-head",
  typescript: "typescript-5.0.4",
  python: "cpython-3.10.11",
  c: "gcc-head-c",
  cpp: "gcc-head",
  java: "openjdk-head",
  go: "go-1.20.4",
  rust: "rust-1.70.0",
  csharp: "dotnet-7.0.100",
  php: "php-8.2.5",
  ruby: "ruby-3.2.2",
  bash: "bash",
  lua: "lua-5.4.3"
};

// Turn the backend's answer ({ stdout, stderr, exitCode, ... }) into text for the terminal.
function formatResult(result) {
  let out = result.stdout || "";
  if (result.stderr) {
    if (out && !out.endsWith("\n")) out += "\n";
    out += (result.phase === "compile" ? "Compilation Error:\n" : "") + result.stderr;
  }
  if (result.timedOut) {
    out += "\n[Stopped: the program ran for too long]";
  } else if (result.truncated) {
    out += "\n[Stopped: the program printed too much output]";
  } else if (result.exitCode && result.phase !== "compile") {
    out += `\n[Process exited with code ${result.exitCode}]`;
  }
  return out.trim() ? out : "Code executed successfully (no output).";
}

// ---- Remember the code per language (same localStorage keys the old editor script used) ----
const CODE_CONTENT_KEY = "campspace-code-content";
const CODE_LANG_KEY = "campspace-code-lang";
const CODE_FONT_KEY = "campspace-code-font-size";

function readSavedCode() {
  try {
    return JSON.parse(localStorage.getItem(CODE_CONTENT_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function writeSavedCode(lang, code) {
  try {
    const all = readSavedCode();
    all[lang] = code;
    localStorage.setItem(CODE_CONTENT_KEY, JSON.stringify(all));
  } catch {
    // localStorage unavailable - the editor still works, it just won't remember.
  }
}

function initialLanguage() {
  try {
    const lang = localStorage.getItem(CODE_LANG_KEY);
    if (lang && DEFAULT_BOILERPLATES[lang] !== undefined) return lang;
  } catch {
    // ignore
  }
  return "javascript";
}

function codeFor(lang) {
  const saved = readSavedCode()[lang];
  return typeof saved === "string" ? saved : DEFAULT_BOILERPLATES[lang] || "";
}

// HTML and CSS are shown as a live preview instead of being run.
function buildPreviewDoc(lang, code) {
  if (lang === "css") {
    return (
      "<!DOCTYPE html><html><head><style>" + code + "</style></head>" +
      "<body><h1>Hello, CampSpace!</h1><p>This is a live preview of your CSS applied " +
      "to a couple of sample elements.</p><button>A button</button></body></html>"
    );
  }
  return code;
}

// BEGINNER: CodeEditorApp()
// This component/function is responsible for the CodeEditorApp part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function CodeEditorApp() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    const saved = parseFloat(localStorage.getItem(CODE_FONT_KEY));
    return Number.isNaN(saved) ? 13 : saved;
  });
  const [selectedLang, setSelectedLang] = useState(initialLanguage);
  const [code, setCode] = useState(() => codeFor(initialLanguage()));
  const [previewDoc, setPreviewDoc] = useState(null); // HTML/CSS live preview
  const [termHeight, setTermHeight] = useState(150);
  const bodyRef = useRef(null);
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);
  const [terminalOutput, setTerminalOutput] = useState("Press Run to execute code.");
  const [isRunning, setIsRunning] = useState(false);

  // Backend (Express + MySQL) state
  const [languages, setLanguages] = useState({}); // what the server can run
  const [backendOnline, setBackendOnline] = useState(null); // null = still checking
  const [stdin, setStdin] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const [snippetId, setSnippetId] = useState("");
  const [status, setStatus] = useState("");

  const flash = (message) => {
    setStatus(message);
    setTimeout(() => setStatus(""), 2500);
  };

  const refreshSnippets = async () => {
    setSnippets(await api("/api/snippets"));
  };

  // On first load: ask the backend which languages it can run, and fetch saved snippets.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await api("/api/languages", { timeoutMs: 8000 });
        if (cancelled) return;
        const byId = {};
        list.forEach((item) => (byId[item.id] = item));
        setLanguages(byId);
        setBackendOnline(true);
        await refreshSnippets();
      } catch {
        if (!cancelled) setBackendOnline(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Zoom control: Ctrl/Cmd + scroll changes the editor text size (remembered between visits).
  // Attached natively with { passive: false } so preventDefault() can stop the browser page zoom.
  useEffect(() => {
    const element = bodyRef.current;
    if (!element) return undefined;
    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setFontSize((prev) => Math.min(28, Math.max(10, prev + (e.deltaY < 0 ? 1 : -1))));
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CODE_FONT_KEY, String(fontSize));
    } catch {
      // ignore
    }
  }, [fontSize]);

  // Autosave the code for each language (half a second after typing stops).
  useEffect(() => {
    const timer = setTimeout(() => writeSavedCode(selectedLang, code), 500);
    return () => clearTimeout(timer);
  }, [code, selectedLang]);

  useEffect(() => {
    try {
      localStorage.setItem(CODE_LANG_KEY, selectedLang);
    } catch {
      // ignore
    }
  }, [selectedLang]);

  // Drag the bar above the terminal to make it taller or shorter.
  const handleResizeStart = (event) => {
    event.preventDefault();
    const startY = event.clientY;
    const startHeight = termHeight;
    const bodyHeight = bodyRef.current ? bodyRef.current.getBoundingClientRect().height : 420;
    const onMove = (moveEvent) => {
      const next = startHeight + (startY - moveEvent.clientY);
      setTermHeight(Math.max(60, Math.min(bodyHeight - 80, next)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Tab key inserts two spaces instead of moving focus out of the editor.
  const handleKeyDown = (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const { selectionStart, selectionEnd } = e.target;
    const next = code.slice(0, selectionStart) + "  " + code.slice(selectionEnd);
    setCode(next);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + 2;
      }
    });
  };

  // BEGINNER: handleLanguageChange()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    setCode(codeFor(lang)); // your last code for that language, or the boilerplate
    setSnippetId(""); // new language = new snippet, don't overwrite a saved one
    setPreviewDoc(null);
  };

  const handleReset = () => {
    setCode(DEFAULT_BOILERPLATES[selectedLang] || "");
    setPreviewDoc(null);
  };

  // Old behaviour, used only if the backend can't be reached:
  // JavaScript runs in the browser, other languages go to the public Wandbox API.
  const runWithoutBackend = async () => {
    if (selectedLang === "javascript") {
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : a)).join(" "));
      };
      try {
        new Function(code)();
        setTerminalOutput(logs.join("\n") || "Code executed successfully (no output).");
      } catch (err) {
        setTerminalOutput(`JavaScript Runtime Error: ${err.message}`);
      } finally {
        console.log = originalLog;
      }
      return;
    }

    const compiler = WANDBOX_COMPILER_MAP[selectedLang];
    if (!compiler) {
      setTerminalOutput(
        `[Backend offline] ${selectedLang.toUpperCase()} needs the CampSpace backend. Start it with "npm run server".`
      );
      return;
    }

    try {
      const response = await fetch("https://wandbox.org/api/compile.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compiler: compiler, code: code })
      });
      const data = await response.json();
      if (data.compiler_error) {
        setTerminalOutput(`Compilation Error:\n${data.compiler_error}`);
      } else if (data.program_error) {
        setTerminalOutput(`Runtime Error:\n${data.program_error}`);
      } else if (data.program_output) {
        setTerminalOutput(`[Backend offline - used fallback runner]\n${data.program_output}`);
      } else {
        setTerminalOutput("Code executed successfully with no output.");
      }
    } catch (error) {
      setTerminalOutput(`Network/Execution Error: ${error.message}`);
    }
  };

  // Execution Logic
  // BEGINNER: handleRunCode()
  // Sends the code to the backend (POST /api/run), which runs it and sends back the output.
  // FEE topics: Fetch API, async/await, try/catch, React state.
  const handleRunCode = async () => {
    setIsRunning(true);
    setTerminalOutput("Running...");

    setPreviewDoc(null);

    // HTML and CSS: show a live preview in the terminal area (works even without the backend).
    if (selectedLang === "html" || selectedLang === "css") {
      setPreviewDoc(buildPreviewDoc(selectedLang, code));
      setIsRunning(false);
      return;
    }

    if (selectedLang === "react") {
      setTerminalOutput("[Info] React components can't be run here yet - HTML and CSS have a live preview.");
      setIsRunning(false);
      return;
    }

    try {
      const result = await api("/api/run", {
        method: "POST",
        body: { language: selectedLang, code, stdin }
      });
      setBackendOnline(true);
      setTerminalOutput(formatResult(result));
    } catch (error) {
      if (error.offline) {
        setBackendOnline(false);
        await runWithoutBackend();
      } else {
        setTerminalOutput(error.message);
      }
    } finally {
      setIsRunning(false);
    }
  };

  // ---- Saved snippets (stored in MySQL through the backend) ----
  const handleSave = async () => {
    try {
      if (snippetId) {
        const current = snippets.find((item) => String(item.id) === String(snippetId));
        await api(`/api/snippets/${snippetId}`, {
          method: "PUT",
          body: { title: current ? current.title : "Untitled", language: selectedLang, code }
        });
      } else {
        const title = window.prompt("Name this snippet:", `My ${selectedLang} code`);
        if (title === null) return; // user pressed Cancel
        // VALIDATION STRATEGY: reuse the shared rules instead of silently ignoring bad input.
        const titleError = validateField(title, [
          required("Give the snippet a name."),
          maxLength(120, "Snippet name must be 120 characters or fewer.")
        ]);
        if (titleError) {
          flash(titleError);
          return;
        }
        const created = await api("/api/snippets", {
          method: "POST",
          body: { title: title.trim(), language: selectedLang, code }
        });
        setSnippetId(String(created.id));
      }
      await refreshSnippets();
      flash("Saved");
    } catch (error) {
      flash(error.message);
    }
  };

  const handleLoadSnippet = async (e) => {
    const id = e.target.value;
    if (!id) {
      setSnippetId("");
      return;
    }
    try {
      const snippet = await api(`/api/snippets/${id}`);
      setSelectedLang(snippet.language);
      setCode(snippet.code);
      setSnippetId(String(snippet.id));
    } catch (error) {
      flash(error.message);
    }
  };

  const handleDeleteSnippet = async () => {
    if (!snippetId || !window.confirm("Delete this saved snippet?")) return;
    try {
      await api(`/api/snippets/${snippetId}`, { method: "DELETE" });
      setSnippetId("");
      await refreshSnippets();
      flash("Deleted");
    } catch (error) {
      flash(error.message);
    }
  };

  // Dropdown label: tell the user when the server can't run a language.
  const languageLabel = (lang) => {
    const info = languages[lang];
    const name = lang.toUpperCase();
    if (backendOnline && info && info.mode !== "preview" && !info.runnable) return `${name} (not installed)`;
    return name;
  };

  return (
    <section
      className={`mainpage-window mainpage-window--code ${
        isFullScreen ? "mainpage-window--fullscreen" : ""
      }`}
      data-mainpage-window=""
      data-app="code"
      style={{
        "--mainpage-x": isFullScreen ? "0px" : "120px",
        "--mainpage-y": isFullScreen ? "0px" : "460px",
        "--mainpage-w": isFullScreen ? "100vw" : "640px",
        "--mainpage-h": isFullScreen ? "100vh" : "auto",
        position: isFullScreen ? "fixed" : "absolute",
        top: isFullScreen ? 0 : undefined,
        left: isFullScreen ? 0 : undefined,
        width: isFullScreen ? "100vw" : undefined,
        height: isFullScreen ? "100vh" : undefined,
        zIndex: isFullScreen ? 9999 : undefined
      }}
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
            onClick={() => setIsFullScreen((prev) => !prev)}
          ></button>
        </div>
        <h2 className="mainpage-window-title">Code Editor</h2>
        <select
          className="mainpage-code-lang-select"
          id="mainpage-code-lang-select"
          aria-label="Language"
          value={selectedLang}
          onChange={handleLanguageChange}
        >
          {Object.keys(DEFAULT_BOILERPLATES).map((lang) => (
            <option key={lang} value={lang}>
              {languageLabel(lang)}
            </option>
          ))}
        </select>
        <button
          className="mainpage-window-action mainpage-window-action--icon"
          id="mainpage-code-reset"
          title="Reset to boilerplate"
          onClick={handleReset}
        >
          Reset
        </button>
      </header>

      <div
        className="mainpage-window-body mainpage-code-body"
        id="mainpage-code-body"
        ref={bodyRef}
        style={{ fontSize: `${fontSize}px` }}
      >
        <div className="mainpage-code-toolbar">
          {/* Saved snippets live in MySQL; the dot shows whether the backend is reachable. */}
          <select
            className="mainpage-code-lang-select"
            aria-label="Saved code"
            value={snippetId}
            onChange={handleLoadSnippet}
            disabled={!backendOnline}
          >
            <option value="">{backendOnline ? "Saved code..." : "Saved code (backend offline)"}</option>
            {snippets.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} - {item.language}
              </option>
            ))}
          </select>
          <button
            className="mainpage-window-action mainpage-window-action--icon"
            id="mainpage-code-save"
            onClick={handleSave}
            disabled={!backendOnline}
          >
            Save
          </button>
          {snippetId && (
            <button
              className="mainpage-window-action mainpage-window-action--icon"
              id="mainpage-code-delete"
              onClick={handleDeleteSnippet}
            >
              Delete
            </button>
          )}
          <span className="mainpage-code-status">{status}</span>
          <span
            className={`mainpage-code-backend ${
              backendOnline ? "mainpage-code-backend--online" : backendOnline === false ? "mainpage-code-backend--offline" : ""
            }`}
          >
            {backendOnline === null ? "Connecting..." : backendOnline ? "● Backend online" : "● Backend offline"}
          </span>
        </div>

        <div className="mainpage-code-pane" id="mainpage-code-pane">
          {/* Code editor area containing the editor and line-number gutter. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <div className="mainpage-code-gutter" id="mainpage-code-gutter" ref={gutterRef}>
            {code.split("\n").map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            className="mainpage-code-textarea"
            id="mainpage-code-textarea"
            spellCheck="false"
            autoComplete="off"
            autoCapitalize="off"
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={(e) => {
              if (gutterRef.current) gutterRef.current.scrollTop = e.target.scrollTop;
            }}
            style={{ fontSize: "inherit", lineHeight: 1.6 }}
          ></textarea>
        </div>

        <div
          className="mainpage-code-resize-handle"
          id="mainpage-code-resize-handle"
          title="Drag to resize terminal"
          onMouseDown={handleResizeStart}
        ></div>

        <div
          className="mainpage-code-terminal"
          id="mainpage-code-terminal"
          style={{ "--mainpage-term-h": `${termHeight}px` }}
        >
          <div className="mainpage-code-terminal-bar">
            {/* Terminal/output area used by the code editor. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <span className="mainpage-code-terminal-label">Terminal</span>
            <div className="mainpage-code-terminal-actions">
              {/* Action buttons that open related campspace applications. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
              <span className="mainpage-code-zoom-hint">
                Ctrl / ⌘ + scroll to zoom
              </span>
              <button
                className="mainpage-window-action mainpage-window-action--icon"
                id="mainpage-code-input-toggle"
                title="Text your program reads (scanf, input(), Scanner...)"
                onClick={() => setShowInput((prev) => !prev)}
              >
                {showInput ? "Hide input" : "Input"}
              </button>
              <button
                className="mainpage-window-action mainpage-window-action--icon"
                id="mainpage-code-run"
                onClick={handleRunCode}
                disabled={isRunning}
              >
                {isRunning ? "⏳ Executing..." : "▶ Run"}
              </button>
              <button
                className="mainpage-window-action mainpage-window-action--icon"
                id="mainpage-code-clear-term"
                onClick={() => {
                  setTerminalOutput("");
                  setPreviewDoc(null);
                }}
              >
                Clear
              </button>
            </div>
          </div>
          {showInput && (
            <textarea
              className="mainpage-code-stdin"
              placeholder="Program input (stdin) - one value per line"
              rows={2}
              spellCheck="false"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
            ></textarea>
          )}
          {previewDoc !== null ? (
            <iframe
              className="mainpage-code-preview-frame"
              title="Live preview"
              sandbox="allow-scripts"
              srcDoc={previewDoc}
              style={{ flex: "1 1 auto", width: "100%", border: "none", background: "#fff" }}
            ></iframe>
          ) : (
            <pre
              className="mainpage-code-terminal-output"
              id="mainpage-code-terminal-output"
              style={{ fontSize: "inherit" }}
            >
              {terminalOutput}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
