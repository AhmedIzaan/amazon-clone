import { ArrowRight, BadgeCheck, Headphones, Home, Laptop, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { Button } from '../components/ui/Button'
import { catalog } from '../data/catalog'

const categories = [
  { label: 'Home refresh', detail: 'Simple upgrades', icon: Home, slug: 'home' },
  { label: 'Better sound', detail: 'Audio essentials', icon: Headphones, slug: 'audio' },
  { label: 'Work smarter', detail: 'Desk and tech', icon: Laptop, slug: 'workspace' },
  { label: 'Get outside', detail: 'Weekend ready', icon: Leaf, slug: 'outdoors' },
]

export function HomePage() {
  return (
    <div className="storefront">
      <section className="storefront-intro container" aria-labelledby="intro-title">
        <div>
          <p className="eyebrow">Curated for everyday life</p>
          <h1 id="intro-title">Useful things, easier to choose.</h1>
          <p>Well-reviewed essentials with the details that matter up front.</p>
        </div>
        <Link className="text-link" to="/search">
          Shop all products <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <nav className="category-grid container" aria-label="Shop featured categories">
        {categories.map(({ label, detail, icon: Icon, slug }) => (
          <Link className="category-card" to={`/search?category=${slug}`} key={slug}>
            <span className="category-card__icon"><Icon aria-hidden="true" /></span>
            <span><strong>{label}</strong><small>{detail}</small></span>
            <ArrowRight aria-hidden="true" />
          </Link>
        ))}
      </nav>

      <section className="product-section container" aria-labelledby="featured-title">
        <header className="section-heading">
          <div>
            <p className="eyebrow">Popular right now</p>
            <h2 id="featured-title">Customer favorites</h2>
          </div>
          <Link className="text-link" to="/search?sort=rating">
            See more <ArrowRight aria-hidden="true" />
          </Link>
        </header>
        <div className="product-grid">
          {catalog.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      </section>

      <section className="finder container" aria-labelledby="finder-title">
        <div className="finder__copy">
          <BadgeCheck aria-hidden="true" />
          <div>
            <h2 id="finder-title">Find the right pick faster</h2>
            <p>Start with what matters, then narrow the details.</p>
          </div>
        </div>
        <form className="finder__form" action="/search">
          <div className="field">
            <label htmlFor="finder-category">I'm shopping for</label>
            <select id="finder-category" name="category" defaultValue="audio">
              <option value="audio">Headphones & audio</option>
              <option value="home">Home essentials</option>
              <option value="outdoors">Outdoor gear</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="finder-budget">My budget is</label>
            <select id="finder-budget" name="price" defaultValue="150">
              <option value="50">Under $50</option>
              <option value="100">Under $100</option>
              <option value="150">Under $150</option>
            </select>
          </div>
          <Button type="submit">Show my picks <ArrowRight aria-hidden="true" /></Button>
        </form>
      </section>
    </div>
  )
}
