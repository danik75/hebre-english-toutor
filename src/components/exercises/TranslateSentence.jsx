import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { shuffle } from '../../utils/shuffle.js'
import styles from './TranslateSentence.module.css'

export default function TranslateSentence({ exercise, onCorrect, onWrong, disabled }) {
  const initialBank = useMemo(() => shuffle(exercise.wordBank), [exercise])
  const [bank, setBank] = useState(initialBank)
  const [placed, setPlaced] = useState([])
  const [shake, setShake] = useState(0)

  function placeWord(word, bankIndex) {
    if (disabled) return
    const newBank = bank.filter((_, i) => i !== bankIndex)
    setBank(newBank)
    setPlaced([...placed, word])
  }

  function returnWord(word, placedIndex) {
    if (disabled) return
    const newPlaced = placed.filter((_, i) => i !== placedIndex)
    setPlaced(newPlaced)
    setBank([...bank, word])
  }

  function handleCheck() {
    if (disabled || placed.length === 0) return
    const isCorrect = placed.join(' ') === exercise.correctOrder.join(' ')
    if (isCorrect) {
      onCorrect(exercise.correctOrder.join(' '))
    } else {
      setShake((s) => s + 1)
      onWrong(exercise.correctOrder.join(' '))
    }
  }

  return (
    <div className={styles.container}>
      <p className={styles.instruction}>תרגם את המשפט לאנגלית</p>
      <div className={styles.hebrewSentence}>{exercise.hebrewSentence}</div>

      <motion.div
        key={shake}
        className={styles.placedArea}
        animate={shake > 0 ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {placed.length === 0 ? (
          <span className={styles.placeholder}>לחץ על מילה כדי להוסיף...</span>
        ) : (
          placed.map((word, i) => (
            <button key={`${word}-${i}`} className={styles.placedTile} onClick={() => returnWord(word, i)}>
              <span className="english-word">{word}</span>
            </button>
          ))
        )}
      </motion.div>

      <div className={styles.bankArea}>
        {bank.map((word, i) => (
          <button key={`${word}-${i}`} className={styles.bankTile} onClick={() => placeWord(word, i)} disabled={disabled}>
            <span className="english-word">{word}</span>
          </button>
        ))}
      </div>

      <button
        className={styles.checkBtn}
        onClick={handleCheck}
        disabled={placed.length === 0 || disabled}
      >
        בדוק
      </button>
    </div>
  )
}
