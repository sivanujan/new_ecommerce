import Link from "next/link"
import Navbar from "@/components/Navbar"
import { listOrders } from "@/lib/medusa"
import { ShoppingBag, ArrowRight, Clock, User, CheckCircle2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  const orders = await listOrders()

  return (
    <div>
      <Navbar
        title="Orders"
        subtitle="Track customer purchases, fulfillment, and shipments"
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Orders Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
                When customers complete checkout on the live storefront (via Stripe or test checkout), orders will show up here immediately.
              </p>
              <a
                href="http://localhost:8000/fr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
              >
                <span>Visit Storefront & Test Checkout</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o: any) => {
                    const status = o.metadata?.order_status || o.status || "Processing"
                    const date = new Date(o.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })

                    return (
                      <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          #{o.display_id || o.id.slice(-6)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block">
                            {o.customer?.first_name
                              ? `${o.customer.first_name} ${o.customer.last_name || ""}`
                              : "Guest"}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            {o.customer?.email || o.email || "No email"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{date}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {o.items?.length || 1} item{(o.items?.length || 1) > 1 ? "s" : ""}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          €{(o.total || 0).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                              status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : status === "Shipped"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/orders/${o.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors"
                          >
                            <span>Details</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
