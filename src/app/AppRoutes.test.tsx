import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './AppRoutes'
import { CartProvider } from '../state/CartContext'
import { AuthProvider } from '../state/AuthContext'
import { ComparisonProvider } from '../state/ComparisonContext'

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <ComparisonProvider><CartProvider>
          <AppRoutes />
        </CartProvider></ComparisonProvider>
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

  it('offers a working escape from a no-results query', () => {
    renderRoute('/search?q=definitely-not-a-product')

    fireEvent.click(screen.getByRole('button', { name: /browse all products/i }))

    expect(screen.getByRole('heading', { name: 'All products' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(6)
  })

  it("routes Today's finds to discounted products", () => {
    renderRoute('/')

    expect(screen.getByRole('link', { name: "Today's finds" })).toHaveAttribute(
      'href',
      '/search?discount=true',
    )
  })

  it('preserves a filter when sorting immediately afterward', () => {
    renderRoute('/search?q=wireless')

    fireEvent.click(screen.getByLabelText('On sale'))
    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'price-desc' } })

    expect(screen.getByLabelText('Active filters')).toHaveTextContent('On sale')
    expect(screen.getByLabelText('Sort by')).toHaveValue('price-desc')
  })
})
