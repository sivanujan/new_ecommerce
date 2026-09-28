import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "metadata"],
  })

  const store = stores[0]
  const highlights = (store?.metadata?.homepage_highlights as any) || {
    featured_product_ids: [],
    deal_product_ids: [],
    deal_end_time: null,
  }

  res.json({
    highlights,
  })
}
