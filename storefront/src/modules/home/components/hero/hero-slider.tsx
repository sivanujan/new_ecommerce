"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type HeroSliderProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string
  price: string
}

const VERTICAL_MENU = ["PEOPLE", "HERITAGE", "IDENTITY", "STYLE", "FOREVER"]

export default function HeroProductSlider({
  products,
}: {
  products: HeroSliderProduct[]
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const total = products.length

  const nextSlide = useCallback(() => {
    if (total === 0) return
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  const prevSlide = useCallback(() => {
    if (total === 0) return
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  const goToSlide = (index: number) => {
    if (total === 0) return
    setCurrentIndex(index % total)
  }

  // Auto-advance every 5 seconds, paused on hover
  useEffect(() => {
    if (total <= 1 || isHovered) return

    const timer = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(timer)
  }, [total, isHovered, nextSlide, currentIndex])

  // Mobile swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > 40) {
      nextSlide()
    } else if (distance < -40) {
      prevSlide()
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  if (total === 0) {
    return null
  }

  const currentProduct = products[currentIndex]
  const currentFormatted = String(currentIndex + 1).padStart(2, "0")
  const totalFormatted = String(total).padStart(2, "0")

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-end gap-5 xl:gap-8 w-full">
      {/* Compact Frosted Glass Product Slider Card (Positioned lower-right) */}
      <div
        className="relative w-full max-w-[210px] sm:max-w-[230px] lg:max-w-[245px] xl:max-w-[260px] flex flex-col items-center lg:self-end lg:mb-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* The Clickable Dark Frosted Glass Card */}
        <LocalizedClientLink
          href={`/products/${currentProduct.handle}`}
          className="group relative block w-full p-2.5 sm:p-3 rounded-2xl bg-black/45 hover:bg-black/60 backdrop-blur-xl border border-white/15 hover:border-[#E5C378]/50 shadow-[0_15px_40px_rgba(0,0,0,0.65)] transition-all duration-300 active:scale-[0.99]"
        >
          {/* Subtle top eyebrow label */}
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.22em] font-bold text-[#E5C378]">
              <span className="w-1 h-1 rounded-full bg-[#E5C378] animate-pulse" />
              Featured Piece
            </span>
            <span className="text-[9px] font-mono text-white/40 tracking-wider">
              {currentFormatted}/{totalFormatted}
            </span>
          </div>

          {/* Product Image Frame */}
          <div
            key={currentProduct.id}
            className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/50 border border-white/10 animate-hero-slide"
          >
            <Image
              src={currentProduct.thumbnail}
              alt={currentProduct.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 640px) 210px, (max-width: 1024px) 230px, 260px"
              className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Subtle dark bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Bottom Info: Title, Price, View Link */}
          <div className="mt-2.5 px-1 flex flex-col gap-1">
            <h3 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-[#E5C378] transition-colors line-clamp-1 drop-shadow-sm">
              {currentProduct.title}
            </h3>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 mt-0.5">
              <span className="text-xs font-bold text-[#F3D798] font-sans tracking-wide">
                {currentProduct.price}
              </span>

              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-white/70 group-hover:text-white flex items-center gap-1 transition-colors">
                View Piece
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </span>
            </div>
          </div>
        </LocalizedClientLink>

        {/* Small, Subtle Side Arrow Buttons */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                prevSlide()
              }}
              aria-label="Previous product"
              className="absolute -left-2.5 sm:-left-3 top-[44%] -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-md active:scale-90 hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 -translate-x-[0.5px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                nextSlide()
              }}
              aria-label="Next product"
              className="absolute -right-2.5 sm:-right-3 top-[44%] -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-md active:scale-90 hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 translate-x-[0.5px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Mobile pagination dots below card */}
        {total > 1 && (
          <div className="flex lg:hidden items-center justify-between w-full mt-2.5 px-2">
            <div className="flex items-center gap-1.5">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-5 bg-[#E5C378]"
                      : "w-1.5 bg-white/25 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 text-[10px] font-mono text-white/70">
              <span className="text-[#E5C378] font-bold">{currentFormatted}</span>
              <span className="text-white/30">/</span>
              <span>{totalFormatted}</span>
            </div>
          </div>
        )}
      </div>

      {/* Far Right: Vertical Menu List & Synchronized Slider Counter (Desktop Only) */}
      <div className="hidden lg:flex flex-col items-center justify-between h-[360px] xl:h-[400px] py-4 pl-5 xl:pl-6 border-l border-white/20 flex-shrink-0">
        {/* Vertical Menu Items */}
        <div className="flex flex-col items-center gap-6 xl:gap-7">
          {VERTICAL_MENU.map((item, idx) => {
            const isHighlighted = idx === currentIndex % VERTICAL_MENU.length
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx % total)}
                className={`text-[9px] font-bold tracking-[0.28em] uppercase transition-all duration-300 cursor-pointer ${
                  isHighlighted
                    ? "text-[#E5C378] font-black drop-shadow-sm scale-105"
                    : "text-white/50 hover:text-white"
                }`}
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {item}
              </button>
            )
          })}
        </div>

        {/* Slider Counter Live Wired to currentIndex */}
        <div className="flex flex-col items-center gap-2 text-center pt-4">
          <span className="text-xs font-bold text-white font-sans drop-shadow-sm transition-all duration-300">
            {currentFormatted}
          </span>
          <span className="w-[1.5px] h-8 bg-white/30" />
          <span className="text-[10px] font-medium text-white/50 font-sans">
            {totalFormatted}
          </span>
        </div>
      </div>
    </div>
  )
}
