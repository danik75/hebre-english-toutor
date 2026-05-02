import Confetti from 'react-confetti'
import { useWindowSize } from '../../hooks/useWindowSize.js'
import styles from './ResultScreen.module.css'

function calcStars(heartsLeft) {
  if (heartsLeft >= 4) return 3
  if (heartsLeft >= 2) return 2
  return 1
}

export default function ResultScreen({ lesson, heartsLeft, xpEarned, onContinue }) {
  const { width, height } = useWindowSize()
  const stars = calcStars(heartsLeft)

  return (
    <div className={styles.container}>
      <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />
      <div className={styles.content}>
        <div className={styles.mascot}>🥳</div>
        <h1 className={styles.title}>כל הכבוד!</h1>
        <p className={styles.subtitle}>סיימת את השיעור: <strong>{lesson.title}</strong></p>

        <div className={styles.starsRow}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={`${styles.star} ${n <= stars ? styles.starOn : styles.starOff}`}>
              ★
            </span>
          ))}
        </div>

        <div className={styles.xpBadge}>
          <span className={styles.xpIcon}>⭐</span>
          <span className={styles.xpText}>+{xpEarned} נקודות!</span>
        </div>

        <div className={styles.heartsLeft}>
          {Array.from({ length: heartsLeft }).map((_, i) => (
            <span key={i}>❤️</span>
          ))}
          {heartsLeft > 0 && <span className={styles.heartsLabel}>לבבות נותרו</span>}
        </div>

        <button className={styles.continueBtn} onClick={onContinue}>
          המשך
        </button>
      </div>
    </div>
  )
}
