import { ArrowRight, LogOut, MapPin, Package, ShieldCheck, UserRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { readOrders } from '../checkout/order'
import { AuthField } from '../components/account/AuthField'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useAuth, type SavedAddress } from '../state/auth-context'

const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const emptyAddress: SavedAddress = {
  label: 'Home',
  recipient: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  postalCode: '',
}

export function AccountPage() {
  const { user, updateProfile, saveAddress, signOut } = useAuth()
  const orders = readOrders()
  const [profile, setProfile] = useState({ fullName: user?.fullName ?? '', phone: user?.phone ?? '' })
  const [address, setAddress] = useState<SavedAddress>(user?.address ?? emptyAddress)
  const [profileErrors, setProfileErrors] = useState<{ fullName?: string; phone?: string }>({})
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof SavedAddress, string>>>({})
  const [saving, setSaving] = useState<'profile' | 'address' | null>(null)
  const [message, setMessage] = useState('')

  if (!user) return <Navigate to="/sign-in" state={{ from: '/account' }} replace />

  function updateAddressField(field: keyof SavedAddress, value: string) {
    setAddress((current) => ({ ...current, [field]: value }))
    setAddressErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function submitProfile(event: FormEvent) {
    event.preventDefault()
    const errors: typeof profileErrors = {}
    if (profile.fullName.trim().length < 2) errors.fullName = 'Enter your full name.'
    if (profile.phone && !/^[\d\s()+-]{10,}$/.test(profile.phone)) errors.phone = 'Enter a valid phone number.'
    setProfileErrors(errors)
    setMessage('')
    if (Object.keys(errors).length > 0) return
    setSaving('profile')
    try {
      await updateProfile({ fullName: profile.fullName.trim(), phone: profile.phone.trim() })
      setMessage('Profile saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save your profile.')
    } finally {
      setSaving(null)
    }
  }

  async function submitAddress(event: FormEvent) {
    event.preventDefault()
    const errors: typeof addressErrors = {}
    if (address.label.trim().length < 2) errors.label = 'Name this address.'
    if (address.recipient.trim().length < 2) errors.recipient = 'Enter the recipient’s name.'
    if (address.street.trim().length < 5) errors.street = 'Enter a complete street address.'
    if (address.city.trim().length < 2) errors.city = 'Enter a city.'
    if (!address.state) errors.state = 'Choose a state.'
    if (!/^\d{5}(-\d{4})?$/.test(address.postalCode)) errors.postalCode = 'Enter a 5-digit ZIP code.'
    setAddressErrors(errors)
    setMessage('')
    if (Object.keys(errors).length > 0) return
    setSaving('address')
    try {
      await saveAddress({ ...address, label: address.label.trim(), recipient: address.recipient.trim(), street: address.street.trim(), city: address.city.trim() })
      setMessage('Delivery address saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save the address.')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="account-page container">
      <header className="account-hero">
        <div className="account-avatar" aria-hidden="true">{user.fullName.charAt(0).toUpperCase()}</div>
        <div><p className="eyebrow">Your account</p><h1>Hello, {user.fullName.split(' ')[0]}</h1><p>{user.email}</p></div>
        <Button variant="quiet" onClick={signOut}><LogOut aria-hidden="true" /> Sign out</Button>
      </header>

      <div className="account-security-note"><ShieldCheck aria-hidden="true" /><p><strong>Local demo account</strong> Profile, address, and order data stay in this browser. There is no secure backend session.</p></div>
      {message && <div className="account-status" role="status">{message}</div>}

      <div className="account-layout">
        <main className="account-main">
          <section className="account-section" aria-labelledby="orders-title">
            <header><div><Package aria-hidden="true" /><div><p className="eyebrow">Purchases</p><h2 id="orders-title">Demo orders</h2></div></div><span>{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span></header>
            {orders.length === 0 ? (
              <EmptyState icon={<Package />} title="No orders yet" description="Orders placed through the demo checkout will appear here." action={<Link className="button button--primary" to="/">Start shopping</Link>} />
            ) : (
              <div className="order-history">
                {orders.map((order) => (
                  <article key={order.orderNumber}>
                    <header><div><small>Order placed</small><strong>{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(order.placedAt))}</strong></div><div><small>Total</small><strong>{moneyFormatter.format(order.totals.total)}</strong></div><div><small>Order</small><strong>{order.orderNumber}</strong></div></header>
                    <div className="order-history__body">
                      <div className="order-history__images">{order.lines.slice(0, 3).map((line) => <img key={line.key} src={line.image} alt={line.imageAlt} />)}</div>
                      <div><h3>{order.lines[0]?.title}</h3><p>{order.lines.length > 1 ? `and ${order.lines.length - 1} more · ` : ''}{order.deliveryMethod === 'express' ? 'Express' : 'Standard'} delivery</p><span>Confirmed · Estimated {order.estimatedDelivery}</span></div>
                      <Link to={`/checkout/success?order=${encodeURIComponent(order.orderNumber)}`}>View order <ArrowRight aria-hidden="true" /></Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>

        <aside className="account-sidebar">
          <section className="account-section account-form-section" aria-labelledby="profile-title">
            <header><div><UserRound aria-hidden="true" /><div><p className="eyebrow">Personal details</p><h2 id="profile-title">Profile</h2></div></div></header>
            <form onSubmit={submitProfile} noValidate>
              <AuthField label="Full name" name="profileName" autoComplete="name" value={profile.fullName} error={profileErrors.fullName} onChange={(event) => { setProfile({ ...profile, fullName: event.target.value }); setProfileErrors((current) => ({ ...current, fullName: undefined })) }} />
              <AuthField label="Email" name="profileEmail" type="email" value={user.email} disabled />
              <AuthField label="Phone" name="profilePhone" type="tel" autoComplete="tel" value={profile.phone} error={profileErrors.phone} onChange={(event) => { setProfile({ ...profile, phone: event.target.value }); setProfileErrors((current) => ({ ...current, phone: undefined })) }} />
              <Button type="submit" variant="secondary" disabled={saving === 'profile'}>{saving === 'profile' ? 'Saving…' : 'Save profile'}</Button>
            </form>
          </section>

          <section className="account-section account-form-section" aria-labelledby="address-title">
            <header><div><MapPin aria-hidden="true" /><div><p className="eyebrow">Default destination</p><h2 id="address-title">Saved address</h2></div></div></header>
            <form onSubmit={submitAddress} noValidate>
              <div className="account-form-grid">
                <AuthField label="Label" name="addressLabel" value={address.label} error={addressErrors.label} onChange={(event) => updateAddressField('label', event.target.value)} />
                <AuthField label="Recipient" name="recipient" autoComplete="name" value={address.recipient} error={addressErrors.recipient} onChange={(event) => updateAddressField('recipient', event.target.value)} />
                <AuthField label="Street address" name="street" autoComplete="street-address" value={address.street} error={addressErrors.street} onChange={(event) => updateAddressField('street', event.target.value)} />
                <AuthField label="Apartment (optional)" name="apartment" value={address.apartment} onChange={(event) => updateAddressField('apartment', event.target.value)} />
                <AuthField label="City" name="addressCity" autoComplete="address-level2" value={address.city} error={addressErrors.city} onChange={(event) => updateAddressField('city', event.target.value)} />
                <div className={`auth-field${addressErrors.state ? ' auth-field--error' : ''}`}><label htmlFor="addressState">State</label><div className="auth-field__control"><select id="addressState" value={address.state} aria-invalid={Boolean(addressErrors.state)} aria-describedby={addressErrors.state ? 'address-state-error' : undefined} onChange={(event) => updateAddressField('state', event.target.value)}><option value="">Choose state</option><option value="CA">California</option><option value="NY">New York</option><option value="TX">Texas</option><option value="WA">Washington</option></select></div>{addressErrors.state && <small id="address-state-error">{addressErrors.state}</small>}</div>
                <AuthField label="ZIP code" name="addressPostalCode" inputMode="numeric" autoComplete="postal-code" value={address.postalCode} error={addressErrors.postalCode} onChange={(event) => updateAddressField('postalCode', event.target.value)} />
              </div>
              <Button type="submit" variant="secondary" disabled={saving === 'address'}>{saving === 'address' ? 'Saving…' : 'Save address'}</Button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  )
}
