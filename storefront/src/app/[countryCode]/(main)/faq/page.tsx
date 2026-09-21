import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FAQAccordion from "@modules/faq/components/faq-accordion"
import { faqData } from "@modules/faq/faq-data"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | TamZen — More Than Jewellery",
  description:
    "Explore common questions about TamZen 316L stainless steel heritage jewelry, shipping timelines, European delivery, waterproof durability, and return policies.",
  openGraph: {
    title: "FAQ | TamZen — More Than Jewellery",
    description:
      "Frequently Asked Questions about our jewelry craftsmanship, shipping, returns, and care.",
  },
}

export default async function FAQPage() {
  // Generate FAQPage JSON-LD structured data for Google SEO rich results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      }))
    ),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full min-h-screen bg-bg-base text-white pt-28 pb-20 sm:pb-28 relative overflow-hidden">
        {/* Ambient background lighting */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#E5C378]/[0.05] rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute bottom-40 left-10 w-[500px] h-[300px] bg-[#C99C47]/[0.03] rounded-full blur-[120px]" />

        <div className="content-container relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          {/* ============================================================ */}
          {/* 1. COMPACT PAGE HEADER */}
          {/* ============================================================ */}
          <header className="text-center pt-4 sm:pt-8 pb-12 sm:pb-16 max-w-2xl mx-auto">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#E5C378]">
                Help Center
              </span>
            </div>

            {/* Main title */}
            <h1 className="font-display font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#FDFBF7] tracking-tight mb-3">
              Frequently Asked Questions
            </h1>

            {/* Tamil sub-line */}
            <p className="font-serif italic text-sm sm:text-base text-[#E5C378]/90 tracking-wider mb-4">
              அடிக்கடி கேட்கப்படும் கேள்விகள் &bull; Heritage &amp; Care
            </p>

            {/* Intro subtitle */}
            <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
              Find instant answers regarding our marine-grade 316L stainless steel craftsmanship, European shipping, sizing, and hassle-free returns.
            </p>
          </header>

          {/* ============================================================ */}
          {/* 2. ACCORDION SECTIONS */}
          {/* ============================================================ */}
          <main className="mb-16 sm:mb-20">
            <FAQAccordion />
          </main>

          {/* ============================================================ */}
          {/* 3. STILL HAVE QUESTIONS CTA BAND */}
          {/* ============================================================ */}
          <section
            aria-labelledby="cta-heading"
            className="rounded-2xl bg-gradient-to-b from-[#141418] to-[#121215] border border-white/10 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl"
          >
            {/* Ambient accent glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5C378]/40 to-transparent" />
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#E5C378]/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C378] mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>

              <h2 id="cta-heading" className="font-display font-serif font-bold text-xl sm:text-2xl text-white mb-2">
                Still have questions?
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                Can&apos;t find what you&apos;re looking for? Our concierge atelier team is here to assist with custom pieces, sizing, and personalized support.
              </p>

              <LocalizedClientLink
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#E5C378] text-black font-semibold text-xs sm:text-sm uppercase tracking-widest hover:bg-[#d4b065] transition-all shadow-[0_0_25px_rgba(229,195,120,0.3)] hover:shadow-[0_0_35px_rgba(229,195,120,0.5)] active:scale-98"
              >
                <span>Get In Touch</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </LocalizedClientLink>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
