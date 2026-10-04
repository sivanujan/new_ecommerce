import { Metadata } from "next"
import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import StoreTemplate from "@modules/store/templates"
import {
  CategoryOption,
  FormattedCollectionProduct,
} from "@modules/store/components/collection-interactive-view"
import { normalizeImageUrl } from "@lib/util/normalize-image-url"

// Revalidate store page products every 60 seconds on production builds
export const revalidate = 60

export const metadata: Metadata = {
  title: "The Collection | TamZen — Wear Your Roots",
  description:
    "Explore the complete TamZen collection. Cultural jewelry, pendants, and signature pieces forged in solid 316L stainless steel inspired by Tamil-Eelam heritage.",
  openGraph: {
    title: "The Collection | TamZen — Wear Your Roots",
    description:
      "Symbols that define you. Explore our complete collection of cultural pendants and signature jewelry.",
    images: ["/images/tamzen-hero-pendant.jpg"],
  },
}

type Params = {
  searchParams: Promise<{
    sortBy?: string
    category?: string
    page?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, category, q } = searchParams
  const { countryCode } = params

  const region = await getRegion(countryCode)

  // Fetch categories and all products live from Medusa
  const [categoriesRaw, productsRaw] = await Promise.all([
    listCategories().catch(() => []),
    listProducts({
      countryCode,
      regionId: region?.id,
      queryParams: {
        limit: 100,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.options,*options.values,*categories,*images,+metadata,+tags",
      },
    }).catch(() => ({ response: { products: [] } })),
  ])

  // Extract clean category options
  const categories: CategoryOption[] = (categoriesRaw || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    handle: cat.handle,
  }))

  // Format products with live calculated EUR prices, categories, and variant details
  const products: FormattedCollectionProduct[] = (
    productsRaw?.response?.products || []
  ).map((product, index) => {
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

    // Fallback description so NO product card is ever blank
    let fallbackDesc = "Forged in solid 316L surgical stainless steel inspired by Tamil heritage. 100% waterproof and sweatproof."
    if (categoryName.includes("sari") || categoryName.includes("silk") || product.title?.toLowerCase().includes("sari")) {
      fallbackDesc = "Handcrafted Tamil heritage saree woven with pure silk and refined gold zari border motifs."
    } else if (categoryName.includes("chain") || product.title?.toLowerCase().includes("chaine")) {
      fallbackDesc = "Solid 18K gold vacuum-plated chain with reinforced clasp. Engineered for everyday durability."
    } else if (categoryName.includes("ring") || product.title?.toLowerCase().includes("bague")) {
      fallbackDesc = "Intricately engraved cultural ring forged in durable 316L steel with mirror-polished gold finish."
    }

    const description =
      product.description?.trim() ||
      product.subtitle?.trim() ||
      fallbackDesc

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
    }
  })

  return (
    <StoreTemplate
      products={products}
      categories={categories}
      initialCategory={category}
      initialSort={sortBy}
      initialSearch={q}
    />
  )
}
