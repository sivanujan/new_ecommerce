import Navbar from "@/components/admin/Navbar"
import CategoriesClient from "@/components/admin/CategoriesClient"
import { listCategories, listProducts } from "@/lib/admin/medusa"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([
    listCategories(),
    listProducts(),
  ])

  const categoriesWithCounts = categories.map((cat: any) => {
    const count = products.filter((p: any) =>
      p.categories?.some((c: any) => c.id === cat.id)
    ).length
    return {
      ...cat,
      productCount: count,
    }
  })

  return (
    <div>
      <Navbar
        title="Collections & Categories"
        subtitle="Organize jewelry pieces into curated storefront collections"
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <CategoriesClient initialCategories={categoriesWithCounts} />
      </div>
    </div>
  )
}
