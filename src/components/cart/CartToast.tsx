import { Check, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { catalog } from '../../data/catalog'
import { useCart } from '../../state/cart-context'

export function CartToast() {
  const { feedback, dismissFeedback } = useCart()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!feedback) return
    const timeout = window.setTimeout(dismissFeedback, 3000)
    return () => window.clearTimeout(timeout)
  }, [feedback, dismissFeedback])

  if (!feedback) return null
  const product = catalog.find((item) => item.id === feedback.productId)
  if (!product) return null
  const variant = product.variants.find((item) => item.id === feedback.variantId)

  return (
    <aside className={`cart-toast${pathname.startsWith('/products/') ? ' cart-toast--above-action' : ''}`} aria-label="Cart update">
      <span className="cart-toast__check"><Check aria-hidden="true" /></span>
      <img src={product.images[0].src} alt="" />
      <div>
        <strong>Added to cart</strong>
        <span>{feedback.quantity > 1 ? `${feedback.quantity} × ` : ''}{product.title}</span>
        {variant && <small>{variant.label}: {variant.value}</small>}
      </div>
      <Link to="/cart" onClick={dismissFeedback}>View cart</Link>
      <button type="button" aria-label="Dismiss cart update" onClick={dismissFeedback}>
        <X aria-hidden="true" />
      </button>
      <span className="sr-only" role="status">{product.title} added to cart</span>
    </aside>
  )
}
