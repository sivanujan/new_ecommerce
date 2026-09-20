# Phase 1 Design — Headless Jewelry & Saree E-commerce (France)

Date: 2026-09-20
Status: Approved for implementation

## Context

Building a headless e-commerce storefront for a premium jewelry & traditional
wear (sarees) brand selling to customers in France. Catalog scope is similar
to 3eelam.com, but the UI must be distinctive, modern, and premium — not a
generic template. This document scopes **phase 1 only**: a working local
stack with real seed data, a homepage product grid, and one full product
detail page. The full feature list from the original brief (payments,
discounts, GDPR legal pages, full SEO automation, bilingual hreflang, etc.)
is the product vision; only the pieces listed under "Phase 1 scope" below are
built now. Everything else is listed under "Deferred" as a scoped TODO for
later phases.

## Decisions locked in during brainstorming

- **Local infra**: Docker Compose for Postgres 16 + Redis 7 (not native
  installs, not cloud-hosted). Chosen for a clean, disposable setup that
  mirrors production topology.
- **Scope**: Phase 1 only — backend + storefront running locally, real
  seeded jewelry/saree data, homepage grid, one working PDP. Not attempting
  the full feature list in this pass.
- **Credentials**: No live Stripe or Cloudinary keys yet. Payment module
  ships with Medusa's manual/system provider active (so checkout works
  today) and a Stripe provider block wired in but commented out with
  placeholder env vars, so real keys can be dropped in later without
  restructuring. Images use stable hot-linked stock photo URLs instead of
  Cloudinary for now.
- **Seed data**: Custom, realistic seed script — not Medusa's generic demo
  products. Real-feeling French product names/descriptions, EUR pricing,
  proper category tree, and variant patterns for both jewelry and sarees.

## Architecture

Two independent npm projects, not a strict monorepo tool — matches how
`create-medusa-app` scaffolds by default and keeps backend/storefront
independently deployable later.

```
new_ecommerce/
├── docker-compose.yml           # Postgres 16 + Redis 7
├── backend/                     # Medusa v2 backend + admin
│   ├── src/
│   │   ├── modules/             # custom modules (payment swap point lives here)
│   │   ├── scripts/seed.ts      # FR region, TVA 20%, categories, products
│   │   └── ...
│   ├── medusa-config.ts
│   └── .env
└── storefront/                  # Next.js App Router storefront
    ├── app/
    │   ├── (main)/page.tsx                      # homepage — "Signature Range" grid
    │   ├── (main)/produits/[handle]/page.tsx    # PDP, French slugs
    │   ├── (main)/categories/[handle]/page.tsx  # category listing (stretch, if time allows)
    │   └── layout.tsx                            # cookie consent banner mounted here
    ├── modules/                  # UI building blocks: product-card, gallery, price, etc.
    ├── lib/                      # Medusa JS SDK client, data-fetching helpers
    ├── tailwind.config.ts        # dark/gold design tokens, custom type scale
    └── .env.local
```

## Commerce configuration (seed script, not hardcoded UI)

- **Region**: France, currency EUR, TVA (VAT) 20% tax rate applied at both
  product display and checkout/cart totals.
- **Categories**: Sarees, Jewelry → Chains/Chaînes, Pendants/Pendentifs,
  Rings/Bagues. Created via the seed script only — nothing in storefront
  code hardcodes this tree. Category navigation and filtering render from
  whatever the Store API returns, so the admin can add/rename/reorganize
  categories freely from the Medusa admin without any code change.
- **Products**: ~12–15 products with French names and descriptions,
  EUR pricing shown TVA-inclusive, covering both product lines:
  - Jewelry variant pattern: Finish × Weight (e.g. Or 18k / Or 22k,
    5g / 10g).
  - Saree variant pattern: Couleur × Taille.
  Real stock-photo image URLs are attached per product (hot-linked,
  swappable for a Medusa file-module/Cloudinary upload later) so the grid
  and gallery look premium rather than placeholder gray boxes.
- **Payment module**: `pp_system_default` (manual/system provider) active
  so cart → order flow is testable today. A Stripe provider config block is
  present in `medusa-config.ts` but commented out with placeholder env var
  names, documenting the exact swap-in point for real Stripe test keys
  later, and structured so Mollie/PayPal could occupy the same slot.

## Storefront visual direction

Handled by the frontend-design skill during implementation, but the
direction agreed on:

- Near-black charcoal background, refined warm-gold accent (not
  neon/bright yellow gold).
- Serif display typeface for headings (editorial, jewelry-catalog feel)
  paired with a clean grotesk/sans for UI and body text.
- Generous whitespace, restrained motion — subtle hover reveals on product
  cards, not template-style fade-in-everything.
- Explicitly avoid default shadcn/Tailwind-starter look: no default
  indigo-500 accents, no Inter-everywhere, no default rounded-card
  bootstrap aesthetic.

## Phase 1 scope

Included:

1. Docker Compose stack (Postgres + Redis).
2. Medusa v2 backend scaffolded via `create-medusa-app`, configured for
   France/EUR/TVA 20%, custom seed script per above.
3. Homepage with a live "Signature Range" product grid pulled from the
   Medusa Store API (Server Component data fetching, not client-side
   fetch-on-mount).
4. One full product detail page: image gallery, variant selector,
   TVA-inclusive EUR price, stock status, working add-to-cart against a
   real Medusa cart.
5. Per-page SEO metadata (title/description in French) and Product JSON-LD
   on the PDP — cheap and high-value, done now rather than deferred.
6. Basic cookie-consent banner (non-essential cookies declined by default)
   mounted in the root layout.
7. Setup instructions: exact commands to scaffold, configure, seed, and
   run both backend and storefront locally on Windows.

Deferred to later phases (not built now, will be called out as follow-up
work, not silently dropped):

- Full checkout/payment completion UX beyond cart creation.
- Discounts/promotions UI.
- Order-management admin walkthrough.
- Category listing pages beyond the stretch goal above, and search/filter UI.
- Automated sitemap.xml / robots.txt generation.
- Bilingual FR/EN toggle and hreflang tags.
- Final legal-page copy for `/mentions-legales` and
  `/politique-de-confidentialite` (routes scaffolded with placeholder
  structure only — real legal text needs the user's/legal review, will not
  be fabricated).
- Real Stripe/Cloudinary credentials wiring (structure is ready, keys are
  not plugged in).

## Testing / verification approach

- Backend: `medusa develop` boots cleanly, admin reachable, seed script
  runs idempotently against a fresh database via Docker Compose.
- Storefront: `next dev` boots cleanly; homepage renders the seeded
  products; PDP renders for a seeded product handle, add-to-cart creates/
  updates a real cart via the Medusa Store API (verified by inspecting the
  cart in Medusa admin or via API response).
- Manual browser check of both pages per project convention (frontend
  changes must be viewed in a browser, not just type-checked).
