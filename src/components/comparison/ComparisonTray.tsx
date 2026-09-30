import { Check, Scale, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useComparison } from '../../state/comparison-context'

const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function ComparisonTray() {
  const { products, removeProduct, clearComparison } = useComparison()
  const [isOpen, setIsOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const compareButtonRef = useRef<HTMLButtonElement>(null)
  const specificationLabels = useMemo(() => [...new Set(products.flatMap((product) => (
    product.specifications.map((specification) => specification.label)
  )))].slice(0, 5), [products])

  useEffect(() => {
    if (!isOpen) return
    const compareButton = compareButtonRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      compareButton?.focus()
    }
  }, [isOpen])

  if (products.length === 0) return null

  return (
    <>
      <aside className="comparison-tray" aria-label="Products selected for comparison">
        <div className="comparison-tray__title"><Scale aria-hidden="true" /><span><strong>Compare products</strong><small>{products.length} of 3 selected</small></span></div>
        <div className="comparison-tray__products">
          {products.map((product) => (
            <div key={product.id}>
              <img src={product.images[0].src} alt="" />
              <span>{product.title}</span>
              <button type="button" onClick={() => removeProduct(product.id)} aria-label={`Remove ${product.title} from comparison`}><X aria-hidden="true" /></button>
            </div>
          ))}
        </div>
        <button className="comparison-tray__clear" type="button" onClick={clearComparison}>Clear</button>
        <button ref={compareButtonRef} className="button button--primary" type="button" disabled={products.length < 2} onClick={() => setIsOpen(true)}>{products.length < 2 ? 'Add one more' : `Compare ${products.length}`}</button>
      </aside>

      {isOpen && (
        <div className="comparison-dialog-backdrop" role="presentation" onMouseDown={() => setIsOpen(false)}>
          <section className="comparison-dialog" role="dialog" aria-modal="true" aria-labelledby="comparison-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><p className="eyebrow">Decision view</p><h2 id="comparison-title">Compare your shortlist</h2><p>The details that matter, without opening three tabs.</p></div><button ref={closeButtonRef} type="button" aria-label="Close comparison" onClick={() => setIsOpen(false)}><X aria-hidden="true" /></button></header>
            <div className="comparison-table-wrap">
              <table className="comparison-table">
                <thead><tr><th scope="col">Detail</th>{products.map((product) => <th scope="col" key={product.id}><img src={product.images[0].src} alt="" /><Link to={`/products/${product.slug}`} onClick={() => setIsOpen(false)}>{product.title}</Link><small>{product.brand}</small></th>)}</tr></thead>
                <tbody>
                  <tr><th scope="row">Price</th>{products.map((product) => <td key={product.id}><strong>{moneyFormatter.format(product.price.amount)}</strong>{product.compareAtPrice && <small className="comparison-saving">Save {moneyFormatter.format(product.compareAtPrice.amount - product.price.amount)}</small>}</td>)}</tr>
                  <tr><th scope="row">Customer rating</th>{products.map((product) => <td key={product.id}><strong>{product.rating}/5</strong><small>{product.reviewCount.toLocaleString()} reviews</small></td>)}</tr>
                  <tr><th scope="row">Delivery</th>{products.map((product) => <td key={product.id}><strong>{product.deliveryDays === 1 ? 'Tomorrow' : `${product.deliveryDays} days`}</strong><small>{product.deliveryDays <= 2 ? 'Aster+ eligible' : 'Free delivery'}</small></td>)}</tr>
                  <tr><th scope="row">Best for</th>{products.map((product) => <td key={product.id}>{product.features.slice(0, 2).map((feature) => <span className="comparison-feature" key={feature}><Check aria-hidden="true" />{feature}</span>)}</td>)}</tr>
                  {specificationLabels.map((label) => <tr key={label}><th scope="row">{label}</th>{products.map((product) => <td key={product.id}>{product.specifications.find((specification) => specification.label === label)?.value ?? '—'}</td>)}</tr>)}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
