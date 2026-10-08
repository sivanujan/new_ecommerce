"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Package,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckSquare,
  X,
} from "lucide-react"
import {
  deleteProductAction,
  bulkDeleteProductsAction,
  bulkUpdateProductStatusAction,
} from "@/lib/admin/actions"
import { useToast } from "@/components/admin/ToastProvider"

const ITEMS_PER_PAGE = 8

export default function ProductListClient({
  initialProducts,
  categories,
}: {
  initialProducts: any[]
  categories: any[]
}) {
  const toast = useToast()
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<any | null>(null)

  // Filter and sort products (latest uploaded piece first)
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        selectedCategory === "all" ||
        p.categories?.some((c: any) => c.id === selectedCategory)

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "published" && p.status === "published") ||
        (selectedStatus === "draft" && p.status !== "published")

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
      return timeB - timeA
    })

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const isAllVisibleSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => selectedIds.includes(p.id))

  const isSomeVisibleSelected =
    paginatedProducts.some((p) => selectedIds.includes(p.id)) && !isAllVisibleSelected

  const toggleSelectAllVisible = () => {
    if (isAllVisibleSelected) {
      const pageIds = new Set(paginatedProducts.map((p) => p.id))
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)))
    } else {
      const pageIds = paginatedProducts.map((p) => p.id)
      const newSelected = new Set([...selectedIds, ...pageIds])
      setSelectedIds(Array.from(newSelected))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    setIsBulkDeleting(true)
    try {
      const count = selectedIds.length
      const res = await bulkDeleteProductsAction(selectedIds)
      if (res.error) {
        toast.error(res.error)
      } else {
        setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)))
        setSelectedIds([])
        setShowBulkDeleteModal(false)
        toast.success(`Deleted ${count} ${count === 1 ? "piece" : "pieces"}.`)
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete pieces")
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const handleBulkStatus = async (isPublished: boolean) => {
    if (selectedIds.length === 0) return
    setIsBulkUpdating(true)
    try {
      const count = selectedIds.length
      const targetStatus = isPublished ? "published" : "draft"
      const res = await bulkUpdateProductStatusAction(selectedIds, isPublished)
      if (res.error) {
        toast.error(res.error)
      } else {
        setProducts((prev) =>
          prev.map((p) =>
            selectedIds.includes(p.id) ? { ...p, status: targetStatus } : p
          )
        )
        toast.success(
          `Updated ${count} ${count === 1 ? "piece" : "pieces"} to ${
            isPublished ? "Live on Store" : "Hidden Draft"
          }.`
        )
        setSelectedIds([])
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update piece status")
    } finally {
      setIsBulkUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDeleteProduct) return
    const id = confirmDeleteProduct.id
    setDeletingId(id)

    try {
      const res = await deleteProductAction(id)
      if (res.error) {
        toast.error(res.error)
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        toast.success(`"${confirmDeleteProduct.title}" has been deleted`)
        setConfirmDeleteProduct(null)
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete product")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search jewelry by name or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#121217] border border-white/10 text-xs text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
          />
        </div>

        {/* Filters and Add button */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-[#121217] border border-white/10 text-xs text-[#F5F0E8] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none cursor-pointer"
          >
            <option value="all">All Collections</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-[#121217] border border-white/10 text-xs text-[#F5F0E8] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="published">Live on Store</option>
            <option value="draft">Hidden Drafts</option>
          </select>

          {/* Add Product Button */}
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold text-xs whitespace-nowrap transition-all shadow-lg shadow-[#D4AF37]/20"
          >
            <Plus className="h-4 w-4 text-black" />
            <span>Add Piece</span>
          </Link>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-[#121217] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                {products.length === 0 ? "No Products in Catalog" : "No Pieces Found"}
              </h3>
              <p className="text-xs text-[#9CA3AF] max-w-sm mt-1 leading-relaxed">
                {products.length === 0
                  ? "Start building your TamZen atelier collection. Products you add appear immediately on your live storefront."
                  : "Try clearing your filters or search keywords."}
              </p>
            </div>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D4AF37] text-black font-semibold text-xs hover:bg-[#E5C158] transition-all shadow-lg shadow-[#D4AF37]/20"
            >
              <Plus className="h-4 w-4 text-black" />
              <span>Add Your First Piece</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-transparent">
              <thead className="bg-[#181820] border-b border-white/5 text-[#9CA3AF] font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="py-4 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllVisibleSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeVisibleSelected
                      }}
                      onChange={toggleSelectAllVisible}
                      className="w-4 h-4 rounded border-white/20 bg-[#181820] text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37] cursor-pointer transition-all"
                      title={isAllVisibleSelected ? "Deselect page" : "Select all visible pieces"}
                    />
                  </th>
                  <th className="py-4 px-6">Piece & Details</th>
                  <th className="py-4 px-6">Collection</th>
                  <th className="py-4 px-6">Price (EUR)</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {paginatedProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id)
                  // Prioritize the latest uploaded image as thumbnail
                  const latestImg = p.images && p.images.length > 0
                    ? [...p.images].sort((a: any, b: any) => {
                        const tA = a.created_at ? new Date(a.created_at).getTime() : 0
                        const tB = b.created_at ? new Date(b.created_at).getTime() : 0
                        return tB - tA
                      })[0]?.url
                    : null
                  const thumbnail = latestImg || p.thumbnail || p.images?.[0]?.url
                  const price = p.variants?.[0]?.prices?.[0]?.amount
                  const stock =
                    p.variants?.[0]?.metadata?.stock_quantity ??
                    p.variants?.[0]?.inventory_quantity ??
                    "—"
                  const isLive = p.status === "published"
                  const categoryName = p.categories?.[0]?.name || "Uncategorized"

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors group bg-transparent ${
                        isSelected
                          ? "bg-[#D4AF37]/[0.08] hover:bg-[#D4AF37]/[0.12]"
                          : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(p.id)}
                          className="w-4 h-4 rounded border-white/20 bg-[#181820] text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37] cursor-pointer transition-all"
                        />
                      </td>
                      {/* Thumbnail & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-xl bg-[#0D0D12] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                            {thumbnail ? (
                              <img
                                src={thumbnail}
                                alt={p.title}
                                className="w-12 h-12 max-w-[48px] max-h-[48px] object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl shrink-0"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-white/30" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              className="font-medium text-sm text-[#F5F0E8] group-hover:text-[#D4AF37] transition-colors truncate block"
                            >
                              {p.title}
                            </Link>
                            <span className="text-[11px] text-[#9CA3AF]/60 block font-mono mt-0.5">
                              /{p.handle}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Collection */}
                      <td className="py-4 px-6 text-[#9CA3AF] text-xs">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[#F5F0E8]">
                          {categoryName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6">
                        <span className="font-serif font-bold text-sm text-[#D4AF37]">
                          {price !== undefined ? `€${Number(price).toFixed(2)}` : "—"}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] block font-mono">
                          EUR
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            Number(stock) <= 5
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : Number(stock) <= 15
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-white/5 text-[#F5F0E8] border border-white/10"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              Number(stock) <= 5
                                ? "bg-rose-400"
                                : Number(stock) <= 15
                                ? "bg-amber-400"
                                : "bg-emerald-400"
                            }`}
                          />
                          {stock} in studio
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isLive
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                            }`}
                          />
                          {isLive ? "Live on Store" : "Hidden Draft"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Live preview */}
                          <a
                            href={`/fr/products/${p.handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl border border-white/10 text-[#9CA3AF] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 bg-white/5 hover:bg-[#D4AF37]/10 transition-colors"
                            title="View on live storefront"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>

                          {/* Edit button */}
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-2 rounded-xl border border-white/10 text-[#9CA3AF] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 bg-white/5 hover:bg-[#D4AF37]/10 transition-colors"
                            title="Edit Piece"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Link>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteProduct(p)}
                            className="p-2 rounded-xl border border-rose-500/20 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 bg-rose-500/10 transition-colors"
                            title="Delete Piece"
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="py-4 px-6 border-t border-white/5 flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of{" "}
              {filteredProducts.length} pieces
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg border border-white/10 hover:border-[#D4AF37]/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="font-mono text-xs px-2 text-[#F5F0E8]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-1.5 rounded-lg border border-white/10 hover:border-[#D4AF37]/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl max-w-sm w-full p-6 border border-white/10 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                Delete "{confirmDeleteProduct.title}"?
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                This will remove the piece from your active catalog and the live storefront. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteProduct(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId === confirmDeleteProduct.id}
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {deletingId === confirmDeleteProduct.id && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#14141B]/95 backdrop-blur-xl border border-[#D4AF37]/40 shadow-2xl shadow-black/90 rounded-2xl px-5 py-3.5 flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap justify-center transition-all animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-semibold text-xs whitespace-nowrap">
              {selectedIds.length} {selectedIds.length === 1 ? "piece" : "pieces"} selected
            </span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Select/Deselect visible */}
            <button
              type="button"
              onClick={() => {
                if (isAllVisibleSelected) {
                  setSelectedIds([])
                } else {
                  const visibleIds = paginatedProducts.map((p) => p.id)
                  setSelectedIds(Array.from(new Set([...selectedIds, ...visibleIds])))
                }
              }}
              className="text-xs text-[#9CA3AF] hover:text-[#F5F0E8] px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              {isAllVisibleSelected ? "Deselect Page" : "Select Page"}
            </button>

            {/* Bulk Publish */}
            <button
              type="button"
              disabled={isBulkUpdating}
              onClick={() => handleBulkStatus(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all whitespace-nowrap disabled:opacity-50"
              title="Publish selected pieces to live store"
            >
              {isBulkUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              <span>Publish</span>
            </button>

            {/* Bulk Draft */}
            <button
              type="button"
              disabled={isBulkUpdating}
              onClick={() => handleBulkStatus(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/90 hover:bg-amber-600 text-white font-semibold text-xs shadow-md shadow-amber-600/20 transition-all whitespace-nowrap disabled:opacity-50"
              title="Set selected pieces as draft"
            >
              {isBulkUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <EyeOff className="h-3.5 w-3.5" />
              )}
              <span>Set as Draft</span>
            </button>

            {/* Bulk Delete */}
            <button
              type="button"
              onClick={() => setShowBulkDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition-all whitespace-nowrap"
              title="Delete selected pieces"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete ({selectedIds.length})</span>
            </button>

            {/* Deselect */}
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#F5F0E8] hover:bg-white/5 transition-colors"
              title="Clear all selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl max-w-md w-full p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl text-[#F5F0E8]">
                Delete {selectedIds.length} {selectedIds.length === 1 ? "Piece" : "Pieces"}?
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">
                This will permanently remove the selected {selectedIds.length} {selectedIds.length === 1 ? "piece" : "pieces"} from your active catalog and the live storefront. This action cannot be undone.
              </p>
            </div>

            {/* Preview of items to delete */}
            <div className="bg-[#0D0D12] rounded-2xl p-3 border border-white/5 max-h-44 overflow-y-auto text-left space-y-2">
              {products
                .filter((p) => selectedIds.includes(p.id))
                .map((p) => {
                  const thumbnail = p.thumbnail || p.images?.[0]?.url
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#181820] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-3.5 w-3.5 text-white/30" />
                          )}
                        </div>
                        <span className="font-medium text-[#F5F0E8] truncate">
                          {p.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#9CA3AF] font-mono shrink-0 pl-2">
                        /{p.handle}
                      </span>
                    </div>
                  )
                })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isBulkDeleting}
                onClick={() => setShowBulkDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isBulkDeleting}
                onClick={handleBulkDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isBulkDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Confirm Delete ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
