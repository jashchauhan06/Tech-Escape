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

      {/* Test Buttons - API and Supabase */}
      <div className="fixed top-20 right-4 z-50">
        <button 
          onClick={testAPI}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
        >
          Test API (v2)
        </button>
        <button
          onClick={testSupabase}
          className="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Test Supabase
        </button>
        {apiStatus && (
          <div className="mt-2 bg-gray-800 text-white px-3 py-2 rounded text-xs">
            {apiStatus}
          </div>
        )}
        {supabaseStatus && (
          <div className="mt-2 bg-gray-800 text-white px-3 py-2 rounded text-xs">
            {supabaseStatus}
          </div>
        )}
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
