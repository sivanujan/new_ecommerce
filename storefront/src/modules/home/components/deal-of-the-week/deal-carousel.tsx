"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type DealProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string
  salePrice: string
  originalPrice: string
  discountPercent: number
  dealEndDate: string
}

function DealCountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    isEnded: boolean
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  })

  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(endDate).getTime()
      const diff = end - Date.now()

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isEnded: true,
        })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [endDate])

  if (timeLeft.isEnded) {
    return (
      <div className="w-full py-1.5 px-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-mono uppercase tracking-wider text-center">
        Deal Concluded
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full">
      {/* Days */}
      <div className="flex flex-col items-center justify-center bg-black/80 border border-white/15 rounded-lg px-1.5 py-1 min-w-[34px] sm:min-w-[38px] shadow-sm">
        <span className="font-mono font-bold text-xs sm:text-sm text-[#E5C378] leading-tight">
          {String(timeLeft.days).padStart(2, "0")}
        </span>
        <span className="text-[7px] sm:text-[8px] uppercase tracking-wider font-mono text-neutral-400">
          Days
        </span>
      </div>

      <span className="text-[#E5C378] font-bold text-[10px] sm:text-xs">:</span>

      {/* Hours */}
      <div className="flex flex-col items-center justify-center bg-black/80 border border-white/15 rounded-lg px-1.5 py-1 min-w-[34px] sm:min-w-[38px] shadow-sm">
        <span className="font-mono font-bold text-xs sm:text-sm text-[#E5C378] leading-tight">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className="text-[7px] sm:text-[8px] uppercase tracking-wider font-mono text-neutral-400">
          Hrs
        </span>
      </div>

      <span className="text-[#E5C378] font-bold text-[10px] sm:text-xs">:</span>

      {/* Mins */}
      <div className="flex flex-col items-center justify-center bg-black/80 border border-white/15 rounded-lg px-1.5 py-1 min-w-[34px] sm:min-w-[38px] shadow-sm">
        <span className="font-mono font-bold text-xs sm:text-sm text-[#E5C378] leading-tight">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="text-[7px] sm:text-[8px] uppercase tracking-wider font-mono text-neutral-400">
          Mins
        </span>
      </div>

      <span className="text-[#E5C378] font-bold text-[10px] sm:text-xs">:</span>

      {/* Secs */}
      <div className="flex flex-col items-center justify-center bg-black/80 border border-white/15 rounded-lg px-1.5 py-1 min-w-[34px] sm:min-w-[38px] shadow-sm">
        <span className="font-mono font-bold text-xs sm:text-sm text-[#E5C378] leading-tight">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className="text-[7px] sm:text-[8px] uppercase tracking-wider font-mono text-neutral-400">
          Secs
        </span>
      </div>
    </div>
  )
}

export default function DealCarousel({
  products,
}: {
  products: DealProduct[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [products])

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
      setTimeout(checkScroll, 350)
    }
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="relative w-full">
      {/* Carousel Navigation Arrows */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-16 right-0 z-20">
        <button
          type="button"
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          aria-label="Previous Deals"
          className="w-10 h-10 rounded-full bg-[#121215] border border-white/15 hover:border-[#E5C378] text-white hover:text-[#E5C378] disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          aria-label="Next Deals"
          className="w-10 h-10 rounded-full bg-[#121215] border border-white/15 hover:border-[#E5C378] text-white hover:text-[#E5C378] disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Horizontal Carousel Scroller */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto scrollbar-none no-scrollbar snap-x snap-mandatory py-4 px-1"
      >
        {products.map((product) => (
          <LocalizedClientLink
            key={product.id}
            href={`/products/${product.handle}`}
            className="group relative flex flex-col justify-between w-[210px] sm:w-[225px] md:w-[235px] lg:w-[245px] xl:w-[250px] shrink-0 snap-start bg-[#121215] hover:bg-[#16161a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#E5C378]/50 shadow-[0_6px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_40px_rgba(229,195,120,0.15)] transition-all duration-500 active:scale-[0.99]"
          >
            {/* Image Area with Discount Badge */}
            <div className="relative aspect-square w-full overflow-hidden bg-neutral-900 border-b border-white/10">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                unoptimized
                sizes="(max-width: 640px) 210px, 250px"
                className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Ambient dark bottom scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Top Discount Badge */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 shadow-[0_2px_15px_rgba(229,195,120,0.4)]">
                  -{product.discountPercent}% OFF
                </span>
              </div>

              {/* Floating Quick View pill on hover */}
              <div className="absolute inset-x-3 bottom-2.5 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-center">
                <span className="w-full py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-widest uppercase bg-white text-black text-center shadow-lg group-hover:bg-[#E5C378] transition-colors flex items-center justify-center gap-1">
                  <span>View Deal</span>
                  <span className="font-sans">&rarr;</span>
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-3 text-white">
              <div>
                <h3 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-[#E5C378] transition-colors line-clamp-1">
                  {product.title}
                </h3>

                {/* Struck-through Original Price + Gold Sale Price */}
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display font-bold text-sm sm:text-base text-[#E5C378]">
                    {product.salePrice}
                  </span>
                  <span className="text-[11px] sm:text-xs text-neutral-400 line-through font-mono">
                    {product.originalPrice}
                  </span>
                </div>
              </div>

              {/* Live Countdown Timer Section */}
              <div className="pt-2.5 border-t border-white/10 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[9px] uppercase font-mono tracking-wider text-neutral-400">
                  <span>Deal Ends In</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
                </div>
                <DealCountdownTimer endDate={product.dealEndDate} />
              </div>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}
