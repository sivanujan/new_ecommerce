"use client"

import React, { useState } from "react"
import { Tag, Check, Trash2, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [codeValue, setCodeValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const { promotions = [] } = cart

  const removePromotionCode = async (code: string) => {
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")
    try {
      const validPromotions = promotions.filter(
        (promotion) => promotion.code !== code
      )
      await applyPromotions(
        validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
      )
      setSuccessMessage(`Promo code "${code}" removed.`)
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to remove promo code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = async (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    const codeToApply = (customCode || codeValue).trim().toUpperCase()
    if (!codeToApply) {
      setErrorMessage("Please enter a promo code.")
      return
    }

    // Check if already applied
    if (promotions.some((p) => p.code?.toUpperCase() === codeToApply)) {
      setErrorMessage(`Code "${codeToApply}" is already applied.`)
      return
    }

    setIsLoading(true)
    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(codeToApply)

    try {
      await applyPromotions(codes)
      setSuccessMessage(`Promo code "${codeToApply}" applied successfully!`)
      setCodeValue("")
    } catch (e: any) {
      setErrorMessage(e.message || "Invalid promo code. Please check and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full bg-[#121215]/80 border border-white/10 rounded-2xl p-4 sm:p-5 my-2 font-sans transition-all shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
            <Tag className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F5F0E8]">
            Promo Code
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-[11px] text-[#D4AF37] hover:text-[#E5C158] font-medium transition-colors"
        >
          {isOpen ? "Hide" : "+ Enter Code"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3.5 space-y-3">
          <form onSubmit={handleApply} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value.toUpperCase())}
                placeholder="e.g. TAMZEN10"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0D12] border border-white/15 text-xs font-mono tracking-wider text-[#F5F0E8] placeholder-neutral-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all uppercase"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !codeValue.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold text-xs transition-all shadow-md shadow-[#D4AF37]/20 flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-black" />
              ) : (
                <span>Apply</span>
              )}
            </button>
          </form>

          {/* Quick chip suggestion if TAMZEN10 not applied yet */}
          {!promotions.some((p) => p.code === "TAMZEN10") && (
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
              <span className="text-neutral-500">Hint:</span>
              <button
                type="button"
                onClick={() => handleApply(undefined, "TAMZEN10")}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[10px] font-semibold transition-colors"
              >
                <Sparkles className="h-2.5 w-2.5" />
                <span>Try "TAMZEN10" for 10% off</span>
              </button>
            </div>
          )}

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/30 border border-rose-500/20 px-3 py-2 rounded-xl">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-3 py-2 rounded-xl">
              <Check className="h-3.5 w-3.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Applied Promotions List */}
      {promotions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37]">
            Active Discount Applied:
          </div>
          {promotions.map((p) => {
            const isPercent = p.application_method?.type === "percentage"
            const discountLabel = isPercent
              ? `${p.application_method?.value}% OFF`
              : p.application_method?.value !== undefined && p.application_method?.currency_code
              ? convertToLocale({
                  amount: +p.application_method.value,
                  currency_code: p.application_method.currency_code,
                }) + " OFF"
              : "APPLIED"

            return (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
                    {p.code}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">
                    ({discountLabel})
                  </span>
                </div>

                {!p.is_automatic && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => p.code && removePromotionCode(p.code)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove code"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DiscountCode
