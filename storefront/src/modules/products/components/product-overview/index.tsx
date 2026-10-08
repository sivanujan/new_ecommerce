"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductGallery from "@modules/products/components/product-gallery"
import ProductDetailPanel from "@modules/products/components/product-detail-panel"
import { normalizeImageUrl } from "@lib/util/normalize-image-url"

interface ProductOverviewProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  initialImages: HttpTypes.StoreProductImage[]
}

export default function ProductOverview({
  product,
  region,
  initialImages,
}: ProductOverviewProps) {
  const searchParams = useSearchParams()

  // Find color option if exists
  const colorOption = useMemo(() => {
    return (product.options || []).find((opt) => {
      const t = (opt.title || "").toLowerCase()
      return t === "color" || t.includes("color") || t === "metal" || t.includes("finish")
    })
  }, [product.options])

  const availableColors = useMemo(() => {
    return colorOption?.values?.map((v: any) => v.value) || ["Silver", "Gold", "Black"]
  }, [colorOption])

  // Color-to-image mapping from product metadata OR variant metadata
  const colorImagesMap: Record<string, string[]> = useMemo(() => {
    const map: Record<string, string[]> = {
      ...((product.metadata as any)?.color_images || {}),
    }

    // Inspect variants for images
    if (product.variants) {
      for (const variant of product.variants) {
        const colorVal =
          (variant.metadata as any)?.color ||
          variant.options?.find((opt: any) =>
            /color|colour|metal|finish/i.test(opt.option?.title || opt.title || "")
          )?.value ||
          (variant.title?.toLowerCase().includes("silver")
            ? "Silver"
            : variant.title?.toLowerCase().includes("gold")
            ? "Gold"
            : variant.title?.toLowerCase().includes("black")
            ? "Black"
            : null)

        if (colorVal) {
          const varImgs =
            (variant.metadata as any)?.images ||
            ((variant.metadata as any)?.image_url
              ? [(variant.metadata as any).image_url]
              : null)

          if (varImgs && varImgs.length > 0 && !map[colorVal]) {
            map[colorVal] = varImgs
          }
        }
      }
    }

    // Fallback: predictable seed images path if not already set
    for (const c of availableColors) {
      if (!map[c] || map[c].length === 0) {
        map[c] = [`/seed-images/${product.handle}/${c.toLowerCase()}.jpg`]
      }
    }

    return map
  }, [product.metadata, product.variants, product.handle, availableColors])

  // Initial color determination:
  // 1. URL search param ?color=...
  // 2. First in-stock variant color
  // 3. First available color
  const initialColor = useMemo(() => {
    const urlColorParam = searchParams.get("color")
    if (urlColorParam) {
      const matched = availableColors.find(
        (c) => c.toLowerCase() === urlColorParam.toLowerCase()
      )
      if (matched) return matched
    }

    // Find first in-stock variant
    if (product.variants && product.variants.length > 0) {
      for (const v of product.variants) {
        const isAvailable =
          !v.manage_inventory || v.allow_backorder || (v.inventory_quantity ?? 0) > 0
        if (isAvailable) {
          const varColor =
            (v.metadata as any)?.color ||
            v.options?.find((opt: any) =>
              /color/i.test(opt.option?.title || opt.title || "")
            )?.value ||
            availableColors.find((c) =>
              v.title?.toLowerCase().includes(c.toLowerCase())
            )
          if (varColor) return varColor
        }
      }
    }

    return availableColors[0] || "Silver"
  }, [searchParams, availableColors, product.variants])

  const [selectedColor, setSelectedColor] = useState<string>(initialColor)

  // Featured main image
  const featuredCoverUrl = useMemo(() => {
    return product.thumbnail || (product.metadata as any)?.featured_image || null
  }, [product.thumbnail, product.metadata])

  // Compute active gallery images based on selectedColor
  const displayImages = useMemo(() => {
    const allBaseImages = product.images || initialImages || []

    if (selectedColor && colorImagesMap[selectedColor]?.length) {
      const colorUrls = colorImagesMap[selectedColor]
      const colorNormSet = new Set(colorUrls.map((u) => normalizeImageUrl(u)))

      // Color-assigned images first
      const matched = colorUrls.map((url, i) => ({
        id: `color-${selectedColor}-${i}`,
        url: normalizeImageUrl(url),
      })) as HttpTypes.StoreProductImage[]

      // Other general images (images not tagged to any other color)
      const otherColorsUrls = new Set<string>()
      for (const [col, urls] of Object.entries(colorImagesMap)) {
        if (col !== selectedColor && Array.isArray(urls)) {
          urls.forEach((u) => otherColorsUrls.add(normalizeImageUrl(u)))
        }
      }

      const remainder = allBaseImages.filter(
        (img) =>
          !colorNormSet.has(normalizeImageUrl(img.url)) &&
          !otherColorsUrls.has(normalizeImageUrl(img.url))
      )

      return [...matched, ...remainder]
    }

    // Default view: Ensure the featured cover image is FIRST
    let result = [...allBaseImages]
    if (featuredCoverUrl && result.length > 0) {
      const normFeatured = normalizeImageUrl(featuredCoverUrl)
      const existingIdx = result.findIndex(
        (img) => normalizeImageUrl(img.url) === normFeatured
      )
      if (existingIdx > 0) {
        const [feat] = result.splice(existingIdx, 1)
        result.unshift(feat)
      } else if (existingIdx === -1) {
        result.unshift({ id: "featured-main", url: featuredCoverUrl } as any)
      }
    }

    return result
  }, [selectedColor, colorImagesMap, product.images, initialImages, featuredCoverUrl])

  // Handle option changes from ProductDetailPanel
  const handleOptionChange = (
    _optionId: string,
    _value: string,
    allOptions: Record<string, string>
  ) => {
    if (colorOption) {
      const chosenColor = allOptions[colorOption.id]
      if (chosenColor && chosenColor !== selectedColor) {
        setSelectedColor(chosenColor)

        // Reflect selected color in URL (?color=gold)
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href)
          url.searchParams.set("color", chosenColor.toLowerCase())
          window.history.replaceState({}, "", url.toString())
        }
      }
    }
  }

  // Update selectedColor if URL changes
  useEffect(() => {
    const urlColorParam = searchParams.get("color")
    if (urlColorParam) {
      const matched = availableColors.find(
        (c) => c.toLowerCase() === urlColorParam.toLowerCase()
      )
      if (matched && matched !== selectedColor) {
        setSelectedColor(matched)
      }
    }
  }, [searchParams, availableColors, selectedColor])

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-start"
      data-testid="product-container"
    >
      {/* Left Column (7 cols): Interactive Luxury Image Gallery */}
      <div className="lg:col-span-7 w-full">
        <ProductGallery
          images={displayImages}
          title={product.title}
          thumbnail={
            selectedColor && colorImagesMap[selectedColor]?.length
              ? colorImagesMap[selectedColor][0]
              : featuredCoverUrl
          }
        />
      </div>

      {/* Right Column (5 cols): Sticky Product Info & Purchase Panel */}
      <div className="lg:col-span-5 w-full lg:sticky lg:top-28">
        <ProductDetailPanel
          product={product}
          region={region}
          initialColor={selectedColor}
          onOptionChange={handleOptionChange}
        />
      </div>
    </div>
  )
}
