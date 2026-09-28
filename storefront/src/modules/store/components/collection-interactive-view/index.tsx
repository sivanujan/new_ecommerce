"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type FormattedCollectionProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string
  description?: string | null
  categories: { id: string; name: string; handle: string }[]
  price: string
  priceNumber: number
  createdAt?: string
  isNew?: boolean
}

export type CategoryOption = {
  id: string
  name: string
  handle: string
}

export default function CollectionInteractiveView({
  products,
  categories,
  initialCategory = "all",
  initialSort = "created_at",
  initialSearch = "",
}: {
  products: FormattedCollectionProduct[]
  categories: CategoryOption[]
  initialCategory?: string
  initialSort?: string
  initialSearch?: string
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedSort, setSelectedSort] = useState(initialSort)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Debounce search input by 150ms for buttery smooth typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 150)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Sync state to URL search parameters seamlessly (q, category, sortBy)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      
      if (debouncedQuery.trim()) {
        url.searchParams.set("q", debouncedQuery.trim())
      } else {
        url.searchParams.delete("q")
      }

      if (selectedCategory && selectedCategory !== "all") {
        url.searchParams.set("category", selectedCategory)
      } else {
        url.searchParams.delete("category")
      }

      if (selectedSort && selectedSort !== "created_at") {
        url.searchParams.set("sortBy", selectedSort)
      } else {
        url.searchParams.delete("sortBy")
      }

      window.history.replaceState({}, "", url.toString())
    }
  }, [debouncedQuery, selectedCategory, selectedSort])

  const handleCategoryChange = (categoryHandle: string) => {
    setSelectedCategory(categoryHandle)
  }

  const handleSortChange = (sortBy: string) => {
    setSelectedSort(sortBy)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setDebouncedQuery("")
    searchInputRef.current?.focus()
  }

  const handleResetAll = () => {
    setSearchQuery("")
    setDebouncedQuery("")
    setSelectedCategory("all")
    setSelectedSort("created_at")
  }

  // Filter and sort products live from Medusa dataset
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // 1. Search Query Filter (name, description, handle, categories)
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim()
      result = result.filter((product) => {
        const titleMatch = product.title.toLowerCase().includes(q)
        const descMatch = product.description
          ? product.description.toLowerCase().includes(q)
          : false
        const handleMatch = product.handle.toLowerCase().includes(q)
        const catMatch = product.categories.some((cat) =>
          cat.name.toLowerCase().includes(q) || cat.handle.toLowerCase().includes(q)
        )
        return titleMatch || descMatch || handleMatch || catMatch
      })
    }

    // 2. Filter by selected category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((product) =>
        product.categories.some(
          (cat) =>
            cat.handle.toLowerCase() === selectedCategory.toLowerCase() ||
            cat.name.toLowerCase() === selectedCategory.toLowerCase()
        )
      )
    }

    // 3. Sort
    result.sort((a, b) => {
      switch (selectedSort) {
        case "price_asc":
          return a.priceNumber - b.priceNumber
        case "price_desc":
          return b.priceNumber - a.priceNumber
        case "title_asc":
          return a.title.localeCompare(b.title)
        case "created_at":
        default:
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          )
      }
    })

    return result
  }, [products, debouncedQuery, selectedCategory, selectedSort])

  return (
    <div className="w-full bg-[#0B0B0C] min-h-screen text-white">
      {/* ============================================================ */}
      {/* 1. SECTION HERO & SEARCH HEADER */}
      {/* ============================================================ */}
      <section className="relative w-full pt-10 sm:pt-14 pb-8 sm:pb-12 border-b border-white/10 overflow-hidden">
        {/* Ambient gold glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-[#E5C378]/5 blur-[130px]" />

        <div className="content-container relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#E5C378]/30 mb-4 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
              Solid 316L Surgical Steel • Heritage Defined
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#FDFBF7] uppercase">
            The Collection
          </h1>

          {/* Tamil Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-4 w-full max-w-xs mx-auto">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#E5C378]/60" />
            <div className="w-2.5 h-2.5 rotate-45 border border-[#E5C378] bg-bg-elevated" />
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#E5C378]/60" />
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base text-neutral-300 font-sans font-light max-w-lg mx-auto leading-relaxed">
            Explore handcrafted diaspora statements forged in solid steel and precious gold, designed to endure every chapter of your journey.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. STICKY FILTER & SORT BAR */}
      {/* ============================================================ */}
      <div className="sticky top-20 z-30 w-full bg-[#0B0B0C]/90 backdrop-blur-xl border-b border-white/10 py-3.5 sm:py-4 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <div className="content-container flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Filter Pills (Scrollable horizontally on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            {/* "All Pieces" Pill */}
            <button
              type="button"
              onClick={() => handleCategoryChange("all")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shrink-0 active:scale-95 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-black shadow-[0_0_20px_rgba(229,195,120,0.35)] font-bold"
                  : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/15"
              }`}
            >
              All Pieces
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === "all"
                    ? "bg-black/20 text-black font-bold"
                    : "bg-white/10 text-neutral-400"
                }`}
              >
                {products.length}
              </span>
            </button>

            {/* Dynamic Category Pills from Medusa */}
            {categories.map((category) => {
              const isActive =
                selectedCategory.toLowerCase() === category.handle.toLowerCase() ||
                selectedCategory.toLowerCase() === category.name.toLowerCase()

              const categoryCount = products.filter((p) =>
                p.categories.some(
                  (c) =>
                    c.handle.toLowerCase() === category.handle.toLowerCase() ||
                    c.name.toLowerCase() === category.name.toLowerCase()
                )
              ).length

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.handle)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shrink-0 active:scale-95 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-black shadow-[0_0_20px_rgba(229,195,120,0.35)] font-bold"
                      : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/15"
                  }`}
                >
                  {category.name}
                  {categoryCount > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? "bg-black/20 text-black font-bold"
                          : "bg-white/10 text-neutral-400"
                      }`}
                    >
                      {categoryCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Right Controls: Count & Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
            {/* Live Count Indicator */}
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium whitespace-nowrap">
              Showing{" "}
              <strong className="text-[#E5C378] font-bold">
                {filteredProducts.length}
              </strong>{" "}
              {filteredProducts.length === 1 ? "Creation" : "Creations"}
            </span>

            {/* Dark Styled Sort Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
                aria-label="Sort creations"
                className="appearance-none bg-[#121215] hover:bg-[#16161A] text-neutral-200 hover:text-white border border-white/20 hover:border-[#E5C378]/50 text-xs rounded-full pl-4 pr-9 py-2.5 focus:outline-none focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] transition-all cursor-pointer font-sans tracking-wide shadow-sm"
              >
                <option value="created_at" className="bg-[#121215] text-[#FDFBF7]">
                  Latest Creations
                </option>
                <option value="price_asc" className="bg-[#121215] text-[#FDFBF7]">
                  Price: Low to High
                </option>
                <option value="price_desc" className="bg-[#121215] text-[#FDFBF7]">
                  Price: High to Low
                </option>
                <option value="title_asc" className="bg-[#121215] text-[#FDFBF7]">
                  Name: A to Z
                </option>
              </select>

              {/* Chevron icon */}
              <div className="pointer-events-none absolute right-3 flex items-center text-[#E5C378]">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. PRODUCT GRID & REFINED PREMIUM CARDS */}
      {/* ============================================================ */}
      <div className="content-container py-12 sm:py-16 lg:py-20">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 items-stretch">
            {filteredProducts.map((product) => {
              const primaryCategory = product.categories[0]?.name

              return (
                <LocalizedClientLink
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="group relative flex flex-col justify-between h-full bg-[#121215] hover:bg-[#16161A] rounded-2xl overflow-hidden border border-white/10 hover:border-[#E5C378]/50 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(229,195,120,0.15)] transition-all duration-500 active:scale-[0.99]"
                >
                  {/* Image Frame with hover zoom & dark vignette */}
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-900 border-b border-white/10">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Subtle dark vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                      {product.isNew ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-black/85 text-[#E5C378] border border-[#E5C378]/40 shadow-sm backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
                          New
                        </span>
                      ) : (
                        <span />
                      )}

                      {primaryCategory && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-mono font-medium uppercase tracking-wider bg-black/75 text-[#E5C378] border border-[#E5C378]/30 backdrop-blur-md shadow-sm">
                          {primaryCategory}
                        </span>
                      )}
                    </div>

                    {/* Floating Gold "VIEW CREATION →" Reveal on hover */}
                    <div className="absolute inset-x-4 bottom-4 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-center">
                      <span className="w-full py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-black text-center shadow-[0_4px_20px_rgba(229,195,120,0.4)] flex items-center justify-center gap-1.5 transition-all">
                        <span>View Creation</span>
                        <span className="font-sans font-bold">&rarr;</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4 text-white">
                    <div>
                      {/* Material Spec */}
                      <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1">
                        316L Surgical Steel
                      </span>

                      {/* Clean Serif Title */}
                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#FDFBF7] group-hover:text-[#E5C378] transition-colors line-clamp-1 leading-snug">
                        {product.title}
                      </h3>

                      {/* Subtitle / Description Snippet */}
                      {product.description && (
                        <p className="text-xs text-neutral-400 font-sans mt-1.5 line-clamp-2 leading-relaxed font-light">
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* Price and Action Row */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-mono font-semibold">
                          Price
                        </span>
                        <span className="font-mono font-bold text-base sm:text-lg text-[#E5C378] tracking-wide mt-0.5">
                          {product.price}
                        </span>
                      </div>

                      <span className="text-xs text-neutral-400 group-hover:text-[#E5C378] transition-colors inline-flex items-center gap-1 font-medium">
                        <span>Explore</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </span>
                    </div>
                  </div>
                </LocalizedClientLink>
              )
            })}
          </div>
        ) : (
          /* ============================================================ */
          /* 4. CLEAN EMPTY STATE (With Clear Search & Reset) */
          /* ============================================================ */
          <div className="text-center py-20 px-6 max-w-lg mx-auto bg-[#121215] rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center">
            {/* Cultural Diamond Icon */}
            <div className="w-16 h-16 rounded-full bg-white/5 border border-[#E5C378]/30 flex items-center justify-center text-[#E5C378] mb-5 shadow-[0_0_20px_rgba(229,195,120,0.15)]">
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>

            <h3 className="font-serif font-bold text-2xl text-[#FDFBF7] uppercase tracking-wide mb-2">
              {debouncedQuery
                ? `No Creations Found for "${debouncedQuery}"`
                : "No Creations in this Category"}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-sm mb-6 leading-relaxed">
              {debouncedQuery
                ? `We couldn't find any pieces matching your search. Check your spelling or try clearing the search filter.`
                : `We couldn't find any pieces matching the selected filter. Explore our full collection of signature jewelry.`}
            </p>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              {debouncedQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
                >
                  Clear Search Filter
                </button>
              )}

              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex items-center justify-center px-7 py-2.5 rounded-full text-xs uppercase tracking-[0.15em] font-bold text-black bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] hover:shadow-[0_0_20px_rgba(229,195,120,0.4)] transition-all cursor-pointer active:scale-95"
              >
                View All Creations &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
