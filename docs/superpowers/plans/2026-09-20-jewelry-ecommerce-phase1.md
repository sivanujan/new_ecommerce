# Jewelry & Saree Storefront — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a working local Medusa v2 backend (France/EUR/TVA 20%) and a distinctive dark-and-gold Next.js storefront with a live homepage product grid and one full product detail page.

**Architecture:** Docker Compose runs Postgres + Redis. `create-medusa-app` scaffolds the Medusa backend (current tool version nests it at `<project>/apps/backend` — see Global Constraints). A plain `create-next-app` project at `storefront/` (sibling to the backend project, NOT the medusa starter clone) talks to the backend exclusively through the Medusa Store API via `@medusajs/js-sdk`, so the UI is built entirely from scratch per the premium dark/gold direction instead of reskinning the default community storefront template.

**Tech Stack:** Medusa v2, PostgreSQL 16, Redis 7, Next.js 16 (App Router, Tailwind CSS v4), `@medusajs/js-sdk`, Docker Compose.

**Spec:** `docs/superpowers/specs/2026-09-20-jewelry-ecommerce-phase1-design.md`

## Global Constraints

- Region: France only, currency EUR, TVA (tax) rate 20%, applied and displayed inclusive of tax.
- Categories/products are created only by the seed script — no category names are hardcoded in storefront UI logic; the storefront always renders whatever the Store API returns.
- No live Stripe or Cloudinary credentials exist yet. Payment module ships with `pp_system_default` (manual/system provider) active; a Stripe provider block is present in `medusa-config.ts` but commented out with placeholder env var names. Images are stable hot-linked stock photo URLs (verified reachable during planning), not Cloudinary uploads.
- **Tool-behavior correction from the approved spec:** the spec described `backend/` and `storefront/` as flat sibling folders. The current `create-medusa-app` CLI always nests the backend under `<project-name>/apps/backend` (a pnpm-workspace monorepo layout), even without the Next.js starter flag. This plan uses project name `medusa` for that scaffold, so the real backend root is `medusa/apps/backend/`. The storefront remains a true sibling at `storefront/` because it is scaffolded independently with `create-next-app`, not via the medusa monorepo. This is a path-only correction — no feature or design scope changed.
- Deferred (do not build in this plan): full checkout/payment completion UX, discounts UI, order-management walkthrough, category listing/search pages, sitemap.xml/robots.txt automation, bilingual FR/EN toggle + hreflang, final legal-page copy, real Stripe/Cloudinary keys.
- Windows/PowerShell + Git Bash environment. Node v24.19.0, npm 11.8.0, Docker 29.1.2, corepack 0.35.0 confirmed installed; pnpm is NOT installed (needed only for the backend monorepo's own install step — enabled via corepack in Task 2).

---

### Task 1: Docker Compose Infrastructure (Postgres + Redis)

**Files:**
- Create: `docker-compose.yml`
- Create: `.gitignore` (repo root)

**Interfaces:**
- Produces: Postgres reachable at `postgres://medusa:medusa@localhost:5432/medusa`; Redis reachable at `redis://localhost:6379`. Every later task that talks to the database or Redis uses these exact URLs.

- [ ] **Step 1: Create the repo-root `.gitignore`**

```gitignore
node_modules/
.env
.env.local
.medusa/
dist/
.next/
*.log
```

- [ ] **Step 2: Write `docker-compose.yml`**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: bijoux_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: medusa
      POSTGRES_PASSWORD: medusa
      POSTGRES_DB: medusa
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U medusa -d medusa"]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    container_name: bijoux_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:
  redis_data:
```

- [ ] **Step 3: Start the stack and verify both services are healthy**

Run: `docker compose up -d`
Then: `docker compose ps`
Expected: both `bijoux_postgres` and `bijoux_redis` show `healthy` in the STATUS column (wait a few seconds and re-run `docker compose ps` if they still show `starting`).

- [ ] **Step 4: Verify connectivity from the host**

Run: `docker exec bijoux_postgres pg_isready -U medusa -d medusa`
Expected: `accepting connections`

Run: `docker exec bijoux_redis redis-cli ping`
Expected: `PONG`

- [ ] **Step 5: Commit**

```bash
git add docker-compose.yml .gitignore
git commit -m "Add Docker Compose stack for Postgres and Redis"
```

---

### Task 2: Scaffold Medusa Backend

**Files:**
- Create: `medusa/apps/backend/**` (generated by `create-medusa-app`, project name `medusa`)
- Modify: `medusa/apps/backend/.env`
- Modify: `medusa/apps/backend/medusa-config.ts`

**Interfaces:**
- Produces: a bootable Medusa backend at `medusa/apps/backend` configured against the Task 1 Postgres/Redis instances, with CORS open to `http://localhost:3000` (the storefront) and `http://localhost:9000` (admin), and a payment module with `pp_system_default` active plus a commented Stripe block.

- [ ] **Step 1: Enable pnpm via corepack** (the scaffold's monorepo tooling expects pnpm)

Run: `corepack enable`
Run: `corepack prepare pnpm@latest --activate`
Verify: `pnpm -v` prints a version number.

- [ ] **Step 2: Scaffold the backend, skipping DB creation** (avoids the known `--db-url` interactive-prompt bug in some CLI versions — we set the DB URL ourselves in Step 3 instead)

From the `new_ecommerce/` repo root, run:

```bash
npx create-medusa-app@latest medusa --skip-db --no-browser --verbose
```

When prompted for anything interactive despite the flags (older CLI builds sometimes still ask), answer: project name `medusa` (if asked again), and decline any storefront-install prompt (answer `n`) — the storefront is built separately in Task 5.

Expected result: a new `medusa/apps/backend/` directory containing `medusa-config.ts`, `src/`, `package.json`.

- [ ] **Step 3: Point the backend at the Docker Compose services**

Read the generated `medusa/apps/backend/.env` and replace/add these values:

```
DATABASE_URL=postgres://medusa:medusa@localhost:5432/medusa
REDIS_URL=redis://localhost:6379
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:3000,http://localhost:9000
JWT_SECRET=dev_jwt_secret_change_in_production
COOKIE_SECRET=dev_cookie_secret_change_in_production
# STRIPE_API_KEY=sk_test_placeholder
```

- [ ] **Step 4: Wire Redis modules and the payment module into `medusa-config.ts`**

Open `medusa/apps/backend/medusa-config.ts` and update the `modules` array (keep any modules the scaffold already added; add these):

```typescript
import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: { redisUrl: process.env.REDIS_URL },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: { redisUrl: process.env.REDIS_URL },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: { redis: { redisUrl: process.env.REDIS_URL } },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // pp_system_default (manual/system provider) is registered
          // automatically and needs no entry here — it is the active
          // provider for phase 1.
          //
          // Swap-in point for a real gateway once credentials exist.
          // Uncomment to activate Stripe (needs STRIPE_API_KEY in .env):
          // {
          //   resolve: "@medusajs/medusa/payment-stripe",
          //   id: "stripe",
          //   options: {
          //     apiKey: process.env.STRIPE_API_KEY,
          //   },
          // },
        ],
      },
    },
  ],
})
```

- [ ] **Step 5: Boot the backend against the real database and confirm it starts cleanly**

From `medusa/apps/backend/`, run: `pnpm install` (if the scaffold didn't already install), then `npx medusa db:migrate`
Expected: migration log ends without errors (this also creates the schema in the `medusa` database from Task 1).

Run: `npx medusa develop`
Expected: log shows `Server is ready on port: 9000` with no unhandled errors. Stop it with Ctrl+C once confirmed — later tasks restart it as needed.

- [ ] **Step 6: Commit**

```bash
git add medusa/apps/backend/medusa-config.ts
git commit -m "Scaffold Medusa v2 backend, wire Redis modules and payment module"
```

(`.env` stays untracked per `.gitignore`.)

---

### Task 3: Admin User

**Files:**
- No new files — CLI-only step against the already-migrated database.

**Interfaces:**
- Produces: an admin login the user can use at `http://localhost:9000/app` to verify the seed data from Task 4 and manage the catalog going forward.

- [ ] **Step 1: Create the admin user**

From `medusa/apps/backend/`, run:

```bash
npx medusa user -e admin@bijoux-de-france.local -p ChangeMe123!
```

Expected: confirmation log that the user was created.

- [ ] **Step 2: Verify login works**

Run: `npx medusa develop` (leave it running in this step)
In a browser, open `http://localhost:9000/app`, log in with the credentials above.
Expected: admin dashboard loads with an empty catalog (no products yet — that's Task 4).
Stop the dev server once confirmed.

No commit — no files changed.

---

### Task 4: Custom Seed Script (France region, TVA 20%, categories, products)

**Files:**
- Modify: `medusa/apps/backend/src/scripts/seed.ts` (replace the scaffold's default seed content entirely)

**Interfaces:**
- Consumes: the Medusa module container pattern from Task 2 (`ExecArgs`, `container.resolve`).
- Produces: one region "France" (EUR, TVA 20%), one stock location, one sales channel, one publishable API key, categories `Sarees` and `Bijoux` (with children `Chaînes`, `Pendentifs`, `Bagues`), and 12 published products with realistic French names/descriptions/prices/variants/images/inventory. Task 5 onward reads this data through the Store API — no other task depends on internal seed variable names.

- [ ] **Step 1: Replace `medusa/apps/backend/src/scripts/seed.ts` with the full custom seed**

```typescript
import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedJewelryAndSareeData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const taxModuleService = container.resolve(Modules.TAX)

  logger.info("Seeding sales channel...")
  let [salesChannel] = await salesChannelModuleService.listSalesChannels({
    name: "Boutique en ligne",
  })
  if (!salesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Boutique en ligne" }] },
    })
    salesChannel = result[0]
  }

  logger.info("Seeding France region...")
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "France",
          currency_code: "eur",
          countries: ["fr"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  })
  const region = regionResult[0]

  logger.info("Seeding TVA (20%) tax region...")
  const { result: taxRegionResult } = await createTaxRegionsWorkflow(
    container
  ).run({
    input: [{ country_code: "fr", provider_id: "tp_system" }],
  })
  const taxRegion = taxRegionResult[0]
  await taxModuleService.createTaxRates([
    {
      tax_region_id: taxRegion.id,
      rate: 20,
      code: "TVA",
      name: "TVA",
      is_default: true,
    },
  ])

  logger.info("Seeding stock location...")
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Entrepôt France",
          address: {
            city: "Paris",
            country_code: "fr",
            address_1: "1 Rue de la Paix",
          },
        },
      ],
    },
  })
  const stockLocation = stockLocationResult[0]

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  logger.info("Seeding fulfillment data...")
  const { result: shippingProfileResult } = await createShippingProfilesWorkflow(
    container
  ).run({
    input: { data: [{ name: "Profil de livraison par défaut", type: "default" }] },
  })
  const shippingProfile = shippingProfileResult[0]

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Livraison France",
    type: "shipping",
    service_zones: [
      { name: "France métropolitaine", geo_zones: [{ country_code: "fr", type: "country" }] },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  })

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Livraison standard",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Standard", description: "Livraison en 3 à 5 jours ouvrés", code: "standard" },
        prices: [{ currency_code: "eur", amount: 4.9 }],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Livraison express",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: { label: "Express", description: "Livraison en 24 à 48h", code: "express" },
        prices: [{ currency_code: "eur", amount: 9.9 }],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [salesChannel.id] },
  })

  logger.info("Seeding publishable API key...")
  const { data: existingKeys } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: { type: "publishable" },
  })
  let publishableApiKey = existingKeys?.[0]
  if (!publishableApiKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{ title: "Storefront France", type: "publishable", created_by: "" }],
      },
    })
    publishableApiKey = result[0]
  }
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [salesChannel.id] },
  })
  logger.info(`Publishable API key: ${publishableApiKey.id}`)

  logger.info("Seeding categories...")
  const { result: categories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Sarees", is_active: true },
        { name: "Bijoux", is_active: true },
      ],
    },
  })
  const bijouxCategory = categories.find((c) => c.name === "Bijoux")!
  const sareesCategory = categories.find((c) => c.name === "Sarees")!

  const { result: subCategories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Chaînes", is_active: true, parent_category_id: bijouxCategory.id },
        { name: "Pendentifs", is_active: true, parent_category_id: bijouxCategory.id },
        { name: "Bagues", is_active: true, parent_category_id: bijouxCategory.id },
      ],
    },
  })
  const chainesCategory = subCategories.find((c) => c.name === "Chaînes")!
  const pendentifsCategory = subCategories.find((c) => c.name === "Pendentifs")!
  const baguesCategory = subCategories.find((c) => c.name === "Bagues")!

  logger.info("Seeding products...")
  const img = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80`

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Collier Aanya",
          handle: "collier-aanya",
          category_ids: [chainesCategory.id],
          description:
            "Un collier raffiné en or, à la chaîne fine et lumineuse. Pièce intemporelle pour sublimer un décolleté au quotidien comme lors des grandes occasions.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: img("photo-1611591437281-460bfbe1220a") },
            { url: img("photo-1515562141207-7a88fb7ce338") },
          ],
          options: [
            { title: "Finition", values: ["Or jaune 18k", "Or rose 18k"] },
            { title: "Poids", values: ["5g", "8g"] },
          ],
          variants: [
            { title: "Or jaune 18k / 5g", sku: "COL-AANYA-OJ-5", options: { Finition: "Or jaune 18k", Poids: "5g" }, weight: 5, prices: [{ amount: 129, currency_code: "eur" }] },
            { title: "Or jaune 18k / 8g", sku: "COL-AANYA-OJ-8", options: { Finition: "Or jaune 18k", Poids: "8g" }, weight: 8, prices: [{ amount: 179, currency_code: "eur" }] },
            { title: "Or rose 18k / 5g", sku: "COL-AANYA-OR-5", options: { Finition: "Or rose 18k", Poids: "5g" }, weight: 5, prices: [{ amount: 139, currency_code: "eur" }] },
            { title: "Or rose 18k / 8g", sku: "COL-AANYA-OR-8", options: { Finition: "Or rose 18k", Poids: "8g" }, weight: 8, prices: [{ amount: 189, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Chaîne Kavya",
          handle: "chaine-kavya",
          category_ids: [chainesCategory.id],
          description:
            "Chaîne minimaliste au maillon serpentin, disponible en or jaune ou argent. Se porte seule ou superposée avec vos pendentifs préférés.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: img("photo-1601121141461-9d6647bca1ed") }],
          options: [{ title: "Finition", values: ["Or jaune 18k", "Argent 925"] }],
          variants: [
            { title: "Or jaune 18k", sku: "CHA-KAVYA-OJ", options: { Finition: "Or jaune 18k" }, weight: 6, prices: [{ amount: 89, currency_code: "eur" }] },
            { title: "Argent 925", sku: "CHA-KAVYA-AG", options: { Finition: "Argent 925" }, weight: 6, prices: [{ amount: 59, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Pendentif Meera",
          handle: "pendentif-meera",
          category_ids: [pendentifsCategory.id],
          description:
            "Pendentif ciselé à la main, inspiré des motifs traditionnels indiens. Un point focal délicat qui se marie avec toutes nos chaînes.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: img("photo-1599643478518-a784e5dc4c8f") },
            { url: img("photo-1573408301185-9146fe634ad0") },
          ],
          options: [{ title: "Finition", values: ["Or jaune 18k", "Or rose 18k"] }],
          variants: [
            { title: "Or jaune 18k", sku: "PEN-MEERA-OJ", options: { Finition: "Or jaune 18k" }, weight: 4, prices: [{ amount: 99, currency_code: "eur" }] },
            { title: "Or rose 18k", sku: "PEN-MEERA-OR", options: { Finition: "Or rose 18k" }, weight: 4, prices: [{ amount: 109, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Pendentif Ananya Lotus",
          handle: "pendentif-ananya-lotus",
          category_ids: [pendentifsCategory.id],
          description:
            "Pendentif en forme de fleur de lotus, symbole de pureté et d'élégance. Fini à la main en or jaune 18 carats.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: img("photo-1587467512961-120760940315") }],
          options: [{ title: "Finition", values: ["Or jaune 18k"] }],
          variants: [
            { title: "Or jaune 18k", sku: "PEN-ANANYA-OJ", options: { Finition: "Or jaune 18k" }, weight: 5, prices: [{ amount: 119, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Bague Ishani",
          handle: "bague-ishani",
          category_ids: [baguesCategory.id],
          description:
            "Bague fine à l'anneau texturé, pensée pour un port quotidien ou en superposition. Disponible en trois tailles.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: img("photo-1611652022419-a9419f74343d") },
            { url: img("photo-1610694955371-d4a3e0ce4b52") },
          ],
          options: [{ title: "Taille", values: ["52", "54", "56"] }],
          variants: [
            { title: "Taille 52", sku: "BAG-ISHANI-52", options: { Taille: "52" }, weight: 3, prices: [{ amount: 179, currency_code: "eur" }] },
            { title: "Taille 54", sku: "BAG-ISHANI-54", options: { Taille: "54" }, weight: 3, prices: [{ amount: 179, currency_code: "eur" }] },
            { title: "Taille 56", sku: "BAG-ISHANI-56", options: { Taille: "56" }, weight: 3, prices: [{ amount: 179, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Bague Priya Solitaire",
          handle: "bague-priya-solitaire",
          category_ids: [baguesCategory.id],
          description:
            "Bague solitaire sertie d'une pierre unique, montée sur un anneau en or jaune 18 carats. Une pièce d'exception pour les grandes occasions.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: img("photo-1535632066927-ab7c9ab60908") }],
          options: [{ title: "Taille", values: ["52", "54", "56"] }],
          variants: [
            { title: "Taille 52", sku: "BAG-PRIYA-52", options: { Taille: "52" }, weight: 4, prices: [{ amount: 249, currency_code: "eur" }] },
            { title: "Taille 54", sku: "BAG-PRIYA-54", options: { Taille: "54" }, weight: 4, prices: [{ amount: 249, currency_code: "eur" }] },
            { title: "Taille 56", sku: "BAG-PRIYA-56", options: { Taille: "56" }, weight: 4, prices: [{ amount: 249, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Saree Ananya Soie",
          handle: "saree-ananya-soie",
          category_ids: [sareesCategory.id],
          description:
            "Saree en soie pure, tissé avec une bordure brodée à la main. Un drapé fluide et une brillance naturelle pour les cérémonies.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: img("photo-1519345182560-3f2917c472ef") },
            { url: img("photo-1617038220319-276d3cfab638") },
          ],
          options: [
            { title: "Couleur", values: ["Rouge rubis", "Bleu paon", "Vert émeraude"] },
            { title: "Taille", values: ["Standard"] },
          ],
          variants: [
            { title: "Rouge rubis", sku: "SAR-ANANYA-RR", options: { Couleur: "Rouge rubis", Taille: "Standard" }, prices: [{ amount: 149, currency_code: "eur" }] },
            { title: "Bleu paon", sku: "SAR-ANANYA-BP", options: { Couleur: "Bleu paon", Taille: "Standard" }, prices: [{ amount: 149, currency_code: "eur" }] },
            { title: "Vert émeraude", sku: "SAR-ANANYA-VE", options: { Couleur: "Vert émeraude", Taille: "Standard" }, prices: [{ amount: 149, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Saree Meera Banarasi",
          handle: "saree-meera-banarasi",
          category_ids: [sareesCategory.id],
          description:
            "Saree Banarasi tissé de motifs dorés traditionnels. Un savoir-faire artisanal transmis de génération en génération.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: img("photo-1620656798579-1984d9e87df7") }],
          options: [{ title: "Couleur", values: ["Or antique", "Rose poudré"] }],
          variants: [
            { title: "Or antique", sku: "SAR-MEERA-OA", options: { Couleur: "Or antique" }, prices: [{ amount: 189, currency_code: "eur" }] },
            { title: "Rose poudré", sku: "SAR-MEERA-RP", options: { Couleur: "Rose poudré" }, prices: [{ amount: 189, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Saree Kavya Georgette",
          handle: "saree-kavya-georgette",
          category_ids: [sareesCategory.id],
          description:
            "Saree en georgette léger, fluide et facile à draper. Idéal pour une allure élégante au quotidien.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: img("photo-1609357605129-26f69add5d6e") }],
          options: [{ title: "Couleur", values: ["Bleu nuit", "Bordeaux"] }],
          variants: [
            { title: "Bleu nuit", sku: "SAR-KAVYA-BN", options: { Couleur: "Bleu nuit" }, prices: [{ amount: 99, currency_code: "eur" }] },
            { title: "Bordeaux", sku: "SAR-KAVYA-BX", options: { Couleur: "Bordeaux" }, prices: [{ amount: 99, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Saree Ishani Chiffon",
          handle: "saree-ishani-chiffon",
          category_ids: [sareesCategory.id],
          description:
            "Saree en chiffon vaporeux, orné d'une bordure fine. Une pièce légère pour les journées de fête.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: img("photo-1618221469555-7f3ad97540d6") }],
          options: [{ title: "Couleur", values: ["Ivoire", "Corail"] }],
          variants: [
            { title: "Ivoire", sku: "SAR-ISHANI-IV", options: { Couleur: "Ivoire" }, prices: [{ amount: 89, currency_code: "eur" }] },
            { title: "Corail", sku: "SAR-ISHANI-CO", options: { Couleur: "Corail" }, prices: [{ amount: 89, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Saree Priya Brodé",
          handle: "saree-priya-brode",
          category_ids: [sareesCategory.id],
          description:
            "Saree richement brodé à la main, rehaussé de fils dorés. Une pièce de collection pour les grandes célébrations.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: img("photo-1611085583191-a3b181a88401") }],
          options: [{ title: "Couleur", values: ["Doré"] }],
          variants: [
            { title: "Doré", sku: "SAR-PRIYA-DO", options: { Couleur: "Doré" }, prices: [{ amount: 219, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Saree Tara Coton",
          handle: "saree-tara-coton",
          category_ids: [sareesCategory.id],
          description:
            "Saree en coton doux, parfait pour un usage quotidien. Confortable, respirant et facile d'entretien.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: img("photo-1600721391776-b5cd0e0048f9") },
            { url: img("photo-1611955167811-4711904bb9f8") },
          ],
          options: [{ title: "Couleur", values: ["Blanc cassé", "Terracotta"] }],
          variants: [
            { title: "Blanc cassé", sku: "SAR-TARA-BC", options: { Couleur: "Blanc cassé" }, prices: [{ amount: 69, currency_code: "eur" }] },
            { title: "Terracotta", sku: "SAR-TARA-TC", options: { Couleur: "Terracotta" }, prices: [{ amount: 69, currency_code: "eur" }] },
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
      ],
    },
  })
  logger.info("Finished seeding products.")

  logger.info("Seeding inventory levels...")
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })
  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 25,
        inventory_item_id: item.id,
      })),
    },
  })
  logger.info("Seed complete.")
}
```

- [ ] **Step 2: Run the seed script**

From `medusa/apps/backend/`, run:

```bash
npx medusa exec ./src/scripts/seedJewelryAndSareeData.ts
```

Wait — the file is `seed.ts`; Medusa's `exec` runs whatever default export the path resolves to, so run:

```bash
npx medusa exec ./src/scripts/seed.ts
```

Expected: log lines for each seeding phase ending with `Seed complete.` and no thrown errors.

If `taxModuleService.createTaxRates` reports a TypeScript or runtime field mismatch, open `node_modules/@medusajs/framework/dist/types` (or run `npx tsc --noEmit` in `medusa/apps/backend`) to see the real `CreateTaxRateDTO` shape, and adjust the object's field names to match — the intent (one default TaxRate of `rate: 20` linked to the France `tax_region_id`) stays the same.

- [ ] **Step 3: Verify in the admin**

Run: `npx medusa develop`, open `http://localhost:9000/app`, log in, and check: Settings → Regions shows "France" (EUR); Products lists 12 published products; Categories shows Sarees and Bijoux (with 3 children).
Stop the dev server once confirmed.

- [ ] **Step 4: Commit**

```bash
git add medusa/apps/backend/src/scripts/seed.ts
git commit -m "Add custom seed script: France region, TVA 20%, jewelry/saree catalog"
```

---

### Task 5: Scaffold Storefront + Premium Dark/Gold Design Tokens

> Before writing any UI in this or later storefront tasks, invoke the `frontend-design` skill to guide the actual visual execution — this task lays down the token/font plumbing the design needs, not the final creative polish.

**Files:**
- Create: `storefront/**` (generated by `create-next-app`)
- Modify: `storefront/app/globals.css`
- Modify: `storefront/app/layout.tsx`
- Create: `storefront/.env.local`

**Interfaces:**
- Produces: Tailwind v4 theme tokens (`--color-ink`, `--color-surface`, `--color-gold`, `--color-gold-soft`, `--color-parchment`, `--color-muted`) and two `next/font/google` fonts (`Fraunces` display serif exposed as `--font-display`, `Manrope` body sans exposed as `--font-body`) available globally. Every later storefront task styles with these tokens instead of raw hex values or default Tailwind grays/blues.

- [ ] **Step 1: Scaffold the Next.js project**

From the `new_ecommerce/` repo root, run:

```bash
npx create-next-app@latest storefront --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --turbopack
```

Expected: `storefront/` created with `app/`, `package.json`, `next.config.ts`.

- [ ] **Step 2: Install the Medusa JS SDK**

From `storefront/`, run: `npm install @medusajs/js-sdk`

- [ ] **Step 3: Allow-list the seed images' domain for `next/image`**

`next/image` refuses to optimize images from a domain that isn't explicitly allowed. All seed product images (Task 4) are hot-linked from `images.unsplash.com`, so replace the contents of `storefront/next.config.ts` with:

```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 4: Create `storefront/.env.local`**

```
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=REPLACE_WITH_KEY_FROM_TASK_4_STEP_2_LOG_OUTPUT
```

Copy the publishable key printed by the seed script log (`Publishable API key: pk_...`) into this file.

- [ ] **Step 5: Confirm the generated Tailwind version, then set design tokens**

Run: `npm ls tailwindcss` — expect a `4.x` version. If it prints `3.x` instead, add the tokens to `tailwind.config.ts` under `theme.extend.colors`/`theme.extend.fontFamily` instead of the CSS block below, using the same token names.

For Tailwind v4 (expected case), replace the contents of `storefront/app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-ink: #0b0b0d;
  --color-surface: #141417;
  --color-surface-raised: #1c1c20;
  --color-gold: #c6a15b;
  --color-gold-soft: #d8b876;
  --color-parchment: #f5f0e6;
  --color-muted: #a8a29a;

  --font-display: var(--font-fraunces);
  --font-body: var(--font-manrope);
}

body {
  background-color: var(--color-ink);
  color: var(--color-parchment);
}
```

- [ ] **Step 6: Load the two fonts in the root layout**

Replace the contents of `storefront/app/layout.tsx`:

```tsx
import type { Metadata } from "next"
import { Fraunces, Manrope } from "next/font/google"
import "./globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Maison Bijoux & Sarees",
    template: "%s | Maison Bijoux & Sarees",
  },
  description:
    "Bijoux en or et sarees traditionnels, sélectionnés pour leur élégance intemporelle. Livraison en France.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${manrope.variable} font-[family-name:var(--font-body)] antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Verify the dev server boots with the new theme**

Run: `npm run dev`
Open `http://localhost:3000` — expected: near-black background, default Next.js starter content still visible (it gets replaced in Task 7), rendered in the Manrope body font.
Stop the dev server once confirmed.

- [ ] **Step 8: Commit**

```bash
git add storefront/app/globals.css storefront/app/layout.tsx storefront/next.config.ts storefront/package.json storefront/package-lock.json
git commit -m "Scaffold Next.js storefront with dark/gold Tailwind v4 theme tokens"
```

(`.env.local` stays untracked per `.gitignore`.)

---

### Task 6: Medusa Store API Client Library

**Files:**
- Create: `storefront/lib/medusa.ts`
- Create: `storefront/lib/regions.ts`
- Create: `storefront/lib/products.ts`
- Create: `storefront/lib/format.ts`
- Test: `storefront/lib/format.test.ts`

**Interfaces:**
- Produces:
  - `sdk` (default Medusa JS SDK client instance) from `lib/medusa.ts`.
  - `getFranceRegion(): Promise<HttpTypes.StoreRegion>` from `lib/regions.ts`.
  - `listSignatureProducts(regionId: string): Promise<HttpTypes.StoreProduct[]>` and `getProductByHandle(handle: string, regionId: string): Promise<HttpTypes.StoreProduct | null>` from `lib/products.ts`.
  - `formatPriceEUR(amount: number): string` from `lib/format.ts` — Tasks 7 and 8 both import this for TVA-inclusive price display.
- Consumes: `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` and `MEDUSA_BACKEND_URL` from `.env.local` (Task 5).

- [ ] **Step 1: Write the failing test for price formatting**

```typescript
// storefront/lib/format.test.ts
import assert from "node:assert"
import { test } from "node:test"
import { formatPriceEUR } from "./format"

test("formats a whole-euro amount with the euro sign and TTC suffix", () => {
  assert.strictEqual(formatPriceEUR(129), "129,00 €")
})

test("formats a decimal amount correctly", () => {
  assert.strictEqual(formatPriceEUR(4.9), "4,90 €")
})
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `node --test --experimental-strip-types lib/format.test.ts` (from `storefront/`)
Expected: FAIL — `Cannot find module './format'`.

- [ ] **Step 3: Implement `lib/format.ts`**

```typescript
export function formatPriceEUR(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}
```

- [ ] **Step 4: Run the test again and confirm it passes**

Run: `node --test --experimental-strip-types lib/format.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Write the SDK client**

```typescript
// storefront/lib/medusa.ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
```

- [ ] **Step 6: Write the region lookup**

```typescript
// storefront/lib/regions.ts
import { HttpTypes } from "@medusajs/types"
import { sdk } from "./medusa"

export async function getFranceRegion(): Promise<HttpTypes.StoreRegion> {
  const { regions } = await sdk.store.region.list()
  const france = regions.find((r) => r.countries?.some((c) => c.iso_2 === "fr"))
  if (!france) {
    throw new Error("No region configured for France — run the backend seed script first.")
  }
  return france
}
```

- [ ] **Step 7: Write the product data functions**

```typescript
// storefront/lib/products.ts
import { HttpTypes } from "@medusajs/types"
import { sdk } from "./medusa"

const PRODUCT_FIELDS =
  "*variants.calculated_price,*variants.inventory_quantity,*variants.options,*options,*images"

export async function listSignatureProducts(
  regionId: string
): Promise<HttpTypes.StoreProduct[]> {
  const { products } = await sdk.store.product.list({
    region_id: regionId,
    limit: 8,
    fields: PRODUCT_FIELDS,
  })
  return products
}

export async function getProductByHandle(
  handle: string,
  regionId: string
): Promise<HttpTypes.StoreProduct | null> {
  const { products } = await sdk.store.product.list({
    handle,
    region_id: regionId,
    limit: 1,
    fields: PRODUCT_FIELDS,
  })
  return products[0] ?? null
}
```

- [ ] **Step 8: Commit**

```bash
git add lib/
git commit -m "Add Medusa Store API client library and EUR price formatter"
```

(run from `storefront/`)

---

### Task 7: Homepage — "Signature Range" Product Grid

**Files:**
- Modify: `storefront/app/page.tsx` (replace scaffold content entirely)
- Create: `storefront/components/product-card.tsx`
- Create: `storefront/components/hero.tsx`

**Interfaces:**
- Consumes: `getFranceRegion` (Task 6), `listSignatureProducts` (Task 6), `formatPriceEUR` (Task 6).
- Produces: the homepage route `/`, rendered as a Server Component; `ProductCard` is reused by no other task in this plan but is written as a standalone component so a future category-listing page can reuse it.

- [ ] **Step 1: Build the `ProductCard` component**

```tsx
// storefront/components/product-card.tsx
import Image from "next/image"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import { formatPriceEUR } from "@/lib/format"

export function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  const image = product.images?.[0]
  const cheapestVariant = product.variants?.[0]
  const price = cheapestVariant?.calculated_price?.calculated_amount

  return (
    <Link
      href={`/produits/${product.handle}`}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[color:var(--color-surface)]">
        {image?.url && (
          <Image
            src={image.url}
            alt={product.title ?? ""}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="font-[family-name:var(--font-display)] text-lg text-[color:var(--color-parchment)]">
          {product.title}
        </h3>
        {typeof price === "number" && (
          <span className="text-sm text-[color:var(--color-gold-soft)]">
            {formatPriceEUR(price)}
          </span>
        )}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Build the `Hero` component**

```tsx
// storefront/components/hero.tsx
export function Hero() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center border-b border-[color:var(--color-surface-raised)] px-6 text-center">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[color:var(--color-gold)]">
        Collection permanente
      </p>
      <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-tight text-[color:var(--color-parchment)] sm:text-6xl">
        L&apos;éclat de l&apos;or, l&apos;âme du drapé
      </h1>
      <p className="mt-6 max-w-xl text-[color:var(--color-muted)]">
        Bijoux en or et sarees traditionnels, sélectionnés pour leur élégance
        intemporelle et façonnés pour durer.
      </p>
    </section>
  )
}
```

- [ ] **Step 3: Write the homepage Server Component**

```tsx
// storefront/app/page.tsx
import type { Metadata } from "next"
import { Hero } from "@/components/hero"
import { ProductCard } from "@/components/product-card"
import { getFranceRegion } from "@/lib/regions"
import { listSignatureProducts } from "@/lib/products"

export const metadata: Metadata = {
  title: "Bijoux en or et Sarees traditionnels",
  description:
    "Découvrez notre collection permanente : bijoux en or 18 carats et sarees en soie, livrés partout en France.",
}

export default async function HomePage() {
  const region = await getFranceRegion()
  const products = await listSignatureProducts(region.id)

  return (
    <main>
      <Hero />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-10 font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-parchment)]">
          Signature Range
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 4: Verify in the browser**

With the backend running (`npx medusa develop` in `medusa/apps/backend/`) and the storefront running (`npm run dev` in `storefront/`), open `http://localhost:3000`.
Expected: dark background, gold accent hero text, a 4-column grid (2 on mobile width) showing the 12 seeded products with images, titles, and EUR prices.

If the grid is empty, check the terminal running `npm run dev` for a thrown error from `getFranceRegion` (usually means `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in `.env.local` doesn't match the key the seed script printed — re-check Task 5 Step 4).

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx components/product-card.tsx components/hero.tsx
git commit -m "Build homepage Signature Range product grid"
```

(run from `storefront/`)

---

### Task 8: Product Detail Page

**Files:**
- Create: `storefront/app/produits/[handle]/page.tsx`
- Create: `storefront/components/product-gallery.tsx`
- Create: `storefront/components/variant-selector.tsx`
- Create: `storefront/lib/cart.ts`

**Interfaces:**
- Consumes: `getProductByHandle`, `getFranceRegion`, `formatPriceEUR` (Task 6).
- Produces: the route `/produits/[handle]`; `addToCart(variantId, regionId, quantity)` in `lib/cart.ts`, a client-side helper that creates or reuses a cart via `localStorage` — no other task in this plan depends on it, but it is the swap point for a future full checkout flow.

- [ ] **Step 1: Write the cart helper**

```typescript
// storefront/lib/cart.ts
"use client"

import { sdk } from "./medusa"

const CART_ID_KEY = "medusa_cart_id"

async function getOrCreateCartId(regionId: string): Promise<string> {
  const existing = window.localStorage.getItem(CART_ID_KEY)
  if (existing) return existing

  const { cart } = await sdk.store.cart.create({ region_id: regionId })
  window.localStorage.setItem(CART_ID_KEY, cart.id)
  return cart.id
}

export async function addToCart(
  variantId: string,
  regionId: string,
  quantity: number
): Promise<void> {
  const cartId = await getOrCreateCartId(regionId)
  await sdk.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  })
}
```

- [ ] **Step 2: Write the gallery component**

```tsx
// storefront/components/product-gallery.tsx
"use client"

import Image from "next/image"
import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

export function ProductGallery({
  images,
  title,
}: {
  images: HttpTypes.StoreProductImage[]
  title: string
}) {
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="relative aspect-square overflow-hidden bg-[color:var(--color-surface)]">
        {images[active]?.url && (
          <Image
            src={images[active].url}
            alt={title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((image, index) => (
            <button
              key={image.id ?? index}
              onClick={() => setActive(index)}
              className={`relative h-20 w-20 overflow-hidden border ${
                index === active
                  ? "border-[color:var(--color-gold)]"
                  : "border-transparent"
              }`}
            >
              {image.url && (
                <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Write the variant selector + add-to-cart client component**

```tsx
// storefront/components/variant-selector.tsx
"use client"

import { useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { formatPriceEUR } from "@/lib/format"
import { addToCart } from "@/lib/cart"

export function VariantSelector({
  product,
  regionId,
}: {
  product: HttpTypes.StoreProduct
  regionId: string
}) {
  const options = product.options ?? []
  const variants = product.variants ?? []

  const [selected, setSelected] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle")

  const matchedVariant = useMemo(() => {
    return variants.find((variant) =>
      variant.options?.every((opt) => selected[opt.option_id ?? ""] === opt.value)
    )
  }, [variants, selected])

  const inStock = (matchedVariant?.inventory_quantity ?? 0) > 0
  const price = matchedVariant?.calculated_price?.calculated_amount

  async function handleAddToCart() {
    if (!matchedVariant) return
    setStatus("adding")
    await addToCart(matchedVariant.id, regionId, 1)
    setStatus("added")
  }

  return (
    <div>
      {typeof price === "number" && (
        <p className="mb-6 font-[family-name:var(--font-display)] text-3xl text-[color:var(--color-gold-soft)]">
          {formatPriceEUR(price)}{" "}
          <span className="text-sm text-[color:var(--color-muted)]">TVA incluse</span>
        </p>
      )}

      {options.map((option) => (
        <div key={option.id} className="mb-6">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            {option.title}
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values?.map((value) => (
              <button
                key={value.id}
                onClick={() =>
                  setSelected((prev) => ({ ...prev, [option.id]: value.value }))
                }
                className={`border px-4 py-2 text-sm transition-colors ${
                  selected[option.id] === value.value
                    ? "border-[color:var(--color-gold)] text-[color:var(--color-gold)]"
                    : "border-[color:var(--color-surface-raised)] text-[color:var(--color-parchment)]"
                }`}
              >
                {value.value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <p className="mb-4 text-sm text-[color:var(--color-muted)]">
        {matchedVariant
          ? inStock
            ? "En stock"
            : "Rupture de stock"
          : "Sélectionnez une option"}
      </p>

      <button
        onClick={handleAddToCart}
        disabled={!matchedVariant || !inStock || status === "adding"}
        className="w-full bg-[color:var(--color-gold)] py-4 text-sm uppercase tracking-[0.2em] text-[color:var(--color-ink)] transition-opacity disabled:opacity-40"
      >
        {status === "added" ? "Ajouté au panier" : "Ajouter au panier"}
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Write the PDP route with metadata and JSON-LD**

```tsx
// storefront/app/produits/[handle]/page.tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductGallery } from "@/components/product-gallery"
import { VariantSelector } from "@/components/variant-selector"
import { getFranceRegion } from "@/lib/regions"
import { getProductByHandle } from "@/lib/products"

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const region = await getFranceRegion()
  const product = await getProductByHandle(handle, region.id)
  if (!product) return {}

  return {
    title: product.title,
    description: product.description ?? undefined,
    openGraph: {
      title: product.title ?? undefined,
      description: product.description ?? undefined,
      images: product.images?.[0]?.url ? [product.images[0].url] : undefined,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const region = await getFranceRegion()
  const product = await getProductByHandle(handle, region.id)

  if (!product) {
    notFound()
  }

  const price = product.variants?.[0]?.calculated_price?.calculated_amount

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images?.map((image) => image.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price,
      availability: "https://schema.org/InStock",
      url: `https://example.com/produits/${product.handle}`,
    },
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images ?? []} title={product.title ?? ""} />
        <div>
          <h1 className="mb-4 font-[family-name:var(--font-display)] text-4xl text-[color:var(--color-parchment)]">
            {product.title}
          </h1>
          <p className="mb-8 text-[color:var(--color-muted)]">{product.description}</p>
          <VariantSelector product={product} regionId={region.id} />
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 5: Verify in the browser**

With both dev servers running, open `http://localhost:3000/produits/collier-aanya`.
Expected: gallery with 2 images, "Finition" and "Poids" option buttons, price updates as options are picked once a full combination is selected, "En stock" status shown, and "Ajouter au panier" enables once a valid variant is matched. Clicking it toggles to "Ajouté au panier".
View page source and confirm a `<script type="application/ld+json">` block with the product's JSON-LD is present.

- [ ] **Step 6: Commit**

```bash
git add app/produits components/product-gallery.tsx components/variant-selector.tsx lib/cart.ts
git commit -m "Build product detail page with variant selection, cart, and JSON-LD"
```

(run from `storefront/`)

---

### Task 9: Cookie Consent Banner

**Files:**
- Create: `storefront/components/cookie-consent.tsx`
- Modify: `storefront/app/layout.tsx`

**Interfaces:**
- Produces: `<CookieConsent />`, a client component mounted once in the root layout. Declines non-essential cookies by default (no tracking scripts exist yet in this plan, so "decline" is a no-op today, but the consent state is stored in `localStorage` under `cookie_consent` for a future analytics task to read).

- [ ] **Step 1: Write the component**

```tsx
// storefront/components/cookie-consent.tsx
"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "cookie_consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  function respond(value: "accepted" | "declined") {
    window.localStorage.setItem(STORAGE_KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[color:var(--color-surface-raised)] bg-[color:var(--color-surface)] px-6 py-5">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-[color:var(--color-muted)]">
          Nous utilisons des cookies essentiels au fonctionnement du site. Avec
          votre accord, nous utiliserons aussi des cookies de mesure d&apos;audience.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => respond("declined")}
            className="border border-[color:var(--color-surface-raised)] px-4 py-2 text-sm text-[color:var(--color-parchment)]"
          >
            Refuser
          </button>
          <button
            onClick={() => respond("accepted")}
            className="bg-[color:var(--color-gold)] px-4 py-2 text-sm text-[color:var(--color-ink)]"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Mount it in the root layout**

In `storefront/app/layout.tsx`, import and render it inside `<body>`, after `{children}`:

```tsx
import { CookieConsent } from "@/components/cookie-consent"
// ...
        {children}
        <CookieConsent />
```

- [ ] **Step 3: Verify in the browser**

Open `http://localhost:3000` in a private/incognito window (fresh `localStorage`).
Expected: banner appears fixed at the bottom. Clicking "Refuser" or "Accepter" dismisses it. Reloading the page keeps it dismissed (check Application → Local Storage in devtools for the `cookie_consent` key).

- [ ] **Step 4: Commit**

```bash
git add components/cookie-consent.tsx app/layout.tsx
git commit -m "Add decline-by-default cookie consent banner"
```

(run from `storefront/`)

---

### Task 10: End-to-End Verification

**Files:**
- None — this task only runs and observes the system built in Tasks 1-9.

- [ ] **Step 1: Cold-start the whole stack**

```bash
docker compose up -d
```
(from `new_ecommerce/`)

In one terminal: `cd medusa/apps/backend && npx medusa develop`
In another terminal: `cd storefront && npm run dev`

Expected: both processes report ready with no errors.

- [ ] **Step 2: Admin check**

Open `http://localhost:9000/app`, log in with the Task 3 credentials.
Expected: 12 products, France region with TVA 20% tax rate visible under Settings → Tax Regions.

- [ ] **Step 3: Homepage check**

Open `http://localhost:3000`.
Expected: hero + Signature Range grid render with real product images and EUR prices, dark/gold theme applied, no console errors in devtools.

- [ ] **Step 4: PDP + cart check**

Open `http://localhost:3000/produits/saree-ananya-soie`, select a color, click "Ajouter au panier".
Then, in the admin, go to Orders → Draft orders/Carts (or query `http://localhost:9000/store/carts/<id>` with the publishable key header) to confirm a cart was created with the line item.

- [ ] **Step 5: Cookie banner check**

Open the site in a fresh private window, confirm the banner appears and both buttons dismiss it.

- [ ] **Step 6: Record results**

No commit for this task. If any check fails, return to the relevant task above, fix inline, and re-run that task's own verification step before re-running this task's checks.
