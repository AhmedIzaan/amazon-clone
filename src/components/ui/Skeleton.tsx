interface SkeletonProps {
  label?: string
  lines?: number
}

export function Skeleton({ label = 'Loading content', lines = 3 }: SkeletonProps) {
  return (
    <div className="skeleton" role="status" aria-label={label}>
      <span className="skeleton__media" aria-hidden="true" />
      {Array.from({ length: lines }, (_, index) => (
        <span className="skeleton__line" key={index} aria-hidden="true" />
      ))}
    </div>
  )
}
