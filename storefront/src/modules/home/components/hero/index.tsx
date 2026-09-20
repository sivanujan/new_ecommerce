import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Hero() {
  const verticalMenu = ["PEOPLE", "HERITAGE", "IDENTITY", "STYLE", "FOREVER"]

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
        {/* 1. Left-to-right gradient (heavy dark on the left text side, open clarity towards the temple) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30 lg:from-black/90 lg:via-black/55 lg:to-transparent" />

        {/* 2. Top and bottom subtle vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

        {/* 3. Warm amber ambient wash */}
        <div className="absolute inset-0 bg-[#A07428]/10 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Hero Content Container - Vertically Centered */}
      <div className="content-container relative z-10 w-full py-12 sm:py-16 lg:py-24 my-auto">
        <div className="flex items-center justify-between gap-8">
          {/* Main Text Content: Eyebrow, Headline, Tamil tagline, Subtext, CTA Button */}
          <div className="flex flex-col items-start justify-center max-w-2xl lg:max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md mb-5 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-bold text-neutral-200 font-sans">
                Wear Your Roots
              </span>
            </div>

            {/* Huge bold serif headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-[0.98] text-white uppercase mb-4 sm:mb-5 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              More Than
              <br />
              <span className="text-[#E5C378] drop-shadow-[0_4px_25px_rgba(229,195,120,0.4)]">
                Jewellery
              </span>
            </h1>

            {/* Tamil Tagline */}
            <div className="inline-flex items-center gap-2.5 mb-6 py-1">
              <span className="w-3 h-[1.5px] bg-[#E5C378]" />
              <span className="text-base sm:text-lg font-semibold text-[#F3D798] font-sans tracking-wide drop-shadow-md">
                எங்கள் வேர் எங்கள் அடையாளம்
              </span>
            </div>

            {/* Subtext Paragraph */}
            <p className="text-sm sm:text-base lg:text-lg text-neutral-200 font-sans font-light leading-relaxed max-w-xl mb-8 sm:mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Symbols that define you. Forged in solid 316L stainless steel, carrying timeless cultural memory and personal strength for the modern diaspora.
            </p>

            {/* Explore Collection Pill Button */}
            <LocalizedClientLink
              href="#purpose"
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-4.5 rounded-full text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-black bg-white hover:bg-[#F3D798] transition-all shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_30px_rgba(243,215,152,0.4)] active:scale-95 group"
            >
              <span>Explore Collection</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-sans">
                &rarr;
              </span>
            </LocalizedClientLink>
          </div>

          {/* Far Right: Vertical Menu List & Slider Counter (Desktop Only) */}
          <div className="hidden lg:flex flex-col items-center justify-between h-[440px] py-4 pl-6 border-l border-white/20 flex-shrink-0">
            {/* Vertical Menu Items */}
            <div className="flex flex-col items-center gap-7">
              {verticalMenu.map((item, idx) => (
                <span
                  key={idx}
                  className={`text-[9px] font-bold tracking-[0.28em] uppercase transition-colors cursor-pointer ${
                    idx === 1
                      ? "text-[#E5C378] font-black drop-shadow-sm"
                      : "text-white/60 hover:text-white"
                  }`}
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Slider Counter 01 / 03 */}
            <div className="flex flex-col items-center gap-2 text-center pt-6">
              <span className="text-xs font-bold text-white font-sans drop-shadow-sm">
                01
              </span>
              <span className="w-[1.5px] h-8 bg-white/30" />
              <span className="text-[10px] font-medium text-white/50 font-sans">
                03
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
