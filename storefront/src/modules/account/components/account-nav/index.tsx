"use client"

import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const navItems = [
    {
      name: "Overview",
      href: "/account",
      icon: (
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      testId: "overview-link",
      exact: true,
    },
    {
      name: "Orders",
      href: "/account/orders",
      icon: <Package size={16} />,
      testId: "orders-link",
      exact: false,
    },
    {
      name: "Addresses",
      href: "/account/addresses",
      icon: <MapPin size={16} />,
      testId: "addresses-link",
      exact: false,
    },
    {
      name: "Profile",
      href: "/account/profile",
      icon: <User size={16} />,
      testId: "profile-link",
      exact: false,
    },
  ]

  const checkIsActive = (href: string, exact: boolean) => {
    const currentSubpath = route?.replace(`/${countryCode}`, "") || ""
    if (exact) {
      return currentSubpath === href || currentSubpath === `${href}/`
    }
    return currentSubpath.startsWith(href)
  }

  return (
    <div className="w-full font-sans">
      {/* ============================================================ */}
      {/* MOBILE NAVIGATION: Sleek top horizontal tab pills */}
      {/* ============================================================ */}
      <div className="lg:hidden w-full pb-2 mb-6" data-testid="mobile-account-nav">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {navItems.map((item) => {
            const active = checkIsActive(item.href, item.exact)
            return (
              <LocalizedClientLink
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  active
                    ? "bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 shadow-[0_2px_15px_rgba(229,195,120,0.3)] font-bold"
                    : "bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10"
                }`}
                data-testid={item.testId}
              >
                {item.icon}
                <span>{item.name}</span>
              </LocalizedClientLink>
            )
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-neutral-400 hover:text-rose-400"
            data-testid="logout-button"
          >
            <ArrowRightOnRectangle className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP NAVIGATION: Luxury dark brand sidebar */}
      {/* ============================================================ */}
      <div
        className="hidden lg:flex flex-col bg-[#121215] border border-white/10 rounded-2xl p-5 shadow-xl"
        data-testid="account-nav"
      >
        {/* Customer Badge */}
        <div className="flex items-center gap-3 pb-5 mb-5 border-b border-white/10">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F3D798]/20 via-[#E5C378]/10 to-transparent border border-[#E5C378]/30 flex items-center justify-center text-[#E5C378] font-bold text-sm shrink-0">
            {customer?.first_name?.charAt(0) || "T"}
            {customer?.last_name?.charAt(0) || "Z"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#E5C378]">
              TamZen Client
            </span>
            <span className="font-display font-bold text-sm text-white truncate">
              {customer?.first_name} {customer?.last_name}
            </span>
            <span className="text-xs text-neutral-400 font-mono truncate">
              {customer?.email}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const active = checkIsActive(item.href, item.exact)
            return (
              <LocalizedClientLink
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  active
                    ? "bg-[#E5C378]/10 text-[#E5C378] font-semibold border-l-2 border-[#E5C378] shadow-[inset_0_0_15px_rgba(229,195,120,0.05)]"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
                data-testid={item.testId}
              >
                <span className={active ? "text-[#E5C378]" : "text-neutral-400"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </LocalizedClientLink>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="h-px w-full bg-white/10 my-4" />

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all w-full text-left"
          data-testid="logout-button"
        >
          <ArrowRightOnRectangle className="w-4 h-4 text-neutral-400" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}

export default AccountNav
