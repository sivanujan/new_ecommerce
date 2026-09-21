"use client"

import { useState, useMemo } from "react"
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
}: {
  products: FormattedCollectionProduct[]
  categories: CategoryOption[]
  initialCategory?: string
  initialSort?: string
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedSort, setSelectedSort] = useState(initialSort)

  // Sync state to URL search parameters seamlessly
  const handleCategoryChange = (categoryHandle: string) => {
    setSelectedCategory(categoryHandle)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      if (categoryHandle && categoryHandle !== "all") {
        url.searchParams.set("category", categoryHandle)
      } else {
        url.searchParams.delete("category")
      }
      window.history.replaceState({}, "", url.toString())
    }
  }

  const handleSortChange = (sortBy: string) => {
    setSelectedSort(sortBy)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      if (sortBy && sortBy !== "created_at") {
        url.searchParams.set("sortBy", sortBy)
      } else {
        url.searchParams.delete("sortBy")
      }
      window.history.replaceState({}, "", url.toString())
    }
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // 1. Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((product) =>
        product.categories.some(
          (cat) =>
            cat.handle.toLowerCase() === selectedCategory.toLowerCase() ||
            cat.name.toLowerCase() === selectedCategory.toLowerCase()
        )
      )
    }

    // 2. Sort
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
  }, [products, selectedCategory, selectedSort])

  return (
    <div className="w-full">
      {/* Sticky Filter & Sort Bar */}
      <div className="sticky top-20 z-30 w-full bg-[#0B0B0C]/90 backdrop-blur-xl border-y border-white/10 py-3.5 sm:py-4 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="content-container flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Filter Pills (Scrollable horizontally on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            {/* "All Pieces" Pill */}
            <button
              type="button"
              onClick={() => handleCategoryChange("all")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shrink-0 active:scale-95 ${
                selectedCategory === "all"
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                  : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/15"
              }`}
            >
              All Pieces
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === "all"
                    ? "bg-black/15 text-black"
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
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shrink-0 active:scale-95 ${
                    isActive
                      ? "bg-[#E5C378] text-black shadow-[0_0_20px_rgba(229,195,120,0.35)]"
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

            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
                aria-label="Sort products"
                className="appearance-none bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-white/15 hover:border-white/30 text-xs rounded-full pl-4 pr-9 py-2 focus:outline-none focus:border-[#E5C378] transition-all cursor-pointer font-sans tracking-wide shadow-sm"
              >
                <option value="created_at" className="bg-[#121214] text-white">
                  Latest Creations
                </option>
                <option value="price_asc" className="bg-[#121214] text-white">
                  Price: Low to High
                </option>
                <option value="price_desc" className="bg-[#121214] text-white">
                  Price: High to Low
                </option>
                <option value="title_asc" className="bg-[#121214] text-white">
                  Name: A to Z
                </option>
              </select>

              {/* Chevron icon */}
              <div className="pointer-events-none absolute right-3 flex items-center text-neutral-400">
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

      {/* Main Content Area: Products Grid or Empty State */}
      <div className="content-container py-12 sm:py-16">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 items-stretch">
            {filteredProducts.map((product) => {
              const primaryCategory = product.categories[0]?.name

              return (
                <LocalizedClientLink
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="group relative flex flex-col justify-between bg-[#121215] hover:bg-[#16161a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#E5C378]/50 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(229,195,120,0.12)] transition-all duration-500 active:scale-[0.99]"
                >
                  {/* Image Frame */}
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-900/90 border-b border-white/10">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Subtle dark vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                      {product.isNew ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-black/85 text-[#E5C378] border border-[#E5C378]/40 shadow-sm backdrop-blur-md">
                          <span className="w-1 h-1 rounded-full bg-[#E5C378] animate-pulse" />
                          New
                        </span>
                      ) : (
                        <span />
                      )}

                      {primaryCategory && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-wider bg-black/60 text-neutral-300 border border-white/15 backdrop-blur-md">
                          {primaryCategory}
                        </span>
                      )}
                    </div>

                    {/* Floating Quick View pill on hover */}
                    <div className="absolute inset-x-4 bottom-4 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-center">
                      <span className="w-full py-2.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-white text-black text-center shadow-lg group-hover:bg-[#E5C378] transition-colors flex items-center justify-center gap-1.5">
                        View Creation
                        <span className="font-sans">&rarr;</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3 text-white">
                    <div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-[#E5C378] transition-colors line-clamp-1">
                        {product.title}
                      </h3>

                      {product.description && (
                        <p className="text-xs text-neutral-400 font-sans mt-1.5 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* Price and Subtle Callout Row */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-semibold font-sans">
                          Price
                        </span>
                        <span className="font-sans font-bold text-sm sm:text-base text-[#F3D798] tracking-wide mt-0.5">
                          {product.price}
                        </span>
                      </div>

                      <span className="text-[10px] uppercase tracking-wider text-white/50 group-hover:text-white font-medium flex items-center gap-1 transition-colors">
                        Details
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          &rarr;
                        </span>
                      </span>
                    </div>
                  </div>
                </LocalizedClientLink>
              )
            })}
          </div>
        ) : (
          /* Graceful Empty State */
          <div className="text-center py-20 px-6 max-w-lg mx-auto bg-[#121215] rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center">
            {/* Cultural Diamond Icon */}
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-[#E5C378] mb-5">
              <svg
                className="w-6 h-6"
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

            <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider mb-2">
              No Creations In This Category
            </h3>

            <p className="text-sm text-neutral-400 font-sans max-w-sm mb-6 leading-relaxed">
              We couldn&apos;t find any pieces matching the selected filter. Explore
              our full collection of signature jewelry.
            </p>

            <button
              type="button"
              onClick={() => handleCategoryChange("all")}
              className="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-semibold text-black bg-white hover:bg-[#E5C378] transition-all shadow-md active:scale-95"
            >
              View All Creations &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
