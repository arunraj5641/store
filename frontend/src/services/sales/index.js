import apiClient from '../api/client'

const unwrap = (response) => response.data

export const salesService = {
  list: async (params) => unwrap(await apiClient.get('/v1/sales_histories', { params })),
  getById: async (id) => unwrap(await apiClient.get(`/v1/sales_histories/${id}`)),
  create: async (salesHistory) => unwrap(await apiClient.post('/v1/sales_histories', { sales_history: salesHistory })),
  update: async (id, salesHistory) => unwrap(await apiClient.put(`/v1/sales_histories/${id}`, { sales_history: salesHistory })),
  remove: async (id) => unwrap(await apiClient.delete(`/v1/sales_histories/${id}`)),
  importCsv: async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return unwrap(await apiClient.post('/v1/sales_histories/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } }))
  },
}

export default salesService
