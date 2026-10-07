import { notFound } from "next/navigation"
import Navbar from "@/components/admin/Navbar"
import OrderDetailClient from "@/components/admin/OrderDetailClient"
import { getOrder } from "@/lib/admin/medusa"

export const dynamic = "force-dynamic"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  return (
    <div>
      <Navbar
        title="Order Details"
        subtitle={`Viewing order #${order.display_id || order.id.slice(-6)}`}
      />

      <div className="p-8 max-w-7xl mx-auto">
        <OrderDetailClient order={order} />
      </div>
    </div>
  )
}
