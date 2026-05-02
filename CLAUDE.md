# Hebrew-English Tutor — Claude Session Guide

## What this app is
Duolingo-style English learning app for a 9-year-old native Hebrew speaker. UI is entirely in Hebrew (RTL). Deployed on Railway.

## Stack
- **Frontend:** React 18 + Vite, framer-motion, react-confetti
- **Backend:** Express 5 + better-sqlite3 (SQLite)
- **Deployment:** Railway (auto-deploys on git push to main)

## Running locally
```bash
npm run dev          # starts Vite (port 5173) + Express (port 3001) together
npm start            # production mode — Express serves built React from dist/
npm run build        # build React to dist/
```

## Key architecture decisions
- **No router** — single `view` state in `App.jsx` ('login' | 'home' | 'lesson' | 'result' | 'no-hearts')
- **Lessons seeded on startup** — `server/index.js` runs `upsertLesson` for every lesson in `src/data/lessons.js` when the server starts. Adding new lessons to `lessons.js` + restarting server auto-syncs to the DB.
- **SQLite path** — controlled by `DB_PATH` env var; defaults to `server/progress.db`. On Railway the volume is mounted at `/app/data/progress.db`.
- **Express 5 wildcard** — must use `app.get(/(.*)/,...)` regex, not `app.get('*',...)` which throws in Express 5.
- **pendingFailRef** — `LessonScreen.jsx` uses a `useRef` alongside `useState` for the fail flag to avoid stale closures in `setTimeout` callbacks.

## Content
`src/data/lessons.js` has 28 lessons (as of 2026-05-02):
- Lessons 1–12: animals, family, food, colors, numbers, body, clothes, school, nature, verbs, daily routines, greetings
- Lessons 13–18: weather, transport, house rooms, sports, emotions, time/days
- Lessons 19–28: vegetables, fruits, wild animals, insects, jobs, furniture, question words, sea creatures, sentences (I am...), my day

## Exercise types
`multiple_choice`, `word_match`, `listen_and_choose`, `spelling`, `translate_sentence`

## Gamification
- 5 hearts per session, refill at midnight
- XP: base per lesson + bonus for hearts remaining
- Stars: 3 = 4–5 hearts, 2 = 2–3 hearts, 1 = 0–1 hearts
- Streak: consecutive days with ≥1 completed lesson
- Lesson N+1 unlocks when lesson N has ≥1 star

## Users & progress
Multi-user (Netflix-style profile picker, no passwords). Each user's progress stored in SQLite `progress` table. Admin access (password: "Admin") on login screen allows deleting profiles.

## API routes
```
GET  /api/users                 — list all users
POST /api/users                 — create user { name, emoji }
DELETE /api/users/:id           — delete user + cascade progress
GET  /api/lessons               — all lessons from DB
GET  /api/progress/:userId      — user's progress
POST /api/progress/:userId      — save progress
POST /api/progress/:userId/reset — reset to DEFAULT_PROGRESS
GET  /api/stats                 — all users with xp/streak/completedCount (for dashboard)
```

## Deployment
Push to GitHub → Railway auto-deploys. If Railway CLI needed:
```bash
railway login
railway up
```
Environment variables on Railway: `DB_PATH=/app/data/progress.db`, `NODE_ENV=production`

## Common tasks
- **Add lessons:** append to `src/data/lessons.js`, commit + push (server auto-syncs on redeploy)
- **Reset a user's progress:** POST `/api/progress/:userId/reset`
- **Delete a user:** log in as admin (password: "Admin") on login screen, click ✕ on profile
