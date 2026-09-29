import { Metadata } from "next"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Our Story | TamZen — More Than Jewellery",
  description:
    "Our culture gave us the story. TAMZEN turns that story into something you wear. Crafted in premium 316L stainless steel, connecting our story with a new generation.",
  openGraph: {
    title: "Our Story | TamZen — What We Carry, Lives Beyond Us",
    description:
      "TAMZEN transforms meaningful symbols into modern jewellery — connecting our story with a new generation.",
  },
}

export default async function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-bg-base text-white pt-28 pb-20 sm:pb-28 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#E5C378]/[0.06] rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-40 right-10 w-[500px] h-[300px] bg-[#C99C47]/[0.04] rounded-full blur-[120px]" />

      <div className="content-container relative z-10 max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 mb-8 sm:mb-12">
          <LocalizedClientLink href="/" className="hover:text-[#E5C378] transition-colors">
            Home
          </LocalizedClientLink>
          <span>/</span>
          <span className="text-[#E5C378]">Our Story</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#E5C378]/30 mb-5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
              Our Story
            </span>
          </div>

          <h1 className="font-display font-serif font-bold text-3xl sm:text-5xl lg:text-6xl text-[#FDFBF7] tracking-tight mb-4">
            What We Carry, <br />
            <span className="text-[#E5C378]">Lives Beyond Us.</span>
          </h1>

          {/* Tamil Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-6 w-48 mx-auto">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#E5C378]/60" />
            <div className="w-2.5 h-2.5 rotate-45 border border-[#E5C378] bg-bg-elevated" />
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#E5C378]/60" />
          </div>

          {/* Lead Narrative */}
          <div className="max-w-2xl mx-auto space-y-6 text-center mt-4">
            <p className="font-serif text-lg sm:text-2xl text-neutral-200 leading-relaxed">
              Our culture is more than where we come from.
              <br />
              <span className="text-white font-medium">It is what we carry, what we remember, and what we pass forward.</span>
            </p>

            <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
              TAMZEN transforms meaningful symbols into modern jewellery — connecting our story with a new generation.
            </p>
          </div>
        </div>

        {/* Feature Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {/* Card 1: Heritage & Meaning */}
          <div className="p-8 sm:p-10 rounded-3xl bg-bg-elevated border border-white/10 relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <span className="text-[11px] uppercase tracking-widest text-[#E5C378] font-mono font-bold block mb-3">
                Heritage & Meaning
              </span>
              <h3 className="font-display font-serif text-2xl text-white font-bold mb-3">
                Symbols of Identity
              </h3>
              <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                Every piece is inspired by timeless Tamil culture and shaped by living history, reimagined into bold contemporary silhouettes that accompany you anywhere in the world.
              </p>
            </div>
          </div>

          {/* Card 2: 316L Stainless Steel */}
          <div className="p-8 sm:p-10 rounded-3xl bg-bg-elevated border border-white/10 relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <span className="text-[11px] uppercase tracking-widest text-[#E5C378] font-mono font-bold block mb-3">
                Enduring Craftsmanship
              </span>
              <h3 className="font-display font-serif text-2xl text-white font-bold mb-3">
                Premium 316L Steel
              </h3>
              <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                Forged with medical-grade 316L stainless steel for water resistance, sweat resistance, and hypoallergenic comfort designed to never fade or tarnish.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8 border-t border-white/10">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#E5C378] text-[#0B0F17] hover:bg-[#F3D798] transition-all font-sans font-bold text-xs uppercase tracking-widest shadow-[0_8px_25px_rgba(229,195,120,0.25)] hover:scale-105 active:scale-95"
          >
            <span>Explore The Collection</span>
            <span>&rarr;</span>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
