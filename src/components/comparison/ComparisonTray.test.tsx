import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { catalog } from '../../data/catalog'
import { CartProvider } from '../../state/CartContext'
import { ComparisonProvider } from '../../state/ComparisonContext'
import { COMPARISON_STORAGE_KEY } from '../../state/comparison-context'
import { ProductCard } from '../catalog/ProductCard'
import { ComparisonTray } from './ComparisonTray'

describe('product comparison', () => {
  beforeEach(() => window.localStorage.clear())

  it('builds and persists a focused side-by-side decision view', () => {
    render(
      <MemoryRouter>
        <ComparisonProvider><CartProvider>
          <div>{catalog.slice(0, 2).map((product) => <ProductCard product={product} key={product.id} />)}</div>
          <ComparisonTray />
        </CartProvider></ComparisonProvider>
      </MemoryRouter>,
    )

    screen.getAllByRole('article').forEach((card) => fireEvent.click(within(card).getByRole('button', { name: 'Compare' })))
    expect(window.localStorage.getItem(COMPARISON_STORAGE_KEY)).toContain('audio-001')
    fireEvent.click(screen.getByRole('button', { name: 'Compare 2' }))

    const dialog = screen.getByRole('dialog', { name: 'Compare your shortlist' })
    expect(within(dialog).getByText('Arc Wireless Noise-Cancelling Headphones')).toBeInTheDocument()
    expect(within(dialog).getByText('Halo Dimmable Table Lamp')).toBeInTheDocument()
    expect(within(dialog).getByRole('rowheader', { name: 'Customer rating' })).toBeInTheDocument()
    expect(within(dialog).getByRole('rowheader', { name: 'Delivery' })).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('explains the three-product comparison limit', () => {
    render(
      <MemoryRouter>
        <ComparisonProvider><CartProvider>
          <div>{catalog.slice(0, 4).map((product) => <ProductCard product={product} key={product.id} />)}</div>
          <ComparisonTray />
        </CartProvider></ComparisonProvider>
      </MemoryRouter>,
    )

    const cards = screen.getAllByRole('article')
    cards.slice(0, 3).forEach((card) => fireEvent.click(within(card).getByRole('button', { name: 'Compare' })))
    fireEvent.click(within(cards[3]).getByRole('button', { name: 'Compare' }))
    expect(within(cards[3]).getByText('Remove a product before adding another.')).toBeInTheDocument()
  })
})
