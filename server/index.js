import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import {
  getUsers, getUserById, createUser, deleteUser,
  getAllLessons, upsertLesson,
  getProgress, upsertProgress, deleteProgress,
  DEFAULT_PROGRESS,
} from './db.js'
import { LESSONS } from '../src/data/lessons.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

app.use(cors())
app.use(express.json())

// --- Seed lessons on startup ---
LESSONS.forEach((lesson, index) => {
  upsertLesson.run(lesson.id, lesson.title, lesson.emoji, lesson.xpReward, JSON.stringify(lesson.exercises), index)
})
console.log(`Seeded ${LESSONS.length} lessons`)

// --- Helpers ---
function rowToProgress(row) {
  if (!row) return { ...DEFAULT_PROGRESS }
  return {
    xp: row.xp,
    streak: row.streak,
    lastPlayedDate: row.last_played_date,
    hearts: row.hearts,
    lastHeartsReset: row.last_hearts_reset,
    completedLessons: JSON.parse(row.completed_lessons),
    lessonStars: JSON.parse(row.lesson_stars),
  }
}

function progressToParams(userId, p) {
  return [
    userId,
    p.xp ?? 0,
    p.streak ?? 0,
    p.lastPlayedDate ?? null,
    p.hearts ?? 5,
    p.lastHeartsReset ?? null,
    JSON.stringify(p.completedLessons ?? []),
    JSON.stringify(p.lessonStars ?? {}),
  ]
}

// --- API routes ---

app.get('/api/users', (_req, res) => res.json(getUsers.all()))

app.post('/api/users', (req, res) => {
  const { name, emoji } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'name required' })
  const result = createUser.run(name.trim(), emoji || '🦁')
  res.status(201).json(getUserById.get(result.lastInsertRowid))
})

app.delete('/api/users/:id', (req, res) => {
  deleteUser.run(req.params.id)
  res.json({ ok: true })
})

app.get('/api/lessons', (_req, res) => {
  res.json(
    getAllLessons.all().map((row) => ({
      id: row.lesson_id,
      title: row.title,
      emoji: row.emoji,
      xpReward: row.xp_reward,
      exercises: JSON.parse(row.exercises),
    }))
  )
})

app.get('/api/progress/:userId', (req, res) => {
  res.json(rowToProgress(getProgress.get(req.params.userId)))
})

app.post('/api/progress/:userId', (req, res) => {
  upsertProgress.run(...progressToParams(req.params.userId, req.body))
  res.json({ ok: true })
})

app.post('/api/progress/:userId/reset', (req, res) => {
  deleteProgress.run(req.params.userId)
  res.json({ ...DEFAULT_PROGRESS })
})

// --- Serve React build in production ---
if (isProd) {
  const distPath = join(__dirname, '../dist')
  if (existsSync(distPath)) {
    app.use(express.static(distPath))
    app.get(/(.*)/, (_req, res) => res.sendFile(join(distPath, 'index.html')))
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${isProd ? 'production' : 'development'})`)
})
