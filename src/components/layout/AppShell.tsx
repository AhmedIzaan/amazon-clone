import { LockKeyhole, MapPin, Menu, ShoppingCart, UserRound } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { SearchBox } from '../search/SearchBox'
import { useCart } from '../../state/cart-context'
import { CartToast } from '../cart/CartToast'
import { useAuth } from '../../state/auth-context'
import { ComparisonTray } from '../comparison/ComparisonTray'

const categoryLinks = [
  { label: "Today's finds", to: '/search?discount=true' },
  ...['Home', 'Audio', 'Workspace', 'Outdoors', 'Kitchen'].map((label) => ({
    label,
    to: `/search?category=${label.toLowerCase()}`,
  })),
]

export function AppShell() {
  const { itemCount } = useCart()
  const { user } = useAuth()
  const { pathname } = useLocation()
  const isCheckout = pathname.startsWith('/checkout')

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {isCheckout ? (
        <header className="checkout-site-header">
          <div className="container checkout-site-header__inner">
            <Link className="brand" to="/" aria-label="Aster home">aster<span>.</span></Link>
            <p><LockKeyhole aria-hidden="true" /> Secure demo checkout</p>
            {pathname === '/checkout' ? <Link to="/cart">Return to cart ({itemCount})</Link> : <span />}
          </div>
        </header>
      ) : (
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
          <SearchBox />
          <div className="header-actions">
            <div className="location-button">
              <MapPin aria-hidden="true" />
              <span>
                Deliver to <strong>{user?.address ? `${user.address.city} ${user.address.postalCode}` : 'Demo address'}</strong>
              </span>
            </div>
            <Link className="account-link" to={user ? '/account' : '/sign-in'} aria-label={user ? `Open ${user.fullName}'s account` : 'Sign in to your account'}>
              <UserRound aria-hidden="true" />
              <span>
                {user ? `Hello, ${user.fullName.split(' ')[0]}` : 'Hello, sign in'}
                <strong>{user ? 'Your account' : 'Account'}</strong>
              </span>
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
                key={category.label}
                to={category.to}
              >
                {category.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      )}
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
      {!isCheckout && <CartToast />}
      {!isCheckout && <ComparisonTray />}
    </div>
  )
}
