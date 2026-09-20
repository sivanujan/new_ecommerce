export default function TrustBar() {
  const features = [
    {
      title: "Premium Quality",
      subtitle: "316L Surgical Grade Steel",
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
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      title: "Long Lasting Colour",
      subtitle: "Water & Sweat Resistant",
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
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
    },
    {
      title: "Worldwide Shipping",
      subtitle: "Fast & Tracked Delivery",
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
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      title: "Designed For You",
      subtitle: "Roots, Culture & Pride",
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
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="w-full bg-[#0E0E10] border-b border-white/10 py-10">
      <div className="content-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 group p-2 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-full border border-white/15 bg-white/[0.04] group-hover:border-white/40 group-hover:bg-white/[0.08] flex items-center justify-center flex-shrink-0 transition-all duration-300">
                {feature.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-neutral-100 font-sans">
                  {feature.title}
                </span>
                <span className="text-[11px] text-neutral-400 font-normal tracking-wide mt-0.5">
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
