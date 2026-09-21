import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div className="w-full font-sans text-left">
      <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wider pb-3 border-b border-white/10 mb-4">
        Order Summary
      </h2>
      <div className="flex flex-col gap-y-2.5 text-xs sm:text-sm text-neutral-300">
        <div className="flex items-center justify-between">
          <span className="text-neutral-300">Subtotal</span>
          <span className="text-white font-medium">{getAmount(order.subtotal)}</span>
        </div>
        {order.discount_total > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-emerald-400">Discount</span>
            <span className="text-emerald-400 font-medium">- {getAmount(order.discount_total)}</span>
          </div>
        )}
        {order.gift_card_total > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-emerald-400">Gift Card</span>
            <span className="text-emerald-400 font-medium">- {getAmount(order.gift_card_total)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-neutral-300">Shipping</span>
          <span className="text-white font-medium">{getAmount(order.shipping_total)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-300">Taxes</span>
          <span className="text-white font-medium">{getAmount(order.tax_total)}</span>
        </div>

        <div className="h-px w-full border-b border-white/10 my-3" />

        <div className="flex items-center justify-between">
          <span className="font-display text-base font-bold text-white uppercase tracking-wider">Total</span>
          <span className="font-display text-2xl font-black text-[#E5C378]">
            {getAmount(order.total)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
