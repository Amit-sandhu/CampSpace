/* ================================================================
   CampSpace - Workspace behaviour

   This file controls the workspace page (main.html):
     - opening, closing, minimizing, maximizing and dragging windows
     - the dock at the bottom
     - dark mode
     - the search box (palette)
     - the three small apps: Calendar, Notepad, Calculator

   This file is written in a simple, beginner-friendly style:
     - normal "for" loops instead of forEach/map
     - normal "if / else" instead of the ? : shortcut
     - getAttribute() instead of the .dataset shortcut
     - plain functions that are declared and then called,
       instead of the "immediately invoked function" trick
   ================================================================ */

function runMainPageScript() {

  var canvas = document.getElementById('mainpage-canvas');
  var dock = document.querySelector('.mainpage-dock');
  var zCounter = 50; // goes up every time a window is brought to the front

  // This will hold the Monaco (code editor) instance once it has loaded.
  // It starts as null and the codeEditorApp() function fills it in below.
  var monacoEditorInstance = null;

  function resizeCodeEditorIfNeeded(app) {
    // Monaco needs to be told to re-measure itself whenever the window
    // that contains it changes size or goes from hidden to visible.
    if (app === 'code' && monacoEditorInstance) {
      setTimeout(function () {
        monacoEditorInstance.layout();
      }, 60);
    }
  }

  /* ---------------------------------------------------------
     Window registry
     We keep one small object per window so we always know if
     it is open, minimized, maximized, and its previous style.
     --------------------------------------------------------- */
  var windows = {};

  var windowElements = document.querySelectorAll('[data-mainpage-window]');

  for (var i = 0; i < windowElements.length; i++) {
    var windowElement = windowElements[i];
    var appName = windowElement.getAttribute('data-app');
    var isHidden = windowElement.classList.contains('mainpage-window--hidden');

    windows[appName] = {
      el: windowElement,
      open: !isHidden,
      minimized: false,
      maximized: false,
      prevStyle: null
    };
  }

  function dockItemFor(app) {
    return document.querySelector('[data-mainpage-dock-app="' + app + '"]');
  }

  function syncDockIndicator(app) {
    var item = dockItemFor(app);
    if (!item) {
      return;
    }

    var windowData = windows[app];
    var isRunning = windowData.open && !windowData.el.classList.contains('mainpage-window--hidden');

    if (isRunning) {
      item.classList.add('mainpage-dock-item--active');
    } else {
      item.classList.remove('mainpage-dock-item--active');
    }
  }

  function bringToFront(app) {
    var windowData = windows[app];
    if (!windowData) {
      return;
    }

    zCounter = zCounter + 1;
    windowData.el.style.zIndex = zCounter;

    var allWindows = document.querySelectorAll('.mainpage-window');
    for (var j = 0; j < allWindows.length; j++) {
      allWindows[j].classList.remove('mainpage-window--front');
    }

    windowData.el.classList.add('mainpage-window--front');
  }

  function openApp(app) {
    var windowData = windows[app];
    if (!windowData) {
      return;
    }

    windowData.el.classList.remove('mainpage-window--hidden');
    windowData.open = true;
    windowData.minimized = false;

    bringToFront(app);
    syncDockIndicator(app);
    resizeCodeEditorIfNeeded(app);
  }

  function closeApp(app) {
    var windowData = windows[app];
    if (!windowData) {
      return;
    }

    windowData.el.classList.add('mainpage-window--hidden');
    windowData.open = false;
    windowData.minimized = false;

    if (windowData.maximized) {
      windowData.el.classList.remove('mainpage-window--maximized');
      windowData.maximized = false;
    }

    syncDockIndicator(app);
  }

  function minimizeApp(app) {
    var windowData = windows[app];
    if (!windowData) {
      return;
    }

    windowData.el.classList.add('mainpage-window--hidden');
    windowData.minimized = true;

    syncDockIndicator(app);
  }

  function toggleMaximize(app) {
    var windowData = windows[app];
    if (!windowData) {
      return;
    }

    if (!windowData.maximized) {
      windowData.prevStyle = windowData.el.getAttribute('style');
      windowData.el.classList.add('mainpage-window--maximized');
      windowData.maximized = true;
    } else {
      windowData.el.classList.remove('mainpage-window--maximized');
      windowData.maximized = false;
    }

    bringToFront(app);
    resizeCodeEditorIfNeeded(app);
  }

  function toggleDockApp(app) {
    var windowData = windows[app];
    if (!windowData) {
      return;
    }

    var isFrontmost = windowData.el.classList.contains('mainpage-window--front');

    if (!windowData.open || windowData.minimized) {
      openApp(app);
    } else if (isFrontmost) {
      minimizeApp(app);
    } else {
      bringToFront(app);
    }
  }

  /* ---------------------------------------------------------
     Dock: clicking an app icon opens / minimizes / focuses it
     --------------------------------------------------------- */
  dock.addEventListener('click', function (event) {
    var item = event.target.closest('[data-mainpage-dock-app]');
    if (!item) {
      return;
    }

    var app = item.getAttribute('data-mainpage-dock-app');
    toggleDockApp(app);
  });

  /* ---------------------------------------------------------
     Window chrome: title bar buttons + dragging a window
     --------------------------------------------------------- */
  function setupActionButton(button, app) {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      var action = button.getAttribute('data-mainpage-action');

      if (action === 'close') {
        closeApp(app);
      } else if (action === 'minimize') {
        minimizeApp(app);
      } else if (action === 'maximize') {
        toggleMaximize(app);
      }
    });
  }

  function setupWindowDrag(windowElement, app, dragHandle) {
    dragHandle.addEventListener('mousedown', function (event) {
      var clickedOnButton = event.target.closest('button');
      if (clickedOnButton) {
        return; // clicking a title bar button should not start a drag
      }
      if (windows[app].maximized) {
        return; // don't drag while the window is maximized
      }

      bringToFront(app);
      windowElement.classList.add('mainpage-window--dragging');

      var startX = event.clientX;
      var startY = event.clientY;
      var startLeft = parseFloat(getComputedStyle(windowElement).left);
      var startTop = parseFloat(getComputedStyle(windowElement).top);

      function onMouseMove(moveEvent) {
        var deltaX = moveEvent.clientX - startX;
        var deltaY = moveEvent.clientY - startY;

        var newLeft = startLeft + deltaX;
        if (newLeft < 0) {
          newLeft = 0;
        }

        var newTop = startTop + deltaY;
        if (newTop < 0) {
          newTop = 0;
        }

        windowElement.style.setProperty('--mainpage-x', newLeft + 'px');
        windowElement.style.setProperty('--mainpage-y', newTop + 'px');
      }

      function onMouseUp() {
        windowElement.classList.remove('mainpage-window--dragging');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      event.preventDefault();
    });
  }

  function setupWindowChrome(windowElement) {
    var app = windowElement.getAttribute('data-app');

    windowElement.addEventListener('mousedown', function () {
      bringToFront(app);
    });

    var actionButtons = windowElement.querySelectorAll('[data-mainpage-action]');
    for (var k = 0; k < actionButtons.length; k++) {
      setupActionButton(actionButtons[k], app);
    }

    var dragHandle = windowElement.querySelector('[data-mainpage-drag-handle]');
    if (dragHandle) {
      setupWindowDrag(windowElement, app, dragHandle);
    }
  }

  for (var m = 0; m < windowElements.length; m++) {
    setupWindowChrome(windowElements[m]);
  }

  // Give the dashboard window a front / z-index state right away
  bringToFront('dashboard');

  /* ---------------------------------------------------------
     Dark mode
     --------------------------------------------------------- */
  function themeToggle() {
    var body = document.querySelector('.mainpage-body');
    var button = document.getElementById('mainpage-theme-toggle');
    if (!button) {
      return;
    }

    var systemPrefersDark = false;
    if (window.matchMedia) {
      systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    var isDark = systemPrefersDark;

    function applyTheme() {
      if (isDark) {
        body.classList.add('mainpage-body--dark');
      } else {
        body.classList.remove('mainpage-body--dark');
      }
      button.setAttribute('aria-pressed', String(isDark));
    }

    button.addEventListener('click', function () {
      isDark = !isDark;
      applyTheme();
    });

    applyTheme();
  }

  themeToggle();

  /* ---------------------------------------------------------
     Top nav: search palette + auto-arrange
     --------------------------------------------------------- */
  var paletteOverlay = document.getElementById('mainpage-palette-overlay');
  var paletteInput = document.getElementById('mainpage-palette-input');

  function openPalette() {
    paletteOverlay.classList.add('mainpage-palette-overlay--open');
    setTimeout(function () {
      paletteInput.focus();
    }, 10);
  }

  function closePalette() {
    paletteOverlay.classList.remove('mainpage-palette-overlay--open');
  }

  var searchTrigger = document.getElementById('mainpage-search-trigger');
  if (searchTrigger) {
    searchTrigger.addEventListener('click', openPalette);
  }

  var newBtn = document.getElementById('mainpage-new-btn');
  if (newBtn) {
    newBtn.addEventListener('click', openPalette);
  }

  paletteOverlay.addEventListener('click', function (event) {
    if (event.target === paletteOverlay) {
      closePalette();
    }
  });

  document.addEventListener('keydown', function (event) {
    var key = event.key.toLowerCase();
    var usedCtrlOrCmd = event.metaKey || event.ctrlKey;

    if (usedCtrlOrCmd && key === 'k') {
      event.preventDefault();
      openPalette();
    }
    if (event.key === 'Escape') {
      closePalette();
    }
  });

  function setupPaletteAppButton(button) {
    button.addEventListener('click', function () {
      var app = button.getAttribute('data-mainpage-palette-app');
      openApp(app);
      closePalette();
    });
  }

  var paletteAppButtons = document.querySelectorAll('[data-mainpage-palette-app]');
  for (var p = 0; p < paletteAppButtons.length; p++) {
    setupPaletteAppButton(paletteAppButtons[p]);
  }

  function setupPaletteCommandButton(button) {
    button.addEventListener('click', function () {
      var command = button.getAttribute('data-mainpage-palette-command');
      if (command === 'auto-arrange') {
        autoArrange();
      }
      closePalette();
    });
  }

  var paletteCommandButtons = document.querySelectorAll('[data-mainpage-palette-command]');
  for (var q = 0; q < paletteCommandButtons.length; q++) {
    setupPaletteCommandButton(paletteCommandButtons[q]);
  }

  var autoArrangeBtn = document.getElementById('mainpage-auto-arrange');
  if (autoArrangeBtn) {
    autoArrangeBtn.addEventListener('click', autoArrange);
  }

  var defaultLayout = {
    dashboard: { x: 120, y: 100 },
    calendar: { x: 600, y: 90 },
    notepad: { x: 1010, y: 100 },
    calculator: { x: 600, y: 430 },
    code: { x: 120, y: 480 }
  };

  function autoArrange() {
    var appNames = Object.keys(defaultLayout);

    for (var r = 0; r < appNames.length; r++) {
      var app = appNames[r];
      var windowData = windows[app];
      if (!windowData) {
        continue;
      }

      if (windowData.maximized) {
        windowData.el.classList.remove('mainpage-window--maximized');
        windowData.maximized = false;
      }

      var pos = defaultLayout[app];
      windowData.el.style.setProperty('--mainpage-x', pos.x + 'px');
      windowData.el.style.setProperty('--mainpage-y', pos.y + 'px');
    }
  }

  /* ---------------------------------------------------------
     Calendar app
     --------------------------------------------------------- */
  function calendarApp() {
    var label = document.getElementById('mainpage-cal-label');
    var grid = document.getElementById('mainpage-cal-grid');
    var selectedOut = document.getElementById('mainpage-cal-selected');
    var prevBtn = document.getElementById('mainpage-cal-prev');
    var nextBtn = document.getElementById('mainpage-cal-next');
    var todayBtn = document.getElementById('mainpage-cal-today');
    if (!grid) {
      return;
    }

    var monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    var today = new Date();
    var viewYear = today.getFullYear();
    var viewMonth = today.getMonth();
    var selected = null;

    function isSameDay(a, b) {
      return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
    }

    function onCellClick(cellDate) {
      selected = cellDate;
      if (cellDate.getMonth() !== viewMonth || cellDate.getFullYear() !== viewYear) {
        viewMonth = cellDate.getMonth();
        viewYear = cellDate.getFullYear();
      }
      render();
    }

    function render() {
      label.textContent = monthNames[viewMonth] + ' ' + viewYear;
      grid.innerHTML = '';

      var firstOfMonth = new Date(viewYear, viewMonth, 1);
      var startOffset = firstOfMonth.getDay(); // 0 = Sunday
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      var daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

      var totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

      for (var i = 0; i < totalCells; i++) {
        var dayNum = i - startOffset + 1;
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'mainpage-month-cell';

        var cellDate;
        var inMonth;

        if (dayNum < 1) {
          cellDate = new Date(viewYear, viewMonth - 1, daysInPrevMonth + dayNum);
          inMonth = false;
        } else if (dayNum > daysInMonth) {
          cellDate = new Date(viewYear, viewMonth + 1, dayNum - daysInMonth);
          inMonth = false;
        } else {
          cellDate = new Date(viewYear, viewMonth, dayNum);
          inMonth = true;
        }

        cell.textContent = cellDate.getDate();

        if (!inMonth) {
          cell.classList.add('mainpage-month-cell--muted');
        }
        if (isSameDay(cellDate, today)) {
          cell.classList.add('mainpage-month-cell--today');
        }
        if (selected && isSameDay(cellDate, selected)) {
          cell.classList.add('mainpage-month-cell--selected');
        }

        cell.myDate = cellDate;
        cell.addEventListener('click', function () {
          // "this" refers to the button that was clicked, and we stored
          // the matching date on it above with cell.myDate
          onCellClick(this.myDate);
        });

        grid.appendChild(cell);
      }

      if (selected) {
        var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        selectedOut.textContent = 'Selected: ' + selected.toLocaleDateString(undefined, dateOptions);
      } else {
        selectedOut.textContent = 'Pick a date';
      }
    }

    prevBtn.addEventListener('click', function () {
      viewMonth = viewMonth - 1;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear = viewYear - 1;
      }
      render();
    });

    nextBtn.addEventListener('click', function () {
      viewMonth = viewMonth + 1;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear = viewYear + 1;
      }
      render();
    });

    todayBtn.addEventListener('click', function () {
      viewYear = today.getFullYear();
      viewMonth = today.getMonth();
      selected = today;
      render();
    });

    render();
  }

  calendarApp();

  /* ---------------------------------------------------------
     Notepad app
     --------------------------------------------------------- */
  function notepadApp() {
    var textarea = document.getElementById('mainpage-notepad-textarea');
    var count = document.getElementById('mainpage-notepad-count');
    var status = document.getElementById('mainpage-notepad-status');
    var clearBtn = document.getElementById('mainpage-notepad-clear');
    if (!textarea) {
      return;
    }

    var saveTimer = null;

    function updateCount() {
      var text = textarea.value;
      var trimmedText = text.trim();

      var wordCount = 0;
      if (trimmedText.length > 0) {
        wordCount = trimmedText.split(/\s+/).length;
      }

      var wordLabel = 'word';
      if (wordCount !== 1) {
        wordLabel = 'words';
      }

      var charLabel = 'character';
      if (text.length !== 1) {
        charLabel = 'characters';
      }

      count.textContent = wordCount + ' ' + wordLabel + ' \u00B7 ' + text.length + ' ' + charLabel;
    }

    textarea.addEventListener('input', function () {
      updateCount();
      status.textContent = 'Editing\u2026';

      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        status.textContent = 'Saved for this session';
      }, 600);
    });

    clearBtn.addEventListener('click', function () {
      textarea.value = '';
      updateCount();
      status.textContent = 'Saved for this session';
      textarea.focus();
    });

    updateCount();
  }

  notepadApp();

  /* ---------------------------------------------------------
     Calculator app
     --------------------------------------------------------- */
  function calculatorApp() {
    var exprEl = document.getElementById('mainpage-calc-expr');
    var resultEl = document.getElementById('mainpage-calc-result');
    var grid = document.querySelector('.mainpage-calc-grid');
    if (!grid) {
      return;
    }

    var current = '0';
    var previous = null;
    var operator = null;
    var justEvaluated = false;

    var opMap = { '\u00F7': '/', '\u00D7': '*', '\u2212': '-', '+': '+' };

    function formatNumber(n) {
      if (!isFinite(n)) {
        return 'Error';
      }

      var s = String(n);
      if (s.length > 14) {
        s = n.toPrecision(12).replace(/\.?0+$/, '');
      }
      return s;
    }

    function render() {
      resultEl.textContent = current;

      if (previous !== null && operator) {
        exprEl.textContent = previous + ' ' + operator;
      } else {
        exprEl.textContent = '\u00A0';
      }
    }

    function inputNumber(d) {
      if (justEvaluated) {
        if (d === '.') {
          current = '0.';
        } else {
          current = d;
        }
        justEvaluated = false;
        return;
      }

      if (d === '.') {
        if (current.indexOf('.') !== -1) {
          return;
        }
        current = current + '.';
        return;
      }

      if (current === '0') {
        current = d;
      } else {
        current = current + d;
      }
    }

    function chooseOperator(op) {
      if (operator && previous !== null && !justEvaluated) {
        evaluate();
      }
      previous = current;
      operator = op;
      current = '0';
      justEvaluated = false;
    }

    function evaluate() {
      if (operator === null || previous === null) {
        return;
      }

      var a = parseFloat(previous);
      var b = parseFloat(current);
      var result;
      var mathSymbol = opMap[operator];

      if (mathSymbol === '+') {
        result = a + b;
      } else if (mathSymbol === '-') {
        result = a - b;
      } else if (mathSymbol === '*') {
        result = a * b;
      } else if (mathSymbol === '/') {
        if (b === 0) {
          result = NaN;
        } else {
          result = a / b;
        }
      } else {
        result = b;
      }

      current = formatNumber(result);
      previous = null;
      operator = null;
      justEvaluated = true;
    }

    function clearAll() {
      current = '0';
      previous = null;
      operator = null;
      justEvaluated = false;
    }

    function backspace() {
      if (justEvaluated) {
        clearAll();
        return;
      }

      if (current.length > 1) {
        current = current.slice(0, -1);
      } else {
        current = '0';
      }
    }

    function percent() {
      current = formatNumber(parseFloat(current) / 100);
    }

    grid.addEventListener('click', function (event) {
      var btn = event.target.closest('button');
      if (!btn) {
        return;
      }

      var numberValue = btn.getAttribute('data-calc-num');
      var operatorValue = btn.getAttribute('data-calc-op');
      var actionValue = btn.getAttribute('data-calc-action');

      if (numberValue !== null) {
        inputNumber(numberValue);
      } else if (operatorValue !== null) {
        chooseOperator(operatorValue);
      } else if (actionValue === 'decimal') {
        inputNumber('.');
      } else if (actionValue === 'clear') {
        clearAll();
      } else if (actionValue === 'backspace') {
        backspace();
      } else if (actionValue === 'percent') {
        percent();
      } else if (actionValue === 'equals') {
        evaluate();
      }

      render();
    });

    render();
  }

  calculatorApp();

  /* ---------------------------------------------------------
     Code Editor app (Monaco Editor + a simple terminal)

     This loads the Monaco Editor library from a CDN (the same
     editor that powers VS Code) and puts it inside our window.
     There is no real backend yet, so the "terminal" below the
     editor is simulated: it understands a few basic commands,
     and its "run" command executes the JavaScript you typed
     in the editor, right there in the browser.
     --------------------------------------------------------- */
  function codeEditorApp() {
    var editorContainer = document.getElementById('mainpage-code-editor');
    var terminalOutput = document.getElementById('mainpage-code-terminal-output');
    var terminalInput = document.getElementById('mainpage-code-terminal-input');
    var runButton = document.getElementById('mainpage-code-run');
    if (!editorContainer) {
      return;
    }

    var starterCode = [
      '// Write JavaScript here, then press "Run" (or type "run" below).',
      '// Anything you pass to console.log() will show up in the',
      '// terminal panel underneath this editor.',
      '',
      'function greet(name) {',
      '  return "Hello, " + name + "!";',
      '}',
      '',
      'console.log(greet("CampSpace"));'
    ].join('\n');

    function printToTerminal(text, isError) {
      var line = document.createElement('div');
      line.className = 'mainpage-code-terminal-line';
      if (isError) {
        line.classList.add('mainpage-code-terminal-line--error');
      }
      line.textContent = text;

      terminalOutput.appendChild(line);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function loadMonacoEditor() {
      if (!window.require) {
        printToTerminal('Could not load the code editor (check your internet connection).', true);
        return;
      }

      // Point Monaco's loader at the same CDN version we loaded in main.html
      window.require.config({
        paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.49.0/min/vs' }
      });

      window.require(['vs/editor/editor.main'], function () {
        monacoEditorInstance = monaco.editor.create(editorContainer, {
          value: starterCode,
          language: 'javascript',
          theme: 'vs-dark',
          fontSize: 14,
          automaticLayout: true,
          minimap: { enabled: false }
        });
      });
    }

    loadMonacoEditor();

    function runCode() {
      if (!monacoEditorInstance) {
        printToTerminal('The editor is still loading, please wait a moment and try again.', true);
        return;
      }

      var code = monacoEditorInstance.getValue();
      printToTerminal('$ run');

      // Temporarily point console.log at our own function, so anything
      // the user's code logs shows up in our terminal panel instead of
      // the browser's own developer console.
      var originalConsoleLog = console.log;
      console.log = function () {
        var parts = [];
        for (var i = 0; i < arguments.length; i++) {
          parts.push(String(arguments[i]));
        }
        printToTerminal(parts.join(' '));
      };

      try {
        var runUserCode = new Function(code);
        runUserCode();
      } catch (error) {
        printToTerminal('Error: ' + error.message, true);
      }

      // Always put the real console.log back, even if the code above
      // threw an error.
      console.log = originalConsoleLog;
    }

    if (runButton) {
      runButton.addEventListener('click', runCode);
    }

    function handleTerminalCommand(rawCommand) {
      var command = rawCommand.trim();
      if (command === '') {
        return;
      }

      printToTerminal('$ ' + command);

      var firstSpace = command.indexOf(' ');
      var commandName;
      var rest;

      if (firstSpace === -1) {
        commandName = command;
        rest = '';
      } else {
        commandName = command.slice(0, firstSpace);
        rest = command.slice(firstSpace + 1);
      }

      if (commandName === 'help') {
        printToTerminal('Commands: help, clear, date, echo <text>, run');
      } else if (commandName === 'clear') {
        terminalOutput.innerHTML = '';
      } else if (commandName === 'date') {
        printToTerminal(new Date().toString());
      } else if (commandName === 'echo') {
        printToTerminal(rest);
      } else if (commandName === 'run') {
        runCode();
      } else {
        printToTerminal(commandName + ': command not found (type "help" for a list)', true);
      }
    }

    if (terminalInput) {
      terminalInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          var value = terminalInput.value;
          terminalInput.value = '';
          handleTerminalCommand(value);
        }
      });
    }

    printToTerminal('This is a simulated terminal (there is no real backend yet).');
    printToTerminal('Type "help" for a list of commands, or press "Run" to execute the code above.');
  }

  codeEditorApp();
}

runMainPageScript();
