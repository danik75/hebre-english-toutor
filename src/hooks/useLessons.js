import { useState, useEffect } from 'react'

export function useLessons() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/lessons')
      .then((r) => r.json())
      .then((data) => {
        setLessons(data)
        setLoading(false)
      })
  }, [])

  return [lessons, loading]
}
