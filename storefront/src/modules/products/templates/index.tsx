import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductOverview from "@modules/products/components/product-overview"
import RelatedProducts from "@modules/products/components/related-products"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="w-full bg-[#0B0B0C] min-h-screen text-white flex flex-col">
      {/* 1. Breadcrumb Bar */}
      <div className="w-full border-b border-white/10 py-3.5 bg-black/20">
        <div className="content-container flex items-center gap-2 text-xs font-sans text-neutral-400 overflow-x-auto no-scrollbar">
          <LocalizedClientLink
            href="/"
            className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
          >
            Home
          </LocalizedClientLink>
          <span className="text-neutral-600">/</span>
          <LocalizedClientLink
            href="/store"
            className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
          >
            Collection
          </LocalizedClientLink>
          <span className="text-neutral-600">/</span>
          <span className="text-[#E5C378] font-medium truncate uppercase tracking-wider text-[11px]">
            {product.title}
          </span>
        </div>
      </div>

      {/* 2. Main Product Area: Balanced 2-Column Luxury Layout */}
      <div className="content-container py-8 sm:py-12 lg:py-16">
        <ProductOverview
          product={product}
          region={region}
          initialImages={images}
        />
      </div>

      {/* 3. Related Products Section: "You May Also Like" */}
      <div
        className="content-container py-16 sm:py-24 border-t border-white/10 mt-8 sm:mt-16"
        data-testid="related-products-container"
      >
        <Suspense
          fallback={
            <div className="w-full h-80 rounded-2xl bg-white/[0.02] border border-white/10 animate-pulse flex items-center justify-center text-neutral-500 text-sm">
              Loading curated pieces...
            </div>
          }
        >
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
