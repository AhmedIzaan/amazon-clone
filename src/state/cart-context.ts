import { createContext, useContext } from 'react'

export interface CartContextValue {
  itemCount: number
  addItem: (productId: string) => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}
