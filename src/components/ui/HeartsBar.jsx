import styles from './HeartsBar.module.css'

const MAX_HEARTS = 5

export default function HeartsBar({ hearts }) {
  return (
    <div className={styles.bar} aria-label={`${hearts} לבבות נותרו`}>
      {Array.from({ length: MAX_HEARTS }).map((_, i) => (
        <span key={i} className={i < hearts ? styles.full : styles.empty}>
          ❤️
        </span>
      ))}
    </div>
  )
}
