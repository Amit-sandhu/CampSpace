/* ================================================================
   CampSpace — Workspace behaviour
   Window manager (open / close / minimize / maximize / drag / focus)
   plus the three real apps: Calendar, Notepad, Calculator.
   ================================================================ */
(function () {
  'use strict';

  var canvas = document.getElementById('mainpage-canvas');
  var dock = document.querySelector('.mainpage-dock');
  var zCounter = 50;

  /* ---------------------------------------------------------
     Window registry
     --------------------------------------------------------- */
  var windows = {};

  document.querySelectorAll('[data-mainpage-window]').forEach(function (el) {
    var app = el.getAttribute('data-app');
    windows[app] = {
      el: el,
      open: !el.classList.contains('mainpage-window--hidden'),
      minimized: false,
      maximized: false,
      prevStyle: null
    };
  });

  function dockItemFor(app) {
    return document.querySelector('[data-mainpage-dock-app="' + app + '"]');
  }

  function syncDockIndicator(app) {
    var item = dockItemFor(app);
    if (!item) return;
    var w = windows[app];
    var running = w.open && !w.el.classList.contains('mainpage-window--hidden');
    item.classList.toggle('mainpage-dock-item--active', running);
  }

  function bringToFront(app) {
    var w = windows[app];
    if (!w) return;
    zCounter += 1;
    w.el.style.zIndex = zCounter;
    document.querySelectorAll('.mainpage-window').forEach(function (el) {
      el.classList.remove('mainpage-window--front');
    });
    w.el.classList.add('mainpage-window--front');
  }

  function openApp(app) {
    var w = windows[app];
    if (!w) return;
    w.el.classList.remove('mainpage-window--hidden');
    w.open = true;
    w.minimized = false;
    bringToFront(app);
    syncDockIndicator(app);
  }

  function closeApp(app) {
    var w = windows[app];
    if (!w) return;
    w.el.classList.add('mainpage-window--hidden');
    w.open = false;
    w.minimized = false;
    if (w.maximized) {
      w.el.classList.remove('mainpage-window--maximized');
      w.maximized = false;
    }
    syncDockIndicator(app);
  }

  function minimizeApp(app) {
    var w = windows[app];
    if (!w) return;
    w.el.classList.add('mainpage-window--hidden');
    w.minimized = true;
    syncDockIndicator(app);
  }

  function toggleMaximize(app) {
    var w = windows[app];
    if (!w) return;
    if (!w.maximized) {
      w.prevStyle = w.el.getAttribute('style');
      w.el.classList.add('mainpage-window--maximized');
      w.maximized = true;
    } else {
      w.el.classList.remove('mainpage-window--maximized');
      w.maximized = false;
    }
    bringToFront(app);
  }

  function toggleDockApp(app) {
    var w = windows[app];
    if (!w) return;
    var isFrontmost = w.el.classList.contains('mainpage-window--front');
    if (!w.open || w.minimized) {
      openApp(app);
    } else if (isFrontmost) {
      minimizeApp(app);
    } else {
      bringToFront(app);
    }
  }

  /* ---------------------------------------------------------
     Dock wiring
     --------------------------------------------------------- */
  dock.addEventListener('click', function (e) {
    var item = e.target.closest('[data-mainpage-dock-app]');
    if (!item) return;
    toggleDockApp(item.getAttribute('data-mainpage-dock-app'));
  });

  /* ---------------------------------------------------------
     Window chrome: traffic lights + focus + drag
     --------------------------------------------------------- */
  document.querySelectorAll('[data-mainpage-window]').forEach(function (el) {
    var app = el.getAttribute('data-app');

    el.addEventListener('mousedown', function () {
      bringToFront(app);
    });

    el.querySelectorAll('[data-mainpage-action]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var action = btn.getAttribute('data-mainpage-action');
        if (action === 'close') closeApp(app);
        if (action === 'minimize') minimizeApp(app);
        if (action === 'maximize') toggleMaximize(app);
      });
    });

    var handle = el.querySelector('[data-mainpage-drag-handle]');
    if (!handle) return;

    handle.addEventListener('mousedown', function (e) {
      if (e.target.closest('button')) return; // don't drag from controls
      if (windows[app].maximized) return; // no dragging while maximized

      bringToFront(app);
      el.classList.add('mainpage-window--dragging');

      var startX = e.clientX;
      var startY = e.clientY;
      var startLeft = parseFloat(getComputedStyle(el).left);
      var startTop = parseFloat(getComputedStyle(el).top);

      function onMove(ev) {
        var dx = ev.clientX - startX;
        var dy = ev.clientY - startY;
        var newLeft = Math.max(0, startLeft + dx);
        var newTop = Math.max(0, startTop + dy);
        el.style.setProperty('--mainpage-x', newLeft + 'px');
        el.style.setProperty('--mainpage-y', newTop + 'px');
      }

      function onUp() {
        el.classList.remove('mainpage-window--dragging');
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      e.preventDefault();
    });
  });

  // Give the initially-open dashboard a z-index/front state
  bringToFront('dashboard');

  /* ---------------------------------------------------------
     Dark mode
     --------------------------------------------------------- */
  (function themeToggle() {
    var body = document.querySelector('.mainpage-body');
    var btn = document.getElementById('mainpage-theme-toggle');
    if (!btn) return;

    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = !!prefersDark;

    function apply() {
      body.classList.toggle('mainpage-body--dark', isDark);
      btn.setAttribute('aria-pressed', String(isDark));
    }

    btn.addEventListener('click', function () {
      isDark = !isDark;
      apply();
    });

    apply();
  })();

  /* ---------------------------------------------------------
     Top nav: search palette, auto-arrange
     --------------------------------------------------------- */
  var paletteOverlay = document.getElementById('mainpage-palette-overlay');
  var paletteInput = document.getElementById('mainpage-palette-input');

  function openPalette() {
    paletteOverlay.classList.add('mainpage-palette-overlay--open');
    setTimeout(function () { paletteInput.focus(); }, 10);
  }
  function closePalette() {
    paletteOverlay.classList.remove('mainpage-palette-overlay--open');
  }

  var searchTrigger = document.getElementById('mainpage-search-trigger');
  if (searchTrigger) searchTrigger.addEventListener('click', openPalette);

  var newBtn = document.getElementById('mainpage-new-btn');
  if (newBtn) newBtn.addEventListener('click', openPalette);

  paletteOverlay.addEventListener('click', function (e) {
    if (e.target === paletteOverlay) closePalette();
  });

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openPalette();
    }
    if (e.key === 'Escape') closePalette();
  });

  document.querySelectorAll('[data-mainpage-palette-app]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openApp(btn.getAttribute('data-mainpage-palette-app'));
      closePalette();
    });
  });

  document.querySelectorAll('[data-mainpage-palette-command]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cmd = btn.getAttribute('data-mainpage-palette-command');
      if (cmd === 'auto-arrange') autoArrange();
      closePalette();
    });
  });

  var autoArrangeBtn = document.getElementById('mainpage-auto-arrange');
  if (autoArrangeBtn) autoArrangeBtn.addEventListener('click', autoArrange);

  var defaultLayout = {
    dashboard: { x: 120, y: 100 },
    calendar: { x: 600, y: 90 },
    notepad: { x: 1010, y: 100 },
    calculator: { x: 600, y: 430 }
  };

  function autoArrange() {
    Object.keys(defaultLayout).forEach(function (app) {
      var w = windows[app];
      if (!w) return;
      if (w.maximized) {
        w.el.classList.remove('mainpage-window--maximized');
        w.maximized = false;
      }
      var pos = defaultLayout[app];
      w.el.style.setProperty('--mainpage-x', pos.x + 'px');
      w.el.style.setProperty('--mainpage-y', pos.y + 'px');
    });
  }

  /* ---------------------------------------------------------
     Calendar app
     --------------------------------------------------------- */
  (function calendarApp() {
    var label = document.getElementById('mainpage-cal-label');
    var grid = document.getElementById('mainpage-cal-grid');
    var selectedOut = document.getElementById('mainpage-cal-selected');
    var prevBtn = document.getElementById('mainpage-cal-prev');
    var nextBtn = document.getElementById('mainpage-cal-next');
    var todayBtn = document.getElementById('mainpage-cal-today');
    if (!grid) return;

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    var today = new Date();
    var viewYear = today.getFullYear();
    var viewMonth = today.getMonth();
    var selected = null;

    function render() {
      label.textContent = monthNames[viewMonth] + ' ' + viewYear;
      grid.innerHTML = '';

      var firstOfMonth = new Date(viewYear, viewMonth, 1);
      var startOffset = firstOfMonth.getDay(); // 0=Sun
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      var daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

      var totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

      for (var i = 0; i < totalCells; i++) {
        var dayNum = i - startOffset + 1;
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'mainpage-month-cell';

        var cellDate, inMonth;
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
        if (!inMonth) cell.classList.add('mainpage-month-cell--muted');

        if (isSameDay(cellDate, today)) cell.classList.add('mainpage-month-cell--today');
        if (selected && isSameDay(cellDate, selected)) cell.classList.add('mainpage-month-cell--selected');

        (function (d) {
          cell.addEventListener('click', function () {
            selected = d;
            if (d.getMonth() !== viewMonth || d.getFullYear() !== viewYear) {
              viewMonth = d.getMonth();
              viewYear = d.getFullYear();
            }
            render();
          });
        })(cellDate);

        grid.appendChild(cell);
      }

      selectedOut.textContent = selected
        ? 'Selected: ' + selected.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        : 'Pick a date';
    }

    function isSameDay(a, b) {
      return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    prevBtn.addEventListener('click', function () {
      viewMonth -= 1;
      if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
      render();
    });
    nextBtn.addEventListener('click', function () {
      viewMonth += 1;
      if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
      render();
    });
    todayBtn.addEventListener('click', function () {
      viewYear = today.getFullYear();
      viewMonth = today.getMonth();
      selected = today;
      render();
    });

    render();
  })();

  /* ---------------------------------------------------------
     Notepad app
     --------------------------------------------------------- */
  (function notepadApp() {
    var textarea = document.getElementById('mainpage-notepad-textarea');
    var count = document.getElementById('mainpage-notepad-count');
    var status = document.getElementById('mainpage-notepad-status');
    var clearBtn = document.getElementById('mainpage-notepad-clear');
    if (!textarea) return;

    var saveTimer = null;

    function updateCount() {
      var text = textarea.value;
      var words = text.trim().length ? text.trim().split(/\s+/).length : 0;
      count.textContent = words + ' word' + (words === 1 ? '' : 's') + ' · ' + text.length + ' character' + (text.length === 1 ? '' : 's');
    }

    textarea.addEventListener('input', function () {
      updateCount();
      status.textContent = 'Editing…';
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
  })();

  /* ---------------------------------------------------------
     Calculator app
     --------------------------------------------------------- */
  (function calculatorApp() {
    var exprEl = document.getElementById('mainpage-calc-expr');
    var resultEl = document.getElementById('mainpage-calc-result');
    var grid = document.querySelector('.mainpage-calc-grid');
    if (!grid) return;

    var current = '0';
    var previous = null;
    var operator = null;
    var justEvaluated = false;

    var opMap = { '÷': '/', '×': '*', '−': '-', '+': '+' };

    function formatNumber(n) {
      if (!isFinite(n)) return 'Error';
      var s = String(n);
      if (s.length > 14) s = n.toPrecision(12).replace(/\.?0+$/, '');
      return s;
    }

    function render() {
      resultEl.textContent = current;
      exprEl.textContent = (previous !== null && operator)
        ? previous + ' ' + operator
        : '\u00A0';
    }

    function inputNumber(d) {
      if (justEvaluated) {
        current = d === '.' ? '0.' : d;
        justEvaluated = false;
        return;
      }
      if (d === '.') {
        if (current.includes('.')) return;
        current = current + '.';
        return;
      }
      current = (current === '0') ? d : current + d;
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
      if (operator === null || previous === null) return;
      var a = parseFloat(previous);
      var b = parseFloat(current);
      var result;
      switch (opMap[operator]) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = b === 0 ? NaN : a / b; break;
        default: result = b;
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
      if (justEvaluated) { clearAll(); return; }
      current = current.length > 1 ? current.slice(0, -1) : '0';
    }

    function percent() {
      current = formatNumber(parseFloat(current) / 100);
    }

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;

      if (btn.dataset.calcNum !== undefined) {
        inputNumber(btn.dataset.calcNum);
      } else if (btn.dataset.calcOp !== undefined) {
        chooseOperator(btn.dataset.calcOp);
      } else if (btn.dataset.calcAction === 'decimal') {
        inputNumber('.');
      } else if (btn.dataset.calcAction === 'clear') {
        clearAll();
      } else if (btn.dataset.calcAction === 'backspace') {
        backspace();
      } else if (btn.dataset.calcAction === 'percent') {
        percent();
      } else if (btn.dataset.calcAction === 'equals') {
        evaluate();
      }
      render();
    });

    render();
  })();

})();