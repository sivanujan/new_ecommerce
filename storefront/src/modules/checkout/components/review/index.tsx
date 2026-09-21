"use client"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "bg-[#121215] border-[#E5C378]/30 shadow-2xl p-6 sm:p-8"
          : "bg-[#121215]/80 border-white/10 p-5 sm:p-6"
      }`}
    >
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
              isOpen
                ? "border-2 border-[#E5C378] text-[#E5C378] bg-[#E5C378]/10 shadow-[0_0_15px_rgba(229,195,120,0.2)]"
                : "border border-white/20 text-neutral-400 bg-white/[0.02]"
            }`}
          >
            04
          </div>

          <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wider">
            Review & Place Order
          </h2>
        </div>
      </div>

      {isOpen && previousStepsCompleted && (
        <div className="pt-6 sm:pt-8 space-y-6">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
            By clicking the <span className="text-[#E5C378] font-bold">Place Order</span> button, you confirm that you have reviewed your delivery address and payment method, and agree to the <span className="text-white underline underline-offset-4 decoration-[#E5C378]/50 hover:text-[#E5C378] cursor-pointer">Terms of Sale</span>, <span className="text-white underline underline-offset-4 decoration-[#E5C378]/50 hover:text-[#E5C378] cursor-pointer">Returns Policy</span>, and acknowledge <span className="text-white font-medium">TamZen Atelier&apos;s Privacy Policy</span>.
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <PaymentButton cart={cart} data-testid="submit-order-button" />
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-sans">
              <svg className="w-4 h-4 text-[#E5C378]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>100% Authentic Tamil Heritage Atelier</span>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className="pt-4 text-xs sm:text-sm text-neutral-500 italic">
          Final order review will unlock once payment details are provided.
        </div>
      )}
    </div>
  )
}

export default Review
