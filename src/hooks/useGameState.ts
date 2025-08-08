'use client'

import { useState, useEffect } from 'react'

interface Team {
  id: number
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
}

interface Message {
  id: string
  text: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export function useGameState() {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [currentRiddle, setCurrentRiddle] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [maxHints] = useState(3)
  const [showGameInterface, setShowGameInterface] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [teams, setTeams] = useState<Team[]>([])

  // Load teams from localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('techEscapeTeams')
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams))
    }
  }, [])

  // Check if user is already authenticated
  useEffect(() => {
    const savedTeam = localStorage.getItem('techEscapeTeam')
    if (savedTeam) {
      try {
        const team = JSON.parse(savedTeam)
        setCurrentTeam(team)
        setShowGameInterface(true)
        setCurrentRiddle(team.progress?.currentRiddle || 0)
        setHintsUsed(team.progress?.hintsUsed || 0)
      } catch (error) {
        console.error('Error loading saved team:', error)
        localStorage.removeItem('techEscapeTeam')
      }
    }
  }, [])

  const showMessage = (text: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      type
    }
    setMessages(prev => [...prev, newMessage])
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id))
    }, 5000)
  }

  const handleLogin = (teamName: string, password: string) => {
    const team = teams.find(t => 
      t.name.toLowerCase() === teamName.toLowerCase() && t.password === password
    )

    if (team) {
      setCurrentTeam(team)
      localStorage.setItem('techEscapeTeam', JSON.stringify(team))
      showMessage('Welcome back! Loading your progress...', 'success')
      setTimeout(() => {
        setShowGameInterface(true)
        setCurrentRiddle(team.progress?.currentRiddle || 0)
        setHintsUsed(team.progress?.hintsUsed || 0)
      }, 1000)
    } else {
      showMessage('Invalid team name or password. Please try again.', 'error')
    }
  }

  const handleRegister = (teamData: Omit<Team, 'id' | 'progress' | 'registeredAt'>) => {
    // Check if team name already exists
    if (teams.find(t => t.name.toLowerCase() === teamData.name.toLowerCase())) {
      showMessage('Team name already exists. Please choose a different name.', 'error')
      return
    }

    const newTeam: Team = {
      id: Date.now(),
      ...teamData,
      progress: {
        currentRiddle: 0,
        hintsUsed: 0,
        startTime: new Date().toISOString(),
        completedRiddles: []
      },
      registeredAt: new Date().toISOString()
    }

    const updatedTeams = [...teams, newTeam]
    setTeams(updatedTeams)
    localStorage.setItem('techEscapeTeams', JSON.stringify(updatedTeams))
    
    setCurrentTeam(newTeam)
    localStorage.setItem('techEscapeTeam', JSON.stringify(newTeam))

    showMessage(`Team "${teamData.name}" registered successfully! Welcome to Tech Escape!`, 'success')
    setTimeout(() => {
      setShowGameInterface(true)
    }, 1500)
  }

  const createTestTeam = () => {
    const testTeam: Team = {
      id: 999999,
      name: 'Demo Team',
      leader: 'Test User',
      email: 'test@demo.com',
      password: 'demo123',
      size: 1,
      progress: {
        currentRiddle: 0,
        hintsUsed: 0,
        startTime: new Date().toISOString(),
        completedRiddles: []
      },
      registeredAt: new Date().toISOString()
    }

    setCurrentTeam(testTeam)
    localStorage.setItem('techEscapeTeam', JSON.stringify(testTeam))

    showMessage('Demo team created! Starting game...', 'success')
    setTimeout(() => {
      setShowGameInterface(true)
    }, 1000)
  }

  const saveGameProgress = () => {
    if (!currentTeam) return

    const updatedTeam = {
      ...currentTeam,
      progress: {
        currentRiddle,
        hintsUsed,
        startTime: currentTeam.progress.startTime,
        completedRiddles: Array.from({length: currentRiddle}, (_, i) => i)
      }
    }

    setCurrentTeam(updatedTeam)
    localStorage.setItem('techEscapeTeam', JSON.stringify(updatedTeam))

    // Update in teams array
    const teamIndex = teams.findIndex(t => t.id === currentTeam.id)
    if (teamIndex !== -1) {
      const updatedTeams = [...teams]
      updatedTeams[teamIndex] = updatedTeam
      setTeams(updatedTeams)
      localStorage.setItem('techEscapeTeams', JSON.stringify(updatedTeams))
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? Your progress will be saved.')) {
      saveGameProgress()
      
      setCurrentTeam(null)
      localStorage.removeItem('techEscapeTeam')
      
      setCurrentRiddle(0)
      setHintsUsed(0)
      setShowGameInterface(false)
      
      showMessage('Logged out successfully!', 'success')
    }
  }

  return {
    currentTeam,
    currentRiddle,
    setCurrentRiddle,
    hintsUsed,
    setHintsUsed,
    maxHints,
    showGameInterface,
    setShowGameInterface,
    showMessage,
    messages,
    handleLogin,
    handleRegister,
    createTestTeam,
    handleLogout,
    saveGameProgress
  }
}
