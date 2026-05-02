import { motion, AnimatePresence } from 'framer-motion'
import styles from './FeedbackBanner.module.css'

export default function FeedbackBanner({ result, correctAnswer, onContinue }) {
  const isCorrect = result === 'correct'

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          className={`${styles.banner} ${isCorrect ? styles.correct : styles.wrong}`}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className={styles.message}>
            {isCorrect ? (
              <span>נכון מאוד! 🎉</span>
            ) : (
              <span>
                לא נכון. התשובה הנכונה:{' '}
                <strong className="english-word">{correctAnswer}</strong>
              </span>
            )}
          </div>
          <button className={styles.continueBtn} onClick={onContinue}>
            המשך
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
