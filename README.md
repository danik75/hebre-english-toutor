# אנגלית בכיף 🦉 — Hebrew-English Tutor

A Duolingo-style English learning app for Hebrew-speaking kids (ages 7–12). The entire UI is in Hebrew, with bite-sized lessons, hearts, XP, streaks, and encouraging feedback.

## Features

- **28 lessons** covering animals, family, food, colors, numbers, body parts, clothes, school, nature, verbs, daily routines, greetings, weather, transport, rooms, sports, emotions, time, vegetables, fruits, wild animals, insects, jobs, furniture, question words, sea creatures, and full sentences
- **5 exercise types:**
  - Multiple choice (emoji + Hebrew word → pick English)
  - Word match (pair Hebrew ↔ English columns)
  - Listen & choose (hear English word → pick Hebrew translation)
  - Spelling (type the English word)
  - Translate sentence (arrange word tiles in correct order)
- **Gamification:** hearts (5 per session, daily refill), XP, streak, 1–3 stars per lesson, linear lesson unlock
- **Multi-user profiles** (Netflix-style picker, no passwords needed)
- **Progress dashboard** on login screen — XP leaderboard comparing all family members
- **Web Speech API** for English pronunciation (no external services)
- **RTL layout** — Hebrew UI with Rubik font; English words shown in Nunito with `dir="ltr"`
- **Admin mode** — password-protected profile management

## Tech Stack

| | |
|---|---|
| Frontend | React 18 + Vite |
| Animations | framer-motion |
| Celebration | react-confetti |
| Audio | Web Speech API (built-in browser) |
| Backend | Express 5 |
| Database | SQLite via better-sqlite3 |
| Deployment | Railway |

## Running Locally

```bash
npm install
npm run dev      # starts frontend (port 5173) + backend (port 3001)
```

Open http://localhost:5173

## Building for Production

```bash
npm run build    # build React to dist/
npm start        # serve everything from Express (port 3001)
```

## Deployment

The app is deployed on [Railway](https://railway.app). Every push to `main` triggers an automatic redeploy.

Railway environment variables:
- `DB_PATH=/app/data/progress.db` (persistent volume)
- `NODE_ENV=production`

## Project Structure

```
src/
├── data/lessons.js          # all 28 lessons and exercises
├── hooks/
│   ├── useProgress.js       # XP, hearts, streak, stars (synced to API)
│   └── useLessons.js        # fetches lessons from API
├── components/
│   ├── screens/
│   │   ├── LoginScreen.jsx  # profile picker + dashboard + admin
│   │   ├── HomeScreen.jsx   # lesson path, XP, streak
│   │   ├── LessonScreen.jsx # exercise sequencer, hearts
│   │   ├── ResultScreen.jsx # confetti, stars, XP
│   │   └── NoHeartsScreen.jsx
│   ├── exercises/           # MultipleChoice, WordMatch, Spelling, ListenAndChoose, TranslateSentence
│   └── ui/                  # ProgressBar, HeartsBar, FeedbackBanner, LessonCard, SpeakButton, Mascot
server/
├── index.js                 # Express API + static serving
└── db.js                    # SQLite schema + prepared statements
```

## Adding New Lessons

Append new lesson objects to `src/data/lessons.js`, then:

```bash
git add src/data/lessons.js
git commit -m "Add lesson XX: ..."
git push
```

Railway redeploys automatically. The server seeds all lessons from `lessons.js` on startup via upsert, so new content appears immediately.
