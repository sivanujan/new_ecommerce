import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const profileCompletion = getProfileCompletion(customer)
  const addressCount = customer?.addresses?.length || 0
  const orderCount = orders?.length || 0

  return (
    <div className="w-full flex flex-col gap-y-8 font-sans" data-testid="overview-page-wrapper">
      {/* ============================================================ */}
      {/* WELCOME HERO */}
      {/* ============================================================ */}
      <div className="rounded-3xl bg-gradient-to-b from-[#18181D] via-[#121215] to-[#0E0E10] border border-white/10 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 right-0 w-64 h-64 rounded-full bg-[#E5C378]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-px bg-[#E5C378]/60" />
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#E5C378]">
                Atelier Client Portal
              </span>
            </div>
            <h1
              className="font-display font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FDFBF7] tracking-tight"
              data-testid="welcome-message"
              data-value={customer?.first_name}
            >
              Hello, {customer?.first_name || "Valued Client"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1">
              Welcome back to your personal sanctuary of heritage jewellery.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 self-start sm:self-auto shrink-0">
            <span className="text-neutral-400">Account: </span>
            <span
              className="text-white font-semibold"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SUMMARY STAT CARDS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Profile Completion */}
        <div className="rounded-2xl bg-[#121215] border border-white/10 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-mono text-neutral-400">
              Profile
            </span>
            <span className="w-2 h-2 rounded-full bg-[#E5C378]" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span
              className="font-display text-3xl font-black text-[#E5C378]"
              data-testid="customer-profile-completion"
              data-value={profileCompletion}
            >
              {profileCompletion}%
            </span>
            <span className="text-xs uppercase tracking-wider font-mono text-neutral-400">
              Completed
            </span>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="rounded-2xl bg-[#121215] border border-white/10 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-mono text-neutral-400">
              Addresses
            </span>
            <span className="w-2 h-2 rounded-full bg-[#E5C378]" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span
              className="font-display text-3xl font-black text-white"
              data-testid="addresses-count"
              data-value={addressCount}
            >
              {addressCount}
            </span>
            <span className="text-xs uppercase tracking-wider font-mono text-neutral-400">
              Saved
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl bg-[#121215] border border-white/10 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-mono text-neutral-400">
              Orders
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-black text-white">
              {orderCount}
            </span>
            <span className="text-xs uppercase tracking-wider font-mono text-neutral-400">
              Total Placed
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RECENT ORDERS */}
      {/* ============================================================ */}
      <div className="rounded-3xl bg-[#121215] border border-white/10 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C378]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wider">
              Recent Orders
            </h2>
          </div>

          {orders && orders.length > 0 && (
            <LocalizedClientLink
              href="/account/orders"
              className="text-xs font-semibold text-[#E5C378] hover:text-[#F3D798] transition-colors"
            >
              View all orders &rarr;
            </LocalizedClientLink>
          )}
        </div>

        <ul className="flex flex-col gap-y-3" data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => {
              return (
                <li
                  key={order.id}
                  data-testid="order-wrapper"
                  data-value={order.id}
                >
                  <LocalizedClientLink
                    href={`/account/orders/details/${order.id}`}
                    className="block group"
                  >
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#E5C378]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 flex-1 text-xs sm:text-sm">
                        <div className="flex flex-col">
                          <span className="text-[11px] uppercase tracking-wider font-mono text-neutral-400">
                            Order Number
                          </span>
                          <span
                            className="font-mono font-bold text-[#E5C378] text-sm sm:text-base mt-0.5"
                            data-testid="order-id"
                            data-value={order.display_id}
                          >
                            #{order.display_id}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[11px] uppercase tracking-wider font-mono text-neutral-400">
                            Date Placed
                          </span>
                          <span
                            className="text-neutral-200 font-medium mt-0.5"
                            data-testid="order-created-date"
                          >
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex flex-col col-span-2 sm:col-span-1">
                          <span className="text-[11px] uppercase tracking-wider font-mono text-neutral-400">
                            Total
                          </span>
                          <span
                            className="font-display font-bold text-[#E5C378] text-sm sm:text-base mt-0.5"
                            data-testid="order-amount"
                          >
                            {convertToLocale({
                              amount: order.total,
                              currency_code: order.currency_code,
                            })}
                          </span>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-1 text-xs font-semibold text-neutral-400 group-hover:text-[#E5C378] transition-colors self-end sm:self-auto"
                        data-testid="open-order-button"
                      >
                        <span className="hidden sm:inline">View Details</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </LocalizedClientLink>
                </li>
              )
            })
          ) : (
            <div
              className="py-12 text-center flex flex-col items-center justify-center gap-3"
              data-testid="no-orders-message"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mb-1">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="font-display text-base font-bold text-white">No recent orders yet</p>
              <p className="text-xs text-neutral-400 max-w-xs">
                Your acquired heritage pieces and bespoke orders will appear here.
              </p>
              <LocalizedClientLink
                href="/store"
                className="mt-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F3D798] via-[#E5C378] to-[#C99C47] text-neutral-950 text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all"
              >
                Explore Collection
              </LocalizedClientLink>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0
  if (!customer) return 0
  if (customer.email) count++
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++
  const billingAddress = customer.addresses?.find((addr) => addr.is_default_billing)
  if (billingAddress) count++
  return (count / 4) * 100
}

export default Overview
