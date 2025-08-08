'use client'

import { useState, useEffect } from 'react'
import { teamService, gameSessionService } from '@/lib/database'
import { Team, GameSession } from '@/lib/supabase'

interface Message {
  id: string
  text: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export function useGameState() {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null)
  const [currentRiddle, setCurrentRiddle] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [maxHints] = useState(3)
  const [showGameInterface, setShowGameInterface] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load session from localStorage on mount
  useEffect(() => {
    const savedTeamId = localStorage.getItem('currentTeamId')
    if (savedTeamId) {
      loadTeamSession(savedTeamId)
    }
  }, [])

  const loadTeamSession = async (teamId: string) => {
    setIsLoading(true)
    try {
      // Load team data
      const teamResult = await teamService.getTeamById(teamId)
      if (teamResult.success && teamResult.team) {
        setCurrentTeam(teamResult.team)
        
        // Load or create game session
        const sessionResult = await gameSessionService.getCurrentSession(teamId)
        if (sessionResult.success && sessionResult.session) {
          setCurrentSession(sessionResult.session)
          setCurrentRiddle(sessionResult.session.currentRiddle)
          setHintsUsed(sessionResult.session.hintsUsed)
          setShowGameInterface(true)
        } else {
          // Create new session
          const newSessionResult = await gameSessionService.createSession(teamId)
          if (newSessionResult.success && newSessionResult.session) {
            setCurrentSession(newSessionResult.session)
            setShowGameInterface(true)
          }
        }
      }
    } catch (error) {
      showMessage('Failed to load team session', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const showMessage = (text: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      type
    }
    setMessages(prev => [...prev, message])
    
    // Remove message after 5 seconds
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== message.id))
    }, 5000)
  }

  const handleRegister = async (teamData: {
    teamName: string
    teamLeader: string
    email: string
    password: string
    teamSize: string
  }) => {
    setIsLoading(true)
    try {
      const result = await teamService.registerTeam({
        name: teamData.teamName,
        leader: teamData.teamLeader,
        email: teamData.email,
        password: teamData.password,
        size: parseInt(teamData.teamSize),
        progress: {
          currentRiddle: 0,
          hintsUsed: 0,
          startTime: new Date().toISOString(),
          completedRiddles: []
        }
      })

      if (result.success && result.team) {
        setCurrentTeam(result.team)
        localStorage.setItem('currentTeamId', result.team.id)
        
        // Create game session
        const sessionResult = await gameSessionService.createSession(result.team.id)
        if (sessionResult.success && sessionResult.session) {
          setCurrentSession(sessionResult.session)
        }
        
        setShowGameInterface(true)
        showMessage('🎉 Team registered successfully!', 'success')
      } else {
        showMessage(result.error || 'Registration failed', 'error')
      }
    } catch (error) {
      showMessage('Registration failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (teamName: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await teamService.loginTeam(teamName, password)
      
      if (result.success && result.team) {
        setCurrentTeam(result.team)
        localStorage.setItem('currentTeamId', result.team.id)
        
        // Load or create game session
        const sessionResult = await gameSessionService.getCurrentSession(result.team.id)
        if (sessionResult.success && sessionResult.session) {
          setCurrentSession(sessionResult.session)
          setCurrentRiddle(sessionResult.session.currentRiddle)
          setHintsUsed(sessionResult.session.hintsUsed)
        } else {
          // Create new session
          const newSessionResult = await gameSessionService.createSession(result.team.id)
          if (newSessionResult.success && newSessionResult.session) {
            setCurrentSession(newSessionResult.session)
          }
        }
        
        setShowGameInterface(true)
        showMessage('🎉 Login successful!', 'success')
      } else {
        showMessage(result.error || 'Invalid credentials', 'error')
      }
    } catch (error) {
      showMessage('Login failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const createTestTeam = async () => {
    setIsLoading(true)
    try {
      const result = await teamService.registerTeam({
        name: 'Test Team',
        leader: 'Test Leader',
        email: 'test@example.com',
        password: 'test123',
        size: 3,
        progress: {
          currentRiddle: 0,
          hintsUsed: 0,
          startTime: new Date().toISOString(),
          completedRiddles: []
        }
      })

      if (result.success && result.team) {
        setCurrentTeam(result.team)
        localStorage.setItem('currentTeamId', result.team.id)
        
        const sessionResult = await gameSessionService.createSession(result.team.id)
        if (sessionResult.success && sessionResult.session) {
          setCurrentSession(sessionResult.session)
        }
        
        setShowGameInterface(true)
        showMessage('🎉 Test team created!', 'success')
      }
    } catch (error) {
      showMessage('Failed to create test team', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setCurrentTeam(null)
    setCurrentSession(null)
    setCurrentRiddle(0)
    setHintsUsed(0)
    setShowGameInterface(false)
    localStorage.removeItem('currentTeamId')
    showMessage('👋 Logged out successfully', 'info')
  }

  const completeRiddle = async (riddleIndex: number) => {
    if (!currentSession) return
    
    try {
      const result = await gameSessionService.completeRiddle(currentSession.id, riddleIndex)
      if (result.success) {
        setCurrentRiddle(riddleIndex + 1)
        showMessage('🎉 Riddle completed!', 'success')
      } else {
        showMessage(result.error || 'Failed to complete riddle', 'error')
      }
    } catch (error) {
      showMessage('Failed to complete riddle', 'error')
    }
  }

  const useHint = async () => {
    if (!currentSession || hintsUsed >= maxHints) return
    
    try {
      const result = await gameSessionService.updateSession(currentSession.id, {
        hintsUsed: hintsUsed + 1
      })
      
      if (result.success && result.session) {
        setHintsUsed(hintsUsed + 1)
        setCurrentSession(result.session)
        showMessage('💡 Hint used!', 'info')
      }
    } catch (error) {
      showMessage('Failed to use hint', 'error')
    }
  }

  return {
    currentTeam,
    currentRiddle,
    hintsUsed,
    maxHints,
    showGameInterface,
    messages,
    isLoading,
    handleRegister,
    handleLogin,
    createTestTeam,
    handleLogout,
    showMessage,
    completeRiddle,
    useHint
  }
}
