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

  /* ---------------------------------------------------------
     Window registry
     We keep one small object per window so we always know if
     it is open, minimized, maximized, and its previous style.
     --------------------------------------------------------- */
  var windows = {};
  var frontmostApp = 'dashboard'; // tracked for the Class Session activity view

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
    frontmostApp = app;
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
    scheduleSaveSession();
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
    scheduleSaveSession();
  }

  function minimizeApp(app) {
    var windowData = windows[app];
    if (!windowData) {
      return;
    }

    windowData.el.classList.add('mainpage-window--hidden');
    windowData.minimized = true;

    syncDockIndicator(app);
    scheduleSaveSession();
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
    scheduleSaveSession();
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
        scheduleSaveSession();
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

  // If the person has a saved session from a previous visit, pick up
  // right where they left off (window positions + which apps were open).
  // Otherwise the hand-written positions already in the HTML are used.
  restoreSession();
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

    // Light mode is always the default the first time someone opens
    // CampSpace. After that, we remember whatever the person last chose,
    // regardless of their system/OS setting.
    var savedTheme = null;
    try {
      savedTheme = localStorage.getItem('campspace-theme');
    } catch (err) {
      savedTheme = null;
    }

    var isDark = savedTheme === 'dark';

    function applyTheme() {
      if (isDark) {
        body.classList.add('mainpage-body--dark');
      } else {
        body.classList.remove('mainpage-body--dark');
      }
      button.setAttribute('aria-pressed', String(isDark));

      try {
        localStorage.setItem('campspace-theme', isDark ? 'dark' : 'light');
      } catch (err) {
        // localStorage unavailable (private browsing etc) - theme just
        // won't persist across visits, which is fine.
      }
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
    code: { x: 120, y: 460 },
    browser: { x: 780, y: 460 },
    chat: { x: 1010, y: 460 },
    session: { x: 1010, y: 90 }
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

    scheduleSaveSession();
  }

  /* ---------------------------------------------------------
     Session memory + custom saved layouts

     "Session memory" quietly remembers where every window was and
     which ones were open, so the next visit (today, tomorrow, or
     next week) picks up right where the person left off.

     "Custom layouts" are the same kind of snapshot, but the person
     names and saves them on purpose, so they can jump back to a
     favourite arrangement whenever they like.
     --------------------------------------------------------- */
  var SESSION_STORAGE_KEY = 'campspace-last-session';
  var LAYOUTS_STORAGE_KEY = 'campspace-layouts';
  var sessionSaveTimer = null;

  function captureCurrentLayout() {
    var snapshot = {};
    var appNames = Object.keys(windows);

    for (var i = 0; i < appNames.length; i++) {
      var app = appNames[i];
      var windowData = windows[app];
      var computedStyle = getComputedStyle(windowData.el);

      snapshot[app] = {
        x: parseFloat(computedStyle.left) || 0,
        y: parseFloat(computedStyle.top) || 0,
        open: windowData.open,
        minimized: windowData.minimized,
        maximized: windowData.maximized
      };
    }

    return snapshot;
  }

  function applyLayoutSnapshot(snapshot) {
    var appNames = Object.keys(snapshot);

    for (var i = 0; i < appNames.length; i++) {
      var app = appNames[i];
      var windowData = windows[app];
      if (!windowData) {
        continue; // the snapshot might mention an app that no longer exists
      }

      var savedState = snapshot[app];

      if (windowData.maximized) {
        windowData.el.classList.remove('mainpage-window--maximized');
        windowData.maximized = false;
      }

      windowData.el.style.setProperty('--mainpage-x', savedState.x + 'px');
      windowData.el.style.setProperty('--mainpage-y', savedState.y + 'px');

      if (savedState.open) {
        openApp(app);
        if (savedState.minimized) {
          minimizeApp(app);
        }
        if (savedState.maximized) {
          toggleMaximize(app);
        }
      } else {
        closeApp(app);
      }
    }
  }

  function saveSession() {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(captureCurrentLayout()));
    } catch (err) {
      // localStorage might be unavailable - session just won't persist.
    }
  }

  function scheduleSaveSession() {
    // "windows" isn't ready on the very first pass (this function is
    // hoisted above where "windows" gets filled in), so guard for that.
    if (typeof windows === 'undefined') {
      return;
    }
    clearTimeout(sessionSaveTimer);
    sessionSaveTimer = setTimeout(saveSession, 400);
  }

  function restoreSession() {
    var storedText = null;
    try {
      storedText = localStorage.getItem(SESSION_STORAGE_KEY);
    } catch (err) {
      storedText = null;
    }

    if (!storedText) {
      return false;
    }

    var snapshot = null;
    try {
      snapshot = JSON.parse(storedText);
    } catch (err) {
      snapshot = null;
    }

    if (!snapshot) {
      return false;
    }

    applyLayoutSnapshot(snapshot);
    return true;
  }

  function getSavedLayouts() {
    var storedText = null;
    try {
      storedText = localStorage.getItem(LAYOUTS_STORAGE_KEY);
    } catch (err) {
      storedText = null;
    }

    if (!storedText) {
      return {};
    }

    try {
      var parsed = JSON.parse(storedText);
      if (parsed) {
        return parsed;
      }
      return {};
    } catch (err) {
      return {};
    }
  }

  function setSavedLayouts(layouts) {
    try {
      localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(layouts));
    } catch (err) {
      // localStorage might be unavailable - saved layouts just won't persist.
    }
  }

  function layoutsMenuSetup() {
    var wrap = document.getElementById('mainpage-layouts');
    var button = document.getElementById('mainpage-layouts-btn');
    var menu = document.getElementById('mainpage-layouts-menu');
    var nameInput = document.getElementById('mainpage-layout-name-input');
    var saveBtn = document.getElementById('mainpage-layout-save-btn');
    var list = document.getElementById('mainpage-layouts-list');

    if (!wrap || !button || !menu || !list) {
      return;
    }

    function closeMenu() {
      menu.classList.remove('mainpage-layouts-menu--open');
      button.setAttribute('aria-expanded', 'false');
    }

    function renderList() {
      var layouts = getSavedLayouts();
      var names = Object.keys(layouts);

      list.innerHTML = '';

      if (names.length === 0) {
        var emptyRow = document.createElement('div');
        emptyRow.className = 'mainpage-layouts-empty';
        emptyRow.textContent = 'No saved layouts yet';
        list.appendChild(emptyRow);
        return;
      }

      for (var i = 0; i < names.length; i++) {
        var layoutName = names[i];

        var row = document.createElement('div');
        row.className = 'mainpage-layout-row';

        var applyBtn = document.createElement('button');
        applyBtn.type = 'button';
        applyBtn.className = 'mainpage-layout-apply-btn';
        applyBtn.textContent = layoutName;
        applyBtn.setAttribute('data-layout-name', layoutName);

        var deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'mainpage-layout-delete-btn';
        deleteBtn.setAttribute('data-layout-name', layoutName);
        deleteBtn.setAttribute('aria-label', 'Delete layout ' + layoutName);
        deleteBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

        row.appendChild(applyBtn);
        row.appendChild(deleteBtn);
        list.appendChild(row);
      }
    }

    function openMenu() {
      renderList();
      menu.classList.add('mainpage-layouts-menu--open');
      button.setAttribute('aria-expanded', 'true');
    }

    button.addEventListener('click', function (event) {
      event.stopPropagation();
      var isOpen = menu.classList.contains('mainpage-layouts-menu--open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    list.addEventListener('click', function (event) {
      var applyBtn = event.target.closest('.mainpage-layout-apply-btn');
      var deleteBtn = event.target.closest('.mainpage-layout-delete-btn');

      if (applyBtn) {
        var layouts = getSavedLayouts();
        var name = applyBtn.getAttribute('data-layout-name');
        if (layouts[name]) {
          applyLayoutSnapshot(layouts[name]);
          scheduleSaveSession();
        }
        closeMenu();
        return;
      }

      if (deleteBtn) {
        event.stopPropagation();
        var currentLayouts = getSavedLayouts();
        delete currentLayouts[deleteBtn.getAttribute('data-layout-name')];
        setSavedLayouts(currentLayouts);
        renderList();
      }
    });

    if (saveBtn && nameInput) {
      saveBtn.addEventListener('click', function () {
        var name = nameInput.value.trim();
        if (!name) {
          nameInput.focus();
          return;
        }

        var layouts = getSavedLayouts();
        layouts[name] = captureCurrentLayout();
        setSavedLayouts(layouts);
        nameInput.value = '';
        renderList();
      });

      nameInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          saveBtn.click();
        }
      });
    }

    document.addEventListener('click', function (event) {
      if (!wrap.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }

  layoutsMenuSetup();

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
    var NOTEPAD_STORAGE_KEY = 'campspace-notepad-text';

    // Pick up whatever was typed last time, if anything.
    try {
      var savedNotepadText = localStorage.getItem(NOTEPAD_STORAGE_KEY);
      if (savedNotepadText !== null) {
        textarea.value = savedNotepadText;
      }
    } catch (err) {
      // localStorage unavailable - notepad just starts empty.
    }

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
        try {
          localStorage.setItem(NOTEPAD_STORAGE_KEY, textarea.value);
        } catch (err) {
          // localStorage unavailable - text just won't persist.
        }
        status.textContent = 'Saved';
      }, 600);
    });

    clearBtn.addEventListener('click', function () {
      textarea.value = '';
      updateCount();
      try {
        localStorage.setItem(NOTEPAD_STORAGE_KEY, '');
      } catch (err) {
        // localStorage unavailable - nothing to clear there.
      }
      status.textContent = 'Saved';
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
     Code editor app
     --------------------------------------------------------- */
  function codeEditorApp() {
    var langSelect = document.getElementById('mainpage-code-lang-select');
    var textarea = document.getElementById('mainpage-code-textarea');
    var gutter = document.getElementById('mainpage-code-gutter');
    var resetBtn = document.getElementById('mainpage-code-reset');
    var runBtn = document.getElementById('mainpage-code-run');
    var clearTermBtn = document.getElementById('mainpage-code-clear-term');
    var terminalOutput = document.getElementById('mainpage-code-terminal-output');
    var terminal = document.getElementById('mainpage-code-terminal');
    var resizeHandle = document.getElementById('mainpage-code-resize-handle');
    var codeBody = document.getElementById('mainpage-code-body');

    if (!textarea || !langSelect) {
      return;
    }

    var CODE_CONTENT_KEY = 'campspace-code-content';
    var CODE_LANG_KEY = 'campspace-code-lang';
    var CODE_FONT_KEY = 'campspace-code-font-size';

    var boilerplate = {
      python: 'print("Hello, CampSpace!")\n',
      c: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, CampSpace!\\n");\n    return 0;\n}\n',
      java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CampSpace!");\n    }\n}\n',
      cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, CampSpace!" << std::endl;\n    return 0;\n}\n',
      javascript: 'console.log("Hello, CampSpace!");\n',
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello, CampSpace!</h1>\n</body>\n</html>\n',
      css: 'body {\n  font-family: sans-serif;\n  background: #fafafb;\n  color: #111827;\n}\n\nh1 {\n  color: #2563eb;\n}\n',
      react: 'function App() {\n  return (\n    <div>\n      <h1>Hello, CampSpace!</h1>\n    </div>\n  );\n}\n\nexport default App;\n',
      mysql: 'CREATE TABLE students (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(100),\n    grade VARCHAR(10)\n);\n\nSELECT * FROM students;\n'
    };

    /* ---- per-language saved content ---- */
    function getSavedContent() {
      var storedText = null;
      try {
        storedText = localStorage.getItem(CODE_CONTENT_KEY);
      } catch (err) {
        storedText = null;
      }
      if (!storedText) {
        return {};
      }
      try {
        var parsed = JSON.parse(storedText);
        if (parsed) {
          return parsed;
        }
        return {};
      } catch (err) {
        return {};
      }
    }

    function saveContentFor(lang, code) {
      var all = getSavedContent();
      all[lang] = code;
      try {
        localStorage.setItem(CODE_CONTENT_KEY, JSON.stringify(all));
      } catch (err) {
        // localStorage unavailable - code just won't persist.
      }
    }

    var savedContent = getSavedContent();
    var savedLang = null;
    try {
      savedLang = localStorage.getItem(CODE_LANG_KEY);
    } catch (err) {
      savedLang = null;
    }
    if (savedLang && boilerplate[savedLang] !== undefined) {
      langSelect.value = savedLang;
    }

    var currentLang = langSelect.value;

    function loadLanguage(lang) {
      currentLang = lang;
      var content = savedContent[lang];
      if (content === undefined || content === null) {
        content = boilerplate[lang] || '';
      }
      textarea.value = content;
      updateGutter();
      try {
        localStorage.setItem(CODE_LANG_KEY, lang);
      } catch (err) {
        // localStorage unavailable.
      }
    }

    loadLanguage(currentLang);

    langSelect.addEventListener('change', function () {
      loadLanguage(langSelect.value);
    });

    resetBtn.addEventListener('click', function () {
      textarea.value = boilerplate[currentLang] || '';
      saveContentFor(currentLang, textarea.value);
      savedContent = getSavedContent();
      updateGutter();
      textarea.focus();
    });

    /* ---- line-number gutter ---- */
    function updateGutter() {
      var lineCount = textarea.value.split('\n').length;
      var lines = [];
      for (var i = 1; i <= lineCount; i++) {
        lines.push(i);
      }
      gutter.textContent = lines.join('\n');
      gutter.scrollTop = textarea.scrollTop;
    }

    var codeSaveTimer = null;
    textarea.addEventListener('input', function () {
      updateGutter();
      clearTimeout(codeSaveTimer);
      codeSaveTimer = setTimeout(function () {
        saveContentFor(currentLang, textarea.value);
        savedContent = getSavedContent();
      }, 500);
    });

    textarea.addEventListener('scroll', function () {
      gutter.scrollTop = textarea.scrollTop;
    });

    // Tab key types a real tab/indent instead of jumping focus away.
    textarea.addEventListener('keydown', function (event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        textarea.value = textarea.value.slice(0, start) + '  ' + textarea.value.slice(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        updateGutter();
      }
    });

    /* ---- ctrl / cmd + scroll to zoom the editor text ---- */
    var savedFontSize = null;
    try {
      savedFontSize = parseFloat(localStorage.getItem(CODE_FONT_KEY));
    } catch (err) {
      savedFontSize = NaN;
    }
    var fontSize = isNaN(savedFontSize) ? 13 : savedFontSize;

    function applyFontSize() {
      textarea.style.fontSize = fontSize + 'px';
      textarea.style.lineHeight = '1.6';
      gutter.style.fontSize = fontSize + 'px';
      gutter.style.lineHeight = '1.6';
      try {
        localStorage.setItem(CODE_FONT_KEY, String(fontSize));
      } catch (err) {
        // localStorage unavailable.
      }
    }
    applyFontSize();

    var codePane = document.getElementById('mainpage-code-pane');
    codePane.addEventListener('wheel', function (event) {
      var usedCtrlOrCmd = event.ctrlKey || event.metaKey;
      if (!usedCtrlOrCmd) {
        return; // plain scrolling should scroll the code, not zoom it
      }
      event.preventDefault();

      if (event.deltaY < 0) {
        fontSize = Math.min(fontSize + 1, 28);
      } else {
        fontSize = Math.max(fontSize - 1, 10);
      }
      applyFontSize();
    }, { passive: false });

    /* ---- drag to resize the terminal panel ---- */
    if (resizeHandle && terminal) {
      resizeHandle.addEventListener('mousedown', function (event) {
        event.preventDefault();
        var startY = event.clientY;
        var startHeight = parseFloat(getComputedStyle(terminal).height);
        var bodyHeight = codeBody.getBoundingClientRect().height;

        function onMouseMove(moveEvent) {
          var delta = startY - moveEvent.clientY;
          var newHeight = startHeight + delta;
          var minHeight = 60;
          var maxHeight = bodyHeight - 80; // leave room for the code pane
          if (newHeight < minHeight) {
            newHeight = minHeight;
          }
          if (newHeight > maxHeight) {
            newHeight = maxHeight;
          }
          terminal.style.setProperty('--mainpage-term-h', newHeight + 'px');
        }

        function onMouseUp() {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }

    /* ---- run / terminal ---- */
    function writeToTerminal(text, cssClass) {
      var line = document.createElement('div');
      if (cssClass) {
        line.className = cssClass;
      }
      line.textContent = text;
      terminalOutput.appendChild(line);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function clearTerminal() {
      terminalOutput.innerHTML = '';
    }

    function runJavaScript(code) {
      clearTerminal();
      var originalLog = console.log;
      var originalError = console.error;
      var originalWarn = console.warn;
      var wroteAnything = false;

      function stringifyArgs(args) {
        var parts = [];
        for (var i = 0; i < args.length; i++) {
          if (typeof args[i] === 'object') {
            try {
              parts.push(JSON.stringify(args[i]));
            } catch (err) {
              parts.push(String(args[i]));
            }
          } else {
            parts.push(String(args[i]));
          }
        }
        return parts.join(' ');
      }

      console.log = function () {
        wroteAnything = true;
        writeToTerminal(stringifyArgs(arguments));
        originalLog.apply(console, arguments);
      };
      console.warn = function () {
        wroteAnything = true;
        writeToTerminal(stringifyArgs(arguments), 'mainpage-term-info');
        originalWarn.apply(console, arguments);
      };
      console.error = function () {
        wroteAnything = true;
        writeToTerminal(stringifyArgs(arguments), 'mainpage-term-error');
        originalError.apply(console, arguments);
      };

      try {
        var runner = new Function(code);
        runner();
        if (!wroteAnything) {
          writeToTerminal('(ran with no output — try console.log(...) to print something)', 'mainpage-term-info');
        }
      } catch (err) {
        writeToTerminal(err.name + ': ' + err.message, 'mainpage-term-error');
      } finally {
        console.log = originalLog;
        console.warn = originalWarn;
        console.error = originalError;
      }
    }

    function runPreview(code, isCss) {
      clearTerminal();
      var iframe = document.createElement('iframe');
      iframe.className = 'mainpage-code-preview-frame';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.background = '#fff';

      var doc = code;
      if (isCss) {
        doc = '<!DOCTYPE html><html><head><style>' + code + '</style></head>' +
          '<body><h1>Hello, CampSpace!</h1><p>This is a live preview of your CSS applied ' +
          'to a couple of sample elements.</p><button>A button</button></body></html>';
      }

      iframe.setAttribute('sandbox', 'allow-scripts');
      terminalOutput.style.padding = '0';
      terminalOutput.appendChild(iframe);
      iframe.srcdoc = doc;
    }

    function runUnsupported(lang) {
      clearTerminal();
      var label = lang;
      writeToTerminal(
        'Running ' + label + ' for real needs a compiler/interpreter, which only exists ' +
        'on a server — a static site can\'t do it by itself.',
        'mainpage-term-info'
      );
      writeToTerminal(
        'Wire this button up to a backend (or an in-browser runtime like Pyodide for ' +
        'Python) to make Run actually execute this code.',
        'mainpage-term-info'
      );
    }

    runBtn.addEventListener('click', function () {
      terminalOutput.style.padding = '';
      var code = textarea.value;

      if (currentLang === 'javascript') {
        runJavaScript(code);
      } else if (currentLang === 'html') {
        runPreview(code, false);
      } else if (currentLang === 'css') {
        runPreview(code, true);
      } else {
        runUnsupported(langSelect.options[langSelect.selectedIndex].text);
      }
    });

    clearTermBtn.addEventListener('click', function () {
      terminalOutput.style.padding = '';
      clearTerminal();
      writeToTerminal('Press Run to execute your code.', 'mainpage-term-info');
    });
  }

  codeEditorApp();

  /* ---------------------------------------------------------
     Browser app

     An in-app browser panel using an <iframe>. This is an "embedded
     preview", not a real browser — most major sites (Google among
     them) send a header that tells browsers to refuse being shown
     inside another page, as a security measure against clickjacking.
     There's no key or setting that lifts that on their end; it's the
     site's own choice. When a page is blocked, this shows a hint and
     an "open in a new tab" fallback instead of a blank window.
     --------------------------------------------------------- */
  function browserApp() {
    var addressInput = document.getElementById('mainpage-browser-address');
    var frame = document.getElementById('mainpage-browser-frame');
    var backBtn = document.getElementById('mainpage-browser-back');
    var forwardBtn = document.getElementById('mainpage-browser-forward');
    var refreshBtn = document.getElementById('mainpage-browser-refresh');
    var openTabBtn = document.getElementById('mainpage-browser-open-tab');
    var bookmarksRow = document.getElementById('mainpage-browser-bookmarks');
    var blockedHint = document.getElementById('mainpage-browser-blocked-hint');
    var blockedOpenBtn = document.getElementById('mainpage-browser-blocked-open');
    var googleWidget = document.getElementById('mainpage-browser-google-widget');
    var googleWidgetTarget = document.getElementById('mainpage-browser-google-widget-target');

    if (!frame || !addressInput) {
      return;
    }

    var currentUrl = 'https://en.wikipedia.org/wiki/Special:Random';
    var loadWatchTimer = null;
    var googleWidgetRendered = false;

    function loadScriptOnce(src, onReady) {
      var existing = document.querySelector('script[data-campspace-src="' + src + '"]');
      if (existing) {
        if (existing.getAttribute('data-loaded') === 'true') {
          onReady();
        } else {
          existing.addEventListener('load', onReady);
        }
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-campspace-src', src);
      script.addEventListener('load', function () {
        script.setAttribute('data-loaded', 'true');
        onReady();
      });
      document.head.appendChild(script);
    }

    function looksLikeUrl(text) {
      if (/^https?:\/\//i.test(text)) {
        return true;
      }
      // something like "wikipedia.org" or "wikipedia.org/wiki/Cat"
      return /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(text);
    }

    function toUrl(text) {
      var trimmed = text.trim();
      if (trimmed.length === 0) {
        return null;
      }
      if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
      }
      if (looksLikeUrl(trimmed)) {
        return 'https://' + trimmed;
      }
      return 'https://duckduckgo.com/html/?q=' + encodeURIComponent(trimmed);
    }

    function hideBlockedHint() {
      blockedHint.classList.remove('mainpage-browser-blocked-hint--visible');
    }

    function showBlockedHint() {
      blockedHint.classList.add('mainpage-browser-blocked-hint--visible');
    }

    /* ---- Google search widget ----
       google.com refuses to be framed (it sends a header that tells
       every browser to block that, on every page, no key can turn
       it off). This renders Google's own embeddable search widget
       instead - a real, live Google-powered search box + results
       that runs directly on the page rather than inside a frame. */
    function showGoogleWidget() {
      clearTimeout(loadWatchTimer);
      hideBlockedHint();
      frame.style.visibility = 'hidden';
      googleWidget.classList.add('mainpage-browser-google-widget--visible');
      addressInput.value = 'Google Search';
      currentUrl = 'https://www.google.com/';

      var config = (window.CAMPSPACE_OAUTH_CONFIG && window.CAMPSPACE_OAUTH_CONFIG.googleSearch) || {};
      var searchEngineId = config.searchEngineId;
      var isConfigured = searchEngineId && searchEngineId.indexOf('YOUR_') !== 0;

      if (!isConfigured) {
        googleWidgetTarget.innerHTML =
          '<p class="mainpage-browser-google-setup-note">' +
          'Google search needs a free Search Engine ID first \u2014 see the setup steps in oauth-config.js.' +
          '<code>googleSearch.searchEngineId</code>' +
          '</p>';
        return;
      }

      if (googleWidgetRendered) {
        return; // already loaded once - Google's widget persists in the DOM
      }

      window.__gcse = window.__gcse || {};
      window.__gcse.parsetags = 'explicit';

      loadScriptOnce('https://cse.google.com/cse.js?cx=' + encodeURIComponent(searchEngineId), function () {
        if (window.google && google.search && google.search.cse && google.search.cse.element) {
          google.search.cse.element.render({
            div: 'mainpage-browser-google-widget-target',
            tag: 'search'
          });
          googleWidgetRendered = true;
        }
      });
    }

    function hideGoogleWidget() {
      frame.style.visibility = 'visible';
      googleWidget.classList.remove('mainpage-browser-google-widget--visible');
    }

    function navigateTo(url) {
      hideGoogleWidget();
      currentUrl = url;
      addressInput.value = url;
      hideBlockedHint();

      clearTimeout(loadWatchTimer);
      frame.src = url;

      // We can't read whether the response actually blocked framing
      // (that's cross-origin, by design), so this is a heuristic: if
      // the frame hasn't told us it loaded within a few seconds,
      // assume it might be blocked and offer the fallback.
      loadWatchTimer = setTimeout(function () {
        showBlockedHint();
      }, 3500);
    }

    frame.addEventListener('load', function () {
      clearTimeout(loadWatchTimer);
      // A blocked page can still fire "load" (loading an empty
      // refusal page), so this doesn't guarantee success - it just
      // cancels the "probably blocked" guess once something loads.
      hideBlockedHint();
    });

    addressInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        var url = toUrl(addressInput.value);
        if (url) {
          navigateTo(url);
        }
      }
    });

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        try {
          frame.contentWindow.history.back();
        } catch (err) {
          // Cross-origin frame with nothing to go back to - ignore.
        }
      });
    }

    if (forwardBtn) {
      forwardBtn.addEventListener('click', function () {
        try {
          frame.contentWindow.history.forward();
        } catch (err) {
          // Cross-origin frame with nothing to go forward to - ignore.
        }
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        if (googleWidget.classList.contains('mainpage-browser-google-widget--visible')) {
          return; // nothing to refresh - the widget stays live on its own
        }
        navigateTo(currentUrl);
      });
    }

    if (openTabBtn) {
      openTabBtn.addEventListener('click', function () {
        window.open(currentUrl, '_blank', 'noopener');
      });
    }

    if (blockedOpenBtn) {
      blockedOpenBtn.addEventListener('click', function () {
        window.open(currentUrl, '_blank', 'noopener');
      });
    }

    if (bookmarksRow) {
      bookmarksRow.addEventListener('click', function (event) {
        var button = event.target.closest('button');
        if (!button) {
          return;
        }
        if (button.getAttribute('data-widget') === 'google') {
          showGoogleWidget();
          return;
        }
        var url = button.getAttribute('data-url');
        if (url) {
          navigateTo(url);
        }
      });
    }

    navigateTo(currentUrl);
  }

  browserApp();

  /* ---------------------------------------------------------
     Campus Chat — a public notes/info board

     This syncs instantly across every CampSpace tab open on this
     device using the browser's storage event (no server needed for
     that part), which is perfect for trying the feature out. Real
     cross-device chat — a message sent from a classmate's phone
     ending up here — needs a backend to relay it (e.g. Firebase,
     Supabase, or a small WebSocket server); wire one in here the
     same way oauth-config.js plugs into sign-in.
     --------------------------------------------------------- */
  function chatApp() {
    var messagesEl = document.getElementById('mainpage-chat-messages');
    var input = document.getElementById('mainpage-chat-input');
    var sendBtn = document.getElementById('mainpage-chat-send');

    if (!messagesEl || !input || !sendBtn) {
      return;
    }

    var CHAT_STORAGE_KEY = 'campspace-chat-messages';
    var MAX_MESSAGES = 200;
    var myName = displayNameForThisBrowser();

    function getMessages() {
      var storedText = null;
      try {
        storedText = localStorage.getItem(CHAT_STORAGE_KEY);
      } catch (err) {
        storedText = null;
      }
      if (!storedText) {
        return [];
      }
      try {
        var parsed = JSON.parse(storedText);
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        return [];
      }
    }

    function saveMessages(messages) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      } catch (err) {
        // localStorage unavailable - messages just won't persist/sync.
      }
    }

    function formatTime(timestamp) {
      var date = new Date(timestamp);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var meridiem = hours >= 12 ? 'PM' : 'AM';
      var hour12 = hours % 12;
      if (hour12 === 0) {
        hour12 = 12;
      }
      var minutesText = minutes < 10 ? '0' + minutes : String(minutes);
      return hour12 + ':' + minutesText + ' ' + meridiem;
    }

    function render() {
      var messages = getMessages();
      messagesEl.innerHTML = '';

      if (messages.length === 0) {
        var empty = document.createElement('p');
        empty.className = 'mainpage-chat-empty';
        empty.textContent = 'No notes yet \u2014 be the first to share something.';
        messagesEl.appendChild(empty);
        return;
      }

      for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        var isOwn = message.author === myName;

        var row = document.createElement('div');
        row.className = 'mainpage-chat-msg ' + (isOwn ? 'mainpage-chat-msg--own' : 'mainpage-chat-msg--other');

        var meta = document.createElement('div');
        meta.className = 'mainpage-chat-msg-meta';
        meta.textContent = (isOwn ? 'You' : message.author) + ' \u00b7 ' + formatTime(message.ts);

        var bubble = document.createElement('div');
        bubble.className = 'mainpage-chat-msg-bubble';
        bubble.textContent = message.text;

        row.appendChild(meta);
        row.appendChild(bubble);
        messagesEl.appendChild(row);
      }

      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function sendMessage() {
      var text = input.value.trim();
      if (!text) {
        return;
      }

      var messages = getMessages();
      messages.push({
        id: Date.now() + '-' + Math.random().toString(36).slice(2),
        author: myName,
        text: text,
        ts: Date.now()
      });

      if (messages.length > MAX_MESSAGES) {
        messages = messages.slice(messages.length - MAX_MESSAGES);
      }

      saveMessages(messages);
      input.value = '';
      render();
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
      }
    });

    // Fires in every OTHER tab whenever one tab writes to
    // localStorage - this is what makes the chat feel "live"
    // across tabs without any server.
    window.addEventListener('storage', function (event) {
      if (event.key === CHAT_STORAGE_KEY) {
        render();
      }
    });

    render();
  }

  /* Shared by Chat + Class Session: a stable display name for
     whoever's using this browser, preferring their signed-in name. */
  function displayNameForThisBrowser() {
    if (window.CampSpaceAuth) {
      var session = window.CampSpaceAuth.getSession();
      if (session && session.name) {
        return session.name;
      }
    }

    var guestName = null;
    try {
      guestName = localStorage.getItem('campspace-guest-name');
    } catch (err) {
      guestName = null;
    }

    if (!guestName) {
      guestName = 'Guest ' + Math.floor(1000 + Math.random() * 9000);
      try {
        localStorage.setItem('campspace-guest-name', guestName);
      } catch (err) {
        // localStorage unavailable - name just won't be remembered.
      }
    }

    return guestName;
  }

  chatApp();

  /* ---------------------------------------------------------
     Class Session — a Meet-style teacher session

     A teacher starts a session and gets a short code to share.
     Students who join it show up on the teacher's roster, along
     with which CampSpace window they currently have open (Notepad,
     Code Editor, Browser, etc) - that's read from this same tab's
     own "frontmostApp" tracking, nothing outside CampSpace.

     Like Chat, this syncs across tabs on the same device via the
     storage event, which is enough to try the feature with a
     teacher tab + a student tab side by side. Making this work
     across different students' actual devices needs a backend to
     relay the roster + a real video/screen layer for the "Meet"
     part - both are natural next additions once you're ready.
     --------------------------------------------------------- */
  function classSessionApp() {
    var idlePanel = document.getElementById('mainpage-session-idle');
    var teacherPanel = document.getElementById('mainpage-session-teacher');
    var studentPanel = document.getElementById('mainpage-session-student');
    var startBtn = document.getElementById('mainpage-session-start-btn');
    var codeInput = document.getElementById('mainpage-session-code-input');
    var joinBtn = document.getElementById('mainpage-session-join-btn');
    var idleNote = document.getElementById('mainpage-session-idle-note');
    var codeDisplay = document.getElementById('mainpage-session-code-display');
    var joinedCodeDisplay = document.getElementById('mainpage-session-joined-code-display');
    var rosterEl = document.getElementById('mainpage-session-roster');
    var endBtn = document.getElementById('mainpage-session-end-btn');
    var leaveBtn = document.getElementById('mainpage-session-leave-btn');

    if (!idlePanel || !teacherPanel || !studentPanel) {
      return;
    }

    var SESSION_STORAGE_KEY = 'campspace-class-session';
    var ROSTER_STORAGE_KEY = 'campspace-class-roster';
    var ROLE_KEY = 'campspace-class-role'; // sessionStorage: unique per tab
    var CODE_KEY = 'campspace-class-code'; // sessionStorage: unique per tab
    var STUDENT_ID_KEY = 'campspace-student-id'; // localStorage: stable per browser
    var OFFLINE_AFTER_MS = 15000;

    var heartbeatTimer = null;
    var rosterWatchTimer = null;

    var appDisplayNames = {
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      notepad: 'Notepad',
      calculator: 'Calculator',
      code: 'Code Editor',
      browser: 'Browser',
      chat: 'Campus Chat',
      session: 'Class Session'
    };

    function getActiveSession() {
      var storedText = null;
      try {
        storedText = localStorage.getItem(SESSION_STORAGE_KEY);
      } catch (err) {
        storedText = null;
      }
      if (!storedText) {
        return null;
      }
      try {
        return JSON.parse(storedText);
      } catch (err) {
        return null;
      }
    }

    function setActiveSession(data) {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        // localStorage unavailable.
      }
    }

    function clearActiveSession() {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (err) {
        // localStorage unavailable.
      }
    }

    function getRoster() {
      var storedText = null;
      try {
        storedText = localStorage.getItem(ROSTER_STORAGE_KEY);
      } catch (err) {
        storedText = null;
      }
      if (!storedText) {
        return {};
      }
      try {
        var parsed = JSON.parse(storedText);
        return parsed || {};
      } catch (err) {
        return {};
      }
    }

    function setRoster(roster) {
      try {
        localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(roster));
      } catch (err) {
        // localStorage unavailable.
      }
    }

    function getMyRole() {
      try {
        return sessionStorage.getItem(ROLE_KEY);
      } catch (err) {
        return null;
      }
    }

    function getMyCode() {
      try {
        return sessionStorage.getItem(CODE_KEY);
      } catch (err) {
        return null;
      }
    }

    function setMyRoleAndCode(role, code) {
      try {
        sessionStorage.setItem(ROLE_KEY, role);
        sessionStorage.setItem(CODE_KEY, code);
      } catch (err) {
        // sessionStorage unavailable.
      }
    }

    function clearMyRoleAndCode() {
      try {
        sessionStorage.removeItem(ROLE_KEY);
        sessionStorage.removeItem(CODE_KEY);
      } catch (err) {
        // sessionStorage unavailable.
      }
    }

    function getStudentId() {
      var id = null;
      try {
        id = localStorage.getItem(STUDENT_ID_KEY);
      } catch (err) {
        id = null;
      }
      if (!id) {
        id = 'student-' + Date.now() + '-' + Math.random().toString(36).slice(2);
        try {
          localStorage.setItem(STUDENT_ID_KEY, id);
        } catch (err) {
          // localStorage unavailable.
        }
      }
      return id;
    }

    function generateSessionCode() {
      var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid mix-ups
      var code = '';
      for (var i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }

    function showPanel(panelToShow) {
      idlePanel.classList.add('mainpage-session-panel--hidden');
      teacherPanel.classList.add('mainpage-session-panel--hidden');
      studentPanel.classList.add('mainpage-session-panel--hidden');
      panelToShow.classList.remove('mainpage-session-panel--hidden');
    }

    function setIdleNote(text, kind) {
      idleNote.textContent = text || '';
      idleNote.className = 'mainpage-session-note' + (kind ? ' mainpage-session-note--' + kind : '');
    }

    function renderRoster() {
      var roster = getRoster();
      var studentIds = Object.keys(roster);
      rosterEl.innerHTML = '';

      if (studentIds.length === 0) {
        var empty = document.createElement('p');
        empty.className = 'mainpage-session-roster-empty';
        empty.textContent = 'No students have joined yet.';
        rosterEl.appendChild(empty);
        return;
      }

      var now = Date.now();
      for (var i = 0; i < studentIds.length; i++) {
        var entry = roster[studentIds[i]];
        var isOffline = (now - entry.lastSeenAt) > OFFLINE_AFTER_MS;

        var row = document.createElement('div');
        row.className = 'mainpage-session-student-row';

        var nameEl = document.createElement('span');
        nameEl.className = 'mainpage-session-student-name';
        nameEl.textContent = entry.name;

        var appEl = document.createElement('span');
        appEl.className = 'mainpage-session-student-app' + (isOffline ? ' mainpage-session-student-stale' : '');
        appEl.textContent = isOffline ? 'Offline' : (appDisplayNames[entry.app] || entry.app);

        row.appendChild(nameEl);
        row.appendChild(appEl);
        rosterEl.appendChild(row);
      }
    }

    function startTeacherWatch() {
      clearInterval(rosterWatchTimer);
      // Re-render on a timer too (not just on storage events) so a
      // student whose tab just closed silently still flips to
      // "Offline" for the teacher after a few seconds.
      rosterWatchTimer = setInterval(renderRoster, 4000);
    }

    function startSession() {
      var code = generateSessionCode();
      setActiveSession({ code: code, teacherName: displayNameForThisBrowser(), startedAt: Date.now() });
      setRoster({});
      setMyRoleAndCode('teacher', code);

      codeDisplay.textContent = code;
      showPanel(teacherPanel);
      renderRoster();
      startTeacherWatch();
    }

    function endSession() {
      clearActiveSession();
      setRoster({});
      clearMyRoleAndCode();
      clearInterval(rosterWatchTimer);
      showPanel(idlePanel);
      setIdleNote('', null);
    }

    function sendHeartbeat() {
      var activeSession = getActiveSession();
      var myCode = getMyCode();

      if (!activeSession || activeSession.code !== myCode) {
        leaveBecauseSessionEnded();
        return;
      }

      var roster = getRoster();
      var studentId = getStudentId();
      var existingEntry = roster[studentId];

      roster[studentId] = {
        name: displayNameForThisBrowser(),
        app: frontmostApp,
        joinedAt: existingEntry ? existingEntry.joinedAt : Date.now(),
        lastSeenAt: Date.now()
      };

      setRoster(roster);
    }

    function leaveBecauseSessionEnded() {
      clearInterval(heartbeatTimer);
      clearMyRoleAndCode();
      showPanel(idlePanel);
      setIdleNote('The session you were in has ended.', 'error');
    }

    function joinSession() {
      var code = codeInput.value.trim().toUpperCase();

      if (!code) {
        setIdleNote('Enter a session code first.', 'error');
        return;
      }

      var activeSession = getActiveSession();
      if (!activeSession || activeSession.code !== code) {
        setIdleNote('No active session with that code.', 'error');
        return;
      }

      setMyRoleAndCode('student', code);
      joinedCodeDisplay.textContent = code;
      showPanel(studentPanel);
      codeInput.value = '';
      setIdleNote('', null);

      clearInterval(heartbeatTimer);
      sendHeartbeat();
      heartbeatTimer = setInterval(sendHeartbeat, 4000);
    }

    function leaveSession() {
      var roster = getRoster();
      delete roster[getStudentId()];
      setRoster(roster);

      clearInterval(heartbeatTimer);
      clearMyRoleAndCode();
      showPanel(idlePanel);
      setIdleNote('', null);
    }

    startBtn.addEventListener('click', startSession);
    joinBtn.addEventListener('click', joinSession);
    codeInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        joinSession();
      }
    });
    endBtn.addEventListener('click', endSession);
    leaveBtn.addEventListener('click', leaveSession);

    window.addEventListener('storage', function (event) {
      if (event.key === ROSTER_STORAGE_KEY && getMyRole() === 'teacher') {
        renderRoster();
      }
      if (event.key === SESSION_STORAGE_KEY && getMyRole() === 'student' && !event.newValue) {
        leaveBecauseSessionEnded();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (getMyRole() === 'student') {
        var roster = getRoster();
        delete roster[getStudentId()];
        setRoster(roster);
      }
    });

    // Reconnect this tab to whatever role/session it already had
    // (e.g. after a page refresh), if that session is still active.
    (function restoreState() {
      var role = getMyRole();
      var code = getMyCode();
      var activeSession = getActiveSession();

      if (role === 'teacher' && activeSession && activeSession.code === code) {
        codeDisplay.textContent = code;
        showPanel(teacherPanel);
        renderRoster();
        startTeacherWatch();
      } else if (role === 'student' && activeSession && activeSession.code === code) {
        joinedCodeDisplay.textContent = code;
        showPanel(studentPanel);
        clearInterval(heartbeatTimer);
        sendHeartbeat();
        heartbeatTimer = setInterval(sendHeartbeat, 4000);
      } else {
        showPanel(idlePanel);
      }
    })();
  }

  classSessionApp();
}

runMainPageScript();
