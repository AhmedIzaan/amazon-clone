import {
  Check,
  ChevronRight,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  ZoomIn,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Price } from '../components/catalog/Price'
import { ProductCard } from '../components/catalog/ProductCard'
import { Rating } from '../components/catalog/Rating'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { catalog } from '../data/catalog'
import { useCart } from '../state/cart-context'
import type { Product } from '../types/catalog'
import { NotFoundPage } from './NotFoundPage'

const galleryViews = ['Full view', 'Closer look', 'Material detail']

function formatDeliveryDate(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function ProductPage() {
  const { slug } = useParams()
  const product = catalog.find((item) => item.slug === slug)

  if (!product) return <NotFoundPage />
  return <ProductDetail product={product} key={product.id} />
}

function ProductDetail({ product }: { product: Product }) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? '')
  const [quantity, setQuantity] = useState(1)
  const [confirmation, setConfirmation] = useState('')
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId)
  const selectedPrice = selectedVariant?.price ?? product.price
  const canPurchase = product.inStock && (selectedVariant?.inStock ?? true)
  const deliveryDate = formatDeliveryDate(product.deliveryDays)
  const fiveStarShare = Math.round(product.rating * 16)
  const remainingShare = 100 - fiveStarShare
  const ratingDistribution = [
    fiveStarShare,
    Math.round(remainingShare * 0.6),
    Math.round(remainingShare * 0.24),
    Math.round(remainingShare * 0.12),
  ]
  ratingDistribution.push(100 - ratingDistribution.reduce((total, share) => total + share, 0))
  const relatedProducts = useMemo(() => [
    ...catalog.filter((item) => item.id !== product.id && item.category === product.category),
    ...catalog.filter((item) => item.id !== product.id && item.category !== product.category),
  ].slice(0, 3), [product])

  useEffect(() => {
    if (!confirmation) return
    const timeout = window.setTimeout(() => setConfirmation(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [confirmation])

  function addSelectionToCart() {
    if (!canPurchase) return
    addItem(product.id, quantity, selectedVariant?.id)
    const variantCopy = selectedVariant ? ` in ${selectedVariant.value}` : ''
    setConfirmation(`${quantity} ${quantity === 1 ? 'item' : 'items'}${variantCopy} added to cart`)
  }

  function buyNow() {
    if (!canPurchase) return
    addItem(product.id, quantity, selectedVariant?.id)
    navigate('/checkout')
  }

  return (
    <div className="product-page">
      <nav className="product-breadcrumb container" aria-label="Breadcrumb">
        <Link to="/">Home</Link><ChevronRight aria-hidden="true" />
        <Link to={`/search?category=${product.category.toLowerCase()}`}>{product.category}</Link>
        <ChevronRight aria-hidden="true" /><span aria-current="page">{product.title}</span>
      </nav>

      <section className="product-hero container" aria-labelledby="product-title">
        <div className="product-gallery">
          <div className="product-gallery__thumbs" aria-label="Product images">
            {galleryViews.map((view, index) => (
              <button
                className={selectedImage === index ? 'is-selected' : ''}
                type="button"
                aria-label={`Show ${view.toLowerCase()}`}
                aria-pressed={selectedImage === index}
                onClick={() => setSelectedImage(index)}
                key={view}
              >
                <img className={`gallery-image--${index}`} src={product.images[0].src} alt="" />
              </button>
            ))}
          </div>
          <div className="product-gallery__stage">
            {product.badges[0] && <Badge tone="accent">{product.badges[0]}</Badge>}
            <img
              className={`gallery-image--${selectedImage}`}
              src={product.images[0].src}
              alt={product.images[0].alt}
              width="900"
              height="900"
            />
            <p><ZoomIn aria-hidden="true" /> {galleryViews[selectedImage]}</p>
          </div>
        </div>

        <div className="product-summary">
          <p className="product-summary__brand">{product.brand}</p>
          <h1 id="product-title">{product.title}</h1>
          <a className="product-summary__rating" href="#customer-reviews">
            <Rating rating={product.rating} reviewCount={product.reviewCount} />
          </a>
          <p className="product-summary__description">{product.description}</p>
          <div className="decision-strip" aria-label="Product highlights">
            <span><Star aria-hidden="true" /><strong>{product.rating}/5</strong> highly rated</span>
            <span><Truck aria-hidden="true" /><strong>{product.deliveryDays <= 2 ? 'Fast' : 'Free'}</strong> delivery</span>
            <span><RotateCcw aria-hidden="true" /><strong>30-day</strong> returns</span>
          </div>
          <div className="feature-list">
            <h2>Why you’ll like it</h2>
            <ul>{product.features.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul>
          </div>
        </div>

        <aside className="purchase-panel" aria-label="Purchase options">
          <Price price={selectedPrice} compareAt={product.compareAtPrice} />
          <p className="purchase-panel__payment">Or 4 interest-free payments. No membership required.</p>
          <div className="delivery-estimate">
            <Truck aria-hidden="true" />
            <div><span>Free delivery</span><strong>{deliveryDate}</strong><small>to Demo address</small></div>
          </div>

          {product.variants.length > 0 && (
            <fieldset className="variant-picker">
              <legend>{product.variants[0].label}: <strong>{selectedVariant?.value}</strong></legend>
              <div>
                {product.variants.map((variant) => (
                  <button
                    className={selectedVariantId === variant.id ? 'is-selected' : ''}
                    type="button"
                    aria-pressed={selectedVariantId === variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    key={variant.id}
                  >
                    {variant.value}
                    {!variant.inStock && <small>Unavailable</small>}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <p className={`stock-status ${canPurchase ? 'is-available' : 'is-unavailable'}`} aria-live="polite">
            {canPurchase ? <><Check aria-hidden="true" /> In stock and ready to ship</> : <>Currently unavailable in {selectedVariant?.value}</>}
          </p>

          <label className="quantity-field">
            <span>Quantity</span>
            <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} disabled={!canPurchase}>
              {[1, 2, 3, 4, 5].map((value) => <option value={value} key={value}>{value}</option>)}
            </select>
          </label>

          <div className="purchase-actions">
            <Button onClick={addSelectionToCart} disabled={!canPurchase}>
              <ShoppingCart aria-hidden="true" /> Add to cart
            </Button>
            <Button variant="secondary" onClick={buyNow} disabled={!canPurchase}>Buy now</Button>
          </div>
          <p className={`cart-confirmation${confirmation ? ' is-visible' : ''}`} aria-live="polite">
            {confirmation && <><Check aria-hidden="true" />{confirmation}</>}
          </p>
          <div className="purchase-assurances">
            <p><ShieldCheck aria-hidden="true" /><span><strong>Secure checkout</strong>Your payment details stay protected</span></p>
            <p><PackageCheck aria-hidden="true" /><span><strong>Easy returns</strong>Free returns within 30 days</span></p>
          </div>
        </aside>

        <div className="product-detail-content">
        <section className="product-information" aria-labelledby="about-product-title">
          <div>
            <p className="eyebrow">The essentials</p>
            <h2 id="about-product-title">About this product</h2>
            <p>{product.description} Designed around everyday use, with practical details that earn their place rather than add complexity.</p>
          </div>
          <div className="specification-card">
            <h2>Specifications</h2>
            <dl>
              {product.specifications.map((specification) => (
                <div key={specification.label}><dt>{specification.label}</dt><dd>{specification.value}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        <section className="reviews-section" id="customer-reviews" aria-labelledby="reviews-title">
          <header><p className="eyebrow">From verified buyers</p><h2 id="reviews-title">Customer reviews</h2></header>
          <div className="reviews-layout">
            <div className="review-summary">
              <strong>{product.rating}</strong><span>out of 5</span>
              <Rating rating={product.rating} reviewCount={product.reviewCount} />
              <p>Based on {product.reviewCount.toLocaleString()} customer ratings</p>
              {[5, 4, 3, 2, 1].map((stars, index) => {
                const width = ratingDistribution[index]
                return <div className="rating-bar" key={stars}><span>{stars} star</span><i><b style={{ width: `${width}%` }} /></i><small>{width}%</small></div>
              })}
            </div>
            <div className="review-list">
              {product.reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="review-card__meta">
                    <span className="review-card__avatar" aria-hidden="true">{review.author.charAt(0)}</span>
                    <span><strong>{review.author}</strong>{review.verified && <small><Check aria-hidden="true" /> Verified purchase</small>}</span>
                  </div>
                  <div className="review-card__stars" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, index) => <Star className={index < review.rating ? 'is-filled' : ''} aria-hidden="true" key={index} />)}
                  </div>
                  <h3>{review.title}</h3><p>{review.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="related-section" aria-labelledby="related-title">
          <header className="section-heading"><div><p className="eyebrow">Keep comparing</p><h2 id="related-title">You might also like</h2></div></header>
          <div className="product-grid">{relatedProducts.map((item) => <ProductCard product={item} key={item.id} />)}</div>
        </section>
        </div>
      </section>

      <div className="mobile-purchase-bar" aria-label="Purchase actions">
        <div><Price price={selectedPrice} compareAt={product.compareAtPrice} /><small>{canPurchase ? `Arrives ${deliveryDate}` : 'Unavailable'}</small></div>
        <Button onClick={addSelectionToCart} disabled={!canPurchase}>
          {confirmation ? <Check aria-hidden="true" /> : <ShoppingCart aria-hidden="true" />}
          {confirmation ? 'Added' : 'Add'}
        </Button>
        <Button variant="secondary" onClick={buyNow} disabled={!canPurchase}>Buy now</Button>
      </div>
    </div>
  )
}
