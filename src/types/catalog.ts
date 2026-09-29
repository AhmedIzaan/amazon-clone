export interface Money {
  amount: number
  currency: 'USD'
}

export interface ProductImage {
  src: string
  alt: string
}

export interface ProductVariant {
  id: string
  label: string
  value: string
  price?: Money
  inStock: boolean
}

export interface ProductReview {
  id: string
  author: string
  rating: number
  title: string
  body: string
  verified: boolean
}

export interface Product {
  id: string
  slug: string
  title: string
  category: string
  brand: string
  description: string
  features: string[]
  price: Money
  compareAtPrice?: Money
  rating: number
  reviewCount: number
  images: ProductImage[]
  variants: ProductVariant[]
  reviews: ProductReview[]
  badges: string[]
  inStock: boolean
  deliveryDays: number
}
