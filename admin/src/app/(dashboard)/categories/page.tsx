import Navbar from "@/components/Navbar"
import CategoriesClient from "@/components/CategoriesClient"
import { listCategories } from "@/lib/medusa"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  const categories = await listCategories()

  return (
    <div>
      <Navbar
        title="Categories"
        subtitle="Manage product collections and taxonomy"
      />

      <div className="p-8 max-w-7xl mx-auto">
        <CategoriesClient initialCategories={categories} />
      </div>
    </div>
  )
}
