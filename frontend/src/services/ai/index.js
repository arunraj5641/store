import apiClient from '../api/client'

const unwrap = (response) => response.data

export const aiService = {
  chat: async (message) => unwrap(await apiClient.post('/v1/ai/chat', { message })),
}

export default aiService
