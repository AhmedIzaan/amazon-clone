import { ArrowRight, Check, CheckCircle2, Mail, PackageCheck, ShoppingBag, Truck } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { findOrder } from '../checkout/order'
import { EmptyState } from '../components/ui/EmptyState'

const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const order = findOrder(searchParams.get('order'))

  if (!order) {
    return (
      <div className="checkout-empty container">
        <EmptyState
          icon={<ShoppingBag />}
          title="No demo order found"
          description="This confirmation may have expired or belongs to another browser."
          action={<Link className="button button--primary" to="/">Return home</Link>}
        />
      </div>
    )
  }

  return (
    <div className="confirmation-page container">
      <section className="confirmation-hero">
        <span><CheckCircle2 aria-hidden="true" /></span>
        <p className="eyebrow">Demo order confirmed</p>
        <h1>Thanks, {order.address.fullName.split(' ')[0]}.</h1>
        <p>Your order has been saved in this browser. No payment was charged.</p>
        <div className="confirmation-number"><small>Order number</small><strong>{order.orderNumber}</strong></div>
      </section>

      <div className="confirmation-layout">
        <main>
          <section className="confirmation-card confirmation-delivery">
            <header><Truck aria-hidden="true" /><div><p className="eyebrow">Estimated arrival</p><h2>{order.estimatedDelivery}</h2></div></header>
            <div className="confirmation-timeline" aria-label="Order progress">
              <span className="is-complete"><Check aria-hidden="true" /><small>Confirmed</small></span>
              <i />
              <span><PackageCheck aria-hidden="true" /><small>Preparing</small></span>
              <i />
              <span><Truck aria-hidden="true" /><small>Delivered</small></span>
            </div>
            <p><Mail aria-hidden="true" /> A demo receipt would be sent to <strong>{order.address.email}</strong>.</p>
          </section>

          <section className="confirmation-card confirmation-items" aria-labelledby="confirmed-items-title">
            <h2 id="confirmed-items-title">Items in this order</h2>
            {order.lines.map((line) => (
              <article key={line.key}>
                <img src={line.image} alt={line.imageAlt} />
                <div><p>{line.brand}</p><h3>{line.title}</h3><small>{line.variant}{line.variant && ' · '}Quantity {line.quantity}</small></div>
                <strong>{moneyFormatter.format(line.unitPrice * line.quantity)}</strong>
              </article>
            ))}
          </section>
        </main>

        <aside className="confirmation-card confirmation-summary" aria-label="Confirmed order summary">
          <h2>Order details</h2>
          <div className="confirmation-address"><h3>Delivery address</h3><p>{order.address.fullName}<br />{order.address.address}{order.address.apartment && `, ${order.address.apartment}`}<br />{order.address.city}, {order.address.state} {order.address.postalCode}</p></div>
          <div className="confirmation-address"><h3>Payment</h3><p>{order.payment.method} ending in {order.payment.lastFour}<br /><small>Demo payment—no charge created</small></p></div>
          <dl>
            <div><dt>Subtotal</dt><dd>{moneyFormatter.format(order.totals.subtotal)}</dd></div>
            {order.totals.savings > 0 && <div className="is-savings"><dt>Savings</dt><dd>−{moneyFormatter.format(order.totals.savings)}</dd></div>}
            <div><dt>Shipping</dt><dd>{order.totals.shipping === 0 ? 'FREE' : moneyFormatter.format(order.totals.shipping)}</dd></div>
            <div><dt>Tax</dt><dd>{moneyFormatter.format(order.totals.tax)}</dd></div>
          </dl>
          <div className="confirmation-summary__total"><span>Total</span><strong>{moneyFormatter.format(order.totals.total)}</strong></div>
        </aside>
      </div>

      <div className="confirmation-actions">
        <Link className="button button--primary" to="/">Continue shopping <ArrowRight aria-hidden="true" /></Link>
        <p>Placed {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(order.placedAt))}</p>
      </div>
    </div>
  )
}
