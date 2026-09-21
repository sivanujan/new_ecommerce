import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div
      className="bg-[#0B0B0C] min-h-[calc(100vh-64px)] py-8 sm:py-14 text-neutral-100 font-sans"
      data-testid="account-page"
    >
      <div className="content-container max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-y-10">
        {customer ? (
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
            <aside className="w-full lg:sticky lg:top-24">
              <AccountNav customer={customer} />
            </aside>
            <main className="flex-1 min-w-0 w-full">{children}</main>
          </div>
        ) : (
          <main className="w-full flex justify-center">{children}</main>
        )}

        {/* Client Concierge / Questions Banner */}
        <div className="rounded-2xl bg-[#121215] border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C378] shrink-0 mt-0.5">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-wider">
                Client Concierge & Inquiries
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl leading-relaxed">
                Have questions about your order, bespoke pieces, or care instructions? Our client advisors are available to assist you.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <LocalizedClientLink
              href="/contact"
              className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#E5C378]/50 text-xs font-semibold text-neutral-200 hover:text-[#E5C378] transition-all flex items-center gap-2"
            >
              <span>Contact Concierge</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
