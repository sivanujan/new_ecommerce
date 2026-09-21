"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"
import { useToggleState } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const stepParam = searchParams.get("step")
  const isAddressComplete = !!(cart?.shipping_address?.address_1 && cart?.email)
  const isOpen = stepParam === "address" || (!stepParam && !isAddressComplete)

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address", { scroll: false })
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "bg-[#121215] border-[#E5C378]/30 shadow-2xl p-6 sm:p-8"
          : "bg-[#121215]/80 border-white/10 p-5 sm:p-6"
      }`}
    >
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* Step Number or Completed Check */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
              !isOpen && isAddressComplete
                ? "bg-[#E5C378] text-neutral-950 shadow-[0_0_15px_rgba(229,195,120,0.3)]"
                : isOpen
                ? "border-2 border-[#E5C378] text-[#E5C378] bg-[#E5C378]/10 shadow-[0_0_15px_rgba(229,195,120,0.2)]"
                : "border border-white/20 text-neutral-400 bg-white/[0.02]"
            }`}
          >
            {!isOpen && isAddressComplete ? (
              <svg className="w-4 h-4 text-neutral-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              "01"
            )}
          </div>

          <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-wider">
            Shipping Address
          </h2>
        </div>

        {/* Edit Button when Collapsed */}
        {!isOpen && isAddressComplete && (
          <button
            onClick={handleEdit}
            className="text-xs uppercase tracking-wider font-semibold text-[#E5C378] hover:text-white border border-[#E5C378]/30 hover:border-[#E5C378] hover:bg-[#E5C378]/10 px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
            data-testid="edit-address-button"
          >
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Form when Active */}
      {isOpen ? (
        <form action={formAction} className="pt-6 sm:pt-8">
          <ShippingAddress
            customer={customer}
            checked={sameAsBilling}
            onChange={toggleSameAsBilling}
            cart={cart}
          />

          {!sameAsBilling && (
            <div className="pt-8 border-t border-white/10 mt-8">
              <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-wide mb-6">
                Billing Address
              </h3>
              <BillingAddress cart={cart} />
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <SubmitButton data-testid="submit-address-button">
              Continue to delivery
            </SubmitButton>
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-sans">
              <svg className="w-4 h-4 text-[#E5C378]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Address securely processed</span>
            </div>
          </div>
          <ErrorMessage error={message} data-testid="address-error-message" />
        </form>
      ) : (
        /* Summary when Collapsed */
        <div className="pt-4 text-xs sm:text-sm font-sans">
          {cart && cart.shipping_address ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-white/5">
              {/* Shipping Address */}
              <div data-testid="shipping-address-summary" className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
                  Delivering to
                </span>
                <span className="font-medium text-white">
                  {cart.shipping_address.first_name} {cart.shipping_address.last_name}
                </span>
                <span className="text-neutral-300">
                  {cart.shipping_address.address_1}{" "}
                  {cart.shipping_address.address_2}
                </span>
                <span className="text-neutral-400">
                  {cart.shipping_address.postal_code}, {cart.shipping_address.city}
                </span>
                <span className="text-neutral-400">
                  {cart.shipping_address.country_code?.toUpperCase()}
                </span>
              </div>

              {/* Contact Info */}
              <div data-testid="shipping-contact-summary" className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
                  Contact
                </span>
                <span className="text-neutral-300">
                  {cart.email}
                </span>
                <span className="text-neutral-400">
                  {cart.shipping_address.phone || "No phone provided"}
                </span>
              </div>

              {/* Billing Address */}
              <div data-testid="billing-address-summary" className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 font-mono">
                  Billing
                </span>
                {sameAsBilling ? (
                  <span className="text-neutral-400 italic">
                    Same as delivery address
                  </span>
                ) : (
                  <>
                    <span className="font-medium text-white">
                      {cart.billing_address?.first_name} {cart.billing_address?.last_name}
                    </span>
                    <span className="text-neutral-300">
                      {cart.billing_address?.address_1}
                    </span>
                    <span className="text-neutral-400">
                      {cart.billing_address?.postal_code}, {cart.billing_address?.city}
                    </span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="py-2 text-neutral-400 flex items-center gap-2">
              <Spinner className="w-4 h-4 animate-spin text-[#E5C378]" />
              <span>Loading address details...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Addresses
