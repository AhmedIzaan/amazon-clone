import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../app/AppRoutes'
import { CartProvider } from '../state/CartContext'

function renderProduct(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/products/${slug}`]}>
      <CartProvider><AppRoutes /></CartProvider>
    </MemoryRouter>,
  )
}

describe('ProductPage', () => {
  beforeEach(() => window.localStorage.clear())

  it('supports gallery selection, variants, quantity, and cart confirmation', () => {
    renderProduct('arc-wireless-headphones')

    expect(screen.getByRole('heading', { name: /arc wireless noise-cancelling headphones/i })).toBeInTheDocument()
    const detailView = screen.getByRole('button', { name: /show material detail/i })
    fireEvent.click(detailView)
    expect(detailView).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Sand' }))
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(screen.getByText(/3 items in sand added to cart/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /cart with 3 items/i })).toBeInTheDocument()
  })

  it('disables purchasing for an unavailable variant', () => {
    renderProduct('trail-daypack')

    fireEvent.click(screen.getByRole('button', { name: /navy unavailable/i }))

    expect(screen.getByText(/currently unavailable in navy/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled()
    expect(screen.getAllByRole('button', { name: /buy now/i }).every(
      (button) => button.hasAttribute('disabled'),
    )).toBe(true)
  })

  it('shows discount pricing and review trust signals', () => {
    renderProduct('stone-insulated-tumbler')

    expect(screen.getAllByLabelText('$24.00, 25% off').length).toBeGreaterThan(0)
    expect(screen.getByText(/based on 1,284 customer ratings/i)).toBeInTheDocument()
    expect(screen.getByText(/verified purchase/i)).toBeInTheDocument()
  })
})
