import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Hero() {
  const verticalMenu = ["PEOPLE", "HERITAGE", "IDENTITY", "STYLE", "FOREVER"]

  return (
    <section className="relative w-full overflow-hidden min-h-[640px] sm:min-h-[720px] lg:min-h-[85vh] flex items-center">
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
        {/* 1. Left-to-right gradient (heavy dark on the left text side, gentle transparency towards right) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/40 lg:from-black/90 lg:via-black/60 lg:to-black/30" />

        {/* 2. Top and bottom subtle vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

        {/* 3. Warm amber ambient wash */}
        <div className="absolute inset-0 bg-[#A07428]/10 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="content-container relative z-10 w-full py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* Left Column: Eyebrow, Headline, Tamil tagline, Subtext, CTA Button */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start justify-center pr-0 lg:pr-4">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-bold text-neutral-200 font-sans">
                Wear Your Roots
              </span>
            </div>

            {/* Huge bold serif headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[74px] tracking-tight leading-[0.98] text-white uppercase mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
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
            <p className="text-sm sm:text-base text-neutral-200 font-sans font-light leading-relaxed max-w-md mb-8 sm:mb-9 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Symbols that define you. Forged in solid 316L stainless steel, carrying timeless cultural memory and personal strength for the modern diaspora.
            </p>

            {/* Explore Collection Pill Button */}
            <LocalizedClientLink
              href="#purpose"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold text-black bg-white hover:bg-[#F3D798] transition-all shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_30px_rgba(243,215,152,0.4)] active:scale-95 group"
            >
              <span>Explore Collection</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-sans">
                &rarr;
              </span>
            </LocalizedClientLink>
          </div>

          {/* Right Column: Featured Lion Pendant Card */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-950/80 border border-white/25 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-sm group">
              <Image
                src="/images/tamzen-hero-pendant.jpg"
                alt="TamZen Cultural Lion Pendant in 316L Stainless Steel"
                fill
                priority
                unoptimized
                sizes="(max-width: 640px) 100vw, 420px"
                className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* In-image caption pill */}
              <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 p-3.5 sm:p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-between">
                <div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-300 font-medium">
                    Signature Drop
                  </div>
                  <div className="text-xs sm:text-sm font-display font-semibold text-white tracking-wider uppercase mt-0.5">
                    The Lion Pendant &bull; 316L
                  </div>
                </div>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#E5C378] text-black">
                  Core
                </span>
              </div>
            </div>
          </div>

          {/* Far Right Column: Vertical Menu List & Slider Counter (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-between h-[420px] py-4 pl-4 border-l border-white/20">
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
