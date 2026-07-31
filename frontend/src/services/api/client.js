import axios from 'axios'

const tokenKey = 'kirana_auth_token'

export const getStoredToken = () => localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey)

export const storeToken = (token, remember = false) => {
  const storage = remember ? localStorage : sessionStorage
  sessionStorage.removeItem(tokenKey)
  localStorage.removeItem(tokenKey)
  storage.setItem(tokenKey, token)
}

export const clearStoredToken = () => {
  localStorage.removeItem(tokenKey)
  sessionStorage.removeItem(tokenKey)
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredToken()
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    return Promise.reject(error)
  },
)

export default apiClient
