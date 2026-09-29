import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import initialDataSeed from "../migration-scripts/initial-data-seed"
import seedJewelry from "./seed-jewelry"
import enableStripe from "./enable-stripe"
import fixShippingProfiles from "./fix-shipping-profiles"
import seedTamzenCategories from "./seed-tamzen-categories"

/**
 * All-in-one production setup script for Railway.
 * Run inside Railway Console or locally with:
 * npx medusa exec ./src/scripts/seed-production-complete.ts
 */
export default async function seedProductionComplete({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("==========================================")
  logger.info("🚀 STARTING COMPLETE PRODUCTION SETUP 🚀")
  logger.info("==========================================")

  try {
    logger.info("\n--- STEP 1: Initial Regions, Shipping & Inventory ---")
    await initialDataSeed({ container })
  } catch (err: any) {
    logger.warn(`Initial seed notice (might already be seeded): ${err?.message || err}`)
  }

  try {
    logger.info("\n--- STEP 2: Seeding Jewelry & Sarees Catalog ---")
    await seedJewelry({ container })
  } catch (err: any) {
    logger.error(`Jewelry seed error: ${err?.message || err}`)
  }

  try {
    logger.info("\n--- STEP 3: Enabling Stripe Payment Provider ---")
    await enableStripe({ container })
  } catch (err: any) {
    logger.error(`Stripe enablement error: ${err?.message || err}`)
  }

  try {
    logger.info("\n--- STEP 4: Verifying Shipping Profiles on Products ---")
    await fixShippingProfiles({ container })
  } catch (err: any) {
    logger.error(`Shipping profile link error: ${err?.message || err}`)
  }

  try {
    logger.info("\n--- STEP 5: Seeding TamZen Categories (Pendants, Chains, Special Editions) ---")
    await seedTamzenCategories({ container })
  } catch (err: any) {
    logger.error(`Category seed error: ${err?.message || err}`)
  }

  logger.info("==========================================")
  logger.info("✅ PRODUCTION SETUP COMPLETED SUCCESSFULLY ✅")
  logger.info("==========================================")
}
