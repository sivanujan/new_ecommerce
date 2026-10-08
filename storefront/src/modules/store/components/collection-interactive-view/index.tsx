"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { addToCart } from "@lib/data/cart"
import {
  FormattedCollectionProduct,
  ProductColorVariant,
} from "@lib/util/format-collection-product"

export type { FormattedCollectionProduct, ProductColorVariant }

export type CategoryOption = {
  id: string
  name: string
  handle: string
}

export type CategoryInfo = {
  id: string
  name: string
  handle: string
  description?: string | null
  image?: string | null
  metadata?: Record<string, any> | null
}

function ProductCardImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A20] to-[#0E0E12] p-4 text-center select-none">
        <div className="w-12 h-12 rounded-full bg-[#E5C378]/10 border border-[#E5C378]/30 flex items-center justify-center text-[#E5C378] mb-2 shadow-[0_0_20px_rgba(229,195,120,0.15)]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#E5C378] font-bold">TamZen Atelier</span>
        <span className="text-[10px] text-neutral-400 mt-1 line-clamp-1 max-w-[85%]">{alt}</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
      onError={() => setHasError(true)}
    />
  )
}

/**
 * Individual Product Card with 3 Color Finish Dots (Silver / Gold / Black)
 * supporting instant hover & click image/price preview + Quick Add.
 */
function ProductCardItem({
  product,
  countryCode,
  isAdding,
  isAdded,
  onQuickAdd,
}: {
  product: FormattedCollectionProduct
  countryCode: string
  isAdding: boolean
  isAdded: boolean
  onQuickAdd: (e: React.MouseEvent, product: FormattedCollectionProduct, variantId?: string) => void
}) {
  const primaryCategory = product.categories[0]?.name

  // Default color finish from available variants or "Silver"
  const defaultColorName = product.colorVariants?.[0]?.name || "Silver"
  const [selectedColor, setSelectedColor] = useState<string>(defaultColorName)
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)

  const activeColorName = hoveredColor || selectedColor

  const activeVariant = useMemo(() => {
    if (!product.colorVariants || product.colorVariants.length === 0) return null
    return (
      product.colorVariants.find(
        (v) => v.name.toLowerCase() === activeColorName.toLowerCase()
      ) || product.colorVariants[0]
    )
  }, [product.colorVariants, activeColorName])

  const displayImage = activeVariant?.imageUrl || product.thumbnail
  const displayPrice = activeVariant?.price || product.price
  const activeVariantId = activeVariant?.variantId || product.defaultVariantId

  const productUrl = `/products/${product.handle}?color=${activeColorName.toLowerCase()}`

  return (
    <div className="group relative flex flex-col justify-between h-full bg-[#121215] hover:bg-[#16161A] rounded-2xl overflow-hidden border border-white/10 hover:border-[#E5C378]/50 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(229,195,120,0.15)] transition-all duration-500">
      {/* 1. Image Frame with Gold Hover Zoom & Category Badge */}
      <LocalizedClientLink
        href={productUrl}
        className="relative aspect-square w-full overflow-hidden bg-neutral-900 border-b border-white/10 block cursor-pointer"
      >
        <ProductCardImage src={displayImage} alt={product.title} />

        {/* Subtle dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
          {product.isNew ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-black/85 text-[#E5C378] border border-[#E5C378]/40 shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
              New
            </span>
          ) : (
            <span />
          )}

          {primaryCategory && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-mono font-medium uppercase tracking-wider bg-black/80 text-[#E5C378] border border-[#E5C378]/30 backdrop-blur-md shadow-sm">
              {primaryCategory}
            </span>
          )}
        </div>
      </LocalizedClientLink>

      {/* 2. Card Content Details */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4 text-white">
        <div>
          {/* Material Spec */}
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1">
            316L Surgical Steel
          </span>

          {/* Clean Serif Title */}
          <LocalizedClientLink
            href={productUrl}
            className="block group-hover:text-[#E5C378] transition-colors"
          >
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#FDFBF7] line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </LocalizedClientLink>

          {/* High-Contrast Short Product Description */}
          <p className="text-xs text-neutral-300 font-sans mt-2 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>

          {/* 3 Color Finish Dots with Hover Preview */}
          {product.colorVariants && product.colorVariants.length > 0 && (
            <div
              className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                Finish:
              </span>

              <div className="flex items-center gap-1.5">
                {product.colorVariants.map((color) => {
                  const isSelected = selectedColor.toLowerCase() === color.name.toLowerCase()
                  const isHovered = hoveredColor?.toLowerCase() === color.name.toLowerCase()
                  const isActive = isHovered || isSelected

                  // Rich metallic dot styles
                  let dotColorClass =
                    "bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-400 border-white/50"
                  if (color.name.toLowerCase().includes("gold")) {
                    dotColorClass =
                      "bg-gradient-to-br from-[#F5D899] via-[#D4AF37] to-[#8C6B1B] border-[#F3D798]"
                  } else if (color.name.toLowerCase().includes("black")) {
                    dotColorClass =
                      "bg-gradient-to-br from-neutral-800 via-neutral-900 to-black border-neutral-600"
                  }

                  return (
                    <button
                      key={color.name}
                      type="button"
                      aria-label={`Preview ${color.name} finish`}
                      title={`${color.name} finish`}
                      onMouseEnter={() => setHoveredColor(color.name)}
                      onMouseLeave={() => setHoveredColor(null)}
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedColor(color.name)
                      }}
                      className={`w-5 h-5 rounded-full p-[2px] transition-all duration-200 flex items-center justify-center cursor-pointer ${
                        isActive
                          ? "ring-2 ring-[#E5C378] ring-offset-1 ring-offset-[#121215] scale-110"
                          : "opacity-75 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <span
                        className={`w-full h-full rounded-full border ${dotColorClass} block shadow-sm`}
                      />
                    </button>
                  )
                })}
              </div>

              <span className="text-[10px] font-mono text-[#E5C378] font-semibold tracking-wider ml-1">
                {activeColorName}
              </span>
            </div>
          )}
        </div>

        {/* 3. Price & Actions Row */}
        <div className="pt-3 border-t border-white/10 flex flex-col gap-3 mt-auto">
          {/* Price Row (In High-Contrast Gold #D4AF37) */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-base sm:text-lg text-[#D4AF37] tracking-tight">
                {displayPrice}
              </span>
              {product.priceType === "sale" && product.originalPrice && (
                <span className="text-xs text-neutral-500 line-through font-sans">
                  {product.originalPrice}
                </span>
              )}
            </div>

            {product.priceType === "sale" && product.percentageDiff && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold font-mono">
                -{product.percentageDiff}%
              </span>
            )}
          </div>

          {/* Action Row: Working Add to Cart + Explore Link */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={(e) => onQuickAdd(e, product, activeVariantId)}
              disabled={isAdding}
              className={`flex-1 py-2.5 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md select-none cursor-pointer ${
                isAdded
                  ? "bg-emerald-500 text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:brightness-105 active:scale-[0.98]"
              }`}
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Adding...</span>
                </>
              ) : isAdded ? (
                <>
                  <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Added ✓</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* Secondary Action: Explore Link */}
            <LocalizedClientLink
              href={productUrl}
              className="py-2.5 px-3 rounded-full text-[11px] font-semibold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all inline-flex items-center gap-1 shrink-0"
            >
              <span>Explore</span>
              <span>&rarr;</span>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CollectionView({
  products,
  categories,
  initialCategory = "all",
  initialSort = "created_at",
  initialSearch = "",
  currentCategory = null,
  isCategoryRoute = false,
}: {
  products: FormattedCollectionProduct[]
  categories: CategoryOption[]
  initialCategory?: string
  initialSort?: string
  initialSearch?: string
  currentCategory?: CategoryInfo | null
  isCategoryRoute?: boolean
}) {
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "fr"

  const [selectedSort, setSelectedSort] = useState(initialSort)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Quick Add to Cart state
  const [addingId, setAddingId] = useState<string | null>(null)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [toastProduct, setToastProduct] = useState<{
    title: string
    thumbnail: string
    price: string
  } | null>(null)
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Debounce search input by 150ms for smooth typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 150)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Sync sort / search state in URL query parameters cleanly
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)

      if (debouncedQuery.trim()) {
        url.searchParams.set("q", debouncedQuery.trim())
      } else {
        url.searchParams.delete("q")
      }

      if (selectedSort && selectedSort !== "created_at") {
        url.searchParams.set("sortBy", selectedSort)
      } else {
        url.searchParams.delete("sortBy")
      }

      window.history.replaceState({}, "", url.toString())
    }
  }, [debouncedQuery, selectedSort])

  const handleClearSearch = () => {
    setSearchQuery("")
    setDebouncedQuery("")
    searchInputRef.current?.focus()
  }

  // Quick Add to Cart handler
  const handleQuickAdd = async (
    e: React.MouseEvent,
    product: FormattedCollectionProduct,
    variantId?: string
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const targetVariantId = variantId || product.defaultVariantId
    if (!targetVariantId || addingId) return

    setAddingId(product.id)
    try {
      await addToCart({
        variantId: targetVariantId,
        quantity: 1,
        countryCode,
      })

      setAddedId(product.id)
      setToastProduct({
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
      })

      // Refresh server components so header cart counter updates immediately
      router.refresh()

      // Broadcast custom event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart-item-added"))
      }

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
      toastTimerRef.current = setTimeout(() => {
        setToastProduct(null)
      }, 5000)

      setTimeout(() => {
        setAddedId(null)
      }, 3000)
    } catch (err) {
      console.error("Quick add failed:", err)
    } finally {
      setAddingId(null)
    }
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

    // 2. Sort Filter
    result.sort((a, b) => {
      switch (selectedSort) {
        case "price_asc":
          return a.priceNumber - b.priceNumber
        case "price_desc":
          return b.priceNumber - a.priceNumber
        case "title_asc":
          return a.title.localeCompare(b.title)
        case "title_desc":
          return b.title.localeCompare(a.title)
        case "created_at":
        default:
          return (b.createdAt || "").localeCompare(a.createdAt || "")
      }
    })

    return result
  }, [products, debouncedQuery, selectedSort])

  // Active category determination:
  // If on a category route, it's currentCategory.handle.
  // Otherwise, if initialCategory is passed and not "all", use that; else "all".
  const activeCategoryHandle = currentCategory?.handle || initialCategory

  // Fallback description for category hero
  const categoryDescription = useMemo(() => {
    if (!currentCategory) return ""
    if (currentCategory.description?.trim()) return currentCategory.description.trim()

    const handle = currentCategory.handle.toLowerCase()
    if (handle.includes("pendant")) {
      return "Sacred Tamil emblems, Eelam map iconography, and cultural talismans forged in solid 316L stainless steel."
    }
    if (handle.includes("chain")) {
      return "Refined 316L stainless steel and 18K vacuum-plated chains crafted for strength, luster, and everyday wear."
    }
    if (handle.includes("special")) {
      return "Limited atelier creations, heritage insignias, and exclusive statement pieces commemorating identity."
    }
    return "Handcrafted symbolic Tamil jewelry forged in solid 316L surgical stainless steel. 100% waterproof and sweatproof."
  }, [currentCategory])

  // Category background image
  const categoryBgImage = useMemo(() => {
    if (!currentCategory) return null
    if (currentCategory.image) return currentCategory.image
    const metaImg = (currentCategory.metadata as any)?.image_url
    if (metaImg) return metaImg
    return `/images/category-${currentCategory.handle}.jpg`
  }, [currentCategory])

  return (
    <div className="w-full bg-[#0B0B0C] min-h-screen text-white font-sans relative">
      {/* ============================================================ */}
      {/* FLOATING TOAST NOTIFICATION ON CARD QUICK ADD */}
      {/* ============================================================ */}
      {toastProduct && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-32px)] bg-[#141418]/95 border border-[#E5C378]/50 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-2xl p-4 backdrop-blur-xl animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
              <ProductCardImage src={toastProduct.thumbnail} alt={toastProduct.title} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[#E5C378] text-xs font-mono font-bold uppercase tracking-wider mb-0.5">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Added to Atelier Bag</span>
              </div>
              <p className="text-white font-serif font-bold text-sm truncate">
                {toastProduct.title}
              </p>
              <p className="text-xs text-neutral-400 font-mono">
                {toastProduct.price} • Ready in cart
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToastProduct(null)}
              className="text-neutral-400 hover:text-white p-1 text-sm transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
            <LocalizedClientLink
              href="/cart"
              className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold uppercase tracking-wider text-center transition-colors"
            >
              View Bag
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/checkout"
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 text-xs font-bold uppercase tracking-wider text-center shadow-md hover:brightness-105 transition-all"
            >
              Checkout &rarr;
            </LocalizedClientLink>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. HERO BANNER: CATEGORY BANNER OR ATELIER HERO */}
      {/* ============================================================ */}
      {currentCategory ? (
        // COMPACT CATEGORY HERO BANNER
        <section className="relative w-full pt-8 sm:pt-12 pb-8 sm:pb-10 border-b border-white/10 overflow-hidden bg-[#0E0E12]">
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full bg-[#E5C378]/10 blur-[130px]" />

          {/* Optional Subtle Category Background Artwork */}
          {categoryBgImage && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-15">
              <Image
                src={categoryBgImage}
                alt=""
                fill
                unoptimized
                className="object-cover object-center filter grayscale mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0C]/85 via-[#0B0B0C]/90 to-[#0B0B0C]" />
            </div>
          )}

          <div className="content-container relative z-10 flex flex-col items-center text-center">
            {/* Breadcrumb: Home / Collection / {Category} */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400">
                <li>
                  <LocalizedClientLink
                    href="/"
                    className="hover:text-[#E5C378] transition-colors"
                  >
                    Home
                  </LocalizedClientLink>
                </li>
                <li className="text-neutral-600 font-sans">/</li>
                <li>
                  <LocalizedClientLink
                    href="/store"
                    className="hover:text-[#E5C378] transition-colors"
                  >
                    Collection
                  </LocalizedClientLink>
                </li>
                <li className="text-neutral-600 font-sans">/</li>
                <li className="text-[#E5C378] font-bold" aria-current="page">
                  {currentCategory.name}
                </li>
              </ol>
            </nav>

            {/* Small Gold Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#E5C378]/30 mb-3 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
                TAMZEN COLLECTION
              </span>
            </div>

            {/* Large Serif Category Name */}
            <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#FDFBF7] tracking-tight uppercase max-w-3xl leading-[1.15]">
              {currentCategory.name}
            </h1>

            {/* Thin Gold Divider */}
            <div className="inline-flex items-center gap-3 my-3">
              <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#E5C378]/60 to-transparent" />
              <span className="w-1 h-1 rounded-full bg-[#E5C378]" />
              <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#E5C378]/60 to-transparent" />
            </div>

            {/* Category Description from Medusa (with fallback) */}
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed font-light">
              {categoryDescription}
            </p>

            {/* Search Input within Category */}
            <div className="w-full max-w-md mt-6 relative">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-neutral-400 pointer-events-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${currentCategory.name.toLowerCase()}...`}
                  className="w-full pl-11 pr-10 py-3 rounded-full bg-[#121215] border border-white/15 focus:border-[#E5C378] text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E5C378]/20 transition-all shadow-inner"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className="absolute right-3.5 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center text-xs transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        // FULL ATELIER COLLECTION HERO (FOR /STORE)
        <section className="relative w-full pt-10 sm:pt-14 pb-8 sm:pb-12 border-b border-white/10 overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 sm:w-[550px] sm:h-[550px] rounded-full bg-[#E5C378]/10 blur-[120px]" />

          <div className="content-container relative z-10 flex flex-col items-center text-center">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#E5C378]/30 mb-4 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.25em] font-mono font-bold text-[#E5C378]">
                Handcrafted in Solid 316L Steel
              </span>
            </div>

            {/* Luxury Main Heading */}
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-[#FDFBF7] tracking-tight uppercase max-w-3xl leading-[1.1]">
              The Atelier Collection
            </h1>

            {/* Tamil Brand Motto */}
            <div className="inline-flex items-center gap-3 my-3">
              <span className="h-[1px] w-6 sm:w-10 bg-[#E5C378]/50" />
              <span className="text-xs sm:text-sm font-semibold text-[#F3D798] tracking-widest font-sans">
                எங்கள் வேர் எங்கள் அடையாளம் • Wear Your Roots
              </span>
              <span className="h-[1px] w-6 sm:w-10 bg-[#E5C378]/50" />
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed mt-1">
              Discover cultural pendants, signets, and signature emblems sculpted to endure a lifetime without tarnishing or fading.
            </p>

            {/* Interactive Live Search Bar */}
            <div className="w-full max-w-md mt-6 relative">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-neutral-400 pointer-events-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, symbol, or metal..."
                  className="w-full pl-11 pr-10 py-3 rounded-full bg-[#121215] border border-white/15 focus:border-[#E5C378] text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E5C378]/20 transition-all shadow-inner"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className="absolute right-3.5 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center text-xs transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 2. STICKY FILTER BAR (CATEGORY PILLS + SORTING) */}
      {/* ============================================================ */}
      <section className="sticky top-20 z-30 w-full bg-[#0B0B0C]/90 backdrop-blur-xl border-b border-white/10 py-3.5 sm:py-4 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <div className="content-container flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Filter Pills (Horizontal Scroll on Mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pr-4">
            {/* "All Pieces" Pill -> Navigates to /store */}
            <LocalizedClientLink
              href="/store"
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 inline-flex items-center cursor-pointer ${
                activeCategoryHandle === "all"
                  ? "bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 font-bold shadow-[0_2px_15px_rgba(229,195,120,0.35)] scale-[1.02]"
                  : "bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white"
              }`}
            >
              All Pieces
              {!currentCategory && products.length > 0 && (
                <span className="ml-1.5 text-[10px] opacity-75 font-mono">
                  {products.length}
                </span>
              )}
            </LocalizedClientLink>

            {/* Individual Category Pills -> Navigates to /categories/[handle] */}
            {categories.map((category) => {
              const isActive = activeCategoryHandle === category.handle
              const count = products.filter((p) =>
                p.categories.some((c) => c.handle === category.handle)
              ).length

              return (
                <LocalizedClientLink
                  key={category.id}
                  href={`/categories/${category.handle}`}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 inline-flex items-center cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 font-bold shadow-[0_2px_15px_rgba(229,195,120,0.35)] scale-[1.02]"
                      : "bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white"
                  }`}
                >
                  {category.name}
                  {count > 0 && (
                    <span className="ml-1.5 text-[10px] opacity-75 font-mono">
                      {count}
                    </span>
                  )}
                </LocalizedClientLink>
              )
            })}
          </div>

          {/* Results Count & Sort Select */}
          <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Showing{" "}
              <strong className="text-[#E5C378] font-bold">
                {filteredProducts.length}
              </strong>{" "}
              Creations
            </span>

            {/* Dark Custom Sort Dropdown (No white native select menu) */}
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="appearance-none bg-[#121215] text-white border border-white/15 hover:border-[#E5C378]/50 rounded-full pl-4 pr-9 py-2 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-[#E5C378] transition-colors cursor-pointer"
              >
                <option value="created_at" className="bg-[#121215] text-white">
                  Latest Creations
                </option>
                <option value="price_asc" className="bg-[#121215] text-white">
                  Price: Low to High
                </option>
                <option value="price_desc" className="bg-[#121215] text-white">
                  Price: High to Low
                </option>
                <option value="title_asc" className="bg-[#121215] text-white">
                  Name: A to Z
                </option>
                <option value="title_desc" className="bg-[#121215] text-white">
                  Name: Z to A
                </option>
              </select>

              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#E5C378] text-xs">
                ▼
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. PRODUCT GRID & REFINED PREMIUM CARDS */}
      {/* ============================================================ */}
      <div className="content-container py-12 sm:py-16 lg:py-20">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 items-stretch">
            {filteredProducts.map((product) => (
              <ProductCardItem
                key={product.id}
                product={product}
                countryCode={countryCode}
                isAdding={addingId === product.id}
                isAdded={addedId === product.id}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        ) : (
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
                : "New Pieces Coming Soon"}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-sm mb-6 leading-relaxed">
              {debouncedQuery
                ? `We couldn't find any pieces matching your search. Check your spelling or try clearing the search filter.`
                : `Our artisans are crafting new designs for this collection. Explore our full range of cultural creations in the meantime.`}
            </p>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              {debouncedQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
                >
                  Clear Search
                </button>
              )}

              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold text-neutral-950 bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] shadow-md hover:brightness-105 transition-all cursor-pointer"
              >
                Explore Full Collection &rarr;
              </LocalizedClientLink>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Keep backward compatible export alias
export { CollectionView as CollectionInteractiveView }
