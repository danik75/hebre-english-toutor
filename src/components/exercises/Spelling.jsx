import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './Spelling.module.css'

const MAX_WRONG = 2

export default function Spelling({ exercise, onCorrect, onLoseHeart, onAutoAdvance, disabled }) {
  const [value, setValue] = useState('')
  const [wrongCount, setWrongCount] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [shake, setShake] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!disabled && inputRef.current) inputRef.current.focus()
  }, [exercise, disabled])

  function handleCheck() {
    if (disabled || revealed) return
    const answer = value.trim().toLowerCase()
    const correct = exercise.correctAnswer.toLowerCase()

    if (answer === correct) {
      onCorrect(exercise.correctAnswer)
    } else {
      const newCount = wrongCount + 1
      setWrongCount(newCount)
      setShake((s) => s + 1)
      setValue('')
      if (newCount > MAX_WRONG) {
        setRevealed(true)
        setTimeout(onAutoAdvance, 1800)
      } else {
        onLoseHeart()
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleCheck()
  }

  const letterBoxes = exercise.correctAnswer.split('').map((_, i) => (
    <span key={i} className={styles.letterBox} />
  ))

  return (
    <div className={styles.container}>
      <p className={styles.instruction}>כתוב את המילה באנגלית</p>
      <div className={styles.wordDisplay}>
        <span className={styles.emoji}>{exercise.emoji}</span>
        <span className={styles.hebrewWord}>{exercise.hebrewWord}</span>
      </div>
      <div className={styles.letterGuide}>{letterBoxes}</div>
      {revealed ? (
        <motion.div
          className={styles.revealBox}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <span className={styles.revealLabel}>התשובה הנכונה:</span>
          <span className={`english-word ${styles.revealWord}`}>{exercise.correctAnswer}</span>
        </motion.div>
      ) : (
        <motion.div
          key={shake}
          className={styles.inputRow}
          animate={shake > 0 ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || revealed}
            placeholder="הקלד כאן..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            dir="ltr"
          />
          <button
            className={styles.checkBtn}
            onClick={handleCheck}
            disabled={!value.trim() || disabled}
          >
            בדוק
          </button>
        </motion.div>
      )}
      {wrongCount > 0 && !revealed && (
        <p className={styles.attemptsLeft}>
          {MAX_WRONG - wrongCount + 1 > 0
            ? `נשארו ${MAX_WRONG - wrongCount + 1} ניסיונות`
            : ''}
        </p>
      )}
    </div>
  )
}
