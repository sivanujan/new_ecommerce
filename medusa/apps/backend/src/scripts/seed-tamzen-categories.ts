import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedTamzenCategories({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Setting up TamZen categories: Pendants, Chains, Special Editions...")

  const wantedCategories = [
    { name: "Pendants", handle: "pendants" },
    { name: "Chains", handle: "chains" },
    { name: "Special Editions", handle: "special-editions" },
  ]

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })

  const categoryByHandle = new Map<string, string>(
    existingCategories.map((c) => [c.handle as string, c.id as string])
  )
  const categoryByName = new Map<string, string>(
    existingCategories.map((c) => [c.name as string, c.id as string])
  )

  const toCreate = wantedCategories.filter(
    (w) => !categoryByHandle.has(w.handle) && !categoryByName.has(w.name)
  )

  if (toCreate.length > 0) {
    const { result: created } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: toCreate.map((cat) => ({
          name: cat.name,
          handle: cat.handle,
          is_active: true,
        })),
      },
    })
    created.forEach((c) => {
      categoryByHandle.set(c.handle, c.id)
      categoryByName.set(c.name, c.id)
    })
    logger.info(`Created categories: ${toCreate.map((c) => c.name).join(", ")}`)
  } else {
    logger.info("Categories Pendants, Chains, and Special Editions already exist.")
  }

  // Now query all products and associate them with appropriate categories
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "categories.id"],
  })

  const pendantsId = categoryByHandle.get("pendants") || categoryByName.get("Pendants")
  const chainsId = categoryByHandle.get("chains") || categoryByName.get("Chains")
  const specialEditionsId =
    categoryByHandle.get("special-editions") || categoryByName.get("Special Editions")

  for (const product of products) {
    const title = (product.title || "").toLowerCase()
    const handle = (product.handle || "").toLowerCase()
    const currentCategoryIds: string[] = (product.categories || []).map((c: any) => c.id)

    let targetCatId: string | null = null
    if (
      title.includes("chaine") ||
      title.includes("chaîne") ||
      title.includes("chain") ||
      handle.includes("chaine") ||
      handle.includes("chain") ||
      title.includes("gourmette") ||
      title.includes("maille")
    ) {
      targetCatId = chainsId || null
    } else if (
      title.includes("pendentif") ||
      title.includes("pendant") ||
      title.includes("dog-tag") ||
      title.includes("lion") ||
      title.includes("coeur") ||
      title.includes("medaillon") ||
      handle.includes("pendentif") ||
      handle.includes("pendant")
    ) {
      targetCatId = pendantsId || null
    } else {
      // Default to Special Editions for distinctive rings, sarees, or limited designs
      targetCatId = specialEditionsId || null
    }

    if (targetCatId && !currentCategoryIds.includes(targetCatId)) {
      const updatedCategoryIds = [...new Set([...currentCategoryIds, targetCatId])]
      try {
        await updateProductsWorkflow(container).run({
          input: {
            products: [
              {
                id: product.id,
                category_ids: updatedCategoryIds,
              },
            ],
          },
        })
        logger.info(`Linked ${product.title} to category ${targetCatId}`)
      } catch (err: any) {
        logger.warn(`Could not update category for ${product.title}: ${err?.message}`)
      }
    }
  }

  logger.info("TamZen categories setup complete!")
}
