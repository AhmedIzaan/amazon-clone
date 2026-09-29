import { ChevronDown, MapPin, Menu, Search, ShoppingCart, UserRound } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useCart } from '../../state/cart-context'

const categoryLinks = ["Today's finds", 'Home', 'Audio', 'Workspace', 'Outdoors', 'Kitchen']

export function AppShell() {
  const { itemCount } = useCart()

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="utility-bar">
          <div className="container utility-bar__inner">
            <p>Free delivery on orders over $50</p>
            <p>Easy 30-day returns</p>
          </div>
        </div>
        <div className="header-main container">
          <a className="icon-button menu-button" href="#category-navigation" aria-label="Jump to categories">
            <Menu aria-hidden="true" />
          </a>
          <Link className="brand" to="/" aria-label="Aster home">
            aster<span>.</span>
          </Link>
          <form className="global-search" action="/search" role="search">
            <label className="sr-only" htmlFor="search-category">
              Search category
            </label>
            <select id="search-category" name="category" defaultValue="all">
              <option value="all">All</option>
              <option value="home">Home</option>
              <option value="audio">Audio</option>
              <option value="outdoors">Outdoors</option>
            </select>
            <label className="sr-only" htmlFor="site-search">
              Search products
            </label>
            <input id="site-search" name="q" placeholder="Search thoughtful everyday goods" />
            <button type="submit" aria-label="Submit search">
              <Search aria-hidden="true" />
            </button>
          </form>
          <div className="header-actions">
            <div className="location-button">
              <MapPin aria-hidden="true" />
              <span>
                Deliver to <strong>Demo address</strong>
              </span>
            </div>
            <Link className="account-link" to="/sign-in" aria-label="Sign in to your account">
              <UserRound aria-hidden="true" />
              <span>
                Hello, sign in
                <strong>Account</strong>
              </span>
              <ChevronDown aria-hidden="true" />
            </Link>
            <Link
              className="cart-link"
              to="/cart"
              aria-label={`Cart with ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            >
              <ShoppingCart aria-hidden="true" />
              <span>Cart</span>
              <strong>{itemCount}</strong>
            </Link>
          </div>
        </div>
        <nav id="category-navigation" className="category-nav" aria-label="Popular categories">
          <div className="container category-nav-inner">
            {categoryLinks.map((category) => (
              <NavLink
                key={category}
                to={`/search?category=${category.toLowerCase().replaceAll(' ', '-')}`}
              >
                {category}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main id="main-content" className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <Link className="brand brand-footer" to="/">
            aster<span>.</span>
          </Link>
          <p>A focused marketplace prototype. No real purchases are processed.</p>
        </div>
      </footer>
    </div>
  )
}
