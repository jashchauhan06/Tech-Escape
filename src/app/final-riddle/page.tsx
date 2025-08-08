'use client'

import { useState } from 'react'
import Header from '@/components/Header'

export default function FinalRiddle() {
  const [answer, setAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // The answer is "mirror" - this is a classic riddle
    if (answer.toLowerCase().trim() === 'mirror') {
      setIsCorrect(true)
      setShowResult(true)
    } else {
      setIsCorrect(false)
      setShowResult(true)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="circuit-lines"></div>
        <div className="floating-particles"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="min-h-[calc(100vh-120px)] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="final-riddle-container text-center py-8">
            <div className="container">
              <div className="final-riddle-card bg-[var(--bg-secondary)] border-2 border-[var(--accent-color)] rounded-[20px] p-12 max-w-4xl w-full shadow-[0_20px_40px_rgba(0,170,255,0.2)] relative overflow-hidden">
                <div className="final-riddle-header mb-8">
                  <h1 className="text-4xl font-bold text-[var(--accent-color)] mb-2 text-shadow-[0_0_20px_rgba(0,170,255,0.5)]">
                    🔍 Next Challenge
                  </h1>
                  <p className="text-xl text-[var(--text-secondary)] font-medium">
                    You've unlocked the next riddle!
                  </p>
                </div>
                
                <div className="final-riddle-content mb-8">
                  <div className="riddle-poem bg-[var(--bg-secondary)] border-2 border-[var(--accent-color)] rounded-2xl p-8 text-xl leading-8">
                    <div className="riddle-line animate-in opacity-0 transform translate-x-[-50px] transition-all duration-600 ease-in-out animate-in">
                      <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2 leading-8 text-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        Look at me and you'll see yourself,
                      </h3>
                    </div>
                    <div className="riddle-line animate-in opacity-0 transform translate-x-[-50px] transition-all duration-600 ease-in-out animate-in" style={{animationDelay: '0.2s'}}>
                      <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2 leading-8 text-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        Yet I am not a twin or a friend.
                      </h3>
                    </div>
                    <div className="riddle-line animate-in opacity-0 transform translate-x-[-50px] transition-all duration-600 ease-in-out animate-in" style={{animationDelay: '0.4s'}}>
                      <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2 leading-8 text-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        I show you now, I show you then,
                      </h3>
                    </div>
                    <div className="riddle-line animate-in opacity-0 transform translate-x-[-50px] transition-all duration-600 ease-in-out animate-in" style={{animationDelay: '0.6s'}}>
                      <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2 leading-8 text-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        But in my world, left and right switch ends.
                      </h3>
                    </div>
                    <div className="riddle-line animate-in opacity-0 transform translate-x-[-50px] transition-all duration-600 ease-in-out animate-in" style={{animationDelay: '0.8s'}}>
                      <h3 className="text-2xl font-semibold text-[var(--accent-color)] font-bold leading-8">
                        Where am I waiting for you?
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Answer Form */}
                <form onSubmit={handleSubmit} className="final-answer-form flex flex-col gap-4 max-w-md mx-auto mb-8">
                  <input
                    type="text"
                    placeholder="Enter your answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="bonus-answer-input bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)] rounded-lg py-3 px-4 text-[var(--text-primary)] text-lg transition-all duration-300 focus:outline-none focus:border-[var(--accent-color)] focus:shadow-[0_0_15px_rgba(0,170,255,0.3)]"
                  />
                  <button 
                    type="submit"
                    className="btn-final bg-[var(--gradient-primary)] border-none text-white py-4 px-8 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,102,204,0.4)]"
                  >
                    Submit Answer
                  </button>
                </form>

                {/* Result */}
                {showResult && (
                  <div className={`bonus-result mt-4 p-4 rounded-lg font-semibold text-lg animation-[fadeIn_0.5s_ease] ${
                    isCorrect 
                      ? 'bg-[var(--success-color)] text-white' 
                      : 'bg-[var(--danger-color)] text-white'
                  }`}>
                    <p className="correct-answer m-0 text-xl">
                      {isCorrect 
                        ? '🎉 Correct! You found the mirror!' 
                        : '❌ Incorrect. Try again!'
                      }
                    </p>
                  </div>
                )}

                {/* Hint Section */}
                <div className="bonus-hint-section text-center mt-8">
                  <div className="hint-content mt-4 p-4 bg-[var(--bg-tertiary)] rounded-lg border-l-4 border-[var(--warning-color)] animation-[fadeIn_0.5s_ease-in-out]">
                    <i className="fas fa-lightbulb text-[var(--warning-color)] mr-2"></i>
                    <span className="text-[var(--text-secondary)]">
                      Think about what reflects your image and reverses left and right...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
