import { useAudio } from '../../hooks/useAudio.js'
import styles from './SpeakButton.module.css'

export default function SpeakButton({ word, autoPlay = false, size = 'md' }) {
  const { speak, isSupported } = useAudio()

  if (!isSupported) return null

  return (
    <button
      className={`${styles.btn} ${styles[size]}`}
      onClick={() => speak(word)}
      aria-label={`השמע את המילה: ${word}`}
      title="השמע"
    >
      🔊
    </button>
  )
}
