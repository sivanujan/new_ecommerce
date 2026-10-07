import Navbar from "@/components/admin/Navbar"
import { listCategories } from "@/lib/admin/medusa"
import ProductForm from "@/components/admin/ProductForm"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  const categories = await listCategories()

  return (
    <div>
      <Navbar
        title="Add New Piece"
        subtitle="Create a new creation and publish it directly to your live storefront"
      />

      <div className="p-6 sm:p-8 max-w-5xl mx-auto">
        <ProductForm categories={categories} />
      </div>
    </div>
  )
}
