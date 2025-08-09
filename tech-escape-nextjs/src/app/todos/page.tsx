'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'

type Todo = {
  id: number
  title: string
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getTodos() {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('id')
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


