const KEY = 'heb_eng_progress'

const DEFAULT_PROGRESS = {
  xp: 0,
  streak: 0,
  lastPlayedDate: null,
  hearts: 5,
  lastHeartsReset: null,
  completedLessons: [],
  lessonStars: {},
}

export function loadProgress() {
  try {
    const saved = localStorage.getItem(KEY)
    return saved ? { ...DEFAULT_PROGRESS, ...JSON.parse(saved) } : { ...DEFAULT_PROGRESS }
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

export function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress))
}

export function clearProgress() {
  localStorage.removeItem(KEY)
}

export { DEFAULT_PROGRESS }
