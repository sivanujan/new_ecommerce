export default function TrustBar() {
  const features = [
    {
      badge: "Premium Quality",
      title: "316L Stainless Steel",
      description:
        "Made with premium 316L stainless steel for durability, comfort, and a refined finish.",
      icon: (
        <svg
          className="w-5 h-5 text-[#E5C378]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      badge: "Made for Everyday",
      title: "Water & Sweat Resistant",
      description:
        "Designed to keep up with your everyday life — wherever you go.",
      icon: (
        <svg
          className="w-5 h-5 text-[#E5C378]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
    },
    {
      badge: "Comfort First",
      title: "Skin-Friendly & Tarnish Resistant",
      description:
        "Comfortable for everyday wear and designed to maintain its finish with proper care.",
      icon: (
        <svg
          className="w-5 h-5 text-[#E5C378]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      badge: "From Our Roots to the World",
      title: "Worldwide Shipping",
      description:
        "Created from our culture, made for our generation, and delivered across the world.",
      icon: (
        <svg
          className="w-5 h-5 text-[#E5C378]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
  ]

  return (
    <section className="w-full bg-[#0A0D14] border-y border-white/10 py-10 sm:py-12 relative overflow-hidden">
      {/* Subtle ambient lighting band */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#E5C378]/[0.03] to-transparent" />

      <div className="content-container relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-start gap-3.5 group pt-6 sm:pt-0 ${
                idx !== 0 ? "sm:pl-6 lg:pl-8" : ""
              }`}
            >
              {/* Header row: Icon + Eyebrow badge */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#E5C378]/30 bg-[#E5C378]/10 group-hover:border-[#E5C378] group-hover:bg-[#E5C378]/20 group-hover:scale-105 flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-[0_0_15px_rgba(229,195,120,0.1)]">
                  {feature.icon}
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[#E5C378]">
                  {feature.badge}
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-[#FDFBF7] group-hover:text-[#E5C378] transition-colors font-display tracking-tight leading-snug">
                  {feature.title}
                </h3>
                <p className="text-xs text-neutral-400 font-sans font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
