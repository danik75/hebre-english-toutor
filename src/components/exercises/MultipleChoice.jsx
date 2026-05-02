import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { shuffle } from '../../utils/shuffle.js'
import styles from './MultipleChoice.module.css'

export default function MultipleChoice({ exercise, onCorrect, onWrong, disabled }) {
  const [selected, setSelected] = useState(null)
  const options = useMemo(
    () => shuffle([exercise.correctAnswer, ...exercise.distractors]),
    [exercise]
  )

  function handleSelect(option) {
    if (disabled || selected !== null) return
    setSelected(option)
    if (option === exercise.correctAnswer) {
      onCorrect(exercise.correctAnswer)
    } else {
      onWrong(exercise.correctAnswer)
    }
  }

  function getOptionState(option) {
    if (selected === null) return 'idle'
    if (option === exercise.correctAnswer) return 'correct'
    if (option === selected) return 'wrong'
    return 'dimmed'
  }

  return (
    <div className={styles.container}>
      <p className={styles.instruction}>מה המילה באנגלית?</p>
      <div className={styles.wordDisplay}>
        <span className={styles.emoji}>{exercise.emoji}</span>
        <span className={styles.hebrewWord}>{exercise.hebrewWord}</span>
      </div>
      <div className={styles.options}>
        {options.map((option) => {
          const state = getOptionState(option)
          return (
            <motion.button
              key={option}
              className={`${styles.option} ${styles[state]}`}
              onClick={() => handleSelect(option)}
              animate={state === 'wrong' ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <span className="english-word">{option}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
