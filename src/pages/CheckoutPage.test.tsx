import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../app/AppRoutes'
import { ORDERS_STORAGE_KEY } from '../checkout/order'
import { CartProvider } from '../state/CartContext'
import { CART_STORAGE_KEY } from '../state/cart-context'

function seedCart() {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: [
    { key: 'audio-001:arc-black', productId: 'audio-001', variantId: 'arc-black', quantity: 1 },
    { key: 'kitchen-001:tumbler-stone', productId: 'kitchen-001', variantId: 'tumbler-stone', quantity: 1 },
  ] }))
}

function renderRoute(route = '/checkout') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <CartProvider><AppRoutes /></CartProvider>
    </MemoryRouter>,
  )
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('validates delivery and demo payment fields', () => {
    seedCart()
    renderRoute()

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } })
    fireEvent.click(screen.getByRole('button', { name: /continue to delivery/i }))
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /delivery address/i })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alex@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /continue to delivery/i }))
    fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }))
    fireEvent.change(screen.getByLabelText('Demo card number'), { target: { value: '1111' } })
    fireEvent.click(screen.getByRole('button', { name: /review order/i }))

    expect(screen.getByText(/use the demo card number shown above/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /demo payment/i })).toBeInTheDocument()
  })

  it('preserves step data, places a local order, and clears the active cart', () => {
    seedCart()
    renderRoute()

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Jordan Lee' } })
    fireEvent.click(screen.getByRole('button', { name: /continue to delivery/i }))
    fireEvent.click(screen.getByLabelText(/express delivery/i))

    const summary = screen.getByRole('complementary', { name: /order summary/i })
    expect(within(summary).getByText('$12.99')).toBeInTheDocument()
    expect(within(summary).getByText('$178.61')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }))
    fireEvent.click(screen.getByRole('button', { name: /^back$/i }))
    expect(screen.getByRole('heading', { name: /delivery method/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }))
    expect(screen.getByLabelText('Demo card number')).toHaveValue('4242 4242 4242 4242')

    fireEvent.click(screen.getByRole('button', { name: /review order/i }))
    expect(screen.getByText('Jordan Lee')).toBeInTheDocument()
    expect(screen.getByText(/express delivery/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /place demo order/i }))

    expect(screen.getByRole('heading', { name: /thanks, jordan/i })).toBeInTheDocument()
    expect(screen.getByText(/^AST-\d{4}-[A-Z0-9]{8}$/)).toBeInTheDocument()
    expect(screen.getByText(/demo visa ending in 4242/i)).toBeInTheDocument()

    const orders = window.localStorage.getItem(ORDERS_STORAGE_KEY) ?? ''
    expect(orders).toContain('Jordan Lee')
    expect(orders).toContain('"lastFour":"4242"')
    expect(orders).not.toContain('cardNumber')
    expect(orders).not.toContain('securityCode')
    expect(window.localStorage.getItem(CART_STORAGE_KEY)).toBe('{"items":[]}')
    expect(window.sessionStorage.getItem('aster-checkout-draft-v1')).toBeNull()

    fireEvent.click(screen.getByRole('link', { name: /continue shopping/i }))
    expect(screen.getByRole('link', { name: /cart with 0 items/i })).toBeInTheDocument()
  })

  it('keeps the checkout draft across a remount', () => {
    seedCart()
    const firstRender = renderRoute()
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Casey Demo' } })
    fireEvent.click(screen.getByRole('button', { name: /continue to delivery/i }))
    firstRender.unmount()

    renderRoute()
    expect(screen.getByRole('heading', { name: /delivery method/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /delivery address/i }))
    expect(screen.getByLabelText('Full name')).toHaveValue('Casey Demo')
  })
})
