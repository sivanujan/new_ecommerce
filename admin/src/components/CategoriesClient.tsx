"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  FolderTree,
  Plus,
  Trash2,
  Edit,
  Loader2,
  X,
  Layers,
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Search,
  Package,
} from "lucide-react"
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/lib/actions"
import { useToast } from "@/components/ToastProvider"

export default function CategoriesClient({
  initialCategories,
}: {
  initialCategories: any[]
}) {
  const router = useRouter()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [categories, setCategories] = useState(initialCategories)
  const [search, setSearch] = useState("")

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState<any | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Filter categories
  const filteredCategories = categories.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase())
    )
  })

  // Open Edit Modal
  const openEditModal = (cat: any) => {
    setEditingCategory(cat)
    setName(cat.name)
    setDescription(cat.description || "")
    setImageUrl(cat.metadata?.image_url || "")
    setFormError(null)
  }

  // Open Add Modal
  const openAddModal = () => {
    setName("")
    setDescription("")
    setImageUrl("")
    setFormError(null)
    setShowAddModal(true)
  }

  // Image Upload Handler
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    setFormError(null)

    try {
      const formData = new FormData()
      formData.append("files", files[0])

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || "Failed to upload image")

      if (data.urls && data.urls.length > 0) {
        setImageUrl(data.urls[0])
        toast.success("Category banner uploaded successfully")
      }
    } catch (err: any) {
      setFormError(err?.message || "Failed to upload image.")
      toast.error(err?.message || "Failed to upload image.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Handle Create Category
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!name.trim()) {
      setFormError("Category name is required.")
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.set("name", name.trim())
      formData.set("description", description.trim())
      if (imageUrl.trim()) {
        formData.set("imageUrl", imageUrl.trim())
      }

      const res = await createCategoryAction(formData)
      if (res.error) {
        setFormError(res.error)
        toast.error(res.error)
      } else {
        toast.success(`Category "${name}" created successfully!`)
        setShowAddModal(false)
        router.refresh()
      }
    } catch (err: any) {
      setFormError(err?.message || "Failed to create category.")
      toast.error(err?.message || "Failed to create category.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Update Category
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    setFormError(null)

    if (!name.trim()) {
      setFormError("Category name is required.")
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.set("name", name.trim())
      formData.set("description", description.trim())
      formData.set("imageUrl", imageUrl.trim())

      const res = await updateCategoryAction(editingCategory.id, formData)
      if (res.error) {
        setFormError(res.error)
        toast.error(res.error)
      } else {
        toast.success(`Category "${name}" updated successfully!`)
        setEditingCategory(null)
        router.refresh()
      }
    } catch (err: any) {
      setFormError(err?.message || "Failed to update category.")
      toast.error(err?.message || "Failed to update category.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete Category
  const handleDelete = async () => {
    if (!confirmDeleteCategory) return
    setIsDeleting(true)
    try {
      const res = await deleteCategoryAction(confirmDeleteCategory.id)
      if (res.error) {
        toast.error(res.error)
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== confirmDeleteCategory.id))
        toast.success(`Category "${confirmDeleteCategory.name}" deleted.`)
        setConfirmDeleteCategory(null)
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete category.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#121217] border border-white/10 text-xs text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
          />
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold text-xs transition-all shadow-lg shadow-[#D4AF37]/20"
        >
          <Plus className="h-4 w-4 text-black" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Luxury Table Card */}
      <div className="bg-[#121217] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {filteredCategories.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center mx-auto">
              <FolderTree className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                No categories found
              </h3>
              <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto mt-1 leading-relaxed">
                Organize your luxury rings, necklaces, bracelets, and earrings into dedicated collections.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black font-semibold text-xs hover:bg-[#E5C158] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create First Category</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181820] border-b border-white/5 text-[#9CA3AF] font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="py-4 px-6">Collection</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Pieces Assigned</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCategories.map((c) => {
                  const bannerImg = c.metadata?.image_url

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Name & Banner */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          {bannerImg ? (
                            <img
                              src={bannerImg}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#181820] border border-white/10 flex items-center justify-center text-[#D4AF37] font-serif font-bold text-base flex-shrink-0 shadow-inner">
                              {c.name.slice(0, 1)}
                            </div>
                          )}

                          <div>
                            <span className="font-serif font-semibold text-sm text-[#F5F0E8] block group-hover:text-[#D4AF37] transition-colors">
                              {c.name}
                            </span>
                            <span className="font-mono text-[11px] text-[#9CA3AF]/60 block mt-0.5">
                              /{c.handle}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-6 text-[#9CA3AF] max-w-xs truncate text-xs">
                        {c.description || (
                          <span className="text-white/20 italic">No description</span>
                        )}
                      </td>

                      {/* Product Counts */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                          <Package className="h-3 w-3" />
                          <span>{c.productCount ?? 0} {c.productCount === 1 ? "Piece" : "Pieces"}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(c)}
                            className="p-2 rounded-xl border border-white/10 text-[#9CA3AF] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 bg-white/5 hover:bg-[#D4AF37]/10 transition-colors"
                            title="Edit Category"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setConfirmDeleteCategory(c)}
                            className="p-2 rounded-xl border border-rose-500/20 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 bg-rose-500/10 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {(showAddModal || editingCategory) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                  <FolderTree className="h-4 w-4" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                  {editingCategory ? `Edit Category` : "Create New Category"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false)
                  setEditingCategory(null)
                }}
                className="p-1 rounded-xl text-[#9CA3AF] hover:text-[#F5F0E8] hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form
              onSubmit={editingCategory ? handleUpdate : handleCreate}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                  Category Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fine Necklaces, Rings, Bridal"
                  className="w-full px-4 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                  Description <span className="text-xs font-normal lowercase text-[#9CA3AF]/60">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Artisan hand-finished fine jewelry crafted for timeless beauty..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all leading-relaxed"
                />
              </div>

              {/* Optional Category Image Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                  Category Banner Image <span className="text-xs font-normal lowercase text-[#9CA3AF]/60">(optional)</span>
                </label>

                {imageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0D0D12] aspect-video max-h-36 group">
                    <img
                      src={imageUrl}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-white/15 rounded-2xl p-5 text-center cursor-pointer hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all bg-[#0D0D12]"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files)}
                    />
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center mx-auto mb-2">
                      {isUploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <UploadCloud className="h-5 w-5" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-[#F5F0E8]">
                      {isUploading ? "Uploading banner..." : "Upload category banner"}
                    </p>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                      PNG, JPG, or WEBP banner for collection showcases
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingCategory(null)
                  }}
                  className="flex-1 py-3 rounded-2xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="flex-1 py-3 rounded-2xl text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#E5C158] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin text-black" />}
                  <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteCategory && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl max-w-sm w-full p-6 border border-white/10 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                Delete "{confirmDeleteCategory.name}"?
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                This will remove the category from your store navigation. Products assigned to this category will not be deleted.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteCategory(null)}
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
    </div>
  )
}
