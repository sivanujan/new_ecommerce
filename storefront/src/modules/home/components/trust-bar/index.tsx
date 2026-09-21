export default function TrustBar() {
  const features = [
    {
      title: "Premium Quality",
      subtitle: "316L Stainless Steel",
      icon: (
        <svg
          className="w-5 h-5 text-[#E5C378]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      title: "Long Lasting",
      subtitle: "Water & Sweat Resistant",
      icon: (
        <svg
          className="w-5 h-5 text-[#E5C378]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
    },
    {
      title: "Skin Friendly",
      subtitle: "No Tarnish",
      icon: (
        <svg
          className="w-5 h-5 text-[#E5C378]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      title: "Worldwide Shipping",
      subtitle: "For Our Global Community",
      icon: (
        <svg
          className="w-5 h-5 text-[#E5C378]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
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
    <div className="w-full bg-[#0E0E12] border-y border-white/10 py-7 sm:py-8 relative overflow-hidden">
      {/* Subtle ambient lighting band */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#E5C378]/[0.03] to-transparent" />

      <div className="content-container relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3.5 sm:gap-4 group p-3 sm:px-5 lg:px-6 transition-all duration-300 ${
                idx % 2 === 1 ? "sm:pl-6" : ""
              }`}
            >
              {/* Gold Outline Icon Circle */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#E5C378]/30 bg-[#E5C378]/10 group-hover:border-[#E5C378] group-hover:bg-[#E5C378]/20 group-hover:scale-105 flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-[0_0_15px_rgba(229,195,120,0.1)]">
                {feature.icon}
              </div>

              {/* Text Labels */}
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#FDFBF7] group-hover:text-[#E5C378] transition-colors font-sans">
                  {feature.title}
                </span>
                <span className="text-[11px] sm:text-xs text-[#E5C378]/80 font-medium tracking-wide mt-0.5 font-sans">
                  {feature.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
