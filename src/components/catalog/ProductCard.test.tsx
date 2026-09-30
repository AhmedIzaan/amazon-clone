import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { catalog } from '../../data/catalog'
import { ProductCard } from './ProductCard'
import { CartProvider } from '../../state/CartContext'
import { ComparisonProvider } from '../../state/ComparisonContext'

describe('ProductCard', () => {
  it('presents the key buying signals accessibly', () => {
    const product = catalog[0]

    render(
      <MemoryRouter>
        <ComparisonProvider><CartProvider>
          <ProductCard product={product} />
        </CartProvider></ComparisonProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: product.title })).toBeInTheDocument()
    expect(screen.getByLabelText(/4.7 out of 5 stars, 824 reviews/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/\$129.00, 19% off/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: `Add ${product.title} to cart` })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: `Add ${product.title} to cart` }))
    expect(screen.getByRole('button', { name: `${product.title} added to cart` })).toBeInTheDocument()
  })
})
