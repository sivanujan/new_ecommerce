import Link from "next/link"
import Navbar from "@/components/Navbar"
import SalesChart from "@/components/SalesChart"
import { getDashboardStats } from "@/lib/medusa"
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  ArrowRight,
  Plus,
  ExternalLink,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Eye,
  Sliders,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div>
      <Navbar
        title="Boutique Dashboard"
        subtitle="Live performance metrics and management for TamZen jewelry atelier"
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Total Revenue This Month */}
          <div className="bg-[#121217] p-6 rounded-3xl border border-white/10 shadow-xl space-y-3 group hover:border-[#D4AF37]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Revenue This Month
              </span>
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <div className="pt-1">
              <div className="font-serif font-bold text-2xl text-[#F5F0E8]">
                €{(stats.monthlyRevenue || 0).toFixed(2)}
              </div>
              <p className="text-[11px] text-[#9CA3AF] mt-1 flex items-center gap-1.5">
                <span className="text-[#D4AF37] font-semibold">Total:</span>
                <span>€{(stats.totalRevenue || 0).toFixed(2)} all-time</span>
              </p>
            </div>
          </div>

          {/* 2. Orders */}
          <div className="bg-[#121217] p-6 rounded-3xl border border-white/10 shadow-xl space-y-3 group hover:border-[#D4AF37]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>

            <div className="pt-1 flex items-baseline justify-between">
              <div className="font-serif font-bold text-2xl text-[#F5F0E8]">
                {stats.totalOrders}
              </div>
              <Link
                href="/orders"
                className="text-xs font-medium text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* 3. Products */}
          <div className="bg-[#121217] p-6 rounded-3xl border border-white/10 shadow-xl space-y-3 group hover:border-[#D4AF37]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Live Catalog
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Package className="h-5 w-5" />
              </div>
            </div>

            <div className="pt-1 flex items-baseline justify-between">
              <div className="font-serif font-bold text-2xl text-[#F5F0E8]">
                {stats.totalProducts} <span className="text-sm font-sans font-normal text-[#9CA3AF]">pieces</span>
              </div>
              <Link
                href="/products"
                className="text-xs font-medium text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* 4. Customers */}
          <div className="bg-[#121217] p-6 rounded-3xl border border-white/10 shadow-xl space-y-3 group hover:border-[#D4AF37]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Collectors & Clients
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <div className="pt-1 flex items-baseline justify-between">
              <div className="font-serif font-bold text-2xl text-[#F5F0E8]">
                {stats.totalCustomers} <span className="text-sm font-sans font-normal text-[#9CA3AF]">clients</span>
              </div>
              <Link
                href="/customers"
                className="text-xs font-medium text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <span>Directory</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sales Chart Section */}
        <SalesChart data={stats.last30DaysSales} />

        {/* Two Columns: Recent Orders & Low Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders Table */}
          <div className="bg-[#121217] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F5F0E8] flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
                  <span>Recent Customer Orders</span>
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Latest customer purchases placed on storefront
                </p>
              </div>

              <Link
                href="/orders"
                className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <span>All Orders</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {stats.recentOrders.length === 0 ? (
              <div className="py-14 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#9CA3AF] flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6" />
                </div>
                <p className="text-xs text-[#9CA3AF]">
                  No recent orders recorded yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {stats.recentOrders.map((o: any) => {
                  const status = o.metadata?.order_status || o.fulfillment_status || "Processing"
                  const date = new Date(o.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })

                  return (
                    <div
                      key={o.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#F5F0E8] group-hover:text-[#D4AF37] transition-colors">
                            #{o.display_id || o.id.slice(-6)}
                          </span>
                          <span className="text-[11px] text-[#9CA3AF] font-mono">
                            • {date}
                          </span>
                        </div>
                        <p className="text-xs text-[#9CA3AF] truncate mt-0.5">
                          {o.customer?.first_name
                            ? `${o.customer.first_name} ${o.customer.last_name || ""}`
                            : "Guest Collector"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-serif font-bold text-xs text-[#D4AF37]">
                          €{(o.total || 0).toFixed(2)}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-[#9CA3AF] border border-white/10">
                          {status}
                        </span>

                        <Link
                          href={`/orders/${o.id}`}
                          className="p-1.5 rounded-lg border border-white/10 text-[#9CA3AF] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-colors"
                          title="View order"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Low-Stock Products List */}
          <div className="bg-[#121217] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F5F0E8] flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <span>Low-Stock Inventory</span>
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Pieces requiring atelier restocking soon
                </p>
              </div>

              <Link
                href="/products"
                className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <span>Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {stats.lowStockProducts.length === 0 ? (
              <div className="py-14 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-xs text-[#9CA3AF]">
                  All catalog pieces have ample stock inventory.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {stats.lowStockProducts.map((p: any) => {
                  const thumbnail = p.thumbnail || p.images?.[0]?.url
                  const stock = p.currentStock

                  return (
                    <div
                      key={p.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
                            <Package className="h-5 w-5" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <Link
                            href={`/products/${p.id}/edit`}
                            className="font-medium text-xs text-[#F5F0E8] hover:text-[#D4AF37] truncate block transition-colors"
                          >
                            {p.title}
                          </Link>
                          <span className="text-[11px] text-[#9CA3AF]/60 block truncate">
                            {p.categories?.[0]?.name || "Uncategorized"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            stock <= 5
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {stock === 0 ? "Out of Stock" : `${stock} left`}
                        </span>

                        <Link
                          href={`/products/${p.id}/edit`}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-medium text-[#F5F0E8] bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                        >
                          Restock
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Launch & Storefront Banner */}
        <div className="bg-gradient-to-r from-[#D4AF37]/15 via-[#D4AF37]/5 to-transparent p-6 sm:p-7 rounded-3xl border border-[#D4AF37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-black flex items-center justify-center font-bold shadow-lg shadow-[#D4AF37]/20 shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                Ready to introduce new jewelry creations?
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">
                Add luxury earrings, pendants, rings, and sets with automatic EUR pricing and immediate storefront synchronization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/products/new"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#E5C158] transition-all shadow-lg shadow-[#D4AF37]/20"
            >
              <Plus className="h-4 w-4 text-black" />
              <span>Add New Piece</span>
            </Link>

            <a
              href="http://localhost:8000/fr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <span>View Storefront</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
