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
  const inputRef = useRef<HTMLInputElement>(null)

  // Open / Close with keyboard shortcuts (Cmd+K / Ctrl+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault()
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Focus input automatically on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
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
    }, 250)

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

  return (
    <>
      {/* Trigger Button in Header */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
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

      {/* Luxury Fullscreen/Slide-Down Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
          {/* Top Bar with Brand Wordmark & Close Button */}
          <div className="border-b border-white/10 bg-[#0B0B0C]/90">
            <div className="content-container py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
                  TamZen Search
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-400">
                  ESC to close
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full border border-white/15 hover:border-[#E5C378] bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-[#E5C378] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Box Container */}
          <div className="content-container pt-8 pb-6 w-full max-w-4xl mx-auto">
            <form onSubmit={handleFormSubmit} className="relative w-full">
              <div className="relative flex items-center w-full">
                {/* Gold Search Icon */}
                <div className="absolute left-5 text-[#E5C378] pointer-events-none">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by piece, heritage, gold, steel, pendant..."
                  className="w-full bg-[#121215] border-2 border-white/20 focus:border-[#E5C378] text-white placeholder-neutral-500 rounded-2xl pl-14 sm:pl-16 pr-14 py-4 sm:py-5 text-base sm:text-xl font-sans tracking-wide shadow-[0_10px_35px_rgba(0,0,0,0.6)] focus:shadow-[0_0_30px_rgba(229,195,120,0.2)] focus:outline-none transition-all"
                />

                {/* Clear Input Button (x) or Loading Spinner */}
                <div className="absolute right-5 flex items-center gap-2">
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
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                      title="Clear"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : null}
                </div>
              </div>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Popular:
              </span>
              {SUGGESTED_SEARCHES.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setQuery(chip)}
                  className="px-3 py-1 rounded-full text-xs font-sans text-neutral-300 bg-white/5 hover:bg-white/10 hover:text-[#E5C378] border border-white/10 hover:border-[#E5C378]/40 transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto content-container pb-16 max-w-4xl mx-auto w-full no-scrollbar">
            {/* When typing with results */}
            {results.length > 0 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs uppercase font-mono tracking-wider text-neutral-400">
                    Found <strong className="text-[#E5C378]">{results.length}</strong> matching creations
                  </span>

                  <button
                    type="button"
                    onClick={() => handleNavigateToStore(query)}
                    className="text-xs font-semibold uppercase tracking-wider text-[#E5C378] hover:text-[#F3D798] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View all in Collection</span>
                    <span>&rarr;</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {results.map((product) => {
                    const primaryCat = product.categories[0]?.name

                    return (
                      <LocalizedClientLink
                        key={product.id}
                        href={`/products/${product.handle}`}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-3.5 p-3 rounded-xl bg-[#121215] hover:bg-[#16161A] border border-white/10 hover:border-[#E5C378]/50 transition-all shadow-md active:scale-98"
                      >
                        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-neutral-900 border border-white/10">
                          <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            sizes="64px"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                          {primaryCat && (
                            <span className="text-[9px] uppercase tracking-wider font-mono text-[#E5C378] block truncate">
                              {primaryCat}
                            </span>
                          )}
                          <h4 className="text-xs sm:text-sm font-display font-bold text-white group-hover:text-[#E5C378] transition-colors truncate">
                            {product.title}
                          </h4>
                          <span className="text-xs font-mono font-bold text-[#E5C378] mt-1">
                            {product.price}
                          </span>
                        </div>
                      </LocalizedClientLink>
                    )
                  })}
                </div>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => handleNavigateToStore(query)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-bold text-black bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] hover:shadow-[0_0_25px_rgba(229,195,120,0.4)] transition-all cursor-pointer"
                  >
                    <span>Explore All Results in Collection</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* When searched but no results */}
            {query.trim() && !isLoading && results.length === 0 && (
              <div className="text-center py-16 px-6 bg-[#121215] rounded-3xl border border-white/10 shadow-xl max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-neutral-400 mx-auto mb-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 uppercase tracking-wide">
                  No creations found for &ldquo;{query}&rdquo;
                </h3>
                <p className="text-xs text-neutral-400 font-sans max-w-sm mx-auto mb-6">
                  Check your spelling or try searching for tags like pendant, gold, or chains.
                </p>
                <button
                  type="button"
                  onClick={() => handleNavigateToStore("")}
                  className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-[#E5C378] transition-colors cursor-pointer"
                >
                  Browse Full Collection &rarr;
                </button>
              </div>
            )}

            {/* Default state when search is open but nothing typed yet */}
            {!query.trim() && (
              <div className="text-center py-12 text-neutral-500 font-mono text-xs tracking-wider">
                Type a piece name or choose a popular search term above
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
