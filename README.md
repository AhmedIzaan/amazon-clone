# Aster Market

A focused ecommerce marketplace prototype built with React, TypeScript, and Vite.

## Live application

**https://ahmedizaan.github.io/amazon-clone/**

The site is public and does not require a GitHub or development-account login. Purchases, authentication, orders, cart contents, comparisons, and recently viewed products are local demo experiences stored only in the current browser.

## Local development

```bash
npm install
npm run dev
```

No environment variables or external services are required. The seeded demo account is `demo@aster.market` with password `demo1234`; do not enter real credentials or payment details.

## Quality checks

```bash
npm run lint
npm test -- --run
npm run build
```

Deployment runs through GitHub Pages whenever `main` is updated. The workflow builds with the repository base path, publishes static assets, and includes an SPA fallback for direct links.
