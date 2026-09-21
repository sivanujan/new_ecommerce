import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export interface PromoBannerProps {
  eyebrow?: string
  heading?: string
  subtext?: string
  buttonText?: string
  buttonLink?: string
  imageSrc?: string
  imageAlt?: string
}

export default function PromoSection({
  eyebrow = "SIGNATURE TRENDING STYLE",
  heading = "Symbols Forged in 316L Steel",
  subtext = "Crafted for resilience, inspired by enduring heritage. Discover bold cultural pendants and chains engineered to withstand time, water, and sweat.",
  buttonText = "SHOP NOW",
  buttonLink = "/store",
  imageSrc = "/images/promo-campaign-banner.jpg",
  imageAlt = "TamZen luxury campaign model wearing 316L stainless steel lion dog-tag pendant",
}: PromoBannerProps) {
  const serviceFeatures = [
    {
      title: "Worldwide Shipping",
      subtext: "Order Above €100",
      icon: (
        <svg
          className="w-6 h-6 text-[#E5C378]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <circle cx="12" cy="12" r="10" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
          />
        </svg>
      ),
    },
    {
      title: "Money Back Guarantee",
      subtext: "Guarantee Within 30 Days",
      icon: (
        <svg
          className="w-6 h-6 text-[#E5C378]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Offers And Discounts",
      subtext: "Back Returns In 7 Days",
      icon: (
        <svg
          className="w-6 h-6 text-[#E5C378]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
    },
    {
      title: "24/7 Support Services",
      subtext: "Any Time Support",
      icon: (
        <svg
          className="w-6 h-6 text-[#E5C378]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11a7 7 0 00-14 0v5a3 3 0 003 3h1a1 1 0 001-1v-4a1 1 0 00-1-1H7v-2a5 5 0 0110 0v2h-2a1 1 0 00-1 1v4a1 1 0 001 1h1a3 3 0 003-3v-5z"
          />
        </svg>
      ),
    },
  ]

  return (
    <section
      id="promo-banner-service"
      className="w-full bg-[#0B0B0C] py-16 sm:py-20 lg:py-24 text-white relative overflow-hidden border-b border-white/10"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/3 right-10 w-[600px] h-[600px] rounded-full bg-[#E5C378]/5 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-[#C99C47]/5 blur-[120px]" />

      <div className="content-container relative z-10 flex flex-col gap-10 sm:gap-14">
        {/* ============================================================ */}
        {/* 1. PROMO BANNER (FULL WIDTH CARD) */}
        {/* ============================================================ */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#121215] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] lg:min-h-[520px]">
            {/* Left Content Area */}
            <div className="lg:col-span-6 xl:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-start z-20 relative bg-gradient-to-r from-[#121215] via-[#121215]/95 to-transparent">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#E5C378]/30 mb-5 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
                  {eyebrow}
                </span>
              </div>

              {/* Bold Serif Heading */}
              <LocalizedClientLink
                href={buttonLink}
                className="group/heading"
              >
                <h2 className="font-display font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#FDFBF7] group-hover/heading:text-[#E5C378] transition-colors tracking-tight leading-[1.15]">
                  {heading}
                </h2>
              </LocalizedClientLink>

              {/* Tamil Divider Line */}
              <div className="flex items-center gap-2 my-5 w-32">
                <span className="h-[2px] w-8 bg-[#E5C378]" />
                <span className="h-[1px] flex-1 bg-white/20" />
              </div>

              {/* Subtext */}
              <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed mb-8 max-w-md">
                {subtext}
              </p>

              {/* Prominent Gold Button */}
              <LocalizedClientLink
                href={buttonLink}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-sans font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:brightness-110 shadow-[0_4px_25px_rgba(229,195,120,0.35)] hover:shadow-[0_8px_35px_rgba(229,195,120,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span>{buttonText}</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </LocalizedClientLink>
            </div>

            {/* Right Lifestyle / Campaign Image Area */}
            <div className="lg:col-span-6 xl:col-span-7 relative min-h-[300px] sm:min-h-[380px] lg:min-h-full w-full overflow-hidden">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center lg:object-right transform transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Scrim overlays for smooth blending and guaranteed readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent lg:hidden pointer-events-none" />
              <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#121215] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. SERVICE BAR (DIRECTLY BELOW BANNER) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {serviceFeatures.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex items-center gap-4 p-5 rounded-2xl bg-[#121215] border border-white/10 hover:border-[#E5C378]/50 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(229,195,120,0.1)] transition-all duration-300"
            >
              {/* Icon Container with Gold Glow */}
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#E5C378]/50 group-hover:bg-[#E5C378]/10 flex items-center justify-center flex-shrink-0 transition-all duration-300">
                {item.icon}
              </div>

              {/* Text Information */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-[#FDFBF7] group-hover:text-[#E5C378] transition-colors font-sans tracking-wide">
                  {item.title}
                </span>
                <span className="text-xs text-neutral-400 font-sans tracking-normal mt-0.5">
                  {item.subtext}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
