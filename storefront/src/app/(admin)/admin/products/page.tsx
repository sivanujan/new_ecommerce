import Navbar from "@/components/admin/Navbar"
import ProductListClient from "@/components/admin/ProductListClient"
import { listProducts, listCategories } from "@/lib/admin/medusa"

export const dynamic = "force-dynamic"

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ])

  return (
    <div>
      <Navbar
        title="Products Catalog"
        subtitle="Manage your TamZen handcrafted jewelry pieces and studio inventory"
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <ProductListClient
          initialProducts={products}
          categories={categories}
        />
      </div>
    </div>
  )
}
