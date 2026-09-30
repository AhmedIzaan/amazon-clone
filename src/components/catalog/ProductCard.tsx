import { Check, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../state/cart-context'
import type { Product } from '../../types/catalog'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Price } from './Price'
import { Rating } from './Rating'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

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
        <Button
          className="product-card__button"
          aria-label={isAdded ? `${product.title} added to cart` : `Add ${product.title} to cart`}
          onClick={handleAdd}
        >
          {isAdded ? <Check aria-hidden="true" /> : <ShoppingCart aria-hidden="true" />}
          {isAdded ? 'Added' : 'Add to cart'}
        </Button>
        <span className="sr-only" aria-live="polite">{isAdded ? `${product.title} added to cart` : ''}</span>
      </div>
    </article>
  )
}
