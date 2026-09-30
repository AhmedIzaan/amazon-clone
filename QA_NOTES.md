# QA checklist

Release-candidate review completed at **1440 × 1000 desktop** and **390 × 844 mobile**. The full journey was exercised from discovery through a locally saved demo order, followed by the account flow.

## Core journey

- [x] Homepage loads without horizontal overflow; merchandising sections have a clear purpose and equal-height cards within each grid.
- [x] Header search exposes labelled, keyboard-navigable suggestions and preserves the query in the results URL.
- [x] Search count, sorting, filters, active chips, clear controls, and the no-results state respond without a reload.
- [x] Mobile filters open as a scrollable modal sheet, lock background scrolling, close with Escape, and return focus to the trigger.
- [x] Product detail communicates price, savings, variants, delivery, stock, reviews, and specifications before purchase.
- [x] Add-to-cart feedback is immediate; header count, cart quantity, subtotal, savings, and persistence stay in sync.
- [x] Checkout validates address and demo-payment fields, preserves step data when going backward, and calculates shipping and tax.
- [x] Placing an order clears the active cart, stores only the payment method and last four digits, and produces a retrievable confirmation.
- [x] Sign in, password visibility, profile saving, order history, signed-in navigation, and sign out work on desktop and mobile.

## Responsive and visual review

- [x] No horizontal overflow found on homepage, search, product, cart, checkout, confirmation, or account pages.
- [x] Search result cards remain equal height at each tested width; intentionally compact homepage cards are consistent within their own section.
- [x] Mobile product purchase and comparison bars do not overlap; checkout collapses to one column.
- [x] Typography, spacing, borders, prices, savings, stock, and delivery treatments remain consistent across the journey.
- [x] Mobile header cart target is at least 44 × 44 px; forms and primary actions use sensible touch targets.
- [x] Representative desktop and mobile states were visually inspected for clipping, layout shifts, and awkward whitespace.

## Accessibility and resilience

- [x] Skip link, semantic headings, labelled form controls, live result counts, focus styles, and useful accessible names are present.
- [x] Filter and comparison dialogs support Escape, initial focus, focus return, and background scroll locking.
- [x] Checkout uses one document-level main landmark; invalid submission focuses the first field needing attention.
- [x] Empty cart, empty checkout, no search results, missing order, and no order-history states provide a useful next action.
- [x] Local-only actions expose loading states where delay is simulated; catalog, cart, and checkout calculations are synchronous and do not add artificial loaders.
- [x] No application console errors or warnings appeared during the walkthrough.

## Issues fixed in this pass

- [x] **Lost filter state during rapid changes:** URL updates now derive from the latest search parameters, so applying a filter and immediately sorting no longer drops the filter.
- [x] **No-results dead end:** an impossible query with no active filters now offers **Browse all products** instead of a no-op **Clear filters** button.
- [x] **Misleading category navigation:** **Today's finds** now opens actual discounted products instead of adding an unsupported category value.
- [x] **Misleading account affordance:** removed the dropdown chevron because the account control navigates to a page rather than opening a menu.
- [x] **Checkout landmark and validation focus:** removed the nested main landmark and move focus to the first invalid address or payment field.
- [x] **Small mobile cart target:** expanded the cart link to a consistent minimum touch target.

## Accepted demo constraints

- Authentication, orders, recently viewed products, comparison selections, and the cart are browser-local by design.
- Catalog imagery and data are authored fixtures; checkout never contacts a payment service or stores a full card number.
- Product/catalog reads are synchronous, so skeletons are demonstrated by the component system but are not artificially shown during navigation.
