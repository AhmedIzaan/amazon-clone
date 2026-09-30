import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './AppRoutes'
import { CartProvider } from '../state/CartContext'
import { AuthProvider } from '../state/AuthContext'

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('application foundation', () => {
  it('renders the discovery route', () => {
    renderRoute('/')

    expect(
      screen.getByRole('heading', { name: /better basics for the way you live now/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getAllByRole('article').length).toBeGreaterThanOrEqual(6)
  })

  it('renders the empty cart experience', () => {
    renderRoute('/cart')

    expect(screen.getByRole('heading', { name: /your cart is empty/i })).toBeInTheDocument()
  })
})
