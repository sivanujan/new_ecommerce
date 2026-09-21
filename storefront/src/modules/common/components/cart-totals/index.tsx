"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  return (
    <div className="w-full font-sans">
      <div className="flex flex-col gap-y-2.5 text-xs sm:text-sm text-neutral-300">
        <div className="flex items-center justify-between">
          <span className="text-neutral-300">Subtotal (excl. shipping & taxes)</span>
          <span className="text-white font-medium" data-testid="cart-subtotal" data-value={item_subtotal || 0}>
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-300">Shipping</span>
          <span className="text-white font-medium" data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {shipping_subtotal ? convertToLocale({ amount: shipping_subtotal, currency_code }) : "Calculated at checkout"}
          </span>
        </div>
        {!!discount_subtotal && (
          <div className="flex items-center justify-between">
            <span className="text-emerald-400">Discount</span>
            <span
              className="text-emerald-400 font-medium"
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
            >
              -{" "}
              {convertToLocale({
                amount: discount_subtotal ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-neutral-300">Taxes</span>
          <span className="text-white font-medium" data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
      </div>

      <div className="h-px w-full border-b border-white/10 my-4" />

      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-base font-bold text-white uppercase tracking-wider">Total</span>
        <span
          className="font-display text-2xl sm:text-3xl font-black text-[#E5C378] tracking-tight"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>

      <div className="h-px w-full border-b border-white/10 mt-4" />
    </div>
  )
}

export default CartTotals
