"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import Image from "next/image"
import { useParams, useRouter, usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SearchResultItem = {
  id: string
  title: string
  handle: string
  thumbnail: string
  description?: string | null
  categories: { id: string; name: string; handle: string }[]
  price: string
  priceNumber: number
}

const SUGGESTED_SEARCHES = [
  "Lion Pendant",
  "Chains",
  "Pendant",
  "Sweatpants",
  "Shorts",
  "Or 18k",
]

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "fr"
  const inputRef = useRef<HTMLInputElement>(null)
  const modalCardRef = useRef<HTMLDivElement>(null)

  const handleOpenSearch = () => {
    // If the user is already on the collection/store page, scroll to & focus the in-page search input
    if (pathname?.includes("/store")) {
      const storeInput = document.getElementById("collection-search-input") as HTMLInputElement
      if (storeInput) {
        storeInput.scrollIntoView({ behavior: "smooth", block: "center" })
        storeInput.focus()
        return
      }
    }
    setIsOpen(true)
  }

  // Open / Close with keyboard shortcuts (Cmd+K / Ctrl+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        handleOpenSearch()
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault()
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, pathname])

  // Focus input automatically on open and prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    } else {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=12`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.products || [])
        } else {
          setResults([])
        }
      } catch (err) {
        console.error("Live search failed:", err)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  const handleNavigateToStore = (searchQuery: string) => {
    setIsOpen(false)
    const targetUrl = `/${countryCode}/store?q=${encodeURIComponent(searchQuery.trim())}`
    startTransition(() => {
      router.push(targetUrl)
    })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleNavigateToStore(query)
    }
  }

  // Close when clicking the blurred background outside the card
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalCardRef.current && !modalCardRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  const isSearching = Boolean(query.trim())

  return (
    <>
      {/* Trigger Button in Header */}
      <button
        type="button"
        onClick={handleOpenSearch}
        className="w-9 h-9 rounded-full border border-white/15 hover:border-[#E5C378]/60 bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-[#E5C378] transition-all shadow-sm group cursor-pointer"
        aria-label="Search Collection"
        title="Search Collection (Ctrl+K)"
      >
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
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
      </button>

      {/* Spotlight / Command-Palette Search Overlay */}
      {isOpen && (
        <div
          onClick={handleBackdropClick}
          className={`fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center p-4 sm:p-6 overflow-y-auto transition-all duration-300 animate-in fade-in ${
            isSearching ? "justify-start pt-12 sm:pt-20" : "justify-center"
          }`}
        >
          {/* Centered / Top Floating Luxury Search Card */}
          <div
            ref={modalCardRef}
            className="w-full max-w-2xl bg-[#121215] border border-[#E5C378]/40 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(229,195,120,0.15)] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300"
          >
            {/* Search Input Row */}
            <form onSubmit={handleFormSubmit} className="relative flex items-center border-b border-white/10 px-4 sm:px-5 py-2">
              {/* Gold Search Icon */}
              <div className="text-[#E5C378] shrink-0 mr-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search TamZen jewelry, lion, pendants, gold..."
                className="w-full bg-transparent border-none text-[#FDFBF7] placeholder-neutral-500 py-3 sm:py-4 text-sm sm:text-base font-sans tracking-wide focus:outline-none focus:ring-0"
              />

              {/* Action Buttons: Spinner / Clear / ESC / Close */}
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#E5C378]/30 border-t-[#E5C378] rounded-full animate-spin" />
                ) : query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("")
                      setResults([])
                      inputRef.current?.focus()
                    }}
                    className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    title="Clear query"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : null}

                <span className="hidden sm:inline-block text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-400">
                  ESC
                </span>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Close search"
                  aria-label="Close search"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Popular Searches (Shown when nothing is typed yet) */}
            {!isSearching && (
              <div className="p-5 sm:p-6 bg-[#0E0E11]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C378] font-semibold block mb-3">
                  Popular Searches
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {SUGGESTED_SEARCHES.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setQuery(chip)}
                      className="px-3 py-1.5 rounded-full text-xs font-sans text-neutral-300 bg-white/5 hover:bg-[#E5C378]/10 hover:text-[#E5C378] border border-white/10 hover:border-[#E5C378]/50 transition-all cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-sans text-neutral-500">
                  <span>Type to search live products from Medusa</span>
                  <span className="font-mono text-[10px]">Press Enter to view all</span>
                </div>
              </div>
            )}

            {/* Results List (Shown when typing) */}
            {isSearching && (
              <div className="flex flex-col max-h-[60vh] overflow-y-auto divide-y divide-white/5 no-scrollbar">
                {/* Result Items */}
                {results.length > 0 ? (
                  <>
                    <div className="px-4 py-2.5 bg-[#0E0E11] flex items-center justify-between text-xs font-mono text-neutral-400">
                      <span>
                        Found <strong className="text-[#E5C378]">{results.length}</strong> creations
                      </span>
                      <button
                        type="button"
                        onClick={() => handleNavigateToStore(query)}
                        className="text-[#E5C378] hover:text-[#F3D798] flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <span>View all in Store</span>
                        <span>&rarr;</span>
                      </button>
                    </div>

                    <div className="p-2 space-y-1">
                      {results.map((product) => {
                        const primaryCat = product.categories[0]?.name

                        return (
                          <LocalizedClientLink
                            key={product.id}
                            href={`/products/${product.handle}`}
                            onClick={() => setIsOpen(false)}
                            className="group flex items-center gap-3.5 p-2.5 sm:p-3 rounded-xl hover:bg-white/5 transition-all duration-200"
                          >
                            {/* Thumbnail */}
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden bg-neutral-900 border border-white/10">
                              <Image
                                src={product.thumbnail}
                                alt={product.title}
                                fill
                                sizes="64px"
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col flex-1 min-w-0">
                              {primaryCat && (
                                <span className="text-[9px] uppercase tracking-wider font-mono text-[#E5C378] truncate">
                                  {primaryCat}
                                </span>
                              )}
                              <h4 className="font-serif font-bold text-xs sm:text-sm text-[#FDFBF7] group-hover:text-[#E5C378] transition-colors truncate">
                                {product.title}
                              </h4>
                              {product.description && (
                                <p className="text-[11px] text-neutral-400 truncate mt-0.5 font-light">
                                  {product.description}
                                </p>
                              )}
                            </div>

                            {/* Price & Arrow */}
                            <div className="flex flex-col items-end shrink-0 pl-2">
                              <span className="font-mono font-bold text-xs sm:text-sm text-[#E5C378]">
                                {product.price}
                              </span>
                              <span className="text-[11px] text-neutral-400 group-hover:text-white transition-colors flex items-center gap-0.5 mt-1 font-medium">
                                <span>View</span>
                                <span className="transform group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                              </span>
                            </div>
                          </LocalizedClientLink>
                        )
                      })}
                    </div>

                    {/* Bottom CTA to view all in store */}
                    <div className="p-3 bg-[#0E0E11] text-center border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => handleNavigateToStore(query)}
                        className="w-full py-2.5 rounded-full text-xs uppercase tracking-widest font-bold text-black bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] hover:shadow-[0_0_20px_rgba(229,195,120,0.35)] transition-all cursor-pointer"
                      >
                        Explore All Results in Collection &rarr;
                      </button>
                    </div>
                  </>
                ) : !isLoading ? (
                  /* Empty state */
                  <div className="py-12 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mx-auto mb-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </div>
                    <h5 className="font-serif font-bold text-sm text-[#FDFBF7] uppercase tracking-wider mb-1">
                      No Creations Found for &ldquo;{query}&rdquo;
                    </h5>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-4">
                      Check your spelling or search for broader keywords like pendant, steel, or gold.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleNavigateToStore("")}
                      className="px-5 py-2 rounded-full text-xs font-semibold text-black bg-white hover:bg-[#E5C378] transition-colors cursor-pointer"
                    >
                      Browse Full Collection &rarr;
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
