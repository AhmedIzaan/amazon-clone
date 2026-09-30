import { Check, Scale, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../state/cart-context'
import type { Product } from '../../types/catalog'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Price } from './Price'
import { Rating } from './Rating'
import { useComparison } from '../../state/comparison-context'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem } = useCart()
  const { isSelected, toggleProduct } = useComparison()
  const [isAdded, setIsAdded] = useState(false)
  const [compareMessage, setCompareMessage] = useState('')
  const isCompared = isSelected(product.id)

  useEffect(() => {
    if (!isAdded) return
    const timeout = window.setTimeout(() => setIsAdded(false), 1400)
    return () => window.clearTimeout(timeout)
  }, [isAdded])

  function handleAdd() {
    const defaultVariant = product.variants.find((variant) => variant.inStock)
    addItem(product.id, 1, defaultVariant?.id)
    setIsAdded(true)
  }

  function handleCompare() {
    const result = toggleProduct(product.id)
    setCompareMessage(result === 'limit' ? 'Remove a product before adding another.' : '')
  }

  return (
    <article className={`product-card${compact ? ' product-card--compact' : ''}`}>
      <Link
        className="product-card__media"
        to={`/products/${product.slug}`}
        aria-label={`View ${product.title}`}
      >
        {product.badges[0] && <Badge tone="accent">{product.badges[0]}</Badge>}
        <img
          src={product.images[0].src}
          alt={product.images[0].alt}
          loading="lazy"
          width="900"
          height="900"
        />
      </Link>
      <div className="product-card__content">
        <p className="product-card__brand">{product.brand}</p>
        <h3><Link to={`/products/${product.slug}`}>{product.title}</Link></h3>
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
        <Price price={product.price} compareAt={product.compareAtPrice} />
        <p className="delivery-copy">
          {product.deliveryDays <= 2 && <span className="delivery-mark">Aster+</span>}
          <strong>Free delivery</strong> {product.deliveryDays === 1 ? 'tomorrow' : `in ${product.deliveryDays} days`}
        </p>
        <div className="product-card__actions">
          <Button className="product-card__button" aria-label={isAdded ? `${product.title} added to cart` : `Add ${product.title} to cart`} onClick={handleAdd}>
            {isAdded ? <Check aria-hidden="true" /> : <ShoppingCart aria-hidden="true" />}{isAdded ? 'Added' : 'Add to cart'}
          </Button>
          <button className={`product-card__compare${isCompared ? ' is-selected' : ''}`} type="button" aria-pressed={isCompared} onClick={handleCompare}><Scale aria-hidden="true" />{isCompared ? 'Compared' : 'Compare'}</button>
        </div>
        {compareMessage && <small className="product-card__compare-limit" role="status">{compareMessage}</small>}
        <span className="sr-only" aria-live="polite">{isAdded ? `${product.title} added to cart` : ''}</span>
      </div>
    </article>
  )
}
