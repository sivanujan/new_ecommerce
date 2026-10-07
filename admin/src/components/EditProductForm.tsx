"use client"

import ProductForm from "./ProductForm"

export default function EditProductForm({
  product,
  categories,
}: {
  product: any
  categories: any[]
}) {
  return <ProductForm product={product} categories={categories} />
}
