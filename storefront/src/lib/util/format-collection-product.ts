import { HttpTypes } from "@medusajs/types"
import { getProductPrice, getPricesForVariant } from "@lib/util/get-product-price"
import { normalizeImageUrl } from "@lib/util/normalize-image-url"

export type ProductColorVariant = {
  name: string // "Silver" | "Gold" | "Black"
  variantId: string
  price: string
  priceNumber: number
  imageUrl: string
}

export type FormattedCollectionProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string
  description?: string | null
  categories: { id: string; name: string; handle: string }[]
  price: string
  priceNumber: number
  originalPrice?: string | null
  priceType?: string
  percentageDiff?: string | null
  createdAt?: string
  isNew?: boolean
  defaultVariantId?: string
  hasMultipleVariants?: boolean
  variantsCount?: number
  colorVariants: ProductColorVariant[]
}

export function formatMedusaProduct(
  product: HttpTypes.StoreProduct,
  index: number = 0
): FormattedCollectionProduct {
  const { cheapestPrice } = getProductPrice({ product })

  const thumbnail = normalizeImageUrl(
    product.thumbnail ||
      product.images?.[0]?.url ||
      "/images/tamzen-hero-pendant.jpg"
  )

  const productCategories = (product.categories || []).map((c) => ({
    id: c.id,
    name: c.name,
    handle: c.handle,
  }))

  const categoryName = productCategories[0]?.name?.toLowerCase() || ""
  const hasMultipleVariants = (product.variants?.length ?? 0) > 1
  const defaultVariantId = product.variants?.[0]?.id

  // Fallback description so no card is ever blank
  let fallbackDesc =
    "Forged in solid 316L surgical stainless steel inspired by Tamil heritage. 100% waterproof and sweatproof."
  if (
    categoryName.includes("chain") ||
    product.title?.toLowerCase().includes("chain")
  ) {
    fallbackDesc =
      "Solid 18K gold vacuum-plated chain with reinforced clasp. Engineered for everyday durability."
  } else if (
    categoryName.includes("special") ||
    product.title?.toLowerCase().includes("limited")
  ) {
    fallbackDesc =
      "Limited atelier creation forged in 316L steel with high-precision Tamil iconography engraving."
  }

  const description =
    product.description?.trim() ||
    product.subtitle?.trim() ||
    fallbackDesc

  // Extract color variants for the 3 finish dots (Silver, Gold, Black)
  const colorVariants: ProductColorVariant[] = []
  if (product.variants && product.variants.length > 0) {
    for (const variant of product.variants) {
      // Find color name
      const colorOption = variant.options?.find((opt: any) =>
        /color|colour|metal|finish/i.test(opt.option?.title || opt.title || "")
      )
      let colorName = colorOption?.value
      if (!colorName) {
        const titleLower = variant.title?.toLowerCase() || ""
        if (titleLower.includes("silver")) colorName = "Silver"
        else if (titleLower.includes("gold")) colorName = "Gold"
        else if (titleLower.includes("black")) colorName = "Black"
      }

      if (colorName) {
        const variantPrices = getPricesForVariant(variant)
        const price =
          variantPrices?.calculated_price ||
          cheapestPrice?.calculated_price ||
          "€69.00"
        const priceNumber =
          variantPrices?.calculated_price_number ||
          cheapestPrice?.calculated_price_number ||
          0

        // Find variant image
        let imageUrl = ""
        const varMeta = variant.metadata as any
        if (varMeta?.image_url) {
          imageUrl = normalizeImageUrl(varMeta.image_url)
        } else if (varMeta?.images?.[0]) {
          imageUrl = normalizeImageUrl(varMeta.images[0])
        } else {
          // Standard seed images path
          imageUrl = `/seed-images/${product.handle}/${colorName.toLowerCase()}.jpg`
        }

        colorVariants.push({
          name: colorName,
          variantId: variant.id,
          price,
          priceNumber,
          imageUrl,
        })
      }
    }
  }

  // Ensure unique by color name
  const uniqueColorVariants = colorVariants.filter(
    (v, i, self) =>
      i === self.findIndex((t) => t.name.toLowerCase() === v.name.toLowerCase())
  )

  // If no color variants were identified, but default exists, provide standard 3 finishes if seed-images exist
  if (uniqueColorVariants.length === 0 && defaultVariantId) {
    const finishes = ["Silver", "Gold", "Black"]
    for (const f of finishes) {
      uniqueColorVariants.push({
        name: f,
        variantId: defaultVariantId,
        price: cheapestPrice?.calculated_price ?? "€69.00",
        priceNumber: cheapestPrice?.calculated_price_number ?? 0,
        imageUrl: `/seed-images/${product.handle}/${f.toLowerCase()}.jpg`,
      })
    }
  }

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    thumbnail,
    description,
    categories: productCategories,
    price: cheapestPrice?.calculated_price ?? "€49.00",
    priceNumber: cheapestPrice?.calculated_price_number ?? 0,
    originalPrice: cheapestPrice?.original_price || null,
    priceType: cheapestPrice?.price_type || "default",
    percentageDiff: cheapestPrice?.percentage_diff || null,
    createdAt: product.created_at || undefined,
    isNew: index === 0 || index === 2,
    defaultVariantId,
    hasMultipleVariants,
    variantsCount: product.variants?.length ?? 0,
    colorVariants: uniqueColorVariants,
  }
}
