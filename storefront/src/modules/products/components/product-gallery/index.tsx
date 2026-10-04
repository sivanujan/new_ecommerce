"use client"

import { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { normalizeImageUrl } from "@lib/util/normalize-image-url"

type ProductGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title: string
  thumbnail?: string | null
}

export default function ProductGallery({
  images,
  title,
  thumbnail,
}: ProductGalleryProps) {
  // Consolidate images list, falling back to thumbnail if empty
  const rawImages = images && images.length > 0 
    ? images 
    : thumbnail 
      ? [{ id: "thumb", url: thumbnail } as HttpTypes.StoreProductImage] 
      : []

  const allImages = rawImages.map((img) => ({
    ...img,
    url: normalizeImageUrl(img.url),
  }))

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [errorIndices, setErrorIndices] = useState<Record<number, boolean>>({})
  const currentImage = allImages[selectedIndex] || allImages[0]

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Luxury Image Frame */}
      <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#131317] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
        {currentImage?.url && !errorIndices[selectedIndex] ? (
          <Image
            src={currentImage.url}
            alt={`${title} - View ${selectedIndex + 1}`}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            onError={() => setErrorIndices((prev) => ({ ...prev, [selectedIndex]: true }))}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A20] to-[#0E0E12] p-8 text-center select-none">
            <div className="w-16 h-16 rounded-full bg-[#E5C378]/10 border border-[#E5C378]/30 flex items-center justify-center text-[#E5C378] mb-3 shadow-[0_0_25px_rgba(229,195,120,0.15)]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5C378] font-bold">TamZen Atelier</span>
            <span className="text-xs text-neutral-400 mt-1 max-w-sm line-clamp-1">{title}</span>
          </div>
        )}

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 border border-[#E5C378]/30 backdrop-blur-md shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-[#F3D798] font-sans">
              TamZen Atelier
            </span>
          </div>

          {allImages.length > 1 && (
            <div className="px-2.5 py-1 rounded-full bg-black/75 border border-white/15 backdrop-blur-md text-[11px] font-mono text-neutral-300">
              {String(selectedIndex + 1).padStart(2, "0")} / {String(allImages.length).padStart(2, "0")}
            </div>
          )}
        </div>

        {/* Left / Right Navigation Arrows (if multiple images) */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous product image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#E5C378] text-white flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next product image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#E5C378] text-white flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip (if multiple images) */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {allImages.map((img, idx) => {
            const isActive = idx === selectedIndex
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-18 h-18 sm:w-20 sm:h-20 aspect-square rounded-xl overflow-hidden shrink-0 border transition-all duration-300 ${
                  isActive
                    ? "border-[#E5C378] ring-2 ring-[#E5C378]/40 scale-105 shadow-md"
                    : "border-white/15 opacity-60 hover:opacity-100 hover:border-white/40"
                }`}
              >
                {img.url && (
                  <Image
                    src={img.url}
                    alt={`${title} thumbnail ${idx + 1}`}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover object-center"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
