import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import MobileOrderSummary from "@modules/checkout/components/mobile-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout | TamZen Atelier",
  description: "Complete your secure order with TamZen Atelier Paris.",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="content-container py-8 sm:py-12">
      {/* Top Header & Context */}
      <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#E5C378] mb-1.5 font-medium">
          <span>Paris Atelier</span>
          <span>•</span>
          <span>Encrypted Checkout</span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
          Secure Checkout
        </h1>
      </div>

      {/* Mobile Collapsible Summary Bar */}
      <MobileOrderSummary cart={cart} />

      {/* Two Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-14 items-start">
        {/* Left: Steps & Forms */}
        <div className="w-full">
          <PaymentWrapper cart={cart}>
            <CheckoutForm cart={cart} customer={customer} />
          </PaymentWrapper>
        </div>

        {/* Right: Desktop Sticky Summary Card */}
        <div className="hidden lg:block w-full">
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
