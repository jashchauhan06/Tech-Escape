'use client'

import { useState } from 'react'
import { useGameState } from '@/hooks/useGameState'

export default function GameContainer() {
  const { currentTeam, currentRiddle, hintsUsed, maxHints, handleLogout, showMessage } = useGameState()
  const [answer, setAnswer] = useState('')

  const riddles = [
    {
      id: 1,
      question: '🔍 Hidden Flag Challenge - Find the hidden flag in this interface!',
      answer: 'IEEE{hidden_flag_found}',
      hint: 'Do you really think it\'s going to be that easy?'
    },
    {
      id: 2,
      question: '🧮 Binary & Hex Challenge - Convert binary 11010110 to decimal',
      answer: '214',
      hint: 'Do you really expect a shortcut on this level?'
    },
    {
      id: 3,
      question: '💻 Programming Logic - What will this code output? x = 5, y = 3, print(x + y * 2)',
      answer: '11',
      hint: 'Keep searching. In Tech Escape, only sharp minds survive.'
    }
  ]

  const currentRiddleData = riddles[currentRiddle]

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (answer.toLowerCase() === currentRiddleData.answer.toLowerCase()) {
      showMessage('🎉 Correct! Moving to next challenge...', 'success')
      setAnswer('')
      
      // Advance to next riddle
      if (currentRiddle < riddles.length - 1) {
        // Move to next riddle
        setTimeout(() => {
          // This would update the currentRiddle state
          // For now, we'll just show a message
          showMessage('Challenge completed! Next challenge loading...', 'success')
        }, 2000)
      } else {
        // All riddles completed - redirect to final riddle
        setTimeout(() => {
          window.location.href = '/final-riddle'
        }, 2000)
      }
    } else {
      showMessage('❌ Incorrect answer. Try again!', 'error')
    }
  }

  const handleHint = () => {
    if (hintsUsed >= maxHints) {
      showMessage('No hints remaining!', 'warning')
      return
    }
    showMessage(`💡 Hint: ${currentRiddleData.hint}`, 'info')
  }

  return (
    <div className="game-container flex flex-col gap-8">
      {/* Progress Section */}
      <div className="progress-section bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6">
        <div className="progress-header flex justify-between items-center mb-6 flex-wrap gap-4">
          <h3 className="text-xl font-semibold">Team Progress</h3>
          <div className="team-info flex items-center gap-6 flex-wrap">
            <span className="team-name font-semibold text-[var(--accent-color)]">
              {currentTeam?.name || 'Team Alpha'}
            </span>
            <span className="hints-remaining flex items-center gap-2 text-[var(--warning-color)] text-sm">
              <i className="fas fa-lightbulb"></i>
              <span>{maxHints - hintsUsed} hints remaining</span>
            </span>
            <button 
              onClick={handleLogout}
              className="logout-btn bg-[var(--danger-color)] border border-[var(--danger-color)] text-white py-2 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-[#cc2222] hover:border-[#cc2222] hover:transform hover:-translate-y-1 flex items-center gap-2"
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
        
        <div className="progress-tracker relative">
          <div className="progress-bar h-1 bg-[var(--bg-tertiary)] rounded-sm overflow-hidden mb-4">
            <div 
              className="progress-fill h-full bg-[var(--gradient-primary)] transition-all duration-500 ease-in-out"
              style={{ width: `${(currentRiddle / riddles.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-nodes flex justify-between relative">
            {riddles.map((riddle, index) => (
              <div key={riddle.id} className="progress-node flex flex-col items-center gap-2">
                <div className={`node-circle w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  index < currentRiddle 
                    ? 'bg-[var(--success-color)] border-[var(--success-color)] text-white' 
                    : index === currentRiddle 
                    ? 'bg-[var(--primary-color)] border-[var(--primary-color)] text-white shadow-[0_0_10px_rgba(0,102,204,0.5)]' 
                    : 'bg-[var(--bg-tertiary)] border-[var(--border-color)]'
                }`}>
                  {index < currentRiddle ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="node-label text-xs text-[var(--text-secondary)] text-center">
                  Challenge {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Riddles Section */}
      <div className="riddles-section flex-1">
        <div className="riddle-card bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 shadow-[var(--shadow-lg)]">
          <div className="riddle-header flex justify-between items-center mb-8 flex-wrap gap-4">
            <h4 className="riddle-title text-xl font-semibold text-[var(--accent-color)]">
              Challenge {currentRiddle + 1} of {riddles.length}
            </h4>
            <div className="riddle-actions flex gap-4 items-center">
              <button 
                onClick={handleHint}
                disabled={hintsUsed >= maxHints}
                className="btn-hint bg-[var(--warning-color)] border border-[var(--warning-color)] text-white py-2 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-[#cc7700] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <i className="fas fa-lightbulb"></i>
                {hintsUsed >= maxHints ? 'No hints left' : 'Hint'}
              </button>
            </div>
          </div>
          
          <div className="riddle-content flex flex-col gap-6">
            <div className="riddle-question bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-8 text-base leading-7">
              <h4 className="text-[var(--accent-color)] mb-4 text-lg font-semibold">
                {currentRiddleData.question}
              </h4>
            </div>
            
            <form onSubmit={handleAnswerSubmit} className="answer-form flex gap-2 items-end">
              <div className="input-group flex-1 relative">
                <input
                  type="text"
                  placeholder="XYZ{your_flag}"
                  required
                  className="w-full py-3 px-4 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm transition-all duration-200 focus:outline-none focus:border-[var(--primary-color)] focus:shadow-[0_0_0_3px_rgba(0,102,204,0.1)]"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="btn-submit bg-[var(--success-color)] border border-[var(--success-color)] text-white py-3 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-[#00aa55] flex-shrink-0"
              >
                <i className="fas fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
