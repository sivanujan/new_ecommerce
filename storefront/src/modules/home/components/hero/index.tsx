import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[calc(100dvh-5rem)] lg:min-h-[calc(100vh-5rem)] flex items-center justify-center bg-bg-base">
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
        {/* 1. Left-to-right gradient (heavy dark on text side, open clarity towards temple) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30 lg:from-black/90 lg:via-black/55 lg:to-transparent" />

        {/* 2. Top and bottom subtle vignettes blending into bg-base */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/80 to-transparent pointer-events-none" />

        {/* 3. Warm amber ambient wash */}
        <div className="absolute inset-0 bg-[#A07428]/10 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Hero Content Container - Vertically Centered */}
      <div className="content-container relative z-10 w-full py-12 sm:py-16 lg:py-20 my-auto">
        <div className="flex flex-col items-start justify-center max-w-2xl lg:max-w-3xl pr-0 lg:pr-4">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md mb-4 sm:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-bold text-neutral-200 font-sans">
              Wear Your Roots
            </span>
          </div>

          {/* Huge bold serif headline */}
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[74px] tracking-tight leading-[1.05] text-white uppercase mb-3 sm:mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            More Than
            <br />
            <span className="text-[#E5C378] drop-shadow-[0_4px_25px_rgba(229,195,120,0.4)]">
              Jewellery.
            </span>
          </h1>

          {/* Tamil Tagline */}
          <div className="inline-flex items-center gap-2.5 mb-4 sm:mb-5 py-0.5">
            <span className="w-3.5 h-[1.5px] bg-[#E5C378]" />
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-[#F3D798] tracking-wide drop-shadow-md">
              எங்கள் அடையாளம். எங்கள் பெருமை.
            </span>
          </div>

          {/* Cultural Story Hook & Description */}
          <div className="flex flex-col gap-2.5 max-w-xl mb-6 sm:mb-8">
            <p className="text-sm sm:text-base lg:text-lg font-serif italic text-neutral-100 leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              Our culture gave us the story.
              <br />
              <span className="text-[#E5C378] font-semibold not-italic">TAMZEN</span> turns that story into something you wear.
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-neutral-300 font-sans font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Crafted in premium 316L stainless steel, each piece carries a symbol of where we come from — reimagined for the generation that carries it forward.
            </p>
          </div>

          {/* Explore Collection Pill Button */}
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center justify-center gap-2.5 sm:gap-3 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-black bg-white hover:bg-[#F3D798] transition-all shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_30px_rgba(243,215,152,0.4)] active:scale-95 group"
          >
            <span>Explore Collection</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-sans">
              &rarr;
            </span>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
