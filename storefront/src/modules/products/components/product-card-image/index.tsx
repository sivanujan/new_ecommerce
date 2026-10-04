"use client"

import { useState } from "react"
import Image from "next/image"

type ProductCardImageProps = {
  src?: string | null
  alt: string
  className?: string
}

export default function ProductCardImage({
  src,
  alt,
  className = "",
}: ProductCardImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A20] to-[#0E0E12] p-4 text-center select-none">
        <div className="w-12 h-12 rounded-full bg-[#E5C378]/10 border border-[#E5C378]/30 flex items-center justify-center text-[#E5C378] mb-2 shadow-[0_0_20px_rgba(229,195,120,0.15)]">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#E5C378] font-bold">
          TamZen Atelier
        </span>
        <span className="text-[10px] text-neutral-400 mt-1 line-clamp-1 max-w-[85%]">
          {alt}
        </span>
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
      className={`object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105 ${className}`}
      onError={() => setHasError(true)}
    />
  )
}
