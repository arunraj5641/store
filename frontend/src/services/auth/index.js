import apiClient, { clearStoredToken, storeToken } from '../api/client'

const unwrap = (response) => response.data

export const authService = {
  async login({ email, password, remember }) {
    const payload = unwrap(await apiClient.post('/v1/login', { user: { email, password } }))
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
  },
}

export default authService
