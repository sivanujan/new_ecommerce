import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export const metadata: Metadata = {
  title: "Orders | TamZen Atelier",
  description: "Overview and status of your previous heritage orders.",
}

export default async function Orders() {
  const orders = await listOrders().catch(() => null)

  if (!orders) {
    return null
  }

  return (
    <div className="w-full font-sans" data-testid="orders-page-wrapper">
      <div className="mb-6 pb-6 border-b border-white/10 flex flex-col gap-y-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-px bg-[#E5C378]/60" />
          <span className="text-[10px] uppercase tracking-widest font-mono text-[#E5C378]">
            Acquisition History
          </span>
        </div>
        <h1 className="font-display font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Your Orders
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
          Review your previous acquisitions, view detailed receipts, track worldwide insured delivery, or request returns.
        </p>
      </div>

      <div className="flex flex-col gap-y-8">
        <OrderOverview orders={orders} />
        <TransferRequestForm />
      </div>
    </div>
  )
}
