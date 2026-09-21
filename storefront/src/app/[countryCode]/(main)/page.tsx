import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import Hero from "@modules/home/components/hero"
import TrustBar from "@modules/home/components/trust-bar"
import RootedInPurpose from "@modules/home/components/rooted-in-purpose"
import FeaturedProducts from "@modules/home/components/featured-products"
import DealOfTheWeek from "@modules/home/components/deal-of-the-week"
import PromoSection from "@modules/home/components/promo-section"
import BrandStory from "@modules/home/components/brand-story"

export const metadata: Metadata = {
  title: "TamZen | More Than Jewellery — எங்கள் வேர் எங்கள் அடையாளம்",
  description:
    "TamZen — Wear your roots. Bespoke cultural pendants and dog-tag jewelry in 316L stainless steel inspired by Tamil-Eelam heritage.",
  openGraph: {
    title: "TamZen | More Than Jewellery",
    description:
      "Symbols that define you. Wear your roots with 316L stainless steel cultural pendants.",
    images: ["/images/tamzen-hero-pendant.jpg"],
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <div className="w-full flex flex-col bg-bg-base">
      {/* 1. Full-Height Temple Hero (Fills the entire 100vh viewport) */}
      <Hero />

      {/* 2. Trust Bar (Directly below hero, reveals on scroll) */}
      <TrustBar />

      {/* 3. Rooted In Purpose Collection Band (Dark Background) */}
      <RootedInPurpose />

      {/* 4. Featured Products (Horizontal Cards Grid) */}
      <FeaturedProducts region={region} />

      {/* 5. Deal of the Week Carousel with Live Countdown Timer */}
      <DealOfTheWeek region={region} />


      {/* 6. Promo Banner + Service Bar Section */}
      <PromoSection />

      {/* 7. Brand Story & Philosophy Band (Dark Background) */}
      <BrandStory />
    </div>
  )
}


