import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function fixShippingProfiles({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  logger.info("Starting shipping profile verification for all products...")

  // 1. Get the default shipping profile
  const { data: profiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name", "type"],
  })

  const defaultProfile = profiles.find((p) => p.type === "default") || profiles[0]
  if (!defaultProfile) {
    logger.error("No shipping profile found in database!")
    return
  }

  logger.info(`Using default shipping profile: ${defaultProfile.name} (${defaultProfile.id})`)

  // 2. Fetch all products and their current shipping profile link
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "shipping_profile.*"],
  })

  logger.info(`Found ${products.length} products to check.`)

  let linkedCount = 0
  for (const product of products) {
    if (!product.shipping_profile || !product.shipping_profile.id) {
      logger.info(`Linking product "${product.title}" (${product.id}) to shipping profile ${defaultProfile.id}...`)
      
      try {
        await link.create({
          [Modules.PRODUCT]: {
            product_id: product.id,
          },
          [Modules.FULFILLMENT]: {
            shipping_profile_id: defaultProfile.id,
          },
        })
        linkedCount++
        logger.info(`Successfully linked "${product.title}"!`)
      } catch (err) {
        logger.error(`Error linking "${product.title}":`, err)
      }
    } else {
      logger.info(`Product "${product.title}" already linked to ${product.shipping_profile.id}`)
    }
  }

  logger.info(`Finished! Linked ${linkedCount} products to shipping profile ${defaultProfile.id}.`)
}
