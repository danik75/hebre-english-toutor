import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = process.env.DB_PATH || join(__dirname, 'progress.db')
const db = new Database(dbPath)

db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    emoji      TEXT NOT NULL DEFAULT '🦁',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id  TEXT NOT NULL UNIQUE,
    title      TEXT NOT NULL,
    emoji      TEXT NOT NULL,
    xp_reward  INTEGER NOT NULL DEFAULT 10,
    exercises  TEXT NOT NULL DEFAULT '[]',
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS progress (
    user_id           INTEGER PRIMARY KEY,
    xp                INTEGER NOT NULL DEFAULT 0,
    streak            INTEGER NOT NULL DEFAULT 0,
    last_played_date  TEXT,
    hearts            INTEGER NOT NULL DEFAULT 5,
    last_hearts_reset TEXT,
    completed_lessons TEXT NOT NULL DEFAULT '[]',
    lesson_stars      TEXT NOT NULL DEFAULT '{}',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`)

// --- Users ---
export const getUsers = db.prepare(
  'SELECT id, name, emoji, created_at FROM users ORDER BY created_at ASC'
)
export const getUserById = db.prepare(
  'SELECT id, name, emoji FROM users WHERE id = ?'
)
export const createUser = db.prepare(
  'INSERT INTO users (name, emoji) VALUES (?, ?)'
)
export const deleteUser = db.prepare('DELETE FROM users WHERE id = ?')

// --- Lessons ---
export const getAllLessons = db.prepare(
  'SELECT lesson_id, title, emoji, xp_reward, exercises FROM lessons ORDER BY sort_order ASC'
)
export const upsertLesson = db.prepare(`
  INSERT INTO lessons (lesson_id, title, emoji, xp_reward, exercises, sort_order)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(lesson_id) DO UPDATE SET
    title      = excluded.title,
    emoji      = excluded.emoji,
    xp_reward  = excluded.xp_reward,
    exercises  = excluded.exercises,
    sort_order = excluded.sort_order
`)

// --- Progress ---
export const DEFAULT_PROGRESS = {
  xp: 0,
  streak: 0,
  lastPlayedDate: null,
  hearts: 5,
  lastHeartsReset: null,
  completedLessons: [],
  lessonStars: {},
}

export const getProgress = db.prepare(
  'SELECT xp, streak, last_played_date, hearts, last_hearts_reset, completed_lessons, lesson_stars FROM progress WHERE user_id = ?'
)
export const upsertProgress = db.prepare(`
  INSERT INTO progress (user_id, xp, streak, last_played_date, hearts, last_hearts_reset, completed_lessons, lesson_stars)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(user_id) DO UPDATE SET
    xp                = excluded.xp,
    streak            = excluded.streak,
    last_played_date  = excluded.last_played_date,
    hearts            = excluded.hearts,
    last_hearts_reset = excluded.last_hearts_reset,
    completed_lessons = excluded.completed_lessons,
    lesson_stars      = excluded.lesson_stars
`)
export const deleteProgress = db.prepare(
  'DELETE FROM progress WHERE user_id = ?'
)

export default db
