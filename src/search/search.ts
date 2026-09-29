import type { Product } from '../types/catalog'

export type SearchSort = 'relevance' | 'rating' | 'price-asc' | 'price-desc'

export interface SearchFilters {
  category?: string
  brands: string[]
  maxPrice?: number
  minimumRating?: number
  fastDelivery: boolean
  discountOnly: boolean
  sort: SearchSort
}

export interface SearchResult {
  products: Product[]
  total: number
}

export const defaultSearchFilters: SearchFilters = {
  brands: [],
  fastDelivery: false,
  discountOnly: false,
  sort: 'relevance',
}

function searchableText(product: Product) {
  return [
    product.title,
    product.category,
    product.brand,
    product.description,
    ...product.features,
  ].join(' ').toLowerCase()
}

function relevanceScore(product: Product, terms: string[]) {
  const title = product.title.toLowerCase()
  const brand = product.brand.toLowerCase()
  const category = product.category.toLowerCase()

  return terms.reduce((score, term) => {
    if (title.includes(term)) return score + 5
    if (brand.includes(term)) return score + 3
    if (category.includes(term)) return score + 2
    return score + 1
  }, 0) + product.rating / 10
}

export function filterProducts(
  products: Product[],
  query: string,
  filters: SearchFilters,
): SearchResult {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)

  const matches = products.filter((product) => {
    const text = searchableText(product)
    const queryMatches = terms.length === 0 || terms.every((term) => text.includes(term))
    const categoryMatches = !filters.category
      || product.category.toLowerCase() === filters.category.toLowerCase()
    const brandMatches = filters.brands.length === 0 || filters.brands.includes(product.brand)
    const priceMatches = !filters.maxPrice || product.price.amount <= filters.maxPrice
    const ratingMatches = !filters.minimumRating || product.rating >= filters.minimumRating
    const deliveryMatches = !filters.fastDelivery || product.deliveryDays <= 2
    const discountMatches = !filters.discountOnly || Boolean(product.compareAtPrice)

    return queryMatches
      && categoryMatches
      && brandMatches
      && priceMatches
      && ratingMatches
      && deliveryMatches
      && discountMatches
  })

  const sorted = [...matches].sort((left, right) => {
    if (filters.sort === 'price-asc') return left.price.amount - right.price.amount
    if (filters.sort === 'price-desc') return right.price.amount - left.price.amount
    if (filters.sort === 'rating') {
      return right.rating - left.rating || right.reviewCount - left.reviewCount
    }
    return relevanceScore(right, terms) - relevanceScore(left, terms)
  })

  return { products: sorted, total: sorted.length }
}

export function parseSearchFilters(params: URLSearchParams): SearchFilters {
  const sort = params.get('sort')
  const validSort: SearchSort = ['rating', 'price-asc', 'price-desc'].includes(sort ?? '')
    ? sort as SearchSort
    : 'relevance'

  return {
    category: params.get('category') || undefined,
    brands: params.get('brand')?.split(',').filter(Boolean) ?? [],
    maxPrice: Number(params.get('maxPrice')) || undefined,
    minimumRating: Number(params.get('rating')) || undefined,
    fastDelivery: params.get('delivery') === 'fast',
    discountOnly: params.get('discount') === 'true',
    sort: validSort,
  }
}

export function activeFilterCount(filters: SearchFilters) {
  return Number(Boolean(filters.category))
    + filters.brands.length
    + Number(Boolean(filters.maxPrice))
    + Number(Boolean(filters.minimumRating))
    + Number(filters.fastDelivery)
    + Number(filters.discountOnly)
}
