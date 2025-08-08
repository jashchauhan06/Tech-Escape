'use client'

import { useState, useEffect } from 'react'

export default function ConnectionStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/test-supabase')
        const data = await response.json()
        
        if (data.success) {
          setStatus('connected')
          setMessage('Database connected')
        } else {
          setStatus('error')
          setMessage(data.error || 'Connection failed')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Failed to test connection')
      }
    }

    checkConnection()
  }, [])

  if (status === 'loading') {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm">
        🔄 Testing database connection...
      </div>
    )
  }

  if (status === 'connected') {
    return (
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm">
        ✅ {message}
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg text-sm">
      ❌ {message}
    </div>
  )
}
