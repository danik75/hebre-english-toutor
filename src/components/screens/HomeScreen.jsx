import { useState } from 'react'
import LessonCard from '../ui/LessonCard.jsx'
import styles from './HomeScreen.module.css'

const LEVEL_TITLES = [
  { min: 250, title: 'אלוף! 🏆' },
  { min: 150, title: 'מצוין ⭐' },
  { min: 100, title: 'טוב 👍' },
  { min: 50, title: 'לומד 📖' },
  { min: 0, title: 'מתחיל 🌱' },
]

function getLevelTitle(xp) {
  return LEVEL_TITLES.find((l) => xp >= l.min)?.title ?? 'מתחיל 🌱'
}

function isLessonUnlocked(index, completedLessons, lessons) {
  if (index === 0) return true
  return completedLessons.includes(lessons[index - 1].id)
}

export default function HomeScreen({ progress, lessons, currentUser, onStartLesson, onLogout, onClearProgress }) {
  const { xp, streak, lessonStars, completedLessons } = progress
  const [confirmClear, setConfirmClear] = useState(false)

  async function handleConfirmClear() {
    await onClearProgress()
    setConfirmClear(false)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.userRow}>
          <span className={styles.userAvatar}>{currentUser.emoji}</span>
          <span className={styles.userName}>{currentUser.name}</span>
          <button className={styles.logoutBtn} onClick={onLogout} title="החלף משתמש">↩</button>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>🔥</span>
            <span className={styles.statValue}>{streak}</span>
            <span className={styles.statLabel}>ימים ברצף</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>⭐</span>
            <span className={styles.statValue}>{xp}</span>
            <span className={styles.statLabel}>נקודות</span>
          </div>
          <div className={styles.levelBadge}>{getLevelTitle(xp)}</div>
        </div>
      </header>

      <main className={styles.lessonsGrid}>
        {lessons.map((lesson, index) => {
          const locked = !isLessonUnlocked(index, completedLessons, lessons)
          const stars = lessonStars[lesson.id] || 0
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              stars={stars}
              locked={locked}
              onStart={() => onStartLesson(lesson)}
            />
          )
        })}
      </main>

      <footer className={styles.footer}>
        {confirmClear ? (
          <div className={styles.confirmRow}>
            <span className={styles.confirmText}>למחוק את כל ההתקדמות?</span>
            <button className={styles.cancelClearBtn} onClick={() => setConfirmClear(false)}>ביטול</button>
            <button className={styles.confirmClearBtn} onClick={handleConfirmClear}>כן, אפס</button>
          </div>
        ) : (
          <button className={styles.clearBtn} onClick={() => setConfirmClear(true)}>
            🗑️ נקה התקדמות
          </button>
        )}
      </footer>
    </div>
  )
}
