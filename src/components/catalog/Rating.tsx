import { Star } from 'lucide-react'

interface RatingProps {
  rating: number
  reviewCount: number
}

export function Rating({ rating, reviewCount }: RatingProps) {
  const rounded = Math.round(rating)

  return (
    <div
      className="rating"
      aria-label={`${rating} out of 5 stars, ${reviewCount.toLocaleString()} reviews`}
    >
      <span className="rating__stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} className={index < rounded ? 'is-filled' : ''} />
        ))}
      </span>
      <span aria-hidden="true">{rating}</span>
      <span className="rating__count" aria-hidden="true">({reviewCount.toLocaleString()})</span>
    </div>
  )
}
