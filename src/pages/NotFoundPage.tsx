import { Link } from 'react-router-dom'
import { RoutePlaceholder } from '../components/RoutePlaceholder'

export function NotFoundPage() {
  return (
    <RoutePlaceholder
      eyebrow="404"
      title="That aisle does not exist"
      description="Use search or return home to keep browsing."
    >
      <Link className="primary-link" to="/">
        Return home
      </Link>
    </RoutePlaceholder>
  )
}
