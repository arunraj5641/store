import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  return <AuthContext.Provider value={{ user: null }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
