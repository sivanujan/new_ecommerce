"use client"

import { useState } from "react"
import { faqData } from "@modules/faq/faq-data"

// Data + types now live in "@modules/faq/faq-data" (a non-client module) so the
// server FAQ page can import `faqData` for JSON-LD. Import `faqData` from there,
// NOT from this client component. Types are re-exported for convenience only.
export type { FAQItem, FAQCategory } from "@modules/faq/faq-data"

export default function FAQAccordion() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "delivery-time": true,
    "what-is-316l": true,
  })

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="space-y-12 sm:space-y-16">
      {faqData.map((category) => (
        <section key={category.id} aria-labelledby={`cat-${category.id}`} className="scroll-mt-32">
          {/* Category Heading Header */}
          <div className="mb-5 sm:mb-6 border-b border-white/10 pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h2
              id={`cat-${category.id}`}
              className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wider flex items-center gap-2.5"
            >
              <span className="w-1.5 h-4 rounded-full bg-[#E5C378]" />
              <span>{category.title}</span>
            </h2>
            {category.description && (
              <span className="text-xs text-neutral-400 font-sans">
                {category.description}
              </span>
            )}
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {category.items.map((item) => {
              const isOpen = !!openItems[item.id]
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-[#141418] border-[#E5C378]/30 shadow-lg"
                      : "bg-[#121215]/80 border-white/10 hover:border-white/20 hover:bg-[#141418]/60"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    id={`faq-question-${item.id}`}
                    className="w-full px-5 py-4 sm:py-4.5 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C378]"
                  >
                    <span
                      className={`text-sm sm:text-base font-medium tracking-wide transition-colors ${
                        isOpen ? "text-[#E5C378]" : "text-[#FDFBF7]"
                      }`}
                    >
                      {item.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 ${
                        isOpen
                          ? "border-[#E5C378] bg-[#E5C378]/15 text-[#E5C378] rotate-180"
                          : "border-white/15 bg-white/5 text-neutral-400"
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${item.id}`}
                      className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans border-t border-white/5"
                    >
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
