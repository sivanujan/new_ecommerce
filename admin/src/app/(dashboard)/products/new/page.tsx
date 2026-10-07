import Navbar from "@/components/Navbar"
import { listCategories } from "@/lib/medusa"
import AddProductForm from "@/components/AddProductForm"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  const categories = await listCategories()

  return (
    <div>
      <Navbar
        title="Add New Product"
        subtitle="Create a new creation and publish it directly to your store"
      />

      <div className="p-8 max-w-4xl mx-auto">
        <AddProductForm categories={categories} />
      </div>
    </div>
  )
}
