"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Package,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Loader2,
  DollarSign,
  Layers,
  Image as ImageIcon,
} from "lucide-react"
import { createProductAction } from "@/lib/actions"

export default function AddProductForm({ categories }: { categories: any[] }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("49.00")
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "")
  const [stock, setStock] = useState("50")
  const [isPublished, setIsPublished] = useState(true)

  const [images, setImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdProduct, setCreatedProduct] = useState<any | null>(null)

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i])
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to upload image")
      }

      if (data.urls && data.urls.length > 0) {
        setImages((prev) => [...prev, ...data.urls])
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload images to Medusa storage.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.set("title", title)
      formData.set("description", description)
      formData.set("price", price)
      formData.set("categoryId", categoryId)
      formData.set("stock", stock)
      formData.set("isPublished", isPublished ? "true" : "false")
      formData.set("images", JSON.stringify(images))

      const res = await createProductAction(formData)

      if (res.error) {
        setError(res.error)
      } else {
        setCreatedProduct(res.product)
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong creating the product.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success view
  if (createdProduct) {
    const storefrontUrl = `http://localhost:8000/fr/products/${createdProduct.handle}`

    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-8 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Live on Store
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-3 font-serif">
            "{createdProduct.title}" Created!
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            Your product has been published to the default sales channel and is now visible and ready for customers to purchase.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <a
            href={storefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-md shadow-amber-500/20 transition-all group"
          >
            <span>View on Live Storefront</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <button
            onClick={() => {
              setCreatedProduct(null)
              setTitle("")
              setDescription("")
              setPrice("49.00")
              setStock("50")
              setImages([])
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Add Another Product
          </button>

          <Link
            href="/products"
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Back to Products List
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Products</span>
        </Link>

        <span className="text-[11px] text-slate-400">
          Required fields are marked with *
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Single Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-amber-800 flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-600" />
            <span>Product Details</span>
          </h3>

          <div>
            <label
              htmlFor="title"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Product Name *
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Pendentif Tigre Tamoul Or 18k"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all bg-slate-50/50 hover:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the jewelry design, materials (e.g. 316L stainless steel, 18k gold plating), finish, and cultural significance..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all bg-slate-50/50 hover:bg-white resize-y"
            />
          </div>
        </div>

        {/* Section 2: Pricing, Category & Stock */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Price (EUR €) *
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold text-sm">
                €
              </div>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.00"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all bg-slate-50/50 hover:bg-white"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Inclusive of 20% TVA
            </span>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            >
              <option value="">No Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Organize into collections
            </span>
          </div>

          {/* Stock Quantity */}
          <div>
            <label
              htmlFor="stock"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Initial Stock Quantity
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="50"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all bg-slate-50/50 hover:bg-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Units available in warehouse
            </span>
          </div>
        </div>

        {/* Section 3: Product Images */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Product Images
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload one or multiple photos. The first image will be used as the primary thumbnail.
              </p>
            </div>
            {images.length > 0 && (
              <span className="text-xs font-medium text-slate-400">
                {images.length} image{images.length > 1 ? "s" : ""} added
              </span>
            )}
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-amber-500/60 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-amber-50/20 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                {isUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <UploadCloud className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  {isUploading ? "Uploading to store storage..." : "Click or drag images here to upload"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports JPG, PNG, WEBP, AVIF. Uploads directly to Medusa storage.
                </p>
              </div>
            </div>
          </div>

          {/* Image Previews Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {images.map((url, index) => (
                <div
                  key={url + index}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-white shadow">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage(index)
                    }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Published Toggle */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
          <div>
            <span className="font-semibold text-sm text-slate-900 block">
              Publish Product Immediately
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              When checked, this product is published to the default sales channel and is instantly visible to shoppers.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
          </label>
        </div>

        {/* Submit Bar */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            href="/products"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-md shadow-amber-500/20 disabled:opacity-60 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Product...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Publish Product</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
