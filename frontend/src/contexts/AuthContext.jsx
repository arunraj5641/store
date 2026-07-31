import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { clearStoredToken, getStoredToken } from '../services/api/client'
import authService from '../services/auth'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  useEffect(() => {
    const restoreSession = async () => {
      if (!getStoredToken()) {
        setIsLoading(false)
        return
      }

      try {
        const response = await authService.me()
        setUser(response.data.user)
      } catch {
        clearStoredToken()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
    window.addEventListener('auth:unauthorized', logout)
    return () => window.removeEventListener('auth:unauthorized', logout)
  }, [logout])

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      setUser(response.data.user)
      return { success: true, message: response.message }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Unable to sign in.' }
    }
  }

  const signup = async (values) => {
    try {
      const response = await authService.signup(values)
      setUser(response.data.user)
      return { success: true, message: response.message }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Unable to create your account.' }
    }
  }

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: Boolean(user), login, signup, logout }),
    [user, isLoading, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
