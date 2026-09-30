import { createContext, useContext } from 'react'
import type { Product } from '../types/catalog'

export const COMPARISON_STORAGE_KEY = 'aster-comparison-v1'
export const MAX_COMPARISON_PRODUCTS = 3

export interface ComparisonContextValue {
  products: Product[]
  isSelected: (productId: string) => boolean
  toggleProduct: (productId: string) => 'added' | 'removed' | 'limit'
  removeProduct: (productId: string) => void
  clearComparison: () => void
}

export const ComparisonContext = createContext<ComparisonContextValue | null>(null)

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (!context) throw new Error('useComparison must be used within ComparisonProvider')
  return context
}
