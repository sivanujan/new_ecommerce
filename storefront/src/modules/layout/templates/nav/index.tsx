import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions).catch(() => []),
    listLocales().catch(() => []),
    getLocale().catch(() => "fr"),
  ])

  return (
    <header className="sticky top-0 inset-x-0 z-50 w-full glass-dark border-b border-white/10 transition-all duration-300">
      <nav className="content-container h-20 flex items-center justify-between">
        {/* Left: Brand Identity with Crown/Emblem */}
        <div className="flex items-center gap-4">
          {/* Mobile drawer trigger */}
          <div className="flex md:hidden items-center">
            <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
          </div>

          <LocalizedClientLink
            href="/"
            className="group flex items-center gap-3.5 focus:outline-none"
            data-testid="nav-store-link"
          >
            {/* TamZen Crown Emblem Mark */}
            <div className="relative w-9 h-9 rounded-full border border-white/20 bg-gradient-to-b from-white/15 to-white/5 flex items-center justify-center transition-all duration-300 group-hover:border-white/40 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <svg
                className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-105"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Cultural Crown & Sun Crest */}
                <path d="M4 18h16M5 14h14M3 8l4 5 5-7 5 7 4-5v10H3z" />
                <circle cx="12" cy="5" r="1" fill="currentColor" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-[0.22em] text-white uppercase leading-none group-hover:text-neutral-200 transition-colors">
                TamZen
              </span>
              <span className="text-[8px] uppercase tracking-[0.28em] text-neutral-400 font-sans mt-1">
                More Than Jewellery
              </span>
            </div>
          </LocalizedClientLink>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          <LocalizedClientLink
            href="/"
            className="text-[11px] uppercase tracking-[0.22em] font-medium text-white hover:text-neutral-300 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white after:transition-all"
          >
            Home
          </LocalizedClientLink>

          <LocalizedClientLink
            href="#collection"
            className="text-[11px] uppercase tracking-[0.22em] font-medium text-neutral-400 hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-white after:transition-all duration-300"
          >
            Collection
          </LocalizedClientLink>

          <LocalizedClientLink
            href="#story"
            className="text-[11px] uppercase tracking-[0.22em] font-medium text-neutral-400 hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-white after:transition-all duration-300"
          >
            Our Story
          </LocalizedClientLink>

          <LocalizedClientLink
            href="#contact"
            className="text-[11px] uppercase tracking-[0.22em] font-medium text-neutral-400 hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-white after:transition-all duration-300"
          >
            Contact
          </LocalizedClientLink>
        </div>

        {/* Right: Search + Account + Cart Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Icon */}
          <LocalizedClientLink
            href="/store"
            className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition-all"
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
            className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition-all"
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
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-neutral-300"
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
                <span className="text-[11px] font-medium tracking-[0.15em] uppercase hidden sm:inline">
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
