import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import { getHomepageHighlights } from "@lib/data/highlights"

export default async function FeaturedProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  // Concurrently fetch products, collections, and admin highlights live from Medusa
  const [productsRes, collectionsRes, highlights] = await Promise.all([
    listProducts({
      regionId: region.id,
      queryParams: {
        limit: 100,
        fields: "*variants.calculated_price,*variants,*collection,*tags",
      },
    }).catch(() => ({ response: { products: [] } })),
    listCollections().catch(() => ({ collections: [] })),
    getHomepageHighlights(),
  ])

  const rawProducts = productsRes.response?.products || []
  const rawCollections = collectionsRes?.collections || []

  // Check if an admin-curated collection named "Featured" exists
  const featuredCollection = rawCollections.find((c) => {
    const handle = c.handle?.toLowerCase() || ""
    const title = c.title?.toLowerCase() || ""
    return (
      handle === "featured" ||
      title.toLowerCase().includes("featured")
    )
  })

  // 1. If admin explicitly selected products in the "Featured & Deals" admin panel:
  let candidateProducts: HttpTypes.StoreProduct[] = []
  if (highlights.featured_product_ids?.length > 0) {
    const featuredIdSet = new Set(highlights.featured_product_ids)
    candidateProducts = rawProducts.filter((p) => featuredIdSet.has(p.id))
  }

  // 2. If no explicit admin selections yet, filter by Tag ("featured") OR by Collection ("Featured")
  if (candidateProducts.length === 0) {
    candidateProducts = rawProducts.filter((p) => {
      const hasFeaturedTag = (p as any).tags?.some((t: any) => {
        const val = (t.value || "").toLowerCase()
        return val === "featured" || val === "featured-product" || val.includes("featured")
      })

      const isInFeaturedCollection = featuredCollection && (
        p.collection_id === featuredCollection.id ||
        (p as any).collection?.id === featuredCollection.id ||
        (p as any).collection?.handle?.toLowerCase() === "featured"
      )

      return Boolean(hasFeaturedTag || isInFeaturedCollection)
    })
  }

  // 3. Gracefully fall back to latest products if none are tagged or assigned yet
  if (candidateProducts.length === 0) {
    candidateProducts = rawProducts.slice(0, 6)
  }

  if (candidateProducts.length === 0) {
    return null
  }

  // Format products for horizontal cards
  const products = candidateProducts.map((p) => {
    const { cheapestPrice } = getProductPrice({ product: p })
    const thumbnail =
      p.thumbnail ||
      p.images?.[0]?.url ||
      "/images/tamzen-hero-pendant.jpg"

    const diff = Number(cheapestPrice?.percentage_diff || 0)
    const hasSale = diff > 0

    return {
      id: p.id,
      title: p.title,
      handle: p.handle,
      thumbnail,
      price: cheapestPrice?.calculated_price ?? "EUR 49,00",
      originalPrice: cheapestPrice?.original_price ?? "",
      hasSale,
      discountPercent: diff,
    }
  })

  return (
    <section
      id="featured-products"
      className="w-full bg-bg-base py-20 lg:py-28 text-white relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#E5C378]/5 blur-[130px]" />

      <div className="content-container relative z-10">
        {/* ============================================================ */}
        {/* SECTION HEADER */}
        {/* ============================================================ */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#E5C378]/30 mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
              Curated Heritage
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display font-serif font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#FDFBF7] uppercase">
            Featured Products
          </h2>

          {/* Tamil Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-4 w-full max-w-xs mx-auto">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#E5C378]/60" />
            <div className="w-2.5 h-2.5 rotate-45 border border-[#E5C378] bg-bg-elevated" />
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#E5C378]/60" />
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base text-neutral-300 font-sans font-light max-w-md mx-auto leading-relaxed">
            Iconic diaspora statements forged in 316L surgical steel, designed to endure every chapter of your journey.
          </p>
        </div>

        {/* ============================================================ */}
        {/* HORIZONTAL PRODUCT CARDS GRID (2-3 COLUMNS) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <LocalizedClientLink
              key={product.id}
              href={`/products/${product.handle}`}
              className="group relative flex items-center gap-4 sm:gap-5 p-3.5 sm:p-4 rounded-2xl bg-bg-elevated hover:bg-bg-surface border border-white/10 hover:border-[#E5C378]/50 shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_35px_rgba(229,195,120,0.12)] transition-all duration-300 active:scale-[0.99]"
            >
              {/* LEFT: Product Image in rounded dark tile */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-white/10">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 96px, 128px"
                  className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                />
                {product.hasSale && (
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E5C378] text-neutral-950 shadow-sm">
                    -{product.discountPercent}%
                  </span>
                )}
              </div>

              {/* RIGHT: Product Details */}
              <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5 h-full">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1">
                    316L Surgical Steel
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-[#FDFBF7] group-hover:text-[#E5C378] transition-colors line-clamp-2 leading-snug">
                    {product.title}
                  </h3>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-display font-bold text-sm sm:text-base text-[#E5C378]">
                      {product.price}
                    </span>
                    {product.hasSale && (
                      <span className="text-xs text-neutral-400 line-through font-mono">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-neutral-400 group-hover:text-[#E5C378] transition-colors inline-flex items-center gap-1 font-medium">
                    <span>View</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </span>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
