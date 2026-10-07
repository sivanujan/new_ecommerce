import Navbar from "@/components/Navbar"
import OrdersListClient from "@/components/OrdersListClient"
import { listOrders } from "@/lib/medusa"

export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  const orders = await listOrders()

  return (
    <div>
      <Navbar
        title="Client Orders"
        subtitle="Track customer purchases, fulfillment, shipments, and status"
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <OrdersListClient initialOrders={orders} />
      </div>
    </div>
  )
}
