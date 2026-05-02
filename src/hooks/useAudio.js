export function useAudio() {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  function speak(text) {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    utterance.pitch = 1.1
    window.speechSynthesis.speak(utterance)
  }

  return { speak, isSupported }
}
