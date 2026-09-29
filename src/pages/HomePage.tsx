import { ArrowRight, CheckCircle2, Search, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="foundation-home">
      <section className="foundation-hero container">
        <div>
          <p className="eyebrow">Foundation ready</p>
          <h1>Shopping with less noise and more confidence.</h1>
          <p className="hero-copy">
            Aster is being built around a single complete journey—from discovery to a clear buying decision.
          </p>
          <Link className="primary-link" to="/search?q=headphones">
            Preview route structure <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="foundation-panel" aria-label="MVP priorities">
          <p>Core journey</p>
          <ol>
            <li><Search aria-hidden="true" /> Discover and refine</li>
            <li><CheckCircle2 aria-hidden="true" /> Evaluate with confidence</li>
            <li><ShoppingBag aria-hidden="true" /> Cart and guest checkout</li>
          </ol>
        </div>
      </section>
      <section className="foundation-grid container" aria-labelledby="foundation-title">
        <div>
          <p className="eyebrow">Project foundation</p>
          <h2 id="foundation-title">Ready for focused feature work</h2>
        </div>
        <ul>
          <li>Responsive application shell</li>
          <li>Route structure for the complete funnel</li>
          <li>Typed catalog fixtures and service boundary</li>
          <li>Design tokens, testing, linting, and production build</li>
        </ul>
      </section>
    </div>
  )
}
