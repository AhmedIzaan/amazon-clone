# Aster Market

> A modern ecommerce marketplace inspired by Amazon's strongest shopping patterns—redesigned with clearer hierarchy, faster decisions, and a calmer checkout.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_Aster-173f35?style=for-the-badge)](https://amazon-clone-eight-kappa.vercel.app)
[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)

## Live demo

**[amazon-clone-eight-kappa.vercel.app](https://amazon-clone-eight-kappa.vercel.app)**

The deployment is public and requires no developer-account login. Everything is a safe, browser-local demo: no real order is placed, no payment is processed, and no sensitive credentials should be entered.

## Product overview

Aster is a focused marketplace prototype covering the complete customer journey:

**discover → search → evaluate → add to cart → checkout → confirmation**

It keeps the information density shoppers expect from a large marketplace while reducing clutter and making comparison, delivery, pricing, and purchase decisions easier to understand.

### Shopping experience

- Responsive marketplace homepage with useful category, recommendation, trending, deal, and recently viewed sections
- Global search with instant product/category suggestions and keyboard navigation
- URL-backed search queries, sorting, filters, active-filter chips, and no-results recovery
- Desktop filter sidebar and a focused mobile filter sheet
- Product pages with image selection, variants, stock feedback, delivery estimates, specifications, reviews, and related products
- Side-by-side comparison for up to three products
- Curated review insights that surface strengths and purchase considerations
- Persistent cart with calm add feedback, quantity editing, savings, delivery progress, and empty states
- Four-stage demo checkout with validation, editable review, totals, and local order confirmation
- Demo account creation/sign-in, profile and address editing, and order history

### Intentional improvements over Amazon

- Cleaner hierarchy with less promotional noise
- Faster, URL-shareable filtering without page reloads
- Clear visual separation between regular prices, genuine savings, stock, and delivery
- Decision-focused comparison and review summaries
- Immediate cart updates without reload-like behavior
- Mobile-specific filter and purchase controls instead of compressed desktop layouts

## Technology

| Area | Implementation |
| --- | --- |
| UI | React 19, TypeScript, semantic HTML |
| Tooling | Vite 8, ESLint |
| Routing | React Router with Vercel SPA rewrites |
| State | Focused React contexts plus versioned browser storage |
| Icons | Lucide React |
| Testing | Vitest, Testing Library, jsdom |
| Hosting | Vercel static deployment |

The application intentionally has no backend or required environment variables. Catalog data is typed and local; cart, account, comparison, recently viewed, checkout draft, and order data are stored in `localStorage` or `sessionStorage` as appropriate.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/AhmedIzaan/amazon-clone.git
cd amazon-clone
npm install
npm run dev
```

Vite will print the local development URL in the terminal.

### Demo account

| Field | Value |
| --- | --- |
| Email | `demo@aster.market` |
| Password | `demo1234` |

The sign-in flow is deliberately local and is not production authentication. Use only the provided or made-up details.

### Demo payment

Checkout is prefilled with clearly marked test data:

- Card number: `4242 4242 4242 4242`
- Expiration: `12/30`
- Security code: `123`

Only the card label and last four digits are retained in a completed local order.

## Available scripts

```bash
npm run dev          # Start the development server
npm run build        # Type-check and create the production build
npm run lint         # Run ESLint
npm test -- --run    # Run the test suite once
npm run preview      # Preview the production build locally
```

## Quality and accessibility

The release flow has been exercised at desktop and mobile viewports across homepage, search, filters, product detail, cart, checkout, confirmation, and account states.

The interface includes visible keyboard focus, semantic landmarks, labelled form controls, accessible dialog behavior, validation feedback, sensible touch targets, reduced-motion support, and recovery paths for empty or invalid states.

See [QA_NOTES.md](./QA_NOTES.md) for the release checklist and [BUILD_PLAN.md](./BUILD_PLAN.md) for scope and product decisions.

## Deployment

Vercel builds the repository as a Vite static application. [`vercel.json`](./vercel.json) rewrites application routes to `index.html`, allowing direct links such as product and checkout routes to load correctly.

No runtime secrets or environment variables are required.

## Demo limitations

- Authentication and account data are browser-local and are not secure production identity flows.
- Orders and payments are simulated; no network request, charge, fulfillment, or email occurs.
- Inventory, delivery estimates, ratings, reviews, and catalog content are deterministic fixtures.
- Clearing browser storage resets saved cart, comparison, account, recently viewed, checkout, and order data.
