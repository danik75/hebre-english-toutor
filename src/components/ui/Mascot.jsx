import styles from './Mascot.module.css'

const expressions = {
  neutral: '🦉',
  happy: '🥳',
  sad: '😔',
}

export default function Mascot({ mood = 'neutral' }) {
  return (
    <div className={styles.mascot} aria-hidden="true">
      <span className={styles.face}>{expressions[mood]}</span>
    </div>
  )
}
