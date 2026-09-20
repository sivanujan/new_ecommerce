import NewsletterForm from "./newsletter-form"

export default function BrandStory() {
  const values = [
    {
      title: "Unique Designs",
      desc: "Inspired by ancient Tamil-Eelam cultural emblems, reimagined into contemporary minimalist jewelry.",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: "Premium Stainless Steel",
      desc: "Constructed with solid 316L surgical steel, offering unmatched tensile durability and sleek metallic weight.",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "Water & Fade Resistant",
      desc: "Engineered for life in motion. Sweat, swim, and shower without fear of corrosion or discoloration.",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
        </svg>
      ),
    },
    {
      title: "Perfect For Every Occasion",
      desc: "Effortless versatility that shifts seamlessly from streetwear to black-tie celebrations.",
      icon: (
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m12 6 2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
        </svg>
      ),
    },
  ]

  return (
    <section id="story" className="w-full bg-[#0B0B0C] border-t border-white/10 py-24 lg:py-32 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[500px] bg-slate-400/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="content-container relative z-10">
        {/* Brand Values Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-neutral-400 font-sans mb-3 block">
            Craftsmanship & Philosophy
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase">
            Forged in Identity
          </h2>
          <div className="w-12 h-[1px] bg-white/30 mx-auto mt-4" />
        </div>

        {/* 4 Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300 flex flex-col items-start"
            >
              <div className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center mb-6">
                {val.icon}
              </div>
              <h3 className="font-display text-base font-bold tracking-wide uppercase text-white mb-2">
                {val.title}
              </h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Brand Quote Box */}
        <div className="max-w-3xl mx-auto text-center py-16 px-6 relative border-y border-white/10 mb-24">
          <svg
            className="w-8 h-8 text-neutral-600 mx-auto mb-6"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl text-neutral-200 font-normal leading-relaxed tracking-wide">
            &ldquo;We don&apos;t just craft jewellery; we craft identity. Wear your heritage with unbreakable pride.&rdquo;
          </blockquote>
          <div className="mt-6 text-xs uppercase tracking-[0.25em] text-neutral-400 font-sans">
            TamZen &mdash; The Heritage Atelier
          </div>
        </div>

        {/* Newsletter & Socials */}
        <div className="max-w-xl mx-auto text-center" id="contact">
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white mb-2">
            Stay Connected
          </h3>
          <p className="text-xs text-neutral-400 font-sans mb-8">
            Receive exclusive early access to limited seasonal runs and new cultural emblem drops.
          </p>

          <NewsletterForm />

          {/* Social Icons */}
          <div className="mt-10 flex items-center justify-center gap-4">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 hover:border-white/40 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white transition-all"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 hover:border-white/40 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white transition-all"
              aria-label="TikTok"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.49V8.62a8.28 8.28 0 0 0 4.82 1.52V6.69h-1z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 hover:border-white/40 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white transition-all"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
