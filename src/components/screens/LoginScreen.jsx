import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './LoginScreen.module.css'

const AVATARS = ['🦁', '🐯', '🐻', '🦊', '🐼', '🐸', '🐬', '🦄',
                 '🦋', '🌟', '🚀', '👾', '🎨', '⚽', '🎵', '🐉']

export default function LoginScreen({ onLogin }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('🦁')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
  }, [])

  async function handleCreate() {
    if (!name.trim()) return
    setSaving(true)
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), emoji: selectedEmoji }),
    })
    const user = await res.json()
    setSaving(false)
    setShowModal(false)
    setName('')
    setSelectedEmoji('🦁')
    onLogin(user)
  }

  async function handleDelete(e, userId) {
    e.stopPropagation()
    if (!confirm('למחוק את הפרופיל הזה?')) return
    await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>אנגלית בכיף! 🦉</h1>
        <p className={styles.subtitle}>מי משחק?</p>

        {loading ? (
          <div className={styles.loadingDots}>⏳</div>
        ) : (
          <div className={styles.profiles}>
            <AnimatePresence>
              {users.map((user) => (
                <motion.button
                  key={user.id}
                  className={styles.profileCard}
                  onClick={() => onLogin(user)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => handleDelete(e, user.id)}
                    aria-label="מחק פרופיל"
                    title="מחק"
                  >
                    ✕
                  </button>
                  <span className={styles.profileEmoji}>{user.emoji}</span>
                  <span className={styles.profileName}>{user.name}</span>
                </motion.button>
              ))}
            </AnimatePresence>

            <motion.button
              className={styles.addCard}
              onClick={() => setShowModal(true)}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className={styles.addIcon}>＋</span>
              <span className={styles.addLabel}>הוסף משתמש</span>
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={styles.modalTitle}>פרופיל חדש</h2>
              <div className={styles.form}>
                <input
                  className={styles.nameInput}
                  type="text"
                  placeholder="מה השם שלך?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  autoFocus
                  maxLength={20}
                />

                <p className={styles.emojiLabel}>בחר אווטאר:</p>
                <div className={styles.emojiGrid}>
                  {AVATARS.map((em) => (
                    <button
                      key={em}
                      className={`${styles.emojiOption} ${em === selectedEmoji ? styles.emojiSelected : ''}`}
                      onClick={() => setSelectedEmoji(em)}
                    >
                      {em}
                    </button>
                  ))}
                </div>

                <div className={styles.modalButtons}>
                  <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                    ביטול
                  </button>
                  <button
                    className={styles.createBtn}
                    onClick={handleCreate}
                    disabled={!name.trim() || saving}
                  >
                    {saving ? '...' : 'צור פרופיל'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
