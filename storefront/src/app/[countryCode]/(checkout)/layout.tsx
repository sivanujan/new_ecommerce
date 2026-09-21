import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full min-h-screen bg-[#0B0B0C] text-neutral-100 flex flex-col justify-between selection:bg-[#E5C378]/30 selection:text-white">
      {/* Premium Dark Header */}
      <header className="sticky top-0 inset-x-0 z-40 w-full bg-[#0B0B0C]/95 backdrop-blur-md border-b border-white/10">
        <div className="content-container h-20 flex items-center justify-between">
          {/* Left: Back to Cart Link */}
          <div className="flex-1 basis-0">
            <LocalizedClientLink
              href="/cart"
              className="group inline-flex items-center gap-x-2 text-xs uppercase tracking-wider font-semibold text-neutral-400 hover:text-[#E5C378] transition-colors"
              data-testid="back-to-cart-link"
            >
              <div className="w-7 h-7 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center group-hover:border-[#E5C378]/40 group-hover:bg-[#E5C378]/10 transition-all">
                <ChevronDown className="rotate-90 text-neutral-400 group-hover:text-[#E5C378] transition-colors" size={14} />
              </div>
              <span className="hidden sm:inline font-sans">Back to shopping cart</span>
              <span className="inline sm:hidden font-sans">Cart</span>
            </LocalizedClientLink>
          </div>

          {/* Center: Official TamZen Logo & Cultural Emblem */}
          <div className="flex items-center justify-center">
            <LocalizedClientLink
              href="/"
              className="group flex items-center gap-3 focus:outline-none"
              data-testid="store-link"
            >
              {/* Cultural Emblem Mark */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#E5C378]/40 bg-neutral-900 text-[#E5C378] flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105 group-hover:border-[#E5C378]">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#E5C378]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 18h16M5 14h14M3 8l4 5 5-7 5 7 4-5v10H3z" />
                  <circle cx="12" cy="5" r="1.2" fill="currentColor" />
                </svg>
              </div>

              <div className="flex flex-col text-left">
                <span className="font-display text-lg sm:text-xl font-black tracking-[0.2em] text-white uppercase leading-none group-hover:text-neutral-200 transition-colors">
                  TAMZEN
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-wider text-[#E5C378] font-medium mt-1 font-sans">
                  எங்கள் வேர் எங்கள் அடையாளம்
                </span>
              </div>
            </LocalizedClientLink>
          </div>

          {/* Right: 256-Bit SSL Encrypted Security Badge */}
          <div className="flex-1 basis-0 flex justify-end">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-[10px] sm:text-xs font-mono text-neutral-400">
              <svg className="w-3.5 h-3.5 text-[#E5C378]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="hidden sm:inline text-neutral-300 font-semibold tracking-wide">SECURE CHECKOUT</span>
              <span className="inline sm:hidden text-neutral-300 font-semibold tracking-wide">SECURE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-1 w-full bg-[#0B0B0C]" data-testid="checkout-container">
        {children}
      </main>

      {/* Luxury Brand Minimal Footer */}
      <footer className="w-full border-t border-white/10 bg-[#0B0B0C] py-6">
        <div className="content-container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-neutral-500">
          <div className="flex items-center gap-6">
            <span className="text-neutral-400">TamZen Atelier Paris</span>
            <span className="hidden sm:inline text-white/10">•</span>
            <span>Worldwide Insured Shipping</span>
            <span className="hidden sm:inline text-white/10">•</span>
            <span>Certified Tamil Heritage</span>
          </div>
          <div className="font-mono text-[11px] text-neutral-500">
            © {new Date().getFullYear()} TAMZEN. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  )
}
