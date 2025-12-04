'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  phone: string
  email?: string
  isVerified: boolean
  isPremium: boolean
  premiumExpires?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (user: User) => void
  logout: () => void
  demoLogin: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('campus-exchange-user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('campus-exchange-user')
      }
    }
    
    // Set a timeout to ensure loading state doesn't get stuck
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timeout)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('campus-exchange-user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('campus-exchange-user')
  }

  // Quick demo login for testing
  const demoLogin = () => {
    const demoUser: User = {
      id: 'demo-user-1',
      name: 'Demo User',
      phone: '+1234567890',
      email: 'demo@campus.com',
      isVerified: true,
      isPremium: false
    }
    login(demoUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}