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
  ArrowLeft,
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Save,
  Image as ImageIcon,
  HelpCircle,
  Sliders,
} from "lucide-react"
import { createProductAction, updateProductAction, deleteProductAction } from "@/lib/actions"
import { useToast } from "@/components/ToastProvider"

interface ProductFormProps {
  product?: any // if editing
  categories: any[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEditing = Boolean(product?.id)

  // Initial values
  const defaultPrice = product?.variants?.[0]?.prices?.[0]?.amount
    ? (product.variants[0].prices[0].amount).toString()
    : "49.00"

  const defaultComparePrice = product?.variants?.[0]?.metadata?.compare_at_price
    ? product.variants[0].metadata.compare_at_price.toString()
    : ""

  const defaultStock = (
    product?.variants?.[0]?.metadata?.stock_quantity ??
    product?.variants?.[0]?.inventory_quantity ??
    50
  ).toString()

  const defaultImages: string[] = product?.images
    ? product.images.map((img: any) => img.url)
    : product?.thumbnail
    ? [product.thumbnail]
    : []

  // Options if any
  const existingOption = product?.options?.[0]
  const existingOptionTitle = existingOption?.title || "Option"
  const existingOptionValues = existingOption?.values?.map((v: any) => v.value) || []

  // State
  const [title, setTitle] = useState(product?.title || "")
  const [description, setDescription] = useState(product?.description || "")
  const [price, setPrice] = useState(defaultPrice)
  const [compareAtPrice, setCompareAtPrice] = useState(defaultComparePrice)
  const [categoryId, setCategoryId] = useState(
    product?.categories?.[0]?.id || (categories.length > 0 ? categories[0].id : "")
  )
  const [stock, setStock] = useState(defaultStock)
  const [isPublished, setIsPublished] = useState(
    isEditing ? product.status === "published" : true
  )
  const [images, setImages] = useState<string[]>(defaultImages)

  // Expandable options section
  const [showOptions, setShowOptions] = useState(existingOptionValues.length > 1)
  const [optionTitle, setOptionTitle] = useState(existingOptionTitle)
  const [optionValuesInput, setOptionValuesInput] = useState(
    existingOptionValues.length > 0 ? existingOptionValues.join(", ") : ""
  )

  // Status & loaders
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [createdProduct, setCreatedProduct] = useState<any | null>(null)
  const [dragActive, setDragActive] = useState(false)

  // Image Upload Handler
  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    setFormError(null)

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
        toast.success(`Successfully uploaded ${data.urls.length} image${data.urls.length > 1 ? "s" : ""}`)
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to upload images to Medusa storage."
      setFormError(msg)
      toast.error(msg)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Drag and drop events for file zone
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files)
    }
  }

  // Image reorder functions
  const moveImage = (index: number, direction: "left" | "right") => {
    const newImages = [...images]
    const targetIndex = direction === "left" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newImages.length) return
    const temp = newImages[index]
    newImages[index] = newImages[targetIndex]
    newImages[targetIndex] = temp
    setImages(newImages)
  }

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove))
  }

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!title.trim()) {
      setFormError("Please enter a product name.")
      return
    }

    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError("Please enter a valid price in EUR.")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.set("title", title.trim())
      formData.set("description", description.trim())
      formData.set("price", price)
      if (compareAtPrice.trim()) {
        formData.set("compareAtPrice", compareAtPrice.trim())
      }
      formData.set("categoryId", categoryId)
      formData.set("stock", stock)
      formData.set("isPublished", isPublished ? "true" : "false")
      formData.set("images", JSON.stringify(images))

      if (showOptions && optionValuesInput.trim()) {
        formData.set("optionTitle", optionTitle.trim() || "Option")
        const parsedVals = optionValuesInput
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
        formData.set("optionValues", JSON.stringify(parsedVals))
      }

      if (isEditing) {
        const res = await updateProductAction(product.id, formData)
        if (res.error) {
          setFormError(res.error)
          toast.error(res.error)
        } else {
          toast.success(`"${title}" saved successfully!`)
          router.push("/products")
          router.refresh()
        }
      } else {
        const res = await createProductAction(formData)
        if (res.error) {
          setFormError(res.error)
          toast.error(res.error)
        } else {
          toast.success(`"${title}" published to live store!`)
          setCreatedProduct(res.product)
        }
      }
    } catch (err: any) {
      const msg = err?.message || "Something went wrong saving the product."
      setFormError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete Action
  const handleDelete = async () => {
    if (!product?.id) return
    setIsDeleting(true)
    try {
      const res = await deleteProductAction(product.id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`"${product.title}" has been deleted.`)
        router.push("/products")
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete product.")
    } finally {
      setIsDeleting(false)
      setConfirmDeleteModal(false)
    }
  }

  // Success screen after new creation
  if (createdProduct) {
    const storefrontUrl = `http://localhost:8000/fr/products/${createdProduct.handle}`

    return (
      <div className="bg-[#121217] rounded-3xl border border-[#D4AF37]/30 shadow-2xl p-8 sm:p-12 text-center space-y-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="h-10 w-10 animate-pulse" />
        </div>

        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
            {createdProduct.status === "published" ? "Live on Storefront" : "Saved as Draft"}
          </span>
          <h2 className="font-serif font-bold text-3xl text-[#F5F0E8] mt-3">
            Product Successfully Created!
          </h2>
          <p className="text-sm text-[#9CA3AF] max-w-md mx-auto mt-2 leading-relaxed">
            "{createdProduct.title}" is configured with European pricing, automatic channel routing, and is immediately ready for customer orders.
          </p>
        </div>

        {/* Product preview card */}
        <div className="p-4 rounded-2xl bg-[#181820] border border-white/10 max-w-md mx-auto flex items-center gap-4 text-left">
          {createdProduct.thumbnail ? (
            <img
              src={createdProduct.thumbnail}
              alt=""
              className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-white/30">
              <Package className="h-6 w-6" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-sm text-[#F5F0E8] truncate">
              {createdProduct.title}
            </h4>
            <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">
              €{parseFloat(price).toFixed(2)} EUR
            </p>
            <p className="text-[11px] text-[#9CA3AF]">
              Stock: {stock} units
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={storefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#D4AF37] text-black font-semibold text-sm hover:bg-[#E5C158] transition-all shadow-lg shadow-[#D4AF37]/20"
          >
            <span>View Live on Storefront</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => {
              setCreatedProduct(null)
              setTitle("")
              setDescription("")
              setPrice("49.00")
              setCompareAtPrice("")
              setImages([])
              setShowOptions(false)
              setOptionValuesInput("")
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[#F5F0E8] font-medium text-sm hover:bg-white/10 transition-colors"
          >
            <Plus className="h-4 w-4 text-[#D4AF37]" />
            <span>Add Another Piece</span>
          </button>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-2xl text-xs font-medium text-[#9CA3AF] hover:text-[#F5F0E8] transition-colors"
          >
            Back to Products List
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top back bar & action heading */}
      <div className="flex items-center justify-between pb-2">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#9CA3AF] hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>

        {isEditing && (
          <div className="flex items-center gap-3">
            <a
              href={`http://localhost:8000/fr/products/${product.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline"
            >
              <span>View on Store</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setConfirmDeleteModal(true)}
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Piece</span>
            </button>
          </div>
        )}
      </div>

      {/* Error alert */}
      {formError && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold block">Please resolve the error:</span>
            <span>{formError}</span>
          </div>
        </div>
      )}

      {/* Main Grid: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Details & Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-[#121217] rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8] flex items-center gap-2">
                <Package className="h-5 w-5 text-[#D4AF37]" />
                <span>Product Information</span>
              </h3>
              <span className="text-xs text-[#9CA3AF]">Essential details</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                Product Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Celestial Diamond Necklace"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Handcrafted in 18k gold vermeil, featuring ethically sourced gemstones..."
                className="w-full px-4 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all leading-relaxed"
              />
              <p className="text-[11px] text-[#9CA3AF]/70 mt-1.5">
                Rich description displayed to luxury clients on the storefront.
              </p>
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="bg-[#121217] rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8] flex items-center gap-2">
                <span className="text-[#D4AF37] font-sans font-bold text-lg">€</span>
                <span>Pricing & Stock</span>
              </h3>
              <span className="text-xs text-[#9CA3AF]">Automatic EUR currency</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                  Selling Price (EUR) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#D4AF37] font-semibold">
                    €
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="89.00"
                    className="w-full pl-9 pr-4 py-3.5 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                  Compare-At Price (EUR){" "}
                  <span className="text-xs font-normal lowercase text-[#9CA3AF]/60">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF] font-semibold">
                    €
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="120.00"
                    className="w-full pl-9 pr-4 py-3.5 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#9CA3AF]/70 mt-1.5">
                  Displays crossed-out original price for sales & promotions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                  Stock Quantity (Available)
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="25"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all font-medium"
                />
                <p className="text-[11px] text-[#9CA3AF]/70 mt-1.5">
                  Number of pieces currently ready in studio.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">No Category (Unassigned)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#121217] text-[#F5F0E8]">
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#9CA3AF]/70 mt-1.5">
                  Organizes this piece in storefront collections.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Gallery & Image Upload Card */}
          <div className="bg-[#121217] rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8] flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#D4AF37]" />
                <span>Product Media & Gallery</span>
              </h3>
              <span className="text-xs text-[#9CA3AF]">
                {images.length} {images.length === 1 ? "image" : "images"} uploaded
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.01]"
                  : "border-white/15 bg-[#0D0D12]/60 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUploadFiles(e.target.files)}
              />

              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center mx-auto mb-3.5 shadow-sm">
                {isUploading ? (
                  <Loader2 className="h-7 w-7 animate-spin" />
                ) : (
                  <UploadCloud className="h-7 w-7" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#F5F0E8]">
                  {isUploading ? (
                    "Uploading to Medusa Storage..."
                  ) : (
                    <>
                      Click to upload or <span className="text-[#D4AF37]">drag and drop</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  High-res PNG, JPG, or WEBP jewelry photography (multi-file supported)
                </p>
              </div>
            </div>

            {/* Uploaded Images List with Reorder and Delete */}
            {images.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                  <span>First photo will be used as the primary catalog cover</span>
                  <span>Use arrows to reorder</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((url, index) => (
                    <div
                      key={url + index}
                      className="group relative rounded-2xl overflow-hidden bg-[#0D0D12] border border-white/10 aspect-square shadow-md"
                    >
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Main cover badge */}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider shadow">
                          Cover
                        </div>
                      )}

                      {/* Overlay controls */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeImage(index)
                            }}
                            className="p-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Reorder Arrows */}
                        <div className="flex items-center justify-between gap-1 bg-black/60 backdrop-blur-md rounded-xl p-1 border border-white/10">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={(e) => {
                              e.stopPropagation()
                              moveImage(index, "left")
                            }}
                            className="p-1 rounded-lg hover:bg-white/20 text-[#F5F0E8] disabled:opacity-20 disabled:hover:bg-transparent"
                            title="Move left"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="text-[10px] font-mono text-[#D4AF37]">
                            #{index + 1}
                          </span>
                          <button
                            type="button"
                            disabled={index === images.length - 1}
                            onClick={(e) => {
                              e.stopPropagation()
                              moveImage(index, "right")
                            }}
                            className="p-1 rounded-lg hover:bg-white/20 text-[#F5F0E8] disabled:opacity-20 disabled:hover:bg-transparent"
                            title="Move right"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Simple Options / Variations Section */}
          <div className="bg-[#121217] rounded-3xl p-6 sm:p-7 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F5F0E8] flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-[#D4AF37]" />
                  <span>Product Options</span>
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Optional customer choices like chain length, ring size, or metal finish.
                </p>
              </div>

              {!showOptions && (
                <button
                  type="button"
                  onClick={() => setShowOptions(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Options</span>
                </button>
              )}
            </div>

            {showOptions && (
              <div className="pt-2 border-t border-white/5 space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                      Option Name
                    </label>
                    <input
                      type="text"
                      value={optionTitle}
                      onChange={(e) => setOptionTitle(e.target.value)}
                      placeholder="e.g. Chain Length or Size"
                      className="w-full px-4 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                      Available Choices (comma separated)
                    </label>
                    <input
                      type="text"
                      value={optionValuesInput}
                      onChange={(e) => setOptionValuesInput(e.target.value)}
                      placeholder="e.g. 40 cm, 45 cm, 50 cm"
                      className="w-full px-4 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] pt-1">
                  <span>TamZen automatically generates individual choices for the client.</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOptions(false)
                      setOptionValuesInput("")
                    }}
                    className="text-rose-400 hover:underline"
                  >
                    Remove options
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Status, Visibility & Save Actions */}
        <div className="space-y-6">
          {/* Status & Visibility Card */}
          <div className="bg-[#121217] rounded-3xl p-6 sm:p-7 border border-white/10 space-y-6 shadow-xl sticky top-24">
            <div className="border-b border-white/5 pb-4">
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                Storefront Visibility
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Control whether customers can view & purchase this piece.
              </p>
            </div>

            {/* Live / Hidden Switch */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] block">
                Catalog Status
              </label>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0D0D12] border border-white/10">
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      isPublished
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isPublished ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                      }`}
                    />
                    {isPublished ? "Live on Store" : "Hidden Draft"}
                  </span>
                  <p className="text-[11px] text-[#9CA3AF] mt-1.5">
                    {isPublished
                      ? "Visible in store catalog & searchable."
                      : "Only visible to admin staff."}
                  </p>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => setIsPublished(!isPublished)}
                  className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${
                    isPublished ? "bg-[#D4AF37]" : "bg-white/10"
                  }`}
                  aria-pressed={isPublished}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black shadow-md transform transition-transform duration-200 ease-in-out ${
                      isPublished ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Behind the scenes automated guarantee badge */}
            <div className="p-4 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
                <Sparkles className="h-4 w-4" />
                <span>Zero-Configuration Sync</span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                When you save, TamZen automatically binds this piece to the active sales channel, configures EUR pricing, and synchronizes inventory so it appears immediately on the storefront.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold text-sm transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                    <span>Saving piece...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-black" />
                    <span>{isEditing ? "Save Changes" : "Publish Product"}</span>
                  </>
                )}
              </button>

              <Link
                href="/products"
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F5F0E8] font-medium text-xs transition-colors flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl max-w-sm w-full p-6 border border-white/10 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                Delete "{product?.title}"?
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                This will permanently delete this piece from the database and remove it from your live storefront.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
