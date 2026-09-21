import CollectionInteractiveView, {
  CategoryOption,
  FormattedCollectionProduct,
} from "../components/collection-interactive-view"

export default function StoreTemplate({
  products,
  categories,
  initialCategory,
  initialSort,
}: {
  products: FormattedCollectionProduct[]
  categories: CategoryOption[]
  initialCategory?: string
  initialSort?: string
}) {
  return (
    <div className="w-full bg-[#0B0B0C] min-h-screen text-white flex flex-col">
      {/* 1. Compact Luxury Header Banner (Refined, not full-height) */}
      <section className="relative w-full py-14 sm:py-20 lg:py-24 border-b border-white/10 overflow-hidden bg-gradient-to-b from-[#121215] via-[#0B0B0C] to-[#0B0B0C]">
        {/* Subtle warm ambient golden glow behind heading */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[220px] bg-[#A07428]/12 rounded-full blur-[90px] pointer-events-none" />

        {/* Subtle geometric motif background lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        <div className="content-container relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-md mb-4 sm:mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-bold text-neutral-200 font-sans">
              The Complete Atelier
            </span>
          </div>

          {/* Bold serif display title */}
          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            The Collection
          </h1>

          {/* Tamil Cultural Subline */}
          <div className="inline-flex items-center justify-center gap-3 my-2 w-full">
            <span className="h-[1px] w-8 sm:w-12 bg-[#E5C378]/50" />
            <div className="w-2 h-2 rotate-45 border border-[#E5C378] bg-[#E5C378]/20" />
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-[#F3D798] tracking-wide font-sans drop-shadow-sm">
              எங்கள் வேர் எங்கள் அடையாளம்
            </span>
            <div className="w-2 h-2 rotate-45 border border-[#E5C378] bg-[#E5C378]/20" />
            <span className="h-[1px] w-8 sm:w-12 bg-[#E5C378]/50" />
          </div>

          {/* Short Intro Line */}
          <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-sans font-light max-w-xl mx-auto leading-relaxed mt-3">
            Timeless cultural symbols, crafted in solid 316L stainless steel and fine precious metals. Designed to carry your heritage everywhere you walk.
          </p>
        </div>
      </section>

      {/* 2. Sticky Interactive Filter/Sort Bar + Live Products Grid */}
      <CollectionInteractiveView
        products={products}
        categories={categories}
        initialCategory={initialCategory}
        initialSort={initialSort}
      />
    </div>
  )
}
