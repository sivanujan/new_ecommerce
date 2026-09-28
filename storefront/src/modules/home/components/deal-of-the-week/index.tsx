import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"
import { getProductPrice } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"
import DealCarousel, { DealProduct } from "./deal-carousel"
import { getHomepageHighlights } from "@lib/data/highlights"

export default async function DealOfTheWeek({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  // Fetch products, collections, and admin highlights concurrently from Medusa
  const [productsRes, collectionsRes, highlights] = await Promise.all([
    listProducts({
      regionId: region.id,
      queryParams: {
        limit: 100,
        fields: "*variants.calculated_price,*variants,*collection,*tags,+metadata",
      },
    }).catch(() => ({ response: { products: [] } })),
    listCollections().catch(() => ({ collections: [] })),
    getHomepageHighlights(),
  ])

  const rawProducts = productsRes.response?.products || []
  const rawCollections = collectionsRes?.collections || []

  // 1. If admin explicitly selected Deal of the Week products in the Admin Highlights menu:
  let candidateProducts: HttpTypes.StoreProduct[] = []
  if (highlights.deal_product_ids?.length > 0) {
    const dealIdSet = new Set(highlights.deal_product_ids)
    candidateProducts = rawProducts.filter((p) => dealIdSet.has(p.id))
  }

  // 2. If no explicit admin selection yet, look for a curated Medusa collection named "Deals" or "Deal of the Week"
  if (candidateProducts.length === 0) {
    const dealsCollection = rawCollections.find((c) => {
      const handle = c.handle?.toLowerCase() || ""
      const title = c.title?.toLowerCase() || ""
      return (
        handle === "deals" ||
        handle === "deal-of-the-week" ||
        handle.includes("deal") ||
        title.toLowerCase().includes("deal")
      )
    })

    // Filter products by Tag ("deal" or "deal-of-the-week") OR by Deals collection
    candidateProducts = rawProducts.filter((p) => {
      const hasDealTag = (p as any).tags?.some((t: any) => {
        const val = (t.value || "").toLowerCase()
        return val === "deal" || val === "deal-of-the-week" || val.includes("deal")
      })

      const isInDealsCollection = dealsCollection && (
        p.collection_id === dealsCollection.id ||
        (p as any).collection?.id === dealsCollection.id ||
        (p as any).collection?.handle?.toLowerCase() === dealsCollection.handle?.toLowerCase()
      )

      return Boolean(hasDealTag || isInDealsCollection)
    })
  }

  // 3. If no curated tags or collection found, check for products with active Medusa sale prices
  if (candidateProducts.length === 0) {
    const onSaleProducts = rawProducts.filter((p) => {
      const { cheapestPrice } = getProductPrice({ product: p })
      const diff = Number(cheapestPrice?.percentage_diff || 0)
      return diff > 0
    })

    if (onSaleProducts.length > 0) {
      candidateProducts = onSaleProducts
    }
  }

  // 4. Fallback for demonstration if admin hasn't configured a Deals collection or sale pricing yet:
  // Use first 10 products so the user can immediately experience the interactive carousel and live countdown timer.
  if (candidateProducts.length === 0 && rawProducts.length > 0) {
    candidateProducts = rawProducts.slice(0, 10)
  }

  // If there are still no products at all, gracefully return null
  if (candidateProducts.length === 0) {
    return null
  }

  // Admin configured deal end time or default deal end date (+5 days)
  const defaultDealEndDate = highlights.deal_end_time || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()

  // Format products for DealCarousel
  const dealProducts: DealProduct[] = candidateProducts.map((p, index) => {
    const { cheapestPrice } = getProductPrice({ product: p })
    const thumbnail =
      p.thumbnail ||
      p.images?.[0]?.url ||
      "/images/tamzen-hero-pendant.jpg"

    // Metadata deal_end_date (admin set)
    const rawDealEndDate =
      (p.metadata?.deal_end_date as string) ||
      (p.metadata?.dealEndDate as string) ||
      defaultDealEndDate

    // Calculate sale price & original price
    const hasLiveSalePrice = Number(cheapestPrice?.percentage_diff || 0) > 0

    let salePrice = cheapestPrice?.calculated_price ?? "EUR 49,00"
    let originalPrice = cheapestPrice?.original_price ?? "EUR 65,00"
    let discountPercent = Number(cheapestPrice?.percentage_diff || 0)

    // Fallback calculation if Medusa Price List isn't set yet
    if (!hasLiveSalePrice) {
      // Staggered demo discounts: 15%, 20%, 10%, 25%, 18%, 12%
      const demoDiscounts = [15, 20, 10, 25, 18, 12]
      discountPercent = demoDiscounts[index % demoDiscounts.length]

      const calcNum = cheapestPrice?.calculated_price_number || 4900
      const origNum = Math.round(calcNum / (1 - discountPercent / 100))
      const currency = cheapestPrice?.currency_code || region.currency_code || "eur"

      originalPrice = convertToLocale({ amount: origNum, currency_code: currency })
      salePrice = convertToLocale({ amount: calcNum, currency_code: currency })
    }

    return {
      id: p.id,
      title: p.title,
      handle: p.handle,
      thumbnail,
      salePrice,
      originalPrice,
      discountPercent,
      dealEndDate: rawDealEndDate,
    }
  })

  return (
    <section
      id="deal-of-the-week"
      className="w-full bg-bg-base py-20 lg:py-28 text-white relative overflow-hidden"
    >
      {/* Ambient background gold glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[#E5C378]/5 blur-[140px]" />

      <div className="content-container relative z-10">
        {/* ============================================================ */}
        {/* SECTION HEADER */}
        {/* ============================================================ */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#E5C378]/30 mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
              Limited Time Offer
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display font-serif font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#FDFBF7] uppercase">
            Deal of the Week
          </h2>

          {/* Tamil Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-4 w-full max-w-xs mx-auto">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#E5C378]/60" />
            <div className="w-2.5 h-2.5 rotate-45 border border-[#E5C378] bg-bg-elevated" />
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#E5C378]/60" />
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base text-neutral-300 font-sans font-light max-w-md mx-auto leading-relaxed">
            Exclusive pricing on iconic heritage pieces. Grab yours before the countdown reaches zero.
          </p>
        </div>

        {/* ============================================================ */}
        {/* HORIZONTAL PRODUCT CAROUSEL */}
        {/* ============================================================ */}
        <DealCarousel products={dealProducts} />
      </div>
    </section>
  )
}
