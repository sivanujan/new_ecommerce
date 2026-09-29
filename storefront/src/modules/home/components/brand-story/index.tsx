import NewsletterForm from "./newsletter-form"

export default function BrandStory() {
  return (
    <div className="w-full flex flex-col">
      {/* ============================================================ */}
      {/* 1. OUR STORY SECTION */}
      {/* ============================================================ */}
      <section
        id="our-story"
        className="w-full bg-bg-base py-20 sm:py-28 lg:py-32 text-white relative overflow-hidden"
      >
        {/* Full-width ambient glow & lighting */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#E5C378]/[0.06] rounded-full blur-[140px]" />

        <div className="content-container relative z-10">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#E5C378]/30 mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
                Our Story
              </span>
            </div>

            {/* Bold Serif Heading */}
            <h2 className="font-display font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#FDFBF7] tracking-tight mb-4">
              What We Carry, <br className="hidden sm:inline" />
              <span className="text-[#E5C378]">Lives Beyond Us.</span>
            </h2>

            {/* Tamil Decorative Gold Divider */}
            <div className="flex items-center justify-center gap-3 my-6 w-40 mx-auto">
              <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#E5C378]/60" />
              <div className="w-2 h-2 rotate-45 border border-[#E5C378] bg-bg-elevated" />
              <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#E5C378]/60" />
            </div>

            {/* Story Narrative */}
            <div className="max-w-2xl mx-auto space-y-4 text-center">
              <p className="text-base sm:text-lg lg:text-xl text-neutral-200 font-serif leading-relaxed">
                Our culture is more than where we come from.
                <br />
                It is what we carry, what we remember, and what we pass forward.
              </p>
              <p className="text-sm sm:text-base text-[#E5C378]/90 font-sans leading-relaxed tracking-wide font-medium">
                TAMZEN transforms meaningful symbols into modern jewellery — connecting our story with a new generation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. BE PART OF TAMZEN - TRUE FULL-WIDTH COMMUNITY SECTION */}
      {/* ============================================================ */}
      <section
        id="community"
        className="w-full bg-gradient-to-b from-[#0F0F11] via-[#09090A] to-bg-base border-t border-white/[0.08] py-20 sm:py-24 lg:py-28 text-white relative overflow-hidden"
      >
        {/* Full-width luxury ambient lighting */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#E5C378]/30 to-transparent" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#E5C378]/[0.04] rounded-full blur-[130px]" />

        <div className="content-container relative z-10 flex flex-col items-center text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#E5C378]/30 mb-5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
                Something new is always coming
              </span>
            </div>

            {/* Bold Serif Heading matching Our Story typography */}
            <h3 className="font-display font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#FDFBF7] tracking-tight mb-4">
              Be Part of <span className="text-[#E5C378]">TAMZEN</span>
            </h3>

            {/* Tamil Decorative Gold Divider */}
            <div className="flex items-center justify-center gap-3 my-4 w-32 mx-auto">
              <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#E5C378]/50" />
              <div className="w-1.5 h-1.5 rotate-45 border border-[#E5C378] bg-bg-elevated" />
              <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#E5C378]/50" />
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed mb-8">
              Get first access to new pieces, limited releases, exclusive offers, and stories from TAMZEN.
            </p>

            {/* Newsletter Input Form */}
            <div className="w-full max-w-lg mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
