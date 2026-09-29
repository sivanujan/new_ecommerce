import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import ProductCard from "./product-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function SignatureDesigns({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  // Query products live from Medusa backend
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 8,
      fields: "*variants.calculated_price",
    },
  }).catch(() => ({ response: { products: [] } }))

  return (
    <section id="collection" className="w-full bg-[#F4F5F8] py-20 lg:py-28 text-neutral-900 border-b border-neutral-300">
      <div className="content-container">
        {/* Section Header with Crisp Dark Typography */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-200/90 border border-neutral-300 text-[11px] uppercase tracking-[0.25em] font-bold text-neutral-800 mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
            SIGNATURE COLLECTION
          </span>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-neutral-950 uppercase">
            Symbols Made to Be Worn
          </h2>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-4 w-full max-w-xs">
            <span className="h-[1.5px] flex-1 bg-neutral-400" />
            <div className="w-2.5 h-2.5 rotate-45 border-2 border-neutral-800 bg-neutral-300" />
            <span className="h-[1.5px] flex-1 bg-neutral-400" />
          </div>

          <p className="text-base sm:text-lg text-neutral-800 font-sans font-medium tracking-wide">
            Crafted in premium 316L stainless steel, TAMZEN brings meaningful Tamil symbols into modern jewellery — bold pieces created for everyday wear, wherever life takes you.
          </p>
        </div>

        {/* Product Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 items-stretch">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isNew={index === 0 || index === 2}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-300 max-w-md mx-auto p-8 shadow-sm">
            <p className="text-neutral-700 text-sm font-medium">
              Discover our upcoming signature collection.
            </p>
          </div>
        )}

        {/* Bottom Callout */}
        <div className="mt-14 sm:mt-16 flex justify-center">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold text-white bg-black hover:bg-neutral-800 transition-all shadow-md active:scale-95"
          >
            Explore All Creations &rarr;
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
