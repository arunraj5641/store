const DEFAULT_MESSAGE = 'Something went wrong. Please try again.'

const humanizeField = (field) => (
  String(field)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
)

const sentenceFor = (message) => {
  const text = String(message || '').trim()
  if (!text) return ''
  return /[.!?]$/.test(text) ? text : `${text}.`
}

const flattenErrorMessages = (errors) => {
  if (!errors) return []

  if (Array.isArray(errors)) {
    return errors.flatMap((error) => {
      if (typeof error === 'string') return [sentenceFor(error)]
      if (error?.message) return [sentenceFor(error.message)]
      return []
    }).filter(Boolean)
  }

  if (typeof errors === 'object') {
    return Object.entries(errors).flatMap(([field, messages]) => {
      const label = humanizeField(field)
      const list = Array.isArray(messages) ? messages : [messages]
      return list.map((message) => sentenceFor(`${label} ${message}`)).filter(Boolean)
    })
  }

  return []
}

export const getFriendlyErrorMessage = (error, fallback = DEFAULT_MESSAGE, options = {}) => {
  const status = error?.response?.status
  const validationMessages = flattenErrorMessages(error?.response?.data?.errors)

  if (!error?.response) {
    return 'We could not reach the server. Check your connection and try again.'
  }

  if (status === 400) {
    return options.badRequestMessage || fallback
  }

  if (status === 401) {
    return options.unauthorizedMessage || 'Your session has expired. Please sign in again.'
  }

  if (status === 403) {
    return 'You do not have permission to perform this action.'
  }

  if (status === 404) {
    return 'We could not find that record. Refresh the page and try again.'
  }

  if (status === 409) {
    return 'This record conflicts with something already saved. Please review and try again.'
  }

  if (status === 422) {
    if (validationMessages.length) {
      return `Please check: ${validationMessages.slice(0, 3).join(' ')}`
    }
    return options.validationMessage || 'Some details need attention. Please review the form and try again.'
  }

  if (status === 429) {
    return 'Too many requests were sent at once. Please wait a moment and try again.'
  }

  if ([502, 503, 504].includes(status)) {
    return options.serviceMessage || 'The service is taking longer than expected. Please try again shortly.'
  }

  if (status >= 500) {
    return 'The server is having trouble right now. Please try again shortly.'
  }

  return fallback
}

const csvRowMessages = {
  'Invalid CSV row': 'This row is not formatted as valid CSV.',
  'Product name is required': 'Add a product name.',
  'Product not found': 'No matching product was found for this product name.',
  'Sale date is required': 'Add a sale date.',
  'Invalid date': 'Use YYYY-MM-DD for the sale date.',
  'Quantity sold is required': 'Add the quantity sold.',
  'Invalid quantity': 'Use a positive whole number for quantity sold.',
}

const friendlyCsvRowMessage = (message) => {
  const parts = String(message || '').split(',').map((part) => part.trim()).filter(Boolean)
  if (!parts.length) return 'Review this row and try again.'

  return parts.map((part) => {
    if (part.startsWith('Missing required columns:')) {
      return part.replace('Missing required columns:', 'The file is missing these columns:')
    }
    return csvRowMessages[part] || 'Review this row and try again.'
  }).join(' ')
}

export const getFriendlyCsvRowErrors = (errors = []) => (
  Array.isArray(errors)
    ? errors.map((error) => ({
      ...error,
      message: friendlyCsvRowMessage(error?.message),
    }))
    : []
)
