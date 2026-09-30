import { SlidersHorizontal, SearchX, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { FilterPanel } from '../components/search/FilterPanel'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { catalog } from '../data/catalog'
import {
  activeFilterCount,
  filterProducts,
  parseSearchFilters,
  type SearchSort,
} from '../search/search'

const categories = [...new Set(catalog.map((product) => product.category))].sort()
const brands = [...new Set(catalog.map((product) => product.brand))].sort()

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const query = searchParams.get('q') ?? ''
  const filters = useMemo(() => parseSearchFilters(searchParams), [searchParams])
  const result = useMemo(() => filterProducts(catalog, query, filters), [query, filters])
  const filterCount = activeFilterCount(filters)

  useEffect(() => {
    if (!isFilterSheetOpen) return
    const previousOverflow = document.body.style.overflow
    const returnFocusTarget = filterButtonRef.current
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFilterSheetOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      returnFocusTarget?.focus()
    }
  }, [isFilterSheetOpen])

  function updateParam(name: string, value?: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(name, value)
    else next.delete(name)
    setSearchParams(next, { replace: true, flushSync: true })
  }

  function toggleBrand(brand: string) {
    const next = new URLSearchParams(searchParams)
    const currentBrands = (next.get('brand') ?? '').split(',').filter(Boolean)
    const nextBrands = currentBrands.includes(brand)
      ? currentBrands.filter((item) => item !== brand)
      : [...currentBrands, brand]
    if (nextBrands.length) next.set('brand', nextBrands.join(','))
    else next.delete('brand')
    setSearchParams(next, { replace: true, flushSync: true })
  }

  function clearFilters() {
    const next = new URLSearchParams()
    if (query) next.set('q', query)
    setSearchParams(next, { replace: true, flushSync: true })
  }

  function browseAllProducts() {
    const next = new URLSearchParams()
    setSearchParams(next, { replace: true, flushSync: true })
  }

  const activeChips = [
    filters.category && {
      label: categories.find((item) => item.toLowerCase() === filters.category) ?? filters.category,
      remove: () => updateParam('category'),
    },
    ...filters.brands.map((brand) => ({ label: brand, remove: () => toggleBrand(brand) })),
    filters.maxPrice && { label: `Under $${filters.maxPrice}`, remove: () => updateParam('maxPrice') },
    filters.minimumRating && {
      label: `${filters.minimumRating}+ stars`,
      remove: () => updateParam('rating'),
    },
    filters.fastDelivery && { label: 'Delivery in 2 days', remove: () => updateParam('delivery') },
    filters.discountOnly && { label: 'On sale', remove: () => updateParam('discount') },
  ].filter(Boolean) as Array<{ label: string; remove: () => void }>

  const filterPanelProps = {
    filters,
    categories,
    brands,
    onChange: updateParam,
    onToggleBrand: toggleBrand,
  }

  return (
    <div className="search-page container">
      <header className="search-page__header">
        <div>
          <p className="eyebrow">{query ? 'Search results' : 'Explore the catalog'}</p>
          <h1>{query ? <>Results for “{query}”</> : 'All products'}</h1>
          <p aria-live="polite">
            {result.total} {result.total === 1 ? 'result' : 'results'}
            {filterCount > 0 ? ` with ${filterCount} ${filterCount === 1 ? 'filter' : 'filters'}` : ''}
          </p>
        </div>
        <div className="search-toolbar">
          <Button
            ref={filterButtonRef}
            className="mobile-filter-button"
            variant="secondary"
            onClick={() => setIsFilterSheetOpen(true)}
          >
            <SlidersHorizontal aria-hidden="true" />
            Filters {filterCount > 0 && <span>{filterCount}</span>}
          </Button>
          <label className="sort-control">
            <span>Sort by</span>
            <select
              value={filters.sort}
              onChange={(event) => updateParam(
                'sort',
                event.target.value === 'relevance' ? undefined : event.target.value as SearchSort,
              )}
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Customer rating</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </header>

      {activeChips.length > 0 && (
        <div className="active-filters" aria-label="Active filters">
          {activeChips.map((chip) => (
            <button type="button" onClick={chip.remove} key={chip.label}>
              {chip.label}<X aria-hidden="true" />
            </button>
          ))}
          <button className="clear-filters" type="button" onClick={clearFilters}>Clear all</button>
        </div>
      )}

      <div className="search-layout">
        <aside className="filter-sidebar" aria-label="Filter results">
          <div className="filter-sidebar__heading">
            <h2>Filters</h2>
            {filterCount > 0 && <button type="button" onClick={clearFilters}>Clear</button>}
          </div>
          <FilterPanel {...filterPanelProps} prefix="desktop" />
        </aside>

        <section className="search-results" aria-label="Search results">
          {result.total > 0 ? (
            <div className="search-results-grid">
              {result.products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<SearchX />}
              title="No products match those choices"
              description="Try removing a filter or searching for a broader product, category, or brand."
              action={filterCount > 0
                ? <Button onClick={clearFilters}>Clear filters</Button>
                : <Button onClick={browseAllProducts}>Browse all products</Button>}
            />
          )}
        </section>
      </div>

      {isFilterSheetOpen && (
        <div className="filter-sheet-backdrop" role="presentation" onMouseDown={() => setIsFilterSheetOpen(false)}>
          <aside
            className="filter-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filters-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div><h2 id="mobile-filters-title">Filters</h2><p>{result.total} matching products</p></div>
              <button ref={closeButtonRef} type="button" aria-label="Close filters" onClick={() => setIsFilterSheetOpen(false)}>
                <X aria-hidden="true" />
              </button>
            </header>
            <div className="filter-sheet__body">
              <FilterPanel {...filterPanelProps} prefix="mobile" />
            </div>
            <footer>
              <button className="button button--quiet" type="button" onClick={clearFilters}>Clear all</button>
              <button className="button button--primary" type="button" onClick={() => setIsFilterSheetOpen(false)}>
                Show {result.total} {result.total === 1 ? 'result' : 'results'}
              </button>
            </footer>
          </aside>
        </div>
      )}
    </div>
  )
}
