'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'

type Todo = {
  id: number
  title: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [testStatus, setTestStatus] = useState<
    | { status: 'idle' }
    | { status: 'testing' }
    | { status: 'success'; durationMs: number }
    | { status: 'error'; message: string }
  >({ status: 'idle' })

  useEffect(() => {
    async function getTodos() {
      const { data, error } = await supabase.from('todos').select('*').order('id')
      if (error) {
        setError(error.message)
        return
      }
      setTodos(data ?? [])
    }
    getTodos()
  }, [])

  return (
    <main className="min-h-screen p-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={async () => {
            setTestStatus({ status: 'testing' })
            const start = performance.now()
            const { error } = await supabase.from('todos').select('id').limit(1)
            const durationMs = Math.round(performance.now() - start)
            if (error) {
              setTestStatus({ status: 'error', message: error.message })
            } else {
              setTestStatus({ status: 'success', durationMs })
            }
          }}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          disabled={testStatus.status === 'testing'}
        >
          {testStatus.status === 'testing' ? 'Testing…' : 'Test Supabase Connection'}
        </button>
        {testStatus.status === 'success' && (
          <span className="text-green-600">Connected in {testStatus.durationMs} ms</span>
        )}
        {testStatus.status === 'error' && (
          <span className="text-red-600">Connection failed</span>
        )}
      </div>
      <h1 className="text-2xl font-semibold mb-4">Todos (Supabase)</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-6">
        {todos.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </main>
  )
}
