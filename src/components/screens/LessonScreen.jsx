import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProgressBar from '../ui/ProgressBar.jsx'
import HeartsBar from '../ui/HeartsBar.jsx'
import FeedbackBanner from '../ui/FeedbackBanner.jsx'
import Mascot from '../ui/Mascot.jsx'
import MultipleChoice from '../exercises/MultipleChoice.jsx'
import ListenAndChoose from '../exercises/ListenAndChoose.jsx'
import WordMatch from '../exercises/WordMatch.jsx'
import Spelling from '../exercises/Spelling.jsx'
import TranslateSentence from '../exercises/TranslateSentence.jsx'
import styles from './LessonScreen.module.css'

export default function LessonScreen({ lesson, initialHearts, onComplete, onFail, onExit }) {
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [hearts, setHearts] = useState(initialHearts)
  const [result, setResult] = useState(null)
  const [correctAnswer, setCorrectAnswer] = useState(null)
  const [pendingFail, setPendingFail] = useState(false)
  const [pendingComplete, setPendingComplete] = useState(false)
  const pendingFailRef = useRef(false)

  const exercises = lesson.exercises
  const exercise = exercises[exerciseIndex]
  const isLastExercise = exerciseIndex === exercises.length - 1

  function mascotMood() {
    if (result === 'correct') return 'happy'
    if (result === 'wrong') return 'sad'
    return 'neutral'
  }

  function handleCorrect(answer) {
    setCorrectAnswer(answer)
    setResult('correct')
    if (isLastExercise) setPendingComplete(true)
  }

  function handleWrong(answer) {
    const newHearts = hearts - 1
    setHearts(newHearts)
    setCorrectAnswer(answer)
    setResult('wrong')
    if (newHearts <= 0) setPendingFail(true)
  }

  function handleLoseHeart() {
    setHearts((h) => {
      if (h <= 0) return 0
      const next = h - 1
      if (next <= 0) {
        setPendingFail(true)
        pendingFailRef.current = true
      }
      return next
    })
  }

  function handleAutoAdvance() {
    if (pendingFailRef.current) {
      onFail()
    } else if (isLastExercise) {
      onComplete({ heartsLeft: hearts })
    } else {
      setExerciseIndex((i) => i + 1)
    }
  }

  function handleContinue() {
    setResult(null)
    setCorrectAnswer(null)
    if (pendingFail) {
      onFail()
      return
    }
    if (pendingComplete) {
      onComplete({ heartsLeft: hearts })
      return
    }
    setExerciseIndex((i) => i + 1)
  }

  function renderExercise() {
    const commonProps = {
      exercise,
      onCorrect: handleCorrect,
      onWrong: handleWrong,
      disabled: result !== null,
    }
    switch (exercise.type) {
      case 'multiple_choice':
        return <MultipleChoice key={exerciseIndex} {...commonProps} />
      case 'listen_and_choose':
        return <ListenAndChoose key={exerciseIndex} {...commonProps} />
      case 'word_match':
        return <WordMatch key={exerciseIndex} exercise={exercise} onAutoAdvance={handleAutoAdvance} />
      case 'spelling':
        return <Spelling key={exerciseIndex} exercise={exercise} onCorrect={handleCorrect} onLoseHeart={handleLoseHeart} onAutoAdvance={handleAutoAdvance} disabled={result !== null} />
      case 'translate_sentence':
        return <TranslateSentence key={exerciseIndex} {...commonProps} />
      default:
        return null
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.exitBtn} onClick={onExit} aria-label="חזור">
          ✕
        </button>
        <div className={styles.progressWrap}>
          <ProgressBar current={exerciseIndex} total={exercises.length} />
        </div>
        <HeartsBar hearts={hearts} />
        <Mascot mood={mascotMood()} />
      </div>

      <main className={styles.exerciseArea}>
        <AnimatePresence mode="wait">
          <motion.div
            key={exerciseIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className={styles.exerciseWrapper}
          >
            {renderExercise()}
          </motion.div>
        </AnimatePresence>
      </main>

      <FeedbackBanner result={result} correctAnswer={correctAnswer} onContinue={handleContinue} />
    </div>
  )
}
