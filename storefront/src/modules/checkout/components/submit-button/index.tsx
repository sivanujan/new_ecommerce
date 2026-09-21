"use client"

import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  variant = "primary",
  className = "",
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  if (variant === "secondary") {
    return (
      <button
        type="submit"
        disabled={pending}
        className={`px-6 py-3 rounded-full border border-white/20 hover:border-[#E5C378] hover:text-[#E5C378] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer ${className}`}
        data-testid={dataTestId}
      >
        {pending ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    )
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full sm:w-auto min-w-[200px] py-3.5 px-8 rounded-full font-bold uppercase tracking-[0.15em] text-xs sm:text-sm bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:shadow-[0_0_25px_rgba(229,195,120,0.35)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
      data-testid={dataTestId}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}
