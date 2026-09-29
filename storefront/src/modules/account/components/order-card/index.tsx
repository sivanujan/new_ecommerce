import { useMemo } from "react"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { formatOrderNumber } from "@lib/util/format-order-number"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <div
      className="rounded-2xl bg-[#121215] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col font-sans text-white hover:border-white/20 transition-all"
      data-testid="order-card"
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider font-mono text-neutral-400">
            Order
          </span>
          <span
            className="font-mono font-bold text-[#E5C378] text-base sm:text-lg"
            data-testid="order-display-id"
          >
            {formatOrderNumber(order)}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-300">
          <span data-testid="order-created-at">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-neutral-400">
            {numberOfLines} {numberOfLines === 1 ? "piece" : "pieces"}
          </span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-2">
        {order.items?.slice(0, 4).map((i) => {
          return (
            <div
              key={i.id}
              className="flex flex-col gap-2 group"
              data-testid="order-item"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-white/10 group-hover:border-[#E5C378]/40 transition-colors">
                <Thumbnail thumbnail={i.thumbnail} images={[]} size="full" />
              </div>
              <div className="flex flex-col text-xs">
                <span
                  className="font-semibold text-neutral-200 truncate group-hover:text-white transition-colors"
                  data-testid="item-title"
                >
                  {i.title}
                </span>
                <span className="text-neutral-400 font-mono mt-0.5" data-testid="item-quantity">
                  Qty: {i.quantity}
                </span>
              </div>
            </div>
          )
        })}

        {numberOfProducts > 4 && (
          <div className="w-full aspect-square rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-neutral-400 text-xs font-mono">
            <span className="font-bold text-white text-sm">+{numberOfProducts - 4}</span>
            <span>more</span>
          </div>
        )}
      </div>

      {/* Footer Bar */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider font-mono text-neutral-400">
            Total Paid
          </span>
          <span
            className="font-display font-bold text-lg sm:text-xl text-[#E5C378]"
            data-testid="order-amount"
          >
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </span>
        </div>

        <LocalizedClientLink
          href={`/account/orders/details/${order.id}`}
          className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#E5C378]/50 text-xs font-semibold text-white hover:text-[#E5C378] transition-all flex items-center gap-1.5"
          data-testid="order-details-link"
        >
          <span>See details</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
