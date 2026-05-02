import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { shuffle } from '../../utils/shuffle.js'
import styles from './WordMatch.module.css'

export default function WordMatch({ exercise, onAutoAdvance }) {
  const hebrewWords = useMemo(() => exercise.pairs.map((p) => p.hebrew), [exercise])
  const englishWords = useMemo(() => shuffle(exercise.pairs.map((p) => p.english)), [exercise])

  const [selectedHebrew, setSelectedHebrew] = useState(null)
  const [selectedEnglish, setSelectedEnglish] = useState(null)
  const [matched, setMatched] = useState(new Set())
  const [wrongFlash, setWrongFlash] = useState(null)

  function handleHebrew(word) {
    if (matched.has(word)) return
    const newHebrew = selectedHebrew === word ? null : word
    setSelectedHebrew(newHebrew)
    if (newHebrew && selectedEnglish) {
      checkPair(newHebrew, selectedEnglish)
    }
  }

  function handleEnglish(word) {
    if (matched.has(word)) return
    const newEnglish = selectedEnglish === word ? null : word
    setSelectedEnglish(newEnglish)
    if (selectedHebrew && newEnglish) {
      checkPair(selectedHebrew, newEnglish)
    }
  }

  function checkPair(hebrew, english) {
    const pair = exercise.pairs.find((p) => p.hebrew === hebrew)
    if (pair && pair.english === english) {
      const newMatched = new Set([...matched, hebrew, english])
      setMatched(newMatched)
      setSelectedHebrew(null)
      setSelectedEnglish(null)
      if (newMatched.size === exercise.pairs.length * 2) {
        setTimeout(onAutoAdvance, 600)
      }
    } else {
      setWrongFlash(`${hebrew}-${english}`)
      setTimeout(() => {
        setSelectedHebrew(null)
        setSelectedEnglish(null)
        setWrongFlash(null)
      }, 500)
    }
  }

  function colState(word, type) {
    if (matched.has(word)) return 'matched'
    const isSelected = type === 'hebrew' ? selectedHebrew === word : selectedEnglish === word
    if (isSelected) return 'selected'
    const isWrong =
      wrongFlash === `${type === 'hebrew' ? word : selectedHebrew}-${type === 'english' ? word : selectedEnglish}`
    if (isWrong) return 'wrong'
    return 'idle'
  }

  return (
    <div className={styles.container}>
      <p className={styles.instruction}>חבר כל מילה עברית למילה האנגלית שלה</p>
      <div className={styles.columns}>
        <div className={styles.col}>
          {hebrewWords.map((word) => {
            const state = colState(word, 'hebrew')
            return (
              <motion.button
                key={word}
                className={`${styles.tile} ${styles[state]} ${styles.hebrewTile}`}
                onClick={() => handleHebrew(word)}
                animate={state === 'wrong' ? { x: [0, -8, 8, -8, 8, 0] } : state === 'matched' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.35 }}
              >
                {word}
              </motion.button>
            )
          })}
        </div>
        <div className={styles.col}>
          {englishWords.map((word) => {
            const state = colState(word, 'english')
            return (
              <motion.button
                key={word}
                className={`${styles.tile} ${styles[state]} ${styles.englishTile}`}
                onClick={() => handleEnglish(word)}
                animate={state === 'wrong' ? { x: [0, -8, 8, -8, 8, 0] } : state === 'matched' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.35 }}
              >
                <span className="english-word">{word}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
