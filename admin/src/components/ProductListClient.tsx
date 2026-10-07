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
import { deleteProductAction } from "@/lib/actions"
import { useToast } from "@/components/ToastProvider"

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

  // Filter products
  const filteredProducts = products.filter((p) => {
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

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleDelete = async () => {
    if (!confirmDeleteProduct) return
    const id = confirmDeleteProduct.id
    const title = confirmDeleteProduct.title

    setDeletingId(id)
    try {
      const res = await deleteProductAction(id)
      if (res.error) {
        toast.error(res.error)
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        toast.success(`"${title}" has been deleted.`)
        setConfirmDeleteProduct(null)
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete product.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-[#121217] p-4 rounded-2xl border border-white/10 shadow-lg flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search products by name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-xs text-[#F5F0E8] placeholder:text-white/20 bg-[#181820] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
          />
        </div>

        {/* Filters and New Product Action */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3 py-2.5 rounded-xl border border-white/10 text-xs text-[#F5F0E8] bg-[#181820] focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">All Categories ({categories.length})</option>
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
            className="px-3 py-2.5 rounded-xl border border-white/10 text-xs text-[#F5F0E8] bg-[#181820] focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Live</option>
            <option value="draft">Hidden</option>
          </select>

          {/* Add Product Button */}
          <Link
            href="/products/new"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-[#E5C378] to-[#D4AF37] hover:brightness-110 shadow-md shadow-amber-950/30 transition-all active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5 text-neutral-950" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-[#121217] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#181820] border border-white/5 text-[#D4AF37] flex items-center justify-center mx-auto mb-3">
              <Package className="h-7 w-7" />
            </div>
            <p className="text-base font-serif font-bold text-[#F5F0E8]">
              No Creations Found
            </p>
            <p className="text-xs text-[#9CA3AF] mt-1 max-w-sm mx-auto">
              No products match your current filters. Add a new product or reset your search.
            </p>
            <Link
              href="/products/new"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-[#E5C378] hover:bg-[#D4AF37] transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add First Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181820] border-b border-white/5 text-[#9CA3AF] font-mono uppercase tracking-[0.15em] text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Piece</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price (EUR)</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedProducts.map((p) => {
                  const price = p.variants?.[0]?.prices?.[0]?.amount
                  const stock =
                    p.variants?.[0]?.metadata?.stock_quantity ??
                    p.variants?.[0]?.inventory_quantity ??
                    50
                  const thumbnail = p.thumbnail || p.images?.[0]?.url
                  const isLive = p.status === "published"
                  const categoryName = p.categories?.[0]?.name || "Unassigned"

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Thumbnail & Title */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-[#181820] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                            {thumbnail ? (
                              <img
                                src={thumbnail}
                                alt={p.title}
                                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-white/30" />
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/products/${p.id}/edit`}
                              className="font-serif font-bold text-sm text-[#F5F0E8] group-hover:text-[#E5C378] transition-colors block"
                            >
                              {p.title}
                            </Link>
                            <span className="text-[11px] text-[#9CA3AF]/60 font-mono">
                              /{p.handle}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#181820] border border-white/5 text-[#E5C378]">
                          {categoryName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-serif font-bold text-sm text-[#F5F0E8]">
                          {price !== undefined ? `€${Number(price).toFixed(2)}` : "—"}
                        </span>
                      </td>

                      {/* Stock Level Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                            stock > 5
                              ? "bg-emerald-950/30 text-emerald-400 border border-emerald-500/30"
                              : stock > 0
                              ? "bg-amber-950/30 text-amber-400 border border-amber-500/30"
                              : "bg-rose-950/30 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              stock > 5
                                ? "bg-emerald-400"
                                : stock > 0
                                ? "bg-amber-400 animate-pulse"
                                : "bg-rose-400"
                            }`}
                          />
                          <span>
                            {stock > 5
                              ? `${stock} in stock`
                              : stock > 0
                              ? `Low stock (${stock})`
                              : "Sold out"}
                          </span>
                        </span>
                      </td>

                      {/* Status (Live / Hidden) */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
                            isLive
                              ? "bg-[#D4AF37]/15 text-[#E5C378] border border-[#D4AF37]/40"
                              : "bg-white/5 text-[#9CA3AF] border border-white/10"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isLive ? "bg-[#D4AF37] animate-pulse" : "bg-white/30"
                            }`}
                          />
                          <span>{isLive ? "Live" : "Hidden"}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View in Storefront */}
                          <a
                            href={`http://localhost:8000/fr/products/${p.handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on Live Store"
                            className="p-2 rounded-xl text-white/40 hover:text-[#E5C378] hover:bg-white/5 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </a>

                          {/* Edit */}
                          <Link
                            href={`/products/${p.id}/edit`}
                            title="Edit Piece"
                            className="p-2 rounded-xl text-white/40 hover:text-[#E5C378] hover:bg-white/5 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteProduct(p)}
                            title="Delete Piece"
                            className="p-2 rounded-xl text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
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

        {/* Pagination Bar */}
        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between text-xs text-[#9CA3AF]">
            <span className="font-mono text-[11px]">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of{" "}
              {filteredProducts.length} items
            </span>

            <div className="flex items-center gap-2">
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
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
