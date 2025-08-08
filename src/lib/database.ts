import { supabase, Team, GameSession } from './supabase'

// Team Management
export const teamService = {
  // Register a new team
  async registerTeam(teamData: Omit<Team, 'id' | 'registeredAt' | 'updatedAt'>): Promise<{ success: boolean; team?: Team; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{
          ...teamData,
          registeredAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, team: data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' }
    }
  },

  // Login team
  async loginTeam(teamName: string, password: string): Promise<{ success: boolean; team?: Team; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('name', teamName)
        .eq('password', password)
        .single()

      if (error) throw error
      return { success: true, team: data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' }
    }
  },

  // Get team by ID
  async getTeamById(teamId: string): Promise<{ success: boolean; team?: Team; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single()

      if (error) throw error
      return { success: true, team: data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Team not found' }
    }
  }
}

// Game Session Management
export const gameSessionService = {
  // Create new game session
  async createSession(teamId: string): Promise<{ success: boolean; session?: GameSession; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .insert([{
          teamId,
          currentRiddle: 0,
          hintsUsed: 0,
          startTime: new Date().toISOString(),
          completedRiddles: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, session: data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create session' }
    }
  },

  // Get current session for team
  async getCurrentSession(teamId: string): Promise<{ success: boolean; session?: GameSession; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('teamId', teamId)
        .order('createdAt', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      return { success: true, session: data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Session not found' }
    }
  },

  // Update session progress
  async updateSession(sessionId: string, updates: Partial<GameSession>): Promise<{ success: boolean; session?: GameSession; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single()

      if (error) throw error
      return { success: true, session: data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update session' }
    }
  },

  // Complete riddle
  async completeRiddle(sessionId: string, riddleIndex: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: currentSession } = await supabase
        .from('game_sessions')
        .select('completedRiddles')
        .eq('id', sessionId)
        .single()

      if (!currentSession) throw new Error('Session not found')

      const completedRiddles = [...(currentSession.completedRiddles || []), riddleIndex]
      
      const { error } = await supabase
        .from('game_sessions')
        .update({
          currentRiddle: riddleIndex + 1,
          completedRiddles,
          updatedAt: new Date().toISOString()
        })
        .eq('id', sessionId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to complete riddle' }
    }
  }
}
