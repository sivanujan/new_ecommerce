import NewsletterForm from "./newsletter-form"

export default function BrandStory() {
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
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
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.49V8.62a8.28 8.28 0 0 0 4.82 1.52V6.69h-1z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
        </svg>
      ),
    },
  ]

  return (
    <section
      id="contact"
      className="w-full bg-[#0B0B0C] py-16 sm:py-20 lg:py-24 text-white relative overflow-hidden"
    >
      <div className="content-container relative z-10">
        {/* Bounded Luxury Card Container */}
        <div className="relative max-w-3xl mx-auto rounded-3xl p-8 sm:p-12 lg:p-14 overflow-hidden bg-gradient-to-b from-[#141418] via-[#101013] to-[#0D0D10] border border-white/10 hover:border-[#E5C378]/30 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center">
          {/* Ambient inner radial gold glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#E5C378]/10 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 right-10 w-64 h-64 rounded-full bg-[#C99C47]/5 blur-[80px]" />

          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#E5C378]/30 mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
              Join The Community
            </span>
          </div>

          {/* Serif Heading */}
          <h2 className="font-display font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#FDFBF7] uppercase tracking-tight mb-2">
            Stay Connected
          </h2>

          {/* Tamil Decorative Gold Divider */}
          <div className="flex items-center justify-center gap-3 my-3 w-40 mx-auto">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#E5C378]/60" />
            <div className="w-2 h-2 rotate-45 border border-[#E5C378] bg-[#121215]" />
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#E5C378]/60" />
          </div>

          {/* Subtext */}
          <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-md mx-auto leading-relaxed mb-8">
            Receive exclusive early access to limited seasonal runs, heritage archive releases, and private community drops.
          </p>

          {/* Functional Pill Form */}
          <NewsletterForm />

          {/* Social Icons Row */}
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-mono">
              Follow Our Journey
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
      </div>
    </section>
  )
}
