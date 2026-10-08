import { Suspense } from "react"
import Image from "next/image"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { retrieveCustomer } from "@lib/data/customer"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import NavLinks from "@modules/layout/components/nav-links"

export default async function Nav() {
  const [regions, locales, currentLocale, customer] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions).catch(() => []),
    listLocales().catch(() => []),
    getLocale().catch(() => "fr"),
    retrieveCustomer().catch(() => null),
  ])

  return (
    <header className="sticky top-0 inset-x-0 z-50 w-full bg-bg-base/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <nav className="content-container h-20 flex items-center justify-between">
        {/* Left: Brand Identity with Lion Emblem + Wordmark */}
        <div className="flex items-center gap-4">
          {/* Mobile drawer trigger */}
          <div className="flex md:hidden items-center text-white">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
              customer={customer}
            />
          </div>

          <LocalizedClientLink
            href="/"
            className="group flex items-center focus:outline-none"
            data-testid="nav-store-link"
          >
            {/* Desktop & Tablet: Full Horizontal Emblem + Wordmark Logo */}
            <div className="relative hidden sm:block h-12 w-52 md:w-56 transition-transform duration-300 group-hover:scale-[1.02]">
              <Image
                src="/logo.svg"
                alt="TamZen"
                fill
                priority
                className="object-contain object-left"
              />
            </div>

            {/* Mobile Header: Compact Full Logo */}
            <div className="relative block sm:hidden h-9 w-36 transition-transform duration-300">
              <Image
                src="/logo.svg"
                alt="TamZen"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </LocalizedClientLink>
        </div>

        {/* Center: Dynamic Desktop Navigation with Active State Indicator */}
        <NavLinks />

        {/* Right: Customer Sign In / Register / Account + Cart Icons */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {customer ? (
            /* Logged In Customer Badge */
            <LocalizedClientLink
              href="/account"
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border border-white/15 hover:border-[#E5C378]/50 bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-[#E5C378] transition-all text-xs font-medium shadow-sm group"
              data-testid="nav-account-link"
              aria-label="My Account"
              title="My Account"
            >
              <svg
                className="w-4 h-4 text-[#E5C378] group-hover:scale-110 transition-transform"
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
              <span className="hidden sm:inline font-semibold max-w-[110px] truncate text-white">
                {customer.first_name ? customer.first_name : "Account"}
              </span>
            </LocalizedClientLink>
          ) : (
            /* Unauthenticated Visitor: Prominent Sign In and Register Links */
            <div className="flex items-center gap-2">
              <LocalizedClientLink
                href="/account"
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-[#E5C378]/50 hover:border-[#E5C378] bg-[#E5C378]/10 hover:bg-[#E5C378]/20 text-[#E5C378] hover:text-[#F3D798] transition-all text-xs font-semibold tracking-wider uppercase shadow-sm"
                data-testid="nav-account-link"
                title="Sign In to your customer account"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="font-semibold">Sign In</span>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/register"
                className="hidden md:flex items-center px-3 py-1.5 rounded-full border border-white/15 hover:border-white/35 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-xs font-medium tracking-wider uppercase"
                data-testid="nav-register-link"
                title="Register a new customer account"
              >
                Register
              </LocalizedClientLink>
            </div>
          )}

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
