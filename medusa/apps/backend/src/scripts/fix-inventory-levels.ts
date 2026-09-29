import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createInventoryLevelsWorkflow } from "@medusajs/medusa/core-flows"

export default async function fixInventoryLevels({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("==================================================")
  logger.info("📦 Checking stock levels for all inventory items...")
  logger.info("==================================================")

  // 1. Fetch all stock locations
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  if (!stockLocations || stockLocations.length === 0) {
    logger.warn("No stock locations found in database. Cannot create inventory levels.")
    return
  }

  logger.info(`Found ${stockLocations.length} stock location(s): ${stockLocations.map((l) => `${l.name} (${l.id})`).join(", ")}`)

  // 2. Fetch all inventory items and their existing location levels
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku", "location_levels.*"],
  })

  logger.info(`Found ${inventoryItems.length} inventory item(s) to verify.`)

  const missingLevels: {
    location_id: string
    inventory_item_id: string
    stocked_quantity: number
  }[] = []

  for (const item of inventoryItems) {
    const existingLocations = new Set(
      (item.location_levels || []).map((l: any) => l.location_id)
    )

    for (const loc of stockLocations) {
      if (!existingLocations.has(loc.id)) {
        missingLevels.push({
          location_id: loc.id,
          inventory_item_id: item.id,
          stocked_quantity: 100,
        })
      }
    }
  }

  if (missingLevels.length > 0) {
    logger.info(`Found ${missingLevels.length} missing stock location links. Adding inventory levels...`)
    try {
      await createInventoryLevelsWorkflow(container).run({
        input: { inventory_levels: missingLevels },
      })
      logger.info(`✅ Successfully stocked ${missingLevels.length} item level(s) with 100 units each!`)
    } catch (err: any) {
      logger.error(`Error stocking inventory levels: ${err?.message || err}`)
    }
  } else {
    logger.info("✅ All inventory items are already properly stocked at all locations.")
  }

  logger.info("==================================================")
}
