import { catalog } from '../data/catalog'
import type { Product } from '../types/catalog'

export async function listProducts(): Promise<Product[]> {
  return catalog
}

export async function findProductBySlug(slug: string): Promise<Product | undefined> {
  return catalog.find((product) => product.slug === slug)
}

export async function searchProducts(query: string): Promise<Product[]> {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return catalog
  }

  return catalog.filter((product) =>
    [product.title, product.category, product.brand, ...product.features]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  )
}
