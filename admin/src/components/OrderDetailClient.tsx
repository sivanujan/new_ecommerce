"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { updateOrderStatusAction } from "@/lib/actions"

export default function OrderDetailClient({ order }: { order: any }) {
  const currentStatus = order.metadata?.order_status || order.status || "Processing"
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    setMessage(null)
    try {
      const res = await updateOrderStatusAction(order.id, newStatus)
      if (res.error) {
        setMessage(res.error)
      } else {
        setStatus(newStatus)
        setMessage("Order status updated successfully!")
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (err: any) {
      setMessage(err?.message || "Failed to update status")
    } finally {
      setIsUpdating(false)
    }
  }

  const shipping = order.shipping_address || {}
  const customer = order.customer || {}
  const dateFormatted = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="space-y-6">
      {/* Top back navigation & status badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Orders</span>
        </Link>

        {/* Status update widget */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-600">Update Status:</span>
          <select
            value={status}
            disabled={isUpdating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-500"
          >
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-600" />}
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Grid: Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-mono">Order Identifier</span>
                <h2 className="text-lg font-bold text-slate-900 font-mono">
                  #{order.display_id || order.id}
                </h2>
              </div>
              <span className="text-xs text-slate-500">{dateFormatted}</span>
            </div>

            {/* Line Items */}
            <div className="divide-y divide-slate-100">
              {(order.items || []).map((item: any) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 text-sm block">
                        {item.title}
                      </span>
                      <span className="text-xs text-slate-400">
                        Qty: {item.quantity} × €{((item.unit_price || 0) / 1).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <span className="font-bold text-slate-900 text-sm">
                    €{((item.quantity || 1) * (item.unit_price || 0)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">
                  €{(order.item_subtotal || order.total || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Standard Express Shipping (France / EU)</span>
                <span className="font-semibold text-emerald-600">
                  {order.shipping_total ? `€${order.shipping_total.toFixed(2)}` : "Free"}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
                <span>Total Amount Paid (TVA Inclusive)</span>
                <span className="text-base text-amber-700">
                  €{(order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Customer & Shipping Information */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-amber-600" />
              <span>Customer Details</span>
            </h3>

            <div className="text-xs space-y-1.5 text-slate-600">
              <p className="font-semibold text-slate-800 text-sm">
                {shipping.first_name || customer.first_name
                  ? `${shipping.first_name || customer.first_name} ${shipping.last_name || customer.last_name || ""}`
                  : "Customer"}
              </p>
              <p className="font-mono text-slate-500">
                {customer.email || order.email || "No email"}
              </p>
              {shipping.phone && <p>Tel: {shipping.phone}</p>}
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-600" />
              <span>Shipping Address</span>
            </h3>

            <div className="text-xs text-slate-600 leading-relaxed">
              {shipping.address_1 ? (
                <>
                  <p>{shipping.address_1}</p>
                  {shipping.address_2 && <p>{shipping.address_2}</p>}
                  <p>
                    {shipping.postal_code} {shipping.city}
                  </p>
                  <p className="uppercase font-semibold text-slate-800 mt-1">
                    {shipping.country_code || "France"}
                  </p>
                </>
              ) : (
                <p className="text-slate-400 italic">No delivery address provided.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
