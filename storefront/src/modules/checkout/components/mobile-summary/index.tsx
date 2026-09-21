"use client"

import React, { useState } from "react"
import { convertToLocale } from "@lib/util/money"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"

export default function MobileOrderSummary({ cart }: { cart: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const itemsCount = cart?.items?.length || 0

  return (
    <div className="lg:hidden w-full mb-6 rounded-2xl border border-white/10 bg-[#121215] overflow-hidden shadow-xl">
      {/* Toggle Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C378]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span>Order Summary</span>
              <span className="text-[#E5C378] font-mono font-normal">({itemsCount})</span>
            </span>
            <span className="text-[11px] text-neutral-400 font-sans">
              {isOpen ? "Tap to hide details" : "Tap to view items & totals"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="font-display font-black text-base text-[#E5C378] font-mono">
            {convertToLocale({
              amount: cart?.total ?? 0,
              currency_code: cart?.currency_code,
            })}
          </span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Expanded Details */}
      {isOpen && (
        <div className="px-5 pb-6 pt-2 border-t border-white/10 space-y-5 animate-in fade-in duration-200">
          <ItemsPreviewTemplate cart={cart} />
          <div className="pt-2 border-t border-white/10">
            <DiscountCode cart={cart} />
          </div>
          <CartTotals totals={cart} />
        </div>
      )}
    </div>
  )
}
