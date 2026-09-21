"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"

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
  const searchParams = useSearchParams()
  const countryCode = (useParams().countryCode as string) || "fr"

  // Check if multiple variants exist
  const hasMultipleVariants = (product.variants?.length ?? 0) > 1

  // Options that have multiple values to choose from
  const visibleOptions = useMemo(() => {
    return (product.options || []).filter(
      (opt) => (opt.values ?? []).length > 1
    )
  }, [product.options])

  // Initialize options:
  // If single variant: preselect its options.
  // If URL contains v_id matching a variant: preselect that variant.
  // Otherwise, start empty so user explicitly picks their size.
  const [options, setOptions] = useState<Record<string, string>>(() => {
    if (!hasMultipleVariants && product.variants?.length === 1) {
      return optionsAsKeymap(product.variants[0].options)
    }

    const urlVariantId = searchParams.get("v_id")
    if (urlVariantId && product.variants) {
      const match = product.variants.find((v) => v.id === urlVariantId)
      if (match?.options) {
        return optionsAsKeymap(match.options)
      }
    }

    return {}
  })

  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>("specs")

  // Required option IDs that must be selected
  const requiredOptionIds = useMemo(() => {
    return visibleOptions.map((opt) => opt.id)
  }, [visibleOptions])

  // Find first unselected option to prompt the user
  const unselectedOption = useMemo(() => {
    return visibleOptions.find((opt) => !options[opt.id])
  }, [visibleOptions, options])

  // Match selected variant
  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return undefined
    }

    // Single variant product
    if (!hasMultipleVariants) {
      return product.variants[0]
    }

    // If there are visible options to choose, ensure all are chosen
    if (requiredOptionIds.length > 0) {
      const allSelected = requiredOptionIds.every((id) => !!options[id])
      if (!allSelected) {
        return undefined
      }
    }

    // Find the matching variant
    return product.variants.find((v) => {
      const vMap = optionsAsKeymap(v.options)
      return requiredOptionIds.every((id) => vMap[id] === options[id])
    })
  }, [product.variants, hasMultipleVariants, requiredOptionIds, options])

  // Sync URL shallowly with window.history.replaceState (prevents full page re-render)
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

  // Whether user can click Add to Cart
  const canAddToCart = useMemo(() => {
    if (isAdding) return false
    if (hasMultipleVariants && !selectedVariant) return false
    return inStock
  }, [isAdding, hasMultipleVariants, selectedVariant, inStock])

  // Add to cart handler
  const handleAddToCart = async () => {
    const variantToUse = selectedVariant || (!hasMultipleVariants ? product.variants?.[0] : null)
    if (!variantToUse?.id || !inStock) return

    setIsAdding(true)
    setAddedSuccess(false)

    try {
      await addToCart({
        variantId: variantToUse.id,
        quantity,
        countryCode,
      })
      setAddedSuccess(true)
      setTimeout(() => setAddedSuccess(false), 4000)
    } catch (err) {
      console.error("Failed to add product to cart:", err)
    } finally {
      setIsAdding(false)
    }
  }

  const primaryCategory =
    (product as any).categories?.[0]?.name ||
    product.collection?.title ||
    "Heritage Piece"

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-7">
      {/* 1. Category / Eyebrow Badge */}
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

      {/* 2. High-Contrast Bold Serif Title */}
      <div>
        <h1
          className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight leading-[1.1] drop-shadow-sm"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        {/* Tamil Brand Tagline */}
        <div className="inline-flex items-center gap-2.5 mt-2.5">
          <span className="w-4 h-[1px] bg-[#E5C378]/60" />
          <span className="text-xs sm:text-sm font-semibold text-[#F3D798] tracking-wider font-sans">
            எங்கள் வேர் எங்கள் அடையாளம்
          </span>
          <span className="w-4 h-[1px] bg-[#E5C378]/60" />
        </div>
      </div>

      {/* 3. Prominent Price & Stock Status Bar */}
      <div className="flex flex-wrap items-baseline gap-4 py-3 border-y border-white/10">
        <div className="flex items-baseline gap-3">
          {!selectedVariant && hasMultipleVariants && (
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-sans font-medium">
              From
            </span>
          )}

          <span
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#E5C378] tracking-tight"
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
          <span>
            {selectedVariant
              ? inStock
                ? "In Stock — Ready to dispatch"
                : "Out of Stock"
              : "In Stock — Select options"}
          </span>
        </div>
      </div>

      {/* 4. High-Contrast Readable Description */}
      {product.description && (
        <p className="text-neutral-200 text-sm sm:text-base font-light leading-relaxed font-sans">
          {product.description}
        </p>
      )}

      {/* 5. Variant Selectors (Clean static label, no stray cursor/line) */}
      {hasMultipleVariants && visibleOptions.length > 0 && (
        <div className="flex flex-col gap-5 py-2">
          {visibleOptions.map((option) => {
            const currentVal = options[option.id]

            return (
              <div key={option.id} className="flex flex-col gap-2.5">
                {/* Clean label without colons or stray cursor */}
                <div className="flex items-center justify-between text-xs uppercase tracking-wider font-semibold select-none">
                  <span className="text-neutral-300 tracking-[0.18em]">
                    {option.title}
                  </span>
                  {currentVal ? (
                    <span className="text-[#E5C378] font-bold tracking-wide">
                      {currentVal}
                    </span>
                  ) : (
                    <span className="text-neutral-400 font-normal text-[11px] tracking-normal">
                      Please select
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
                            ? "bg-[#E5C378]/20 border-2 border-[#E5C378] text-[#F3D798] ring-2 ring-[#E5C378]/40 shadow-[0_0_15px_rgba(229,195,120,0.25)] font-bold"
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

      {/* 6. Quantity Stepper & Add to Cart CTA */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3.5 pt-2">
        {/* Quantity Stepper */}
        <div className="inline-flex items-center justify-between border border-white/20 bg-white/[0.04] rounded-full px-4 py-2 sm:py-3 shrink-0">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isAdding}
            aria-label="Decrease quantity"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
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
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAddToCart || isAdding}
          data-testid="add-product-button"
          className={`flex-1 py-4 px-8 rounded-full font-bold uppercase tracking-[0.2em] text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-lg select-none ${
            !canAddToCart
              ? "bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-not-allowed opacity-80"
              : addedSuccess
              ? "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              : "bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:shadow-[0_0_30px_rgba(229,195,120,0.4)] hover:brightness-105 active:scale-[0.98] cursor-pointer"
          }`}
        >
          {isAdding ? (
            <>
              <svg className="animate-spin w-4 h-4 text-black" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Securing Piece...</span>
            </>
          ) : addedSuccess ? (
            <>
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Added to Cart</span>
            </>
          ) : !selectedVariant && hasMultipleVariants ? (
            <>
              <span>
                Select {unselectedOption?.title || "Option"}
              </span>
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

      {/* 7. Trust Badges Row */}
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

      {/* 8. Luxury Accordion Sections */}
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
                  <span className="text-white font-medium">{product.material || "Solid 316L Stainless Steel"}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Origin</span>
                  <span className="text-white font-medium">{product.origin_country || "Handcrafted Atelier"}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Finish</span>
                  <span className="text-white font-medium">18K Vacuum Ion Plating / Silver</span>
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
