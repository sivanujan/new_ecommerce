import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="w-full flex flex-col font-sans text-left">
      <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/10">
        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E5C378]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wider">
          Client Concierge & Support
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed">
          Need assistance with your handcrafted pieces or shipment? Our concierge team is available to ensure your experience remains exquisite.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <LocalizedClientLink
            href="/contact"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#E5C378]/50 text-xs font-semibold text-neutral-200 hover:text-[#E5C378] transition-all flex items-center gap-1.5"
          >
            <span>Contact Concierge</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/contact"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#E5C378]/50 text-xs font-semibold text-neutral-200 hover:text-[#E5C378] transition-all flex items-center gap-1.5"
          >
            <span>Returns & Exchanges</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default Help
