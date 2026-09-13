<div align="center">

<img src="public/images/readme_logo.png" alt="CampSpace Logo" width="450"/>

# CampSpace
Organize. Collaborate. Achieve more.

A modern all-in-one collaborative workspace built for students.

</div>

---

## 🚀 Overview

CampSpace is a collaborative operating system for students that combines project management, coding, communication, notes, scheduling, and productivity into a single platform.

Instead of switching between multiple applications, students can manage everything from one workspace.

---

## ✨ Features

- 📚 Academic Workspace
- 👥 Team Collaboration
- 💬 Real-time Chat
- 📝 Shared Notes
- 📅 Calendar & Deadlines
- 📌 Kanban Boards
- 📂 File Sharing
- 💻 VS Code Integration
- 🌐 Git & GitHub Integration
- 🔔 Notifications
- 📊 Dashboard & Analytics

---

## 🛠️ Tech Stack

### Frontend

- React
- Tailwind CSS
- TypeScript

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- JWT
- OAuth

### Realtime

- Socket.IO

---

## 📂 Project Structure

```
frontend/
backend/
docs/
assets/
```

---

## 👥 Team

| Name |
|------|
| Amiteshwar Singh Sandhu |
| Aditya Bhardwaj |
| Aryan Mehra |

---

## 🎯 Vision

To create the ultimate digital campus workspace where students can:

- Learn
- Build
- Collaborate
- Manage projects
- Communicate
- Grow together

---

Converted from the supplied static HTML/CSS/JavaScript project into a single-page React + Vite app.

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Structure

- `src/pages/LoginPage.jsx` — React login page
- `src/pages/WorkspacePage.jsx` — React workspace/dashboard markup
- `src/pages/login.css` — original login styling
- `src/pages/workspace.css` — original workspace styling
- `src/lib/auth.js` — client-side auth behaviour, adapted from the original
- `src/lib/main.js` — workspace app behaviour, adapted from the original
- `src/lib/oauth.js` / `oauth-config.js` — OAuth behaviour/config
- `public/images` — original images
- `public/videos` — original login background video

The original DOM IDs/data attributes are intentionally preserved because the existing workspace logic uses them for the calculator, calendar, notepad, code editor, chat, class session, window manager, search, layouts, theme, etc.

> The supplied project uses localStorage for prototype authentication. Do not use this storage approach for real production passwords.

---

## 📄 License

Private Repository © 2026 CampSpace Team
