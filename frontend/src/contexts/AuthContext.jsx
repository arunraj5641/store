import { createContext, useContext, useMemo, useState } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = (credentials) => {
    if (!credentials?.email || !credentials?.password) {
      return { success: false, message: 'Email and password are required.' }
    }

    setUser({ email: credentials.email, name: 'Demo Store Owner' })
    setIsAuthenticated(true)
    return { success: true, message: 'Signed in successfully.' }
  }

  const signup = (values) => {
    if (!values?.name || !values?.email || !values?.password) {
      return { success: false, message: 'Please complete all required fields.' }
    }

    setUser({ email: values.email, name: values.name })
    setIsAuthenticated(true)
    return { success: true, message: 'Account created successfully.' }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    return { success: true, message: 'Signed out.' }
  }

  const value = useMemo(
    () => ({ user, isAuthenticated, login, signup, logout }),
    [user, isAuthenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
