"use client"

import { transferCart } from "@lib/data/customer"
import { ExclamationCircleSolid } from "@medusajs/icons"
import { StoreCart, StoreCustomer } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useState, useEffect } from "react"

function CartMismatchBanner(props: {
  customer: StoreCustomer
  cart: StoreCart
}) {
  const { customer, cart } = props
  const [isPending, setIsPending] = useState(false)
  const [actionText, setActionText] = useState("Run transfer again")
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("dismiss_cart_mismatch") === "true"
      if (isDismissed) {
        setDismissed(true)
      }
    }
  }, [])

  // If no customer, or cart already owned by this customer, or cart empty, or user dismissed: hide banner
  if (
    !customer ||
    !cart ||
    dismissed ||
    cart.customer_id === customer.id ||
    !cart.items?.length
  ) {
    return null
  }

  const handleSubmit = async () => {
    try {
      setIsPending(true)
      setActionText("Transferring...")

      await transferCart()
      setDismissed(true)
      sessionStorage.setItem("dismiss_cart_mismatch", "true")
    } catch {
      setActionText("Retry")
      setIsPending(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem("dismiss_cart_mismatch", "true")
  }

  return (
    <div className="relative flex items-center justify-center p-3 sm:p-4 text-center bg-amber-500/15 border-b border-amber-500/30 text-xs sm:text-sm text-amber-200 backdrop-blur-md z-50">
      <div className="flex flex-wrap items-center justify-center gap-2 pr-6">
        <span className="inline-flex items-center gap-1.5 font-medium text-amber-100">
          <ExclamationCircleSolid className="inline text-amber-400 w-4 h-4 flex-shrink-0" />
          A guest cart was found. Link it to your account?
        </span>

        <span>·</span>

        <Button
          variant="transparent"
          className="underline hover:text-white font-semibold text-amber-300 p-0 bg-transparent text-xs sm:text-sm cursor-pointer disabled:opacity-50"
          size="base"
          disabled={isPending}
          onClick={handleSubmit}
        >
          {actionText}
        </Button>
      </div>

      <button
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-amber-300/70 hover:text-amber-100 p-1 text-sm font-bold transition-colors cursor-pointer"
      >
        ✕
      </button>
    </div>
  )
}

export default CartMismatchBanner
