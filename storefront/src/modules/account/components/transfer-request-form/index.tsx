"use client"

import { useActionState } from "react"
import { createTransferRequest } from "@lib/data/orders"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { CheckCircleMiniSolid, XCircleSolid } from "@medusajs/icons"
import { useEffect, useState } from "react"

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  return (
    <div className="rounded-2xl bg-[#121215] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col gap-y-4 w-full font-sans">
      <div className="grid sm:grid-cols-2 items-center gap-x-8 gap-y-4 w-full">
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-px bg-[#E5C378]/60" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#E5C378]">
              Link Previous Orders
            </span>
          </div>
          <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-wider">
            Order Transfers
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Placed an order as a guest before creating an account? Connect it directly to your profile.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-y-2 w-full sm:items-end">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <input
              className="w-full h-11 px-4 rounded-xl bg-[#121215] text-[#FDFBF7] border border-white/15 text-xs sm:text-sm placeholder:text-neutral-500 focus:outline-none focus:bg-[#151519] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378]/40 hover:border-white/30 transition-all font-mono"
              name="order_id"
              placeholder="Enter Order ID (e.g. order_01...)"
              required
            />
            <SubmitButton
              variant="secondary"
              className="!w-full sm:!w-auto !py-2.5 whitespace-nowrap shrink-0"
            >
              Transfer
            </SubmitButton>
          </div>
        </form>
      </div>

      {!state.success && state.error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
          {state.error}
        </div>
      )}

      {showSuccess && (
        <div className="flex justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 w-full items-center">
          <div className="flex gap-x-2.5 items-center">
            <CheckCircleMiniSolid className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col gap-y-0.5 text-xs">
              <span className="font-semibold text-white">
                Transfer request submitted for order {state.order?.id}
              </span>
              <span className="text-neutral-300">
                Confirmation email sent to {state.order?.email}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className="text-neutral-400 hover:text-white p-1"
          >
            <XCircleSolid className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
