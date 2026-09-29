import { Backpack, Headphones, LampDesk, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/catalog'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Price } from './Price'
import { Rating } from './Rating'

interface ProductCardProps {
  product: Product
}

const categoryIcons = {
  Audio: Headphones,
  Home: LampDesk,
  Outdoors: Backpack,
}

export function ProductCard({ product }: ProductCardProps) {
  const ProductIcon = categoryIcons[product.category as keyof typeof categoryIcons] ?? ShoppingCart

  return (
    <article className="product-card">
      <Link
        className="product-card__media"
        to={`/products/${product.slug}`}
        aria-label={`View ${product.title}`}
      >
        {product.badges[0] && <Badge tone="accent">{product.badges[0]}</Badge>}
        <ProductIcon aria-hidden="true" />
      </Link>
      <div className="product-card__content">
        <p className="product-card__brand">{product.brand}</p>
        <h3><Link to={`/products/${product.slug}`}>{product.title}</Link></h3>
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
        <Price price={product.price} compareAt={product.compareAtPrice} />
        <p className="delivery-copy"><strong>Free delivery</strong> in {product.deliveryDays} days</p>
        <Button className="product-card__button" aria-label={`Add ${product.title} to cart`}>
          <ShoppingCart aria-hidden="true" /> Add to cart
        </Button>
      </div>
    </article>
  )
}
