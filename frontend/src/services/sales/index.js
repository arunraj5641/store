import apiClient from '../api/client'

const unwrap = (response) => response.data

export const salesService = {
  list: async (params) => unwrap(await apiClient.get('/v1/sales_histories', { params })),
  getById: async (id) => unwrap(await apiClient.get(`/v1/sales_histories/${id}`)),
  create: async (salesHistory) => unwrap(await apiClient.post('/v1/sales_histories', { sales_history: salesHistory })),
  update: async (id, salesHistory) => unwrap(await apiClient.put(`/v1/sales_histories/${id}`, { sales_history: salesHistory })),
  remove: async (id) => unwrap(await apiClient.delete(`/v1/sales_histories/${id}`)),
}

export default salesService
