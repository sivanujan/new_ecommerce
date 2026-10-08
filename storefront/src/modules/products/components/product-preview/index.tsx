"use client"

import React, { useState, useMemo } from "react"
import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PreviewPrice from "./price"
import Image from "next/image"
import { normalizeImageUrl } from "@lib/util/normalize-image-url"

const COLOR_SWATCH_STYLES: Record<string, string> = {
  silver: "linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 50%, #64748B 100%)",
  gold: "linear-gradient(135deg, #FFF2A3 0%, #D4AF37 50%, #8C6510 100%)",
  black: "linear-gradient(135deg, #374151 0%, #1F2937 50%, #0B0B0E 100%)",
}

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Extract color options and their corresponding images
  const colorData = useMemo(() => {
    const colorOpt = (product.options || []).find((opt) =>
      /^(color|colour|metal|finish)$/i.test(opt.title || "")
    )
    const colorValues = colorOpt?.values?.map((v: any) => v.value) || ["Silver", "Gold", "Black"]

    const metaColorImages = (product.metadata as any)?.color_images || {}

    // Map each color name to an image URL
    const colorMap: Record<string, string> = {}
    for (const colorName of colorValues) {
      if (metaColorImages[colorName]?.[0]) {
        colorMap[colorName] = metaColorImages[colorName][0]
      } else {
        // Find variant with matching color
        const matchVariant = product.variants?.find((v: any) => {
          const varCol =
            (v.metadata as any)?.color ||
            v.options?.find((o: any) => /color/i.test(o.option?.title || o.title || ""))?.value
          return varCol && varCol.toLowerCase() === colorName.toLowerCase()
        })
        const varImg =
          (matchVariant?.metadata as any)?.image_url ||
          (matchVariant?.metadata as any)?.images?.[0]

        if (varImg) {
          colorMap[colorName] = varImg
        } else {
          // Standard predictable seed path fallback
          colorMap[colorName] = `/seed-images/${product.handle}/${colorName.toLowerCase()}.jpg`
        }
      }
    }

    return {
      colors: colorValues,
      colorMap,
    }
  }, [product])

  const defaultImage =
    product.thumbnail ||
    product.images?.[0]?.url ||
    colorData.colorMap["Silver"] ||
    colorData.colorMap[colorData.colors[0]] ||
    "/images/tamzen-hero-pendant.jpg"

  const [activeColor, setActiveColor] = useState<string | null>(null)
  const currentImageUrl = normalizeImageUrl(
    activeColor ? colorData.colorMap[activeColor] || defaultImage : defaultImage
  )

  const productLink = activeColor
    ? `/products/${product.handle}?color=${activeColor.toLowerCase()}`
    : `/products/${product.handle}`

  return (
    <div
      className="group relative rounded-2xl bg-[#121217] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-md overflow-hidden flex flex-col"
      data-testid="product-wrapper"
    >
      {/* Clickable Image Container */}
      <LocalizedClientLink href={productLink} className="relative block aspect-[4/5] w-full overflow-hidden bg-black/60">
        <Image
          src={currentImageUrl}
          alt={product.title || "Jewelry piece"}
          fill
          unoptimized
          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 600px"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Brand Tag Top Left */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/75 border border-[#D4AF37]/30 text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] backdrop-blur-md">
          316L Steel
        </div>

        {/* Active Color Preview Indicator on Image */}
        {activeColor && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-black/85 border border-[#D4AF37]/50 text-[10px] font-semibold text-[#F5F0E8] backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <span
              className="w-2 h-2 rounded-full border border-black/40"
              style={{
                background:
                  COLOR_SWATCH_STYLES[activeColor.toLowerCase()] || "#D4AF37",
              }}
            />
            <span>{activeColor}</span>
          </div>
        )}
      </LocalizedClientLink>

      {/* Info Container */}
      <div className="p-4 flex flex-col gap-2.5 flex-1 justify-between bg-[#121217]">
        <div>
          <LocalizedClientLink href={productLink}>
            <h3
              className="font-serif font-bold text-sm sm:text-base text-[#F5F0E8] group-hover:text-[#D4AF37] transition-colors line-clamp-1"
              data-testid="product-title"
            >
              {product.title}
            </h3>
          </LocalizedClientLink>

          <div className="flex items-center justify-between mt-1.5">
            <div className="font-semibold text-xs sm:text-sm text-[#D4AF37]">
              {cheapestPrice ? <PreviewPrice price={cheapestPrice} /> : "€69.00"}
            </div>

            <span className="text-[10px] uppercase font-mono tracking-wider text-[#9CA3AF]">
              Waterproof
            </span>
          </div>
        </div>

        {/* 3 Color Dots Under Product */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-[#9CA3AF] uppercase font-mono tracking-wider">
            Finishes:
          </span>

          <div className="flex items-center gap-2">
            {colorData.colors.map((colorName) => {
              const lower = colorName.toLowerCase()
              const isCurrent =
                activeColor === colorName || (!activeColor && lower === "silver")
              const swatchStyle = COLOR_SWATCH_STYLES[lower] || "#D4AF37"

              return (
                <button
                  key={colorName}
                  type="button"
                  onMouseEnter={() => setActiveColor(colorName)}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setActiveColor(colorName)
                  }}
                  className={`w-4 h-4 rounded-full transition-all duration-200 cursor-pointer relative ${
                    isCurrent
                      ? "ring-2 ring-[#D4AF37] ring-offset-1 ring-offset-[#121217] scale-110"
                      : "opacity-75 hover:opacity-100 hover:scale-105"
                  }`}
                  style={{ background: swatchStyle }}
                  title={`${colorName} finish`}
                  aria-label={`${colorName} finish`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
