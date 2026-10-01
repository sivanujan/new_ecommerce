import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createServiceZonesWorkflow,
  createShippingOptionsWorkflow,
  deleteServiceZonesWorkflow,
  deleteShippingOptionsWorkflow,
  updateRegionsWorkflow,
} from "@medusajs/medusa/core-flows"

// All supported shipping zones with exact requested rates
export const SHIPPING_RATES_CONFIG = [
  {
    name: "France",
    label: "Standard Delivery (France)",
    price: 7.9,
    countries: ["fr"],
  },
  {
    name: "Switzerland",
    label: "Standard Delivery (Switzerland)",
    price: 14.9,
    countries: ["ch"],
  },
  {
    name: "Europe & EU",
    label: "Standard Delivery (Europe / EU)",
    price: 14.9,
    countries: [
      "de", "es", "it", "pt", "nl", "be", "at", "ie", "fi", "se", "dk",
      "pl", "cz", "gr", "ro", "hu", "sk", "bg", "hr", "si", "lt", "lv",
      "ee", "cy", "lu", "mt", "mc", "ad", "sm", "va", "li", "lu"
    ],
  },
  {
    name: "United Kingdom",
    label: "Standard Delivery (United Kingdom)",
    price: 18.9,
    countries: ["gb"],
  },
  {
    name: "Norway, Iceland & North Africa",
    label: "Standard Delivery (Norway, Iceland, North Africa)",
    price: 23.9,
    countries: ["no", "is", "ma", "dz", "tn"],
  },
  {
    name: "International & Rest of World",
    label: "Standard Delivery (Worldwide)",
    price: 35.9,
    countries: [
      // Major requested destinations
      "ca", "us", "lk", "au", "nz", "in",
      // Other global destinations
      "sg", "my", "ae", "sa", "qa", "kw", "bh", "om", "za", "jp", "kr",
      "hk", "tw", "th", "vn", "ph", "id", "br", "mx", "ar", "cl", "co",
      "pe", "eg", "ng", "ke", "gh", "mu", "sc", "tr", "il", "pk", "bd",
      "np", "mv"
    ],
  },
]

export default async function setupTamzenShipping({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("==========================================")
  logger.info("📦 CONFIGURING TAMZEN TIERED SHIPPING RATES 📦")
  logger.info("==========================================")

  // 1. Collect all distinct countries
  const allCountriesSet = new Set<string>()
  for (const zone of SHIPPING_RATES_CONFIG) {
    for (const c of zone.countries) {
      allCountriesSet.add(c.toLowerCase())
    }
  }
  const allCountries = Array.from(allCountriesSet)

  // 2. Update default Europe region so all countries are selectable in checkout
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "countries.iso_2"],
  })

  if (regions && regions.length > 0) {
    const mainRegion = regions[0]
    logger.info(`Expanding region '${mainRegion.name}' with ${allCountries.length} countries...`)

    try {
      await updateRegionsWorkflow(container).run({
        input: {
          selector: { id: mainRegion.id },
          update: {
            countries: allCountries,
          },
        },
      })
      logger.info(`Region updated successfully with all supported countries.`)
    } catch (e: any) {
      logger.warn(`Could not update region countries: ${e.message}`)
    }
  }

  // 3. Get shipping profile
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "type"],
  })
  const shippingProfile =
    shippingProfiles.find((sp: any) => sp.type === "default") ||
    shippingProfiles[0]

  if (!shippingProfile) {
    logger.error("No default shipping profile found!")
    return
  }

  // 4. Get shipping fulfillment set
  const { data: fulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: [
      "id",
      "name",
      "type",
      "service_zones.id",
      "service_zones.name",
      "service_zones.shipping_options.id",
      "service_zones.shipping_options.name",
    ],
  })

  const shippingFulfillmentSet = fulfillmentSets.find(
    (fs: any) => fs.type === "shipping"
  )

  if (!shippingFulfillmentSet) {
    logger.error("No shipping fulfillment set found!")
    return
  }

  logger.info(`Using Fulfillment Set: ${shippingFulfillmentSet.name} (${shippingFulfillmentSet.id})`)

  // 5. Clean up old shipping options & old service zones to eliminate duplicate/generic 10€ options
  const oldOptionIds: string[] = []
  const oldZoneIds: string[] = []

  for (const zone of shippingFulfillmentSet.service_zones || []) {
    oldZoneIds.push(zone.id)
    for (const opt of zone.shipping_options || []) {
      oldOptionIds.push(opt.id)
    }
  }

  if (oldOptionIds.length > 0) {
    logger.info(`Deleting ${oldOptionIds.length} obsolete shipping options...`)
    try {
      await deleteShippingOptionsWorkflow(container).run({
        input: { ids: oldOptionIds },
      })
    } catch (e: any) {
      logger.warn(`Failed to delete some old shipping options: ${e.message}`)
    }
  }

  if (oldZoneIds.length > 0) {
    logger.info(`Deleting ${oldZoneIds.length} obsolete service zones...`)
    try {
      await deleteServiceZonesWorkflow(container).run({
        input: { ids: oldZoneIds },
      })
    } catch (e: any) {
      logger.warn(`Failed to delete some old service zones: ${e.message}`)
    }
  }

  // 6. Create the 6 dedicated Service Zones
  logger.info("Creating 6 country-targeted service zones...")
  const serviceZonesInput = SHIPPING_RATES_CONFIG.map((conf) => ({
    name: conf.name,
    fulfillment_set_id: shippingFulfillmentSet.id,
    geo_zones: conf.countries.map((code) => ({
      type: "country" as const,
      country_code: code,
    })),
  }))

  const { result: createdZones } = await createServiceZonesWorkflow(container).run({
    input: {
      data: serviceZonesInput,
    },
  })

  logger.info(`Created ${createdZones.length} service zones.`)

  // 7. Create exactly ONE shipping option for each service zone with its exact price
  const shippingOptionsToCreate = createdZones.map((zone: any) => {
    const config = SHIPPING_RATES_CONFIG.find((c) => c.name === zone.name)
    const priceAmount = config?.price ?? 35.9
    const label = config?.label ?? "Standard Delivery"

    return {
      name: label,
      price_type: "flat" as const,
      provider_id: "manual_manual",
      service_zone_id: zone.id,
      shipping_profile_id: shippingProfile.id,
      type: {
        label: "Tracked Courier",
        description: "Insured & Tracked Courier Delivery",
        code: "standard",
      },
      prices: [
        {
          currency_code: "eur",
          amount: priceAmount,
        },
        {
          currency_code: "usd",
          amount: priceAmount,
        },
      ],
      rules: [
        {
          attribute: "enabled_in_store",
          value: "true",
          operator: "eq" as const,
        },
        {
          attribute: "is_return",
          value: "false",
          operator: "eq" as const,
        },
      ],
    }
  })

  logger.info("Creating single dedicated shipping options for each zone...")
  await createShippingOptionsWorkflow(container).run({
    input: shippingOptionsToCreate,
  })

  logger.info("==========================================")
  logger.info("✅ TAMZEN SHIPPING RATES SUCCESSFULLY APPLIED ✅")
  for (const c of SHIPPING_RATES_CONFIG) {
    logger.info(`   - ${c.name}: €${c.price.toFixed(2)} (${c.countries.join(", ")})`)
  }
  logger.info("==========================================")
}
