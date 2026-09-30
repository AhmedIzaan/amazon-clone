import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../app/AppRoutes'
import { CartProvider } from '../state/CartContext'
import { AuthProvider } from '../state/AuthContext'
import { CART_STORAGE_KEY } from '../state/cart-context'

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider><CartProvider><AppRoutes /></CartProvider></AuthProvider>
    </MemoryRouter>,
  )
}

describe('CartPage', () => {
  beforeEach(() => window.localStorage.clear())

  it('merges repeat additions, keeps variants separate, updates quantities, and empties the cart', () => {
    renderRoute('/products/arc-wireless-headphones')

    const addButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(screen.getByRole('button', { name: 'Sand' }))
    fireEvent.click(addButton)

    expect(screen.getByRole('link', { name: /cart with 3 items/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: /cart with 3 items/i }))

    const cartItems = screen.getByRole('region', { name: /cart items/i })
    expect(within(cartItems).getAllByRole('article')).toHaveLength(2)
    expect(screen.getByLabelText(/quantity for arc wireless noise-cancelling headphones, graphite/i)).toHaveValue('2')
    expect(screen.getByLabelText(/quantity for arc wireless noise-cancelling headphones, sand/i)).toHaveValue('1')

    const summary = screen.getByRole('complementary', { name: /order summary/i })
    expect(within(summary).getAllByText('$387.00')).toHaveLength(2)
    expect(within(summary).getByText('−$90.00')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/quantity for arc wireless noise-cancelling headphones, sand/i), { target: { value: '3' } })
    expect(screen.getByRole('link', { name: /cart with 5 items/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /remove arc wireless noise-cancelling headphones in graphite/i }))
    expect(screen.getByRole('link', { name: /cart with 3 items/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /remove arc wireless noise-cancelling headphones in sand/i }))
    expect(screen.getByRole('heading', { name: /your cart is empty/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /cart with 0 items/i })).toBeInTheDocument()
  })

  it('restores a validated cart after the provider remounts', () => {
    const firstRender = renderRoute('/')
    fireEvent.click(screen.getByRole('button', { name: /add arc wireless noise-cancelling headphones to cart/i }))

    expect(window.localStorage.getItem(CART_STORAGE_KEY)).toContain('audio-001')
    firstRender.unmount()
    renderRoute('/cart')

    expect(screen.getByRole('heading', { name: /arc wireless noise-cancelling headphones/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/quantity for arc wireless noise-cancelling headphones, graphite/i)).toHaveValue('1')
    expect(screen.getByRole('link', { name: /cart with 1 item/i })).toBeInTheDocument()
  })

  it('ignores malformed persisted cart data', () => {
    window.localStorage.setItem(CART_STORAGE_KEY, '{not-json')
    renderRoute('/cart')

    expect(screen.getByRole('heading', { name: /your cart is empty/i })).toBeInTheDocument()
  })

  it('consolidates duplicate stored lines and drops unavailable variants', () => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: [
      { key: 'old-1', productId: 'audio-001', variantId: 'arc-black', quantity: 1 },
      { key: 'old-2', productId: 'audio-001', variantId: 'arc-black', quantity: 2 },
      { key: 'old-3', productId: 'outdoors-001', variantId: 'trail-navy', quantity: 4 },
    ] }))
    renderRoute('/cart')

    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByLabelText(/quantity for arc wireless noise-cancelling headphones, graphite/i)).toHaveValue('3')
    expect(screen.getByRole('link', { name: /cart with 3 items/i })).toBeInTheDocument()
  })
})
