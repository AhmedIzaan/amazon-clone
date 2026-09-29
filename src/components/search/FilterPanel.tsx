import type { SearchFilters } from '../../search/search'

interface FilterPanelProps {
  filters: SearchFilters
  prefix: string
  categories: string[]
  brands: string[]
  onChange: (name: string, value?: string) => void
  onToggleBrand: (brand: string) => void
}

export function FilterPanel({
  filters,
  prefix,
  categories,
  brands,
  onChange,
  onToggleBrand,
}: FilterPanelProps) {
  return (
    <div className="filter-panel">
      <fieldset>
        <legend>Category</legend>
        <label className="filter-option">
          <input
            type="radio"
            name={`${prefix}-category`}
            checked={!filters.category}
            onChange={() => onChange('category')}
          />
          <span>All categories</span>
        </label>
        {categories.map((category) => (
          <label className="filter-option" key={category}>
            <input
              type="radio"
              name={`${prefix}-category`}
              checked={filters.category === category.toLowerCase()}
              onChange={() => onChange('category', category.toLowerCase())}
            />
            <span>{category}</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Brand</legend>
        {brands.map((brand) => (
          <label className="filter-option" key={brand}>
            <input
              type="checkbox"
              checked={filters.brands.includes(brand)}
              onChange={() => onToggleBrand(brand)}
            />
            <span>{brand}</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Price</legend>
        {[50, 75, 100, 150].map((price) => (
          <label className="filter-option" key={price}>
            <input
              type="radio"
              name={`${prefix}-price`}
              checked={filters.maxPrice === price}
              onChange={() => onChange('maxPrice', String(price))}
            />
            <span>Under ${price}</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Customer rating</legend>
        {[4.5, 4].map((rating) => (
          <label className="filter-option" key={rating}>
            <input
              type="radio"
              name={`${prefix}-rating`}
              checked={filters.minimumRating === rating}
              onChange={() => onChange('rating', String(rating))}
            />
            <span>{rating}+ stars</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Availability & savings</legend>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.fastDelivery}
            onChange={() => onChange('delivery', filters.fastDelivery ? undefined : 'fast')}
          />
          <span>Delivery in 2 days</span>
        </label>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.discountOnly}
            onChange={() => onChange('discount', filters.discountOnly ? undefined : 'true')}
          />
          <span>On sale</span>
        </label>
      </fieldset>
    </div>
  )
}
