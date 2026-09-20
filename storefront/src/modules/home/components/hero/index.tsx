import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Hero() {
  const verticalMenu = ["PEOPLE", "HERITAGE", "IDENTITY", "STYLE", "FOREVER"]

  return (
    <section className="relative w-full bg-[#F7F6F3] border-b border-neutral-300/80 pt-8 pb-16 lg:py-20 overflow-hidden">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* Left Column: Headline, Tamil line, CTA */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start justify-center pr-0 lg:pr-6">
            {/* Eyebrow */}
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-neutral-500 mb-4 block font-sans">
              Wear Your Roots
            </span>

            {/* Huge bold serif headline */}
            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[74px] tracking-tight leading-[0.96] text-neutral-950 uppercase mb-4">
              More Than
              <br />
              <span className="text-[#C59B51] drop-shadow-sm">
                Jewellery
              </span>
            </h1>

            {/* Tamil tagline */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-2 h-[1px] bg-[#A07428]" />
              <span className="text-sm sm:text-base font-medium text-[#A07428] font-sans tracking-wide">
                எங்கள் வேர் எங்கள் அடையாளம்
              </span>
            </div>

            {/* Short subtext paragraph */}
            <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed max-w-md mb-8">
              Symbols that define you. Forged in solid 316L stainless steel, carrying timeless cultural memory and personal strength for the modern diaspora.
            </p>

            {/* Dark pill button */}
            <LocalizedClientLink
              href="#purpose"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold text-white bg-black hover:bg-neutral-800 transition-all shadow-md hover:shadow-xl active:scale-95 group"
            >
              <span>Explore Collection</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 font-sans">
                &rarr;
              </span>
            </LocalizedClientLink>
          </div>

          {/* Right Column: Large dark product hero image */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[440px] aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-300/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] group">
              <Image
                src="/images/tamzen-hero-pendant.jpg"
                alt="TamZen Cultural Pendant Hero Visual"
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 440px"
                className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* In-image caption tag */}
              <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                    Signature Drop
                  </div>
                  <div className="text-xs font-display font-semibold text-white tracking-wider uppercase mt-0.5">
                    The Lion Pendant &bull; 316L
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#C59B51] text-black">
                  Core
                </span>
              </div>
            </div>
          </div>

          {/* Far Right Column: Vertical menu list & slider counter */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-between h-[420px] py-4 pl-4 border-l border-neutral-300">
            {/* Vertical Menu List */}
            <div className="flex flex-col items-center gap-6">
              {verticalMenu.map((item, idx) => (
                <span
                  key={idx}
                  className={`text-[9px] font-bold tracking-[0.25em] uppercase transition-colors cursor-pointer ${
                    idx === 1
                      ? "text-neutral-950 font-black"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Slider Counter 01 / 03 */}
            <div className="flex flex-col items-center gap-2 text-center pt-6">
              <span className="text-xs font-bold text-neutral-950 font-sans">
                01
              </span>
              <span className="w-[1.5px] h-8 bg-neutral-300" />
              <span className="text-[10px] font-medium text-neutral-400 font-sans">
                03
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
