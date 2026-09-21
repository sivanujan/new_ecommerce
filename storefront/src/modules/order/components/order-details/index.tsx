import { HttpTypes } from "@medusajs/types"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    if (!str) return "Pending"
    const formatted = str.split("_").join(" ")
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="w-full flex flex-col gap-4 font-sans text-left">
      {/* Confirmation text */}
      <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
        We have transmitted your order confirmation and dispatch updates to{" "}
        <span
          className="text-white font-bold underline underline-offset-4 decoration-[#E5C378]/50"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </p>

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 uppercase tracking-wider font-mono text-[11px]">
            Order Number:
          </span>
          <span
            className="font-mono font-bold text-[#E5C378] text-sm sm:text-base"
            data-testid="order-id"
          >
            #{order.display_id}
          </span>
        </div>

        <span className="hidden sm:inline text-white/20">•</span>

        <div className="flex items-center gap-2">
          <span className="text-neutral-400 uppercase tracking-wider font-mono text-[11px]">
            Date:
          </span>
          <span className="text-neutral-200 font-medium" data-testid="order-date">
            {orderDate}
          </span>
        </div>

        {showStatus && (
          <>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 uppercase tracking-wider font-mono text-[11px]">
                Fulfillment:
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full bg-[#E5C378]/10 border border-[#E5C378]/30 text-[#E5C378] font-mono text-[11px] font-semibold"
                data-testid="order-status"
              >
                {formatStatus(order.fulfillment_status)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400 uppercase tracking-wider font-mono text-[11px]">
                Payment:
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold"
                data-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
