export default function TrustBar() {
  const features = [
    {
      title: "Premium Quality",
      subtitle: "316L Stainless Steel",
      icon: (
        <svg
          className="w-5 h-5 text-neutral-900"
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
          className="w-5 h-5 text-neutral-900"
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
          className="w-5 h-5 text-neutral-900"
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
          className="w-5 h-5 text-neutral-900"
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
    <div className="w-full bg-[#EFECE6] border-b border-neutral-300 py-4 sm:py-5 lg:py-5">
      <div className="content-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-center">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 sm:gap-3.5 group p-1 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full border border-neutral-300 bg-white/90 group-hover:border-neutral-900 group-hover:scale-105 flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm">
                {feature.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-neutral-950 font-sans">
                  {feature.title}
                </span>
                <span className="text-[11px] sm:text-xs text-neutral-600 font-medium tracking-wide mt-0.5 font-sans">
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
