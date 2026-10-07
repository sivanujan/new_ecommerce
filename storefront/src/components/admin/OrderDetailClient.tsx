"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  Hash,
  Copy,
  ExternalLink,
  ShieldCheck,
  Send,
  Ban,
} from "lucide-react"
import { updateOrderStatusAction } from "@/lib/admin/actions"
import { useToast } from "@/components/admin/ToastProvider"

export default function OrderDetailClient({ order }: { order: any }) {
  const router = useRouter()
  const toast = useToast()

  const currentStatus =
    order.metadata?.order_status ||
    order.fulfillment_status ||
    order.status ||
    "Processing"

  const [status, setStatus] = useState(currentStatus)
  const [trackingNumber, setTrackingNumber] = useState(
    order.metadata?.tracking_number || ""
  )
  const [isUpdating, setIsUpdating] = useState(false)

  // Modals for actions
  const [showShipModal, setShowShipModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [shipTrackingInput, setShipTrackingInput] = useState(trackingNumber)

  const handleUpdateStatus = async (newStatus: string, trackNum?: string) => {
    setIsUpdating(true)
    try {
      const res = await updateOrderStatusAction(order.id, newStatus, trackNum)
      if (res.error) {
        toast.error(res.error)
      } else {
        setStatus(newStatus)
        if (trackNum !== undefined) {
          setTrackingNumber(trackNum)
        }
        toast.success(`Order marked as "${newStatus}"!`)
        setShowShipModal(false)
        setShowCancelModal(false)
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update order status")
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

  const isDelivered =
    status.toLowerCase().includes("deliv") ||
    status.toLowerCase().includes("complet")
  const isShipped = status.toLowerCase().includes("ship")
  const isCancelled = status.toLowerCase().includes("cancel")

  // Copy tracking helper
  const copyTracking = () => {
    if (!trackingNumber) return
    navigator.clipboard.writeText(trackingNumber)
    toast.success("Tracking number copied to clipboard!")
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#9CA3AF] hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Orders</span>
        </Link>

        {/* Action Buttons: Mark as Shipped, Mark as Delivered, Cancel */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mark as Shipped Button */}
          {!isShipped && !isDelivered && !isCancelled && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => setShowShipModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#E5C158] transition-all shadow-md shadow-[#D4AF37]/20 disabled:opacity-50"
            >
              <Truck className="h-4 w-4 text-black" />
              <span>Mark as Shipped</span>
            </button>
          )}

          {/* Mark as Delivered Button */}
          {isShipped && !isDelivered && !isCancelled && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleUpdateStatus("Delivered")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark as Delivered</span>
            </button>
          )}

          {/* Cancel Order Button */}
          {!isCancelled && !isDelivered && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => setShowCancelModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors disabled:opacity-50"
            >
              <Ban className="h-3.5 w-3.5" />
              <span>Cancel Order</span>
            </button>
          )}

          {/* Re-open / Mark as Processing if cancelled */}
          {isCancelled && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleUpdateStatus("Processing")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Clock className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Reactivate Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Order Overview Card */}
      <div className="bg-[#121217] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif font-bold text-2xl text-[#F5F0E8]">
              Order #{order.display_id || order.id.slice(-8)}
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
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
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : isShipped ? (
                <Truck className="h-3.5 w-3.5" />
              ) : isCancelled ? (
                <XCircle className="h-3.5 w-3.5" />
              ) : (
                <Clock className="h-3.5 w-3.5" />
              )}
              <span>{status}</span>
            </span>
          </div>

          <p className="text-xs text-[#9CA3AF] mt-1.5 font-mono">
            Placed on {dateFormatted} via TamZen Online Boutique
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs uppercase tracking-wider text-[#9CA3AF] block font-semibold">
            Order Total
          </span>
          <span className="font-serif font-bold text-2xl text-[#D4AF37] block mt-0.5">
            €{(order.total || 0).toFixed(2)} EUR
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Payment Verified</span>
          </span>
        </div>
      </div>

      {/* Grid: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Items & Shipment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Card */}
          <div className="bg-[#121217] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8] flex items-center gap-2">
                <Package className="h-5 w-5 text-[#D4AF37]" />
                <span>Purchased Jewelry</span>
              </h3>
              <span className="text-xs text-[#9CA3AF]">
                {order.items?.length || 0} {(order.items?.length || 0) === 1 ? "piece" : "pieces"}
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {(order.items || []).map((item: any) => {
                const itemImg = item.thumbnail
                const unitPrice = item.unit_price ? (item.unit_price).toFixed(2) : "0.00"
                const itemTotal = item.total ? (item.total).toFixed(2) : (item.unit_price * (item.quantity || 1)).toFixed(2)

                return (
                  <div
                    key={item.id}
                    className="py-4 first:pt-0 last:pb-0 flex items-center gap-4"
                  >
                    {itemImg ? (
                      <img
                        src={itemImg}
                        alt=""
                        className="w-16 h-16 rounded-2xl object-cover border border-white/10 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 flex-shrink-0">
                        <Package className="h-7 w-7" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-[#F5F0E8] truncate">
                        {item.title}
                      </h4>
                      {item.variant_title && (
                        <p className="text-xs text-[#9CA3AF] mt-0.5">
                          Option: <span className="text-[#D4AF37]">{item.variant_title}</span>
                        </p>
                      )}
                      <p className="text-xs text-[#9CA3AF]/60 font-mono mt-1">
                        Qty: {item.quantity || 1} × €{unitPrice}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-serif font-bold text-sm text-[#F5F0E8]">
                        €{itemTotal}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Shipment & Tracking Card */}
          {trackingNumber && (
            <div className="bg-[#121217] rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-7 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#D4AF37]" />
                  <h4 className="font-serif font-bold text-base text-[#F5F0E8]">
                    Tracking Information
                  </h4>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                  Shipped
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0D0D12] border border-white/10">
                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-[#9CA3AF]" />
                  <span className="font-mono text-sm text-[#F5F0E8] font-bold">
                    {trackingNumber}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={copyTracking}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#F5F0E8] transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Customer, Shipping Address, Payment Breakdown */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-[#121217] rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <User className="h-4 w-4 text-[#D4AF37]" />
              <h4 className="font-serif font-bold text-base text-[#F5F0E8]">
                Collector Details
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#9CA3AF] block text-[11px] uppercase tracking-wider font-semibold">
                  Full Name
                </span>
                <span className="font-medium text-sm text-[#F5F0E8]">
                  {customer.first_name
                    ? `${customer.first_name} ${customer.last_name || ""}`
                    : shipping.first_name
                    ? `${shipping.first_name} ${shipping.last_name || ""}`
                    : "Guest Collector"}
                </span>
              </div>

              <div>
                <span className="text-[#9CA3AF] block text-[11px] uppercase tracking-wider font-semibold">
                  Email
                </span>
                <a
                  href={`mailto:${customer.email || order.email}`}
                  className="font-mono text-xs text-[#D4AF37] hover:underline"
                >
                  {customer.email || order.email || "No email provided"}
                </a>
              </div>

              {shipping.phone && (
                <div>
                  <span className="text-[#9CA3AF] block text-[11px] uppercase tracking-wider font-semibold">
                    Phone
                  </span>
                  <span className="font-mono text-xs text-[#F5F0E8]">
                    {shipping.phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-[#121217] rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <MapPin className="h-4 w-4 text-[#D4AF37]" />
              <h4 className="font-serif font-bold text-base text-[#F5F0E8]">
                Shipping Address
              </h4>
            </div>

            <div className="text-xs text-[#F5F0E8] space-y-1 leading-relaxed">
              <p className="font-semibold">
                {shipping.first_name} {shipping.last_name}
              </p>
              <p className="text-[#9CA3AF]">{shipping.address_1}</p>
              {shipping.address_2 && (
                <p className="text-[#9CA3AF]">{shipping.address_2}</p>
              )}
              <p className="text-[#9CA3AF]">
                {shipping.postal_code} {shipping.city}
              </p>
              <p className="font-semibold uppercase tracking-wider text-[#D4AF37]">
                {shipping.country_code}
              </p>
            </div>
          </div>

          {/* Payment & Financial Breakdown Card */}
          <div className="bg-[#121217] rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <CreditCard className="h-4 w-4 text-[#D4AF37]" />
              <h4 className="font-serif font-bold text-base text-[#F5F0E8]">
                Payment Summary
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Items Subtotal</span>
                <span className="text-[#F5F0E8] font-mono">
                  €{(order.item_subtotal || order.subtotal || order.total || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-[#9CA3AF]">
                <span>Insured Luxury Shipping</span>
                <span className="text-emerald-400 font-medium">Free</span>
              </div>

              <div className="flex justify-between text-[#9CA3AF]">
                <span>Applicable VAT</span>
                <span className="text-[#F5F0E8] font-mono">Included</span>
              </div>

              <div className="pt-2 border-t border-white/5 flex justify-between items-baseline font-bold">
                <span className="text-xs text-[#F5F0E8]">Total</span>
                <span className="font-serif text-lg text-[#D4AF37]">
                  €{(order.total || 0).toFixed(2)} EUR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mark as Shipped Modal */}
      {showShipModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl max-w-md w-full p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
              <Truck className="h-6 w-6" />
            </div>

            <div className="text-center">
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                Ship Order #{order.display_id || order.id.slice(-6)}
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                Add an optional carrier tracking number for the customer package.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Tracking Number <span className="text-xs font-normal lowercase text-[#9CA3AF]/60">(optional)</span>
              </label>
              <input
                type="text"
                value={shipTrackingInput}
                onChange={(e) => setShipTrackingInput(e.target.value)}
                placeholder="e.g. DHL-984729103 or LP-82739182FR"
                className="w-full px-4 py-3 rounded-2xl bg-[#0D0D12] border border-white/10 text-sm text-[#F5F0E8] placeholder-white/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowShipModal(false)}
                className="flex-1 py-3 rounded-2xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus("Shipped", shipTrackingInput)}
                className="flex-1 py-3 rounded-2xl text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#E5C158] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-black" />}
                <span>Confirm Shipment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] rounded-3xl max-w-sm w-full p-6 border border-white/10 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Ban className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-[#F5F0E8]">
                Cancel Order #{order.display_id || order.id.slice(-6)}?
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                Are you sure you want to cancel this order? This will mark the order as Cancelled in the management system.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[#F5F0E8] bg-white/5 hover:bg-white/10 transition-colors"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus("Cancelled")}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Cancel Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
