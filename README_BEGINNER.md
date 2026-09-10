# CampSpace — Beginner-Friendly FEE Version

This version keeps the existing CampSpace UI and behaviour, but adds beginner-oriented
comments throughout the JavaScript/React/CSS/HTML source so the team can explain the
project during the FEE presentation.

## What was changed

- **No existing application logic was intentionally rewritten.**
- Existing `.js`, `.jsx`, `.css`, and `index.html` files received explanatory comments.
- Comments identify the main job of a file/function/section and connect it to FEE syllabus topics.
- The existing legacy DOM scripts (`src/lib/auth.js` and `src/lib/main.js`) were **not aggressively
  rewritten**. They contain a large amount of working window-management, storage, calendar,
  editor, chat and authentication logic. Rewriting those files just to make syntax shorter
  would create unnecessary regression risk.
- A separate `/fee-syllabus` route was added as an **isolated learning lab**. It is not in the
  normal sidebar, so the normal CampSpace workflow remains unchanged. It contains simple
  examples for the syllabus items that were not clearly represented in the original app:
  counter, product card, controlled form, interactive to-do, and dynamic route parameters.

## Run the project

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

### FEE syllabus lab

After logging in, open:

```text
/fee-syllabus
```

A dynamic example is available at:

```text
/fee-syllabus/counter
/fee-syllabus/todo
/fee-syllabus/product
/fee-syllabus/form
```

The normal routes remain:

```text
/login
/dashboard
/focus
/cami
```

## Git / GitHub basics for the PPT

```bash
git init
git status
git add .
git commit -m "Explain CampSpace FEE code"
git branch -M main
git remote add origin <your-github-repository>
git push -u origin main
```

Do **not** commit `node_modules/`, API keys, OAuth secrets, passwords, or other credentials.

## Important technical note

The authentication in this student prototype stores account information in browser storage.
The existing code itself warns that plaintext passwords in `localStorage` are not appropriate
for a real production authentication system. For the FEE presentation, describe it as a
**prototype/client-side authentication layer**, not as production-grade security.

## How to study the source for the PPT

Start in this order:

1. `index.html` — HTML5 document shell and entry point.
2. `src/main.jsx` — starts React with `createRoot`.
3. `src/App.jsx` — React Router, protected routes, nested routes and 404 fallback.
4. `src/pages/LoginPage.jsx` — login page UI and semantic/accessibility basics.
5. `src/apps/sidebar/Sidebar.jsx` — navigation, props/state, events and React Router navigation.
6. `src/apps/focus/FocusApp.jsx` → `FocusPage.jsx` — the best place to explain state, props,
   hooks, arrays, objects, reusable components and lifting state.
7. `src/apps/focus/hooks/useLocalStorage.js` — custom hook + JSON + localStorage.
8. `src/apps/cami/CamiAI.jsx` — `fetch`, promises, `async/await`, JSON and React state/effects.
9. `src/lib/auth.js` and `src/lib/main.js` — DOM manipulation, event listeners, browser storage
   and the desktop-style workspace interactions.
10. `src/fee-syllabus/FeeSyllabusPage.jsx` — simplest code to use when your teacher asks for
    controlled components, counter/product-card, to-do or dynamic routing.

## Topic audit

| FEE topic | Status | Best evidence |
|---|---|---|
| HTML5 structure | Present | `index.html` |
| Semantic tags | Present | `header`, `main`, `nav`, `section` in JSX |
| Accessibility basics | Present | `alt`, `aria-label`, `aria-expanded`, labels |
| CSS3 fundamentals | Present | all CSS files |
| Box Model | Present | margin, padding, border, box-sizing |
| Flexbox | Present | many workspace/focus layouts |
| Grid | Present | dashboard/calendar/focus layouts |
| Responsive design | Present | responsive CSS + viewport meta tag |
| Media queries | Present | multiple `@media` blocks |
| Mobile-first layout | Added explicitly | `src/fee-syllabus/fee-syllabus.css` |
| JS variables/functions/arrays/objects/loops | Present | `src/**/*.js(x)` |
| DevTools / VS Code setup | Workflow topic | not a runtime feature; explain as development tooling |
| Git/GitHub basics | Workflow topic | `.gitignore` + commands in this README |
| Static responsive landing page | Present | login page + login CSS |
| `let` / `const` | Present | React/JS source |
| Arrow functions | Present | React handlers/helpers |
| Destructuring | Present | React props/imports/hooks |
| Spread/rest | Present | state updates and `...args` |
| Modules/imports/exports | Present | Vite React source |
| Promises | Present | `fetch`/`async` functions return promises |
| `async/await` | Present | Cami, code editor and OAuth code |
| Fetch API | Present | Cami + code execution/auth code |
| DOM manipulation | Present | `src/lib/auth.js`, `src/lib/main.js` |
| Event handling | Present | React handlers + `addEventListener` |
| Browser storage | Present | `localStorage`, `sessionStorage` |
| JSON | Present | storage and API request/response handling |
| Forms | Added explicitly | FEE syllabus controlled-form example |
| Interactive to-do app | Added explicitly | FEE syllabus lab |
| Controlled components | Added explicitly | FEE syllabus lab |
| React + Vite setup | Present | `package.json`, `vite.config.js`, `src/main.jsx` |
| Counter app | Added explicitly | FEE syllabus lab |
| Product card UI | Added explicitly | FEE syllabus lab |
| React/component architecture | Present | Focus and app components |
| JSX | Present | all `.jsx` components |
| Props | Present | Focus components |
| State / `useState` | Present | Focus, Cami, Sidebar, Chalkpad |
| Rendering lists | Present | `.map()` in Focus/Chalkpad/etc. |
| Conditional rendering | Present | JSX ternaries/conditions |
| `useEffect` | Present | Focus/Cami/Sidebar |
| `useRef` | Present | Focus/Cami/TodayTasks |
| `useMemo` | Present | Focus/Cami/Chalkpad |
| `useCallback` | Present | FocusPage/useDailyTip |
| Composition/reusable UI | Present | FocusPage + reusable cards/components |
| Custom hooks | Present | `useLocalStorage`, `useDailyTip` |
| Lifting state / prop drilling basics | Present | `FocusApp` → `FocusPage` → child callbacks/props |
| Notes app | Present | Notepad workspace app |
| Weather app | Not needed | notes functionality already covers the syllabus's “weather or notes” mini-project option |
| React Router basics | Present | `src/App.jsx` |
| Nested routes | Present | protected route + `Outlet` |
| Dynamic routes / route params | Added explicitly | `/fee-syllabus/:topic` + `useParams` |
| Protected routes | Present | `ProtectedWorkspace` |
| 404 page | Present | `path="*"` fallback |
| Navigation/page layout | Present | Sidebar + route shell |
| Multi-page SPA design | Present | React Router routes inside one SPA |

## What to say if asked “why didn't you rewrite everything?”

Because the requirement was to preserve working behaviour. The largest legacy files contain tightly
coupled DOM manipulation and window-management code. A cosmetic rewrite of hundreds of lines can
accidentally change event timing, selectors, storage keys or drag/resize behaviour. The safer
approach is to simplify the code used for teaching first, document the complex sections clearly,
and keep the proven working logic intact.
