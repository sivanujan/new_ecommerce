import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import Hero from "@modules/home/components/hero"
import TrustBar from "@modules/home/components/trust-bar"
import SignatureDesigns from "@modules/home/components/signature-designs"
import BrandStory from "@modules/home/components/brand-story"

export const metadata: Metadata = {
  title: "TamZen — More Than Jewellery | Culture • Style • Identity",
  description:
    "Bespoke cultural pendants and dog-tag jewelry forged in 316L stainless steel. Symbols that define you. Wear your roots.",
  openGraph: {
    title: "TamZen — More Than Jewellery",
    description:
      "Bespoke cultural pendants and dog-tag jewelry forged in 316L stainless steel. Symbols that define you. Wear your roots.",
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
    <div className="w-full flex flex-col bg-[#0B0B0C]">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. Signature Designs Grid (Light background to contrast dark hero) */}
      <SignatureDesigns region={region} />

      {/* 4. Brand Story & Values Band */}
      <BrandStory />
    </div>
  )
}
