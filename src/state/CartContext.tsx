import {
  type ReactNode,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { CartContext, type CartContextValue } from './cart-context'

const STORAGE_KEY = 'aster-cart-v1'

interface CartState {
  quantities: Record<string, number>
}

type CartAction = { type: 'add'; productId: string; quantity: number }

function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === 'add') {
    return {
      quantities: {
        ...state.quantities,
        [action.productId]: (state.quantities[action.productId] ?? 0) + action.quantity,
      },
    }
  }

  return state
}

function readStoredCart(): CartState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) as CartState : { quantities: {} }
  } catch {
    return { quantities: {} }
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, readStoredCart)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<CartContextValue>(() => ({
    itemCount: Object.values(state.quantities).reduce((total, quantity) => total + quantity, 0),
    addItem: (productId, quantity = 1) => dispatch({ type: 'add', productId, quantity }),
  }), [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
