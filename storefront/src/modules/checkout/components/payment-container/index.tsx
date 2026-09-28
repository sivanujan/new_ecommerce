import { Radio as RadioGroupOption } from "@headlessui/react"
import React, { useContext, useMemo, type JSX } from "react"

import { isManual } from "@lib/constants"
import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import PaymentTest from "../payment-test"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"
  const isSelected = selectedPaymentOptionId === paymentProviderId

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={`flex flex-col gap-y-2 p-4 sm:p-5 rounded-xl border transition-all cursor-pointer mb-3 ${
        isSelected
          ? "border-[#E5C378] bg-[#E5C378]/[0.08] shadow-[0_0_20px_rgba(229,195,120,0.1)]"
          : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Custom Gold Radio Bullet */}
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
              isSelected
                ? "border-[#E5C378] bg-transparent"
                : "border-white/30 bg-white/5"
            }`}
          >
            {isSelected && (
              <div className="w-2.5 h-2.5 rounded-full bg-[#E5C378]" />
            )}
          </div>

          <span className="font-medium text-sm sm:text-base text-white">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </span>
          {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className="hidden small:block" />
          )}
        </div>
        <span className="justify-self-end text-neutral-300">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px]" />
      )}
      {children}
    </RadioGroupOption>
  )
}

export default PaymentContainer

export const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setCardBrand,
  setError,
  setCardComplete,
}: Omit<PaymentContainerProps, "children"> & {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#FFFFFF",
          fontSize: "14px",
          "::placeholder": {
            color: "rgba(255, 255, 255, 0.4)",
          },
        },
      },
      classes: {
        base: "pt-3.5 pb-2.5 block w-full h-11 px-4 mt-0 bg-neutral-900 border border-white/15 rounded-xl appearance-none focus:outline-none focus:border-[#E5C378] transition-all duration-300",
      },
    }
  }, [])

  const isKeyConfigured = Boolean(
    process.env.NEXT_PUBLIC_STRIPE_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_KEY.startsWith("pk_") &&
      !process.env.NEXT_PUBLIC_STRIPE_KEY.includes("placeholder")
  )

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="my-4 pt-2 border-t border-white/10 transition-all duration-150 ease-in-out">
            <span className="text-xs uppercase tracking-wider font-mono text-neutral-300 mb-2 block">
              Enter your card details:
            </span>
            <CardElement
              options={useOptions as StripeCardElementOptions}
              onChange={(e) => {
                setCardBrand(
                  e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                )
                setError(e.error?.message || null)
                setCardComplete(e.complete)
              }}
            />
          </div>
        ) : !isKeyConfigured ? (
          <div className="my-3 p-3.5 rounded-lg bg-[#E5C378]/10 border border-[#E5C378]/25 text-neutral-300 text-xs leading-relaxed">
            <span className="font-semibold text-[#E5C378] block mb-1">
              Stripe API Key Setup Required
            </span>
            Set your Stripe Publishable Key (<code>NEXT_PUBLIC_STRIPE_KEY=pk_test_...</code>) in{" "}
            <code className="text-white">storefront/.env.local</code> and Secret Key (<code>STRIPE_API_KEY=sk_test_...</code>) in{" "}
            <code className="text-white">medusa/apps/backend/.env</code> to accept real or test credit card payments.
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}
