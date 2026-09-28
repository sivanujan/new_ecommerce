"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
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
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "fr"

  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalCardRef = useRef<HTMLDivElement>(null)

  const handleOpenSearch = () => {
    setIsOpen(true)
  }

  const handleCloseSearch = () => {
    setIsOpen(false)
    setTimeout(() => {
      triggerButtonRef.current?.focus()
    }, 50)
  }

  // Keyboard shortcut listener: Cmd+K / Ctrl+K to toggle, ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (isOpen) {
          handleCloseSearch()
        } else {
          handleOpenSearch()
        }
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault()
        handleCloseSearch()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Scroll lock and auto-focus when modal opens
  useEffect(() => {
    if (isOpen) {
      // Lock background scroll completely
      const originalOverflow = document.body.style.overflow
      const originalTouchAction = document.body.style.touchAction
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"

      const focusTimer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)

      return () => {
        document.body.style.overflow = originalOverflow
        document.body.style.touchAction = originalTouchAction
        clearTimeout(focusTimer)
      }
    }
  }, [isOpen])

  // Debounced live search (~250ms) querying Medusa via /api/search
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
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  const handleNavigateToStore = (searchQuery: string) => {
    handleCloseSearch()
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

  // Backdrop click handler (closes only when clicking outside the card)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalCardRef.current && !modalCardRef.current.contains(e.target as Node)) {
      handleCloseSearch()
    }
  }

  const isSearching = Boolean(query.trim())

  return (
    <>
      {/* Trigger Button in Header */}
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={handleOpenSearch}
        className="w-9 h-9 rounded-full border border-white/15 hover:border-[#E5C378]/60 bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-[#E5C378] transition-all shadow-sm group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E5C378]/50"
        aria-label="Open search command palette"
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

      {/* ============================================================ */}
      {/* FULL-SCREEN PREMIUM SEARCH OVERLAY */}
      {/* ============================================================ */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search Collection"
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-start pt-12 sm:pt-20 lg:pt-24 px-3 sm:px-6 pb-6 overflow-hidden animate-in fade-in duration-200"
        >
          {/* Centered Command-Palette Modal Card */}
          <div
            ref={modalCardRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#121215] border border-[#E5C378]/40 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_35px_rgba(229,195,120,0.15)] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col transition-all duration-300"
          >
            {/* 1. Large Brand-Styled Search Box */}
            <form onSubmit={handleFormSubmit} className="relative flex items-center border-b border-white/10 px-4 sm:px-5 py-1 sm:py-2">
              {/* Gold Search Icon */}
              <div className="text-[#E5C378] shrink-0 mr-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>

              {/* Input Field */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search TamZen jewelry, lion, pendants, gold…"
                className="w-full bg-transparent border-none text-[#FDFBF7] placeholder-neutral-500 py-3.5 sm:py-4 text-sm sm:text-base lg:text-lg font-sans tracking-wide focus:outline-none focus:ring-0"
              />

              {/* Controls: Spinner, Clear, ESC Badge, Close Button */}
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
                    aria-label="Clear query"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : null}

                <span className="hidden sm:inline-block text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-400 border border-white/10">
                  ESC
                </span>

                <button
                  type="button"
                  onClick={handleCloseSearch}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Close search (ESC)"
                  aria-label="Close search"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </form>

            {/* 2. Before Typing: Popular Searches */}
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
                      className="px-3 py-1.5 rounded-full text-xs font-sans text-neutral-300 bg-white/5 hover:bg-[#E5C378]/10 hover:text-[#E5C378] border border-white/10 hover:border-[#E5C378]/50 transition-all cursor-pointer active:scale-95"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-sans text-neutral-500">
                  <span>Type to search live products from Medusa</span>
                  <span className="font-mono text-[10px] hidden sm:inline">Press Enter to view all in store</span>
                </div>
              </div>
            )}

            {/* 3. Live Results Area (Scrolls inside the overlay) */}
            {isSearching && (
              <div className="flex flex-col max-h-[55vh] sm:max-h-[60vh] overflow-y-auto divide-y divide-white/5 no-scrollbar">
                {/* Loading Skeleton */}
                {isLoading && results.length === 0 && (
                  <div className="p-3 sm:p-4 space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] animate-pulse">
                        <div className="w-14 h-14 rounded-lg bg-white/10 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-16 bg-white/10 rounded" />
                          <div className="h-4 w-40 bg-white/10 rounded" />
                          <div className="h-3 w-28 bg-white/10 rounded" />
                        </div>
                        <div className="w-16 h-4 bg-white/10 rounded shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Result Items */}
                {results.length > 0 && (
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
                            onClick={handleCloseSearch}
                            className="group flex items-center gap-3.5 p-2.5 sm:p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#E5C378]/30 transition-all duration-200"
                          >
                            {/* Product Thumbnail */}
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-white/10">
                              <Image
                                src={product.thumbnail}
                                alt={product.title}
                                fill
                                sizes="64px"
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* Product Details */}
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

                            {/* Price in EUR */}
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

                    {/* Bottom CTA Button */}
                    <div className="p-3 bg-[#0E0E11] text-center border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => handleNavigateToStore(query)}
                        className="w-full py-2.5 rounded-full text-xs uppercase tracking-widest font-bold text-black bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] hover:shadow-[0_0_20px_rgba(229,195,120,0.35)] transition-all cursor-pointer active:scale-99"
                      >
                        Explore All Results in Collection &rarr;
                      </button>
                    </div>
                  </>
                )}

                {/* Empty State */}
                {!isLoading && results.length === 0 && (
                  <div className="py-12 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mx-auto mb-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </div>
                    <h5 className="font-serif font-bold text-sm text-[#FDFBF7] uppercase tracking-wider mb-1">
                      No Results for &ldquo;{query}&rdquo;
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
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
