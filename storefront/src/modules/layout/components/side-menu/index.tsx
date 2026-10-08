"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"
import Image from "next/image"

import { usePathname, useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const MainMenuItems = {
  Home: "/",
  Collection: "/store",
  FAQ: "/faq",
  Contact: "/contact",
  Cart: "/cart",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  customer?: HttpTypes.StoreCustomer | null
}

const SideMenu = ({ regions, locales, currentLocale, customer }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const pathname = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const isHome = pathname === `/${countryCode}` || pathname === `/${countryCode}/`
  const isCollection =
    pathname.startsWith(`/${countryCode}/store`) ||
    pathname.startsWith(`/${countryCode}/collections`) ||
    pathname.startsWith(`/${countryCode}/products`)

  const getIsActive = (href: string) => {
    if (href === "/") return isHome
    if (href === "/store") return isCollection
    if (href === "/faq") return pathname.startsWith(`/${countryCode}/faq`)
    if (href === "/contact") return pathname.startsWith(`/${countryCode}/contact`)
    if (href === "/cart") return pathname.startsWith(`/${countryCode}/cart`)
    return false
  }

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full items-center">
                <Popover.Button
                  data-testid="nav-menu-button"
                  aria-label="Open Navigation Menu"
                  className="group relative flex items-center justify-center focus:outline-none transition-transform active:scale-95"
                >
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-neutral-200 group-hover:text-[#E5C378] group-hover:border-[#E5C378]/40 group-hover:bg-[#E5C378]/10 transition-all duration-200">
                    <svg
                      className="w-5 h-5 text-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="4" y1="7" x2="20" y2="7" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="17" x2="20" y2="17" />
                    </svg>
                  </div>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-300 transform"
                enterFrom="-translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition ease-in duration-200 transform"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="-translate-x-full opacity-0"
              >
                <PopoverPanel className="fixed inset-y-0 left-0 z-[1000] w-[86vw] max-w-[360px] h-[100dvh] flex flex-col focus:outline-none shadow-2xl">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-[#0B0F17] border-r border-[#E5C378]/20 justify-between p-6 overflow-y-auto"
                  >
                    {/* Drawer Header with Logo and Close Button */}
                    <div className="flex items-center justify-between pb-5 border-b border-white/10" id="xmark">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 shrink-0">
                          <Image
                            src="/logo-icon.svg"
                            alt="TamZen"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-display text-base font-bold tracking-[0.2em] text-[#E5C378] uppercase leading-tight">
                            TamZen
                          </span>
                          <span className="text-[7.5px] tracking-wider text-[#E5C378]/70 font-medium">
                            எங்கள் வேர் எங்கள் அடையாளம்
                          </span>
                        </div>
                      </div>
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 flex items-center justify-center text-neutral-400 hover:text-white transition-all focus:outline-none cursor-pointer"
                        aria-label="Close menu"
                      >
                        <XMark className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Navigation Menu Links */}
                    <ul className="flex flex-col gap-1.5 my-4">
                      {Object.entries(MainMenuItems).map(([name, href]) => {
                        const isActive = getIsActive(href)

                        return (
                          <li key={name}>
                            <LocalizedClientLink
                              href={href}
                              className={clx(
                                "text-base sm:text-lg py-2.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-between group",
                                isActive
                                  ? "text-[#E5C378] font-semibold bg-[#E5C378]/10 border-l-2 border-[#E5C378]"
                                  : "text-neutral-300 hover:text-white hover:bg-white/5 hover:translate-x-1"
                              )}
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                            >
                              <span>{name}</span>
                              <ArrowRightMini
                                className={clx(
                                  "w-4 h-4 transition-all duration-200",
                                  isActive
                                    ? "text-[#E5C378] opacity-100 translate-x-0"
                                    : "text-neutral-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                                )}
                              />
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>

                    {/* Customer Account / Client Access Section */}
                    {customer ? (
                      <div className="my-3 p-4 rounded-xl bg-white/[0.04] border border-[#E5C378]/20 flex flex-col gap-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#E5C378]/15 border border-[#E5C378]/30 flex items-center justify-center text-[#E5C378] shrink-0">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C378]">Member</span>
                            <span className="text-sm font-semibold text-white truncate">
                              {customer.first_name ? `${customer.first_name} ${customer.last_name || ""}` : customer.email}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                          <LocalizedClientLink
                            href="/account"
                            onClick={close}
                            className="text-xs py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 hover:text-[#E5C378] text-neutral-200 text-center font-medium transition-colors"
                          >
                            Dashboard
                          </LocalizedClientLink>
                          <LocalizedClientLink
                            href="/account/orders"
                            onClick={close}
                            className="text-xs py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 hover:text-[#E5C378] text-neutral-200 text-center font-medium transition-colors"
                          >
                            My Orders
                          </LocalizedClientLink>
                        </div>
                      </div>
                    ) : (
                      <div className="my-3 p-4 rounded-xl bg-gradient-to-b from-[#E5C378]/10 to-transparent border border-[#E5C378]/25 flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#E5C378] animate-pulse" />
                          <span className="text-[11px] font-mono uppercase tracking-widest text-[#E5C378] font-bold">
                            Client Access
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          Sign in to access your bespoke orders, wishlist, and profile.
                        </p>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <LocalizedClientLink
                            href="/account"
                            onClick={close}
                            className="text-xs py-2.5 px-3 rounded-lg bg-[#E5C378] hover:bg-[#F3D798] text-[#0B0B0C] font-bold text-center uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                            data-testid="side-menu-sign-in"
                          >
                            Sign In
                          </LocalizedClientLink>
                          <LocalizedClientLink
                            href="/register"
                            onClick={close}
                            className="text-xs py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-center uppercase tracking-wider transition-colors cursor-pointer"
                            data-testid="side-menu-register"
                          >
                            Register
                          </LocalizedClientLink>
                        </div>
                      </div>
                    )}

                    {/* Footer: Language, Region, and Copyright */}
                    <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-y-3">
                      {!!locales?.length && (
                        <div
                          className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/15 transition-all text-sm"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150 text-neutral-400",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      <div
                        className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/15 transition-all text-sm"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150 text-neutral-400",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="text-center text-xs text-neutral-500 pt-1 tracking-wide font-sans">
                        © {new Date().getFullYear()} TamZen. All rights reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
