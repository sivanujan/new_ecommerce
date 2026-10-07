"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Package,
} from "lucide-react"

const ITEMS_PER_PAGE = 10

export default function OrdersListClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Status computation helper
  const getFulfillmentStatus = (order: any) => {
    return (
      order.metadata?.order_status ||
      order.fulfillment_status ||
      order.status ||
      "Processing"
    )
  }

  const getPaymentStatus = (order: any) => {
    return order.payment_status || "paid"
  }

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const fStatus = getFulfillmentStatus(o).toLowerCase()
    const matchesFilter =
      statusFilter === "all" ||
      (statusFilter === "processing" && (fStatus.includes("proc") || fStatus.includes("pending") || fStatus.includes("not_ful"))) ||
      (statusFilter === "shipped" && fStatus.includes("ship")) ||
      (statusFilter === "delivered" && (fStatus.includes("deliv") || fStatus.includes("complet"))) ||
      (statusFilter === "cancelled" && (fStatus.includes("cancel") || fStatus.includes("canc")));

    const customerName = `${o.customer?.first_name || ""} ${o.customer?.last_name || ""}`.toLowerCase()
    const customerEmail = (o.customer?.email || o.email || "").toLowerCase()
    const orderId = (o.display_id?.toString() || o.id || "").toLowerCase()

    const matchesSearch =
      customerName.includes(search.toLowerCase()) ||
      customerEmail.includes(search.toLowerCase()) ||
      orderId.includes(search.toLowerCase())

    return matchesFilter && matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
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
            placeholder="Search by order #, customer, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#121217] border border-white/10 text-xs text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Orders" },
            { id: "processing", label: "Processing" },
            { id: "shipped", label: "Shipped" },
            { id: "delivered", label: "Delivered" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id)
                setCurrentPage(1)
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? "bg-[#D4AF37] text-black font-semibold shadow-md shadow-[#D4AF37]/20"
                  : "bg-[#121217] text-[#9CA3AF] hover:text-[#F5F0E8] border border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-[#121217] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                {orders.length === 0 ? "No Customer Orders Yet" : "No Orders Found"}
              </h3>
              <p className="text-xs text-[#9CA3AF] max-w-sm mt-1 leading-relaxed">
                {orders.length === 0
                  ? "When clients purchase from your store, orders appear here immediately with real-time status and shipping details."
                  : "Try adjusting your search query or filter tab."}
              </p>
            </div>
            {orders.length === 0 && (
              <a
                href="http://localhost:8000/fr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D4AF37] text-black font-semibold text-xs hover:bg-[#E5C158] transition-all shadow-lg shadow-[#D4AF37]/20"
              >
                <span>Visit Storefront & Test Order</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181820] border-b border-white/5 text-[#9CA3AF] font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Total (EUR)</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Fulfillment</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedOrders.map((o) => {
                  const fStatus = getFulfillmentStatus(o)
                  const pStatus = getPaymentStatus(o)
                  const date = new Date(o.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })

                  const isDelivered =
                    fStatus.toLowerCase().includes("deliv") ||
                    fStatus.toLowerCase().includes("complet")
                  const isShipped = fStatus.toLowerCase().includes("ship")
                  const isCancelled = fStatus.toLowerCase().includes("cancel")

                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Order Number */}
                      <td className="py-4 px-6 font-mono font-bold text-sm text-[#F5F0E8] group-hover:text-[#D4AF37] transition-colors">
                        #{o.display_id || o.id.slice(-6)}
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-6">
                        <span className="font-semibold text-sm text-[#F5F0E8] block">
                          {o.customer?.first_name
                            ? `${o.customer.first_name} ${o.customer.last_name || ""}`
                            : "Guest Collector"}
                        </span>
                        <span className="text-[11px] text-[#9CA3AF]/70 block font-mono mt-0.5">
                          {o.customer?.email || o.email || "No email"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-[#9CA3AF] font-mono text-[11px]">
                        {date}
                      </td>

                      {/* Total */}
                      <td className="py-4 px-6 font-serif font-bold text-sm text-[#D4AF37]">
                        €{(o.total || 0).toFixed(2)}
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{pStatus}</span>
                        </span>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isDelivered
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : isShipped
                              ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                              : isCancelled
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {isDelivered ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : isShipped ? (
                            <Truck className="h-3 w-3" />
                          ) : isCancelled ? (
                            <XCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          <span>{fStatus}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/orders/${o.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-[#D4AF37] hover:text-black border border-white/10 hover:border-transparent transition-all shadow-sm"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Manage</span>
                        </Link>
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
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
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
    </div>
  )
}
