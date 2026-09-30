import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { catalog } from '../data/catalog'
import {
  COMPARISON_STORAGE_KEY,
  ComparisonContext,
  MAX_COMPARISON_PRODUCTS,
  type ComparisonContextValue,
} from './comparison-context'

function readComparison() {
  try {
    const stored = window.localStorage.getItem(COMPARISON_STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((id): id is string => typeof id === 'string' && catalog.some((product) => product.id === id))
      .slice(0, MAX_COMPARISON_PRODUCTS)
  } catch {
    return []
  }
}

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>(readComparison)

  useEffect(() => {
    window.localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(productIds))
  }, [productIds])

  const value = useMemo<ComparisonContextValue>(() => ({
    products: productIds.flatMap((id) => {
      const product = catalog.find((item) => item.id === id)
      return product ? [product] : []
    }),
    isSelected: (productId) => productIds.includes(productId),
    toggleProduct(productId) {
      if (productIds.includes(productId)) {
        setProductIds((current) => current.filter((id) => id !== productId))
        return 'removed'
      }
      if (productIds.length >= MAX_COMPARISON_PRODUCTS) return 'limit'
      setProductIds((current) => [...current, productId])
      return 'added'
    },
    removeProduct: (productId) => setProductIds((current) => current.filter((id) => id !== productId)),
    clearComparison: () => setProductIds([]),
  }), [productIds])

  return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>
}
