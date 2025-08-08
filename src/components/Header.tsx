'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [minutes, setMinutes] = useState(15)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const gameDuration = 15 * 60 * 1000 // 15 minutes
    const startTime = Date.now()
    const endTime = startTime + gameDuration

    const timer = setInterval(() => {
      const now = Date.now()
      const timeLeft = endTime - now

      if (timeLeft > 0) {
        const mins = Math.floor(timeLeft / (1000 * 60))
        const secs = Math.floor((timeLeft % (1000 * 60)) / 1000)
        setMinutes(mins)
        setSeconds(secs)
      } else {
        setMinutes(0)
        setSeconds(0)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleIeeeLogoClick = () => {
    // Show hidden flag message
    console.log('%c🎯 IEEE Logo Clicked!', 'color: #00ff00; font-size: 16px; font-weight: bold;')
    console.log('%c🏁 Flag found: IEEE{hidden_flag_found}', 'color: #ffaa00; font-size: 14px; font-weight: bold;')
  }

  return (
    <header className="bg-[rgba(26,31,46,0.95)] backdrop-blur-[10px] border-b border-[var(--border-color)] py-4 sticky top-0 z-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="ieee-logo flex items-center gap-2 bg-[var(--gradient-primary)] px-4 py-3 rounded-lg font-semibold text-base cursor-pointer transition-all duration-300 hover:scale-105 hover:brightness-110"
              data-flag="IEEE{hidden_flag_found}"
              onClick={handleIeeeLogoClick}
            >
              <img src="/ieee-logo.webp" alt="IEEE SIT Logo" className="w-6 h-6 object-contain" />
              <span>IEEE SIT</span>
            </div>
            <h1 className="event-title text-3xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent m-0">
              Tech Escape
            </h1>
          </div>
          
          <div className="countdown-timer flex gap-4">
            <div className="time-unit text-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 min-w-16">
              <span className="time-value block text-2xl font-bold text-[var(--accent-color)] font-mono">
                {minutes.toString().padStart(2, '0')}
              </span>
              <span className="time-label block text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                Minutes
              </span>
            </div>
            <div className="time-unit text-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 min-w-16">
              <span className="time-value block text-2xl font-bold text-[var(--accent-color)] font-mono">
                {seconds.toString().padStart(2, '0')}
              </span>
              <span className="time-label block text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                Seconds
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
