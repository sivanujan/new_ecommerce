"use client"

import ProductForm from "./ProductForm"

export default function AddProductForm({ categories }: { categories: any[] }) {
  return <ProductForm categories={categories} />
}
