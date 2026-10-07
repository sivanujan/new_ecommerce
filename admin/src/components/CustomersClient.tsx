"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  X,
  CreditCard,
  UserCheck,
  Package,
} from "lucide-react"

export default function CustomersClient({ initialCustomers }: { initialCustomers: any[] }) {
  const [customers, setCustomers] = useState(initialCustomers)
  const [search, setSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)

  const filtered = customers.filter((c) => {
    const name = `${c.first_name || ""} ${c.last_name || ""}`.toLowerCase()
    const email = (c.email || "").toLowerCase()
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#121217] border border-white/10 text-xs text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
          />
        </div>

        <div className="text-xs text-[#9CA3AF] font-mono">
          Total Collectors: <span className="text-[#D4AF37] font-bold">{customers.length}</span>
        </div>
      </div>

      {/* Customers Table Card */}
      <div className="bg-[#121217] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center mx-auto">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                {customers.length === 0 ? "No Collectors Registered Yet" : "No Collectors Found"}
              </h3>
              <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto mt-1 leading-relaxed">
                {customers.length === 0
                  ? "When customers create accounts or complete boutique purchases, their profiles, order histories, and lifetime spending will be organized here."
                  : "Try a different search query."}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181820] border-b border-white/5 text-[#9CA3AF] font-bold uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="py-4 px-6">Collector</th>
                  <th className="py-4 px-6">Contact Email</th>
                  <th className="py-4 px-6">Orders Count</th>
                  <th className="py-4 px-6">Total Spent</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((c) => {
                  const fullName = `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Collector"
                  const initial = (c.first_name?.[0] || c.email?.[0] || "C").toUpperCase()

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => setSelectedCustomer(c)}
                    >
                      {/* Avatar & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-[#181820] border border-white/10 text-[#D4AF37] font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#D4AF37]/50 transition-colors">
                            {initial}
                          </div>
                          <div>
                            <span className="font-medium text-sm text-[#F5F0E8] block group-hover:text-[#D4AF37] transition-colors">
                              {fullName}
                            </span>
                            <span className="text-[11px] text-[#9CA3AF]/60 block font-mono">
                              ID: {c.id.slice(-8)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 font-mono text-xs text-[#9CA3AF]">
                        {c.email}
                      </td>

                      {/* Orders Count */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 text-[#F5F0E8] border border-white/10">
                          <ShoppingBag className="h-3 w-3 text-[#D4AF37]" />
                          <span>{c.ordersCount} {c.ordersCount === 1 ? "Order" : "Orders"}</span>
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="py-4 px-6 font-serif font-bold text-sm text-[#D4AF37]">
                        €{(c.totalSpent || 0).toFixed(2)} EUR
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {c.isRegistered ? "Registered" : "Active Client"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCustomer(c)
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-[#D4AF37] hover:text-black border border-white/10 hover:border-transparent transition-all"
                        >
                          <span>View Profile</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail Modal / Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-serif font-bold text-lg flex items-center justify-center shrink-0">
                  {(selectedCustomer.first_name?.[0] || "C").toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#F5F0E8]">
                    {selectedCustomer.first_name} {selectedCustomer.last_name}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] font-mono">
                    Collector Account • {selectedCustomer.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#F5F0E8] hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  Lifetime Purchases
                </span>
                <p className="font-serif font-bold text-xl text-[#D4AF37]">
                  €{(selectedCustomer.totalSpent || 0).toFixed(2)} EUR
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  Total Orders
                </span>
                <p className="font-serif font-bold text-xl text-[#F5F0E8]">
                  {selectedCustomer.ordersCount} Completed
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#0D0D12] border border-white/10 text-xs">
              <h4 className="font-semibold text-xs text-[#F5F0E8] uppercase tracking-wider mb-2">
                Collector Information
              </h4>

              <div className="flex items-center gap-3 text-[#9CA3AF]">
                <Mail className="h-4 w-4 text-[#D4AF37]" />
                <span className="font-mono text-[#F5F0E8]">{selectedCustomer.email}</span>
              </div>

              {selectedCustomer.phone && (
                <div className="flex items-center gap-3 text-[#9CA3AF]">
                  <Phone className="h-4 w-4 text-[#D4AF37]" />
                  <span className="font-mono text-[#F5F0E8]">{selectedCustomer.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-[#9CA3AF]">
                <Calendar className="h-4 w-4 text-[#D4AF37]" />
                <span>
                  First interaction:{" "}
                  {new Date(selectedCustomer.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-base text-[#F5F0E8] flex items-center justify-between">
                <span>Purchase History</span>
                <span className="text-xs font-mono font-normal text-[#9CA3AF]">
                  {selectedCustomer.orders.length} transactions
                </span>
              </h4>

              {selectedCustomer.orders.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#0D0D12] border border-white/10 text-center text-xs text-[#9CA3AF]">
                  No order records attached yet.
                </div>
              ) : (
                <div className="divide-y divide-white/5 border border-white/10 rounded-2xl bg-[#0D0D12] overflow-hidden">
                  {selectedCustomer.orders.map((order: any) => {
                    const status = order.metadata?.order_status || order.fulfillment_status || "Processing"
                    const date = new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })

                    return (
                      <div
                        key={order.id}
                        className="p-3.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#F5F0E8]">
                              #{order.display_id || order.id.slice(-6)}
                            </span>
                            <span className="text-[11px] text-[#9CA3AF] font-mono">
                              • {date}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#9CA3AF] block mt-0.5">
                            {order.items?.length || 1} item{(order.items?.length || 1) > 1 ? "s" : ""} • Status: {status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-sm text-[#D4AF37]">
                            €{(order.total || 0).toFixed(2)}
                          </span>

                          <Link
                            href={`/orders/${order.id}`}
                            className="p-1.5 rounded-lg border border-white/10 text-[#9CA3AF] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-colors"
                            title="View Order"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F5F0E8] transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
