import { catalog } from '../data/catalog'

export const RECENTLY_VIEWED_STORAGE_KEY = 'aster-recently-viewed-v1'
const MAX_RECENT_PRODUCTS = 4

export function readRecentlyViewedIds() {
  try {
    const stored = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is string => typeof id === 'string' && catalog.some((product) => product.id === id)).slice(0, MAX_RECENT_PRODUCTS)
  } catch {
    return []
  }
}

export function recordRecentlyViewed(productId: string) {
  const next = [productId, ...readRecentlyViewedIds().filter((id) => id !== productId)].slice(0, MAX_RECENT_PRODUCTS)
  window.localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(next))
}

export function getRecentlyViewedProducts() {
  return readRecentlyViewedIds().flatMap((id) => {
    const product = catalog.find((item) => item.id === id)
    return product ? [product] : []
  })
}
