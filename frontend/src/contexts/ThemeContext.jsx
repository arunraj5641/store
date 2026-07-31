import { createContext, useContext } from 'react'

export const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  return <ThemeContext.Provider value={{ theme: 'dark' }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

export default ThemeContext
