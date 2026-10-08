"use client"

import { usePathname, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function NavLinks() {
  const pathname = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const [activeHash, setActiveHash] = useState<string>("")

  // Normalise path check:
  // e.g. /fr or /fr/
  const isHomePath =
    pathname === `/${countryCode}` || pathname === `/${countryCode}/`

  // Collection is active on /store, /collections, /categories, or /products
  const isCollection =
    pathname.startsWith(`/${countryCode}/store`) ||
    pathname.startsWith(`/${countryCode}/collections`) ||
    pathname.startsWith(`/${countryCode}/categories`) ||
    pathname.startsWith(`/${countryCode}/products`)

  // Listen to hash changes and scroll position on homepage
  useEffect(() => {
    const updateHash = () => {
      setActiveHash(window.location.hash || "")
    }

    updateHash()
    window.addEventListener("hashchange", updateHash)
    window.addEventListener("popstate", updateHash)

    return () => {
      window.removeEventListener("hashchange", updateHash)
      window.removeEventListener("popstate", updateHash)
    }
  }, [pathname])

  // Track scroll position on homepage for Story & Contact sections
  useEffect(() => {
    if (!isHomePath) {
      return
    }

    const handleScroll = () => {
      if (window.scrollY < 350) {
        if (activeHash !== "") {
          setActiveHash("")
        }
        return
      }

      const contactEl = document.getElementById("contact")
      const storyEl = document.getElementById("story")

      if (contactEl) {
        const rect = contactEl.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.6 && rect.bottom >= 0) {
          setActiveHash("#contact")
          return
        }
      }

      if (storyEl) {
        const rect = storyEl.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.6 && rect.bottom >= 100) {
          setActiveHash("#story")
          return
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHomePath, activeHash])

  // Determine active item
  let activeItem: "home" | "collection" | "faq" | "contact" | null = null

  const isContact = pathname.includes("/contact")
  const isFaq = pathname.includes("/faq")

  if (isContact) {
    activeItem = "contact"
  } else if (isFaq) {
    activeItem = "faq"
  } else if (isCollection) {
    activeItem = "collection"
  } else if (isHomePath) {
    activeItem = "home"
  }

  const navItems = [
    {
      name: "Home",
      href: "/",
      id: "home" as const,
      onClick: () => setActiveHash(""),
    },
    {
      name: "Collection",
      href: "/store",
      id: "collection" as const,
      onClick: () => setActiveHash(""),
    },
    {
      name: "FAQ",
      href: "/faq",
      id: "faq" as const,
      onClick: () => setActiveHash(""),
    },
    {
      name: "Contact",
      href: "/contact",
      id: "contact" as const,
      onClick: () => setActiveHash(""),
    },
  ]


  return (
    <div className="hidden md:flex items-center gap-8 lg:gap-11">
      {navItems.map((item) => {
        const isActive = activeItem === item.id

        return (
          <LocalizedClientLink
            key={item.name}
            href={item.href}
            onClick={item.onClick}
            className={`text-[11px] uppercase tracking-[0.22em] font-semibold transition-all duration-300 relative py-1 ${
              isActive
                ? "text-white after:w-full after:bg-[#E5C378]"
                : "text-neutral-400 hover:text-white after:w-0 hover:after:w-full after:bg-[#E5C378]"
            } after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:transition-all after:duration-300`}
          >
            {item.name}
          </LocalizedClientLink>
        )
      })}
    </div>
  )
}
