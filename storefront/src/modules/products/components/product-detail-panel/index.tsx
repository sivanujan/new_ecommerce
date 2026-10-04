"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type ProductDetailPanelProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  if (!variantOptions) return {}
  return variantOptions.reduce((acc: Record<string, string>, varopt: any) => {
    const key = varopt.option_id || varopt.option?.id
    if (key && varopt.value) {
      acc[key] = varopt.value
    }
    return acc
  }, {})
}

export default function ProductDetailPanel({
  product,
  region,
}: ProductDetailPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const countryCode = (useParams().countryCode as string) || "fr"

  // Options that have multiple values to choose from
  const visibleOptions = useMemo(() => {
    return (product.options || []).filter(
      (opt) => (opt.values ?? []).length > 1
    )
  }, [product.options])

  const hasMultipleVariants = (product.variants?.length ?? 0) > 1

  // Pre-select first available variant or URL parameter so user can immediately add to cart
  const [options, setOptions] = useState<Record<string, string>>(() => {
    const urlVariantId = searchParams.get("v_id")
    if (urlVariantId && product.variants) {
      const match = product.variants.find((v) => v.id === urlVariantId)
      if (match?.options) {
        return optionsAsKeymap(match.options)
      }
    }

    // Default to first variant's options so "Add to Cart" is immediately ready
    if (product.variants && product.variants.length > 0) {
      return optionsAsKeymap(product.variants[0].options)
    }

    return {}
  })

  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [openAccordion, setOpenAccordion] = useState<string | null>("specs")

  // Required option IDs that must be selected
  const requiredOptionIds = useMemo(() => {
    return visibleOptions.map((opt) => opt.id)
  }, [visibleOptions])

  // Match selected variant based on current options
  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return undefined
    }

    // Single variant product
    if (!hasMultipleVariants) {
      return product.variants[0]
    }

    // If options need to be chosen, match them
    if (requiredOptionIds.length > 0) {
      const allSelected = requiredOptionIds.every((id) => !!options[id])
      if (allSelected) {
        const match = product.variants.find((v) => {
          const vMap = optionsAsKeymap(v.options)
          return requiredOptionIds.every((id) => vMap[id] === options[id])
        })
        if (match) return match
      }
    }

    // Fallback to first variant if no specific match
    return product.variants[0]
  }, [product.variants, hasMultipleVariants, requiredOptionIds, options])

  // Sync URL shallowly with window.history.replaceState
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      if (selectedVariant?.id) {
        url.searchParams.set("v_id", selectedVariant.id)
      } else {
        url.searchParams.delete("v_id")
      }
      window.history.replaceState({}, "", url.toString())
    }
  }, [selectedVariant])

  // Update option value when user clicks a pill
  const handleSelectOption = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  // Stock assessment
  const inStock = useMemo(() => {
    if (!selectedVariant) return true
    if (!selectedVariant.manage_inventory) return true
    if (selectedVariant.allow_backorder) return true
    return (selectedVariant.inventory_quantity || 0) > 0
  }, [selectedVariant])

  // Price calculation
  const priceInfo = useMemo(() => {
    try {
      const { cheapestPrice, variantPrice } = getProductPrice({
        product,
        variantId: selectedVariant?.id,
      })
      return selectedVariant ? variantPrice : cheapestPrice
    } catch {
      return null
    }
  }, [product, selectedVariant])

  // Fallback description if product has none entered in Medusa
  const displayDescription = useMemo(() => {
    if (product.description && product.description.trim().length > 0) {
      return product.description.trim()
    }
    return `Sculpted with meticulous craftsmanship in solid 316L surgical-grade stainless steel. Engineered for everyday durability, complete waterproof resilience, and refined cultural elegance. Designed to endure a lifetime while preserving the rich heritage of Tamil identity.`
  }, [product.description])

  // Add to cart handler with full Medusa cart integration & instant UI updates
  const handleAddToCart = async () => {
    const variantToUse = selectedVariant || product.variants?.[0]
    if (!variantToUse?.id || !inStock) return

    setIsAdding(true)
    setErrorMessage(null)
    setAddedSuccess(false)

    try {
      await addToCart({
        variantId: variantToUse.id,
        quantity,
        countryCode,
      })

      setAddedSuccess(true)
      setShowToast(true)

      // Refresh server components to immediately update cart counter in header
      router.refresh()

      // Broadcast custom event for any listening client listeners
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart-item-added"))
      }

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
      toastTimeoutRef.current = setTimeout(() => {
        setShowToast(false)
        setAddedSuccess(false)
      }, 6000)
    } catch (err: any) {
      console.error("Failed to add product to cart:", err)
      setErrorMessage(
        err?.message || "Could not add piece to cart. Please try again."
      )
    } finally {
      setIsAdding(false)
    }
  }

  const primaryCategory =
    (product as any).categories?.[0]?.name ||
    product.collection?.title ||
    "Signature Piece"

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-7 relative">
      {/* ============================================================ */}
      {/* 1. FLOATING TOAST NOTIFICATION ON ADD TO CART */}
      {/* ============================================================ */}
      {showToast && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-32px)] bg-[#141418]/95 border border-[#E5C378]/50 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-2xl p-4 backdrop-blur-xl animate-fadeIn">
          <div className="flex items-start gap-3">
            {/* Thumbnail */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-[#E5C378]">
                  TZ
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[#E5C378] text-xs font-mono font-bold uppercase tracking-wider mb-0.5">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Added to Atelier Bag</span>
              </div>
              <p className="text-white font-serif font-bold text-sm truncate">
                {product.title}
              </p>
              <p className="text-xs text-neutral-400 font-mono">
                Qty: {quantity} • {priceInfo?.calculated_price || "EUR"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowToast(false)}
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
      {/* 2. CATEGORY / EYEBROW BADGE */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 text-[#E5C378] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
          {primaryCategory}
        </span>
        {product.collection?.title && primaryCategory !== product.collection.title && (
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-sans">
            {product.collection.title}
          </span>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. HIGH-CONTRAST BOLD SERIF TITLE */}
      {/* ============================================================ */}
      <div>
        <h1
          className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#FDFBF7] tracking-tight leading-[1.1] drop-shadow-sm"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        {/* Tamil Brand Tagline */}
        <div className="inline-flex items-center gap-2.5 mt-2.5">
          <span className="w-4 h-[1px] bg-[#E5C378]/60" />
          <span className="text-xs sm:text-sm font-semibold text-[#F3D798] tracking-wider font-sans">
            எங்கள் வேர் எங்கள் அடையாளம் • Wear Your Roots
          </span>
          <span className="w-4 h-[1px] bg-[#E5C378]/60" />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. PROMINENT PRICE & STOCK STATUS BAR */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-baseline gap-4 py-3.5 border-y border-white/10">
        <div className="flex items-baseline gap-3">
          <span
            className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#E5C378] tracking-tight"
            data-testid="product-price"
          >
            {priceInfo?.calculated_price || "—"}
          </span>

          {priceInfo?.price_type === "sale" && (
            <>
              <span className="text-base sm:text-lg text-neutral-500 line-through font-sans">
                {priceInfo.original_price}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono">
                -{priceInfo.percentage_diff}%
              </span>
            </>
          )}
        </div>

        {/* Live Stock Badge */}
        <div className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{inStock ? "In Stock — Ready for dispatch" : "Currently Out of Stock"}</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. HIGH-CONTRAST PRODUCT DESCRIPTION */}
      {/* ============================================================ */}
      <div className="space-y-2 py-1">
        <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#E5C378] font-bold block">
          The Piece
        </span>
        <div className="text-[#EDE8DF] text-sm sm:text-base font-light leading-relaxed font-sans whitespace-pre-line">
          {displayDescription}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. VARIANT SELECTORS (IF MULTIPLE OPTIONS EXIST) */}
      {/* ============================================================ */}
      {hasMultipleVariants && visibleOptions.length > 0 && (
        <div className="flex flex-col gap-4 py-2 border-t border-white/10">
          {visibleOptions.map((option) => {
            const currentVal = options[option.id]

            return (
              <div key={option.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider font-semibold select-none">
                  <span className="text-neutral-300 tracking-[0.18em]">
                    {option.title}
                  </span>
                  {currentVal && (
                    <span className="text-[#E5C378] font-bold tracking-wide">
                      {currentVal}
                    </span>
                  )}
                </div>

                {/* Variant Pill Buttons */}
                <div className="flex flex-wrap gap-2.5">
                  {(option.values ?? []).map((v) => {
                    const isSelected = currentVal === v.value

                    return (
                      <button
                        key={v.id || v.value}
                        type="button"
                        onClick={() => handleSelectOption(option.id, v.value)}
                        className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 active:scale-95 cursor-pointer select-none ${
                          isSelected
                            ? "bg-[#E5C378]/25 border-2 border-[#E5C378] text-[#F3D798] ring-2 ring-[#E5C378]/40 shadow-[0_0_15px_rgba(229,195,120,0.25)] font-bold"
                            : "bg-white/5 hover:bg-white/10 border border-white/20 text-neutral-200 hover:text-white hover:border-white/40"
                        }`}
                      >
                        {v.value}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Error Message if Add to Cart Failed */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. QUANTITY STEPPER & ADD TO CART CTA */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3.5 pt-2">
        {/* Quantity Stepper */}
        <div className="inline-flex items-center justify-between border border-white/20 bg-white/[0.04] rounded-full px-4 py-2 sm:py-3 shrink-0">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isAdding}
            aria-label="Decrease quantity"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all font-bold text-lg"
          >
            -
          </button>
          <span className="px-4 font-mono font-bold text-sm text-white min-w-[2.5rem] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={isAdding}
            aria-label="Increase quantity"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 transition-all font-bold text-lg"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock || isAdding}
          data-testid="add-product-button"
          className={`flex-1 py-4 px-8 rounded-full font-bold uppercase tracking-[0.2em] text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-lg select-none cursor-pointer ${
            !inStock
              ? "bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-not-allowed opacity-80"
              : addedSuccess
              ? "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              : "bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:shadow-[0_0_30px_rgba(229,195,120,0.4)] hover:brightness-105 active:scale-[0.98]"
          }`}
        >
          {isAdding ? (
            <>
              <svg className="animate-spin w-4 h-4 text-black" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Securing Piece...</span>
            </>
          ) : addedSuccess ? (
            <>
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Added to Cart!</span>
            </>
          ) : !inStock ? (
            <>
              <span>Out of Stock</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* 8. TRUST BADGES ROW */}
      {/* ============================================================ */}
      <div className="grid grid-cols-3 gap-2.5 py-4 border-y border-white/10 text-center font-sans">
        <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/[0.02]">
          <svg className="w-4 h-4 text-[#E5C378]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-200 uppercase tracking-wider">
            316L Stainless Steel
          </span>
          <span className="text-[9px] text-neutral-400">Never tarnishes</span>
        </div>

        <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/[0.02]">
          <svg className="w-4 h-4 text-[#E5C378]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-200 uppercase tracking-wider">
            Water & Sweat Proof
          </span>
          <span className="text-[9px] text-neutral-400">Gym, shower & swim</span>
        </div>

        <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/[0.02]">
          <svg className="w-4 h-4 text-[#E5C378]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-200 uppercase tracking-wider">
            Worldwide Tracked
          </span>
          <span className="text-[9px] text-neutral-400">Express delivery</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 9. LUXURY ACCORDION SECTIONS */}
      {/* ============================================================ */}
      <div className="flex flex-col divide-y divide-white/10 border-b border-white/10 font-sans">
        {/* Accordion Item 1: Product Specifications */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => setOpenAccordion(openAccordion === "specs" ? null : "specs")}
            className="w-full flex items-center justify-between py-2 text-left text-sm font-semibold uppercase tracking-wider text-white hover:text-[#E5C378] transition-colors"
          >
            <span>Product Specifications</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                openAccordion === "specs" ? "rotate-180 text-[#E5C378]" : "text-neutral-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openAccordion === "specs" && (
            <div className="pt-3 pb-4 text-xs leading-relaxed text-neutral-300 space-y-2.5 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Material</span>
                  <span className="text-white font-medium">{product.material || "Solid 316L Surgical Steel"}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Origin</span>
                  <span className="text-white font-medium">{product.origin_country || "Handcrafted Atelier"}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Finish</span>
                  <span className="text-white font-medium">18K Vacuum Ion Plating / Polished Steel</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Hypoallergenic</span>
                  <span className="text-white font-medium">100% Nickel & Lead Free</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Item 2: Shipping & Returns */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => setOpenAccordion(openAccordion === "shipping" ? null : "shipping")}
            className="w-full flex items-center justify-between py-2 text-left text-sm font-semibold uppercase tracking-wider text-white hover:text-[#E5C378] transition-colors"
          >
            <span>Shipping & Complimentary Returns</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                openAccordion === "shipping" ? "rotate-180 text-[#E5C378]" : "text-neutral-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openAccordion === "shipping" && (
            <div className="pt-3 pb-4 text-xs leading-relaxed text-neutral-300 space-y-2 animate-fadeIn">
              <p>
                <strong className="text-white">France & Europe:</strong> Delivered within 2-4 business days via Colissimo or DHL Express.
              </p>
              <p>
                <strong className="text-white">International:</strong> Delivered within 4-7 business days with end-to-end tracking.
              </p>
              <p className="text-neutral-400 pt-1">
                Enjoy 30 days of complimentary exchanges and hassle-free returns. Each piece comes safely encased in our signature TamZen collector box.
              </p>
            </div>
          )}
        </div>

        {/* Accordion Item 3: Heritage & Authenticity */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => setOpenAccordion(openAccordion === "heritage" ? null : "heritage")}
            className="w-full flex items-center justify-between py-2 text-left text-sm font-semibold uppercase tracking-wider text-white hover:text-[#E5C378] transition-colors"
          >
            <span>Heritage & Cultural Authenticity</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                openAccordion === "heritage" ? "rotate-180 text-[#E5C378]" : "text-neutral-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openAccordion === "heritage" && (
            <div className="pt-3 pb-4 text-xs leading-relaxed text-neutral-300 space-y-2 animate-fadeIn">
              <p>
                Every piece from TamZen is forged as an enduring symbol of Tamil identity, memory, and personal strength. Designed to be passed down through generations without losing its luster.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
