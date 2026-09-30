import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import { type FormEvent, type InputHTMLAttributes, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  calculateCheckoutTotals,
  CHECKOUT_DRAFT_KEY,
  createOrderNumber,
  getEstimatedDelivery,
  resolveOrderLines,
  saveOrder,
  type CheckoutAddress,
  type DeliveryMethod,
  type DemoOrder,
} from '../checkout/order'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { catalog } from '../data/catalog'
import { useCart } from '../state/cart-context'
import { useAuth } from '../state/auth-context'

const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const checkoutSteps = ['Delivery address', 'Delivery method', 'Payment', 'Review order']

const demoAddress: CheckoutAddress = {
  fullName: 'Alex Morgan',
  email: 'alex@example.com',
  phone: '(512) 555-0142',
  address: '123 Market Street',
  apartment: 'Apt 4B',
  city: 'Austin',
  state: 'TX',
  postalCode: '78701',
}

interface PaymentDetails {
  cardholder: string
  cardNumber: string
  expiration: string
  securityCode: string
}

const demoPayment: PaymentDetails = {
  cardholder: 'Alex Morgan',
  cardNumber: '4242 4242 4242 4242',
  expiration: '12/30',
  securityCode: '123',
}

interface CheckoutDraft {
  step: number
  address: CheckoutAddress
  deliveryMethod: DeliveryMethod
}

function readCheckoutDraft(fallbackAddress: CheckoutAddress = demoAddress): CheckoutDraft {
  try {
    const stored = window.sessionStorage.getItem(CHECKOUT_DRAFT_KEY)
    if (!stored) return { step: 0, address: fallbackAddress, deliveryMethod: 'standard' }
    const parsed = JSON.parse(stored) as Partial<CheckoutDraft>
    return {
      step: Math.max(0, Math.min(3, Number(parsed.step) || 0)),
      address: { ...fallbackAddress, ...parsed.address },
      deliveryMethod: parsed.deliveryMethod === 'express' ? 'express' : 'standard',
    }
  } catch {
    return { step: 0, address: fallbackAddress, deliveryMethod: 'standard' }
  }
}

function validateAddress(address: CheckoutAddress) {
  const errors: Partial<Record<keyof CheckoutAddress, string>> = {}
  if (address.fullName.trim().length < 2) errors.fullName = 'Enter the recipient’s full name.'
  if (!/^\S+@\S+\.\S+$/.test(address.email)) errors.email = 'Enter a valid email address.'
  if (address.phone && !/^[\d\s()+-]{10,}$/.test(address.phone)) errors.phone = 'Enter a valid phone number.'
  if (address.address.trim().length < 5) errors.address = 'Enter a complete street address.'
  if (address.city.trim().length < 2) errors.city = 'Enter a city.'
  if (!address.state) errors.state = 'Choose a state.'
  if (!/^\d{5}(-\d{4})?$/.test(address.postalCode)) errors.postalCode = 'Enter a 5-digit ZIP code.'
  return errors
}

function passesLuhn(value: string) {
  let sum = 0
  let doubleDigit = false
  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index])
    if (doubleDigit) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    doubleDigit = !doubleDigit
  }
  return sum % 10 === 0
}

function validatePayment(payment: PaymentDetails) {
  const errors: Partial<Record<keyof PaymentDetails, string>> = {}
  const cardNumber = payment.cardNumber.replace(/\D/g, '')
  if (payment.cardholder.trim().length < 2) errors.cardholder = 'Enter the name shown on the demo card.'
  if (cardNumber.length !== 16 || !passesLuhn(cardNumber)) errors.cardNumber = 'Use the demo card number shown above.'
  const expirationMatch = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(payment.expiration)
  if (!expirationMatch) {
    errors.expiration = 'Use MM/YY format.'
  } else {
    const expiration = new Date(2000 + Number(expirationMatch[2]), Number(expirationMatch[1]))
    if (expiration <= new Date()) errors.expiration = 'Use a future expiration date.'
  }
  if (!/^\d{3}$/.test(payment.securityCode)) errors.securityCode = 'Enter the 3-digit demo code.'
  return errors
}

interface CheckoutFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

function CheckoutField({ label, error, id, ...props }: CheckoutFieldProps) {
  const fieldId = id ?? props.name
  return (
    <div className={`checkout-field${error ? ' checkout-field--error' : ''}`} data-field={fieldId}>
      <label htmlFor={fieldId}>{label}</label>
      <input id={fieldId} aria-invalid={Boolean(error)} aria-describedby={error ? `${fieldId}-error` : undefined} {...props} />
      {error && <small id={`${fieldId}-error`}>{error}</small>}
    </div>
  )
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, itemCount, clearCart } = useCart()
  const { user } = useAuth()
  const [initialDraft] = useState(() => readCheckoutDraft(user?.address ? {
    fullName: user.address.recipient,
    email: user.email,
    phone: user.phone,
    address: user.address.street,
    apartment: user.address.apartment,
    city: user.address.city,
    state: user.address.state,
    postalCode: user.address.postalCode,
  } : demoAddress))
  const [step, setStep] = useState(initialDraft.step)
  const [address, setAddress] = useState(initialDraft.address)
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(initialDraft.deliveryMethod)
  const [payment, setPayment] = useState(demoPayment)
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof CheckoutAddress, string>>>({})
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentDetails, string>>>({})
  const lines = useMemo(() => resolveOrderLines(items), [items])
  const totals = useMemo(() => calculateCheckoutTotals(lines, deliveryMethod), [lines, deliveryMethod])
  const maximumDeliveryDays = Math.max(1, ...lines.map((line) => (
    catalog.find((product) => product.id === line.productId)?.deliveryDays ?? 1
  )))
  const estimatedDelivery = getEstimatedDelivery(deliveryMethod, maximumDeliveryDays)

  useEffect(() => {
    window.sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify({ step, address, deliveryMethod }))
  }, [step, address, deliveryMethod])

  if (lines.length === 0) {
    return (
      <div className="checkout-empty container">
        <EmptyState
          icon={<ShoppingBag />}
          title="Your cart is ready for something"
          description="Add at least one product before starting the demo checkout."
          action={<Link className="button button--primary" to="/">Continue shopping <ArrowRight aria-hidden="true" /></Link>}
        />
      </div>
    )
  }

  function updateAddress(field: keyof CheckoutAddress, value: string) {
    setAddress((current) => ({ ...current, [field]: value }))
    if (addressErrors[field]) setAddressErrors((current) => ({ ...current, [field]: undefined }))
  }

  function updatePayment(field: keyof PaymentDetails, value: string) {
    let nextValue = value
    if (field === 'cardNumber') {
      nextValue = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }
    if (field === 'expiration') {
      const digits = value.replace(/\D/g, '').slice(0, 4)
      nextValue = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
    }
    if (field === 'securityCode') nextValue = value.replace(/\D/g, '').slice(0, 3)
    setPayment((current) => ({ ...current, [field]: nextValue }))
    if (paymentErrors[field]) setPaymentErrors((current) => ({ ...current, [field]: undefined }))
  }

  function submitAddress(event: FormEvent) {
    event.preventDefault()
    const errors = validateAddress(address)
    setAddressErrors(errors)
    if (Object.keys(errors).length === 0) setStep(1)
  }

  function submitPayment(event: FormEvent) {
    event.preventDefault()
    const errors = validatePayment(payment)
    setPaymentErrors(errors)
    if (Object.keys(errors).length === 0) setStep(3)
  }

  function placeOrder() {
    const orderNumber = createOrderNumber()
    const order: DemoOrder = {
      orderNumber,
      placedAt: new Date().toISOString(),
      address,
      deliveryMethod,
      estimatedDelivery,
      payment: { method: 'Demo Visa', lastFour: payment.cardNumber.replace(/\D/g, '').slice(-4) },
      lines,
      totals,
    }
    saveOrder(order)
    window.sessionStorage.removeItem(CHECKOUT_DRAFT_KEY)
    clearCart()
    navigate(`/checkout/success?order=${encodeURIComponent(orderNumber)}`, { replace: true })
  }

  return (
    <div className="checkout-page container">
      <header className="checkout-intro">
        <p className="eyebrow">Demo checkout</p>
        <h1>Complete your order</h1>
        <p>Nothing here creates a real charge. Your demo order stays only in this browser.</p>
      </header>

      <ol className="checkout-steps" aria-label="Checkout progress">
        {checkoutSteps.map((label, index) => (
          <li className={index === step ? 'is-current' : index < step ? 'is-complete' : ''} aria-current={index === step ? 'step' : undefined} key={label}>
            {index < step ? (
              <button type="button" onClick={() => setStep(index)}><Check aria-hidden="true" /><span>{label}</span></button>
            ) : (
              <span><b>{index + 1}</b><span>{label}</span></span>
            )}
          </li>
        ))}
      </ol>

      <div className="checkout-layout">
        <main className="checkout-stage">
          {step === 0 && (
            <form onSubmit={submitAddress} noValidate>
              <div className="checkout-stage__heading"><MapPin aria-hidden="true" /><div><h2>Delivery address</h2><p>Where should this demo order go?</p></div></div>
              <div className="checkout-form-grid">
                <CheckoutField label="Full name" name="fullName" autoComplete="name" value={address.fullName} error={addressErrors.fullName} onChange={(event) => updateAddress('fullName', event.target.value)} />
                <CheckoutField label="Email" name="email" type="email" autoComplete="email" value={address.email} error={addressErrors.email} onChange={(event) => updateAddress('email', event.target.value)} />
                <CheckoutField label="Phone (optional)" name="phone" type="tel" autoComplete="tel" value={address.phone} error={addressErrors.phone} onChange={(event) => updateAddress('phone', event.target.value)} />
                <CheckoutField label="Street address" name="address" autoComplete="street-address" value={address.address} error={addressErrors.address} onChange={(event) => updateAddress('address', event.target.value)} />
                <CheckoutField label="Apartment, suite, etc. (optional)" name="apartment" value={address.apartment} onChange={(event) => updateAddress('apartment', event.target.value)} />
                <CheckoutField label="City" name="city" autoComplete="address-level2" value={address.city} error={addressErrors.city} onChange={(event) => updateAddress('city', event.target.value)} />
                <div className={`checkout-field${addressErrors.state ? ' checkout-field--error' : ''}`} data-field="state">
                  <label htmlFor="state">State</label>
                  <select id="state" value={address.state} aria-invalid={Boolean(addressErrors.state)} aria-describedby={addressErrors.state ? 'state-error' : undefined} onChange={(event) => updateAddress('state', event.target.value)}>
                    <option value="">Choose state</option><option value="CA">California</option><option value="NY">New York</option><option value="TX">Texas</option><option value="WA">Washington</option>
                  </select>
                  {addressErrors.state && <small id="state-error">{addressErrors.state}</small>}
                </div>
                <CheckoutField label="ZIP code" name="postalCode" inputMode="numeric" autoComplete="postal-code" value={address.postalCode} error={addressErrors.postalCode} onChange={(event) => updateAddress('postalCode', event.target.value)} />
              </div>
              <div className="checkout-stage__actions"><Link className="button button--quiet" to="/cart"><ArrowLeft aria-hidden="true" />Back to cart</Link><Button type="submit">Continue to delivery <ArrowRight aria-hidden="true" /></Button></div>
            </form>
          )}

          {step === 1 && (
            <section>
              <div className="checkout-stage__heading"><Truck aria-hidden="true" /><div><h2>Delivery method</h2><p>Choose the speed that works for you.</p></div></div>
              <div className="delivery-options">
                <label className={deliveryMethod === 'standard' ? 'is-selected' : ''}>
                  <input type="radio" name="delivery" value="standard" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} />
                  <span><strong>Standard delivery</strong><small>Arrives {getEstimatedDelivery('standard', maximumDeliveryDays)}</small></span>
                  <b>{totals.subtotal >= 50 ? 'FREE' : '$5.99'}</b>
                </label>
                <label className={deliveryMethod === 'express' ? 'is-selected' : ''}>
                  <input type="radio" name="delivery" value="express" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} />
                  <span><strong>Express delivery</strong><small>Arrives {getEstimatedDelivery('express', maximumDeliveryDays)}</small></span>
                  <b>$12.99</b>
                </label>
              </div>
              <div className="checkout-stage__actions"><Button variant="quiet" onClick={() => setStep(0)}><ArrowLeft aria-hidden="true" />Back</Button><Button onClick={() => setStep(2)}>Continue to payment <ArrowRight aria-hidden="true" /></Button></div>
            </section>
          )}

          {step === 2 && (
            <form onSubmit={submitPayment} noValidate>
              <div className="checkout-stage__heading"><CreditCard aria-hidden="true" /><div><h2>Demo payment</h2><p>Use the sample details below. No payment is processed.</p></div></div>
              <div className="demo-payment-note"><LockKeyhole aria-hidden="true" /><p><strong>Demo card only</strong> Use 4242 4242 4242 4242, 12/30, and 123. Full payment details are never saved or transmitted.</p></div>
              <div className="checkout-form-grid checkout-form-grid--payment">
                <CheckoutField label="Name on card" name="cardholder" autoComplete="cc-name" value={payment.cardholder} error={paymentErrors.cardholder} onChange={(event) => updatePayment('cardholder', event.target.value)} />
                <CheckoutField label="Demo card number" name="cardNumber" inputMode="numeric" autoComplete="cc-number" value={payment.cardNumber} error={paymentErrors.cardNumber} onChange={(event) => updatePayment('cardNumber', event.target.value)} />
                <CheckoutField label="Expiration" name="expiration" inputMode="numeric" autoComplete="cc-exp" value={payment.expiration} error={paymentErrors.expiration} onChange={(event) => updatePayment('expiration', event.target.value)} />
                <CheckoutField label="Security code" name="securityCode" inputMode="numeric" autoComplete="cc-csc" value={payment.securityCode} error={paymentErrors.securityCode} onChange={(event) => updatePayment('securityCode', event.target.value)} />
              </div>
              <div className="checkout-stage__actions"><Button variant="quiet" onClick={() => setStep(1)}><ArrowLeft aria-hidden="true" />Back</Button><Button type="submit">Review order <ArrowRight aria-hidden="true" /></Button></div>
            </form>
          )}

          {step === 3 && (
            <section>
              <div className="checkout-stage__heading"><PackageCheck aria-hidden="true" /><div><h2>Review your order</h2><p>One last check before creating the demo order.</p></div></div>
              <div className="review-panels">
                <article><header><h3>Deliver to</h3><button type="button" onClick={() => setStep(0)}>Edit</button></header><p><strong>{address.fullName}</strong><br />{address.address}{address.apartment && `, ${address.apartment}`}<br />{address.city}, {address.state} {address.postalCode}<br />{address.email}</p></article>
                <article><header><h3>Delivery</h3><button type="button" onClick={() => setStep(1)}>Edit</button></header><p><strong>{deliveryMethod === 'express' ? 'Express' : 'Standard'} delivery</strong><br />Estimated {estimatedDelivery}</p></article>
                <article><header><h3>Payment</h3><button type="button" onClick={() => setStep(2)}>Edit</button></header><p><strong>Demo Visa ending in {payment.cardNumber.replace(/\D/g, '').slice(-4)}</strong><br />No real charge will be made.</p></article>
              </div>
              <div className="place-order-callout"><LockKeyhole aria-hidden="true" /><p>By placing this demo order, you’ll create a local confirmation and clear the active cart. No purchase or payment occurs.</p></div>
              <div className="checkout-stage__actions"><Button variant="quiet" onClick={() => setStep(2)}><ArrowLeft aria-hidden="true" />Back</Button><Button onClick={placeOrder}>Place demo order · {moneyFormatter.format(totals.total)}</Button></div>
            </section>
          )}
        </main>

        <aside className="checkout-summary" aria-labelledby="checkout-summary-title">
          <header><h2 id="checkout-summary-title">Order summary</h2><span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span></header>
          <div className="checkout-summary__items">
            {lines.map((line) => (
              <div key={line.key}><img src={line.image} alt="" /><span><strong>{line.title}</strong><small>{line.variant}{line.variant && ' · '}Qty {line.quantity}</small></span><b>{moneyFormatter.format(line.unitPrice * line.quantity)}</b></div>
            ))}
          </div>
          <dl>
            <div><dt>Subtotal</dt><dd>{moneyFormatter.format(totals.subtotal)}</dd></div>
            {totals.savings > 0 && <div className="is-savings"><dt>Product savings</dt><dd>−{moneyFormatter.format(totals.savings)}</dd></div>}
            <div><dt>Shipping</dt><dd>{totals.shipping === 0 ? 'FREE' : moneyFormatter.format(totals.shipping)}</dd></div>
            <div><dt>Estimated tax</dt><dd>{moneyFormatter.format(totals.tax)}</dd></div>
          </dl>
          <div className="checkout-summary__total"><span>Total</span><strong>{moneyFormatter.format(totals.total)}</strong></div>
        </aside>
      </div>
    </div>
  )
}
