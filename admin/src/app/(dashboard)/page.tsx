import Link from "next/link"
import Navbar from "@/components/Navbar"
import { getDashboardStats } from "@/lib/medusa"
import {
  Package,
  ShoppingBag,
  TrendingUp,
  FolderTree,
  ArrowRight,
  Plus,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div>
      <Navbar
        title="Dashboard Overview"
        subtitle="Welcome back! Here is a summary of your TamZen boutique."
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Products */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Products
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {stats.totalProducts}
              </span>
              <Link
                href="/products"
                className="text-xs font-medium text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {stats.totalOrders}
              </span>
              <Link
                href="/orders"
                className="text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Store Revenue
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">
                €{(stats.totalRevenue).toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">EUR</span>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Categories
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <FolderTree className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">
                {stats.totalCategories}
              </span>
              <Link
                href="/categories"
                className="text-xs font-medium text-purple-700 hover:text-purple-800 hover:underline flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions Band */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-2xl border border-amber-200/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Need to add new creations or update collections?
              </h3>
              <p className="text-xs text-slate-600">
                Products added here are immediately live and purchasable on the TamZen storefront.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/products/new"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-600/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </Link>
            <a
              href="http://localhost:8000/fr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
            >
              <span>View Storefront</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Two Column Section: Recent Products & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Catalog Items */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Recent Catalog Products
                </h3>
                <p className="text-xs text-slate-500">
                  Quick view of items currently in your catalog
                </p>
              </div>
              <Link
                href="/products"
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {stats.recentProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No products yet. Click "Add Product" to create your first item.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {stats.recentProducts.map((product: any) => {
                  const price = product.variants?.[0]?.prices?.[0]?.amount
                  const thumbnail = product.thumbnail || product.images?.[0]?.url

                  return (
                    <div
                      key={product.id}
                      className="py-3.5 flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Package className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="font-semibold text-xs text-slate-800 hover:text-amber-700 transition-colors truncate block"
                          >
                            {product.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 capitalize block">
                            {product.categories?.[0]?.name || "Uncategorized"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-semibold text-xs text-slate-900">
                          {price !== undefined ? `€${price.toFixed(2)}` : "—"}
                        </span>
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Recent Customer Orders
                </h3>
                <p className="text-xs text-slate-500">
                  Latest transactions placed through checkout
                </p>
              </div>
              <Link
                href="/orders"
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {stats.recentOrders.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Clock className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-slate-700">No Orders Yet</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  When customers purchase jewelry on your live storefront, orders will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {stats.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-semibold text-xs text-slate-800 hover:text-amber-700 transition-colors block"
                      >
                        Order #{order.display_id || order.id.slice(-6)}
                      </Link>
                      <span className="text-[11px] text-slate-400 block">
                        {order.customer?.email || "Guest Customer"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-xs text-slate-900">
                        €{(order.total || 0).toFixed(2)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">
                        {order.status || "Completed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
