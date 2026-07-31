import apiClient from '../api/client'

const unwrap = (response) => response.data

export const recommendationsService = {
  generate: async (forecastId) => unwrap(await apiClient.post('/v1/recommendations/generate', {
    recommendation: { forecast_id: forecastId },
  })),
}

export default recommendationsService
