import styles from './LessonCard.module.css'

export default function LessonCard({ lesson, stars, locked, onStart }) {
  return (
    <button
      className={`${styles.card} ${locked ? styles.locked : ''}`}
      onClick={locked ? undefined : onStart}
      disabled={locked}
      aria-label={locked ? `${lesson.title} - נעול` : `התחל שיעור: ${lesson.title}`}
    >
      <div className={styles.emoji}>{locked ? '🔒' : lesson.emoji}</div>
      <div className={styles.title}>{lesson.title}</div>
      {!locked && (
        <div className={styles.stars}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= (stars || 0) ? styles.starFilled : styles.starEmpty}>
              ★
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
