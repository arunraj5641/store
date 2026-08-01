import apiClient, { clearStoredToken, storeToken } from '../api/client'
import { clearStoredAssistantChatMessages } from '../ai/chatSession'

const unwrap = (response) => response.data

export const authService = {
  async login({ email, password, remember }) {
    const loginPayload = {
      user: {
        email,
        password,
      },
    }

    const payload = unwrap(await apiClient.post('/v1/login', loginPayload))
    storeToken(payload.data.token, remember)
    return payload
  },

  async signup({ name, email, shopName, password, confirmPassword, remember }) {
    const payload = unwrap(await apiClient.post('/v1/signup', {
      user: {
        name,
        email,
        shop_name: shopName,
        password,
        password_confirmation: confirmPassword,
      },
    }))
    storeToken(payload.data.token, remember)
    return payload
  },

  async me() {
    return unwrap(await apiClient.get('/v1/me'))
  },

  logout() {
    clearStoredToken()
    clearStoredAssistantChatMessages()
  },
}

export default authService
