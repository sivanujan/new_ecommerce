import Navbar from "@/components/Navbar"
import ProductListClient from "@/components/ProductListClient"
import { listProducts, listCategories } from "@/lib/medusa"

export const dynamic = "force-dynamic"

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ])

  return (
    <div>
      <Navbar
        title="Products"
        subtitle="Manage your TamZen jewelry catalog and inventory"
      />

      <div className="p-8 max-w-7xl mx-auto">
        <ProductListClient
          initialProducts={products}
          categories={categories}
        />
      </div>
    </div>
  )
}
