import { Metadata } from "next"
import ContactForm from "@modules/contact/components/contact-form"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Contact Us | TamZen — More Than Jewellery",
  description:
    "Get in touch with the TamZen atelier team. Reach out for customer support, custom cultural pendant requests, or order inquiries.",
  openGraph: {
    title: "Contact Us | TamZen — More Than Jewellery",
    description:
      "Get in touch with the TamZen team. Customer care, sizing, and order assistance.",
  },
}

export default async function ContactPage() {
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      handle: "@tamzen_official",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://tiktok.com",
      handle: "@tamzen_jewellery",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.49V8.62a8.28 8.28 0 0 0 4.82 1.52V6.69h-1z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      handle: "TamZen Heritage",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
        </svg>
      ),
    },
  ]

  const quickFaqs = [
    {
      q: "When will my order ship?",
      a: "Orders are processed within 24 to 48 hours and dispatched with tracked express delivery across Europe and worldwide.",
    },
    {
      q: "Can I wear it in the shower or gym?",
      a: "Yes. All pieces are forged in solid 316L stainless steel — completely waterproof, sweatproof, and corrosion-free.",
    },
    {
      q: "What is your return policy?",
      a: "We offer a 30-day hassle-free money back guarantee on all unworn items in original packaging.",
    },
  ]

  return (
    <div className="w-full min-h-screen bg-[#0B0B0C] text-white pt-28 pb-20 sm:pb-28 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#E5C378]/[0.06] rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-40 right-10 w-[500px] h-[300px] bg-[#C99C47]/[0.04] rounded-full blur-[120px]" />

      <div className="content-container relative z-10">
        {/* ============================================================ */}
        {/* 1. COMPACT PAGE HEADER */}
        {/* ============================================================ */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#E5C378]/30 mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
              Get In Touch
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-serif font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#FDFBF7] uppercase">
            Contact Us
          </h1>

          {/* Tamil Sub-line */}
          <p className="font-serif italic text-xs sm:text-sm text-[#E5C378]/90 tracking-wide mt-2">
            எங்களை தொடர்பு கொள்ளுங்கள் &mdash; We are here for you
          </p>

          {/* Tamil Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-4 w-40 mx-auto">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#E5C378]/60" />
            <div className="w-2 h-2 rotate-45 border border-[#E5C378] bg-[#121215]" />
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#E5C378]/60" />
          </div>

          {/* Intro line */}
          <p className="text-xs sm:text-sm lg:text-base text-neutral-300 font-sans max-w-lg mx-auto leading-relaxed">
            Have a question about our cultural pendants, sizing, or an existing order? Send us a message or reach out through our official channels.
          </p>
        </div>

        {/* ============================================================ */}
        {/* 2. TWO-COLUMN MAIN AREA */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT: Contact Form Card (7 Cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* RIGHT: Contact Information & Details (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Primary Contact Info Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121215] border border-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.5)] flex flex-col gap-6">
              <h3 className="font-display font-serif font-bold text-lg sm:text-xl text-[#FDFBF7] tracking-wide border-b border-white/10 pb-4">
                Direct Inquiries
              </h3>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#E5C378]/10 border border-[#E5C378]/30 flex items-center justify-center flex-shrink-0 text-[#E5C378]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-400">
                    Email Our Atelier
                  </span>
                  <a
                    href="mailto:contact@tamzen.com"
                    className="font-sans font-bold text-sm sm:text-base text-[#FDFBF7] hover:text-[#E5C378] transition-colors mt-0.5"
                  >
                    contact@tamzen.com
                  </a>
                  <span className="text-[11px] text-neutral-400 font-sans mt-0.5">
                    For custom inquiries, press & support
                  </span>
                </div>
              </div>

              {/* Support Hours */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#E5C378]/10 border border-[#E5C378]/30 flex items-center justify-center flex-shrink-0 text-[#E5C378]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-400">
                    Support Hours
                  </span>
                  <span className="font-sans font-bold text-sm sm:text-base text-[#FDFBF7] mt-0.5">
                    Monday &ndash; Friday
                  </span>
                  <span className="text-[11px] text-[#E5C378]/90 font-sans mt-0.5">
                    9:00 &ndash; 18:00 CET
                  </span>
                </div>
              </div>

              {/* Location & Shipping */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#E5C378]/10 border border-[#E5C378]/30 flex items-center justify-center flex-shrink-0 text-[#E5C378]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-400">
                    Hub & Shipping
                  </span>
                  <span className="font-sans font-bold text-sm sm:text-base text-[#FDFBF7] mt-0.5">
                    Europe &bull; France
                  </span>
                  <span className="text-[11px] text-emerald-400 font-sans mt-0.5 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Worldwide Delivery Available
                  </span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-white/10">
                <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-400 block mb-3">
                  Follow Our Social Channels
                </span>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full border border-white/10 hover:border-[#E5C378] bg-white/[0.04] hover:bg-[#E5C378]/10 flex items-center justify-center text-neutral-400 hover:text-[#E5C378] transition-all duration-300 shadow-sm hover:scale-105"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick FAQ Teaser Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#121215] border border-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.5)]">
              <h4 className="font-display text-xs uppercase tracking-[0.2em] font-bold text-[#E5C378] mb-4">
                Common Questions
              </h4>
              <div className="flex flex-col gap-4">
                {quickFaqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                    <p className="text-xs font-bold text-[#FDFBF7] font-sans">
                      {faq.q}
                    </p>
                    <p className="text-[11px] text-neutral-400 font-sans mt-1 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 text-center">
                <LocalizedClientLink
                  href="/store"
                  className="text-xs font-mono uppercase tracking-wider text-[#E5C378] hover:underline inline-flex items-center gap-1.5"
                >
                  <span>Explore The Full Collection</span>
                  <span>&rarr;</span>
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
