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
    shipping_total?: number | null
    discount_total?: number | null
    items?: any[] | null
    shipping_methods?: any[] | null
    summary?: any
    [key: string]: any
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const { currency_code } = totals

  // Calculate items sum if available
  const itemsSum = totals.items?.length
    ? totals.items.reduce((acc: number, it: any) => {
        const itemTot =
          it.total ??
          it.subtotal ??
          (it.unit_price ? it.unit_price * (it.quantity || 1) : 0)
        return acc + (typeof itemTot === "number" ? itemTot : parseFloat(itemTot) || 0)
      }, 0)
    : 0

  // 1. Subtotal: Prioritize item_subtotal (cart), then itemsSum if item_subtotal is missing, then subtotal/summary.subtotal
  const resolvedSubtotal =
    totals.item_subtotal ??
    (itemsSum > 0 ? itemsSum : null) ??
    totals.subtotal ??
    totals.summary?.item_subtotal ??
    totals.summary?.subtotal ??
    0

  // 2. Shipping: check shipping_subtotal, shipping_total, shipping_methods, summary
  const rawShipping =
    totals.shipping_subtotal ??
    totals.shipping_total ??
    totals.shipping_methods?.[0]?.amount ??
    totals.summary?.shipping_total ??
    null

  const resolvedShipping =
    rawShipping !== null && rawShipping !== undefined ? Number(rawShipping) : null

  // 3. Discount
  const resolvedDiscount =
    totals.discount_subtotal ??
    totals.discount_total ??
    totals.summary?.discount_total ??
    0

  // 4. Taxes
  const resolvedTax =
    totals.tax_total ??
    totals.summary?.tax_total ??
    0

  // 5. Total
  const resolvedTotal =
    totals.total ??
    totals.summary?.total ??
    (resolvedSubtotal + (resolvedShipping ?? 0) + resolvedTax - resolvedDiscount)

  return (
    <div className="w-full font-sans">
      <div className="flex flex-col gap-y-2.5 text-xs sm:text-sm text-neutral-300">
        <div className="flex items-center justify-between">
          <span className="text-neutral-300">Subtotal (excl. shipping & taxes)</span>
          <span className="text-white font-medium" data-testid="cart-subtotal" data-value={resolvedSubtotal}>
            {convertToLocale({ amount: resolvedSubtotal, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-300">Shipping</span>
          <span className="text-white font-medium" data-testid="cart-shipping" data-value={resolvedShipping ?? 0}>
            {resolvedShipping !== null
              ? convertToLocale({ amount: resolvedShipping, currency_code })
              : "Calculated at checkout"}
          </span>
        </div>
        {!!resolvedDiscount && resolvedDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-emerald-400">Discount</span>
            <span
              className="text-emerald-400 font-medium"
              data-testid="cart-discount"
              data-value={resolvedDiscount}
            >
              -{" "}
              {convertToLocale({
                amount: resolvedDiscount,
                currency_code,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-neutral-300">Taxes</span>
          <span className="text-white font-medium" data-testid="cart-taxes" data-value={resolvedTax}>
            {convertToLocale({ amount: resolvedTax, currency_code })}
          </span>
        </div>
      </div>

      <div className="h-px w-full border-b border-white/10 my-4" />

      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-base font-bold text-white uppercase tracking-wider">Total</span>
        <span
          className="font-display text-2xl sm:text-3xl font-black text-[#E5C378] tracking-tight"
          data-testid="cart-total"
          data-value={resolvedTotal}
        >
          {convertToLocale({ amount: resolvedTotal, currency_code })}
        </span>
      </div>

      <div className="h-px w-full border-b border-white/10 mt-4" />
    </div>
  )
}

export default CartTotals
