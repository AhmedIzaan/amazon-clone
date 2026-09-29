# MVP Build Plan

The product should feel complete across one journey:

**discover → search → evaluate a product → add to cart → checkout**

The working product name is **Aster**. It should borrow Amazon's useful commerce grammar—prominent search, confidence-building product information, and clear fulfillment—without copying its density.

## Must ship

### Discovery

- Responsive global header with brand, category access, search, account entry, and cart count.
- Focused homepage with a small hero, featured categories, curated collections, and useful product rows.
- Product cards with consistent image treatment, title, rating, price, discount, delivery cue, and stock state.
- Useful loading, empty, and error states.

### Search and refinement

- Search suggestions for products, categories, and common query completions.
- Search results driven by the URL (`q`, filters, and sort) so states are shareable and browser navigation works.
- Fast filters for category, price, rating, availability, and delivery; active filters must be obvious and removable.
- Sorting for relevance, price, rating, and newest.
- Desktop filter rail and a mobile filter sheet using the same filter model.

### Product evaluation

- Product detail page with image gallery, title, rating summary, price/discount, concise description, and key features.
- Variant selection with explicit price and availability changes.
- Delivery estimate and stock messaging adjacent to the purchase action.
- Quantity selection and an unmistakable add-to-cart action.
- A compact review summary plus a small set of representative written reviews.

### Cart and checkout

- Persistent cart with a cart drawer for quick feedback and a full cart route for editing.
- Quantity changes, removal, saved-for-later affordance, subtotal, and free-shipping progress.
- Guest checkout with contact, shipping address, delivery option, mock payment, review, and confirmation states.
- Inline validation and a persistent order summary.
- No real payment or order submission; confirmation is an explicit demo outcome.

### Product quality

- Purpose-built mobile layouts, keyboard support, visible focus, semantic landmarks, and sensible reduced-motion behavior.
- Core flow works after refresh through URL state and local persistence.
- Unit/component tests for filtering, price/variant decisions, cart math, persistence, and checkout validation.
- One end-to-end happy-path test for the complete journey.

## Nice to have

- Recently viewed products and a lightweight recommendation rail.
- Saved items that persist independently of the cart.
- Product comparison for two or three products.
- Search history and keyboard-first command-style search.
- Skeleton loading transitions and subtle cart/gallery motion.
- A demo account with prefilled addresses and a mock order history.
- Theme polish such as dark mode only if it does not delay the core journey.

## Intentionally omitted

- **Real payments, taxes, fraud checks, and order placement:** operational risk without improving the UI demonstration.
- **Marketplace sellers and fulfillment networks:** too many edge cases for the build window.
- **Prime, subscriptions, financing, coupons, gift cards, and loyalty:** secondary programs distract from the buying loop.
- **Real authentication in the MVP:** guest checkout proves the journey; credentials and password recovery do not.
- **Personalized ads and machine-learned recommendations:** curated fixtures provide enough discovery depth.
- **International currency, language, and postal logistics:** use one explicit demo market and deterministic delivery rules.
- **Returns, support, shipment tracking, and notifications:** post-purchase operations are outside the core brief.
- **A large review/Q&A system:** authored fixture data is sufficient to demonstrate confidence signals.

## Improvement ideas

1. **Calmer hierarchy:** fewer modules per viewport, more whitespace, and one dominant action per section.
2. **Stronger discovery:** intent-led collections and category shortcuts before an endless grid of promotions.
3. **Instant refinement:** URL-backed filters update locally with no loading round-trip; active filters remain visible.
4. **Clearer buying decisions:** variants show price, stock, and delivery changes together instead of scattering them across the page.
5. **Smoother cart:** optimistic quantity updates, undo after removal, a useful mini-cart, and no forced navigation.
6. **Better mobile ordering:** product summary first, sticky purchase action, compact filter chips, and no stacked promotional banners consuming the viewport.

## Pages and routes

| Route | Purpose | MVP state |
| --- | --- | --- |
| `/` | Curated discovery homepage | Must ship |
| `/search?q=&category=&price=&rating=&sort=` | Results, filters, sorting, empty state | Must ship |
| `/products/:slug` | Gallery, variants, reviews, buying decision | Must ship |
| `/cart` | Full cart editing and saved items | Must ship |
| `/checkout` | Guest checkout steps | Must ship |
| `/checkout/success` | Demo order confirmation | Must ship |
| `/sign-in` | Optional demo-account entry | Nice to have |
| `*` | Helpful not-found recovery | Must ship |

Checkout stays on one route with internal steps. This avoids route and persistence complexity while keeping Back/Continue behavior explicit.

## Technical plan

### Frontend

- Vite, React, and TypeScript.
- React Router in declarative SPA mode.
- Semantic HTML and small reusable components; no large UI framework.
- CSS custom-property tokens for color, type, spacing, radii, shadows, and responsive breakpoints.
- Lucide icons, with text labels retained for important actions.

### Backend and data

- No backend for the MVP.
- Typed fixture data in `src/data/`, accessed through small functions in `src/services/` so a real API can replace it without rewriting pages.
- Product images will be local assets to keep builds deterministic.
- Search, filtering, inventory, reviews, delivery estimates, and checkout results are deterministic client-side behavior.

### Authentication

- Guest-first checkout is the must-ship path.
- A demo sign-in may be added later, but no passwords, tokens, or external identity provider are needed.
- Account-only concepts such as saved addresses and order history stay out of the core build.

### State management

- URL search parameters own query, filter, and sort state.
- React component state owns transient UI such as drawers and gallery selection.
- Cart uses Context + `useReducer`, persisted to versioned `localStorage`.
- Checkout state remains local to the checkout flow and stores no sensitive payment data.
- Do not add Redux or a server-state library unless real requirements appear.

### Deployment

- Static Vite build deployed to Vercel with an SPA fallback.
- CI should run lint, type-check/build, and tests before deployment.
- Environment variables are unnecessary for the fixture-backed MVP.

### Testing

- Vitest + Testing Library for components and domain logic.
- Add Playwright only when the complete journey exists, then cover one desktop and one mobile happy path.
- Manual responsive checks at narrow mobile, tablet, laptop, and wide desktop widths.
- Verify keyboard navigation, focus order, contrast, empty states, and persistence.

### Build order

1. Foundation: routing, tokens, layout, typed fixtures, and test/build tooling.
2. Discovery and shared product cards.
3. Search, URL state, filters, and sorting.
4. Product detail, gallery, variants, and purchase decision.
5. Cart state, drawer, and cart editing.
6. Guest checkout and confirmation.
7. Responsive/accessibility pass, end-to-end test, and polish.

Each phase must work end-to-end before starting the next. Nice-to-have work begins only after the full core journey passes.
