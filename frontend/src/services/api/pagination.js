const DEFAULT_PER_PAGE = 100
const MAX_PAGES = 1000

export const fetchAllPages = async (list, collectionKey, params = {}) => {
  const perPage = params.per_page || DEFAULT_PER_PAGE
  const items = []
  let page = 1
  let totalPages = 1

  do {
    const response = await list({ ...params, page, per_page: perPage })
    items.push(...(response.data?.[collectionKey] || []))
    totalPages = response.meta?.total_pages || 0
    page += 1
  } while (page <= totalPages && page <= MAX_PAGES)

  return items
}
