"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import { formatOrderNumber } from "@lib/util/format-order-number"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col justify-center gap-y-6 w-full font-sans">
      <div className="flex gap-4 justify-between items-center pb-4 border-b border-white/10">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-mono text-[#E5C378]">
            Order Archive
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mt-1">
            Order {formatOrderNumber(order)}
          </h1>
        </div>
        <LocalizedClientLink
          href="/account/orders"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-all"
          data-testid="back-to-overview-button"
        >
          <XMark className="w-4 h-4" /> <span>Back to overview</span>
        </LocalizedClientLink>
      </div>

      <div
        className="flex flex-col gap-6 h-full w-full"
        data-testid="order-details-container"
      >
        <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <OrderDetails order={order} showStatus />
        </div>

        <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wider pb-3 border-b border-white/10 mb-6">
            Purchased Pieces
          </h2>
          <Items order={order} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <ShippingDetails order={order} />
          </div>
          <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <OrderSummary order={order} />
          </div>
        </div>

        <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <Help />
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
