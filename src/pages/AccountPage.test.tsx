import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppRoutes } from '../app/AppRoutes'
import { ORDERS_STORAGE_KEY, type DemoOrder } from '../checkout/order'
import { AuthProvider } from '../state/AuthContext'
import { AUTH_STORAGE_KEY } from '../state/auth-context'
import { CartProvider } from '../state/CartContext'
import { ComparisonProvider } from '../state/ComparisonContext'

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider><ComparisonProvider><CartProvider><AppRoutes /></CartProvider></ComparisonProvider></AuthProvider>
    </MemoryRouter>,
  )
}

describe('demo account experience', () => {
  beforeEach(() => window.localStorage.clear())

  it('validates sign in, toggles password visibility, and signs into the seeded account', async () => {
    renderRoute('/sign-in')
    const password = screen.getByLabelText('Password')
    expect(password).toHaveAttribute('type', 'password')
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(password).toHaveAttribute('type', 'text')

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } })
    fireEvent.change(password, { target: { value: 'short' } })
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }))
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'demo@aster.market' } })
    fireEvent.change(password, { target: { value: 'demo1234' } })
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }))
    expect(screen.getByRole('button', { name: 'Signing in…' })).toBeDisabled()
    expect(await screen.findByRole('heading', { name: 'Hello, Alex' })).toBeInTheDocument()
    expect(screen.getByLabelText("Open Alex Morgan's account")).toBeInTheDocument()
  })

  it('creates a local account without persisting the password', async () => {
    renderRoute('/create-account')
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Jamie Rivera' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jamie@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'madeup-password' } })
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'madeup-password' } })
    fireEvent.click(screen.getByRole('button', { name: /create demo account/i }))

    expect(await screen.findByRole('heading', { name: 'Hello, Jamie' })).toBeInTheDocument()
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY) ?? ''
    expect(stored).toContain('jamie@example.com')
    expect(stored).not.toContain('madeup-password')
  })

  it('shows locally placed demo orders in account history', async () => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ profile: { fullName: 'Alex Morgan', email: 'demo@aster.market', phone: '' }, signedIn: true }))
    const order: DemoOrder = {
      orderNumber: 'AST-2026-ACCOUNT',
      placedAt: '2026-09-30T10:00:00.000Z',
      address: { fullName: 'Alex Morgan', email: 'demo@aster.market', phone: '', address: '123 Market Street', apartment: '', city: 'Austin', state: 'TX', postalCode: '78701' },
      deliveryMethod: 'standard',
      estimatedDelivery: 'Friday, October 2',
      payment: { method: 'Demo Visa', lastFour: '4242' },
      lines: [{ key: 'p1:default', productId: 'p1', slug: 'demo-product', title: 'Demo Product', brand: 'Aster', image: '/demo.png', imageAlt: 'Demo product', quantity: 1, unitPrice: 49 }],
      totals: { subtotal: 49, savings: 0, shipping: 5.99, tax: 4.04, total: 59.03 },
    }
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order]))
    renderRoute('/account')

    expect(screen.getByText('AST-2026-ACCOUNT')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Demo Product' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view order/i })).toHaveAttribute('href', '/checkout/success?order=AST-2026-ACCOUNT')
    await waitFor(() => expect(screen.getByText('1 order')).toBeInTheDocument())
  })
})
