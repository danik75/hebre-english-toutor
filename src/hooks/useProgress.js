import { useState, useEffect, useCallback } from 'react'

const DEFAULT_PROGRESS = {
  xp: 0,
  streak: 0,
  lastPlayedDate: null,
  hearts: 5,
  lastHeartsReset: null,
  completedLessons: [],
  lessonStars: {},
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function applyDailyChecks(p) {
  const today = todayStr()
  const out = { ...p }

  if (out.lastHeartsReset !== today) {
    out.hearts = 5
    out.lastHeartsReset = today
  }

  if (out.lastPlayedDate && out.lastPlayedDate !== today && out.lastPlayedDate !== yesterdayStr()) {
    out.streak = 0
  }

  return out
}

export function useProgress(userId) {
  const [progress, setProgressState] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    fetch(`/api/progress/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        const merged = { ...DEFAULT_PROGRESS, ...data }
        setProgressState(applyDailyChecks(merged))
        setLoading(false)
      })
  }, [userId])

  const setProgress = useCallback(
    (updater) => {
      setProgressState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        fetch(`/api/progress/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
        })
        return next
      })
    },
    [userId]
  )

  return [progress, setProgress, loading]
}
