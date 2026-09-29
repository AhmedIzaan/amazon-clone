import type { Product } from '../types/catalog'

export type Suggestion =
  | { id: string; type: 'product'; label: string; detail: string; slug: string }
  | { id: string; type: 'category'; label: string; detail: string; category: string }
  | { id: string; type: 'query'; label: string; detail: string; query: string }

const popularQueries = [
  'wireless headphones',
  'home office essentials',
  'gifts under $50',
  'fast delivery',
]

export function getSuggestions(products: Product[], value: string): Suggestion[] {
  const query = value.trim().toLowerCase()
  if (!query) return []

  const categories = [...new Set(products.map((product) => product.category))]
    .filter((category) => category.toLowerCase().includes(query))
    .slice(0, 2)
    .map<Suggestion>((category) => ({
      id: `category-${category}`,
      type: 'category',
      label: category,
      detail: 'Shop category',
      category: category.toLowerCase(),
    }))

  const matchingProducts = products
    .filter((product) => [
      product.title,
      product.brand,
      product.category,
      ...product.features,
    ].join(' ').toLowerCase().includes(query))
    .slice(0, 4)
    .map<Suggestion>((product) => ({
      id: `product-${product.id}`,
      type: 'product',
      label: product.title,
      detail: `${product.brand} · $${product.price.amount}`,
      slug: product.slug,
    }))

  const querySuggestions = popularQueries
    .filter((item) => item.includes(query) && item !== query)
    .slice(0, 2)
    .map<Suggestion>((item) => ({
      id: `query-${item}`,
      type: 'query',
      label: item,
      detail: 'Search suggestion',
      query: item,
    }))

  return [...categories, ...matchingProducts, ...querySuggestions].slice(0, 7)
}
