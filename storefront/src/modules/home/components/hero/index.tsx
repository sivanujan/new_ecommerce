import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import HeroProductSlider, { HeroSliderProduct } from "./hero-slider"

export default async function Hero({
  countryCode,
  region,
}: {
  countryCode?: string
  region?: HttpTypes.StoreRegion
}) {
  // Query live products from Medusa backend (first 3-5 items)
  const {
    response: { products },
  } = await listProducts({
    regionId: region?.id,
    countryCode: countryCode || "fr",
    queryParams: {
      limit: 5,
      fields: "*variants.calculated_price",
    },
  }).catch(() => ({ response: { products: [] } }))

  // Prepare slides with calculated EUR prices
  const sliderProducts: HeroSliderProduct[] = (products || []).slice(0, 5).map((product) => {
    const { cheapestPrice } = getProductPrice({ product })

    const thumbnail =
      product.thumbnail ||
      product.images?.[0]?.url ||
      "/images/tamzen-hero-pendant.jpg"

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      thumbnail,
      price: cheapestPrice?.calculated_price ?? "€49.00",
    }
  })

  return (
    <section className="relative w-full overflow-hidden min-h-[100dvh] lg:min-h-screen flex items-center justify-center">
      {/* Full-bleed Traditional Heritage Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tamil-heritage-hero-bg.jpg"
          alt="Ancient Tamil coastal temple gopuram heritage background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[65%_center] sm:object-center transform scale-105 transition-transform duration-1000"
        />

        {/* Directional scrim overlays for WCAG AA readability */}
        {/* 1. Left-to-right gradient (heavy dark on the left text side, open clarity towards the right) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40 lg:from-black/90 lg:via-black/60 lg:to-black/30" />

        {/* 2. Top and bottom subtle vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

        {/* 3. Warm amber ambient wash */}
        <div className="absolute inset-0 bg-[#A07428]/10 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Hero Content Container - Vertically Centered */}
      <div className="content-container relative z-10 w-full py-12 sm:py-16 lg:py-20 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-10 items-center lg:items-end">
          {/* Left Column: Eyebrow, Headline, Tamil tagline, Subtext, CTA Button */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start justify-center pr-0 lg:pr-2">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md mb-4 sm:mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-bold text-neutral-200 font-sans">
                Wear Your Roots
              </span>
            </div>

            {/* Huge bold serif headline */}
            <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[72px] tracking-tight leading-[1] text-white uppercase mb-3 sm:mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              More Than
              <br />
              <span className="text-[#E5C378] drop-shadow-[0_4px_25px_rgba(229,195,120,0.4)]">
                Jewellery
              </span>
            </h1>

            {/* Tamil Tagline */}
            <div className="inline-flex items-center gap-2.5 mb-4 sm:mb-5 py-0.5">
              <span className="w-3 h-[1.5px] bg-[#E5C378]" />
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-[#F3D798] font-sans tracking-wide drop-shadow-md">
                எங்கள் வேர் எங்கள் அடையாளம்
              </span>
            </div>

            {/* Subtext Paragraph */}
            <p className="text-xs sm:text-sm lg:text-base text-neutral-200 font-sans font-light leading-relaxed max-w-md mb-6 sm:mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Symbols that define you. Forged in solid 316L stainless steel, carrying timeless cultural memory and personal strength for the modern diaspora.
            </p>

            {/* Explore Collection Pill Button */}
            <LocalizedClientLink
              href="#purpose"
              className="inline-flex items-center justify-center gap-2.5 sm:gap-3 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-black bg-white hover:bg-[#F3D798] transition-all shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_30px_rgba(243,215,152,0.4)] active:scale-95 group"
            >
              <span>Explore Collection</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-sans">
                &rarr;
              </span>
            </LocalizedClientLink>
          </div>

          {/* Right Column: Live Product Slider + Desktop Vertical Menu & Counter */}
          <div className="lg:col-span-6 xl:col-span-6 w-full flex justify-center lg:justify-end">
            <HeroProductSlider products={sliderProducts} />
          </div>
        </div>
      </div>
    </section>
  )
}
