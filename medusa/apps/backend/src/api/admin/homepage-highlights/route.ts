import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateStoresWorkflow } from "@medusajs/medusa/core-flows"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "name", "metadata"],
  })

  const store = stores[0]
  const highlights = (store?.metadata?.homepage_highlights as any) || {
    featured_product_ids: [],
    deal_product_ids: [],
    deal_end_time: null,
  }

  res.json({
    highlights,
    store_id: store?.id,
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const body = req.body as {
    featured_product_ids?: string[]
    deal_product_ids?: string[]
    deal_end_time?: string | null
  }

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "metadata"],
  })

  const store = stores[0]
  if (!store) {
    return res.status(404).json({ message: "Store not found" })
  }

  const existingMetadata = (store.metadata as Record<string, unknown>) || {}
  const currentHighlights = (existingMetadata.homepage_highlights as any) || {}

  const updatedHighlights = {
    featured_product_ids:
      body.featured_product_ids !== undefined
        ? body.featured_product_ids
        : currentHighlights.featured_product_ids || [],
    deal_product_ids:
      body.deal_product_ids !== undefined
        ? body.deal_product_ids
        : currentHighlights.deal_product_ids || [],
    deal_end_time:
      body.deal_end_time !== undefined
        ? body.deal_end_time
        : currentHighlights.deal_end_time || null,
  }

  await updateStoresWorkflow(req.scope).run({
    input: {
      selector: { id: store.id },
      update: {
        metadata: {
          ...existingMetadata,
          homepage_highlights: updatedHighlights,
        },
      },
    },
  })

  res.json({
    success: true,
    highlights: updatedHighlights,
  })
}
