import { createContext, useContext } from 'react'

export const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  return <NotificationContext.Provider value={{ notifications: [] }}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => useContext(NotificationContext)

export default NotificationContext
