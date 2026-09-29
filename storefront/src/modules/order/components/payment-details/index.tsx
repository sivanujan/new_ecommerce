import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]

  return (
    <div className="w-full flex flex-col font-sans text-left">
      <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/10">
        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C378]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wider">
          Payment Confirmation
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
        {/* Payment Method */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
            Payment Method
          </span>
          <span className="font-semibold text-white text-base" data-testid="payment-method">
            {payment?.provider_id
              ? paymentInfoMap[payment.provider_id]?.title || payment.provider_id
              : "Direct Settlement"}
          </span>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Authorized & Captured</span>
          </span>
        </div>

        {/* Payment Details */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
            Settlement Summary
          </span>
          <div className="flex items-center gap-3 text-neutral-200">
            {payment?.provider_id && paymentInfoMap[payment.provider_id]?.icon && (
              <div className="flex items-center h-7 px-2 rounded-lg bg-white/10 border border-white/10 text-[#E5C378]">
                {paymentInfoMap[payment.provider_id].icon}
              </div>
            )}
            <span className="font-mono text-neutral-200" data-testid="payment-amount">
              {payment && isStripeLike(payment.provider_id) && payment.data?.card_last4
                ? `Card ending in ${payment.data.card_last4}`
                : payment
                ? `${convertToLocale({
                    amount: payment.amount,
                    currency_code: order.currency_code,
                  })} processed on ${
                    payment.created_at
                      ? new Date(payment.created_at).toLocaleDateString()
                      : new Date().toLocaleDateString()
                  }`
                : "Payment confirmed"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentDetails
