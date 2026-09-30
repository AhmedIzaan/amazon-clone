import { createContext, useContext } from 'react'

export const CART_STORAGE_KEY = 'aster-cart-v2'

export interface CartItem {
  key: string
  productId: string
  variantId?: string
  quantity: number
}

export interface CartFeedback {
  sequence: number
  productId: string
  variantId?: string
  quantity: number
}

export interface CartContextValue {
  items: CartItem[]
  itemCount: number
  feedback: CartFeedback | null
  addItem: (productId: string, quantity?: number, variantId?: string) => void
  updateQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clearCart: () => void
  dismissFeedback: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}
