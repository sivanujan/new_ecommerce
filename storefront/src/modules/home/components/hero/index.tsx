import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0B0B0C] border-b border-white/10 pt-8 pb-16 lg:py-24">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-white/[0.03] via-white/[0.06] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-slate-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="content-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[70vh]">
          {/* Left Column: Headline, subtext, CTA */}
          <div className="lg:col-span-7 flex flex-col items-start justify-center">
            {/* Elegant Accent Script / Kicker */}
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-sm mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-neutral-300">
                Culture • Style • Identity
              </span>
            </div>

            {/* Big bold headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-[-0.02em] leading-[1.04] text-white uppercase mb-6">
              More Than
              <br />
              <span className="metallic-text-gradient">
                Jewellery
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg lg:text-xl text-neutral-300 font-light leading-relaxed max-w-xl mb-10 tracking-wide">
              Symbols that define you. Wear your roots.
              <span className="block mt-1 text-sm text-neutral-400 font-normal">
                Bespoke dog-tag pendants forged in 316L stainless steel, embodying ancient strength and modern elegance.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <LocalizedClientLink
                href="#collection"
                className="pill-btn-primary"
              >
                <span>Shop Now</span>
                <svg
                  className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="#story"
                className="pill-btn-outline"
              >
                Our Story
              </LocalizedClientLink>
            </div>

            {/* Micro spec note */}
            <div className="mt-12 flex items-center gap-6 pt-6 border-t border-white/10 text-xs text-neutral-400 uppercase tracking-widest font-sans">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">316L</span>
                <span>Stainless Steel</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              <div>Non-Tarnish</div>
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              <div>Water-Resistant</div>
            </div>
          </div>

          {/* Right Column: Large showcase product visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] lg:max-w-[500px] aspect-square rounded-2xl p-2.5 bg-gradient-to-b from-white/15 via-white/5 to-transparent border border-white/15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] group">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-950">
                <Image
                  src="/images/tamzen-hero-pendant.jpg"
                  alt="TamZen Cultural Lion Emblem Pendant in 316L Stainless Steel"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                  className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                {/* Floating cultural badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl glass-dark border border-white/15 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                      Featured Piece
                    </div>
                    <div className="text-sm font-display font-semibold tracking-wide text-white mt-0.5">
                      The Lion Emblem Pendant
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-semibold uppercase tracking-wider text-neutral-200">
                    Signature
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
