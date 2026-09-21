import Image from "next/image"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function RootedInPurpose() {
  const categories = await listCategories().catch(() => [])

  // Desired 3 curated category showcases per brand requirements
  const defaultCategoryShowcases = [
    {
      title: "Pendants",
      handle: "bijoux",
      image: "/images/tamzen-hero-pendant.jpg",
      subtext: "Cultural Dog-Tags",
    },
    {
      title: "Chains",
      handle: "chains",
      image: "/images/pendant-closeup-macro.jpg",
      subtext: "316L Venetian & Box",
    },
    {
      title: "Special Editions",
      handle: "signature",
      image: "/images/tamzen-hero-pendant.jpg",
      subtext: "Limited Lion Crests",
    },
  ]

  // If live categories exist in Medusa, match their titles/handles
  const categoryCards = defaultCategoryShowcases.map((card, idx) => {
    const liveCat = categories?.find(
      (c) =>
        c.handle?.toLowerCase().includes(card.title.toLowerCase()) ||
        c.name?.toLowerCase().includes(card.title.toLowerCase())
    ) || categories?.[idx]

    return {
      title: card.title,
      handle: liveCat?.handle || card.handle,
      subtext: card.subtext,
      image: card.image,
    }
  })

  return (
    <section
      id="purpose"
      className="w-full bg-bg-base py-20 lg:py-28 relative overflow-hidden"
    >
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Panel: Close-up macro image + Heading + CTA */}
          <div className="lg:col-span-4 flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-bg-elevated border border-white/10 relative overflow-hidden group shadow-2xl">
            {/* Background Macro Image with Dark Overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/pendant-closeup-macro.jpg"
                alt="TamZen Pendant Close-up Detail"
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105 opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            </div>

            {/* Top Text Content */}
            <div className="relative z-10 flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#C59B51] font-sans mb-3 block">
                Our Collection
              </span>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-tight mb-4">
                Rooted In
                <br />
                <span className="text-white">Purpose</span>
              </h2>

              <p className="text-sm text-neutral-300 font-sans font-light leading-relaxed max-w-xs">
                Symbols for a stronger tomorrow. Every motif embodies ancient resistance, pride, and continuity.
              </p>
            </div>

            {/* Bottom Bordered CTA Button */}
            <div className="relative z-10 mt-10">
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-semibold text-white border border-white/30 hover:border-white hover:bg-white/10 transition-all group"
              >
                <span>View All</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 font-sans">
                  &rarr;
                </span>
              </LocalizedClientLink>
            </div>
          </div>

          {/* Center: Three Category Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {categoryCards.map((cat, idx) => (
              <LocalizedClientLink
                key={idx}
                href={`/categories/${cat.handle}`}
                className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-bg-elevated border border-white/10 hover:border-[#C59B51]/60 transition-all duration-300 p-3 shadow-lg"
              >
                {/* Category Image Box */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-950 mb-3">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 220px"
                    className="object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Corner Accent Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#C59B51] inline-block shadow-[0_0_8px_#C59B51]" />
                  </div>
                </div>

                {/* Label Underneath */}
                <div className="px-1.5 pb-1 flex flex-col">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#C59B51] transition-colors">
                    {cat.title}
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-sans tracking-wide mt-0.5">
                    {cat.subtext}
                  </span>
                </div>
              </LocalizedClientLink>
            ))}
          </div>

          {/* Right: Narrow Vertical Accent Panel */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl min-h-[300px] lg:min-h-full flex items-center justify-center p-6 group">
            <Image
              src="/images/sunset-palm-accent.jpg"
              alt="Our History Lives Through Us"
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 200px"
              className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Deep Warm Overlay for Contrast */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

            {/* Vertical Spaced-out Text */}
            <div className="relative z-10 text-center flex flex-col items-center justify-center">
              <span className="w-[1.5px] h-10 bg-[#C59B51] mb-4" />
              <p
                className="font-display text-xs sm:text-sm font-extrabold text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-loose text-center"
                style={{
                  letterSpacing: "0.28em",
                }}
              >
                Our History
                <br />
                Lives
                <br />
                Through
                <br />
                <span className="text-[#E5C378]">Us</span>
              </p>
              <span className="w-[1.5px] h-10 bg-[#C59B51] mt-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
