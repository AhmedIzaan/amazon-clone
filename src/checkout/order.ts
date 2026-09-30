import { catalog } from '../data/catalog'
import type { CartItem } from '../state/cart-context'

export const ORDERS_STORAGE_KEY = 'aster-orders-v1'
export const CHECKOUT_DRAFT_KEY = 'aster-checkout-draft-v1'
export const TAX_RATE = 0.0825

export type DeliveryMethod = 'standard' | 'express'

export interface CheckoutAddress {
  fullName: string
  email: string
  phone: string
  address: string
  apartment: string
  city: string
  state: string
  postalCode: string
}

export interface OrderLine {
  key: string
  productId: string
  slug: string
  title: string
  brand: string
  image: string
  imageAlt: string
  variant?: string
  quantity: number
  unitPrice: number
  compareAtPrice?: number
}

export interface CheckoutTotals {
  subtotal: number
  savings: number
  shipping: number
  tax: number
  total: number
}

export interface DemoOrder {
  orderNumber: string
  placedAt: string
  address: CheckoutAddress
  deliveryMethod: DeliveryMethod
  estimatedDelivery: string
  payment: { method: 'Demo Visa'; lastFour: string }
  lines: OrderLine[]
  totals: CheckoutTotals
}

export function resolveOrderLines(items: CartItem[]): OrderLine[] {
  return items.flatMap((item) => {
    const product = catalog.find((entry) => entry.id === item.productId)
    if (!product) return []
    const variant = product.variants.find((entry) => entry.id === item.variantId)
    return [{
      key: item.key,
      productId: product.id,
      slug: product.slug,
      title: product.title,
      brand: product.brand,
      image: product.images[0].src,
      imageAlt: product.images[0].alt,
      variant: variant ? `${variant.label}: ${variant.value}` : undefined,
      quantity: item.quantity,
      unitPrice: variant?.price?.amount ?? product.price.amount,
      compareAtPrice: product.compareAtPrice?.amount,
    }]
  })
}

export function calculateCheckoutTotals(lines: OrderLine[], deliveryMethod: DeliveryMethod): CheckoutTotals {
  const subtotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0)
  const originalTotal = lines.reduce((total, line) => (
    total + (line.compareAtPrice ?? line.unitPrice) * line.quantity
  ), 0)
  const savings = Math.max(0, originalTotal - subtotal)
  const shipping = deliveryMethod === 'express' ? 12.99 : subtotal >= 50 ? 0 : 5.99
  const tax = Number((subtotal * TAX_RATE).toFixed(2))
  const total = Number((subtotal + shipping + tax).toFixed(2))
  return { subtotal, savings, shipping, tax, total }
}

export function getEstimatedDelivery(deliveryMethod: DeliveryMethod, maximumProductDays: number) {
  const date = new Date()
  date.setDate(date.getDate() + (deliveryMethod === 'express' ? 1 : maximumProductDays))
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function createOrderNumber() {
  const suffix = crypto.randomUUID().slice(0, 8).toUpperCase()
  return `AST-${new Date().getFullYear()}-${suffix}`
}

export function readOrders(): DemoOrder[] {
  try {
    const stored = window.localStorage.getItem(ORDERS_STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveOrder(order: DemoOrder) {
  const orders = [order, ...readOrders()].slice(0, 20)
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}

export function findOrder(orderNumber: string | null) {
  if (!orderNumber) return undefined
  return readOrders().find((order) => order.orderNumber === orderNumber)
}
