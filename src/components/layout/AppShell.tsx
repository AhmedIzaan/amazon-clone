import { MapPin, Menu, Search, ShoppingBag } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const categoryLinks = ['New', 'Home', 'Audio', 'Workspace', 'Outdoors']

export function AppShell() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-main container">
          <button className="icon-button menu-button" type="button" aria-label="Open categories">
            <Menu aria-hidden="true" />
          </button>
          <Link className="brand" to="/" aria-label="Aster home">
            aster<span>.</span>
          </Link>
          <form className="global-search" action="/search" role="search">
            <label className="sr-only" htmlFor="site-search">
              Search products
            </label>
            <input id="site-search" name="q" placeholder="Search thoughtful everyday goods" />
            <button type="submit" aria-label="Submit search">
              <Search aria-hidden="true" />
            </button>
          </form>
          <div className="header-actions">
            <button className="location-button" type="button">
              <MapPin aria-hidden="true" />
              <span>
                Deliver to <strong>Demo address</strong>
              </span>
            </button>
            <Link className="account-link" to="/sign-in">
              Sign in
            </Link>
            <Link className="cart-link" to="/cart" aria-label="Cart with 0 items">
              <ShoppingBag aria-hidden="true" />
              <span>Cart</span>
              <strong>0</strong>
            </Link>
          </div>
        </div>
        <nav className="category-nav" aria-label="Popular categories">
          <div className="container category-nav-inner">
            {categoryLinks.map((category) => (
              <NavLink key={category} to={`/search?category=${category.toLowerCase()}`}>
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
