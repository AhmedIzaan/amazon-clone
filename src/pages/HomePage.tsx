import {
  ArrowRight,
  BriefcaseBusiness,
  CookingPot,
  Headphones,
  Home,
  Laptop,
  Leaf,
  ShieldCheck,
  Sparkles,
  Truck,
  Undo2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ProductCard } from '../components/catalog/ProductCard'
import { Badge } from '../components/ui/Badge'
import { catalog } from '../data/catalog'
import { getRecentlyViewedProducts } from '../state/recently-viewed'

const categories = [
  { label: 'Home', detail: '124 useful finds', icon: Home, slug: 'home' },
  { label: 'Audio', detail: 'Clearer everyday sound', icon: Headphones, slug: 'audio' },
  { label: 'Workspace', detail: 'Work a little better', icon: Laptop, slug: 'workspace' },
  { label: 'Kitchen', detail: 'Daily essentials', icon: CookingPot, slug: 'kitchen' },
  { label: 'Outdoors', detail: 'Ready for the weekend', icon: Leaf, slug: 'outdoors' },
  { label: 'Travel', detail: 'Pack smarter', icon: BriefcaseBusiness, slug: 'travel' },
]

const recommended = [catalog[0], catalog[4], catalog[1], catalog[2]]
const deals = [catalog[3], catalog[5]]

export function HomePage() {
  const [recentlyViewed] = useState(getRecentlyViewedProducts)
  return (
    <div className="home-page">
      <section className="home-hero container" aria-labelledby="hero-title">
        <img
          className="home-hero__image"
          src="/images/products/homepage-hero.webp"
          alt=""
          width="1600"
          height="800"
          fetchPriority="high"
        />
        <div className="home-hero__shade" />
        <div className="home-hero__content">
          <Badge tone="accent">The everyday edit</Badge>
          <h1 id="hero-title">Better basics for the way you live now.</h1>
          <p>Highly rated home, work, and travel essentials—chosen to make the everyday easier.</p>
          <div className="home-hero__actions">
            <Link className="button button--primary" to="/search?collection=everyday">
              Shop the edit <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="hero-secondary-link" to="/search?sort=rating">
              Explore top-rated
            </Link>
          </div>
        </div>
      </section>

      <section className="trust-strip container" aria-label="Shopping benefits">
        <p><Truck aria-hidden="true" /><span><strong>Fast, free delivery</strong> on orders over $50</span></p>
        <p><Undo2 aria-hidden="true" /><span><strong>Easy returns</strong> within 30 days</span></p>
        <p><ShieldCheck aria-hidden="true" /><span><strong>Curated quality</strong> from trusted makers</span></p>
      </section>

      <section className="home-section container" aria-labelledby="categories-title">
        <header className="section-heading">
          <div>
            <p className="eyebrow">Start somewhere useful</p>
            <h2 id="categories-title">Shop by category</h2>
          </div>
        </header>
        <nav className="category-grid" aria-label="Shop departments">
          {categories.map(({ label, detail, icon: Icon, slug }) => (
            <Link className="category-card" to={`/search?category=${slug}`} key={slug}>
              <span className="category-card__icon"><Icon aria-hidden="true" /></span>
              <span><strong>{label}</strong><small>{detail}</small></span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>

      <section className="home-section home-section--surface" aria-labelledby="recommended-title">
        <div className="container">
          <header className="section-heading">
            <div>
              <p className="eyebrow"><Sparkles aria-hidden="true" /> Picked for your routine</p>
              <h2 id="recommended-title">Recommended for you</h2>
              <p className="section-heading__description">Popular choices across the categories you browse most.</p>
            </div>
            <Link className="text-link" to="/search?collection=recommended">
              See all recommendations <ArrowRight aria-hidden="true" />
            </Link>
          </header>
          <div className="product-grid product-grid--four">
            {recommended.map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
        </div>
      </section>

      <section className="home-section container" aria-labelledby="deals-title">
        <header className="section-heading">
          <div>
            <p className="eyebrow">Limited-time prices</p>
            <h2 id="deals-title">Deals worth seeing</h2>
            <p className="section-heading__description">Meaningful savings on well-rated essentials, not a wall of coupons.</p>
          </div>
          <Link className="text-link" to="/search?deals=true">
            Shop all deals <ArrowRight aria-hidden="true" />
          </Link>
        </header>
        <div className="deal-grid">
          {deals.map((product) => <ProductCard product={product} compact key={product.id} />)}
        </div>
      </section>

      <section className="discovery-banner container" aria-labelledby="discovery-title">
        <div>
          <p className="eyebrow">Not sure where to start?</p>
          <h2 id="discovery-title">Tell us what matters. We'll narrow the shelf.</h2>
          <p>Shop by use, budget, and the features you actually care about.</p>
        </div>
        <Link className="button button--secondary" to="/search">
          Find your next favorite <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="home-section home-section--recent container" aria-labelledby="recently-viewed-title">
          <header className="section-heading"><div><p className="eyebrow">Pick up where you left off</p><h2 id="recently-viewed-title">Recently viewed</h2><p className="section-heading__description">Your latest product views, stored only in this browser.</p></div></header>
          <div className="product-grid product-grid--four">{recentlyViewed.map((product) => <ProductCard product={product} compact key={product.id} />)}</div>
        </section>
      )}
    </div>
  )
}
