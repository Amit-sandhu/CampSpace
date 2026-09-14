/*
 * BEGINNER GUIDE: src/apps/code-editor/CodeEditorApp.jsx
 * This React file defines the CodeEditorApp component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import React, { useState } from "react";

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

// BEGINNER: CodeEditorApp()
// This component/function is responsible for the CodeEditorApp part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function CodeEditorApp() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_BOILERPLATES.javascript);
  const [terminalOutput, setTerminalOutput] = useState("Press Run to execute code.");
  const [isRunning, setIsRunning] = useState(false);

  // Zoom control
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setFontSize((prev) => Math.max(1, prev * zoomFactor));
    }
  };

  // BEGINNER: handleLanguageChange()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    setCode(DEFAULT_BOILERPLATES[lang] || "");
  };

  const handleReset = () => {
    setCode(DEFAULT_BOILERPLATES[selectedLang] || "");
  };

  // Execution Logic
  // BEGINNER: handleRunCode()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  const handleRunCode = async () => {
    setIsRunning(true);
    setTerminalOutput("Running...");

    // 1. Client-side browser execution for pure JavaScript
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
        setIsRunning(false);
      }
      return;
    }

    // 2. Wandbox API Execution for Compiled/Backend Languages
    const compiler = WANDBOX_COMPILER_MAP[selectedLang];

    if (!compiler) {
      setTerminalOutput(
        `[Info] Online execution for ${selectedLang.toUpperCase()} is not available in browser mode.`
      );
      setIsRunning(false);
      return;
    }

    try {
      const response = await fetch("https://wandbox.org/api/compile.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compiler: compiler,
          code: code
        })
      });

      const data = await response.json();

      if (data.compiler_error) {
        setTerminalOutput(`Compilation Error:\n${data.compiler_error}`);
      } else if (data.program_error) {
        setTerminalOutput(`Runtime Error:\n${data.program_error}`);
      } else if (data.program_output) {
        setTerminalOutput(data.program_output);
      } else {
        setTerminalOutput("Code executed successfully with no output.");
      }
    } catch (error) {
      setTerminalOutput(`Network/Execution Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
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
              {lang.toUpperCase()}
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
        onWheel={handleWheel}
        style={{ fontSize: `${fontSize}px` }}
      >
        <div className="mainpage-code-pane" id="mainpage-code-pane">
          {/* Code editor area containing the editor and line-number gutter. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <div className="mainpage-code-gutter" id="mainpage-code-gutter">
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
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ fontSize: "inherit" }}
          ></textarea>
        </div>

        <div
          className="mainpage-code-resize-handle"
          id="mainpage-code-resize-handle"
          title="Drag to resize terminal"
        ></div>

        <div
          className="mainpage-code-terminal"
          id="mainpage-code-terminal"
          style={{ "--mainpage-term-h": "150px" }}
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
                id="mainpage-code-run"
                onClick={handleRunCode}
                disabled={isRunning}
              >
                {isRunning ? "⏳ Executing..." : "▶ Run"}
              </button>
              <button
                className="mainpage-window-action mainpage-window-action--icon"
                id="mainpage-code-clear-term"
                onClick={() => setTerminalOutput("")}
              >
                Clear
              </button>
            </div>
          </div>
          <pre
            className="mainpage-code-terminal-output"
            id="mainpage-code-terminal-output"
            style={{ fontSize: "inherit" }}
          >
            {terminalOutput}
          </pre>
        </div>
      </div>
    </section>
  );
}
