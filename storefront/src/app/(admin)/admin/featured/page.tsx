import Navbar from "@/components/admin/Navbar"
import FeaturedDealsClient from "@/components/admin/FeaturedDealsClient"
import { listProducts, listCategories, getAdminHighlights } from "@/lib/admin/medusa"

export const dynamic = "force-dynamic"

export default async function FeaturedDealsPage() {
  const [products, categories, highlights] = await Promise.all([
    listProducts(),
    listCategories(),
    getAdminHighlights(),
  ])

  return (
    <div>
      <Navbar
        title="Featured Pieces & Flash Deals"
        subtitle="Curate the boutique homepage rail, configure Deal of the Week pieces, and manage countdown urgency"
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <FeaturedDealsClient
          initialHighlights={highlights}
          products={products}
          categories={categories}
        />
      </div>
    </div>
  )
}
