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
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { deleteProductAction } from "@/lib/admin/actions"
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
                      className="hover:bg-white/[0.04] transition-colors group bg-transparent"
                    >
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
    </div>
  )
}
