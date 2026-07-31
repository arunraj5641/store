import apiClient from '../api/client'

const unwrap = (response) => response.data

export const festivalsService = {
  list: async (params) => unwrap(await apiClient.get('/v1/festivals', { params })),
  getById: async (id) => unwrap(await apiClient.get(`/v1/festivals/${id}`)),
  create: async (festival) => unwrap(await apiClient.post('/v1/festivals', { festival })),
  update: async (id, festival) => unwrap(await apiClient.put(`/v1/festivals/${id}`, { festival })),
  remove: async (id) => unwrap(await apiClient.delete(`/v1/festivals/${id}`)),
}

export default festivalsService
