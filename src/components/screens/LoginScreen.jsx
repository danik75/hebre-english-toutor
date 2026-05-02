import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './LoginScreen.module.css'

const AVATARS = ['🦁', '🐯', '🐻', '🦊', '🐼', '🐸', '🐬', '🦄',
                 '🦋', '🌟', '🚀', '👾', '🎨', '⚽', '🎵', '🐉']

const ADMIN_PASSWORD = 'Admin'

function levelTitle(xp) {
  if (xp >= 250) return 'אלוף!'
  if (xp >= 150) return 'מצוין'
  if (xp >= 100) return 'טוב'
  if (xp >= 50) return 'לומד'
  return 'מתחיל'
}

export default function LoginScreen({ onLogin }) {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('🦁')
  const [saving, setSaving] = useState(false)

  const [adminMode, setAdminMode] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/users').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
    ]).then(([usersData, statsData]) => {
      setUsers(usersData)
      setStats(statsData)
      setLoading(false)
    })
  }, [])

  function refreshStats() {
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setStats)
  }

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
    await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    setStats((prev) => prev.filter((s) => s.id !== userId))
  }

  function handleAdminSubmit() {
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminMode(true)
      setShowAdminModal(false)
      setAdminPassword('')
      setAdminError(false)
    } else {
      setAdminError(true)
    }
  }

  const sortedStats = [...stats].sort((a, b) => b.xp - a.xp)

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>אנגלית בכיף! 🦉</h1>

        {/* Dashboard */}
        {!loading && stats.length > 1 && (
          <div className={styles.dashboard}>
            <p className={styles.dashboardTitle}>🏆 לוח תוצאות</p>
            <div className={styles.dashboardTable}>
              {sortedStats.map((s, i) => (
                <div key={s.id} className={styles.dashboardRow}>
                  <span className={styles.dashboardRank}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                  </span>
                  <span className={styles.dashboardEmoji}>{s.emoji}</span>
                  <span className={styles.dashboardName}>{s.name}</span>
                  <span className={styles.dashboardLevel}>{levelTitle(s.xp)}</span>
                  <span className={styles.dashboardXp}>⭐ {s.xp}</span>
                  <span className={styles.dashboardStreak}>🔥 {s.streak}</span>
                  <span className={styles.dashboardLessons}>📚 {s.completedCount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
                  onClick={() => !adminMode && onLogin(user)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ cursor: adminMode ? 'default' : 'pointer' }}
                >
                  {adminMode && (
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => handleDelete(e, user.id)}
                      aria-label="מחק פרופיל"
                      title="מחק"
                    >
                      ✕
                    </button>
                  )}
                  <span className={styles.profileEmoji}>{user.emoji}</span>
                  <span className={styles.profileName}>{user.name}</span>
                </motion.button>
              ))}
            </AnimatePresence>

            {!adminMode && (
              <motion.button
                className={styles.addCard}
                onClick={() => setShowModal(true)}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className={styles.addIcon}>＋</span>
                <span className={styles.addLabel}>הוסף משתמש</span>
              </motion.button>
            )}
          </div>
        )}

        <div className={styles.adminRow}>
          {adminMode ? (
            <button className={styles.adminExitBtn} onClick={() => setAdminMode(false)}>
              ✓ יציאה ממצב מנהל
            </button>
          ) : (
            <button className={styles.adminBtn} onClick={() => setShowAdminModal(true)}>
              ⚙️ מנהל
            </button>
          )}
        </div>
      </div>

      {/* New user modal */}
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

      {/* Admin password modal */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowAdminModal(false); setAdminPassword(''); setAdminError(false) }}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={styles.modalTitle}>⚙️ כניסת מנהל</h2>
              <div className={styles.form}>
                <input
                  className={`${styles.nameInput} ${adminError ? styles.inputError : ''}`}
                  type="password"
                  placeholder="סיסמה"
                  value={adminPassword}
                  onChange={(e) => { setAdminPassword(e.target.value); setAdminError(false) }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminSubmit()}
                  autoFocus
                />
                {adminError && <p className={styles.errorMsg}>סיסמה שגויה ❌</p>}
                <div className={styles.modalButtons}>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => { setShowAdminModal(false); setAdminPassword(''); setAdminError(false) }}
                  >
                    ביטול
                  </button>
                  <button
                    className={styles.createBtn}
                    onClick={handleAdminSubmit}
                    disabled={!adminPassword}
                  >
                    כניסה
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
