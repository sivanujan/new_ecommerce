import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import Hero from "@modules/home/components/hero"
import TrustBar from "@modules/home/components/trust-bar"
import RootedInPurpose from "@modules/home/components/rooted-in-purpose"
import SignatureDesigns from "@modules/home/components/signature-designs"
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
    <div className="w-full flex flex-col bg-[#F7F6F3]">
      {/* 1. Light Hero Section */}
      <Hero />

      {/* 2. Trust Bar (Light Background) */}
      <TrustBar />

      {/* 3. Rooted In Purpose Collection Band (Dark Background) */}
      <RootedInPurpose />

      {/* 4. Signature Designs Grid (Light Background) */}
      <SignatureDesigns region={region} />

      {/* 5. Brand Story & Philosophy Band (Dark Background) */}
      <BrandStory />
    </div>
  )
}
