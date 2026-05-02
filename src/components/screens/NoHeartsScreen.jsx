import styles from './NoHeartsScreen.module.css'

export default function NoHeartsScreen({ onRetry, onHome }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>💔</div>
        <h1 className={styles.title}>נגמרו הלבבות!</h1>
        <p className={styles.message}>לא נורא, כולם טועים לפעמים. נסה שוב!</p>
        <div className={styles.buttons}>
          <button className={styles.retryBtn} onClick={onRetry}>
            נסה שוב
          </button>
          <button className={styles.homeBtn} onClick={onHome}>
            חזור הביתה
          </button>
        </div>
      </div>
    </div>
  )
}
