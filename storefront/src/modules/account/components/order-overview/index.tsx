"use client"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-6 w-full font-sans">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full rounded-3xl bg-[#121215] border border-white/10 p-8 sm:p-12 text-center flex flex-col items-center justify-center font-sans shadow-xl"
      data-testid="no-orders-container"
    >
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C378] mb-4">
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>

      <h2 className="font-display font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
        No Orders Placed Yet
      </h2>
      <p className="text-xs sm:text-sm text-neutral-300 max-w-sm mb-6 leading-relaxed">
        You haven&apos;t placed any orders yet. Discover our latest collections of handcrafted Tamil heritage pieces.
      </p>

      <LocalizedClientLink
        href="/store"
        className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 font-bold text-xs uppercase tracking-[0.16em] hover:brightness-105 transition-all shadow-[0_4px_20px_rgba(229,195,120,0.3)]"
        data-testid="continue-shopping-button"
      >
        Explore Collection
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview
