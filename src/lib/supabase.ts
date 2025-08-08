import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Team {
  id: string
  name: string
  leader: string
  email: string
  password: string
  size: number
  progress: {
    currentRiddle: number
    hintsUsed: number
    startTime: string
    completedRiddles: number[]
  }
  registeredAt: string
  updatedAt: string
}

export interface GameSession {
  id: string
  teamId: string
  currentRiddle: number
  hintsUsed: number
  startTime: string
  completedRiddles: number[]
  createdAt: string
  updatedAt: string
}
