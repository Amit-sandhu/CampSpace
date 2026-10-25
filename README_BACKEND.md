# CampSpace backend (Node + Express + MySQL)

The Code Editor now sends your code to a small server that runs it and returns the output.
MySQL stores your **saved snippets** and a **history of runs**, and also powers the editor's **MYSQL** language.

```
React app (Vite, :5173)  --/api-->  Express server (:5000)  -->  MySQL
                                        |
                                        +--> runs python / gcc / node / java ... in a temp folder
```

## One-time setup (Windows)

1. **Install MySQL** (MySQL Installer, or XAMPP). Make sure it is running on port 3306.
2. **Install dependencies:** `npm install`
3. **Create your settings file:** copy `.env.example` to `.env` and set `DB_USER` / `DB_PASSWORD`
   (XAMPP default: user `root`, empty password).
4. **(Optional, for the MYSQL language)** open `server/sql/sandbox.sql` in MySQL Workbench or phpMyAdmin,
   change the password, run it as root, and put the same password in `.env` as `SANDBOX_DB_PASSWORD`.
5. **Start everything:** `npm run dev:all`  (or two terminals: `npm run dev` and `npm run server`)

The server creates the `campspace` database and its tables by itself on first start.
On startup it prints which languages it can run, e.g.
`Runnable languages: javascript, typescript, python, c, cpp, ...`

The editor shows **Backend online / offline** in its toolbar. If the backend is off, JavaScript and a few
other languages fall back to the old browser/Wandbox behaviour.

## Which languages work?

A language works when its program is installed **and on your PATH** (restart the terminal after installing).

| Language | Install | Check in terminal |
|---|---|---|
| JavaScript, TypeScript | nothing (uses Node + `tsx`) | - |
| Python | python.org (tick "Add to PATH") | `python --version` |
| C, C++ | MinGW-w64 / MSYS2 (gcc, g++) | `gcc --version` |
| Java | a **JDK** 11+ (not just a JRE) | `javac -version` |
| Go, Rust | go.dev, rustup.rs | `go version`, `rustc --version` |
| C# | .NET SDK | `dotnet --version` |
| Kotlin, Swift, PHP, Ruby, Lua, R, Bash | their usual installers | `kotlinc -version`, `php -v` ... |
| MYSQL | step 4 above | - |
| HTML, CSS | nothing - shown as a live preview | - |

Not installed = the dropdown shows "(not installed)". To add a brand-new language, add one entry in `server/languages.js`.

## API

| Method | URL | What it does |
|---|---|---|
| GET | `/api/health` | server + database check |
| GET | `/api/languages` | languages the server can run |
| POST | `/api/run` | `{ language, code, stdin }` -> `{ stdout, stderr, exitCode, timedOut, ... }` |
| GET/POST | `/api/snippets` | list / create saved snippets |
| GET/PUT/DELETE | `/api/snippets/:id` | read / update / delete one |
| GET | `/api/runs` | your recent run history |

Limits (change in `.env`): 10 s run time, 64 KB output, 100 KB code, 3 runs at once, 30 runs/minute per IP.

## IMPORTANT: security

* **This is not a sandbox.** Code runs as *your* user on *your* computer with a time/output limit, but it can still
  read files and use the network. That is fine for **you, on localhost**. The server only listens on `127.0.0.1`.
  Do **not** expose it to the internet as-is. To let other people run code, run each job in Docker
  (`--network none`, memory/CPU limits) or use a hosted runner.
* The server hides its own secrets (DB passwords etc.) from the programs it runs.
* The MYSQL language uses a separate MySQL user that can only touch databases named `campspace_sb_*`
  (one private scratch database per user), never the real `campspace` tables.
* **Users are identified by the email in the browser session, which anyone can fake.** Real login with hashed
  passwords on the server is the next step (the existing login is still localStorage-only).

## Deploying

Vercel (where the GitHub OAuth function lives) cannot run this server (it needs long-running processes and MySQL).
Host the API on something that can (Render, Railway, a VPS...) with a MySQL database, then set
`VITE_API_URL` on the frontend and `CORS_ORIGIN` on the server. Remember the security note above first.

## Files added / changed

* new: `server/` (index.js, db.js, runner.js, sql-runner.js, languages.js, sql/), `src/lib/api.js`, `.env.example`
* changed: `src/apps/code-editor/CodeEditorApp.jsx`, `src/pages/workspace.css` (toolbar styles), `vite.config.js` (/api proxy),
  `package.json` (scripts + deps), `src/lib/main.js` (old duplicate editor script switched off)
