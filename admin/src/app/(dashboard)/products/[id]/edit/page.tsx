import { notFound } from "next/navigation"
import Navbar from "@/components/Navbar"
import ProductForm from "@/components/ProductForm"
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
        title="Edit Piece"
        subtitle={`Editing "${product.title}"`}
      />

      <div className="p-6 sm:p-8 max-w-5xl mx-auto">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  )
}
