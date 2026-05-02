import { useState } from 'react'
import HomeScreen from './components/screens/HomeScreen.jsx'
import LessonScreen from './components/screens/LessonScreen.jsx'
import ResultScreen from './components/screens/ResultScreen.jsx'
import NoHeartsScreen from './components/screens/NoHeartsScreen.jsx'
import LoginScreen from './components/screens/LoginScreen.jsx'
import { useProgress } from './hooks/useProgress.js'
import { useLessons } from './hooks/useLessons.js'
import styles from './App.module.css'

function calcXpEarned(baseXp, heartsLeft) {
  if (heartsLeft >= 5) return baseXp + 5
  if (heartsLeft >= 4) return baseXp + 3
  return baseXp
}

function calcStars(heartsLeft) {
  if (heartsLeft >= 4) return 3
  if (heartsLeft >= 2) return 2
  return 1
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [view, setView] = useState('home')
  const [currentLesson, setCurrentLesson] = useState(null)
  const [lastResult, setLastResult] = useState(null)

  const [lessons, lessonsLoading] = useLessons()
  const [progress, setProgress, progressLoading] = useProgress(currentUser?.id)

  function handleLogin(user) {
    setCurrentUser(user)
    setView('home')
  }

  function handleLogout() {
    setCurrentUser(null)
    setView('home')
    setCurrentLesson(null)
    setLastResult(null)
  }

  function handleStartLesson(lesson) {
    setCurrentLesson(lesson)
    setView('lesson')
  }

  function handleLessonComplete({ heartsLeft }) {
    const xpEarned = calcXpEarned(currentLesson.xpReward, heartsLeft)
    const stars = calcStars(heartsLeft)
    const today = todayStr()

    setProgress((prev) => {
      const prevStars = prev.lessonStars[currentLesson.id] || 0
      return {
        ...prev,
        xp: prev.xp + xpEarned,
        hearts: heartsLeft,
        lastPlayedDate: today,
        streak: prev.lastPlayedDate === today ? prev.streak : prev.streak + 1,
        completedLessons: prev.completedLessons.includes(currentLesson.id)
          ? prev.completedLessons
          : [...prev.completedLessons, currentLesson.id],
        lessonStars: {
          ...prev.lessonStars,
          [currentLesson.id]: Math.max(prevStars, stars),
        },
      }
    })

    setLastResult({ xpEarned, heartsLeft })
    setView('result')
  }

  function handleFail() {
    setView('no-hearts')
  }

  function handleResultContinue() {
    setLastResult(null)
    setCurrentLesson(null)
    setView('home')
  }

  function handleRetry() {
    setProgress((prev) => ({ ...prev, hearts: 5 }))
    setView('lesson')
  }

  function handleGoHome() {
    setCurrentLesson(null)
    setView('home')
  }

  async function handleClearProgress() {
    const res = await fetch(`/api/progress/${currentUser.id}/reset`, { method: 'POST' })
    const fresh = await res.json()
    setProgress(() => fresh)
  }

  if (!currentUser) {
    return (
      <div className={styles.app}>
        <LoginScreen onLogin={handleLogin} />
      </div>
    )
  }

  if (progressLoading || lessonsLoading) {
    return (
      <div className={styles.app}>
        <div className={styles.loading}>⏳</div>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      {view === 'home' && (
        <HomeScreen
          progress={progress}
          lessons={lessons}
          currentUser={currentUser}
          onStartLesson={handleStartLesson}
          onLogout={handleLogout}
          onClearProgress={handleClearProgress}
        />
      )}
      {view === 'lesson' && currentLesson && (
        <LessonScreen
          lesson={currentLesson}
          initialHearts={progress.hearts}
          onComplete={handleLessonComplete}
          onFail={handleFail}
          onExit={handleGoHome}
        />
      )}
      {view === 'result' && lastResult && currentLesson && (
        <ResultScreen
          lesson={currentLesson}
          heartsLeft={lastResult.heartsLeft}
          xpEarned={lastResult.xpEarned}
          onContinue={handleResultContinue}
        />
      )}
      {view === 'no-hearts' && (
        <NoHeartsScreen onRetry={handleRetry} onHome={handleGoHome} />
      )}
    </div>
  )
}
