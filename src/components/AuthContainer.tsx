'use client'

import { useState } from 'react'
import { useGameState } from '@/hooks/useGameState'

export default function AuthContainer() {
  const [showRegister, setShowRegister] = useState(false)
  const { handleLogin, handleRegister, createTestTeam, isLoading } = useGameState()

  const [loginData, setLoginData] = useState({
    teamName: '',
    password: ''
  })

  const [registerData, setRegisterData] = useState({
    teamName: '',
    teamLeader: '',
    email: '',
    password: '',
    teamSize: ''
  })

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginData.teamName.trim() || !loginData.password) {
      return
    }
    handleLogin(loginData.teamName.trim(), loginData.password)
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!registerData.teamName.trim() || !registerData.teamLeader.trim() || 
        !registerData.email.trim() || !registerData.password || !registerData.teamSize) {
      return
    }
    handleRegister({
      name: registerData.teamName.trim(),
      leader: registerData.teamLeader.trim(),
      email: registerData.email.trim(),
      password: registerData.password,
      size: parseInt(registerData.teamSize)
    })
  }


  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="auth-card bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 w-full max-w-md shadow-[var(--shadow-xl)]">
        <div className="auth-header text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Tech Escape</h2>
          <p className="text-[var(--text-secondary)] text-sm">Embark on your digital treasure hunt adventure</p>
        </div>
        
        {/* Login Form */}
        <div className={`auth-form ${showRegister ? 'hidden' : ''}`}>
          <h3 className="text-xl font-semibold mb-6 text-center">Team Login</h3>
          <form onSubmit={handleLoginSubmit}>
            <div className="input-group relative mb-4">
              <i className="fas fa-users absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"></i>
              <input
                type="text"
                placeholder="Team Name"
                required
                className="w-full py-3 px-4 pl-12 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm transition-all duration-200 focus:outline-none focus:border-[var(--primary-color)] focus:shadow-[0_0_0_3px_rgba(0,102,204,0.1)]"
                value={loginData.teamName}
                onChange={(e) => setLoginData({...loginData, teamName: e.target.value})}
              />
            </div>
            <div className="input-group relative mb-4">
              <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"></i>
              <input
                type="password"
                placeholder="Team Password"
                required
                className="w-full py-3 px-4 pl-12 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm transition-all duration-200 focus:outline-none focus:border-[var(--primary-color)] focus:shadow-[0_0_0_3px_rgba(0,102,204,0.1)]"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary w-full py-3 px-6 bg-[var(--gradient-primary)] border border-[var(--primary-color)] rounded-lg text-white text-sm font-semibold transition-all duration-200 hover:bg-[var(--gradient-secondary)] hover:transform hover:-translate-y-1 hover:shadow-[var(--shadow-md)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-sign-in-alt"></i>
              {isLoading ? 'Logging in...' : 'Start Adventure'}
            </button>
          </form>
          <p className="auth-switch text-center mt-6 text-sm text-[var(--text-secondary)]">
            New team? <button onClick={() => setShowRegister(true)} className="text-[var(--accent-color)] hover:underline">Register here</button>
          </p>

          
        </div>

        {/* Registration Form */}
        <div className={`auth-form ${!showRegister ? 'hidden' : ''}`}>
          <h3 className="text-xl font-semibold mb-6 text-center">Team Registration</h3>
          <form onSubmit={handleRegisterSubmit}>
            <div className="input-group relative mb-4">
              <i className="fas fa-users absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"></i>
              <input
                type="text"
                placeholder="Team Name"
                required
                className="w-full py-3 px-4 pl-12 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm transition-all duration-200 focus:outline-none focus:border-[var(--primary-color)] focus:shadow-[0_0_0_3px_rgba(0,102,204,0.1)]"
                value={registerData.teamName}
                onChange={(e) => setRegisterData({...registerData, teamName: e.target.value})}
              />
            </div>
            <div className="input-group relative mb-4">
              <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"></i>
              <input
                type="text"
                placeholder="Team Leader Name"
                required
                className="w-full py-3 px-4 pl-12 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm transition-all duration-200 focus:outline-none focus:border-[var(--primary-color)] focus:shadow-[0_0_0_3px_rgba(0,102,204,0.1)]"
                value={registerData.teamLeader}
                onChange={(e) => setRegisterData({...registerData, teamLeader: e.target.value})}
              />
            </div>
            <div className="input-group relative mb-4">
              <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"></i>
              <input
                type="email"
                placeholder="Team Email"
                required
                className="w-full py-3 px-4 pl-12 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm transition-all duration-200 focus:outline-none focus:border-[var(--primary-color)] focus:shadow-[0_0_0_3px_rgba(0,102,204,0.1)]"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              />
            </div>
            <div className="input-group relative mb-4">
              <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"></i>
              <input
                type="password"
                placeholder="Create Password"
                required
                className="w-full py-3 px-4 pl-12 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm transition-all duration-200 focus:outline-none focus:border-[var(--primary-color)] focus:shadow-[0_0_0_3px_rgba(0,102,204,0.1)]"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              />
            </div>
            <div className="input-group relative mb-4">
              <i className="fas fa-hashtag absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"></i>
              <input
                type="number"
                placeholder="Team Size"
                min="1"
                max="6"
                required
                className="w-full py-3 px-4 pl-12 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm transition-all duration-200 focus:outline-none focus:border-[var(--primary-color)] focus:shadow-[0_0_0_3px_rgba(0,102,204,0.1)]"
                value={registerData.teamSize}
                onChange={(e) => setRegisterData({...registerData, teamSize: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary w-full py-3 px-6 bg-[var(--gradient-primary)] border border-[var(--primary-color)] rounded-lg text-white text-sm font-semibold transition-all duration-200 hover:bg-[var(--gradient-secondary)] hover:transform hover:-translate-y-1 hover:shadow-[var(--shadow-md)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-rocket"></i>
              {isLoading ? 'Creating Team...' : 'Create Team'}
            </button>
          </form>
          <p className="auth-switch text-center mt-6 text-sm text-[var(--text-secondary)]">
            Already registered? <button onClick={() => setShowRegister(false)} className="text-[var(--accent-color)] hover:underline">Login here</button>
          </p>
          
        </div>
      </div>
    </div>
  )
}
