import type { ReactNode } from 'react'

interface RoutePlaceholderProps {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}

export function RoutePlaceholder({
  eyebrow,
  title,
  description,
  children,
}: RoutePlaceholderProps) {
  return (
    <section className="route-placeholder container">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="route-description">{description}</p>
      {children}
    </section>
  )
}
