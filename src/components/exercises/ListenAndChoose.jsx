import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { shuffle } from '../../utils/shuffle.js'
import { useAudio } from '../../hooks/useAudio.js'
import SpeakButton from '../ui/SpeakButton.jsx'
import styles from './ListenAndChoose.module.css'

export default function ListenAndChoose({ exercise, onCorrect, onWrong, disabled }) {
  const [selected, setSelected] = useState(null)
  const { speak } = useAudio()
  const options = useMemo(() => shuffle(exercise.options), [exercise])

  useEffect(() => {
    const timer = setTimeout(() => speak(exercise.audioWord), 600)
    return () => clearTimeout(timer)
  }, [exercise.audioWord])

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
      <p className={styles.instruction}>מה שמעת?</p>
      <div className={styles.speakerArea}>
        <SpeakButton word={exercise.audioWord} size="lg" />
        <p className={styles.hint}>לחץ כדי לשמוע שוב</p>
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
              {option}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
