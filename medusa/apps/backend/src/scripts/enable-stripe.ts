import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Script to ensure Stripe payment provider (pp_stripe_stripe) is enabled and linked
 * to all existing regions.
 *
 * Run with: npx medusa exec ./src/scripts/enable-stripe.ts
 */
export default async function enableStripeScript({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Verifying regions and payment providers...")

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "payment_providers.id"],
  })

  for (const region of regions) {
    const existingProviderIds: string[] = (region.payment_providers || [])
      .map((p: any) => p?.id)
      .filter((id: any): id is string => Boolean(id))

    if (!existingProviderIds.includes("pp_stripe_stripe")) {
      const updatedProviders = [...existingProviderIds, "pp_stripe_stripe"]
      logger.info(
        `Adding pp_stripe_stripe to region ${region.name} (${region.id})...`
      )
      await updateRegionsWorkflow(container).run({
        input: {
          selector: { id: region.id },
          update: {
            payment_providers: updatedProviders,
          },
        },
      })
      logger.info(
        `Region ${region.name} now enabled with: ${updatedProviders.join(", ")}`
      )
    } else {
      logger.info(
        `Region ${region.name} (${region.id}) already has Stripe enabled.`
      )
    }
  }

  logger.info("Stripe enablement check finished successfully.")
}
