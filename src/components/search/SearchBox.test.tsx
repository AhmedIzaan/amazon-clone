import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { SearchBox } from './SearchBox'

function LocationProbe() {
  const location = useLocation()
  return <output aria-label="Current location">{location.pathname}{location.search}</output>
}

describe('SearchBox', () => {
  it('supports keyboard navigation and Enter selection', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SearchBox />
        <Routes>
          <Route path="*" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    )

    const input = screen.getByRole('combobox', { name: 'Search products' })
    fireEvent.change(input, { target: { value: 'audio' } })

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input).toHaveAttribute('aria-activedescendant')
    fireEvent.submit(input.closest('form')!)

    expect(screen.getByLabelText('Current location')).toHaveTextContent('/search?category=audio')
  })

  it('submits an unselected query into the URL', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SearchBox />
        <Routes>
          <Route path="*" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    )

    const input = screen.getByRole('combobox', { name: 'Search products' })
    fireEvent.change(input, { target: { value: 'desk lamp' } })
    fireEvent.submit(input.closest('form')!)

    expect(screen.getByLabelText('Current location')).toHaveTextContent('/search?q=desk+lamp')
  })
})
