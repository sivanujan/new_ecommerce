import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import NavLinks from "@modules/layout/components/nav-links"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions).catch(() => []),
    listLocales().catch(() => []),
    getLocale().catch(() => "fr"),
  ])

  return (
    <header className="sticky top-0 inset-x-0 z-50 w-full bg-[#0B0B0C]/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <nav className="content-container h-20 flex items-center justify-between">
        {/* Left: Brand Identity with Tiger/Lion Emblem + Tamil Tagline */}
        <div className="flex items-center gap-4">
          {/* Mobile drawer trigger */}
          <div className="flex md:hidden items-center text-white">
            <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
          </div>

          <LocalizedClientLink
            href="/"
            className="group flex items-center gap-3.5 focus:outline-none"
            data-testid="nav-store-link"
          >
            {/* Cultural Tiger/Lion Emblem Mark */}
            <div className="relative w-10 h-10 rounded-full border border-[#E5C378]/40 bg-neutral-900 text-[#E5C378] flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105 group-hover:border-[#E5C378]">
              <svg
                className="w-5 h-5 text-[#E5C378]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Stylized lion/tiger cultural crest */}
                <path d="M4 18h16M5 14h14M3 8l4 5 5-7 5 7 4-5v10H3z" />
                <circle cx="12" cy="5" r="1.2" fill="currentColor" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-black tracking-[0.2em] text-white uppercase leading-none group-hover:text-neutral-200 transition-colors">
                TAMZEN
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider text-[#E5C378] font-medium mt-1 font-sans">
                எங்கள் வேர் எங்கள் அடையாளம்
              </span>
            </div>
          </LocalizedClientLink>
        </div>

        {/* Center: Dynamic Desktop Navigation with Active State Indicator */}
        <NavLinks />

        {/* Right: Search + Account + Cart Icons */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          {/* Search Icon */}
          <LocalizedClientLink
            href="/store"
            className="w-9 h-9 rounded-full border border-white/15 hover:border-white/40 bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-all shadow-sm"
            aria-label="Search Collection"
            title="Search Collection"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </LocalizedClientLink>

          {/* Account Icon */}
          <LocalizedClientLink
            href="/account"
            className="w-9 h-9 rounded-full border border-white/15 hover:border-white/40 bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-all shadow-sm"
            data-testid="nav-account-link"
            aria-label="My Account"
            title="Account"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </LocalizedClientLink>

          {/* Cart Icon with Live Item Count */}
          <Suspense
            fallback={
              <LocalizedClientLink
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 text-white shadow-sm"
                href="/cart"
                data-testid="nav-cart-link"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase hidden sm:inline">
                  Cart
                </span>
                <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">
                  0
                </span>
              </LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
        </div>
      </nav>
    </header>
  )
}
