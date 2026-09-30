import {
  ArrowRight,
  Check,
  LockKeyhole,
  PackageCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Rating } from '../components/catalog/Rating'
import { EmptyState } from '../components/ui/EmptyState'
import { catalog } from '../data/catalog'
import { useCart } from '../state/cart-context'

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function formatDeliveryDate(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function CartPage() {
  const { items, itemCount, updateQuantity, removeItem, clearCart } = useCart()
  const lines = items.flatMap((item) => {
    const product = catalog.find((entry) => entry.id === item.productId)
    if (!product) return []
    const variant = product.variants.find((entry) => entry.id === item.variantId)
    const price = variant?.price ?? product.price
    return [{ item, product, variant, price }]
  })

  if (lines.length === 0) {
    return (
      <div className="cart-page cart-page--empty container">
        <EmptyState
          icon={<ShoppingBag />}
          title="Your cart is empty"
          description="Browse useful everyday goods and add anything you’d like to compare or buy. Your cart will stay here when you return."
          action={<Link className="button button--primary" to="/">Continue shopping <ArrowRight aria-hidden="true" /></Link>}
        />
      </div>
    )
  }

  const subtotal = lines.reduce((total, line) => total + line.price.amount * line.item.quantity, 0)
  const originalTotal = lines.reduce((total, line) => (
    total + (line.product.compareAtPrice?.amount ?? line.price.amount) * line.item.quantity
  ), 0)
  const savings = Math.max(0, originalTotal - subtotal)
  const freeDeliveryThreshold = 50
  const amountUntilFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal)
  const deliveryDays = Math.max(...lines.map((line) => line.product.deliveryDays))

  return (
    <div className="cart-page container">
      <header className="cart-page__header">
        <div><p className="eyebrow">Ready when you are</p><h1>Your cart</h1><p>{itemCount} {itemCount === 1 ? 'item' : 'items'}</p></div>
        <button type="button" onClick={clearCart}>Remove all</button>
      </header>

      <div className={`delivery-progress${amountUntilFreeDelivery === 0 ? ' is-earned' : ''}`}>
        <span><Truck aria-hidden="true" /></span>
        <div>
          <strong>{amountUntilFreeDelivery === 0 ? 'You unlocked free delivery' : `${moneyFormatter.format(amountUntilFreeDelivery)} away from free delivery`}</strong>
          <p>{amountUntilFreeDelivery === 0 ? `Your order can arrive by ${formatDeliveryDate(deliveryDays)}.` : 'Add another useful find to reach the $50 threshold.'}</p>
          <progress value={Math.min(subtotal, freeDeliveryThreshold)} max={freeDeliveryThreshold} aria-label="Progress toward free delivery" />
        </div>
        {amountUntilFreeDelivery === 0 && <Check aria-hidden="true" />}
      </div>

      <div className="cart-layout">
        <section className="cart-lines" aria-label="Cart items">
          {lines.map(({ item, product, variant, price }) => {
            const lineSavings = product.compareAtPrice
              ? Math.max(0, (product.compareAtPrice.amount - price.amount) * item.quantity)
              : 0
            return (
              <article className="cart-line" key={item.key}>
                <Link className="cart-line__image" to={`/products/${product.slug}`} aria-label={`View ${product.title}`}>
                  <img src={product.images[0].src} alt={product.images[0].alt} width="900" height="900" />
                </Link>
                <div className="cart-line__details">
                  <p className="cart-line__brand">{product.brand}</p>
                  <h2><Link to={`/products/${product.slug}`}>{product.title}</Link></h2>
                  <Rating rating={product.rating} reviewCount={product.reviewCount} />
                  {variant && <p className="cart-line__variant"><span>{variant.label}</span> {variant.value}</p>}
                  <p className="cart-line__stock"><Check aria-hidden="true" /> In stock</p>
                  <p className="cart-line__delivery">Delivery by <strong>{formatDeliveryDate(product.deliveryDays)}</strong></p>
                  <div className="cart-line__actions">
                    <label>
                      <span>Qty</span>
                      <select
                        aria-label={`Quantity for ${product.title}${variant ? `, ${variant.value}` : ''}`}
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.key, Number(event.target.value))}
                      >
                        {Array.from({ length: 10 }, (_, index) => index + 1).map((quantity) => (
                          <option value={quantity} key={quantity}>{quantity}</option>
                        ))}
                      </select>
                    </label>
                    <button type="button" onClick={() => removeItem(item.key)} aria-label={`Remove ${product.title}${variant ? ` in ${variant.value}` : ''}`}>
                      <Trash2 aria-hidden="true" /> Remove
                    </button>
                  </div>
                </div>
                <div className="cart-line__price">
                  <strong>{moneyFormatter.format(price.amount * item.quantity)}</strong>
                  {item.quantity > 1 && <small>{moneyFormatter.format(price.amount)} each</small>}
                  {product.compareAtPrice && <del>{moneyFormatter.format(product.compareAtPrice.amount * item.quantity)}</del>}
                  {lineSavings > 0 && <span>Save {moneyFormatter.format(lineSavings)}</span>}
                </div>
              </article>
            )
          })}
        </section>

        <aside className="cart-summary" aria-labelledby="cart-summary-title">
          <h2 id="cart-summary-title">Order summary</h2>
          <dl>
            <div><dt>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</dt><dd>{moneyFormatter.format(subtotal)}</dd></div>
            {savings > 0 && <div className="cart-summary__savings"><dt>Savings</dt><dd>−{moneyFormatter.format(savings)}</dd></div>}
            <div><dt>Estimated delivery</dt><dd>{amountUntilFreeDelivery === 0 ? 'FREE' : 'At checkout'}</dd></div>
          </dl>
          <div className="cart-summary__total"><span>Estimated total</span><strong>{moneyFormatter.format(subtotal)}</strong></div>
          <p>Taxes calculated during checkout.</p>
          <Link className="button button--primary cart-checkout" to="/checkout">
            Proceed to checkout <ArrowRight aria-hidden="true" />
          </Link>
          <div className="cart-summary__trust">
            <p><LockKeyhole aria-hidden="true" /><span><strong>Secure checkout</strong>Payment details stay protected</span></p>
            <p><PackageCheck aria-hidden="true" /><span><strong>Easy returns</strong>30 days to change your mind</span></p>
          </div>
        </aside>
      </div>
    </div>
  )
}
