"use client"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-5 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
          Order Summary
        </h2>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E5C378] px-2.5 py-0.5 rounded-full bg-white/5 border border-[#E5C378]/30">
          Atelier Bag
        </span>
      </div>

      {/* Promotion Code Section */}
      <DiscountCode cart={cart} />

      {/* Totals Breakdown */}
      <CartTotals totals={cart} />

      {/* Checkout CTA */}
      <div className="pt-2">
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
          className="w-full py-4 px-8 rounded-full font-bold uppercase tracking-[0.2em] text-xs sm:text-sm bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 hover:shadow-[0_0_30px_rgba(229,195,120,0.4)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-lg text-center"
        >
          <span>Go to Checkout</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </LocalizedClientLink>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-white/10 text-neutral-400 text-xs">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#E5C378] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[11px] text-neutral-300">256-bit Encrypted & Secure Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#E5C378] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="text-[11px] text-neutral-300">Complimentary 30-day exchange guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#E5C378] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[11px] text-neutral-300">Tracked worldwide express delivery</span>
        </div>
      </div>
    </div>
  )
}

export default Summary
