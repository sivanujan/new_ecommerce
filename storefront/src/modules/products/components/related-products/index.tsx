import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCardImage from "@modules/products/components/product-card-image"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const queryParams: HttpTypes.StoreProductListParams = {
    limit: 6,
    is_giftcard: false,
  }

  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }

  let products = await listProducts({
    queryParams,
    countryCode,
  })
    .then(({ response }) => {
      return response.products.filter(
        (p) => p.id !== product.id
      )
    })
    .catch(() => [])

  // Fallback: If no collection products found, fetch general products
  if (products.length < 2) {
    const fallbackProducts = await listProducts({
      queryParams: {
        limit: 6,
        is_giftcard: false,
        region_id: region.id,
      },
      countryCode,
    })
      .then(({ response }) => {
        return response.products.filter(
          (p) => p.id !== product.id
        )
      })
      .catch(() => [])

    products = fallbackProducts
  }

  if (!products.length) {
    return null
  }

  const displayedProducts = products.slice(0, 4)

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/15 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-neutral-300 font-sans">
            Curated For You
          </span>
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white uppercase mb-2">
          You May Also Like
        </h2>

        <div className="inline-flex items-center justify-center gap-2.5 my-1.5">
          <span className="h-[1px] w-8 bg-[#E5C378]/50" />
          <span className="text-xs sm:text-sm font-semibold text-[#F3D798] tracking-wider font-sans">
            எங்கள் வேர் எங்கள் அடையாளம்
          </span>
          <span className="h-[1px] w-8 bg-[#E5C378]/50" />
        </div>
      </div>

      {/* Luxury Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {displayedProducts.map((item) => {
          let formattedPrice = "—"
          try {
            const { cheapestPrice } = getProductPrice({ product: item })
            if (cheapestPrice?.calculated_price) {
              formattedPrice = cheapestPrice.calculated_price
            }
          } catch {
            formattedPrice = "—"
          }

          const categoryName =
            (item as any).categories?.[0]?.name ||
            item.collection?.title ||
            "Creation"

          return (
            <LocalizedClientLink
              key={item.id}
              href={`/products/${item.handle}`}
              className="group relative flex flex-col justify-between bg-[#121215] hover:bg-[#16161a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#E5C378]/50 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(229,195,120,0.12)] transition-all duration-500 active:scale-[0.99]"
            >
              {/* Image Frame */}
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-900/90 border-b border-white/10">
                <ProductCardImage src={item.thumbnail} alt={item.title || "Product image"} />

                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Category Pill Overlay */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.18em] bg-black/80 text-neutral-300 border border-white/15 backdrop-blur-md">
                    {categoryName}
                  </span>
                </div>
              </div>

              {/* Product Info Block */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wide group-hover:text-[#E5C378] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-neutral-400 font-sans font-light line-clamp-2 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="font-display text-base font-extrabold text-[#E5C378]">
                    {formattedPrice}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-300 group-hover:text-white transition-colors">
                    View Piece →
                  </span>
                </div>
              </div>
            </LocalizedClientLink>
          )
        })}
      </div>
    </div>
  )
}
