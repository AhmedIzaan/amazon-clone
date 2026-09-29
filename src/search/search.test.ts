import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { defaultSearchFilters, filterProducts, parseSearchFilters } from './search'

describe('catalog search', () => {
  it('matches all query terms across product details', () => {
    const result = filterProducts(catalog, 'wireless noise', defaultSearchFilters)

    expect(result.products.map((product) => product.slug)).toEqual([
      'arc-wireless-headphones',
    ])
  })

  it('combines category and discount filters', () => {
    const result = filterProducts(catalog, '', {
      ...defaultSearchFilters,
      category: 'home',
      discountOnly: true,
    })

    expect(result.products.map((product) => product.slug)).toEqual([
      'pine-pocket-vacuum',
    ])
  })

  it('combines price filtering with ascending sorting', () => {
    const result = filterProducts(catalog, '', {
      ...defaultSearchFilters,
      maxPrice: 75,
      sort: 'price-asc',
    })

    expect(result.products.map((product) => product.price.amount)).toEqual([24, 48, 54, 72])
  })

  it('parses shareable URL state and sorts rating ties by review confidence', () => {
    const filters = parseSearchFilters(
      new URLSearchParams('rating=4.7&delivery=fast&discount=true&sort=rating'),
    )
    const result = filterProducts(catalog, '', filters)

    expect(result.products.map((product) => product.slug)).toEqual([
      'arc-wireless-headphones',
      'grove-wireless-keyboard',
    ])
  })
})
