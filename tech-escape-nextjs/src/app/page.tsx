'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import AuthContainer from '@/components/AuthContainer'
import GameContainer from '@/components/GameContainer'
import MessageContainer from '@/components/MessageContainer'
import ConnectionStatus from '@/components/ConnectionStatus'
import { useGameState } from '@/hooks/useGameState'

export default function Home() {
  const { 
    currentTeam, 
    currentRiddle, 
    hintsUsed, 
    maxHints,
    showGameInterface,
    showMessage,
    messages 
  } = useGameState()

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="circuit-lines"></div>
        <div className="floating-particles"></div>
        {/* Hidden flag: IEEE{hidden_flag_found} */}
        <div className="hidden-flag-element">IEEE{hidden_flag_found}</div>
      </div>

      {/* Header */}
      <Header />

      {/* Connection Status */}
      <ConnectionStatus />

      {/* Main Content */}
      <div className="min-h-[calc(100vh-120px)] py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Authentication Screen */}
          {!showGameInterface && (
            <AuthContainer />
          )}

          {/* Game Interface */}
          {showGameInterface && (
            <GameContainer />
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      <MessageContainer messages={messages} />
    </main>
  )
}
