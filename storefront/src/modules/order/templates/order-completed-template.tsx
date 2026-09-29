import { cookies as nextCookies } from "next/headers"
import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { retrieveCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { formatOrderNumber } from "@lib/util/format-order-number"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"
  const customer = await retrieveCustomer().catch(() => null)

  const orderDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })

  const formatStatus = (str?: string | null) => {
    if (!str) return "Pending"
    const formatted = str.split("_").join(" ")
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="bg-[#0B0B0C] min-h-[calc(100vh-64px)] py-8 sm:py-14 text-neutral-100 font-sans">
      <div
        className="content-container max-w-4xl mx-auto px-4 sm:px-6 flex flex-col gap-y-8"
        data-testid="order-complete-container"
      >
        {isOnboarding && <OnboardingCta orderId={order.id} />}

        {/* ============================================================ */}
        {/* CONFIRMATION HERO */}
        {/* ============================================================ */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#18181D] via-[#121215] to-[#0E0E10] border border-white/10 p-6 sm:p-10 text-center shadow-2xl">
          {/* Subtle gold ambient glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#E5C378]/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Success Emblem */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#F3D798]/20 via-[#E5C378]/10 to-transparent border border-[#E5C378]/40 shadow-[0_0_35px_rgba(229,195,120,0.25)] flex items-center justify-center text-[#E5C378] mb-4">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-px bg-[#E5C378]/60" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-mono font-semibold text-[#E5C378]">
                Order Confirmed • Wear Your Roots
              </span>
              <span className="w-5 h-px bg-[#E5C378]/60" />
            </div>

            {/* Bold Serif Heading */}
            <h1 className="font-display font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#FDFBF7] tracking-tight">
              Thank You!
            </h1>
            <p className="font-serif text-base sm:text-xl text-[#E5C378] font-medium tracking-wide mt-1.5">
              Your order was placed successfully.
            </p>

            {/* Confirmation Email Line */}
            <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mt-3 leading-relaxed">
              We have dispatched your receipt and order summary to{" "}
              <span
                className="text-white font-bold underline underline-offset-4 decoration-[#E5C378]/50"
                data-testid="order-email"
              >
                {order.email}
              </span>
              . We will notify you when your pieces are packed and on their way.
            </p>

            {/* Order Meta Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 py-3 px-5 sm:px-8 rounded-2xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 uppercase tracking-wider font-mono text-[11px]">
                  Order Number:
                </span>
                <span
                  className="font-mono font-bold text-[#E5C378] text-sm sm:text-base tracking-wide"
                  data-testid="order-id"
                >
                  {formatOrderNumber(order)}
                </span>
              </div>

              <span className="text-white/20 hidden sm:inline">•</span>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400 uppercase tracking-wider font-mono text-[11px]">
                  Date:
                </span>
                <span className="text-neutral-200 font-medium" data-testid="order-date">
                  {orderDate}
                </span>
              </div>

              <span className="text-white/20 hidden sm:inline">•</span>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400 uppercase tracking-wider font-mono text-[11px]">
                  Status:
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold">
                  {formatStatus(order.status || "confirmed")}
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-7 w-full sm:w-auto">
              <LocalizedClientLink
                href="/store"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 font-bold text-xs uppercase tracking-[0.16em] shadow-[0_4px_25px_rgba(229,195,120,0.3)] hover:shadow-[0_6px_30px_rgba(229,195,120,0.45)] hover:brightness-105 active:scale-[0.99] transition-all"
              >
                <span>Continue Shopping</span>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </LocalizedClientLink>

              {customer ? (
                <LocalizedClientLink
                  href="/account/orders"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <span>View in Account</span>
                </LocalizedClientLink>
              ) : (
                <LocalizedClientLink
                  href="/account"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <span>Create Account / Sign In</span>
                </LocalizedClientLink>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ORDER SUMMARY (ITEMS + TOTALS) */}
        {/* ============================================================ */}
        <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C378]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wider">
                Summary of Pieces
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {order.items?.length || 0} {order.items?.length === 1 ? "piece" : "pieces"}
            </span>
          </div>

          <div className="mb-6">
            <Items order={order} />
          </div>

          <div className="pt-2 border-t border-white/10">
            <CartTotals totals={order} />
          </div>
        </div>

        {/* ============================================================ */}
        {/* DELIVERY & PAYMENT DETAILS */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <ShippingDetails order={order} />
          </div>

          <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <PaymentDetails order={order} />
          </div>
        </div>

        {/* ============================================================ */}
        {/* CLIENT CONCIERGE & SUPPORT */}
        {/* ============================================================ */}
        <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <Help />
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-neutral-400">
          <p>
            Questions regarding this order? Quote reference{" "}
            <span className="text-[#E5C378] font-mono font-bold">{formatOrderNumber(order)}</span>
          </p>
          <LocalizedClientLink
            href="/store"
            className="text-[#E5C378] hover:text-[#F3D798] font-semibold underline underline-offset-4 flex items-center gap-1 transition-colors"
          >
            <span>Explore more heritage pieces</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
