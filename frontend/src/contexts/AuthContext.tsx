"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  token: string | null
  login: (token: string) => void
  logout: () => void
  user: any
  setUser: (user: any) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (token) {
      // Decode JWT to get user info (simple decode, in production use proper JWT library)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUser(payload)
      } catch (error) {
        console.error("Invalid token")
        logout()
      }
    }
  }, [token])

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ token, login, logout, user, setUser }}>{children}</AuthContext.Provider>
}
