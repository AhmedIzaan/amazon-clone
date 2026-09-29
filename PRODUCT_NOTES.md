# Amazon Product Notes

Research date: 2026-09-30  
Scope: live Amazon.com desktop and mobile web, signed out, using an isolated browser profile.

## Main user journey

1. Land on a highly merchandised homepage and confirm the delivery destination.
2. Find a product through dominant global search, autocomplete, a department page, or promotional category cards.
3. Scan results; narrow with filters, sort order, ratings, price, badges, and delivery cues.
4. Evaluate a product through imagery, title, price/discount, ratings, variants, availability, delivery promise, and reviews.
5. Add an eligible configuration to cart, adjust quantity, remove or save it, and review the order subtotal.
6. Sign in or create an account when identity is required, then continue through delivery, payment, review, and order confirmation.
7. Return through account areas for orders, tracking, returns, lists, and repeat purchases.

The core loop is **find → compare → build confidence → confirm fulfillment → commit**. Amazon repeatedly exposes search, ratings, price, and delivery because those four signals answer most purchase questions.

## Most important UI patterns

- A persistent two-level header makes search the strongest control, with delivery location, account, orders, and cart always nearby.
- Homepage content is a dense grid of reusable merchandising cards rather than one editorial story. It maximizes paths into the catalog.
- Autocomplete reduces query effort and exposes adjacent intent before a search is submitted.
- Desktop results pair a left filter rail with compact product cards and a top-right sort control. Mobile replaces much of the rail with horizontally scrollable filter chips.
- Result cards layer title, rating count, price, discount/badge, fulfillment, and variant swatches so users can compare without opening every item.
- Product pages use a three-part decision layout: media gallery, product/variant information, and a separate purchase/availability box.
- Variant choices are visible near the title and price, with unavailable combinations disabled or explained.
- Reviews combine a rating distribution, attribute summaries, customer images, and long-form reviews.
- Fulfillment location is treated as product state, not merely checkout state. It can change availability, shipping language, and whether purchasing controls appear at all.
- Authentication is deferred until account-only actions. The order-history route presents a focused sign-in gate with little surrounding navigation.

## What Amazon does well

- Search and recovery paths are everywhere; it is difficult to become stranded.
- Product cards are dense but highly scannable once the visual grammar is learned.
- Social proof is specific: rating average, count, distribution, customer media, and review detail all reinforce confidence.
- The product page keeps imagery, configuration, and purchase status visible together on desktop.
- Delivery eligibility is surfaced before checkout, preventing a false promise.
- Desktop and mobile preserve the same commerce priorities even though their layouts differ substantially.

## What feels complicated or dated

- The homepage and results pages compete for attention with many equally weighted cards, promotions, badges, and navigation routes.
- Delivery banners, app promotion, navigation, and location controls can consume most of the first mobile viewport.
- The product page mixes critical decisions with secondary metadata, promotional modules, and repeated recommendations.
- Variant cards are information-rich but visually cramped; price changes across variants are harder to compare than necessary.
- Results blend organic listings, sponsored placements, and recommendation modules in a way that weakens hierarchy.
- UI styles vary between newer merchandising surfaces and older account/authentication pages.
- The delivery-location modal did not successfully accept a U.S. ZIP in this research environment and gave no useful validation feedback.

## Essential for our clone

- Responsive global header with search, autocomplete, account, and cart count.
- A believable homepage with reusable category and product merchandising sections.
- Search results backed by real local filtering and sorting, not decorative controls.
- Product cards with image, title, rating, price/discount, availability, and a clear action.
- Product detail page with gallery, variants, price hierarchy, rating/review summary, delivery estimate, stock state, and add-to-cart.
- Persistent cart with quantity changes, removal, subtotal, and a saved-for-later affordance.
- Lightweight sign-in/sign-up screens and a checkout shell that demonstrates address, delivery, payment, and review steps without processing a real order.
- Responsive layouts that intentionally reorder information rather than merely shrinking desktop screens.

## Features we can fake or simplify

- Use a curated local catalog and deterministic autocomplete instead of a search service.
- Simulate stock, delivery dates, discounts, and review aggregates in fixture data.
- Support a small, explicit set of variants per product.
- Keep one seller and one fulfillment method per product.
- Persist cart and a demo account locally; checkout can end at a non-transactional review/confirmation screen.
- Use a handful of authored reviews and a static rating distribution.
- Provide one demo delivery region with a clear switcher instead of real postal-code logistics.

## Features to leave out

- Real payments, taxes, fraud checks, address validation, or order placement.
- Marketplace seller comparison and seller-performance systems.
- Prime membership, subscriptions, financing, coupons, gift cards, and loyalty programs.
- Personalized recommendation models, sponsored ads, and behavioral targeting.
- International catalog/currency support and complex cross-border eligibility.
- Full returns, customer support, notifications, and shipment tracking.
- Voice shopping, live video, and large secondary ecosystems such as streaming.

These add breadth or operational complexity but do not materially improve an ecommerce UI submission.

## Opportunities to feel better than Amazon

1. **Calmer hierarchy:** use fewer simultaneous promotions and reserve strong color for price, availability, and the primary action.
2. **Clearer comparison:** make variants and their price/stock differences readable in one compact selector.
3. **Better refinement:** use the same understandable filter model on desktop and mobile, with active filters visible and easy to clear.
4. **More transparent fulfillment:** explain location, stock, and delivery together without blocking the page with repeated banners.
5. **Cleaner checkout:** keep a persistent order summary and show progress in a short, predictable sequence.

## Research evidence and limits

Screenshots are in `research/amazon/screenshots/` and cover homepage, navigation drawer, autocomplete, category browsing, default and sorted results, product detail, gallery, reviews, delivery-location selection, empty cart, authentication/order gate, and desktop/mobile variants.

Amazon initially returned its normal JavaScript verification challenge; waiting in Chrome completed it without bypassing the control. The active destination was Pakistan. The researched product was unavailable for that destination, and Amazon ignored attempts to switch the isolated session to ZIP `10001` without showing a validation error. As a result, add-to-cart, quantity editing, saved-for-later, and checkout could not be truthfully inspected beyond the empty cart and sign-in/account gate. No account was created and no order was placed.
