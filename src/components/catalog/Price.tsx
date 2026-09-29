import type { Money } from '../../types/catalog'

interface PriceProps {
  price: Money
  compareAt?: Money
}

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function Price({ price, compareAt }: PriceProps) {
  const savings = compareAt ? Math.round((1 - price.amount / compareAt.amount) * 100) : 0
  const [whole, cents = '00'] = price.amount.toFixed(2).split('.')

  return (
    <div
      className="price"
      aria-label={`${moneyFormatter.format(price.amount)}${savings ? `, ${savings}% off` : ''}`}
    >
      <span className="price__current" aria-hidden="true">
        <sup>$</sup>{whole}<sup>{cents}</sup>
      </span>
      {compareAt && (
        <span className="price__meta" aria-hidden="true">
          <del>{moneyFormatter.format(compareAt.amount)}</del>
          <strong>{savings}% off</strong>
        </span>
      )}
    </div>
  )
}
