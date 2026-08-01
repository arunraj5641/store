import apiClient from '../api/client'

const unwrap = (response) => response.data

export const inventoryService = {
  list: async (params) => unwrap(await apiClient.get('/v1/products', { params })),
  getById: async (id) => unwrap(await apiClient.get(`/v1/products/${id}`)),
  create: async (product) => unwrap(await apiClient.post('/v1/products', { product })),
  update: async (id, product) => unwrap(await apiClient.put(`/v1/products/${id}`, { product })),
  remove: async (id) => unwrap(await apiClient.delete(`/v1/products/${id}`)),
  getForecast: async (id, refresh = false) => {
    const response = unwrap(await apiClient.get(`/v1/products/${id}/forecast`, { params: refresh ? { refresh: true } : undefined }))
    return response.data.forecast
  },
  getReorder: async (id, refresh = false) => {
    const response = unwrap(await apiClient.get(`/v1/products/${id}/reorder`, { params: refresh ? { refresh: true } : undefined }))
    return response.data.reorder
  },
}

export default inventoryService
