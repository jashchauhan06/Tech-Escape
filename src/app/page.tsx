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

  const [apiStatus, setApiStatus] = useState('')
  const [supabaseStatus, setSupabaseStatus] = useState('')

  const testAPI = async () => {
    try {
      const response = await fetch('/api/test')
      const data = await response.json()
      setApiStatus(`✅ API Test: ${data.message}`)
    } catch (error) {
      setApiStatus(`❌ API Test Failed: ${(error as Error).message}`)
    }
  }

  const testSupabase = async () => {
    try {
      setSupabaseStatus('Testing…')
      const response = await fetch('/api/test-supabase')
      const data = await response.json()
      if (data.success) {
        setSupabaseStatus('✅ Supabase connection successful')
      } else {
        setSupabaseStatus(`❌ Supabase failed: ${data.error || data.message}`)
      }
    } catch (error) {
      setSupabaseStatus(`❌ Supabase test error: ${(error as Error).message}`)
    }
  }

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

      {/* Test Buttons - visible within the page flow */}
      <div className="w-full flex justify-center mt-6">
        <div className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-4 py-3">
          <button 
            onClick={testAPI}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Test API
          </button>
          <button
            onClick={testSupabase}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Test Supabase
          </button>
          {(apiStatus || supabaseStatus) && (
            <div className="text-xs text-[var(--text-secondary)]">
              {apiStatus || supabaseStatus}
            </div>
          )}
        </div>
      </div>

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
