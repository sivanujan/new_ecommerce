import Navbar from "@/components/Navbar"
import CustomersClient from "@/components/CustomersClient"
import { getCustomersWithMetrics } from "@/lib/medusa"

export const dynamic = "force-dynamic"

export default async function CustomersPage() {
  const customers = await getCustomersWithMetrics()

  return (
    <div>
      <Navbar
        title="Collector Directory"
        subtitle="Manage jewelry clients, customer accounts, and order history"
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <CustomersClient initialCustomers={customers} />
      </div>
    </div>
  )
}
