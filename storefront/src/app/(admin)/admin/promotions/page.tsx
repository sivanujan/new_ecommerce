import Navbar from "@/components/admin/Navbar"
import PromotionsClient from "@/components/admin/PromotionsClient"
import { listPromotions, listProducts } from "@/lib/admin/medusa"

export const dynamic = "force-dynamic"

export default async function PromotionsPage() {
  const [promotions, products] = await Promise.all([
    listPromotions(),
    listProducts(),
  ])

  return (
    <div>
      <Navbar
        title="Promotions & Promo Codes"
        subtitle="Manage discount codes and special checkout vouchers for your atelier"
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <PromotionsClient initialPromotions={promotions} products={products} />
      </div>
    </div>
  )
}
