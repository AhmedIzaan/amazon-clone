import { Search, Tag } from 'lucide-react'
import { type FormEvent, type KeyboardEvent, useId, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { catalog } from '../../data/catalog'
import { getSuggestions, type Suggestion } from '../../search/suggestions'

const searchCategories = ['all', 'home', 'audio', 'workspace', 'kitchen', 'outdoors']

export function SearchBox() {
  const location = useLocation()
  const routeParams = new URLSearchParams(location.search)
  const initialQuery = routeParams.get('q') ?? ''
  const initialCategory = routeParams.get('category') ?? 'all'

  return (
    <SearchBoxInput
      key={`${initialQuery}:${initialCategory}`}
      initialQuery={initialQuery}
      initialCategory={initialCategory}
    />
  )
}

interface SearchBoxInputProps {
  initialQuery: string
  initialCategory: string
}

function SearchBoxInput({ initialQuery, initialCategory }: SearchBoxInputProps) {
  const navigate = useNavigate()
  const listId = useId()
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const suggestions = useMemo(() => getSuggestions(catalog, query), [query])

  function goToSearch(searchQuery = query) {
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (category !== 'all') params.set('category', category)
    navigate(`/search?${params.toString()}`)
    setIsOpen(false)
    setActiveIndex(-1)
  }

  function selectSuggestion(suggestion: Suggestion) {
    if (suggestion.type === 'product') {
      navigate(`/products/${suggestion.slug}`)
    } else if (suggestion.type === 'category') {
      navigate(`/search?category=${suggestion.category}`)
    } else {
      setQuery(suggestion.query)
      goToSearch(suggestion.query)
    }
    setIsOpen(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectSuggestion(suggestions[activeIndex])
      return
    }
    goToSearch()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex((current) => Math.min(current + 1, suggestions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, -1))
    } else if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  return (
    <form
      className="global-search"
      role="search"
      onSubmit={handleSubmit}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
      }}
    >
      <label className="sr-only" htmlFor="search-category">Search category</label>
      <select
        id="search-category"
        name="category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        {searchCategories.map((item) => (
          <option value={item} key={item}>
            {item === 'all' ? 'All' : item[0].toUpperCase() + item.slice(1)}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor="site-search">Search products</label>
      <input
        id="site-search"
        name="q"
        value={query}
        placeholder="Search products, categories, and brands"
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={isOpen && suggestions.length > 0}
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        autoComplete="off"
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
          setActiveIndex(-1)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" aria-label="Submit search"><Search aria-hidden="true" /></button>
      {isOpen && suggestions.length > 0 && (
        <div className="search-suggestions" id={listId} role="listbox" aria-label="Search suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              id={`${listId}-${index}`}
              className={`search-suggestion${activeIndex === index ? ' is-active' : ''}`}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              key={suggestion.id}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion.type === 'product' ? (
                <img src={catalog.find((product) => product.slug === suggestion.slug)?.images[0].src} alt="" />
              ) : (
                <span className="search-suggestion__icon"><Tag aria-hidden="true" /></span>
              )}
              <span><strong>{suggestion.label}</strong><small>{suggestion.detail}</small></span>
              <span className="search-suggestion__type">{suggestion.type}</span>
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
