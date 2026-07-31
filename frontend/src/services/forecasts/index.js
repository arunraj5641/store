import apiClient from '../api/client'

const unwrap = (response) => response.data

export const forecastsService = {
  list: async (params) => unwrap(await apiClient.get('/v1/forecasts', { params })),
  getById: async (id) => unwrap(await apiClient.get(`/v1/forecasts/${id}`)),
  create: async (forecast) => unwrap(await apiClient.post('/v1/forecasts', { forecast })),
  update: async (id, forecast) => unwrap(await apiClient.put(`/v1/forecasts/${id}`, { forecast })),
  remove: async (id) => unwrap(await apiClient.delete(`/v1/forecasts/${id}`)),
}

export default forecastsService
