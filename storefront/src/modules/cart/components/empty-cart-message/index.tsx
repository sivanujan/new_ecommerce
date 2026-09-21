import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="w-full max-w-xl mx-auto py-20 sm:py-28 px-4 flex flex-col items-center text-center"
      data-testid="empty-cart-message"
    >
      {/* Brand Atelier Bag Icon */}
      <div className="w-16 h-16 rounded-full border border-[#E5C378]/40 bg-neutral-900 text-[#E5C378] flex items-center justify-center shadow-lg mb-6">
        <svg
          className="w-7 h-7 text-[#E5C378]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>

      {/* Eyebrow */}
      <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-neutral-400 font-sans mb-2">
        TamZen Atelier
      </span>

      {/* Heading */}
      <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-tight mb-2">
        Your Shopping Bag is Empty
      </h1>

      {/* Tamil Line */}
      <div className="inline-flex items-center justify-center gap-2.5 my-2">
        <span className="h-[1px] w-6 bg-[#E5C378]/50" />
        <span className="text-xs sm:text-sm font-semibold text-[#F3D798] tracking-wider font-sans">
          எங்கள் வேர் எங்கள் அடையாளம்
        </span>
        <span className="h-[1px] w-6 bg-[#E5C378]/50" />
      </div>

      <p className="text-xs sm:text-sm text-neutral-300 font-sans font-light max-w-md mx-auto leading-relaxed mt-3 mb-8">
        You don&apos;t have any creations in your bag yet. Explore the atelier collection to discover our handcrafted cultural pieces.
      </p>

      {/* Browse Collection Button */}
      <LocalizedClientLink
        href="/store"
        className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-xs sm:text-sm bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:shadow-[0_0_25px_rgba(229,195,120,0.4)] hover:brightness-105 transition-all shadow-lg active:scale-95"
      >
        <span>Browse The Collection</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
