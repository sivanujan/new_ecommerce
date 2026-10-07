import { notFound } from "next/navigation"
import Navbar from "@/components/Navbar"
import EditProductForm from "@/components/EditProductForm"
import { getProduct, listCategories } from "@/lib/medusa"

export const dynamic = "force-dynamic"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProduct(id),
    listCategories(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div>
      <Navbar
        title="Edit Product"
        subtitle={`Editing "${product.title}"`}
      />

      <div className="p-8 max-w-4xl mx-auto">
        <EditProductForm product={product} categories={categories} />
      </div>
    </div>
  )
}
