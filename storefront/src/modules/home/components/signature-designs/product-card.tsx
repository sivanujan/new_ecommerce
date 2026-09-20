import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function ProductCard({
  product,
  isNew = false,
}: {
  product: HttpTypes.StoreProduct
  isNew?: boolean
}) {
  const { cheapestPrice } = getProductPrice({ product })

  // Use thumbnail or first image
  const imageUrl =
    product.thumbnail ||
    product.images?.[0]?.url ||
    "/images/tamzen-hero-pendant.jpg"

  // Clean description fallback
  const description =
    product.description ||
    product.subtitle ||
    "Signature cultural jewelry in premium 316L stainless steel."

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-300/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:border-black/30 transition-all duration-300">
      {/* Product Image Area */}
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="relative aspect-square w-full bg-neutral-100 block overflow-hidden group"
      >
        <Image
          src={imageUrl}
          alt={product.title || "TamZen Jewelry"}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* NEW Badge */}
        {isNew && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] bg-black text-white shadow-md">
              New
            </span>
          </div>
        )}
      </LocalizedClientLink>

      {/* Card Content with High Contrast Text */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between bg-white text-neutral-900">
        <div className="mb-4">
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="block group"
          >
            <h3 className="font-display text-base sm:text-lg font-bold text-neutral-900 group-hover:text-black transition-colors line-clamp-1">
              {product.title}
            </h3>
          </LocalizedClientLink>

          <p className="text-xs text-neutral-600 font-sans mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price & Action Row (Never cut off!) */}
        <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold font-sans">
              Price
            </span>
            <span className="text-sm sm:text-base font-bold text-neutral-900 font-sans mt-0.5">
              {cheapestPrice?.calculated_price ?? "EUR 49,00"}
            </span>
          </div>

          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="inline-flex items-center justify-center px-5 py-2 rounded-full text-[11px] uppercase tracking-widest font-semibold text-white bg-black hover:bg-neutral-800 active:scale-95 transition-all shadow-sm"
          >
            View
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
