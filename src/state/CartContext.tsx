import {
  type ReactNode,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { catalog } from '../data/catalog'
import {
  CartContext,
  CART_STORAGE_KEY,
  type CartContextValue,
  type CartFeedback,
  type CartItem,
} from './cart-context'

const LEGACY_STORAGE_KEY = 'aster-cart-v1'

interface CartState {
  items: CartItem[]
  feedback: CartFeedback | null
  feedbackSequence: number
}

type CartAction =
  | { type: 'add'; productId: string; variantId?: string; quantity: number }
  | { type: 'update'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'dismiss-feedback' }

function cartItemKey(productId: string, variantId?: string) {
  return `${productId}:${variantId ?? 'default'}`
}

function normalizeQuantity(quantity: number, maximum = 99) {
  if (!Number.isFinite(quantity)) return 1
  return Math.max(1, Math.min(maximum, Math.round(quantity)))
}

function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === 'add') {
    const quantity = normalizeQuantity(action.quantity)
    const key = cartItemKey(action.productId, action.variantId)
    const existing = state.items.find((item) => item.key === key)
    const feedbackSequence = state.feedbackSequence + 1
    const items = existing
      ? state.items.map((item) => item.key === key
        ? { ...item, quantity: normalizeQuantity(item.quantity + quantity) }
        : item)
      : [...state.items, { key, productId: action.productId, variantId: action.variantId, quantity }]

    return {
      items,
      feedbackSequence,
      feedback: {
        sequence: feedbackSequence,
        productId: action.productId,
        variantId: action.variantId,
        quantity,
      },
    }
  }

  if (action.type === 'update') {
    if (action.quantity <= 0) {
      return { ...state, items: state.items.filter((item) => item.key !== action.key) }
    }
    return {
      ...state,
      items: state.items.map((item) => item.key === action.key
        ? { ...item, quantity: normalizeQuantity(action.quantity) }
        : item),
    }
  }

  if (action.type === 'remove') {
    return { ...state, items: state.items.filter((item) => item.key !== action.key) }
  }

  if (action.type === 'clear') {
    return { ...state, items: [] }
  }

  if (action.type === 'dismiss-feedback') {
    return { ...state, feedback: null }
  }

  return state
}

function isValidItem(item: unknown): item is CartItem {
  if (!item || typeof item !== 'object') return false
  const candidate = item as Partial<CartItem>
  const product = catalog.find((entry) => entry.id === candidate.productId)
  const variantIsAvailable = !candidate.variantId
    || product?.variants.some((variant) => variant.id === candidate.variantId && variant.inStock)

  return Boolean(
    product
    && product.inStock
    && variantIsAvailable
    && typeof candidate.key === 'string'
    && typeof candidate.quantity === 'number'
    && Number.isFinite(candidate.quantity)
    && candidate.quantity > 0,
  )
}

function readStoredCart(): CartState {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as { items?: unknown[] }
      const restoredItems = Array.isArray(parsed.items) ? parsed.items.filter(isValidItem) : []
      const itemMap = new Map<string, CartItem>()
      restoredItems.forEach((item) => {
        const key = cartItemKey(item.productId, item.variantId)
        const existing = itemMap.get(key)
        itemMap.set(key, {
          key,
          productId: item.productId,
          variantId: item.variantId,
          quantity: normalizeQuantity((existing?.quantity ?? 0) + item.quantity),
        })
      })
      const items = [...itemMap.values()]
      return { items, feedback: null, feedbackSequence: 0 }
    }

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      const quantities = (JSON.parse(legacy) as { quantities?: Record<string, number> }).quantities ?? {}
      const items = Object.entries(quantities).flatMap(([productId, quantity]) => {
        const product = catalog.find((entry) => entry.id === productId)
        if (!product || !Number.isFinite(quantity) || quantity <= 0) return []
        const variantId = product.variants.find((variant) => variant.inStock)?.id
        return [{ key: cartItemKey(productId, variantId), productId, variantId, quantity: normalizeQuantity(quantity) }]
      })
      return { items, feedback: null, feedbackSequence: 0 }
    }
  } catch {
    // A malformed cart should never prevent the storefront from rendering.
  }

  return { items: [], feedback: null, feedbackSequence: 0 }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, readStoredCart)

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: state.items }))
  }, [state.items])

  const value = useMemo<CartContextValue>(() => ({
    items: state.items,
    itemCount: state.items.reduce((total, item) => total + item.quantity, 0),
    feedback: state.feedback,
    addItem: (productId, quantity = 1, variantId) => dispatch({ type: 'add', productId, variantId, quantity }),
    updateQuantity: (key, quantity) => dispatch({ type: 'update', key, quantity }),
    removeItem: (key) => dispatch({ type: 'remove', key }),
    clearCart: () => dispatch({ type: 'clear' }),
    dismissFeedback: () => dispatch({ type: 'dismiss-feedback' }),
  }), [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
