import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-28 flex flex-col gap-y-6">
      <div className="w-full bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
            In Your Cart
          </h2>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E5C378] px-2.5 py-0.5 rounded-full bg-white/5 border border-[#E5C378]/30">
            {cart?.items?.length || 0} {cart?.items?.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Line Items Preview */}
        <div className="mb-4">
          <ItemsPreviewTemplate cart={cart} />
        </div>

        {/* Promotion Code */}
        <div className="py-2 border-t border-white/10">
          <DiscountCode cart={cart} />
        </div>

        {/* Financial Totals */}
        <CartTotals totals={cart} />

        {/* Luxury Assurances */}
        <div className="pt-5 mt-2 flex flex-col gap-2.5 text-xs text-neutral-400 font-sans border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-[#E5C378] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Certified Tamil Heritage Atelier Design</span>
          </div>
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-[#E5C378] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Express Insured Shipping from Paris</span>
          </div>
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-[#E5C378] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>256-Bit SSL Encrypted & Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
