/*
 * BEGINNER GUIDE: src/lib/main.js
 * This file handles the Legacy workspace DOM interactions.
 * Syllabus topics visible here: Fetch API / async-await, Browser storage / JSON, DOM events / event handling, ES6 spread/rest, ES6 let/const, props / component composition.
 * The code below keeps the original behaviour; comments explain the main jobs.
 */

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

// BEGINNER: runMainPageScript()
// Main job: perform one focused task for this file.
// It receives data/props, performs the required work, and returns the result or UI.
// Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: dockItemFor()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: bringToFront()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: openApp()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: closeApp()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: minimizeApp()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: toggleMaximize()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: toggleDockApp()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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
  // BEGINNER: setupActionButton()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: setupWindowDrag()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function setupWindowDrag(windowElement, app, dragHandle) {
    // Desktop-style window dragging: grab an empty part of the title bar
    // and move the selected window. Controls inside the title bar keep their
    // normal click behaviour.
    if (!dragHandle) {
      return;
    }

    function startWindowDrag(event) {
      if (event.button !== 0) {
        return;
      }

      var clickedOnButton = event.target.closest('button');
      if (clickedOnButton) {
        return;
      }

      var interactive = event.target.closest(
        'select, input, textarea, a, [contenteditable="true"], [data-no-window-drag]'
      );
      if (interactive) {
        return;
      }

      if (windows[app].maximized) {
        return;
      }

      bringToFront(app);
      windowElement.classList.add('mainpage-window--dragging');

      var startX = event.clientX;
      var startY = event.clientY;
      var startLeft = parseFloat(getComputedStyle(windowElement).left) || 0;
      var startTop = parseFloat(getComputedStyle(windowElement).top) || 0;

      // Pointer capture keeps the drag alive if the cursor moves outside the
      // title bar (or outside the window) before the button is released.
      if (event.pointerId !== undefined && dragHandle.setPointerCapture) {
        dragHandle.setPointerCapture(event.pointerId);
      }

      // BEGINNER: onPointerMove()
      // Main job: perform one focused task for this file.
      // It receives data/props, performs the required work, and returns the result or UI.
      // Keeping this job in one function makes the code easier to follow during the PPT.
      function onPointerMove(moveEvent) {
        var deltaX = (moveEvent.clientX - startX) / Math.max(canvasZoom, 0.01);
        var deltaY = (moveEvent.clientY - startY) / Math.max(canvasZoom, 0.01);

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

      // BEGINNER: onPointerUp()
      // Main job: perform one focused task for this file.
      // It receives data/props, performs the required work, and returns the result or UI.
      // Keeping this job in one function makes the code easier to follow during the PPT.
      function onPointerUp() {
        windowElement.classList.remove('mainpage-window--dragging');
        dragHandle.removeEventListener('pointermove', onPointerMove);
        dragHandle.removeEventListener('pointerup', onPointerUp);
        dragHandle.removeEventListener('pointercancel', onPointerUp);
        scheduleSaveSession();
      }

      dragHandle.addEventListener('pointermove', onPointerMove);
      dragHandle.addEventListener('pointerup', onPointerUp);
      dragHandle.addEventListener('pointercancel', onPointerUp);
      event.preventDefault();
    }

    dragHandle.addEventListener('pointerdown', startWindowDrag);
  }

  // BEGINNER: setupWindowChrome()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // Wire up every window's title-bar buttons (close/minimize/maximize)
  // and drag handle. Without this loop actually running, the buttons
  // and dragging exist in the markup/CSS but nothing listens for them.
  for (var c = 0; c < windowElements.length; c++) {
    setupWindowChrome(windowElements[c]);
  }

  // Persist freeform window resizing. CSS handles the actual resize UI;
  // this listener makes the new dimensions survive reloads and saved layouts.
  for (var r = 0; r < windowElements.length; r++) {
    (function (resizableWindow) {
      var resizeObserver = new ResizeObserver(function () {
        if (!resizableWindow.classList.contains('mainpage-window--maximized')) {
          scheduleSaveSession();
        }
      });
      resizeObserver.observe(resizableWindow);
    })(windowElements[r]);
  }

  // Give the dashboard window a front / z-index state right away
  bringToFront('dashboard');

  /* ---------------------------------------------------------
     Main workspace pan & zoom
     Normal mouse behavior is reserved for individual windows.
     The 2D workspace itself is panned only with CTRL + RIGHT DRAG.
     Mouse-wheel zoom remains available for navigating the workspace.
     --------------------------------------------------------- */
  var canvasZoom = 1;
  var canvasPanX = 0;
  var canvasPanY = 0;
  var canvasViewport = document.querySelector('.mainpage-canvas-viewport');

  // BEGINNER: applyCanvasTransform()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function applyCanvasTransform() {
    if (!canvas) return;
    canvas.style.transform =
      'translate(' + canvasPanX + 'px, ' + canvasPanY + 'px) scale(' + canvasZoom + ')';
  }

  if (canvasViewport && canvas) {
    canvasViewport.addEventListener('wheel', function (event) {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      var rect = canvasViewport.getBoundingClientRect();
      var pointerX = event.clientX - rect.left;
      var pointerY = event.clientY - rect.top;
      var oldZoom = canvasZoom;
      var zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
      canvasZoom = Math.max(0.5, Math.min(2.5, oldZoom * zoomFactor));
      var canvasPointX = (pointerX - canvasPanX) / oldZoom;
      var canvasPointY = (pointerY - canvasPanY) / oldZoom;
      canvasPanX = pointerX - canvasPointX * canvasZoom;
      canvasPanY = pointerY - canvasPointY * canvasZoom;
      applyCanvasTransform();
    }, { passive:false });

    // The context menu is suppressed only for the CTRL + right-drag gesture.
    canvasViewport.addEventListener('contextmenu', function (event) {
      if (event.ctrlKey) event.preventDefault();
    });

    canvasViewport.addEventListener('mousedown', function (event) {
      var clickedWindow = event.target.closest('.mainpage-window');
      if (clickedWindow) return;

      // Pan the 2D plane only with CTRL + right mouse button.
      if (event.button !== 0) return;

      event.preventDefault();
      canvasViewport.classList.add('mainpage-canvas--panning');
      var startClientX = event.clientX;
      var startClientY = event.clientY;
      var startPanX = canvasPanX;
      var startPanY = canvasPanY;

      // BEGINNER: onPanMove()
      // Main job: perform one focused task for this file.
      // It receives data/props, performs the required work, and returns the result or UI.
      // Keeping this job in one function makes the code easier to follow during the PPT.
      function onPanMove(moveEvent) {
        canvasPanX = startPanX + (moveEvent.clientX - startClientX);
        canvasPanY = startPanY + (moveEvent.clientY - startClientY);
        applyCanvasTransform();
      }

      function onPanUp() {
        canvasViewport.classList.remove('mainpage-canvas--panning');
        document.removeEventListener('mousemove', onPanMove);
        document.removeEventListener('mouseup', onPanUp);
      }

      document.addEventListener('mousemove', onPanMove);
      document.addEventListener('mouseup', onPanUp);
    });
  }

  // If the person has a saved session from a previous visit, pick up
  // right where they left off (window positions + which apps were open).
  // Otherwise the hand-written positions already in the HTML are used.
  restoreSession();
  bringToFront('dashboard');

  /* ---------------------------------------------------------
     Dark mode
     --------------------------------------------------------- */
  // BEGINNER: themeToggle()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: applyTheme()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: openPalette()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: setupPaletteAppButton()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: setupPaletteCommandButton()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // Dashboard shortcuts simply open the existing apps. Keeping this small
  // makes the dashboard useful without adding a backend or framework.
  var dashboardDate = document.getElementById('mainpage-dashboard-date');
  if (dashboardDate) {
    dashboardDate.textContent = new Date().toLocaleDateString(undefined, {
      weekday: 'long', month: 'short', day: 'numeric'
    });
  }

  var dashboardOpenButtons = document.querySelectorAll('[data-mainpage-dashboard-open]');
  for (var dashboardButtonIndex = 0; dashboardButtonIndex < dashboardOpenButtons.length; dashboardButtonIndex++) {
    dashboardOpenButtons[dashboardButtonIndex].addEventListener('click', function () {
      openApp(this.getAttribute('data-mainpage-dashboard-open'));
    });
  }

  var defaultLayout = {
    dashboard: { x: 120, y: 100 },
    chalkpad: { x: 300, y: 90 },
    calendar: { x: 600, y: 90 },
    notepad: { x: 1010, y: 100 },
    calculator: { x: 600, y: 430 },
    code: { x: 120, y: 460 },
    aichat: { x: 780, y: 460 },
    chat: { x: 1010, y: 460 },
    session: { x: 1010, y: 90 }
  };

  // BEGINNER: autoArrange()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function autoArrange() {
    // Pack every currently open window using its REAL current dimensions.
    // This is deliberately not a list of hard-coded coordinates: it keeps
    // working after the user has resized, moved, or heavily overlapped windows.
    var items = [];
    var appNames = Object.keys(windows);

    for (var r = 0; r < appNames.length; r++) {
      var app = appNames[r];
      var windowData = windows[app];
      if (!windowData || !windowData.open || windowData.el.classList.contains('mainpage-window--hidden')) {
        continue;
      }

      if (windowData.maximized) {
        windowData.el.classList.remove('mainpage-window--maximized');
        windowData.maximized = false;
      }

      var width = Math.max(280, windowData.el.offsetWidth || parseFloat(getComputedStyle(windowData.el).width) || 420);
      var height = Math.max(180, windowData.el.offsetHeight || parseFloat(getComputedStyle(windowData.el).height) || 300);
      items.push({ app: app, el: windowData.el, width: width, height: height });
    }

    if (items.length === 0) {
      return;
    }

    // Start in the part of the canvas currently visible to the person, rather
    // than at a fixed canvas origin. That makes Auto-arrange bring windows to
    // the current workspace view even after the canvas has been panned or
    // zoomed somewhere else.
    var viewportRect = canvasViewport ? canvasViewport.getBoundingClientRect() : null;
    var canvasRect = canvas ? canvas.getBoundingClientRect() : null;
    var zoom = Math.max(canvasZoom, 0.01);
    var visibleLeft = 0;
    var visibleTop = 0;
    var visibleWidth = window.innerWidth / zoom;

    if (viewportRect && canvasRect) {
      visibleLeft = Math.max(0, (viewportRect.left - canvasRect.left) / zoom);
      visibleTop = Math.max(0, (viewportRect.top - canvasRect.top) / zoom);
      visibleWidth = Math.max(320, viewportRect.width / zoom);
    }

    var gap = 28;
    var startX = visibleLeft + gap;
    var x = startX;
    var y = visibleTop + gap;
    var availableRight = visibleLeft + visibleWidth - gap;
    var rowHeight = 0;

    // Put the widest windows first. This produces a much more compact packing
    // when the user has a mix of narrow and very wide resized windows.
    items.sort(function (a, b) {
      return (b.width * b.height) - (a.width * a.height);
    });

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      if (x > startX && x + item.width > availableRight) {
        x = startX;
        y += rowHeight + gap;
        rowHeight = 0;
      }

      item.el.style.setProperty('--mainpage-x', x + 'px');
      item.el.style.setProperty('--mainpage-y', y + 'px');
      x += item.width + gap;
      rowHeight = Math.max(rowHeight, item.height);
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

  // BEGINNER: captureCurrentLayout()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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
        width: parseFloat(computedStyle.width) || 0,
        height: parseFloat(computedStyle.height) || 0,
        open: windowData.open,
        minimized: windowData.minimized,
        maximized: windowData.maximized
      };
    }

    return snapshot;
  }

  // BEGINNER: applyLayoutSnapshot()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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
      if (savedState.width && savedState.width >= 260) {
        windowData.el.style.width = savedState.width + 'px';
      }
      if (savedState.height && savedState.height >= 180) {
        windowData.el.style.height = savedState.height + 'px';
      }

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

  // BEGINNER: saveSession()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: restoreSession()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: getSavedLayouts()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

  // BEGINNER: setSavedLayouts()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: closeMenu()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: openMenu()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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
  // BEGINNER: calendarApp()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: isSameDay()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: render()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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
  // BEGINNER: notepadApp()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: updateCount()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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
  // BEGINNER: calculatorApp()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: formatNumber()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: render()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function render() {
      resultEl.textContent = current;

      if (previous !== null && operator) {
        exprEl.textContent = previous + ' ' + operator;
      } else {
        exprEl.textContent = '\u00A0';
      }
    }

    // BEGINNER: inputNumber()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: chooseOperator()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function chooseOperator(op) {
      if (operator && previous !== null && !justEvaluated) {
        evaluate();
      }
      previous = current;
      operator = op;
      current = '0';
      justEvaluated = false;
    }

    // BEGINNER: evaluate()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: clearAll()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: percent()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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
  // BEGINNER: codeEditorApp()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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
      mysql: 'CREATE TABLE students (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(100),\n    grade VARCHAR(10)\n);\n\nSELECT * FROM students;\n',
       typescript: 'const message: string = "Hello, CampSpace!";\nconsole.log(message);\n',
       go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, CampSpace!")\n}\n',
       rust: 'fn main() {\n    println!("Hello, CampSpace!");\n}\n',
       csharp: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, CampSpace!");\n    }\n}\n',
       kotlin: 'fun main() {\n    println("Hello, CampSpace!")\n}\n',
       swift: 'print("Hello, CampSpace!")\n',
       php: '<?php\necho "Hello, CampSpace!\\n";\n?>\n',
       ruby: 'puts "Hello, CampSpace!"\n',
       bash: '#!/usr/bin/env bash\necho "Hello, CampSpace!"\n',
       lua: 'print("Hello, CampSpace!")\n',
       r: 'cat("Hello, CampSpace!\\n")\n'
    };

    /* ---- per-language saved content ---- */
    // BEGINNER: getSavedContent()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: saveContentFor()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: loadLanguage()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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
    // BEGINNER: updateGutter()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: applyFontSize()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

        // BEGINNER: onMouseMove()
        // Main job: perform one focused task for this file.
        // It receives data/props, performs the required work, and returns the result or UI.
        // Keeping this job in one function makes the code easier to follow during the PPT.
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

        // BEGINNER: onMouseUp()
        // Main job: perform one focused task for this file.
        // It receives data/props, performs the required work, and returns the result or UI.
        // Keeping this job in one function makes the code easier to follow during the PPT.
        function onMouseUp() {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }

    /* ---- run / terminal ---- */
    // BEGINNER: writeToTerminal()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function writeToTerminal(text, cssClass) {
      var line = document.createElement('div');
      if (cssClass) {
        line.className = cssClass;
      }
      line.textContent = text;
      terminalOutput.appendChild(line);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // BEGINNER: clearTerminal()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function clearTerminal() {
      terminalOutput.innerHTML = '';
    }

    function runJavaScript(code) {
      clearTerminal();
      var originalLog = console.log;
      var originalError = console.error;
      var originalWarn = console.warn;
      var wroteAnything = false;

      // BEGINNER: stringifyArgs()
      // Main job: perform one focused task for this file.
      // It receives data/props, performs the required work, and returns the result or UI.
      // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: runPreview()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    var CODE_RUNNER_URL = (window.CAMPSPACE_CODE_RUNNER_URL || 'https://emkc.org/api/v2/piston/execute').replace(/\/$/, '');

    var runnerLanguageMap = {
      python: { language: 'python', version: '*', file: 'main.py' },
      c: { language: 'c', version: '*', file: 'main.c' },
      java: { language: 'java', version: '*', file: 'Main.java' },
      cpp: { language: 'c++', version: '*', file: 'main.cpp' },
      javascript: { language: 'javascript', version: '*', file: 'main.js' },
      typescript: { language: 'typescript', version: '*', file: 'main.ts' },
      go: { language: 'go', version: '*', file: 'main.go' },
      rust: { language: 'rust', version: '*', file: 'main.rs' },
      csharp: { language: 'csharp', version: '*', file: 'main.cs' },
      php: { language: 'php', version: '*', file: 'main.php' },
      ruby: { language: 'ruby', version: '*', file: 'main.rb' },
      bash: { language: 'bash', version: '*', file: 'main.sh' },
      kotlin: { language: 'kotlin', version: '*', file: 'Main.kt' },
      swift: { language: 'swift', version: '*', file: 'main.swift' },
      dart: { language: 'dart', version: '*', file: 'main.dart' },
      lua: { language: 'lua', version: '*', file: 'main.lua' },
      r: { language: 'r', version: '*', file: 'main.r' }
    };

    async function runRemoteCode(lang, code) {
      clearTerminal();
      var runtime = runnerLanguageMap[lang];
      if (!runtime) {
        writeToTerminal('No execution runtime is configured for ' + lang + '.', 'mainpage-term-error');
        return;
      }

      writeToTerminal('Running ' + langSelect.options[langSelect.selectedIndex].text + '…', 'mainpage-term-info');

      try {
        var response = await fetch(CODE_RUNNER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: runtime.language,
            version: runtime.version,
            files: [{ name: runtime.file, content: code }],
            stdin: ''
          })
        });

        var data = await response.json();
        if (!response.ok) {
          throw new Error((data && (data.message || data.error)) || ('Runner returned HTTP ' + response.status));
        }

        var compile = data.compile || {};
        var run = data.run || {};
        if (compile.output) {
          writeToTerminal(compile.output);
        }
        if (compile.stderr) {
          writeToTerminal(compile.stderr, 'mainpage-term-error');
        }
        if (run.stdout) {
          writeToTerminal(run.stdout);
        }
        if (run.stderr) {
          writeToTerminal(run.stderr, 'mainpage-term-error');
        }
        if (!compile.output && !compile.stderr && !run.stdout && !run.stderr) {
          writeToTerminal('Program finished successfully with no output.', 'mainpage-term-info');
        }
      } catch (err) {
        writeToTerminal('Code runner unavailable: ' + err.message, 'mainpage-term-error');
        writeToTerminal('The editor still works offline. For full multi-language execution, set window.CAMPSPACE_CODE_RUNNER_URL to your Piston-compatible runner.', 'mainpage-term-info');
      }
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
      } else if (currentLang === 'react') {
        // React/JSX needs a transpiler/runtime; send it through the configured runner.
        runRemoteCode('javascript', code);
      } else if (currentLang === 'mysql') {
        clearTerminal();
        writeToTerminal('MySQL is an SQL database language and cannot be executed safely inside a static browser page.', 'mainpage-term-info');
        writeToTerminal('Use a MySQL-compatible backend/database connection to run these queries.', 'mainpage-term-info');
      } else {
        runRemoteCode(currentLang, code);
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
     AI Chatbot app

     A simple chat window backed directly by Google's Gemini API.
     The API key lives in oauth-config.js (window.CAMPSPACE_OAUTH_
     CONFIG.gemini.apiKey), the same place the Google/Microsoft/
     GitHub sign-in keys live - not typed in by whoever is using the
     app. Every request goes straight from this page to Google's
     servers; CampSpace itself never sees or stores it.
     --------------------------------------------------------- */
  // BEGINNER: aiChatApp()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function aiChatApp() {
    var messagesEl = document.getElementById('mainpage-aichat-messages');
    var input = document.getElementById('mainpage-aichat-input');
    var sendBtn = document.getElementById('mainpage-aichat-send');

    if (!messagesEl || !input || !sendBtn) {
      return;
    }

    var HISTORY_STORAGE_KEY = 'campspace-aichat-history';
    var MAX_HISTORY = 60;
    var GEMINI_MODEL = 'gemini-3.6-flash';
    var isSending = false;

    // BEGINNER: getApiKey()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function getApiKey() {
      var config = (window.CAMPSPACE_OAUTH_CONFIG && window.CAMPSPACE_OAUTH_CONFIG.gemini) || {};
      var key = config.apiKey || '';
      // Still the placeholder from oauth-config.js - treat that the
      // same as "no key configured" instead of sending it to Google.
      if (!key || key === 'GEMINI_API_KEY') {
        return '';
      }
      return key;
    }

    // BEGINNER: getHistory()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function getHistory() {
      var storedText = null;
      try {
        storedText = localStorage.getItem(HISTORY_STORAGE_KEY);
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

    // BEGINNER: saveHistory()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function saveHistory(history) {
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      } catch (err) {
        // localStorage unavailable - conversation just won't persist.
      }
    }

    function setInputEnabled(enabled) {
      input.disabled = !enabled;
      sendBtn.disabled = !enabled;
    }

    // BEGINNER: render()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function render() {
      var history = getHistory();
      messagesEl.innerHTML = '';

      if (history.length === 0) {
        var empty = document.createElement('p');
        empty.className = 'mainpage-aichat-empty';
        empty.textContent = 'Ask anything \u2014 notes, homework help, code, ideas.';
        messagesEl.appendChild(empty);
        return;
      }

      for (var i = 0; i < history.length; i++) {
        appendMessageEl(history[i]);
      }

      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // BEGINNER: escapeHtml()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function escapeHtml(value) {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderMarkdown(markdown) {
      var text = String(markdown || '').replace(/\r\n/g, '\n');
      var lines = text.split('\n');
      var htmlParts = [];
      var paragraph = [];
      var inCode = false;
      var codeLanguage = '';
      var codeLines = [];

      // BEGINNER: inlineMarkdown()
      // Main job: perform one focused task for this file.
      // It receives data/props, performs the required work, and returns the result or UI.
      // Keeping this job in one function makes the code easier to follow during the PPT.
      function inlineMarkdown(value) {
        var safe = escapeHtml(value);
        safe = safe.replace(/\n/g, '<br>');
        // Protect inline code first so formatting markers inside it stay literal.
        var codeTokens = [];
        safe = safe.replace(/`([^`]+)`/g, function (_, code) {
          var token = '___CAMI_CODE_' + codeTokens.length + '___';
          codeTokens.push('<code>' + code + '</code>');
          return token;
        });
        safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        safe = safe.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        safe = safe.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
        safe = safe.replace(/(?<!_)_([^_\n]+)_(?!_)/g, '<em>$1</em>');
        for (var c = 0; c < codeTokens.length; c++) {
          safe = safe.replace('___CAMI_CODE_' + c + '___', codeTokens[c]);
        }
        return safe;
      }

      // BEGINNER: flushParagraph()
      // Main job: perform one focused task for this file.
      // It receives data/props, performs the required work, and returns the result or UI.
      // Keeping this job in one function makes the code easier to follow during the PPT.
      function flushParagraph() {
        if (paragraph.length === 0) {
          return;
        }
        htmlParts.push('<p>' + inlineMarkdown(paragraph.join('\n')) + '</p>');
        paragraph = [];
      }

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        if (line.trim().indexOf('```') === 0) {
          if (!inCode) {
            flushParagraph();
            inCode = true;
            codeLanguage = line.trim().slice(3).trim();
            codeLines = [];
          } else {
            htmlParts.push('<pre><code' +
              (codeLanguage ? ' data-language="' + escapeHtml(codeLanguage) + '"' : '') +
              '>' + escapeHtml(codeLines.join('\n')) + '</code></pre>');
            inCode = false;
            codeLanguage = '';
            codeLines = [];
          }
          continue;
        }

        if (inCode) {
          codeLines.push(line);
          continue;
        }

        var heading = line.match(/^\s{0,3}(#{1,3})\s+(.+)$/);
        if (heading) {
          flushParagraph();
          var level = heading[1].length;
          htmlParts.push('<h' + level + '>' + inlineMarkdown(heading[2]) +
            '</h' + level + '>');
          continue;
        }

        var bullet = line.match(/^\s*[-*+]\s+(.+)$/);
        if (bullet) {
          flushParagraph();
          htmlParts.push('<ul><li>' + inlineMarkdown(bullet[1]) + '</li></ul>');
          continue;
        }

        var numbered = line.match(/^\s*\d+\.\s+(.+)$/);
        if (numbered) {
          flushParagraph();
          htmlParts.push('<ol><li>' + inlineMarkdown(numbered[1]) + '</li></ol>');
          continue;
        }

        if (/^\s*>\s?/.test(line)) {
          flushParagraph();
          htmlParts.push('<blockquote>' +
            inlineMarkdown(line.replace(/^\s*>\s?/, '')) + '</blockquote>');
          continue;
        }

        if (!line.trim()) {
          flushParagraph();
          continue;
        }

        paragraph.push(line);
      }

      if (inCode) {
        htmlParts.push('<pre><code>' + escapeHtml(codeLines.join('\n')) + '</code></pre>');
      }
      flushParagraph();

      return htmlParts.join('');
    }

    // BEGINNER: appendMessageEl()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function appendMessageEl(message) {
      var row = document.createElement('div');
      row.className = 'mainpage-aichat-msg mainpage-aichat-msg--' + message.role;

      var meta = document.createElement('div');
      meta.className = 'mainpage-aichat-msg-meta';
      meta.textContent = message.role === 'user' ? 'You' : 'Cami';

      var bubble = document.createElement('div');
      bubble.className = 'mainpage-aichat-msg-bubble';

      if (message.role === 'model') {
        bubble.classList.add('mainpage-aichat-markdown');
        bubble.innerHTML = renderMarkdown(message.text);
      } else {
        bubble.textContent = message.text;
      }

      if (message.role !== 'error') {
        row.appendChild(meta);
      }
      row.appendChild(bubble);
      messagesEl.appendChild(row);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return row;
    }

    // BEGINNER: callGemini()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function callGemini(apiKey, history, onDone) {
      var url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
        GEMINI_MODEL + ':generateContent?key=' + encodeURIComponent(apiKey);

      // Gemini only wants "user" / "model" roles - our stored "error"
      // messages (if any slipped in) are left out of what we send.
      var contents = [];
      for (var i = 0; i < history.length; i++) {
        if (history[i].role === 'user' || history[i].role === 'model') {
          contents.push({
            role: history[i].role,
            parts: [{ text: history[i].text }]
          });
        }
      }

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: contents })
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            var errorMessage = (result.data && result.data.error && result.data.error.message) ||
              'The AI request failed. Check the API key in oauth-config.js.';
            onDone(null, errorMessage);
            return;
          }

          var candidates = result.data && result.data.candidates;
          var text = null;
          if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
            var parts = candidates[0].content.parts;
            var combined = '';
            for (var p = 0; p < parts.length; p++) {
              if (parts[p].text) {
                combined += parts[p].text;
              }
            }
            text = combined;
          }

          if (!text) {
            onDone(null, 'No response was returned. Try rephrasing your message.');
            return;
          }

          onDone(text, null);
        })
        .catch(function () {
          onDone(null, 'Couldn\u2019t reach the AI service. Check your internet connection and try again.');
        });
    }

    // BEGINNER: sendMessage()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function sendMessage() {
      if (isSending) {
        return;
      }

      var text = input.value.trim();
      if (!text) {
        return;
      }

      var apiKey = getApiKey();
      if (!apiKey) {
        var history = getHistory();
        history.push({ role: 'user', text: text });
        history.push({
          role: 'error',
          text: 'Cami isn\u2019t set up yet — add the Gemini API key in oauth-config.js (gemini.apiKey).'
        });
        saveHistory(history);
        input.value = '';
        render();
        return;
      }

      var history = getHistory();
      history.push({ role: 'user', text: text });
      saveHistory(history);
      input.value = '';
      render();

      var thinkingRow = document.createElement('div');
      thinkingRow.className = 'mainpage-aichat-msg mainpage-aichat-msg--model mainpage-aichat-msg--thinking';
      var thinkingBubble = document.createElement('div');
      thinkingBubble.className = 'mainpage-aichat-msg-bubble';
      thinkingBubble.textContent = 'Thinking\u2026';
      thinkingRow.appendChild(thinkingBubble);
      messagesEl.appendChild(thinkingRow);
      messagesEl.scrollTop = messagesEl.scrollHeight;

      isSending = true;
      setInputEnabled(false);

      callGemini(apiKey, history, function (replyText, errorText) {
        isSending = false;
        setInputEnabled(true);
        thinkingRow.remove();

        var latestHistory = getHistory();

        if (errorText) {
          latestHistory.push({ role: 'error', text: errorText });
        } else {
          latestHistory.push({ role: 'model', text: replyText });
        }

        if (latestHistory.length > MAX_HISTORY) {
          latestHistory = latestHistory.slice(latestHistory.length - MAX_HISTORY);
        }

        saveHistory(latestHistory);
        render();
        input.focus();
      });
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
      }
    });

    render();
  }

  aiChatApp();

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
  // BEGINNER: chatApp()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: getMessages()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: saveMessages()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: render()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: sendMessage()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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
  // BEGINNER: displayNameForThisBrowser()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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
     Code Editor, AI Chatbot, etc) - that's read from this same tab's
     own "frontmostApp" tracking, nothing outside CampSpace.

     Like Chat, this syncs across tabs on the same device via the
     storage event, which is enough to try the feature with a
     teacher tab + a student tab side by side. Making this work
     across different students' actual devices needs a backend to
     relay the roster + a real video/screen layer for the "Meet"
     part - both are natural next additions once you're ready.
     --------------------------------------------------------- */
  // BEGINNER: classSessionApp()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
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
      chalkpad: 'Chalkpad',
      calendar: 'Calendar',
      notepad: 'Notepad',
      calculator: 'Calculator',
      code: 'Code Editor',
      aichat: 'AI Chatbot',
      chat: 'Campus Chat',
      session: 'Class Session'
    };

    // BEGINNER: getActiveSession()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: setActiveSession()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: getRoster()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: setRoster()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: getMyCode()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: clearMyRoleAndCode()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: generateSessionCode()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: setIdleNote()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: startTeacherWatch()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: endSession()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: leaveBecauseSessionEnded()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

    // BEGINNER: leaveSession()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
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

export { runMainPageScript };
